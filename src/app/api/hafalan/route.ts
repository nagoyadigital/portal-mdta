import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET - List hafalan progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const type = searchParams.get("type"); // quran, doa, hadith

    const where = {
      ...(studentId && { studentId }),
      ...(type && { type }),
    };

    const hafalans = await prisma.hafalan.findMany({
      where,
      include: { student: { select: { name: true, nis: true, class: { select: { name: true } } } } },
      orderBy: { date: "desc" },
    });

    // Stats per student
    const students = await prisma.student.findMany({
      where: { status: "aktif" },
      include: {
        hafalans: true,
        class: { select: { name: true } },
      },
    });

    const progress = students.map((s) => {
      const total = s.hafalans.length;
      const done = s.hafalans.filter((h) => h.status === "selesai").length;
      const lastHafalan = s.hafalans.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      )[0];
      return {
        studentId: s.id,
        name: s.name,
        kelas: s.class?.name || "-",
        total,
        done,
        progress: total > 0 ? Math.round((done / total) * 100) : 0,
        lastTitle: lastHafalan?.title || "-",
      };
    });

    return NextResponse.json({ hafalans, progress });
  } catch (error) {
    console.error("Hafalan GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Add hafalan record
const hafalanSchema = z.object({
  studentId: z.string(),
  type: z.enum(["quran", "doa", "hadith"]),
  title: z.string().min(1),
  juz: z.number().optional(),
  status: z.enum(["proses", "selesai"]).default("proses"),
  grade: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = hafalanSchema.parse(body);

    const hafalan = await prisma.hafalan.create({
      data,
      include: { student: { select: { name: true } } },
    });

    return NextResponse.json(hafalan, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Hafalan POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

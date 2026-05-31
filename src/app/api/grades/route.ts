import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET - List grades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const subjectId = searchParams.get("subjectId");
    const semester = searchParams.get("semester");

    const where = {
      ...(studentId && { studentId }),
      ...(subjectId && { subjectId }),
      ...(semester && { semester: parseInt(semester) }),
    };

    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: { select: { name: true, nis: true } },
        subject: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    // Subject averages
    const subjects = await prisma.subject.findMany();
    const subjectAverages = await Promise.all(
      subjects.map(async (subject) => {
        const avg = await prisma.grade.aggregate({
          where: { subjectId: subject.id },
          _avg: { score: true },
          _count: true,
        });
        return {
          subjectId: subject.id,
          name: subject.name,
          average: Math.round(avg._avg.score || 0),
          count: avg._count,
        };
      })
    );

    return NextResponse.json({ grades, subjectAverages });
  } catch (error) {
    console.error("Grades GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Input grade
const gradeSchema = z.object({
  studentId: z.string(),
  subjectId: z.string(),
  type: z.enum(["harian", "uts", "uas"]),
  semester: z.number().min(1).max(2),
  year: z.string(),
  score: z.number().min(0).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = gradeSchema.parse(body);

    const grade = await prisma.grade.create({
      data,
      include: {
        student: { select: { name: true } },
        subject: { select: { name: true } },
      },
    });

    return NextResponse.json(grade, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Grade POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

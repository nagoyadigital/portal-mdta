import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET - List students with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const classId = searchParams.get("classId");
    const status = searchParams.get("status") || "aktif";

    const students = await prisma.student.findMany({
      where: {
        status,
        ...(classId && { classId }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { nis: { contains: search } },
          ],
        }),
      },
      include: {
        class: { select: { name: true } },
        parent: { include: { user: { select: { name: true, phone: true } } } },
      },
      orderBy: { name: "asc" },
    });

    const total = await prisma.student.count({ where: { status: "aktif" } });
    const maleCount = await prisma.student.count({
      where: { status: "aktif", gender: "L" },
    });
    const femaleCount = await prisma.student.count({
      where: { status: "aktif", gender: "P" },
    });

    return NextResponse.json({
      students,
      stats: { total, male: maleCount, female: femaleCount },
    });
  } catch (error) {
    console.error("Students API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create student
const createStudentSchema = z.object({
  nis: z.string().min(1),
  name: z.string().min(1),
  gender: z.enum(["L", "P"]),
  classId: z.string().optional(),
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  address: z.string().optional(),
  parentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createStudentSchema.parse(body);

    const student = await prisma.student.create({
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
      include: { class: { select: { name: true } } },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Create student error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

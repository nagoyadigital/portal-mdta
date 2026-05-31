import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Single student detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        parent: { include: { user: { select: { name: true, phone: true, email: true } } } },
        hafalans: { orderBy: { date: "desc" } },
        grades: { orderBy: { date: "desc" }, take: 10, include: { subject: true } },
        payments: { orderBy: { createdAt: "desc" }, take: 5 },
        attendances: { orderBy: { date: "desc" }, take: 30 },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Student detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...body,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      },
      include: { class: { select: { name: true } } },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Remove student (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.student.update({
      where: { id },
      data: { status: "keluar" },
    });

    return NextResponse.json({ message: "Student removed" });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

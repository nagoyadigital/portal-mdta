import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST - Record attendance via QR scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, nis } = body;

    if (!studentId && !nis) {
      return NextResponse.json(
        { error: "studentId or nis is required" },
        { status: 400 }
      );
    }

    // Find student
    const student = await prisma.student.findFirst({
      where: studentId ? { id: studentId } : { nis },
      include: { class: { select: { name: true } } },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Santri tidak ditemukan", success: false },
        { status: 404 }
      );
    }

    if (student.status !== "aktif") {
      return NextResponse.json(
        { error: "Santri tidak aktif", success: false },
        { status: 400 }
      );
    }

    // Record attendance for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.studentAttendance.findUnique({
      where: { studentId_date: { studentId: student.id, date: today } },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Sudah tercatat hadir hari ini",
        student: {
          id: student.id,
          name: student.name,
          nis: student.nis,
          class: student.class?.name || "-",
        },
        attendance: existing,
        alreadyRecorded: true,
      });
    }

    const attendance = await prisma.studentAttendance.create({
      data: {
        studentId: student.id,
        date: today,
        status: "hadir",
        note: "Scan QR",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Absensi berhasil dicatat",
      student: {
        id: student.id,
        name: student.name,
        nis: student.nis,
        class: student.class?.name || "-",
      },
      attendance,
      alreadyRecorded: false,
    });
  } catch (error) {
    console.error("Scan attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

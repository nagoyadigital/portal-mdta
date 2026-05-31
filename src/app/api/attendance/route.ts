import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET - Get attendance for a class on a date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!classId) {
      return NextResponse.json({ error: "classId is required" }, { status: 400 });
    }

    const students = await prisma.student.findMany({
      where: { classId, status: "aktif" },
      include: {
        attendances: {
          where: { date: new Date(date) },
        },
      },
      orderBy: { name: "asc" },
    });

    const result = students.map((s) => ({
      id: s.id,
      nis: s.nis,
      name: s.name,
      status: s.attendances[0]?.status || null,
    }));

    return NextResponse.json({ students: result, date, classId });
  } catch (error) {
    console.error("Attendance GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Submit attendance
const attendanceSchema = z.object({
  date: z.string(),
  classId: z.string(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["hadir", "sakit", "izin", "alpha"]),
      note: z.string().optional(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = attendanceSchema.parse(body);
    const date = new Date(data.date);

    // Upsert each attendance record
    const results = await Promise.all(
      data.records.map((record) =>
        prisma.studentAttendance.upsert({
          where: {
            studentId_date: { studentId: record.studentId, date },
          },
          update: { status: record.status, note: record.note },
          create: {
            studentId: record.studentId,
            date,
            status: record.status,
            note: record.note,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Attendance submitted",
      count: results.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Attendance POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

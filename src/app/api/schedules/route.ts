import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get("day");
    const classId = searchParams.get("classId");
    const teacherId = searchParams.get("teacherId");

    const where = {
      ...(day && { day: parseInt(day) }),
      ...(classId && { classId }),
      ...(teacherId && { teacherId }),
    };

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        subject: { select: { name: true } },
        teacher: { include: { user: { select: { name: true } } } },
        class: { select: { name: true } },
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Schedules GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

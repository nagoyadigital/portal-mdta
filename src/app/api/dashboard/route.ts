import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      recentAnnouncements,
      recentPayments,
      todayAttendance,
    ] = await Promise.all([
      prisma.student.count({ where: { status: "aktif" } }),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.payment.findMany({
        where: { status: "lunas" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { student: { select: { name: true } } },
      }),
      prisma.studentAttendance.count({
        where: {
          date: new Date(new Date().toISOString().split("T")[0]),
          status: "hadir",
        },
      }),
    ]);

    // Finance summary
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthlyIncome = await prisma.payment.aggregate({
      where: { month: currentMonth, year: currentYear, status: "lunas" },
      _sum: { amount: true },
    });
    const monthlyPending = await prisma.payment.aggregate({
      where: { month: currentMonth, year: currentYear, status: "pending" },
      _sum: { amount: true },
    });

    return NextResponse.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        todayAttendance,
      },
      finance: {
        collected: monthlyIncome._sum.amount || 0,
        pending: monthlyPending._sum.amount || 0,
      },
      announcements: recentAnnouncements,
      recentPayments,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

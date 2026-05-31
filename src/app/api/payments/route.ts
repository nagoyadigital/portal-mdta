import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET - List payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where = {
      ...(status && { status }),
      ...(month && { month: parseInt(month) }),
      ...(year && { year: parseInt(year) }),
    };

    const payments = await prisma.payment.findMany({
      where,
      include: { student: { select: { name: true, nis: true, class: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    // Summary
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [totalCollected, totalPending, totalStudents] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: "lunas", year: currentYear, month: currentMonth },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "pending", year: currentYear, month: currentMonth },
        _sum: { amount: true },
      }),
      prisma.student.count({ where: { status: "aktif" } }),
    ]);

    const paidCount = await prisma.payment.count({
      where: { status: "lunas", year: currentYear, month: currentMonth },
    });

    return NextResponse.json({
      payments,
      summary: {
        collected: totalCollected._sum.amount || 0,
        pending: totalPending._sum.amount || 0,
        paidCount,
        totalStudents,
        pendingCount: totalStudents - paidCount,
      },
    });
  } catch (error) {
    console.error("Payments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Record payment
const paymentSchema = z.object({
  studentId: z.string(),
  type: z.enum(["spp", "infaq", "daftar_ulang", "lainnya"]),
  amount: z.number().positive(),
  month: z.number().min(1).max(12).optional(),
  year: z.number(),
  status: z.enum(["pending", "lunas"]).default("lunas"),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = paymentSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        ...data,
        paidAt: data.status === "lunas" ? new Date() : null,
      },
      include: { student: { select: { name: true } } },
    });

    // Also record in cash book if paid
    if (data.status === "lunas") {
      await prisma.cashBook.create({
        data: {
          type: "masuk",
          category: data.type,
          amount: data.amount,
          description: `Pembayaran ${data.type.toUpperCase()} - ${payment.student.name}`,
        },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Payment POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

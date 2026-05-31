import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - List all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        _count: { select: { students: true } },
      },
      orderBy: [{ level: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Classes GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

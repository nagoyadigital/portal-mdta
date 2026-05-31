import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET - List announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const announcements = await prisma.announcement.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Announcements GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create announcement
const announcementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.enum(["penting", "akademik", "acara", "keuangan"]),
  target: z.string().default("semua"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = announcementSchema.parse(body);

    const announcement = await prisma.announcement.create({ data });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Announcement POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

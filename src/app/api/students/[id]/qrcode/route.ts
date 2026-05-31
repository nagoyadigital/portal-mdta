import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";

// GET - Generate QR code for a student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      select: { id: true, nis: true, name: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // QR data contains student ID and NIS for verification
    const qrData = JSON.stringify({
      type: "MDTA_STUDENT",
      id: student.id,
      nis: student.nis,
      name: student.name,
    });

    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: "#004d27",
        light: "#ffffff",
      },
    });

    return NextResponse.json({ qrCode: qrDataUrl, student });
  } catch (error) {
    console.error("QR Code generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

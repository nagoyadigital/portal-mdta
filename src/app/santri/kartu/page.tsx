"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

interface StudentData {
  id: string;
  nis: string;
  name: string;
}

function KartuContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");
  const [qrCode, setQrCode] = useState<string>("");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);
  const [selectedId, setSelectedId] = useState(studentId || "");

  // Fetch all students for selector
  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setAllStudents(data.students || []);
        if (!selectedId && data.students?.length > 0) {
          setSelectedId(data.students[0].id);
        }
      });
  }, [selectedId]);

  // Fetch QR code for selected student
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    fetch(`/api/students/${selectedId}/qrcode`)
      .then((r) => r.json())
      .then((data) => {
        setQrCode(data.qrCode || "");
        setStudent(data.student || null);
      })
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <AppShell>
      {/* Page Title */}
      <div className="w-full mb-6 text-center">
        <h2 className="font-headline text-2xl font-semibold text-on-surface mb-2">
          Kartu Santri Digital
        </h2>
        <p className="text-sm text-on-surface-variant">
          QR Code ini digunakan untuk absensi masuk kelas
        </p>
      </div>

      {/* Student Selector */}
      <div className="mb-6 max-w-[340px] mx-auto">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
        >
          <option value="">Pilih Santri...</option>
          {allStudents.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.nis})
            </option>
          ))}
        </select>
      </div>

      {/* ID Card */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">
            progress_activity
          </span>
        </div>
      ) : student ? (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[340px] bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_20px_40px_-10px_rgba(0,77,39,0.12)] overflow-hidden border border-outline-variant">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-container/10 rounded-tr-full -ml-6 -mb-6"></div>

            {/* Card Header */}
            <div className="flex flex-col items-center mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-on-primary-container">
                  school
                </span>
              </div>
              <span className="text-xs font-semibold text-primary tracking-wider">
                MDTA HIDAYATUL MUBTADI&apos;IN
              </span>
            </div>

            {/* Student Profile */}
            <div className="flex flex-col items-center mb-4 relative z-10">
              <div className="w-20 h-20 rounded-2xl border-2 border-primary p-1 mb-3">
                <div className="w-full h-full rounded-xl bg-primary-fixed-dim flex items-center justify-center text-primary text-2xl font-bold">
                  {student.name.charAt(0)}
                </div>
              </div>
              <h3 className="font-headline text-lg font-semibold text-on-surface text-center">
                {student.name}
              </h3>
              <p className="text-sm font-semibold text-on-surface-variant">
                NIS: {student.nis}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-4 relative z-10">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-outline-variant relative">
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="QR Code Santri"
                    className="w-40 h-40"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-outline">
                      qr_code_2
                    </span>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute -top-2 -right-2 bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-on-tertiary-container rounded-full animate-pulse"></span>
                  AKTIF
                </div>
              </div>
              <p className="text-[10px] text-outline mt-2 text-center">
                Scan QR ini untuk absensi masuk kelas
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-dashed border-outline-variant flex justify-between items-end relative z-10">
              <div>
                <p className="text-[10px] uppercase text-outline font-bold">
                  Berlaku
                </p>
                <p className="text-xs font-semibold text-on-surface">
                  TA 2024/2025
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-outline font-bold">
                  ID
                </p>
                <p className="text-xs font-semibold text-on-surface">
                  #{student.nis}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-[340px] mt-6 space-y-3">
            <button
              onClick={() => {
                if (qrCode) {
                  const link = document.createElement("a");
                  link.download = `kartu-${student.nis}.png`;
                  link.href = qrCode;
                  link.click();
                }
              }}
              className="w-full bg-primary text-on-primary py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-md"
            >
              <span className="material-symbols-outlined">download</span>
              Download QR Code
            </button>
            <button
              onClick={async () => {
                if (navigator.share && qrCode) {
                  try {
                    await navigator.share({
                      title: `Kartu Santri - ${student.name}`,
                      text: `QR Code absensi untuk ${student.name} (NIS: ${student.nis})`,
                    });
                  } catch {
                    // User cancelled or share failed - ignore
                  }
                }
              }}
              className="w-full bg-surface-container text-on-surface-variant py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 border border-outline-variant"
            >
              <span className="material-symbols-outlined">share</span>
              Bagikan ke Orang Tua
            </button>
          </div>

          {/* Info */}
          <div className="w-full max-w-[340px] mt-4 flex gap-3 p-4 bg-secondary-container/20 rounded-xl border border-secondary-container/30">
            <span className="material-symbols-outlined text-secondary">
              info
            </span>
            <p className="text-xs font-medium text-on-secondary-container leading-snug">
              Kartu ini digunakan untuk absensi harian. Santri menunjukkan QR
              code saat masuk kelas untuk dicatat kehadirannya.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl">badge</span>
          <p className="mt-2 text-sm">Pilih santri untuk melihat kartu digital</p>
        </div>
      )}
    </AppShell>
  );
}

export default function KartuSantriPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">
              progress_activity
            </span>
          </div>
        </AppShell>
      }
    >
      <KartuContent />
    </Suspense>
  );
}

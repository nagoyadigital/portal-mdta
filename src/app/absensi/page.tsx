"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpha";

interface Student {
  id: string;
  nis: string;
  name: string;
  status: AttendanceStatus | null;
}

interface ClassOption {
  id: string;
  name: string;
}

const statusOptions: { value: AttendanceStatus; label: string }[] = [
  { value: "hadir", label: "Hadir" },
  { value: "sakit", label: "Sakit" },
  { value: "izin", label: "Izin" },
  { value: "alpha", label: "Alpha" },
];

export default function AbsensiPage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch classes
  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => {
        setClasses(data);
        if (data.length > 0) setSelectedClass(data[0].id);
      });
  }, []);

  // Fetch students for selected class
  const fetchStudents = useCallback(async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/attendance?classId=${selectedClass}&date=${date}`
      );
      const data = await res.json();
      setStudents(data.students || []);
      // Set existing attendance
      const existing: Record<string, AttendanceStatus> = {};
      for (const s of data.students || []) {
        existing[s.id] = s.status || "hadir";
      }
      setAttendance(existing);
    } catch {
      setStudents([]);
    }
    setLoading(false);
  }, [selectedClass, date]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const summary = Object.values(attendance).reduce(
    (acc, status) => {
      acc[status]++;
      return acc;
    },
    { hadir: 0, sakit: 0, izin: 0, alpha: 0 } as Record<AttendanceStatus, number>
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, classId: selectedClass, records }),
      });

      if (res.ok) {
        setMessage("✅ Absensi berhasil disimpan!");
      } else {
        setMessage("❌ Gagal menyimpan absensi");
      }
    } catch {
      setMessage("❌ Terjadi kesalahan");
    }
    setSubmitting(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <AppShell>
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-[28px] leading-9 font-bold text-on-surface mb-2">
              Absensi Santri
            </h2>
            <p className="text-on-surface-variant text-sm">
              Isi kehadiran santri atau scan QR.
            </p>
          </div>
          <Link
            href="/absensi/scan"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">
              qr_code_scanner
            </span>
            Scan QR
          </Link>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl card-shadow border border-outline-variant/30">
          <label className="block text-sm font-semibold text-primary mb-2">
            Pilih Kelas
          </label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 appearance-none focus:ring-2 focus:ring-primary transition-all text-on-surface text-sm"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl card-shadow border border-outline-variant/30">
          <label className="block text-sm font-semibold text-primary mb-2">
            Tanggal
          </label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface text-sm"
            type="date"
          />
        </div>
      </section>

      {/* Students List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
            Daftar Santri ({students.length} Orang)
          </h3>
          <span className="text-primary font-bold text-xs px-2 py-1 bg-primary-fixed rounded-full">
            {classes.find((c) => c.id === selectedClass)?.name || "-"}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-3xl">
              progress_activity
            </span>
            <p className="mt-2 text-sm">Memuat data...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">group_off</span>
            <p className="mt-2 text-sm">Tidak ada santri di kelas ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-surface-container-lowest p-4 rounded-xl card-shadow border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      {student.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      NIS: {student.nis}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-end">
                  <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setAttendance((prev) => ({
                            ...prev,
                            [student.id]: option.value,
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-transparent ${
                          attendance[student.id] === option.value
                            ? option.value === "hadir"
                              ? "bg-primary text-on-primary"
                              : option.value === "sakit"
                                ? "bg-secondary text-on-secondary"
                                : option.value === "izin"
                                  ? "bg-tertiary-container text-on-tertiary-container"
                                  : "bg-error text-on-error"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Summary Card */}
      {students.length > 0 && (
        <section className="mt-8 bg-primary-container text-on-primary-container p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase opacity-80">
                Ringkasan Hari Ini
              </p>
              <h4 className="font-headline text-xl font-semibold">
                {summary.hadir} Hadir, {summary.sakit} Sakit, {summary.izin}{" "}
                Izin, {summary.alpha} Alpha
              </h4>
            </div>
            <div className="h-12 w-12 rounded-full bg-on-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container">
                analytics
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Message */}
      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-surface-container-lowest px-6 py-3 rounded-xl shadow-xl border border-outline-variant z-50 text-sm font-semibold">
          {message}
        </div>
      )}

      {/* Submit Button */}
      {students.length > 0 && (
        <div className="fixed bottom-24 left-0 w-full px-4 flex justify-center pointer-events-none z-40">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="pointer-events-auto w-full max-w-md bg-primary text-on-primary font-bold py-4 px-8 rounded-full shadow-lg flex items-center justify-center gap-3 transition-transform duration-200 active:scale-95 hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? (
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined">check_circle</span>
            )}
            {submitting ? "Menyimpan..." : "Submit Absensi"}
          </button>
        </div>
      )}
    </AppShell>
  );
}

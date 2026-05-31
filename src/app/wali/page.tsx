import AppShell from "@/components/layout/AppShell";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoHafalan } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

async function getWaliData() {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    const studentHafalan = demoHafalan[0];
    const done = studentHafalan.items.filter((i) => i.status === "selesai").length;
    return {
      student: { name: "Muhammad Azka", nis: "2023008", className: "Kelas 4 - Ibnu Sina" },
      stats: { attendancePercent: 98, lastGrade: 92, lastPaymentStatus: "lunas", lastPaymentMonth: 10 },
      hafalan: { percent: Math.round((done / studentHafalan.items.length) * 100), done, total: studentHafalan.items.length, items: studentHafalan.items },
    };
  }

  const student = await prisma.student.findFirst({
    where: { parentId: { not: null } },
    include: { class: true, hafalans: { orderBy: { date: "desc" } }, attendances: { orderBy: { date: "desc" }, take: 30 }, payments: { orderBy: { createdAt: "desc" }, take: 3 }, grades: { orderBy: { date: "desc" }, take: 5, include: { subject: true } } },
  });

  if (!student) return null;

  const totalAtt = student.attendances.length;
  const hadir = student.attendances.filter((a) => a.status === "hadir").length;
  const attPercent = totalAtt > 0 ? Math.round((hadir / totalAtt) * 100) : 0;
  const lastGrade = student.grades[0];
  const lastPayment = student.payments[0];
  const hafalanDone = student.hafalans.filter((h) => h.status === "selesai").length;
  const hafalanTotal = student.hafalans.length;

  return {
    student: { name: student.name, nis: student.nis, className: student.class?.name || "-" },
    stats: { attendancePercent: attPercent, lastGrade: lastGrade?.score || 0, lastPaymentStatus: lastPayment?.status || "pending", lastPaymentMonth: lastPayment?.month || 0 },
    hafalan: { percent: hafalanTotal > 0 ? Math.round((hafalanDone / hafalanTotal) * 100) : 0, done: hafalanDone, total: hafalanTotal, items: student.hafalans.slice(0, 6).map((h) => ({ title: h.title, status: h.status })) },
  };
}

export default async function WaliSantriPage() {
  const data = await getWaliData();
  if (!data) return <AppShell><div className="text-center py-12 text-on-surface-variant"><span className="material-symbols-outlined text-4xl">family_restroom</span><p className="mt-2 text-sm">Data santri belum tersedia</p></div></AppShell>;

  const { student, stats, hafalan } = data;
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  return (
    <AppShell>
      <section className="bg-surface-container-lowest p-5 rounded-xl card-shadow flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary">{student.name.charAt(0)}</div>
        </div>
        <div>
          <h2 className="font-headline text-xl font-semibold text-on-surface">{student.name}</h2>
          <p className="text-sm font-semibold text-on-surface-variant">{student.className} • NIS: {student.nis}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between h-32">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
          <div><p className="text-on-surface-variant text-xs font-medium">Kehadiran</p><p className="text-primary font-headline text-xl font-semibold">{stats.attendancePercent}%</p></div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between h-32">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
          <div><p className="text-on-surface-variant text-xs font-medium">Nilai Terakhir</p><p className="text-secondary font-headline text-xl font-semibold">{stats.lastGrade || "-"}</p></div>
        </div>
        <div className="bg-primary-container p-4 rounded-xl flex flex-col justify-between h-32 col-span-2 md:col-span-1">
          <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          <div>
            <p className="text-on-primary-container opacity-80 text-xs font-medium">SPP Terakhir</p>
            <div className="flex items-center gap-2">
              <p className="text-on-primary-container font-headline text-xl font-semibold">{stats.lastPaymentStatus === "lunas" ? "Lunas" : "Pending"}</p>
              {stats.lastPaymentMonth > 0 && <span className="px-2 py-0.5 bg-on-primary-container text-primary-container text-[10px] font-bold rounded-full">{monthNames[stats.lastPaymentMonth]}</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl font-semibold text-on-surface">Progress Hafalan</h3>
          <a href="/hafalan" className="text-primary text-sm font-semibold">Detail</a>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant space-y-4">
          <div className="flex justify-between items-end">
            <div><p className="text-on-surface-variant text-xs font-medium">Progress</p><h4 className="font-headline text-lg font-semibold text-primary">{hafalan.done} dari {hafalan.total} hafalan</h4></div>
            <p className="text-sm font-semibold text-on-surface-variant">{hafalan.percent}%</p>
          </div>
          <div className="w-full bg-surface-variant h-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${hafalan.percent}%` }}></div>
          </div>
          {hafalan.items.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {hafalan.items.map((h, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${h.status === "selesai" ? "bg-primary/10 text-primary" : "bg-surface-variant text-on-surface-variant"}`}>{h.title} {h.status === "selesai" ? "✓" : "..."}</span>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

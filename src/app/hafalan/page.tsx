import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/layout/FAB";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoHafalan } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

async function getHafalanData() {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    const progress = demoHafalan.map((s) => {
      const done = s.items.filter((i) => i.status === "selesai").length;
      const total = s.items.length;
      return { id: s.id, name: s.studentName, kelas: s.kelas, done, total, progress: Math.round((done / total) * 100), lastTitle: s.items[s.items.length - 1]?.title || "-" };
    });
    const totalDone = progress.reduce((a, b) => a + b.done, 0);
    const totalProses = progress.reduce((a, b) => a + (b.total - b.done), 0);
    const avg = Math.round(progress.reduce((a, b) => a + b.progress, 0) / progress.length);
    return { progress, stats: { avgProgress: avg, totalDone, totalProses } };
  }

  const students = await prisma.student.findMany({ where: { status: "aktif" }, include: { hafalans: true, class: { select: { name: true } } }, orderBy: { name: "asc" } });
  const totalDone = await prisma.hafalan.count({ where: { status: "selesai" } });
  const totalProses = await prisma.hafalan.count({ where: { status: "proses" } });
  const progress = students.filter((s) => s.hafalans.length > 0).map((s) => {
    const total = s.hafalans.length;
    const done = s.hafalans.filter((h) => h.status === "selesai").length;
    const last = s.hafalans.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    return { id: s.id, name: s.name, kelas: s.class?.name || "-", total, done, progress: Math.round((done / total) * 100), lastTitle: last?.title || "-" };
  });
  const avg = progress.length > 0 ? Math.round(progress.reduce((a, b) => a + b.progress, 0) / progress.length) : 0;
  return { progress, stats: { avgProgress: avg, totalDone, totalProses } };
}

export default async function HafalanPage() {
  const data = await getHafalanData();

  return (
    <AppShell>
      <section className="mb-6">
        <h2 className="font-headline text-[28px] leading-9 font-bold text-on-surface mb-2">Hafalan</h2>
        <p className="text-on-surface-variant text-sm">Pantau progress hafalan Al-Quran, Doa, dan Hadits santri.</p>
      </section>

      <section className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-primary-container p-4 rounded-xl text-center">
          <p className="text-[10px] font-bold uppercase text-on-primary-container opacity-80">Rata-rata</p>
          <p className="font-headline text-2xl font-bold text-on-primary-container">{data.stats.avgProgress}%</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant">
          <p className="text-[10px] font-bold uppercase text-on-surface-variant">Selesai</p>
          <p className="font-headline text-2xl font-bold text-primary">{data.stats.totalDone}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant">
          <p className="text-[10px] font-bold uppercase text-on-surface-variant">Proses</p>
          <p className="font-headline text-2xl font-bold text-secondary">{data.stats.totalProses}</p>
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Progress Per Santri</h3>
        {data.progress.map((student) => (
          <div key={student.id} className="bg-surface-container-lowest p-4 rounded-xl card-shadow border border-outline-variant">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-sm">{student.name.charAt(0)}</div>
                <div><p className="text-sm font-semibold text-on-surface">{student.name}</p><p className="text-xs text-on-surface-variant">{student.kelas}</p></div>
              </div>
              <span className={`text-sm font-bold ${student.progress === 100 ? "text-primary" : student.progress >= 70 ? "text-secondary" : "text-error"}`}>{student.progress}%</span>
            </div>
            <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-2">
              <div className={`h-full rounded-full ${student.progress === 100 ? "bg-primary" : student.progress >= 70 ? "bg-secondary" : "bg-error"}`} style={{ width: `${student.progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-on-surface-variant">Terakhir: <span className="font-semibold">{student.lastTitle}</span></p>
              <p className="text-xs text-outline">{student.done}/{student.total} selesai</p>
            </div>
          </div>
        ))}
      </div>
      <FAB icon="add" label="Input Hafalan" href="/hafalan" />
    </AppShell>
  );
}

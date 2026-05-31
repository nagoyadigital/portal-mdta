import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/layout/FAB";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoStudents, demoClasses } from "@/lib/demo-data";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStudentData() {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    const male = demoStudents.filter((s) => s.gender === "L").length;
    const female = demoStudents.filter((s) => s.gender === "P").length;
    return {
      students: demoStudents.map((s) => ({ ...s, class: { name: s.className } })),
      classes: demoClasses,
      stats: { total: demoStudents.length, male, female },
    };
  }

  const [students, classes, total, male, female] = await Promise.all([
    prisma.student.findMany({ where: { status: "aktif" }, include: { class: { select: { name: true } } }, orderBy: { name: "asc" } }),
    prisma.class.findMany({ orderBy: { level: "asc" } }),
    prisma.student.count({ where: { status: "aktif" } }),
    prisma.student.count({ where: { status: "aktif", gender: "L" } }),
    prisma.student.count({ where: { status: "aktif", gender: "P" } }),
  ]);
  return { students, classes, stats: { total, male, female } };
}

export default async function DataSantriPage() {
  const data = await getStudentData();

  return (
    <AppShell>
      <section className="mb-6 space-y-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-on-surface" placeholder="Cari Nama atau NIS..." type="text" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-primary text-on-primary">Semua Kelas</button>
          {data.classes.map((kelas) => (
            <button key={kelas.id} className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-surface-container-high text-on-surface-variant hover:bg-surface-variant">{kelas.name}</button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary-container p-4 rounded-xl text-on-primary-container shadow-sm border border-primary/10">
          <p className="text-xs font-medium opacity-80">Total Santri</p>
          <h2 className="font-headline text-2xl font-semibold">{data.stats.total}</h2>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm">
          <p className="text-xs font-medium text-on-surface-variant">Laki-laki / Perempuan</p>
          <h2 className="font-headline text-2xl font-semibold text-primary">{data.stats.male} / {data.stats.female}</h2>
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary px-1">Daftar Santri Aktif</h3>
        {data.students.map((student) => (
          <div key={student.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-lg border-2 border-primary-fixed">{student.name.charAt(0)}</div>
              <div className="flex-1">
                <h4 className="font-headline text-base font-semibold text-on-surface">{student.name}</h4>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="text-xs font-medium">NIS: {student.nis}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="text-xs font-medium">{student.class?.name || "-"}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Aktif</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/30">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-container text-on-surface-variant text-sm font-semibold hover:bg-surface-variant">
                <span className="material-symbols-outlined text-[18px]">edit</span>Edit
              </button>
              <Link href={`/santri/kartu?id=${student.id}`} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary">
                <span className="material-symbols-outlined text-[18px]">badge</span>Cetak Kartu
              </Link>
            </div>
          </div>
        ))}
      </div>
      <FAB icon="person_add" label="Tambah Santri" href="/santri" />
    </AppShell>
  );
}

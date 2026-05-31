import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/layout/FAB";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoSubjects } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

async function getGradeData() {
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return { subjectAverages: demoSubjects, recentGrades: [], totalStudents: 12 };
  }

  const subjects = await prisma.subject.findMany();
  const subjectAverages = await Promise.all(subjects.map(async (s) => {
    const avg = await prisma.grade.aggregate({ where: { subjectId: s.id }, _avg: { score: true } });
    return { id: s.id, name: s.name, average: Math.round(avg._avg.score || 0) };
  }));
  const recentGrades = await prisma.grade.findMany({ include: { student: { select: { name: true } }, subject: { select: { name: true } } }, orderBy: { date: "desc" }, take: 10 });
  const totalStudents = await prisma.student.count({ where: { status: "aktif" } });
  return { subjectAverages, recentGrades, totalStudents };
}

export default async function PenilaianPage() {
  const data = await getGradeData();

  return (
    <AppShell>
      <section className="mb-6">
        <h2 className="font-headline text-[28px] leading-9 font-bold text-on-surface mb-2">Penilaian & Raport</h2>
        <p className="text-on-surface-variant text-sm">Kelola nilai dan cetak raport santri.</p>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-primary-container p-5 rounded-xl text-left hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-on-primary-container text-3xl mb-2">edit_note</span>
          <p className="text-sm font-semibold text-on-primary-container">Input Nilai</p>
          <p className="text-xs text-on-primary-container/70">Masukkan nilai harian</p>
        </button>
        <button className="bg-secondary-container p-5 rounded-xl text-left hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-on-secondary-container text-3xl mb-2">description</span>
          <p className="text-sm font-semibold text-on-secondary-container">Cetak Raport</p>
          <p className="text-xs text-on-secondary-container/70">Generate PDF raport</p>
        </button>
      </section>

      <section className="mb-8">
        <h3 className="text-sm font-semibold text-primary mb-4">Rata-rata Per Mata Pelajaran</h3>
        <div className="space-y-3">
          {data.subjectAverages.map((subject) => (
            <div key={subject.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">{subject.name}</p>
                <p className="text-xs text-on-surface-variant">{data.totalStudents} santri</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-surface-variant h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${subject.average >= 85 ? "bg-primary" : subject.average >= 75 ? "bg-secondary" : "bg-error"}`} style={{ width: `${subject.average}%` }}></div>
                </div>
                <span className={`text-sm font-bold min-w-[32px] text-right ${subject.average >= 85 ? "text-primary" : subject.average >= 75 ? "text-secondary" : "text-error"}`}>{subject.average}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <FAB icon="add" label="Input Nilai" href="/penilaian" />
    </AppShell>
  );
}

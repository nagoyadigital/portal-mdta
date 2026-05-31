import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/layout/FAB";
import WelcomeHeader from "@/components/WelcomeHeader";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoAnnouncements, demoSchedules, demoFinanceSummary } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    const jsDay = new Date().getDay() || 7;
    const todaySchedules = demoSchedules.filter((s) => s.day === jsDay).slice(0, 3);
    return {
      stats: { totalStudents: 12, totalTeachers: 4, totalClasses: 6 },
      finance: { collected: demoFinanceSummary.collected, pending: demoFinanceSummary.pending },
      announcements: demoAnnouncements.slice(0, 3),
      schedules: todaySchedules.map((s) => ({
        id: s.id, startTime: s.startTime, endTime: s.endTime,
        subject: { name: s.subject }, teacher: { user: { name: s.teacher } }, class: { name: s.className },
      })),
    };
  }

  const [totalStudents, totalTeachers, totalClasses, announcements] = await Promise.all([
    prisma.student.count({ where: { status: "aktif" } }),
    prisma.teacher.count(),
    prisma.class.count(),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [collected, pending] = await Promise.all([
    prisma.payment.aggregate({ where: { status: "lunas", year: currentYear, month: currentMonth }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: "pending", year: currentYear, month: currentMonth }, _sum: { amount: true } }),
  ]);

  const jsDay = new Date().getDay() || 7;
  const schedules = await prisma.schedule.findMany({
    where: { day: jsDay <= 6 ? jsDay : 1 },
    include: { subject: { select: { name: true } }, teacher: { include: { user: { select: { name: true } } } }, class: { select: { name: true } } },
    orderBy: { startTime: "asc" }, take: 3,
  });

  return {
    stats: { totalStudents, totalTeachers, totalClasses },
    finance: { collected: collected._sum.amount || 0, pending: pending._sum.amount || 0 },
    announcements,
    schedules,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const collectedK = Math.round(data.finance.collected / 1000);
  const pendingK = Math.round(data.finance.pending / 1000);
  const total = data.finance.collected + data.finance.pending;
  const percentage = total > 0 ? Math.round((data.finance.collected / total) * 100) : 0;

  return (
    <AppShell>
      <WelcomeHeader />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 md:col-span-4">
          <StatCard icon="group" label="Santri" value={String(data.stats.totalStudents)} />
          <StatCard icon="person" label="Guru" value={String(data.stats.totalTeachers)} />
          <StatCard icon="school" label="Kelas" value={String(data.stats.totalClasses)} />
        </div>

        {/* Finance */}
        <div className="md:col-span-2 bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-xl font-semibold">Keuangan Bulan Ini</h3>
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs opacity-80 mb-1">Terkumpul (SPP)</p>
                <div className="flex items-center gap-2">
                  <span className="font-headline text-3xl font-bold text-primary-fixed">Rp {collectedK > 0 ? `${collectedK}k` : "0"}</span>
                  <span className="text-xs bg-primary-container px-2 py-0.5 rounded text-on-primary-container">{percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-on-primary/20 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-fixed h-full rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs opacity-80">Pending: Rp {pendingK > 0 ? `${pendingK}k` : "0"}</p>
                <a href="/keuangan" className="text-sm font-bold text-primary-fixed hover:underline">Rincian →</a>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-container rounded-full opacity-20"></div>
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-primary-container rounded-full opacity-10"></div>
        </div>

        {/* Schedule */}
        <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline text-xl font-semibold text-on-surface">Jadwal Hari Ini</h3>
            <a href="/jadwal" className="text-primary font-semibold text-sm">Lihat Semua</a>
          </div>
          <div className="space-y-4">
            {data.schedules.length > 0 ? data.schedules.map((s, i) => (
              <ScheduleItem key={s.id} time={s.startTime} endTime={s.endTime} subject={s.subject.name} detail={`${s.class.name} • ${s.teacher.user.name}`} active={i === 0} />
            )) : (
              <p className="text-sm text-on-surface-variant text-center py-4">Tidak ada jadwal hari ini</p>
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline text-xl font-semibold text-on-surface">Pengumuman</h3>
            <a href="/pengumuman" className="text-primary font-semibold text-sm hover:underline">Lihat Semua</a>
          </div>
          <div className="space-y-4">
            {data.announcements.map((a) => (
              <AnnouncementItem key={a.id} icon={a.category === "penting" ? "campaign" : a.category === "acara" ? "event" : "menu_book"} iconBg="bg-tertiary-fixed" iconColor="text-on-tertiary-fixed-variant" title={a.title} desc={a.content} time={getRelativeTime(a.createdAt)} />
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant">
          <h3 className="font-headline text-xl font-semibold text-on-surface mb-4">Menu Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink href="/santri" icon="group" label="Data Santri" />
            <QuickLink href="/absensi" icon="how_to_reg" label="Absensi" />
            <QuickLink href="/hafalan" icon="menu_book" label="Hafalan" />
            <QuickLink href="/penilaian" icon="grade" label="Penilaian" />
            <QuickLink href="/keuangan" icon="payments" label="Keuangan" />
            <QuickLink href="/wali" icon="family_restroom" label="Portal Wali" />
          </div>
        </div>
      </div>

      <FAB icon="add" label="Tambah Baru" />
    </AppShell>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl card-shadow border border-outline-variant flex flex-col items-center justify-center text-center">
      <span className="material-symbols-outlined text-primary text-3xl mb-2">{icon}</span>
      <p className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">{label}</p>
      <h3 className="font-headline text-3xl font-bold text-on-surface">{value}</h3>
    </div>
  );
}

function ScheduleItem({ time, endTime, subject, detail, active }: { time: string; endTime: string; subject: string; detail: string; active?: boolean }) {
  return (
    <div className={`flex gap-4 p-3 rounded-lg border-l-4 ${active ? "bg-surface-container border-primary" : "bg-surface-container-low border-outline-variant"}`}>
      <div className="flex flex-col items-center justify-center min-w-[60px]">
        <p className={`text-xs font-bold ${active ? "text-primary" : "text-on-surface-variant"}`}>{time}</p>
        <p className="text-xs text-on-surface-variant">{endTime}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-on-surface">{subject}</p>
        <p className="text-sm text-on-surface-variant">{detail}</p>
      </div>
    </div>
  );
}

function AnnouncementItem({ icon, iconBg, iconColor, title, desc, time }: { icon: string; iconBg: string; iconColor: string; title: string; desc: string; time: string }) {
  return (
    <div className="flex gap-3 items-start group cursor-pointer">
      <div className={`w-10 h-10 rounded ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="border-b border-outline-variant pb-2 w-full">
        <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{title}</p>
        <p className="text-sm text-on-surface-variant line-clamp-1">{desc}</p>
        <p className="text-[10px] text-outline mt-1 uppercase font-bold">{time}</p>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a href={href} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-variant transition-colors">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <span className="text-sm font-medium text-on-surface">{label}</span>
    </a>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return new Date(date).toLocaleDateString("id-ID");
}

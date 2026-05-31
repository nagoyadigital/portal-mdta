import AppShell from "@/components/layout/AppShell";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoSchedules } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const borderColors = ["border-primary", "border-secondary", "border-tertiary", "border-primary-fixed-dim", "border-secondary-fixed-dim", "border-outline"];

async function getSchedules() {
  const jsDay = new Date().getDay();
  const currentDay = jsDay === 0 ? 7 : jsDay;
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    const schedules = demoSchedules.map((s) => ({
      id: s.id, day: s.day, startTime: s.startTime, endTime: s.endTime,
      subject: { name: s.subject }, teacher: { user: { name: s.teacher } }, class: { name: s.className },
    }));
    return { schedules, currentDay };
  }

  const schedules = await prisma.schedule.findMany({
    include: { subject: { select: { name: true } }, teacher: { include: { user: { select: { name: true } } } }, class: { select: { name: true } } },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
  return { schedules, currentDay };
}

export default async function JadwalPage() {
  const { schedules, currentDay } = await getSchedules();
  const schedulesByDay: Record<number, typeof schedules> = {};
  for (const s of schedules) { if (!schedulesByDay[s.day]) schedulesByDay[s.day] = []; schedulesByDay[s.day].push(s); }
  const displayDay = currentDay <= 6 ? currentDay : 1;
  const todaySchedules = schedulesByDay[displayDay] || [];

  return (
    <AppShell>
      <section className="mb-6">
        <h2 className="font-headline text-[28px] leading-9 font-bold text-on-surface mb-2">Jadwal Pelajaran</h2>
        <p className="text-on-surface-variant text-sm">Jadwal kegiatan belajar mengajar Madrasah.</p>
      </section>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {dayNames.map((day, i) => {
          const dayNum = i + 1;
          const isActive = dayNum === displayDay;
          return (
            <div key={day} className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all ${isActive ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant"}`}>
              <span className="text-xs font-medium">{day}</span>
              <span className="text-lg font-bold">{dayNum}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {todaySchedules.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">event_busy</span>
            <p className="mt-2 text-sm">Tidak ada jadwal untuk hari ini</p>
          </div>
        ) : todaySchedules.map((item, i) => (
          <div key={item.id} className={`bg-surface-container-lowest p-4 rounded-xl card-shadow border border-outline-variant/30 border-l-4 ${borderColors[i % borderColors.length]} flex items-center gap-4 ${i === 0 ? "ring-2 ring-primary/20" : ""}`}>
            <div className="flex flex-col items-center justify-center min-w-[70px] bg-surface-container-low rounded-lg py-2 px-3">
              <span className="text-[10px] font-bold text-primary uppercase">Mulai</span>
              <span className="text-sm font-bold text-on-surface">{item.startTime}</span>
              <span className="text-[10px] text-on-surface-variant">{item.endTime}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">{item.subject.name}</p>
              <p className="text-xs text-on-surface-variant">{item.teacher.user.name}</p>
              <p className="text-xs text-outline mt-1">{item.class.name}</p>
            </div>
            {i === 0 && <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded text-[10px] font-bold">BERLANGSUNG</span>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}

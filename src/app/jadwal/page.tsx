import AppShell from "@/components/layout/AppShell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const borderColors = [
  "border-primary",
  "border-secondary",
  "border-tertiary",
  "border-primary-fixed-dim",
  "border-secondary-fixed-dim",
  "border-outline",
];

async function getSchedules() {
  // Get current day (1=Mon...6=Sat)
  const jsDay = new Date().getDay(); // 0=Sun, 1=Mon...6=Sat
  const currentDay = jsDay === 0 ? 7 : jsDay; // Convert to 1-7

  const schedules = await prisma.schedule.findMany({
    include: {
      subject: { select: { name: true } },
      teacher: { include: { user: { select: { name: true } } } },
      class: { select: { name: true } },
    },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  return { schedules, currentDay };
}

export default async function JadwalPage() {
  const { schedules, currentDay } = await getSchedules();

  // Group by day
  const schedulesByDay: Record<number, typeof schedules> = {};
  for (const s of schedules) {
    if (!schedulesByDay[s.day]) schedulesByDay[s.day] = [];
    schedulesByDay[s.day].push(s);
  }

  const displayDay = currentDay <= 6 ? currentDay : 1;
  const todaySchedules = schedulesByDay[displayDay] || [];

  return (
    <AppShell>
      {/* Header */}
      <section className="mb-6">
        <h2 className="font-headline text-[28px] leading-9 font-bold text-on-surface mb-2">
          Jadwal Pelajaran
        </h2>
        <p className="text-on-surface-variant text-sm">
          Jadwal kegiatan belajar mengajar Madrasah.
        </p>
      </section>

      {/* Day Selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {dayNames.map((day, i) => {
          const dayNum = i + 1;
          const isActive = dayNum === displayDay;
          const hasSchedule = schedulesByDay[dayNum]?.length > 0;
          return (
            <div
              key={day}
              className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="text-xs font-medium">{day}</span>
              <span className="text-lg font-bold">{dayNum}</span>
              {hasSchedule && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-4">
        {todaySchedules.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">
              event_busy
            </span>
            <p className="mt-2 text-sm">Tidak ada jadwal untuk hari ini</p>
          </div>
        ) : (
          todaySchedules.map((item, i) => (
            <div
              key={item.id}
              className={`bg-surface-container-lowest p-4 rounded-xl card-shadow border border-outline-variant/30 border-l-4 ${borderColors[i % borderColors.length]} flex items-center gap-4 ${
                i === 0 ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="flex flex-col items-center justify-center min-w-[70px] bg-surface-container-low rounded-lg py-2 px-3">
                <span className="text-[10px] font-bold text-primary uppercase">
                  Mulai
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {item.startTime}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  {item.endTime}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">
                  {item.subject.name}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {item.teacher.user.name}
                </p>
                <p className="text-xs text-outline mt-1">{item.class.name}</p>
              </div>
              {i === 0 && (
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded text-[10px] font-bold">
                  BERLANGSUNG
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* All Days Summary */}
      <section className="mt-8">
        <h3 className="font-headline text-lg font-semibold text-on-surface mb-4">
          Ringkasan Minggu Ini
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dayNames.map((day, i) => {
            const dayNum = i + 1;
            const count = schedulesByDay[dayNum]?.length || 0;
            return (
              <div
                key={day}
                className="bg-surface-container-low p-3 rounded-xl text-center"
              >
                <p className="text-xs font-medium text-on-surface-variant">
                  {day}
                </p>
                <p className="font-headline text-lg font-bold text-primary">
                  {count}
                </p>
                <p className="text-[10px] text-outline">pelajaran</p>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}

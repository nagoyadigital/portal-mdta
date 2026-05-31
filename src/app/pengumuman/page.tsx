import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/layout/FAB";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoAnnouncements } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

async function getAnnouncements() {
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) return demoAnnouncements;
  return prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return new Date(date).toLocaleDateString("id-ID");
}

function getIcon(category: string) {
  switch (category) {
    case "penting": return { icon: "campaign", bg: "bg-secondary-container", color: "text-on-secondary-container" };
    case "acara": return { icon: "event", bg: "bg-tertiary-fixed", color: "text-on-tertiary-fixed-variant" };
    case "keuangan": return { icon: "payments", bg: "bg-secondary-container", color: "text-on-secondary-container" };
    default: return { icon: "menu_book", bg: "bg-primary-fixed", color: "text-on-primary-fixed-variant" };
  }
}

export default async function PengumumanPage() {
  const announcements = await getAnnouncements();

  return (
    <AppShell>
      <section className="mb-6">
        <h2 className="font-headline text-[28px] leading-9 font-bold text-on-surface mb-2">Pengumuman</h2>
        <p className="text-on-surface-variant text-sm">Informasi terbaru dari Madrasah.</p>
      </section>

      <div className="space-y-4">
        {announcements.map((item) => {
          const { icon, bg, color } = getIcon(item.category);
          return (
            <div key={item.id} className="bg-surface-container-lowest p-5 rounded-xl card-shadow border border-outline-variant group cursor-pointer hover:border-primary/30 transition-all">
              <div className="flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color} shrink-0`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.category}</span>
                    <span className="text-[10px] text-outline uppercase font-bold">{getRelativeTime(item.createdAt)}</span>
                  </div>
                  <h4 className="text-base font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FAB icon="add" label="Buat Pengumuman" href="/pengumuman" />
    </AppShell>
  );
}

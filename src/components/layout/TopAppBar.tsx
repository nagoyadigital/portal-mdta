"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function TopAppBar() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-surface shadow-sm">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-on-primary-container border-2 border-primary-fixed">
          <span className="material-symbols-outlined text-lg">school</span>
        </div>
        <h1 className="font-headline text-xl font-bold text-primary">
          MDTA Hidayatul Mubtadi&apos;in
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-transform duration-200 active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        {initials && (
          <Link
            href="/profil"
            className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-xs font-bold"
          >
            {initials}
          </Link>
        )}
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

interface FABAction {
  icon: string;
  label: string;
  href: string;
}

interface FABProps {
  actions?: FABAction[];
  icon?: string;
  label?: string;
  href?: string;
}

const defaultActions: FABAction[] = [
  { icon: "person_add", label: "Tambah Santri", href: "/santri" },
  { icon: "payments", label: "Catat Pembayaran", href: "/keuangan" },
  { icon: "campaign", label: "Buat Pengumuman", href: "/pengumuman" },
  { icon: "edit_note", label: "Input Nilai", href: "/penilaian" },
  { icon: "menu_book", label: "Input Hafalan", href: "/hafalan" },
];

export default function FAB({ actions, icon = "add", label, href }: FABProps) {
  const [open, setOpen] = useState(false);
  const menuActions = actions || defaultActions;

  // Simple FAB with direct link
  if (href) {
    return (
      <Link
        href={href}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center transition-transform duration-200 active:scale-90 z-40 hover:bg-primary-container"
        aria-label={label}
      >
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </Link>
    );
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Action Menu */}
      {open && (
        <div className="fixed bottom-40 right-6 z-50 flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-4">
          {menuActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 group"
            >
              <span className="px-3 py-1.5 bg-surface-container-lowest text-on-surface text-sm font-medium rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                {action.label}
              </span>
              <div className="w-11 h-11 bg-surface-container-lowest text-primary rounded-full shadow-lg flex items-center justify-center border border-outline-variant hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-xl">
                  {action.icon}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 z-50 ${
          open
            ? "bg-error text-on-error rotate-45"
            : "bg-primary text-on-primary"
        }`}
        aria-label={label || "Menu"}
      >
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </button>
    </>
  );
}

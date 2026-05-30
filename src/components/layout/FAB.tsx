"use client";

interface FABProps {
  icon: string;
  label?: string;
  onClick?: () => void;
}

export default function FAB({ icon, label, onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center transition-transform duration-200 active:scale-90 z-40 hover:bg-primary-container group"
      aria-label={label}
    >
      <span className="material-symbols-outlined text-2xl">{icon}</span>
      {label && (
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-on-background text-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {label}
        </span>
      )}
    </button>
  );
}

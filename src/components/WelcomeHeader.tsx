"use client";

import { useSession } from "next-auth/react";

export default function WelcomeHeader() {
  const { data: session } = useSession();
  const name = session?.user?.name || "User";

  return (
    <section className="mb-8">
      <h2 className="font-headline text-2xl font-semibold text-primary mb-1">
        Assalamualaikum, {name}
      </h2>
      <p className="text-on-surface-variant text-sm">
        Berikut ringkasan operasional Madrasah hari ini.
      </p>
    </section>
  );
}

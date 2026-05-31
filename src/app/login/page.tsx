"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo & Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-on-primary-container text-4xl">
            school
          </span>
        </div>
        <h1 className="font-headline text-2xl font-bold text-primary text-center">
          MDTA Hidayatul Mubtadi&apos;in
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Portal Digital Madrasah
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm bg-surface-container-lowest p-6 rounded-2xl shadow-lg border border-outline-variant">
        <h2 className="font-headline text-xl font-semibold text-on-surface mb-6 text-center">
          Masuk ke Akun
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="nama@mdta-hm.sch.id"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
              <span className="material-symbols-outlined text-on-error-container text-lg">
                error
              </span>
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-xl">
                progress_activity
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">login</span>
                Masuk
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-6 pt-4 border-t border-outline-variant">
          <p className="text-xs text-outline text-center mb-3 font-medium">
            Akun Demo
          </p>
          <div className="space-y-2 text-xs text-on-surface-variant">
            <div className="flex justify-between bg-surface-container-low p-2 rounded-lg">
              <span className="font-medium">Admin</span>
              <span>admin@mdta-hm.sch.id / admin123</span>
            </div>
            <div className="flex justify-between bg-surface-container-low p-2 rounded-lg">
              <span className="font-medium">Guru</span>
              <span>zaid@mdta-hm.sch.id / guru123</span>
            </div>
            <div className="flex justify-between bg-surface-container-low p-2 rounded-lg">
              <span className="font-medium">Wali</span>
              <span>wali.fauzi@gmail.com / wali123</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-outline text-center">
        © 2024 Yayasan Al-Hijrah Cipedang Kanem
      </p>
    </div>
  );
}

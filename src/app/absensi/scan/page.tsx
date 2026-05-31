"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";

interface ScanResult {
  success: boolean;
  message: string;
  student?: {
    id: string;
    name: string;
    nis: string;
    class: string;
  };
  alreadyRecorded?: boolean;
}

interface RecentScan {
  name: string;
  nis: string;
  kelas: string;
  time: string;
  alreadyRecorded: boolean;
}

export default function ScanAbsensiPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [manualNis, setManualNis] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const processQrData = useCallback(async (data: string) => {
    if (processing) return;
    setProcessing(true);

    try {
      // Parse QR data
      let payload: { id?: string; nis?: string } = {};
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === "MDTA_STUDENT") {
          payload = { id: parsed.id, nis: parsed.nis };
        }
      } catch {
        // If not JSON, treat as NIS
        payload = { nis: data };
      }

      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: payload.id,
          nis: payload.nis,
        }),
      });

      const result: ScanResult = await res.json();
      setResult(result);

      if (result.success && result.student) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setRecentScans((prev) => [
          {
            name: result.student!.name,
            nis: result.student!.nis,
            kelas: result.student!.class,
            time: timeStr,
            alreadyRecorded: result.alreadyRecorded || false,
          },
          ...prev.slice(0, 9),
        ]);
      }

      // Clear result after 3 seconds
      setTimeout(() => setResult(null), 3000);
    } catch {
      setResult({
        success: false,
        message: "Gagal memproses QR code",
      });
      setTimeout(() => setResult(null), 3000);
    }

    setProcessing(false);
  }, [processing]);

  const startScanner = useCallback(async () => {
    if (scannerRef.current || !containerRef.current) return;

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          processQrData(decodedText);
        },
        () => {
          // Ignore scan failures (no QR found in frame)
        }
      );

      setScanning(true);
      setCameraError("");
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan izin kamera diberikan."
      );
    }
  }, [processQrData]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Ignore stop errors
      }
      scannerRef.current = null;
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleManualSubmit = async () => {
    if (!manualNis.trim()) return;
    await processQrData(manualNis.trim());
    setManualNis("");
  };

  return (
    <>
      <TopAppBar />
      <main className="pt-16 pb-28">
        {/* Scanner Area */}
        <section className="relative w-full bg-on-background overflow-hidden">
          <div className="aspect-[4/3] max-h-[400px] relative flex items-center justify-center">
            {/* QR Reader Container */}
            <div
              id="qr-reader"
              ref={containerRef}
              className="w-full h-full"
              style={{ display: scanning ? "block" : "none" }}
            ></div>

            {/* Placeholder when not scanning */}
            {!scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-on-background/80 to-on-background">
                <div className="relative w-60 h-60 border-2 border-white/30 rounded-3xl flex items-center justify-center">
                  {/* Corners */}
                  <div className="absolute top-[-2px] left-[-2px] w-10 h-10 border-4 border-primary-fixed border-r-0 border-b-0 rounded-tl-3xl"></div>
                  <div className="absolute top-[-2px] right-[-2px] w-10 h-10 border-4 border-primary-fixed border-l-0 border-b-0 rounded-tr-3xl"></div>
                  <div className="absolute bottom-[-2px] left-[-2px] w-10 h-10 border-4 border-primary-fixed border-r-0 border-t-0 rounded-bl-3xl"></div>
                  <div className="absolute bottom-[-2px] right-[-2px] w-10 h-10 border-4 border-primary-fixed border-l-0 border-t-0 rounded-br-3xl"></div>

                  <span className="material-symbols-outlined text-white/50 text-6xl">
                    qr_code_scanner
                  </span>
                </div>

                <button
                  onClick={startScanner}
                  className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined">
                    photo_camera
                  </span>
                  Mulai Scan
                </button>

                {cameraError && (
                  <p className="mt-4 text-error text-xs text-center px-8 bg-error-container/80 py-2 rounded-lg">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Stop button when scanning */}
            {scanning && (
              <button
                onClick={stopScanner}
                className="absolute top-4 right-4 w-10 h-10 bg-error/80 text-white rounded-full flex items-center justify-center z-20 active:scale-90"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* Result Overlay */}
          {result && (
            <div
              className={`absolute inset-0 flex items-center justify-center z-30 ${
                result.success
                  ? "bg-primary/20 backdrop-blur-sm"
                  : "bg-error/20 backdrop-blur-sm"
              }`}
            >
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 mx-4 animate-in fade-in zoom-in">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    result.success
                      ? "bg-primary-container"
                      : "bg-error-container"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-4xl ${
                      result.success
                        ? "text-on-primary-container"
                        : "text-on-error-container"
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {result.success ? "check_circle" : "error"}
                  </span>
                </div>
                <div className="text-center">
                  {result.student && (
                    <p className="font-headline text-lg font-semibold text-primary">
                      {result.student.name}
                    </p>
                  )}
                  <p className="text-sm text-on-surface-variant">
                    {result.message}
                  </p>
                  {result.student && (
                    <p className="text-xs text-outline mt-1">
                      NIS: {result.student.nis} • {result.student.class}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Manual Entry */}
        <section className="px-4 mt-[-24px] relative z-40">
          <div className="bg-surface rounded-xl p-5 shadow-lg border border-outline-variant/30">
            <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">
                keyboard
              </span>
              Input Manual NIS
            </h2>
            <div className="flex gap-3">
              <input
                value={manualNis}
                onChange={(e) => setManualNis(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                className="flex-1 h-12 bg-surface-container-low border border-outline-variant rounded-lg px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                placeholder="Masukkan NIS Santri"
                type="text"
              />
              <button
                onClick={handleManualSubmit}
                disabled={processing}
                className="h-12 px-6 bg-primary text-on-primary rounded-lg text-sm font-semibold transition-transform active:scale-95 disabled:opacity-50"
              >
                {processing ? "..." : "Cek"}
              </button>
            </div>
          </div>
        </section>

        {/* Recently Scanned */}
        <section className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-lg font-semibold text-on-surface">
              Terakhir Discan ({recentScans.length})
            </h3>
            {recentScans.length > 0 && (
              <button
                onClick={() => setRecentScans([])}
                className="text-xs text-outline hover:text-error"
              >
                Hapus
              </button>
            )}
          </div>

          {recentScans.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl">
                qr_code_scanner
              </span>
              <p className="mt-2 text-sm">
                Belum ada scan hari ini. Mulai scan QR santri.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-surface p-4 rounded-xl shadow-sm border border-surface-container hover:bg-surface-container-lowest transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold">
                    {scan.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-on-surface">
                      {scan.name}
                    </p>
                    <p className="text-on-surface-variant text-xs">
                      {scan.nis} • {scan.kelas} • {scan.time}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scan.alreadyRecorded
                        ? "bg-secondary/10 text-secondary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {scan.alreadyRecorded ? "Sudah" : "Hadir ✓"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}

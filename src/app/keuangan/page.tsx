import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/layout/FAB";
import { isDatabaseAvailable, prisma } from "@/lib/db";
import { demoPayments, demoFinanceSummary } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

async function getFinanceData() {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    return {
      payments: demoPayments,
      summary: demoFinanceSummary,
      saldo: demoFinanceSummary.collected - demoFinanceSummary.expenses,
    };
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [payments, collected, pending, totalStudents, paidCount, expenses] = await Promise.all([
    prisma.payment.findMany({ include: { student: { select: { name: true, nis: true } } }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.payment.aggregate({ where: { status: "lunas", year: currentYear }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: "pending", year: currentYear }, _sum: { amount: true } }),
    prisma.student.count({ where: { status: "aktif" } }),
    prisma.payment.count({ where: { status: "lunas", year: currentYear, month: currentMonth } }),
    prisma.cashBook.aggregate({ where: { type: "keluar" }, _sum: { amount: true } }),
  ]);

  const collectedAmt = collected._sum.amount || 0;
  const expensesAmt = expenses._sum.amount || 0;
  return {
    payments: payments.map((p) => ({ id: p.id, studentName: p.student.name, type: p.type, amount: p.amount, status: p.status, createdAt: p.createdAt })),
    summary: { collected: collectedAmt, pending: pending._sum.amount || 0, expenses: expensesAmt, paidCount, totalStudents, pendingCount: totalStudents - paidCount },
    saldo: collectedAmt - expensesAmt,
  };
}

export default async function KeuanganPage() {
  const data = await getFinanceData();

  return (
    <AppShell>
      <section className="mb-6">
        <h2 className="font-headline text-[28px] leading-9 font-bold text-on-surface mb-2">Keuangan</h2>
        <p className="text-on-surface-variant text-sm">Kelola pembayaran SPP, Infaq, dan kas Madrasah.</p>
      </section>

      <section className="bg-primary text-on-primary p-6 rounded-2xl shadow-lg relative overflow-hidden mb-8">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline text-lg font-semibold">Ringkasan Keuangan</h3>
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs opacity-80">Pemasukan</p><p className="font-headline text-2xl font-bold text-primary-fixed">Rp {(data.summary.collected / 1000).toFixed(0)}k</p></div>
            <div><p className="text-xs opacity-80">Pengeluaran</p><p className="font-headline text-2xl font-bold text-secondary-fixed">Rp {(data.summary.expenses / 1000).toFixed(0)}k</p></div>
          </div>
          <div className="mt-4 pt-4 border-t border-on-primary/20 flex justify-between items-center">
            <div><p className="text-xs opacity-80">Saldo Kas</p><p className="font-headline text-xl font-bold">Rp {(data.saldo / 1000).toFixed(0)}k</p></div>
            <div className="flex items-center gap-1 bg-primary-container px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-on-primary-container text-sm">trending_up</span>
              <span className="text-xs font-bold text-on-primary-container">Sehat</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-container rounded-full opacity-20"></div>
      </section>

      <section className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-center">
          <p className="text-[10px] font-bold uppercase text-on-surface-variant">Lunas</p>
          <p className="font-headline text-xl font-bold text-primary">{data.summary.paidCount}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-center">
          <p className="text-[10px] font-bold uppercase text-on-surface-variant">Pending</p>
          <p className="font-headline text-xl font-bold text-secondary">{data.summary.totalStudents - data.summary.paidCount}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant text-center">
          <p className="text-[10px] font-bold uppercase text-on-surface-variant">Total</p>
          <p className="font-headline text-xl font-bold text-on-surface">{data.summary.totalStudents}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Transaksi Terbaru</h3>
        {data.payments.map((tx) => (
          <div key={tx.id} className="bg-surface-container-lowest p-4 rounded-xl card-shadow border border-outline-variant flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === "lunas" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
              <span className="material-symbols-outlined text-xl">{tx.type === "spp" ? "school" : "volunteer_activism"}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">{tx.studentName}</p>
              <p className="text-xs text-on-surface-variant">{tx.type.toUpperCase()} • {new Date(tx.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface">Rp {tx.amount.toLocaleString("id-ID")}</p>
              <span className={`text-[10px] font-bold ${tx.status === "lunas" ? "text-primary" : "text-secondary"}`}>{tx.status === "lunas" ? "Lunas" : "Pending"}</span>
            </div>
          </div>
        ))}
      </section>
      <FAB icon="add" label="Catat Pembayaran" href="/keuangan" />
    </AppShell>
  );
}

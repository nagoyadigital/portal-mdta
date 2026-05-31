// Demo data untuk deployment tanpa database

export const demoStudents = [
  { id: "1", nis: "2023001", name: "Ahmad Fauzi Al-Ghifari", gender: "L", status: "aktif", className: "Kelas 1A" },
  { id: "2", nis: "2023002", name: "Fatimah Az-Zahra", gender: "P", status: "aktif", className: "Kelas 1A" },
  { id: "3", nis: "2023003", name: "Muhammad Rizky", gender: "L", status: "aktif", className: "Kelas 1B" },
  { id: "4", nis: "2023004", name: "Siti Aminah", gender: "P", status: "aktif", className: "Kelas 2" },
  { id: "5", nis: "2023005", name: "Bilal Ibrahim", gender: "L", status: "aktif", className: "Kelas 2" },
  { id: "6", nis: "2023006", name: "Aisyah Putri", gender: "P", status: "aktif", className: "Kelas 3" },
  { id: "7", nis: "2023007", name: "Zahra Humaira", gender: "P", status: "aktif", className: "Kelas 3" },
  { id: "8", nis: "2023008", name: "Muhammad Azka", gender: "L", status: "aktif", className: "Kelas 4" },
  { id: "9", nis: "2023009", name: "Ahmad Zaki Al-Fatih", gender: "L", status: "aktif", className: "Kelas 1A" },
  { id: "10", nis: "2023010", name: "Khadijah Nur", gender: "P", status: "aktif", className: "Kelas 1B" },
  { id: "11", nis: "2023011", name: "Umar Faruq", gender: "L", status: "aktif", className: "Kelas 4" },
  { id: "12", nis: "2023012", name: "Hafizah Rahmah", gender: "P", status: "aktif", className: "Kelas 5" },
];

export const demoClasses = [
  { id: "c1", name: "Kelas 1A", level: 1 },
  { id: "c2", name: "Kelas 1B", level: 1 },
  { id: "c3", name: "Kelas 2", level: 2 },
  { id: "c4", name: "Kelas 3", level: 3 },
  { id: "c5", name: "Kelas 4", level: 4 },
  { id: "c6", name: "Kelas 5", level: 5 },
];

export const demoAnnouncements = [
  { id: "a1", title: "Libur Semester Ganjil 2024", content: "Sesuai kalender pendidikan, kegiatan belajar mengajar diliburkan mulai tanggal 20 Desember 2024 hingga 5 Januari 2025.", category: "penting", createdAt: new Date(Date.now() - 2 * 3600000) },
  { id: "a2", title: "Rapat Wali Santri Bulanan", content: "Agenda pembahasan pembangunan masjid madrasah tahap 2 dan evaluasi semester.", category: "acara", createdAt: new Date(Date.now() - 86400000) },
  { id: "a3", title: "Ujian Tengah Semester Ganjil", content: "Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Oktober 2024.", category: "akademik", createdAt: new Date(Date.now() - 3 * 86400000) },
  { id: "a4", title: "Pembayaran SPP Bulan November", content: "Batas akhir pembayaran SPP bulan November adalah tanggal 10 November 2024.", category: "keuangan", createdAt: new Date(Date.now() - 7 * 86400000) },
];

export const demoSchedules = [
  { id: "s1", day: 1, startTime: "14:00", endTime: "14:45", subject: "Tahsin & Tajwid", teacher: "Ust. Salman Al-Farisi", className: "Kelas 1A" },
  { id: "s2", day: 1, startTime: "14:45", endTime: "15:30", subject: "Fiqih Ibadah", teacher: "Usth. Siti", className: "Kelas 1A" },
  { id: "s3", day: 1, startTime: "15:30", endTime: "16:15", subject: "Tahfidz Juz 30", teacher: "Ust. Zaid", className: "Kelas 2" },
  { id: "s4", day: 1, startTime: "16:15", endTime: "17:00", subject: "Akhlak & Adab", teacher: "Ust. Ahmad", className: "Kelas 3" },
  { id: "s5", day: 2, startTime: "14:00", endTime: "14:45", subject: "Bahasa Arab", teacher: "Usth. Siti", className: "Kelas 1A" },
  { id: "s6", day: 2, startTime: "14:45", endTime: "15:30", subject: "Tahfidz Juz 30", teacher: "Ust. Zaid", className: "Kelas 1B" },
  { id: "s7", day: 3, startTime: "14:00", endTime: "14:45", subject: "Tahsin & Tajwid", teacher: "Ust. Salman Al-Farisi", className: "Kelas 1B" },
  { id: "s8", day: 3, startTime: "14:45", endTime: "15:30", subject: "Akhlak & Adab", teacher: "Ust. Ahmad", className: "Kelas 1A" },
  { id: "s9", day: 4, startTime: "14:00", endTime: "14:45", subject: "Doa & Hadits", teacher: "Ust. Salman Al-Farisi", className: "Kelas 2" },
  { id: "s10", day: 5, startTime: "14:00", endTime: "14:45", subject: "Fiqih Ibadah", teacher: "Usth. Siti", className: "Kelas 3" },
];

export const demoPayments = [
  { id: "p1", studentName: "Ahmad Fauzi", type: "spp", amount: 150000, status: "lunas", createdAt: new Date(Date.now() - 1 * 86400000) },
  { id: "p2", studentName: "Siti Aminah", type: "spp", amount: 150000, status: "lunas", createdAt: new Date(Date.now() - 2 * 86400000) },
  { id: "p3", studentName: "M. Rizky", type: "infaq", amount: 50000, status: "lunas", createdAt: new Date(Date.now() - 3 * 86400000) },
  { id: "p4", studentName: "Bilal Ibrahim", type: "spp", amount: 150000, status: "pending", createdAt: new Date(Date.now() - 4 * 86400000) },
  { id: "p5", studentName: "Zahra Humaira", type: "spp", amount: 150000, status: "pending", createdAt: new Date(Date.now() - 5 * 86400000) },
  { id: "p6", studentName: "Aisyah Putri", type: "spp", amount: 150000, status: "lunas", createdAt: new Date(Date.now() - 6 * 86400000) },
  { id: "p7", studentName: "Muhammad Azka", type: "spp", amount: 150000, status: "lunas", createdAt: new Date(Date.now() - 7 * 86400000) },
  { id: "p8", studentName: "Umar Faruq", type: "spp", amount: 150000, status: "lunas", createdAt: new Date(Date.now() - 8 * 86400000) },
];

export const demoHafalan = [
  { id: "h1", studentId: "1", studentName: "Ahmad Fauzi", kelas: "Kelas 1A", items: [
    { title: "An-Naba", status: "selesai" }, { title: "An-Naziat", status: "selesai" },
    { title: "Abasa", status: "selesai" }, { title: "At-Takwir", status: "proses" },
  ]},
  { id: "h2", studentId: "2", studentName: "Fatimah Az-Zahra", kelas: "Kelas 1A", items: [
    { title: "An-Naba", status: "selesai" }, { title: "An-Naziat", status: "selesai" },
    { title: "Abasa", status: "selesai" }, { title: "At-Takwir", status: "selesai" }, { title: "Al-Infitar", status: "proses" },
  ]},
  { id: "h3", studentId: "3", studentName: "Muhammad Rizky", kelas: "Kelas 1B", items: [
    { title: "An-Naba", status: "selesai" }, { title: "An-Naziat", status: "proses" },
  ]},
  { id: "h4", studentId: "4", studentName: "Siti Aminah", kelas: "Kelas 2", items: [
    { title: "An-Naba", status: "selesai" }, { title: "An-Naziat", status: "selesai" },
    { title: "Abasa", status: "selesai" }, { title: "At-Takwir", status: "selesai" },
    { title: "Al-Infitar", status: "selesai" }, { title: "Al-Mutaffifin", status: "selesai" },
  ]},
];

export const demoSubjects = [
  { id: "sub1", name: "Tahsin & Tajwid", average: 88 },
  { id: "sub2", name: "Fiqih Ibadah", average: 82 },
  { id: "sub3", name: "Akhlak & Adab", average: 90 },
  { id: "sub4", name: "Tahfidz Juz 30", average: 76 },
  { id: "sub5", name: "Doa & Hadits", average: 85 },
  { id: "sub6", name: "Bahasa Arab", average: 72 },
];

export const demoFinanceSummary = {
  collected: 1200000,
  pending: 300000,
  expenses: 270000,
  paidCount: 8,
  totalStudents: 12,
};

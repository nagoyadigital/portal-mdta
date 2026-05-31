import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Users
  const adminPassword = await hash("admin123", 12);
  const guruPassword = await hash("guru123", 12);
  const waliPassword = await hash("wali123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@mdta-hm.sch.id" },
    update: {},
    create: {
      name: "Ahmad Fauzi",
      email: "admin@mdta-hm.sch.id",
      password: adminPassword,
      role: "super_admin",
      phone: "+62 812-3456-7890",
      address: "Cipedang Kanem, Kab. Pandeglang",
    },
  });

  const guruZaid = await prisma.user.upsert({
    where: { email: "zaid@mdta-hm.sch.id" },
    update: {},
    create: {
      name: "Ust. Zaid",
      email: "zaid@mdta-hm.sch.id",
      password: guruPassword,
      role: "guru",
      phone: "+62 813-1111-2222",
    },
  });

  const guruSiti = await prisma.user.upsert({
    where: { email: "siti@mdta-hm.sch.id" },
    update: {},
    create: {
      name: "Usth. Siti",
      email: "siti@mdta-hm.sch.id",
      password: guruPassword,
      role: "guru",
      phone: "+62 813-3333-4444",
    },
  });

  const guruSalman = await prisma.user.upsert({
    where: { email: "salman@mdta-hm.sch.id" },
    update: {},
    create: {
      name: "Ust. Salman Al-Farisi",
      email: "salman@mdta-hm.sch.id",
      password: guruPassword,
      role: "guru",
      phone: "+62 813-5555-6666",
    },
  });

  const guruAhmad = await prisma.user.upsert({
    where: { email: "ahmad.guru@mdta-hm.sch.id" },
    update: {},
    create: {
      name: "Ust. Ahmad",
      email: "ahmad.guru@mdta-hm.sch.id",
      password: guruPassword,
      role: "guru",
      phone: "+62 813-7777-8888",
    },
  });

  const waliFauzi = await prisma.user.upsert({
    where: { email: "wali.fauzi@gmail.com" },
    update: {},
    create: {
      name: "Bapak Fauzi",
      email: "wali.fauzi@gmail.com",
      password: waliPassword,
      role: "wali",
      phone: "+62 812-9999-0000",
    },
  });

  const waliAminah = await prisma.user.upsert({
    where: { email: "wali.aminah@gmail.com" },
    update: {},
    create: {
      name: "Ibu Aminah",
      email: "wali.aminah@gmail.com",
      password: waliPassword,
      role: "wali",
      phone: "+62 812-1111-0000",
    },
  });

  // Create Teachers
  const teacherZaid = await prisma.teacher.upsert({
    where: { userId: guruZaid.id },
    update: {},
    create: { userId: guruZaid.id, nip: "198801012020011001" },
  });

  const teacherSiti = await prisma.teacher.upsert({
    where: { userId: guruSiti.id },
    update: {},
    create: { userId: guruSiti.id, nip: "199001012020012001" },
  });

  const teacherSalman = await prisma.teacher.upsert({
    where: { userId: guruSalman.id },
    update: {},
    create: { userId: guruSalman.id, nip: "198501012020011002" },
  });

  const teacherAhmad = await prisma.teacher.upsert({
    where: { userId: guruAhmad.id },
    update: {},
    create: { userId: guruAhmad.id, nip: "198701012020011003" },
  });

  // Create Parents
  const parentFauzi = await prisma.parent.upsert({
    where: { userId: waliFauzi.id },
    update: {},
    create: { userId: waliFauzi.id },
  });

  const parentAminah = await prisma.parent.upsert({
    where: { userId: waliAminah.id },
    update: {},
    create: { userId: waliAminah.id },
  });

  // Create Classes
  const kelas1A = await prisma.class.upsert({
    where: { name: "Kelas 1A" },
    update: {},
    create: { name: "Kelas 1A", level: 1, year: "2024/2025" },
  });

  const kelas1B = await prisma.class.upsert({
    where: { name: "Kelas 1B" },
    update: {},
    create: { name: "Kelas 1B", level: 1, year: "2024/2025" },
  });

  const kelas2 = await prisma.class.upsert({
    where: { name: "Kelas 2" },
    update: {},
    create: { name: "Kelas 2", level: 2, year: "2024/2025" },
  });

  const kelas3 = await prisma.class.upsert({
    where: { name: "Kelas 3" },
    update: {},
    create: { name: "Kelas 3", level: 3, year: "2024/2025" },
  });

  const kelas4 = await prisma.class.upsert({
    where: { name: "Kelas 4" },
    update: {},
    create: { name: "Kelas 4", level: 4, year: "2024/2025" },
  });

  const kelas5 = await prisma.class.upsert({
    where: { name: "Kelas 5" },
    update: {},
    create: { name: "Kelas 5", level: 5, year: "2024/2025" },
  });

  // Create Subjects
  const tahsin = await prisma.subject.upsert({
    where: { code: "TSN" },
    update: {},
    create: { name: "Tahsin & Tajwid", code: "TSN" },
  });

  const fiqih = await prisma.subject.upsert({
    where: { code: "FQH" },
    update: {},
    create: { name: "Fiqih Ibadah", code: "FQH" },
  });

  const tahfidz = await prisma.subject.upsert({
    where: { code: "TFZ" },
    update: {},
    create: { name: "Tahfidz Juz 30", code: "TFZ" },
  });

  const akhlak = await prisma.subject.upsert({
    where: { code: "AKH" },
    update: {},
    create: { name: "Akhlak & Adab", code: "AKH" },
  });

  const doaHadits = await prisma.subject.upsert({
    where: { code: "DHD" },
    update: {},
    create: { name: "Doa & Hadits", code: "DHD" },
  });

  const bahasaArab = await prisma.subject.upsert({
    where: { code: "BAR" },
    update: {},
    create: { name: "Bahasa Arab", code: "BAR" },
  });

  // Create Students
  const studentData = [
    { nis: "2023001", name: "Ahmad Fauzi Al-Ghifari", gender: "L", classId: kelas1A.id, parentId: parentFauzi.id },
    { nis: "2023002", name: "Fatimah Az-Zahra", gender: "P", classId: kelas1A.id, parentId: parentAminah.id },
    { nis: "2023003", name: "Muhammad Rizky", gender: "L", classId: kelas1B.id, parentId: null },
    { nis: "2023004", name: "Siti Aminah", gender: "P", classId: kelas2.id, parentId: null },
    { nis: "2023005", name: "Bilal Ibrahim", gender: "L", classId: kelas2.id, parentId: null },
    { nis: "2023006", name: "Aisyah Putri", gender: "P", classId: kelas3.id, parentId: null },
    { nis: "2023007", name: "Zahra Humaira", gender: "P", classId: kelas3.id, parentId: null },
    { nis: "2023008", name: "Muhammad Azka", gender: "L", classId: kelas4.id, parentId: parentFauzi.id },
    { nis: "2023009", name: "Ahmad Zaki Al-Fatih", gender: "L", classId: kelas1A.id, parentId: null },
    { nis: "2023010", name: "Khadijah Nur", gender: "P", classId: kelas1B.id, parentId: null },
    { nis: "2023011", name: "Umar Faruq", gender: "L", classId: kelas4.id, parentId: null },
    { nis: "2023012", name: "Hafizah Rahmah", gender: "P", classId: kelas5.id, parentId: null },
  ];

  for (const s of studentData) {
    await prisma.student.upsert({
      where: { nis: s.nis },
      update: {},
      create: {
        nis: s.nis,
        name: s.name,
        gender: s.gender,
        classId: s.classId,
        parentId: s.parentId,
      },
    });
  }

  // Create Schedules
  const scheduleData = [
    { day: 1, startTime: "14:00", endTime: "14:45", subjectId: tahsin.id, teacherId: teacherSalman.id, classId: kelas1A.id },
    { day: 1, startTime: "14:45", endTime: "15:30", subjectId: fiqih.id, teacherId: teacherSiti.id, classId: kelas1A.id },
    { day: 1, startTime: "15:30", endTime: "16:15", subjectId: tahfidz.id, teacherId: teacherZaid.id, classId: kelas2.id },
    { day: 1, startTime: "16:15", endTime: "17:00", subjectId: akhlak.id, teacherId: teacherAhmad.id, classId: kelas3.id },
    { day: 2, startTime: "14:00", endTime: "14:45", subjectId: bahasaArab.id, teacherId: teacherSiti.id, classId: kelas1A.id },
    { day: 2, startTime: "14:45", endTime: "15:30", subjectId: tahfidz.id, teacherId: teacherZaid.id, classId: kelas1B.id },
    { day: 2, startTime: "15:30", endTime: "16:15", subjectId: doaHadits.id, teacherId: teacherSalman.id, classId: kelas2.id },
    { day: 3, startTime: "14:00", endTime: "14:45", subjectId: tahsin.id, teacherId: teacherSalman.id, classId: kelas1B.id },
    { day: 3, startTime: "14:45", endTime: "15:30", subjectId: akhlak.id, teacherId: teacherAhmad.id, classId: kelas1A.id },
  ];

  for (const s of scheduleData) {
    await prisma.schedule.upsert({
      where: { day_startTime_classId: { day: s.day, startTime: s.startTime, classId: s.classId } },
      update: {},
      create: s,
    });
  }

  // Create Announcements
  const announcementData = [
    { title: "Libur Semester Ganjil 2024", content: "Sesuai kalender pendidikan, kegiatan belajar mengajar diliburkan mulai tanggal 20 Desember 2024 hingga 5 Januari 2025. Santri diharapkan tetap menjaga hafalan di rumah.", category: "penting", target: "semua" },
    { title: "Rapat Wali Santri Bulanan", content: "Agenda pembahasan pembangunan masjid madrasah tahap 2 dan evaluasi semester. Dilaksanakan hari Sabtu, 2 November 2024 pukul 09:00 WIB.", category: "acara", target: "wali" },
    { title: "Ujian Tengah Semester Ganjil", content: "Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Oktober 2024. Materi ujian mencakup seluruh pelajaran dari awal semester.", category: "akademik", target: "semua" },
    { title: "Pembayaran SPP Bulan November", content: "Batas akhir pembayaran SPP bulan November adalah tanggal 10 November 2024. Pembayaran dapat dilakukan melalui transfer atau langsung ke bendahara.", category: "keuangan", target: "wali" },
  ];

  for (const a of announcementData) {
    await prisma.announcement.create({ data: a });
  }

  // Create sample payments
  const students = await prisma.student.findMany();
  for (const student of students.slice(0, 8)) {
    await prisma.payment.create({
      data: {
        studentId: student.id,
        type: "spp",
        amount: 150000,
        month: 10,
        year: 2024,
        status: "lunas",
        paidAt: new Date(),
      },
    });
  }

  // Create sample hafalan
  const hafalanData = [
    { surah: "An-Naba", status: "selesai", grade: "A" },
    { surah: "An-Naziat", status: "selesai", grade: "A" },
    { surah: "Abasa", status: "selesai", grade: "B" },
    { surah: "At-Takwir", status: "proses", grade: null },
  ];

  const firstStudent = students[0];
  for (const h of hafalanData) {
    await prisma.hafalan.create({
      data: {
        studentId: firstStudent.id,
        type: "quran",
        title: h.surah,
        juz: 30,
        status: h.status,
        grade: h.grade,
      },
    });
  }

  // Create sample attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const student of students.slice(0, 6)) {
    await prisma.studentAttendance.create({
      data: {
        studentId: student.id,
        date: today,
        status: Math.random() > 0.2 ? "hadir" : "sakit",
      },
    });
  }

  // Create CashBook entries
  await prisma.cashBook.createMany({
    data: [
      { type: "masuk", category: "spp", amount: 12450000, description: "Total SPP Oktober 2024" },
      { type: "keluar", category: "operasional", amount: 1500000, description: "Listrik & Air" },
      { type: "keluar", category: "gaji", amount: 1200000, description: "Honor Guru Bulan Oktober" },
      { type: "masuk", category: "infaq", amount: 500000, description: "Infaq Jumat Minggu ke-4" },
    ],
  });

  console.log("✅ Seeding complete!");
  console.log("");
  console.log("📋 Akun Login:");
  console.log("   Admin  : admin@mdta-hm.sch.id / admin123");
  console.log("   Guru   : zaid@mdta-hm.sch.id / guru123");
  console.log("   Wali   : wali.fauzi@gmail.com / wali123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

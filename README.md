# Portal MDTA Hidayatul Mubtadi'in

Platform digital terintegrasi untuk akademik, administrasi, keuangan, dan komunikasi MDTA Hidayatul Mubtadi'in - Yayasan Al-Hijrah Cipedang Kanem.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (via Prisma ORM)
- **Auth**: NextAuth.js v4 (Credentials)
- **Validation**: Zod

## Quick Start

```bash
# Install dependencies
npm install

# Setup database & seed data
npx prisma db push
npm run db:seed

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@mdta-hm.sch.id | admin123 |
| Guru | zaid@mdta-hm.sch.id | guru123 |
| Wali Santri | wali.fauzi@gmail.com | wali123 |

## Struktur Halaman

| Route | Deskripsi |
|-------|-----------|
| `/` | Dashboard Admin |
| `/login` | Halaman Login |
| `/santri` | Data Santri |
| `/santri/kartu` | Kartu Santri Digital |
| `/absensi` | Input Absensi |
| `/absensi/scan` | Scan QR Absensi |
| `/hafalan` | Progress Hafalan |
| `/jadwal` | Jadwal Pelajaran |
| `/pengumuman` | Pengumuman |
| `/keuangan` | Keuangan (SPP, Infaq, Kas) |
| `/penilaian` | Penilaian & Raport |
| `/profil` | Profil Pengguna |
| `/wali` | Portal Wali Santri |

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/dashboard` | Data dashboard |
| GET/POST | `/api/students` | CRUD santri |
| GET/PUT/DELETE | `/api/students/[id]` | Detail santri |
| GET/POST | `/api/attendance` | Absensi |
| GET/POST | `/api/hafalan` | Hafalan |
| GET/POST | `/api/payments` | Pembayaran |
| GET/POST | `/api/grades` | Penilaian |
| GET/POST | `/api/announcements` | Pengumuman |
| GET | `/api/schedules` | Jadwal |
| GET | `/api/classes` | Daftar kelas |

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run db:push    # Sync schema ke database
npm run db:seed    # Seed data awal
npm run db:studio  # Buka Prisma Studio (GUI database)
npm run db:reset   # Reset & re-seed database
```

## Database Schema

- **User** - Akun pengguna (admin, guru, wali)
- **Teacher** - Data guru
- **Student** - Data santri
- **Parent** - Data wali santri
- **Class** - Kelas
- **Subject** - Mata pelajaran
- **Schedule** - Jadwal pelajaran
- **StudentAttendance** - Absensi santri
- **TeacherAttendance** - Absensi guru
- **Hafalan** - Progress hafalan (Quran, Doa, Hadits)
- **Grade** - Nilai (harian, UTS, UAS)
- **Payment** - Pembayaran (SPP, Infaq)
- **CashBook** - Buku kas
- **Announcement** - Pengumuman

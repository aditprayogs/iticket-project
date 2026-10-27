# 🎫 ITicket — IT Support & Ticketing Management Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18%2B-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3%2B-38bdf8.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-00758f.svg)](https://www.mysql.com/)

**ITicket** adalah aplikasi manajemen tiket IT (*IT Helpdesk*) berbasis web full-stack yang dirancang untuk mengotomatisasi proses pelaporan, penanganan, pemantauan, dan analisis kendala teknis perangkat keras maupun perangkat lunak di lingkungan perusahaan.

Aplikasi ini menyediakan sistem penanganan tiket terpusat dengan menerapkan **Role-Based Access Control (RBAC)** untuk tiga jenis pengguna, yaitu **Employee**, **IT Support**, dan **Admin**. Fitur yang tersedia mencakup pengajuan tiket, pelacakan status, diskusi antara pelapor dan teknisi, notifikasi, serta dashboard analitik untuk memantau performa layanan berdasarkan *Service Level Agreement* (SLA).

---

## 🚀 Fitur Utama

### 👤 1. Employee (Pelapor)

- **Pengajuan Tiket:** Membuat tiket laporan kendala IT dengan informasi judul, deskripsi, kategori masalah, dan tingkat prioritas.
- **Upload Lampiran:** Mengunggah bukti berupa gambar atau dokumen pendukung dengan ukuran maksimal 5 MB.
- **Tracking Status:** Memantau perkembangan penanganan tiket, mulai dari pengajuan hingga penyelesaian.
- **Diskusi Dua Arah:** Berkomunikasi dengan teknisi IT melalui halaman detail tiket.
- **Riwayat Tiket:** Melihat daftar tiket yang pernah dibuat beserta status penanganannya.

### 🛠️ 2. IT Support (Teknisi)

- **Ticket Queue:** Melihat dan mengelola antrean tiket yang masuk.
- **Penugasan Tiket:** Mengambil alih atau menerima penugasan tiket untuk ditangani.
- **Pembaruan Status:** Memperbarui status tiket, seperti `Open`, `In Progress`, dan `Resolved`, sesuai dengan status yang didukung sistem.
- **Catatan Penyelesaian:** Menambahkan catatan solusi atau *resolution notes* setelah masalah berhasil ditangani.
- **Notifikasi Tiket Baru:** Menerima pemberitahuan ketika terdapat tiket baru yang membutuhkan penanganan.
- **Diskusi dengan Pelapor:** Memberikan tanggapan dan meminta informasi tambahan kepada pelapor melalui halaman detail tiket.

### 👨‍💼 3. Admin (Pengelola Sistem)

- **Manajemen Pengguna:** Membuat, melihat, dan mengelola akun Employee serta IT Support.
- **Manajemen Kategori:** Mengelola kategori masalah untuk membantu pengelompokan tiket.
- **Manajemen Aset IT:** Mengelola data aset teknologi informasi perusahaan.
- **Dashboard Analitik:** Menampilkan statistik tiket dan ringkasan performa layanan.
- **Monitoring SLA:** Memantau rata-rata durasi penyelesaian tiket dalam satuan jam.
- **Grafik Tren Tiket:** Menampilkan tren jumlah tiket selama tujuh hari terakhir menggunakan *bar chart*.
- **Distribusi Kategori:** Menampilkan distribusi tiket berdasarkan kategori menggunakan *pie chart*.
- **Ekspor Laporan PDF:** Menghasilkan laporan rekapitulasi tiket berdasarkan rentang tanggal tertentu.

---

## 🛠️ Tech Stack

ITicket dikembangkan menggunakan teknologi berikut:

| Komponen | Teknologi | Fungsi |
|---|---|---|
| Frontend | React.js + Vite | Membangun antarmuka aplikasi |
| Styling | Tailwind CSS | Mengatur tampilan dan desain antarmuka |
| Icons | Lucide React | Menyediakan ikon antarmuka |
| HTTP Client | Axios | Menghubungkan frontend dengan backend |
| Data Visualization | Recharts | Menampilkan grafik dan statistik |
| Backend | Node.js | Menjalankan lingkungan server |
| Web Framework | Express.js | Mengelola API dan routing backend |
| File Upload | Multer | Menangani unggahan lampiran |
| Database | MySQL | Menyimpan data aplikasi |
| Authentication | JSON Web Token (JWT) | Mengelola autentikasi berbasis token |
| Password Security | bcryptjs | Melakukan hashing kata sandi |

---

## 📁 Struktur Proyek

Berikut contoh struktur direktori proyek ITicket:

```text
iticket-project/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── database/
│   └── iticket_db.sql
│
├── .gitignore
├── LICENSE
└── README.md
```

> **Catatan:** Struktur direktori di atas merupakan contoh referensi. Sesuaikan nama folder dan file dengan struktur aktual proyek yang digunakan.

---

## ⚙️ Panduan Instalasi dan Menjalankan Aplikasi

### Prasyarat

Pastikan perangkat telah memiliki perangkat lunak berikut:

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- [MySQL Server](https://www.mysql.com/) versi 8.0 atau lebih baru.
- npm, yang biasanya sudah disertakan bersama Node.js.
- Git untuk mengkloning repositori.
- MySQL Workbench, phpMyAdmin, atau DBeaver untuk mengelola database.
- Browser modern seperti Google Chrome atau Microsoft Edge.

### 1. Clone Repositori

Buka terminal, kemudian jalankan perintah berikut:

```bash
git clone https://github.com/username/iticket-project.git
cd iticket-project
```

> Ganti `username/iticket-project` dengan alamat repositori GitHub milik Anda.

### 2. Konfigurasi Database

Buat database MySQL dengan nama `iticket_db`.

Jalankan perintah SQL berikut:

```sql
CREATE DATABASE iticket_db;
```

Jika proyek menyediakan file SQL, impor file tersebut ke database `iticket_db` untuk membuat tabel dan struktur data yang diperlukan.

Contoh lokasi file SQL:

```text
database/iticket_db.sql
```

Pastikan nama database, tabel, dan kolom sesuai dengan implementasi backend.

### 3. Konfigurasi Backend

Masuk ke direktori backend:

```bash
cd backend
npm install
```

Buat file `.env` di dalam direktori `backend`, kemudian isi dengan konfigurasi berikut:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=iticket_db

JWT_SECRET=ganti_dengan_secret_yang_kuat_dan_acak
```

Sesuaikan konfigurasi database dengan pengaturan MySQL di perangkat Anda.

**Penting:** Ganti nilai `JWT_SECRET` dengan secret acak yang kuat. Jangan membagikan file `.env` atau mengunggahnya ke repositori publik.

Jalankan backend menggunakan perintah yang sesuai dengan konfigurasi `package.json`.

Jika tersedia script `dev`:

```bash
npm run dev
```

Jika hanya tersedia script `start`:

```bash
npm start
```

Apabila konfigurasi backend sudah benar, server akan berjalan pada port yang ditentukan, yaitu port `5000` pada contoh konfigurasi di atas.

### 4. Konfigurasi Frontend

Buka terminal baru, kemudian masuk ke direktori frontend dari root proyek:

```bash
cd frontend
npm install
```

Buat file `.env` di dalam direktori `frontend`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Pastikan URL tersebut sesuai dengan alamat API backend yang digunakan oleh aplikasi.

Jalankan frontend:

```bash
npm run dev
```

Vite biasanya menjalankan aplikasi pada alamat berikut:

**http://localhost:5173**

Buka alamat tersebut melalui browser untuk mengakses aplikasi ITicket.

### 5. Menjalankan Aplikasi

Pastikan backend dan frontend berjalan secara bersamaan.

| Komponen | Alamat | Keterangan |
|---|---|---|
| Frontend | `http://localhost:5173` | Antarmuka pengguna |
| Backend | `http://localhost:5000` | Server API |
| Database | `localhost:3306` | Server MySQL |

Alamat dan port di atas merupakan konfigurasi contoh. Nilai aktual mengikuti konfigurasi proyek masing-masing.

---

## 🔐 Hak Akses dan Autentikasi

ITicket menerapkan mekanisme autentikasi dan otorisasi berbasis peran (*Role-Based Access Control* atau RBAC).

### Employee

- Dapat melakukan registrasi melalui halaman registrasi publik.
- Dapat membuat tiket laporan IT.
- Dapat melihat dan memantau tiket miliknya.
- Dapat berkomunikasi dengan IT Support melalui tiket yang dapat diaksesnya.

### IT Support

- Akun dibuat atau dikelola oleh Admin.
- Dapat melihat tiket yang menjadi kewenangannya.
- Dapat memperbarui status dan menambahkan catatan penyelesaian.
- Dapat berkomunikasi dengan pelapor sesuai hak akses yang diberikan.

### Admin

- Akun dibuat melalui mekanisme administratif yang aman.
- Dapat mengelola akun pengguna.
- Dapat mengelola master data kategori dan aset IT.
- Dapat mengakses dashboard analitik dan laporan sesuai kewenangannya.

**Catatan keamanan:** Registrasi publik sebaiknya hanya mengizinkan pembuatan akun Employee. Penetapan peran Admin dan IT Support harus dilakukan melalui mekanisme yang terlindungi di sisi backend, bukan berdasarkan input peran yang dikirimkan pengguna.

---

## 📊 Dashboard dan Monitoring SLA

Dashboard ITicket dirancang untuk membantu Admin memantau kondisi layanan IT secara terpusat.

Informasi yang dapat ditampilkan meliputi:

- **Total Tiket:** Jumlah keseluruhan tiket yang tercatat.
- **Tiket Terbuka:** Jumlah tiket yang masih menunggu penanganan.
- **Tiket Dalam Proses:** Jumlah tiket yang sedang ditangani oleh teknisi.
- **Tiket Selesai:** Jumlah tiket yang telah diselesaikan.
- **Rata-Rata Waktu Penyelesaian:** Durasi rata-rata dari waktu tiket dibuat hingga diselesaikan.
- **Tren Tiket:** Grafik jumlah tiket selama tujuh hari terakhir.
- **Distribusi Kategori:** Grafik perbandingan tiket berdasarkan kategori masalah.

Perhitungan SLA harus menggunakan definisi waktu mulai dan waktu selesai yang konsisten. Jika sistem belum menerapkan target SLA formal, metrik durasi penyelesaian sebaiknya ditampilkan sebagai statistik waktu penyelesaian, bukan sebagai indikator kepatuhan SLA.

---

## 🛡️ Keamanan Aplikasi

Aspek keamanan yang perlu diterapkan dalam pengembangan ITicket meliputi:

- **Password Hashing:** Menyimpan kata sandi dalam bentuk hash menggunakan `bcryptjs`.
- **JWT Authentication:** Memvalidasi identitas pengguna melalui token autentikasi.
- **Role-Based Authorization:** Membatasi akses API berdasarkan peran pengguna.
- **Input Validation:** Memvalidasi data yang dikirimkan melalui form dan API.
- **Upload Validation:** Membatasi jenis dan ukuran file lampiran.
- **SQL Injection Prevention:** Menggunakan prepared statements atau parameterized queries.
- **Environment Variables:** Menyimpan kredensial database dan secret di dalam file `.env`.
- **Access Control:** Memastikan pengguna hanya dapat mengakses tiket dan data sesuai kewenangannya.

Implementasi dan efektivitas setiap kontrol keamanan harus diverifikasi berdasarkan kode aplikasi yang sebenarnya.

---

## 🧪 Pengujian Aplikasi

Sebelum digunakan, lakukan pengujian terhadap alur utama aplikasi berikut:

1. Registrasi akun Employee.
2. Login dan logout pengguna.
3. Pembuatan tiket dengan kategori dan prioritas berbeda.
4. Unggah lampiran dengan ukuran dan jenis file yang diizinkan.
5. Pelacakan status tiket oleh Employee.
6. Penugasan tiket dan pembaruan status oleh IT Support.
7. Pengiriman komentar atau diskusi pada tiket.
8. Pembatasan akses berdasarkan peran pengguna.
9. Pengelolaan akun dan master data oleh Admin.
10. Validasi data pada dashboard dan laporan PDF.

Pengujian perlu mencakup skenario berhasil, data tidak valid, serta percobaan akses tanpa izin.

---

## 🔮 Pengembangan Selanjutnya

Beberapa fitur yang dapat dipertimbangkan untuk pengembangan ITicket berikutnya:

- Notifikasi melalui email.
- Penerapan target SLA dan indikator tiket yang mendekati tenggat.
- Riwayat perubahan status dan audit log.
- Filter, pencarian, dan pagination tiket.
- Dashboard analitik dengan filter periode dan kategori.
- Pengujian otomatis untuk API dan komponen frontend.
- Deployment ke server agar aplikasi dapat diakses melalui jaringan perusahaan.

---

## 📝 Lisensi

Proyek ITicket ditujukan untuk pembelajaran dan pengembangan sistem IT Helpdesk.

Proyek ini menggunakan lisensi MIT apabila file `LICENSE` yang disertakan benar-benar berisi ketentuan lisensi MIT. Silakan lihat file `LICENSE` pada repositori untuk informasi lengkap mengenai hak penggunaan dan distribusi.

---

## 👨‍💻 Kontribusi

Kontribusi untuk pengembangan ITicket dapat dilakukan melalui proses berikut:

1. Fork repositori.
2. Buat branch baru untuk perubahan yang akan dilakukan.
3. Implementasikan perubahan dan lakukan pengujian.
4. Commit perubahan dengan pesan yang jelas.
5. Ajukan Pull Request untuk ditinjau.

Pastikan perubahan tidak menyertakan kredensial, token, atau informasi sensitif lainnya.

---

**ITicket — Simplifying IT Support, One Ticket at a Time.** 🎫

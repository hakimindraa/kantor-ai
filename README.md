# Virtual AI Newsroom HQ 📰⚡

> **Interactive 3D Virtual Office & Autonomous AI Newsroom Simulation**  
> Menggabungkan visualisasi diorama arsitektural 3D bergaya **Minimalist Industrial Art-Toy** dengan otomasi redaksi berita end-to-end bertenaga kecerdasan buatan.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.8-purple?style=flat-square)](https://docs.pmnd.rs/react-three-fiber)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand_5-orange?style=flat-square)](https://github.com/pmndrs/zustand)

---

## 🏢 Gambaran Umum Proyek

**Virtual AI Newsroom HQ** adalah simulasi kantor redaksi berita virtual interaktif 3D yang menggambarkan alur kerja pabrik konten otomatis (*automated journalism pipeline*). Seluruh agen AI digambarkan dalam wujud avatar balok 3D ala *Roblox Art-Toy* yang hidup, memiliki jadwal kerja (*working* di workstation PC) dan waktu istirahat (*chilling* di breakroom kafe **"Kopi Tarak"**).

Sistem ini memvisualisasikan bagaimana draf berita mentah di-scrape, ditulis, dioptimalkan grafisnya, dijadwalkan, diindeks ke search engine, dan disetujui lewat bot Telegram secara real-time.

---

## ✨ Fitur-Fitur Unggulan

### 1. 🏗️ Lingkungan Kantor 3D Minimalist Industrial (Diorama Isometric)
- **Desain Presisi Arsitektural**: Sudut tajam modern, material matte slate/charcoal bertekstur, pencahayaan daylight studio netral dengan bayangan arsitektur tegas tanpa efek blur berlebihan.
- **Zona Kantor Terpadu**:
  - **Open Office Workstation Bay**: Meja pulau berhadapan (Baris 1 & Baris 2) berkapasitas 8 terminal kerja lengkap dengan PC Tower, keyboard, mousepad, partisi akustik slate, dan **monitor LCD interaktif** yang menampilkan antarmuka live telemetry sesuai tugas masing-masing agen.
  - **DevOps Server Bay (Sentry)**: Tiga rak server industri 42U dengan lampu indikator status berkedip dan sirkulasi pembuangan panas.
  - **Bar Breakroom "Kopi Tarak"**: Area dapur kafe artisanal dengan plang neon kayu gantung *"KOPI TARAK"*, mesin espresso krom multi-head, penggiling kopi (*grinder*), etalase pastry, kursi bar (*barstools*), meja santai kafe, dispenser air, dan kulkas dua pintu.
  - **Bang Tarak (The AI Barista)**: Karakter barista interaktif berbaju celemek toska yang aktif meracik teh dan kopi tarik berbusa di balik meja bar.

---

### 2. 🤖 Roster 7 AI Agent + Barista (Roblox Art-Toy R6)
Setiap agen memiliki siluet karakter balok klasik yang unik, warna pakaian soft-bright bernuansa art-toy, warna kulit vinyl peach hangat (`#FDE2CA`), balon pikiran dinamis (*floating thought bubble*), dan nametag status:

| Agen | Peran & Departemen | Kostum & Ciri Khas | Tugas Otomasi |
| :--- | :--- | :--- | :--- |
| **SCOUT** | **News Hunter**<br>Editorial Intelligence | Honey Amber (`#F59E0B`), Topi Fedora, Rompi Krim | Memindai 48 RSS feeds nasional/global, deduplikasi berita mentah |
| **SCRIBE** | **Jurnalis AI**<br>Editorial Content | Sage Mint (`#34D399`), Kacamata Arsitek, Dasi Zamrud | Menulis naskah 5W+1H (420 kata) via Gemini 3.8 Flash & SEO internal link |
| **PIXEL** | **Redaktur Foto**<br>Multimedia & Design | Coral Rose (`#FB7185`), Topi Streetwear, Saku Pastel | Auto-cover scraper, kompresi WebP < 100 KB (-97%), ImgBB CDN |
| **CHRONOS** | **Manajer Antrean**<br>Publishing Operations | Sky Cerulean (`#38BDF8`), Cyber Visor Bercahaya | Mengatur Waterfall Queue Pacing dengan jeda 45–60 menit cegah spam |
| **RADAR** | **SEO Specialist**<br>Search Optimization | Lilac Violet (`#C084FC`), Headset Antena Telemetri | Instant ping ke Google Indexing API & Bing IndexNow, auto-update sitemap |
| **SENTRY** | **DevOps & IT**<br>Infrastructure | Cyber Lime (`#84CC16`), Tactical Vest, Helm Stealth | Memantau Neon Postgres Pooler (22ms), VPS keepalive & cron auto-purge |
| **HERMES** | **Telegram Liaison**<br>Distribution & Alerts | Tangerine Orange (`#FB923C`), Topi Kurir, Selempang Kulit | Mengirimkan laporan instan & tombol approval ke smartphone Pemred via Telegram |
| **BANG TARAK** | **Head Barista**<br>Kopi Tarak Breakroom | Artisanal Teal (`#0D9488`), Celemek Barista, Topi Kopi | Meracik kopi tarik hangat untuk tim redaksi yang sedang istirahat |

---

### 3. 🎮 Navigasi Kamera Bebas & Cerdas (Smart Pan & Orbit)
- **Dual Interaction Mode**:
  - **Mode GESER (Pan Mode - Default)**: Klik kiri dan seret mouse (atau usap 1 jari pada layar sentuh) langsung **menggeser tampilan kantor ke kiri, kanan, atas, dan bawah** di bidang layar (*screen space panning*).
  - **Mode PUTAR (Orbit Mode)**: Klik kiri dan seret untuk memutar sudut pandang 3D secara bebas mengelilingi ruangan.
- **Tombol Panah Keyboard (`←`, `↑`, `→`, `↓`)**: Tekan panah keyboard kapan saja untuk menggeser tampilan kantor dengan mulus tanpa perlu mengklik mouse.
- **Keyboard Zoom (`+`, `-`) & Scroll Wheel**: Memperbesar dan memperkecil pandangan dengan radius jarak terkontrol (`2.5` s/d `60` unit).
- **Sensitivitas Geser Adaptif**: Ketika berada dalam posisi *zoom in* sangat dekat, kecepatan geser otomatis menjadi halus dan presisi. Saat *zoom out*, kecepatan geser meningkat agar mudah menjelajah seluruh gedung.
- **On-Screen Navigation Gizmo**: Widget D-Pad industrial di pojok kanan bawah dilengkapi tombol panah arah (`▲`, `▼`, `◀`, `▶`), tombol reset (`⟲`), dan pengatur zoom (`+`, `−`) dengan dukungan *press-and-hold*.
- **Quick Preset Views**: Tombol akses cepat ke sudut kamera *Isometric*, *Meja PC*, *Breakroom*, *Server*, dan *Focus Selected Agent*.

---

### 4. 🕹️ Dual Character Movement System
- **Mode A (Autonomous AI Simulation)**: Agen bekerja secara mandiri di meja kerja (duduk tegak, kaki menempel di kursi, tangan mengetik keyboard) atau bersantai di kafe (Pixel duduk di barstool, yang lain di meja makan breakroom sambil minum kopi).
- **Mode B (Manual WASD Player Rig)**: Pengguna dapat mengambil alih kendali avatar agen mana saja untuk berjalan berkeliling kantor menggunakan tombol **W, A, S, D** dengan animasi langkah kaki, ayunan tangan, dan opsi **Chase Cam (Camera Follow)**.

---

### 5. 📊 Dashboard Manajemen Lengkap Terintegrasi
1. **Office Statistics HUD**: 4 kartu metrik live (Active Agents, Articles Today, Next Publish, Server Latency).
2. **Agent Detail Panel**: Telemetri mendalam saat agen diklik (tugas saat ini, aktivitas live, progress bar, metrik performa, tombol *Brief Agent*, *Kendalikan Karakter (WASD)*, dan *Toggle Kerja/Nyantai*).
3. **Interactive Briefing Modal**: Form instruksi manual untuk menyuntikkan prompt atau direktif darurat ke agen AI.
4. **Article Production Pipeline (Kanban)**: Papan kanban 5 tahap (SCOUT → SCRIBE → PIXEL → CHRONOS → RADAR & HERMES) lengkap dengan tombol *Advance Stage* dan animasi konfeti perayaan saat berita terbit.
5. **Live Activity Stream**: Feed log aktivitas real-time dengan filter departemen, tingkat urgensi (info/success/warning), dan tombol jeda stream.
6. **Office Analytics View**: Visualisasi grafik distribusi rilis berita per jam, sebaran rubrik artikel, dan throughput performa agen.
7. **Backend Integration View**: Monitor status arsitektur 15 modul backend (API routes, server actions, database connection pooler, background cron jobs).
8. **Admin Overrides (Mandor Controls)**: Sakelar kontrol untuk mengubah model AI (Gemini 3.8 Flash / Claude / Groq), interval Waterfall Queue, target kompresi WebP, dan webhook integrasi.

---

## 🛠️ Arsitektur Teknologi

```
virtual-ai-newsroom-hq/
├── src/
│   ├── app/                    # Next.js 16 App Router & Route Handlers
│   │   ├── api/
│   │   │   ├── cron/           # Auto-purge & Waterfall publisher cron endpoints
│   │   │   ├── incoming-news/  # RSS wire webhook ingestion
│   │   │   └── live-status/    # Live database connection & telemetry
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main diorama & dashboard container
│   ├── components/             # React UI Components
│   │   ├── activity/           # Live streaming log view
│   │   ├── agents/             # Agent directory & performance cards
│   │   ├── analytics/          # Visual data analytics & charts
│   │   ├── backend/            # Backend architecture monitor & test runner
│   │   ├── dashboard/          # Stats overview, agent info panel, brief modal
│   │   ├── layout/             # Navigation bars & sidebar navigation
│   │   ├── office/             # Office3DCanvas & CameraNavGizmo (D-Pad)
│   │   ├── pipeline/           # Kanban production pipeline with confetti
│   │   └── settings/           # Admin override switches (Mandor Controls)
│   ├── services/               # Mock data & Neon DB integration
│   │   └── mock/               # Mock agents, activities, articles, & analytics
│   ├── store/                  # Zustand global state (officeStore.ts)
│   ├── three/                  # 3D Scene Components (Three.js & R3F)
│   │   ├── BaristaCharacter.tsx  # Bang Tarak Roblox rig & animation
│   │   ├── CameraController.tsx  # Dynamic pan/orbit & keyboard arrow listener
│   │   ├── CharacterController.tsx# WASD manual movement & collision bounds
│   │   ├── FurnitureSet.tsx      # Desks, chairs, PC monitors, servers, cafe
│   │   ├── OfficeFloor.tsx       # Industrial tile floor & zone boundaries
│   │   ├── OfficeScene.tsx       # Studio lighting, shadows, & diorama assembly
│   │   ├── OfficeWallsAndRooms.tsx# Low diorama perimeter walls
│   │   └── RobloxCharacter.tsx   # Art-toy agent avatars, outfits & poses
│   └── types/                  # TypeScript definitions (agent, office, pipeline)
├── public/                     # Static media & assets
└── package.json
```

---

## 🚀 Panduan Memulai

### Prasyarat
- **Node.js**: Versi `18.18.0` atau yang lebih baru (disarankan `Node.js 20+ LTS`).
- **NPM**: Versi `9+`.
- Browser dengan dukungan **WebGL / WebGPU Hardware Acceleration** (Google Chrome, Microsoft Edge, Brave, Firefox, atau Safari).

### 1. Klon Repositori
```bash
git clone https://github.com/username/kantorai.git
cd kantorai
```

### 2. Pasang Dependencies
Gunakan flag `--legacy-peer-deps` untuk kompatibilitas optimal dengan pustaka Three.js / React 19:
```bash
npm install --legacy-peer-deps
```

### 3. Konfigurasi Environment Variables (Opsional)
Aplikasi ini sudah dilengkapi sistem simulasi mandiri (*built-in mock dataset*) dan dapat langsung dijalankan tanpa konfigurasi tambahan (*zero-config*).

Jika Anda ingin menghubungkan ke database atau integrasi eksternal sendiri, salin file template `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu isi variabel yang dibutuhkan sesuai lingkungan Anda secara lokal (file `.env.local` sudah terlindungi dan tidak akan terunggah ke repositori publik).

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda di **[http://localhost:3000](http://localhost:3000)**.

### 5. Kompilasi & Build Produksi
```bash
npm run build
npm run start
```

---

## ⌨️ Panduan Kontrol & Pintasan Keyboard

| Tombol / Aksi | Fungsi |
| :--- | :--- |
| **Klik Kiri + Seret (Drag)** | **Menggeser (Pan)** kamera ke kiri, kanan, atas, bawah *(di Mode Geser)* |
| **Panah Keyboard (`←`, `↑`, `→`, `↓`)** | Menggeser kamera secara langsung ke segala arah |
| **Scroll Wheel / Cubit Layar** | Memperbesar (*Zoom In*) atau memperkecil (*Zoom Out*) |
| **Tombol `+` / `-`** | Zoom in / Zoom out alternatif via keyboard |
| **Klik Kanan + Seret** | Menggeser kamera (*Pan*) secara bebas di mode apa pun |
| **Tombol `PUTAR 🔄` / `GESER ✋`** | Beralih antara mode geser layar dan mode rotasi sudut 3D |
| **Tombol D-Pad `▲ ▼ ◀ ▶`** | Navigasi geser di pojok kanan bawah (bisa ditekan & tahan) |
| **Tombol `⟲`** | Mengembalikan posisi dan sudut kamera ke tampilan default (*Isometric*) |
| **Tombol W, A, S, D** | Menggerakkan karakter avatar saat **Mode Manual WASD** aktif |
| **Klik Pada Agen** | Membuka panel telemetri informasi agen & fokus kamera |
| **Klik Pada Bang Tarak** | Memesan kopi tarik spesial di Breakroom Kopi Tarak |

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi **MIT License** — bebas digunakan, dikembangkan, dan dimodifikasi untuk kebutuhan riset, portofolio, dan otomasi redaksi AI.

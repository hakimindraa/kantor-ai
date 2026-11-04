import { AgentActivityLog, AgentId } from '@/types/agent';

export const INITIAL_LOGS: AgentActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '20:30:15',
    agentId: 'sentry',
    agentName: 'SENTRY',
    agentColor: '#EF4444',
    category: 'infrastructure',
    level: 'info',
    message: 'Memeriksa kesehatan server & Neon Postgres Connection Pooler. Latency normal 24ms.'
  },
  {
    id: 'log-2',
    timestamp: '20:30:10',
    agentId: 'radar',
    agentName: 'RADAR',
    agentColor: '#10B981',
    category: 'seo',
    level: 'success',
    message: 'Mengirim sinyal indexing ke Google Indexing API & Bing IndexNow untuk 2 artikel terbaru.'
  },
  {
    id: 'log-3',
    timestamp: '20:29:55',
    agentId: 'hermes',
    agentName: 'HERMES',
    agentColor: '#06B6D4',
    category: 'distribution',
    level: 'info',
    message: 'Mengirim notifikasi Telegram ke channel @RedaksiAINewsroom: "Artikel #210 Terbit".'
  },
  {
    id: 'log-4',
    timestamp: '20:29:40',
    agentId: 'chronos',
    agentName: 'CHRONOS',
    agentColor: '#3B82F6',
    category: 'publishing',
    level: 'success',
    message: 'Menjadwalkan artikel "Revolusi AI di Sektor Perbankan" untuk rilis otomatis pukul 20:45.'
  },
  {
    id: 'log-5',
    timestamp: '20:29:20',
    agentId: 'pixel',
    agentName: 'PIXEL',
    agentColor: '#F59E0B',
    category: 'multimedia',
    level: 'info',
    message: 'Mengoptimasi gambar menjadi WebP (hemat 82% ukuran file) dan upload ke CDN ImgBB.'
  },
  {
    id: 'log-6',
    timestamp: '20:28:50',
    agentId: 'scribe',
    agentName: 'SCRIBE',
    agentColor: '#8B5CF6',
    category: 'editorial',
    level: 'info',
    message: 'Menyusun artikel editorial "Infrastruktur Cloud AI Indonesia 2026", draft selesai 680 kata.'
  },
  {
    id: 'log-7',
    timestamp: '20:28:30',
    agentId: 'scout',
    agentName: 'SCOUT',
    agentColor: '#4CC9F0',
    category: 'fetch',
    level: 'info',
    message: 'Memantau sumber berita nasional & mendeteksi breaking topic: "Regulasi Terbaru Kecerdasan Artifisial".'
  },
  {
    id: 'log-8',
    timestamp: '20:27:50',
    agentId: 'sentry',
    agentName: 'SENTRY',
    agentColor: '#EF4444',
    category: 'infrastructure',
    level: 'success',
    message: 'Eksekusi cron auto-purge selesai: membersihkan 240 MB cache temporary tanpa downtime.'
  }
];

export const SIMULATION_TEMPLATES: Record<AgentId, string[]> = {
  scout: [
    'Memindai feed RSS Antara & Reuters, menemukan 3 topik tren baru.',
    'Deduplikasi konten: artikel duplikat berhasil disaring otomatis.',
    'Mendeteksi lonjakan trending topic terkait "Ekonomi Digital Nasional".',
    'Menghubungi endpoint /api/incoming-news untuk sinkronisasi webhook sumber berita.'
  ],
  scribe: [
    'Menyusun lead paragraph berbasis 5W+1H untuk berita breaking news.',
    'Mengoptimalkan tag heading H2 dan H3 agar ramah mesin pencari.',
    'Menghasilkan 3 variasi judul berita berdaya pikat tinggi dengan skor SEO 96.',
    'Melakukan auto-paraphrase dan verifikasi referensi kutipan narasumber.'
  ],
  pixel: [
    'Auto-scraping featured image resolusi 1920x1080 dari sumber terpercaya.',
    'Mengonversi gambar JPEG (1.8 MB) menjadi WebP (84 KB) tanpa kompresi visual kentara.',
    'Mengaplikasikan watermark resmi portal berita di pojok kanan bawah.',
    'Mengunggah gambar ke ImgBB CDN dan mengembalikan URL HTTPS yang aman.'
  ],
  chronos: [
    'Menghitung kepadatan trafik pembaca, menyetel delay publikasi 12 menit.',
    'Menggeser slot antrean artikel #212 agar berjarak seimbang dari rilis sebelumnya.',
    'Memeriksa status trigger cron /api/cron/jurnalis-publisher: Siap berjalan.',
    'Mengeksekusi publikasi instan untuk breaking news berprioritas tinggi.'
  ],
  hermes: [
    'Mengirim tombol inline approval ke grup kurasi Telegram redaktur.',
    'Menerima konfirmasi persetujuan penerbitan artikel #211 via webhook Telegram.',
    'Mendistribusikan ringkasan berita 2 kalimat ke saluran publik pembaca.',
    'Melaporkan metrik respon pembaca Telegram: 1.4k impresi dalam 5 menit.'
  ],
  radar: [
    'Memperbarui news-sitemap.xml dan rss.xml dengan item berita termutakhir.',
    'Mengirim permintaan index batch ke Google Indexing API (HTTP 200 OK).',
    'Memeriksa crawler log: Googlebot mengunjungi URL baru dalam 18 detik.',
    'Memantau performa kata kunci pencarian organik di dasbor analitik.'
  ],
  sentry: [
    'Ping Neon Postgres connection pooler: latency stabil di 22ms.',
    'Pemeriksaan pemakaian CPU server: 14% dari batas maksimum.',
    'Memeriksa rotasi log dan membersihkan file temp usang via /api/cron/auto-purge.',
    'SSL certificate dan header keamanan HSTS terverifikasi valid 100%.'
  ],
  receptionist: [
    'Mencatat akses tamu masuk ke sistem Virtual AI Newsroom HQ.',
    'Menghubungkan inquiry mitra pers ke workstation Pemimpin Redaksi.'
  ],
  chief: [
    'Meninjau ringkasan performa editorial harian: 18 artikel terpublikasi.',
    'Memberikan persetujuan untuk liputan khusus teknologi kecerdasan buatan.'
  ]
};


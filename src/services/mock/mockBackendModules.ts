import { BackendModuleDef } from '@/types/backend';

export const BACKEND_MODULES: BackendModuleDef[] = [
  {
    id: 'mod-1',
    name: 'Incoming News Webhook & RSS Scraper',
    type: 'api_route',
    pathOrIdentifier: '/api/incoming-news',
    associatedAgent: 'SCOUT',
    status: 'simulated',
    description: 'Endpoint penerima payload artikel masuk dari RSS feeds, webhooks pihak ketiga, dan feed parser.',
    lastExecuted: '20 detik lalu',
    latencyMs: 42,
    environmentVar: 'NEWS_FEED_API_KEY',
    samplePayload: {
      source: 'antara-news',
      category: 'teknologi',
      rawTitle: 'Perkembangan AI Nasional',
      rawContent: 'Pemerintah terus mendorong implementasi AI di sektor pelayanan publik...'
    }
  },
  {
    id: 'mod-2',
    name: 'Jurnalis Admin Portal',
    type: 'server_action',
    pathOrIdentifier: '/admin/jurnalis',
    associatedAgent: 'SCRIBE',
    status: 'simulated',
    description: 'Panel antarmuka kurasi editorial untuk meninjau dan mengedit draf sebelum dijadwalkan.',
    lastExecuted: '1 menit lalu',
    latencyMs: 18,
    environmentVar: 'ADMIN_SESSION_SECRET'
  },
  {
    id: 'mod-3',
    name: 'Generate Jurnalis Draft Action',
    type: 'server_action',
    pathOrIdentifier: 'generateJurnalisDraftAction',
    associatedAgent: 'SCRIBE',
    status: 'simulated',
    description: 'Server action yang memanggil LLM untuk memparaphrase teks, menstrukturkan 5W+1H, dan menata subjudul.',
    lastExecuted: '3 menit lalu',
    latencyMs: 1250,
    environmentVar: 'AI_MODEL_API_KEY'
  },
  {
    id: 'mod-4',
    name: 'Image Scraper Service',
    type: 'lib_service',
    pathOrIdentifier: 'lib/image-scraper.ts',
    associatedAgent: 'PIXEL',
    status: 'simulated',
    description: 'Utilitas untuk mengekstrak foto beresolusi tinggi dan metadata lisensi dari sumber berita.',
    lastExecuted: '4 menit lalu',
    latencyMs: 310,
    environmentVar: 'IMAGE_SCRAPER_USER_AGENT'
  },
  {
    id: 'mod-5',
    name: 'Image Compressor & WebP Converter',
    type: 'lib_service',
    pathOrIdentifier: 'app/admin/image-compressor.ts',
    associatedAgent: 'PIXEL',
    status: 'simulated',
    description: 'Modul kompresi gambar berbasis Sharp/Canvas yang menghasilkan WebP berkualitas tinggi dengan kompresi hingga 85%.',
    lastExecuted: '4 menit lalu',
    latencyMs: 180,
    environmentVar: 'WEBP_QUALITY_LEVEL=82'
  },
  {
    id: 'mod-6',
    name: 'ImgBB CDN Storage Integration',
    type: 'external_cdn',
    pathOrIdentifier: 'ImgBB CDN',
    associatedAgent: 'PIXEL',
    status: 'simulated',
    description: 'Integrasi cloud CDN untuk hosting file gambar editorial yang telah dioptimalkan.',
    lastExecuted: '4 menit lalu',
    latencyMs: 145,
    environmentVar: 'IMGBB_API_KEY'
  },
  {
    id: 'mod-7',
    name: 'Jurnalis Publisher Cron',
    type: 'cron_job',
    pathOrIdentifier: '/api/cron/jurnalis-publisher',
    associatedAgent: 'CHRONOS',
    status: 'simulated',
    description: 'Endpoint cron terjadwal yang memeriksa antrean publikasi dan mengubah status artikel menjadi Published.',
    lastExecuted: '14 menit lalu',
    latencyMs: 95,
    environmentVar: 'CRON_SECRET'
  },
  {
    id: 'mod-8',
    name: 'Get Next Suggested Publish Time Action',
    type: 'server_action',
    pathOrIdentifier: 'getNextSuggestedPublishTimeAction',
    associatedAgent: 'CHRONOS',
    status: 'simulated',
    description: 'Algoritma cerdas yang menghitung waktu publikasi terbaik berdasarkan grafik pembaca dan jarak antar posting.',
    lastExecuted: '14 menit lalu',
    latencyMs: 35
  },
  {
    id: 'mod-9',
    name: 'Telegram Bot Dispatcher Service',
    type: 'lib_service',
    pathOrIdentifier: 'lib/telegram.ts',
    associatedAgent: 'HERMES',
    status: 'simulated',
    description: 'Pengirim notifikasi markdown dan inline approval keyboard ke Telegram Redaktur dan Telegram Channel.',
    lastExecuted: '12 menit lalu',
    latencyMs: 110,
    environmentVar: 'TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID'
  },
  {
    id: 'mod-10',
    name: 'Google & Bing Indexing Service',
    type: 'lib_service',
    pathOrIdentifier: 'lib/indexing.ts',
    associatedAgent: 'RADAR',
    status: 'simulated',
    description: 'Klien API untuk Google Indexing API (JWT Service Account) dan Bing IndexNow untuk percepatan indeks instan.',
    lastExecuted: '12 menit lalu',
    latencyMs: 220,
    environmentVar: 'GOOGLE_SERVICE_ACCOUNT_KEY & BING_INDEXNOW_KEY'
  },
  {
    id: 'mod-11',
    name: 'News XML Sitemap Generator',
    type: 'api_route',
    pathOrIdentifier: 'news-sitemap.xml',
    associatedAgent: 'RADAR',
    status: 'simulated',
    description: 'XML sitemap khusus Google News yang memuat metadata publikasi 48 jam terakhir.',
    lastExecuted: '5 menit lalu',
    latencyMs: 15
  },
  {
    id: 'mod-12',
    name: 'RSS Feed Hub',
    type: 'api_route',
    pathOrIdentifier: 'rss.xml',
    associatedAgent: 'RADAR',
    status: 'simulated',
    description: 'Distribusi sindikasi konten RSS 2.0 untuk pembaca umum dan agregator pihak ketiga.',
    lastExecuted: '5 menit lalu',
    latencyMs: 12
  },
  {
    id: 'mod-13',
    name: 'Instabox Admin Panel',
    type: 'server_action',
    pathOrIdentifier: '/admin/instabox',
    associatedAgent: 'PEMIMPIN REDAKSI',
    status: 'simulated',
    description: 'Dashboard manajemen utama untuk kontrol manual dan approval darurat pimpinan redaksi.',
    lastExecuted: '25 menit lalu',
    latencyMs: 28
  },
  {
    id: 'mod-14',
    name: 'Auto-Purge Cron Routine',
    type: 'cron_job',
    pathOrIdentifier: '/api/cron/auto-purge',
    associatedAgent: 'SENTRY',
    status: 'simulated',
    description: 'Rutin pembersihan file sampah, buffer temporary, serta rotasi log berkala setiap 24 jam.',
    lastExecuted: '3 jam lalu',
    latencyMs: 310,
    environmentVar: 'CRON_SECRET'
  },
  {
    id: 'mod-15',
    name: 'Neon Postgres Connection Pooler',
    type: 'database',
    pathOrIdentifier: 'Neon Postgres Connection Pooler',
    associatedAgent: 'SENTRY',
    status: 'simulated',
    description: 'Koneksi database PostgreSQL serverless berkecepatan tinggi dengan pooling terkelola.',
    lastExecuted: 'Aktif berkelanjutan',
    latencyMs: 24,
    environmentVar: 'DATABASE_URL (Neon pooled connection string)'
  }
];


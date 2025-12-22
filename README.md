# Gemi Dokümantasyon Yönetim Sistemi (GDYS)

Hybrid-Cloud tabanlı gemi dokümantasyon yönetim sistemi. Gemilerin sertifika, teknik çizim, operasyonel jurnal ve personel evraklarını dijital ortamda, gemi-ofis senkronizasyonu ile yönetmeyi amaçlayan profesyonel bir denizcilik çözümüdür.

## Proje Yapısı

```
ERP/
├── backend/          # NestJS Backend API
├── frontend/         # React + Vite Frontend
└── shared/           # Ortak TypeScript tipleri ve utilities
```

## Teknoloji Stack

### Backend
- **NestJS** (Node.js) - Mikroservis mimarisi
- **PostgreSQL** - İlişkisel veritabanı
- **TypeORM** - ORM
- **JWT** - Authentication
- **RBAC** - Role Based Access Control
- **Swagger** - API dokümantasyonu
- **Cron Jobs** - Otomatik bildirimler

### Frontend
- **React 18** - UI framework
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TanStack Query** - Server state yönetimi
- **Zustand** - Client state yönetimi
- **PWA** - Progressive Web App desteği
- **Dark Mode** - Gece modu desteği

## Kurulum

### Gereksinimler
- Node.js 20+
- PostgreSQL 15+
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd ERP
```

### 2. Backend Kurulumu
```bash
cd backend
npm install

# .env dosyası oluşturun
cp .env.example .env
# .env dosyasını düzenleyin

# Veritabanını başlatın (PostgreSQL çalışıyor olmalı)
npm run migration:run

# Development modunda çalıştırın
npm run start:dev
```

Backend `http://localhost:3000` adresinde çalışacaktır.
API dokümantasyonu: `http://localhost:3000/api/docs`

### 3. Frontend Kurulumu
```bash
cd frontend
npm install

# Development modunda çalıştırın
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

### 4. Docker ile Kurulum (Önerilen)
```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

## Kullanıcı Rolleri

| Rol | Yetki | Açıklama |
|-----|-------|----------|
| **SYSTEM_ADMIN** | Tüm sistem | Global yapılandırma ve hata ayıklama |
| **DPA_OFFICE** | Filo yönetimi | Tüm gemileri izleme, doküman onaylama/reddetme |
| **CAPTAIN** | Gemi yönetimi | Sadece kendi gemisine veri girişi ve tam erişim |
| **CHIEF_ENGINEER** | Teknik arşiv | Makine dairesi teknik dökümanları, bakım formları |
| **OFFICER** | Form girişi | Sadece yetkili olduğu formları doldurma/yükleme |

## Özellikler

### ✅ Temel Özellikler
- **Hybrid-Cloud Mimari** - Edge Sync ile gemi-ofis senkronizasyonu
- **Delta-Sync** - Sadece değişen veri bloklarının transferi
- **Sertifika Takibi** - Otomatik bitiş tarihi takibi ve uyarılar
- **RBAC Yetkilendirme** - Rol tabanlı erişim kontrolü
- **Audit Trail** - Tüm işlemlerin izlenebilirliği
- **PWA Desteği** - Offline çalışma ve mobil uyumluluk
- **Dark Mode** - Gece vardiyaları için düşük ışık modu

### 📋 Modüller
- **Vessels** - Gemi yönetimi
- **Documents** - Doküman yükleme ve versiyonlama
- **Certificates** - Sertifika takibi ve uyarı sistemi
- **Categories** - Doküman kategorileri
- **Sync** - Senkronizasyon kuyruğu
- **Notifications** - Otomatik bildirimler (Cron)
- **Audit Logs** - İşlem kayıtları

## API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/auth/profile` - Kullanıcı profili

### Vessels
- `GET /api/vessels` - Tüm gemileri listele
- `POST /api/vessels` - Yeni gemi oluştur
- `GET /api/vessels/:id` - Gemi detayı

### Documents
- `GET /api/documents` - Tüm dokümanları listele
- `POST /api/documents` - Doküman yükle
- `GET /api/documents/:id` - Doküman detayı
- `POST /api/documents/:id/approve` - Doküman onayla
- `POST /api/documents/:id/reject` - Doküman reddet

### Certificates
- `GET /api/certificates` - Tüm sertifikaları listele
- `GET /api/certificates/expiring` - Yakında dolacak sertifikalar
- `GET /api/certificates/expired` - Süresi dolmuş sertifikalar

## Geliştirme

### Backend
```bash
cd backend
npm run start:dev      # Development
npm run build          # Production build
npm run test           # Test çalıştır
npm run lint           # Lint kontrolü
```

### Frontend
```bash
cd frontend
npm run dev            # Development
npm run build          # Production build
npm run preview        # Production preview
npm run lint           # Lint kontrolü
```

## Güvenlik

- **SHA-256 Hashing** - Dosya bütünlüğü kontrolü
- **JWT Authentication** - Token tabanlı kimlik doğrulama
- **RBAC** - Rol tabanlı yetkilendirme
- **Audit Trail** - Tüm işlemlerin loglanması
- **Input Validation** - Class-validator ile veri doğrulama

## Lisans

Bu proje özel bir projedir.

## İletişim

Sorularınız için lütfen proje yöneticisi ile iletişime geçin.


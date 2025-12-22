# Kurulum Kılavuzu

## Hızlı Başlangıç

### 1. Docker ile Kurulum (En Kolay)

```bash
# Projeyi klonlayın
git clone <repository-url>
cd ERP

# Docker Compose ile tüm servisleri başlatın
docker-compose up -d

# Servislerin durumunu kontrol edin
docker-compose ps

# Logları görüntüleyin
docker-compose logs -f
```

Servisler:
- **PostgreSQL**: `localhost:5432`
- **Backend API**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`
- **Swagger Docs**: `http://localhost:3000/api/docs`

### 2. Manuel Kurulum

#### Backend

```bash
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
cp .env.example .env

# .env dosyasını düzenleyin
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=gmys_db
# JWT_SECRET=your-secret-key-here

# PostgreSQL veritabanını oluşturun
createdb gmys_db

# Migration'ları çalıştırın
npm run migration:run

# Development modunda başlatın
npm run start:dev
```

#### Frontend

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Development modunda başlatın
npm run dev
```

## İlk Kullanıcı Oluşturma

Backend çalıştıktan sonra, ilk admin kullanıcısını oluşturmak için:

```bash
# API'ye POST isteği gönderin
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "SYSTEM_ADMIN"
  }'
```

Veya Swagger UI'dan (`http://localhost:3000/api/docs`) register endpoint'ini kullanabilirsiniz.

## Veritabanı Migration'ları

```bash
cd backend

# Yeni migration oluştur
npm run migration:generate -- -n MigrationName

# Migration'ları çalıştır
npm run migration:run

# Son migration'ı geri al
npm run migration:revert
```

## Sorun Giderme

### PostgreSQL bağlantı hatası
- PostgreSQL servisinin çalıştığından emin olun
- `.env` dosyasındaki veritabanı bilgilerini kontrol edin
- Veritabanının oluşturulduğundan emin olun

### Port çakışması
- Backend için farklı bir port kullanmak isterseniz `.env` dosyasında `PORT` değişkenini değiştirin
- Frontend için `vite.config.ts` dosyasında port ayarını değiştirin

### CORS hatası
- Backend `main.ts` dosyasında CORS ayarlarını kontrol edin
- Frontend URL'inin doğru olduğundan emin olun

## Production Kurulumu

### Backend

```bash
cd backend

# Production build
npm run build

# Production modunda çalıştır
npm run start:prod
```

### Frontend

```bash
cd frontend

# Production build
npm run build

# Build çıktısı dist/ klasöründe olacak
# Bu klasörü bir web sunucusuna deploy edin (nginx, Apache, vb.)
```

## Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gmys_db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# AWS S3 (Optional - for file storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=gmys-documents

# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Sync Service
SYNC_BATCH_SIZE=100
SYNC_RETRY_ATTEMPTS=3
```

### Frontend

Frontend için environment variables `vite.config.ts` içinde veya `.env` dosyasında tanımlanabilir:

```env
VITE_API_URL=http://localhost:3000/api
```


# Mock Data Kullanım Kılavuzu

## Mock Mode Nedir?

Mock mode, gerçek veritabanı ve backend API olmadan uygulamayı test etmenizi sağlar. Tüm API çağrıları mock data ile çalışır.

## Mock Mode'u Aktif Etme

### Yöntem 1: Environment Variable

Frontend klasöründe `.env` dosyası oluşturun:

```env
VITE_USE_MOCK_API=true
```

### Yöntem 2: Otomatik (Development Mode)

Development modunda (`npm run dev`) otomatik olarak mock mode aktif olur.

## Mock Kullanıcılar

Sisteme giriş yapmak için aşağıdaki kullanıcıları kullanabilirsiniz:

### 1. System Admin
- **Email:** `admin@gmys.com`
- **Şifre:** `admin123`
- **Rol:** SYSTEM_ADMIN

### 2. DPA Office
- **Email:** `dpa@gmys.com`
- **Şifre:** `dpa123`
- **Rol:** DPA_OFFICE

### 3. Captain
- **Email:** `captain@gmys.com`
- **Şifre:** `captain123`
- **Rol:** CAPTAIN

## Mock Veriler

### Gemiler
- MV Blue Ocean (Tanker)
- MV Sea Star (Bulker)
- MV Cargo Express (Container)

### Dokümanlar
- International Tonnage Certificate (Onaylanmış)
- Safety Management Certificate (Onaylanmış)
- Engine Room Layout (Onay Bekliyor)
- Daily Engine Log (Taslak)
- Pollution Prevention Certificate (Onaylanmış)

### Sertifikalar
- Aktif sertifikalar
- Yakında dolacak sertifikalar (30 gün içinde)
- Süresi dolmuş sertifikalar

## Mock Mode Indicator

Mock mode aktifken ekranın sağ alt köşesinde sarı bir "🧪 Mock Mode Active" göstergesi görünür.

## Gerçek API'ye Geçiş

Mock mode'u kapatmak için:

1. `.env` dosyasında `VITE_USE_MOCK_API=false` yapın
2. Veya `.env` dosyasını silin
3. Backend API'nin çalıştığından emin olun (`http://localhost:3000`)

## Notlar

- Mock data localStorage'da saklanmaz, her sayfa yenilendiğinde sıfırlanır
- Mock API çağrıları gerçek API çağrıları gibi davranır (delay simülasyonu ile)
- Tüm CRUD işlemleri mock data üzerinde çalışır


# Multi-Tenant Architecture (Her Gemi İçin Ayrı Tenant)

## Genel Bakış

Bu ERP sistemi **multi-tenant** mimarisi ile tasarlanmıştır. Her gemi ayrı bir tenant olarak çalışır ve kullanıcılar sadece kendi gemilerinin verilerini görür.

## Mimari Prensipler

### 1. Tenant İzolasyonu
- Her kullanıcı bir `vesselId` ile ilişkilendirilir
- Tüm veriler `vesselId` ile filtrelenir
- Kullanıcılar sadece kendi gemilerinin verilerine erişebilir

### 2. Rol Bazlı Erişim
- **SYSTEM_ADMIN**: Tüm gemilere erişebilir
- **DPA_OFFICE**: Tüm gemilere erişebilir (fleet yönetimi)
- **CAPTAIN, CHIEF_ENGINEER, OFFICER**: Sadece kendi gemilerine erişebilir

### 3. Otomatik Filtreleme
- `VesselContextInterceptor` tüm request'lere vesselId ekler
- Controller'larda `@CurrentUser()` decorator'ı ile kullanıcı bilgisi alınır
- Servisler otomatik olarak vesselId ile filtreleme yapar

## Backend Yapısı

### Entity'ler
Tüm entity'ler `vesselId` kolonu içerir:
- `Document.vesselId`
- `CrewMember.vesselId`
- `InventoryItem.vesselId`
- `MaintenanceTask.vesselId`
- `Voyage.vesselId`
- vb.

### Interceptor
`VesselContextInterceptor` her request'e vesselId ekler:
- SYSTEM_ADMIN ve DPA_OFFICE: Query'den vesselId alabilir
- Diğer kullanıcılar: Sadece kendi vesselId'lerini kullanır

### Controller Örneği
```typescript
@Get()
findAll(@Query('vesselId') vesselId?: string, @CurrentUser() user?: any) {
  const finalVesselId = 
    (user?.role === UserRole.SYSTEM_ADMIN || user?.role === UserRole.DPA_OFFICE)
      ? vesselId
      : user?.vesselId || vesselId;
  return this.service.findAll(finalVesselId);
}
```

## Frontend Yapısı

### Auth Store
Kullanıcı bilgisi `vesselId` içerir:
```typescript
interface User {
  id: string;
  email: string;
  vesselId?: string;
  role: string;
}
```

### API Interceptor
Otomatik olarak vesselId ekler:
- Normal kullanıcılar için: vesselId otomatik eklenir
- SYSTEM_ADMIN ve DPA_OFFICE: vesselId manuel olarak query'ye eklenebilir

## Güvenlik

1. **Backend Guard**: `VesselAccessGuard` ile erişim kontrolü
2. **JWT Token**: vesselId token içinde saklanır
3. **Service Layer**: Tüm servisler vesselId ile filtreleme yapar
4. **Database Level**: Row-level security (gelecekte eklenebilir)

## Kullanım Senaryoları

### Senaryo 1: Normal Kullanıcı
- Kullanıcı giriş yapar → vesselId: "vessel-123"
- Tüm API çağrıları otomatik olarak `?vesselId=vessel-123` ekler
- Sadece vessel-123'ün verilerini görür

### Senaryo 2: DPA Office
- Kullanıcı giriş yapar → role: "DPA_OFFICE", vesselId: null
- Tüm gemileri görebilir
- Query'ye `?vesselId=vessel-456` ekleyerek belirli gemiyi seçebilir

### Senaryo 3: System Admin
- Kullanıcı giriş yapar → role: "SYSTEM_ADMIN"
- Tüm gemilere erişebilir
- Fleet yönetimi yapabilir

## Gelecek Geliştirmeler

1. **Database per Tenant**: Her gemi için ayrı veritabanı (ölçeklenebilirlik)
2. **Tenant Management**: Yeni gemi ekleme/çıkarma yönetimi
3. **Billing Integration**: Her gemi için ayrı faturalandırma
4. **Custom Branding**: Her gemi için özel tema/logo


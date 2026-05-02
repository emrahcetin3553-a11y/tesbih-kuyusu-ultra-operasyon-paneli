# Tesbih Kuyusu V6.5 Kod Kontrol Raporu

Tarih: 2026-05-03

## Üretilen / güncellenen dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/build_v6_5_sheet.mjs`
- `02_SHEET_SISTEM/Tesbih_Kuyusu_V6_5_Ultra_Operasyon_Sheet.xlsx`

## V6.4.5 başarısızlık özeti

- Panel kaydetme sonrası cari çözümü boş kalınca `07_PARASUT_FATURA` payload tarafında `contact relationship eksik` hatasına düşebiliyordu.
- Ad-soyad akışı bazı birleşik yazımlarda genel normalizasyonla çözülmüyor, operatörü düzeltmeye zorluyordu.
- `Kargo_Alıcısı`, ödeme yapan ve fatura kişisi alanları panelde tek merkezli güvenli akış gibi davranmıyordu.
- Ayrı toplu panel yaklaşımı operatör akışını bölüyordu.
- Adres geçmişi ayrı tablo olarak tutulmadığı için eski adresin ezilme riski vardı.
- Seçili satırdan düzenleme / arşiv / geri alma / kontrollü iptal akışları eksikti.

## Uygulanan V6.5 düzeltmeleri

- Ultra panel tek merkez yapıldı; çoklu sipariş aynı panelde `Yeni sipariş ekle` ile açılıyor.
- Ayrı toplu panel aktif akıştan çıkarıldı.
- Seçili sipariş düzenleme, seçili siparişleri düzenleme, kontrollü silme, geri alma, arşivleme ve müşteri hafızası işlemleri üst menüye eklendi.
- `15_MUSTERI_ADRESLERI` eklendi; adres geçmişi ayrı satırlarda tutuluyor.
- `Kargo_Alıcısı`, `Ödeme_Yapan`, `Fatura_Kişisi`, telefon, adres, il/ilçe alanlarının birbirini ezmeden akması güçlendirildi.
- `Paraşüt_Cari_ID` boşken payload dry-run başarı sayılmıyor; kontrol merkezine açık blokaj yazılıyor.
- Panelde `Cari seç / cari oluştur` akışı `parasutCariPanelAksiyonu` üzerinden gerçek core callback’e bağlandı.

## Kontrol sonuçları

- Core syntax: `OK`
- HTML script syntax: `OK`
- Duplicate function: `0`
- Üretim dosyalarında yasak kelime taraması: temiz
- Aktif HTML callback kontrolü: temiz
- Aktif ayrı toplu panel referansı: yok
- Function count: `344`

## SHA256

- Core: `9DF5A23E2D81DCF9FF1749F16A69B62334BCC1EE351EAC4DC57B0E856D08C078`
- Ultra panel HTML: `BEC49E00FDAE82B07AE7B5CE02EA0E8A97D540039DE3AB32BB8FAF502A1178BA`
- Sheet: `2C14175BC27D1FBE1A8D85E1A74BEBA7874E2AFF3F97F4568B6D35AA3F7F09DE`

## Sonuç

Kod kontrolü yerel ve mock harness seviyesinde geçti. Gerçek Apps Script UI üzerinde çalıştırılmış ekran kanıtı bu rapora dahil değildir.

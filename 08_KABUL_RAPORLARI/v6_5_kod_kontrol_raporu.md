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
- Navlungo Domestic API v2.1 için token, carrier kontrol, payload, gönderi oluşturma, barkod, sorgu, iptal ve toplu kargo/barkod fonksiyonları aktif core’a eklendi.
- `08_KARGO_PAKETLERI` Navlungo kolonları kullanıcı sözleşmesindeki resmi isimlere taşındı.

## Kontrol sonuçları

- Core syntax: `OK`
- HTML script syntax: `OK`
- Duplicate function: `0`
- Üretim dosyalarında yasak kelime taraması: temiz
- Aktif HTML callback kontrolü: temiz
- Aktif ayrı toplu panel referansı: yok
- Function count: `381`

## SHA256

- Core: `D76587C63D8E4EFE2E1EFFA190EE22C005938CF1B1C81B80053281C5C1027470`
- Ultra panel HTML: `C5E588BE22B5CDDCC5D13ED69DCCBC8CA4BC7C852505FDAC94A25D09DEA4AA62`
- Sheet: `582041B2D078A36B55D0DC10A21D9B2B83381E974D3D6D8B4635274A461FDE12`

## Sonuç

Kod kontrolü yerel ve mock harness seviyesinde geçti. Gerçek Apps Script UI üzerinde çalıştırılmış ekran kanıtı bu rapora dahil değildir.

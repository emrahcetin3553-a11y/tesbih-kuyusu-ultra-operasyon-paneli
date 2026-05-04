# V6.5 Panel Operasyon Aksiyon Raporu

Tarih: 2026-05-04 06:56 +03:00

## Kapsam

Bu çalışma Ultra Sipariş Paneli ana operasyon akışını güçlendirmek için yapıldı. Amaç, operatörü teknik Navlungo adımlarına zorlamadan panelden sipariş kaydetme, fatura, kargo, kargo bekletme, bekleyen kargoyu çıkarma ve seçili kayıt yaşam döngüsü işlemlerini gerçek fonksiyonlara bağlamaktır.

## Değişen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`

## Gerçek Hale Getirilen Fonksiyonlar

- `ultraPanelOperasyonCalistir_`: Panelden gelen formu kaydeder ve seçilen operasyonu aynı `Açık_Sipariş_ID` üzerinde çalıştırır.
- `faturaVeKargoOlustur_`: Tek tetikle fatura ve kargo operasyon akışını başlatır.
- `sadeceFaturaOlustur_`: Fatura akışını çalıştırır, kargoyu bekletme durumuna alır.
- `sadeceKargoHazirla_`: Fatura tekrarı yapmadan kargo operasyonunu çalıştırır.
- `bekleyenKargoyuCikar_`: Bekletilen kargo için Navlungo gönderi ve barkod akışını çalıştırır.
- `kargoBeklet_`: 08 katmanında kargo bekletme bilgisini gerçek alanlara yazar.
- `applyOrderLifecycle_`: Seçili sipariş için arşiv, geri alma ve iptal işlemlerini bağlı tablolar üzerinden yürütür.

## Sheet Yazma Alanları

06_FATURA_GRUPLARI:
- `Fatura_Durumu`
- `Paraşüt_Fatura_ID`
- `Gönderim_Kilidi`
- `Kontrol_Uyarısı`

07_PARASUT_FATURA:
- `Payload_JSON`
- `Response_JSON`
- `Gönderim_Tarihi`
- `Paraşüt_Fatura_ID`
- `Paraşüt_Durumu`
- `Hata_Mesajı`

08_KARGO_PAKETLERI:
- `Navlungo_Post_Number`
- `Navlungo_Tracking_URL`
- `Navlungo_Barcode_URL`
- `Navlungo_Status`
- `Navlungo_Last_Response`
- `Navlungo_Last_Error`
- `Kargo_Bekletilsin_Mi`
- `Kargo_Bekletme_Nedeni`
- `Kargo_Cikis_Tarihi`

12_KONTROL_MERKEZI:
- Operasyon sonucuna göre açık blokajlar yenilenir.
- Bilinçli kargo bekletme ayrı durum olarak tutulur.

## Panel Değişiklikleri

- Panel dialog ölçüsü Apps Script tarafında daha geniş açılacak şekilde güncellendi.
- Ana aksiyon barına operasyon butonları eklendi.
- Navlungo teknik adımları `Gelişmiş / Teknik` bölümüne taşındı.
- `Kargo beklet` alanları panelden toplanıp 08 katmanına yazılıyor.
- Operasyon butonları `ultraPanelOperasyonCalistir` callback fonksiyonuna bağlandı.

## Test Sonuçları

- Core syntax: OK
- Duplicate function: OK, 103 top-level function
- Üretim core/HTML yasak ifade taraması: OK
- Node test sonucu: OK
- Paraşüt payload create testi: OK
- Paraşüt duplicate gönderim kilidi testi: OK
- Navlungo token/create/barcode/cancel test seti: OK
- Sadece fatura ve bekleyen kargoyu çıkar test senaryosu: OK

Node test özeti:

```json
{
  "ok": true,
  "openRows": 3,
  "invoiceGroups": 4,
  "addressRows": 4,
  "salesPostCalls": 1,
  "contactPostCalls": 0,
  "tokenRefreshCalls": 2,
  "navlungoAuthCalls": 9,
  "navlungoPostCalls": 5
}
```

## Apps Script Yükleme

Apps Script proje ID:
`1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

Remote aktif dosyalar:

- `appsscript.json`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

Core SHA256:

- Local: `E5A53274417EA1AC46DD6376FA679B6F0AC995063CB88BA7C193EB1DE5880E57`
- Remote: `E5A53274417EA1AC46DD6376FA679B6F0AC995063CB88BA7C193EB1DE5880E57`
- Eşleşme: Evet

## Kalan Kabul Kanıtı

Bu turda Apps Script dosyaları remote projeye yüklendi ve local test kapıları geçti. Gerçek Google Sheets UI üzerinden aşağıdaki kanıtlar ayrıca alınmadan nihai canlı kabul yazılmamalıdır:

- 02, 03, 04, 06, 08 seçili satırlarından panelin dolu açılması
- Panelden `Sadece fatura oluştur`
- Panelden `Kargo beklet`
- Panelden `Bekleyen kargoyu çıkar`
- Panelden `Fatura ve kargo oluştur`
- Panelden arşiv, geri al ve iptal işlemlerinin bağlı tabloları doğru güncellemesi
- Gerçek Navlungo barkod URL readback
- Gerçek Paraşüt fatura ID readback

## Karar

Kod ve Apps Script yükleme tarafında V6.5 panel operasyon aksiyonları bağlandı. Gerçek UI kanıtı henüz bu rapora eklenmediği için nihai canlı kabul tamamlandı denmez.

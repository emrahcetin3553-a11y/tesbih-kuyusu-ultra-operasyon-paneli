# Tesbih Kuyusu V6.4.2 Kod Kontrol Raporu

Tarih: 2026-05-02  
Branch: `v6-4-2-production-readiness`

## Üretilen / Değiştirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_4_2_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_4_2_ultra_operasyon_mock.js`
- `07_TEST_DOSYALARI/build_v6_4_2_sheet.mjs`
- `02_SHEET_SISTEM/Tesbih_Kuyusu_V6_4_2_Ultra_Operasyon_Sheet.xlsx`

V6.4.1 dosyaları korunmuştur.

## Kod Kapıları

| Kontrol | Sonuç |
|---|---|
| Syntax | Geçti |
| Duplicate function | Yok |
| Üretim core/HTML yasak kelime taraması | Bulgu yok |
| Function count | 301 |
| Core SHA256 | `9039D900FDE6BDBAFE3AF6ABE66533FDA1349E95B2C28EE2E322C51FFB9F0E3E` |

## Menü Bağlantısı

Günlük operatör menüsü 7 ana komuta indirildi:

- Ultra sipariş paneli
- Toplu sipariş paneli
- Kaydet ve ERP güncelle
- Fatura ve kargo oluştur
- Kontrol merkezi
- Paraşüt API bağlantısını test et
- Görünümü düzenle

Teknik işlemler `Gelişmiş / Teknik` alt menüsüne alındı. Menüde görünen fonksiyonların wrapper karşılıkları core içinde mevcuttur.

## Düzeltmeler

- Açık siparişte kargo bilgisi eksiksizse `08_KARGO_PAKETLERI` gereksiz kapanış blokajı üretmez.
- Paraşüt taslak ID bekleyen `11_EBELGE_ISTISNA` satırı blokaj yerine `Hazırlık` durumunda kalır.
- `13_VERI_SOZLUGU` artık kendi 6 kolonunu da kapsar.
- V6.4.2 kabul fonksiyonu eklendi: `v642GercekSheetKabulKontrolu()`.

## Fonksiyon Okuma/Yazma Matrisi

| Fonksiyon | Okur | Yazar |
|---|---|---|
| `kaydetUltraSiparisHizli` | 01, 02, 03, 04, 05, 08, 09 | 02, 04, 05, 08, 09, 03, 06, 07, 10, 11, 12 |
| `topluUltraSiparisKaydet` | 01, 02, 03, 04, 05, 08 | 02, 04, 05, 08, 03, 06, 07, 10, 11, 12 |
| `faturaGruplariniOlustur` | 04, 05, 06, 01 | 06 |
| `parasutTaslaklariniHazirla` | 04, 06, 07 | 07 |
| `kargoPaketleriniOlustur` | 03, 08, 01 | 08 |
| `ebelgeIstisnaHazirla` | 06, 07, 01 | 11 |
| `kontrolMerkeziniGuncelle` | 03, 04, 05, 06, 07, 08, 11, 14 | 12 |
| `parasutApiBaglantiTestiTam` | Script Properties, 07 | Log / GET test |
| `navlungoKargoPayloadHazirla` | 08 | Payload dönüşü |

## Kalan Risk

Gerçek Apps Script UI üzerinde `v642GercekSheetKabulKontrolu()` ve `parasutApiBaglantiTestiTam()` logları alınmadan nihai canlı kabul tamamlandı denmemelidir.

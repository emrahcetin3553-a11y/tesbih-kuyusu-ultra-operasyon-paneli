# Tesbih Kuyusu V6.5 Navlungo Kontrol Raporu

Tarih: 2026-05-03

## Kapsam

V6.5 core içinde Navlungo QA/LIVE ortam seçimi, token alma, kargo payload hazırlama, dry-run, kontrollü gönderi oluşturma, barkod, sorgu, iptal ve toplu dry-run fonksiyonları üretildi.

## Resmi Endpoint Eşleşmesi

- Token: `POST auth/api`
- Gönderi oluşturma: `POST post/create`
- Kargo sorgulama: `GET post/check/{POST_NUMBER}`
- Kargo iptal: `POST post/cancel`
- Barkod: `POST barcode/getBarcode`

Base URL:

- QA: `https://domestic-api-qa.navlungo.com/v2.1/`
- LIVE: `https://domestic-api.navlungo.com/v2.1/`

## Eklenen Fonksiyonlar

- `navlungoTokenAl()`
- `navlungoApiBaglantiTesti()`
- `navlungoTaslakPayloadHazirla(kargoPaketId)`
- `navlungoKargoDryRun(kargoPaketId)`
- `navlungoKargoOlusturOnayli(kargoPaketId)`
- `navlungoBarkodOlustur(kargoPaketId)`
- `navlungoKargoSorgula(kargoPaketId)`
- `navlungoKargoIptalEt(kargoPaketId)`
- `navlungoTopluKargoTestEt(limit)`

## 08_KARGO_PAKETLERI Alanları

Şu alanlar V6.5 Sheet sözleşmesine eklendi ve builder readback kontrolünden geçti:

- `Navlungo_Gonderi_ID`
- `Navlungo_Barkod_No`
- `Navlungo_Takip_No`
- `Navlungo_Etiket_URL`
- `Navlungo_Durum`
- `Navlungo_Hata_Mesaji`
- `Navlungo_Payload_JSON`
- `Navlungo_Response_JSON`
- `Test_Kargo_Mu`
- `Navlungo_Olusturma_Tarihi`
- `Navlungo_Iptal_Tarihi`
- `Navlungo_Iptal_Sonucu`

## Güvenlik Kapıları

Varsayılan değerler:

- `PARASUT_CANLI_GONDERIM = Hayır`
- `PARASUT_CARI_CANLI_OLUSTURMA = Hayır`
- `EBELGE_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_TEST_MODE = Evet`
- `NAVLUNGO_ENV = QA`

`NAVLUNGO_CANLI_GONDERIM = Hayır` iken gönderi, barkod veya iptal POST çağrısı yapılmaz. Kargo payload ve dry-run 08 sayfasına yazılır.

## Yerel Test Sonucu

`test_v6_5_ultra_operasyon.js` çalıştırıldı.

Sonuç:

- `navlungoAuthCalls = 1`
- `navlungoPostCalls = 0`
- `salesPostCalls = 0`
- `contactPostCalls = 0`
- Navlungo dry-run payload üretildi.
- 08 readback içinde `Navlungo_Payload_JSON` ve `Test_Kargo_Mu = Evet` doğrulandı.
- Canlı kapı kapalıyken gönderi, barkod ve iptal POST yapılmadı.
- Kargo sorgulama GET akışı test harness içinde çalıştı.

## Dürüst Sınır

Gerçek Navlungo QA kullanıcı adı/şifre ile canlı QA gönderi oluşturma, barkod ve iptal testi bu yerel çalışmada yapılmadı. Bu nedenle `QA gönderi oluşturma OK`, `Barkod oluşturma OK` ve `Gönderi iptal OK` gerçek ortam kanıtı olarak yazılmadı. Bu testler Apps Script ana projede Script Properties girildikten sonra ve kontrollü test alıcı verisiyle yapılmalıdır.

## Çalıştırma Sırası

1. Script Properties içine `NAVLUNGO_API_USERNAME` ve `NAVLUNGO_API_PASSWORD` gir.
2. `NAVLUNGO_ENV = QA`, `NAVLUNGO_TEST_MODE = Evet`, `NAVLUNGO_CANLI_GONDERIM = Hayır` bırak.
3. `navlungoApiBaglantiTesti()` çalıştır.
4. Test kargo paketinde `navlungoKargoDryRun(kargoPaketId)` çalıştır.
5. 08 sayfasında payload ve test kargo alanlarını kontrol et.
6. Kontrollü QA canlı denemeye geçilecekse önce yalnız 3 test kargo için kapı bilinçli açılır.
7. 3/3 gönderi, barkod, sorgu ve iptal doğrulanmadan 10 veya 50 testine geçilmez.

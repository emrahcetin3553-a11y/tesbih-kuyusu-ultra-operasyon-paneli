# Tesbih Kuyusu V6.5 Navlungo Kontrol Raporu

Tarih: 2026-05-03

## Kapsam

V6.5 core içinde Navlungo QA/LIVE ortam seçimi, token alma, taşıyıcı ayarı kontrolü, kargo payload hazırlama, gönderi oluşturma, barkod alma, gönderi sorgulama, iptal ve toplu kargo/barkod fonksiyonları resmi Domestic API v2.1 akışına bağlandı.

## Resmi Endpoint Eşleşmesi

- Token: `POST auth/api`
- Taşıyıcı kontrolü: `GET carrier/my-carriers`
- Gönderi oluşturma: `POST post/create`
- Kargo sorgulama: `GET post/check/{POST_NUMBER}`
- Kargo iptal: `POST post/cancel`
- Barkod: `POST barcode/getBarcode`

Base URL:

- QA: `https://domestic-api-qa.navlungo.com/v2.1/`
- LIVE: `https://domestic-api.navlungo.com/v2.1/`

## Aktif Fonksiyonlar

- `navlungoTokenAl()`
- `navlungoBaglantiTestiTam()`
- `navlungoTaslakPayloadOlustur(kargoPaketId)`
- `navlungoKargoTaslakTestEt(kargoPaketId)`
- `navlungoKargoOlusturOnayli(kargoPaketId)`
- `navlungoBarkodAl(kargoPaketId)`
- `navlungoGonderiSorgula(kargoPaketId)`
- `navlungoGonderiIptalEt(kargoPaketId)`
- `navlungoTopluKargoOlustur(seciliPaketler)`
- `navlungoTopluBarkodAl(seciliPaketler)`

## 08_KARGO_PAKETLERI Alanları

Şu alanlar V6.5 Sheet sözleşmesine eklendi:

- `Navlungo_Post_Number`
- `Navlungo_Reference_ID`
- `Navlungo_Tracking_URL`
- `Navlungo_Barcode_URL`
- `Navlungo_Carrier_ID`
- `Navlungo_Carrier_Name`
- `Navlungo_Status`
- `Navlungo_Last_Response`
- `Navlungo_Last_Error`
- `Navlungo_Created_At`
- `Navlungo_Cancelled_At`
- `Navlungo_Test_Mu`
- `Navlungo_Payload_Hash`

## Güvenlik Kapıları

Varsayılan değerler:

- `PARASUT_CANLI_GONDERIM = Hayır`
- `PARASUT_CARI_CANLI_OLUSTURMA = Hayır`
- `EBELGE_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_ENV = QA`

`NAVLUNGO_CANLI_GONDERIM = Hayır` iken gönderi, barkod veya iptal POST çağrısı yapılmaz. Payload hash ve durum 08 sayfasına yazılır.

## Yerel Test Sonucu

`test_v6_5_ultra_operasyon.js` çalıştırıldı.

Sonuç:

- Navlungo token alma akışı çalıştı.
- Taşıyıcı kontrol endpoint çağrısı çalıştı.
- Payload üretildi ve 08 readback içinde `Navlungo_Payload_Hash` doğrulandı.
- Kapı kapalıyken Navlungo POST yapılmadı.
- Kapı açık senaryoda yalnız Navlungo gönderi, barkod ve iptal POST akışları test edildi.
- Paraşüt sales invoice POST yapılmadı.
- Paraşüt cari POST yapılmadı.

## Dürüst Sınır

Gerçek Navlungo QA/LIVE kullanıcı bilgileri bu yerel çalışmada kullanılmadı. Bu nedenle gerçek ortamda `post_number`, `tracking_url`, `barcode_url`, sorgu ve iptal kanıtı için Apps Script ana projede Script Properties girildikten sonra kontrollü test kargo satırıyla çalıştırma gerekir.

## Çalıştırma Sırası

1. Script Properties içine `NAVLUNGO_API_USERNAME` ve `NAVLUNGO_API_PASSWORD` gir.
2. `NAVLUNGO_ENV = QA`, `NAVLUNGO_CANLI_GONDERIM = Hayır` bırak.
3. `navlungoBaglantiTestiTam()` çalıştır.
4. Test kargo paketinde `navlungoKargoTaslakTestEt(kargoPaketId)` çalıştır.
5. 08 sayfasında `Navlungo_Reference_ID`, `Navlungo_Carrier_ID`, `Navlungo_Status`, `Navlungo_Payload_Hash` alanlarını kontrol et.
6. Kontrollü canlı kargo denemesi yapılacaksa yalnız `NAVLUNGO_CANLI_GONDERIM = Evet` açılır.
7. `navlungoKargoOlusturOnayli(kargoPaketId)`, `navlungoBarkodAl(kargoPaketId)`, `navlungoGonderiSorgula(kargoPaketId)` ve gerekirse `navlungoGonderiIptalEt(kargoPaketId)` sırayla çalıştırılır.

# Navlungo Hazırlık Notları

V6.5 ile Navlungo Domestic API v2.1, Ultra Sipariş Paneli ve `08_KARGO_PAKETLERI` katmanına bağlandı.

## Ortam

- QA base URL: `https://domestic-api-qa.navlungo.com/v2.1/`
- LIVE base URL: `https://domestic-api.navlungo.com/v2.1/`
- Varsayılan kabul akışı: `NAVLUNGO_ENV = QA`, `NAVLUNGO_CANLI_GONDERIM = Hayır`

## Script Properties

- `NAVLUNGO_API_USERNAME`
- `NAVLUNGO_API_PASSWORD`
- `NAVLUNGO_ENV`
- `NAVLUNGO_CANLI_GONDERIM`
- `NAVLUNGO_SENDER_ADDRESS_ID`
- `NAVLUNGO_DEFAULT_CARRIER_ID`
- `NAVLUNGO_DEFAULT_POST_TYPE`
- `NAVLUNGO_DEFAULT_DESI`
- `NAVLUNGO_DEFAULT_PACKAGE_COUNT`
- `NAVLUNGO_CARRIER_ID_MAP_JSON`

Secret değerler repo veya rapora yazılmaz.

## Güvenlik

`NAVLUNGO_CANLI_GONDERIM = Hayır` iken gönderi oluşturma, barkod alma veya iptal POST çağrısı yapılmaz. Sistem payload üretir, payload hash değerini 08 sayfasına yazar ve canlı POST yapılmadığını net döndürür.

`NAVLUNGO_CANLI_GONDERIM = Evet` olduğunda yalnız Navlungo kargo POST akışı açılır. Paraşüt ve e-belge canlı kapıları ayrı kalır.

## Panel İşlemleri

Ultra Sipariş Paneli kargo bölümünde şu işlemler görünür:

- Payload hazırla
- Kargo oluştur
- Barkod oluştur
- Kargo sorgula
- Kargo iptal et

Paraşüt cari blokajı Navlungo payload hazırlığını durdurmaz. Son “Fatura ve Kargo oluştur” aşaması Paraşüt ve Navlungo durumunu ayrı ayrı raporlar.

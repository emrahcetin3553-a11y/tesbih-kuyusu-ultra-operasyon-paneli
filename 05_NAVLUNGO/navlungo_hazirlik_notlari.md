# Navlungo Hazırlık Notları

V6.5 ile Navlungo resmi olarak Ultra Sipariş Paneli ve `08_KARGO_PAKETLERI` katmanına bağlandı.

## Ortam

- QA base URL: `https://domestic-api-qa.navlungo.com/v2.1/`
- LIVE base URL: `https://domestic-api.navlungo.com/v2.1/`
- İlk kabul akışı: `NAVLUNGO_ENV = QA`, `NAVLUNGO_TEST_MODE = Evet`, `NAVLUNGO_CANLI_GONDERIM = Hayır`

## Script Properties

- `NAVLUNGO_API_USERNAME`
- `NAVLUNGO_API_PASSWORD`
- `NAVLUNGO_ENV`
- `NAVLUNGO_CANLI_GONDERIM`
- `NAVLUNGO_TEST_MODE`
- `NAVLUNGO_SENDER_ADDRESS_ID`
- `NAVLUNGO_DEFAULT_CARRIER_ID`
- `NAVLUNGO_DEFAULT_POST_TYPE`
- `NAVLUNGO_DEFAULT_BARCODE_FORMAT`

Secret değerler repo veya rapora yazılmaz.

## Güvenlik

`NAVLUNGO_CANLI_GONDERIM = Hayır` iken gönderi oluşturma, barkod oluşturma veya iptal POST çağrısı yapılmaz. Sistem yalnız payload üretir, dry-run sonucu 08 sayfasına yazar ve kontrol merkezinde Navlungo blokajını ayrı tipte gösterir.

`NAVLUNGO_CANLI_GONDERIM = Evet` olsa bile ilk aşamada `NAVLUNGO_TEST_MODE = Evet` zorunludur. İlk gerçek QA test en fazla 3 barkodla sınırlıdır; 3/3 başarı, sorgu ve iptal doğrulanmadan daha geniş teste geçilmez.

## Panel İşlemleri

Ultra Sipariş Paneli kargo bölümünde şu işlemler görünür:

- Payload hazırla
- Kargo oluştur
- Barkod oluştur
- Kargo sorgula
- Kargo iptal et

Paraşüt cari blokajı Navlungo payload hazırlığını durdurmaz. Son “Fatura ve Kargo oluştur” aşaması Paraşüt ve Navlungo durumunu ayrı ayrı raporlar.

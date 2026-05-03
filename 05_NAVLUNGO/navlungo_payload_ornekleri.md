# Navlungo Payload Örnekleri

V6.5 Navlungo payload kaynağı `08_KARGO_PAKETLERI` sayfasıdır. Payload `navlungoTaslakPayloadHazirla(kargoPaketId)` ve `navlungoKargoDryRun(kargoPaketId)` ile hazırlanır.

## Örnek Yapı

```json
{
  "platform": "tesbih_kuyusu",
  "posts": [
    {
      "reference_id": "KP-AS-20260503-001",
      "carrier_id": 1,
      "post_type": 2,
      "cod_payment_type": "",
      "sender_address_id": "ADDR-1",
      "sender": {
        "name": "Tesbih Kuyusu",
        "phone": "+90 555 111 00 00",
        "email": "operasyon@tesbihkuyusu.local",
        "address": "Gönderici adresi",
        "country": "tr",
        "city": "İzmir",
        "district": "Menderes",
        "post_code": ""
      },
      "recipient": {
        "name": "Navlungo QA Test Alıcı",
        "phone": "+90 555 111 11 11",
        "email": "qa-test@tesbihkuyusu.local",
        "address": "QA kontrollü test adresi",
        "country": "tr",
        "city": "İzmir",
        "district": "Menderes",
        "post_code": ""
      },
      "post": {
        "desi": 1,
        "package_count": 1,
        "price": "",
        "note": "AS-20260503-001"
      },
      "barcode_format": "pdf",
      "custom_data_1": "AS-20260503-001",
      "custom_data_2": "KP-AS-20260503-001",
      "custom_data_3": "TESBIH_KUYUSU",
      "custom_data_4": "TEST"
    }
  ]
}
```

## Readback

Dry-run sonrası 08 sayfasında şu alanlar dolmalıdır:

- `Navlungo_Payload_JSON`
- `Navlungo_Durum`
- `Test_Kargo_Mu`
- `Navlungo_Hata_Mesaji`

Canlı gönderim `NAVLUNGO_CANLI_GONDERIM = Evet` olmadıkça yapılmaz.

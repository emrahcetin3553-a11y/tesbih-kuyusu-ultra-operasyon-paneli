# Navlungo Payload Yapısı

V6.5 Navlungo payload kaynağı `08_KARGO_PAKETLERI` sayfasıdır. Payload `navlungoTaslakPayloadOlustur(kargoPaketId)` ve `navlungoKargoTaslakTestEt(kargoPaketId)` ile hazırlanır.

## Yapı

```json
{
  "platform": "tesbih_kuyusu",
  "posts": [
    {
      "reference_id": "KP-AS-20260503-001",
      "carrier_id": 1,
      "post_type": 2,
      "cod_payment_type": "",
      "sender": {
        "addressId": "ADDR-1"
      },
      "recipient": {
        "name": "Bediha Çetin",
        "phone": "+905523730403",
        "email": "",
        "address": "Gümüldür Fevzi Çakmak Mah. 6266 Sokak No: 28",
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
      "custom_data_1": "AS-20260503-001",
      "custom_data_2": "KP-AS-20260503-001",
      "custom_data_3": "TESBIH_KUYUSU",
      "custom_data_4": "QA"
    }
  ]
}
```

## Readback

Payload hazırlığı ve API aksiyonları sonrası 08 sayfasında şu alanlar dolmalıdır:

- `Navlungo_Reference_ID`
- `Navlungo_Carrier_ID`
- `Navlungo_Carrier_Name`
- `Navlungo_Status`
- `Navlungo_Payload_Hash`
- `Navlungo_Last_Response`
- `Navlungo_Last_Error`
- `Navlungo_Post_Number`
- `Navlungo_Tracking_URL`
- `Navlungo_Barcode_URL`
- `Navlungo_Created_At`
- `Navlungo_Cancelled_At`
- `Navlungo_Test_Mu`

Canlı gönderim `NAVLUNGO_CANLI_GONDERIM = Evet` olmadıkça yapılmaz.

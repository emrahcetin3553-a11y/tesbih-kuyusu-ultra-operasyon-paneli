# Paraşüt Payload Örnekleri

Satış faturası taslak payload ana yapısı:

```json
{
  "data": {
    "type": "sales_invoices",
    "attributes": {
      "item_type": "invoice"
    },
    "relationships": {
      "contact": {
        "data": { "id": "PARASUT_CARI_ID", "type": "contacts" }
      },
      "details": {
        "data": []
      }
    }
  },
  "included": []
}
```

İstisna kodu satış faturası taslak kalemine yazılmaz. e-belge kararı `11_EBELGE_ISTISNA` katmanında tutulur.

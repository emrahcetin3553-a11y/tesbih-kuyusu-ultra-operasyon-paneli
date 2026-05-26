# Tesbih Kuyusu V6.4.2 Test Raporu

Tarih: 2026-05-02

## Çalıştırılan Testler

| Test | Sonuç |
|---|---|
| Syntax kontrolü | Geçti |
| Duplicate function | Geçti |
| Üretim core/HTML yasak kelime | Geçti |
| Sheet builder | Geçti |
| Sheet kolon uyumu | Geçti |
| Veri sözlüğü kapsamı | Geçti |
| HTML callback bağlantıları | Geçti |
| Menü fonksiyon bağlantıları | Geçti |
| Ultra panel mock | Geçti |
| Toplu 10 sipariş mock | Geçti |
| Toplu 50 sipariş mock | Geçti |
| İki ödeme yapan kişi | Geçti |
| Adres değişikliği | Geçti |
| Gümüş ürün | Geçti |
| Paraşüt payload dry-run | Geçti |
| Navlungo payload dry-run | Geçti |
| Canlı POST kilidi | Geçti |

## Mock Çıktısı

```json
{
  "result": "V6_4_2_ULTRA_OPERASYON_MOCK_OK",
  "itemRows": 82,
  "paymentRows": 79,
  "invoiceGroups": 79,
  "cargoRows": 77,
  "bankScore": 100,
  "ultraSaveElapsedMs": 4,
  "bulk10ElapsedMs": 37,
  "bulk50ElapsedMs": 234,
  "tokenRefreshCalls": 2,
  "salesPostCalls": 0
}
```

## Sonuç

Repo/local kabul testleri geçti. Gerçek Apps Script UI test kanıtı ayrıca alınmalıdır.

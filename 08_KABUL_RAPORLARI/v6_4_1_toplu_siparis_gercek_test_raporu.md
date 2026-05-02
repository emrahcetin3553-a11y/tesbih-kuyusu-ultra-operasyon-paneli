# Tesbih Kuyusu V6.4.1 Toplu Sipariş Test Raporu

Tarih: 2026-05-02

## Test Kapsamı

- Toplu panel callback: `topluUltraSiparisKaydet`
- Toplu 10 sipariş batch kaydı
- Toplu 50 sipariş simülasyonu
- Her sipariş için 02/04/05/08 yazımı
- Toplu ERP güncelleme sonrası 03/06/07/10/11/12 üretimi

## Yerel Harness Sonucu

```json
{
  "bulk10ElapsedMs": 26,
  "bulk50ElapsedMs": 200,
  "itemRows": 82,
  "paymentRows": 79,
  "invoiceGroups": 79,
  "cargoRows": 77
}
```

## Doğrulanan Kurallar

- Operatör ID yazmadan sipariş üretimi yapılır.
- Ürünler 04 tablosuna satır bazlı yazılır.
- Ödemeler 05 tablosuna yazılır.
- Ödeme yapan kişi bazında 06 fatura grupları oluşur.
- Kargo 08 tablosunda tek açık sipariş / tek paket varsayımıyla tutulur.
- Paraşüt taslak satırları 07 tablosuna hazırlanır.
- Canlı POST kapıları kapalı kalır.

## Gerçek Sheet Durumu

V6.4.1 XLSX native Google Sheet olarak import edildi. Ancak toplu panelin Apps Script UI içinden gerçek tıklama ile yazdığı kanıt henüz kapatılmadı. Bunun nedeni `clasp run` gerçek yürütme kapısının yetki/API tarafında engellenmesidir.

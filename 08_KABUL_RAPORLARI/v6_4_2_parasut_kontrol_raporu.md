# Tesbih Kuyusu V6.4.2 Paraşüt Kontrol Raporu

Tarih: 2026-05-02

## Güvenlik Kapıları

| Kapı | Varsayılan |
|---|---|
| `PARASUT_CANLI_GONDERIM` | `Hayır` |
| `EBELGE_CANLI_GONDERIM` | `Hayır` |

Canlı sales invoice POST yapılmadı. Mock sayaç sonucu: `salesPostCalls = 0`.

## Test Sonuçları

| Kontrol | Sonuç |
|---|---|
| Token refresh mock | Geçti |
| HTTP 401 sonrası refresh + retry | Geçti |
| Product GET mock | Geçti |
| Cari aday puanlama | Geçti |
| Sadece isimle kesin cari kabul etmeme | Korundu |
| Sales invoice payload dry-run | Geçti |
| e-belge/istisna satış faturası payload'una yazılmadı | Geçti |

## Payload Yapısı

Dry-run payload şu temel yapıyı üretir:

- `data.type = sales_invoices`
- `attributes.item_type = invoice`
- `relationships.contact.data`
- `relationships.details.data[]`
- `included[].type = sales_invoice_details`
- her detayda `product` relationship

## Kalan Risk

Gerçek Paraşüt GET testi için `parasutApiBaglantiTestiTam()` Apps Script UI üzerinden çalıştırılmalıdır. Token ve secret değerleri rapora yazılmamalıdır.

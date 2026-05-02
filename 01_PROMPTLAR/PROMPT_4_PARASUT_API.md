# Prompt 4 - Paraşüt API

Paraşüt satış faturası taslak katmanıdır. e-Arşiv/e-Fatura ve istisna kararı `11_EBELGE_ISTISNA` katmanında yürür.

Kurallar:

- Canlı fatura POST varsayılan kapalıdır.
- `PARASUT_CANLI_GONDERIM = Hayır` iken `sales_invoices` POST yapılmaz.
- Token ve secret değerleri koda veya GitHub'a yazılmaz.
- Ürün ID map Script Properties üzerinden okunur.
- Sadece isimle kesin cari kabul edilmez.
- Cari adayları TCKN/VKN, telefon, ad soyad ve adresle puanlanır.

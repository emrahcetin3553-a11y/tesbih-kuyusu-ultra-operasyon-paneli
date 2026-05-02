# Paraşüt Canlı Test Notları

Güvenli test sırası:

1. Script Properties var/yok kontrolü.
2. Token refresh.
3. Company scoped GET.
4. Ürün GET testleri.
5. Cari aday arama.
6. Fatura payload dry-run.
7. `PARASUT_CANLI_GONDERIM = Hayır` iken canlı POST yapılmadığını doğrulama.

Canlı fatura taslağı yalnız bilinçli onayla ve tek fatura grubu için denenmelidir.

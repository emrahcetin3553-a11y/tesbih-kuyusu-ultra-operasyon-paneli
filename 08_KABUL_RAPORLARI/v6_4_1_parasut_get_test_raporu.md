# Tesbih Kuyusu V6.4.1 Paraşüt GET Test Raporu

Tarih: 2026-05-02

## Kod Durumu

Korunan / güçlendirilen fonksiyonlar:

- `parasutTokenGecerliMi()`
- `parasutAccessTokenAl()`
- `parasutTokenYenile()`
- `parasutApiFetch(method, endpoint, payload)`
- `parasutApiBaglantiTestiTam()`
- `parasutUrunKartlariniKontrolEt()`
- `parasutCariAdaylariniGetir(faturaBilgisi)`
- `parasutCariOlusturVeyaBagla(faturaGrubuId, secim)`
- `parasutFaturaTaslakGonder(groupId)`
- `parasutFaturaTaslakGonderOnayli(faturaGrubuId)`

## Güvenlik

- Token/secret koda gömülmedi.
- Script Properties kullanılmaya devam eder.
- `PARASUT_CANLI_GONDERIM = Hayır` iken `sales_invoices` POST yapılmaz.
- 401 durumunda token refresh + retry mantığı korunur.
- Ürün map Script Properties öncelikli okunur.
- Ürün ID yoksa taslak durur.
- Sadece isimle kesin cari kabul edilmez.
- Cari oluşturma canlı POST'u operatör/onay kapısına bağlıdır.

## Çalıştırılan Test

Yerel güvenli harness:

```json
{
  "tokenRefreshCalls": 2,
  "salesPostCalls": 0,
  "result": "V6_4_1_ULTRA_OPERASYON_MOCK_OK"
}
```

## Gerçek Paraşüt GET Durumu

Bu oturumda gerçek Paraşüt GET çağrısı yapılmadı. Nedeni: Apps Script `clasp run` gerçek yürütmesi yetki/API kapısında kaldı ve token/secret değerleri yerelde açık değildir.

Canlı GET kabulü için ana Apps Script UI içinde şu fonksiyon çalıştırılmalıdır:

1. `parasutApiBaglantiTestiTam()`
2. Beklenen loglar: Script Properties var/yok, token refresh sonucu, company GET sonucu, 6 ürün GET sonucu, canlı POST yapılmadı.

Canlı fatura POST bu testte yapılmamalıdır.

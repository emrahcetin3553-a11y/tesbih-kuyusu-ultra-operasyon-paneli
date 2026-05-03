# Tesbih Kuyusu V6.5 Test Raporu

Tarih: 2026-05-03

## Çalıştırılan komutlar

- `node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- V6.5 Sheet builder:
  - `node 07_TEST_DOSYALARI/build_v6_5_sheet.mjs`
- Core / HTML / duplicate / yasak kelime / callback kontrol scripti
- Sheet header ve veri sözlüğü kapsam kontrol scripti

## Mock test sonucu

```json
{
  "ok": true,
  "openRows": 2,
  "invoiceGroups": 3,
  "addressRows": 2,
  "salesPostCalls": 0,
  "contactPostCalls": 0,
  "tokenRefreshCalls": 1,
  "navlungoAuthCalls": 1,
  "navlungoPostCalls": 5
}
```

## Doğrulanan senaryolar

- Tek sipariş kaydı Açık_Sipariş_ID üretti.
- Birleşik isim `Mehmet Nuri Çetin` olarak normalize edildi.
- Kargo alıcısı, ödeme yapan ve fatura kişisi tam adla aktı.
- TCKN varsayılanı `11111111111` üretildi.
- e-belge tipi `e-Arşiv` oldu.
- Adres geçmişi `15_MUSTERI_ADRESLERI` içine yazıldı.
- Panel cari seç akışı `C-1` ID’sini fatura grubuna bağladı.
- `07_PARASUT_FATURA` satırında `Paraşüt_Cari_ID` oluştu.
- Fatura payload dry-run içinde `relationships.contact.data.id` oluştu.
- Cari ID temizlenince payload başarı sayılmadı ve blokaj üretti.
- Aynı siparişte iki ödeme yapan kişi için iki ayrı fatura grubu oluştu.
- Seçili sipariş düzenleme panel payload’ı üretti.
- Paraşüt GET/token refresh mock akışı çalıştı.
- Navlungo token, carrier, payload, gönderi oluşturma, barkod, sorgu ve iptal akışı çalıştı.
- `NAVLUNGO_CANLI_GONDERIM = Hayır` iken Navlungo POST yapılmadı.
- `NAVLUNGO_CANLI_GONDERIM = Evet` senaryosunda yalnız Navlungo POST akışı açıldı.
- Canlı sales invoice POST sayısı: `0`
- Canlı contact POST sayısı: `0`
- Navlungo POST sayısı: `5`

## Performans

- Yerel mock harness çalışma süresi: yaklaşık `66.4 ms`

Bu süre gerçek Apps Script UI süresi değildir. Gerçek UI performansı ayrıca Google Sheet üzerinde ölçülmelidir.

## Sonuç

Mock ve statik kabul kapıları geçti. Gerçek Google Sheet UI testi kanıtı bulunmadığı için nihai canlı kabul tamamlandı denmez.

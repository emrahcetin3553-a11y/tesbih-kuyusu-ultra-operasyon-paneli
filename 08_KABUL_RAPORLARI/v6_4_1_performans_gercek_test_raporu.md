# Tesbih Kuyusu V6.4.1 Performans Test Raporu

Tarih: 2026-05-02

## Yapılan Performans Düzeltmesi

`topluUltraSiparisKaydet_()` içinde her siparişten sonra ağır ERP yenileme çalışması kaldırıldı. Siparişler önce hızlı yazılır, sonra tek toplu ERP güncellemesi yapılır.

Ana değişiklik:

- `kaydetUltraSiparisHizli_(form, options)` içine `deferRefresh` desteği eklendi.
- Toplu kayıtta her payload `{ deferRefresh: true }` ile yazılır.
- `sistemiYenile_()`, fatura/cari, Paraşüt taslak, müşteri hafıza ve kontrol merkezi işlemleri toplu yazım sonrası bir kez çalışır.

## Ölçüm

Komut:

`node 07_TEST_DOSYALARI/test_v6_4_1_ultra_operasyon_mock.js`

Son ölçüm:

```json
{
  "ultraSaveElapsedMs": 3,
  "bulk10ElapsedMs": 26,
  "bulk50ElapsedMs": 200
}
```

## Değerlendirme

- Tek sipariş hedefi: 1-5 saniye. Yerel harness sonucu: 3 ms.
- 10 sipariş hedefi: makul süre. Yerel harness sonucu: 26 ms.
- 50 sipariş simülasyonu: 200 ms.
- Gerçek Apps Script UI süresi henüz ölçülemedi; `clasp run` yetki/API kapısında kaldı.

Performans kod mantığı hedefle uyumlu, fakat gerçek Apps Script runtime ölçümü üretim kabulünden önce alınmalıdır.

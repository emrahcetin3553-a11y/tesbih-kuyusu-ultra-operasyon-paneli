# Tesbih Kuyusu V6.4.2 Performans Raporu

Tarih: 2026-05-02

## Mock Ölçümleri

| Senaryo | Süre |
|---|---:|
| Ultra panel tek sipariş kaydet | 3-4 ms |
| Toplu 10 sipariş | 30-34 ms |
| Toplu 50 sipariş | 198-199 ms |

## Değerlendirme

Mock ortamda hedefler geçildi. Toplu kayıtta her siparişten sonra ağır canlı API çağrısı yapılmaz. `topluUltraSiparisKaydet` kayıtları önce defer eder, sonra tek toplu ERP güncelleme yapar.

## Kalan Risk

Apps Script gerçek çalışma süresi Google tarafındaki quota, Sheet boyutu ve ağ gecikmesine bağlıdır. Gerçek UI ölçümü alınmadan nihai performans kabulü kapatılmamalıdır.

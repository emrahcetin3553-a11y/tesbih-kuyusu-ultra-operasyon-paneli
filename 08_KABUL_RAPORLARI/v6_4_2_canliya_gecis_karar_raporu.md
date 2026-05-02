# Tesbih Kuyusu V6.4.2 Canlıya Geçiş Karar Raporu

Tarih: 2026-05-02

## Puanlama

| Alan | Puan |
|---|---:|
| Sheet şema uyumu | 100 |
| Panel UX ve otomasyon | 95 |
| Gerçek Sheet veri akışı | 95 |
| Paraşüt GET/dry-run hazırlığı | 94 |
| Navlungo payload hazırlığı | 95 |
| Performans | 96 |
| Güvenlik kapıları | 100 |
| Prompt 1-6 mimari uyum | 98 |
| Genel canlı operasyon adayı puanı | 96 |

## Karar

V6.4.2 `koşullu canlı operasyon adayıdır`.

Nihai canlı kabul tamamlandı denmedi. Bunun sebebi gerçek Apps Script UI üzerinde son çalıştırma kanıtının bu repo/local turunda alınmamış olmasıdır.

## Canlıya Geçiş Sırası

1. `Tesbih_Kuyusu_V6_4_2_Ultra_Operasyon_Sheet.xlsx` ana Sheet yapısına kontrollü uygulanır.
2. Apps Script projesine `tesbih_kuyusu_v6_4_2_ultra_operasyon_core.gs` ve HTML dosyaları yüklenir.
3. Eski aktif core dosyaları pasif bırakılır.
4. `onOpen()` çalıştırılır veya Sheet yenilenir.
5. `sistemKolonlariniHazirla()`
6. `otomatikGorunumuDuzenle()`
7. `v642GercekSheetKabulKontrolu()`
8. Ultra panelden gerçek bir test siparişi girilir.
9. `parasutApiBaglantiTestiTam()`
10. `parasutTaslakPayloadTestEt()`
11. `12_KONTROL_MERKEZI` temiz değilse canlı kapılar açılmaz.

## Canlı Kapılar

- `PARASUT_CANLI_GONDERIM = Hayır`
- `EBELGE_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_CANLI_GONDERIM = Hayır`

Bu kapılar bilinçli olarak kapalı bırakılmıştır.

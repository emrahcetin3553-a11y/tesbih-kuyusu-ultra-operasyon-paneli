# Tesbih Kuyusu V6.5 Canlıya Geçiş Karar Raporu

Tarih: 2026-05-03

## Karar

V6.5 yerel üretim adayı dosyaları hazırlandı; ancak gerçek Google Sheets UI test kanıtı bu çalışmada üretilmediği için durum:

**Koşullu üretim adayı, nihai canlı kabul değil.**

## Canlıya geçmeden önce zorunlu gerçek UI testleri

1. Apps Script projesinde sadece V6.5 core ve aktif HTML panel dosyalarını bırak.
2. `Tesbih_Kuyusu_V6_5_Ultra_Operasyon_Sheet.xlsx` içeriğini test kopyasında aç.
3. `sistemKolonlariniHazirla()` çalıştır.
4. `otomatikGorunumuDuzenle()` çalıştır.
5. Ultra Sipariş Paneli ile tek sipariş gir ve süreyi kaydet.
6. Ultra Sipariş Paneli içinde `Yeni sipariş ekle` ile 3 sipariş gir ve süreyi kaydet.
7. Aynı panelden 10 sipariş gir ve süreyi kaydet.
8. Cari seç / cari oluştur dry-run akışını çalıştır.
9. `parasutApiBaglantiTestiTam()` çalıştır.
10. `parasutTaslakPayloadTestEt()` ile contact relationship oluştuğunu doğrula.
11. `PARASUT_CANLI_GONDERIM`, `PARASUT_CARI_CANLI_OLUSTURMA`, `EBELGE_CANLI_GONDERIM`, `NAVLUNGO_CANLI_GONDERIM` değerlerinin `Hayır` kaldığını kontrol et.

## Canlı POST kanıtı

Yerel mock testte:

- `salesPostCalls = 0`
- `contactPostCalls = 0`

Gerçek Apps Script ortamında canlı POST yapılmadığı ayrıca yürütme günlüğüyle doğrulanmalıdır.

## Kalan riskler

- Gerçek Apps Script UI performansı bu raporda ölçülmedi.
- Gerçek Paraşüt contact search / cari oluşturma dry-run sonucu kullanıcı projesinde çalıştırılmalıdır.
- Ana `TESBIH_KUYUSU_MASTER_SHEET` üzerine otomatik yükleme yapılmadı; dosyalar yerel repo içinde hazırdır.

## Sonuç

V6.5 dosya ve mock kapıları geçti. Gerçek UI kanıtı tamamlanmadan `%95 geçti`, `canlı kabul tamamlandı` veya `üretim hazır` denmemelidir.

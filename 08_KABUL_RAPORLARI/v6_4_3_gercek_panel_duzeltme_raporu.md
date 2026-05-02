# Tesbih Kuyusu V6.4.3 - Gerçek Panel Düzeltme Raporu

Tarih: 2026-05-02

## Karar

V6.4.2 kabul edilmediği için V6.4.3 üretim düzeltmesi hazırlandı ve ana Apps Script projesine yüklendi.

Bu rapor gerçek durumu ayırır:

- Kod düzeltmesi yapıldı.
- Canlı Apps Script proje dosyaları güncellendi.
- Local syntax, duplicate, yasak kelime, Sheet builder ve mock testleri geçti.
- `TESBIH_KUYUSU_MASTER_SHEET` üzerinde canlı veri okuma yapıldı.
- Tarayıcı otomasyon aracı çalışmadığı için Ultra Sipariş Paneli gerçek UI tıklama testi bu oturumdan kanıtlanamadı.

## Canlı Apps Script Yükleme

Ana Apps Script proje ID:

`1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

Uzak projede aktif dosyalar:

- `tesbih_kuyusu_v6_4_3_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `topluSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`
- `appsscript.json`

Eski `tesbih_kuyusu_v6_4_1_ultra_operasyon_core.js` uzak projeden kaldırıldı.

Core SHA256:

`09F7B6FEDE7841897CBE79BA93F80BCE1B7D5CA4E67D12B3C0336166593C5166`

Ultra panel SHA256:

`E051B77D46431EB0DDB673D8F384AE9A9AA36BF2E43540DBC3AFEA367DA1EEB3`

## Yapılan Düzeltmeler

- Ultra panel tam ekran geniş dialog olarak güncellendi.
- Panel sıralaması `Müşteri -> Kargo -> Ürünler -> Ödemeler -> Fatura/Cari -> Kontrol Özeti -> Aksiyonlar` yapıldı.
- Aynı panel içinde `Yeni sipariş ekle` desteği eklendi.
- WhatsApp telefonu ve sipariş sahibi girilince kargo alıcısı ve kargo telefonu varsayılanları otomatik oluşur.
- Telefon için müşteri hafızası okunur; son adres, il, ilçe ve kargo firması önerilir.
- Operatörün dokunduğu kargo alanları tekrar otomatik ezilmez.
- Ödeme yapan kişi girilince Fatura/Cari bloğu otomatik oluşur.
- Fatura kişisi her zaman ödeme yapan kişi olarak korunur.
- Gerçek kişi için TCKN boşsa `11111111111` atanır.
- `11111111111` için e-belge tipi `e-Arşiv` olur.
- Ürün satırı ödeme yapan/fatura kişisiyle bağlanır.
- Tek ödeme yapan varsa ürün satırına otomatik önerilir.
- İki ödeme yapan varsa iki ayrı fatura grubu korunur.
- `Kontrol et` sahte OK vermez; kaydedilmiş siparişte `12_KONTROL_MERKEZI` sonucu okunur.
- Yeni sipariş kaydedilmeden kontrol edilirse gerçek kontrol merkezi sonucunun ancak kayıt sonrası alınacağı açıkça yazılır.
- Kaydetme sırasında tam sistem yenileme yerine çekirdek sayfa hazırlığı ve sipariş odaklı akış kullanılır.
- Paraşüt cari oluşturma canlı POST kapısı ayrı ayara bağlandı: `PARASUT_CARI_CANLI_OLUSTURMA = Hayır`.
- Canlı cari oluşturma kapısı kapalıyken cari oluşturma sadece payload/dry-run üretir.
- Kargo hazırlığı test aşamasında açık sipariş nedeniyle kritik blokaj üretmeyecek şekilde ayrıldı.
- `Fatura ve Kargo oluştur` son adımında açık sipariş kapanış kuralı ayrı ve açık hata olarak döner.
- Kontrol merkezi beklenen aksiyonları genel cümleden somut kullanıcı aksiyonuna çevrildi.

## Canlı Master Sheet Okuma Bulgusu

Master Sheet:

`https://docs.google.com/spreadsheets/d/1ebgYLgOEE3uET6NRYviGXnh1cziUIal84aJhjhcCY80/edit`

`Yaşar Çetin` siparişi canlı Sheet üzerinde okundu:

- `02_WHATSAPP_KUYRUGU`: kayıt var, açık sipariş ID oluşmuş.
- `04_URUN_KALEMLERI`: ürün satırı oluşmuş.
- `05_ODEMELER`: ödeme yapan, telefon, TCKN, adres, il, ilçe oluşmuş.
- `06_FATURA_GRUPLARI`: fatura kişisi ödeme yapanla aynı, TCKN `11111111111`, e-belge tipi `e-Arşiv`.
- `08_KARGO_PAKETLERI`: kargo alıcısı ve kargo telefonu oluşmuş.
- `12_KONTROL_MERKEZI`: eski çalışan koddan kalan Paraşüt cari, kargo açık sipariş ve e-belge taslak ID blokajları görülmüş.

V6.4.3 kodunda kargo açık sipariş blokajı ve e-belge hazırlık ayrımı düzeltildi; gerçek UI kaydı sonrası yeniden okunmalıdır.

## Çalıştırılan Yerel Kontroller

- Syntax: OK
- Duplicate function: yok
- Function count: 306
- Yasak kelime taraması: bulgu yok
- HTML callback/panel script parse: OK
- Sheet builder: OK
- Mock test: OK
- `salesPostCalls`: 0
- `bulk50ElapsedMs`: 222 ms mock

## Gerçek UI Kanıt Durumu

Bu oturumda tarayıcı otomasyon yüzeyi açılamadı. Bu nedenle aşağıdaki testler için `geçti` yazılmadı:

- Ultra Sipariş Paneli gerçek menüden açıldı.
- Panelden tek sipariş kaydedildi.
- Panelden 10 sipariş kaydedildi.
- Panelden 50 sipariş kaydedildi.
- Gerçek panel süreleri ölçüldü.

Bu testler kullanıcı oturumunda Sheet menüsü üzerinden çalıştırılmalı ve sonrasında Sheet readback yapılmalıdır.

## Çalıştırılacak Kabul Sırası

1. `TESBIH_KUYUSU_MASTER_SHEET` dosyasını yenileyin.
2. `TESBIH KUYUSU PANEL > Ultra sipariş paneli` açın.
3. Yeni test siparişi girin:
   - WhatsApp_Tel
   - Sipariş_Sahibi
   - Ürün
   - Ödeme_Yapan
   - Ödeme_Tutarı
   - Gerekirse kargo adresi
4. Panelde kargo ve fatura/cari varsayılanlarının otomatik dolduğunu kontrol edin.
5. `Kontrol et` çalıştırın.
6. `Kaydet ve ERP güncelle` çalıştırın.
7. Süreyi not edin.
8. `02/04/05/06/07/08/12` sayfalarını kontrol edin.
9. `12_KONTROL_MERKEZI` gerçek blokaj gösteriyorsa paneldeki kontrol özetiyle aynı olmalı.
10. Paraşüt cari ID yoksa panelde cari seç/oluştur akışı kullanılmalı; ID elle kopyalanmamalı.

## Kabul Kararı

V6.4.3 kodu canlı Apps Script projesine yüklenmiş üretim düzeltmesi adayıdır.

Nihai canlı kabul tamamlandı denemez; gerçek Ultra Sipariş Paneli UI testi kullanıcı oturumunda çalıştırılıp readback kanıtı alınmalıdır.

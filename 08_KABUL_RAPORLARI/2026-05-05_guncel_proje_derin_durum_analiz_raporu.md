# 2026-05-05 Güncel Proje Derin Durum Analiz Raporu

Bu rapor, kullanıcının "güncel proje ile ilgili GitHub, canlı Apps Script kodu ve canlı Sheet tablosu derin analiz edilsin" talebi üzerine hazırlanmıştır.

Bu turda üretim kodu, HTML panel, canlı Sheet verisi veya Apps Script davranışı değiştirilmedi. Sadece okuma, karşılaştırma, statik analiz ve raporlama yapıldı.

## 1. İncelenen Kaynaklar

### GitHub / lokal repo

- Repo: `emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli`
- Lokal klasör: `C:\Users\emrah\Desktop\tesbih-kuyusu-ultra-operasyon-paneli`
- Aktif branch: `v6-5-production-candidate`
- Aktif commit: `b16cc8f0fa7e16e4af7d862f9817f2de9ca29c23`
- Açık PR: `#6 V6.5 ultra panel operasyon aksiyonları`
- PR URL: `https://github.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/pull/6`

İncelenen ana dosyalar:

- `README.md`
- `CHANGELOG.md`
- `CANLIYA_GECIS.md`
- `PROJE_DURUM_RAPORU.md`
- `appsscript.json`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/*`
- PR #6 yorum akışı

### Canlı Apps Script

- Script ID: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`
- Canlı pull klasörü: `C:\Users\emrah\Desktop\clasp_v65_main_upload`
- Çekilen aktif dosyalar:
  - `appsscript.json`
  - `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
  - `ultraSiparisPaneli.html`
  - `cariSecDialog.html`
  - `urunEkleDialog.html`
  - `odemeEkleDialog.html`
  - `kargoBilgisiDialog.html`

### Canlı Sheet

- Sheet adı: `TESBIH_KUYUSU_MASTER_SHEET`
- Sheet ID: `1ebgYLgOEE3uET6NRYviGXnh1cziUIal84aJhjhcCY80`
- Locale: `tr_TR`
- Timezone: `Europe/Istanbul`

İncelenen sayfalar:

- `00_KULLANIM_KILAVUZU`
- `01_AYARLAR`
- `02_WHATSAPP_KUYRUGU`
- `03_ACIK_SIPARISLER`
- `04_URUN_KALEMLERI`
- `05_ODEMELER`
- `06_FATURA_GRUPLARI`
- `07_PARASUT_FATURA`
- `08_KARGO_PAKETLERI`
- `09_MUSTERI_HAFIZA`
- `10_808_FINANS_ONIZLEME`
- `11_EBELGE_ISTISNA`
- `12_KONTROL_MERKEZI`
- `13_VERI_SOZLUGU`
- `14_BANKA_HAREKETLERI`
- `15_MUSTERI_ADRESLERI`

## 2. GitHub Güncellik Durumu

Aktif üretim adayı branch `v6-5-production-candidate` durumundadır.

`main` branch güncel üretim durumunu temsil etmiyor. Aktif V6.5 geliştirmeleri PR #6 içindedir ve PR hâlâ açıktır.

Son aktif branch geçmişinde görülen ana iş başlıkları:

- V6.5 ultra operasyon üretim adayı eklendi.
- Navlungo Domestic API bağlantısı ve kargo akışı eklendi.
- Navlungo QA/LIVE credential ayrımı düzeltildi.
- Navlungo barkod tipi 422 hatası düzeltildi.
- Paraşüt sales invoice create payload düzeltildi.
- Ultra panel operasyon aksiyonları bağlandı.
- QZ Tray barkod yazdırma akışı eklendi.
- Apps Script Execution API / clasp run izinleri çözüldü.
- `senkronizeDurumForOpen("AS-20260504-001")` canlı readback testi raporlandı.
- Panel menü/kısayol güvenilirlik analizi yapıldı.

### GitHub tarafında tespit edilen dokümantasyon eskimesi

`README.md`, `PROJE_DURUM_RAPORU.md` ve `CHANGELOG.md` hâlâ V6.4.5 odaklı görünüyor. Aktif canlı kod V6.5 olduğu için bu belgeler güncel durumu eksik temsil ediyor.

Bu doğrudan kod hatası değildir; ancak repo üzerinden inceleme yapan biri yanlışlıkla V6.4.5'i güncel kabul edebilir.

### GitHub tarafında aktif/pasif dosya ayrımı

Repo içinde V6.4.1, V6.4.2, V6.4.3, V6.4.4, V6.4.5 ve V6.5 dosyaları birlikte duruyor. Canlı Apps Script'te eski core dosyaları aktif değil; fakat GitHub klasör yapısında eski dosyalar aktif üretim dosyasıyla yan yana olduğu için inceleme riski oluşuyor.

Aktif canlı Apps Script dosyaları şunlarla sınırlı:

- `appsscript.json`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`

## 3. Canlı Apps Script ve GitHub Eşleşmesi

`clasp pull --force` ile canlı Apps Script projesi tekrar çekildi. Canlı dosyalar ile GitHub aktif branch dosyaları SHA düzeyinde karşılaştırıldı.

| Dosya | Canlı SHA256 | GitHub SHA256 | Sonuç |
| --- | --- | --- | --- |
| `tesbih_kuyusu_v6_5_ultra_operasyon_core` | `062FA6202CE9856E852F4C80FE2F6957CFC6A6192D7806C2EF2CBBC447374ABE` | `062FA6202CE9856E852F4C80FE2F6957CFC6A6192D7806C2EF2CBBC447374ABE` | Eşleşiyor |
| `ultraSiparisPaneli.html` | `7E8BB96D0A6B95ED0B05E43F2D9669278E0CE08C93F2570C56A9A30CBA2B583E` | `7E8BB96D0A6B95ED0B05E43F2D9669278E0CE08C93F2570C56A9A30CBA2B583E` | Eşleşiyor |
| `appsscript.json` | `AE709CAAFCABE589F0DD70E121603466A582EAE06F3EB7C117896146ED7B0708` | `AE709CAAFCABE589F0DD70E121603466A582EAE06F3EB7C117896146ED7B0708` | Eşleşiyor |
| `cariSecDialog.html` | `3315B7551E3440846ABAA25929B7AB7B921E3CFD9F57D8CFE8AAAD04C778D0D3` | `3315B7551E3440846ABAA25929B7AB7B921E3CFD9F57D8CFE8AAAD04C778D0D3` | Eşleşiyor |
| `urunEkleDialog.html` | `CF3AC682F8C32EC29ADE27FFBFC8431AEBCDFC92F265C7BC4B79D6224695A3DA` | `CF3AC682F8C32EC29ADE27FFBFC8431AEBCDFC92F265C7BC4B79D6224695A3DA` | Eşleşiyor |
| `odemeEkleDialog.html` | `8C268C033E232EDFC2329567F3229A2B00B4DB9F5E1C2E03BB0B4502E79B51A7` | `8C268C033E232EDFC2329567F3229A2B00B4DB9F5E1C2E03BB0B4502E79B51A7` | Eşleşiyor |
| `kargoBilgisiDialog.html` | `A40A6F96992D14D18BA1539DAC1FD9B50F999FE0321D911E6EB06A23678E2693` | `A40A6F96992D14D18BA1539DAC1FD9B50F999FE0321D911E6EB06A23678E2693` | Eşleşiyor |

Sonuç: Canlı Apps Script aktif dosyaları ile GitHub aktif branch dosyaları eşleşiyor.

## 4. Aktif Core Kod Analizi

Aktif core dosyası:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- Satır sayısı: 6174
- Boyut: 310925 byte

Aktif HTML panel:

- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- Satır sayısı: 1250
- Boyut: 64576 byte

### Statik kontrol sonuçları

| Kontrol | Sonuç |
| --- | --- |
| Core syntax | OK (`node --check` ile parse edildi) |
| Duplicate public function | Yok |
| Public/top-level function sayısı | 106 |
| Menü item sayısı | 37 |
| Eksik menü callback | 0 |
| Aktif core/HTML yasak ifade taraması | Bulgu yok |
| Aktif Apps Script eski V6.4.x core dosyası | Yok |
| Canlı Apps Script'te `topluSiparisPaneli.html` | Yok |

### HTML callback bağlantıları

Aktif panelde kullanılan önemli backend callback'leri:

- `getDialogData`
- `getUltraPanelHazirlik`
- `ultraSiparisKontrolEt`
- `ultraSiparisKaydet`
- `topluUltraSiparisKaydet`
- `ultraPanelOperasyonCalistir`
- `parasutCariPanelAksiyonu`
- `navlungoKargoTaslakTestEt`
- `navlungoKargoOlusturOnayli`
- `navlungoBarkodAl`
- `navlungoGonderiSorgula`
- `navlungoGonderiIptalEt`
- `qzBarkodBilgisi`
- `qzBarkodYazdirmaSonucuKaydet`

Bu callback adları core içinde mevcut.

### Dikkat edilmesi gereken kod yüzeyleri

`v65GercekSheetKabulKontrolu_()` gerçek Sheet üzerinde kayıt üretir. Bu fonksiyon sadece kontrollü kabul testi için kullanılmalı; canlı veri varken gelişigüzel çalıştırılmamalıdır.

`sistemiYenile_()` tüm akışı baştan işleyen ağır fonksiyondur. Günlük operatör akışında mümkün olduğunca seçili sipariş/delta güncelleme tercih edilmelidir.

PR #6 son yorumunda onaylanan ama henüz uygulanmamış görev: menü/kısayol güvenli düzeltme uygulamasıdır. Özellikle parametre isteyen menüler, seçili satır bağlamı ve canlı kapı/onay güvenliği güçlendirilmelidir.

## 5. Testler

Bu turda çalıştırılan testler:

```text
node --check <aktif core js kopyası>
```

Sonuç: Syntax OK.

```text
node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js
```

Sonuç:

```json
{
  "ok": true,
  "openRows": 4,
  "invoiceGroups": 5,
  "addressRows": 5,
  "salesPostCalls": 1,
  "contactPostCalls": 0,
  "tokenRefreshCalls": 2,
  "navlungoAuthCalls": 10,
  "navlungoPostCalls": 6
}
```

Not: Bu Node testi lokal harness testidir; gerçek Paraşüt/Navlungo canlı POST kanıtı değildir. Bu analiz turunda gerçek Paraşüt, Navlungo veya e-belge POST çağrısı yapılmadı.

## 6. Canlı Sheet Şema Analizi

Canlı Sheet'te 16 sayfa mevcut ve temel V6.5 mimarisine uygun görünüyor:

- `00_KULLANIM_KILAVUZU`
- `01_AYARLAR`
- `02_WHATSAPP_KUYRUGU`
- `03_ACIK_SIPARISLER`
- `04_URUN_KALEMLERI`
- `05_ODEMELER`
- `06_FATURA_GRUPLARI`
- `07_PARASUT_FATURA`
- `08_KARGO_PAKETLERI`
- `09_MUSTERI_HAFIZA`
- `10_808_FINANS_ONIZLEME`
- `11_EBELGE_ISTISNA`
- `12_KONTROL_MERKEZI`
- `13_VERI_SOZLUGU`
- `14_BANKA_HAREKETLERI`
- `15_MUSTERI_ADRESLERI`

### 08_KARGO_PAKETLERI sözleşme farkı

Canlı Sheet'teki `08_KARGO_PAKETLERI` başlıkları 34 kolon içeriyor. Kod da 34 kolon bekliyor. Ancak son 8 kolonun sırası canlı Sheet ile kod sözleşmesinde aynı değil.

Canlı Sheet son bölüm:

```text
Navlungo_Payload_Hash
Kontrol_Uyarısı
Kargo_Bekletilsin_Mi
Kargo_Bekletme_Nedeni
Kargo_Cikis_Tarihi
Barkod_Yazdirildi_Mi
Barkod_Yazdirma_Tarihi
Barkod_Yazdirma_Sonucu
Barkod_Yazdirma_Hata
```

Kod `HEADERS.cargo` son bölüm:

```text
Navlungo_Payload_Hash
Barkod_Yazdirildi_Mi
Barkod_Yazdirma_Tarihi
Barkod_Yazdirma_Sonucu
Barkod_Yazdirma_Hata
Kargo_Bekletilsin_Mi
Kargo_Bekletme_Nedeni
Kargo_Cikis_Tarihi
Kontrol_Uyarısı
```

Mevcut `writeObjects_()` fonksiyonu gerçek Sheet başlığını okuyup kolon adına göre yazdığı için bu fark her işlemde otomatik veri kaydırması yapmayabilir. Yine de bu bir sözleşme uyumsuzluğudur. Sheet builder, veri sözlüğü, dış denetim ve kolon uyumu raporlarında hataya neden olur.

### 13_VERI_SOZLUGU kapsam farkı

`13_VERI_SOZLUGU` içinde `08_KARGO_PAKETLERI` sözlüğü güncel 34 kolonu tam kapsamıyor.

Eksik görülen yeni 08 kolonları:

- `Kargo_Bekletilsin_Mi`
- `Kargo_Bekletme_Nedeni`
- `Kargo_Cikis_Tarihi`
- `Barkod_Yazdirildi_Mi`
- `Barkod_Yazdirma_Tarihi`
- `Barkod_Yazdirma_Sonucu`
- `Barkod_Yazdirma_Hata`

Bu durum kabul kriterlerinden "13_VERI_SOZLUGU tüm gerçek kolonları kapsamalı" maddesine aykırıdır.

## 7. 01_AYARLAR Canlı Durumu

Canlı `01_AYARLAR` içinde şu önemli kapılar şu anda açık görünüyor:

| Ayar | Canlı değer | Risk |
| --- | --- | --- |
| `PARASUT_CANLI_GONDERIM` | `Evet` | Paraşüt satış faturası gönderim fonksiyonları gerçek işlem yapabilir |
| `PARASUT_CARI_CANLI_OLUSTURMA` | `Evet` | Cari oluşturma fonksiyonları gerçek contact oluşturabilir |
| `EBELGE_CANLI_GONDERIM` | `Evet` | e-belge tarafında canlı gönderim riski vardır |
| `NAVLUNGO_CANLI_GONDERIM` | `Evet` | Navlungo gönderi/barkod işlemleri gerçek çalışabilir |
| `NAVLUNGO_ENV` | `LIVE` | Kargo tarafı canlı ortamda |
| `NAVLUNGO_TEST_MODE` | `Hayır` | Kargo test işareti kapalı |
| `QZ_TRAY_AKTIF` | `Evet` | Panel barkod yazdırma entegrasyonu aktif |
| `QZ_AUTO_PRINT_AFTER_BARCODE` | `Evet` | Barkod URL geldikten sonra otomatik yazdırma tetiklenebilir |

Bu artık fail-closed test düzeni değildir. Sistem canlı operasyon kapıları açık durumda çalışıyor.

Bu nedenle Apps Script editöründen rastgele `faturaVeKargoOlustur`, `parasutFaturaTaslakGonder`, `navlungoKargoOlusturOnayli`, `navlungoBarkodAl`, `v65GercekSheetKabulKontrolu` gibi fonksiyonlar çalıştırılmamalıdır.

### Navlungo barkod tipi ayarı

Canlı `01_AYARLAR` içinde `NAVLUNGO_DEFAULT_BARCODE_TYPE = 3` görünüyor.

Kod tarafında `sistemKolonlariniHazirla_()` çalışınca bu değer `pdf` olarak normalize edilecek şekilde düzeltilmiş. Ayrıca `navlungoBarcodeType_()` geçersiz değeri API çağrısında `pdf` değerine düşürüyor.

Ancak canlı Sheet ayarının hâlâ `3` görünmesi, `sistemKolonlariniHazirla()` sonrası readback'in henüz bu değeri düzeltmediğini gösterir. Bu ayar `pdf` yapılmalıdır.

## 8. Canlı Veri Akışı Gözlemi

Canlı `03_ACIK_SIPARISLER`, `06_FATURA_GRUPLARI`, `07_PARASUT_FATURA` ve `08_KARGO_PAKETLERI` üzerinde gerçek kayıtlar olduğu görüldü.

Kişisel müşteri verileri bu rapora bilerek yazılmadı.

Gözlenen genel durum:

- `03_ACIK_SIPARISLER` içinde açık siparişler mevcut.
- Bazı siparişlerde `Kargo_Durumu` barkod/gönderi aşamasına gelmiş.
- `06_FATURA_GRUPLARI` içinde Paraşüt cari ID ve fatura ID dolu satırlar mevcut.
- `07_PARASUT_FATURA` içinde Paraşüt sales invoice payload ve response bilgileri yazılıyor.
- `08_KARGO_PAKETLERI` içinde Navlungo post number, takip URL, barkod URL ve barkod yazdırma sonuçları oluşmuş satırlar mevcut.

Bu, Paraşüt ve Navlungo akışlarının canlı tabloda fiilen veri ürettiğini gösterir. Ancak bu analiz turunda yeni canlı işlem yapılmadı.

### Veri saklama riski

`07_PARASUT_FATURA.Response_JSON` ve `08_KARGO_PAKETLERI.Navlungo_Last_Response` alanlarında çok büyük ve ham API response içerikleri tutuluyor. Navlungo response içinde barkod PDF/base64 ve alıcı/gönderici detayları bulunabiliyor.

Bu üretim için izlenebilirlik sağlar; ancak performans, Sheet boyutu ve kişisel veri saklama riski yaratır. Daha güvenli model:

- Ham response yerine maskelenmiş/kısaltılmış özet yazmak.
- Büyük barkod/PDF içeriğini Sheet hücresine koymamak.
- Sadece `post_number`, `tracking_url`, `barcode_url`, `status`, hata özeti ve response hash saklamak.

## 9. 12_KONTROL_MERKEZI Okuma Durumu

Bu turda `12_KONTROL_MERKEZI!A1:N80` aralığı okunmak istendi; Google Sheets API quota 429 verdi:

```text
RESOURCE_EXHAUSTED / ReadRequestsPerMinutePerProject
```

Bu nedenle bu raporda 12 kontrol merkezi için yeni tam tablo readback'i yoktur. Önceki PR #6 final readback raporunda tek ID için `12_KONTROL_MERKEZI` sonucu okunmuş ve raporlanmıştı.

Bu raporda 12 için yeni "temiz/geçti" iddiası yapılmamaktadır.

## 10. PR #6 Son Durum

PR #6 açık durumda.

Son kullanıcı/ChatGPT talimatı:

`PANEL MENU/KISAYOL GUVENLI DUZELTME UYGULAMASI`

Bu talimat onaylı görünüyor ve henüz uygulanmamış yeni görevdir.

İstenen ana işler:

- `selectedContext_()` veya eşdeğer güvenli bağlam çözücü eklemek.
- Parametre isteyen menüler için seçili satır odaklı wrapper eklemek.
- `kaydetVeErpGuncelle` içinde seçili openId yoksa full-system fallback çalıştırmamak.
- Fatura/kargo operasyonlarında seçili openId + canlı gate özeti + açık onay olmadan işlem başlatmamak.
- Sil/geri al/arşivle/müşteri hafızasından sil işlemlerinde onay ve kayıt özeti zorunlu yapmak.

Bu analiz turunda bu kod değişikliği yapılmadı.

## 11. Güncel Risk Listesi

### Kritik

1. Canlı kapılar şu anda açık: Paraşüt, e-belge, Navlungo ve cari oluşturma gerçek işlem yapabilir.
2. PR #6 son onaylı menü/kısayol güvenli düzeltme görevi henüz uygulanmadı.
3. `08_KARGO_PAKETLERI` canlı Sheet kolon sırası ile kod sözleşmesi birebir aynı değil.
4. `13_VERI_SOZLUGU`, canlı 08'in yeni barkod yazdırma ve kargo bekletme kolonlarını tam kapsamıyor.
5. `NAVLUNGO_DEFAULT_BARCODE_TYPE` canlı Sheet'te `3`; kod güvenli normalize ediyor fakat ayarın kendisi hâlâ düzeltilmeli.

### Orta

1. Repo ana belgeleri V6.4.5 seviyesinde kalmış; aktif sistem V6.5.
2. Repo içinde eski sürüm dosyaları aktif üretim dosyalarıyla yan yana duruyor.
3. `v65GercekSheetKabulKontrolu` canlı veri üretir; yanlışlıkla çalıştırılmamalı.
4. API response JSON hücreleri fazla büyük ve kişisel veri içerikli olabilir.

### Düşük

1. HTML callback adları mevcut; ancak bazı operasyon butonlarının gerçek UI üzerinden yeniden doğrulanması gerekir.
2. Node test seti geçiyor; fakat canlı UI kabul testi yerine geçmez.

## 12. Önerilen Sıradaki İş Sırası

1. PR #6 son onaylı görev uygulanmalı: menü/kısayol güvenli düzeltme.
2. Canlı `01_AYARLAR` içinde `NAVLUNGO_DEFAULT_BARCODE_TYPE` değeri `pdf` olarak düzeltilmeli.
3. `13_VERI_SOZLUGU`, canlı 08 kolonlarının tamamını kapsayacak şekilde güncellenmeli.
4. `08_KARGO_PAKETLERI` kolon sözleşmesi için karar verilmeli:
   - Ya kod `HEADERS.cargo` sırası canlı Sheet'e göre güncellenecek.
   - Ya canlı Sheet başlık sırası kod sözleşmesine göre hizalanacak.
5. `README.md`, `CHANGELOG.md`, `PROJE_DURUM_RAPORU.md` V6.5 güncel durumuna çekilmeli.
6. Ham API response saklama modeli sadeleştirilmeli.
7. Bu düzeltmelerden sonra canlı UI üzerinden seçili sipariş açma, sadece fatura, sadece kargo, fatura+kargo, barkod yazdırma ve çift gönderim kilidi testleri ayrı raporlanmalı.

## 13. Son Karar

Canlı Apps Script ve GitHub aktif branch dosyaları eşleşiyor. Bu güçlü ve önemli bir artı.

Ancak güncel proje için "hatasız", "eksiksiz", "canlı kabul tamamlandı" denemez.

Güncel durum:

- Kod/Apps Script eşleşmesi: güçlü.
- V6.5 canlı işlem kabiliyeti: var.
- Sheet sözleşme/dokümantasyon uyumu: eksik.
- Menü/kısayol güvenliği: onaylı düzeltme bekliyor.
- Canlı kapı güvenliği: şu anda açık ve dikkat gerektiriyor.

Bu rapor analiz raporudur; üretim kodu veya Sheet verisi değiştirilmedi.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-05_guncel_proje_derin_durum_analiz_raporu.md`

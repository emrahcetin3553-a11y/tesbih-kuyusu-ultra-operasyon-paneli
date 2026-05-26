# PR #6 Tek Seferlik Kritik Kabul Raporu

Tarih: 2026-05-06  
Branch: `v6-5-production-candidate`  
Repo: `emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli`  
Uygulama commit'i: `51868a50f02d1a520c57bb7533184ba1f193cb73`

## 1. PR #6 Son Yorum Kapsamı

Son kritik kabul yorumunda üç alan birlikte istendi:

- Plain `Kaydet ve ERP güncelle` yolu 1-3 saniye hedefi, maksimum 5 saniye; ağır ERP/full rebuild/sync/fatura-kargo hazırlığı çalışmayacak.
- `02_WHATSAPP_KUYRUGU` içinde `Kuyruk_ID` seçiliyken seçili sipariş paneli boş açılmayacak; aynı siparişte ikinci Kaydet yeni kayıt oluşturmayacak.
- `SILINENLER` ve `ARSIVLENENLER` eski 18 kolon varsayımıyla değil, yeni 176 kolon geniş audit sözleşmesiyle çalışacak; geri al kolon kayması yapmayacak.

Canlı Google Sheets UI süre kanıtı bu turda alınamadı. Bu nedenle canlı UI için 1-5 saniye hedefi geçti denmedi. Yerel Apps Script harness profilinde plain Kaydet yolu `15 ms` döndü; bu yalnız yerel profil kanıtıdır.

## 2. İncelenen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

## 3. Değiştirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`
- `08_KABUL_RAPORLARI/2026-05-06_tek_seferlik_kritik_kabul_performans_panel_arsiv_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

## 4. Kod Düzeltmeleri

### 4.1 176 Kolon Lifecycle Audit Sözleşmesi

`HEADERS.archive` ve `HEADERS.deleted` eski sabit 18 kolonlu yapıdan çıkarıldı. Yeni yapı:

- İlk 13 audit kolon:
  `Audit_ID`, `İşlem_Tipi`, `İşlem_Tarihi`, `Kaynak_Sayfa`, `Kaynak_Satır_No`, `Kaynak_ID`, `Kaynak_Header_JSON`, `Satır_JSON`, `Geri_Alındı_Mı`, `Geri_Alma_Tarihi`, `Geri_Alma_Durumu`, `Operatör`, `Audit_Kontrol_Uyarısı`
- Ardından 02/03/04/05/06/07/08/10/11/12/15 kaynak sayfalarının gerçek kolonları header-name bazlı tekil birleşimle eklenir.
- Toplam header sayısı: `176`
- Son kolon: `Adres_Durumu`

Yeni yardımcılar:

- `lifecycleAuditBaseHeaders_()`
- `lifecycleAuditHeaders_()`

### 4.2 Arşiv/Sil Yazımı

`lifecycleAuditRow_()` geniş sözleşmeye göre yenilendi:

- Kaynak satır, kendi kaynak header sırasıyla `Satır_JSON` içine yazılıyor.
- `Kaynak_Header_JSON` ile orijinal kaynak header sırası saklanıyor.
- Aynı değerler audit sayfasındaki header-name kolonlara da yazılıyor.
- `Açık_Sipariş_ID`, `Kuyruk_ID`, `Fatura_Grubu_ID`, `Kargo_Paket_ID` gibi alanlar artık audit satırında kolon adıyla taşınıyor.

### 4.3 10_808 Header Uyumu

Yüklenen Sheet (22) içinde `10_808_FINANS_ONIZLEME` ilk kolonu gerçek olarak `1. sütun`. Kod sözleşmesi buna uyarlandı:

- `H.FIN_ID = "1. sütun"`

Not: `13_VERI_SOZLUGU` içinde aynı alan hâlâ `808_Kayıt_ID` adıyla bulunuyor. Referans test bu alanı alias olarak kabul ediyor; bu, sonraki Sheet veri sözlüğü temizliğinde doğrudan düzeltilmesi gereken kalan sözlük farkıdır.

## 5. Sheet (22) Derin Analiz Özeti

Kaynak dosya:

- `C:/Users/emrah/Downloads/TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`

Repo kopyası:

- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`

Özet:

- `SILINENLER`: 176 header, 14 veri satırı, ilk 13 audit kolon doğru, son kolon `Adres_Durumu`.
- `ARSIVLENENLER`: 176 header, 0 veri satırı, ilk 13 audit kolon doğru, son kolon `Adres_Durumu`.
- `02_WHATSAPP_KUYRUGU`: 16 header, 9 veri satırı.
- `03_ACIK_SIPARISLER`: 26 header, 7 veri satırı.
- `04_URUN_KALEMLERI`: 26 header, 15 veri satırı.
- `05_ODEMELER`: 22 header, 7 veri satırı.
- `06_FATURA_GRUPLARI`: 24 header, 7 veri satırı.
- `07_PARASUT_FATURA`: 26 header, 15 veri satırı.
- `08_KARGO_PAKETLERI`: 34 header, 7 veri satırı.
- `09_MUSTERI_HAFIZA`: 19 header, 8 veri satırı.
- `10_808_FINANS_ONIZLEME`: 12 header, 7 veri satırı, ilk header `1. sütun`.
- `11_EBELGE_ISTISNA`: 17 header, 7 veri satırı.
- `12_KONTROL_MERKEZI`: 14 header, 0 veri satırı.
- `13_VERI_SOZLUGU`: 6 header, 278 veri satırı.
- `14_BANKA_HAREKETLERI`: 17 header, 0 veri satırı.
- `15_MUSTERI_ADRESLERI`: 13 header, 7 veri satırı.

Operasyon verileri silinmedi veya dönüştürülmedi. XLSX repo içine olduğu gibi kopyalandı.

## 6. Test Sonuçları

### 6.1 Syntax / Duplicate / Yasak İfade

Komut:

`node 07_TEST_DOSYALARI/test_v6_5_ci_checks.js`

Sonuç:

- `ok: true`
- Core syntax: geçti
- Duplicate public function: yok
- Aktif core/HTML yasak ifade taraması: temiz
- Public function count: `110`
- Active files: `6`

### 6.2 V6.5 Operasyon Harness

Komut:

`node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`

Sonuç:

- `ok: true`
- Plain Kaydet local profile total: `15 ms`
- `plainSaveFastPath >= 1`
- `schemaFastPass >= 1`
- `hafifErpGuncelle_` plain Kaydet top steps içinde yok
- `02 Kuyruk_ID` fallback seçili panel payload testi geçti
- İkinci Kaydet yeni `Açık_Sipariş_ID` oluşturmadı
- Edit save ürün/ödeme/fatura/kargo satırlarını çoğaltmadı
- Arşiv aktif satırları kaldırdı ve `ARSIVLENENLER` audit sayfasına taşıdı
- Sil aktif satırları kaldırdı ve `SILINENLER` audit sayfasına taşıdı
- Geri al queue satırını kolon kaymasız geri döndürdü
- Audit satırlarında `Kaynak_Header_JSON`, `Satır_JSON`, kaynak sheet ve header-name kolonlar doğrulandı
- Cari güvenli aday otomatik bağlandı; cari yoksa net blokaj döndü
- Paraşüt/e-belge canlı POST yapılmadı

### 6.3 Sheet Referans Sözleşmesi

Komut:

`node 07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`

Sonuç:

- `ok: true`
- Referans workbook: `02_SHEET_SISTEM\TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`
- Open ID count: `7`
- Payment status: `Bekliyor: 7`
- Bank rows: `0`
- Sheet/code header parity: geçti
- ID link integrity: geçti
- `13_VERI_SOZLUGU` coverage: geçti, `10_808` alias notuyla
- `10_808 Fark zero`: geçti
- `07/08 required columns`: geçti
- `SILINENLER/ARSIVLENENLER 176 column lifecycle contract`: geçti

### 6.4 NPM / Audit

- `npm ci`: geçti, `0 vulnerabilities`
- `npm audit --audit-level=high`: geçti, `0 vulnerabilities`
- `npm test`: geçti
- `git diff --check`: geçti; yalnız CRLF çalışma kopyası uyarısı var

## 7. Apps Script Yükleme ve SHA Doğrulama

Ana Apps Script projesi:

- `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

Yükleme:

- `clasp push --force`: yapıldı, 7 dosya push edildi.
- `clasp pull --force`: yapıldı, 7 dosya geri çekildi.

SHA256 eşleşmeleri:

- Core: `0AE343449DBDCD7766C90458BCF64F8DCB535D766EA454A8FECB8C26FF7B7397` eşleşti.
- `ultraSiparisPaneli.html`: `2679CF594937BA852CE4648EBA420B6480E34B0585A64A341AEE1752A51E1A68` eşleşti.
- `cariSecDialog.html`: `3315B7551E3440846ABAA25929B7AB7B921E3CFD9F57D8CFE8AAAD04C778D0D3` eşleşti.
- `urunEkleDialog.html`: `CF3AC682F8C32EC29ADE27FFBFC8431AEBCDFC92F265C7BC4B79D6224695A3DA` eşleşti.
- `odemeEkleDialog.html`: `8C268C033E232EDFC2329567F3229A2B00B4DB9F5E1C2E03BB0B4502E79B51A7` eşleşti.
- `kargoBilgisiDialog.html`: `A40A6F96992D14D18BA1539DAC1FD9B50F999FE0321D911E6EB06A23678E2693` eşleşti.
- `appsscript.json`: `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` eşleşti.

## 8. Canlı POST Durumu

Bu turda gerçek Paraşüt, Navlungo veya e-belge canlı POST çalıştırılmadı. Yerel harness içinde kontrollü URL fetch simülasyonları var; canlı sistem üzerinde yeni fatura/kargo/e-belge gönderimi yapılmadı.

## 9. Kalan Riskler

- Canlı Google Sheets UI üzerinden yeni Kaydet süre kanıtı alınamadı. Bu nedenle 1-5 saniye hedefi canlı UI için geçti denmedi.
- `13_VERI_SOZLUGU` içinde `10_808_FINANS_ONIZLEME` için eski `808_Kayıt_ID` adı duruyor; gerçek Sheet header `1. sütun`. Kod ve referans test gerçek header'a uyarlandı, ancak veri sözlüğü ayrıca temizlenmeli.
- Canlı Sheet üzerinde `SILINENLER` / `ARSIVLENENLER` mevcut başlıkları bu rapordaki XLSX ile uyumlu kabul edilmiştir; Google Sheets UI'da ayrıca readback yapılmadı.

## 10. Sonuç

Yerel ve Apps Script push/pull kanıtlarıyla:

- Kod yeni 176 kolon lifecycle audit sözleşmesine uyarlandı.
- Referans Sheet (22) repo içine eklendi ve test sözleşmesi bu dosyaya taşındı.
- Arşiv/sil/geri al testleri `Satır_JSON` + header-name kolonlar ve kolon kaymasız geri dönüş için genişletildi.
- Seçili `Kuyruk_ID` üzerinden panel payload dolu geliyor.
- İkinci Kaydet yeni sipariş oluşturmuyor.
- Plain Kaydet yerel profilde `15 ms` ile hafif yolda kalıyor.

Canlı UI süre kanıtı olmadığı için bu rapor “canlı kabul tamamlandı” demez.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-06_tek_seferlik_kritik_kabul_performans_panel_arsiv_raporu.md`

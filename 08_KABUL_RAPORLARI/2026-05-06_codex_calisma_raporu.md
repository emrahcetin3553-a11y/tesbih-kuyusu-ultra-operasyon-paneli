# 2026-05-06 Codex Çalışma Raporu

## 1. Görev

PR #6 için Kaydet performans profil/timer görevi uygulandı.

## 2. İncelenen dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `appsscript.json`
- `package.json`

## 3. Değiştirilen dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_profil_ve_delta_update_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

## 4. Apps Script'e yüklenen dosyalar

Yükleme klasörü:

- `C:\Users\emrah\Desktop\clasp_v65_main_upload`

Yüklenen ve pull sonrası doğrulanan dosyalar:

- `appsscript.json`
- `cariSecDialog.html`
- `kargoBilgisiDialog.html`
- `odemeEkleDialog.html`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `urunEkleDialog.html`

## 5. Sheet tarafında değişiklik

Bu turda yeni `.xlsx` üretilmedi ve Google Sheet verisi doğrudan değiştirilmedi.

Kod tarafında `01_AYARLAR` içine `KAYDET_DELTA_UPDATE_AKTIF` ayarı eklenebilir hale getirildi. Bu ayar canlı Sheet tarafında `sistemKolonlariniHazirla` veya kaydet ön hazırlığı sırasında eksikse oluşturulur.

## 6. GitHub'a işlenen dosyalar

- Uygulama commit'i: `c7416ac388f9dd283dcec058e81e180d664bda06`
- Branch: `v6-5-production-candidate`
- GitHub Actions `Node.js CI` run ID: `25403931110`
- GitHub Actions sonucu: `success`

## 7. Çalıştırılan testler

- `npm ci`: geçti, 0 vulnerability
- `npm audit --audit-level=high`: geçti, 0 vulnerability
- `npm test`: geçti

## 8. Test sonuçları

- Core syntax: geçti
- Duplicate public function: geçti
- Yasak aktif kod terimi taraması: geçti
- Existing openId save duplicate kontrolü: geçti
- Status normalize kontrolü: geçti
- Son Sheet referans sözleşmesi: geçti
- Profil helper kontrolleri: geçti

## 9. Canlı Apps Script ile GitHub eşleşiyor mu?

Evet. `clasp push --force` ve `clasp pull --force` sonrası SHA256 eşleşti:

- Core: `BADDA0366DC4F9DB413AC81B598A74442B89423235CB901B562637B2120AC2C5`
- Panel HTML: `B423F10DFAE6A1CBA5744884443FD21FC0AE8CCF9DC570BC00A7AEDEF3E794A3`
- Manifest: `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D`

## 10. Kalan riskler

- Gerçek Google Sheets UI kaydet süresi bu turda ölçülmedi.
- Delta yazım pilotu yalnız `replaceRowsForOpen_` yüzeyindedir.
- Bazı kontrol/senkron yüzeyleri hâlâ `writeObjects_` ile tam gövde yazımı yapabilir.

## 11. Bir sonraki önerilen adım

Gerçek Ultra Sipariş Paneli üzerinden seçili mevcut sipariş açılıp `Kaydet ve ERP güncelle` çalıştırılmalı; panelde dönen profil toplam süresi ve 03/04/05/06/08 readback sonucu rapora eklenmelidir.

## 12. Codex sohbet çıktısı / çalışma özeti

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_profil_ve_delta_update_raporu.md`

## 13. PR #6 İkinci Seviye Kaydet Performans Görevi

PR #6 son yorumunda canlı saha testinin `51.8 sn` sürdüğü bildirildi. Bu nedenle ikinci seviye kaydet performans düzeltmesi yapıldı.

Değişiklikler:

- `ensureCoreSheetsReadyForSave_` her kaydetmede tüm header sözleşmesini okumayacak şekilde hafifletildi.
- Plain `Kaydet` yolu `lightSave` minimum ERP akışına alındı.
- Plain `Kaydet` içinde Paraşüt taslak ve e-belge hazırlığı çalışmayacak şekilde ayrıldı.
- Tek final sync korunup ara tekrarlar azaltıldı.
- Panel dialog genişliği/yüksekliği artırıldı ve form yoğunluğu azaltıldı.

Testler:

- `npm ci`: geçti.
- `npm audit --audit-level=high`: geçti, 0 vulnerability.
- `npm test`: geçti.

Apps Script:

- `clasp push --force`: yapıldı.
- `clasp pull --force`: yapıldı.
- Core SHA eşleşti: `24B84E133A62BEB89B0B2F56336F03ED24BB3B3C02C4F072313B69D414528CE9`.
- Panel HTML SHA eşleşti: `2679CF594937BA852CE4648EBA420B6480E34B0585A64A341AEE1752A51E1A68`.

Rapor:

- `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_ikinci_seviye_ve_panel_ui_raporu.md`

Kalan risk:

- Canlı UI tekrar süre testi bu turda yapılmadı; kullanıcı panelden tekrar Kaydet profilini çalıştırmalıdır.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_ikinci_seviye_ve_panel_ui_raporu.md`

## 14. PR #6 İkinci Seviye Görev GitHub Kanıtı

- Uygulama commit'i: `55e207a20f9b361f203f6e4fb018ff1c2069bfcc`
- Branch: `v6-5-production-candidate`
- GitHub Actions run ID: `25405860324`
- GitHub Actions job: `V6.5 Apps Script test harness`
- GitHub Actions sonucu: `success`
- Rapor dosyası: `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_ikinci_seviye_ve_panel_ui_raporu.md`

Son yerel tekrar:

- `npm ci`: geçti, 0 vulnerability
- `npm audit --audit-level=high`: geçti, 0 vulnerability
- `npm test`: geçti

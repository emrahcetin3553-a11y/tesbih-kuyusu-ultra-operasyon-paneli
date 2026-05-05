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

Commit/push bu raporla birlikte yapılacaktır.

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

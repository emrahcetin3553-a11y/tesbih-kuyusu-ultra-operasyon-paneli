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

## 15. PR #6 Üçüncü Seviye Kaydet Performans ve Cari Otomasyon Görevi

PR #6 son kullanıcı geri bildiriminde canlı panel Kaydet süresinin `37.7 sn` olduğu bildirildi. Bu saha sonucu başarısız kabul edildi; bu turda canlı UI geçişi iddia edilmeden plain Kaydet yolu yeniden daraltıldı.

Değişiklikler:

- Plain `Kaydet ve ERP güncelle` yolundan `hafifErpGuncelle_`, final `senkronizeDurumForOpen_`, tam kontrol merkezi yenileme ve müşteri hafızası ağır güncelleme çıkarıldı.
- `patchOpenSummaryForSave_` ile 03 tarafında ilgili `Açık_Sipariş_ID` için hedefli özet yazımı eklendi.
- `upsertInvoiceGroupsFromPanelSave_` ile ödeme yapan kişi bazlı fatura grubu hafif upsert akışı eklendi.
- `linkProductRowsToPaymentsForSave_` ile ürün satırları aynı sipariş içindeki ödeme yapan kişinin `Ödeme_ID` değerine bağlandı.
- `autoCariBaglaForOpen_` sadece ilgili sipariş için çalışan, güvenli tek güçlü adayda otomatik bağlayan, aksi durumda panel onayı isteyen yapıya alındı.
- `PARASUT_CARI_KAYDETTE_OTO_OLUSTURMA = Hayır` varsayılan ayarı eklendi.
- Test harness içinde güvenli cari bağlama ve cari bulunamama blokajı testleri eklendi.

Çalıştırılan testler:

- `npm ci`: geçti, 0 vulnerability.
- `npm audit --audit-level=high`: geçti, 0 vulnerability.
- Aktif core/HTML yasak ifade taraması: geçti.
- `git diff --check`: geçti; yalnız CRLF çalışma kopyası uyarısı var.
- `npm test`: geçti.

Apps Script:

- `clasp push --force`: yapıldı.
- `clasp pull --force`: yapıldı.
- Core SHA eşleşti: `F84D8508D5C4D79804FEE3CB102D78E88FAF543CCA8BAC86165251B87F5FF893`.
- Panel HTML SHA eşleşti: `2679CF594937BA852CE4648EBA420B6480E34B0585A64A341AEE1752A51E1A68`.

Kalan risk:

- Gerçek Google Sheets UI üzerinde yeni Kaydet süre testi bu turda yapılmadı. `37.7 sn` saha sonucu yeni canlı panel denemesiyle yeniden ölçülmeden 1-5 saniye hedefi geçti denmeyecek.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_ucuncu_seviye_cari_otomasyon_raporu.md`

GitHub kanıtı:

- Uygulama commit'i: `3ab32f697ba151af3b9971517e99960b3020a414`
- GitHub Actions run ID: `25407492086`
- GitHub Actions job: `V6.5 Apps Script test harness`
- GitHub Actions sonucu: `success`

## 16. PR #6 Tek Seferlik Kritik Kabul: Performans, Panel ve 176 Kolon Audit

PR #6 son kritik kabul yorumunda Kaydet performansı, seçili sipariş düzenleme/duplicate kayıt ve `SILINENLER` / `ARSIVLENENLER` yeni 176 kolon sözleşmesi birlikte istendi.

İncelenen dosyalar:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`

Değiştirilen dosyalar:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`
- `08_KABUL_RAPORLARI/2026-05-06_tek_seferlik_kritik_kabul_performans_panel_arsiv_raporu.md`

Yapılan düzeltmeler:

- `HEADERS.archive` ve `HEADERS.deleted` eski 18 kolon varsayımından çıkarıldı.
- `lifecycleAuditBaseHeaders_()` ve `lifecycleAuditHeaders_()` ile 176 kolon geniş audit sözleşmesi üretildi.
- `lifecycleAuditRow_()` kaynak satırı hem `Satır_JSON` hem de header-name kolonlarla yazacak şekilde düzeltildi.
- `H.FIN_ID` yüklenen Sheet (22) gerçek header'ı olan `1. sütun` değerine uyarlandı.
- Test harness arşiv/sil/geri al akışında `Kaynak_Header_JSON`, `Satır_JSON`, kaynak kolon dolumu ve kolon kaymasız queue restore kontrolü eklendi.
- Sheet referans testi varsayılan dosyası `TESBIH_KUYUSU_MASTER_SHEET (22).xlsx` olarak güncellendi.

Çalıştırılan testler:

- `node 07_TEST_DOSYALARI/test_v6_5_ci_checks.js`: geçti.
- `node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`: geçti.
- `node 07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`: geçti.
- `npm ci`: geçti, 0 vulnerability.
- `npm audit --audit-level=high`: geçti, 0 vulnerability.
- `npm test`: geçti.
- `git diff --check`: geçti; yalnız CRLF çalışma kopyası uyarısı var.

Apps Script:

- `clasp push --force`: yapıldı.
- `clasp pull --force`: yapıldı.
- Core SHA eşleşti: `0AE343449DBDCD7766C90458BCF64F8DCB535D766EA454A8FECB8C26FF7B7397`.
- Panel HTML SHA eşleşti: `2679CF594937BA852CE4648EBA420B6480E34B0585A64A341AEE1752A51E1A68`.

Sheet tarafı:

- Kullanıcının yüklediği `TESBIH_KUYUSU_MASTER_SHEET (22).xlsx` repo içine olduğu gibi eklendi.
- `SILINENLER`: 176 header, 14 veri satırı.
- `ARSIVLENENLER`: 176 header, 0 veri satırı.
- Operasyon verileri silinmedi.

Kalan risk:

- Canlı Google Sheets UI üzerinden yeni Kaydet süre kanıtı alınmadı. Yerel harness plain Kaydet profili `15 ms`; canlı UI için 1-5 saniye geçti denmedi.
- `13_VERI_SOZLUGU` içinde `10_808_FINANS_ONIZLEME` için eski `808_Kayıt_ID` adı duruyor; gerçek header `1. sütun`. Kod gerçek header'a uyarlandı, veri sözlüğü sonraki temizlikte düzeltilmeli.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-06_tek_seferlik_kritik_kabul_performans_panel_arsiv_raporu.md`

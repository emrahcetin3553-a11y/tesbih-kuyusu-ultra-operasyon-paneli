# 2026-05-06 Kaydet 1-5 sn, Seçili Panel ve Geri Al Düzeltme Raporu

## 1. Görev

Kullanıcı canlı `TESBIH_KUYUSU_MASTER_SHEET` üzerinde şu üç kritik problemi bildirdi:

- `Kaydet` süresi 22.4 sn ve ikinci testte 38.2 sn; hedef en fazla 1-5 sn.
- Satır seçili olmasına rağmen `Seçili siparişi düzenle` paneli boş açılıyor.
- Silinen veya arşivlenen sipariş geri alındığında satırlar bozuluyor.

Bu çalışma rapor güzelleştirme değildir. Değişiklikler canlı Apps Script koduna yüklendi, GitHub ile SHA eşleşmesi doğrulandı ve yerel test harness tekrar çalıştırıldı.

## 2. İncelenen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`
- `08_KABUL_RAPORLARI/2026-05-06_tek_seferlik_kritik_kabul_performans_panel_arsiv_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

## 3. Değiştirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-06_kaydet_1_5sn_secili_panel_geri_al_duzeltme_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

## 4. Neden Düzenlendi

Canlı panelde görünen eski profil satırları hedefe aykırıydı:

- `autoCariBaglaForOpen_:save`
- `ensureCoreSheetsReadyForSave_`
- `patchOpenSummaryForSave_`
- `upsertInvoiceGroupsFromPanelSave_`
- `linkProductRowsToPaymentsForSave_`

Bu adımlar tek `Kaydet` içinde gereksiz ağ/cari çözüm veya geniş tarama etkisi oluşturuyordu. Plain `Kaydet` işlemi fatura/kargo/cari canlı operasyonu değildir; sadece panel verisini ilgili sipariş ID zincirine güvenli yazmalıdır.

Seçili panel boş açılma tarafında kök risk şuydu:

- `02_WHATSAPP_KUYRUGU` satırında `Açık_Sipariş_ID` boş ama `Kuyruk_ID` dolu olduğunda panel sadece openId arıyordu.
- Bu durumda kullanıcı satırı seçtiği halde panel düzenleme payload'ı oluşturulamıyordu.

Sil/arşiv geri alma tarafında kök risk şuydu:

- `SILINENLER` ve `ARSIVLENENLER` 176 kolon sözleşmesi bozulursa geri alma satırları yanlış kolonlara yazılabilirdi.
- Bu durumda veri kayması sessizce oluşmamalı; işlem durmalı ve kolon sözleşmesi hatası vermelidir.

## 5. Yapılan Düzeltmeler

### 5.1 Kaydet Performansı

- `Kaydet` içindeki ağır `autoCariBaglaForOpen_:save` çağrısı plain save yolundan çıkarıldı.
- Yerine `panelCariDurumForSave_()` eklendi.
- Bu yeni yol yalnız yerel `PARASUT_CONTACT_ID_MAP_JSON` üzerinden 90+ tek güçlü cari eşleşmesi varsa bağlar.
- Ağ üzerinden Paraşüt contact search plain `Kaydet` içinde çalıştırılmaz.
- `linkProductRowsToPaymentsForSave_()` plain save içinde atlandı; ürün-ödeme bağlantısı panel satırlarından gelen ödeme yapan ve ödeme ID zinciriyle kuruldu.
- `ensureCoreSheetsReadyForSave_()` için `TK6_CORE_SCHEMA_READY = V6.5` document property kontrolü eklendi.
- `sistemKolonlariniHazirla_()` sonunda schema ready işareti yazıldı.
- Panel kaynaklı ürün, ödeme ve kargo upsert işlemlerinde gereksiz satır normalizasyonu atlandı.
- Yeni sipariş ve kuyruk düzenleme için `assignOpenIdToQueueRowFast_()` eklendi; full `acikSiparisleriGrupla_()` plain `Kaydet` yolundan çıkarıldı.

### 5.2 Seçili Siparişi Düzenle

- `selectedEditRefs_()` eklendi.
- `openUltraPanelForEdit_()` artık hem `Açık_Sipariş_ID` hem de `Kuyruk_ID` taşıyabiliyor.
- `getDialogData_()` artık `ULTRA_PANEL_EDIT_QUEUE_IDS` bilgisini de okuyor.
- `ultraPanelPayloadForQueueId_()` eklendi.
- `02_WHATSAPP_KUYRUGU` satırında sadece `Kuyruk_ID` varsa panel telefon, sipariş sahibi, ham mesaj ve hızlı giriş alanlarıyla dolu açılır.
- Panel HTML tarafında `queueId` kart veri setinde korunuyor ve `Kaydet` payload'ına geri gönderiliyor.
- `queueId` ile açılmış kart kaydedilirse yeni kuyruk satırı açılmaz; mevcut 02 satırı patch edilir ve aynı satıra openId atanır.

### 5.3 Sil / Arşiv / Geri Al

- `assertSheetHeaderContract_()` eklendi.
- `assertLifecycleTargetContract_()` eklendi.
- `moveLifecycleRows_()` artık hedef audit sayfası ve kaynak sayfa header sözleşmesini kontrol ediyor.
- `restoreLifecycleRows_()` artık geri almadan önce hem audit hem kaynak header sözleşmesini doğruluyor.
- Kolon sözleşmesi bozuksa geri alma satırı bozmak yerine açık hata verir.

## 6. Apps Script'e Yüklenen Dosyalar

Canlı Apps Script upload klasörü:

- `C:\Users\emrah\Desktop\clasp_v65_main_upload`

Yüklenen dosyalar:

- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`

Çalıştırılan komutlar:

- `clasp push --force`
- `clasp run sistemKolonlariniHazirla`
- `clasp pull --force`

Sonuç:

- `clasp push --force`: `Script is already up to date.`
- `sistemKolonlariniHazirla`: `true`
- `clasp pull --force`: 7 dosya geri çekildi.

## 7. Apps Script SHA Doğrulama

Core:

- Repo SHA256: `4CA23E86BEA748D54BB307BBAEB466FA884B0D4ED6C9C451A9CD91A1A23E2CCD`
- Remote SHA256: `4CA23E86BEA748D54BB307BBAEB466FA884B0D4ED6C9C451A9CD91A1A23E2CCD`
- Eşleşme: `Evet`

Panel HTML:

- Repo SHA256: `520869480B985F4E8AF8AFF88F49E39CA535E8F828265CB7EB2EA0BADEF60829`
- Remote SHA256: `520869480B985F4E8AF8AFF88F49E39CA535E8F828265CB7EB2EA0BADEF60829`
- Eşleşme: `Evet`

## 8. Çalıştırılan Testler

### 8.1 `npm test`

Sonuç: geçti.

Çalışan alt testler:

- `node 07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `node 07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`

Önemli mock profil sonucu:

- `saveProfileTotalMs`: `7`
- En pahalı görünen adımlar:
  - `upsertInvoiceGroupsFromPanelSave_`: `2 ms`
  - `normalizeUltraForm_`: `1 ms`
  - `patchOpenSummaryForSave_`: `1 ms`
  - `ensureCoreSheetsReadyForSave_`: `0 ms`
- Sayaçlar:
  - `schemaPropertyHit`: `1`
  - `plainSaveFastPath`: `1`
  - `linkProductRowsSkippedForPlainSave`: `1`

### 8.2 Sheet Referans Testi

Sonuç: geçti.

- Workbook: `02_SHEET_SISTEM\TESBIH_KUYUSU_MASTER_SHEET (22).xlsx`
- `SILINENLER` / `ARSIVLENENLER` 176 kolon lifecycle sözleşmesi geçti.
- ID link integrity geçti.
- Header parity geçti.

### 8.3 CI Kontrol Testi

Sonuç: geçti.

- Core syntax: geçti.
- Duplicate public function: yok.
- Forbidden active code terms: temiz.

## 9. Gerçek Canlı UI Durumu

Canlı Apps Script kodu güncellendi ve SHA eşleşmesi doğrulandı.

Ancak kullanıcı panelinden yeni gerçek süre ölçümü bu turda henüz alınmadı. Bu nedenle:

- `Canlı UI Kaydet 1-5 sn geçti` yazılmadı.
- Şu an doğru ifade: `Canlı Apps Script düzeltmesi yüklendi; canlı UI retest bekleniyor.`

Kullanıcının önceki 22.4 sn ve 38.2 sn ekran görüntülerinde görünen profil eski ağır yolu içeriyordu:

- `autoCariBaglaForOpen_:save`

Yeni kodda plain `Kaydet` profilinde bu ad görünmemelidir. Retestte hâlâ görünürse tarayıcı veya Apps Script tarafında eski dosya çalışıyor demektir.

## 10. Kullanıcı Retest Sırası

Ek fonksiyon çalıştırmaya gerek yok. `sistemKolonlariniHazirla` bu turda zaten çalıştırıldı.

Canlı retest için:

1. Google Sheet sekmesini yenileyin.
2. `02_WHATSAPP_KUYRUGU` üzerinde veri satırında herhangi bir hücreyi seçin. Header satırını seçmeyin.
3. `TESBIH KUYUSU PANEL > Seçili siparişi düzenle` çalıştırın.
4. Eğer satırda yalnız `Kuyruk_ID` varsa bile panel telefon ve sipariş sahibi dolu açılmalıdır.
5. `Kaydet` basınca aynı `Kuyruk_ID` satırı güncellenmeli, yeni kuyruk satırı açılmamalıdır.
6. Kontrol özetinde yeni profil satırı `panelCariDurumForSave_` göstermeli, `autoCariBaglaForOpen_:save` göstermemelidir.
7. Süre 1-5 sn hedefinde ölçülmelidir.

## 11. Kalan Riskler

- Gerçek UI üzerinden 1-5 sn kanıtı kullanıcı retestiyle alınacak.
- Google Apps Script modal cache veya tarayıcı cache eski paneli tutarsa Sheet sekmesi yenilenmelidir.
- `SILINENLER` / `ARSIVLENENLER` kolon sözleşmesi canlı Sheet üzerinde kullanıcı tarafından elle bozulursa yeni kod satır kaydırmak yerine hatayla durur.

## 12. GitHub

Bu rapor ve kod değişiklikleri GitHub'a işlenecektir.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-06_kaydet_1_5sn_secili_panel_geri_al_duzeltme_raporu.md`

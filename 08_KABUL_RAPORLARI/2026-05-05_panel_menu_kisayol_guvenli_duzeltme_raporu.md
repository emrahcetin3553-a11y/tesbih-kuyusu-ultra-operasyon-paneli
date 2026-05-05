# 2026-05-05 Panel Menü Kısayol Güvenli Düzeltme Raporu

## 1. Kapsam

PR #6 son kullanıcı yorumundaki panel menü/kısayol güvenli düzeltme görevi uygulandı.

Amaç:
- Parametre isteyen Paraşüt/Navlungo teknik menülerini seçili satır bağlamına bağlamak.
- Sipariş bağlamı yokken `Kaydet ve ERP güncelle` fonksiyonunun tüm sistemi yenilemesini engellemek.
- Fatura/kargo/sil/geri al/arşiv/müşteri hafızasından sil gibi riskli menü işlemlerinde seçili kayıt özeti ve canlı kapı bilgisiyle operatör onayı istemek.
- Mevcut panel, Paraşüt payload, Navlungo ve banka/e-belge mantığını kırmadan dar kapsamlı düzeltme yapmak.

## 2. İncelenen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `appsscript.json`
- `C:\Users\emrah\Desktop\clasp_v65_main_upload\.clasp.json`
- `C:\Users\emrah\Desktop\clasp_v65_main_upload\tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 3. Değiştirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-05_panel_menu_kisayol_guvenli_duzeltme_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 4. Yapılan Düzeltmeler

### 4.1 Seçili Satır Bağlamı

Eklenen ana yardımcılar:
- `selectedContext_`
- `selectedContexts_`
- `selectedInvoiceGroupId_`
- `selectedCargoPackageIds_`
- `contextSummary_`
- `liveGateSummary_`
- `confirmUi_`
- `confirmSelectedOperation_`
- `confirmSelectedLifecycle_`

Neden düzenlendi:
- Menü fonksiyonları doğrudan parametresiz çalıştırılınca hangi sipariş, fatura grubu veya kargo paketiyle işlem yapılacağı net değildi.

Ne düzeltildi:
- Aktif sheet, aktif satır, `Açık_Sipariş_ID`, `Fatura_Grubu_ID`, `Kargo_Paket_ID`, telefon ve kaynak satır bilgisi tek bağlam çözümleyicide toplandı.
- 02/03/04/05/06/07/08 sayfalarından ilişkili `Açık_Sipariş_ID` bulunmaya devam ediyor.
- 08 kargo işlemlerinde `Kargo_Paket_ID` birincil anahtar olarak korunuyor.

### 4.2 Teknik Menü Wrapper Bağlantıları

Menü bağlantıları değiştirildi:
- `Paraşüt cari adaylarını getir` -> `seciliParasutCariAdaylariniGetir`
- `Paraşüt taslak payload test et` -> `seciliParasutTaslakPayloadTestEt`
- `Paraşüt taslak gönder` -> `seciliParasutFaturaTaslakGonderOnayli`
- `Navlungo toplu kargo oluştur` -> `seciliNavlungoTopluKargoOlustur`

Neden düzenlendi:
- Eski bağlantılar parametre isteyen fonksiyonlara doğrudan gidiyordu.

Ne düzeltildi:
- Paraşüt işlemleri seçili 06/07 satırından veya seçili siparişten güvenli `Fatura_Grubu_ID` çözüyor.
- Navlungo toplu kargo işlemi yalnız 08 üzerinde seçili gerçek `Kargo_Paket_ID` değerleriyle çalışıyor.

### 4.3 Kaydet ve ERP Güncelle Güvenliği

Değiştirilen fonksiyon:
- `kaydetVeErpGuncelle_`

Neden düzenlendi:
- Seçili satırdan `Açık_Sipariş_ID` okunamazsa eski davranış `sistemiYenile_()` yoluna düşüyordu.

Ne düzeltildi:
- Sipariş bağlamı yoksa işlem duruyor ve operatöre net uyarı dönüyor.
- Tüm sistemi yenileme kaçışı kaldırıldı.
- Sipariş bağlamı varsa yalnız ilgili `Açık_Sipariş_ID` için `hafifErpGuncelle_()` çalışıyor.

### 4.4 Riskli Menü Onayları

Onay eklenen alanlar:
- `Sadece fatura oluştur`
- `Sadece kargo hazırla`
- `Fatura ve kargo oluştur`
- `Bekleyen kargoyu çıkar`
- `Kargo beklet`
- `Sil / iptal`
- `Geri al`
- `Arşivle`
- `Müşteri hafızasından sil`
- Seçili Paraşüt taslak gönder
- Seçili Navlungo toplu kargo oluştur

Neden düzenlendi:
- Menüden yapılan riskli işlemlerde seçili kayıt ve canlı kapı durumu operatöre gösterilmiyordu.

Ne düzeltildi:
- İşlem öncesi seçili kayıt özeti ve canlı kapılar gösteriliyor.
- Operatör `YES` onayı vermeden işlem yürümüyor.
- Apps Script düzenleyicisinden UI onayı olmayan doğrudan riskli çağrılar fail-closed davranıyor.

## 5. Apps Script Yükleme

Canlı Apps Script proje ID:
- `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

Yüklenen dosyalar:
- `appsscript.json`
- `cariSecDialog.html`
- `kargoBilgisiDialog.html`
- `odemeEkleDialog.html`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `urunEkleDialog.html`

Komut:
- `clasp push --force`

Sonuç:
- `Pushed 7 files at 15:33:52.`

Remote readback:
- `clasp pull --force`
- `Pulled 7 files.`

Core SHA256:
- Lokal GitHub core: `775B41C489B8CF66EA305275FF73FDCCAB751D1D0CCCA11EF8B8F1D2456753A2`
- Canlı Apps Script pull core: `775B41C489B8CF66EA305275FF73FDCCAB751D1D0CCCA11EF8B8F1D2456753A2`
- Eşleşme: Evet

## 6. Sheet Tarafı

- Bu turda Sheet verisi değiştirilmedi.
- Bu turda Sheet kolon ekleme veya veri yazma yapılmadı.
- Testler local mock harness üzerinde çalıştırıldı.

## 7. Çalıştırılan Testler

### 7.1 Test Dosyası Syntax

Komut:
- `node --check 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`

Sonuç:
- Geçti, çıktı hatasız.

### 7.2 Core Syntax

Komut:
- `node -e/new vm.Script(...)`

Sonuç:
- `SYNTAX_OK`

### 7.3 Duplicate Function

Komut:
- Core içinde `function name(` taraması.

Sonuç:
- `DUPLICATE_FUNCTION_OK 477`

### 7.4 Yasak Kelime Taraması

Komut:
- Production core üzerinde `placeholder|TODO|dummy|deprecated|sample|legacy|mock|geçici|örnek`

Sonuç:
- Temiz, eşleşme yok.

### 7.5 V6.5 Node Mock Test

Komut:
- `node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`

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

Yeni eklenen test kapsamı:
- Menü fonksiyonlarının seçili wrapper fonksiyonlara bağlı olması.
- Seçili 06 satırından Paraşüt cari aday wrapper çalışması.
- Seçili 06 satırından Paraşüt payload wrapper çalışması.
- `Kaydet ve ERP güncelle` seçili siparişle hafif güncelleme yapması.
- Sipariş bağlamı olmayan sayfada `Kaydet ve ERP güncelle` tam yenilemeye düşmemesi.
- Seçili 08 satırından Navlungo toplu wrapper'ın yalnız gerçek `Kargo_Paket_ID` değerini kullanması.

## 8. Canlı POST Durumu

Bu turda manuel canlı Paraşüt, e-belge veya Navlungo gönderim testi çalıştırılmadı.

Node mock testinde sayılan POST değerleri local mock harness davranışıdır:
- `salesPostCalls: 1`
- `navlungoPostCalls: 6`

Bu değerler gerçek dış API çağrısı değildir. Canlı Apps Script üzerinde ayrıca gerçek gönderim testi yapılmadı.

## 9. Kalan Riskler

- Gerçek Google Sheets UI üzerinden menü onay pencereleri manuel olarak tıklanıp doğrulanmadı.
- `clasp run` ile riskli menü fonksiyonları çalıştırılmadı; bu bilinçli olarak yapılmadı çünkü yeni güvenlik mantığı UI onayı gerektiriyor.
- Paraşüt/Navlungo canlı kapıları açıkken menüden gerçek gönderim yapılmadı.
- PR #6 son yorumundaki kod düzeltmesi uygulandı; nihai canlı kabul için gerçek UI menü testi kullanıcı tarafında veya ekran paylaşımıyla doğrulanmalı.

## 10. GitHub İşleme Durumu

Bu rapor hazırlandıktan sonra aşağıdaki dosyalar commit/push edilecek:
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-05_panel_menu_kisayol_guvenli_duzeltme_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 11. Codex Sohbet Çıktısı / Çalışma Özeti

PR #6 son yorumundaki panel menü/kısayol güvenli düzeltme uygulandı. Parametre isteyen teknik menüler seçili satır wrapper fonksiyonlarına bağlandı, sipariş bağlamı olmayan `Kaydet ve ERP güncelle` artık tüm sistemi yenilemiyor, riskli menü işlemlerinde seçili kayıt ve canlı kapı özetiyle operatör onayı zorunlu hale getirildi. Core Apps Script canlı projeye push edildi ve pull sonrası SHA256 eşleşmesi doğrulandı.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-05_panel_menu_kisayol_guvenli_duzeltme_raporu.md`

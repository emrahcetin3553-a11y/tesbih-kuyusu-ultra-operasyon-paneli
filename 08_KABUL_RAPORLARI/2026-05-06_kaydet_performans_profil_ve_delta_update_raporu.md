# 2026-05-06 Kaydet Performans Profil ve Delta Update Raporu

## 1. Kapsam

PR #6 son yorumundaki "Kaydet performans profil/timer + delta update başlangıcı" görevi uygulandı.

Bu çalışma canlı fatura, canlı e-belge veya canlı Navlungo gönderi testi değildir. Gerçek API POST çalıştırılmadı.

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

## 4. Yapılan teknik düzeltmeler

### 4.1 Profil/timer altyapısı

Core içine davranışı değiştirmeyen profil fonksiyonları eklendi:

- `performanceProfileStart_`
- `performanceProfileEnd_`
- `performanceProfileFail_`
- `performanceMeasure_`
- `performanceCounter_`
- `performanceProfileSummary_`
- `performanceProfileText_`
- `finishSaveResult_`

Ölçülen ana yüzeyler:

- `kaydetUltraSiparisHizli_`
- `topluUltraSiparisKaydet_`
- `hafifErpGuncelle_`
- `objects_`
- `writeObjects_`
- `replaceRowsForOpen_`
- `settingsMap_`
- `productIdMap_`
- `senkronizeDurumForOpen_`
- `kontrolMerkeziniGuncelleForOpen_`

Profil çıktısı müşteri adı, telefon, adres veya ham mesaj taşımaz. Çıktıda sadece fonksiyon/adım adı, süre, sayaç ve sistem notu vardır.

### 4.2 Request cache

Aynı kaydet çağrısı içinde tekrarlı okuma azaltıldı:

- `settingsMap_` request cache kullanır.
- `productIdMap_` request cache kullanır.
- `objects_` sheet bazlı request cache kullanır.
- `appendObject_`, `upsertObjectByKey_`, `patchObjectRow_`, `patchRowsByKey_`, `setCell_`, `writeObjects_` ve ayar normalizasyonu ilgili cache'i temizler veya yeniler.

### 4.3 Delta update başlangıcı

`replaceRowsForOpen_` için `KAYDET_DELTA_UPDATE_AKTIF` ayarı eklendi.

- Varsayılan: `Evet`
- `Evet`: aynı `Açık_Sipariş_ID` satırları hedeflenir; tüm sheet gövdesi körlemesine yeniden yazılmaz.
- `Hayır`: tam gövde yazım yolu kullanılır.

Delta fallback durumları:

- `Açık_Sipariş_ID` boşsa tam gövde yazım yoluna döner.
- Hedef sheet içinde `Açık_Sipariş_ID` başlığı yoksa tam gövde yazım yoluna döner.
- Fallback durumları profile not/sayaç olarak yazılır.

### 4.4 Tek final senkron

Panel kaydet akışında tekrar eden `senkronizeDurumForOpen_` çağrıları azaltıldı.

- `hafifErpGuncelle_` tek başına çalıştırılırsa final senkron ve kontrol üretmeye devam eder.
- `kaydetUltraSiparisHizli_` içinden çağrıldığında `skipFinalSync` ile ara senkron atlanır.
- Panel kaydı sonunda tek final senkron ve tek final kontrol çalışır.

### 4.5 Panel görünürlüğü

`ultraSiparisPaneli.html` içinde `summarize(res)` profil özetini kullanıcıya ek satır olarak gösterecek şekilde güncellendi.

## 5. Profil test çıktısı

`npm test` içindeki V6.5 ultra operasyon testinden alınan güvenli profil özeti:

```json
{
  "saveProfileTopSteps": [
    {
      "name": "hafifErpGuncelle_",
      "count": 1,
      "ms": 3
    },
    {
      "name": "normalizeUltraForm_",
      "count": 1,
      "ms": 2
    },
    {
      "name": "urunKalemleriniKontrolEtForOpen_",
      "count": 1,
      "ms": 1
    },
    {
      "name": "rebuildOpenOrderForOpen_:pre",
      "count": 1,
      "ms": 1
    },
    {
      "name": "parasutTaslaklariniHazirlaForOpen_",
      "count": 2,
      "ms": 1
    }
  ],
  "saveProfileCounters": {
    "settingsRead": 1,
    "settingsCacheHit": 17,
    "objectsRead": 14,
    "writeObjectsCall": 8,
    "writeObjectsRows": 12,
    "productMapRead": 1,
    "productMapCacheHit": 4,
    "objectsCacheHit": 45,
    "deltaReplaceCall": 12,
    "deltaRowsUpdated": 14,
    "deltaRowsInserted": 13,
    "deltaRowsDeleted": 12
  }
}
```

Not: Bu çıktı Node test harness sonucudur. Gerçek Google Sheets UI süresi bu turda ölçülmedi.

## 6. Çalıştırılan testler

| Test | Sonuç |
|---|---|
| `npm ci` | Geçti, 0 vulnerability |
| `npm audit --audit-level=high` | Geçti, 0 vulnerability |
| `npm test` | Geçti |
| Core syntax / duplicate public function / yasak aktif kod terimi | Geçti |
| Existing openId save duplicate kontrolü | Geçti |
| Status normalize kontrolü | Geçti |
| Son Sheet referans sözleşmesi | Geçti |
| Profil helper testleri | Geçti |

GitHub Actions:

- Workflow: `Node.js CI`
- Run ID: `25403931110`
- Job: `V6.5 Apps Script test harness`
- Sonuç: `success`

`npm test` özeti:

- `functionCount`: 110
- `activeFiles`: 6
- `openRows`: 6
- `invoiceGroups`: 7
- `addressRows`: 8
- `salesPostCalls`: 1
- `contactPostCalls`: 0
- `navlungoPostCalls`: 6

Not: `salesPostCalls` ve `navlungoPostCalls` değerleri Node test harness sayaçlarıdır; gerçek Paraşüt/Navlungo canlı API çağrısı yapılmadı.

## 7. Apps Script push/pull SHA doğrulaması

Canlı Apps Script proje ID:

- `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

Yükleme klasörü:

- `C:\Users\emrah\Desktop\clasp_v65_main_upload`

Çalıştırılan komutlar:

- `clasp push --force`
- `clasp pull --force`
- `clasp status`

Push sonucu:

- `Pushed 7 files at 00:40:21.`

Pull sonucu:

- `Pulled 7 files.`

SHA256 karşılaştırması:

| Dosya | GitHub/lokal SHA256 | Apps Script pull SHA256 | Eşleşme |
|---|---:|---:|---|
| `tesbih_kuyusu_v6_5_ultra_operasyon_core.gs` / live `.js` | `BADDA0366DC4F9DB413AC81B598A74442B89423235CB901B562637B2120AC2C5` | `BADDA0366DC4F9DB413AC81B598A74442B89423235CB901B562637B2120AC2C5` | Evet |
| `ultraSiparisPaneli.html` | `B423F10DFAE6A1CBA5744884443FD21FC0AE8CCF9DC570BC00A7AEDEF3E794A3` | `B423F10DFAE6A1CBA5744884443FD21FC0AE8CCF9DC570BC00A7AEDEF3E794A3` | Evet |
| `appsscript.json` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | Evet |

## 8. Canlı POST güvenliği

Bu turda gerçek Paraşüt, e-belge veya Navlungo canlı POST çalıştırılmadı.

Kod tarafındaki canlı kapı mantığı değiştirilmedi.

## 9. Kalan riskler

- Gerçek Google Sheets UI üzerinden 1-5 saniye hedef süresi bu turda ölçülmedi.
- Delta yazım başlangıcı `replaceRowsForOpen_` yüzeyindedir; `writeObjects_` kullanan bazı kontrol/senkron yüzeyleri hâlâ tam gövde yazımı yapabilir.
- Profil değerleri Node test ortamında milisaniye olarak düşüktür; gerçek Apps Script süreleri ayrıca panelden ölçülmelidir.

## 10. Sonuç

Kaydet akışı artık güvenli profil/timer çıktısı döndürüyor, request-cache kullanıyor, `replaceRowsForOpen_` için openId kapsamlı delta yazım pilotu başlatıldı ve panel kaydet yolundaki tekrar senkron azaltıldı.

Uygulama commit'i: `c7416ac388f9dd283dcec058e81e180d664bda06`

Canlı UI performans kabulü için sıradaki adım: gerçek panelden aynı siparişi düzenleyip `Kaydet ve ERP güncelle` süre/profil çıktısını 12/03/04/05/06/08 readback ile doğrulamak.

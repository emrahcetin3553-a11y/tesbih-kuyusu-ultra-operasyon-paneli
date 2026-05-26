# 2026-05-06 Kaydet Performans İkinci Seviye ve Panel UI Raporu

## 1. PR #6 Son Yorum Kapsamı

PR #6 son yorumunda canlı saha testinin başarısız olduğu bildirildi.

Saha profil verisi:

- Toplam kaydet süresi: `49272 ms` / kullanıcı ekranında yaklaşık `51.8 sn`
- `hafifErpGuncelle_`: `13700 ms`
- `ensureCoreSheetsReadyForSave_`: `7915 ms`
- `senkronizeDurumForOpen_`: `6008 ms`
- `senkronizeDurumForOpen_:final`: `6008 ms`
- `objects_:06_FATURA_GRUPLARI`: `3317 ms / 15 çağrı`

Bu rapor, aynı görev için yapılan ikinci seviye kod düzeltmesini ve test kanıtlarını içerir.

## 2. Değiştirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_ikinci_seviye_ve_panel_ui_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

## 3. Yapılan Düzeltmeler

### 3.1 `ensureCoreSheetsReadyForSave_` hafifletildi

Önceki davranış:

- Her kaydetmede tüm gerçek sheet sözleşmesi geziliyor.
- Her sheet için header okuma yapılabiliyordu.
- Saha profilinde bu adım `7915 ms` olarak göründü.

Yeni davranış:

- Kaydet sırasında yalnız kritik sheet varlığı ve başlık satırı varlığı kontrol edilir.
- Tam kolon hazırlığı yalnız eksik sheet/başlık satırı varsa çalışır.
- Request içinde tekrar çağrılırsa `schemaCacheHit` ile atlanır.
- Profil sayaçları `schemaFastPass` / `schemaRepairCall` / `schemaCacheHit` olarak döner.

### 3.2 Plain Kaydet minimum ERP yoluna indirildi

Önceki davranış:

- Plain `Kaydet` içinde `hafifErpGuncelle_` tam zincire yakın çalışıyordu.
- Sonrasında ayrıca Paraşüt taslak, e-belge hazırlığı, open rebuild ve final sync tekrarları vardı.

Yeni davranış:

- `kaydetUltraSiparisHizli_` artık `hafifErpGuncelle_(openId, { skipFinalSync: true, lightSave: true })` çağırır.
- Plain Kaydet minimum yol:
  - ödeme kontrol
  - ürün kontrol
  - fatura grubu hesaplama
  - kargo paketi hesaplama
  - tek open summary rebuild
  - panel fatura/cari hint patch
  - müşteri hafızası güncelleme
  - tek final sync
  - tek final kontrol
- Plain Kaydet içinde Paraşüt taslak hazırlığı ve e-belge hazırlığı çalışmaz.
- Paraşüt/e-belge/fatura/kargo akışları operasyon butonlarında kalır.

### 3.3 Tek final sync korunup tekrarlar azaltıldı

- `hafifErpGuncelle_` standalone çağrıda final sync ve kontrol üretmeye devam eder.
- Panel Kaydet çağrısında ara sync atlanır.
- Final sync ve final kontrol yalnız bir kez çalışır.

### 3.4 06 tekrar okuma azaltıldı

- Request cache önceki turdan korunmuştur.
- İkinci seviye düzeltmeyle plain Kaydet artık Paraşüt taslak/e-belge hazırlığına girmediği için `06_FATURA_GRUPLARI` üzerindeki tekrar okuma baskısı azaltıldı.
- Node test profilinde `objectsRead` `14 -> 10`, `objectsCacheHit` `45 -> 21`, `writeObjectsCall` `8 -> 5` oldu.

### 3.5 Panel genişlik ve kompaktlık düzeltildi

`ultraSiparisPaneli.html` içinde:

- Dialog genişlik hedefi `0.995 * availableWidth`, minimum `1500`.
- Dialog yükseklik hedefi `0.965 * availableHeight`, minimum `900`.
- Shell, kart, section, input, status ve footer paddingleri azaltıldı.
- Mobil/tablet kırılımı `1180px` yerine `920px` yapıldı; masaüstünde 12 kolon düzen daha uzun süre korunur.
- Amaç: yarım/dar ekran ve gereksiz uzun scroll etkisini azaltmak.

## 4. Test Profili Karşılaştırması

Önceki Node profil özeti:

- `settingsRead`: `1`
- `settingsCacheHit`: `17`
- `objectsRead`: `14`
- `writeObjectsCall`: `8`
- `writeObjectsRows`: `12`
- `objectsCacheHit`: `45`
- `deltaReplaceCall`: `12`

Bu turdaki Node profil özeti:

```json
{
  "saveProfileTopSteps": [
    {
      "name": "hafifErpGuncelle_",
      "count": 1,
      "ms": 6
    },
    {
      "name": "urunKalemleriniKontrolEtForOpen_",
      "count": 1,
      "ms": 4
    },
    {
      "name": "normalizeUltraForm_",
      "count": 1,
      "ms": 3
    },
    {
      "name": "objects_:04_URUN_KALEMLERI",
      "count": 7,
      "ms": 3
    },
    {
      "name": "updateMusteriHafizaForOpen_",
      "count": 1,
      "ms": 2
    }
  ],
  "saveProfileCounters": {
    "schemaFastPass": 1,
    "settingsRead": 1,
    "settingsCacheHit": 6,
    "objectsRead": 10,
    "writeObjectsCall": 5,
    "writeObjectsRows": 4,
    "productMapRead": 1,
    "productMapCacheHit": 4,
    "objectsCacheHit": 21,
    "deltaReplaceCall": 5,
    "deltaRowsUpdated": 6,
    "deltaRowsInserted": 5,
    "deltaRowsDeleted": 5,
    "lightSavePath": 1
  }
}
```

Yorum:

- Bu test canlı UI süresi değildir.
- Ancak aynı test harness içinde Kaydet zincirindeki tam yazım/okuma baskısı belirgin düştü.
- Canlı kabul için panelden tekrar saha profil ölçümü gerekir.

## 5. Çalıştırılan Testler

| Test | Sonuç |
|---|---|
| `npm ci` | Geçti, 0 vulnerability |
| `npm audit --audit-level=high` | Geçti, 0 vulnerability |
| `npm test` | Geçti |
| Core syntax | Geçti |
| Duplicate public function | Geçti |
| Yasak aktif kod terimi taraması | Geçti |
| Existing openId save duplicate kontrolü | Geçti |
| Status normalize kontrolü | Geçti |
| Panel payload/edit testleri | Geçti |
| Son Sheet referans sözleşmesi | Geçti |

`npm test` genel özeti:

- `functionCount`: 110
- `activeFiles`: 6
- `openRows`: 6
- `invoiceGroups`: 7
- `addressRows`: 8
- `salesPostCalls`: 1
- `contactPostCalls`: 0
- `navlungoPostCalls`: 6

Not: POST sayaçları Node test harness içi kontrollü sayaçtır; gerçek canlı Paraşüt/Navlungo/e-belge POST yapılmadı.

## 6. Apps Script Push/Pull SHA

Canlı Apps Script proje ID:

- `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

Yükleme klasörü:

- `C:\Users\emrah\Desktop\clasp_v65_main_upload`

Çalıştırılan komutlar:

- `clasp push --force`
- `clasp pull --force`
- `clasp status`

Push sonucu:

- `Pushed 7 files at 01:25:29.`

Pull sonucu:

- `Pulled 7 files.`

SHA256:

| Dosya | GitHub/lokal SHA256 | Apps Script pull SHA256 | Eşleşme |
|---|---:|---:|---|
| `tesbih_kuyusu_v6_5_ultra_operasyon_core.gs` / live `.js` | `24B84E133A62BEB89B0B2F56336F03ED24BB3B3C02C4F072313B69D414528CE9` | `24B84E133A62BEB89B0B2F56336F03ED24BB3B3C02C4F072313B69D414528CE9` | Evet |
| `ultraSiparisPaneli.html` | `2679CF594937BA852CE4648EBA420B6480E34B0585A64A341AEE1752A51E1A68` | `2679CF594937BA852CE4648EBA420B6480E34B0585A64A341AEE1752A51E1A68` | Evet |
| `appsscript.json` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | Evet |

## 7. Canlı POST Güvenliği

Bu turda:

- Paraşüt canlı POST yapılmadı.
- Navlungo canlı POST yapılmadı.
- e-belge canlı POST yapılmadı.
- Canlı Sheet verisi silinmedi.

## 8. Kalan Riskler

- Saha profilindeki `51.8 sn` sorunu için ikinci seviye kod indirimi yapıldı; ancak canlı UI tekrar testi bu turda çalıştırılmadı.
- Gerçek kabul için kullanıcının aynı canlı panelden tekrar `Kaydet` çalıştırıp yeni profil çıktısını paylaşması gerekir.
- `objects_:04_URUN_KALEMLERI` hâlâ aynı testte 7 kez görünüyor; bir sonraki optimizasyon `objectsForOpen_` / scoped read helper olabilir.

## 9. Sonuç

PR #6 son saha notu uygulandı:

- Saha profil verisi rapora işlendi.
- Kaydet şema kontrolü hafifletildi.
- Plain Kaydet minimum ERP yoluna alındı.
- Tek final sync korundu.
- 06/07/11 hazırlıkları plain Kaydet dışına alındı.
- Panel dialog ölçüsü ve yoğunluğu iyileştirildi.

Bu çalışma canlı UI 5-10 sn kabulünü kanıtlamaz; canlı yeniden test için hazırlar.

## 10. GitHub Commit ve CI Kanıtı

- Uygulama commit'i: `55e207a20f9b361f203f6e4fb018ff1c2069bfcc`
- Branch: `v6-5-production-candidate`
- PR: `#6`
- GitHub Actions run ID: `25405860324`
- GitHub Actions job: `V6.5 Apps Script test harness`
- GitHub Actions sonucu: `success`

Son yerel tekrar:

- `npm ci`: geçti, 0 vulnerability
- `npm audit --audit-level=high`: geçti, 0 vulnerability
- `npm test`: geçti
- Son profil sayaçları: `schemaFastPass=1`, `lightSavePath=1`, `objectsRead=10`, `writeObjectsCall=5`, `writeObjectsRows=4`

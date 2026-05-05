# 2026-05-06 Kaydet Performans Üçüncü Seviye ve Cari Otomasyon Raporu

## 1. Kapsam

PR #6 içindeki son görev uygulandı: canlı saha geri bildiriminde bildirilen `37.7 sn` Kaydet süresi ve Kaydet sırasında cari çözümünün operatöre kalması problemi için üçüncü seviye düzeltme yapıldı.

Bu rapor gerçek canlı UI testinin geçtiğini iddia etmez. Kullanıcıdan gelen saha sonucu hâlâ başarısız kabul edildi. Bu turda yapılan iş, Kaydet yolunu daha sert ayırmak, ağır ERP adımlarını plain Kaydet dışına almak, güvenli cari bağlamayı Kaydet içine almak ve test harness ile hedef davranışı doğrulamaktır.

## 2. İncelenen Dosyalar

- `README.md`
- `CANLIYA_GECIS.md`
- `PROJE_DURUM_RAPORU.md`
- `CHANGELOG.md`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

## 3. Değiştirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_ucuncu_seviye_cari_otomasyon_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-06_codex_calisma_raporu.md`

Sheet dosyası bu turda değiştirilmedi.

## 4. Yapılan Kod Düzeltmeleri

### 4.1 Plain Kaydet Yolu Sert Ayrıldı

`kaydetUltraSiparisHizli_` içinde plain `Kaydet ve ERP güncelle` yolu daraltıldı.

Artık plain Kaydet sırasında şu ağır işlemler varsayılan olarak çalışmıyor:

- `hafifErpGuncelle_`
- final `senkronizeDurumForOpen_`
- `kontrolMerkeziniGuncelleForOpen_`
- `panelKontrolOzetiForOpen_`
- müşteri hafızası tam güncelleme

Yeni yol sadece panel verisini normalize eder, ilgili sipariş satırlarını hedefli yazar, ödeme/ürün/fatura bağlantılarını düzeltir, güvenli cari bağlama dener ve hızlı panel kontrol özeti döndürür.

### 4.2 Hedefli 03 Açık Sipariş Özeti

`patchOpenSummaryForSave_` eklendi. Plain Kaydet artık 03 tarafında tüm tabloyu baştan yazmak yerine ilgili `Açık_Sipariş_ID` özetini hedefli patch eder.

### 4.3 Fatura Grubu Hafif Upsert

`upsertInvoiceGroupsFromPanelSave_` eklendi. Paneldeki ödeme yapan kişilerden fatura grupları hedefli oluşturulur veya güncellenir. Aynı `Açık_Sipariş_ID + ödeme yapan` için gereksiz yeni fatura grubu açılmaması hedeflendi.

### 4.4 Ürün Satırı Ödeme Bağlantısı

`linkProductRowsToPaymentsForSave_` eklendi. Ürün satırları aynı sipariş içindeki ödeme yapan kişiyle eşleşen `Ödeme_ID` değerine bağlanır. Bu adım `Ödeme ID eksik` uyarısını güvenli durumda temizler.

### 4.5 Cari Otomasyon

`autoCariBaglaForOpen_` genişletildi.

Yeni davranış:

- Sadece ilgili `Açık_Sipariş_ID` için çalışır.
- 90 ve üzeri tek güçlü aday varsa otomatik bağlar.
- Çoklu, zayıf veya eksik aday varsa açık panel onayı ister.
- Canlı cari oluşturma yalnız iki kapı açık olduğunda çalışabilir:
  - `PARASUT_CARI_CANLI_OLUSTURMA = Evet`
  - `PARASUT_CARI_KAYDETTE_OTO_OLUSTURMA = Evet`
- Varsayılan yeni ayar: `PARASUT_CARI_KAYDETTE_OTO_OLUSTURMA = Hayır`
- Canlı cari oluşturma kapısı kapalıyken gerçek contact POST yapılmaz.

`PARASUT_CONTACT_ID_MAP_JSON` object tabanlı kayıtları da okuyacak şekilde geliştirildi. Güvenli puanlama için `id`, `phone`, `taxNo`, `address`, `city`, `district` alanları kullanılabilir.

### 4.6 Satır Yazımı

`upsertObjectByKey_` içinde tek satır güncelleme per-cell yazım yerine tek `setValues` satır yazımına alındı. Bu, ilgili tek satır patchlerinde Apps Script çağrı sayısını azaltır.

## 5. Test Dosyası Düzeltmeleri

`07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js` güncellendi.

Eklenen veya sıkılaştırılan kontroller:

- Plain Kaydet profilinde `hafifErpGuncelle_` adımı bulunmamalı.
- `plainSaveFastPath` sayacı üretilmeli.
- Güvenli cari adayı Kaydet sırasında otomatik bağlanmalı.
- Cari bulunamadığında boş `Paraşüt_Cari_ID` ile geçilmemeli.
- Cari bulunamadığında hızlı panel kontrolü blokaj dönmeli.
- Fatura payload testi öncesinde 07 hazırlığı ayrı Paraşüt aşaması olarak çağrılmalı.
- Edit kaydı için hedefli satır yazımı sayacı kabul edilmeli.

## 6. Çalıştırılan Testler

### 6.1 npm ci

Sonuç: geçti.

Özet:

```text
added 1 package, and audited 2 packages
found 0 vulnerabilities
```

### 6.2 npm audit

Komut:

```text
npm audit --audit-level=high
```

Sonuç: geçti.

Özet:

```text
found 0 vulnerabilities
```

### 6.3 Aktif Kod Yasak İfade Taraması

Taranan aktif dosyalar:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`

Sonuç: eşleşme yok.

### 6.4 git diff --check

Sonuç: geçti. Yalnız Windows çalışma kopyası için CRLF uyarısı görüldü; whitespace hatası oluşmadı.

### 6.5 npm test

Komut:

```text
npm test
```

Sonuç: geçti.

Çalışan testler:

- `test_v6_5_ci_checks.js`
- `test_v6_5_ultra_operasyon.js`
- `test_v6_5_son_sheet_referans_sozlesmesi.js`

Öne çıkan sonuç:

```json
{
  "ok": true,
  "functionCount": 110,
  "activeFiles": 6
}
```

Kaydet profil sonucu:

```json
{
  "saveProfileTopSteps": [
    { "name": "normalizeUltraForm_", "count": 1, "ms": 2 },
    { "name": "linkProductRowsToPaymentsForSave_", "count": 1, "ms": 1 },
    { "name": "upsertInvoiceGroupsFromPanelSave_", "count": 1, "ms": 1 },
    { "name": "patchOpenSummaryForSave_", "count": 1, "ms": 1 },
    { "name": "ensureCoreSheetsReadyForSave_", "count": 1, "ms": 0 }
  ],
  "saveProfileCounters": {
    "plainSaveFastPath": 1,
    "deltaReplaceCall": 2,
    "singleRowAppend": 4
  }
}
```

Bu profil local test harness sonucudur. Gerçek Google Sheets UI üzerinde 1-5 saniye hedefi bu turda doğrulanmadı.

Sheet sözleşmesi sonucu:

```json
{
  "ok": true,
  "workbook": "02_SHEET_SISTEM\\TESBIH_KUYUSU_MASTER_SHEET (20).xlsx",
  "openIdCount": 8,
  "checks": [
    "Sheet/code header parity",
    "ID link integrity",
    "13_VERI_SOZLUGU coverage",
    "10_808 Fark zero",
    "07/08 required columns"
  ]
}
```

## 7. Apps Script Yükleme ve SHA Kanıtı

Yüklenen canlı Apps Script projesi:

```text
1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77
```

Komutlar:

```text
clasp push --force
clasp pull --force
```

Yüklenen dosyalar:

- `appsscript.json`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

Pull sonrası repo/canlı SHA eşleşmesi:

| Dosya | SHA256 | Eşleşme |
|---|---:|---|
| core | `F84D8508D5C4D79804FEE3CB102D78E88FAF543CCA8BAC86165251B87F5FF893` | Evet |
| ultraSiparisPaneli | `2679CF594937BA852CE4648EBA420B6480E34B0585A64A341AEE1752A51E1A68` | Evet |
| cariSecDialog | `3315B7551E3440846ABAA25929B7AB7B921E3CFD9F57D8CFE8AAAD04C778D0D3` | Evet |
| urunEkleDialog | `CF3AC682F8C32EC29ADE27FFBFC8431AEBCDFC92F265C7BC4B79D6224695A3DA` | Evet |
| odemeEkleDialog | `8C268C033E232EDFC2329567F3229A2B00B4DB9F5E1C2E03BB0B4502E79B51A7` | Evet |
| kargoBilgisiDialog | `A40A6F96992D14D18BA1539DAC1FD9B50F999FE0321D911E6EB06A23678E2693` | Evet |

## 8. Canlı POST Durumu

Bu turda Codex tarafından gerçek canlı Paraşüt, Navlungo veya e-belge POST testi çalıştırılmadı.

Test harness içinde kontrollü test sayaçları görüldü:

- `salesPostCalls`: 1
- `contactPostCalls`: 0
- `navlungoPostCalls`: 6

Bu sayaçlar local test harness akışına aittir; gerçek canlı API çağrısı kanıtı değildir.

## 9. Saha Performansı Hakkında Dürüst Sonuç

Kullanıcının son saha sonucu: `37.7 sn Kaydet`.

Bu sonuç başarısızdır ve bu raporda çözüldü denmemektedir. Bu turdaki değişiklikler canlı Apps Script’e yüklendi; ancak yeni gerçek UI saha testi kullanıcı tarafından panel üzerinden tekrar çalıştırılmadan 1-5 saniye hedefi geçmiş kabul edilmeyecektir.

Beklenen yeni canlı UI kontrolü:

1. Ultra panelden mevcut veya yeni bir sipariş aç.
2. `Kaydet ve ERP güncelle` çalıştır.
3. Panelde dönen süreyi ve `performanceProfile.topSteps` bilgisini paylaş.
4. Profilde `hafifErpGuncelle_`, final `senkronizeDurumForOpen_` veya tüm ERP yenileme adımı görünmemeli.

## 10. Kalan Riskler

- Gerçek Google Sheets UI Kaydet süresi bu turda tekrar ölçülmedi.
- 1-5 saniye hedefi local harness ile değil canlı UI ile kanıtlanmalıdır.
- Plain Kaydet yolu hafifletildi; fakat fatura/kargo oluşturma gibi operasyonel aksiyonlarda doğal olarak daha ağır Paraşüt/Navlungo akışları kalır.
- Cari canlı oluşturma varsayılan kapalıdır; güvenli aday yoksa panel onayı ve cari aksiyon mesajı gereklidir.
- Bazı teknik bakım fonksiyonları hâlâ tam sistem yenileme yapabilir; bu rapor yalnız plain Kaydet yolunu hedefler.

## 11. Bir Sonraki Önerilen Adım

Kullanıcı ana Sheet üzerinde gerçek panelden tek sipariş Kaydet testi yapmalı. Süre 1-5 saniyeyi aşarsa panelde dönen profil çıktısı ile yeni darboğaz doğrudan hedeflenmelidir.

## 12. Codex Sohbet Çıktısı

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-06_kaydet_performans_ucuncu_seviye_cari_otomasyon_raporu.md`

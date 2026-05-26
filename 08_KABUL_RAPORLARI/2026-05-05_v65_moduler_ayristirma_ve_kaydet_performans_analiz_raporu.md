# V6.5 Moduler Ayristirma ve Kaydet Performans Analiz Raporu

PR #6 son yorum ID: `4382985654`

Tarih: 2026-05-06

## 1. Kapsam

Bu turda buyuk refactor yapilmadi. Istenen is, Ultra Siparis Paneli `Kaydet` akisini performans acisindan analiz etmek, 110 saniye saha suresinin muhtemel kok nedenlerini ayirmak ve kontrollu moduler ayristirma planini yazmaktir.

Canli Paraşüt, Navlungo veya e-belge POST calistirilmadi.

## 2. Incelenen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `package.json`
- `package-lock.json`
- PR #6 son yorum `4382985654`

## 3. Degistirilen Dosyalar

- `08_KABUL_RAPORLARI/2026-05-05_v65_moduler_ayristirma_ve_kaydet_performans_analiz_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

Apps Script core, HTML panel, Sheet dosyasi veya test dosyalari degistirilmedi.

## 4. Core Boyutu ve Statik Olcum

Aktif V6.5 core dosyasi:

- Dosya: `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- Satir: `6663`
- Karakter: yaklasik `334436` byte
- Public wrapper sayisi: `110`
- Ic `TK6` fonksiyon sayisi: `388`

Statik I/O taramasi:

| Kalip | Adet | Yorum |
| --- | ---: | --- |
| `objects_(` | 185 | Tam sayfa okuma yardimcisina yogun bagimlilik var. |
| `writeObjects_(` | 33 | Cogunlukla tum sheet govdesini temizleyip yeniden yazar. |
| `getDataRange(` | 5 | `objects_()` ve ayar okuma tarafinda tam range okur. |
| `setValues(` | 11 | Toplu yazim var ama genelde tam govde yaziminda kullaniliyor. |
| `clearContent(` | 1 | `writeObjects_()` icinden govde temizleme icin kullaniliyor. |
| `UrlFetchApp.fetch` | 5 | Kaydet akisi icin zorunlu olmamali; operasyon butonlarinda devreye giriyor. |
| `SpreadsheetApp.flush` | 0 | Flush kaynakli bekleme gorulmedi. |
| `Utilities.sleep` | 0 | Bilerek bekleme yok. |
| `setting_(ss` | 55 | Her cagrida `settingsMap_()` tekrar okuyabiliyor. |
| `productIdMap_(` | 6 | Urun map okuma tekrarli is akisi icinde tekrar okunabiliyor. |

## 5. Kaydet Akisi

Panel `Kaydet ve ERP guncelle` tek sipariste `ultraSiparisKaydet_()` public wrapperindan `kaydetUltraSiparisHizli_()` fonksiyonuna iner.

Incelenen ana zincir:

- `ultraSiparisKaydet_` -> `kaydetUltraSiparisHizli_`
- `kaydetUltraSiparisHizli_`
  - `ensureCoreSheetsReadyForSave_`
  - `normalizeUltraForm_`
  - yeni kayitta `acikSiparisleriGrupla_`
  - urunler icin `appendProductRowFromParsed_`
  - odemeler icin `appendPaymentRowFromParsed_`
  - kargo icin `upsertQuickCargo_`
  - hizli alan varsa `processQueueQuickInputs_`
  - `hafifErpGuncelle_`
  - `applyInvoicePanelHints_`
  - `autoCariBaglaForOpen_(..., false)`
  - `updateMusteriHafizaForOpen_`
  - `parasutTaslaklariniHazirlaForOpen_`
  - `senkronizeDurumForOpen_`
  - `ebelgeIstisnaHazirlaForOpen_`
  - `rebuildOpenOrderForOpen_`
  - tekrar `senkronizeDurumForOpen_`
  - `kontrolMerkeziniGuncelleForOpen_`
  - `panelKontrolOzetiForOpen_`

Kod referanslari:

- `kaydetUltraSiparisHizli_`: core satir `1606`
- `hafifErpGuncelle_`: core satir `2310`
- `kontrolMerkeziniGuncelleForOpen_`: core satir `2748`
- `senkronizeDurumForOpen_`: core satir `4226`
- `writeObjects_`: core satir `3824`
- `batchWriteRows_`: core satir `5949`

## 6. 110 Saniye Icin Kok Neden Degerlendirmesi

### 6.1 Dosya boyutu

Dosya boyutu risk faktorudur ama tek basina kok neden olarak kabul edilmedi.

Apps Script calistirma baslangicinda 6663 satirlik tek core dosyanin parse/load maliyeti olabilir. Ancak saha suresi `Kaydet` sirasinda 110 saniye ise asil supheli nokta runtime icindeki Sheet I/O ve tekrarli rebuild zinciridir.

Karar: Dosya boyutu ikincil risk. Once Sheet I/O profili duzeltilmeli.

### 6.2 Fazla Sheet read/write

En guclu kok neden adayi budur.

`objects_(sh)` tum sheet'i `getDataRange().getValues()` ile okur. `writeObjects_(sh, headers, objects)` ise `clearBody_()` ile 2. satirdan itibaren tum govdeyi temizler ve tum listeyi yeniden yazar.

`replaceRowsForOpen_()` sadece bir `openId` icin calisiyor gibi gorunse de once ilgili sheet'in tamamini `objects_()` ile okuyor, sonra ilgili `openId` satirlarini degistirip `writeObjects_()` ile tum sheet govdesini yeniden yaziyor.

`hafifErpGuncelle_()` icinde ayni siparis icin su adimlar var:

- `odemeleriKontrolEtForOpen_`
- `urunKalemleriniKontrolEtForOpen_`
- `faturaGruplariniOlusturForOpen_`
- `rebuildOpenOrderForOpen_`
- `kargoPaketleriniOlusturForOpen_`
- `finans808OnizlemeOlusturForOpen_`
- `parasutTaslaklariniHazirlaForOpen_`
- `senkronizeDurumForOpen_`
- `ebelgeIstisnaHazirlaForOpen_`
- tekrar `rebuildOpenOrderForOpen_`
- tekrar `senkronizeDurumForOpen_`
- `kontrolMerkeziniGuncelleForOpen_`

Bu zincir icinde 04/05/06/07/08/10/11/12 ve 03 sayfalari birden fazla kez tam okunup tam yazilabiliyor.

Karar: 110 saniyenin birincil adayi `writeObjects_()` merkezli tum govde yeniden yazma ve tekrarli `objects_()` okuma zinciridir.

### 6.3 Full rebuild / fallback

`Kaydet` akisi `hafifErpGuncelle_()` adinda hafif gorunse de fiilen cok asamali ERP rebuild yapiyor. Yeni kayitta `acikSiparisleriGrupla_()` de devreye girebilir. Toplu kayitta `deferRefresh` kullaniliyor ama sonra kaydedilen her siparis icin yine `hafifErpGuncelle_()` dongusu calisiyor.

Karar: Tek sipariste bile hafif delta degil, cok sayfali scoped rebuild var. Toplu kayitta 10/50 siparis icin bu maliyet katlanir.

### 6.4 Cache tekrar kurulumu

`setting_(ss, key, fallback)` her cagrida `settingsMap_(ss)` cagiriyor. `settingsMap_()` 01_AYARLAR'i tekrar `getDataRange()` ile okuyor. `productIdMap_()` de ayar/property map'ini tekrar okuyabiliyor.

Cache public wrapperlari var:

- `cacheAyarlariniOku_`
- `cacheParasutProductMap_`
- `cacheMusteriHafiza_`

Ancak bu wrapperlar kaydet akisi icinde merkezi bir request context cache olarak zorunlu kullanilmiyor.

Karar: Ayar ve map tekrar okuma ikincil ama anlamli maliyet ve basit kazanctir.

### 6.5 API bekleme

Plain `Kaydet ve ERP guncelle` akisi `autoCariBaglaForOpen_(..., false)` ile network kapali modda calisiyor. `parasutTaslaklariniHazirlaForOpen_()` payload satiri hazirliyor; canlı POST yapmamali. Navlungo/QZ de plain kaydet akisi icinde zorunlu gorunmuyor.

Operasyon butonlari (`faturaVeKargoOlustur`, Navlungo barkod, QZ print) ayri akislarda API/QZ beklemesi yaratabilir, fakat 110 saniye plain kaydet saha testinde gorulduyse ilk supheli API degil Sheet I/O'dur.

Karar: Plain kaydet icin API/QZ ana kok neden degil. Tek tus `Fatura ve Kargo olustur` akisi icin ayri profil gerekir.

## 7. Performans Profil Planı

Kod degisikligine gecmeden once bir sonraki guvenli adim:

1. `profileStep_(label, fn)` gibi tek amacli, production davranisini degistirmeyen bir timer eklensin.
2. Sadece `kaydetUltraSiparisHizli_`, `hafifErpGuncelle_`, `writeObjects_`, `objects_`, `settingsMap_`, `productIdMap_` icin ms sayaci toplansin.
3. Profil sonucu Sheet'e degil, Apps Script loguna ve istenirse `12_KONTROL_MERKEZI` disinda ayri rapor satirina yazilsin.
4. Canli kullanici verisini degistirmeyen tek siparis kaydet testinde asagidaki kirilim alinmali:
   - form normalize
   - queue patch/append
   - product upsert
   - payment upsert
   - cargo upsert
   - hafif ERP toplam
   - kontrol merkezi
   - toplam elapsedMs

Bu olmadan "dosya buyuklugu yuzunden yavas" demek dogru degildir.

## 8. Delta Update Hedefi

Kaydet performans hedefi icin temel degisim:

- Mevcut `writeObjects_()` genel yardimcisi korunmali, ama kaydet akisi onu tum sheet rewrite icin kullanmamali.
- `replaceRowsForOpen_()` yerine `patchRowsForOpenId_()` / `replaceScopedRowsForOpenId_()` gibi satir numarasi bazli delta yazim yardimcisi eklenmeli.
- Bir request icinde okunan sheet verisi `SheetContext` icinde cache'lenmeli.
- `hafifErpGuncelle_()` tek seferde 04/05/06/07/08/10/11/12/03 read snapshot alip hesaplamali, sonra her sheet icin tek batch write yapmali.
- `senkronizeDurumForOpen_()` ayni kaydet icinde iki kez cagrilmamali; gerekirse final tek sync olarak calismali.
- `kontrolMerkeziniGuncelleForOpen_()` kontrol sheet'ini tumden temizleyip yazmak yerine ilgili openId kontrol satirlarini delta guncellemeli.

## 9. Kontrollu Moduler Ayristirma Plani

TK6 tek global namespace korunacak. Public wrapper isimleri bozulmayacak. Apps Script dosya sirasi adlandirma ile kontrol edilecek.

Onerilen aktif dosya bolumu:

| Dosya | Icerik |
| --- | --- |
| `00_bootstrap_config.gs` | `TK6` namespace, `CFG`, sheet adlari, public bootstrap, onOpen/onEdit baglanti noktasi. |
| `01_headers_schema.gs` | `H`, `HEADERS`, sheet kolon sozlesmesi, `sistemKolonlariniHazirla`. |
| `02_utils_normalize_validate.gs` | normalize, validate, format, sayisal/tarih/telefon/adres yardimcilari. |
| `03_sheet_io_cache.gs` | `sheet_`, `objects_`, `writeObjects_`, delta write, request cache, settings/product/memory cache. |
| `04_queue_order_save.gs` | `ultraSiparisKaydet`, `kaydetUltraSiparisHizli_`, `topluUltraSiparisKaydet`, queue/order save. |
| `05_products_payments_invoices.gs` | urun, odeme, fatura grubu, 808, e-belge hazirlik hesaplari. |
| `06_parasut.gs` | Paraşüt token, cari, sales invoice payload/gonderim, dry-run. |
| `07_navlungo_qz.gs` | Navlungo token, payload, kargo, barkod, QZ response/writeback. |
| `08_panel_menu_context.gs` | Ultra panel data, selected row context, menu callbacks, panel operation router. |
| `09_lifecycle_archive_delete_restore.gs` | arsiv/sil/geri al audit modeli ve restore mantigi. |
| `10_status_control_center.gs` | status sync, control center, panel kontrol ozeti. |
| `11_tests_entrypoints.gs` | Apps Script icinden guvenli test wrapperlari ve readback yardimcilari. |

## 10. Risk Matrisi

| Risk | Etki | Olasilik | Onlem |
| --- | --- | --- | --- |
| Apps Script dosya yukleme sirasi bozulur | Yuksek | Orta | Dosya adlari `00_`, `01_` seklinde siralanir; `TK6` sadece bootstrap'ta acilir. |
| Public wrapper isimleri kirilir | Yuksek | Dusuk | Wrapperlar `11_tests_entrypoints.gs` veya bootstrap sonunda aynen korunur; duplicate test zorunlu. |
| `TK6` ic fonksiyon baglantilari kopar | Yuksek | Orta | Her modul IIFE icinde ayni `TK6` objesine attach eder; lokal private fonksiyonlar bolunmeden once bagimlilik listesi cikarilir. |
| Kaydet davranisi degisir | Yuksek | Orta | Once timer/profil commit'i, sonra delta write commit'i; existing openId panel save testi her committe calisir. |
| Full sheet rewrite yerine delta write veri kaybina yol acar | Yuksek | Orta | Delta write yalniz openId scoped satirlarda uygulanir; once kopya harness test, sonra canli UI readback. |
| Paraşüt/Navlungo guvenlik kapilari gevser | Yuksek | Dusuk | Integration modulleri ayri ama ayar kapilari aynen korunur; POST testleri stub/mock ortaminda kalir. |
| Eski core dosyalari aktif sanilir | Orta | Orta | Apps Script remote aktif dosya listesi her push sonrasi pull-back SHA ile raporlanir. |
| Yeni ozellikler yine ana save zincirine yigilir | Orta | Orta | `TK6.hooks` veya `operationQueue` extension point tanimlanir; buyuk isler queue/hook ile baglanir. |

## 11. Adim Adim Commit Plani

### Commit 1 - Profil altyapisi

- Davranis degistirmeyen timer/profil yardimcisi ekle.
- `Kaydet` akisi icin adim ms raporu don.
- Testler: syntax, duplicate public function, Node test, existing openId save.

### Commit 2 - Request cache

- `SheetContext` / `RequestContext` ekle.
- 01_AYARLAR, product map, memory, sheet row snapshot bir islem icinde tek kez okunsun.
- `setting_()` geriye uyumlu kalsin ama context desteklesin.

### Commit 3 - Delta write pilotu

- 12_KONTROL_MERKEZI ve 03_ACIK_SIPARISLER icin openId scoped delta patch pilotu.
- Full `writeObjects_()` fallback korunur.
- Profil karsilastirmasi raporlanir.

### Commit 4 - Kaydet scoped rebuild

- `hafifErpGuncelle_()` tek snapshot + tek final write planina donusturulur.
- `senkronizeDurumForOpen_()` cift cagri azaltılır.
- Existing siparis kaydet 1-5 sn hedefine yaklastirilir.

### Commit 5 - Modul ayirma baslangici

- Once config/header/utils/sheet I/O ayrilir.
- Public wrappers aynen kalir.
- Apps Script push/pull SHA dogrulanir.

### Commit 6 - Operasyon modulleri

- save/order, product/payment/invoice, status/control ayrilir.
- Her commit sonrasi test ve Apps Script SHA dogrulama yapilir.

### Commit 7 - Integration modulleri

- Paraşüt ve Navlungo/QZ ayrilir.
- Canli kapilarin default kapali kaldigi test edilir.

### Commit 8 - Lifecycle ve panel/context

- secili satir context, panel data, arsiv/sil/geri al modul dosyalarina tasinir.
- UI bos panel ve duplicate save testleri tekrar calisir.

## 12. Testler

Bu turda calistirilan yerel testler:

```text
npm ci
npm audit --audit-level=high
npm test
```

Sonuclar:

- `npm ci`: basarili
- `npm audit --audit-level=high`: `found 0 vulnerabilities`
- `npm test`: basarili
- `test_v6_5_ci_checks.js`: core syntax, duplicate public function, active code forbidden term checks OK
- `test_v6_5_ultra_operasyon.js`: OK
- `test_v6_5_son_sheet_referans_sozlesmesi.js`: OK

Not: Node testindeki `salesPostCalls`, `navlungoPostCalls` gibi alanlar local harness sayaçlaridir; canli Paraşüt/Navlungo/e-belge POST calistirilmadi.

## 13. Apps Script ve Sheet Durumu

- Apps Script'e bu turda dosya yuklenmedi; operasyon kodu degismedi.
- Sheet tarafinda bu turda dosya uretilmedi veya canli veri degistirilmedi.
- Son dogrulanmis Apps Script push/pull SHA bilgisi onceki PR #6 rapor yorumunda yer aliyor. Bu tur yalniz analiz ve rapor commit'idir.
- Canli Apps Script ile GitHub eslesmesi icin yeni push/pull yapilmadi; cunku core/HTML degisikligi yok.

## 14. Sonuc

110 saniye saha suresi icin en guclu kok neden, core dosyasinin 6663 satir olmasindan once, `Kaydet` zincirinin ayni `openId` icin tekrarli tam sayfa okuma ve tum govde yeniden yazma yapmasidir.

Kisa karar:

1. Buyuk refactor'a hemen girilmemeli.
2. Once canli profil/timer ile adim sureleri kanitlanmali.
3. Ilk teknik duzeltme moduler bolmek degil, `SheetContext + request cache + delta write` olmalidir.
4. Moduler ayrim bundan sonra davranis degistirmeyen kucuk commitler halinde yapilmalidir.
5. Yeni ozellikler ana core'a yigilmak yerine hook/kuyruk baglanti noktalarindan eklenmelidir.

Codex sohbet ciktisi / calisma ozeti su dosyaya islendi: `08_KABUL_RAPORLARI/2026-05-05_v65_moduler_ayristirma_ve_kaydet_performans_analiz_raporu.md`

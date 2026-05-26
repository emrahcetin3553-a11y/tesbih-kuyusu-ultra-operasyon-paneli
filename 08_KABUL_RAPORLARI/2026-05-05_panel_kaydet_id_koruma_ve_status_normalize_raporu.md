# 2026-05-05 Panel Kaydet ID Koruma ve Status Normalize Raporu

## Kapsam

PR #6 son yorumundaki saha hatasi uygulandi:

1. `06_FATURA_GRUPLARI!Q` alanina yalniz validasyonun kabul ettigi `Hazır` ve `Gönderildi` degerleri yazilacak.
2. Ultra panel mevcut siparis duzenleme modunda hata alindiktan sonra tekrar `Kaydet ve ERP güncelle` calistirildiginda ayni `Açık_Sipariş_ID` korunacak.

## Incelenen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `appsscript.json`
- PR #6 son yorum: `4382365883`

## Degistirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-05_panel_kaydet_id_koruma_ve_status_normalize_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## Ne Duzeltildi

### 1. Fatura_Durumu validation uyumu

`06_FATURA_GRUPLARI` yazim katmanina merkezi normalizasyon eklendi.

Etkilenen yazma noktalarinda `Fatura_Durumu` artik kayit oncesi normalize ediliyor:

- `writeObjects_`
- `appendObject_`
- `upsertObjectByKey_`
- `patchObjectRow_`
- `patchRowsByKey_`

Sonuc:

- `Hazir`, `Hazir.`, ` Hazır. ` gibi degerler `Hazır` olur.
- `Gönderildi.`, bosluklu `Gönderildi` ve ascii varyasyonlar `Gönderildi` olur.
- `Blokaj`, `Hata`, `Kilitli`, `Arşiv`, `İptal` gibi validasyon disi durumlar 06/Q alanina yazilmaz; operasyonel sebep `Kontrol_Uyarısı` alaninda kalir.
- Sheet data validation kaldirilmadi.

### 2. Mevcut siparis duzenleme context korumasi

`ultraSiparisPaneli.html` icinde edit modunda acilan kartlara sabit edit context eklendi:

- `data-edit-open-id`
- `data-lock-open-id`

Musteri hafizasi asenkron cevap verdiginde, edit kartindaki `openId` artik baska acik siparisle ezilmiyor.

`collectOrder`, `saveAll` ve operasyon sonucu uygulama akislari edit kartlarinda `editOpenId` degerini birincil kaynak olarak kullaniyor.

### 3. Backend emniyet kemeri

`kaydetUltraSiparisHizli_` icinde `form.openId` bos gelirse yeni siparis acmadan once yalniz form icindeki gercek mevcut ID'lerden openId geri kazanimi deneniyor:

- `Kargo_Paket_ID`
- `Ürün_Kalem_ID`
- `Ödeme_ID`
- `Fatura_Grubu_ID`

Bu geri kazanma rastgele veya ilk uygun siparis secmez. Yalniz panel payload icindeki mevcut satir ID'lerinden iliskili `Açık_Sipariş_ID` bulunursa kullanilir. Yeni siparis kartinda bu ID'ler yoksa normal yeni siparis akisi devam eder.

## Eklenen Testler

`07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js` icine su kontroller eklendi:

- `Fatura_Durumu = Hazir.` kayit oncesi `Hazır` olur.
- `Fatura_Durumu = Gönderildi.` kayit oncesi `Gönderildi` olur.
- Paraşüt hata durumu 06/Q validasyon alanini bozmaz; uyari `Kontrol_Uyarısı` alanina gider.
- Mevcut siparis edit modunda eksik telefon ile hata alinirsa yeni siparis acilmaz.
- Hata duzeltildikten sonra ayni payload yeniden kaydedildiginde ayni `Açık_Sipariş_ID` ve ayni `Kargo_Paket_ID` korunur.
- Yeni siparis modunda yeni `Açık_Sipariş_ID` uretilir; mevcut edit siparis ID'si kullanilmaz.

## Calistirilan Testler

```text
npm ci
npm audit --audit-level=high
npm test
```

Sonuc:

- `npm ci`: basarili
- `npm audit --audit-level=high`: `found 0 vulnerabilities`
- `npm test`: basarili

`npm test` kapsami:

- core syntax
- duplicate public function kontrolu
- aktif uretim dosyalarinda yasak ifade taramasi
- V6.5 Node test seti
- son Sheet referans sozlesme testi

## Apps Script Push/Pull Kaniti

Upload klasoru:

```text
C:/Users/emrah/Desktop/clasp_v65_main_upload
```

Calistirilan komutlar:

```text
clasp push --force
clasp pull --force
```

Sonuc:

- `clasp push --force`: `Pushed 7 files`
- `clasp pull --force`: `Pulled 7 files`

SHA256 readback:

| Dosya | Lokal SHA256 | Pull-back SHA256 | Eslesme |
| --- | --- | --- | --- |
| `tesbih_kuyusu_v6_5_ultra_operasyon_core` | `1E7E7C65C06BD1C290997FCE2A9E377F8BC8F81D857A5AF60D4D6831EEEFC9AB` | `1E7E7C65C06BD1C290997FCE2A9E377F8BC8F81D857A5AF60D4D6831EEEFC9AB` | Evet |
| `ultraSiparisPaneli.html` | `2A89FB386FE9FC319B2C34CF1816FE1C00B361307AA56DF87110B99977EE38FF` | `2A89FB386FE9FC319B2C34CF1816FE1C00B361307AA56DF87110B99977EE38FF` | Evet |
| `appsscript.json` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | Evet |

## GitHub Actions Readback

Kod commit'i:

```text
c6e02995ffe4808770feecfee7c0796e2f762f7e
```

GitHub Actions sonucu:

- Run: `25398789059`
- Workflow: `Node.js CI`
- Run number: `21`
- Status: `completed`
- Conclusion: `success`
- Job: `V6.5 Apps Script test harness`
- Job ID: `74492588274`
- Job conclusion: `success`
- Step readback: Checkout, Use Node.js 20.x, Install dependencies, Audit dependencies, Run V6.5 acceptance checks hepsi `success`.

## Sheet ve Canli Islem Durumu

- Canli Sheet verisi silinmedi.
- Data validation kaldirilmadi.
- Paraşüt POST calistirilmadi.
- Navlungo POST calistirilmadi.
- e-belge POST calistirilmadi.
- Bu turda gercek Google Sheets UI testi yapilmadi; kanit yerel test harness ve Apps Script push/pull SHA readback ile sinirlidir.

## Kalan Riskler

- Kullanici panelde ayni senaryoyu gercek UI uzerinden tekrar denemelidir: mevcut siparis duzenle, hata al, duzelt, `Kaydet ve ERP güncelle`.
- Gercek UI dogrulamasi kullanici ekranindan alinmadigi icin bu rapor `canli kabul tamamlandi` demez.

Codex sohbet ciktisi / calisma ozeti su dosyaya islendi: `08_KABUL_RAPORLARI/2026-05-05_panel_kaydet_id_koruma_ve_status_normalize_raporu.md`

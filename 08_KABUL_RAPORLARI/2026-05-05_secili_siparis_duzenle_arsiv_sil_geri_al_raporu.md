# 2026-05-05 Seçili Sipariş Düzenleme, Arşiv, Sil, Geri Al Raporu

## 1. Görev Kaynağı

- Kaynak: GitHub PR #6 son yorum
- Yorum ID: `4382796414`
- Kapsam: 02 seçili satırdan Ultra Panelin dolu açılması, `Sil` / `Arşivle` / `Geri al` işlemlerinin bağlı tabloları geri alınabilir audit yapısıyla yönetmesi.

## 2. İncelenen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 3. Değiştirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-05_secili_siparis_duzenle_arsiv_sil_geri_al_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 4. Yapılan Düzeltmeler

### 4.1 Seçili 02 Satırı Panel Payload

- `ultraPanelPayloadForOpenId_` artık yalnız 02 satırına bağlı kalmıyor; 03 açık sipariş özetinden müşteri/telefon bilgisini, 04/05/06/08 satırlarından ürün, ödeme, fatura ve kargo bloklarını tamamlıyor.
- `openIdFromRelatedRow_` 02 satırında `Açık_Sipariş_ID` boşsa `Kuyruk_ID` üzerinden 04/05/02 ilişkili satırlarını tarayarak `Açık_Sipariş_ID` çözebiliyor.
- 10/11/12/15 ve audit sayfaları için ilişki çözüm desteği eklendi.
- Panelin boş açılması yalnız yeni sipariş modu için bırakıldı; seçili satırdan veri bulunamazsa kullanıcıya açık uyarı dönecek yapı korunuyor.

### 4.2 Geri Alınabilir Arşiv/Silinenler Modeli

Yeni kontrollü audit sayfaları kod sözleşmesine eklendi:

- `ARSIVLENENLER`
- `SILINENLER`

Audit kolonları:

- `Audit_ID`
- `İşlem_Tipi`
- `Tarih`
- `Kaynak_Sayfa`
- `Kaynak_Satır_No`
- `Açık_Sipariş_ID`
- `Kuyruk_ID`
- `Ürün_Kalem_ID`
- `Ödeme_ID`
- `Fatura_Grubu_ID`
- `Kargo_Paket_ID`
- `Kaynak_ID`
- `Satır_JSON`
- `Operatör`
- `Geri_Alındı_Mı`
- `Geri_Alma_Tarihi`
- `Geri_Alma_Durumu`
- `Kontrol_Uyarısı`

`Arşivle` artık 02/03/04/05/06/07/08/10/11/12/15 ilgili satırlarını audit sayfasına taşır ve aktif operasyon sayfalarından kaldırır.

`Sil` artık aynı bağlı satırları `SILINENLER` sayfasına taşır. Bu işlem gerçek kalıcı silme değildir; geri alınabilir operasyon taşımasıdır.

`Geri al` audit satırındaki `Satır_JSON` içeriğini kaynak sayfanın mevcut kolon sözleşmesine göre geri yazar, audit satırını `Geri_Alındı_Mı = Evet` olarak işaretler ve aynı kayıt için ikinci geri alma denemesinde duplicate üretmez.

## 5. Apps Script Yükleme

- Yüklenen core dosyası: `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- Yükleme klasörü: `C:\Users\emrah\Desktop\clasp_v65_main_upload`
- `clasp push --force`: `Pushed 7 files`
- `clasp pull --force`: `Pulled 7 files`

SHA256 readback:

- Lokal core: `AD23C3A611F174389B4F54804404C7B710EC00A41B266AD306F864B96C5749A5`
- Remote core pull-back: `AD23C3A611F174389B4F54804404C7B710EC00A41B266AD306F864B96C5749A5`
- Panel HTML: `2A89FB386FE9FC319B2C34CF1816FE1C00B361307AA56DF87110B99977EE38FF`
- Manifest: `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D`

Sonuç: Canlı Apps Script core ile GitHub çalışma dosyası eşleşiyor.

## 6. Sheet Durumu

- Canlı Sheet verisi bu turda değiştirilmedi.
- Kod sözleşmesine `ARSIVLENENLER` ve `SILINENLER` sayfaları eklendi.
- Bu sayfalar `sistemKolonlariniHazirla()` veya ilgili operasyon ilk çalıştığında kolon sözleşmesiyle oluşturulacak.
- Mevcut Sheet başlıkları değiştirilmedi.

## 7. Testler

Çalıştırıldı:

```text
npm ci
npm audit --audit-level=high
npm test
```

Sonuç:

- `npm ci`: başarılı
- `npm audit --audit-level=high`: `found 0 vulnerabilities`
- `npm test`: başarılı

Eklenen test kapsamı:

- 02 seçili satırdan Ultra Panel payload dolu gelir.
- 02 satırında `Açık_Sipariş_ID` boşken `Kuyruk_ID` ilişkisiyle payload dolu gelir.
- `Arşivle` bağlı satırları `ARSIVLENENLER` sayfasına taşır ve aktif sayfalardan kaldırır.
- `Geri al` arşivden satırları aktif sayfalara döndürür.
- Arşivden ikinci geri alma duplicate üretmez.
- `Sil` bağlı satırları `SILINENLER` sayfasına taşır ve aktif sayfalardan kaldırır.
- `Geri al` silinenlerden satırları aktif sayfalara döndürür.
- Silinenlerden ikinci geri alma duplicate üretmez.

## 8. Canlı POST Kanıtı

Bu turda aşağıdaki canlı işlemler yapılmadı:

- Paraşüt POST yapılmadı.
- Navlungo POST yapılmadı.
- e-belge POST yapılmadı.
- Canlı Sheet satırı silinmedi.

Yerel test harness içinde simüle edilen API sayaçları test ortamına aittir; canlı servis çağrısı değildir.

## 9. Kalan Riskler

- Gerçek Google Sheets UI üzerinden 02 satırı seçilip `Seçili siparişi düzenle` denemesi kullanıcı tarafından tekrar doğrulanmalı.
- Gerçek UI üzerinden `Arşivle`, `Sil`, `Geri al` çalıştırılmadan canlı kabul tamamlandı denmedi.
- `ARSIVLENENLER` / `SILINENLER` sayfalarının canlı Sheet üzerinde oluşması için `sistemKolonlariniHazirla()` veya ilgili operasyon çalıştırılmalıdır.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-05_secili_siparis_duzenle_arsiv_sil_geri_al_raporu.md`

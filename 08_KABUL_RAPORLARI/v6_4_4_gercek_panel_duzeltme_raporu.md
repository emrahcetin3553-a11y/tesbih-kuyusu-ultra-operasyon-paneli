# V6.4.4 Gerçek Panel Düzeltme Raporu

Tarih: 2026-05-02  
Sürüm: Tesbih Kuyusu V6.4.4 Ultra Operasyon Paneli  
Ana Apps Script proje ID: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

## Değiştirilen / Üretilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_4_4_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/topluSiparisPaneli.html` kaldırıldı
- `02_SHEET_SISTEM/Tesbih_Kuyusu_V6_4_4_Ultra_Operasyon_Sheet.xlsx`
- `07_TEST_DOSYALARI/test_v6_4_4_ultra_operasyon_mock.js`
- `07_TEST_DOSYALARI/build_v6_4_4_sheet.mjs`
- `CHANGELOG.md`
- `PROJE_DURUM_RAPORU.md`

## Düzeltilen Ana Sorunlar

| Sorun | Düzeltme | Kanıt |
|---|---|---|
| Telefon yazarken `+5`, `+09` gibi ara format üretiyordu | Telefon yazım sırasında normalize edilmiyor; blur/kayıt öncesi `+905xxxxxxxxx` kapanışı yapılıyor | HTML statik kontrol: `field(card, "whatsAppTel").value = phone` kalmadı |
| Ayrı toplu sipariş paneli ana akışta kalmıştı | `topluSiparisPaneli.html` kaldırıldı; çoklu sipariş Ultra panelde `Yeni sipariş ekle` bloklarıyla kaldı | Menü kontrolünde `Toplu sipariş paneli` yok |
| Ödeme/fatura alanları kargo bilgisinden yeterince beslenmiyordu | Kargo tel/adres/il/ilçe ödeme yapan ve fatura/cari varsayılanlarına akıyor; manuel dokunulan alan ezilmiyor | Mock: ödeme tel `+905559990000`, il `İzmir` |
| Fatura e-posta alanı yoktu | `Fatura_Eposta` kolonu ve panel alanı eklendi | Sheet kontrolü: `06_FATURA_GRUPLARI` içinde `Fatura_Eposta = true` |
| Cari ID operatöre manuel yükleniyordu | Panel içinde `Cari seç / ara` ve `Cari oluştur` butonları eklendi | Mock: güçlü cari `C-1` panel aksiyonuyla bağlandı; canlı oluşturma kapalıyken payload üretildi, POST yapılmadı |
| `Kontrol et` sahte OK riski taşıyordu | Kayıt öncesi form doğrulaması ve kayıtlı durumda `12_KONTROL_MERKEZI` özeti kullanıldı | Mock: cari eksikken `ok=false`, sahte OK yok |
| Birleşik ad/eksik telefon kayda geçebiliyordu | `Mehmetnuriçetin` ve geçersiz telefon kayıt öncesi durduruluyor | Mock: `assertThrows` geçti |

## Apps Script Yükleme Kanıtı

Canlı Apps Script projesine yüklenen dosyalar:

- `appsscript.json`
- `tesbih_kuyusu_v6_4_4_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

Kaldırılan remote aktif dosyalar:

- `tesbih_kuyusu_v6_4_3_ultra_operasyon_core.js`
- `topluSiparisPaneli.html`

Core SHA256:

- Lokal: `DB160875FB593C27D598CA2ECB3B0845CCE0502255422C6E6BAB411256384E4A`
- Remote pullback: `DB160875FB593C27D598CA2ECB3B0845CCE0502255422C6E6BAB411256384E4A`

Sheet SHA256:

- `56FF1ECC1BBEB2FEC97BDBB3F8A853A25B688C8856B7C73FA4FD30EE4D070DA5`

## Çalıştırılan Kontroller

| Kontrol | Sonuç |
|---|---|
| Core syntax | `CORE_SYNTAX_OK` |
| Duplicate function | `DUPLICATES_NONE` |
| Function count | `310` |
| Yasak kelime taraması | Bulgu yok |
| Türkçe karakter taraması | Core, aktif HTML, test ve builder dosyalarında bozuk karakter yok |
| HTML callback kontrolü | Aktif HTML dosyalarında `google.script.run` var |
| Menü bağlantı kontrolü | Menü fonksiyonları bağlı; ayrı `Toplu sipariş paneli` yok |
| Sheet kolon uyumu | `Fatura_Eposta` dahil güncel header yazıldı |
| Veri sözlüğü kapsamı | `242` kolon satırı, boş satır `0`, `01_AYARLAR` kolonları `6` |
| Mock test | `V6_4_4_ULTRA_OPERASYON_MOCK_OK` |
| Canlı POST kilidi | `salesPostCalls = 0` |

Mock test çıktısı:

```json
{
  "result": "V6_4_4_ULTRA_OPERASYON_MOCK_OK",
  "itemRows": 83,
  "paymentRows": 80,
  "invoiceGroups": 80,
  "cargoRows": 78,
  "bankScore": 100,
  "ultraSaveElapsedMs": 9,
  "bulk10ElapsedMs": 65,
  "bulk50ElapsedMs": 361,
  "tokenRefreshCalls": 2,
  "salesPostCalls": 0,
  "menuItems": 24
}
```

## Gerçek UI Test Durumu

Gerçek Google Sheets UI testi bu oturumda tamamlandı denmedi. Sebep:

- Codex içi browser otomasyonu bu ortamda başlatılamadı.
- `clasp run` bu proje için API executable/izin nedeniyle güvenilir gerçek UI kanıtı sayılmadı.
- Bu nedenle mock ve remote upload kanıtı var, ancak gerçek operatör UI kabul kanıtı kullanıcı tarafından Sheet üzerinden alınmalı.

## Manuel Kabul İçin Zorunlu UI Testi

`TESBIH_KUYUSU_MASTER_SHEET` üzerinde:

1. Sayfayı yenile.
2. `TESBİH KUYUSU PANEL > Ultra sipariş paneli` aç.
3. Tek sipariş kaydet ve `02/04/05/06/07/08/09/12` readback kontrolü yap.
4. `Yeni sipariş ekle` ile aynı panelde 3 sipariş kaydet.
5. Aynı panelden 10 sipariş kaydet.
6. İki ödeme yapan kişi senaryosunda iki fatura grubu oluştuğunu kontrol et.
7. `Cari seç / ara` ve `Cari oluştur` butonlarının panel içinde sonuç verdiğini kontrol et.
8. `PARASUT_CANLI_GONDERIM`, `EBELGE_CANLI_GONDERIM`, `NAVLUNGO_CANLI_GONDERIM` kapalıyken POST yapılmadığını doğrula.

## Karar

V6.4.4 kod ve Sheet düzeltmesi yapılmış üretim adayıdır. Gerçek UI üzerinden minimum 10 sipariş kaydı kanıtlanmadan “canlı kabul tamamlandı” denmez. Bu nedenle GitHub PR draft kalmalıdır.

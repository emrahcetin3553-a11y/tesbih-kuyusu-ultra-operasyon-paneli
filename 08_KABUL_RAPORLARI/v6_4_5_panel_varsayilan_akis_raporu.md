# V6.4.5 Panel Varsayılan Akış Düzeltme Raporu

Tarih: 2026-05-02  
Sürüm: Tesbih Kuyusu V6.4.5 Ultra Operasyon Paneli  
Ana Apps Script proje ID: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

## Amaç

V6.4.4 panelinde görülen operasyon hatası düzeltildi: `Sipariş_Sahibi` yazılırken `Kargo_Alıcısı` ilk harfte `B` olarak kilitleniyordu ve `Ödeme_Yapan`/`Fatura_Kişisi` otomatik oluşmuyordu.

## Düzeltilen Noktalar

| Sorun | Düzeltme |
|---|---|
| Otomatik Kargo_Alıcısı ilk harfte kalıyordu | Otomatik alanlar `dataset.auto = 1` ile takip ediliyor; operatör elle dokunmadıysa tam ad yazıldıkça güncelleniyor |
| Sipariş_Sahibi ödeme alanına akmıyordu | `syncPaymentDefaults` artık tam ad-soyad hazır olduğunda `Ödeme_Yapan` alanını otomatik dolduruyor |
| Ürün satırında ödeme/fatura kişisi `Ödeme bekliyor` kalıyordu | Ödeme_Yapan otomatik dolduktan sonra ürün ödeme dropdown'ı güncelleniyor |
| Birleşik adlar kayıt riskine sahipti | Panel tarafında yaygın birleşik adlar ayrıştırılıyor: `mehmetnuriçetin`, `nimeçetin`, `bedihaçetin`, `yaşarçetin`, `emrahçetin` |
| Telefon yazımında ara format riski | Telefon hâlâ sadece blur/kayıt öncesi `+905xxxxxxxxx` formatına kapanıyor |

## Apps Script Yükleme Kanıtı

Canlı Apps Script projesine yüklenen aktif dosyalar:

- `appsscript.json`
- `tesbih_kuyusu_v6_4_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

Remote aktif projede ayrı `topluSiparisPaneli.html` yoktur.

Core SHA256:

- Lokal: `C541172643B168B3C7D1BD81550768833C126C1C7FE1918C21E822D95546D16F`
- Remote pullback: `C541172643B168B3C7D1BD81550768833C126C1C7FE1918C21E822D95546D16F`

Sheet SHA256:

- `DBC7013D26593B0CAECE3EA3FD588B00C0A4D13FC6DF43360C04FCA37A86C651`

## Çalıştırılan Kontroller

| Kontrol | Sonuç |
|---|---|
| Core syntax | `CORE_SYNTAX_OK` |
| Duplicate function | `DUPLICATES_NONE` |
| Aktif core/HTML yasak kelime taraması | Bulgu yok |
| Türkçe karakter taraması | Temiz |
| Sheet `Fatura_Eposta` header | Var |
| Veri sözlüğü | 242 kolon satırı, boş satır 0, `01_AYARLAR` 6 kolon |
| Mock test | `V6_4_5_ULTRA_OPERASYON_MOCK_OK` |
| Canlı POST | `salesPostCalls = 0` |

Mock ölçüm:

```json
{
  "result": "V6_4_5_ULTRA_OPERASYON_MOCK_OK",
  "ultraSaveElapsedMs": 6,
  "bulk10ElapsedMs": 42,
  "bulk50ElapsedMs": 279,
  "salesPostCalls": 0
}
```

## Gerçek UI Test Durumu

Bu oturumda gerçek UI testi tamamlandı denmedi. Kullanıcının `TESBIH_KUYUSU_MASTER_SHEET` üzerinde aşağıdaki manuel doğrulamayı yapması gerekir:

1. Ultra paneli aç.
2. `WhatsApp_Tel` yaz.
3. `Sipariş_Sahibi` alanına `Bediha Çetin` yaz.
4. `Kargo_Alıcısı` alanının `B`, `Be` gibi kilitlenmeden `Bediha Çetin` olduğunu kontrol et.
5. `Ödeme_Yapan` alanının otomatik `Bediha Çetin` olduğunu kontrol et.
6. Ürün satırındaki ödeme/fatura kişisi dropdown'ının `Bediha Çetin` olduğunu kontrol et.
7. `Kaydet ve ERP güncelle` çalıştır.
8. `02/04/05/06/07/08/12` readback kontrolü yap.

## Karar

V6.4.5, panelde görülen ilk harf kilitlenmesi ve ödeme/fatura varsayılan akış hatasını düzeltir. Ancak gerçek UI üzerinden tek sipariş, 3 sipariş ve 10 sipariş kanıtı alınmadan “canlı kabul tamamlandı” denmez.

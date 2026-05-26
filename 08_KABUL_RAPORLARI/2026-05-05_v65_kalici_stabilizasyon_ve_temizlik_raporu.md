# 2026-05-05 V6.5 Kalici Stabilizasyon ve Temizlik Raporu

## 1. Gorev Kaynagi

- Kaynak: PR #6 son yorum
- Yorum ID: `issuecomment-4379311783`
- Gorev basligi: `BIRLESIK ANA GOREV - V6.5 GERCEK OPERASYON PANELI KALICI STABILIZASYON VE TEMIZLIK`
- Aktif branch: `v6-5-production-candidate`
- Baslangic commit: `712606bed0dd7bc48ad010ecea8c51b2190c1ca5`

## 2. Incelenen Dosyalar

- `README.md`
- `CHANGELOG.md`
- `PROJE_DURUM_RAPORU.md`
- `CANLIYA_GECIS.md`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-05_guncel_proje_derin_durum_analiz_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_panel_menu_kisayol_guvenli_duzeltme_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_execution_api_final_readback_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_apps_script_execution_api_izin_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_panel_menu_kisayol_guvenilirlik_analiz_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`
- Canli Sheet `01_AYARLAR`, `07_PARASUT_FATURA`, `08_KARGO_PAKETLERI`, `13_VERI_SOZLUGU`

## 3. Degistirilen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `README.md`
- `CHANGELOG.md`
- `PROJE_DURUM_RAPORU.md`
- `CANLIYA_GECIS.md`
- `08_KABUL_RAPORLARI/2026-05-05_v65_kalici_stabilizasyon_ve_temizlik_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 4. Canli Sheet Degisiklikleri

| Sayfa | Hucre/Satir | Once | Sonra | Neden |
| --- | --- | --- | --- | --- |
| `01_AYARLAR` | `B23` / `NAVLUNGO_DEFAULT_BARCODE_TYPE` | `3` | `pdf` | Navlungo barkod endpoint'i `3` degerini reddediyordu; PR yorumu guvenli tek ayar duzeltmesini istedi. |
| `13_VERI_SOZLUGU` | `270:276` | Eksikti | 7 yeni 08 kargo/barkod satiri eklendi | Canli 08 kolonlari veri sozlugunde tam kapsansin. |

Eklenen `13_VERI_SOZLUGU` kolonlari:

- `Kargo_Bekletilsin_Mi`
- `Kargo_Bekletme_Nedeni`
- `Kargo_Cikis_Tarihi`
- `Barkod_Yazdirildi_Mi`
- `Barkod_Yazdirma_Tarihi`
- `Barkod_Yazdirma_Sonucu`
- `Barkod_Yazdirma_Hata`

Readback: `13_VERI_SOZLUGU!A270:F276` eklendikten sonra dolu okundu.

## 5. Kod Duzeltmeleri

### 5.1 `08_KARGO_PAKETLERI` baslik sozlesmesi

Canli 08 baslik sirasi:

`Kargo_Paket_ID`, `Açık_Sipariş_ID`, `Kargo_Alıcısı`, `Kargo_Tel`, `İl`, `İlçe`, `Adres`, `Kargo_Firması`, `Paket_Durumu`, `Barkod`, `Takip_No`, `Geç_Ekleme_Var_Mı`, `Paket_Notu`, `Navlungo_Post_Number`, `Navlungo_Reference_ID`, `Navlungo_Tracking_URL`, `Navlungo_Barcode_URL`, `Navlungo_Carrier_ID`, `Navlungo_Carrier_Name`, `Navlungo_Status`, `Navlungo_Last_Response`, `Navlungo_Last_Error`, `Navlungo_Created_At`, `Navlungo_Cancelled_At`, `Navlungo_Test_Mu`, `Navlungo_Payload_Hash`, `Kontrol_Uyarısı`, `Kargo_Bekletilsin_Mi`, `Kargo_Bekletme_Nedeni`, `Kargo_Cikis_Tarihi`, `Barkod_Yazdirildi_Mi`, `Barkod_Yazdirma_Tarihi`, `Barkod_Yazdirma_Sonucu`, `Barkod_Yazdirma_Hata`

Kodda `HEADERS.cargo` ayni siraya cekildi. Sheet kolonlari tasinmadi, veri silinmedi.

### 5.2 API response saklama riski

Canli readback bulgusu:

- `07_PARASUT_FATURA.Response_JSON` Parasut yanitinin uzun kismini tutuyor.
- `08_KARGO_PAKETLERI.Navlungo_Last_Response` eski kayitlarda `barcode_pdf` taban64 verisi ve alici/gonderici operasyon bilgisi icerebiliyor.

Bu turda eski canli hucreler toplu temizlenmedi. Bundan sonraki kayitlar icin `sanitizeApiText_()` su alanlari maskeleyecek sekilde guclendirildi:

- `password`
- `barcode_pdf`
- `phone`
- `email`
- `address`
- `access_token`, `refresh_token`, `client_secret`, `Bearer` zaten maskeleniyordu.

Onerilen sonraki adim: Eski response hucreleri icin kullanici onayli ayri temizlik isi acilmali; sadece `id`, `status`, `post_number`, `tracking_url`, `barcode_url`, `hash`, `message` gibi operasyon ozeti saklanmali.

## 6. Apps Script Yukleme Durumu

- Yuklenen proje: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`
- `clasp push --force`: `Script is already up to date` sonucu alindi; onceki push ile canli proje ayni 7 dosyayi tasiyor.
- `clasp pull --force`: 7 dosya tekrar cekildi.
- Lokal core SHA256: `02ED97D68B89242A5F972964B005B34D11743E558F1562188426A09BEF6CE6CA`
- Canli pull core SHA256: `02ED97D68B89242A5F972964B005B34D11743E558F1562188426A09BEF6CE6CA`
- Eslesme: Evet

Canli Apps Script'e yuklenen/cekilen dosyalar:

- `appsscript.json`
- `cariSecDialog.html`
- `kargoBilgisiDialog.html`
- `odemeEkleDialog.html`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `urunEkleDialog.html`

## 7. Test Sonuclari

| Test | Sonuc | Kanit |
| --- | --- | --- |
| Core syntax | Gecti | `SYNTAX_OK` |
| Duplicate public function | Gecti | `functionCount: 110`, `duplicates: []` |
| Yasak kelime taramasi | Gecti | Aktif core ve HTML dosyalarinda hit yok |
| V6.5 Node test seti | Gecti | `ok: true`, `salesPostCalls: 1`, `navlungoPostCalls: 6` |
| 08 kolon sozlesmesi testi | Gecti | Node testte `HEADERS.cargo` canli 08 sirasi ile birebir karsilastirildi |
| 13 veri sozlugu kapsam testi | Gecti | Canli readback `A270:F276` 7 yeni satiri dogruladi |
| Apps Script SHA readback | Gecti | Lokal/canli pull SHA ayni |

Not: Node test setindeki Parasut/Navlungo sayaclari yerel test harness icindeki kontrollu simule cagri sayaclaridir. Bu turda canli Parasut/Navlungo/e-belge POST fonksiyonu calistirilmadi.

## 8. Eski V6.4.x Dosya Siniflandirmasi

`03_APPS_SCRIPT_KOD` altindaki `tesbih_kuyusu_v6_4_*` dosyalari aktif Apps Script kaynagi degildir. Silinmedi ve tasinmadi; referans/arsiv niteliginde korunuyor. Aktif canli core V6.5 dosyasidir.

## 9. Canli UI Kabul Test Plani

Bu turda gercek UI siparis kabul testi calistirilmadi. Gerekli plan:

1. 02, 03, 04, 06 ve 08 satirindan `Seçili siparişi düzenle` ile panel dolu acilma testi.
2. Mevcut siparisi kaydetme: yeni `Açık_Sipariş_ID` ve yeni `Kargo_Paket_ID` olusmamali.
3. `Sadece fatura oluştur`: fatura tekrar gonderim kilidine takilmali.
4. `Sadece kargo hazırla`: Navlungo post/barkod 08'e yazilmali.
5. `Fatura ve kargo oluştur`: secili, temiz ve onayli kayitta tek akista sonuc vermeli.
6. QZ Tray acik/kapanik senaryolari: kargo islemi basarili kalmali, yazdirma sonucu ayri yazilmali.

## 10. Kalan Riskler

- Canli Sheet'te Parasut/Navlungo canli kapilari acik gorunuyor; otomatik test veya rastgele fonksiyon calistirma ciddi yan etki dogurabilir.
- Eski `Response_JSON` ve `Navlungo_Last_Response` hucrelerinde uzun veya hassas operasyon yaniti bulunabilir; bu turda temizlenmedi.
- Gercek UI kabul testi bu turda calistirilmadi.
- `main` branch aktif canli adayi temsil etmiyor; PR #6 merge edilmeden ana dal geride kalir.

## 11. Sonuc

PR #6 son yorumundaki kalici stabilizasyon ve temizlik maddeleri dar kapsamda uygulandi:

- Canli barcode type ayari duzeltildi.
- 13 veri sozlugu eksikleri tamamlandi.
- 08 kod baslik sozlesmesi canli sira ile hizalandi.
- API response saklama riski ileriye donuk maskeleme ile azaltildi.
- Dokumanlar V6.5 / PR #6 gercek durumuna guncellendi.
- Testler ve Apps Script SHA readback kaniti alindi.

Codex sohbet ciktisi / calisma ozeti su dosyaya islendi: `08_KABUL_RAPORLARI/2026-05-05_v65_kalici_stabilizasyon_ve_temizlik_raporu.md`

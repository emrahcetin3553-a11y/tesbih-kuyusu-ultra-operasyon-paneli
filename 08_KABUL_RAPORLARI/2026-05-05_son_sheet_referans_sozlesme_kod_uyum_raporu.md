# 2026-05-05 Son Sheet Referans Sozlesme Kod Uyum Raporu

## 1. Gorev

PR #6 son yorumundaki **Son Ana Sheet Referans Sozlesmesi** gorevi uygulandi. Kullanici tarafindan yuklenen son ana Sheet dosyasi read-only incelendi:

- Kaynak dosya: `C:/Users/emrah/Downloads/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`
- Repo kopyasi: `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`
- SHA256: `AFFAE09720FBAB569FF448E5FC1CC117CB5F0D01D9762D5CBA3DDCE831EC4D71`
- Boyut: `233362` byte

Sheet uzerinde veri silme, kolon ekleme/silme, veri duzeltme veya sahte veri olusturma yapilmadi. Dosya yalniz read-only analiz edildi ve GitHub'a ayni SHA ile eklendi.

## 2. Incelenen Dosyalar

- `C:/Users/emrah/Downloads/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.py`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 3. Sheet Read-Only Analiz Sonucu

Zorunlu sayfalarin tamami mevcut:

- `01_AYARLAR`
- `03_ACIK_SIPARISLER`
- `04_URUN_KALEMLERI`
- `05_ODEMELER`
- `06_FATURA_GRUPLARI`
- `07_PARASUT_FATURA`
- `08_KARGO_PAKETLERI`
- `10_808_FINANS_ONIZLEME`
- `11_EBELGE_ISTISNA`
- `12_KONTROL_MERKEZI`
- `13_VERI_SOZLUGU`
- `14_BANKA_HAREKETLERI`
- `15_MUSTERI_ADRESLERI`

Satir sayilari:

| Sayfa | Veri satiri |
| --- | ---: |
| `01_AYARLAR` | 28 |
| `03_ACIK_SIPARISLER` | 8 |
| `04_URUN_KALEMLERI` | 17 |
| `05_ODEMELER` | 8 |
| `06_FATURA_GRUPLARI` | 8 |
| `07_PARASUT_FATURA` | 17 |
| `08_KARGO_PAKETLERI` | 8 |
| `10_808_FINANS_ONIZLEME` | 8 |
| `11_EBELGE_ISTISNA` | 8 |
| `12_KONTROL_MERKEZI` | 1 |
| `13_VERI_SOZLUGU` | 278 |
| `14_BANKA_HAREKETLERI` | 0 |
| `15_MUSTERI_ADRESLERI` | 8 |

## 4. Bulunan Uyumsuzluk ve Duzeltme

Tek kod/Sheet sozlesme uyumsuzlugu `07_PARASUT_FATURA` kolon sirasindaydi. Kolonlar ayniydi, fakat kod `HEADERS.parasut` sirasi referans Sheet ile birebir ayni degildi.

Duzeltme:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs` icindeki `HEADERS.parasut` sirasi referans Sheet'e uyarlandi.
- Sheet'e dokunulmadi.
- Veri kaydirma riski olusturulmadi.
- `writeObjects_` kolon adina gore yazdigi icin mevcut veri korundu.

Yeni `07_PARASUT_FATURA` son kolon sirasi:

1. `Hata_Mesajı`
2. `Taslak_Gönderime_Uygun_Mu`
3. `Taslak_Blokaj_Nedeni`
4. `Operatör_Notu`
5. `Payload_JSON`
6. `Response_JSON`
7. `Gönderim_Tarihi`

## 5. ID Baglanti Kontrolu

`03_ACIK_SIPARISLER` icinde 8 benzersiz `Açık_Sipariş_ID` bulundu. Bagli sayfalarda 03 icinde bulunmayan ID yoktur.

| Sayfa | ID sayisi | Benzersiz ID | 03 icinde eksik |
| --- | ---: | ---: | ---: |
| `04_URUN_KALEMLERI` | 17 | 8 | 0 |
| `05_ODEMELER` | 8 | 8 | 0 |
| `06_FATURA_GRUPLARI` | 8 | 8 | 0 |
| `07_PARASUT_FATURA` | 17 | 8 | 0 |
| `08_KARGO_PAKETLERI` | 8 | 8 | 0 |
| `10_808_FINANS_ONIZLEME` | 8 | 8 | 0 |
| `11_EBELGE_ISTISNA` | 8 | 8 | 0 |

`12_KONTROL_MERKEZI` icinde bu referans dosyada `Açık_Sipariş_ID` bagli aktif blokaj satiri bulunmuyor.

## 6. Statu Sozlesme Kontrolu

| Sayfa | Alan | Sonuc |
| --- | --- | --- |
| `03_ACIK_SIPARISLER` | `Sipariş_Durumu` | `Açık`: 8 |
| `03_ACIK_SIPARISLER` | `Kargo_Durumu` | `Barkod Alındı`: 8 |
| `03_ACIK_SIPARISLER` | `Fatura_Durumu` | `Gönderildi`: 8 |
| `03_ACIK_SIPARISLER` | `E_Belge_Durumu` | `Gönderime Hazır`: 8 |
| `03_ACIK_SIPARISLER` | `Kontrol_Seviyesi` | `Hazır`: 8 |
| `05_ODEMELER` | `Teyit_Durumu` | `Bekliyor`: 8 |
| `06_FATURA_GRUPLARI` | `Fatura_Durumu` | `Gönderildi`: 8 |
| `06_FATURA_GRUPLARI` | `Gönderim_Kilidi` | `Evet`: 8 |
| `07_PARASUT_FATURA` | `Paraşüt_Durumu` | `Gönderildi`: 17 |
| `07_PARASUT_FATURA` | `Gönderim_Kilidi` | `Evet`: 17 |
| `08_KARGO_PAKETLERI` | `Paket_Durumu` | `Barkod Hazır`: 8 |
| `08_KARGO_PAKETLERI` | `Navlungo_Status` | `Barkod Hazır`: 8 |
| `08_KARGO_PAKETLERI` | `Barkod_Yazdirildi_Mi` | `Evet`: 5, bos: 3 |
| `08_KARGO_PAKETLERI` | `Kargo_Bekletilsin_Mi` | `Hayır`: 8 |
| `11_EBELGE_ISTISNA` | `E_Belge_Tipi` | `e-Arşiv`: 8 |
| `11_EBELGE_ISTISNA` | `İstisna_Gerekli_Mi` | `Hayır`: 8 |

`05_ODEMELER.Teyit_Durumu` alaninin tamamı `Bekliyor`; kod tarafinda odeme teyidinin operator finans karari olmasi kurali korunmustur. `14_BANKA_HAREKETLERI` bos kalmistir; banka hareketi importu ayri modul olarak korunmustur.

## 7. Finans ve Veri Sozlugu Kontrolu

- `10_808_FINANS_ONIZLEME`: 8 satir incelendi; `Fark` icin sifir olmayan veya parse edilemeyen deger yok.
- `13_VERI_SOZLUGU`: 278 satir; zorunlu incelenen tum gercek sayfa/kolonlar kapsaniyor.
- `07_PARASUT_FATURA`: `Payload_JSON`, `Response_JSON`, `Gönderim_Tarihi` kolonlari mevcut.
- `08_KARGO_PAKETLERI`: Navlungo ve barkod yazdirma kolonlari mevcut.

## 8. Hassas Veri ve Response Kontrolu

Workbook icinde basit hassas kelime taramasinda 2 hit goruldu:

- `01_AYARLAR!B22`: Navlungo panel login URL degeri.
- `01_AYARLAR!F22`: `API token endpoint değildir` aciklamasi.

Bunlar API secret/token/refresh token degeri degildir. Eski ham response hucreleri temizlenmedi. Ileriye donuk maskeleme kodu daha once `sanitizeApiText_()` tarafinda guclendirilmisti; bu turda ek response temizligi yapilmadi.

## 9. Apps Script Yukleme ve SHA Kaniti

Kod degistigi icin ana Apps Script projesine yalniz 7 aktif dosya yuklendi:

- `appsscript.json`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `ultraSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

`clasp push --force` ve ardindan `clasp pull --force` calistirildi.

| Alan | Deger |
| --- | --- |
| Apps Script proje ID | `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77` |
| Local core SHA256 | `3FAF15A4EB51ECC82FBD262F4D6EAAFDBAEC472E50CF099634DA587043FB4642` |
| Remote pull core SHA256 | `3FAF15A4EB51ECC82FBD262F4D6EAAFDBAEC472E50CF099634DA587043FB4642` |
| Eslesme | `Evet` |

## 10. Test Sonuclari

| Test | Sonuc |
| --- | --- |
| Core syntax | `SYNTAX_OK` |
| Duplicate public function | `ok: true`, `functionCount: 110`, duplicate yok |
| Yasak ifade taramasi | Aktif core/HTML dosyalarinda hit yok |
| V6.5 Node test seti | `ok: true` |
| Sheet referans kolon sozlesme testi | `ok: true` |
| Status sozlesme testi | `ok: true` |
| `10_808` fark testi | `bad_fark_count: 0` |
| `13_VERI_SOZLUGU` kapsam testi | `missing_count: 0` |

V6.5 Node test setinde `salesPostCalls` ve `navlungoPostCalls` mock harness icinde sayac olarak gorunur; bu test local harness calismasidir, canli POST degildir.

## 11. GitHub'a Islenen Dosyalar

- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.py`
- `08_KABUL_RAPORLARI/2026-05-05_son_sheet_referans_sozlesme_kod_uyum_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 12. Canli POST Durumu

Bu turda canli Paraşüt, Navlungo veya e-belge POST calistirilmadi. Yapilan canli Apps Script islemi yalniz kod dosyalarinin projeye yuklenmesi ve pull-back SHA readback kontroludur.

## 13. Kalan Riskler

- Gercek Google Sheets UI uzerinden panel tiklama testi bu turda yapilmadi.
- Referans Sheet dosyasi read-only incelendi; canli Sheet hucreleri bu turda degistirilmedi.
- Eski response hucreleri toplu temizlenmedi; yalniz ileriye donuk maskeleme davranisi korunuyor.
- `12_KONTROL_MERKEZI` bu referans dosyada acik ID bagli blokaj icermedigi icin statu uyumu readback'i bos kontrol merkezi uzerinden raporlandi.

Codex sohbet ciktisi / calisma ozeti su dosyaya islendi: `08_KABUL_RAPORLARI/2026-05-05_son_sheet_referans_sozlesme_kod_uyum_raporu.md`

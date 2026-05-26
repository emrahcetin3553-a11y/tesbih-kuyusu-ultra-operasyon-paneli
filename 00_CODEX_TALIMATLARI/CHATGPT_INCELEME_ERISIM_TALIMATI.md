# ChatGPT Inceleme Erisim Talimati

Bu dosya, ChatGPT'nin GitHub connector veya raw GitHub linkleri uzerinden Tesbih Kuyusu Ultra Operasyon Paneli projesini eksiksiz inceleyebilmesi icin hazirlandi.

## Repo ve Aktif Branch

- Repo: `emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli`
- GitHub repo URL: `https://github.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli`
- Aktif calisma branch'i: `v6-5-production-candidate`
- Bu branch icin raw base URL: `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/`
- PR: `https://github.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/pull/6`
- Onemli not: `main` branch canli V6.5 durumu temsil etmiyor. Inceleme icin once `v6-5-production-candidate` branch'i kullanilmalidir.

## Aktif Uretim Dosyalari

Aktif Apps Script ve panel dosyalari bunlardir:

- `appsscript.json`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`

Eski V6.4.x core dosyalari referans dosyalaridir. Aktif Apps Script canli proje karsiligi V6.5 core dosyasidir.

## Apps Script Canli Proje Eslesmesi

- Canli Apps Script proje ID: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`
- Canli pull klasoru: `C:\Users\emrah\Desktop\clasp_v65_main_upload`
- Kontrol yontemi: `clasp pull --force` sonrasi SHA256 karsilastirmasi.

| Canli Apps Script dosyasi | GitHub dosyasi | Canli SHA256 | GitHub SHA256 | Eslesme |
| --- | --- | --- | --- | --- |
| `appsscript.json` | `appsscript.json` | `B0453FE3708A14B7FABC22915CEC12DFA276B258DE19BF4E152B3D3EEE15BD3B` | `B0453FE3708A14B7FABC22915CEC12DFA276B258DE19BF4E152B3D3EEE15BD3B` | Evet |
| `tesbih_kuyusu_v6_5_ultra_operasyon_core.js` | `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs` | `671EA0DB390747AEF2F72E8F784C522343C2CAE1D8C1E0CBC7529A63817136FB` | `671EA0DB390747AEF2F72E8F784C522343C2CAE1D8C1E0CBC7529A63817136FB` | Evet |
| `ultraSiparisPaneli.html` | `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html` | `7E8BB96D0A6B95ED0B05E43F2D9669278E0CE08C93F2570C56A9A30CBA2B583E` | `7E8BB96D0A6B95ED0B05E43F2D9669278E0CE08C93F2570C56A9A30CBA2B583E` | Evet |
| `cariSecDialog.html` | `03_APPS_SCRIPT_KOD/cariSecDialog.html` | `3315B7551E3440846ABAA25929B7AB7B921E3CFD9F57D8CFE8AAAD04C778D0D3` | `3315B7551E3440846ABAA25929B7AB7B921E3CFD9F57D8CFE8AAAD04C778D0D3` | Evet |
| `urunEkleDialog.html` | `03_APPS_SCRIPT_KOD/urunEkleDialog.html` | `CF3AC682F8C32EC29ADE27FFBFC8431AEBCDFC92F265C7BC4B79D6224695A3DA` | `CF3AC682F8C32EC29ADE27FFBFC8431AEBCDFC92F265C7BC4B79D6224695A3DA` | Evet |
| `odemeEkleDialog.html` | `03_APPS_SCRIPT_KOD/odemeEkleDialog.html` | `8C268C033E232EDFC2329567F3229A2B00B4DB9F5E1C2E03BB0B4502E79B51A7` | `8C268C033E232EDFC2329567F3229A2B00B4DB9F5E1C2E03BB0B4502E79B51A7` | Evet |
| `kargoBilgisiDialog.html` | `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html` | `A40A6F96992D14D18BA1539DAC1FD9B50F999FE0321D911E6EB06A23678E2693` | `A40A6F96992D14D18BA1539DAC1FD9B50F999FE0321D911E6EB06A23678E2693` | Evet |

## Guncel Sheet Dosyasi

Guncel ana Sheet snapshot dosyasi:

- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (17).xlsx`
- Raw link: `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET%20(17).xlsx`
- Kaynak dosya SHA256 raporda yazildi: `0779B06CCB0CFF31DE64FADE036879791F2EE226E42FF7B04811821B32BE145B`

## Inceleme Sirasi

ChatGPT veya GitHub connector ile inceleme yaparken sirayla su dosyalar okunmalidir:

1. `README.md`
2. `PROJE_DURUM_RAPORU.md`
3. `CANLIYA_GECIS.md`
4. `CHANGELOG.md`
5. `01_PROMPTLAR/PROMPT_1_TEMEL_IS_MANTIGI.md`
6. `01_PROMPTLAR/PROMPT_2_OPERASYON_ACIK_SIPARIS.md`
7. `01_PROMPTLAR/PROMPT_3_TEKNIK_MIMARI.md`
8. `01_PROMPTLAR/PROMPT_4_PARASUT_API.md`
9. `01_PROMPTLAR/PROMPT_5_STABILIZASYON.md`
10. `01_PROMPTLAR/PROMPT_6_URETIME_HAZIRLIK.md`
11. `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
12. `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
13. Diger aktif HTML dialog dosyalari
14. `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (17).xlsx`
15. `05_NAVLUNGO/`
16. `04_PARASUT/`
17. `07_TEST_DOSYALARI/`
18. `08_KABUL_RAPORLARI/`

## Klasor Amaclari

- `00_CODEX_TALIMATLARI`: ChatGPT/Codex inceleme ve erisim talimatlari.
- `01_PROMPTLAR`: Projenin ana is mantigi ve kabul kararlarini tasiyan promptlar.
- `02_SHEET_SISTEM`: Sheet snapshot ve uretilen workbook dosyalari.
- `03_APPS_SCRIPT_KOD`: Apps Script core ve HTML panel/dialog dosyalari.
- `04_PARASUT`: Paraşüt ayar, payload ve test notlari.
- `05_NAVLUNGO`: Navlungo hazirlik ve payload notlari.
- `06_BANKA_REHBER_WHATSAPP`: Banka, rehber, WhatsApp ham veri ve musteri kimlik motoru notlari.
- `07_TEST_DOSYALARI`: Sheet builder ve test dosyalari.
- `08_KABUL_RAPORLARI`: Kabul, kontrol, gercek test ve Codex calisma raporlari.
- `09_EKRAN_GORUNTULERI`: Ekran goruntuleri icin ayrilmis alan.
- `10_ARCHIVE`: Sadece gerekli referans arsivi.

## Rapor Dosyalari

- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_1_canliya_gecis_karar_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_1_kod_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_1_panel_gercek_test_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_1_parasut_get_test_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_1_performans_gercek_test_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_1_sheet_gercek_kabul_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_1_toplu_siparis_gercek_test_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_canliya_gecis_karar_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_kod_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_navlungo_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_panel_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_parasut_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_performans_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_sheet_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_2_test_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_3_gercek_panel_duzeltme_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_4_gercek_panel_duzeltme_raporu.md`
- `08_KABUL_RAPORLARI/v6_4_5_panel_varsayilan_akis_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_canliya_gecis_karar_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_kod_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_navlungo_appsscript_baglanti_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_navlungo_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_panel_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_panel_operasyon_aksiyon_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_sheet_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_test_raporu.md`

## Tum Guncel Dosya Yollari ve Raw Linkleri

- `.gitignore` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/.gitignore`
- `00_CODEX_TALIMATLARI/CHATGPT_INCELEME_ERISIM_TALIMATI.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/00_CODEX_TALIMATLARI/CHATGPT_INCELEME_ERISIM_TALIMATI.md`
- `01_PROMPTLAR/PROMPT_1_TEMEL_IS_MANTIGI.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/01_PROMPTLAR/PROMPT_1_TEMEL_IS_MANTIGI.md`
- `01_PROMPTLAR/PROMPT_2_OPERASYON_ACIK_SIPARIS.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/01_PROMPTLAR/PROMPT_2_OPERASYON_ACIK_SIPARIS.md`
- `01_PROMPTLAR/PROMPT_3_TEKNIK_MIMARI.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/01_PROMPTLAR/PROMPT_3_TEKNIK_MIMARI.md`
- `01_PROMPTLAR/PROMPT_4_PARASUT_API.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/01_PROMPTLAR/PROMPT_4_PARASUT_API.md`
- `01_PROMPTLAR/PROMPT_5_STABILIZASYON.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/01_PROMPTLAR/PROMPT_5_STABILIZASYON.md`
- `01_PROMPTLAR/PROMPT_6_URETIME_HAZIRLIK.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/01_PROMPTLAR/PROMPT_6_URETIME_HAZIRLIK.md`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (17).xlsx` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET%20(17).xlsx`
- `02_SHEET_SISTEM/Tesbih_Kuyusu_V6_5_Ultra_Operasyon_Sheet.xlsx` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/02_SHEET_SISTEM/Tesbih_Kuyusu_V6_5_Ultra_Operasyon_Sheet.xlsx`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `04_PARASUT/parasut_ayar_notlari.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/04_PARASUT/parasut_ayar_notlari.md`
- `04_PARASUT/parasut_canli_test_notlari.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/04_PARASUT/parasut_canli_test_notlari.md`
- `04_PARASUT/parasut_contact_id_map.json.example` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/04_PARASUT/parasut_contact_id_map.json.example`
- `04_PARASUT/parasut_payload_ornekleri.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/04_PARASUT/parasut_payload_ornekleri.md`
- `04_PARASUT/parasut_product_id_map.json.example` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/04_PARASUT/parasut_product_id_map.json.example`
- `05_NAVLUNGO/navlungo_hazirlik_notlari.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/05_NAVLUNGO/navlungo_hazirlik_notlari.md`
- `05_NAVLUNGO/navlungo_payload_ornekleri.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/05_NAVLUNGO/navlungo_payload_ornekleri.md`
- `06_BANKA_REHBER_WHATSAPP/banka_hareketleri_modul_notlari.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/06_BANKA_REHBER_WHATSAPP/banka_hareketleri_modul_notlari.md`
- `06_BANKA_REHBER_WHATSAPP/musteri_kimlik_motoru_notlari.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/06_BANKA_REHBER_WHATSAPP/musteri_kimlik_motoru_notlari.md`
- `06_BANKA_REHBER_WHATSAPP/rehber_modul_notlari.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/06_BANKA_REHBER_WHATSAPP/rehber_modul_notlari.md`
- `06_BANKA_REHBER_WHATSAPP/whatsapp_ham_veri_modul_notlari.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/06_BANKA_REHBER_WHATSAPP/whatsapp_ham_veri_modul_notlari.md`
- `07_TEST_DOSYALARI/build_v6_5_sheet.mjs` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/07_TEST_DOSYALARI/build_v6_5_sheet.mjs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_canliya_gecis_karar_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_canliya_gecis_karar_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_kod_kontrol_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_kod_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_navlungo_appsscript_baglanti_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_navlungo_appsscript_baglanti_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_navlungo_kontrol_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_navlungo_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_panel_kontrol_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_panel_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_panel_operasyon_aksiyon_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_panel_operasyon_aksiyon_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_sheet_kontrol_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_sheet_kontrol_raporu.md`
- `08_KABUL_RAPORLARI/v6_5_test_raporu.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/08_KABUL_RAPORLARI/v6_5_test_raporu.md`
- `09_EKRAN_GORUNTULERI/README.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/09_EKRAN_GORUNTULERI/README.md`
- `10_ARCHIVE/README.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/10_ARCHIVE/README.md`
- `CANLIYA_GECIS.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/CANLIYA_GECIS.md`
- `CHANGELOG.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/CHANGELOG.md`
- `PROJE_DURUM_RAPORU.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/PROJE_DURUM_RAPORU.md`
- `README.md` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/README.md`
- `appsscript.json` - `https://raw.githubusercontent.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/v6-5-production-candidate/appsscript.json`

## Eksiksiz Dosya Kontrol Notu

Bu dosyada aktif V6.5 inceleme icin gerekli dosyalar ve tum oncelikli raw linkler yazilmistir. Repo icindeki eski V6.4.x dosyalari da GitHub'da bulunur, ancak aktif calisma icin oncelik V6.5 core, aktif HTML dosyalari, guncel Sheet snapshot ve V6.5 raporlaridir.

## Gizli Bilgi Kurali

Bu repo icinde gercek token, access token, refresh token, client secret, API key veya parola tutulmamalidir. Bu degerler sadece Apps Script Script Properties veya kullanicinin guvenli ortaminda bulunmalidir.

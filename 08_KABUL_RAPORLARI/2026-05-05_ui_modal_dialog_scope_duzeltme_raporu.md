# 2026-05-05 UI Modal Dialog Scope Duzeltme Raporu

## 1. PR #6 Son Yorum

- Yorum ID: `4380452277`
- Gorev: Sheet UI'da `Ui.showModalDialog` icin gorulen `script.container.ui` izin hatasini manifest scope duzeltmesiyle gidermek.
- Kural: Canli Sheet verisi degistirilmedi. Parasut/Navlungo/e-belge POST calistirilmadi.

## 2. Incelenen Dosyalar

- `appsscript.json`
- `C:/Users/emrah/Desktop/clasp_v65_main_upload/.clasp.json`
- `C:/Users/emrah/Desktop/clasp_v65_main_upload/appsscript.json`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`

## 3. Kök Neden

`appsscript.json` icindeki `oauthScopes` listesinde `https://www.googleapis.com/auth/script.container.ui` yoktu.

Mevcut scope'lar korunmustu:

- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/script.external_request`

Eksik scope nedeniyle Sheet container UI icinde `Ui.showModalDialog` cagrisi icin yetki hatasi gorulmesi beklenen davranistir.

## 4. Yapilan Duzeltme

`appsscript.json` icindeki `oauthScopes` listesine asagidaki scope eklendi:

```text
https://www.googleapis.com/auth/script.container.ui
```

Mevcut scope'lar bozulmadi.

Guncel scope listesi:

```json
[
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/script.external_request",
  "https://www.googleapis.com/auth/script.container.ui"
]
```

## 5. Apps Script Push/Pull Kaniti

Güvenli upload klasoru kullanildi:

```text
C:/Users/emrah/Desktop/clasp_v65_main_upload
```

Bu klasor yalniz 7 aktif Apps Script dosyasini icerir:

- `appsscript.json`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

Calistirilan komutlar:

```text
clasp push --force
clasp pull --force
```

Sonuc:

- `clasp push --force`: `Pushed 7 files`
- `clasp pull --force`: `Pulled 7 files`
- Pull-back manifest icinde `script.container.ui` scope'u goruldu.

SHA256 readback:

| Dosya | Lokal SHA256 | Pull-back SHA256 | Eslesme |
| --- | --- | --- | --- |
| `appsscript.json` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | `EE111E1EA5BE30071E84DCDAE1570F3C1078B3814D463DA97367F71799EA267D` | Evet |
| Core dosyasi | `3FAF15A4EB51ECC82FBD262F4D6EAAFDBAEC472E50CF099634DA587043FB4642` | `3FAF15A4EB51ECC82FBD262F4D6EAAFDBAEC472E50CF099634DA587043FB4642` | Evet |

## 6. Testler

Calistirilan komut:

```text
npm test
```

Sonuc:

- Core syntax: OK
- Duplicate public function: OK
- Aktif uretim dosyalarinda yasak ifade taramasi: OK
- V6.5 Node test seti: OK
- Son Sheet referans sozlesme testi: OK

## 7. Yetkilendirme Notu

Bu scope degisikligi Apps Script tarafina yuklendi. Ancak Google OAuth yetkisi kullanici tarafinda yeniden onaylanmadan UI testinin tamamlandigi soylenemez.

Beklenen kullanici adimi:

1. Sheet'i yenile.
2. `TESBIH KUYUSU PANEL > Ultra sipariş paneli` veya `Seçili siparişi düzenle` komutunu calistir.
3. Google yeni izin onayi isterse onayla.
4. Panel tekrar acilinca `Ui.showModalDialog` izin hatasi yeniden kontrol edilecek.

## 8. Canli Sistem Etkisi

- Canli Sheet verisi degistirilmedi.
- Parasut POST calistirilmadi.
- Navlungo POST calistirilmadi.
- e-belge POST calistirilmadi.
- Operasyon core mantigi degistirilmedi.

## 9. Kalan Risk

- Kullanici yeniden Google yetki onayi vermeden UI modal davranisi tam gecti sayilamaz.
- Bu turda gercek Sheet UI tiklama testi calistirilmadi; yalniz manifest scope, push/pull ve SHA readback kaniti alindi.

Codex sohbet ciktisi / calisma ozeti su dosyaya islendi: `08_KABUL_RAPORLARI/2026-05-05_ui_modal_dialog_scope_duzeltme_raporu.md`

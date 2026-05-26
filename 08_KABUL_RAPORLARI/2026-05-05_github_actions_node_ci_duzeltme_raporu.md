# 2026-05-05 GitHub Actions Node CI Duzeltme Raporu

## 1. PR #6 Son Yorum

- Yorum ID: `4379983404`
- Gorev: GitHub Actions `Node.js CI` kirmizi build nedenini bul, sahte pass yapmadan proje gercegine uygun Node test hattini kur, lokal ve CI uyumlu testleri calistir, raporla.
- Kural: Canli Apps Script, Sheet, Parasut, Navlungo ve e-belge POST calistirilmadi.

## 2. Incelenen Dosyalar ve Kaynaklar

- GitHub PR #6 yorumlari
- GitHub Actions run: `25377859149`
- GitHub Actions job: `74417735897` / `build (20.x)`
- `origin/main:.github/workflows/node.js.yml`
- `package.json`
- `package-lock.json`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`

## 3. Gercek CI Hata Sebebi

Son failed run logunda hata `npm test` veya Apps Script parse asamasinda degil, `actions/setup-node@v4` asamasinda olustu.

Log kaniti:

```text
##[error]Dependencies lock file is not found in /home/runner/work/tesbih-kuyusu-ultra-operasyon-paneli/tesbih-kuyusu-ultra-operasyon-paneli. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

Sonuc:

- `npm ci` calismadi.
- `npm test` calismadi.
- `20.x` job failure verdi.
- Diger matrix joblari iptal/failure durumuna dustu.

Kok neden: PR merge ref uzerinde `package-lock.json` yoktu. `origin/main` workflow dosyasi `cache: npm` kullandigi icin lock dosyasi zorunluydu.

## 4. Yapilan Duzeltmeler

### 4.1 Package dosyalari

- `package.json` eklendi.
- `package-lock.json` temiz sekilde uretildi.
- Yalniz `adm-zip` dev dependency olarak eklendi.
- `node_modules/` GitHub'a eklenmedi; `.gitignore` icinde kaldi.
- Ilk olusan kirli lock dosyasi Codex runtime paketlerini icerdigi icin silindi ve temiz olarak yeniden uretildi.

Temiz lock kontrolu:

- `codex-runtimes` aramasi: hit yok.
- `npm audit`: `found 0 vulnerabilities`.

### 4.2 CI test hattı

`package.json` test komutu:

```text
node 07_TEST_DOSYALARI/test_v6_5_ci_checks.js && node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js && node 07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js
```

### 4.3 Yeni CI kontrol dosyasi

`07_TEST_DOSYALARI/test_v6_5_ci_checks.js` eklendi.

Kontroller:

- Core syntax
- Duplicate public function
- Aktif uretim core/HTML dosyalarinda yasak ifade taramasi

### 4.4 Son Sheet referans sozlesme testi

`07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js` eklendi.

Kontroller:

- `TK6.HEADERS` ile XLSX kolon birebir uyumu
- 04/05/06/07/08/10/11 ID baglanti butunlugu
- `13_VERI_SOZLUGU` kapsam testi
- `10_808_FINANS_ONIZLEME.Fark` sifir kontrolu
- `07_PARASUT_FATURA` zorunlu payload/response/gonderim kolonlari
- `08_KARGO_PAKETLERI` Navlungo ve barkod kolonlari
- `05_ODEMELER.Teyit_Durumu` readback raporu
- `14_BANKA_HAREKETLERI` readback raporu

Not: Bu test XLSX dosyasini read-only okur. Sheet'e veri yazmaz.

## 5. Lokal Test Sonuclari

Komutlar:

```text
npm ci
npm audit
npm test
```

Sonuc:

- `npm ci`: basarili
- `npm audit`: `found 0 vulnerabilities`
- `npm test`: basarili

`npm test` ozeti:

```json
{
  "ci_checks": {
    "ok": true,
    "checks": [
      "core syntax",
      "duplicate public function",
      "forbidden active code terms"
    ],
    "functionCount": 110,
    "activeFiles": 6
  },
  "v6_5_node_test": {
    "ok": true,
    "openRows": 4,
    "invoiceGroups": 5,
    "addressRows": 5,
    "salesPostCalls": 1,
    "contactPostCalls": 0,
    "tokenRefreshCalls": 2,
    "navlungoAuthCalls": 10,
    "navlungoPostCalls": 6
  },
  "sheet_reference_contract": {
    "ok": true,
    "workbook": "02_SHEET_SISTEM\\TESBIH_KUYUSU_MASTER_SHEET (20).xlsx",
    "openIdCount": 8,
    "paymentStatus": {
      "Bekliyor": 8
    },
    "bankRows": 0
  }
}
```

Aciklama: `salesPostCalls` ve `navlungoPostCalls` degerleri Node harness icindeki izole test cagrilaridir. Bu turda canli Parasut/Navlungo/e-belge POST calistirilmadi.

## 6. GitHub Actions Durumu

Commit/push sonrasi GitHub Actions readback alindi.

- Commit: `75492a5260e612561037986df71aad199f2ffe81`
- Workflow run: `25382068537`
- Workflow: `Node.js CI`
- Run number: `16`
- Readback zamani: `2026-05-05 17:30:47 +03:00`

Job durumlari:

| Job | Status | Conclusion |
| --- | --- | --- |
| `build (18.x)` | `queued` | Bos |
| `build (20.x)` | `queued` | Bos |
| `build (22.x)` | `queued` | Bos |

Sonuc: Yeni CI run'i kirmizi degil, fakat GitHub runner henuz isi baslatmadigi icin `geciyor` denmedi. Job loglari henuz olusmadi. Onceki kirmizi build'in kok nedeni olan `package-lock.json` eksikligi bu commit ile giderildi ve ayni workflow'un lokal karsiligi `npm ci` + `npm test` olarak basarili calisti.

## 7. Degistirilen Dosyalar

- `package.json`
- `package-lock.json`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `08_KABUL_RAPORLARI/2026-05-05_github_actions_node_ci_duzeltme_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 8. Canli Sistem Etkisi

- Apps Script core degistirilmedi.
- HTML panel degistirilmedi.
- Canli Sheet degistirilmedi.
- Canli Parasut/Navlungo/e-belge POST calistirilmadi.

## 9. Kalan Risk

- GitHub Actions run `25382068537` readback aninda hala `queued`; runner baslamadigi icin GitHub tarafinda tamamlanmis yesil kanit henuz yok.
- CI matrix `18.x`, `20.x`, `22.x` uzerinde GitHub runner sonucu tamamlaninca ayrica dogrulanmali.

Codex sohbet ciktisi / calisma ozeti su dosyaya islendi: `08_KABUL_RAPORLARI/2026-05-05_github_actions_node_ci_duzeltme_raporu.md`

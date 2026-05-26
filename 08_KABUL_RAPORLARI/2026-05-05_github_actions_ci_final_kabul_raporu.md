# 2026-05-05 GitHub Actions CI Final Kabul Raporu

## 1. PR #6 Son Yorum

- Yorum ID: `4382157697`
- Gorev: GitHub Actions `Node.js CI` kirmizi/cancelled durumunu kapatmak, run `25382694848` nedenini netlestirmek, fake pass yapmadan projeye uygun CI hattini calistirmak.
- Kural: Canli Apps Script, Sheet, Parasut, Navlungo ve e-belge POST calistirilmadi.

## 2. Incelenen CI Runlari

### Run `25382694848`

- Commit: `bc26ac0f0eb6ff297707d2a402808c0fce4e0740`
- Workflow: `Node.js CI`
- Run number: `17`
- Run status: `completed`
- Run conclusion: `failure`

Job readback:

| Job | Status | Conclusion | Log |
| --- | --- | --- | --- |
| `build (18.x)` | `completed` | `cancelled` | Yok |
| `build (20.x)` | `completed` | `cancelled` | Yok |
| `build (22.x)` | `completed` | `cancelled` | Yok |

`build (20.x)` log indirme denemesi `BlobNotFound` dondurdu. Bu, job'un runner uzerinde gercek step calistirmadan iptal edildigini gosterir. Bu run icin `npm ci`, `npm audit` veya `npm test` calismadi.

### Run `25384294291`

- Commit: `4be61b6bcf7ad456fd523997be62780c3c44a446`
- Workflow: `Node.js CI`
- Run number: `18`
- Run status: `completed`
- Run conclusion: `failure`

Job readback:

| Job | Status | Conclusion | Log |
| --- | --- | --- | --- |
| `build (18.x)` | `completed` | `cancelled` | Yok |
| `build (20.x)` | `completed` | `cancelled` | Yok |
| `build (22.x)` | `completed` | `cancelled` | Yok |

Bu run da step logu uretmeden cancelled oldu.

## 3. Kok Neden Ayrimi

Onceki kirmizi build'in kok nedeni `package-lock.json` eksikligiydi. Bu sorun `75492a5` commit'i ile giderildi.

Sonraki `25382694848` ve `25384294291` run'larinda durum farklidir:

- `package-lock.json` artik vardir.
- Joblar runner step'lerine girmeden cancelled olmustur.
- Log blob'u bulunmadigi icin `npm ci` veya `npm test` failure kaniti yoktur.

Ek readback:

- `17a2f9df2adc1af880d00e33e07c528131fded4a` commit'i GitHub'a push edildi.
- Bu commit icin GitHub connector `workflow_runs: []` ve `statuses: []` dondurdu.
- PR readback `mergeable=false` dondurdu.
- `git merge-tree` kontrolunde `.github/workflows/node.js.yml` dosyasinda `origin/main` ile branch arasinda add/add merge conflict oldugu goruldu.
- Bu nedenle `17a2f9d` icin yeni PR Actions run'i olusmadi; sorun test failure degil, PR mergeability/workflow conflict durumuydu.

## 4. Yapilan Duzeltme

PR branch icinde proje gercegine uygun workflow dosyasi korundu:

- `.github/workflows/node.js.yml`

Yeni workflow:

- Workflow'u kapatmaz.
- Sahte success yazmaz.
- `always()` veya bos test kullanmaz.
- Tek Node 20.x job ile gercek kabul testlerini calistirir.
- Apps Script + HTML + Node test harness projesine uygun olarak web app build varsayimi yapmaz.

Calisan CI adimlari:

1. Checkout
2. Node 20.x kurulumu
3. `npm ci`
4. `npm audit`
5. `npm test`

`npm test` su kontrolleri gercekten calistirir:

- Core syntax
- Duplicate public function
- Aktif uretim core/HTML dosyalarinda yasak ifade taramasi
- V6.5 Node test seti
- Son Sheet referans sozlesme testi

Son ek duzeltme:

- `origin/main` branch'i PR branch'ine merge edildi.
- `.github/workflows/node.js.yml` add/add conflict'i cozuldu.
- Eski 18/20/22 matrix yerine V6.5 icin tek Node 20.x kabul test harness'i korundu.
- Bu cozum testleri kapatmaz; `npm ci`, `npm audit`, `npm test` adimlari gercek calisir.

## 5. Incelenen Dosyalar

- `.github/workflows/node.js.yml`
- `package.json`
- `package-lock.json`
- `07_TEST_DOSYALARI/test_v6_5_ci_checks.js`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `07_TEST_DOSYALARI/test_v6_5_son_sheet_referans_sozlesmesi.js`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (20).xlsx`
- GitHub Actions run `25382694848`
- GitHub Actions run `25384294291`
- PR mergeability readback
- `git merge-tree` workflow conflict readback

## 6. Lokal Test Sonuclari

Calistirilan komutlar:

```text
npm ci
npm audit
npm test
```

Sonuc:

- `npm ci`: Basarili
- `npm audit`: `found 0 vulnerabilities`
- `npm test`: Basarili

`npm test` readback:

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
    "openIdCount": 8,
    "paymentStatus": {
      "Bekliyor": 8
    },
    "bankRows": 0
  }
}
```

Not: Node harness icindeki `salesPostCalls` ve `navlungoPostCalls` izole test sayaclaridir. Bu rapor turunda canli POST calistirilmadi.

## 7. GitHub Actions Post-Push Durumu

- `17a2f9d` commit'i icin yeni run olusmadi; sebep PR'in workflow dosyasinda `origin/main` ile merge conflict tasimasiydi.
- Workflow conflict bu turda cozuldu.
- Conflict cozum commit'i: `359cdeb73f1ffea4fa98def94533e8d1bbece9fa`
- PR readback: `mergeable=true`
- Yeni GitHub Actions run: `25397117008`
- Workflow: `Node.js CI`
- Run number: `19`
- Run status: `completed`
- Run conclusion: `success`

Job readback:

| Job | Status | Conclusion |
| --- | --- | --- |
| `V6.5 Apps Script test harness` | `completed` | `success` |

Step readback:

- `Checkout`: success
- `Use Node.js 20.x`: success
- `Install dependencies`: success
- `Audit dependencies`: success
- `Run V6.5 acceptance checks`: success

Bu kanitla PR #6 son yorumdaki CI kabul blokaji kapatildi. Bu rapor guncellemesi ayrica commit/push edilecegi icin son rapor commit'i icin olusacak yeni run PR yorumunda ayrica belirtilecektir.

## 8. Canli Sistem Etkisi

- Canli Apps Script'e push yapilmadi.
- Canli Sheet verisi degistirilmedi.
- Parasut POST calistirilmadi.
- Navlungo POST calistirilmadi.
- e-belge POST calistirilmadi.

## 9. Kalan Risk

- Rapor guncellemesi icin yapilacak son commit yeni bir Actions run olusturabilir; bu run sonucu PR yorumunda nihai olarak yazilmalidir.
- Canli Google Sheets UI testi bu CI gorevinin kapsami degildi.

Codex sohbet ciktisi / calisma ozeti su dosyaya islendi: `08_KABUL_RAPORLARI/2026-05-05_github_actions_ci_final_kabul_raporu.md`

# 2026-05-05 Apps Script Execution API / Clasp Run Izin Raporu

## 1. Kaynak Talimat

PR #6 icindeki son teknik gorev okundu.

Talimat ozeti:

- Canli readback testinde `clasp run senkronizeDurumForOpen --params '[\"AS-20260504-001\"]'` calismadi.
- Hata: `Unable to run script function. Please make sure you have permission to run the script function.`
- Apps Script Execution API executable durumu, manifest, OAuth scope, deployment/API executable ayari, clasp login/proje yetkisi ve Google Cloud/Apps Script API izinleri kontrol edilecek.
- Secret/token yazilmayacak.
- Canli veri degistirilmeyecek.
- Parasut, Navlungo ve e-belge canli POST yapilmayacak.
- Once neden calismadigi raporlanacak, gerekirse yalniz izin/deployment/ayar duzeltmesi yapilacak.

## 2. Incelenen Dosyalar ve Kaynaklar

- `appsscript.json`
- `C:\Users\emrah\Desktop\clasp_v65_main_upload\appsscript.json`
- `C:\Users\emrah\Desktop\clasp_v65_main_upload\.clasp.json`
- Apps Script deployment listesi
- `clasp show-authorized-user`
- `clasp apis`
- `clasp run`
- Google Apps Script API resmi dokumani:
  - https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run
  - https://developers.google.com/apps-script/manifest/web-app-api-executable
  - https://github.com/google/clasp/blob/master/docs/run.md

## 3. Mevcut Manifest Durumu

GitHub ve canli pull manifest dosyalari ayni:

```json
{
  "timeZone": "Europe/Istanbul",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "executionApi": {
    "access": "MYSELF"
  }
}
```

Sonuc:

- `executionApi.access = MYSELF` zaten mevcut.
- Bu kisim eksik degil.
- `MYSELF`, yalniz deploy eden kullanicinin API uzerinden calistirmasina izin verir.

## 4. Clasp Oturum Durumu

Komut:

```powershell
clasp show-authorized-user
```

Sonuc:

```text
You are logged in as emrahcetin3553@gmail.com.
OAuth client ID: 1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com (google-provided).
```

Degerlendirme:

- Clasp oturumu var.
- Kullanilan OAuth client Google-provided.
- Resmi `clasp run` akisi icin proje ile ayni Cloud Project altinda Desktop OAuth client kullanilmasi oneriliyor.

## 5. Google Cloud / Apps Script API Durumu

Komut:

```powershell
clasp apis
```

Sonuc:

```text
GCP project ID is not set, unable to continue.
```

Kok neden:

- `.clasp.json` icinde `projectId` yok.
- Clasp bu nedenle proje bazli API durumunu okuyamiyor veya Apps Script API etkinligini CLI uzerinden yonetemiyor.
- Resmi `scripts.run` dokumani, script projesinin Apps Script API icin deploy edilmis olmasini ve cagiran uygulamanin ayni Cloud Platform projesini paylasmasini ister.
- Resmi `clasp run` dokumani da `projectId` ekleme, Desktop OAuth client olusturma ve `clasp login --use-project-scopes --creds client_secret.json` ile yeniden yetkilendirme adimlarini sart kosar.

## 6. Deployment Durumu

Ilk kontrol:

```text
Found 3 deployments.
- AKfycbwyobVRSZ0vEJw03ZT51KBMWdB3abAogBHszEudv8XZ @HEAD
- AKfycbycIB1opNh46-rbzfNr-6emwadwKoVGRcn5vayS0UB0aRlM92zcbILxGjBivrr95-P8Lg @3 - V6.4.1 acceptance execution api
- AKfycbyl_t-pNBBkccjo1dMuf5AXKc1UdeviCKJXylGlQgJ9nl7kTxy91rQsixcc7McTVl311A @4 - V6.5 Navlungo API dry-run runtime
```

Yapilan guvenli ayar duzeltmesi:

```powershell
clasp deploy -d "V6.5 execution api permission refresh"
```

Sonuc:

```text
Deployed AKfycbwhFR4XH7NVFfVnzEV4iT6mlHuh9k_J_hZqPJUVET6NR2XLzXKutwVb5XieJgk2gDT7yA @5
```

Son deployment listesi:

```text
Found 4 deployments.
- AKfycbwyobVRSZ0vEJw03ZT51KBMWdB3abAogBHszEudv8XZ @HEAD
- AKfycbwhFR4XH7NVFfVnzEV4iT6mlHuh9k_J_hZqPJUVET6NR2XLzXKutwVb5XieJgk2gDT7yA @5 - V6.5 execution api permission refresh
- AKfycbycIB1opNh46-rbzfNr-6emwadwKoVGRcn5vayS0UB0aRlM92zcbILxGjBivrr95-P8Lg @3 - V6.4.1 acceptance execution api
- AKfycbyl_t-pNBBkccjo1dMuf5AXKc1UdeviCKJXylGlQgJ9nl7kTxy91rQsixcc7McTVl311A @4 - V6.5 Navlungo API dry-run runtime
```

Not:

- Bu deployment kod degisikligi veya Sheet veri degisikligi degildir.
- Sadece Apps Script deployment kaydi yenilendi.
- Canli veri yazimi veya canli POST yapilmadi.

## 7. Fonksiyon Calistirma Testleri

### 7.1 Zararsiz Fonksiyon Testi

Komut:

```powershell
clasp run normalizeTelefon --params '[\"05321234567\"]'
```

Sonuc:

```text
Unable to run script function. Please make sure you have permission to run the script function.
```

### 7.2 onOpen Testi

Komut:

```powershell
clasp run onOpen
```

Sonuc:

```text
Unable to run script function. Please make sure you have permission to run the script function.
```

### 7.3 Hedef Fonksiyon Testi

Komut:

```powershell
clasp run senkronizeDurumForOpen --params '[\"AS-20260504-001\"]'
```

Sonuc:

```text
Unable to run script function. Please make sure you have permission to run the script function.
```

### 7.4 Nondev Testi

Komut:

```powershell
clasp run senkronizeDurumForOpen --nondev --params '[\"AS-20260504-001\"]'
```

Sonuc:

```text
Script function not found. Please make sure script is deployed as API executable.
```

Degerlendirme:

- Hata fonksiyona ozel degil.
- `normalizeTelefon`, `onOpen` ve `senkronizeDurumForOpen` ayni izin katmaninda takildi.
- Deployment yenilemesi tek basina yeterli olmadi.
- Blokaj kalici olarak Cloud Project / OAuth client / Apps Script API executable yetkilendirme tarafinda duruyor.

## 8. Kok Neden

Kok neden kod veya Sheet verisi degil.

Belirlenen teknik kok neden:

1. `.clasp.json` icinde `projectId` yok.
2. `clasp apis` bu nedenle API durumunu okuyamiyor.
3. Clasp oturumu Google-provided OAuth client ile acik.
4. Resmi Apps Script API `scripts.run` dokumani, cagiran uygulamanin script ile ayni Cloud Platform projesini paylasmasi gerektigini belirtiyor.
5. Resmi clasp run dokumani, kendi Desktop OAuth client'i ile `clasp login --use-project-scopes --creds client_secret.json` yeniden yetkilendirme gerektigini belirtiyor.

Bu nedenle `clasp run` izin blokaji bu turda tamamen kaldirilamadi.

## 9. Yapilan Duzeltme

Yapildi:

- Manifest kontrol edildi; `executionApi.access = MYSELF` dogrulandi.
- Canli manifest ile GitHub manifest eslesmesi dogrulandi.
- Clasp oturum kullanicisi dogrulandi.
- Deployment listesi kontrol edildi.
- Yeni deployment olusturuldu: `V6.5 execution api permission refresh`.
- Fonksiyon calistirma tekrar denendi.
- Canli veri degistirilmedi.
- Canli POST yapilmadi.
- Secret/token yazilmadi.

Yapilamadi:

- Google Cloud Project ID eklenemedi; proje ID bilinmiyor ve CLI `GCP project ID is not set` dedi.
- Desktop OAuth client olusturulup `client_secret.json` ile yeniden login yapilamadi; bu adim Google Cloud Console kullanici islemi gerektiriyor.
- Apps Script API executable izin blokaji tamamen kalkmadi.

## 10. Gerekli Manuel / Yetkili Aksiyon

Bu blokajin kalici cozumu icin gereken adimlar:

1. Apps Script projesinin bagli oldugu veya baglanacagi Google Cloud Project ID ve Project Number belirlenmeli.
2. `.clasp.json` icine secret icermeyen `projectId` eklenmeli.
3. Apps Script Project Settings icinden ayni Google Cloud Project Number sete edilmeli.
4. Google Cloud Console'da Apps Script API etkinlestirilmeli.
5. Ayni Cloud Project icinde Desktop OAuth Client olusturulmali.
6. `client_secret.json` GitHub'a asla commit edilmeden lokal tutulmali.
7. Su sekilde yeniden login yapilmali:

```powershell
clasp login --user tesbih-runtime --use-project-scopes --include-clasp-scopes --creds client_secret.json
```

8. Sonra test tekrar edilmeli:

```powershell
clasp run normalizeTelefon --user tesbih-runtime --params '[\"05321234567\"]'
clasp run senkronizeDurumForOpen --user tesbih-runtime --params '[\"AS-20260504-001\"]'
```

## 11. Canli POST Durumu

Bu turda canli POST yapilmadi.

- Parasut POST: Yapilmadi.
- Navlungo POST: Yapilmadi.
- e-Belge POST: Yapilmadi.
- Sheet veri yazimi: Yapilmadi.
- Kod push: Yapilmadi.
- Apps Script deployment: Yapildi.

## 12. Sonuc

Execution API izin gorevi analiz edildi ve guvenli deployment tazelemesi yapildi.

Ancak blokaj tamamen cozulmedi.

Nihai durum:

**Apps Script Execution API / clasp run izni Cloud Project ve OAuth client yetkilendirme eksigi nedeniyle hala blokajli.**

Bu nedenle PR #6'daki canli readback testi henuz tamamlanmis sayilamaz.

## 13. GitHub Rapor Notu

Bu rapor GitHub'a islenecektir.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-05_apps_script_execution_api_izin_raporu.md`

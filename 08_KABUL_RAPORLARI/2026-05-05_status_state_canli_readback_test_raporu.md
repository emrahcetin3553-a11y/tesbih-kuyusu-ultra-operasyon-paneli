# 2026-05-05 Status / State Canli Readback Test Raporu

## 1. Kaynak Talimat

PR #6 icindeki son talimat yorumu okundu.

Talimat ozeti:

- Tek bir guvenli `Acik_Siparis_ID` secilecek.
- Yalniz `senkronizeDurumForOpen("AS-...")` calistirilacak.
- Toplu islem yapilmayacak.
- Kod ve panel degistirilmeyecek.
- Parasut, Navlungo ve e-belge canli POST yapilmayacak.
- Test oncesi ve sonrasi yalniz 03/05/06/07/08/11/12 statu alanlari raporlanacak.
- Beklenmeyen statu degisikligi olursa eski statu degerine geri alinacak.
- Gercek siparis, odeme, fatura veya kargo satiri silinmeyecek.

## 2. Secilen Siparis

Secilen `Acik_Siparis_ID`: `AS-20260504-001`

Secim nedeni:

- 03/05/06/07/08/11 sayfalarinda bagli satirlari mevcut.
- 06 ve 07 tarafinda Parasut fatura ID ve gonderim kilidi mevcut.
- 08 tarafinda Navlungo barkod durumu mevcut.
- Test, durum senkronu icin readback degeri uretmeye uygun.

## 3. Calistirma Denemesi

Calistirilan komut:

```powershell
clasp run senkronizeDurumForOpen --params '[\"AS-20260504-001\"]'
```

Sonuc:

```text
Unable to run script function. Please make sure you have permission to run the script function.
```

Ek deneme:

```powershell
clasp run senkronizeDurumForOpen --nondev --params '[\"AS-20260504-001\"]'
```

Sonuc:

```text
Script function not found. Please make sure script is deployed as API executable.
```

Net karar:

- `senkronizeDurumForOpen("AS-20260504-001")` canli Apps Script Execution API uzerinden calistirilamadi.
- Bu nedenle canli readback testi tamamlandi denemez.
- Kod degistirilmedi.
- Panel degistirilmedi.
- Sheet'e manuel statu yazimi yapilmadi.
- Geri alma gerektiren beklenmeyen statu degisikligi olusmadi.

## 4. Test Oncesi / Sonrasi Statu Readback

Fonksiyon basarili calismadigi icin "sonrasi" degeri, basarisiz calistirma denemesinden sonra yapilan ikinci readback sonucudur. Degisiklik beklenmemis ve gozlenmemistir.

### 03_ACIK_SIPARISLER

| Alan | Once | Sonra |
| --- | --- | --- |
| Satir | 2 | 2 |
| Siparis_Durumu | Acik | Acik |
| Kargo_Durumu | Barkod Hazir | Barkod Hazir |
| Fatura_Durumu | Hazirlanabilir | Hazirlanabilir |
| E_Belge_Durumu | 11_EBELGE_ISTISNA bekler | 11_EBELGE_ISTISNA bekler |
| Kontrol_Seviyesi | OK | OK |
| Kontrol_Uyarisi | Bos | Bos |
| ERP_Kapanis_Uygun_Mu | Evet | Evet |
| ERP_Blokaj_Nedeni | Bos | Bos |

### 05_ODEMELER

| Alan | Once | Sonra |
| --- | --- | --- |
| Satir | 2 | 2 |
| Odeme_ID | OD-AS-20260504-001-ULTRA-O-1 | OD-AS-20260504-001-ULTRA-O-1 |
| Teyit_Durumu | Bekliyor | Bekliyor |
| Operator_Teyidi | Hayir | Hayir |
| Kontrol_Uyarisi | Bos | Bos |

### 06_FATURA_GRUPLARI

| Alan | Once | Sonra |
| --- | --- | --- |
| Satir | 2 | 2 |
| Fatura_Grubu_ID | FG-AS-20260504-001-MEHMET_OZUTUN | FG-AS-20260504-001-MEHMET_OZUTUN |
| Fatura_Durumu | Hazir | Hazir |
| Parasut_Cari_ID | 1062372249 | 1062372249 |
| Cari_Eslesme_Durumu | Cari ek alanlarla dogrulandi | Cari ek alanlarla dogrulandi |
| Cari_Aksiyon | Cari bagli | Cari bagli |
| Parasut_Fatura_ID | 1084948327 | 1084948327 |
| Gonderim_Kilidi | Evet | Evet |
| Kontrol_Uyarisi | Bos | Bos |

### 07_PARASUT_FATURA

| Alan | Once | Sonra |
| --- | --- | --- |
| Satirlar | 2-3 | 2-3 |
| Parasut_Fatura_ID | 1084948327 | 1084948327 |
| Parasut_Durumu | Gonderildi | Gonderildi |
| Gonderim_Kilidi | Evet | Evet |
| Payload_Kontrol | Fatura gonderilmis; tekrar gonderim kapali | Fatura gonderilmis; tekrar gonderim kapali |
| Hata_Mesaji | Bos | Bos |
| Taslak_Gonderime_Uygun_Mu | Hayir | Hayir |
| Taslak_Blokaj_Nedeni | Bos | Bos |

### 08_KARGO_PAKETLERI

| Alan | Once | Sonra |
| --- | --- | --- |
| Satir | 2 | 2 |
| Kargo_Paket_ID | KP-AS-20260504-001 | KP-AS-20260504-001 |
| Paket_Durumu | Barkod Hazir | Barkod Hazir |
| Navlungo_Post_Number | FWUFNMGUBKID | FWUFNMGUBKID |
| Navlungo_Reference_ID | KP-AS-20260504-001 | KP-AS-20260504-001 |
| Navlungo_Tracking_URL | https://domestic-track.navlungo.com/check/FWUFNMGUBKID | https://domestic-track.navlungo.com/check/FWUFNMGUBKID |
| Navlungo_Barcode_URL | https://domestic-barcode.navlungo.com/FWUFNMGUBKID.pdf | https://domestic-barcode.navlungo.com/FWUFNMGUBKID.pdf |
| Navlungo_Status | Barkod Hazir | Barkod Hazir |
| Navlungo_Last_Error | Bos | Bos |
| Kargo_Bekletilsin_Mi | Hayir | Hayir |
| Barkod_Yazdirildi_Mi | Bos | Bos |

### 11_EBELGE_ISTISNA

| Alan | Once | Sonra |
| --- | --- | --- |
| Satir | 2 | 2 |
| E_Belge_Kayit_ID | EB-FG-AS-20260504-001-MEHMET_OZUTUN | EB-FG-AS-20260504-001-MEHMET_OZUTUN |
| Parasut_Fatura_ID | 1084948327 | 1084948327 |
| Gonderim_Durumu | Gonderime Hazir | Gonderime Hazir |
| Resmi_Gonderim_Onayi | Evet | Evet |
| Resmi_Gonderim_Blokaj_Nedeni | Bos | Bos |
| Kontrol_Seviyesi | OK | OK |

### 12_KONTROL_MERKEZI

| Alan | Once | Sonra |
| --- | --- | --- |
| AS-20260504-001 ozel kontrol satiri | Yok | Yok |
| Genel kontrol satiri | CTRL-OK / Kapali / Blokaj_Mi Hayir | CTRL-OK / Kapali / Blokaj_Mi Hayir |

## 5. Canli POST Durumu

Bu turda canli POST yapilmadi.

- Parasut POST: Yapilmadi.
- Navlungo POST: Yapilmadi.
- e-Belge POST: Yapilmadi.

## 6. Dosya ve Kod Degisikligi

- Kod degisikligi yapilmadi.
- HTML panel degisikligi yapilmadi.
- Sheet'e manuel statu yazimi yapilmadi.
- Gercek siparis, odeme, fatura veya kargo satiri silinmedi.

## 7. Sonuc

PR #6'daki son talimat uygulamaya alindi, ancak canli fonksiyon calistirma adimi Apps Script Execution API yetkisi nedeniyle tamamlanamadi.

Bu nedenle bu raporun sonucu:

**Canli readback testi blokajli / tamamlanmadi.**

Sahte basari yazilmadi.

## 8. Kalan Risk ve Gerekli Aksiyon

Canli testin tamamlanmasi icin iki guvenli secenek var:

1. Google Apps Script API executable izni duzeltilerek `clasp run senkronizeDurumForOpen --params '[\"AS-20260504-001\"]'` calistirilir.
2. Kod degistirme yasagi kaldirilirsa yalniz bu test icin gecici olmayan, kontrollu bir manuel test wrapper eklenir ve sonra ayni readback tekrar alinir.

Mevcut PR talimati kod degistirmeyi yasakladigi icin ikinci secenek bu turda uygulanmadi.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-05_status_state_canli_readback_test_raporu.md`

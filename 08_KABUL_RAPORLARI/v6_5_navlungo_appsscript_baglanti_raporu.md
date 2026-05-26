# Tesbih Kuyusu V6.5 - Navlungo Apps Script Bağlantı Raporu

Tarih: 2026-05-03

## Hedef proje

- Apps Script proje URL'si: https://script.google.com/u/0/home/projects/1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77/edit
- Script ID: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`
- Ana Sheet URL'si: https://docs.google.com/spreadsheets/d/1ebgYLgOEE3uET6NRYviGXnh1cziUIal84aJhjhcCY80/edit
- Spreadsheet ID: `1ebgYLgOEE3uET6NRYviGXnh1cziUIal84aJhjhcCY80`

## Apps Script yükleme durumu

Ana Apps Script projesine V6.5 dosyaları `clasp push --force` ile yüklendi ve ardından `clasp pull` ile geri çekildi.

Aktif remote dosya listesi:

- `appsscript.json`
- `cariSecDialog.html`
- `kargoBilgisiDialog.html`
- `odemeEkleDialog.html`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `urunEkleDialog.html`

Eski V6.4.x core dosyaları ve ayrı `topluSiparisPaneli.html` aktif Apps Script projesinde bulunmadı.

## SHA doğrulama

- Lokal core SHA256: `769CE3A03F3F2BE663F73E95A4C4D57ED33D568B255A927D1333561C6932F9B4`
- Remote core SHA256: `769CE3A03F3F2BE663F73E95A4C4D57ED33D568B255A927D1333561C6932F9B4`
- Eşleşti mi: Evet

## Sheet kolon ve ayar readback

`08_KARGO_PAKETLERI` içinde şu Navlungo kolonları readback ile doğrulandı:

- `Navlungo_Post_Number`
- `Navlungo_Reference_ID`
- `Navlungo_Tracking_URL`
- `Navlungo_Barcode_URL`
- `Navlungo_Carrier_ID`
- `Navlungo_Carrier_Name`
- `Navlungo_Status`
- `Navlungo_Last_Response`
- `Navlungo_Last_Error`
- `Navlungo_Created_At`
- `Navlungo_Cancelled_At`
- `Navlungo_Test_Mu`
- `Navlungo_Payload_Hash`

`01_AYARLAR` içinde V6.5 Navlungo ayarları doğrulandı. Eksik olan `NAVLUNGO_TEST_MODE = Evet` eklendi. `NAVLUNGO_CARRIER_ID_MAP_JSON` değeri `{}` yerine şu kontrollü map ile güncellendi:

```json
{"Aras Kargo":"1","Yurtiçi Kargo":"2"}
```

Canlı kapı readback sonucu:

- `NAVLUNGO_ENV = QA`
- `NAVLUNGO_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_TEST_MODE = Evet`

## Script Properties durumu

Script Properties değerleri güvenlik nedeniyle okunup rapora yazılmadı. Terminalden Apps Script fonksiyonu çalıştırma denemesi Google Apps Script Execution API tarafında şu hata ile engellendi:

`Unable to run script function. Please make sure you have permission to run the script function.`

Bu nedenle bu raporda `NAVLUNGO_API_USERNAME` ve `NAVLUNGO_API_PASSWORD` için gerçek var/yok sonucu terminalden kanıtlanamadı. V6.5 core içinde `navlungoBaglantiTestiTam()` bu iki property için sadece var/yok loglayacak şekilde güncellendi; token/secret değeri loglanmaz.

## navlungoBaglantiTestiTam sonucu

Fonksiyon ana Apps Script projesine yüklendi ve public wrapper aktif. Ancak `clasp run navlungoBaglantiTestiTam` terminalden Execution API yetki hatasıyla çalışmadı. Apps Script UI veya Sheet menüsünden çalıştırıldığında beklenen log akışı:

- `[OK] NAVLUNGO_API_USERNAME var`
- `[OK] NAVLUNGO_API_PASSWORD var`
- `[OK] Navlungo token alındı`
- `[OK] Navlungo carrier kontrolü başarılı`
- `[OK] NAVLUNGO_ENV = QA`
- `[OK] NAVLUNGO_CANLI_GONDERIM kapalı`
- `[OK] Canlı gönderi POST yapılmadı`

Gerçek token ve carrier sonucu UI çalıştırması sonrası Execution loglarından alınmalıdır.

## navlungoKargoTaslakTestEt sonucu

Fonksiyon ana Apps Script projesine yüklendi ve public wrapper aktif. Terminalden Execution API yetki hatası nedeniyle doğrudan çalıştırılamadı.

Ana Sheet readback sonucunda `08_KARGO_PAKETLERI` içinde dry-run için uygun ilk test satırı bulundu:

- `Kargo_Paket_ID = KP-AS-20260503-001`
- `Paket_Durumu = Hazır`
- `Kargo_Firması = Aras Kargo`
- `Kargo_Tel = +905342729347`
- `İl = İzmir`
- `İlçe = Menderes`

Dry-run fonksiyonu güncellendi:

- `Bekliyor/Hazır` olmayan satırı otomatik seçmez.
- `NAVLUNGO_SENDER_ADDRESS_ID` boşsa payload üretmez.
- `NAVLUNGO_CARRIER_ID_MAP_JSON` içinde firma yoksa payload üretmez.
- Başarılı olursa `08_KARGO_PAKETLERI` içine `Navlungo_Reference_ID`, `Navlungo_Carrier_ID`, `Navlungo_Carrier_Name`, `Navlungo_Status = Payload Hazır`, `Navlungo_Last_Response`, `Navlungo_Test_Mu = Evet`, `Navlungo_Payload_Hash` yazar.

## 12_KONTROL_MERKEZI readback

Readback sırasında mevcut açık blokaj Paraşüt modülündeydi:

- `Kaynak_Sayfa = 07_PARASUT_FATURA`
- `Kontrol_Uyarısı = Paraşüt cari ID yok`
- `İlgili_Modül = Paraşüt`

Navlungo dry-run terminalden çalıştırılamadığı için bu raporda yeni Navlungo blokaj/readback satırı oluştuğu iddia edilmedi.

## Canlı POST yapılmadı kanıtı

Bu turda `NAVLUNGO_CANLI_GONDERIM = Evet` yapılmadı.

Çalıştırılmayan canlı fonksiyonlar:

- `navlungoKargoOlusturOnayli`
- `navlungoBarkodAl`
- `navlungoGonderiIptalEt`

V6.5 local testinde `NAVLUNGO_CANLI_GONDERIM = Hayır` iken canlı gönderi, barkod ve iptal POST kapıları kapalı kaldı. Bu turda ana Apps Script projesinden gerçek Navlungo gönderi POST yapılmadı.

## Kalan gerçek QA/LIVE barkod testi adımları

1. Ana Apps Script UI'da `navlungoBaglantiTestiTam()` çalıştır.
2. Execution loglarında credential var/yok, token ve carrier sonucunu kontrol et.
3. `NAVLUNGO_SENDER_ADDRESS_ID` boşsa 01_AYARLAR veya Script Properties içinde doldur.
4. `NAVLUNGO_CARRIER_ID_MAP_JSON` değerini Navlungo hesabındaki gerçek carrier ID'lerle doğrula.
5. `navlungoKargoTaslakTestEt()` çalıştır ve `08_KARGO_PAKETLERI` readback kontrolü yap.
6. `NAVLUNGO_CANLI_GONDERIM = Hayır` durumunda gerçek gönderi POST yapılmadığını tekrar doğrula.
7. İlk gerçek QA/LIVE barkod denemesi için ayrı onayla `NAVLUNGO_CANLI_GONDERIM = Evet` yapılmalı; bu rapor canlı kargo hazır kararı değildir.

## Son karar

V6.5 Navlungo core ve panel dosyaları ana Apps Script projesine yüklendi, remote SHA doğrulandı, ana Sheet üzerinde Navlungo kolon/ayar sözleşmesi tamamlandı. Terminalden `clasp run` ile gerçek token ve dry-run fonksiyonları Execution API yetki engeli nedeniyle çalıştırılamadı. Bu nedenle bu rapor canlı kargo veya nihai Navlungo kabul raporu değildir; sistem Apps Script UI üzerinden Navlungo API bağlantı testi ve dry-run aşamasına hazır hale getirilmiştir.

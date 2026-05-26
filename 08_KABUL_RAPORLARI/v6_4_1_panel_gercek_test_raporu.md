# Tesbih Kuyusu V6.4.1 Panel Gerçek Test Raporu

Tarih: 2026-05-02

## Panel Dosyaları

- `ultraSiparisPaneli.html`
- `topluSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

## UX / Akış Kontrolü

- Ultra panel tam ekran geniş dialog boyutunda açılacak şekilde kodlandı.
- Panel sırası: Müşteri -> Kargo -> Ürünler -> Ödemeler -> Fatura/Cari -> Kontrol Özeti -> Aksiyonlar.
- Normal ürünlerde gereksiz gümüş alanları gizlenir.
- Gümüş seçildiğinde gümüş gram, alış/satış ve tutar tipi alanları görünür.
- Ödeme satırı eklendikçe fatura/cari bloğu ödeme yapan kişi üzerinden oluşur.
- İki farklı ödeme yapan kişi senaryosu iki fatura grubu üretir.
- Paraşüt cari ID operatöre zorunlu manuel alan olarak bırakılmaz; aday/bul/oluştur akışına bağlanır.

## HTML Callback Kontrolü

- `ultraSiparisPaneli.html`: `ultraSiparisKontrolEt`, `ultraSiparisKaydet`, `faturaVeKargoOlustur`, `getUltraPanelHazirlik`, `getDialogData`
- `topluSiparisPaneli.html`: `topluUltraSiparisKaydet`, `getDialogData`
- `cariSecDialog.html`: `cariSecimKaydet`
- `urunEkleDialog.html`: `getDialogData`, `urunEkleKaydet`
- `odemeEkleDialog.html`: `getDialogData`, `odemeEkleKaydet`
- `kargoBilgisiDialog.html`: `getDialogData`, `kargoBilgisiKaydet`

Eksik callback: 0

## Gerçek UI Kanıt Durumu

Ana Apps Script projesine V6.4.1 core ve HTML dosyaları yüklendi. Ancak `clasp run` ile gerçek Apps Script yürütmesi yetki/API executable kapısında kaldı:

- `clasp run onOpen`: `Unable to run script function. Please make sure you have permission to run the script function.`
- `clasp run v641GercekSheetKabulKontrolu --nondev`: `Script function not found. Please make sure script is deployed as API executable.`

Bu nedenle panelin Apps Script UI içinde açılıp gerçek tıklama ile veri yazdığı kanıtı henüz kapatılmadı. Üretim kabulü için Apps Script UI veya Sheet menüsü üzerinden `v641GercekSheetKabulKontrolu()` çalıştırılmalı ve yürütme günlüğü alınmalıdır.

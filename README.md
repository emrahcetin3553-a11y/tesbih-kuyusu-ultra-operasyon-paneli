# Tesbih Kuyusu Ultra Operasyon Paneli

Bu repo, Tesbih Kuyusu V6.5 Ultra Operasyon sisteminin Google Sheets + Apps Script + Parasut + Navlungo + QZ Tray barkod yazdirma kaynaklarini tutar.

## Guncel Durum

- Aktif calisma dali: `v6-5-production-candidate`
- Aktif PR: `#6`
- `main` dali guncel canli kodu temsil etmiyor; canli aday bu dal uzerindedir.
- Canli Apps Script proje ID: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`
- Ana Sheet: `TESBIH_KUYUSU_MASTER_SHEET`
- Ana Sheet ID: `1ebgYLgOEE3uET6NRYviGXnh1cziUIal84aJhjhcCY80`
- Aktif core: `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- Aktif panel: `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`

## Is Mantigi

- Siparis sahibi, WhatsApp uzerinden yazan kisidir.
- Odeme yapan kisi, fatura kisisidir.
- Kargo alicisi siparis sahibi ve fatura kisisinden farkli olabilir.
- Ayni acik sipariste birden fazla odeme yapan varsa her odeme yapan icin ayri fatura grubu olusur.
- Varsayilan olarak tek acik siparis tek kargo paketine baglanir.
- 16:00 oncesi ayni WhatsApp musterisi ayni acik siparis altinda buyur; sonrasi yeni siparis veya operator onayli gec ekleme akisi gerektirir.
- Parasut satis faturasi ve e-belge karari ayridir; `07_PARASUT_FATURA` taslak/satis faturasi katmanidir, resmi e-belge karari `11_EBELGE_ISTISNA` tarafindadir.
- `10_808_FINANS_ONIZLEME` resmi fatura motoru degildir.

## Katmanlar

- `01_AYARLAR`: sistem ayarlari ve canli kapi degerleri.
- `02_WHATSAPP_KUYRUGU`: staging ve hizli giris.
- `03_ACIK_SIPARISLER`: acik siparis ozetleri.
- `04_URUN_KALEMLERI`: urun satirlari.
- `05_ODEMELER`: odeme satirlari.
- `06_FATURA_GRUPLARI`: odeme yapan bazli fatura gruplari.
- `07_PARASUT_FATURA`: Parasut satis faturasi payload ve gonderim sonucu.
- `08_KARGO_PAKETLERI`: kargo, Navlungo ve barkod yazdirma sonucu.
- `09_MUSTERI_HAFIZA`: musteri hafizasi.
- `11_EBELGE_ISTISNA`: e-belge/e-Arsiv/e-Fatura karar hazirligi.
- `12_KONTROL_MERKEZI`: blokaj ve aksiyon merkezi.
- `13_VERI_SOZLUGU`: kolon sozlesmesi.

## Canli Kapi Durumu

Canli Sheet uzerinde Parasut ve Navlungo kapilari kontrollu sekilde acik olabilir. Bu nedenle gelistirme ve test sirasinda rastgele API gonderimi calistirilmaz. Her canli islem secili kayit, acik ayar, temiz kontrol ve kullanici onayi ile yapilir.

## Aktif Dosya PolitikasÄ±

V6.4.x core dosyalari aktif canli akisin kaynagi degildir; referans/arsiv niteligindedir. Aktif Apps Script projesine yuklenecek core yalniz V6.5 dosyasidir.

## Kurulum Sirasi

1. `v6-5-production-candidate` dalini ac.
2. Apps Script projesine `appsscript.json`, aktif V6.5 core ve gerekli HTML dosyalarini yukle.
3. `onOpen()` ile menuyu yenile.
4. `sistemKolonlariniHazirla()` ve `otomatikGorunumuDuzenle()` calistir.
5. Ultra panelden secili siparis duzenleme ve yeni siparis kayit testlerini yap.
6. Parasut ve Navlungo testlerini sadece gerekli secili kayitlarla calistir.

## Canli Kabul Notu

Bu repo V6.5 uretim adayi kaynaklarini tasir. Gercek UI uzerinden 10 siparislik kabul kaniti ve kullanici onayi olmadan nihai canli kabul tamamlandi denmez.

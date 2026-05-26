# Canliya Gecis

## 1. Apps Script'e Yuklenecek Aktif Dosyalar

- `appsscript.json`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`

`topluSiparisPaneli.html` aktif V6.5 operator akisi icinde kullanilmaz. Coklu siparis Ultra panel icindeki yeni siparis bloklariyla yurur.

## 2. Script Properties Kontrol Listesi

Secret degerler GitHub'a yazilmaz ve raporlara acik basilmamalidir.

- Parasut: client id, client secret, company id, access token, refresh token, token bitis zamani, callback URL, product/contact map.
- Navlungo: QA/LIVE kullanici adi, sifre, ortam, access token, token bitis zamani.
- QZ Tray: yazici adi ve otomatik yazdirma ayarlari Sheet `01_AYARLAR` uzerinden okunur.

## 3. Ilk Calistirma Sirasi

1. Sheet'i ac ve `TESBIH KUYUSU PANEL` menusunun geldigini kontrol et.
2. `onOpen()`
3. `sistemKolonlariniHazirla()`
4. `otomatikGorunumuDuzenle()`
5. `parasutApiBaglantiTestiTam()`
6. `navlungoBaglantiTestiTam()`
7. Secili siparis uzerinden Ultra panel duzenleme testi.

## 4. Guvenli Test Sirasi

- Secili siparisi duzenle: 02, 03, 04, 06 ve 08 satirlarindan panel dolu acilmali.
- Kaydet: mevcut `Açık_Sipariş_ID` ve `Kargo_Paket_ID` korunmali.
- Sadece fatura: fatura varsa tekrar gonderim engellenmeli.
- Sadece kargo: fatura tekrar kesilmeden Navlungo akisi calismali.
- Fatura ve kargo: kontrol merkezi temizse tek akista ilerlemeli.
- QZ Tray: barkod URL olusursa yazdirma sonucu 08'e yazilmali.

## 5. Canli Kapi Kurallari

Canli kapilar kullanici operasyon ihtiyacina gore acik olabilir. Codex veya otomasyon rastgele canli POST calistirmaz. Her canli islem secili kayit, temiz kontrol, acik ayar ve kullanici onayi gerektirir.

## 6. Geri Donus Plani

- Canli kapilari kapat.
- 06, 07, 08 ve 12 uzerindeki gonderim kilidi, hata ve blokaj alanlarini oku.
- Canli Parasut veya Navlungo kaydi olustuysa silme yerine ilgili ID ile operasyon notu dus.
- Gerekirse aktif V6.5 core onceki Git commitinden yeniden Apps Script'e yuklenir.

## 7. Kabul Notu

Gercek UI uzerinden kabul senaryolari calistirilmadan nihai canli kabul tamamlandi denmez. Bu dokuman canliya gecis sirasi ve guvenlik kapilarini tarif eder.

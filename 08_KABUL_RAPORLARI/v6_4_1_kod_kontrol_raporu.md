# Tesbih Kuyusu V6.4.1 Kod Kontrol Raporu

Tarih: 2026-05-02

## Değiştirilen / Üretilen Dosyalar

- `C:\Users\emrah\Desktop\TESBİH KUYUSU SİSTEM\03_APPS_SCRIPT_KOD\tesbih_kuyusu_v6_4_1_ultra_operasyon_core.gs`
- `C:\Users\emrah\Desktop\TESBİH KUYUSU SİSTEM\02_SHEET_SISTEM\Tesbih_Kuyusu_V6_4_1_Ultra_Operasyon_Sheet.xlsx`
- `ultraSiparisPaneli.html`
- `topluSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

Ana Apps Script projesi:

https://script.google.com/u/0/home/projects/1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77/settings

Uzak proje dosya seti yeniden çekilerek doğrulandı:

- `appsscript.json`
- `tesbih_kuyusu_v6_4_1_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `topluSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

Eski V5/V6/V6.1/V6.2/V6.3 core dosyası uzak projede aktif kalmadı.

## Kontrol Sonuçları

- Syntax: `SYNTAX_OK`
- Function count: 299
- Duplicate function: 0
- Yasak kelime taraması, üretim core + HTML: 0 bulgu
- Sheet kolon uyumu: geçti
- Veri sözlüğü kapsamı: geçti
- Menü fonksiyon bağlantısı: geçti
- HTML callback bağlantısı: geçti
- Mock test sonucu: `V6_4_1_ULTRA_OPERASYON_MOCK_OK`
- Canlı POST kanıtı: `salesPostCalls = 0`

## Hash

- Core SHA256: `0D49DFEDA96B22CE7905C15AF5F0DFA5B241EE9D09937CE468C92CA3DFFE0A4C`
- Sheet SHA256: `31A426AFD15F09B3D2456698CAC128848A583769714721BD2306075F247790F6`
- Uzak core SHA256, yerel core ile aynı: evet

## Düzeltilen Hata

V6.4.1 kabul helper içinde gümüş satırı çalışırken `urunKalemleriniKontrolEt_()` içinde kapsam dışı `h` değişkeni referansı yakalandı. Düzeltildi:

- Hatalı çağrı: `calculateSilverMargin_(row, h, gross)`
- Yeni çağrı: `calculateSilverMarginFromNumbers_(row[H.SILVER_GRAM], row[H.SILVER_COST_UNIT], gross)`

## Menü Fonksiyon Bağlantıları

Günlük menü üst komutları gerçek fonksiyonlara bağlı:

- Ultra sipariş paneli -> `ultraSiparisPaneli`
- Toplu sipariş paneli -> `topluSiparisPaneli`
- Kaydet ve ERP güncelle -> `kaydetVeErpGuncelle`
- Fatura ve kargo oluştur -> `faturaVeKargoOlustur`
- Kontrol merkezi -> `kontrolMerkezi`
- Paraşüt API bağlantısını test et -> `parasutApiBaglantiTestiTam`
- Görünümü düzenle -> `otomatikGorunumuDuzenle`

Teknik komutlar da bağlıdır; eksik menü fonksiyonu yoktur.

## Fonksiyon Okuma/Yazma Matrisi

| Fonksiyon | Okur | Yazar |
|---|---|---|
| `kaydetUltraSiparisHizli` | panel payload, 01, 02, 03, 04, 05, 06, 08, 09 | 02, 04, 05, 06, 07, 08, 09, 10, 11, 12 |
| `topluUltraSiparisKaydet` | panel payload listesi, 01, 09 | 02, 04, 05, 06, 07, 08, 09, 10, 11, 12 |
| `hafifErpGuncelle` | 02, 03, 04, 05, 06, 08, 09 | 03, 06, 07, 08, 10, 11, 12 |
| `faturaGruplariniOlustur` | 04, 05, 06, 09 | 06 |
| `parasutTaslaklariniHazirla` | 04, 06, 07, 01, Script Properties | 07 |
| `kargoPaketleriniOlustur` | 02, 03, 08, 09 | 08 |
| `finans808OnizlemeOlustur` | 03, 04, 05 | 10 |
| `ebelgeIstisnaHazirla` | 04, 06, 07, 11 | 11 |
| `kontrolMerkeziniGuncelle` | 03, 04, 05, 06, 07, 08, 11, 14 | 12 |
| `parasutApiBaglantiTestiTam` | Script Properties, 01, Paraşüt GET | log / 12 |
| `parasutFaturaTaslakGonderOnayli` | 06, 07, 12, 01, Script Properties | 07; Paraşüt POST yalnız kapı açıksa |
| `navlungoKargoOlusturOnayli` | 08, 12, 01 | 08; Navlungo POST yalnız kapı açıksa |
| `bankaHareketleriniEsle` | 05, 14 | 14, 05, 12 |

## Gerçek Apps Script Çalıştırma Kapısı

Ana proje push ve uzak dosya doğrulaması yapıldı. `clasp run` ile gerçek fonksiyon yürütme ise yetki/API executable kapısında tamamlanmadı. Bu nedenle gerçek UI yürütme kanıtı ayrı kapı olarak açık kalır.

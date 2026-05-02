# Tesbih Kuyusu V6.4.1 Sheet Gerçek Kabul Raporu

Tarih: 2026-05-02

## Dosyalar

- Yerel XLSX: `C:\Users\emrah\Desktop\TESBİH KUYUSU SİSTEM\02_SHEET_SISTEM\Tesbih_Kuyusu_V6_4_1_Ultra_Operasyon_Sheet.xlsx`
- Native Google Sheet: https://docs.google.com/spreadsheets/d/1_neP8QTPT-tXd_sfsftO_PinexyStvOHu0XenSXR-Is

## Sheet Kontrolü

- Sayfa sayısı: 15
- Sayfalar: `00_KULLANIM_KILAVUZU`, `01_AYARLAR`, `02_WHATSAPP_KUYRUGU`, `03_ACIK_SIPARISLER`, `04_URUN_KALEMLERI`, `05_ODEMELER`, `06_FATURA_GRUPLARI`, `07_PARASUT_FATURA`, `08_KARGO_PAKETLERI`, `09_MUSTERI_HAFIZA`, `10_808_FINANS_ONIZLEME`, `11_EBELGE_ISTISNA`, `12_KONTROL_MERKEZI`, `13_VERI_SOZLUGU`, `14_BANKA_HAREKETLERI`
- Header uyumu: geçti, eksik/ekstra kolon yok
- Bozuk Türkçe karakter taraması: bulgu yok
- V6.2 / V6.3 kalıntısı: bulgu yok
- Gereksiz yedek/arşiv/kod sayfası: bulgu yok

## 13_VERI_SOZLUGU

- Gerçek veri satırı: 235
- Boş sözlük satırı: 0
- Eksik gerçek sayfa/kolon eşleşmesi: 0
- `01_AYARLAR` kolonları dahil: `Ayar_Kodu`, `Ayar_Değeri`, `Açıklama`, `Zorunlu_Mu`, `Son_Güncelleme`, `Not`
- Sözleşme adı: V6.4.1 Ultra Operasyon kolon sözleşmesi

## 01_AYARLAR

- `PARASUT_CANLI_GONDERIM = Hayır`
- `EBELGE_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_CANLI_GONDERIM = Hayır`
- `PARASUT_BATCH_LIMIT = 3`
- `TCKN_VARSAYILAN_GERCEK_KISI = 11111111111`
- `PARASUT_PRODUCT_ID_MAP_JSON = {}` yerel Sheet varsayılanı; Script Properties önceliklidir

## Not

Native Google Sheet import edildi ve metadata/range readback ile sayfa adları, 01 ayarlar ve 13 veri sözlüğü doğrulandı. Apps Script UI üzerinden `v641GercekSheetKabulKontrolu()` çalıştırma kanıtı bu raporda kapatılmamıştır.

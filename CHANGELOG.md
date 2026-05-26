# Changelog

## 2026-05-05 15:54 - V6.5 kalici stabilizasyon ve temizlik

- Aktif dalin `v6-5-production-candidate` ve PR `#6` oldugu dokumante edildi.
- Canli Apps Script core SHA ile repo core SHA eslestirildi.
- `08_KARGO_PAKETLERI` kod baslik sozlesmesi canli Sheet sirasina hizalandi.
- `13_VERI_SOZLUGU` icine canli 08 kargo bekletme ve barkod yazdirma kolonlari eklendi.
- `NAVLUNGO_DEFAULT_BARCODE_TYPE` canli ayari `3` degerinden `pdf` degerine cekildi.
- API yanit saklama riski icin bundan sonraki kayitlarda `barcode_pdf`, telefon, e-posta ve adres alanlari maskelenecek sekilde guvenli metin suzgeci guclendirildi.
- V6.5 Node test setine 08 baslik sozlesmesi ve Navlungo response PDF saklamama kontrolleri eklendi.

## 2026-05-05 - Execution API ve menu guvenli duzeltmeleri

- Apps Script Execution API yetkilendirme ve `clasp run` readback raporlari eklendi.
- `senkronizeDurumForOpen("AS-20260504-001")` readback testi raporlandi.
- Secili siparis baglami yokken menu kisayollarinin tum sistemi yenileme yoluna dusmemesi icin guvenli durdurma mantigi eklendi.

## 2026-05-04 - V6.5 Parasut, Navlungo ve QZ Tray is akislari

- Parasut yeni satis faturasi create payload akisi duzeltildi; eski detail referansi gonderilmemesi test edildi.
- Navlungo gonderi olusturma, barkod alma, sorgulama ve iptal akislari V6.5 core icinde aktif hale getirildi.
- QZ Tray barkod yazdirma sonucu 08 kargo paketine yazilacak sekilde panel ve backend baglantisi eklendi.

## 2026-05-02 - V6.4.x referans calismalari

- V6.4.1 ile V6.4.5 arasindaki uretim adayi denemeleri referans olarak repo icinde korunuyor.
- Aktif canli kaynak V6.5 core ve V6.5 panel dosyalaridir.

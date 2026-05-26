# Tesbih Kuyusu V6.5 Panel Kontrol Raporu

Tarih: 2026-05-03

## Panel değişiklikleri

- Panel tam ekran geniş gövde mantığına yaklaştırıldı.
- Sıra tek akış olarak kuruldu: Müşteri, Kargo, Ürünler, Ödemeler, Fatura/Cari, Adres geçmişi, Müşteri hafızası, Kontrol özeti, Aksiyonlar.
- Telefon formatlama yazım sırasında çalışmıyor; blur/kayıt öncesi `+905...` formatına kapanıyor.
- Ad-soyad normalizasyonu genel akışa alındı ve kritik örnekler desteklendi:
  - `mehmetnuriçetin -> Mehmet Nuri Çetin`
  - `nimeçetin -> Nimet Çetin`
  - `bedihaçetin -> Bediha Çetin`
  - `yaşarçetin -> Yaşar Çetin`
  - `emrahçağrı -> Emrah Çağrı`
  - `hasanalbayrak -> Hasan Albayrak`
- Sipariş sahibi girilince kargo alıcısı, ödeme yapan ve fatura kişisi tam adla dolar; alan operatör tarafından değiştirilmişse tekrar ezilmez.
- Kargo adresi, il, ilçe ve telefon ödeme/fatura varsayılanlarına akar; elle değiştirilen alanlar korunur.
- Ödeme yapan değişince Fatura/Cari bloğu oluşur.
- Ürün satırı ödeme yapan / fatura kişisi dropdown’ına bağlandı.
- Gümüş üründe gümüş özel alanları gösterilir; normal ürünlerde gereksiz gümüş alanları gösterilmez.
- Adres geçmişi panel içinde seçilebilir hale getirildi.
- `Cari seç / cari oluştur` butonları Apps Script callback’e bağlıdır.

## Aktif callback listesi

- `getDialogData`
- `getUltraPanelHazirlik`
- `parasutCariPanelAksiyonu`
- `ultraSiparisKontrolEt`
- `ultraSiparisKaydet`
- `topluUltraSiparisKaydet`
- `faturaVeKargoOlustur`

## Kalan kanıt boşluğu

Bu panel yerel HTML callback ve mock harness ile kontrol edildi. Gerçek Apps Script UI üzerinde tek sipariş, 3 sipariş ve 10 sipariş ekran testi bu çalışma içinde araçla çalıştırılamadı; kullanıcı tarafında çalıştırılmalı ve ekran/yürütme günlüğüyle doğrulanmalıdır.

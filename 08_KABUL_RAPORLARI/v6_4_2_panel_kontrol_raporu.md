# Tesbih Kuyusu V6.4.2 Panel Kontrol Raporu

Tarih: 2026-05-02

## Panel Dosyaları

- `ultraSiparisPaneli.html`
- `topluSiparisPaneli.html`
- `cariSecDialog.html`
- `urunEkleDialog.html`
- `odemeEkleDialog.html`
- `kargoBilgisiDialog.html`

## Akış

Ultra panel sırası korunur:

1. Müşteri
2. Kargo
3. Ürünler
4. Ödemeler
5. Fatura / Cari
6. Kontrol Özeti
7. Aksiyonlar

## HTML Callback Listesi

- `getDialogData`
- `getUltraPanelHazirlik`
- `ultraSiparisKontrolEt`
- `ultraSiparisKaydet`
- `topluUltraSiparisKaydet`
- `faturaVeKargoOlustur`
- `urunEkleKaydet`
- `odemeEkleKaydet`
- `kargoBilgisiKaydet`
- `cariSecimKaydet`

Callback fonksiyonları V6.4.2 core içinde bağlıdır.

## Mock Panel Testleri

| Senaryo | Sonuç |
|---|---|
| Ultra panel tek tuş kaydet | Geçti |
| 2 ürün + 1 ödeme + 1 kargo | Geçti |
| İki ödeme yapan kişi | Geçti |
| Fatura kişisi = ödeme yapan | Geçti |
| Ürün satırı ödeme yapan kişiye bağlandı | Geçti |
| Telefon normalizasyonu | Geçti |
| TCKN boşsa 11111111111 | Geçti |
| e-Arşiv varsayılanı | Geçti |
| Kargo hazırlığı açık siparişte gereksiz blokaj üretmedi | Geçti |
| E-belge hazırlık durumu blokaj üretmedi | Geçti |

## Kalan Risk

Panel UI gerçek Apps Script modalında manuel olarak açılıp son kez test edilmelidir. Repo/local mock panel akışı geçti, fakat bu kanıt gerçek kullanıcı tıklaması yerine mock ortamıdır.

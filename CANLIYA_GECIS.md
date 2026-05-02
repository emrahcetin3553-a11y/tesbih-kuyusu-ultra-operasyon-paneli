# Canlıya Geçiş

## 1. Apps Script'e Yüklenecek Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_4_4_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`

Not: Ayrı `topluSiparisPaneli.html` V6.4.4 aktif akışından kaldırıldı. Çoklu sipariş, Ultra panel içindeki `Yeni sipariş ekle` bloklarıyla yapılır.

## 2. Script Properties Kontrol Listesi

- `PARASUT_CLIENT_ID`
- `PARASUT_CLIENT_SECRET`
- `PARASUT_COMPANY_ID`
- `PARASUT_ACCESS_TOKEN`
- `PARASUT_REFRESH_TOKEN`
- `PARASUT_ACCESS_TOKEN_EXPIRES_AT`
- `PARASUT_CALLBACK_URL`
- `PARASUT_PRODUCT_ID_MAP_JSON`
- `PARASUT_CONTACT_ID_MAP_JSON`

Secret değerler dokümana veya GitHub'a yazılmaz.

## 3. İlk Çalıştırma Sırası

1. Sheet'i aç ve yenile.
2. Menü görünmüyorsa Apps Script'te `onOpen()` çalıştır.
3. `sistemKolonlariniHazirla()`
4. `otomatikGorunumuDuzenle()`
5. `v644GercekSheetKabulKontrolu()`
6. `parasutApiBaglantiTestiTam()`

## 4. Test Siparişi Senaryoları

- Tek müşteri, tek ürün, tek ödeme.
- Tek müşteri, çok ürün, tek ödeme.
- Tek açık sipariş içinde iki farklı ödeme yapan kişi.
- Sipariş sahibi, ödeme yapan ve kargo alıcısı farklı kişi.
- Gümüş ürün satırı.
- Eksik ödeme veya eksik kargo ile kontrollü blokaj.

## 5. Paraşüt API Test Sırası

1. Script Properties var/yok kontrolü.
2. Token refresh.
3. Company scoped GET.
4. 6 ürün GET.
5. Cari aday arama.
6. Fatura payload dry-run.
7. Canlı POST kapısı kapalı kontrolü.

## 6. Navlungo Test Sırası

1. Kargo paketi satırı oluştu mu kontrol et.
2. `navlungoKargoTaslakTestEt()` ile payload üret.
3. `NAVLUNGO_CANLI_GONDERIM = Hayır` iken canlı gönderim yapılmadığını doğrula.

## 7. Canlı Kapılar

Varsayılan:

- `PARASUT_CANLI_GONDERIM = Hayır`
- `EBELGE_CANLI_GONDERIM = Hayır`
- `NAVLUNGO_CANLI_GONDERIM = Hayır`

Açma işlemi sadece temiz kontrol merkezi, operatör onayı ve tek fatura/kargo denemesi için yapılmalıdır. Test sonrası kapı tekrar `Hayır` yapılmalıdır.

## 8. İlk Canlı Deneme Prosedürü

1. Tek temiz fatura grubu seç.
2. `12_KONTROL_MERKEZI` temiz olmalı.
3. Paraşüt cari ID doğrulanmalı.
4. `PARASUT_CANLI_GONDERIM = Evet` yapılmalı.
5. Sadece tek grup için `parasutFaturaTaslakGonderOnayli(faturaGrubuId)` çalıştırılmalı.
6. Sonuç yazıldıktan sonra kapı tekrar `Hayır` yapılmalı.

## 9. Geri Dönüş Planı

- Canlı kapıları `Hayır` yap.
- Gönderim kilidi ve hata mesajlarını 06/07/08 üzerinde kontrol et.
- Gerekirse V6.4.1 core dosyasını geri dönüş paketi olarak yeniden yükle.
- Paraşüt veya Navlungo tarafında oluşan canlı kayıt varsa sistem içi ID ile not düş.

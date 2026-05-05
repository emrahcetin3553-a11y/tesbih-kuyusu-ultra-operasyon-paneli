# ChatGPT - Codex - Kullanıcı Koordinasyon Talimatı

Tarih: 2026-05-05
Aktif branch: `v6-5-production-candidate`
Repo: `emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli`

## Amaç

Bu dosya kullanıcı, ChatGPT ve Codex arasında kopmayan çalışma zinciri kurmak için oluşturuldu.

## Ana Çalışma Kuralı

GitHub, canlı Apps Script ve güncel Sheet aynı gerçek sistemi temsil edecek.

- Yapılan her gerçek proje değişikliği GitHub'a işlenecek.
- Apps Script'e yüklenen dosyaların GitHub karşılığı da güncel olacak.
- Sheet tarafında eklenen veya güncellenen proje dosyaları GitHub'a eklenecek.
- Her işlemden sonra rapor yazılacak.
- Yapılmayan test yapılmış gibi yazılmayacak.
- Doğrulanmayan sonuç doğrulandı denmeyecek.

## Üçlü Çalışma Zinciri

1. Kullanıcı talebini ChatGPT'ye yazar.
2. ChatGPT gerekiyorsa GitHub içine net talimat yazar.
3. Kullanıcı Codex'e bu dosyayı okumasını söyler.
4. Codex talimatı GitHub'dan okur.
5. Codex işlem yapar, dosyaları günceller, gerekiyorsa Apps Script'e yükler.
6. Codex GitHub'a commit/push yapar.
7. Codex sonucu `08_KABUL_RAPORLARI` içine raporlar.
8. Kullanıcı ChatGPT'ye "Codex sonucu çıktı, incele" der.
9. ChatGPT GitHub'daki raporu ve değişen dosyaları inceler.
10. Yeni karar gerekiyorsa tekrar GitHub içine talimat yazar.

## Sıralama: Şaşma

Her işte sıra şu olacak:

1. Aktif branch ve canlı Apps Script durumu kontrol edilir.
2. Talimat dosyası okunur.
3. Değişiklik yapılacak dosyalar listelenir.
4. Kod, Sheet veya rapor değişikliği yapılır.
5. Test veya kontrol çalıştırılır.
6. Gerekiyorsa Apps Script yüklemesi yapılır.
7. GitHub'a commit/push edilir.
8. `08_KABUL_RAPORLARI` içine rapor yazılır.
9. Sonuç kullanıcıya kısa bildirilir.
10. ChatGPT sonucu GitHub üzerinden inceler.

## Codex Her İşlemde Ne Raporlayacak?

- İncelenen dosyalar
- Değiştirilen dosyalar
- Apps Script'e yüklenen dosyalar
- Sheet tarafında değişen dosyalar
- GitHub'a işlenen dosyalar
- Çalıştırılan testler/kontroller
- Test/kontrol sonucu
- Canlı Apps Script ile GitHub eşleşme durumu
- Neden düzenlendi?
- Ne düzeltildi?
- Hangi fonksiyonlar etkilendi?
- Kalan riskler
- Bir sonraki önerilen adım

## ChatGPT İncelemesi İçin Codex Ne Yazacak?

Her raporda şunlar açık olmalı:

- Aktif branch adı
- Commit SHA
- Değişen dosya yolları
- Raw GitHub linkleri
- Apps Script canlı dosya adları
- GitHub karşılık dosya adları
- Sheet snapshot dosya adı
- Test raporu dosya adı
- Codex sohbet çıktısı hangi rapor dosyasına işlendi?

## Öncelikli İnceleme Dosyaları

- `README.md`
- `CANLIYA_GECIS.md`
- `PROJE_DURUM_RAPORU.md`
- `CHANGELOG.md`
- `appsscript.json`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `03_APPS_SCRIPT_KOD/cariSecDialog.html`
- `03_APPS_SCRIPT_KOD/urunEkleDialog.html`
- `03_APPS_SCRIPT_KOD/odemeEkleDialog.html`
- `03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (17).xlsx`
- `05_NAVLUNGO/`
- `07_TEST_DOSYALARI/`
- `08_KABUL_RAPORLARI/`

## Şu Anki Ana Hedef

Mevcut çalışan V6.5 sistem korunacak. Sil baştan yapılmayacak.

Hedef model:

Sheet'te onaylanan sipariş için satış faturası, resmi belge, tahsilat ve kargo barkodu aynı kontrollü zincirde tamamlanacak. İşlem sonuçları Sheet'e ve kontrol merkezine yazılacak.

## İlk Teknik Öncelik

Tam otomasyona geçmeden önce statü/state senkronizasyonu düzeltilmelidir.

Özellikle şu sayfalar aynı dili konuşmalıdır:

- `03_ACIK_SIPARISLER`
- `05_ODEMELER`
- `06_FATURA_GRUPLARI`
- `07_PARASUT_FATURA`
- `08_KARGO_PAKETLERI`
- `11_EBELGE_ISTISNA`
- `12_KONTROL_MERKEZI`

## Kesin Yasaklar

- Sahte başarı yazma.
- Gerçek işlem yapılmadıysa yapılmış gibi yazma.
- Çalışan V6.5 akışını bozacak büyük refactor yapma.
- Çalışan kargo/Navlungo sözleşmesine gereksiz dokunma.
- `main` branch güncel değilken onu canlı kaynak gibi gösterme.

## ChatGPT Notu

Kullanıcı bundan sonra şu çalışma şeklini istiyor:

- ChatGPT önemli talimatları GitHub içine yazacak.
- Codex GitHub içindeki talimatı okuyacak.
- Codex işlem sonuçlarını GitHub içine raporlayacak.
- ChatGPT GitHub'daki Codex sonuçlarını inceleyecek.
- Zincir kırılmayacak.

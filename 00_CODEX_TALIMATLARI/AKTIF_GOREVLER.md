# AKTİF GÖREVLER

## 1. DURUM
- Aktif görev: STATÜ / STATE SENKRONİZASYONU
- Durum: BAŞLATILDI
- Başlatılma tarihi: 2026-05-05
- Son güncelleme: 2026-05-05
- Aktif branch: `v6-5-production-candidate`
- Ana çalışma dosyası: `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`

## 2. HEDEF

Sheet, Apps Script, Paraşüt satış faturası, resmi e-belge hazırlık katmanı, ödeme ve kargo katmanlarının aynı sipariş/fatura durumunu göstermesini sağlamak.

Bu görev yalnızca analiz ve güvenli statü senkronizasyon planı içindir. Bu aşamada tahsilat modülü, resmi e-belge gönderimi veya canlı POST değişikliği yapılmayacak.

## 3. NEDEN BU GÖREV ÖNCE YAPILIYOR?

Mevcut analizde görülen durum:

- `07_PARASUT_FATURA` içinde Paraşüt faturaları gönderilmiş görünüyor.
- `06_FATURA_GRUPLARI` içinde bazı fatura grupları hâlâ `Hazır` veya farklı statüde kalabiliyor.
- `03_ACIK_SIPARISLER` içinde fatura durumu üst özet olarak güncel durumu tam yansıtmıyor.
- `05_ODEMELER` içinde ödeme/tahsilat statüsü tam otomasyon için yeterince net değil.
- `11_EBELGE_ISTISNA` resmi e-belge karar katmanı olarak hazır ama resmi sonuç alanları henüz tamamlanmış değil.
- `12_KONTROL_MERKEZI` tüm blokajları ve başarı durumlarını tek merkezden kesin biçimde kapatmıyor.

Bu nedenle tahsilat veya resmi e-belge modülünden önce durum/state senkronizasyonu zorunludur.

## 4. YAPILACAKLAR

- [ ] `03_ACIK_SIPARISLER`, `05_ODEMELER`, `06_FATURA_GRUPLARI`, `07_PARASUT_FATURA`, `08_KARGO_PAKETLERI`, `11_EBELGE_ISTISNA`, `12_KONTROL_MERKEZI` sayfalarındaki durum kolonlarını analiz et.
- [ ] Apps Script içinde bu sayfalara statü yazan tüm fonksiyonları bul.
- [ ] `Paraşüt_Fatura_ID`, `Gönderim_Kilidi`, `Paraşüt_Durumu`, `Fatura_Durumu`, `Paket_Durumu`, `Navlungo_Status`, `ERP_Kapanış_Uygun_Mu`, `Blokaj_Nedeni` alanlarının hangi sırayla güncellendiğini çıkar.
- [ ] Aynı fatura grubunun tekrar gönderilmesini engelleyen kilitlerin yeterli olup olmadığını analiz et.
- [ ] Paraşüt satış faturası oluşturulduğunda üst sayfalara hangi statülerin yazılması gerektiğini belirle.
- [ ] Kargo/Navlungo mevcut çalışan akışına dokunmadan statü senkronizasyonunun nasıl yapılacağını planla.
- [ ] Tahsilat modülü ve resmi e-belge modülü eklenmeden önce gerekli yeni statü kolonlarını öner.
- [ ] Kod değişikliği gerekiyorsa önce sadece plan çıkar; kullanıcı/ChatGPT onayı olmadan canlı akışta davranış değiştirme.

## 5. İNCELENECEK DOSYALAR

Öncelikli dosyalar:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (17).xlsx`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`
- `00_CODEX_TALIMATLARI/CHATGPT_CODEX_KOORDINASYON_TALIMATI.md`
- `00_CODEX_TALIMATLARI/CHATGPT_INCELEME_ERISIM_TALIMATI.md`

## 6. BEKLENEN RAPOR

Codex raporunda şu başlıklar açıkça bulunmalı:

1. İncelenen dosyalar
2. Statü yazan fonksiyonlar
3. Mevcut statü akışı
4. Tespit edilen uyumsuzluklar
5. Tekrar gönderim / çift fatura riski var mı?
6. Kargo/Navlungo tarafına dokunmadan çözüm önerisi
7. Gerekli yeni kolonlar veya mevcut kolonların net kullanımı
8. Test edilmesi gereken senaryolar
9. Kod değişikliği önerisi varsa dosya/fonksiyon bazlı plan
10. GitHub commit bilgisi ve rapor dosyası yolu

## 7. KESİN SINIRLAR

Bu görevde şunlar yapılmayacak:

- Paraşüt tahsilat API entegrasyonu yazılmayacak.
- Resmi e-Arşiv/e-Fatura canlı gönderim modülü yazılmayacak.
- Navlungo çalışan gönderi/barkod akışı bozulmayacak.
- Canlı Apps Script davranışı değiştirilmeyecek.
- Kullanıcı/ChatGPT onayı olmadan tam otomasyon açılmayacak.

## 8. CHATGPT NOTU

Şu anki kesin başlama sırası:

1. Statü/state senkronizasyonu
2. Tahsilat modülü
3. Resmi e-belge modülü
4. En son hepsini tek `Fatura ve kargo oluştur` akışına bağlama

Bu görev 1. adımdır. Bitmeden 2. adıma geçilmeyecek.

## 9. CODEX SONUÇ ALANI

Codex bu görevi yaptıktan sonra buraya kısa sonuç özeti eklemeli ve ayrıntılı raporu `08_KABUL_RAPORLARI` klasörüne yazmalıdır.

# AKTİF GÖREVLER

## 1. DURUM
- Aktif görev: STATÜ / STATE SENKRONİZASYONU - GÜVENLİ UYGULAMA
- Durum: UYGULAMA TALİMATI VERİLDİ
- Başlatılma tarihi: 2026-05-05
- Son güncelleme: 2026-05-05
- Aktif branch: `v6-5-production-candidate`
- Ana çalışma dosyası: `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`

## 2. ÖNCEKİ ANALİZ SONUCU

Önceki analiz tamamlandı ve raporlandı:

- Analiz raporu: `08_KABUL_RAPORLARI/2026-05-05_status_state_senkronizasyon_analiz_raporu.md`
- Günlük rapor: `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

Kritik sonuç:

- Mevcut sistem gerçek ve çalışan V6.5 operasyon sistemidir.
- Sahte test tespit edilmedi; mock test gerçek test akışı kuruyor.
- Eksik kapsam: resmi e-belge ve tahsilat henüz test/entegrasyon kapsamına alınmadı.
- En önemli risk: 03/06/07/08/11/12 arasında statü drift riski.
- Sonraki güvenli adım: API çağırmayan `senkronizeDurumForOpen_(openId)` fonksiyonu.

## 3. BU GÖREVİN HEDEFİ

Bu görevde yalnızca statü/state senkronizasyonu için güvenli kod uygulaması yapılacak.

Amaç:

- 03/05/06/07/08/11/12 sayfalarındaki durumların aynı sipariş için birbirini doğru yansıtmasını sağlamak.
- Paraşüt satış faturası sonucu 07'de oluştuysa 06 ve 03 üst özetinin bunu doğru görmesini sağlamak.
- 06 veya 07 içinde gönderim kilidi varsa aynı fatura grubunun tekrar gönderilmesini daha güvenli biçimde engellemek.
- Kargo/Navlungo mevcut çalışan akışına dokunmadan 08 sonucunun 03 üst özete doğru yansımasını sağlamak.
- 11 e-belge karar katmanının 03 üst özete doğru yansımasını sağlamak.
- 12 kontrol merkezi üretimi öncesinde durumların tek merkezli olarak uyumlanmasını sağlamak.

## 4. KESİN SINIRLAR

Bu görevde KESİNLİKLE yapılmayacaklar:

- Paraşüt tahsilat API entegrasyonu yazılmayacak.
- Resmi e-Arşiv/e-Fatura gönderim modülü yazılmayacak.
- Paraşüt'e yeni canlı POST davranışı eklenmeyecek.
- Navlungo gönderi/barkod/iptal çalışan sözleşmesi değiştirilmeyecek.
- Ultra operasyon paneli kırılmayacak, buton isimleri ve mevcut callback sözleşmesi bozulmayacak.
- Yeni ayrı panel, sahte demo panel veya kullanılmayan HTML dosyası oluşturulmayacak.
- Çöp fonksiyon, dummy fonksiyon, sahte başarı fonksiyonu, fake test veya kullanılmayan üretim dosyası eklenmeyecek.
- Mevcut çalışan V6.5 akışını büyük refactor ile değiştirme.
- Kullanıcı/ChatGPT onayı olmadan tam otomasyon açma.
- `main` branch canlı kaynakmış gibi gösterilmeyecek; aktif çalışma branch'i `v6-5-production-candidate`.

## 5. YAPILACAK TEKNİK İŞ

Ana dosya:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`

Eklenecek veya düzenlenecek yapı:

- [ ] Yeni fonksiyon: `senkronizeDurumForOpen_(openId)`
- [ ] Bu fonksiyon API çağrısı yapmayacak; yalnızca Sheet okuma/yazma yapacak.
- [ ] 06, 07, 08, 11, 05, 12 satırlarını `openId` ile okuyacak.
- [ ] 07'de `Paraşüt_Fatura_ID` veya `Gönderim_Kilidi` varsa 06 fatura grubuna uyumlu statü/kilit yansıtacak.
- [ ] 06'da `Paraşüt_Fatura_ID` veya `Gönderim_Kilidi` varsa 07 satırlarının tekrar gönderim için yanlış hazır görünmesini engelleyecek.
- [ ] 08 içinde `Navlungo_Post_Number`, `Navlungo_Barcode_URL`, `Paket_Durumu`, `Navlungo_Status` alanlarından 03 `Kargo_Durumu` üst özetini hesaplayacak.
- [ ] 11 içinde `Gönderim_Durumu`, `Kontrol_Seviyesi`, `Resmi_Gönderim_Blokaj_Nedeni` alanlarından 03 `E_Belge_Durumu` üst özetini hesaplayacak.
- [ ] 05 ödeme durumunu tahsilat tamamlandı gibi göstermeyecek; tahsilat modülü eklenene kadar yalnız ödeme hazırlık/teyit durumunu yansıtacak.
- [ ] 12 kontrol merkezi üretiminden önce statülerin drift yapmasını azaltacak.

## 6. BAĞLANTI NOKTALARI

Kod uygulanırsa güvenli çağrı noktaları şunlar olacak:

- `kaydetUltraSiparisHizli_` sonunda, kontrol merkezi üretiminden önce.
- `parasutFaturaTaslakGonder_` başarı/hata sonucundan sonra.
- `finalizeOperationResult_` içinde kontrol merkezi özetinden önce.
- Gerekirse `hafifErpGuncelle_` veya `rebuildOpenOrderForOpen_` ile uyumlu, ama bu fonksiyonların ana iş mantığı bozulmadan.

Codex önce mevcut fonksiyon yapısını incelemeli; en küçük güvenli değişiklikle uygulamalıdır.

## 7. TEST ŞARTLARI

Test dosyası:

- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`

Eklenecek test senaryoları:

- [ ] 07'de `Paraşüt_Fatura_ID` var, 06 boş: senkronizasyon 06'yı kilitlemeli ve ikinci POST oluşmamalı.
- [ ] 06'da `Paraşüt_Fatura_ID` veya `Gönderim_Kilidi` var, 07 boş/hazır: senkronizasyon 07'nin yanlış tekrar gönderime hazır görünmesini engellemeli.
- [ ] Paraşüt create başarılı: 07, 06, 03 ve 12 aynı sonucu göstermeli.
- [ ] Paraşüt create hata: 07 hata, 06 hata, 12 blokaj, 03 blokaj göstermeli.
- [ ] Navlungo post ve barkod var: 08 statüleri korunmalı, 03 kargo üst özeti doğru olmalı.
- [ ] Kargo bekletiliyor: 08 `Bekletiliyor`, 12 kritik hata değil bilinçli bekletme bilgisi üretmeli.
- [ ] Ödeme var ama tahsilat modülü yok: sistem tahsilatı tamamlandı gibi göstermemeli.

Var olan testler kırılmayacak:

- Core syntax OK olmalı.
- Duplicate function kontrolü geçmeli.
- Yasak ifade taraması geçmeli.
- Node V6.5 test seti geçmeli.
- Mevcut `salesPostCalls=1` beklenen akış bozulmamalı.

## 8. DOSYA POLİTİKASI

Codex sadece gerekli dosyaları değiştirmelidir.

Beklenen değişiklikler:

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `08_KABUL_RAPORLARI/<tarihli_uygulama_raporu>.md`
- Gerekirse bu dosyada sonuç alanı güncellemesi.

Oluşturulmaması gerekenler:

- Kullanılmayan yeni HTML panel dosyası.
- Üretime bağlı olmayan demo/test kopya dosyaları.
- `copy`, `backup`, `tmp`, `dummy`, `fake`, `old`, `deneme` isimli çöp dosyalar.
- Gereksiz yeni klasör.
- Canlı sistemle eşleşmeyen paralel core dosyası.

## 9. RAPOR ŞARTI

Codex işlem sonunda `08_KABUL_RAPORLARI` içine yeni rapor yazacak.

Raporda şu başlıklar zorunlu:

1. Neden düzenlendi?
2. Ne düzeltildi?
3. Hangi dosyalar değişti?
4. Hangi fonksiyonlar eklendi/değişti?
5. Apps Script'e yükleme yapıldı mı?
6. Sheet tarafında değişiklik yapıldı mı?
7. GitHub commit SHA nedir?
8. Hangi testler çalıştırıldı?
9. Test sonucu nedir?
10. Canlı POST yapıldı mı?
11. Kalan riskler nelerdir?
12. Bir sonraki önerilen adım nedir?

Rapor gerçek olmalı. Çalıştırılmayan test geçti denmeyecek. Canlı Apps Script'e yüklenmediyse yüklenmedi denecek.

## 10. CHATGPT KARARI

Bu görev onaylıdır.

En güçlü seçenek: `senkronizeDurumForOpen_(openId)` fonksiyonunu güvenli şekilde eklemek ve testle kanıtlamak.

Bu görev bitmeden tahsilat modülüne veya resmi e-belge modülüne geçilmeyecek.

## 11. CODEX SONUÇ ALANI

Codex bu görevi yaptıktan sonra buraya kısa sonuç özeti eklemeli ve ayrıntılı raporu `08_KABUL_RAPORLARI` klasörüne yazmalıdır.

## 12. CODEX UYGULAMA SONUCU - 2026-05-05

- Durum: Uygulandi ve test edildi.
- Eklenen ana fonksiyon: `senkronizeDurumForOpen_(openId)`
- Public wrapper: `senkronizeDurumForOpen(acikSiparisId)`
- Kod/test commit SHA: `b9b2ee1`
- Apps Script yukleme: Yapildi.
- Apps Script proje ID: `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`
- GitHub core SHA256 ile Apps Script pull core SHA256 eslesmesi: Evet.
- Sheet degisikligi: Yapilmadi.
- Canli API POST: Yapilmadi.
- Calistirilan testler:
  - Core syntax kontrolu: `SYNTAX_OK`
  - Duplicate function kontrolu: `DUPLICATE_FUNCTION_OK count=458`
  - Uretim core + panel yasak ifade taramasi: `YASAK_IFADE_OK`
  - Node V6.5 test seti: Gecti
- Detayli rapor: `08_KABUL_RAPORLARI/2026-05-05_status_state_senkronizasyon_uygulama_raporu.md`
- Kalan risk: Canli Google Sheets UI readback testi bu turda yapilmadi; bir sonraki adimda kontrollu Acik_Siparis_ID ile `senkronizeDurumForOpen("AS-...")` calistirilip 03/06/07/08/11/12 okunmali.

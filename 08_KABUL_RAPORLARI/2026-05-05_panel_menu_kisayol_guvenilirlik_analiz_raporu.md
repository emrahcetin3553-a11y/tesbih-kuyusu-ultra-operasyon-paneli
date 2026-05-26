# Panel Menü / Kısayol Güvenilirlik Analiz Raporu

Tarih: 2026-05-05 14:43 +03:00

PR kaynağı: https://github.com/emrahcetin3553-a11y/tesbih-kuyusu-ultra-operasyon-paneli/pull/6#issuecomment-4378833409

## 1. Kapsam

Bu çalışma PR #6 son yorumu gereği yalnız analiz ve güvenli düzeltme planıdır. Kod, panel, Apps Script canlı proje dosyaları veya gerçek Sheet verisi değiştirilmedi.

Kısıtlar:
- Paraşüt, Navlungo ve e-belge canlı POST yapılmadı.
- Menü callback'leri canlı veri yazma ihtimali nedeniyle çalıştırılmadı.
- Kullanıcı/ChatGPT onayı olmadan menü silme veya kod değişikliği yapılmadı.
- Gerçek Sheet verisi değiştirilmedi.

## 2. İncelenen Dosyalar

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`
- PR #6 son yorum akışı

## 3. Analiz Yöntemi

Çalıştırılan zararsız kontroller:
- GitHub connector ile PR #6 yorumları okundu.
- `onOpen_()` ve `.addItem(...)` satırları statik olarak çıkarıldı.
- Public wrapper fonksiyonları ve parametreleri statik olarak çıkarıldı.
- Menü callback var/yok kontrolü yapıldı.
- Duplicate public function kontrolü yapıldı.
- Core SHA256 alındı.

Çalıştırılmayanlar:
- Canlı veri yazan menü callback testleri çalıştırılmadı.
- Paraşüt/Navlungo/e-belge POST çağrısı yapılmadı.
- Apps Script push/deploy yapılmadı.

Not: Bu turda syntax testi yeniden çalıştırılmadı. Doğrudan `node --check` `.gs` uzantısı nedeniyle uygun değildir; bu rapor syntax kabul raporu değildir.

## 4. Özet Bulgular

| Kontrol | Sonuç |
| --- | --- |
| Menü item sayısı | 37 |
| Callback'i bulunmayan menü item | 0 |
| Public/top-level function sayısı | 106 |
| Duplicate public function | 0 |
| Core SHA256 | `062FA6202CE9856E852F4C80FE2F6957CFC6A6192D7806C2EF2CBBC447374ABE` |
| Apps Script canlı proje push | Yapılmadı |
| Sheet veri değişikliği | Yapılmadı |
| Canlı POST | Yapılmadı |

Genel sonuç: Menü callback isimleri teknik olarak mevcut. Ana sorun eksik callback değil; bazı menülerin parametre/aktif satır bağlamı olmadan çağrılması, bazı menülerin geniş sistem yenileme veya canlı kapı açıkken gerçek operasyon tetikleme riski taşımasıdır.

## 5. Menü Haritası

| Menü | Kısayol | Callback | Var mı | Parametre imzası | Gerekli bağlam | Ön risk |
| --- | --- | --- | --- | --- | --- | --- |
| Gelişmiş / Teknik | Cari seç / oluştur | `cariSecDialog` | Evet | Yok | Dialog/form | Orta |
| Gelişmiş / Teknik | Hızlı sipariş oluştur | `hizliSiparisOlustur` | Evet | Yok | Dialog/form | Düşük |
| Gelişmiş / Teknik | Ürün ekle | `urunEkle` | Evet | Yok | Dialog/form | Orta |
| Gelişmiş / Teknik | Ödeme ekle | `odemeEkle` | Evet | Yok | Dialog/form | Orta |
| Gelişmiş / Teknik | Kargo bilgisi gir | `kargoBilgisiGir` | Evet | Yok | Dialog/form | Orta |
| Gelişmiş / Teknik | Sistemi yenile | `sistemiYenile` | Evet | Yok | Tüm sistem | Yüksek |
| Gelişmiş / Teknik | Kontrol merkezini güncelle | `kontrolMerkeziniGuncelle` | Evet | Yok | Tüm sistem | Orta |
| Gelişmiş / Teknik | Sistemi canlıya hazırla | `sistemiCanliyaHazirla` | Evet | Yok | Tüm sistem + API GET | Yüksek |
| Gelişmiş / Teknik | Paraşüt ürün kartlarını kontrol et | `parasutUrunKartlariniKontrolEt` | Evet | Yok | Paraşüt ayarları | Orta |
| Gelişmiş / Teknik | Paraşüt cari hazırlığı yap | `parasutCariHazirla` | Evet | Yok | 06/09/cari map | Orta |
| Gelişmiş / Teknik | Paraşüt cari adaylarını getir | `parasutCariAdaylariniGetir` | Evet | `faturaBilgisi` | Parametre veya seçili fatura grubu gerekir | Yüksek |
| Gelişmiş / Teknik | Paraşüt taslak payload test et | `parasutTaslakPayloadTestEt` | Evet | `groupId` | 07/06 fatura grubu; yazma etkisi var | Yüksek |
| Gelişmiş / Teknik | Paraşüt taslak gönder | `parasutFaturaTaslakGonderOnayli` | Evet | `groupId` | Fatura_Grubu_ID gerekir | Kritik |
| Gelişmiş / Teknik | e-Belge / istisna hazırlığı yap | `ebelgeIstisnaHazirla` | Evet | Yok | Tüm e-belge hazırlık tablosu | Orta |
| Gelişmiş / Teknik | 16:00 sonrası geç ekleme işlemi | `gecEklemeIstisnaIslemi` | Evet | Yok | 02 seçili satır gerekir | Orta |
| Gelişmiş / Teknik | Banka hareketlerini içeri al | `bankaHareketleriniIceriAl` | Evet | Yok | 14 banka verisi | Yüksek |
| Gelişmiş / Teknik | Banka hareketlerini eşleştir | `bankaHareketleriniEsle` | Evet | Yok | 05/14 | Orta |
| Gelişmiş / Teknik | Banka eşleşmelerini kontrol et | `bankaEslesmeKontrolMerkeziniGuncelle` | Evet | Yok | 05/14/12 | Orta |
| Gelişmiş / Teknik | Navlungo API bağlantı testi | `navlungoBaglantiTestiTam` | Evet | Yok | Navlungo credential | Orta |
| Gelişmiş / Teknik | Navlungo toplu kargo oluştur | `navlungoTopluKargoOlustur` | Evet | `seciliPaketler` | 08 seçili satır veya parametre gerekir | Yüksek |
| TESBİH KUYUSU PANEL | Ultra sipariş paneli | `ultraSiparisPaneli` | Evet | Yok | Yok | Düşük |
| TESBİH KUYUSU PANEL | Seçili siparişi düzenle | `seciliSiparisiDuzenle` | Evet | Yok | Seçili bağlı sipariş satırı | Orta |
| TESBİH KUYUSU PANEL | Seçili siparişleri düzenle | `seciliSiparisleriDuzenle` | Evet | Yok | Seçili bağlı sipariş satırları | Orta |
| TESBİH KUYUSU PANEL | Kaydet ve ERP güncelle | `kaydetVeErpGuncelle` | Evet | Yok | Seçili Açık_Sipariş_ID önerilir | Yüksek |
| TESBİH KUYUSU PANEL | Sadece fatura oluştur | `sadeceFaturaOlustur` | Evet | `openId` | Parametre veya seçili openId | Yüksek |
| TESBİH KUYUSU PANEL | Sadece kargo hazırla | `sadeceKargoHazirla` | Evet | `openId` | Parametre veya seçili openId | Yüksek |
| TESBİH KUYUSU PANEL | Fatura ve kargo oluştur | `faturaVeKargoOlustur` | Evet | `openId` | Parametre veya seçili openId | Yüksek |
| TESBİH KUYUSU PANEL | Kargo beklet | `kargoBeklet` | Evet | `openId` | Parametre veya seçili openId | Orta |
| TESBİH KUYUSU PANEL | Bekleyen kargoyu çıkar | `bekleyenKargoyuCikar` | Evet | `openId` | Parametre veya seçili openId | Yüksek |
| TESBİH KUYUSU PANEL | Sil | `seciliKaydiSil` | Evet | Yok | Seçili bağlı sipariş satırı | Yüksek |
| TESBİH KUYUSU PANEL | Geri al | `seciliKaydiGeriAl` | Evet | Yok | Seçili bağlı sipariş satırı | Yüksek |
| TESBİH KUYUSU PANEL | Arşivle | `seciliKaydiArsivle` | Evet | Yok | Seçili bağlı sipariş satırı | Yüksek |
| TESBİH KUYUSU PANEL | Müşteri hafızasını düzenle | `musteriHafizasiniDuzenle` | Evet | Yok | Seçili sipariş veya 09 | Orta |
| TESBİH KUYUSU PANEL | Müşteri hafızasından sil | `musteriHafizasindanSil` | Evet | Yok | Seçili telefon | Yüksek |
| TESBİH KUYUSU PANEL | Kontrol merkezi | `kontrolMerkezi` | Evet | Yok | 12 | Düşük |
| TESBİH KUYUSU PANEL | Paraşüt API bağlantısını test et | `parasutApiBaglantiTestiTam` | Evet | Yok | Paraşüt ayarları | Orta |
| TESBİH KUYUSU PANEL | Görünümü düzenle | `otomatikGorunumuDuzenle` | Evet | Yok | Tüm sheet formatı | Düşük |

## 6. Kırık veya Güvensiz Görünen Noktalar

### 6.1 Kritik

1. `Paraşüt taslak gönder` menüsü `parasutFaturaTaslakGonderOnayli(groupId)` callback'ine bağlı. Menü çağrısı parametre geçmez. Bu nedenle seçili 06/07 satırından `Fatura_Grubu_ID` çözen güvenli wrapper olmadan günlük menüden çalışması beklenmemeli.

2. `Kaydet ve ERP güncelle` seçili satırda `Açık_Sipariş_ID` bulamazsa `sistemiYenile_()` çalıştırıyor. Yanlış sayfada/boş seçimde tüm sistem yenileme tetiklenebilir. Menüden güvenli kullanım için açık hata vermeli veya panel açmalıdır.

3. `Fatura ve kargo oluştur`, `Sadece fatura oluştur`, `Sadece kargo hazırla`, `Bekleyen kargoyu çıkar` callback'leri seçili `Açık_Sipariş_ID` bulursa gerçek operasyon akışını başlatabilir. Canlı kapılar açık olduğunda Paraşüt/Navlungo çağrısı tetiklenebilir. Günlük menüde açık onay ve gate özeti olmadan risklidir.

### 6.2 Yüksek

4. `Paraşüt cari adaylarını getir` menüsü parametre isteyen `parasutCariAdaylariniGetir(faturaBilgisi)` callback'ine bağlı. Menüden doğrudan çağrı için seçili fatura grubundan veri oluşturan wrapper gerekir.

5. `Paraşüt taslak payload test et` menüsü adı test gibi görünse de 07 ve 12 tarafına writeback yapıyor. Seçili grup çözümü ve "dry-run writeback" etiketi netleşmeli.

6. `Navlungo toplu kargo oluştur` parametre alabilir; parametre yoksa 08 aktif seçiminden paket arıyor. 08 dışından yanlış çağrıda güvenli hata verebilir ama günlük menüde yanlış beklenti oluşturuyor. "Seçili 08 kargo paketlerini oluştur" gibi açık isim ve onay gerekir.

7. `Banka hareketlerini içeri al`, `Banka hareketlerini eşleştir`, `Sistemi yenile`, `Sistemi canlıya hazırla` geniş kapsamlı yazma/yenileme yapar. Bunlar teknik menüde kalmalı ve mümkünse onay istemelidir.

### 6.3 Orta

8. `Müşteri hafızasını düzenle` seçili sipariş yoksa sadece 09 sayfasına geçiyor; gerçek düzenleme ekranı açmıyor. Menü adı davranıştan daha güçlü.

9. `Müşteri hafızasından sil` fiziksel silme yerine ilgili kayıtları pasife alıyor. Güvenli davranış doğru, fakat menü adı "sil" olduğu için operatör beklentisi yanlış olabilir.

10. `Sil`, `Geri al`, `Arşivle` bağlı tabloları güncelleyen gerçek lifecycle işlemleri. Buna rağmen seçili sipariş özeti, dış gönderim durumu ve geri alınabilirlik bilgisi gösteren onay penceresi olmadan riskli.

## 7. Düzeltme Planı

Bu plan onay alınmadan uygulanmayacaktır.

1. `selectedContext_()` gibi tek bir bağlam çözücü eklenir:
   - Aktif sheet adı
   - Aktif satır
   - `Açık_Sipariş_ID`
   - `Fatura_Grubu_ID`
   - `Kargo_Paket_ID`
   - İzin verilen sayfa kontrolü

2. Parametre isteyen menüler için seçili satır odaklı wrapper eklenir:
   - `seciliParasutCariAdaylariniGetir`
   - `seciliParasutTaslakPayloadTestEt`
   - `seciliParasutFaturaTaslakGonderOnayli`
   - `seciliNavlungoTopluKargoOlustur`

3. `kaydetVeErpGuncelle_()` güvenli hale getirilir:
   - `Açık_Sipariş_ID` yoksa tüm sistem yenileme çalıştırmaz.
   - Kullanıcıya "Lütfen sipariş satırı seçin veya Ultra panelden kaydedin" mesajı verir.

4. Operasyonel menülerde açık onay ve gate özeti gösterilir:
   - Paraşüt canlı kapısı
   - Navlungo canlı kapısı
   - E-belge canlı kapısı
   - Seçili openId ve bağlı fatura/kargo durumu

5. Menü grupları sadeleştirilir:
   - Günlük menü yalnız güvenli ana işlemleri gösterir.
   - Geniş sistem yenileme, banka içeri alma/eşleştirme ve teknik API testleri "Gelişmiş / Teknik" altında kalır.

6. Menü adları davranışla uyumlu hale getirilir:
   - "Müşteri hafızasından sil" yerine "Müşteri hafızasını pasife al" önerilir.
   - "Paraşüt taslak payload test et" yerine "Seçili fatura payload dry-run yaz" önerilir.

## 8. Önerilen Öncelik

1. Önce `Kaydet ve ERP güncelle` full-system fallback kaldırılmalı.
2. Ardından Paraşüt parametreli menüler seçili satır wrapper'ına alınmalı.
3. Sonra fatura/kargo operasyon menülerine onay ve gate özeti eklenmeli.
4. Son aşamada menü metinleri sadeleştirilmeli.

## 9. Test Sonucu

| Test | Sonuç |
| --- | --- |
| PR #6 son yorumu okundu | Geçti |
| Menü item statik çıkarımı | Geçti |
| Callback var/yok kontrolü | Geçti |
| Duplicate public function kontrolü | Geçti |
| Canlı veri yazan callback testi | Çalıştırılmadı |
| Paraşüt/Navlungo/e-belge POST | Yapılmadı |
| Apps Script push/deploy | Yapılmadı |
| Sheet veri değişikliği | Yapılmadı |

## 10. Kalan Riskler

- Bu rapor statik analizdir; menülerin gerçek UI davranışı ayrıca güvenli test planıyla doğrulanmalıdır.
- Canlı kapılar açık olduğunda fatura/kargo menüleri gerçek operasyon yapabilir; düzeltme onayı gelene kadar bu menüler dikkatli kullanılmalıdır.
- Parametre isteyen Paraşüt menüleri seçili satır wrapper'ı olmadan operatör için güvenilir değildir.

## 11. Sonuç

PR #6 son yorumu gereği onay öncesi analiz tamamlandı. Bu turda kod değişikliği yapılmadı. Menü callback'lerinin tamamı mevcut olsa da güvenilir günlük kullanım için en az dört düzeltme gerekir: güvenli bağlam çözücü, parametreli menülere seçili satır wrapper'ı, `kaydetVeErpGuncelle_()` full-system fallback koruması ve operasyon menülerinde açık onay/gate özeti.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-05_panel_menu_kisayol_guvenilirlik_analiz_raporu.md`

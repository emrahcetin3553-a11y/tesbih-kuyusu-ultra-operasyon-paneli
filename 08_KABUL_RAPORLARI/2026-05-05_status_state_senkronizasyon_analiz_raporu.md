# 2026-05-05 Status / State Senkronizasyon Analiz Raporu

Bu rapor `00_CODEX_TALIMATLARI/AKTIF_GOREVLER.md` içindeki `STATÜ / STATE SENKRONİZASYONU` görevi için hazırlandı.

Bu turda canlı Apps Script davranışı değiştirilmedi, Paraşüt tahsilat API entegrasyonu yazılmadı, resmi e-belge gönderim modülü yazılmadı ve Navlungo gönderi/barkod akışı değiştirilmedi. Çalışma analiz ve güvenli senkronizasyon planıdır.

## 1. İncelenen Dosyalar

- `00_CODEX_TALIMATLARI/AKTIF_GOREVLER.md`
- `00_CODEX_TALIMATLARI/CHATGPT_CODEX_KOORDINASYON_TALIMATI.md`
- `00_CODEX_TALIMATLARI/CHATGPT_INCELEME_ERISIM_TALIMATI.md`
- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `02_SHEET_SISTEM/TESBIH_KUYUSU_MASTER_SHEET (17).xlsx`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 2. Statü Yazan Fonksiyonlar

| Fonksiyon | Satır | Etkilediği katman | Statü etkisi |
| --- | ---: | --- | --- |
| `patchLogicalStatusRow_` | 1022 | 02/03/04/05/06/08/09/15 | Seçili satır operasyonlarında durum alanlarını `Aktif`, `Arşiv`, `İptal`, `Hazır`, `Bekliyor` gibi değerlere çeker. |
| `applyOrderLifecycle_` | 1054 | 02/03/04/05/06/07/08/12 | Sipariş iptal/arşiv/geri al işlemini bağlı tablolar üzerinde uygular. |
| `orderExternalState_` | 1082 | 06/07/08 | Paraşüt fatura kilidi veya Navlungo gönderi izi varsa dış kayıt riskini tespit eder. |
| `kaydetUltraSiparisHizli_` | 1210 | 02/03/04/05/06/07/08/09/10/11/12 | Panel kaydından sonra hafif ERP güncelleme, e-belge hazırlık ve kontrol merkezi üretir. |
| `appendProductRowFromParsed_` | 1580 | 04 | Ürün satır durumunu korur veya hazır/kontrol durumuna alır. |
| `appendPaymentRowFromParsed_` | 1671 | 05 | Ödeme satırlarını ve teyit durumlarını yazar. |
| `autoCariBaglaForOpen_` | 1775 | 06/07/09 | Cari eşleşme durumunu ve Paraşüt cari ID bağlantısını hazırlar. |
| `rebuildOpenOrderForOpen_` | 2125 | 03 | Açık sipariş üst özetini yeniden kurar; fatura/kargo/e-belge üst statülerini yazar. |
| `ebelgeIstisnaHazirlaForOpen_` | 2282 | 11 | Resmi e-belge karar hazırlık durumunu ve resmi blokaj alanlarını yazar. |
| `kontrolMerkeziniGuncelleForOpen_` | 2321 | 12 | Açık siparişe bağlı blokajları yeniden yazar. |
| `parasutFaturaTaslakGonder_` | 2810 | 07/06 | Paraşüt create payload sonucu, `Paraşüt_Fatura_ID`, `Paraşüt_Durumu` ve `Gönderim_Kilidi` yazar. |
| `updateInvoiceGroupSendResult_` | 3649 | 06 | 07 sonucunu 06 fatura grubu özetine taşır. |
| `panelKontrolOzetiForOpen_` | 3686 | Panel/12 | Panel kontrol özetini 12_KONTROL_MERKEZI üzerinden okur. |
| `operationInvoiceForOpen_` | 4961 | 06/07 | Fatura oluşturma öncesi cari, kilit ve tekrar gönderim kontrolü yapar. |
| `operationCargoForOpen_` | 4982 | 08 | Navlungo post/barkod sonucuna göre kargo durumunu günceller. |
| `setKargoBekletForOpen_` | 5010 | 08 | Kargo bekletme durumunu bilinçli operasyon statüsü olarak yazar. |
| `finalizeOperationResult_` | 5026 | 03/07/11/12/Panel | Operasyon sonrası özetleri ve kontrol merkezini tekrar üretir. |
| `faturaKargoSonAsamaBlokajlari_` | 5048 | 03/Panel | Son aşama için sipariş kapanış blokajlarını üretir. |

## 3. Mevcut Statü Akışı

Kaydet ve ERP güncelle akışında panel payload `kaydetUltraSiparisHizli_` içine gelir. Yeni kayıtsa 02 staging satırı açılır; mevcut `openId` varsa mevcut queue satırı patch edilir. Sonrasında `hafifErpGuncelle_`, `ebelgeIstisnaHazirlaForOpen_` ve `kontrolMerkeziniGuncelleForOpen_` çalışır.

Paraşüt fatura create akışında `operationInvoiceForOpen_` önce 06 içindeki fatura gruplarını okur. 06 satırında `Paraşüt_Fatura_ID` veya `Gönderim_Kilidi` doluysa aynı fatura tekrar gönderilmez. Cari ID eksikse API'ye gitmeden durur. `parasutFaturaTaslakGonder_` 07 satırlarını okur, 07 içinde de aynı kilitleri kontrol eder. Canlı gönderim kapalıysa POST yapmadan payload yazar; canlı gönderim açıksa yeni `/sales_invoices` create çağrısı yapar. Başarıda 07 ve sonra `updateInvoiceGroupSendResult_` ile 06 güncellenir.

Kargo/Navlungo akışında `operationCargoForOpen_` 08 satırlarını açık sipariş bazında okur. `Navlungo_Post_Number` varsa yeni gönderi açmaz. Post var ama barkod URL yoksa yalnız barkod almayı dener. Post yoksa `navlungoKargoOlusturOnayli_` çağrılır. Bu akışa bu turda kod değişikliği yapılmadı.

Resmi e-belge hazırlık akışında `ebelgeIstisnaHazirlaForOpen_` 06 ve 07 satırlarından 11 katmanını üretir. Bu katman resmi e-Arşiv/e-Fatura gönderimi yapmaz; hazırlık ve karar katmanıdır.

## 4. Tespit Edilen Uyumsuzluklar

| Alan | Tespit | Risk |
| --- | --- | --- |
| 03 üst fatura özet statüsü | `rebuildOpenOrderForOpen_` fatura durumunu temel ürün/ödeme/fatura grubu üzerinden `Hazırlanabilir` veya `Blokaj` olarak kuruyor. 06/07 içindeki gerçek Paraşüt_Fatura_ID sonucunu daha açık üst statüye taşımıyor. | Fatura 07'de gönderilmişken 03 üst özet tam operasyon durumunu göstermeyebilir. |
| 06 ve 07 drift riski | `parasutFaturaTaslakGonder_` başarıda 07'yi ve sonra 06'yı güncelliyor. İki katman ayrı yazıldığı için bir yazma başarılı diğeri eksik kalırsa drift oluşabilir. | Aynı fatura için üst özet ile teknik satır farklı görünebilir. |
| Lifecycle işlemleri | `applyOrderLifecycle_` iptal modunda dış fatura/kargo izini blokluyor. Arşiv ve geri alma modlarında dış iz varken durum değişikliği daha geniş bir güvenlik kararı gerektiriyor. | Canlı fatura/kargo olmuş sipariş arşiv/geri alma statülerinde operasyonel belirsizlik doğabilir. |
| Kargo statü ikilisi | 08 içinde hem `Paket_Durumu` hem `Navlungo_Status` var. İkisinin hangi durumda birbirine üstün olduğu açık sözleşme olarak yazılmalı. | Panel ve kontrol merkezi farklı statü alanlarını farklı yorumlayabilir. |
| 11 resmi sonuç alanları | 11 katmanı hazırlık için yeterli, fakat resmi belge no/UUID/job/pdf gibi sonuç alanları yok. | Resmi e-belge modülüne geçişte yeni alanlar eklenmeden kapanış otomasyonu eksik kalır. |
| 05 tahsilat alanları | 05 ödeme doğrulama alanları var, fakat Paraşüt tahsilat ID/statü/kilit alanları yok. | Tam otomasyon hedefinde fatura oluşsa bile tahsilat işlenmiş mi net takip edilemez. |
| 12 blokaj kapanış mantığı | 12 açık sipariş bazında eski kayıtları temizleyip yeni blokajları yazıyor. Alanlar yeterli ama kapanış/temizlenme kuralları domain bazlı netleştirilmeli. | Çözülen blokaj ve bilinçli bekletme gibi durumlar kullanıcıya aynı risk gibi görünebilir. |
| 08 workbook kolon sırası | Kod sözleşmesinde 08 için `Kontrol_Uyarısı` en sonda. Yüklenen workbook snapshot'ında `Kontrol_Uyarısı`, kargo bekletme ve barkod yazdırma alanlarından önce duruyor. Header adları var, fakat sıra farklı. | Header adıyla yazan fonksiyonlarda sorun beklenmez; tam tablo rewrite yapan akışlarda kolon sırası dikkatle korunmalı. |

## 5. Tekrar Gönderim / Çift Fatura Riski Var mı?

Mevcut sistemde çift fatura riskini azaltan iki kilit katmanı var:

- 06 tarafında `operationInvoiceForOpen_`, `Paraşüt_Fatura_ID` veya `Gönderim_Kilidi` doluysa tekrar gönderimi durduruyor.
- 07 tarafında `parasutFaturaTaslakGonder_`, aynı fatura grubu için `Paraşüt_Fatura_ID` veya `Gönderim_Kilidi` varsa `Kilitli` sonucuyla duruyor.

Bu iki kontrol temel olarak doğru. Kalan risk, 06 ve 07 arasında statü drift oluşmasıdır. 07'de Paraşüt_Fatura_ID var ama 06 boş kalırsa üst operasyon eksik görünebilir. 06'da kilit var ama 07 satırları boş kalırsa payload/test akışları yanlış yorumlanabilir. Bu nedenle tam otomasyon öncesi API çağırmayan, sadece statü uyumunu sağlayan bir senkronizasyon adımı gereklidir.

## 6. Kargo/Navlungo Tarafına Dokunmadan Çözüm Önerisi

Önerilen güvenli çözüm, Navlungo fonksiyonlarını değiştirmeden açık sipariş bazlı statü senkronizasyon fonksiyonu eklemektir:

`senkronizeDurumForOpen_(openId)`

Bu fonksiyon yalnız Sheet okuma/yazma yapmalı, Paraşüt/Navlungo/e-belge/tahsilat API çağrısı yapmamalıdır.

Önerilen akış:

1. 06, 07, 08, 11, 05 ve 12 satırlarını `openId` ile oku.
2. 07'de gönderilmiş veya kilitli fatura varsa 06'ya `Paraşüt_Fatura_ID`, `Gönderim_Kilidi`, `Fatura_Durumu` olarak yansıt.
3. 06'da gönderilmiş veya kilitli fatura varsa 07 satırlarını `Kilitli` veya `Gönderildi` olarak uyumlu hale getir.
4. 08 `Navlungo_Post_Number` ve `Navlungo_Barcode_URL` alanlarından 03 `Kargo_Durumu` üst özetini hesapla.
5. 11 `Gönderim_Durumu` ve `Kontrol_Seviyesi` alanlarından 03 `E_Belge_Durumu` üst özetini hesapla.
6. 05 ödeme teyit ve banka eşleşme durumundan tahsilat modülü eklenene kadar 03/12 için yalnız ödeme hazırlık statüsü üret.
7. 12'de gerçek blokaj kalmadıysa açık siparişe bağlı eski blokajları kapat veya yeniden üretme.

Bu fonksiyon `kaydetUltraSiparisHizli_` sonunda, `parasutFaturaTaslakGonder_` başarı/hata sonucundan sonra ve `finalizeOperationResult_` içinde kontrol merkezinden önce çağrılabilir. Bu plan Navlungo gönderi oluşturma, barkod alma ve iptal akışını değiştirmez.

## 7. Gerekli Yeni Kolonlar veya Mevcut Kolonların Net Kullanımı

Mevcut kolon sahipliği:

| Sayfa | Kolon | Sahiplik |
| --- | --- | --- |
| 06_FATURA_GRUPLARI | `Fatura_Durumu` | Fatura grubunun iş durumu: Hazır, Gönderildi, Hata, Kilitli, Blokaj. |
| 06_FATURA_GRUPLARI | `Paraşüt_Fatura_ID` | Paraşüt sales invoice create sonucu. Boş ise fatura oluşmamış kabul edilir. |
| 06_FATURA_GRUPLARI | `Gönderim_Kilidi` | Aynı fatura grubunun tekrar gönderimini durduran üst kilit. |
| 07_PARASUT_FATURA | `Paraşüt_Durumu` | Paraşüt teknik satır durumu: Taslak Hazır, Blokaj, Gönderildi, Hata, Kilitli. |
| 08_KARGO_PAKETLERI | `Paket_Durumu` | Operasyonel kargo durumu: Hazır, Bekletiliyor, Gönderi Oluşturuldu, Barkod Alındı, İptal. |
| 08_KARGO_PAKETLERI | `Navlungo_Status` | Navlungo API sonuç durumu. |
| 11_EBELGE_ISTISNA | `Gönderim_Durumu` | Resmi e-belge hazırlık/gönderim karar durumu. |
| 12_KONTROL_MERKEZI | `Durum`, `Blokaj_Mı`, `İlgili_Modül` | Blokaj ve bilgilendirme kayıtlarının tek merkezi. |

Tahsilat ve resmi e-belge modülü öncesi önerilen yeni kolonlar:

- 05_ODEMELER: `Tahsilat_Durumu`, `Paraşüt_Tahsilat_ID`, `Tahsilat_Gönderim_Tarihi`, `Tahsilat_Gönderim_Kilidi`, `Tahsilat_Hata_Mesajı`
- 06_FATURA_GRUPLARI: `Tahsilat_Durumu`, `Paraşüt_Tahsilat_ID`, `Resmi_Fatura_Durumu`, `Resmi_Fatura_ID`, `Resmi_Fatura_No`, `Resmi_Fatura_UUID`
- 07_PARASUT_FATURA: `Tahsilat_Payload_JSON`, `Tahsilat_Response_JSON`, `Tahsilat_Durumu`
- 11_EBELGE_ISTISNA: `Resmi_E_Belge_ID`, `Resmi_E_Belge_No`, `Resmi_E_Belge_UUID`, `Trackable_Job_ID`, `Resmi_E_Belge_PDF_URL`, `Resmi_Gönderim_Tarihi`, `Resmi_Response_JSON`
- 12_KONTROL_MERKEZI: `Durum_Kaynağı`, `Çözüm_Kodu`

Bu kolonlar eklenmeden tahsilat ve resmi e-belge tam otomasyonuna geçilmesi önerilmez.

## 8. Test Edilmesi Gereken Senaryolar

Bu turda çalıştırılan test:

- Komut: `node 07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- Sonuç: `ok: true`
- Özet: `openRows=4`, `invoiceGroups=5`, `salesPostCalls=1`, `contactPostCalls=0`, `navlungoPostCalls=6`

Bu sonuç yalnız yerel testtir; canlı Google Sheets UI testi olarak kabul edilmemelidir.

Ek senaryolar:

1. 07'de `Paraşüt_Fatura_ID` var, 06 boş: senkronizasyon 06'yı kilitlemeli, ikinci POST yapılmamalı.
2. 06'da `Paraşüt_Fatura_ID` veya `Gönderim_Kilidi` var, 07 boş: senkronizasyon 07'yi kilitlemeli, ikinci POST yapılmamalı.
3. Paraşüt create başarılı: 07, 06, 03 ve 12 aynı sonucu göstermeli.
4. Paraşüt create hata: 07 hata, 06 hata, 12 kritik blokaj, 03 blokaj göstermeli.
5. Navlungo post ve barkod var: 08 statüleri korunmalı, 03 kargo üst özeti hazır/gönderildi olmalı.
6. Kargo bekletiliyor: 08 `Bekletiliyor`, 12'de kritik blokaj değil bilinçli bekletme bilgisi olmalı.
7. 11 resmi e-belge hazırlık blokajlı: 03 `E_Belge_Durumu` blokaj/hazırlık durumunu yansıtmalı.
8. Ödeme teyitli ama tahsilat modülü yok: 05 teyit durumu korunmalı, tahsilat bekliyor olarak yeni modül eklenene kadar resmi tahsilat tamamlandı denmemeli.

## 9. Kod Değişikliği Önerisi

Bu turda kod değişikliği yapılmadı. Önerilen sonraki kod çalışması:

| Dosya | Fonksiyon | Öneri |
| --- | --- | --- |
| `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs` | Yeni `senkronizeDurumForOpen_(openId)` | API çağrısı yapmadan 03/05/06/07/08/11/12 statülerini tek sipariş bazında uyumlu hale getir. |
| Aynı dosya | `parasutFaturaTaslakGonder_` | Başarı/hata sonucundan sonra statü senkronizasyonunu çağır. |
| Aynı dosya | `finalizeOperationResult_` | Kontrol merkezi üretmeden önce statü senkronizasyonunu çağır. |
| Aynı dosya | `applyOrderLifecycle_` | Dış fatura/kargo izi olan arşiv ve geri alma modları için güvenlik kararını netleştir. |
| Aynı dosya | `rebuildOpenOrderForOpen_` | 06/07/08/11 sonuç statülerini 03 üst özete daha net yansıt. |

Bu kod değişiklikleri kullanıcı/ChatGPT onayı olmadan uygulanmadı.

## 10. GitHub Commit Bilgisi ve Rapor Dosyası Yolu

| Alan | Sonuç |
| --- | --- |
| Aktif branch | `v6-5-production-candidate` |
| Apps Script yükleme | Yapılmadı. Bu görev analiz/plan göreviydi. |
| Canlı Sheet değişikliği | Yapılmadı. Workbook snapshot okundu. |
| Kod değişikliği | Yapılmadı. |
| Rapor dosyası | `08_KABUL_RAPORLARI/2026-05-05_status_state_senkronizasyon_analiz_raporu.md` |
| Günlük rapor | `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md` güncellendi. |
| Aktif görev dosyası | `00_CODEX_TALIMATLARI/AKTIF_GOREVLER.md` sonuç alanı güncellendi. |
| Commit | Commit/push sonrası final cevapta SHA ile bildirilecek. |

## 11. Kalan Riskler

- Canlı Apps Script UI testi yapılmadı.
- Canlı Sheet üzerinde veri değişikliği yapılmadı.
- Bu rapor davranış değişikliği değil, statü senkronizasyon tasarımıdır.
- Tam otomasyon için tahsilat ve resmi e-belge sonuç kolonları eklenmeden `tam kapandı` anlamına gelen tek statü kullanılmamalı.
- 08_KARGO_PAKETLERI workbook kolon sıra farkı sonraki sheet sözleşmesi kontrolünde netleştirilmeli.

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi: `08_KABUL_RAPORLARI/2026-05-05_status_state_senkronizasyon_analiz_raporu.md`

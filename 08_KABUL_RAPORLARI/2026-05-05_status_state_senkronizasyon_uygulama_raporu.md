# 2026-05-05 Statü / State Senkronizasyonu Uygulama Raporu

## 1. Neden düzenlendi?

03_ACIK_SIPARISLER, 06_FATURA_GRUPLARI, 07_PARASUT_FATURA, 08_KARGO_PAKETLERI, 11_EBELGE_ISTISNA ve 12_KONTROL_MERKEZI arasında aynı Açık_Sipariş_ID için statü drift riski vardı.

Özellikle Paraşüt_Fatura_ID veya Gönderim_Kilidi 06 ve 07 arasında farklı göründüğünde ikinci fatura POST riski oluşabiliyordu. Ayrıca Navlungo barkod/post durumu 08 içinde güncel olsa bile 03 üst özette aynı netlikte görünmeyebiliyordu.

## 2. Ne düzeltildi?

- API çağrısı yapmayan `senkronizeDurumForOpen_(openId)` fonksiyonu eklendi.
- 07 içinde Paraşüt_Fatura_ID veya Gönderim_Kilidi varsa 06 fatura grubuna yansıtıldı.
- 06 içinde Paraşüt_Fatura_ID veya Gönderim_Kilidi varsa 07 satırları tekrar gönderime kapalı hale getirildi.
- Cari ID geldikten sonra eski "Fatura grubu hazır değil" durumunun 06/07 üzerinde kalması engellendi.
- 08 Navlungo post/barkod/bekletme durumundan 03 Kargo_Durumu üst özeti üretildi.
- 11 e-belge hazırlık/blokaj durumundan 03 E_Belge_Durumu üst özeti üretildi.
- 05 ödeme kayıtları tahsilat tamamlandı anlamına çekilmedi; tahsilat modülü eklenmedi.
- Kontrol merkezi üretimi öncesinde senkronizasyon çağrı noktaları eklendi.

## 3. Hangi dosyalar değişti?

- `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs`
- `07_TEST_DOSYALARI/test_v6_5_ultra_operasyon.js`
- `00_CODEX_TALIMATLARI/AKTIF_GOREVLER.md`
- `08_KABUL_RAPORLARI/2026-05-05_status_state_senkronizasyon_uygulama_raporu.md`
- `08_KABUL_RAPORLARI/2026-05-05_codex_calisma_raporu.md`

## 4. Hangi fonksiyonlar eklendi/değişti?

Eklenen ana fonksiyon:

- `senkronizeDurumForOpen_(openId)`

Eklenen yardımcı fonksiyonlar:

- `assignSync_`
- `uniqSyncMessages_`
- `statusHas_`
- `invoiceSyncStatus_`
- `cargoSyncStatus_`
- `ebelgeSyncStatus_`
- `syncOpenMessages_`

Değiştirilen çağrı noktaları:

- `kaydetUltraSiparisHizli_`
- `hafifErpGuncelle_`
- `parasutFaturaTaslakGonder_`
- `parasutTaslakPayloadTestEt_`
- `operationInvoiceForOpen_`
- `finalizeOperationResult_`

Public wrapper:

- `senkronizeDurumForOpen(acikSiparisId)`

## 5. Apps Script'e yükleme yapıldı mı?

Evet.

Yüklenen Apps Script projesi:

- `1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77`

Yüklenen dosyalar:

- `appsscript.json`
- `cariSecDialog.html`
- `kargoBilgisiDialog.html`
- `odemeEkleDialog.html`
- `tesbih_kuyusu_v6_5_ultra_operasyon_core.js`
- `ultraSiparisPaneli.html`
- `urunEkleDialog.html`

Komut:

- `clasp push --force`

Push sonucu:

- `Pushed 7 files at 11:03:05.`

Remote readback:

- `clasp pull --force`
- `Pulled 7 files.`

SHA256 eşleşmesi:

- GitHub core: `062FA6202CE9856E852F4C80FE2F6957CFC6A6192D7806C2EF2CBBC447374ABE`
- Apps Script pull core: `062FA6202CE9856E852F4C80FE2F6957CFC6A6192D7806C2EF2CBBC447374ABE`
- Eşleşme: Evet

## 6. Sheet tarafında değişiklik yapıldı mı?

Hayır. Bu işlemde canlı Google Sheet üzerinde veri veya kolon değişikliği yapılmadı.

## 7. GitHub commit SHA nedir?

Kod ve test uygulama commit'i:

- `b9b2ee1` - `add v6.5 status synchronization`

Rapor ve görev dosyası commit'i bu rapor oluşturulduktan sonra ayrıca işlenecek ve sohbet çıktısında belirtilecek.

## 8. Hangi testler çalıştırıldı?

| Test | Sonuç |
| --- | --- |
| Core syntax kontrolü | `SYNTAX_OK` |
| Duplicate function kontrolü | `DUPLICATE_FUNCTION_OK count=458` |
| Üretim core + aktif panel yasak ifade taraması | `YASAK_IFADE_OK` |
| Node V6.5 test seti | Geçti |
| Git diff whitespace kontrolü | Hata yok, yalnız CRLF uyarısı |
| Apps Script upload SHA readback | Eşleşti |

Node V6.5 test çıktısı:

```json
{
  "ok": true,
  "openRows": 4,
  "invoiceGroups": 5,
  "addressRows": 5,
  "salesPostCalls": 1,
  "contactPostCalls": 0,
  "tokenRefreshCalls": 2,
  "navlungoAuthCalls": 10,
  "navlungoPostCalls": 6
}
```

Bu testteki POST sayaçları local test harness içindeki kontrollü simülasyon sayaçlarıdır; gerçek canlı API POST yapılmadı.

## 9. Test sonucu nedir?

Geçti.

Eklenen senaryolar:

- 07'de Paraşüt_Fatura_ID var, 06 boş: 06 kilitlendi ve ikinci POST engellendi.
- 06'da Paraşüt_Fatura_ID/Gönderim_Kilidi var, 07 hazır görünüyor: 07 tekrar gönderime kapandı.
- Paraşüt create başarılı akışında 07, 06 ve 03 statü uyumu doğrulandı.
- Paraşüt create hata akışında 07 hata, 06 hata ve 03 blokaj uyumu doğrulandı.
- Navlungo post ve barkod var: 03 Kargo_Durumu `Barkod Alındı` oldu.
- Kargo bekletiliyor: 03 Kargo_Durumu `Bekletiliyor` oldu.
- Ödeme varlığı tahsilat tamamlandı olarak yorumlanmadı; tahsilat API/modülü eklenmedi.

## 10. Canlı POST yapıldı mı?

Hayır.

- Paraşüt canlı POST yapılmadı.
- Navlungo canlı POST yapılmadı.
- e-Belge canlı POST yapılmadı.
- Apps Script'e kod yüklendi; hiçbir Apps Script fonksiyonu canlı API POST amacıyla çalıştırılmadı.

## 11. Kalan riskler nelerdir?

- Bu turda gerçek Google Sheets UI üzerinden manuel operatör testi yapılmadı.
- Resmi e-Arşiv/e-Fatura gönderim modülü hâlâ kapsam dışı.
- Tahsilat oluşturma/eşleştirme API modülü hâlâ kapsam dışı.
- Apps Script canlı proje SHA eşleşti, ancak canlı Sheet üzerinde yeni fonksiyon elle çalıştırılıp readback doğrulaması yapılmadı.

## 12. Bir sonraki önerilen adım nedir?

Ana Sheet üzerinde kontrollü bir Açık_Sipariş_ID seçilerek şu sıra ile canlı readback testi yapılmalı:

1. `senkronizeDurumForOpen("AS-...")`
2. 03/06/07/08/11/12 readback kontrolü
3. `kontrolMerkeziniGuncelle()`
4. 12_KONTROL_MERKEZI blokaj uyumu kontrolü

Bu canlı readback yapılmadan nihai canlı kabul yazılmamalıdır.

## 13. Codex sohbet çıktısı

Codex sohbet çıktısı / çalışma özeti şu dosyaya işlendi:

- `08_KABUL_RAPORLARI/2026-05-05_status_state_senkronizasyon_uygulama_raporu.md`


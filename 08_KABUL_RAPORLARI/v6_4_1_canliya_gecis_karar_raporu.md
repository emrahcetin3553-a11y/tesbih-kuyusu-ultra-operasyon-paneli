# Tesbih Kuyusu V6.4.1 Canlıya Geçiş Karar Raporu

Tarih: 2026-05-02

## Karar

V6.4.1 dosya, kod, Sheet şema, güvenlik kapısı, mock akış ve performans kapılarında güçlü üretim adayıdır. Ancak gerçek Apps Script UI üzerinde `v641GercekSheetKabulKontrolu()` çalıştırma kanıtı alınamadığı için bu rapor nihai "%95 canlı kabul tamamlandı" kararı vermez.

Karar: koşullu kabul adayı.

## Puanlama

| Alan | Puan |
|---|---:|
| Sheet şema uyumu | 100 |
| Panel UX ve otomasyon | 96 |
| Gerçek Sheet veri akışı | 88 |
| Paraşüt GET/dry-run hazırlığı | 88 |
| Navlungo payload hazırlığı | 92 |
| Performans | 96 |
| Güvenlik kapıları | 100 |
| Prompt 1-6 mimari uyum | 98 |

Kanıtlı genel canlı operasyon adayı puanı: 94/100.

Not: Gerçek Apps Script UI kabul helper ve Paraşüt GET testleri UI loglarıyla geçerse puan 96+ seviyesine çıkar.

## Kanıtlananlar

- Ana Apps Script projesinde tek aktif core V6.4.1 olarak doğrulandı.
- Uzak core SHA256 yerel core ile aynı.
- Sheet native Google Sheet olarak import edildi.
- Sheet header ve veri sözlüğü uyumu geçti.
- Yasak kelime, syntax ve duplicate function kontrolleri geçti.
- Panel HTML callbackleri gerçek fonksiyonlara bağlı.
- Mock kabul harness 02/04/05/06/07/08/09/10/11/12/14 akışını üretti.
- Tek sipariş ve toplu sipariş performans mantığı düzeltildi.
- `salesPostCalls = 0`; canlı Paraşüt POST yapılmadı.

## Kalan Kabul Kapıları

1. Apps Script UI veya Sheet menüsünden `v641GercekSheetKabulKontrolu()` çalıştır.
2. Yürütme günlüğünde hata olmadığını ve dönüş özetini kontrol et.
3. Aynı projede `parasutApiBaglantiTestiTam()` çalıştır.
4. Loglarda token/secret açık yazılmadığını, company GET ve ürün GET sonuçlarını kontrol et.
5. `12_KONTROL_MERKEZI` temiz senaryoda temiz, hatalı senaryoda doğru blokaj veriyor mu kontrol et.

## Çalıştırma Sırası

1. Google Sheet'i aç.
2. Apps Script editörde fonksiyon listesinden `onOpen` çalıştır veya Sheet'i yenile.
3. `TESBİH KUYUSU PANEL > Ultra sipariş paneli` ile manuel bir sipariş dene.
4. Kabul helper için Apps Script'ten `v641GercekSheetKabulKontrolu()` çalıştır.
5. Paraşüt güvenli GET için `parasutApiBaglantiTestiTam()` çalıştır.
6. `PARASUT_CANLI_GONDERIM`, `EBELGE_CANLI_GONDERIM`, `NAVLUNGO_CANLI_GONDERIM` değerleri `Hayır` kalmadan canlı gönderim deneme.

## Sonuç

Kod ve Sheet paketi üretim adayına yükseltildi. Nihai %95 canlı operasyon kabulü için eksik olan tek kritik kanıt, gerçek Apps Script UI çalıştırma ve canlı GET logudur. Bu kanıt alınmadan canlıya geçiş önerilmez.

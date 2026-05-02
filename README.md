# Tesbih Kuyusu Ultra Operasyon Paneli

Tesbih Kuyusu V6.4.5 Ultra Operasyon Paneli, Google Sheets ve Apps Script üzerinde sipariş girişini, ürün kalemlerini, ödeme teyidini, fatura gruplarını, Paraşüt satış faturası taslak hazırlığını, kargo paketini, müşteri hafızasını ve kontrol merkezini tek operasyon akışında yönetmek için hazırlanmıştır.

## Güncel Sürüm

- Aktif üretim adayı: V6.4.5 Ultra Operasyon
- Ana Apps Script core: `03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_4_5_ultra_operasyon_core.gs`
- Aktif Sheet dosyası: `02_SHEET_SISTEM/Tesbih_Kuyusu_V6_4_5_Ultra_Operasyon_Sheet.xlsx`
- Canlı gönderim kapıları varsayılan: kapalı
- Günlük ana akış: Ultra sipariş paneli; çoklu sipariş aynı panelde `Yeni sipariş ekle` ile yürür

## İş Mantığı

- Sipariş sahibi, WhatsApp üzerinden siparişi yazan kişidir.
- Ödeme yapan kişi, fatura kişisidir.
- Kargo alıcısı, sipariş sahibi ve fatura kişisinden farklı olabilir.
- Aynı açık siparişte birden fazla ödeme yapan varsa, her ödeme yapan için ayrı fatura grubu oluşur.
- Varsayılan olarak bir açık sipariş tek kargo paketine bağlanır.
- Aynı WhatsApp müşterisi ve aynı operasyon günü içinde, 16:00 öncesi sipariş aynı açık sipariş altında büyür.
- 16:00 sonrası yeni açık sipariş açılır; mevcut siparişe geç ekleme operatör onayı gerektirir.
- Kargo adresi veya alıcı değişirse sipariş bölünmez; `08_KARGO_PAKETLERI` son geçerli bilgiyi taşır.

## Katmanlar

- `02_WHATSAPP_KUYRUGU`: staging ve hızlı giriş alanı.
- `03_ACIK_SIPARISLER`: açık sipariş özeti.
- `04_URUN_KALEMLERI`: gerçek ürün kaynağı.
- `05_ODEMELER`: ödeme teyit kaynağı.
- `06_FATURA_GRUPLARI`: ödeme yapan kişi bazlı fatura grupları.
- `07_PARASUT_FATURA`: Paraşüt satış faturası taslak katmanı.
- `08_KARGO_PAKETLERI`: kargo paketi katmanı.
- `09_MUSTERI_HAFIZA`: güvenli öneri katmanı.
- `10_808_FINANS_ONIZLEME`: finans ve marj önizleme; resmi fatura üretmez.
- `11_EBELGE_ISTISNA`: e-belge, e-Arşiv, e-Fatura ve istisna hazırlık katmanı.
- `12_KONTROL_MERKEZI`: blokaj ve aksiyon merkezi.
- `14_BANKA_HAREKETLERI`: banka hareketi ödeme teyit yardımcısı.

## Paraşüt Ayrımı

Paraşüt tarafında `07_PARASUT_FATURA` sadece satış faturası taslak hazırlığıdır. Resmi e-belge/e-Arşiv/e-Fatura kararı `11_EBELGE_ISTISNA` katmanında tutulur. Canlı Paraşüt POST sadece `PARASUT_CANLI_GONDERIM = Evet` olduğunda ve kontrol merkezi temizken yapılmalıdır.

## Navlungo Durumu

Navlungo canlı gönderim kapısı varsayılan kapalıdır. `08_KARGO_PAKETLERI` ve payload hazırlığı mevcuttur; canlı gönderim sadece `NAVLUNGO_CANLI_GONDERIM = Evet` ile açılır.

## Banka / Rehber / WhatsApp Ham Veri Durumu

- Banka hareketleri fatura kaynağı değildir; sadece ödeme teyit yardımcısıdır.
- Rehber ve müşteri hafızası öneri üretir; ödeme yapan/fatura kişisini otomatik ezmez.
- WhatsApp ham mesajı korunur; normalize edilmiş yardımcı metin ayrıca üretilebilir.

## Kurulum Sırası

1. Sheet dosyasını Google Sheets olarak aç veya mevcut ana Sheet yapısına dikkatli taşı.
2. Apps Script projesine `03_APPS_SCRIPT_KOD` altındaki core ve HTML dosyalarını yükle.
3. Sheet'i yenile ve `TESBİH KUYUSU PANEL` menüsünü kontrol et.
4. `sistemKolonlariniHazirla()` ve `otomatikGorunumuDuzenle()` çalıştır.
5. Ultra sipariş panelinden test siparişi gir.
6. `parasutApiBaglantiTestiTam()` ile canlı GET güvenli testini çalıştır.
7. Canlı kapılar `Hayır` kalmadan canlı fatura veya kargo gönderimi deneme.

## Canlıya Geçiş Öncesi Kontrol Listesi

- Sheet kolon uyumu geçti.
- Veri sözlüğü tüm gerçek kolonları kapsıyor.
- `PARASUT_CANLI_GONDERIM = Hayır`.
- `EBELGE_CANLI_GONDERIM = Hayır`.
- `NAVLUNGO_CANLI_GONDERIM = Hayır`.
- Mock test sonucu geçerli.
- Gerçek Apps Script UI kabul testi kullanıcı ana Sheet ortamında son kanıt olarak çalıştırılmalıdır.
- Paraşüt GET testi logları temiz.
- `12_KONTROL_MERKEZI` canlıya geçiş öncesi temiz.

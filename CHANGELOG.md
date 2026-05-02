# Changelog

## 2026-05-02 16:31 - V6.4.3 gerçek panel düzeltmesi

- Ultra Sipariş Paneli tek merkez akışına göre yeniden güçlendirildi.
- Müşteri telefonu/adı girilince kargo varsayılanları, ödeme yapan girilince fatura/cari bloğu otomatik oluşacak şekilde düzeltildi.
- TCKN boş gerçek kişi için `11111111111` ve `e-Arşiv` varsayılanı güçlendirildi.
- Kontrol Et sahte OK vermeyecek şekilde gerçek `12_KONTROL_MERKEZI` sonucuna bağlandı.
- Kargo açık sipariş hazırlık blokajı ile son gönderim kapanış kontrolü ayrıldı.
- Canlı Apps Script projesine V6.4.3 core ve güncel panel dosyaları yüklendi.

## 2026-05-02 15:30 - V6.4.2 üretim kabul hazırlığı

- V6.4.2 core ve Sheet aday dosyaları V6.4.1 korunarak ayrı üretildi.
- Günlük menü 7 ana operatör komutuna indirildi; teknik komutlar `Gelişmiş / Teknik` alt menüsüne alındı.
- Açık sipariş kargo hazırlığı, kargo bilgileri tam ise gereksiz blokaj üretmeyecek şekilde düzeltildi.
- Paraşüt taslak ID bekleyen e-belge satırları blokaj yerine hazırlık durumunda bırakıldı; canlı e-belge kapısı kapalı kalıyor.
- V6.4.2 mock, Sheet builder, syntax, header ve veri sözlüğü kontrolleri için yeni rapor seti eklendi.

## 2026-05-02 12:00 - V6.4.1 GitHub arşiv paketi

- Temiz GitHub klasör yapısı oluşturuldu.
- Aktif V6.4.1 core, HTML panelleri, Sheet dosyası, test dosyaları ve kabul raporları ayrıştırıldı.
- Secret içermeyen `.example` ve hazırlık notları eklendi.

## 2026-05-02 11:56 - V6.4.1 kabul raporları

- Sheet gerçek kabul raporu eklendi.
- Panel gerçek test raporu eklendi.
- Paraşüt GET hazırlık raporu eklendi.
- Performans ve toplu sipariş raporları eklendi.
- Kod kontrol ve canlıya geçiş karar raporu eklendi.

## 2026-05-02 11:40 - V6.4.1 kod düzeltmesi

- Gümüş satırı kontrolünde kapsam dışı değişken hatası düzeltildi.
- Toplu sipariş kaydında ağır ERP yenileme tek toplu adıma indirildi.
- Mock ölçümde `salesPostCalls = 0` korundu.

## 2026-05-02 10:52 - V6.4 Ultra Operasyon adayı

- Ultra sipariş paneli, toplu sipariş paneli, cari seçim ve ürün/ödeme/kargo dialogları üretildi.
- Paraşüt, Navlungo ve banka hareketi hazırlık akışları eklendi.
- İlk V6.4 mock test ve rapor seti üretildi.

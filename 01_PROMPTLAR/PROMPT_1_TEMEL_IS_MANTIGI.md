# Prompt 1 - Temel İş Mantığı

Tesbih Kuyusu sipariş bazlı çalışır. Sipariş sahibi WhatsApp üzerinden siparişi yazan kişidir. Ödeme yapan kişi fatura kişisidir. Kargo alıcısı farklı kişi olabilir. Sistem müşteri bazlı değil, açık sipariş bazlı ilerler.

Korunan kararlar:

- Fatura kişisi her zaman ödeme yapan kişidir.
- Aynı siparişte farklı ödeme yapan kişiler varsa ayrı fatura grupları oluşur.
- Kargo alıcısı ödeme yapan kişiyle karıştırılmaz.
- 808 finans önizleme resmi fatura motoru değildir.

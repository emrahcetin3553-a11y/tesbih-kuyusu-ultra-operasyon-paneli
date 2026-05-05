# Proje Durum Raporu

Guncel aday: Tesbih Kuyusu V6.5 Ultra Operasyon Paneli

| Kontrol | Durum | Not |
|---|---|---|
| Aktif branch | `v6-5-production-candidate` | PR #6 uzerinde ilerliyor |
| `main` guncel mi? | Hayir | Canli aday kodu bu branch uzerindedir |
| Apps Script core | Eslesiyor | Repo core ve canli pull SHA256 eslesti |
| Ultra panel | Kosullu hazir | Panel aktif; gercek UI kabul testleri kullanici tarafinda kanitlanmali |
| Parasut fatura create | Calisir durumda | Yeni sales invoice create payload akisi test setinde geciyor |
| Parasut canli kapi | Acik olabilir | Canli Sheet degerleri kullanici operasyonuna baglidir; rastgele POST calistirilmaz |
| Navlungo gonderi | Calisir durumda | Canli gonderi ve barkod akisi mevcut |
| Navlungo barcode type | Duzeltildi | `NAVLUNGO_DEFAULT_BARCODE_TYPE = pdf` readback alindi |
| 08 kolon sozlesmesi | Duzeltildi | Kod baslik sirasi canli 08 sirasi ile hizalandi |
| 13 veri sozlugu | Duzeltildi | Eksik 08 kargo bekletme ve barkod yazdirma kolonlari eklendi |
| API response saklama riski | Izleniyor | Yeni kayitlarda hassas alan maskeleme guclendirildi; eski hucreler bu turda temizlenmedi |
| V6.4.x dosyalari | Referans | Aktif Apps Script kaynagi degildir |
| Gercek UI 10 siparis testi | Yapilmadi | Bu turda canli UI testi calistirilmadi |

## Son Karar

V6.5 canli operasyon adayi guclendirildi. Bu turda canli Sheet uzerinde ayar ve veri sozlugu duzeltmeleri yapildi, Apps Script core canli projeye yuklendi ve SHA readback alindi. Nihai canli kabul icin gercek UI uzerinden siparis kabul senaryolari ayrica kanitlanmalidir.

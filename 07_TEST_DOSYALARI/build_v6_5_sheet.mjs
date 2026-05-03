import fs from "node:fs/promises";
import vm from "node:vm";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "02_SHEET_SISTEM/Tesbih_Kuyusu_V6_4_5_Ultra_Operasyon_Sheet.xlsx";
const outputPath = "02_SHEET_SISTEM/Tesbih_Kuyusu_V6_5_Ultra_Operasyon_Sheet.xlsx";
const codePath = "03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs";

const code = await fs.readFile(codePath, "utf8");
const sandbox = { Date, JSON, Math, Number, String, Object, Array, RegExp };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: codePath });

const HEADERS = sandbox.TK6.HEADERS;
const SHEETS = sandbox.TK6.CFG.sheets;

function getSheet(workbook, name) {
  try { return workbook.worksheets.getItem(name); } catch (err) { return null; }
}

function ensureSheet(workbook, name) {
  let sheet = getSheet(workbook, name);
  if (!sheet) sheet = workbook.worksheets.add(name);
  return sheet;
}

function recreateSheet(workbook, name) {
  const current = getSheet(workbook, name);
  if (current) current.delete();
  return workbook.worksheets.add(name);
}

function values(sheet) {
  const used = sheet.getUsedRange();
  return used ? used.values : [[]];
}

function writeTable(workbook, sheetName, rows) {
  const sheet = recreateSheet(workbook, sheetName);
  const width = Math.max(...rows.map(r => r.length));
  const used = values(sheet);
  const oldHeight = Math.max(1, used.length);
  const oldWidth = Math.max(1, ...used.map(r => r.length));
  const matrix = rows.map(r => {
    const copy = r.slice();
    while (copy.length < width) copy.push("");
    return copy;
  });
  sheet.getRangeByIndexes(0, 0, oldHeight, Math.max(oldWidth, width)).clear();
  sheet.getRangeByIndexes(0, 0, matrix.length, width).values = matrix;
}

function writeExactHeaders(workbook, sheetName, headers) {
  const sheet = ensureSheet(workbook, sheetName);
  const used = values(sheet);
  const oldHeight = Math.max(1, used.length);
  const oldWidth = Math.max(1, ...used.map(r => r.length), headers.length);
  sheet.getRangeByIndexes(0, 0, oldHeight, oldWidth).clear();
  sheet.getRangeByIndexes(0, 0, 1, headers.length).values = [headers];
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

for (const [key, sheetName] of Object.entries(SHEETS)) {
  if (HEADERS[key]) writeExactHeaders(workbook, sheetName, HEADERS[key]);
}

writeTable(workbook, SHEETS.guide, [
  ["TESBİH KUYUSU V6.5 ULTRA OPERASYON", ""],
  ["Günlük giriş", "Ultra sipariş paneli; çoklu sipariş aynı panelde Yeni sipariş ekle ile yapılır"],
  ["Ürün kaynağı", "04_URUN_KALEMLERI"],
  ["Ödeme kaynağı", "05_ODEMELER"],
  ["Fatura kişisi", "Ödeme yapan kişi"],
  ["Kargo kaynağı", "08_KARGO_PAKETLERI"],
  ["Panel sırası", "Müşteri, Kargo, Ürünler, Ödemeler, Fatura/Cari, Kontrol Özeti, Aksiyonlar"],
  ["Banka hareketi", "14_BANKA_HAREKETLERI yalnız ödeme teyit yardımcısıdır"],
  ["Canlı Paraşüt kapısı", "PARASUT_CANLI_GONDERIM = Hayır varsayılan kalır"],
  ["Canlı e-belge kapısı", "EBELGE_CANLI_GONDERIM = Hayır varsayılan kalır"],
  ["Canlı kargo kapısı", "NAVLUNGO_CANLI_GONDERIM = Hayır varsayılan kalır"],
]);

writeTable(workbook, SHEETS.settings, [
  ["Ayar_Kodu", "Ayar_Değeri", "Açıklama", "Zorunlu_Mu", "Son_Güncelleme", "Not"],
  ["PARASUT_CANLI_GONDERIM", "Hayır", "Evet olmadan canlı Paraşüt POST yapılmaz", "Evet", "", ""],
  ["PARASUT_BATCH_LIMIT", "3", "Tek çalıştırmada işlenecek Paraşüt fatura grubu limiti", "Evet", "", ""],
  ["PARASUT_PRODUCT_ID_MAP_JSON", "{}", "Ürün -> Paraşüt ürün ID map JSON", "Evet", "", "Script Properties önceliklidir"],
  ["PARASUT_CONTACT_ID_MAP_JSON", "{}", "Yardımcı cari ID cache", "Hayır", "", "Kesin eşleşme kaynağı değildir"],
  ["PARASUT_CARI_CANLI_OLUSTURMA", "Hayır", "Evet olmadan Paraşüt cari POST yapılmaz", "Evet", "", "Cari oluşturma panelde dry-run kalır"],
  ["EBELGE_CANLI_GONDERIM", "Hayır", "Evet olmadan e-Belge canlı gönderimi yapılmaz", "Evet", "", ""],
  ["NAVLUNGO_CANLI_GONDERIM", "Hayır", "Evet olmadan kargo API gönderimi yapılmaz", "Evet", "", ""],
  ["NAVLUNGO_ENV", "QA", "Navlungo ortamı", "Evet", "", "QA veya LIVE"],
  ["NAVLUNGO_SENDER_ADDRESS_ID", "", "Navlungo kayıtlı gönderici adres ID", "Hayır", "", "Script Properties önceliklidir"],
  ["NAVLUNGO_DEFAULT_CARRIER_ID", "1", "Varsayılan Navlungo taşıyıcı ID", "Evet", "", ""],
  ["NAVLUNGO_DEFAULT_POST_TYPE", "2", "Varsayılan Navlungo gönderi tipi", "Evet", "", ""],
  ["NAVLUNGO_DEFAULT_DESI", "1", "Varsayılan Navlungo desi", "Evet", "", ""],
  ["NAVLUNGO_DEFAULT_PACKAGE_COUNT", "1", "Varsayılan Navlungo paket adedi", "Evet", "", ""],
  ["NAVLUNGO_CARRIER_ID_MAP_JSON", "{}", "Kargo firması -> Navlungo carrier_id map JSON", "Hayır", "", ""],
  ["SISTEM_OPERASYON_SAATI_KAPANIS", "16:00", "Operasyon kapanış saati", "Evet", "", ""],
  ["TCKN_VARSAYILAN_GERCEK_KISI", "11111111111", "Gerçek kişi TCKN boşsa uygulanabilir", "Evet", "", ""],
  ["BANKA_HAREKET_MODULU_AKTIF", "Evet", "14 banka hareketi teyit katmanı", "Evet", "", ""],
  ["VARSAYILAN_KARGO_FIRMASI", "Aras Kargo", "Kargo firması önerisi", "Hayır", "", ""],
  ["KARGO_UCRETI_STANDART", "125", "808 finans ön izleme için varsayılan maliyet", "Hayır", "", ""],
]);

function columnPurpose(sheetName, header) {
  const h = String(header || "");
  if (/ID$|_ID$/.test(h)) return "Kayıtları benzersiz bağlamak ve ilişkileri kurmak";
  if (/Tarih|Günü|Saati|Kapanış/.test(h)) return "Operasyon tarih ve zaman bilgisini tutmak";
  if (/Tel|Telefon/.test(h)) return "Telefon bilgisini normalize ederek eşleşme ve iletişimde kullanmak";
  if (/Tutar|Toplam|Fark|Fiyat|KDV|Gram|Puan|Limit|Miktar/.test(h)) return "Finansal, miktarsal veya kontrol hesaplamasını taşımak";
  if (/Durumu|Durum|Kilidi|Uygun|Blokaj|Onayı|Teyidi/.test(h)) return "Süreç durumunu, kilidi veya operatör onayını göstermek";
  if (/Adres|İl|İlçe|Alıcı|Kargo/.test(h)) return "Kargo ve adres operasyon bilgisini taşımak";
  if (/Cari|Fatura|Paraşüt/.test(h)) return "Fatura, cari ve Paraşüt taslak hazırlığını desteklemek";
  if (/Not|Uyarı|Mesaj|Açıklama|Aksiyon/.test(h)) return "Operatöre kontrol, uyarı veya aksiyon bilgisi vermek";
  if (sheetName === SHEETS.dictionary) return "Veri sözlüğü alanını tanımlamak";
  if (sheetName === SHEETS.settings) return "Sistem ayarını tanımlamak";
  return "V6.5 Ultra Operasyon kolon sözleşmesi kapsamında veri alanını taşımak";
}

function columnSource(sheetName, header) {
  if (sheetName === SHEETS.queue) return "Operatör girişi / Ultra panel / onEdit";
  if (sheetName === SHEETS.open) return "Açık sipariş motoru";
  if (sheetName === SHEETS.items) return "Ultra panel / Ürün ekle / hızlı ürün parser";
  if (sheetName === SHEETS.payments) return "Ultra panel / Ödeme ekle / banka teyit yardımcısı";
  if (sheetName === SHEETS.invoiceGroups) return "Fatura grubu motoru / cari hazırlık";
  if (sheetName === SHEETS.parasut) return "Paraşüt taslak hazırlık motoru";
  if (sheetName === SHEETS.cargo) return "Ultra panel / Kargo bilgisi gir / kargo motoru";
  if (sheetName === SHEETS.memory) return "Müşteri hafıza motoru";
  if (sheetName === SHEETS.finance) return "808 finans ön izleme motoru";
  if (sheetName === SHEETS.ebelge) return "e-Belge ve istisna hazırlık motoru";
  if (sheetName === SHEETS.control) return "Kontrol merkezi motoru";
  if (sheetName === SHEETS.dictionary) return "Koddan üretilen kolon sözlüğü";
  if (sheetName === SHEETS.bank) return "Manuel banka hareketi içeri alma";
  if (sheetName === SHEETS.settings) return "Operatör / Script Properties";
  return "Sistem";
}

function isRequired(header) {
  return /ID$|_ID$|Adı|Tutar|Tel|Durum|Kodu|Ayar/.test(String(header || "")) ? "Evet" : "Hayır";
}

const dictionaryRows = [["Sayfa", "Kolon", "Kaynak", "Amaç", "Zorunlu_Mu", "Not"]];
for (const [key, sheetName] of Object.entries(SHEETS)) {
  if (!HEADERS[key]) continue;
  HEADERS[key].forEach(header => {
    dictionaryRows.push([
      sheetName,
      header,
      columnSource(sheetName, header),
      columnPurpose(sheetName, header),
      isRequired(header),
      "V6.5 Ultra Operasyon kolon sözleşmesi"
    ]);
  });
}
writeTable(workbook, SHEETS.dictionary, dictionaryRows);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 200 },
  summary: "formula error scan"
});
console.log(errors.ndjson);
console.log("OUTPUT=" + outputPath);



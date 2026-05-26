const fs = require("fs");
const vm = require("vm");

const corePath = "03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_4_5_ultra_operasyon_core.gs";
const code = fs.readFileSync(corePath, "utf8");

class MockRange {
  constructor(sheet, row, col, numRows, numCols) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows || 1;
    this.numCols = numCols || 1;
  }
  getSheet() { return this.sheet; }
  getRow() { return this.row; }
  getNumRows() { return this.numRows; }
  getValues() {
    const out = [];
    for (let r = 0; r < this.numRows; r++) {
      const row = [];
      for (let c = 0; c < this.numCols; c++) row.push(this.sheet.getCell(this.row + r, this.col + c));
      out.push(row);
    }
    return out;
  }
  setValues(values) {
    values.forEach((row, r) => row.forEach((value, c) => this.sheet.setCell(this.row + r, this.col + c, value)));
    return this;
  }
  getValue() { return this.sheet.getCell(this.row, this.col); }
  setValue(value) { this.sheet.setCell(this.row, this.col, value); return this; }
  clearContent() {
    for (let r = 0; r < this.numRows; r++) for (let c = 0; c < this.numCols; c++) this.sheet.setCell(this.row + r, this.col + c, "");
    return this;
  }
  clear() { return this.clearContent(); }
  setWrap() { return this; }
}

class MockSheet {
  constructor(name) { this.name = name; this.data = []; }
  getName() { return this.name; }
  getLastRow() {
    for (let r = this.data.length; r >= 1; r--) if ((this.data[r - 1] || []).some(v => v !== "" && v !== null && v !== undefined)) return r;
    return 0;
  }
  getLastColumn() {
    let max = 0;
    this.data.forEach(row => {
      for (let i = row.length; i >= 1; i--) if (row[i - 1] !== "" && row[i - 1] !== null && row[i - 1] !== undefined) { max = Math.max(max, i); break; }
    });
    return max;
  }
  getRange(row, col, numRows, numCols) { return new MockRange(this, row, col, numRows || 1, numCols || 1); }
  getDataRange() { return this.getRange(1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn())); }
  getCell(row, col) { return ((this.data[row - 1] || [])[col - 1] === undefined) ? "" : this.data[row - 1][col - 1]; }
  setCell(row, col, value) {
    while (this.data.length < row) this.data.push([]);
    while (this.data[row - 1].length < col) this.data[row - 1].push("");
    this.data[row - 1][col - 1] = value;
  }
  setFrozenRows() { return this; }
  autoResizeColumns() { return this; }
  autoResizeRows() { return this; }
}

class MockSpreadsheet {
  constructor() { this.sheets = {}; this.activeRange = null; }
  getSheetByName(name) { return this.sheets[name] || null; }
  insertSheet(name) { const sh = new MockSheet(name); this.sheets[name] = sh; return sh; }
  getActiveRange() { return this.activeRange; }
  setActiveRange(range) { this.activeRange = range; }
}

const props = {
  PARASUT_CLIENT_ID: "client",
  PARASUT_CLIENT_SECRET: "secret",
  PARASUT_COMPANY_ID: "company",
  PARASUT_ACCESS_TOKEN: "expired",
  PARASUT_REFRESH_TOKEN: "refresh",
  PARASUT_ACCESS_TOKEN_EXPIRES_AT: "2000-01-01T00:00:00.000Z",
  PARASUT_CALLBACK_URL: "https://callback",
  PARASUT_PRODUCT_ID_MAP_JSON: JSON.stringify({
    "Tesbih": "1066258492",
    "Pirin? P?sk?l": "1066258493",
    "G?m??": "1066258494",
    "G?m?? ???ilik": "1066258511",
    "Tesbih Kutusu": "1066258512",
    "Kargo Hizmet Bedeli": "1066258513"
  }),
  PARASUT_CONTACT_ID_MAP_JSON: "{}"
};

let salesPostCalls = 0;
let tokenRefreshCalls = 0;
function response(status, body) {
  return { getResponseCode: () => status, getContentText: () => JSON.stringify(body || {}) };
}

const ss = new MockSpreadsheet();
const menuItems = [];
const sandbox = {
  console, Date, JSON, Math, Number, String, Object, Array, RegExp, encodeURIComponent,
  SpreadsheetApp: {
    getActiveSpreadsheet: () => ss,
    getUi: () => ({
      createMenu: () => ({
        addItem(label, fn) { menuItems.push({ label, fn }); return this; },
        addSubMenu() { return this; },
        addToUi() { return this; }
      }),
      showModalDialog() {}
    })
  },
  HtmlService: { createHtmlOutputFromFile: () => ({ setWidth() { return this; }, setHeight() { return this; } }) },
  LockService: { getDocumentLock: () => ({ tryLock: () => true, releaseLock() {} }) },
  Session: { getScriptTimeZone: () => "Europe/Istanbul" },
  Utilities: {
    formatDate(date, tz, pattern) {
      const d = new Date(date);
      const yyyy = String(d.getFullYear()).padStart(4, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return pattern === "yyyyMMdd" ? `${yyyy}${mm}${dd}` : `${yyyy}-${mm}-${dd}`;
    }
  },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || "", setProperty: (k, v) => { props[k] = v; } }) },
  UrlFetchApp: {
    fetch(url, options) {
      const method = String((options && options.method) || "get").toLowerCase();
      if (url.includes("/oauth/token")) {
        tokenRefreshCalls++;
        return response(200, { access_token: "token-" + tokenRefreshCalls, refresh_token: "refresh-" + tokenRefreshCalls, expires_in: 7200 });
      }
      if (method === "post" && url.includes("/sales_invoices")) {
        salesPostCalls++;
        return response(201, { data: { id: "INV-1", type: "sales_invoices" } });
      }
      if (method === "post" && url.includes("/contacts")) return response(201, { data: { id: "C-NEW", type: "contacts" } });
      if (url.includes("/products/")) return response(200, { data: { id: "P-1", type: "products", attributes: { name: "Tesbih" } } });
      if (url.includes("/contacts/")) return response(200, { data: { id: "C-1", type: "contacts", attributes: { name: "MEHMET NURI ?ETIN", tax_number: "11111111111", phone: "+905551112233" } } });
      if (url.includes("/contacts?")) return response(200, { data: [{ id: "C-1", type: "contacts", attributes: { name: "MEHMET NURI ?ETIN", tax_number: "11111111111", phone: "+905551112233" } }] });
      return response(200, { data: [] });
    }
  },
  Logger: { logs: [], log(msg) { this.logs.push(String(msg)); } }
};

vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: corePath });
const H = sandbox.TK6.H;
const HEADERS = sandbox.TK6.HEADERS;
const CFG = sandbox.TK6.CFG;

function assert(condition, message) { if (!condition) throw new Error(message); }
function assertThrows(fn, expected, message) {
  try {
    fn();
  } catch (err) {
    if (!expected || String(err.message || err).includes(expected)) return;
    throw new Error(message + " | Beklenen: " + expected + " | Gelen: " + (err.message || err));
  }
  throw new Error(message);
}
function looseName(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/İ/g, "I")
    .replace(/I/g, "I")
    .replace(/Ç/g, "C")
    .replace(/Ş/g, "S")
    .replace(/Ü/g, "U")
    .replace(/Ö/g, "O")
    .replace(/Ğ/g, "G")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]+/g, " ");
}
function hasNameParts(value, parts) {
  const key = looseName(value);
  return parts.every(part => key.includes(part));
}
function setRows(sheetName, headers, objects) {
  const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sh.data = [headers.slice()];
  objects.forEach(obj => sh.data.push(headers.map(h => obj[h] === undefined ? "" : obj[h])));
}
function getRows(sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh || sh.getLastRow() < 2) return [];
  const headers = sh.data[0];
  return sh.data.slice(1).filter(row => row.some(v => v !== "" && v !== null && v !== undefined)).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] === undefined ? "" : row[i]; });
    return obj;
  });
}
function patchRows(sheetName, key, value, patch) {
  const sh = ss.getSheetByName(sheetName);
  const headers = sh.data[0];
  const k = headers.indexOf(key);
  sh.data.slice(1).forEach(row => {
    if (row[k] === value) Object.entries(patch).forEach(([name, val]) => { row[headers.indexOf(name)] = val; });
  });
}

sandbox.sistemKolonlariniHazirla();
setRows(CFG.sheets.settings, ["Ayar_Kodu", "Ayar_De?eri", "A??klama", "Zorunlu_Mu", "Son_G?ncelleme", "Not"], [
  { "Ayar_Kodu": "PARASUT_CANLI_GONDERIM", "Ayar_De?eri": "Hay?r" },
  { "Ayar_Kodu": "EBELGE_CANLI_GONDERIM", "Ayar_De?eri": "Hay?r" },
  { "Ayar_Kodu": "NAVLUNGO_CANLI_GONDERIM", "Ayar_De?eri": "Hay?r" },
  { "Ayar_Kodu": "PARASUT_BATCH_LIMIT", "Ayar_De?eri": "3" },
  { "Ayar_Kodu": "SISTEM_OPERASYON_SAATI_KAPANIS", "Ayar_De?eri": "16:00" },
  { "Ayar_Kodu": "TCKN_VARSAYILAN_GERCEK_KISI", "Ayar_De?eri": "11111111111" },
  { "Ayar_Kodu": "PARASUT_PRODUCT_ID_MAP_JSON", "Ayar_De?eri": "{}" }
]);

sandbox.onOpen();
menuItems.forEach(item => assert(typeof sandbox[item.fn] === "function", "Men? fonksiyonu ba?l? de?il: " + item.fn));

setRows(CFG.sheets.queue, HEADERS.queue, [
  { [H.PHONE]: "05551112233", [H.OWNER]: "Emrah", [H.FAST_PRODUCTS]: "2 tesbih 350", [H.FAST_PAYMENTS]: "Mehmet Nuri ?etin 700", [H.FAST_CARGO]: "al?c? Ay?e tel 05351112233 izmir menderes adres Cumhuriyet mah" }
]);
const qSheet = ss.getSheetByName(CFG.sheets.queue);
sandbox.onEdit({ source: ss, range: qSheet.getRange(2, 5, 1, 1) });
let queueRows = getRows(CFG.sheets.queue);
const openId = queueRows[0][H.OPEN_ID];
assert(openId, "02 a??k sipari? ID ?retmedi");

let itemRows = getRows(CFG.sheets.items).filter(r => r[H.OPEN_ID] === openId);
assert(itemRows.length === 1, "H?zl? ?r?n 04 sat?r? ?retmedi");
assert(itemRows[0][H.PRODUCT] === "Tesbih", "?r?n normalize edilmedi");
assert(Number(itemRows[0][H.QTY]) === 2, "?r?n miktar? hatal?");
assert(Number(itemRows[0][H.LINE_GROSS]) === 700, "?r?n toplam? hatal?");
assert(itemRows[0][H.PARASUT_PRODUCT_ID] === "1066258492", "Para??t ?r?n ID otomatik gelmedi");

let paymentRows = getRows(CFG.sheets.payments).filter(r => r[H.OPEN_ID] === openId);
assert(paymentRows.length === 1, "H?zl? ?deme 05 sat?r? ?retmedi");
assert(hasNameParts(paymentRows[0][H.PAYER], ["MEHMET", "ETIN"]), "?deme yapan normalize edilmedi");

let cargoRows = getRows(CFG.sheets.cargo).filter(r => r[H.OPEN_ID] === openId);
assert(cargoRows.length === 1, "H?zl? kargo 08 sat?r? ?retmedi");
sandbox.kargoBilgisiKaydet({ acikSiparisId: openId, kargoAlicisi: "Ay?e", kargoTel: "05351112233", il: "?zmir", ilce: "Menderes", adres: "Yeni adres", kargoFirmasi: "Aras Kargo" });
cargoRows = getRows(CFG.sheets.cargo).filter(r => r[H.OPEN_ID] === openId);
assert(cargoRows.length === 1 && cargoRows[0][H.ADDRESS] === "Yeni adres", "Adres de?i?ince 08 g?ncellenmedi");
assert(cargoRows[0][H.PACKAGE_STATUS] !== "Blokaj", "Kargo hazirlik satiri gereksiz blokajda kaldi");
assert(!String(cargoRows[0][H.WARN] || "").includes("kapanmadan"), "Kargo haz?rl???nda kapan?? ?ncesi yanl?? blokaj kald?");

sandbox.urunEkleKaydet({ acikSiparisId: openId, urunAdi: "kutu", miktar: 1, birim: "Adet", birimFiyatKdvDahil: 50, kdvOrani: 0.20 });
sandbox.odemeEkleKaydet({ acikSiparisId: openId, odemeYapan: "Ay?e Kaya", odemeTutari: 50, odemeTeyitKaynagi: "Manuel" });
sandbox.hafifErpGuncelle(openId);
let groups = getRows(CFG.sheets.invoiceGroups);
groups = groups.filter(g => g[H.OPEN_ID] === openId);
assert(groups.some(g => hasNameParts(g[H.PAYER], ["MEHMET", "ETIN"])), "?lk ?deme yapan i?in fatura grubu yok");
assert(groups.some(g => hasNameParts(g[H.PAYER], ["KAYA"])), "?kinci ?deme yapan i?in fatura grubu yok");
assert(groups.every(g => g[H.INVOICE_PERSON] === g[H.PAYER]), "Fatura ki?isi ?deme yapan ki?i de?il");

const mainGroup = groups.find(g => hasNameParts(g[H.PAYER], ["MEHMET", "ETIN"]));
patchRows(CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, mainGroup[H.INVOICE_GROUP_ID], { [H.PARASUT_CONTACT_ID]: "C-1", [H.INVOICE_TEL]: "+905551112233" });
sandbox.parasutTaslaklariniHazirla();
const payload = sandbox.parasutTaslakPayloadTestEt(mainGroup[H.INVOICE_GROUP_ID]).payload;
assert(payload.data.type === "sales_invoices", "Payload type hatal?");
assert(payload.data.attributes.item_type === "invoice", "Payload item_type hatal?");
assert(payload.data.relationships.contact.data.id === "C-1", "Payload cari ili?kisi yok");
assert(payload.included.every(x => x.type === "sales_invoice_details"), "Payload detail tipi hatal?");
assert(payload.included.every(x => x.relationships.product.data.id), "Payload ?r?n ili?kisi yok");

const cariCandidates = sandbox.parasutCariAdaylariniGetir({
  name: "Mehmet Nuri Cetin",
  taxNo: "11111111111",
  phone: "+905551112233"
});
assert(cariCandidates.candidates.length >= 1, "Cari aday arama sonucu yok");
assert(Number(cariCandidates.candidates[0].score) >= 90, "G??l? cari aday puan? olu?mad?");

const navlungoPayload = sandbox.navlungoKargoTaslakTestEt(openId).payload;
assert(navlungoPayload.order_reference === openId, "Navlungo payload a??k sipari? ID ta??m?yor");
assert(navlungoPayload.recipient.name, "Navlungo payload al?c?s? yok");

setRows(CFG.sheets.bank, HEADERS.bank, [
  { [H.BANK_DATE]: new Date(), [H.BANK_SENDER]: "Mehmet Nuri ?etin", [H.BANK_DESC]: openId + " ?deme", [H.BANK_AMOUNT]: 700, [H.BANK_NAME]: "Ziraat" }
]);
sandbox.bankaHareketleriniEsle();
const bankRows = getRows(CFG.sheets.bank);
assert(Number(bankRows[0][H.MATCH_SCORE]) >= 90, "Banka e?le?me puan? g??l? de?il");
assert(bankRows[0][H.SUGGESTED_PAYMENT_ID], "Banka ?nerilen ?deme ID ?retmedi");

sandbox.parasutFaturaTaslakGonder(mainGroup[H.INVOICE_GROUP_ID]);
assert(salesPostCalls === 0, "Canl? POST kilidi ?al??mad?");
sandbox.parasutApiBaglantiTestiTam();
assert(tokenRefreshCalls >= 1, "Token refresh ?al??mad?");

sandbox.otomatikGorunumuDuzenle();

const ultraSave = sandbox.kaydetUltraSiparisHizli({
  whatsAppTel: "05559990000",
  siparisSahibi: "panel musteri",
  hamWhatsappMesaji: "Panel tek tus siparis",
  urunler: [
    { urunAdi: "tesbihh", odemeYapan: "panel odeyen", miktar: 1, birim: "Adet", birimFiyatKdvDahil: 350, kdvOrani: 0.20 },
    { urunAdi: "Tesbih Kutusu", odemeYapan: "panel odeyen", miktar: 1, birim: "Adet", birimFiyatKdvDahil: 50, kdvOrani: 0.20 }
  ],
  odemeler: [
    { odemeYapan: "panel odeyen", odemeTutari: 400, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "05559990000", odemeYapanAdres: "panel adres", odemeYapanIl: "izmir", odemeYapanIlce: "menderes" }
  ],
  kargo: { kargoAlicisi: "Panel Alici", kargoTel: "05559990000", il: "Izmir", ilce: "Menderes", adres: "Panel adres", kargoFirmasi: "Aras Kargo" },
  fatura: { faturaTel: "05559990000", faturaEmail: "panel@example.com", faturaTcknVkn: "11111111111", faturaAdres: "Panel adres", faturaIl: "Izmir", faturaIlce: "Menderes" }
});
assert(ultraSave.openId, "Ultra panel tek tus kaydet acik siparis uretmedi");
assert(!ultraSave.ok && ultraSave.control && ultraSave.control.issues.length, "Cari eksikken panel sahte OK donmemeli");
assert(Number(ultraSave.elapsedMs) < 5000, "Ultra panel kaydetme suresi hedef disi");
assert(getRows(CFG.sheets.items).filter(r => r[H.OPEN_ID] === ultraSave.openId).length === 2, "Ultra panel 2 urun yazmadi");
assert(getRows(CFG.sheets.payments).filter(r => r[H.OPEN_ID] === ultraSave.openId).length === 1, "Ultra panel 1 odeme yazmadi");
assert(getRows(CFG.sheets.cargo).filter(r => r[H.OPEN_ID] === ultraSave.openId).length === 1, "Ultra panel 1 kargo yazmadi");
const ultraQueue = getRows(CFG.sheets.queue).find(r => r[H.OPEN_ID] === ultraSave.openId);
assert(ultraQueue[H.OWNER] === "Panel Musteri", "Ad soyad bas harf normalizasyonu calismadi");
assert(ultraQueue[H.RAW_NORMALIZED] === "Panel tek tus siparis", "Ham mesaj normalize yardimci alani olusmadi");
const ultraItems = getRows(CFG.sheets.items).filter(r => r[H.OPEN_ID] === ultraSave.openId);
assert(ultraItems.every(r => r[H.PAYER] === "Panel Odeyen"), "Urun satirlari odeme yapan kisiye baglanmadi");
assert(ultraItems.every(r => r[H.INVOICE_CARI_LINK_ID]), "Urun fatura/cari baglanti ID olusmadi");
const ultraPayment = getRows(CFG.sheets.payments).find(r => r[H.OPEN_ID] === ultraSave.openId);
assert(ultraPayment[H.PAYER_TEL] === "+905559990000", "Odeme yapan telefon normalize edilmedi");
assert(ultraPayment[H.PAYER_CITY] === "İzmir", "Odeme yapan il standart yazilmadi");
const ultraGroup = getRows(CFG.sheets.invoiceGroups).find(r => r[H.OPEN_ID] === ultraSave.openId);
assert(ultraGroup[H.TAX_NO] === "11111111111", "Gercek kisi varsayilan TCKN atanmadı");
assert(ultraGroup[H.INVOICE_EMAIL] === "panel@example.com", "Fatura eposta 06 fatura grubuna yazılmadı");
assert(ultraGroup[H.EBELGE_TYPE] === "e-Arşiv", "Varsayilan e-belge tipi e-Arsiv olmadi");
const ultraEbelge = getRows(CFG.sheets.ebelge).find(r => r[H.OPEN_ID] === ultraSave.openId);
assert(ultraEbelge[H.SEND_STATUS] !== "Blokaj", "Para?t taslak ID bekleyen e-belge satiri blokaja dusmemeli");
assert(!ultraEbelge[H.OFFICIAL_BLOCK], "Parasut taslak ID bekleme notu kontrol merkezi blokajina donusmemeli");

const strongCariSave = sandbox.kaydetUltraSiparisHizli({
  whatsAppTel: "05551112233",
  siparisSahibi: "mehmet nuri çetin",
  urunler: [{ urunAdi: "Tesbih", odemeYapan: "Mehmet Nuri Çetin", miktar: 1, birim: "Adet", birimFiyatKdvDahil: 700, kdvOrani: 0.20 }],
  odemeler: [{ odemeYapan: "Mehmet Nuri Çetin", odemeTutari: 700, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "05551112233", odemeYapanTcknVkn: "11111111111", odemeYapanAdres: "güçlü adres", odemeYapanIl: "izmir", odemeYapanIlce: "menderes" }],
  kargo: { kargoAlicisi: "Mehmet Nuri Çetin", kargoTel: "05551112233", il: "izmir", ilce: "menderes", adres: "güçlü adres", kargoFirmasi: "Aras Kargo" }
});
const strongCariPanel = sandbox.parasutCariPanelAksiyonu(strongCariSave.openId, "Mehmet Nuri Çetin", "auto");
assert(strongCariPanel.ok && strongCariPanel.contactId === "C-1", "Panel cari çözümü güçlü adayı bağlamadı");
const strongGroup = getRows(CFG.sheets.invoiceGroups).find(r => r[H.OPEN_ID] === strongCariSave.openId);
assert(strongGroup[H.PARASUT_CONTACT_ID] === "C-1", "Tek guclu cari eslesmesi otomatik baglanmadi");

const createCandidate = sandbox.parasutCariPanelAksiyonu(ultraSave.openId, "Panel Odeyen", "create");
assert(createCandidate.livePost === "Yapılmadı" && createCandidate.payload, "Cari olusturma kapisi kapaliyken payload uretmeli, POST yapmamali");

assertThrows(() => sandbox.kaydetUltraSiparisHizli({
  whatsAppTel: "05",
  siparisSahibi: "Mehmetnuriçetin",
  urunler: [{ urunAdi: "Tesbih", odemeYapan: "Mehmetnuriçetin", miktar: 1, birim: "Adet", birimFiyatKdvDahil: 100, kdvOrani: 0.20 }],
  odemeler: [{ odemeYapan: "Mehmetnuriçetin", odemeTutari: 100, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "05", odemeYapanAdres: "Adres", odemeYapanIl: "İzmir", odemeYapanIlce: "Menderes" }],
  kargo: { kargoAlicisi: "Mehmetnuriçetin", kargoTel: "05", il: "İzmir", ilce: "Menderes", adres: "Adres", kargoFirmasi: "Aras Kargo" }
}), "WhatsApp_Tel geçerli", "Eksik telefon ve birleşik ad kayıt öncesi durdurulmalı");
const acceptanceRun = sandbox.v645GercekSheetKabulKontrolu();
assert(!acceptanceRun.ok && acceptanceRun.tekSiparis === 5 && acceptanceRun.topluSiparis === 10, "V6.4.5 kabul akisi sahte OK vermeden veri uretmeli");
assert(acceptanceRun.salesPost === "Yapılmadı", "Kabul veri akisinda canli POST olmamali");

const bulkPayload = Array.from({ length: 10 }, (_, i) => ({
  whatsAppTel: "05551000" + String(i).padStart(3, "0"),
  siparisSahibi: "toplu musteri " + i,
  urunler: [{ urunAdi: "Tesbih", odemeYapan: "toplu odeyen " + i, miktar: 1, birim: "Adet", birimFiyatKdvDahil: 100, kdvOrani: 0.20 }],
  odemeler: [{ odemeYapan: "toplu odeyen " + i, odemeTutari: 100, odemeTeyitKaynagi: "Manuel" }],
  kargo: { kargoAlicisi: "toplu alici " + i, kargoTel: "05551000" + String(i).padStart(3, "0"), il: "izmir", ilce: "menderes", adres: "toplu adres " + i, kargoFirmasi: "Aras Kargo" }
}));
const bulk10 = sandbox.topluUltraSiparisKaydet(bulkPayload);
assert(bulk10.count === 10 && bulk10.results.every(r => r.openId), "Toplu 10 siparis kaydi satir ID uretmedi: " + JSON.stringify(bulk10.results.slice(0, 3)));
const bulk50Payload = Array.from({ length: 50 }, (_, i) => ({
  whatsAppTel: "05558880" + String(i).padStart(3, "0"),
  siparisSahibi: "elli musteri " + i,
  urunler: [{ urunAdi: "Tesbih", odemeYapan: "elli odeyen " + i, miktar: 1, birim: "Adet", birimFiyatKdvDahil: 100, kdvOrani: 0.20 }],
  odemeler: [{ odemeYapan: "elli odeyen " + i, odemeTutari: 100, odemeTeyitKaynagi: "Manuel" }],
  kargo: { kargoAlicisi: "elli alici " + i, kargoTel: "05558880" + String(i).padStart(3, "0"), il: "izmir", ilce: "menderes", adres: "elli adres " + i, kargoFirmasi: "Aras Kargo" }
}));
const bulk50 = sandbox.topluUltraSiparisKaydet(bulk50Payload);
assert(bulk50.count === 50 && bulk50.results.every(r => r.openId), "Toplu 50 siparis batch yazimi basarisiz");

if (process.env.TK_WRITE_MOCK_STATE === "1") {
  const sheetState = {};
  Object.keys(ss.sheets).forEach(name => { sheetState[name] = ss.sheets[name].data; });
  fs.writeFileSync("07_TEST_DOSYALARI/V6_4_5_mock_sheet_state.json", JSON.stringify(sheetState, null, 2), "utf8");
}

["ultraSiparisPaneli.html", "urunEkleDialog.html", "odemeEkleDialog.html", "kargoBilgisiDialog.html", "cariSecDialog.html"].forEach(file => {
  const html = fs.readFileSync("03_APPS_SCRIPT_KOD/" + file, "utf8");
  assert(html.includes("google.script.run"), "HTML callback yok: " + file);
});
const ultraHtml = fs.readFileSync("03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html", "utf8");
assert(ultraHtml.includes("Yeni sipariş ekle"), "Çoklu sipariş Ultra panel içinden eklenmeli");
assert(!ultraHtml.includes("field(card, \"whatsAppTel\").value = phone"), "Telefon input sırasında normalize edilmemeli");
assert(ultraHtml.includes("Cari seç / ara") && ultraHtml.includes("Cari oluştur"), "Panel içi cari seç/oluştur akışı görünür değil");
assert(ultraHtml.includes("expandJoinedPersonNameTR"), "Birleşik ad-soyad normalizasyon yardımcısı yok");
assert(ultraHtml.includes("setAutoInput(row, \".odemeYapan\", owner)"), "Sipariş sahibi ödeme yapan varsayılanına akmıyor");
assert(ultraHtml.includes("personReadyTR(owner)"), "Tam ad-soyad hazır olmadan otomatik alan doldurma kontrolü yok");
assert(ultraHtml.includes("el.dataset.auto !== \"1\""), "Otomatik alanlar ilk harfte kilitlenebilir");
assert(!menuItems.some(item => item.label === "Toplu sipariş paneli"), "Ayrı toplu sipariş paneli operatör menüsünde kalmamalı");

console.log(JSON.stringify({
  result: "V6_4_5_ULTRA_OPERASYON_MOCK_OK",
  openId,
  itemRows: getRows(CFG.sheets.items).length,
  paymentRows: getRows(CFG.sheets.payments).length,
  invoiceGroups: getRows(CFG.sheets.invoiceGroups).length,
  cargoRows: getRows(CFG.sheets.cargo).length,
  bankScore: bankRows[0][H.MATCH_SCORE],
  ultraSaveElapsedMs: ultraSave.elapsedMs,
  bulk10ElapsedMs: bulk10.elapsedMs,
  bulk50ElapsedMs: bulk50.elapsedMs,
  tokenRefreshCalls,
  salesPostCalls,
  menuItems: menuItems.length
}, null, 2));



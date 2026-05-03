const fs = require("fs");
const vm = require("vm");

const corePath = "03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs";
const htmlPath = "03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html";
const code = fs.readFileSync(corePath, "utf8");
const html = fs.readFileSync(htmlPath, "utf8");

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
  getActiveRange() { return ss && ss.getActiveSheet() === this ? ss.getActiveRange() : null; }
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
  constructor() { this.sheets = {}; this.activeSheet = null; this.activeRange = null; }
  getSheetByName(name) { return this.sheets[name] || null; }
  insertSheet(name) {
    const sh = new MockSheet(name);
    this.sheets[name] = sh;
    if (!this.activeSheet) this.activeSheet = sh;
    return sh;
  }
  getActiveSheet() { return this.activeSheet || Object.values(this.sheets)[0]; }
  setActiveSheet(sh) { this.activeSheet = sh; return sh; }
  getActiveRange() { return this.activeRange; }
  setActiveRange(range) { this.activeRange = range; this.activeSheet = range.getSheet(); }
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
    "Pirinç Püskül": "1066258493",
    "Gümüş": "1066258494",
    "Gümüş İşçilik": "1066258511",
    "Tesbih Kutusu": "1066258512",
    "Kargo Hizmet Bedeli": "1066258513"
  }),
  PARASUT_CONTACT_ID_MAP_JSON: JSON.stringify({ "Mehmet Nuri Çetin": "C-1" }),
  PARASUT_CANLI_GONDERIM: "Hayır",
  PARASUT_CARI_CANLI_OLUSTURMA: "Hayır",
  EBELGE_CANLI_GONDERIM: "Hayır",
  NAVLUNGO_API_USERNAME: "qa_user",
  NAVLUNGO_API_PASSWORD: "qa_pass",
  NAVLUNGO_ENV: "QA",
  NAVLUNGO_CANLI_GONDERIM: "Hayır",
  NAVLUNGO_TEST_MODE: "Evet",
  NAVLUNGO_SENDER_ADDRESS_ID: "ADDR-1",
  NAVLUNGO_DEFAULT_CARRIER_ID: "1",
  NAVLUNGO_DEFAULT_POST_TYPE: "2",
  NAVLUNGO_DEFAULT_DESI: "1",
  NAVLUNGO_DEFAULT_PACKAGE_COUNT: "1",
  NAVLUNGO_CARRIER_ID_MAP_JSON: JSON.stringify({ "Aras Kargo": 1 }),
  NAVLUNGO_SENDER_NAME: "Tesbih Kuyusu",
  NAVLUNGO_SENDER_PHONE: "+905551110000",
  NAVLUNGO_SENDER_ADDRESS: "Kontrollü gönderici adresi",
  NAVLUNGO_SENDER_CITY: "İzmir",
  NAVLUNGO_SENDER_DISTRICT: "Menderes"
};
const docProps = {};
let salesPostCalls = 0;
let contactPostCalls = 0;
let tokenRefreshCalls = 0;
let navlungoAuthCalls = 0;
let navlungoPostCalls = 0;
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
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: k => props[k] || "",
      setProperty: (k, v) => { props[k] = v; },
      deleteProperty: k => { delete props[k]; }
    }),
    getDocumentProperties: () => ({
      getProperty: k => docProps[k] || "",
      setProperty: (k, v) => { docProps[k] = v; },
      deleteProperty: k => { delete docProps[k]; }
    })
  },
  UrlFetchApp: {
    fetch(url, options) {
      const method = String((options && options.method) || "get").toLowerCase();
      if (url.includes("/oauth/token")) {
        tokenRefreshCalls++;
        return response(200, { access_token: "token-" + tokenRefreshCalls, refresh_token: "refresh-" + tokenRefreshCalls, expires_in: 7200 });
      }
      if (url.includes("domestic-api") && url.includes("auth/api")) {
        navlungoAuthCalls++;
        return response(200, { status: true, data: { access_token: "nav-token-" + navlungoAuthCalls, token_type: "Bearer", expires_in: "2026-05-03 12:00:00" } });
      }
      if (url.includes("domestic-api") && method === "get" && url.includes("carrier/my-carriers")) {
        return response(200, { data: [{ id: 1, name: "Aras Kargo" }] });
      }
      if (url.includes("domestic-api") && method === "post" && url.includes("post/create")) {
        navlungoPostCalls++;
        return response(201, { post_number: "NL-QA-1", tracking_url: "https://qa.navlungo.test/track/NL-QA-1", barcode_url: "https://qa.navlungo.test/label/NL-QA-1.pdf" });
      }
      if (url.includes("domestic-api") && method === "post" && url.includes("barcode/getBarcode")) {
        navlungoPostCalls++;
        return response(200, { data: { barcode_url: "https://qa.navlungo.test/label/NL-QA-1.pdf" } });
      }
      if (url.includes("domestic-api") && method === "get" && url.includes("post/check/")) {
        return response(200, { data: { status: { status_name: "QA hazır" }, tracking_url: "https://qa.navlungo.test/track/NL-QA-1", barcode: "https://qa.navlungo.test/label/NL-QA-1.pdf" } });
      }
      if (url.includes("domestic-api") && method === "post" && url.includes("post/cancel")) {
        navlungoPostCalls++;
        return response(200, { ok: true, message: "QA iptal edildi" });
      }
      if (method === "post" && url.includes("/sales_invoices")) {
        salesPostCalls++;
        return response(201, { data: { id: "INV-1", type: "sales_invoices" } });
      }
      if (method === "post" && url.includes("/contacts")) {
        contactPostCalls++;
        return response(201, { data: { id: "C-NEW", type: "contacts" } });
      }
      if (url.includes("/products/")) return response(200, { data: { id: "1066258492", type: "products", attributes: { name: "Tesbih" } } });
      if (url.includes("/contacts/")) return response(200, { data: { id: "C-1", type: "contacts", attributes: { name: "Mehmet Nuri Çetin", tax_number: "11111111111", phone: "+905551112233" } } });
      if (url.includes("/contacts?")) return response(200, { data: [{ id: "C-1", type: "contacts", attributes: { name: "Mehmet Nuri Çetin", tax_number: "11111111111", phone: "+905551112233" } }] });
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
function rows(sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh || sh.getLastRow() < 2) return [];
  const headers = sh.data[0];
  return sh.data.slice(1).filter(row => row.some(v => v !== "" && v !== null && v !== undefined)).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] === undefined ? "" : row[i]; });
    return obj;
  });
}
function setRows(sheetName, headers, objects) {
  const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sh.data = [headers.slice()];
  objects.forEach(obj => sh.data.push(headers.map(h => obj[h] === undefined ? "" : obj[h])));
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
sandbox.onOpen();
menuItems.forEach(item => assert(typeof sandbox[item.fn] === "function", "Menü fonksiyonu bağlı değil: " + item.fn));
assert(!menuItems.some(item => item.label === "Toplu sipariş paneli"), "Ayrı toplu panel menüde kalmamalı");

const payload = {
  whatsAppTel: "05523730403",
  siparisSahibi: "mehmetnuriçetin",
  kargo: { il: "izmir", ilce: "menderes", adres: "Gümüldür Fevzi Çakmak Mah. 6266 Sokak No: 28", kargoFirmasi: "Aras Kargo" },
  urunler: [{ urunAdi: "tesbih", odemeYapan: "mehmetnuriçetin", miktar: 1, birimFiyatKdvDahil: 350 }],
  odemeler: [{ odemeYapan: "mehmetnuriçetin", odemeTutari: 350, odemeYapanTel: "05523730403" }],
  faturalar: [{ faturaKisisi: "mehmetnuriçetin", faturaTcknVkn: "11111111111" }]
};
const saved = sandbox.ultraSiparisKaydet(JSON.parse(JSON.stringify(payload)));
assert(saved.openId, "Ultra panel kaydı Açık_Sipariş_ID üretmeli");
assert(rows(CFG.sheets.queue)[0][H.OWNER] === "Mehmet Nuri Çetin", "Birleşik isim doğru normalize edilmeli");
assert(rows(CFG.sheets.cargo)[0][H.CARGO_RECEIVER] === "Mehmet Nuri Çetin", "Kargo alıcısı tam ad-soyad akmalı");
assert(rows(CFG.sheets.payments)[0][H.PAYER] === "Mehmet Nuri Çetin", "Ödeme yapan tam ad-soyad akmalı");
assert(rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_PERSON] === "Mehmet Nuri Çetin", "Fatura kişisi ödeme yapan olmalı");
assert(rows(CFG.sheets.invoiceGroups)[0][H.TAX_NO] === "11111111111", "Gerçek kişi TCKN varsayılanı atanmalı");
assert(rows(CFG.sheets.invoiceGroups)[0][H.EBELGE_TYPE] === "e-Arşiv", "11111111111 e-Arşiv tipi üretmeli");
assert(rows(CFG.sheets.addressMemory).length === 1, "Adres geçmişi ayrı sayfaya yazılmalı");
const cariSelection = sandbox.parasutCariPanelAksiyonu(saved.openId, "Mehmet Nuri Çetin", "select", "C-1");
assert(cariSelection.contactId === "C-1", "Panel cari seç akışı Paraşüt_Cari_ID bağlamalı");
assert(rows(CFG.sheets.parasut)[0][H.PARASUT_CONTACT_ID], "Paraşüt taslak satırında contact relationship kaynağı olmalı");
const dry = sandbox.parasutTaslakPayloadTestEt(rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_GROUP_ID]);
assert(dry.payload.data.relationships.contact.data.id, "Fatura payload contact relationship içermeli");

patchRows(CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_GROUP_ID], { [H.PARASUT_CONTACT_ID]: "" });
sandbox.parasutTaslaklariniHazirla();
assertThrows(() => sandbox.parasutTaslakPayloadTestEt(rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_GROUP_ID]), "Paraşüt cari ID yok", "Cari ID boşken payload başarılı sayılmamalı");

const second = sandbox.ultraSiparisKaydet({
  whatsAppTel: "05551112233",
  siparisSahibi: "nimeçetin",
  kargo: { il: "izmir", ilce: "menderes", adres: "Yeni adres 1", kargoFirmasi: "Aras Kargo" },
  urunler: [
    { urunAdi: "Tesbih", odemeYapan: "nimeçetin", miktar: 1, birimFiyatKdvDahil: 700 },
    { urunAdi: "Tesbih Kutusu", odemeYapan: "yaşarçetin", miktar: 1, birimFiyatKdvDahil: 100 }
  ],
  odemeler: [
    { odemeYapan: "nimeçetin", odemeTutari: 700 },
    { odemeYapan: "yaşarçetin", odemeTutari: 100 }
  ]
});
const secondGroups = rows(CFG.sheets.invoiceGroups).filter(r => r[H.OPEN_ID] === second.openId);
assert(secondGroups.length === 2, "İki ödeme yapan iki fatura grubu oluşturmalı");
assert(secondGroups.some(g => g[H.INVOICE_PERSON] === "Nimet Çetin"), "nimeçetin Nimet Çetin olmalı");
assert(secondGroups.some(g => g[H.INVOICE_PERSON] === "Yaşar Çetin"), "yaşarçetin Yaşar Çetin olmalı");

const queue = ss.getSheetByName(CFG.sheets.queue);
ss.setActiveRange(queue.getRange(2, 1, 1, queue.getLastColumn()));
sandbox.seciliSiparisiDuzenle();
const dialogData = sandbox.getDialogData();
assert(dialogData.editOrders.length === 1 && dialogData.editOrders[0].openId === saved.openId, "Seçili sipariş düzenleme panel payload üretmeli");

assert(html.includes("Adres geçmişi"), "Panel adres geçmişi bloğunu içermeli");
assert(html.includes("Müşteri hafızası"), "Panel müşteri hafızası bloğunu içermeli");
assert(html.includes("Yeni sipariş ekle"), "Çoklu sipariş aynı panelde yeni blokla çalışmalı");
assert(!/Toplu sipariş paneli/.test(html), "Ayrı toplu panel metni aktif panelde olmamalı");
assert(!/sipariÅ|MÃ|Ãœ|Ã–|ParaÅ/.test(html), "Panelde bozuk Türkçe karakter kalmamalı");

const cargoPackageId = rows(CFG.sheets.cargo)[0][H.CARGO_PACKAGE_ID];
const navDry = sandbox.navlungoKargoTaslakTestEt(cargoPackageId);
assert(navDry.ok === true, "Navlungo dry-run payload üretmeli");
assert(navDry.payload.posts[0].recipient.name, "Navlungo alıcı bilgisi 08 kargo satırından gelmeli");
assert(rows(CFG.sheets.cargo)[0][H.NAVLUNGO_PAYLOAD_HASH], "08_KARGO_PAKETLERI Navlungo payload hash readback içermeli");
assert(rows(CFG.sheets.cargo)[0][H.NAVLUNGO_TEST] === "Evet", "QA ortamında Navlungo test işareti yazılmalı");
const navApi = sandbox.navlungoBaglantiTestiTam();
assert(navApi.ok === true && navlungoAuthCalls > 0, "Navlungo token testi çalışmalı");
const navCreateClosed = sandbox.navlungoKargoOlusturOnayli(cargoPackageId);
assert(navCreateClosed.livePost === "Yapılmadı", "NAVLUNGO_CANLI_GONDERIM Hayır iken gönderi POST yapılmamalı");
patchRows(CFG.sheets.cargo, H.CARGO_PACKAGE_ID, cargoPackageId, { [H.NAVLUNGO_POST_NUMBER]: "NL-QA-1", [H.NAVLUNGO_TEST]: "Evet" });
const navCheck = sandbox.navlungoGonderiSorgula(cargoPackageId);
assert(navCheck.ok === true, "Navlungo kargo sorgulama GET akışı çalışmalı");
const navBarcodeClosed = sandbox.navlungoBarkodAl(cargoPackageId);
assert(navBarcodeClosed.livePost === "Yapılmadı", "NAVLUNGO_CANLI_GONDERIM Hayır iken barkod POST yapılmamalı");
const navCancelClosed = sandbox.navlungoGonderiIptalEt(cargoPackageId);
assert(navCancelClosed.livePost === "Yapılmadı", "NAVLUNGO_CANLI_GONDERIM Hayır iken iptal POST yapılmamalı");
props.NAVLUNGO_CANLI_GONDERIM = "Evet";
patchRows(CFG.sheets.settings, "Ayar_Kodu", "NAVLUNGO_CANLI_GONDERIM", { "Ayar_Değeri": "Evet" });
const navCreateOpen = sandbox.navlungoKargoOlusturOnayli(cargoPackageId);
assert(navCreateOpen.ok === true && rows(CFG.sheets.cargo)[0][H.NAVLUNGO_POST_NUMBER] === "NL-QA-1", "Navlungo gönderi oluşturma sonucu Sheet'e yazılmalı");
const navBarcodeOpen = sandbox.navlungoBarkodAl(cargoPackageId);
assert(navBarcodeOpen.ok === true && rows(CFG.sheets.cargo)[0][H.NAVLUNGO_BARCODE_URL], "Navlungo barkod URL Sheet'e yazılmalı");
const navCancelOpen = sandbox.navlungoGonderiIptalEt(cargoPackageId);
assert(navCancelOpen.ok === true && rows(CFG.sheets.cargo)[0][H.NAVLUNGO_CANCELLED_AT], "Navlungo iptal sonucu Sheet'e yazılmalı");
const navBulk = sandbox.navlungoTopluKargoOlustur([cargoPackageId]);
assert(navBulk.ok === true, "Navlungo toplu kargo oluşturma akışı çalışmalı");
const navBulkBarcode = sandbox.navlungoTopluBarkodAl([cargoPackageId]);
assert(navBulkBarcode.ok === true, "Navlungo toplu barkod akışı çalışmalı");
props.NAVLUNGO_CANLI_GONDERIM = "Hayır";
patchRows(CFG.sheets.settings, "Ayar_Kodu", "NAVLUNGO_CANLI_GONDERIM", { "Ayar_Değeri": "Hayır" });

const api = sandbox.parasutApiBaglantiTestiTam();
assert(api.ok === false || api, "Paraşüt GET test fonksiyonu çalışmalı");
assert(salesPostCalls === 0, "PARASUT_CANLI_GONDERIM Hayır iken sales invoice POST yapılmamalı");
assert(contactPostCalls === 0, "PARASUT_CARI_CANLI_OLUSTURMA Hayır iken contact POST yapılmamalı");
assert(navlungoPostCalls === 5, "Sadece NAVLUNGO_CANLI_GONDERIM Evet iken Navlungo POST yapılmalı");

console.log(JSON.stringify({
  ok: true,
  openRows: rows(CFG.sheets.open).length,
  invoiceGroups: rows(CFG.sheets.invoiceGroups).length,
  addressRows: rows(CFG.sheets.addressMemory).length,
  salesPostCalls,
  contactPostCalls,
  tokenRefreshCalls,
  navlungoAuthCalls,
  navlungoPostCalls
}, null, 2));

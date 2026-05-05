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
  deleteRows(rowPosition, howMany) {
    const count = howMany || 1;
    this.data.splice(rowPosition - 1, count);
    return this;
  }
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
  PARASUT_CONTACT_ID_MAP_JSON: JSON.stringify({
    "Mehmet Nuri Çetin": {
      id: "C-1",
      phone: "+905523730403",
      taxNo: "11111111111",
      address: "Gümüldür Fevzi Çakmak Mah. 6266 Sokak No: 28",
      city: "İzmir",
      district: "Menderes"
    }
  }),
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
  NAVLUNGO_DEFAULT_BARCODE_TYPE: "pdf",
  NAVLUNGO_CARRIER_ID_MAP_JSON: JSON.stringify({ "Aras Kargo": 1 }),
  QZ_TRAY_AKTIF: "Evet",
  QZ_PRINTER_NAME: "RP4xx Series 200DPI TSC",
  QZ_AUTO_PRINT_AFTER_BARCODE: "Evet",
  QZ_PRINT_COPIES: "1",
  QZ_PRINT_MODE: "pdf",
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
const navlungoPayloads = [];
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
      ButtonSet: { YES_NO: "YES_NO" },
      Button: { YES: "YES", NO: "NO" },
      createMenu: () => ({
        addItem(label, fn) { menuItems.push({ label, fn }); return this; },
        addSubMenu() { return this; },
        addToUi() { return this; }
      }),
      alert() { return "YES"; },
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
        navlungoPayloads.push({ endpoint: "post/create", payload: JSON.parse(options.payload || "{}") });
        return response(201, { post_number: "NL-QA-1", tracking_url: "https://qa.navlungo.test/track/NL-QA-1", barcode_url: "https://qa.navlungo.test/label/NL-QA-1.pdf" });
      }
      if (url.includes("domestic-api") && method === "post" && url.includes("barcode/getBarcode")) {
        navlungoPostCalls++;
        navlungoPayloads.push({ endpoint: "barcode/getBarcode", payload: JSON.parse(options.payload || "{}") });
        return response(200, { data: { barcode_url: "https://qa.navlungo.test/label/NL-QA-1.pdf", barcode_pdf: "JVBERi0xLjQK-sensitive-pdf-bytes" } });
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
  if (sheetName === CFG.sheets.settings) {
    sandbox.batchWriteRows([{ sheet: sh, headers: HEADERS.settings, rows: rows(sheetName) }]);
  }
}
function rowNumByKey(sheetName, key, value) {
  const sh = ss.getSheetByName(sheetName);
  const headers = sh.data[0];
  const k = headers.indexOf(key);
  for (let i = 1; i < sh.data.length; i++) {
    if (sh.data[i][k] === value) return i + 1;
  }
  return 0;
}
function phonesForOpen(openId) {
  const out = new Set();
  [CFG.sheets.queue, CFG.sheets.open, CFG.sheets.cargo, CFG.sheets.payments, CFG.sheets.invoiceGroups].forEach(sheetName => {
    rows(sheetName).filter(r => r[H.OPEN_ID] === openId).forEach(r => {
      [H.PHONE, H.CARGO_TEL, H.PAYER_TEL, H.INVOICE_TEL].forEach(k => { if (r[k]) out.add(String(r[k])); });
    });
  });
  return [...out];
}
function activeRelatedCount(openId) {
  const directSheets = [CFG.sheets.queue, CFG.sheets.open, CFG.sheets.items, CFG.sheets.payments, CFG.sheets.invoiceGroups, CFG.sheets.parasut, CFG.sheets.cargo, CFG.sheets.finance808, CFG.sheets.ebelge];
  let total = directSheets.reduce((sum, sheetName) => sum + rows(sheetName).filter(r => r[H.OPEN_ID] === openId).length, 0);
  total += rows(CFG.sheets.control).filter(r => String(r[H.SOURCE_ID] || "").includes(openId) || String(r[H.WARN] || "").includes(openId)).length;
  const phones = phonesForOpen(openId);
  total += rows(CFG.sheets.addressMemory).filter(r => phones.includes(String(r[H.PHONE] || "")) || phones.includes(String(r[H.CARGO_TEL] || ""))).length;
  return total;
}
function auditOpenRows(sheetName, openId) {
  return rows(sheetName).filter(r => r[H.OPEN_ID] === openId);
}

sandbox.sistemKolonlariniHazirla();
sandbox.onOpen();
menuItems.forEach(item => assert(typeof sandbox[item.fn] === "function", "Menü fonksiyonu bağlı değil: " + item.fn));
assert(!menuItems.some(item => item.label === "Toplu sipariş paneli"), "Ayrı toplu panel menüde kalmamalı");
const liveCargoHeaderContract = [
  "Kargo_Paket_ID", "Açık_Sipariş_ID", "Kargo_Alıcısı", "Kargo_Tel", "İl", "İlçe",
  "Adres", "Kargo_Firması", "Paket_Durumu", "Barkod", "Takip_No", "Geç_Ekleme_Var_Mı",
  "Paket_Notu", "Navlungo_Post_Number", "Navlungo_Reference_ID", "Navlungo_Tracking_URL",
  "Navlungo_Barcode_URL", "Navlungo_Carrier_ID", "Navlungo_Carrier_Name", "Navlungo_Status",
  "Navlungo_Last_Response", "Navlungo_Last_Error", "Navlungo_Created_At", "Navlungo_Cancelled_At",
  "Navlungo_Test_Mu", "Navlungo_Payload_Hash", "Kontrol_Uyarısı", "Kargo_Bekletilsin_Mi",
  "Kargo_Bekletme_Nedeni", "Kargo_Cikis_Tarihi", "Barkod_Yazdirildi_Mi", "Barkod_Yazdirma_Tarihi",
  "Barkod_Yazdirma_Sonucu", "Barkod_Yazdirma_Hata"
];
assert(JSON.stringify(HEADERS.cargo) === JSON.stringify(liveCargoHeaderContract), "08_KARGO_PAKETLERI kod başlık sözleşmesi canlı Sheet sırasıyla eşleşmeli");
assert(JSON.stringify(HEADERS.dictionary) === JSON.stringify(["Sayfa", "Kolon", "Kaynak", "Amaç", "Zorunlu_Mu", "Not"]), "13_VERI_SOZLUGU başlık sözleşmesi korunmalı");

assert(menuItems.some(item => item.fn === "seciliParasutCariAdaylariniGetir"), "Secili Paraşüt cari aday wrapper menude olmali");
assert(menuItems.some(item => item.fn === "seciliParasutTaslakPayloadTestEt"), "Secili Paraşüt payload wrapper menude olmali");
assert(menuItems.some(item => item.fn === "seciliParasutFaturaTaslakGonderOnayli"), "Secili Paraşüt gonder wrapper menude olmali");
assert(menuItems.some(item => item.fn === "seciliNavlungoTopluKargoOlustur"), "Secili Navlungo toplu wrapper menude olmali");

const payload = {
  whatsAppTel: "05523730403",
  siparisSahibi: "mehmetnuriçetin",
  kargo: { il: "izmir", ilce: "menderes", adres: "Gümüldür Fevzi Çakmak Mah. 6266 Sokak No: 28", kargoFirmasi: "Aras Kargo" },
  urunler: [
    { urunAdi: "tesbih", odemeYapan: "mehmetnuriçetin", miktar: 1, birimFiyatKdvDahil: 350 },
    { urunAdi: "Kargo Hizmet Bedeli", odemeYapan: "mehmetnuriçetin", miktar: 1, birimFiyatKdvDahil: 125 }
  ],
  odemeler: [{ odemeYapan: "mehmetnuriçetin", odemeTutari: 475, odemeYapanTel: "05523730403" }],
  faturalar: [{ faturaKisisi: "mehmetnuriçetin", faturaTcknVkn: "11111111111" }]
};
const saved = sandbox.ultraSiparisKaydet(JSON.parse(JSON.stringify(payload)));
assert(saved.openId, "Ultra panel kaydı Açık_Sipariş_ID üretmeli");
assert(saved.performanceProfile && saved.performanceProfile.totalMs >= 0, "Kaydet profil özeti dönmeli");
assert(!(saved.performanceProfile.topSteps || []).some(s => s.name.indexOf("hafifErpGuncelle_") !== -1), "Plain Kaydet hafifErpGuncelle yoluna girmemeli");
assert(!JSON.stringify(saved.performanceProfile).includes("Mehmet") && !JSON.stringify(saved.performanceProfile).includes("+905"), "Kaydet profili müşteri verisi içermemeli");
assert(saved.performanceProfile.counters.plainSaveFastPath >= 1, "Plain Kaydet hızlı kayıt yolunu kullanmalı");
assert(saved.performanceProfile.counters.schemaFastPass >= 1, "Kaydet şema hazırlığı hafif geçiş yapmalı");
assert(rows(CFG.sheets.queue)[0][H.OWNER] === "Mehmet Nuri Çetin", "Birleşik isim doğru normalize edilmeli");
assert(rows(CFG.sheets.cargo)[0][H.CARGO_RECEIVER] === "Mehmet Nuri Çetin", "Kargo alıcısı tam ad-soyad akmalı");
assert(rows(CFG.sheets.payments)[0][H.PAYER] === "Mehmet Nuri Çetin", "Ödeme yapan tam ad-soyad akmalı");
assert(rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_PERSON] === "Mehmet Nuri Çetin", "Fatura kişisi ödeme yapan olmalı");
assert(rows(CFG.sheets.invoiceGroups)[0][H.TAX_NO] === "11111111111", "Gerçek kişi TCKN varsayılanı atanmalı");
assert(rows(CFG.sheets.invoiceGroups)[0][H.EBELGE_TYPE] === "e-Arşiv", "11111111111 e-Arşiv tipi üretmeli");
assert(rows(CFG.sheets.invoiceGroups)[0][H.PARASUT_CONTACT_ID] === "C-1", "Kaydet güvenli cari adayını otomatik bağlamalı");
assert(rows(CFG.sheets.invoiceGroups)[0][H.CARI_ACTION] === "Otomatik bağlandı", "Kaydet otomatik cari bağlama sonucunu yazmalı");
const cariSelection = sandbox.parasutCariPanelAksiyonu(saved.openId, "Mehmet Nuri Çetin", "select", "C-1");
assert(cariSelection.contactId === "C-1", "Panel cari seç akışı Paraşüt_Cari_ID bağlamalı");
sandbox.parasutTaslaklariniHazirla();
assert(rows(CFG.sheets.parasut)[0][H.PARASUT_CONTACT_ID], "Paraşüt taslak satırında contact relationship kaynağı olmalı");
const gid = rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_GROUP_ID];
const invoiceStatusProbe = rows(CFG.sheets.invoiceGroups)[0];
sandbox.batchWriteRows([{ sheet: ss.getSheetByName(CFG.sheets.invoiceGroups), headers: HEADERS.invoiceGroups, rows: [Object.assign({}, invoiceStatusProbe, { [H.INVOICE_STATUS]: "Hazir." })] }]);
assert(rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_STATUS] === "Hazır", "06_FATURA_GRUPLARI Fatura_Durumu ascii Hazir degerini Hazır olarak normalize etmeli");
sandbox.batchWriteRows([{ sheet: ss.getSheetByName(CFG.sheets.invoiceGroups), headers: HEADERS.invoiceGroups, rows: [Object.assign({}, rows(CFG.sheets.invoiceGroups)[0], { [H.INVOICE_STATUS]: " Gönderildi. " })] }]);
assert(rows(CFG.sheets.invoiceGroups)[0][H.INVOICE_STATUS] === "Gönderildi", "06_FATURA_GRUPLARI Fatura_Durumu nokta ve bosluk iceren Gönderildi degerini normalize etmeli");
sandbox.batchWriteRows([{ sheet: ss.getSheetByName(CFG.sheets.invoiceGroups), headers: HEADERS.invoiceGroups, rows: [Object.assign({}, rows(CFG.sheets.invoiceGroups)[0], { [H.INVOICE_STATUS]: "Hazır" })] }]);
patchRows(CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, gid, { [H.PARASUT_CONTACT_ID]: "1062372249" });
sandbox.parasutTaslaklariniHazirla();
const invoiceSheetForMenu = ss.getSheetByName(CFG.sheets.invoiceGroups);
ss.setActiveRange(invoiceSheetForMenu.getRange(2, 1, 1, invoiceSheetForMenu.getLastColumn()));
const selectedCariCandidates = sandbox.seciliParasutCariAdaylariniGetir();
assert(selectedCariCandidates.groupId === gid, "Secili Paraşüt cari aday wrapper aktif 06 satirindaki fatura grubunu kullanmali");
const postsBeforePayload = salesPostCalls;
const dry = sandbox.parasutTaslakPayloadTestEt(gid);
assert(salesPostCalls === postsBeforePayload, "parasutTaslakPayloadTestEt API POST yapmamalı");
assert(dry.payload.data.relationships.contact.data.id === "1062372249", "Fatura payload contact relationship doğru cari ID içermeli");
assert(!dry.payload.included, "Yeni satış faturası create payload included kullanmamalı");
const selectedDry = sandbox.seciliParasutTaslakPayloadTestEt();
assert(selectedDry.groupId === gid, "Secili Paraşüt payload wrapper aktif 06 satirindaki fatura grubunu kullanmali");
const invoiceDetails = dry.payload.data.relationships.details.data;
assert(invoiceDetails.length === 2, "Tesbih ve kargo hizmet satırları payload içinde olmalı");
assert(invoiceDetails.some(d => d.relationships.product.data.id === "1066258492"), "Tesbih ürün ID payload içinde olmalı");
assert(invoiceDetails.some(d => d.relationships.product.data.id === "1066258513"), "Kargo Hizmet Bedeli ürün ID payload içinde olmalı");
assert(invoiceDetails.every(d => !d.id && !d.item_id && !d.invoice_detail_id), "Payload satırları mevcut kayıt referansı içermemeli");
assert(invoiceDetails.every(d => Number(d.attributes.quantity) > 0 && Number(d.attributes.unit_price) > 0), "Payload quantity ve unit_price boş olmamalı");
props.PARASUT_CANLI_GONDERIM = "Evet";
patchRows(CFG.sheets.settings, "Ayar_Kodu", "PARASUT_CANLI_GONDERIM", { "Ayar_Değeri": "Evet" });
const postsBeforeSend = salesPostCalls;
const sendResult = sandbox.parasutFaturaTaslakGonder(gid);
assert(salesPostCalls === postsBeforeSend + 1, "Canlı kapı Evet iken sales invoice POST tek kez çalışmalı");
assert(sendResult[0].status === "Gönderildi", "Paraşüt yeni satış faturası taslak gönderimi başarılı dönmeli");
assert(rows(CFG.sheets.parasut)[0][H.PARASUT_INVOICE_ID] === "INV-1", "07_PARASUT_FATURA Paraşüt_Fatura_ID yazmalı");
const duplicateSend = sandbox.parasutFaturaTaslakGonder(gid);
assert(salesPostCalls === postsBeforeSend + 1 && duplicateSend[0].status === "Blokaj", "Aynı fatura grubu ikinci kez gönderilmemeli");
const postsBeforeSyncDrift = salesPostCalls;
patchRows(CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, gid, { [H.PARASUT_INVOICE_ID]: "", [H.SEND_LOCK]: "Hayır", [H.INVOICE_STATUS]: "Hazır", [H.WARN]: "" });
const syncFromParasut = sandbox.senkronizeDurumForOpen(saved.openId);
const syncedGroup = rows(CFG.sheets.invoiceGroups).find(r => r[H.INVOICE_GROUP_ID] === gid);
assert(syncFromParasut.ok === true, "senkronizeDurumForOpen sonuc dönmeli");
assert(syncedGroup[H.PARASUT_INVOICE_ID] === "INV-1", "07 invoice ID 06 faturaya yansımalı");
assert(syncedGroup[H.SEND_LOCK] === "Evet", "07 gönderim kilidi 06 faturaya yansımalı");
assert(syncedGroup[H.INVOICE_STATUS] === "Gönderildi", "07 gönderim sonucu 06 statusune yansımalı");
const syncedOpen = rows(CFG.sheets.open).find(r => r[H.OPEN_ID] === saved.openId);
assert(syncedOpen[H.INVOICE_STATUS] === "Gönderildi", "Fatura sonucu 03 üst özete yansımalı");
const noResendAfterSync = sandbox.parasutFaturaTaslakGonder(gid);
assert(salesPostCalls === postsBeforeSyncDrift && noResendAfterSync[0].status === "Blokaj", "Senkronizasyon sonrası ikinci fatura POST yapılmamalı");
props.PARASUT_CANLI_GONDERIM = "Hayır";
patchRows(CFG.sheets.settings, "Ayar_Kodu", "PARASUT_CANLI_GONDERIM", { "Ayar_Değeri": "Hayır" });

patchRows(CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, gid, { [H.PARASUT_CONTACT_ID]: "" });
sandbox.parasutTaslaklariniHazirla();
assertThrows(() => sandbox.parasutTaslakPayloadTestEt(gid), "Paraşüt cari ID yok", "Cari ID boşken payload başarılı sayılmamalı");

const noCari = sandbox.ultraSiparisKaydet({
  whatsAppTel: "05550001122",
  siparisSahibi: "hasanalbayrak",
  kargo: { il: "izmir", ilce: "bornova", adres: "Cari blok adresi", kargoFirmasi: "Aras Kargo" },
  urunler: [{ urunAdi: "Tesbih", odemeYapan: "hasanalbayrak", miktar: 1, birimFiyatKdvDahil: 500 }],
  odemeler: [{ odemeYapan: "hasanalbayrak", odemeTutari: 500 }]
});
const noCariGroup = rows(CFG.sheets.invoiceGroups).find(r => r[H.OPEN_ID] === noCari.openId);
assert(!noCariGroup[H.PARASUT_CONTACT_ID], "Cari yoksa boş ID ile geçmemeli");
assert(String(noCariGroup[H.CARI_ACTION] || "").includes("onay"), "Cari yoksa panel onayı gerektiği yazılmalı");
assert(noCari.control && noCari.control.ok === false, "Cari yoksa hızlı panel kontrolü blokaj dönmeli");

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
assert(second.openId && second.openId !== saved.openId, "Yeni siparis modunda mevcut Açık_Sipariş_ID kullanilmamali");
sandbox.parasutTaslaklariniHazirla();
const lockGid = secondGroups[0][H.INVOICE_GROUP_ID];
patchRows(CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, lockGid, { [H.PARASUT_INVOICE_ID]: "INV-LOCK-2", [H.SEND_LOCK]: "Evet", [H.INVOICE_STATUS]: "Gönderildi", [H.WARN]: "" });
patchRows(CFG.sheets.parasut, H.INVOICE_GROUP_ID, lockGid, { [H.PARASUT_INVOICE_ID]: "", [H.SEND_LOCK]: "Hayır", [H.PARASUT_STATUS]: "Taslak Hazır", [H.CAN_SEND_DRAFT]: "Evet", [H.PAYLOAD_CHECK]: "Payload hazır", [H.DRAFT_BLOCK]: "", [H.ERROR]: "" });
sandbox.senkronizeDurumForOpen(second.openId);
const lockedParasutRows = rows(CFG.sheets.parasut).filter(r => r[H.INVOICE_GROUP_ID] === lockGid);
assert(lockedParasutRows.length && lockedParasutRows.every(r => r[H.PARASUT_INVOICE_ID] === "INV-LOCK-2" && r[H.SEND_LOCK] === "Evet" && r[H.CAN_SEND_DRAFT] === "Hayır"), "06 kilidi 07 satırlarını tekrar gönderime kapatmalı");
const errorGid = secondGroups[1][H.INVOICE_GROUP_ID];
patchRows(CFG.sheets.parasut, H.INVOICE_GROUP_ID, errorGid, { [H.PARASUT_STATUS]: "Hata", [H.ERROR]: "Paraşüt test hata", [H.SEND_LOCK]: "Hayır", [H.PARASUT_INVOICE_ID]: "" });
patchRows(CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, errorGid, { [H.INVOICE_STATUS]: "Hazır", [H.WARN]: "" });
sandbox.senkronizeDurumForOpen(second.openId);
const errorGroup = rows(CFG.sheets.invoiceGroups).find(r => r[H.INVOICE_GROUP_ID] === errorGid);
const secondOpenSummary = rows(CFG.sheets.open).find(r => r[H.OPEN_ID] === second.openId);
assert(errorGroup[H.INVOICE_STATUS] === "Hazır", "07 hata 06 validation alanini bozmayip Fatura_Durumu degerini Hazır tutmali");
assert(/test hata/.test(String(errorGroup[H.WARN] || "")), "07 hata 06 Kontrol_Uyarısı alanına yansımali");
assert(secondOpenSummary[H.CONTROL_LEVEL] === "Blokaj", "Paraşüt hata 03 blokaj seviyesine yansımalı");

const queue = ss.getSheetByName(CFG.sheets.queue);
ss.setActiveRange(queue.getRange(2, 1, 1, queue.getLastColumn()));
const menuRefresh = sandbox.kaydetVeErpGuncelle();
assert(menuRefresh.openId === saved.openId, "Kaydet ve ERP guncelle secili siparis openId degeriyle hafif guncelleme yapmali");
sandbox.seciliSiparisiDuzenle();
const dialogData = sandbox.getDialogData();
assert(dialogData.editOrders[0].kargo && dialogData.editOrders[0].kargo.kargoPaketId, "Selected edit payload must include Kargo_Paket_ID");
assert(dialogData.editOrders[0].openId === saved.openId, "02 secili satir panel payload openId degerini tasimali");
assert(dialogData.editOrders[0].whatsAppTel && dialogData.editOrders[0].siparisSahibi, "02 secili satir panel payload musteri bilgilerini doldurmali");
assert(dialogData.editOrders[0].urunler.length && dialogData.editOrders[0].odemeler.length && dialogData.editOrders[0].faturalar.length, "02 secili satir panel payload urun, odeme ve fatura bloklarini doldurmali");
const selectedQueueRow = rows(CFG.sheets.queue).find(r => r[H.OPEN_ID] === saved.openId);
const selectedQueueId = selectedQueueRow[H.Q_ID];
patchRows(CFG.sheets.queue, H.Q_ID, selectedQueueId, { [H.OPEN_ID]: "" });
ss.setActiveRange(queue.getRange(rowNumByKey(CFG.sheets.queue, H.Q_ID, selectedQueueId), 1, 1, queue.getLastColumn()));
sandbox.seciliSiparisiDuzenle();
const queueFallbackDialogData = sandbox.getDialogData();
assert(queueFallbackDialogData.editOrders[0] && queueFallbackDialogData.editOrders[0].openId === saved.openId, "02 Kuyruk_ID iliskisinden secili siparis panel payload dolu gelmeli");
patchRows(CFG.sheets.queue, H.Q_ID, selectedQueueId, { [H.OPEN_ID]: saved.openId });
const editPayload = JSON.parse(JSON.stringify(dialogData.editOrders[0]));
const editOpenId = editPayload.openId;
const editCargoPackageId = editPayload.kargo.kargoPaketId || editPayload.cargoPackageId;
const editItemId = editPayload.urunler[0].urunKalemId;
const editPaymentId = editPayload.odemeler[0].odemeId;
const failedEditPayload = JSON.parse(JSON.stringify(editPayload));
failedEditPayload.whatsAppTel = "";
assertThrows(() => sandbox.ultraSiparisKaydet(failedEditPayload), "WhatsApp_Tel", "Edit kaydi hata aldiginda yeni siparis acmadan durmali");
const beforeEditCounts = {
  queue: rows(CFG.sheets.queue).length,
  items: rows(CFG.sheets.items).filter(r => r[H.OPEN_ID] === editOpenId).length,
  payments: rows(CFG.sheets.payments).filter(r => r[H.OPEN_ID] === editOpenId).length,
  invoiceGroups: rows(CFG.sheets.invoiceGroups).filter(r => r[H.OPEN_ID] === editOpenId).length,
  cargo: rows(CFG.sheets.cargo).filter(r => r[H.OPEN_ID] === editOpenId).length
};
failedEditPayload.whatsAppTel = editPayload.whatsAppTel;
failedEditPayload.kargo.adres = "Hata sonrasi duzeltilen teslimat adresi";
const fixedAfterError = sandbox.ultraSiparisKaydet(failedEditPayload);
assert(fixedAfterError.openId === editOpenId, "Hata sonrasi duzeltilen edit kaydi ayni Açık_Sipariş_ID ile kaydedilmeli");
assert(rows(CFG.sheets.queue).length === beforeEditCounts.queue, "Hata sonrasi edit kaydi yeni kuyruk satiri acmamali");
assert(rows(CFG.sheets.cargo).filter(r => r[H.CARGO_PACKAGE_ID] === editCargoPackageId)[0][H.ADDRESS] === "Hata sonrasi duzeltilen teslimat adresi", "Hata sonrasi edit kaydi mevcut kargo paketini guncellemeli");
editPayload.kargo.ilce = "gaziemir";
editPayload.kargo.adres = "Guncel teslimat adresi 2";
editPayload.urunler[0].birimFiyatKdvDahil = 360;
editPayload.odemeler[0].odemeTutari = 360;
editPayload.odemeler[0].odemeYapanIlce = "gaziemir";
editPayload.odemeler[0].odemeYapanAdres = "Guncel teslimat adresi 2";
editPayload.faturalar[0].faturaIlce = "gaziemir";
editPayload.faturalar[0].faturaAdres = "Guncel teslimat adresi 2";
const edited = sandbox.ultraSiparisKaydet(editPayload);
assert(edited.openId === editOpenId, "Edit save must not create a new open order");
assert(edited.performanceProfile && edited.performanceProfile.counters && (edited.performanceProfile.counters.deltaReplaceCall >= 1 || edited.performanceProfile.counters.singleRowUpsert >= 1), "Edit kaydı hedefli satır yazımı sayacı üretmeli");
assert((edited.kargoPaketId || edited.cargoPackageId) === editCargoPackageId, "Edit save must keep the existing cargo package id");
assert(rows(CFG.sheets.queue).length === beforeEditCounts.queue, "Edit save must not append a queue row");
assert(rows(CFG.sheets.items).filter(r => r[H.OPEN_ID] === editOpenId).length === beforeEditCounts.items, "Edit save must not duplicate item rows");
assert(rows(CFG.sheets.payments).filter(r => r[H.OPEN_ID] === editOpenId).length === beforeEditCounts.payments, "Edit save must not duplicate payment rows");
assert(rows(CFG.sheets.invoiceGroups).filter(r => r[H.OPEN_ID] === editOpenId).length === beforeEditCounts.invoiceGroups, "Edit save must not duplicate invoice groups");
assert(rows(CFG.sheets.cargo).filter(r => r[H.OPEN_ID] === editOpenId).length === beforeEditCounts.cargo, "Edit save must not create a new cargo package");
assert(rows(CFG.sheets.items).filter(r => r[H.ITEM_ID] === editItemId)[0][H.UNIT_GROSS] === 360, "Edit save must update the item row by id");
assert(rows(CFG.sheets.payments).filter(r => r[H.PAYMENT_ID] === editPaymentId)[0][H.PAYMENT_AMOUNT] === 360, "Edit save must update the payment row by id");
assert(rows(CFG.sheets.cargo).filter(r => r[H.CARGO_PACKAGE_ID] === editCargoPackageId)[0][H.DISTRICT] === "Gaziemir", "Edit save must update the existing cargo row by Kargo_Paket_ID");
assertThrows(() => sandbox.ultraSiparisKaydet(Object.assign({}, editPayload, { openId: "AS-BULUNAMADI-999" })), "Düzenleme için mevcut Açık_Sipariş_ID bulunamadı", "Missing edit open id must not create a new order");
assert(dialogData.editOrders.length === 1 && dialogData.editOrders[0].openId === saved.openId, "Seçili sipariş düzenleme panel payload üretmeli");

const archivePayload = JSON.parse(JSON.stringify(payload));
archivePayload.whatsAppTel = "05559990001";
archivePayload.siparisSahibi = "arsiv deneme cetin";
archivePayload.kargo.kargoTel = "+905559990001";
archivePayload.kargo.adres = "Arsiv deneme adresi";
archivePayload.odemeler[0].odemeYapan = "arsiv deneme cetin";
archivePayload.odemeler[0].odemeYapanTel = "+905559990001";
archivePayload.odemeler[0].odemeYapanAdres = "Arsiv deneme adresi";
archivePayload.faturalar = [];
const archiveOrder = sandbox.ultraSiparisKaydet(archivePayload);
const beforeArchiveRelated = activeRelatedCount(archiveOrder.openId);
assert(beforeArchiveRelated > 0, "Arsiv testi icin aktif bagli satirlar olusmali");
ss.setActiveRange(queue.getRange(rowNumByKey(CFG.sheets.queue, H.OPEN_ID, archiveOrder.openId), 1, 1, queue.getLastColumn()));
const archiveResult = sandbox.seciliKaydiArsivle();
assert(archiveResult.results[0].moved >= beforeArchiveRelated, "Arsivle tum bagli satirlari audit sayfasina tasimali");
assert(activeRelatedCount(archiveOrder.openId) === 0, "Arsivlenen siparis aktif operasyon sayfalarindan kalkmali");
assert(auditOpenRows(CFG.sheets.archive, archiveOrder.openId).filter(r => r[H.RESTORED] !== "Evet").length >= beforeArchiveRelated, "Arsivlenen satirlar ARSIVLENENLER sayfasinda geri alinabilir olmali");
const archiveSheet = ss.getSheetByName(CFG.sheets.archive);
ss.setActiveRange(archiveSheet.getRange(rowNumByKey(CFG.sheets.archive, H.OPEN_ID, archiveOrder.openId), 1, 1, archiveSheet.getLastColumn()));
const archiveRestore = sandbox.seciliKaydiGeriAl();
assert(archiveRestore.results[0].restored >= beforeArchiveRelated, "Geri al arsivden satirlari aktif sayfalara dondurmeli");
const afterArchiveRestoreRelated = activeRelatedCount(archiveOrder.openId);
assert(afterArchiveRestoreRelated >= beforeArchiveRelated, "Arsivden geri alinan siparis aktif satirlari geri gelmeli");
ss.setActiveRange(archiveSheet.getRange(rowNumByKey(CFG.sheets.archive, H.OPEN_ID, archiveOrder.openId), 1, 1, archiveSheet.getLastColumn()));
sandbox.seciliKaydiGeriAl();
assert(activeRelatedCount(archiveOrder.openId) === afterArchiveRestoreRelated, "Arsiv geri al ikinci kez duplicate uretmemeli");

const deletePayload = JSON.parse(JSON.stringify(payload));
deletePayload.whatsAppTel = "05559990002";
deletePayload.siparisSahibi = "sil deneme cetin";
deletePayload.kargo.kargoTel = "+905559990002";
deletePayload.kargo.adres = "Sil deneme adresi";
deletePayload.odemeler[0].odemeYapan = "sil deneme cetin";
deletePayload.odemeler[0].odemeYapanTel = "+905559990002";
deletePayload.odemeler[0].odemeYapanAdres = "Sil deneme adresi";
deletePayload.faturalar = [];
const deleteOrder = sandbox.ultraSiparisKaydet(deletePayload);
const beforeDeleteRelated = activeRelatedCount(deleteOrder.openId);
assert(beforeDeleteRelated > 0, "Sil testi icin aktif bagli satirlar olusmali");
ss.setActiveRange(queue.getRange(rowNumByKey(CFG.sheets.queue, H.OPEN_ID, deleteOrder.openId), 1, 1, queue.getLastColumn()));
const deleteResult = sandbox.seciliKaydiSil();
assert(deleteResult.results[0].moved >= beforeDeleteRelated, "Sil tum bagli satirlari SILINENLER sayfasina tasimali");
assert(activeRelatedCount(deleteOrder.openId) === 0, "Silinen siparis aktif operasyon sayfalarindan kalkmali");
assert(auditOpenRows(CFG.sheets.deleted, deleteOrder.openId).filter(r => r[H.RESTORED] !== "Evet").length >= beforeDeleteRelated, "Silinen satirlar SILINENLER sayfasinda geri alinabilir olmali");
const deletedSheet = ss.getSheetByName(CFG.sheets.deleted);
ss.setActiveRange(deletedSheet.getRange(rowNumByKey(CFG.sheets.deleted, H.OPEN_ID, deleteOrder.openId), 1, 1, deletedSheet.getLastColumn()));
const deleteRestore = sandbox.seciliKaydiGeriAl();
assert(deleteRestore.results[0].restored >= beforeDeleteRelated, "Geri al silinenlerden satirlari aktif sayfalara dondurmeli");
const afterDeleteRestoreRelated = activeRelatedCount(deleteOrder.openId);
assert(afterDeleteRestoreRelated >= beforeDeleteRelated, "Silinenlerden geri alinan siparis aktif satirlari geri gelmeli");
ss.setActiveRange(deletedSheet.getRange(rowNumByKey(CFG.sheets.deleted, H.OPEN_ID, deleteOrder.openId), 1, 1, deletedSheet.getLastColumn()));
sandbox.seciliKaydiGeriAl();
assert(activeRelatedCount(deleteOrder.openId) === afterDeleteRestoreRelated, "Silinenlerden geri al ikinci kez duplicate uretmemeli");

const settingsSheetForMenu = ss.getSheetByName(CFG.sheets.settings);
ss.setActiveRange(settingsSheetForMenu.getRange(2, 1, 1, settingsSheetForMenu.getLastColumn()));
const unsafeMenuRefresh = sandbox.kaydetVeErpGuncelle();
assert(unsafeMenuRefresh.ok === false, "Kaydet ve ERP guncelle siparis baglami yoksa sistemiYenile yoluna dusmemeli");

assert(html.includes("Adres geçmişi"), "Panel adres geçmişi bloğunu içermeli");
assert(html.includes("Müşteri hafızası"), "Panel müşteri hafızası bloğunu içermeli");
assert(html.includes("Yeni sipariş ekle"), "Çoklu sipariş aynı panelde yeni blokla çalışmalı");
assert(html.includes("qz-tray") && html.includes("function qzConnect()") && html.includes("function qzPrintIfAvailable"), "Panel QZ Tray yazdırma fonksiyonlarını içermeli");
assert(html.includes("Barkodu yazdır"), "Panel manuel barkod yazdırma butonunu içermeli");
assert(html.includes("console.log(\"Ultra operation response\""), "Panel operasyon response bilgisini console'a yazmalı");
assert(!/Toplu sipariş paneli/.test(html), "Ayrı toplu panel metni aktif panelde olmamalı");
assert(!/sipariÅ|MÃ|Ãœ|Ã–|ParaÅ/.test(html), "Panelde bozuk Türkçe karakter kalmamalı");

const cargoPackageId = rows(CFG.sheets.cargo)[0][H.CARGO_PACKAGE_ID];
assert(/^KP-AS-\d{8}-\d{3}$/.test(cargoPackageId), "Kargo_Paket_ID tireli formatını korumalı");
assert(saved.cargoPackageId === cargoPackageId, "Kaydet sonucu gerçek Kargo_Paket_ID değerini panele döndürmeli");
assertThrows(() => sandbox.navlungoKargoTaslakTestEt(), "Kargo_Paket_ID parametresi boş geldi", "Aktif 08 satırı yoksa parametresiz Navlungo tekli işlem durmalı");
const cargoSheet = ss.getSheetByName(CFG.sheets.cargo);
ss.setActiveRange(cargoSheet.getRange(2, 1, 1, cargoSheet.getLastColumn()));
const selectedNavBulk = sandbox.seciliNavlungoTopluKargoOlustur();
assert(selectedNavBulk.count === 1 && selectedNavBulk.results[0].kargoPaketId === cargoPackageId, "Secili Navlungo toplu wrapper sadece aktif 08 Kargo_Paket_ID degerini kullanmali");
const navDryParamless = sandbox.navlungoKargoTaslakTestEt();
assert(navDryParamless.kargoPaketId === cargoPackageId, "Parametresiz Navlungo dry-run aktif 08 satırındaki Kargo_Paket_ID değerini kullanmalı");
const navDry = sandbox.navlungoKargoTaslakTestEt(cargoPackageId);
assert(navDry.ok === true, "Navlungo dry-run payload üretmeli");
assert(navDry.payload.posts[0].recipient.name, "Navlungo alıcı bilgisi 08 kargo satırından gelmeli");
assert(rows(CFG.sheets.cargo)[0][H.NAVLUNGO_PAYLOAD_HASH], "08_KARGO_PAKETLERI Navlungo payload hash readback içermeli");
assert(rows(CFG.sheets.cargo)[0][H.NAVLUNGO_TEST] === "Evet", "QA ortamında Navlungo test işareti yazılmalı");
const navApi = sandbox.navlungoBaglantiTestiTam();
assert(navApi.ok === true && navlungoAuthCalls > 0, "Navlungo token testi çalışmalı");
const savedNavEnv = props.NAVLUNGO_ENV;
const savedNavUser = props.NAVLUNGO_API_USERNAME;
const savedNavPass = props.NAVLUNGO_API_PASSWORD;
delete props.NAVLUNGO_API_USERNAME;
delete props.NAVLUNGO_API_PASSWORD;
props.NAVLUNGO_ENV = "LIVE";
props.NAVLUNGO_LIVE_API_USERNAME = "live_user";
props.NAVLUNGO_LIVE_API_PASSWORD = "live_pass";
props.NAVLUNGO_ACCESS_TOKEN = "";
props.NAVLUNGO_ACCESS_TOKEN_EXPIRES_AT = "2000-01-01T00:00:00.000Z";
const navLiveToken = sandbox.navlungoTokenAl();
assert(navLiveToken.ok === true && props.NAVLUNGO_ACCESS_TOKEN, "LIVE ortam propertyleriyle Navlungo token alınmalı");
props.NAVLUNGO_ENV = savedNavEnv;
props.NAVLUNGO_API_USERNAME = savedNavUser;
props.NAVLUNGO_API_PASSWORD = savedNavPass;
delete props.NAVLUNGO_LIVE_API_USERNAME;
delete props.NAVLUNGO_LIVE_API_PASSWORD;
props.NAVLUNGO_ACCESS_TOKEN = "";
props.NAVLUNGO_ACCESS_TOKEN_EXPIRES_AT = "2000-01-01T00:00:00.000Z";
const navCreateClosed = sandbox.navlungoKargoOlusturOnayli();
assert(navCreateClosed.livePost === "Yapılmadı", "NAVLUNGO_CANLI_GONDERIM Hayır iken gönderi POST yapılmamalı");
assert(rows(CFG.sheets.cargo)[0][H.NAVLUNGO_STATUS] === "Canlı gönderim kapalı - payload hazır", "Canlı kapı kapalıyken 08 durumu payload hazır olarak yazılmalı");
patchRows(CFG.sheets.cargo, H.CARGO_PACKAGE_ID, cargoPackageId, { [H.NAVLUNGO_POST_NUMBER]: "NL-QA-1", [H.NAVLUNGO_TEST]: "Evet" });
const navCheck = sandbox.navlungoGonderiSorgula(cargoPackageId);
assert(navCheck.ok === true, "Navlungo kargo sorgulama GET akışı çalışmalı");
const navBarcodeClosed = sandbox.navlungoBarkodAl(cargoPackageId);
assert(navBarcodeClosed.livePost === "Yapılmadı", "NAVLUNGO_CANLI_GONDERIM Hayır iken barkod POST yapılmamalı");
const navCancelClosed = sandbox.navlungoGonderiIptalEt(cargoPackageId);
assert(navCancelClosed.livePost === "Yapılmadı", "NAVLUNGO_CANLI_GONDERIM Hayır iken iptal POST yapılmamalı");
props.NAVLUNGO_CANLI_GONDERIM = "Evet";
patchRows(CFG.sheets.settings, "Ayar_Kodu", "NAVLUNGO_CANLI_GONDERIM", { "Ayar_Değeri": "Evet" });
const qzOperationPayload = {
  whatsAppTel: "05554445566",
  siparisSahibi: "emrahçağrı",
  kargo: { kargoAlicisi: "Emrah Çağrı", kargoTel: "+905554445566", il: "İzmir", ilce: "Menderes", adres: "QZ operasyon adresi", kargoFirmasi: "Aras Kargo" },
  urunler: [{ urunAdi: "Tesbih", odemeYapan: "Emrah Çağrı", miktar: 1, birimFiyatKdvDahil: 700 }],
  odemeler: [{ odemeYapan: "Emrah Çağrı", odemeTutari: 700, odemeYapanTel: "+905554445566", odemeYapanTcknVkn: "11111111111", odemeYapanAdres: "QZ operasyon adresi", odemeYapanIl: "İzmir", odemeYapanIlce: "Menderes" }],
  faturalar: [{ faturaKisisi: "Emrah Çağrı", cariTipi: "Gerçek Kişi", faturaTel: "+905554445566", faturaTcknVkn: "11111111111", faturaIl: "İzmir", faturaIlce: "Menderes", faturaAdres: "QZ operasyon adresi", parasutCariId: "1062372249" }]
};
const qzOperation = sandbox.ultraPanelOperasyonCalistir("sadeceKargo", qzOperationPayload);
assert(qzOperation.Navlungo_Barcode_URL, "Operasyon response Navlungo_Barcode_URL döndürmeli");
assert(qzOperation.qzPrinterName === "RP4xx Series 200DPI TSC", "Operasyon response QZ printer adını döndürmeli");
assert(qzOperation.autoPrintRequested === true, "Operasyon response barkod sonrası otomatik yazdırma isteği döndürmeli");
const qzOpenSummary = rows(CFG.sheets.open).find(r => r[H.OPEN_ID] === qzOperation.openId);
assert(qzOpenSummary[H.CARGO_STATUS] === "Barkod Alındı", "Navlungo post ve barkod 03 kargo özetine yansımalı");
patchRows(CFG.sheets.settings, "Ayar_Kodu", "NAVLUNGO_DEFAULT_BARCODE_TYPE", { "Ayar_Değeri": "pdf-A6" });
patchRows(CFG.sheets.cargo, H.CARGO_PACKAGE_ID, cargoPackageId, { [H.NAVLUNGO_POST_NUMBER]: "", [H.NAVLUNGO_BARCODE_URL]: "", [H.NAVLUNGO_TRACKING_URL]: "", [H.NAVLUNGO_CANCELLED_AT]: "", [H.NAVLUNGO_STATUS]: "Payload Hazır" });
const navCreateOpen = sandbox.navlungoKargoOlusturOnayli(cargoPackageId);
assert(navCreateOpen.ok === true && rows(CFG.sheets.cargo)[0][H.NAVLUNGO_POST_NUMBER] === "NL-QA-1", "Navlungo gönderi oluşturma sonucu Sheet'e yazılmalı");
const navBarcodeOpen = sandbox.navlungoBarkodAl(cargoPackageId);
assert(navBarcodeOpen.ok === true && rows(CFG.sheets.cargo)[0][H.NAVLUNGO_BARCODE_URL], "Navlungo barkod URL Sheet'e yazılmalı");
assert(!String(rows(CFG.sheets.cargo)[0][H.NAVLUNGO_LAST_RESPONSE] || "").includes("JVBER"), "08 Navlungo_Last_Response barkod PDF içeriğini saklamamalı");
const lastBarcodePayload = navlungoPayloads.filter(x => x.endpoint === "barcode/getBarcode").slice(-1)[0];
assert(lastBarcodePayload && lastBarcodePayload.payload.barcode_type === "pdf", "Navlungo barkod tipi getBarcode için pdf olarak normalize edilmeli");
const navCancelOpen = sandbox.navlungoGonderiIptalEt(cargoPackageId);
assert(navCancelOpen.ok === true && rows(CFG.sheets.cargo)[0][H.NAVLUNGO_CANCELLED_AT], "Navlungo iptal sonucu Sheet'e yazılmalı");
patchRows(CFG.sheets.cargo, H.CARGO_PACKAGE_ID, cargoPackageId, { [H.NAVLUNGO_POST_NUMBER]: "", [H.NAVLUNGO_BARCODE_URL]: "", [H.NAVLUNGO_TRACKING_URL]: "", [H.NAVLUNGO_CANCELLED_AT]: "", [H.NAVLUNGO_STATUS]: "Payload Hazır" });
const navBulk = sandbox.navlungoTopluKargoOlustur([cargoPackageId]);
assert(navBulk.ok === true, "Navlungo toplu kargo oluşturma akışı çalışmalı");
const navBulkBarcode = sandbox.navlungoTopluBarkodAl([cargoPackageId]);
assert(navBulkBarcode.ok === true, "Navlungo toplu barkod akışı çalışmalı");
const qzInfoBeforePrint = sandbox.qzBarkodBilgisi(cargoPackageId);
assert(qzInfoBeforePrint.Navlungo_Barcode_URL, "QZ barkod bilgisi 08 Navlungo_Barcode_URL değerini döndürmeli");
assert(qzInfoBeforePrint.qzPrinterName === "RP4xx Series 200DPI TSC", "QZ printer adı ayardan dönmeli");
assert(qzInfoBeforePrint.autoPrintRequested === false, "Manuel barkod bilgisi otomatik yazdırma isteği döndürmemeli");
const qzFail = sandbox.qzBarkodYazdirmaSonucuKaydet(cargoPackageId, false, "Barkod URL oluştu; yazdırma tamamlanmadı", "QZ kapalı");
assert(qzFail.ok === true && rows(CFG.sheets.cargo)[0][H.BARCODE_PRINTED] === "Hayır", "QZ kapalı sonucu 08'e başarısız yazılmalı");
const qzOk = sandbox.qzBarkodYazdirmaSonucuKaydet(cargoPackageId, true, "Barkod yazdırıldı / RP4xx Series 200DPI TSC", "");
assert(qzOk.ok === true && rows(CFG.sheets.cargo)[0][H.BARCODE_PRINTED] === "Evet", "QZ başarılı yazdırma sonucu 08'e yazılmalı");
assert(sandbox.qzBarkodBilgisi(cargoPackageId).autoPrintRequested === false, "Basılmış barkod otomatik tekrar basılmamalı");
props.NAVLUNGO_CANLI_GONDERIM = "Hayır";
patchRows(CFG.sheets.settings, "Ayar_Kodu", "NAVLUNGO_CANLI_GONDERIM", { "Ayar_Değeri": "Hayır" });

const operationPayload = {
  whatsAppTel: "05553334455",
  siparisSahibi: "bedihaçetin",
  kargo: {
    kargoAlicisi: "Bediha Çetin",
    kargoTel: "+905553334455",
    il: "İzmir",
    ilce: "Menderes",
    adres: "Operasyon test adresi",
    kargoFirmasi: "Aras Kargo",
    kargoBekletilsinMi: "Evet",
    kargoBekletmeNedeni: "Müşteri talebi"
  },
  urunler: [{ urunAdi: "Tesbih", odemeYapan: "Bediha Çetin", miktar: 1, birimFiyatKdvDahil: 700 }],
  odemeler: [{ odemeYapan: "Bediha Çetin", odemeTutari: 700, odemeTarihi: "2026-05-03", odemeYapanTel: "+905553334455", odemeYapanTcknVkn: "11111111111", odemeYapanAdres: "Operasyon test adresi", odemeYapanIl: "İzmir", odemeYapanIlce: "Menderes" }],
  faturalar: [{ faturaKisisi: "Bediha Çetin", cariTipi: "Gerçek Kişi", faturaTel: "+905553334455", faturaTcknVkn: "11111111111", faturaIl: "İzmir", faturaIlce: "Menderes", faturaAdres: "Operasyon test adresi", parasutCariId: "1062372249" }]
};
const justInvoice = sandbox.ultraPanelOperasyonCalistir("sadeceFatura", JSON.parse(JSON.stringify(operationPayload)));
assert(justInvoice.openId, "Sadece fatura operasyonu Açık_Sipariş_ID döndürmeli");
assert(rows(CFG.sheets.cargo).some(r => r[H.OPEN_ID] === justInvoice.openId && r[H.CARGO_WAIT] === "Evet"), "Sadece fatura kargoyu bekletmeli");
assert(rows(CFG.sheets.open).find(r => r[H.OPEN_ID] === justInvoice.openId)[H.CARGO_STATUS] === "Bekletiliyor", "Kargo bekletme 03 kargo özetinde kritik blokaj olmadan görünmeli");
const cargoForOperation = rows(CFG.sheets.cargo).find(r => r[H.OPEN_ID] === justInvoice.openId);
const cargoOutPayload = JSON.parse(JSON.stringify(operationPayload));
cargoOutPayload.openId = justInvoice.openId;
cargoOutPayload.kargo.kargoPaketId = cargoForOperation[H.CARGO_PACKAGE_ID];
cargoOutPayload.kargo.kargoBekletilsinMi = "Hayır";
cargoOutPayload.faturalar[0].faturaGrubuId = rows(CFG.sheets.invoiceGroups).find(r => r[H.OPEN_ID] === justInvoice.openId)[H.INVOICE_GROUP_ID];
const waitingCargoOut = sandbox.ultraPanelOperasyonCalistir("bekleyenKargo", cargoOutPayload);
assert(waitingCargoOut.cargo.length === 1, "Bekleyen kargo tek paketle işlem görmeli");
assert(rows(CFG.sheets.cargo).some(r => r[H.OPEN_ID] === justInvoice.openId && r[H.CARGO_WAIT] === "Hayır" && r[H.NAVLUNGO_STATUS]), "Bekleyen kargo çıkarma 08 Navlungo durumunu yazmalı");

const api = sandbox.parasutApiBaglantiTestiTam();
assert(api.ok === false || api, "Paraşüt GET test fonksiyonu çalışmalı");
assert(salesPostCalls === 1, "Sales invoice POST yalnız kontrollü Paraşüt kapısı Evet iken bir kez çalışmalı");
assert(contactPostCalls === 0, "PARASUT_CARI_CANLI_OLUSTURMA Hayır iken contact POST yapılmamalı");
assert(navlungoPostCalls === 6, "Sadece NAVLUNGO_CANLI_GONDERIM Evet iken Navlungo POST yapılmalı");

console.log(JSON.stringify({
  ok: true,
  openRows: rows(CFG.sheets.open).length,
  invoiceGroups: rows(CFG.sheets.invoiceGroups).length,
  addressRows: rows(CFG.sheets.addressMemory).length,
  salesPostCalls,
  contactPostCalls,
  tokenRefreshCalls,
  navlungoAuthCalls,
  navlungoPostCalls,
  saveProfileTopSteps: saved.performanceProfile.topSteps.slice(0, 5),
  saveProfileCounters: saved.performanceProfile.counters
}, null, 2));

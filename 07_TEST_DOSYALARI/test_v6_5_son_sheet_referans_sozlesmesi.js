const fs = require("fs");
const path = require("path");
const vm = require("vm");
const AdmZip = require("adm-zip");

const root = path.resolve(__dirname, "..");
const corePath = path.join(root, "03_APPS_SCRIPT_KOD", "tesbih_kuyusu_v6_5_ultra_operasyon_core.gs");
const workbookPath = process.env.TESBIH_REFERENCE_XLSX ||
  path.join(root, "02_SHEET_SISTEM", "TESBIH_KUYUSU_MASTER_SHEET (20).xlsx");

function normalize(value) {
  return String(value || "")
    .trim()
    .replace(/\u0130/g, "i")
    .toLocaleLowerCase("tr-TR")
    .replace(/\u0131/g, "i")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function text(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function loadCodeHeaders() {
  const code = fs.readFileSync(corePath, "utf8");
  const sandbox = {
    console,
    Date,
    JSON,
    Math,
    Number,
    String,
    Object,
    Array,
    RegExp,
    encodeURIComponent
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: corePath });
  return sandbox.TK6.HEADERS;
}

function xmlDecode(value) {
  return String(value || "")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function zipText(zip, entryName) {
  const entry = zip.getEntry(entryName);
  return entry ? entry.getData().toString("utf8") : "";
}

function attrs(xml) {
  const output = {};
  for (const match of xml.matchAll(/([A-Za-z_:][A-Za-z0-9_:.-]*)="([^"]*)"/g)) {
    output[match[1]] = xmlDecode(match[2]);
  }
  return output;
}

function columnIndex(cellRef) {
  const letters = String(cellRef || "").replace(/[^A-Z]/gi, "").toUpperCase();
  let index = 0;
  for (const letter of letters) index = index * 26 + letter.charCodeAt(0) - 64;
  return Math.max(0, index - 1);
}

function sharedStrings(zip) {
  const xml = zipText(zip, "xl/sharedStrings.xml");
  if (!xml) return [];
  return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(match => {
    return [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map(part => xmlDecode(part[1]))
      .join("");
  });
}

function workbookModel(filePath) {
  const zip = new AdmZip(filePath);
  const strings = sharedStrings(zip);
  const workbookXml = zipText(zip, "xl/workbook.xml");
  const relsXml = zipText(zip, "xl/_rels/workbook.xml.rels");
  const rels = {};
  for (const match of relsXml.matchAll(/<Relationship\b([^>]*)\/>/g)) {
    const rel = attrs(match[1]);
    if (rel.Id && rel.Target) rels[rel.Id] = rel.Target.replace(/^\/+/, "");
  }
  const sheets = {};
  for (const match of workbookXml.matchAll(/<sheet\b([^>]*)\/>/g)) {
    const sheet = attrs(match[1]);
    const relId = sheet["r:id"];
    if (!sheet.name || !relId || !rels[relId]) continue;
    const target = rels[relId].startsWith("xl/") ? rels[relId] : `xl/${rels[relId]}`;
    sheets[sheet.name] = parseSheet(zipText(zip, target), strings);
  }
  return { sheetNames: Object.keys(sheets), sheets };
}

function parseSheet(xml, strings) {
  const rows = [];
  for (const rowMatch of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const row = [];
    const rowXml = rowMatch[1];
    for (const cellMatch of rowXml.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const cellAttrs = attrs(cellMatch[1]);
      const col = columnIndex(cellAttrs.r);
      const body = cellMatch[2];
      let value = "";
      const valueMatch = body.match(/<v>([\s\S]*?)<\/v>/);
      if (cellAttrs.t === "s") {
        value = strings[Number(valueMatch ? valueMatch[1] : "")] || "";
      } else if (cellAttrs.t === "inlineStr") {
        const inlineParts = [...body.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(part => xmlDecode(part[1]));
        value = inlineParts.join("");
      } else {
        value = valueMatch ? xmlDecode(valueMatch[1]) : "";
      }
      row[col] = value;
    }
    if (row.some(item => item !== undefined && item !== "")) rows.push(row.map(item => item === undefined ? "" : item));
  }
  return rows;
}

function sheetRows(workbook, sheetName) {
  const rows = workbook.sheets[sheetName];
  if (!rows) throw new Error(`Sayfa bulunamadı: ${sheetName}`);
  return rows;
}

function headers(workbook, sheetName) {
  const first = (sheetRows(workbook, sheetName)[0] || []).map(text);
  while (first.length && !first[first.length - 1]) first.pop();
  return first;
}

function records(workbook, sheetName) {
  const rows = sheetRows(workbook, sheetName);
  const header = (rows[0] || []).map(text);
  const index = new Map();
  header.forEach((name, i) => {
    if (name) index.set(normalize(name), i);
  });
  return rows.slice(1)
    .map(row => row.map(text))
    .filter(row => row.some(Boolean))
    .map(row => {
      const out = {};
      for (const [name, i] of index.entries()) out[name] = text(row[i]);
      return out;
    });
}

function assert(condition, message, details) {
  if (!condition) {
    const error = new Error(message);
    error.details = details;
    throw error;
  }
}

function parseAmount(value) {
  const raw = String(value || "").trim();
  if (!raw) return 0;
  if (/^-?\d+(,\d+)?$/.test(raw)) return Number(raw.replace(",", "."));
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return Number(raw.replace(/\./g, "").replace(",", "."));
}

async function main() {
  assert(fs.existsSync(workbookPath), "Referans XLSX bulunamadı", workbookPath);
  const workbook = workbookModel(workbookPath);
  const codeHeaders = loadCodeHeaders();
  const required = {
    settings: "01_AYARLAR",
    open: "03_ACIK_SIPARISLER",
    items: "04_URUN_KALEMLERI",
    payments: "05_ODEMELER",
    invoiceGroups: "06_FATURA_GRUPLARI",
    parasut: "07_PARASUT_FATURA",
    cargo: "08_KARGO_PAKETLERI",
    finance808: "10_808_FINANS_ONIZLEME",
    ebelge: "11_EBELGE_ISTISNA",
    control: "12_KONTROL_MERKEZI",
    dictionary: "13_VERI_SOZLUGU",
    bank: "14_BANKA_HAREKETLERI",
    addressMemory: "15_MUSTERI_ADRESLERI"
  };

  const missingSheets = Object.values(required).filter(sheetName => !workbook.sheetNames.includes(sheetName));
  assert(missingSheets.length === 0, "Zorunlu sayfa eksik", missingSheets);

  const headerMismatches = {};
  for (const [key, sheetName] of Object.entries(required)) {
    const actual = headers(workbook, sheetName);
    const expected = codeHeaders[key] || [];
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      const actualNorm = new Set(actual.map(normalize));
      const expectedNorm = new Set(expected.map(normalize));
      headerMismatches[sheetName] = {
        sheet_extra: actual.filter(name => !expectedNorm.has(normalize(name))),
        code_missing_in_sheet: expected.filter(name => !actualNorm.has(normalize(name))),
        order_mismatch: actual.length === expected.length &&
          actual.every(name => expectedNorm.has(normalize(name))) &&
          expected.every(name => actualNorm.has(normalize(name))),
        actual,
        expected
      };
    }
  }
  assert(Object.keys(headerMismatches).length === 0, "Sheet referans kolon sözleşmesi kod HEADERS ile eşleşmiyor", headerMismatches);

  const openIds = new Set(records(workbook, "03_ACIK_SIPARISLER").map(row => row.acik_siparis_id).filter(Boolean));
  assert(openIds.size > 0, "03_ACIK_SIPARISLER içinde Açık_Sipariş_ID bulunamadı");

  const linkErrors = {};
  [
    "04_URUN_KALEMLERI",
    "05_ODEMELER",
    "06_FATURA_GRUPLARI",
    "07_PARASUT_FATURA",
    "08_KARGO_PAKETLERI",
    "10_808_FINANS_ONIZLEME",
    "11_EBELGE_ISTISNA"
  ].forEach(sheetName => {
    const missing = [...new Set(records(workbook, sheetName)
      .map(row => row.acik_siparis_id)
      .filter(Boolean)
      .filter(openId => !openIds.has(openId)))];
    if (missing.length) linkErrors[sheetName] = missing;
  });
  assert(Object.keys(linkErrors).length === 0, "Bağlı sayfalarda 03 içinde bulunmayan Açık_Sipariş_ID var", linkErrors);

  const dictionaryPairs = new Set(records(workbook, "13_VERI_SOZLUGU")
    .filter(row => row.sayfa && row.kolon)
    .map(row => `${row.sayfa}::${row.kolon}`));
  const dictionaryMissing = [];
  Object.values(required).forEach(sheetName => {
    if (sheetName === "13_VERI_SOZLUGU") return;
    headers(workbook, sheetName).forEach(header => {
      if (!dictionaryPairs.has(`${sheetName}::${header}`)) dictionaryMissing.push({ Sayfa: sheetName, Kolon: header });
    });
  });
  assert(dictionaryMissing.length === 0, "13_VERI_SOZLUGU gerçek kolonları kapsamıyor", dictionaryMissing);

  const financeErrors = records(workbook, "10_808_FINANS_ONIZLEME")
    .map((row, index) => ({ row: index + 2, raw: row.fark, value: parseAmount(row.fark) }))
    .filter(item => item.raw && (!Number.isFinite(item.value) || Math.abs(item.value) > 1e-9));
  assert(financeErrors.length === 0, "10_808_FINANS_ONIZLEME Fark alanı sıfır olmayan kayıt içeriyor", financeErrors);

  const requiredColumns = {
    "07_PARASUT_FATURA": ["Payload_JSON", "Response_JSON", "Gönderim_Tarihi"],
    "08_KARGO_PAKETLERI": [
      "Navlungo_Post_Number",
      "Navlungo_Tracking_URL",
      "Navlungo_Barcode_URL",
      "Navlungo_Status",
      "Barkod_Yazdirildi_Mi",
      "Barkod_Yazdirma_Sonucu",
      "Barkod_Yazdirma_Hata"
    ]
  };
  const missingRequiredColumns = {};
  for (const [sheetName, names] of Object.entries(requiredColumns)) {
    const actual = new Set(headers(workbook, sheetName).map(normalize));
    const missing = names.filter(name => !actual.has(normalize(name)));
    if (missing.length) missingRequiredColumns[sheetName] = missing;
  }
  assert(Object.keys(missingRequiredColumns).length === 0, "Zorunlu referans kolonları eksik", missingRequiredColumns);

  const paymentStatus = records(workbook, "05_ODEMELER")
    .reduce((acc, row) => {
      acc[row.teyit_durumu || ""] = (acc[row.teyit_durumu || ""] || 0) + 1;
      return acc;
    }, {});
  const bankRows = records(workbook, "14_BANKA_HAREKETLERI").length;

  console.log(JSON.stringify({
    ok: true,
    workbook: path.relative(root, workbookPath),
    openIdCount: openIds.size,
    paymentStatus,
    bankRows,
    checks: [
      "Sheet/code header parity",
      "ID link integrity",
      "13_VERI_SOZLUGU coverage",
      "10_808 Fark zero",
      "07/08 required columns"
    ]
  }, null, 2));
}

main().catch(error => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message,
    details: error.details || null
  }, null, 2));
  process.exit(1);
});

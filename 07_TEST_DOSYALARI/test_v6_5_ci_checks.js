const fs = require("fs");
const vm = require("vm");

const activeFiles = [
  "03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs",
  "03_APPS_SCRIPT_KOD/ultraSiparisPaneli.html",
  "03_APPS_SCRIPT_KOD/cariSecDialog.html",
  "03_APPS_SCRIPT_KOD/urunEkleDialog.html",
  "03_APPS_SCRIPT_KOD/odemeEkleDialog.html",
  "03_APPS_SCRIPT_KOD/kargoBilgisiDialog.html"
];

const corePath = "03_APPS_SCRIPT_KOD/tesbih_kuyusu_v6_5_ultra_operasyon_core.gs";
const core = fs.readFileSync(corePath, "utf8");
new vm.Script(core, { filename: corePath });

const publicFunctions = [];
for (const match of core.matchAll(/^function\s+([A-Za-z0-9_]+)\s*\(/gm)) {
  publicFunctions.push(match[1]);
}
const duplicates = [...new Set(publicFunctions.filter((name, index) => publicFunctions.indexOf(name) !== index))];
if (duplicates.length) {
  throw new Error(`Duplicate public function bulundu: ${duplicates.join(", ")}`);
}

const forbidden = [
  "legacy",
  "dummy",
  "placeholder",
  "TODO",
  "later",
  "sample",
  "deprecated",
  "old",
  "mock",
  "geçici",
  "örnek",
  "fake",
  "deneme"
];

const forbiddenHits = [];
for (const file of activeFiles) {
  const content = fs.readFileSync(file, "utf8");
  content.split(/\r?\n/).forEach((line, index) => {
    for (const word of forbidden) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`(^|[^A-Za-z0-9_])${escaped}([^A-Za-z0-9_]|$)`, "iu");
      if (pattern.test(line)) {
        forbiddenHits.push({
          file,
          line: index + 1,
          word,
          text: line.trim()
        });
      }
    }
  });
}
if (forbiddenHits.length) {
  throw new Error(`Yasak ifade bulundu: ${JSON.stringify(forbiddenHits, null, 2)}`);
}

console.log(JSON.stringify({
  ok: true,
  checks: ["core syntax", "duplicate public function", "forbidden active code terms"],
  functionCount: publicFunctions.length,
  activeFiles: activeFiles.length
}, null, 2));

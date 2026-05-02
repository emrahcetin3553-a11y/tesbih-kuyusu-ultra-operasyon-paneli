/**
 * Tesbih Kuyusu V6.4 - Ultra Operasyon Core
 *
 * 02_WHATSAPP_KUYRUGU yalnizca siparis giris/staging alanidir.
 * Urun kaynagi 04, odeme kaynagi 05, fatura grubu 06, kargo kaynagi 08'dir.
 * 07_PARASUT_FATURA sadece satis faturasi taslak katmanidir.
 * 11_EBELGE_ISTISNA resmi e-belge ve istisna karar katmanidir.
 * 14_BANKA_HAREKETLERI manuel banka hareketi teyit ve kontrol katmanidir.
 */

var TK6 = (function () {
  "use strict";

  var CFG = {
    projectUrl: "https://script.google.com/u/0/home/projects/1-lU86xNoxXkuiX8pz8P2MkkIdbbLvT0Ub9bOhrcDLgLQ3a2aio6vIg77/settings",
    cutoff: "16:00",
    defaultTckn: "11111111111",
    defaultVatRate: 0.20,
    defaultCargoCompany: "Aras Kargo",
    defaultCargoFee: 125,
    productMapSetting: "PARASUT_PRODUCT_ID_MAP_JSON",
    contactMapSetting: "PARASUT_CONTACT_ID_MAP_JSON",
    liveParasutSendSetting: "PARASUT_CANLI_GONDERIM",
    liveEbelgeSendSetting: "EBELGE_CANLI_GONDERIM",
    batchLimitSetting: "PARASUT_BATCH_LIMIT",
    sheets: {
      guide: "00_KULLANIM_KILAVUZU",
      settings: "01_AYARLAR",
      queue: "02_WHATSAPP_KUYRUGU",
      open: "03_ACIK_SIPARISLER",
      items: "04_URUN_KALEMLERI",
      payments: "05_ODEMELER",
      invoiceGroups: "06_FATURA_GRUPLARI",
      parasut: "07_PARASUT_FATURA",
      cargo: "08_KARGO_PAKETLERI",
      memory: "09_MUSTERI_HAFIZA",
      finance808: "10_808_FINANS_ONIZLEME",
      ebelge: "11_EBELGE_ISTISNA",
      control: "12_KONTROL_MERKEZI",
      dictionary: "13_VERI_SOZLUGU",
      bank: "14_BANKA_HAREKETLERI"
    }
  };

  var H = {
    Q_ID: "Kuyruk_ID",
    CREATED: "Kayıt_Tarihi",
    MSG_DT: "Mesaj_Tarihi_Saati",
    OP_DAY: "Operasyon_Günü",
    PHONE: "WhatsApp_Tel",
    OWNER: "Sipariş_Sahibi",
    RAW: "Ham_WhatsApp_Mesajı",
    RAW_NORMALIZED: "Normalize_Ham_WhatsApp_Mesajı",
    FAST_PRODUCTS: "Hızlı_Ürün_Girişi",
    FAST_PAYMENTS: "Hızlı_Ödeme_Girişi",
    FAST_CARGO: "Hızlı_Kargo_Girişi",
    OPEN_ID: "Açık_Sipariş_ID",
    ORDER_STATUS: "Sipariş_Durumu",
    ROW_STATUS: "Satır_Durumu",
    WARN: "Kontrol_Uyarısı",
    NOTE: "Operatör_Notu",
    ORDER_NO: "Sipariş_No",
    FIRST_TS: "İlk_Kayıt_Zamanı",
    LAST_TS: "Son_Kayıt_Zamanı",
    ITEM_COUNT: "Ürün_Kalem_Sayısı",
    PAYMENT_COUNT: "Ödeme_Satırı_Sayısı",
    GROUP_COUNT: "Fatura_Grubu_Sayısı",
    CARGO_COUNT: "Kargo_Paket_Sayısı",
    TOTAL_GROSS: "Toplam_KDV_Dahil",
    TOTAL_NET: "Toplam_KDV_Hariç",
    TOTAL_VAT: "Toplam_KDV",
    PAYMENT_TOTAL: "Toplam_Ödeme",
    PAYMENT_DIFF: "Ödeme_Farkı",
    CARGO_STATUS: "Kargo_Durumu",
    INVOICE_STATUS: "Fatura_Durumu",
    EBELGE_STATUS: "E_Belge_Durumu",
    CONTROL_LEVEL: "Kontrol_Seviyesi",
    MERGE_KEY: "Açık_Sipariş_Merge_Key",
    CLOSE_OK: "ERP_Kapanış_Uygun_Mu",
    BLOCK_REASON: "ERP_Blokaj_Nedeni",
    ITEM_ID: "Ürün_Kalem_ID",
    SEQ: "Sıra_No",
    PRODUCT: "Ürün_Adı",
    PRODUCT_TYPE: "Ürün_Tipi",
    UNIT: "Birim",
    QTY: "Miktar",
    UNIT_GROSS: "Birim_Fiyat_KDV_Dahil",
    LINE_GROSS: "Toplam_KDV_Dahil",
    VAT_RATE: "KDV_Oranı",
    VAT_MODEL: "KDV_Modeli",
    LINE_NET: "KDV_Hariç",
    VAT_AMOUNT: "KDV_Tutarı",
    SILVER_GRAM: "Gümüş_Gram",
    SILVER_COST_UNIT: "Gümüş_Alış_Birim",
    SILVER_SALE_UNIT: "Gümüş_Satış_Birim",
    SILVER_AMOUNT_TYPE: "Gümüş_Tutar_Tipi",
    SILVER_MARGIN: "Gümüş_Marj_Sonucu",
    PARASUT_PRODUCT_ID: "Paraşüt_Ürün_ID",
    PAYMENT_ID: "Ödeme_ID",
    INVOICE_GROUP_ID: "Fatura_Grubu_ID",
    INVOICE_CARI_LINK_ID: "Fatura_Cari_Bağlantı_ID",
    ITEM_STATUS: "Kalem_Durumu",
    PAYER: "Ödeme_Yapan",
    PAYMENT_AMOUNT: "Ödeme_Tutarı",
    PAYMENT_DATE: "Ödeme_Tarihi",
    PAYMENT_SOURCE: "Ödeme_Teyit_Kaynağı",
    RECEIPT_REF: "Dekont_Referans",
    PAYER_TEL: "Ödeme_Yapan_Tel",
    PAYER_TAX_NO: "Ödeme_Yapan_TCKN_VKN",
    PAYER_ADDRESS: "Ödeme_Yapan_Adres",
    PAYER_CITY: "Ödeme_Yapan_İl",
    PAYER_DISTRICT: "Ödeme_Yapan_İlçe",
    CONFIRM_STATUS: "Teyit_Durumu",
    CONFIRM_NOTE: "Teyit_Notu",
    BANK_MOVE_ID: "Banka_Hareket_ID",
    BANK_MATCH_STATUS: "Banka_Eşleşme_Durumu",
    BANK_MATCH_SCORE: "Banka_Eşleşme_Puanı",
    BANK_MATCH_NOTE: "Banka_Eşleşme_Notu",
    OPERATOR_CONFIRM: "Operatör_Teyidi",
    INVOICE_PERSON: "Fatura_Kişisi",
    CARI_TYPE: "Cari_Tipi",
    INVOICE_TEL: "Fatura_Tel",
    TAX_NO: "Fatura_TCKN_VKN",
    TAX_OFFICE: "Fatura_Vergi_Dairesi",
    INVOICE_ADDRESS: "Fatura_Adres",
    INVOICE_CITY: "Fatura_İl",
    INVOICE_DISTRICT: "Fatura_İlçe",
    ITEM_SUM: "Ürün_Toplamı",
    GROUP_PAYMENT_SUM: "Ödeme_Toplamı",
    DIFF: "Fark",
    PARASUT_CONTACT_ID: "Paraşüt_Cari_ID",
    CARI_MATCH_SCORE: "Cari_Eşleşme_Güven_Puanı",
    CARI_MATCH_STATUS: "Cari_Eşleşme_Durumu",
    CARI_ACTION: "Cari_Aksiyon",
    PARASUT_INVOICE_ID: "Paraşüt_Fatura_ID",
    SEND_LOCK: "Gönderim_Kilidi",
    ACTION: "Aksiyon",
    UNIT_NET: "Birim_Fiyat_KDV_Hariç",
    PARASUT_STATUS: "Paraşüt_Durumu",
    PAYLOAD_CHECK: "Payload_Kontrol",
    ERROR: "Hata_Mesajı",
    CAN_SEND_DRAFT: "Taslak_Gönderime_Uygun_Mu",
    DRAFT_BLOCK: "Taslak_Blokaj_Nedeni",
    CARGO_PACKAGE_ID: "Kargo_Paket_ID",
    CARGO_RECEIVER: "Kargo_Alıcısı",
    CARGO_TEL: "Kargo_Tel",
    CITY: "İl",
    DISTRICT: "İlçe",
    ADDRESS: "Adres",
    CARGO_COMPANY: "Kargo_Firması",
    PACKAGE_STATUS: "Paket_Durumu",
    BARCODE: "Barkod",
    TRACKING_NO: "Takip_No",
    LATE_ADD: "Geç_Ekleme_Var_Mı",
    PACKAGE_NOTE: "Paket_Notu",
    FIN_ID: "808_Kayıt_ID",
    MODEL_TYPE: "Model_Tipi",
    NET_GAIN: "Net_Ticari_Kazanç",
    OFFICIAL_NOTE: "Resmi_Fatura_Notu",
    NO_INVOICE_EFFECT: "Fatura_Etkisi_Yok",
    EBELGE_ID: "E_Belge_Kayıt_ID",
    EBELGE_TYPE: "E_Belge_Tipi",
    HAS_SILVER: "Gümüş_İçeriyor_Mu",
    HAS_VAT_ZERO: "KDV0_Satırı_Var_Mı",
    NEED_EXEMPTION: "İstisna_Gerekli_Mi",
    EXEMPTION_CODE: "İstisna_Kodu",
    EXEMPTION_DESC: "İstisna_Açıklama",
    SEND_STATUS: "Gönderim_Durumu",
    OFFICIAL_APPROVAL: "Resmi_Gönderim_Onayı",
    OFFICIAL_BLOCK: "Resmi_Gönderim_Blokaj_Nedeni",
    CTRL_ID: "Kontrol_ID",
    DATE: "Tarih",
    SOURCE_SHEET: "Kaynak_Sayfa",
    SOURCE_ID: "Kaynak_ID",
    CTRL_TYPE: "Kontrol_Tipi",
    RISK: "Risk_Seviyesi",
    STATUS: "Durum",
    ACTION_EXPECTED: "Beklenen_Aksiyon",
    RESPONSIBLE: "Sorumlu",
    SOLUTION: "Çözüm_Notu",
    CLOSED_AT: "Kapanış_Tarihi",
    IS_BLOCK: "Blokaj_Mı",
    MODULE: "İlgili_Modül",
    BANK_DATE: "İşlem_Tarihi",
    BANK_VALUE_DATE: "Valör_Tarihi",
    BANK_SENDER: "Gönderen_Adı",
    BANK_DESC: "Açıklama",
    BANK_AMOUNT: "Tutar",
    BANK_NAME: "Banka_Adı",
    IBAN: "IBAN",
    BANK_TX_TYPE: "İşlem_Tipi",
    REF_NO: "Referans_No",
    MATCH_STATUS: "Eşleşme_Durumu",
    MATCH_SCORE: "Eşleşme_Puanı",
    SUGGESTED_OPEN_ID: "Önerilen_Açık_Sipariş_ID",
    SUGGESTED_PAYMENT_ID: "Önerilen_Ödeme_ID",
    SUGGESTED_PAYER: "Önerilen_Ödeme_Yapan",
    OPERATOR_APPROVAL: "Operatör_Onayı"
  };

  var HEADERS = {
    settings: ["Ayar_Kodu", "Ayar_Değeri", "Açıklama", "Zorunlu_Mu", "Son_Güncelleme", "Not"],
    queue: [
      H.Q_ID, H.CREATED, H.MSG_DT, H.OP_DAY, H.PHONE, H.OWNER, H.RAW, H.RAW_NORMALIZED,
      H.FAST_PRODUCTS, H.FAST_PAYMENTS, H.FAST_CARGO,
      H.OPEN_ID, H.ORDER_STATUS, H.ROW_STATUS, H.WARN, H.NOTE
    ],
    open: [
      H.OPEN_ID, H.ORDER_NO, H.OP_DAY, H.FIRST_TS, H.LAST_TS, H.PHONE, H.OWNER,
      H.ORDER_STATUS, H.ITEM_COUNT, H.PAYMENT_COUNT, H.GROUP_COUNT, H.CARGO_COUNT,
      H.TOTAL_GROSS, H.TOTAL_NET, H.TOTAL_VAT, H.PAYMENT_TOTAL, H.PAYMENT_DIFF,
      H.CARGO_STATUS, H.INVOICE_STATUS, H.EBELGE_STATUS, H.CONTROL_LEVEL, H.WARN,
      H.NOTE, H.MERGE_KEY, H.CLOSE_OK, H.BLOCK_REASON
    ],
    items: [
      H.ITEM_ID, H.OPEN_ID, H.Q_ID, H.SEQ, H.INVOICE_CARI_LINK_ID, H.PAYER, H.PRODUCT, H.PRODUCT_TYPE, H.UNIT,
      H.QTY, H.UNIT_GROSS, H.LINE_GROSS, H.VAT_MODEL, H.VAT_RATE, H.LINE_NET, H.VAT_AMOUNT,
      H.SILVER_GRAM, H.SILVER_COST_UNIT, H.SILVER_SALE_UNIT, H.SILVER_AMOUNT_TYPE, H.SILVER_MARGIN,
      H.PARASUT_PRODUCT_ID, H.PAYMENT_ID, H.INVOICE_GROUP_ID, H.ITEM_STATUS, H.WARN
    ],
    payments: [
      H.PAYMENT_ID, H.OPEN_ID, H.Q_ID, H.PAYER, H.PAYMENT_AMOUNT, H.PAYMENT_DATE,
      H.PAYMENT_SOURCE, H.RECEIPT_REF, H.PAYER_TEL, H.PAYER_TAX_NO, H.PAYER_ADDRESS,
      H.PAYER_CITY, H.PAYER_DISTRICT, H.INVOICE_CARI_LINK_ID, H.CONFIRM_STATUS, H.CONFIRM_NOTE,
      H.BANK_MOVE_ID, H.BANK_MATCH_STATUS, H.BANK_MATCH_SCORE, H.BANK_MATCH_NOTE,
      H.OPERATOR_CONFIRM, H.WARN
    ],
    invoiceGroups: [
      H.INVOICE_GROUP_ID, H.OPEN_ID, H.PAYER, H.INVOICE_PERSON, H.CARI_TYPE,
      H.INVOICE_TEL, H.TAX_NO, H.TAX_OFFICE, H.INVOICE_ADDRESS, H.INVOICE_CITY, H.INVOICE_DISTRICT,
      H.EBELGE_TYPE, H.ITEM_SUM, H.GROUP_PAYMENT_SUM, H.DIFF, H.INVOICE_STATUS, H.PARASUT_CONTACT_ID,
      H.CARI_MATCH_SCORE, H.CARI_MATCH_STATUS, H.CARI_ACTION,
      H.PARASUT_INVOICE_ID, H.SEND_LOCK, H.WARN
    ],
    parasut: [
      H.ACTION, H.INVOICE_GROUP_ID, H.OPEN_ID, H.INVOICE_PERSON, H.CARI_TYPE,
      H.PARASUT_CONTACT_ID, H.ITEM_ID, H.PRODUCT, H.PARASUT_PRODUCT_ID, H.QTY,
      H.UNIT, H.UNIT_NET, H.VAT_RATE, H.VAT_AMOUNT, H.LINE_GROSS, H.PARASUT_INVOICE_ID,
      H.PARASUT_STATUS, H.SEND_LOCK, H.PAYLOAD_CHECK, H.ERROR, H.CAN_SEND_DRAFT,
      H.DRAFT_BLOCK, H.NOTE
    ],
    cargo: [
      H.CARGO_PACKAGE_ID, H.OPEN_ID, H.CARGO_RECEIVER, H.CARGO_TEL, H.CITY, H.DISTRICT,
      H.ADDRESS, H.CARGO_COMPANY, H.PACKAGE_STATUS, H.BARCODE, H.TRACKING_NO, H.LATE_ADD,
      H.PACKAGE_NOTE, H.WARN
    ],
    memory: [
      H.PHONE, H.OWNER, "Son_Kargo_Alıcısı", "Son_Kargo_Tel", "Son_İl", "Son_İlçe",
      "Son_Adres", "Son_Fatura_Kişisi", "Son_Fatura_Tel", "Son_Fatura_TCKN_VKN",
      H.PARASUT_CONTACT_ID, "Son_Ödeme_Yapanlar_JSON", "Cari_Adaylari_JSON",
      "Son_Kargo_Bilgisi_JSON", "Güven_Puanı", "Son_Başarılı_Sipariş_ID",
      "Son_Güncelleme", "Güven_Notu", H.WARN
    ],
    finance808: [
      H.FIN_ID, H.OPEN_ID, H.MODEL_TYPE, H.ITEM_SUM, H.LINE_NET, H.VAT_AMOUNT,
      H.GROUP_PAYMENT_SUM, H.DIFF, H.NET_GAIN, H.OFFICIAL_NOTE, H.NO_INVOICE_EFFECT, H.WARN
    ],
    ebelge: [
      H.EBELGE_ID, H.INVOICE_GROUP_ID, H.OPEN_ID, H.PARASUT_INVOICE_ID, H.INVOICE_PERSON,
      H.TAX_NO, H.CARI_TYPE, H.EBELGE_TYPE, H.HAS_SILVER, H.HAS_VAT_ZERO,
      H.NEED_EXEMPTION, H.EXEMPTION_CODE, H.EXEMPTION_DESC, H.SEND_STATUS,
      H.OFFICIAL_APPROVAL, H.OFFICIAL_BLOCK, H.CONTROL_LEVEL
    ],
    control: [
      H.CTRL_ID, H.DATE, H.SOURCE_SHEET, H.SOURCE_ID, H.CTRL_TYPE, H.RISK, H.STATUS,
      H.WARN, H.ACTION_EXPECTED, H.RESPONSIBLE, H.SOLUTION, H.CLOSED_AT, H.IS_BLOCK, H.MODULE
    ],
    bank: [
      H.BANK_MOVE_ID, H.BANK_DATE, H.BANK_VALUE_DATE, H.BANK_SENDER, H.BANK_DESC,
      H.BANK_AMOUNT, H.BANK_NAME, H.IBAN, H.BANK_TX_TYPE, H.REF_NO, H.MATCH_STATUS,
      H.MATCH_SCORE, H.SUGGESTED_OPEN_ID, H.SUGGESTED_PAYMENT_ID, H.SUGGESTED_PAYER,
      H.OPERATOR_APPROVAL, H.WARN
    ]
  };

  function onOpen_() {
    SpreadsheetApp.getUi()
      .createMenu("TESBİH KUYUSU PANEL")
      .addItem("Ultra sipariş paneli", "ultraSiparisPaneli")
      .addItem("Toplu sipariş paneli", "topluSiparisPaneli")
      .addItem("Kaydet ve ERP güncelle", "kaydetVeErpGuncelle")
      .addItem("Fatura ve kargo oluştur", "faturaVeKargoOlustur")
      .addItem("Kontrol merkezi", "kontrolMerkezi")
      .addItem("Paraşüt API bağlantısını test et", "parasutApiBaglantiTestiTam")
      .addItem("Görünümü düzenle", "otomatikGorunumuDuzenle")
      .addItem("Gelişmiş / Teknik: Cari seç / oluştur", "cariSecDialog")
      .addItem("Gelişmiş / Teknik: Hızlı sipariş oluştur", "hizliSiparisOlustur")
      .addItem("Gelişmiş / Teknik: Ürün ekle", "urunEkle")
      .addItem("Gelişmiş / Teknik: Ödeme ekle", "odemeEkle")
      .addItem("Gelişmiş / Teknik: Kargo bilgisi gir", "kargoBilgisiGir")
      .addItem("Gelişmiş / Teknik: Sistemi yenile", "sistemiYenile")
      .addItem("Gelişmiş / Teknik: Kontrol merkezini güncelle", "kontrolMerkeziniGuncelle")
      .addItem("Gelişmiş / Teknik: Sistemi canlıya hazırla", "sistemiCanliyaHazirla")
      .addItem("Paraşüt ürün kartlarını kontrol et", "parasutUrunKartlariniKontrolEt")
      .addItem("Paraşüt cari hazırlığı yap", "parasutCariHazirla")
      .addItem("Paraşüt cari adaylarını getir", "parasutCariAdaylariniGetir")
      .addItem("Paraşüt taslak payload test et", "parasutTaslakPayloadTestEt")
      .addItem("Paraşüt taslak gönder", "parasutFaturaTaslakGonderOnayli")
      .addItem("e-Belge / istisna hazırlığı yap", "ebelgeIstisnaHazirla")
      .addItem("16:00 sonrası geç ekleme işlemi", "gecEklemeIstisnaIslemi")
      .addItem("Banka hareketlerini içeri al", "bankaHareketleriniIceriAl")
      .addItem("Banka hareketlerini eşleştir", "bankaHareketleriniEsle")
      .addItem("Banka eşleşmelerini kontrol et", "bankaEslesmeKontrolMerkeziniGuncelle")
      .addItem("Fatura ve kargo oluştur", "faturaVeKargoOlustur")
      .addToUi();
  }

  function onEdit_(e) {
    if (!e || !e.source || !e.range) return;
    var sh = e.range.getSheet();
    if (e.range.getRow() < 2) return;
    var sheetName = sh.getName();
    var supported = [CFG.sheets.queue, CFG.sheets.items, CFG.sheets.payments, CFG.sheets.cargo, CFG.sheets.open, CFG.sheets.bank];
    if (supported.indexOf(sheetName) === -1) return;
    var lock = LockService.getDocumentLock();
    if (!lock.tryLock(3000)) return;
    try {
      var start = e.range.getRow();
      var end = start + e.range.getNumRows() - 1;
      var openIds = {};
      for (var row = start; row <= end; row++) {
        var openId = "";
        if (sheetName === CFG.sheets.queue) {
          normalizeQueueSheetRow_(e.source, row);
          acikSiparisleriGrupla_();
          processQueueQuickInputs_(e.source, row);
          openId = rowOpenId_(sh, row);
        } else if (sheetName === CFG.sheets.items) {
          openId = normalizeItemSheetRow_(e.source, row);
        } else if (sheetName === CFG.sheets.payments) {
          openId = normalizePaymentSheetRow_(e.source, row);
        } else if (sheetName === CFG.sheets.cargo) {
          openId = normalizeCargoSheetRow_(e.source, row);
        } else if (sheetName === CFG.sheets.open) {
          openId = rowOpenId_(sh, row);
        } else if (sheetName === CFG.sheets.bank) {
          bankaHareketleriniIceriAl_();
        }
        if (openId) openIds[openId] = true;
      }
      Object.keys(openIds).forEach(function (openId) { hafifErpGuncelle_(openId); });
    } finally {
      lock.releaseLock();
    }
  }

  function sistemKolonlariniHazirla_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheet_(ss, CFG.sheets.queue, HEADERS.queue);
    ensureSheet_(ss, CFG.sheets.open, HEADERS.open);
    ensureSheet_(ss, CFG.sheets.items, HEADERS.items);
    ensureSheet_(ss, CFG.sheets.payments, HEADERS.payments);
    ensureSheet_(ss, CFG.sheets.invoiceGroups, HEADERS.invoiceGroups);
    ensureSheet_(ss, CFG.sheets.parasut, HEADERS.parasut);
    ensureSheet_(ss, CFG.sheets.cargo, HEADERS.cargo);
    ensureSheet_(ss, CFG.sheets.memory, HEADERS.memory);
    ensureSheet_(ss, CFG.sheets.finance808, HEADERS.finance808);
    ensureSheet_(ss, CFG.sheets.ebelge, HEADERS.ebelge);
    ensureSheet_(ss, CFG.sheets.control, HEADERS.control);
    ensureSheet_(ss, CFG.sheets.bank, HEADERS.bank);
    ensureSheet_(ss, CFG.sheets.settings, HEADERS.settings);
    ensureRequiredSettings_(ss);
    return true;
  }

  function sistemiYenile_() {
    sistemKolonlariniHazirla_();
    satirlariNormalizeEt_();
    acikSiparisleriGrupla_();
    odemeleriKontrolEt_();
    urunKalemleriniKontrolEt_();
    faturaGruplariniOlustur_();
    rebuildOpenOrders_();
    kargoPaketleriniOlustur_();
    finans808OnizlemeOlustur_();
    parasutTaslaklariniHazirla_();
    ebelgeIstisnaHazirla_();
    rebuildOpenOrders_();
    kontrolMerkeziniGuncelle_();
    return true;
  }

  function sistemiCanliyaHazirla_() {
    var result = { startedAt: new Date(), liveInvoicePost: "Yapılmadı", liveEbelgePost: "Yapılmadı", steps: [] };
    result.steps.push(stepResult_("sistemKolonlariniHazirla", sistemKolonlariniHazirla_));
    result.steps.push(stepResult_("satirlariNormalizeEt", satirlariNormalizeEt_));
    result.steps.push(stepResult_("sistemiYenile", sistemiYenile_));
    result.steps.push(stepResult_("kontrolMerkeziniGuncelle", kontrolMerkeziniGuncelle_));
    result.steps.push(stepResult_("parasutTokenYenile", parasutTokenYenile_));
    result.steps.push(stepResult_("parasutUrunKartlariniKontrolEt", parasutUrunKartlariniKontrolEt_));
    result.steps.push(stepResult_("parasutCariHazirla", parasutCariHazirla_));
    result.steps.push(stepResult_("parasutTaslaklariniHazirla", parasutTaslaklariniHazirla_));
    result.finishedAt = new Date();
    result.ok = result.steps.every(function (s) { return s.ok; });
    return result;
  }

  function satirlariNormalizeEt_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = sheet_(ss, CFG.sheets.queue);
    if (!sh || sh.getLastRow() < 2) return true;
    for (var row = 2; row <= sh.getLastRow(); row++) normalizeQueueSheetRow_(ss, row);
    return true;
  }

  function normalizeQueueSheetRow_(ss, rowNum) {
    var sh = sheet_(ss, CFG.sheets.queue);
    var h = headers_(sh);
    var width = sh.getLastColumn();
    var range = sh.getRange(rowNum, 1, 1, width);
    var row = range.getValues()[0];
    if (!queueRowHasData_(row, h)) return false;
    normalizeQueueRowArray_(row, h, rowNum);
    range.setValues([row]);
    return true;
  }

  function normalizeQueueRowArray_(row, h, rowNum) {
    if (!val_(row, h, H.CREATED)) setIf_(row, h, H.CREATED, new Date());
    var msgDate = toDate_(val_(row, h, H.MSG_DT)) || new Date();
    if (!val_(row, h, H.MSG_DT)) setIf_(row, h, H.MSG_DT, msgDate);
    setIf_(row, h, H.OP_DAY, operationDate_(msgDate));
    setIf_(row, h, H.PHONE, normalizePhone_(val_(row, h, H.PHONE)));
    if (val_(row, h, H.OWNER)) setIf_(row, h, H.OWNER, normalizePersonName_(val_(row, h, H.OWNER)));
    if (val_(row, h, H.RAW)) setIf_(row, h, H.RAW_NORMALIZED, normalizeMessageText_(val_(row, h, H.RAW)));
    if (!val_(row, h, H.Q_ID)) setIf_(row, h, H.Q_ID, "Q-" + ymd_(msgDate) + "-" + pad_(rowNum - 1, 4));
    if (!val_(row, h, H.ORDER_STATUS)) setIf_(row, h, H.ORDER_STATUS, "Açık");
    if (!val_(row, h, H.ROW_STATUS)) setIf_(row, h, H.ROW_STATUS, "Staging");
  }

  function normalizeItemSheetRow_(ss, rowNum) {
    var sh = sheet_(ss, CFG.sheets.items);
    var h = headers_(sh);
    var range = sh.getRange(rowNum, 1, 1, sh.getLastColumn());
    var row = range.getValues()[0];
    if (!val_(row, h, H.OPEN_ID) && !val_(row, h, H.PRODUCT)) return "";
    var openId = val_(row, h, H.OPEN_ID);
    var productName = normalizeUrunAdi_(val_(row, h, H.PRODUCT));
    var config = getUrunConfig_(productName);
    var qty = num_(val_(row, h, H.QTY)) || 1;
    var unitGross = num_(val_(row, h, H.UNIT_GROSS));
    var gross = num_(val_(row, h, H.LINE_GROSS)) || round2_(qty * unitGross);
    var vatRate = normalizeVatRate_(val_(row, h, H.VAT_RATE) || (config && config.vatRate));
    var kdv = hesaplaKdv_(gross, vatRate);
    var silverType = normalizeSilverAmountType_(val_(row, h, H.SILVER_AMOUNT_TYPE));
    var payer = normalizePersonName_(val_(row, h, H.PAYER));
    var linkId = val_(row, h, H.INVOICE_CARI_LINK_ID) || (openId && payer ? invoiceCariLinkId_(openId, payer) : "");
    var warnings = [];

    if (!openId) warnings.push("Açık sipariş ID eksik");
    if (!productName) warnings.push("Ürün seçilmedi / eşleşmedi");
    if (!unitGross && !gross) warnings.push("Ürün fiyatı girilmeli");
    if (productType_(productName) === "Gümüş" && val_(row, h, H.SILVER_AMOUNT_TYPE) && !silverType) warnings.push("Gümüş_Tutar_Tipi Birim veya Toplam olmalı");
    if (!val_(row, h, H.PAYMENT_ID)) warnings.push("Ödeme ID eksik");
    if (!val_(row, h, H.INVOICE_GROUP_ID)) warnings.push("Fatura grubu ödeme sonrası oluşur");

    setIf_(row, h, H.ITEM_ID, val_(row, h, H.ITEM_ID) || "UK-" + (openId || "NOOPEN") + "-" + pad_(rowNum - 1, 4));
    setIf_(row, h, H.Q_ID, val_(row, h, H.Q_ID) || findQueueIdForOpenId_(ss, openId));
    setIf_(row, h, H.SEQ, val_(row, h, H.SEQ) || nextItemSeq_(ss, openId, rowNum));
    setIf_(row, h, H.PAYER, payer);
    setIf_(row, h, H.INVOICE_CARI_LINK_ID, linkId);
    setIf_(row, h, H.PRODUCT, productName || val_(row, h, H.PRODUCT));
    setIf_(row, h, H.PRODUCT_TYPE, config ? config.type : "");
    setIf_(row, h, H.UNIT, val_(row, h, H.UNIT) || (config && config.unit) || "Adet");
    setIf_(row, h, H.QTY, qty);
    setIf_(row, h, H.UNIT_GROSS, unitGross || (qty ? round6_(gross / qty) : ""));
    setIf_(row, h, H.LINE_GROSS, gross || "");
    setIf_(row, h, H.VAT_MODEL, val_(row, h, H.VAT_MODEL) || (vatRate === 0 ? "KDV 0" : "Standart KDV"));
    setIf_(row, h, H.VAT_RATE, vatRate);
    setIf_(row, h, H.LINE_NET, gross ? kdv.net : "");
    setIf_(row, h, H.VAT_AMOUNT, gross ? kdv.vat : "");
    setIf_(row, h, H.SILVER_AMOUNT_TYPE, silverType);
    setIf_(row, h, H.SILVER_SALE_UNIT, val_(row, h, H.SILVER_SALE_UNIT) || unitGross || "");
    setIf_(row, h, H.SILVER_MARGIN, productType_(productName) === "Gümüş" ? calculateSilverMargin_(row, h, gross) : "");
    setIf_(row, h, H.PARASUT_PRODUCT_ID, productName ? urunIdBul_(productName) : "");
    setIf_(row, h, H.ITEM_STATUS, warnings.length ? "Kontrol Gerekli" : "Hazır");
    setIf_(row, h, H.WARN, warnings.join(" | "));
    range.setValues([row]);
    return openId;
  }

  function normalizePaymentSheetRow_(ss, rowNum) {
    var sh = sheet_(ss, CFG.sheets.payments);
    var h = headers_(sh);
    var range = sh.getRange(rowNum, 1, 1, sh.getLastColumn());
    var row = range.getValues()[0];
    if (!val_(row, h, H.OPEN_ID) && !val_(row, h, H.PAYER) && !val_(row, h, H.PAYMENT_AMOUNT)) return "";
    var openId = val_(row, h, H.OPEN_ID);
    var payer = normalizePersonName_(val_(row, h, H.PAYER));
    var bankMoveId = String(val_(row, h, H.BANK_MOVE_ID) || "").trim();
    var operatorConfirm = String(val_(row, h, H.OPERATOR_CONFIRM) || "").trim();
    var warnings = [];
    if (!openId) warnings.push("Açık sipariş ID eksik");
    if (!payer) warnings.push("Ödeme yapan eksik");
    if (!num_(val_(row, h, H.PAYMENT_AMOUNT))) warnings.push("Ödeme tutarı eksik");
    if (bankMoveId && !yes_(operatorConfirm)) warnings.push("Banka hareketi için operatör teyidi gerekli");
    setIf_(row, h, H.PAYMENT_ID, val_(row, h, H.PAYMENT_ID) || "OD-" + (openId || "NOOPEN") + "-" + safeKey_(payer || "ODEME") + "-" + pad_(rowNum - 1, 3));
    setIf_(row, h, H.Q_ID, val_(row, h, H.Q_ID) || findQueueIdForOpenId_(ss, openId));
    setIf_(row, h, H.PAYER, payer);
    setIf_(row, h, H.PAYER_TEL, normalizePhone_(val_(row, h, H.PAYER_TEL)));
    setIf_(row, h, H.PAYER_TAX_NO, normalizeTaxNo_(val_(row, h, H.PAYER_TAX_NO)));
    setIf_(row, h, H.PAYER_ADDRESS, normalizeAddress_(val_(row, h, H.PAYER_ADDRESS)));
    setIf_(row, h, H.PAYER_CITY, normalizeCity_(val_(row, h, H.PAYER_CITY)));
    setIf_(row, h, H.PAYER_DISTRICT, normalizeCity_(val_(row, h, H.PAYER_DISTRICT)));
    setIf_(row, h, H.INVOICE_CARI_LINK_ID, val_(row, h, H.INVOICE_CARI_LINK_ID) || (openId && payer ? invoiceCariLinkId_(openId, payer) : ""));
    setIf_(row, h, H.PAYMENT_DATE, val_(row, h, H.PAYMENT_DATE) || new Date());
    setIf_(row, h, H.PAYMENT_SOURCE, val_(row, h, H.PAYMENT_SOURCE) || "Manuel");
    setIf_(row, h, H.CONFIRM_STATUS, val_(row, h, H.CONFIRM_STATUS) || (bankMoveId && yes_(operatorConfirm) ? "Teyit Edildi" : "Bekliyor"));
    setIf_(row, h, H.OPERATOR_CONFIRM, operatorConfirm || "Hayır");
    setIf_(row, h, H.WARN, warnings.join(" | "));
    range.setValues([row]);
    return openId;
  }

  function normalizeCargoSheetRow_(ss, rowNum) {
    var sh = sheet_(ss, CFG.sheets.cargo);
    var h = headers_(sh);
    var range = sh.getRange(rowNum, 1, 1, sh.getLastColumn());
    var row = range.getValues()[0];
    if (!val_(row, h, H.OPEN_ID)) return "";
    var openId = val_(row, h, H.OPEN_ID);
    var summary = openSummaryById_(ss, openId);
    var warnings = [];
    setIf_(row, h, H.CARGO_PACKAGE_ID, val_(row, h, H.CARGO_PACKAGE_ID) || "KP-" + openId);
    setIf_(row, h, H.CARGO_RECEIVER, normalizePersonName_(val_(row, h, H.CARGO_RECEIVER) || summary.owner || ""));
    setIf_(row, h, H.CARGO_TEL, normalizePhone_(val_(row, h, H.CARGO_TEL) || summary.phone || ""));
    setIf_(row, h, H.CITY, normalizeCity_(val_(row, h, H.CITY)));
    setIf_(row, h, H.DISTRICT, normalizeCity_(val_(row, h, H.DISTRICT)));
    setIf_(row, h, H.ADDRESS, normalizeAddress_(val_(row, h, H.ADDRESS)));
    setIf_(row, h, H.CARGO_COMPANY, normalizeCargoCompany_(val_(row, h, H.CARGO_COMPANY) || setting_(ss, "VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany)));
    setIf_(row, h, H.PACKAGE_STATUS, val_(row, h, H.PACKAGE_STATUS) || "Bekliyor");
    [H.CARGO_RECEIVER, H.CARGO_TEL, H.CITY, H.DISTRICT, H.ADDRESS].forEach(function (key) {
      if (!val_(row, h, key)) warnings.push(key + " eksik");
    });
    setIf_(row, h, H.WARN, warnings.join(" | "));
    range.setValues([row]);
    return openId;
  }

  function hizliSiparisOlustur_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var active = ss.getActiveRange && ss.getActiveRange();
    if (!active || active.getSheet().getName() !== CFG.sheets.queue || active.getRow() < 2) {
      throw new Error("Hızlı sipariş için 02_WHATSAPP_KUYRUGU içinde bir satır seçilmelidir.");
    }
    normalizeQueueSheetRow_(ss, active.getRow());
    acikSiparisleriGrupla_();
    var sh = active.getSheet();
    var h = headers_(sh);
    var row = sh.getRange(active.getRow(), 1, 1, sh.getLastColumn()).getValues()[0];
    var openId = val_(row, h, H.OPEN_ID);
    var qid = val_(row, h, H.Q_ID);
    var raw = val_(row, h, H.RAW);
    var parsed = parseHizliUrunGirisi_(val_(row, h, H.FAST_PRODUCTS) || raw);
    if (!parsed.length) {
      setCell_(sh, active.getRow(), h, H.WARN, "Ürün seçimi gerekli; Ürün ekle penceresini kullanın");
      hafifErpGuncelle_(openId);
      return { ok: false, openId: openId, status: "Ürün seçimi gerekli" };
    }
    parsed.forEach(function (item, index) {
      appendProductRowFromParsed_(ss, openId, qid, mergeObjects_(item, { sourceKey: "HIZLI-MENU-" + safeKey_(qid) + "-" + (index + 1) }));
    });
    hafifErpGuncelle_(openId);
    return { ok: true, openId: openId, productCount: parsed.length };
  }

  function urunEkle_() {
    showDialog_("urunEkleDialog", "Ürün ekle", 560, 720);
  }

  function odemeEkle_() {
    showDialog_("odemeEkleDialog", "Ödeme ekle", 500, 560);
  }

  function kargoBilgisiGir_() {
    showDialog_("kargoBilgisiDialog", "Kargo bilgisi gir", 520, 620);
  }

  function cariSecDialog_() {
    showDialog_("cariSecDialog", "Cari seç / oluştur", 760, 620);
  }

  function cariSecimKaydet_(form) {
    if (!form || !form.faturaGrubuId) throw new Error("Fatura_Grubu_ID zorunlu.");
    return parasutCariOlusturVeyaBagla_(form.faturaGrubuId, { mode: form.mode, contactId: form.contactId });
  }

  function showDialog_(fileName, title, width, height) {
    var html = HtmlService.createHtmlOutputFromFile(fileName).setWidth(width).setHeight(height);
    SpreadsheetApp.getUi().showModalDialog(html, title);
  }

  function getDialogData_() {
    return {
      openOrders: openOrderOptions_(),
      products: productOptions_(),
      today: todayIso_(),
      cargoCompanies: ["Aras Kargo", "Yurtiçi Kargo", "MNG Kargo", "Sürat Kargo"],
      paymentSources: ["Manuel", "Dekont", "WhatsApp", "Banka açıklaması"],
      silverAmountTypes: ["Birim", "Toplam"]
    };
  }

  function getUltraPanelHazirlik_(phone) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var normalized = normalizePhone_(phone || "");
    var memory = cacheMusteriHafiza_();
    var row = memory[normalized] || {};
    var openOrder = findOpenOrderForPhone_(ss, normalized);
    return {
      ok: true,
      phone: normalized,
      openOrder: openOrder,
      owner: row[H.OWNER] || "",
      cargo: {
        receiver: row["Son_Kargo_Alıcısı"] || "",
        phone: row["Son_Kargo_Tel"] || normalized,
        city: row["Son_İl"] || "",
        district: row["Son_İlçe"] || "",
        address: row["Son_Adres"] || ""
      },
      invoice: {
        person: row["Son_Fatura_Kişisi"] || "",
        phone: row["Son_Fatura_Tel"] || normalized,
        taxNo: row["Son_Fatura_TCKN_VKN"] || "",
        contactId: row[H.PARASUT_CONTACT_ID] || ""
      },
      payers: parseJsonArray_(row["Son_Ödeme_Yapanlar_JSON"]),
      riskNote: row["Güven_Notu"] || row[H.WARN] || ""
    };
  }

  function urunEkleKaydet_(form) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var openId = String(form && form.acikSiparisId || "").trim();
    var product = normalizeUrunAdi_(form && form.urunAdi);
    if (!openId) throw new Error("Açık_Sipariş_ID seçilmedi.");
    if (!product) throw new Error("Ürün seçilmedi / eşleşmedi.");
    var qty = num_(form.miktar) || 1;
    var unitGross = num_(form.birimFiyatKdvDahil);
    var gross = round2_(qty * unitGross);
    var config = getUrunConfig_(product);
    var vatRate = normalizeVatRate_(form.kdvOrani || (config && config.vatRate));
    var kdv = hesaplaKdv_(gross, vatRate);
    appendObject_(sheet_(ss, CFG.sheets.items), HEADERS.items, {
      [H.OPEN_ID]: openId,
      [H.Q_ID]: findQueueIdForOpenId_(ss, openId),
      [H.PRODUCT]: product,
      [H.PRODUCT_TYPE]: config.type,
      [H.UNIT]: form.birim || config.unit,
      [H.QTY]: qty,
      [H.UNIT_GROSS]: unitGross,
      [H.LINE_GROSS]: gross,
      [H.VAT_MODEL]: form.kdvModeli || "Standart KDV",
      [H.VAT_RATE]: vatRate,
      [H.LINE_NET]: kdv.net,
      [H.VAT_AMOUNT]: kdv.vat,
      [H.SILVER_GRAM]: num_(form.gumusGram) || "",
      [H.SILVER_COST_UNIT]: num_(form.gumusAlisBirim) || "",
      [H.SILVER_AMOUNT_TYPE]: normalizeSilverAmountType_(form.gumusTutarTipi || ""),
      [H.PARASUT_PRODUCT_ID]: urunIdBul_(product),
      [H.NOTE]: form.not || ""
    });
    normalizeItemSheetRow_(ss, sheet_(ss, CFG.sheets.items).getLastRow());
    hafifErpGuncelle_(openId);
    return { ok: true, openId: openId, product: product };
  }

  function odemeEkleKaydet_(form) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var openId = String(form && form.acikSiparisId || "").trim();
    if (!openId) throw new Error("Açık_Sipariş_ID seçilmedi.");
    appendObject_(sheet_(ss, CFG.sheets.payments), HEADERS.payments, {
      [H.OPEN_ID]: openId,
      [H.Q_ID]: findQueueIdForOpenId_(ss, openId),
      [H.PAYER]: form.odemeYapan,
      [H.PAYMENT_AMOUNT]: num_(form.odemeTutari),
      [H.PAYMENT_DATE]: form.odemeTarihi || new Date(),
      [H.PAYMENT_SOURCE]: form.odemeTeyitKaynagi || "Manuel",
      [H.RECEIPT_REF]: form.dekontReferans || "",
      [H.CONFIRM_STATUS]: "Bekliyor",
      [H.CONFIRM_NOTE]: form.not || ""
    });
    normalizePaymentSheetRow_(ss, sheet_(ss, CFG.sheets.payments).getLastRow());
    hafifErpGuncelle_(openId);
    return { ok: true, openId: openId };
  }

  function kargoBilgisiKaydet_(form) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var openId = String(form && form.acikSiparisId || "").trim();
    if (!openId) throw new Error("Açık_Sipariş_ID seçilmedi.");
    upsertObjectByKey_(sheet_(ss, CFG.sheets.cargo), HEADERS.cargo, H.OPEN_ID, openId, {
      [H.CARGO_PACKAGE_ID]: "KP-" + openId,
      [H.OPEN_ID]: openId,
      [H.CARGO_RECEIVER]: form.kargoAlicisi || "",
      [H.CARGO_TEL]: normalizePhone_(form.kargoTel || ""),
      [H.CITY]: form.il || "",
      [H.DISTRICT]: form.ilce || "",
      [H.ADDRESS]: normalizeAddress_(form.adres || ""),
      [H.CARGO_COMPANY]: form.kargoFirmasi || CFG.defaultCargoCompany,
      [H.PACKAGE_STATUS]: "Bekliyor",
      [H.PACKAGE_NOTE]: form.paketNotu || ""
    });
    normalizeCargoSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.cargo), H.OPEN_ID, openId));
    hafifErpGuncelle_(openId);
    return { ok: true, openId: openId };
  }

  function ultraSiparisPaneli_() {
    showDialog_("ultraSiparisPaneli", "Ultra sipariş paneli", 1420, 900);
  }

  function topluSiparisPaneli_() {
    showDialog_("topluSiparisPaneli", "Toplu sipariş paneli", 1420, 900);
  }

  function kontrolMerkezi_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    kontrolMerkeziniGuncelle_();
    var sh = sheet_(ss, CFG.sheets.control);
    if (sh) ss.setActiveSheet(sh);
    return { ok: true, sheet: CFG.sheets.control };
  }

  function kaydetVeErpGuncelle_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getActiveSheet();
    var h = headers_(sh);
    var row = sh.getActiveRange() ? sh.getActiveRange().getRow() : 0;
    var openId = row >= 2 && h[H.OPEN_ID] !== undefined ? sh.getRange(row, h[H.OPEN_ID] + 1).getValue() : "";
    if (openId) return { ok: true, openId: openId, refreshed: hafifErpGuncelle_(openId) };
    sistemiYenile_();
    return { ok: true, openId: "", refreshed: true };
  }

  function ultraSiparisKaydet_(form) {
    return kaydetUltraSiparisHizli_(form);
  }

  function kaydetUltraSiparisHizli_(form) {
    var started = Date.now();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    form = normalizeUltraForm_(form || {});
    sistemKolonlariniHazirla_();
    var queue = sheet_(ss, CFG.sheets.queue);
    var now = new Date();
    var queueObj = {};
    queueObj[H.CREATED] = now;
    queueObj[H.MSG_DT] = now;
    queueObj[H.OP_DAY] = operationDate_(now);
    queueObj[H.PHONE] = normalizePhone_(form && form.whatsAppTel);
    queueObj[H.OWNER] = normalizePersonName_(form && form.siparisSahibi);
    queueObj[H.RAW] = form && form.hamWhatsappMesaji || "";
    queueObj[H.RAW_NORMALIZED] = normalizeMessageText_(queueObj[H.RAW]);
    queueObj[H.FAST_PRODUCTS] = form && form.hizliUrunGirisi || "";
    queueObj[H.FAST_PAYMENTS] = form && form.hizliOdemeGirisi || "";
    queueObj[H.FAST_CARGO] = form && form.hizliKargoGirisi || "";
    queueObj[H.ORDER_STATUS] = "Açık";
    queueObj[H.ROW_STATUS] = "Staging";
    if (!queueObj[H.PHONE] || !queueObj[H.OWNER]) throw new Error("WhatsApp_Tel ve Sipariş_Sahibi zorunlu.");
    appendObject_(queue, HEADERS.queue, queueObj);
    var queueRow = queue.getLastRow();
    normalizeQueueSheetRow_(ss, queueRow);
    acikSiparisleriGrupla_();
    var openId = rowOpenId_(queue, queueRow);
    var qid = queue.getRange(queueRow, headers_(queue)[H.Q_ID] + 1).getValue();

    (form && form.urunler || []).forEach(function (item, index) {
      if (!item || !item.urunAdi) return;
      appendProductRowFromParsed_(ss, openId, qid, mergeObjects_(item, {
        product: item.urunAdi,
        qty: item.miktar,
        unitGross: item.birimFiyatKdvDahil,
        vatRate: item.kdvOrani,
        payer: item.odemeYapan,
        invoiceCariLinkId: item.faturaCariBaglantiId,
        silverGram: item.gumusGram,
        silverCostUnit: item.gumusAlisBirim,
        silverSaleUnit: item.gumusSatisBirim,
        silverAmountType: item.gumusTutarTipi,
        sourceKey: "ULTRA-U-" + (index + 1)
      }));
    });
    (form && form.odemeler || []).forEach(function (payment, index) {
      if (!payment || (!payment.odemeYapan && !payment.odemeTutari)) return;
      appendPaymentRowFromParsed_(ss, openId, qid, mergeObjects_(payment, {
        payer: payment.odemeYapan,
        amount: payment.odemeTutari,
        source: payment.odemeTeyitKaynagi,
        ref: payment.dekontReferans,
        payerTel: payment.odemeYapanTel,
        payerTaxNo: payment.odemeYapanTcknVkn,
        payerAddress: payment.odemeYapanAdres,
        payerCity: payment.odemeYapanIl,
        payerDistrict: payment.odemeYapanIlce,
        invoiceCariLinkId: payment.faturaCariBaglantiId,
        sourceKey: "ULTRA-O-" + (index + 1)
      }));
    });
    if (form && form.kargo) upsertQuickCargo_(ss, openId, qid, form.kargo);
    if (queueObj[H.FAST_PRODUCTS] || queueObj[H.FAST_PAYMENTS] || queueObj[H.FAST_CARGO]) processQueueQuickInputs_(ss, queueRow);
    hafifErpGuncelle_(openId);
    applyInvoicePanelHints_(ss, openId, form || {});
    autoCariBaglaForOpen_(ss, openId, false);
    updateMusteriHafizaForOpen_(ss, openId);
    parasutTaslaklariniHazirla_();
    kontrolMerkeziniGuncelle_();
    return { ok: true, openId: openId, queueId: qid, elapsedMs: Date.now() - started, status: "Kaydedildi ve ERP güncellendi" };
  }

  function topluUltraSiparisKaydet_(payloadList) {
    var started = Date.now();
    var results = [];
    (payloadList || []).forEach(function (payload) {
      try {
        results.push(kaydetUltraSiparisHizli_(payload));
      } catch (err) {
        results.push({ ok: false, error: safeErrorMessage_(err) });
      }
    });
    return { ok: results.every(function (r) { return r.ok; }), count: results.length, elapsedMs: Date.now() - started, results: results };
  }

  function ultraSiparisKontrolEt_(form) {
    var issues = [];
    if (!normalizePhone_(form && form.whatsAppTel)) issues.push("WhatsApp_Tel eksik");
    if (!normalizePersonName_(form && form.siparisSahibi)) issues.push("Sipariş_Sahibi eksik");
    if (!(form && form.urunler && form.urunler.length) && !(form && form.hizliUrunGirisi)) issues.push("Ürün girişi eksik");
    if (!(form && form.odemeler && form.odemeler.length) && !(form && form.hizliOdemeGirisi)) issues.push("Ödeme girişi eksik");
    var cari = form && form.fatura ? parasutCariAdaylariniGetir_(form.fatura) : { candidates: [] };
    return { ok: !issues.length, issues: issues, cariAdaylari: cari.candidates || [] };
  }

  function processQueueQuickInputs_(ss, rowNum) {
    var sh = sheet_(ss, CFG.sheets.queue);
    var h = headers_(sh);
    var row = sh.getRange(rowNum, 1, 1, sh.getLastColumn()).getValues()[0];
    var openId = val_(row, h, H.OPEN_ID);
    var qid = val_(row, h, H.Q_ID);
    if (!openId || !qid) return false;
    var warnings = [];
    var productText = val_(row, h, H.FAST_PRODUCTS);
    var paymentText = val_(row, h, H.FAST_PAYMENTS);
    var cargoText = val_(row, h, H.FAST_CARGO);
    if (productText) {
      var products = parseHizliUrunGirisi_(productText);
      if (!products.length) warnings.push("Hızlı ürün girişi net değil; Ürün ekle panelini kullanın");
      products.forEach(function (item, index) {
        appendProductRowFromParsed_(ss, openId, qid, mergeObjects_(item, { sourceKey: "HIZLI-U-" + safeKey_(qid) + "-" + (index + 1) }));
      });
    }
    if (paymentText) {
      var payments = parseHizliOdemeGirisi_(paymentText);
      if (!payments.length) warnings.push("Hızlı ödeme girişi net değil; Ödeme ekle panelini kullanın");
      payments.forEach(function (p, index) {
        appendPaymentRowFromParsed_(ss, openId, qid, mergeObjects_(p, { sourceKey: "HIZLI-O-" + safeKey_(qid) + "-" + (index + 1) }));
      });
    }
    if (cargoText) {
      var cargo = parseHizliKargoGirisi_(cargoText);
      upsertQuickCargo_(ss, openId, qid, cargo);
      if (cargo.warning) warnings.push(cargo.warning);
    }
    if (warnings.length) setCell_(sh, rowNum, h, H.WARN, warnings.join(" | "));
    return true;
  }

  function appendProductRowFromParsed_(ss, openId, qid, parsed) {
    var product = normalizeUrunAdi_(parsed.product || parsed.urunAdi);
    var config = getUrunConfig_(product);
    var qty = num_(parsed.qty || parsed.miktar) || 1;
    var unitGross = normalizeTutar_(parsed.unitGross || parsed.birimFiyatKdvDahil);
    var gross = normalizeTutar_(parsed.gross || parsed.toplamKdvDahil) || round2_(qty * unitGross);
    var vatRate = normalizeVatRate_(parsed.vatRate || parsed.kdvOrani || (config && config.vatRate));
    var kdv = hesaplaKdv_(gross, vatRate);
    var sourceKey = parsed.sourceKey || safeKey_([openId, qid, product, qty, unitGross].join("|"));
    var itemId = "UK-" + openId + "-" + sourceKey;
    var silverType = normalizeSilverAmountType_(parsed.silverAmountType || parsed.gumusTutarTipi || "");
    var payer = normalizePersonName_(parsed.payer || parsed.odemeYapan || parsed.paymentPayer || "");
    var linkId = parsed.invoiceCariLinkId || parsed.faturaCariBaglantiId || (payer ? invoiceCariLinkId_(openId, payer) : "");
    var warnings = [];
    if (!product) warnings.push("Ürün seçimi net değil");
    if (!unitGross && !gross) warnings.push("Ürün fiyatı girilmeli");
    if (productType_(product) === "Gümüş" && parsed.silverAmountType && !silverType) warnings.push("Gümüş_Tutar_Tipi Birim veya Toplam olmalı");
    upsertObjectByKey_(sheet_(ss, CFG.sheets.items), HEADERS.items, H.ITEM_ID, itemId, {
      [H.ITEM_ID]: itemId,
      [H.OPEN_ID]: openId,
      [H.Q_ID]: qid,
      [H.INVOICE_CARI_LINK_ID]: linkId,
      [H.PAYER]: payer,
      [H.PRODUCT]: product || parsed.product || "",
      [H.PRODUCT_TYPE]: config ? config.type : "",
      [H.UNIT]: parsed.unit || parsed.birim || (config && config.unit) || "Adet",
      [H.QTY]: qty,
      [H.UNIT_GROSS]: unitGross || (qty ? round6_(gross / qty) : ""),
      [H.LINE_GROSS]: gross || "",
      [H.VAT_MODEL]: parsed.vatModel || parsed.kdvModeli || (vatRate === 0 ? "KDV 0" : "Standart KDV"),
      [H.VAT_RATE]: vatRate,
      [H.LINE_NET]: gross ? kdv.net : "",
      [H.VAT_AMOUNT]: gross ? kdv.vat : "",
      [H.SILVER_GRAM]: num_(parsed.silverGram || parsed.gumusGram) || "",
      [H.SILVER_COST_UNIT]: num_(parsed.silverCostUnit || parsed.gumusAlisBirim) || "",
      [H.SILVER_SALE_UNIT]: num_(parsed.silverSaleUnit || parsed.gumusSatisBirim || unitGross) || "",
      [H.SILVER_AMOUNT_TYPE]: silverType,
      [H.SILVER_MARGIN]: productType_(product) === "Gümüş" ? calculateSilverMarginFromNumbers_(num_(parsed.silverGram || parsed.gumusGram), num_(parsed.silverCostUnit || parsed.gumusAlisBirim), gross) : "",
      [H.PARASUT_PRODUCT_ID]: product ? urunIdBul_(product) : "",
      [H.ITEM_STATUS]: warnings.length ? "Kontrol Gerekli" : "Hazır",
      [H.WARN]: warnings.join(" | ")
    });
    normalizeItemSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.items), H.ITEM_ID, itemId));
  }

  function appendPaymentRowFromParsed_(ss, openId, qid, parsed) {
    var payer = normalizePersonName_(parsed.payer || parsed.odemeYapan);
    var amount = normalizeTutar_(parsed.amount || parsed.odemeTutari);
    var sourceKey = parsed.sourceKey || safeKey_([openId, payer, amount].join("|"));
    var paymentId = "OD-" + openId + "-" + sourceKey;
    var linkId = parsed.invoiceCariLinkId || parsed.faturaCariBaglantiId || (payer ? invoiceCariLinkId_(openId, payer) : "");
    upsertObjectByKey_(sheet_(ss, CFG.sheets.payments), HEADERS.payments, H.PAYMENT_ID, paymentId, {
      [H.PAYMENT_ID]: paymentId,
      [H.OPEN_ID]: openId,
      [H.Q_ID]: qid,
      [H.PAYER]: payer,
      [H.PAYMENT_AMOUNT]: amount,
      [H.PAYMENT_DATE]: normalizeTarih_(parsed.date || parsed.odemeTarihi) || new Date(),
      [H.PAYMENT_SOURCE]: parsed.source || parsed.odemeTeyitKaynagi || "Manuel",
      [H.RECEIPT_REF]: parsed.ref || parsed.dekontReferans || "",
      [H.PAYER_TEL]: normalizePhone_(parsed.payerTel || parsed.odemeYapanTel || ""),
      [H.PAYER_TAX_NO]: normalizeTaxNo_(parsed.payerTaxNo || parsed.odemeYapanTcknVkn || ""),
      [H.PAYER_ADDRESS]: normalizeAddress_(parsed.payerAddress || parsed.odemeYapanAdres || ""),
      [H.PAYER_CITY]: normalizeCity_(parsed.payerCity || parsed.odemeYapanIl || ""),
      [H.PAYER_DISTRICT]: normalizeCity_(parsed.payerDistrict || parsed.odemeYapanIlce || ""),
      [H.INVOICE_CARI_LINK_ID]: linkId,
      [H.CONFIRM_STATUS]: "Bekliyor",
      [H.OPERATOR_CONFIRM]: parsed.operatorConfirm || "Hayır"
    });
    normalizePaymentSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.payments), H.PAYMENT_ID, paymentId));
  }

  function upsertQuickCargo_(ss, openId, qid, cargo) {
    var summary = openSummaryById_(ss, openId);
    upsertObjectByKey_(sheet_(ss, CFG.sheets.cargo), HEADERS.cargo, H.OPEN_ID, openId, {
      [H.CARGO_PACKAGE_ID]: "KP-" + openId,
      [H.OPEN_ID]: openId,
      [H.CARGO_RECEIVER]: normalizePersonName_(cargo.receiver || cargo.kargoAlicisi || summary.owner || ""),
      [H.CARGO_TEL]: normalizePhone_(cargo.phone || cargo.kargoTel || summary.phone || ""),
      [H.CITY]: normalizeCity_(cargo.city || cargo.il || ""),
      [H.DISTRICT]: normalizeCity_(cargo.district || cargo.ilce || ""),
      [H.ADDRESS]: normalizeAddress_(cargo.address || cargo.adres || ""),
      [H.CARGO_COMPANY]: normalizeCargoCompany_(cargo.company || cargo.kargoFirmasi || setting_(ss, "VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany)),
      [H.PACKAGE_STATUS]: "Bekliyor",
      [H.PACKAGE_NOTE]: cargo.note || cargo.paketNotu || "",
      [H.WARN]: cargo.warning || ""
    });
    normalizeCargoSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.cargo), H.OPEN_ID, openId));
  }

  function applyInvoicePanelHints_(ss, openId, form) {
    var f = form.fatura || {};
    var fallbackCargo = form.kargo || {};
    var phone = normalizePhone_(f.faturaTel || form.whatsAppTel || fallbackCargo.kargoTel || "");
    var taxNo = normalizeTaxNo_(f.faturaTcknVkn || "");
    var address = normalizeAddress_(f.faturaAdres || fallbackCargo.adres || "");
    var city = normalizeCity_(f.faturaIl || fallbackCargo.il || "");
    var district = normalizeCity_(f.faturaIlce || fallbackCargo.ilce || "");
    var taxOffice = String(f.faturaVergiDairesi || "").trim();
    var contactId = String(f.parasutCariId || "").trim();
    var rows = objects_(sheet_(ss, CFG.sheets.invoiceGroups));
    var changed = false;
    rows.forEach(function (row) {
      if (row[H.OPEN_ID] !== openId) return;
      if (phone && !row[H.INVOICE_TEL]) { row[H.INVOICE_TEL] = phone; changed = true; }
      if (taxNo && !row[H.TAX_NO]) { row[H.TAX_NO] = taxNo; changed = true; }
      if (taxOffice && !row[H.TAX_OFFICE]) { row[H.TAX_OFFICE] = taxOffice; changed = true; }
      if (address && !row[H.INVOICE_ADDRESS]) { row[H.INVOICE_ADDRESS] = address; changed = true; }
      if (city && !row[H.INVOICE_CITY]) { row[H.INVOICE_CITY] = city; changed = true; }
      if (district && !row[H.INVOICE_DISTRICT]) { row[H.INVOICE_DISTRICT] = district; changed = true; }
      if (!row[H.EBELGE_TYPE]) { row[H.EBELGE_TYPE] = ebelgeTipiBelirle_(row[H.TAX_NO], row[H.CARI_TYPE]); changed = true; }
      if (contactId && !row[H.PARASUT_CONTACT_ID]) { row[H.PARASUT_CONTACT_ID] = contactId; row[H.CARI_MATCH_STATUS] = "Manuel ID doğrulama gerekli"; row[H.CARI_ACTION] = "Paraşüt cari ID doğrula"; row[H.WARN] = ""; changed = true; }
    });
    if (changed) writeObjects_(sheet_(ss, CFG.sheets.invoiceGroups), HEADERS.invoiceGroups, rows);
  }

  function autoCariBaglaForOpen_(ss, openId, allowNetwork) {
    var rows = objects_(sheet_(ss, CFG.sheets.invoiceGroups));
    var changed = false;
    rows.forEach(function (row) {
      if (row[H.OPEN_ID] !== openId || row[H.PARASUT_CONTACT_ID]) return;
      var candidates = cariAdaylariniTopla_(cariCriteriaFromGroup_(row), allowNetwork);
      if (candidates.length === 1 && candidates[0].score >= 90) {
        row[H.PARASUT_CONTACT_ID] = candidates[0].id;
        row[H.CARI_MATCH_SCORE] = candidates[0].score;
        row[H.CARI_MATCH_STATUS] = "Güçlü eşleşme";
        row[H.CARI_ACTION] = "Otomatik bağlandı";
        row[H.WARN] = "";
        changed = true;
      } else if (candidates.length) {
        row[H.WARN] = "Cari aday seçimi gerekli";
        row[H.CARI_MATCH_SCORE] = candidates[0].score || "";
        row[H.CARI_MATCH_STATUS] = scoreStatus_(Number(candidates[0].score || 0));
        row[H.CARI_ACTION] = "Panelden cari seçin veya cari oluşturun";
        changed = true;
      }
    });
    if (changed) writeObjects_(sheet_(ss, CFG.sheets.invoiceGroups), HEADERS.invoiceGroups, rows);
    return changed;
  }

  function updateMusteriHafizaForOpen_(ss, openId) {
    var queueRows = objects_(sheet_(ss, CFG.sheets.queue)).filter(function (r) { return r[H.OPEN_ID] === openId; });
    if (!queueRows.length) return false;
    var q = queueRows[queueRows.length - 1];
    var cargo = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (r) { return r[H.OPEN_ID] === openId; }).pop() || {};
    var groups = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (r) { return r[H.OPEN_ID] === openId; });
    var phone = q[H.PHONE];
    if (!phone) return false;
    var memoryRows = objects_(sheet_(ss, CFG.sheets.memory));
    var byPhone = indexBy_(memoryRows, H.PHONE);
    var current = byPhone[phone] || {};
    var payers = groups.map(function (g) { return g[H.PAYER]; }).filter(Boolean);
    var candidates = groups.map(function (g) {
      return { payer: g[H.PAYER], contactId: g[H.PARASUT_CONTACT_ID], taxNo: g[H.TAX_NO], phone: g[H.INVOICE_TEL] };
    });
    var next = copyByHeaders_(current, HEADERS.memory, {
      [H.PHONE]: phone,
      [H.OWNER]: q[H.OWNER],
      "Son_Kargo_Alıcısı": cargo[H.CARGO_RECEIVER] || current["Son_Kargo_Alıcısı"] || "",
      "Son_Kargo_Tel": cargo[H.CARGO_TEL] || current["Son_Kargo_Tel"] || "",
      "Son_İl": cargo[H.CITY] || current["Son_İl"] || "",
      "Son_İlçe": cargo[H.DISTRICT] || current["Son_İlçe"] || "",
      "Son_Adres": cargo[H.ADDRESS] || current["Son_Adres"] || "",
      "Son_Fatura_Kişisi": groups[0] ? groups[0][H.INVOICE_PERSON] : current["Son_Fatura_Kişisi"] || "",
      "Son_Fatura_Tel": groups[0] ? groups[0][H.INVOICE_TEL] : current["Son_Fatura_Tel"] || "",
      "Son_Fatura_TCKN_VKN": groups[0] ? groups[0][H.TAX_NO] : current["Son_Fatura_TCKN_VKN"] || "",
      [H.PARASUT_CONTACT_ID]: groups[0] ? groups[0][H.PARASUT_CONTACT_ID] : current[H.PARASUT_CONTACT_ID] || "",
      "Son_Ödeme_Yapanlar_JSON": JSON.stringify(payers),
      "Cari_Adaylari_JSON": JSON.stringify(candidates),
      "Son_Kargo_Bilgisi_JSON": JSON.stringify({ receiver: cargo[H.CARGO_RECEIVER] || "", phone: cargo[H.CARGO_TEL] || "", city: cargo[H.CITY] || "", district: cargo[H.DISTRICT] || "", address: cargo[H.ADDRESS] || "" }),
      "Güven_Puanı": groups.some(function (g) { return g[H.PARASUT_CONTACT_ID]; }) ? 90 : 60,
      "Son_Başarılı_Sipariş_ID": openId,
      "Son_Güncelleme": new Date()
    });
    memoryRows = memoryRows.filter(function (r) { return r[H.PHONE] !== phone; });
    memoryRows.push(next);
    writeObjects_(sheet_(ss, CFG.sheets.memory), HEADERS.memory, memoryRows);
    return true;
  }

  function hafifErpGuncelle_(openId) {
    if (!openId) return false;
    odemeleriKontrolEt_();
    urunKalemleriniKontrolEt_();
    faturaGruplariniOlustur_();
    rebuildOpenOrders_();
    kargoPaketleriniOlustur_();
    finans808OnizlemeOlustur_();
    parasutTaslaklariniHazirla_();
    ebelgeIstisnaHazirla_();
    rebuildOpenOrders_();
    kontrolMerkeziniGuncelle_();
    return true;
  }

  function acikSiparisleriGrupla_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = sheet_(ss, CFG.sheets.queue);
    if (!sh || sh.getLastRow() < 2) {
      rebuildOpenOrders_();
      return true;
    }
    var width = sh.getLastColumn();
    var range = sh.getRange(2, 1, sh.getLastRow() - 1, width);
    var data = range.getValues();
    var h = headers_(sh);
    var stateByCustomerDay = {};
    var groupSeqByDay = {};

    data.forEach(function (row, index) {
      if (!queueRowHasData_(row, h)) return;
      normalizeQueueRowArray_(row, h, index + 2);
      var msgDate = toDate_(val_(row, h, H.MSG_DT)) || new Date();
      var opDay = operationDate_(msgDate);
      var dayKey = opDay.replace(/-/g, "");
      var phone = normalizePhone_(val_(row, h, H.PHONE));
      var customerKey = phone || safeKey_(val_(row, h, H.OWNER)) || ("ROW-" + (index + 2));
      var mergeKey = opDay + "|" + customerKey;
      var beforeCutoff = isBeforeCutoff_(msgDate, setting_(ss, "SISTEM_OPERASYON_SAATI_KAPANIS", CFG.cutoff));
      var lateApproved = isLateApproved_(row, h);
      var closed = isClosedRow_(row, h);
      var existing = val_(row, h, H.OPEN_ID);
      var group = null;

      if (existing && lateApproved) {
        group = { openId: existing, orderNo: "TK-" + existing.replace(/^AS-/, "") };
      } else if (stateByCustomerDay[mergeKey] && !closed && (beforeCutoff || lateApproved)) {
        group = stateByCustomerDay[mergeKey];
      } else {
        var seq = nextSeq_(groupSeqByDay, dayKey);
        group = { openId: "AS-" + dayKey + "-" + pad_(seq, 3), orderNo: "TK-" + dayKey + "-" + pad_(seq, 3) };
      }

      if (!closed) stateByCustomerDay[mergeKey] = group;
      setIf_(row, h, H.OPEN_ID, group.openId);
      setIf_(row, h, H.OP_DAY, opDay);
    });

    range.setValues(data);
    rebuildOpenOrders_();
    return true;
  }

  function odemeleriKontrolEt_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rows = objects_(sheet_(ss, CFG.sheets.payments));
    var seqByOpenPayer = {};
    var out = [];
    rows.forEach(function (row) {
      if (!row[H.OPEN_ID] && !row[H.PAYER] && !row[H.PAYMENT_AMOUNT]) return;
      var warnings = [];
      var openId = row[H.OPEN_ID] || "";
      var payer = normalizePersonName_(row[H.PAYER]);
      var amount = num_(row[H.PAYMENT_AMOUNT]);
      var linkId = row[H.INVOICE_CARI_LINK_ID] || (openId && payer ? invoiceCariLinkId_(openId, payer) : "");
      var bankMoveId = String(row[H.BANK_MOVE_ID] || "").trim();
      var operatorConfirm = String(row[H.OPERATOR_CONFIRM] || "").trim();
      if (!openId) warnings.push("Açık sipariş ID eksik");
      if (!payer) warnings.push("Ödeme yapan eksik");
      if (!amount) warnings.push("Ödeme tutarı eksik");
      if (bankMoveId && !yes_(operatorConfirm)) warnings.push("Banka hareketi için operatör teyidi gerekli");
      var key = openId + "|" + safeKey_(payer || "ODEME");
      out.push(copyByHeaders_(row, HEADERS.payments, {
        [H.PAYMENT_ID]: row[H.PAYMENT_ID] || "OD-" + (openId || "NOOPEN") + "-" + safeKey_(payer || "ODEME") + "-" + pad_(nextSeq_(seqByOpenPayer, key), 3),
        [H.OPEN_ID]: openId,
        [H.Q_ID]: row[H.Q_ID] || findQueueIdForOpenId_(ss, openId),
        [H.PAYER]: payer,
        [H.PAYMENT_AMOUNT]: amount,
        [H.PAYMENT_DATE]: row[H.PAYMENT_DATE] || new Date(),
        [H.PAYMENT_SOURCE]: row[H.PAYMENT_SOURCE] || "Manuel",
        [H.RECEIPT_REF]: row[H.RECEIPT_REF] || "",
        [H.PAYER_TEL]: normalizePhone_(row[H.PAYER_TEL]),
        [H.PAYER_TAX_NO]: normalizeTaxNo_(row[H.PAYER_TAX_NO]),
        [H.PAYER_ADDRESS]: normalizeAddress_(row[H.PAYER_ADDRESS]),
        [H.PAYER_CITY]: normalizeCity_(row[H.PAYER_CITY]),
        [H.PAYER_DISTRICT]: normalizeCity_(row[H.PAYER_DISTRICT]),
        [H.INVOICE_CARI_LINK_ID]: linkId,
        [H.CONFIRM_STATUS]: row[H.CONFIRM_STATUS] || (warnings.length ? "Kontrol Gerekli" : "Bekliyor"),
        [H.CONFIRM_NOTE]: row[H.CONFIRM_NOTE] || "",
        [H.BANK_MOVE_ID]: bankMoveId,
        [H.BANK_MATCH_STATUS]: row[H.BANK_MATCH_STATUS] || "",
        [H.BANK_MATCH_SCORE]: row[H.BANK_MATCH_SCORE] || "",
        [H.BANK_MATCH_NOTE]: row[H.BANK_MATCH_NOTE] || "",
        [H.OPERATOR_CONFIRM]: operatorConfirm || "Hayır",
        [H.WARN]: warnings.join(" | ")
      }));
    });
    writeObjects_(sheet_(ss, CFG.sheets.payments), HEADERS.payments, out);
    return true;
  }

  function urunKalemleriniKontrolEt_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rows = objects_(sheet_(ss, CFG.sheets.items));
    var payments = objects_(sheet_(ss, CFG.sheets.payments));
    var paymentsById = indexBy_(payments, H.PAYMENT_ID);
    var paymentsByOpen = groupBy_(payments, H.OPEN_ID);
    var productMap = productIdMap_(ss, false);
    var productMapEmpty = !Object.keys(productMap).length;
    var seqByOpen = {};
    var out = [];

    rows.forEach(function (row, i) {
      if (!row[H.OPEN_ID] && !row[H.PRODUCT]) return;
      var warnings = [];
      var openId = row[H.OPEN_ID] || "";
      var seq = row[H.SEQ] || nextSeq_(seqByOpen, openId || "NO_OPEN");
      var product = normalizeUrunAdi_(row[H.PRODUCT]);
      var config = getUrunConfig_(product);
      var qty = num_(row[H.QTY]);
      var unitGross = num_(row[H.UNIT_GROSS]);
      var gross = num_(row[H.LINE_GROSS]) || round2_(qty * unitGross);
      var vatRate = normalizeVatRate_(row[H.VAT_RATE] || (config && config.vatRate));
      var silverType = normalizeSilverAmountType_(row[H.SILVER_AMOUNT_TYPE]);
      var net = num_(row[H.LINE_NET]) || round2_(gross / (1 + vatRate));
      var vat = num_(row[H.VAT_AMOUNT]) || round2_(gross - net);
      var paymentId = row[H.PAYMENT_ID] || "";
      var payerHint = normalizePersonName_(row[H.PAYER]);
      if (!paymentId && openId && payerHint) {
        var samePayerPayments = (paymentsByOpen[openId] || []).filter(function (p) { return normalizePersonName_(p[H.PAYER]) === payerHint; });
        if (samePayerPayments.length === 1) paymentId = samePayerPayments[0][H.PAYMENT_ID];
      }
      if (!paymentId && openId && (paymentsByOpen[openId] || []).length === 1) paymentId = paymentsByOpen[openId][0][H.PAYMENT_ID];
      var payment = paymentId ? paymentsById[paymentId] : null;
      var payer = payment ? payment[H.PAYER] : payerHint;
      var groupId = row[H.INVOICE_GROUP_ID] || (payer ? invoiceGroupId_(openId, payer) : "");
      var linkId = row[H.INVOICE_CARI_LINK_ID] || (payer ? invoiceCariLinkId_(openId, payer) : "");
      var productId = productMapEmpty ? "" : (row[H.PARASUT_PRODUCT_ID] || productIdFromMap_(productMap, product));

      if (!openId) warnings.push("Açık sipariş ID eksik");
      if (!product) warnings.push("Ürün seçilmedi / eşleşmedi");
      if (!qty) warnings.push("Miktar eksik");
      if (!gross) warnings.push("Tutar eksik");
      if (productType_(product) === "Gümüş" && row[H.SILVER_AMOUNT_TYPE] && !silverType) warnings.push("Gümüş_Tutar_Tipi Birim veya Toplam olmalı");
      if (!paymentId) warnings.push("Ödeme ID eksik");
      if (paymentId && !payment) warnings.push("Ödeme ID 05_ODEMELER içinde yok");
      if (!groupId) warnings.push("Fatura grubu yok");
      if (productMapEmpty || !productId) warnings.push("Paraşüt ürün ID mapping yok");

      out.push(copyByHeaders_(row, HEADERS.items, {
        [H.ITEM_ID]: row[H.ITEM_ID] || "UK-" + (openId || "NOOPEN") + "-" + pad_(i + 1, 4),
        [H.OPEN_ID]: openId,
        [H.Q_ID]: row[H.Q_ID] || findQueueIdForOpenId_(ss, openId),
        [H.SEQ]: seq,
        [H.INVOICE_CARI_LINK_ID]: linkId,
        [H.PAYER]: payer,
        [H.PRODUCT]: product || row[H.PRODUCT],
        [H.PRODUCT_TYPE]: row[H.PRODUCT_TYPE] || (config && config.type) || productType_(product),
        [H.UNIT]: row[H.UNIT] || (config && config.unit) || defaultUnit_(product),
        [H.QTY]: qty,
        [H.UNIT_GROSS]: unitGross || round6_(gross / Math.max(qty, 1)),
        [H.LINE_GROSS]: gross,
        [H.VAT_MODEL]: row[H.VAT_MODEL] || (vatRate === 0 ? "KDV 0" : "Standart KDV"),
        [H.VAT_RATE]: vatRate,
        [H.LINE_NET]: net,
        [H.VAT_AMOUNT]: vat,
        [H.SILVER_AMOUNT_TYPE]: silverType,
        [H.SILVER_SALE_UNIT]: row[H.SILVER_SALE_UNIT] || unitGross || "",
        [H.SILVER_MARGIN]: productType_(product) === "Gümüş" ? calculateSilverMargin_(row, h, gross) : "",
        [H.PARASUT_PRODUCT_ID]: productId,
        [H.PAYMENT_ID]: paymentId,
        [H.INVOICE_GROUP_ID]: groupId,
        [H.ITEM_STATUS]: warnings.length ? "Kontrol Gerekli" : "Hazır",
        [H.WARN]: warnings.join(" | ")
      }));
    });

    writeObjects_(sheet_(ss, CFG.sheets.items), HEADERS.items, out);
    return true;
  }

  function faturaGruplariniOlustur_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var items = objects_(sheet_(ss, CFG.sheets.items));
    var payments = objects_(sheet_(ss, CFG.sheets.payments));
    var prev = indexBy_(objects_(sheet_(ss, CFG.sheets.invoiceGroups)), H.INVOICE_GROUP_ID);
    var groups = {};

    payments.forEach(function (p) {
      var gid = invoiceGroupId_(p[H.OPEN_ID], p[H.PAYER]);
      if (!groups[gid]) groups[gid] = newInvoiceAccumulator_(gid, p[H.OPEN_ID], p[H.PAYER]);
      if (!groups[gid].payer) groups[gid].payer = p[H.PAYER];
      groups[gid].payments.push(p);
      groups[gid].paymentTotal += num_(p[H.PAYMENT_AMOUNT]);
    });

    items.forEach(function (it) {
      var gid = it[H.INVOICE_GROUP_ID] || "__ITEM_WITHOUT_GROUP__" + it[H.OPEN_ID];
      if (!groups[gid]) groups[gid] = newInvoiceAccumulator_(gid, it[H.OPEN_ID], it[H.PAYER] || "");
      groups[gid].items.push(it);
      groups[gid].itemTotal += num_(it[H.LINE_GROSS]);
      groups[gid].itemNet += num_(it[H.LINE_NET]);
      groups[gid].itemVat += num_(it[H.VAT_AMOUNT]);
    });

    var out = Object.keys(groups).sort().map(function (gid) {
      var g = groups[gid];
      var saved = prev[gid] || {};
      var warnings = [];
      var diff = round2_(g.paymentTotal - g.itemTotal);
      var firstPayment = g.payments[0] || {};
      var invoicePerson = normalizePersonName_(saved[H.INVOICE_PERSON] || g.payer);
      var taxNo = normalizeTaxNo_(saved[H.TAX_NO] || firstPayment[H.PAYER_TAX_NO]);
      var cariType = normalizeCariTipi_(saved[H.CARI_TYPE], taxNo, invoicePerson || g.payer);
      if (!invoicePerson) warnings.push("Fatura kişisi/ödeme yapan eksik");
      if (!g.items.length) warnings.push("Faturalandırılacak ürün yok");
      if (!g.payments.length) warnings.push("Ödeme kaydı yok");
      var paymentWarnings = g.payments.map(function (p) { return p[H.WARN]; }).filter(Boolean);
      if (paymentWarnings.length) warnings.push("Ödeme teyit blokajı: " + paymentWarnings.join(" | "));
      if (Math.abs(diff) > 0.01) warnings.push("Ödeme toplamı ile ürün toplamı eşleşmiyor");
      if (!taxNo && cariType === "Gerçek Kişi") taxNo = setting_(ss, "TCKN_VARSAYILAN_GERCEK_KISI", CFG.defaultTckn);
      if (!taxNo && cariType === "Tüzel Kişi") warnings.push("Tüzel kişi için VKN zorunlu");
      var ebelgeType = saved[H.EBELGE_TYPE] || ebelgeTipiBelirle_(taxNo, cariType);
      var matchScore = saved[H.CARI_MATCH_SCORE] || "";
      var matchStatus = saved[H.CARI_MATCH_STATUS] || (saved[H.PARASUT_CONTACT_ID] ? "Bağlı" : "Cari çözümü gerekli");
      var cariAction = saved[H.CARI_ACTION] || (saved[H.PARASUT_CONTACT_ID] ? "Cari bağlı" : "Cari adaylarını kontrol et");
      return copyByHeaders_(saved, HEADERS.invoiceGroups, {
        [H.INVOICE_GROUP_ID]: gid,
        [H.OPEN_ID]: g.openId,
        [H.PAYER]: g.payer,
        [H.INVOICE_PERSON]: invoicePerson,
        [H.CARI_TYPE]: cariType,
        [H.INVOICE_TEL]: saved[H.INVOICE_TEL] || firstPayment[H.PAYER_TEL] || "",
        [H.TAX_NO]: taxNo,
        [H.TAX_OFFICE]: saved[H.TAX_OFFICE] || "",
        [H.INVOICE_ADDRESS]: saved[H.INVOICE_ADDRESS] || firstPayment[H.PAYER_ADDRESS] || "",
        [H.INVOICE_CITY]: saved[H.INVOICE_CITY] || firstPayment[H.PAYER_CITY] || "",
        [H.INVOICE_DISTRICT]: saved[H.INVOICE_DISTRICT] || firstPayment[H.PAYER_DISTRICT] || "",
        [H.EBELGE_TYPE]: ebelgeType,
        [H.ITEM_SUM]: round2_(g.itemTotal),
        [H.GROUP_PAYMENT_SUM]: round2_(g.paymentTotal),
        [H.DIFF]: diff,
        [H.INVOICE_STATUS]: warnings.length ? "Blokaj" : "Hazır",
        [H.PARASUT_CONTACT_ID]: saved[H.PARASUT_CONTACT_ID] || "",
        [H.CARI_MATCH_SCORE]: matchScore,
        [H.CARI_MATCH_STATUS]: matchStatus,
        [H.CARI_ACTION]: cariAction,
        [H.PARASUT_INVOICE_ID]: saved[H.PARASUT_INVOICE_ID] || "",
        [H.SEND_LOCK]: saved[H.PARASUT_INVOICE_ID] ? "Evet" : (saved[H.SEND_LOCK] || "Hayır"),
        [H.WARN]: warnings.join(" | ")
      });
    });

    writeObjects_(sheet_(ss, CFG.sheets.invoiceGroups), HEADERS.invoiceGroups, out);
    return true;
  }

  function parasutTaslaklariniHazirla_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var groups = indexBy_(objects_(sheet_(ss, CFG.sheets.invoiceGroups)), H.INVOICE_GROUP_ID);
    var itemsByGroup = groupBy_(objects_(sheet_(ss, CFG.sheets.items)), H.INVOICE_GROUP_ID);
    var previous = indexBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
    var out = [];

    Object.keys(groups).sort().forEach(function (gid) {
      var group = groups[gid];
      var groupItems = itemsByGroup[gid] || [];
      groupItems.forEach(function (item) {
        var warnings = [];
        if (group[H.INVOICE_STATUS] !== "Hazır") warnings.push(group[H.WARN] || "Fatura grubu hazır değil");
        if (!group[H.PARASUT_CONTACT_ID]) warnings.push("Paraşüt cari ID yok");
        if (!item[H.PARASUT_PRODUCT_ID]) warnings.push("Paraşüt ürün ID mapping yok");
        if (group[H.SEND_LOCK] === "Evet" || group[H.PARASUT_INVOICE_ID]) warnings.push("Fatura grubu kilitli/gönderilmiş");
        var canSend = warnings.length ? "Hayır" : "Evet";
        var saved = previous[gid] || {};
        out.push({
          [H.ACTION]: "Satış Faturası Taslağı",
          [H.INVOICE_GROUP_ID]: gid,
          [H.OPEN_ID]: group[H.OPEN_ID],
          [H.INVOICE_PERSON]: group[H.INVOICE_PERSON],
          [H.CARI_TYPE]: group[H.CARI_TYPE],
          [H.PARASUT_CONTACT_ID]: group[H.PARASUT_CONTACT_ID],
          [H.ITEM_ID]: item[H.ITEM_ID],
          [H.PRODUCT]: item[H.PRODUCT],
          [H.PARASUT_PRODUCT_ID]: item[H.PARASUT_PRODUCT_ID],
          [H.QTY]: item[H.QTY],
          [H.UNIT]: item[H.UNIT],
          [H.UNIT_NET]: round6_(num_(item[H.LINE_NET]) / Math.max(1, num_(item[H.QTY]))),
          [H.VAT_RATE]: item[H.VAT_RATE],
          [H.VAT_AMOUNT]: item[H.VAT_AMOUNT],
          [H.LINE_GROSS]: item[H.LINE_GROSS],
          [H.PARASUT_INVOICE_ID]: saved[H.PARASUT_INVOICE_ID] || group[H.PARASUT_INVOICE_ID] || "",
          [H.PARASUT_STATUS]: canSend === "Evet" ? "Taslak Hazır" : "Blokaj",
          [H.SEND_LOCK]: group[H.SEND_LOCK] || "Hayır",
          [H.PAYLOAD_CHECK]: canSend === "Evet" ? "Payload hazır" : warnings.join(" | "),
          [H.ERROR]: canSend === "Evet" ? "" : warnings.join(" | "),
          [H.CAN_SEND_DRAFT]: canSend,
          [H.DRAFT_BLOCK]: warnings.join(" | "),
          [H.NOTE]: ""
        });
      });
    });

    writeObjects_(sheet_(ss, CFG.sheets.parasut), HEADERS.parasut, out);
    return true;
  }

  function kargoPaketleriniOlustur_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var openRows = objects_(sheet_(ss, CFG.sheets.open));
    var existing = objects_(sheet_(ss, CFG.sheets.cargo));
    var existingByOpen = indexBy_(existing, H.OPEN_ID);
    var out = [];

    openRows.forEach(function (open) {
      var openId = open[H.OPEN_ID];
      if (!openId) return;
      var row = existingByOpen[openId] || null;
      var closed = isClosedText_(open[H.ORDER_STATUS]);
      if (!row && !closed) return;
      row = row || {};
      var warnings = [];
      if (!closed) warnings.push("Açık sipariş kapanmadan kargo oluşturulamaz");
      [H.CARGO_RECEIVER, H.CARGO_TEL, H.CITY, H.DISTRICT, H.ADDRESS].forEach(function (key) {
        if (!row[key]) warnings.push(key + " eksik");
      });
      out.push(copyByHeaders_(row, HEADERS.cargo, {
        [H.CARGO_PACKAGE_ID]: row[H.CARGO_PACKAGE_ID] || "KP-" + openId,
        [H.OPEN_ID]: openId,
        [H.CARGO_RECEIVER]: row[H.CARGO_RECEIVER] || "",
        [H.CARGO_TEL]: normalizePhone_(row[H.CARGO_TEL]),
        [H.CITY]: row[H.CITY] || "",
        [H.DISTRICT]: row[H.DISTRICT] || "",
        [H.ADDRESS]: normalizeAddress_(row[H.ADDRESS]),
        [H.CARGO_COMPANY]: row[H.CARGO_COMPANY] || setting_(ss, "VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany),
        [H.PACKAGE_STATUS]: warnings.length ? "Blokaj" : "Hazır",
        [H.BARCODE]: row[H.BARCODE] || "",
        [H.TRACKING_NO]: row[H.TRACKING_NO] || "",
        [H.LATE_ADD]: row[H.LATE_ADD] || "Hayır",
        [H.PACKAGE_NOTE]: row[H.PACKAGE_NOTE] || "",
        [H.WARN]: warnings.join(" | ")
      }));
    });

    existing.forEach(function (row) {
      if (row[H.OPEN_ID] && indexBy_(out, H.OPEN_ID)[row[H.OPEN_ID]]) return;
      out.push(row);
    });
    writeObjects_(sheet_(ss, CFG.sheets.cargo), HEADERS.cargo, out);
    return true;
  }

  function finans808OnizlemeOlustur_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var itemsByOpen = groupBy_(objects_(sheet_(ss, CFG.sheets.items)), H.OPEN_ID);
    var paymentsByOpen = groupBy_(objects_(sheet_(ss, CFG.sheets.payments)), H.OPEN_ID);
    var out = objects_(sheet_(ss, CFG.sheets.open)).map(function (open) {
      var openId = open[H.OPEN_ID];
      var items = itemsByOpen[openId] || [];
      var payments = paymentsByOpen[openId] || [];
      var gross = sum_(items, H.LINE_GROSS);
      var net = sum_(items, H.LINE_NET);
      var vat = sum_(items, H.VAT_AMOUNT);
      var pay = sum_(payments, H.PAYMENT_AMOUNT);
      var diff = round2_(pay - gross);
      return {
        [H.FIN_ID]: "808-" + openId,
        [H.OPEN_ID]: openId,
        [H.MODEL_TYPE]: "FINANS_ONIZLEME",
        [H.ITEM_SUM]: gross,
        [H.LINE_NET]: net,
        [H.VAT_AMOUNT]: vat,
        [H.GROUP_PAYMENT_SUM]: pay,
        [H.DIFF]: diff,
        [H.NET_GAIN]: round2_(net - num_(setting_(ss, "KARGO_UCRETI_STANDART", CFG.defaultCargoFee))),
        [H.OFFICIAL_NOTE]: "808 resmi fatura modeli değildir; yalnızca finans ön izlemedir.",
        [H.NO_INVOICE_EFFECT]: "Evet",
        [H.WARN]: Math.abs(diff) > 0.01 ? "Ödeme ve ürün toplamı eşleşmiyor" : ""
      };
    });
    writeObjects_(sheet_(ss, CFG.sheets.finance808), HEADERS.finance808, out);
    return true;
  }

  function ebelgeIstisnaHazirla_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var parasutByGroup = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
    var out = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).map(function (group) {
      var rows = parasutByGroup[group[H.INVOICE_GROUP_ID]] || [];
      var hasSilver = rows.some(function (r) { return productType_(r[H.PRODUCT]) === "Gümüş"; });
      var hasVatZero = rows.some(function (r) { return num_(r[H.VAT_RATE]) === 0; });
      var warnings = [];
      if (!group[H.PARASUT_INVOICE_ID]) warnings.push("Paraşüt satış faturası taslak ID yok");
      if (hasVatZero && !setting_(ss, "ISTISNA_KODU_RESMI", "")) warnings.push("Resmi istisna kodu/onayı yok");
      return {
        [H.EBELGE_ID]: "EB-" + group[H.INVOICE_GROUP_ID],
        [H.INVOICE_GROUP_ID]: group[H.INVOICE_GROUP_ID],
        [H.OPEN_ID]: group[H.OPEN_ID],
        [H.PARASUT_INVOICE_ID]: group[H.PARASUT_INVOICE_ID],
        [H.INVOICE_PERSON]: group[H.INVOICE_PERSON],
        [H.TAX_NO]: group[H.TAX_NO],
        [H.CARI_TYPE]: group[H.CARI_TYPE],
        [H.EBELGE_TYPE]: "",
        [H.HAS_SILVER]: hasSilver ? "Evet" : "Hayır",
        [H.HAS_VAT_ZERO]: hasVatZero ? "Evet" : "Hayır",
        [H.NEED_EXEMPTION]: hasVatZero ? "Evet" : "Hayır",
        [H.EXEMPTION_CODE]: hasVatZero ? setting_(ss, "ISTISNA_KODU_RESMI", "") : "",
        [H.EXEMPTION_DESC]: hasVatZero ? "11_EBELGE_ISTISNA resmi karar alanı" : "",
        [H.SEND_STATUS]: warnings.length ? "Blokaj" : "Gönderime Hazır",
        [H.OFFICIAL_APPROVAL]: yes_(setting_(ss, CFG.liveEbelgeSendSetting, "Hayır")) ? "Evet" : "Hayır",
        [H.OFFICIAL_BLOCK]: warnings.join(" | "),
        [H.CONTROL_LEVEL]: warnings.length ? "Blokaj" : "OK"
      };
    });
    writeObjects_(sheet_(ss, CFG.sheets.ebelge), HEADERS.ebelge, out);
    return true;
  }

  function kontrolMerkeziniGuncelle_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var issues = [];
    collectIssues_(issues, CFG.sheets.open, objects_(sheet_(ss, CFG.sheets.open)), H.OPEN_ID, H.BLOCK_REASON, "ERP", "Kritik");
    collectIssues_(issues, CFG.sheets.items, objects_(sheet_(ss, CFG.sheets.items)), H.ITEM_ID, H.WARN, "Ürün", "Yüksek");
    collectIssues_(issues, CFG.sheets.payments, objects_(sheet_(ss, CFG.sheets.payments)), H.PAYMENT_ID, H.WARN, "Ödeme", "Yüksek");
    collectIssues_(issues, CFG.sheets.invoiceGroups, objects_(sheet_(ss, CFG.sheets.invoiceGroups)), H.INVOICE_GROUP_ID, H.WARN, "Fatura", "Kritik");
    collectIssues_(issues, CFG.sheets.parasut, objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID, H.DRAFT_BLOCK, "Paraşüt", "Kritik");
    collectIssues_(issues, CFG.sheets.cargo, objects_(sheet_(ss, CFG.sheets.cargo)), H.CARGO_PACKAGE_ID, H.WARN, "Kargo", "Yüksek");
    collectIssues_(issues, CFG.sheets.ebelge, objects_(sheet_(ss, CFG.sheets.ebelge)), H.EBELGE_ID, H.OFFICIAL_BLOCK, "e-Belge", "Kritik");
    collectBankIssues_(issues, ss);
    if (!issues.length) {
      issues.push({
        [H.CTRL_ID]: "CTRL-OK",
        [H.DATE]: new Date(),
        [H.SOURCE_SHEET]: "SISTEM",
        [H.CTRL_TYPE]: "ERP genel kontrol",
        [H.RISK]: "Bilgi",
        [H.STATUS]: "Kapalı",
        [H.WARN]: "Bloklayıcı uyarı yok",
        [H.ACTION_EXPECTED]: "Operasyon devam edebilir",
        [H.IS_BLOCK]: "Hayır",
        [H.MODULE]: "ERP"
      });
    }
    writeObjects_(sheet_(ss, CFG.sheets.control), HEADERS.control, issues);
    return true;
  }

  function parasutFaturaTaslakGonder_(optionalGroupId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    parasutTaslaklariniHazirla_();
    var live = yes_(setting_(ss, CFG.liveParasutSendSetting, "Hayır"));
    var batchLimit = Number(setting_(ss, CFG.batchLimitSetting, 3)) || 3;
    var rowsByGroup = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
    var result = [];
    Object.keys(rowsByGroup).filter(function (gid) { return !optionalGroupId || gid === optionalGroupId; }).slice(0, batchLimit).forEach(function (gid) {
      var pRows = rowsByGroup[gid];
      var block = pRows.map(function (r) { return r[H.DRAFT_BLOCK]; }).filter(Boolean).join(" | ");
      if (block) {
        result.push({ groupId: gid, status: "Blokaj", message: block });
        return;
      }
      var chain = parasutZincirToplamlariUygunMu_(ss, gid, pRows);
      if (!chain.ok) {
        updateParasutRows_(ss, gid, { [H.PARASUT_STATUS]: "Blokaj", [H.ERROR]: chain.message });
        result.push({ groupId: gid, status: "Blokaj", message: chain.message });
        return;
      }
      var payload = parasutSalesInvoicePayload_(gid, pRows);
      if (!live) {
        result.push({ groupId: gid, status: "Canlı Gönderim Kapalı", payload: payload });
        return;
      }
      kontrolMerkeziniGuncelle_();
      if (kontrolMerkezindeKritikBlokajVar_(ss)) {
        result.push({ groupId: gid, status: "Blokaj", message: "Kontrol merkezi açık blokaj içeriyor" });
        return;
      }
      try {
        var apiResult = parasutApiPost_("/sales_invoices", payload);
        var invoiceId = apiResult && apiResult.data ? apiResult.data.id : "";
        updateParasutRows_(ss, gid, { [H.PARASUT_INVOICE_ID]: invoiceId, [H.PARASUT_STATUS]: "Gönderildi", [H.SEND_LOCK]: "Evet", [H.ERROR]: "" });
        updateInvoiceGroupSendResult_(ss, gid, invoiceId, "Gönderildi", "Evet", "");
        result.push({ groupId: gid, status: "Gönderildi", result: apiResult });
      } catch (err) {
        var msg = safeErrorMessage_(err);
        updateParasutRows_(ss, gid, { [H.PARASUT_STATUS]: "Hata", [H.ERROR]: msg });
        updateInvoiceGroupSendResult_(ss, gid, "", "Hata", "Hayır", msg);
        result.push({ groupId: gid, status: "Hata", message: msg });
      }
    });
    return result;
  }

  function parasutTaslakPayloadTestEt_(optionalGroupId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    parasutTaslaklariniHazirla_();
    var groups = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
    var ids = Object.keys(groups).filter(function (gid) { return !optionalGroupId || gid === optionalGroupId; });
    if (!ids.length) throw new Error("Payload üretilecek Paraşüt taslak satırı yok.");
    var payload = parasutSalesInvoicePayload_(ids[0], groups[ids[0]]);
    var check = parasutPayloadKontrol_(payload);
    return { ok: check.ok, groupId: ids[0], status: check.status, payload: payload };
  }

  function parasutApiBaglantiTestiTam_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    parasutGuvenliPropertyEksikleriniTamamla_();
    var result = {
      projectUrl: CFG.projectUrl,
      scriptProperties: parasutScriptPropertiesDurumu_(),
      livePost: "Yapılmadı",
      ebelgePost: "Yapılmadı",
      parasutLiveGate: yes_(setting_(ss, CFG.liveParasutSendSetting, "Hayır")) ? "Açık" : "Kapalı",
      ebelgeLiveGate: yes_(setting_(ss, CFG.liveEbelgeSendSetting, "Hayır")) ? "Açık" : "Kapalı"
    };
    result.scriptPropertiesOk = parasutScriptPropertiesLogla_(result.scriptProperties);
    result.token = safeCall_("Access token yenileme", parasutTokenYenile_);
    result.company = safeCall_("Company scoped GET", function () {
      parasutApiFetch_("get", "/products?page%5Bsize%5D=1");
      return { ok: true, status: "Company scoped GET başarılı" };
    });
    result.products = safeCall_("Ürün GET testi", parasutUrunKartlariniKontrolEt_);
    result.payload = safeCall_("Fatura payload dry-run", parasutTaslakPayloadTestEt_);
    logOkHata_(result.parasutLiveGate === "Kapalı", "PARASUT_CANLI_GONDERIM kapalı");
    logOkHata_(result.ebelgeLiveGate === "Kapalı", "EBELGE_CANLI_GONDERIM kapalı");
    Logger.log("[OK] Canlı POST yapılmadı");
    result.ok = [result.token, result.company, result.products, result.payload].every(function (x) { return x.ok; }) && result.parasutLiveGate === "Kapalı";
    return result;
  }

  function parasutUrunKartlariniKontrolEt_() {
    var map = parasutUrunIdMapOku_();
    var errors = [];
    var results = [];
    Object.keys(map).forEach(function (name) {
      var id = String(map[name] || "").trim();
      if (!id) {
        errors.push(name + ": ürün ID boş");
        results.push({ name: name, id: id, ok: false, status: "ID boş" });
        return;
      }
      try {
        var response = parasutUrunGetir_(id);
        var attrs = response.data && response.data.attributes ? response.data.attributes : {};
        var actualName = attrs.name || "";
        var active = !(attrs.archived || attrs.archived_at || attrs.deleted || attrs.deleted_at);
        var nameMatches = !actualName || normalizeAscii_(actualName) === normalizeAscii_(name);
        if (!active) errors.push(name + ": ürün pasif");
        results.push({ name: name, id: id, ok: active, nameMatches: nameMatches, active: active, status: active ? "OK" : "Pasif" });
      } catch (err) {
        var msg = safeErrorMessage_(err);
        errors.push(name + ": " + msg);
        results.push({ name: name, id: id, ok: false, status: msg });
      }
    });
    if (errors.length) throw new Error("Paraşüt ürün GET hatası: " + errors.join(" | "));
    return { ok: true, productCount: Object.keys(map).length, results: results };
  }

  function parasutUrunIdMapOku_() {
    return productIdMap_(SpreadsheetApp.getActiveSpreadsheet(), true);
  }

  function parasutUrunGetir_(productId) {
    if (!productId) throw new Error("Paraşüt ürün ID boş.");
    var response = parasutApiFetch_("get", "/products/" + encodeURIComponent(String(productId)));
    if (!response || !response.data || response.data.type !== "products") throw new Error("Paraşüt ürün yanıtı beklenen formatta değil.");
    return response;
  }

  function parasutCariHazirla_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var groups = objects_(sheet_(ss, CFG.sheets.invoiceGroups));
    var resolved = {};
    var issues = [];
    var checked = 0;
    groups.forEach(function (g) {
      if (g[H.INVOICE_STATUS] !== "Hazır") return;
      checked++;
      var criteria = cariCriteriaFromGroup_(g);
      var missing = cariRequiredMissing_(criteria);
      missing.forEach(function (msg) { issues.push(g[H.INVOICE_GROUP_ID] + ": " + msg); });
      try {
        var found = parasutCariBul_(criteria);
        if (found && found.ok && found.contactId && !g[H.PARASUT_CONTACT_ID]) resolved[g[H.INVOICE_GROUP_ID]] = found.contactId;
        if (!found || !found.ok) issues.push(g[H.INVOICE_GROUP_ID] + ": " + ((found && found.status) || "Cari aday seçimi veya oluşturma gerekli"));
      } catch (err) {
        issues.push(g[H.INVOICE_GROUP_ID] + ": " + safeErrorMessage_(err));
      }
    });
    updateInvoiceGroupContactIds_(ss, resolved);
    if (Object.keys(resolved).length) parasutTaslaklariniHazirla_();
    if (issues.length) throw new Error(issues.join(" | "));
    return { ok: true, checkedGroups: checked, resolvedContacts: Object.keys(resolved).length, risk: "PARASUT_CONTACT_ID_MAP_JSON sadece yardımcı cache olarak kullanıldı" };
  }

  function parasutCariBul_(criteria) {
    var c = normalizeCariCriteria_(criteria || {});
    if (c.contactId) {
      var byId = parasutApiFetch_("get", "/contacts/" + encodeURIComponent(String(c.contactId)));
      var idCheck = parasutCariEslesmeKontrol_(c, byId.data);
      return { ok: idCheck.ok, contactId: c.contactId, status: idCheck.status, source: "Paraşüt_Cari_ID" };
    }
    var candidates = cariAdaylariniTopla_(c, true);
    if (candidates.length === 1 && candidates[0].score >= 90) return { ok: true, contactId: candidates[0].id, score: candidates[0].score, status: "Tek güçlü cari eşleşmesi bağlandı", source: candidates[0].source };
    if (candidates.length) return { ok: false, candidates: candidates, status: "Cari aday seçimi gerekli", source: "candidate" };
    return { ok: false, candidates: [], status: "Cari bulunamadı; panelden cari oluşturulmalı", source: "none" };
  }

  function parasutCariOlustur_(criteria) {
    var payload = parasutContactPayload_(criteria || {});
    var result = parasutContactPost_("/contacts", payload);
    return { ok: true, status: "Cari oluşturuldu", contactId: result.data && result.data.id, payload: payload };
  }

  function parasutCariGuncelle_(contactId, criteria) {
    if (!contactId) throw new Error("Güncellenecek Paraşüt cari ID eksik.");
    var payload = parasutContactPayload_(criteria || {});
    payload.data.id = String(contactId);
    return { ok: false, status: "Cari güncelleme otomatik kapalı; sadece payload dry-run üretildi", payload: payload };
  }

  function parasutCariAdaylariniGetir_(faturaBilgisi) {
    var criteria = normalizeCariCriteria_(faturaBilgisi || {});
    return { ok: true, candidates: cariAdaylariniTopla_(criteria, true) };
  }

  function parasutCariOlusturVeyaBagla_(faturaGrubuId, secim) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rows = objects_(sheet_(ss, CFG.sheets.invoiceGroups));
    var group = rows.filter(function (r) { return r[H.INVOICE_GROUP_ID] === faturaGrubuId; })[0];
    if (!group) throw new Error("Fatura grubu bulunamadı.");
    var criteria = cariCriteriaFromGroup_(group);
    var mode = secim && secim.mode || "auto";
    var contactId = secim && secim.contactId || "";
    if (mode === "select" && contactId) {
      patchRowsByKey_(sheet_(ss, CFG.sheets.invoiceGroups), H.INVOICE_GROUP_ID, faturaGrubuId, { [H.PARASUT_CONTACT_ID]: contactId, [H.CARI_MATCH_STATUS]: "Operatör seçti", [H.CARI_ACTION]: "Cari bağlı", [H.WARN]: "" });
      parasutTaslaklariniHazirla_();
      updateMusteriHafizaForOpen_(ss, group[H.OPEN_ID]);
      return { ok: true, contactId: contactId, status: "Cari seçildi ve bağlandı" };
    }
    if (mode === "create") {
      var created = parasutCariOlustur_(criteria);
      if (!created.contactId) throw new Error("Cari oluşturuldu ama yanıt içinde ID yok.");
      patchRowsByKey_(sheet_(ss, CFG.sheets.invoiceGroups), H.INVOICE_GROUP_ID, faturaGrubuId, { [H.PARASUT_CONTACT_ID]: created.contactId, [H.CARI_MATCH_SCORE]: 100, [H.CARI_MATCH_STATUS]: "Cari oluşturuldu", [H.CARI_ACTION]: "Cari bağlı", [H.WARN]: "" });
      parasutTaslaklariniHazirla_();
      updateMusteriHafizaForOpen_(ss, group[H.OPEN_ID]);
      return created;
    }
    var found = parasutCariBul_(criteria);
    if (found.ok && found.contactId) {
      patchRowsByKey_(sheet_(ss, CFG.sheets.invoiceGroups), H.INVOICE_GROUP_ID, faturaGrubuId, { [H.PARASUT_CONTACT_ID]: found.contactId, [H.CARI_MATCH_SCORE]: found.score || "", [H.CARI_MATCH_STATUS]: found.status || "Cari bağlı", [H.CARI_ACTION]: "Cari bağlı", [H.WARN]: "" });
      parasutTaslaklariniHazirla_();
      updateMusteriHafizaForOpen_(ss, group[H.OPEN_ID]);
      return found;
    }
    return found;
  }

  function parasutTokenGecerliMi_() {
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty("PARASUT_ACCESS_TOKEN");
    if (!token) return { ok: false, status: "PARASUT_ACCESS_TOKEN yok" };
    var expiresAt = parasutExpiresAtMs_(props.getProperty("PARASUT_ACCESS_TOKEN_EXPIRES_AT"));
    if (!expiresAt) return { ok: false, status: "Token süresi bilinmiyor; refresh gerekli" };
    if (expiresAt <= Date.now() + 60000) return { ok: false, status: "Token süresi dolmuş/dolmak üzere" };
    return { ok: true, status: "Access token süre bilgisine göre geçerli" };
  }

  function parasutAccessTokenAl_() {
    parasutAccessTokenDegeriAl_();
    return { ok: true, status: "Access token hazır" };
  }

  function parasutAccessTokenDegeriAl_() {
    var props = PropertiesService.getScriptProperties();
    var tokenState = parasutTokenGecerliMi_();
    if (tokenState.ok) return props.getProperty("PARASUT_ACCESS_TOKEN");
    if (!props.getProperty("PARASUT_REFRESH_TOKEN")) throw new Error(tokenState.status + "; PARASUT_REFRESH_TOKEN yok.");
    return parasutTokenYenileInternal_().accessToken;
  }

  function parasutTokenYenile_() {
    var refreshed = parasutTokenYenileInternal_();
    return { ok: true, status: "Access token yenilendi", expiresAt: refreshed.expiresAt };
  }

  function parasutTokenYenileInternal_() {
    var props = PropertiesService.getScriptProperties();
    var clientId = props.getProperty("PARASUT_CLIENT_ID");
    var clientSecret = props.getProperty("PARASUT_CLIENT_SECRET");
    var refreshToken = props.getProperty("PARASUT_REFRESH_TOKEN");
    if (!clientId || !clientSecret || !refreshToken) throw new Error("Paraşüt token refresh için client_id/client_secret/refresh_token eksik.");
    var response = UrlFetchApp.fetch("https://api.parasut.com/oauth/token", {
      method: "post",
      payload: { grant_type: "refresh_token", client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken },
      muteHttpExceptions: true
    });
    var status = response.getResponseCode();
    var text = response.getContentText();
    if (status < 200 || status >= 300) throw new Error("Paraşüt token refresh hata " + status + ": " + sanitizeApiText_(text));
    var parsed = text ? JSON.parse(text) : {};
    if (!parsed.access_token) throw new Error("Paraşüt token refresh yanıtında access_token yok.");
    var expiresIn = Number(parsed.expires_in || 7200);
    var expiresAt = new Date(Date.now() + Math.max(60, expiresIn - 60) * 1000).toISOString();
    props.setProperty("PARASUT_ACCESS_TOKEN", parsed.access_token);
    if (parsed.refresh_token) props.setProperty("PARASUT_REFRESH_TOKEN", parsed.refresh_token);
    props.setProperty("PARASUT_ACCESS_TOKEN_EXPIRES_AT", expiresAt);
    return { accessToken: parsed.access_token, expiresAt: expiresAt };
  }

  function parasutApiFetch_(method, endpoint, payload) {
    var upper = String(method || "get").toUpperCase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (["GET", "POST"].indexOf(upper) === -1) throw new Error("Paraşüt API fetch yalnızca GET ve kontrollü POST destekler.");
    if (upper !== "GET") {
      if (endpoint !== "/sales_invoices") throw new Error("Paraşüt canlı POST yalnızca /sales_invoices için açıktır.");
      if (!yes_(setting_(ss, CFG.liveParasutSendSetting, "Hayır"))) throw new Error("PARASUT_CANLI_GONDERIM Hayır; canlı POST kilidi kapalı.");
    }
    return parasutApiFetchWithRetry_(upper, endpoint, payload, false);
  }

  function parasutApiFetchWithRetry_(method, endpoint, payload, retried) {
    var token = parasutAccessTokenDegeriAl_();
    var options = {
      method: method.toLowerCase(),
      muteHttpExceptions: true,
      headers: { Authorization: "Bearer " + token, Accept: "application/json" }
    };
    if (method !== "GET") {
      options.contentType = "application/json";
      options.payload = JSON.stringify(payload || {});
    }
    var response = UrlFetchApp.fetch(parasutApiUrl_(endpoint), options);
    var status = response.getResponseCode();
    var text = response.getContentText();
    if (status === 401 && !retried) {
      parasutTokenYenileInternal_();
      return parasutApiFetchWithRetry_(method, endpoint, payload, true);
    }
    if (status < 200 || status >= 300) throw new Error("Paraşüt API hata " + status + ": " + sanitizeApiText_(text));
    return text ? JSON.parse(text) : {};
  }

  function parasutApiPost_(path, payload) {
    return parasutApiFetch_("post", path, payload);
  }

  function rebuildOpenOrders_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var queueRows = objects_(sheet_(ss, CFG.sheets.queue));
    var itemsByOpen = groupBy_(objects_(sheet_(ss, CFG.sheets.items)), H.OPEN_ID);
    var paymentsByOpen = groupBy_(objects_(sheet_(ss, CFG.sheets.payments)), H.OPEN_ID);
    var groupsByOpen = groupBy_(objects_(sheet_(ss, CFG.sheets.invoiceGroups)), H.OPEN_ID);
    var cargoByOpen = groupBy_(objects_(sheet_(ss, CFG.sheets.cargo)), H.OPEN_ID);
    var openIds = {};
    queueRows.forEach(function (r) { if (r[H.OPEN_ID]) openIds[r[H.OPEN_ID]] = true; });
    Object.keys(itemsByOpen).forEach(function (id) { openIds[id] = true; });
    Object.keys(paymentsByOpen).forEach(function (id) { openIds[id] = true; });
    var queueByOpen = groupBy_(queueRows, H.OPEN_ID);
    var out = Object.keys(openIds).sort().map(function (openId) {
      var qRows = queueByOpen[openId] || [];
      var first = qRows[0] || {};
      var items = itemsByOpen[openId] || [];
      var payments = paymentsByOpen[openId] || [];
      var groups = groupsByOpen[openId] || [];
      var cargo = cargoByOpen[openId] || [];
      var gross = sum_(items, H.LINE_GROSS);
      var net = sum_(items, H.LINE_NET);
      var vat = sum_(items, H.VAT_AMOUNT);
      var pay = sum_(payments, H.PAYMENT_AMOUNT);
      var diff = round2_(pay - gross);
      var warnings = [];
      if (!items.length) warnings.push("Ürün kalemi yok");
      if (!payments.length) warnings.push("Ödeme kaydı yok");
      if (Math.abs(diff) > 0.01) warnings.push("Ödeme ve ürün toplamı eşleşmiyor");
      if (items.length && payments.length && !groups.length) warnings.push("Fatura grubu yok");
      var qStatus = first[H.ORDER_STATUS] || "Açık";
      return {
        [H.OPEN_ID]: openId,
        [H.ORDER_NO]: "TK-" + openId.replace(/^AS-/, ""),
        [H.OP_DAY]: first[H.OP_DAY] || "",
        [H.FIRST_TS]: firstDate_(qRows, H.MSG_DT),
        [H.LAST_TS]: lastDate_(qRows, H.MSG_DT),
        [H.PHONE]: first[H.PHONE] || "",
        [H.OWNER]: first[H.OWNER] || "",
        [H.ORDER_STATUS]: warnings.length ? "Kontrol Gerekli" : qStatus,
        [H.ITEM_COUNT]: items.length,
        [H.PAYMENT_COUNT]: payments.length,
        [H.GROUP_COUNT]: groups.length,
        [H.CARGO_COUNT]: cargo.length,
        [H.TOTAL_GROSS]: gross,
        [H.TOTAL_NET]: net,
        [H.TOTAL_VAT]: vat,
        [H.PAYMENT_TOTAL]: pay,
        [H.PAYMENT_DIFF]: diff,
        [H.CARGO_STATUS]: cargo.length ? cargo[0][H.PACKAGE_STATUS] : "Bekliyor",
        [H.INVOICE_STATUS]: warnings.length ? "Blokaj" : "Hazırlanabilir",
        [H.EBELGE_STATUS]: "11_EBELGE_ISTISNA bekler",
        [H.CONTROL_LEVEL]: warnings.length ? "Blokaj" : "OK",
        [H.WARN]: warnings.join(" | "),
        [H.NOTE]: first[H.NOTE] || "",
        [H.MERGE_KEY]: (first[H.OP_DAY] || "") + "|" + (first[H.PHONE] || ""),
        [H.CLOSE_OK]: warnings.length ? "Hayır" : "Evet",
        [H.BLOCK_REASON]: warnings.join(" | ")
      };
    });
    writeObjects_(sheet_(ss, CFG.sheets.open), HEADERS.open, out);
    return true;
  }

  function gecEklemeIstisnaIslemi_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var active = ss.getActiveRange && ss.getActiveRange();
    if (!active || active.getSheet().getName() !== CFG.sheets.queue || active.getRow() < 2) {
      throw new Error("02_WHATSAPP_KUYRUGU içinde geç ekleme satırından bir hücre seçilmelidir.");
    }
    var sh = active.getSheet();
    var h = headers_(sh);
    var row = active.getRow();
    setCell_(sh, row, h, H.ROW_STATUS, "Geç Ekleme Onaylı");
    setCell_(sh, row, h, H.WARN, "Operatör onaylı geç ekleme; kargo 08_KARGO_PAKETLERI tarafında bağlanır");
    var openId = h[H.OPEN_ID] !== undefined ? sh.getRange(row, h[H.OPEN_ID] + 1).getValue() : "";
    if (openId) markCargoLateAdd_(ss, openId);
    return true;
  }

  function parasutSalesInvoicePayload_(groupId, rows) {
    var first = rows[0] || {};
    var included = [];
    var detailRefs = [];
    rows.forEach(function (row, index) {
      var detailId = "detail-" + (index + 1);
      detailRefs.push({ id: detailId, type: "sales_invoice_details" });
      included.push({
        id: detailId,
        type: "sales_invoice_details",
        attributes: {
          quantity: num_(row[H.QTY]),
          unit_price: num_(row[H.UNIT_NET]),
          vat_rate: round2_(normalizeVatRate_(row[H.VAT_RATE]) * 100),
          description: row[H.PRODUCT]
        },
        relationships: {
          product: { data: { id: String(row[H.PARASUT_PRODUCT_ID] || ""), type: "products" } }
        }
      });
    });
    return {
      data: {
        type: "sales_invoices",
        attributes: {
          item_type: "invoice",
          description: "Tesbih Kuyusu V6 | " + groupId,
          issue_date: todayIso_(),
          due_date: todayIso_(),
          currency: "TRL"
        },
        relationships: {
          contact: { data: { id: String(first[H.PARASUT_CONTACT_ID] || ""), type: "contacts" } },
          details: { data: detailRefs }
        }
      },
      included: included
    };
  }

  function parasutPayloadKontrol_(payload) {
    var issues = [];
    var data = payload && payload.data ? payload.data : {};
    if (data.type !== "sales_invoices") issues.push("data.type sales_invoices değil");
    if (!data.attributes || data.attributes.item_type !== "invoice") issues.push("attributes.item_type invoice değil");
    if (!data.relationships || !data.relationships.contact || !data.relationships.contact.data || !data.relationships.contact.data.id) issues.push("contact relationship eksik");
    var details = data.relationships && data.relationships.details && data.relationships.details.data;
    var included = payload.included || [];
    if (!details || !details.length) issues.push("details satırı yok");
    if (!included.length) issues.push("included satırı yok");
    (included || []).forEach(function (detail, index) {
      if (detail.type !== "sales_invoice_details") issues.push("detail " + (index + 1) + " type hatalı");
      if (!detail.relationships || !detail.relationships.product || !detail.relationships.product.data || !detail.relationships.product.data.id) issues.push("detail " + (index + 1) + " product relationship eksik");
      if (num_(detail.attributes && detail.attributes.unit_price) < 0) issues.push("detail " + (index + 1) + " unit_price negatif");
    });
    if (/istisna|e_belge|e-?arsiv|e-?fatura/i.test(JSON.stringify(payload))) issues.push("sales_invoice payload içinde e-belge/istisna alanı var");
    return { ok: !issues.length, status: issues.length ? issues.join(" | ") : "Payload dry-run OK" };
  }

  function parasutZincirToplamlariUygunMu_(ss, groupId, pRows) {
    var itemTotal = objects_(sheet_(ss, CFG.sheets.items)).filter(function (r) { return r[H.INVOICE_GROUP_ID] === groupId; }).reduce(function (s, r) { return s + num_(r[H.LINE_GROSS]); }, 0);
    var group = {};
    objects_(sheet_(ss, CFG.sheets.invoiceGroups)).forEach(function (g) { if (g[H.INVOICE_GROUP_ID] === groupId) group = g; });
    var payTotal = num_(group[H.GROUP_PAYMENT_SUM]);
    var groupTotal = num_(group[H.ITEM_SUM]);
    var pTotal = (pRows || []).reduce(function (s, r) { return s + num_(r[H.LINE_GROSS]); }, 0);
    if (!group[H.OPEN_ID]) return { ok: false, message: "02 açık sipariş bağlantısı yok" };
    var totals = [["04", itemTotal], ["05", payTotal], ["06", groupTotal], ["07", pTotal]];
    for (var i = 0; i < totals.length; i++) {
      if (Math.abs(round2_(totals[i][1]) - round2_(pTotal)) > 0.01) {
        return { ok: false, message: "02 kimlik bağlantılı; 04-05-06-07 toplam uyumsuzluğu: " + totals.map(function (x) { return x[0] + "=" + round2_(x[1]); }).join(", ") };
      }
    }
    return { ok: true, message: "02 kimlik bağlantılı; 04-05-06-07 toplamlar uyumlu" };
  }

  function ensureSheet_(ss, name, requiredHeaders) {
    var sh = sheet_(ss, name) || ss.insertSheet(name);
    if (sh.getLastRow() < 1) sh.getRange(1, 1).setValue(requiredHeaders[0]);
    var h = headers_(sh);
    var last = sh.getLastColumn();
    requiredHeaders.forEach(function (header) {
      if (h[header] !== undefined) return;
      last++;
      sh.getRange(1, last).setValue(header);
      h[header] = last - 1;
    });
    return sh;
  }

  function objects_(sh) {
    if (!sh || sh.getLastRow() < 2) return [];
    var values = sh.getDataRange().getValues();
    var headers = values.shift();
    return values.map(function (row) {
      var obj = {};
      headers.forEach(function (name, i) { if (name) obj[name] = row[i]; });
      return obj;
    }).filter(function (obj) {
      return Object.keys(obj).some(function (k) { return obj[k] !== "" && obj[k] !== null && obj[k] !== undefined; });
    });
  }

  function writeObjects_(sh, headers, objects) {
    ensureSheet_(SpreadsheetApp.getActiveSpreadsheet(), sh.getName(), headers);
    clearBody_(sh);
    if (!objects || !objects.length) return;
    var h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var rows = objects.map(function (obj) {
      return h.map(function (name) { return obj[name] !== undefined ? obj[name] : ""; });
    });
    sh.getRange(2, 1, rows.length, h.length).setValues(rows);
  }

  function clearBody_(sh) {
    if (sh && sh.getLastRow() >= 2) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
  }

  function headers_(sh) {
    var values = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
    var out = {};
    values.forEach(function (v, i) { if (v !== "" && v !== null && v !== undefined) out[String(v)] = i; });
    return out;
  }

  function sheet_(ss, name) {
    return ss.getSheetByName(name);
  }

  function settingsMap_(ss) {
    var sh = sheet_(ss, CFG.sheets.settings);
    var out = {};
    if (!sh || sh.getLastRow() < 2) return out;
    var values = sh.getDataRange().getValues();
    values.shift();
    values.forEach(function (row) { if (row[0]) out[String(row[0])] = row[1]; });
    return out;
  }

  function setting_(ss, key, fallback) {
    var map = settingsMap_(ss);
    var value = map[key];
    if ((value === "" || value === null || value === undefined) && typeof PropertiesService !== "undefined") {
      value = PropertiesService.getScriptProperties().getProperty(key);
    }
    return value === "" || value === null || value === undefined ? fallback : value;
  }

  function ensureRequiredSettings_(ss) {
    var sh = sheet_(ss, CFG.sheets.settings);
    var existing = settingsMap_(ss);
    var now = new Date();
    var required = [
      ["PARASUT_CANLI_GONDERIM", "Hayır", "Evet olmadan canlı Paraşüt POST yapılmaz", "Evet", now, ""],
      ["PARASUT_BATCH_LIMIT", "3", "Tek çalıştırmada işlenecek Paraşüt fatura grubu limiti", "Evet", now, ""],
      ["PARASUT_PRODUCT_ID_MAP_JSON", "{}", "Ürün -> Paraşüt ürün ID map JSON", "Evet", now, ""],
      ["PARASUT_CONTACT_ID_MAP_JSON", "{}", "Yardımcı cari ID cache; kesin eşleşme kaynağı değildir", "Hayır", now, ""],
      ["EBELGE_CANLI_GONDERIM", "Hayır", "Evet olmadan e-Belge/e-Fatura canlı gönderimi yapılmaz", "Evet", now, ""],
      ["NAVLUNGO_CANLI_GONDERIM", "Hayır", "Evet olmadan canlı kargo gönderimi yapılmaz", "Evet", now, ""],
      ["SISTEM_OPERASYON_SAATI_KAPANIS", CFG.cutoff, "Operasyon kapanış saati", "Evet", now, ""],
      ["TCKN_VARSAYILAN_GERCEK_KISI", CFG.defaultTckn, "Gerçek kişi TCKN boş ise kullanılır", "Evet", now, ""],
      ["BANKA_HAREKET_MODULU_AKTIF", "Evet", "14_BANKA_HAREKETLERI ödeme teyit yardımcısıdır", "Evet", now, ""],
      ["VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany, "Kargo firması boşsa önerilir", "Hayır", now, ""],
      ["KARGO_UCRETI_STANDART", String(CFG.defaultCargoFee), "808 finans ön izleme için varsayılan kargo maliyeti", "Hayır", now, ""]
    ];
    var rows = required.filter(function (r) { return existing[r[0]] === undefined; });
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  }

  function productIdMap_(ss, required) {
    var propsRaw = PropertiesService.getScriptProperties().getProperty(CFG.productMapSetting);
    var raw = propsRaw || setting_(ss, CFG.productMapSetting, "{}") || "{}";
    var parsed = {};
    try { parsed = JSON.parse(raw || "{}"); } catch (err) { throw new Error("PARASUT_PRODUCT_ID_MAP_JSON geçerli JSON değil."); }
    if (required && !Object.keys(parsed).length) throw new Error("PARASUT_PRODUCT_ID_MAP_JSON boş.");
    return parsed;
  }

  function contactIdMap_() {
    var propsRaw = PropertiesService.getScriptProperties().getProperty(CFG.contactMapSetting);
    var raw = propsRaw || setting_(SpreadsheetApp.getActiveSpreadsheet(), CFG.contactMapSetting, "{}") || "{}";
    try { return JSON.parse(raw || "{}"); } catch (err) { throw new Error("PARASUT_CONTACT_ID_MAP_JSON geçerli JSON değil."); }
  }

  function productIdFromMap_(map, productName) {
    var name = trim_(productName);
    if (!name || !map) return "";
    if (map[name]) return String(map[name]).trim();
    var normalized = normalizeAscii_(name).replace(/\s+/g, " ").trim();
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
      if (normalizeAscii_(keys[i]).replace(/\s+/g, " ").trim() === normalized) return String(map[keys[i]] || "").trim();
    }
    return "";
  }

  function parasutApiUrl_(endpoint) {
    var ep = String(endpoint || "");
    if (ep.charAt(0) !== "/") ep = "/" + ep;
    if (ep === "/me" || ep.indexOf("/me?") === 0) return "https://api.parasut.com/v4" + ep;
    var companyId = PropertiesService.getScriptProperties().getProperty("PARASUT_COMPANY_ID");
    if (!companyId) throw new Error("PARASUT_COMPANY_ID yok.");
    return "https://api.parasut.com/v4/" + encodeURIComponent(companyId) + ep;
  }

  function parasutExpiresAtMs_(raw) {
    if (!raw) return 0;
    var n = Number(raw);
    if (!isNaN(n) && n > 0) return n < 1000000000000 ? n * 1000 : n;
    var parsed = Date.parse(raw);
    return isNaN(parsed) ? 0 : parsed;
  }

  function sanitizeApiText_(text) {
    return String(text || "")
      .replace(/"access_token"\s*:\s*"[^"]+"/g, '"access_token":"***"')
      .replace(/"refresh_token"\s*:\s*"[^"]+"/g, '"refresh_token":"***"')
      .replace(/"client_secret"\s*:\s*"[^"]+"/g, '"client_secret":"***"')
      .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer ***")
      .slice(0, 800);
  }

  function safeErrorMessage_(err) {
    return sanitizeApiText_(err && err.message ? err.message : err);
  }

  function parasutRequiredPropertyKeys_() {
    return [
      "PARASUT_CLIENT_ID",
      "PARASUT_CLIENT_SECRET",
      "PARASUT_COMPANY_ID",
      "PARASUT_ACCESS_TOKEN",
      "PARASUT_REFRESH_TOKEN",
      "PARASUT_ACCESS_TOKEN_EXPIRES_AT",
      "PARASUT_CALLBACK_URL",
      "PARASUT_PRODUCT_ID_MAP_JSON",
      "PARASUT_CONTACT_ID_MAP_JSON"
    ];
  }

  function parasutScriptPropertiesDurumu_() {
    var props = PropertiesService.getScriptProperties();
    return parasutRequiredPropertyKeys_().map(function (key) {
      return { key: key, durum: props.getProperty(key) ? "var" : "yok" };
    });
  }

  function parasutGuvenliPropertyEksikleriniTamamla_() {
    var props = PropertiesService.getScriptProperties();
    if (!props.getProperty("PARASUT_CONTACT_ID_MAP_JSON")) props.setProperty("PARASUT_CONTACT_ID_MAP_JSON", "{}");
  }

  function parasutScriptPropertiesLogla_(rows) {
    var ok = true;
    (rows || []).forEach(function (row) {
      var exists = row.durum === "var";
      if (!exists) ok = false;
      logOkHata_(exists, row.key + (exists ? " var" : " yok"));
    });
    return ok;
  }

  function safeCall_(label, fn) {
    try {
      var result = fn();
      var ok = !result || result.ok !== false;
      logOkHata_(ok, label + (ok ? " başarılı" : " başarısız: " + result.status));
      return result && typeof result === "object" ? result : { ok: ok, status: ok ? "OK" : "HATA" };
    } catch (err) {
      var msg = safeErrorMessage_(err);
      logOkHata_(false, label + " hata: " + msg);
      return { ok: false, status: msg };
    }
  }

  function logOkHata_(ok, message) {
    Logger.log((ok ? "[OK] " : "[HATA] ") + message);
  }

  function stepResult_(name, fn) {
    try { return { step: name, ok: true, result: fn() }; } catch (err) { return { step: name, ok: false, error: safeErrorMessage_(err) }; }
  }

  function collectIssues_(issues, sheetName, rows, idField, msgField, module, severity) {
    (rows || []).forEach(function (row) {
      var msg = row[msgField] || row[H.WARN] || row[H.ERROR];
      if (!msg) return;
      issues.push({
        [H.CTRL_ID]: "CTRL-" + pad_(issues.length + 1, 4),
        [H.DATE]: new Date(),
        [H.SOURCE_SHEET]: sheetName,
        [H.SOURCE_ID]: row[idField],
        [H.CTRL_TYPE]: module + " kontrol",
        [H.RISK]: severity,
        [H.STATUS]: "Açık",
        [H.WARN]: msg,
        [H.ACTION_EXPECTED]: "Operatör kontrolü ve veri düzeltme",
        [H.IS_BLOCK]: "Evet",
        [H.MODULE]: module
      });
    });
  }

  function collectBankIssues_(issues, ss) {
    objects_(sheet_(ss, CFG.sheets.bank)).forEach(function (row) {
      var msg = row[H.WARN] || "";
      if (row[H.MATCH_STATUS] && row[H.MATCH_STATUS] !== "Onaylandı" && row[H.MATCH_STATUS] !== "Eşleşme yok") msg = appendWarn_(msg, "Banka eşleşmesi operatör onayı bekliyor");
      if (!msg) return;
      issues.push({
        [H.CTRL_ID]: "CTRL-" + pad_(issues.length + 1, 4),
        [H.DATE]: new Date(),
        [H.SOURCE_SHEET]: CFG.sheets.bank,
        [H.SOURCE_ID]: row[H.BANK_MOVE_ID],
        [H.CTRL_TYPE]: "Banka teyit kontrol",
        [H.RISK]: row[H.MATCH_SCORE] >= 90 ? "Orta" : "Yüksek",
        [H.STATUS]: "Açık",
        [H.WARN]: msg,
        [H.ACTION_EXPECTED]: "14_BANKA_HAREKETLERI içinde önerilen eşleşmeyi kontrol edip Operatör_Onayı verin veya 05_ODEMELER kaydını düzeltin.",
        [H.IS_BLOCK]: "Evet",
        [H.MODULE]: "Banka"
      });
    });
  }

  function updateParasutRows_(ss, groupId, patch) {
    patchRowsByKey_(sheet_(ss, CFG.sheets.parasut), H.INVOICE_GROUP_ID, groupId, patch);
  }

  function updateInvoiceGroupSendResult_(ss, groupId, invoiceId, status, lock, err) {
    var patch = { [H.PARASUT_INVOICE_ID]: invoiceId, [H.INVOICE_STATUS]: status, [H.SEND_LOCK]: lock, [H.WARN]: err || "" };
    patchRowsByKey_(sheet_(ss, CFG.sheets.invoiceGroups), H.INVOICE_GROUP_ID, groupId, patch);
  }

  function updateInvoiceGroupContactIds_(ss, resolved) {
    Object.keys(resolved).forEach(function (gid) {
      patchRowsByKey_(sheet_(ss, CFG.sheets.invoiceGroups), H.INVOICE_GROUP_ID, gid, { [H.PARASUT_CONTACT_ID]: resolved[gid], [H.CARI_MATCH_STATUS]: "Cari bağlı", [H.CARI_ACTION]: "Cari bağlı" });
    });
  }

  function patchRowsByKey_(sh, keyName, keyValue, patch) {
    if (!sh || sh.getLastRow() < 2) return;
    var h = headers_(sh);
    var values = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
    values.forEach(function (row) {
      if (row[h[keyName]] === keyValue) {
        Object.keys(patch).forEach(function (name) {
          if (h[name] !== undefined) row[h[name]] = patch[name];
        });
      }
    });
    sh.getRange(2, 1, values.length, sh.getLastColumn()).setValues(values);
  }

  function kontrolMerkezindeKritikBlokajVar_(ss) {
    return objects_(sheet_(ss, CFG.sheets.control)).some(function (row) {
      return row[H.STATUS] === "Açık" && row[H.IS_BLOCK] === "Evet";
    });
  }

  function markCargoLateAdd_(ss, openId) {
    var sh = sheet_(ss, CFG.sheets.cargo);
    var rows = objects_(sh);
    var found = false;
    rows.forEach(function (r) {
      if (r[H.OPEN_ID] === openId) {
        r[H.LATE_ADD] = "Evet";
        found = true;
      }
    });
    if (found) writeObjects_(sh, HEADERS.cargo, rows);
  }

  function copyByHeaders_(base, headers, patch) {
    var out = {};
    headers.forEach(function (name) { out[name] = base && base[name] !== undefined ? base[name] : ""; });
    Object.keys(patch || {}).forEach(function (name) { out[name] = patch[name]; });
    return out;
  }

  function newInvoiceAccumulator_(id, openId, payer) {
    return { id: id, openId: openId || "", payer: payer || "", items: [], payments: [], itemTotal: 0, itemNet: 0, itemVat: 0, paymentTotal: 0 };
  }

  function cariCriteriaFromGroup_(group) {
    return normalizeCariCriteria_({
      groupId: group[H.INVOICE_GROUP_ID],
      name: group[H.INVOICE_PERSON] || group[H.PAYER],
      taxNo: group[H.TAX_NO],
      cariTipi: group[H.CARI_TYPE],
      contactId: group[H.PARASUT_CONTACT_ID],
      phone: group[H.INVOICE_TEL],
      address: group[H.INVOICE_ADDRESS],
      city: group[H.INVOICE_CITY],
      district: group[H.INVOICE_DISTRICT]
    });
  }

  function normalizeCariCriteria_(criteria) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var name = normalizePersonName_(criteria.name || "");
    var taxNo = normalizeTaxNo_(criteria.taxNo || "");
    var cariTipi = normalizeCariTipi_(criteria.cariTipi || "", taxNo, name);
    if (!taxNo && cariTipi === "Gerçek Kişi") taxNo = setting_(ss, "TCKN_VARSAYILAN_GERCEK_KISI", CFG.defaultTckn);
    return {
      groupId: criteria.groupId || "",
      name: name,
      taxNo: taxNo,
      cariTipi: cariTipi,
      contactId: String(criteria.contactId || "").trim(),
      phone: normalizePhone_(criteria.phone || ""),
      address: String(criteria.address || "").trim(),
      city: String(criteria.city || "").trim(),
      district: String(criteria.district || "").trim()
    };
  }

  function cariRequiredMissing_(criteria) {
    var issues = [];
    if (!criteria.name) issues.push("fatura/cari adı yok");
    if (criteria.cariTipi === "Tüzel Kişi" && String(criteria.taxNo || "").length !== 10) issues.push("tüzel kişi için VKN zorunlu/geçerli değil");
    if (criteria.cariTipi === "Gerçek Kişi" && String(criteria.taxNo || "").length !== 11) issues.push("gerçek kişi TCKN geçerli değil");
    return issues;
  }

  function firstStrongContactMatch_(criteria, contacts) {
    for (var i = 0; i < contacts.length; i++) {
      var check = parasutCariEslesmeKontrol_(criteria, contacts[i]);
      if (check.ok) return contacts[i];
    }
    return null;
  }

  function parasutCariEslesmeKontrol_(criteria, contact) {
    if (!contact) return { ok: false, status: "Cari yanıtı boş" };
    var attrs = contact.attributes || {};
    var actualName = normalizePersonName_(attrs.name || attrs.short_name || "");
    var actualTax = normalizeTaxNo_(attrs.tax_number || attrs.tckn || attrs.vkn || "");
    var actualPhone = normalizePhone_(attrs.phone || attrs.mobile_phone || "");
    var nameOk = !criteria.name || actualName === criteria.name;
    var taxOk = !criteria.taxNo || !actualTax || actualTax === criteria.taxNo;
    var phoneOk = !criteria.phone || !actualPhone || actualPhone === criteria.phone;
    if (taxOk && phoneOk && nameOk) return { ok: true, status: "Cari ek alanlarla doğrulandı" };
    return { ok: false, status: "Ad/TCKN/VKN/telefon eşleşmesi güçlü değil" };
  }

  function parasutContactPayload_(criteria) {
    var c = normalizeCariCriteria_(criteria || {});
    return {
      data: {
        type: "contacts",
        attributes: {
          name: c.name,
          contact_type: "person",
          account_type: "customer",
          tax_number: c.taxNo,
          city: c.city,
          district: c.district,
          address: c.address,
          phone: c.phone
        }
      }
    };
  }

  function cariAdaylariniTopla_(criteria, allowNetwork) {
    var c = normalizeCariCriteria_(criteria || {});
    var out = [];
    hafizaCariAdaylari_(c).forEach(function (candidate) { out.push(candidate); });
    mapCariAdaylari_(c, allowNetwork).forEach(function (candidate) { out.push(candidate); });
    if (allowNetwork) parasutSearchCariAdaylari_(c).forEach(function (candidate) { out.push(candidate); });
    var byId = {};
    out.forEach(function (candidate) {
      if (!candidate.id) return;
      if (!byId[candidate.id] || byId[candidate.id].score < candidate.score) byId[candidate.id] = candidate;
    });
    return Object.keys(byId).map(function (id) { return byId[id]; }).sort(function (a, b) { return b.score - a.score; });
  }

  function hafizaCariAdaylari_(criteria) {
    var rows = objects_(sheet_(SpreadsheetApp.getActiveSpreadsheet(), CFG.sheets.memory));
    var out = [];
    rows.forEach(function (row) {
      var candidate = {
        id: row[H.PARASUT_CONTACT_ID],
        name: row["Son_Fatura_Kişisi"] || row[H.OWNER],
        taxNo: row["Son_Fatura_TCKN_VKN"],
        phone: row["Son_Fatura_Tel"] || row[H.PHONE],
        address: row["Son_Adres"],
        city: row["Son_İl"],
        district: row["Son_İlçe"],
        source: "09_MUSTERI_HAFIZA"
      };
      if (candidate.id) out.push(scoreCariCandidate_(criteria, candidate));
      try {
        var extra = JSON.parse(row["Cari_Adaylari_JSON"] || "[]");
        extra.forEach(function (x) {
          if (x.contactId) out.push(scoreCariCandidate_(criteria, { id: x.contactId, name: x.payer, taxNo: x.taxNo, phone: x.phone, source: "09_MUSTERI_HAFIZA" }));
        });
      } catch (err) {}
    });
    return out.filter(function (x) { return x.score >= 70; });
  }

  function mapCariAdaylari_(criteria, allowNetwork) {
    var map = contactIdMap_();
    var rawId = map[criteria.name] || map[normalizeAscii_(criteria.name)] || "";
    if (!rawId) return [];
    if (!allowNetwork) return [scoreCariCandidate_(criteria, { id: rawId, name: criteria.name, source: "PARASUT_CONTACT_ID_MAP_JSON" })];
    try {
      var byCache = parasutApiFetch_("get", "/contacts/" + encodeURIComponent(String(rawId)));
      return [scoreParasutContact_(criteria, byCache.data, "PARASUT_CONTACT_ID_MAP_JSON")].filter(function (x) { return x.score >= 70; });
    } catch (err) {
      return [scoreCariCandidate_(criteria, { id: rawId, name: criteria.name, source: "PARASUT_CONTACT_ID_MAP_JSON" })];
    }
  }

  function parasutSearchCariAdaylari_(criteria) {
    var queries = [];
    if (criteria.taxNo && criteria.taxNo !== CFG.defaultTckn) queries.push("/contacts?filter%5Btax_number%5D=" + encodeURIComponent(criteria.taxNo) + "&filter%5Baccount_type%5D=customer&page%5Bsize%5D=10");
    if (criteria.name) queries.push("/contacts?filter%5Bname%5D=" + encodeURIComponent(criteria.name) + "&filter%5Baccount_type%5D=customer&page%5Bsize%5D=10");
    var out = [];
    queries.forEach(function (endpoint) {
      try {
        var res = parasutApiFetch_("get", endpoint);
        (res.data || []).forEach(function (contact) { out.push(scoreParasutContact_(criteria, contact, "Paraşüt search")); });
      } catch (err) {}
    });
    return out.filter(function (x) { return x.score >= 70; });
  }

  function scoreParasutContact_(criteria, contact, source) {
    var attrs = contact && contact.attributes || {};
    return scoreCariCandidate_(criteria, {
      id: contact && contact.id,
      name: attrs.name || attrs.short_name || "",
      taxNo: attrs.tax_number || attrs.tckn || attrs.vkn || "",
      phone: attrs.phone || attrs.mobile_phone || "",
      address: attrs.address || "",
      city: attrs.city || "",
      district: attrs.district || "",
      source: source
    });
  }

  function scoreCariCandidate_(criteria, candidate) {
    var c = normalizeCariCriteria_(criteria || {});
    var score = 0;
    var reasons = [];
    var candTax = normalizeTaxNo_(candidate.taxNo || "");
    var candPhone = normalizePhone_(candidate.phone || "");
    var candName = normalizePersonName_(candidate.name || "");
    if (c.taxNo && candTax && c.taxNo === candTax) { score += 60; reasons.push("TCKN/VKN"); }
    if (c.phone && candPhone && c.phone === candPhone) { score += 40; reasons.push("telefon"); }
    if (c.name && candName) {
      var nameScore = nameSimilarity_(normalizeAscii_(c.name), normalizeAscii_(candName));
      if (nameScore >= 0.8) { score += 25; reasons.push("ad"); }
      else if (nameScore >= 0.5) { score += 15; reasons.push("ad kısmi"); }
    }
    if (c.address && candidate.address && normalizeAscii_(candidate.address).indexOf(normalizeAscii_(c.address).slice(0, 12)) !== -1) { score += 5; reasons.push("adres"); }
    if (c.city && candidate.city && normalizeAscii_(c.city) === normalizeAscii_(candidate.city)) { score += 3; reasons.push("il"); }
    if (c.district && candidate.district && normalizeAscii_(c.district) === normalizeAscii_(candidate.district)) { score += 2; reasons.push("ilçe"); }
    if (!c.taxNo && !c.phone && c.name && candName && normalizeAscii_(c.name) === normalizeAscii_(candName)) score = Math.min(score, 50);
    return { id: candidate.id || "", name: candName, taxNo: candTax, phone: candPhone, score: Math.min(100, score), source: candidate.source || "", reasons: reasons.join(", ") };
  }

  function parasutContactPost_(endpoint, payload) {
    var token = parasutAccessTokenDegeriAl_();
    var response = UrlFetchApp.fetch(parasutApiUrl_(endpoint), {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload || {}),
      muteHttpExceptions: true,
      headers: { Authorization: "Bearer " + token, Accept: "application/json" }
    });
    var status = response.getResponseCode();
    var text = response.getContentText();
    if (status < 200 || status >= 300) throw new Error("Paraşüt cari POST hata " + status + ": " + sanitizeApiText_(text));
    return text ? JSON.parse(text) : {};
  }

  function otomatikGorunumuDuzenle_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    Object.keys(CFG.sheets).forEach(function (key) {
      var sh = sheet_(ss, CFG.sheets[key]);
      if (!sh) return;
      var lastCol = Math.max(1, sh.getLastColumn());
      var lastRow = Math.max(1, sh.getLastRow());
      if (sh.setFrozenRows) sh.setFrozenRows(1);
      if (sh.autoResizeColumns) sh.autoResizeColumns(1, lastCol);
      if (sh.autoResizeRows) sh.autoResizeRows(1, lastRow);
      if (sh.getDataRange && sh.getDataRange().setWrap) sh.getDataRange().setWrap(true);
    });
    return { ok: true, status: "Görünüm düzenlendi; veri silinmedi" };
  }

  function bankaHareketleriniIceriAl_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    sistemKolonlariniHazirla_();
    var rows = objects_(sheet_(ss, CFG.sheets.bank));
    var out = [];
    rows.forEach(function (row, index) {
      if (!row[H.BANK_DATE] && !row[H.BANK_SENDER] && !row[H.BANK_DESC] && !row[H.BANK_AMOUNT]) return;
      var warnings = [];
      var amount = normalizeTutar_(row[H.BANK_AMOUNT]);
      if (!row[H.BANK_DATE]) warnings.push("İşlem_Tarihi eksik");
      if (!amount) warnings.push("Tutar eksik");
      out.push(copyByHeaders_(row, HEADERS.bank, {
        [H.BANK_MOVE_ID]: row[H.BANK_MOVE_ID] || "BH-" + ymd_(normalizeTarih_(row[H.BANK_DATE]) || new Date()) + "-" + pad_(index + 1, 4),
        [H.BANK_DATE]: normalizeTarih_(row[H.BANK_DATE]) || row[H.BANK_DATE],
        [H.BANK_VALUE_DATE]: normalizeTarih_(row[H.BANK_VALUE_DATE]) || row[H.BANK_VALUE_DATE],
        [H.BANK_SENDER]: normalizePersonName_(row[H.BANK_SENDER]),
        [H.BANK_DESC]: String(row[H.BANK_DESC] || "").trim(),
        [H.BANK_AMOUNT]: amount,
        [H.MATCH_STATUS]: row[H.MATCH_STATUS] || "Eşleşme bekliyor",
        [H.MATCH_SCORE]: row[H.MATCH_SCORE] || "",
        [H.OPERATOR_APPROVAL]: row[H.OPERATOR_APPROVAL] || "Hayır",
        [H.WARN]: warnings.join(" | ")
      }));
    });
    writeObjects_(sheet_(ss, CFG.sheets.bank), HEADERS.bank, out);
    return { ok: true, hareketSayisi: out.length };
  }

  function bankaHareketleriniEsle_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    bankaHareketleriniIceriAl_();
    var bankRows = objects_(sheet_(ss, CFG.sheets.bank));
    var payments = objects_(sheet_(ss, CFG.sheets.payments));
    var usedBank = {};
    payments.forEach(function (p) { if (p[H.BANK_MOVE_ID]) usedBank[p[H.BANK_MOVE_ID]] = p[H.PAYMENT_ID]; });
    var out = bankRows.map(function (move) {
      var best = { score: 0, payment: null };
      payments.forEach(function (payment) {
        if (payment[H.BANK_MOVE_ID] && payment[H.BANK_MOVE_ID] !== move[H.BANK_MOVE_ID]) return;
        var scored = bankaHareketiPuanla_(move, payment);
        if (scored.score > best.score) best = { score: scored.score, payment: payment };
      });
      var warning = move[H.WARN] || "";
      if (usedBank[move[H.BANK_MOVE_ID]] && (!best.payment || usedBank[move[H.BANK_MOVE_ID]] !== best.payment[H.PAYMENT_ID])) warning = appendWarn_(warning, "Banka hareketi başka ödemeye bağlı");
      return copyByHeaders_(move, HEADERS.bank, {
        [H.MATCH_STATUS]: scoreStatus_(best.score),
        [H.MATCH_SCORE]: best.score,
        [H.SUGGESTED_OPEN_ID]: best.payment ? best.payment[H.OPEN_ID] : "",
        [H.SUGGESTED_PAYMENT_ID]: best.payment ? best.payment[H.PAYMENT_ID] : "",
        [H.SUGGESTED_PAYER]: best.payment ? best.payment[H.PAYER] : "",
        [H.WARN]: warning || (best.score >= 90 ? "Operatör onayı bekliyor" : "")
      });
    });
    writeObjects_(sheet_(ss, CFG.sheets.bank), HEADERS.bank, out);
    kontrolMerkeziniGuncelle_();
    return { ok: true, matchedRows: out.length };
  }

  function bankaHareketiPuanla_(move, payment) {
    if (!move || !payment) return { score: 0, note: "Eşleşme yok" };
    var score = 0;
    var notes = [];
    var amountDiff = Math.abs(normalizeTutar_(move[H.BANK_AMOUNT]) - normalizeTutar_(payment[H.PAYMENT_AMOUNT]));
    if (amountDiff <= 0.01) { score += 50; notes.push("tutar eşleşti"); } else { score -= 40; notes.push("tutar farklı"); }
    var sender = normalizeAscii_(move[H.BANK_SENDER] || move[H.BANK_DESC]);
    var payer = normalizeAscii_(payment[H.PAYER]);
    if (sender && payer && (sender.indexOf(payer) !== -1 || payer.indexOf(sender) !== -1 || nameSimilarity_(sender, payer) >= 0.7)) { score += 30; notes.push("isim benzer"); }
    else if (sender && payer) { score -= 30; notes.push("isim farklı"); }
    var d1 = operationDate_(normalizeTarih_(move[H.BANK_DATE]) || new Date(0));
    var d2 = operationDate_(normalizeTarih_(payment[H.PAYMENT_DATE]) || new Date(1));
    if (d1 && d1 === d2) { score += 15; notes.push("tarih aynı gün"); }
    var desc = normalizeAscii_(move[H.BANK_DESC]);
    if (desc && (desc.indexOf(normalizeAscii_(payment[H.OPEN_ID])) !== -1 || desc.indexOf(normalizeAscii_(payment[H.PAYMENT_ID])) !== -1 || desc.indexOf(normalizeAscii_(payment[H.PAYER])) !== -1)) { score += 20; notes.push("açıklama destekli"); }
    score = Math.max(0, Math.min(100, score));
    return { score: score, note: notes.join("; ") };
  }

  function bankaEslesmesiniOnayla_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var active = ss.getActiveRange && ss.getActiveRange();
    if (!active || active.getSheet().getName() !== CFG.sheets.bank || active.getRow() < 2) throw new Error("14_BANKA_HAREKETLERI içinde bir satır seçin.");
    var sh = active.getSheet();
    var h = headers_(sh);
    var row = sh.getRange(active.getRow(), 1, 1, sh.getLastColumn()).getValues()[0];
    if (!yes_(val_(row, h, H.OPERATOR_APPROVAL))) throw new Error("Operatör_Onayı Evet olmadan eşleşme kesinleşmez.");
    var paymentId = val_(row, h, H.SUGGESTED_PAYMENT_ID);
    var moveId = val_(row, h, H.BANK_MOVE_ID);
    if (!paymentId || !moveId) throw new Error("Önerilen ödeme veya banka hareket ID eksik.");
    patchRowsByKey_(sheet_(ss, CFG.sheets.payments), H.PAYMENT_ID, paymentId, {
      [H.BANK_MOVE_ID]: moveId,
      [H.BANK_MATCH_STATUS]: val_(row, h, H.MATCH_STATUS),
      [H.BANK_MATCH_SCORE]: val_(row, h, H.MATCH_SCORE),
      [H.BANK_MATCH_NOTE]: "Operatör onayı ile eşleşti",
      [H.OPERATOR_CONFIRM]: "Evet",
      [H.CONFIRM_STATUS]: "Teyit Edildi"
    });
    setCell_(sh, active.getRow(), h, H.MATCH_STATUS, "Onaylandı");
    hafifErpGuncelle_(val_(row, h, H.SUGGESTED_OPEN_ID));
    return { ok: true, paymentId: paymentId, bankMoveId: moveId };
  }

  function bankaEslesmeKontrolMerkeziniGuncelle_() {
    bankaHareketleriniEsle_();
    kontrolMerkeziniGuncelle_();
    return { ok: true };
  }

  function navlungoKargoPayloadHazirla_(acikSiparisId) {
    var cargo = objects_(sheet_(SpreadsheetApp.getActiveSpreadsheet(), CFG.sheets.cargo)).filter(function (r) { return r[H.OPEN_ID] === acikSiparisId; })[0];
    if (!cargo) throw new Error("Kargo paketi bulunamadı.");
    return {
      order_reference: acikSiparisId,
      recipient: {
        name: cargo[H.CARGO_RECEIVER],
        phone: cargo[H.CARGO_TEL],
        city: cargo[H.CITY],
        district: cargo[H.DISTRICT],
        address: cargo[H.ADDRESS]
      },
      cargo_company: cargo[H.CARGO_COMPANY],
      note: cargo[H.PACKAGE_NOTE] || ""
    };
  }

  function navlungoKargoTaslakTestEt_(acikSiparisId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var openId = acikSiparisId || (objects_(sheet_(ss, CFG.sheets.open))[0] || {})[H.OPEN_ID];
    return { ok: true, openId: openId, livePost: "Yapılmadı", payload: navlungoKargoPayloadHazirla_(openId) };
  }

  function navlungoKargoOlusturOnayli_(acikSiparisId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!yes_(setting_(ss, "NAVLUNGO_CANLI_GONDERIM", "Hayır"))) return navlungoKargoTaslakTestEt_(acikSiparisId);
    if (kontrolMerkezindeKritikBlokajVar_(ss)) throw new Error("Kontrol merkezi temiz değil; kargo gönderimi durdu.");
    return { ok: false, status: "Navlungo canlı API anahtarı tanımlı değil; payload hazırlandı", payload: navlungoKargoPayloadHazirla_(acikSiparisId) };
  }

  function navlungoAdresDegisikligiKontrolEt_(acikSiparisId) {
    var cargo = objects_(sheet_(SpreadsheetApp.getActiveSpreadsheet(), CFG.sheets.cargo)).filter(function (r) { return r[H.OPEN_ID] === acikSiparisId; })[0] || {};
    var needsReview = !!cargo[H.BARCODE] && !!cargo[H.ADDRESS];
    return { ok: true, openId: acikSiparisId, barkodVar: !!cargo[H.BARCODE], yenidenBasimKontrolu: needsReview ? "Gerekli" : "Gerekli değil" };
  }

  function faturaVeKargoOlustur_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    kontrolMerkeziniGuncelle_();
    if (kontrolMerkezindeKritikBlokajVar_(ss)) throw new Error("Kontrol merkezi temiz değil.");
    var invoice = { ok: true, livePost: "Yapılmadı" };
    if (yes_(setting_(ss, CFG.liveParasutSendSetting, "Hayır"))) invoice = parasutFaturaTaslakGonder_(null);
    var cargoResults = objects_(sheet_(ss, CFG.sheets.cargo)).map(function (row) { return navlungoKargoOlusturOnayli_(row[H.OPEN_ID]); });
    return { ok: true, invoice: invoice, cargo: cargoResults };
  }

  function parasutCanliTaslakTestHazirla_(groupId) {
    var payload = parasutTaslakPayloadTestEt_(groupId);
    return { ok: true, groupId: payload.groupId, livePost: "Yapılmadı", payload: payload.payload };
  }

  function parasutTekTaslakGonderOnayli_(groupId) {
    if (!groupId) throw new Error("Fatura_Grubu_ID zorunlu.");
    return parasutFaturaTaslakGonder_(groupId);
  }

  function parasutFaturaTaslakGonderOnayli_(faturaGrubuId) {
    if (!faturaGrubuId) throw new Error("Fatura_Grubu_ID zorunlu.");
    return parasutFaturaTaslakGonder_(faturaGrubuId);
  }

  function parseHizliUrunGirisi_(text) {
    var parts = String(text || "").split(/[+\n;]/).map(function (p) { return p.trim(); }).filter(Boolean);
    var out = [];
    parts.forEach(function (part) {
      var normalized = normalizeAscii_(part);
      var match = fuzzyUrunEsle_(part);
      if (!match.product || match.ambiguous) return;
      var numbers = normalized.match(/\d+(?:[.,]\d+)?/g) || [];
      var qty = 1;
      var unitGross = 0;
      var silverGram = "";
      if (productType_(match.product) === "Gümüş" && /\bgr|gram\b/.test(normalized) && numbers.length) {
        silverGram = normalizeTutar_(numbers[0]);
        qty = silverGram || 1;
        unitGross = normalizeTutar_(numbers[numbers.length - 1]);
      } else {
        if (numbers.length >= 2) { qty = normalizeTutar_(numbers[0]) || 1; unitGross = normalizeTutar_(numbers[numbers.length - 1]); }
        else if (numbers.length === 1) { unitGross = normalizeTutar_(numbers[0]); }
      }
      out.push({ product: match.product, qty: qty, unitGross: unitGross, silverGram: silverGram, silverAmountType: silverGram ? "Birim" : "" });
    });
    return out;
  }

  function parseHizliOdemeGirisi_(text) {
    var parts = String(text || "").split(/[+\n;]/).map(function (p) { return p.trim(); }).filter(Boolean);
    var out = [];
    parts.forEach(function (part) {
      var amountMatches = part.match(/\d+(?:[.,]\d+)?/g) || [];
      if (!amountMatches.length) return;
      var amountToken = amountMatches[amountMatches.length - 1];
      var amount = normalizeTutar_(amountToken);
      var payer = normalizePersonName_(part.replace(amountToken, "").replace(/ödeme yapan|tutar|tl|ziraat|garanti|akbank|iş bankası|yapı kredi/gi, " "));
      var source = /dekont/i.test(part) ? "Dekont" : (/whatsapp/i.test(part) ? "WhatsApp" : (/ziraat|garanti|akbank|iş bankası|yapı kredi/i.test(part) ? "Banka açıklaması" : "Manuel"));
      if (payer && amount) out.push({ payer: payer, amount: amount, source: source });
    });
    return out;
  }

  function parseHizliKargoGirisi_(text) {
    var raw = String(text || "").trim();
    var phone = normalizePhone_((raw.match(/(?:tel|telefon)?\s*(0?5\d{9}|\+?90\d{10})/i) || [])[1] || "");
    var receiver = ((raw.match(/(?:alıcı|alici|kargo alıcısı|kargo alicisi)\s*[:-]?\s*([^,;\n]+)/i) || [])[1] || "").trim();
    var city = ((raw.match(/\b(istanbul|ankara|izmir|bursa|antalya|konya|adana|mersin|kocaeli|muğla|mugla)\b/i) || [])[1] || "").trim();
    var district = ((raw.match(/(?:ilçe|ilce)\s*[:-]?\s*([^,;\n]+)/i) || [])[1] || "").trim();
    var address = raw.replace(/alıcı|alici|tel|telefon|adres|kargo/gi, " ").replace(/\s+/g, " ").trim();
    var warning = (!receiver || !phone || !address) ? "Kargo bilgisi kısmi; Kargo bilgisi gir panelinden kontrol edin" : "";
    return { receiver: normalizePersonName_(receiver), phone: phone, city: city, district: district, address: address, warning: warning };
  }

  function fuzzyUrunEsle_(input) {
    var key = normalizeAscii_(input).replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    var aliases = [
      { product: "Tesbih", terms: ["tesbih", "tesbihh", "tespih", "tes"] },
      { product: "Gümüş İşçilik", terms: ["gumus iscilik", "gumus isciligi", "iscilik"] },
      { product: "Gümüş", terms: ["gumus"] },
      { product: "Pirinç Püskül", terms: ["pirinc puskul", "puskul"] },
      { product: "Tesbih Kutusu", terms: ["tesbih kutusu", "kutu"] },
      { product: "Kargo Hizmet Bedeli", terms: ["kargo hizmet", "kargo bedeli", "kargo"] }
    ];
    var hits = [];
    aliases.forEach(function (row) { row.terms.forEach(function (term) { if (key === term) hits.push(row.product); }); });
    if (!hits.length) aliases.forEach(function (row) { row.terms.forEach(function (term) { if (key.indexOf(term) !== -1) hits.push(row.product); }); });
    hits = hits.filter(function (v, i, a) { return a.indexOf(v) === i; });
    if (!hits.length) return { product: "", ambiguous: false };
    if (hits.length > 1) {
      if (hits.indexOf("Gümüş İşçilik") !== -1 && hits.indexOf("Gümüş") !== -1) return { product: "Gümüş İşçilik", ambiguous: false };
      if (hits.indexOf("Tesbih Kutusu") !== -1 && hits.indexOf("Tesbih") !== -1) return { product: "Tesbih Kutusu", ambiguous: false };
      if (hits.indexOf("Kargo Hizmet Bedeli") !== -1) return { product: "Kargo Hizmet Bedeli", ambiguous: false };
      return { product: "", ambiguous: true };
    }
    return { product: hits[0], ambiguous: false };
  }

  function normalizeUrunAdi_(input) {
    var hit = fuzzyUrunEsle_(input);
    return hit && !hit.ambiguous ? hit.product : "";
  }

  function getUrunConfig_(urunAdi) {
    var name = normalizeUrunAdi_(urunAdi);
    var configs = {
      "Tesbih": { name: "Tesbih", type: "Tesbih", unit: "Adet", vatRate: CFG.defaultVatRate },
      "Pirinç Püskül": { name: "Pirinç Püskül", type: "Püskül", unit: "Adet", vatRate: CFG.defaultVatRate },
      "Gümüş": { name: "Gümüş", type: "Gümüş", unit: "Gram", vatRate: CFG.defaultVatRate },
      "Gümüş İşçilik": { name: "Gümüş İşçilik", type: "Gümüş", unit: "Adet", vatRate: CFG.defaultVatRate },
      "Tesbih Kutusu": { name: "Tesbih Kutusu", type: "Kutu", unit: "Adet", vatRate: CFG.defaultVatRate },
      "Kargo Hizmet Bedeli": { name: "Kargo Hizmet Bedeli", type: "Kargo", unit: "Adet", vatRate: CFG.defaultVatRate }
    };
    return configs[name] || null;
  }

  function productOptions_() {
    return ["Tesbih", "Pirinç Püskül", "Gümüş", "Gümüş İşçilik", "Tesbih Kutusu", "Kargo Hizmet Bedeli"].map(function (name) {
      var cfg = getUrunConfig_(name);
      return { name: name, unit: cfg.unit, vatRate: cfg.vatRate, productId: urunIdBul_(name) };
    });
  }

  function hesaplaKdv_(kdvDahil, oran) {
    var gross = num_(kdvDahil);
    var rate = normalizeVatRate_(oran);
    var net = round2_(gross / (1 + rate));
    return { gross: gross, net: net, vat: round2_(gross - net), rate: rate };
  }

  function urunIdBul_(urunAdi) {
    var name = normalizeUrunAdi_(urunAdi);
    if (!name) return "";
    return productIdFromMap_(productIdMap_(SpreadsheetApp.getActiveSpreadsheet(), false), name);
  }

  function zorunluAlanKontrolEt_(obj, fields) {
    var missing = [];
    (fields || []).forEach(function (field) {
      if (obj[field] === "" || obj[field] === null || obj[field] === undefined) missing.push(field);
    });
    return missing;
  }

  function parseProductsFromMessage_(message) {
    return parseHizliUrunGirisi_(message);
  }

  function openOrderOptions_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var options = [];
    var seen = {};
    objects_(sheet_(ss, CFG.sheets.queue)).forEach(function (row) {
      var id = row[H.OPEN_ID];
      if (!id || seen[id]) return;
      seen[id] = true;
      options.push({ id: id, label: id + " | " + (row[H.OWNER] || "") + " | " + (row[H.PHONE] || "") });
    });
    objects_(sheet_(ss, CFG.sheets.open)).forEach(function (row) {
      var id = row[H.OPEN_ID];
      if (!id || seen[id]) return;
      seen[id] = true;
      options.push({ id: id, label: id + " | " + (row[H.OWNER] || "") + " | " + (row[H.PHONE] || "") });
    });
    return options;
  }

  function findOpenOrderForPhone_(ss, phone) {
    var normalized = normalizePhone_(phone || "");
    var rows = objects_(sheet_(ss, CFG.sheets.open)).filter(function (row) {
      return normalizePhone_(row[H.PHONE]) === normalized && !isClosedText_(row[H.ORDER_STATUS]);
    });
    return rows.length ? { id: rows[rows.length - 1][H.OPEN_ID], owner: rows[rows.length - 1][H.OWNER] || "", status: rows[rows.length - 1][H.ORDER_STATUS] || "" } : null;
  }

  function ilgiliSiparisSatirlariniBul_(acikSiparisId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var openId = acikSiparisId || "";
    return {
      queue: objects_(sheet_(ss, CFG.sheets.queue)).filter(function (r) { return r[H.OPEN_ID] === openId; }),
      open: objects_(sheet_(ss, CFG.sheets.open)).filter(function (r) { return r[H.OPEN_ID] === openId; }),
      items: objects_(sheet_(ss, CFG.sheets.items)).filter(function (r) { return r[H.OPEN_ID] === openId; }),
      payments: objects_(sheet_(ss, CFG.sheets.payments)).filter(function (r) { return r[H.OPEN_ID] === openId; }),
      invoiceGroups: objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (r) { return r[H.OPEN_ID] === openId; }),
      cargo: objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (r) { return r[H.OPEN_ID] === openId; })
    };
  }

  function batchWriteRows_(writePlan) {
    (writePlan || []).forEach(function (job) {
      if (job && job.sheet && job.headers && job.rows) writeObjects_(job.sheet, job.headers, job.rows);
    });
    return { ok: true, writes: (writePlan || []).length };
  }

  function cacheAyarlariniOku_() { return settingsMap_(SpreadsheetApp.getActiveSpreadsheet()); }
  function cacheParasutProductMap_() { return productIdMap_(SpreadsheetApp.getActiveSpreadsheet(), false); }
  function cacheMusteriHafiza_() { return indexBy_(objects_(sheet_(SpreadsheetApp.getActiveSpreadsheet(), CFG.sheets.memory)), H.PHONE); }

  function normalizeUltraForm_(form) {
    form = form || {};
    form.whatsAppTel = normalizePhone_(form.whatsAppTel || "");
    form.siparisSahibi = normalizePersonName_(form.siparisSahibi || "");
    form.hamWhatsappMesajiNormalized = normalizeMessageText_(form.hamWhatsappMesaji || "");
    if (form.kargo) {
      form.kargo.kargoAlicisi = normalizePersonName_(form.kargo.kargoAlicisi || form.kargo.receiver || "");
      form.kargo.kargoTel = normalizePhone_(form.kargo.kargoTel || form.kargo.phone || form.whatsAppTel || "");
      form.kargo.il = normalizeCity_(form.kargo.il || form.kargo.city || "");
      form.kargo.ilce = normalizeCity_(form.kargo.ilce || form.kargo.district || "");
      form.kargo.adres = normalizeAddress_(form.kargo.adres || form.kargo.address || "");
      form.kargo.kargoFirmasi = normalizeCargoCompany_(form.kargo.kargoFirmasi || form.kargo.company || CFG.defaultCargoCompany);
    }
    (form.odemeler || []).forEach(function (p) {
      p.odemeYapan = normalizePersonName_(p.odemeYapan || p.payer || "");
      p.odemeYapanTel = normalizePhone_(p.odemeYapanTel || p.payerTel || "");
      p.odemeYapanTcknVkn = normalizeTaxNo_(p.odemeYapanTcknVkn || p.payerTaxNo || "");
      p.odemeYapanAdres = normalizeAddress_(p.odemeYapanAdres || p.payerAddress || "");
      p.odemeYapanIl = normalizeCity_(p.odemeYapanIl || p.payerCity || "");
      p.odemeYapanIlce = normalizeCity_(p.odemeYapanIlce || p.payerDistrict || "");
      p.faturaCariBaglantiId = p.faturaCariBaglantiId || "";
    });
    (form.urunler || []).forEach(function (it) {
      it.urunAdi = normalizeUrunAdi_(it.urunAdi || it.product || "");
      it.odemeYapan = normalizePersonName_(it.odemeYapan || it.payer || "");
      it.faturaCariBaglantiId = it.faturaCariBaglantiId || "";
    });
    return form;
  }

  function normalizeMessageText_(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
  }

  function normalizeCity_(value) {
    var s = String(value || "").trim().replace(/\s+/g, " ");
    if (!s) return "";
    return s.split(" ").map(function (part) {
      return part.charAt(0).toLocaleUpperCase("tr-TR") + part.slice(1).toLocaleLowerCase("tr-TR");
    }).join(" ");
  }

  function normalizeCargoCompany_(value) {
    var key = normalizeAscii_(value);
    if (key.indexOf("yurtici") !== -1) return "Yurtiçi Kargo";
    if (key.indexOf("mng") !== -1) return "MNG Kargo";
    if (key.indexOf("surat") !== -1) return "Sürat Kargo";
    if (key.indexOf("aras") !== -1) return "Aras Kargo";
    return value ? normalizeCity_(value) : CFG.defaultCargoCompany;
  }

  function invoiceCariLinkId_(openId, payer) {
    return invoiceGroupId_(openId, payer);
  }

  function ebelgeTipiBelirle_(taxNo, cariType) {
    var d = normalizeTaxNo_(taxNo);
    if (cariType === "Tüzel Kişi") return d.length === 10 ? "e-Fatura Kontrol Gerekli" : "VKN Eksik";
    if (!d || d === CFG.defaultTckn) return "e-Arşiv";
    return "e-Belge Mükellef Kontrol Gerekli";
  }

  function calculateSilverMarginFromNumbers_(gram, costUnit, gross) {
    var cost = round2_(num_(gram) * num_(costUnit));
    var margin = round2_(num_(gross) - cost);
    return cost ? margin : "";
  }

  function calculateSilverMargin_(row, h, gross) {
    return calculateSilverMarginFromNumbers_(val_(row, h, H.SILVER_GRAM), val_(row, h, H.SILVER_COST_UNIT), gross);
  }

  function appendObject_(sh, headers, obj) {
    ensureSheet_(SpreadsheetApp.getActiveSpreadsheet(), sh.getName(), headers);
    var h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var row = h.map(function (name) { return obj[name] !== undefined ? obj[name] : ""; });
    sh.getRange(sh.getLastRow() + 1, 1, 1, h.length).setValues([row]);
  }

  function upsertObjectByKey_(sh, headers, keyName, keyValue, obj) {
    ensureSheet_(SpreadsheetApp.getActiveSpreadsheet(), sh.getName(), headers);
    var rowNum = findRowByKey_(sh, keyName, keyValue);
    if (!rowNum) {
      appendObject_(sh, headers, obj);
      return;
    }
    var h = headers_(sh);
    Object.keys(obj).forEach(function (name) {
      if (h[name] !== undefined) sh.getRange(rowNum, h[name] + 1).setValue(obj[name]);
    });
  }

  function findRowByKey_(sh, keyName, keyValue) {
    if (!sh || sh.getLastRow() < 2) return 0;
    var h = headers_(sh);
    if (h[keyName] === undefined) return 0;
    var values = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
    for (var i = 0; i < values.length; i++) {
      if (values[i][h[keyName]] === keyValue) return i + 2;
    }
    return 0;
  }

  function rowOpenId_(sh, rowNum) {
    var h = headers_(sh);
    if (h[H.OPEN_ID] === undefined) return "";
    return sh.getRange(rowNum, h[H.OPEN_ID] + 1).getValue();
  }

  function findQueueIdForOpenId_(ss, openId) {
    if (!openId) return "";
    var rows = objects_(sheet_(ss, CFG.sheets.queue));
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][H.OPEN_ID] === openId) return rows[i][H.Q_ID] || "";
    }
    return "";
  }

  function openSummaryById_(ss, openId) {
    var rows = objects_(sheet_(ss, CFG.sheets.queue));
    for (var i = rows.length - 1; i >= 0; i--) {
      if (rows[i][H.OPEN_ID] === openId) return { owner: rows[i][H.OWNER] || "", phone: rows[i][H.PHONE] || "" };
    }
    return { owner: "", phone: "" };
  }

  function nextItemSeq_(ss, openId, currentRowNum) {
    var max = 0;
    objects_(sheet_(ss, CFG.sheets.items)).forEach(function (row, idx) {
      if (idx + 2 === currentRowNum) return;
      if (row[H.OPEN_ID] === openId) max = Math.max(max, num_(row[H.SEQ]));
    });
    return max + 1;
  }

  function val_(row, h, name) { return h[name] !== undefined ? row[h[name]] : ""; }
  function setIf_(row, h, name, value) { if (h[name] !== undefined) row[h[name]] = value === undefined || value === null ? "" : value; }
  function setCell_(sh, row, h, name, value) { if (h[name] !== undefined) sh.getRange(row, h[name] + 1).setValue(value); }

  function queueRowHasData_(row, h) {
    return !!(val_(row, h, H.PHONE) || val_(row, h, H.OWNER) || val_(row, h, H.RAW) || val_(row, h, H.OPEN_ID));
  }

  function isLateApproved_(row, h) {
    var s = normalizeAscii_(val_(row, h, H.ROW_STATUS) + " " + val_(row, h, H.NOTE));
    return s.indexOf("gec ekleme") !== -1 || s.indexOf("gec_ekleme") !== -1;
  }

  function isClosedRow_(row, h) {
    return isClosedText_(val_(row, h, H.ORDER_STATUS));
  }

  function isClosedText_(v) {
    var s = normalizeAscii_(v);
    return s.indexOf("kapali") !== -1 || s.indexOf("kapandi") !== -1 || s.indexOf("tamam") !== -1;
  }

  function num_(v) {
    if (typeof v === "number") return v;
    if (v instanceof Date) return 0;
    var s = String(v || "").trim();
    if (!s) return 0;
    s = s.replace(/[\s₺]/g, "").replace(/\./g, "").replace(",", ".");
    var n = Number(s);
    return isNaN(n) ? 0 : n;
  }

  function sum_(rows, key) {
    return round2_((rows || []).reduce(function (s, r) { return s + num_(r[key]); }, 0));
  }

  function round2_(n) { return Math.round(Number(n || 0) * 100) / 100; }
  function round6_(n) { return Math.round(Number(n || 0) * 1000000) / 1000000; }
  function trim_(v) { return String(v || "").trim(); }

  function safeKey_(v) {
    return normalizeAscii_(v).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").toUpperCase() || "BOS";
  }

  function normalizeAscii_(v) {
    var s = String(v || "").toLocaleLowerCase("tr-TR");
    if (s.normalize) s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return s
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i")
      .replace(/ö/g, "o").replace(/ç/g, "c").replace(/İ/g, "i");
  }

  function normalizeTutar_(input) { return num_(input); }
  function normalizeTarih_(input) { return toDate_(input); }
  function normalizeTelefon_(input) { return normalizePhone_(input); }

  function normalizeSilverAmountType_(input) {
    var s = normalizeAscii_(input).trim();
    if (!s) return "";
    if (/^\d/.test(s)) return "";
    if (s === "birim") return "Birim";
    if (s === "toplam") return "Toplam";
    return "";
  }

  function scoreStatus_(score) {
    if (score >= 90) return "Güçlü eşleşme";
    if (score >= 70) return "Kontrol gerekli";
    if (score >= 50) return "Zayıf eşleşme";
    return "Eşleşme yok";
  }

  function nameSimilarity_(a, b) {
    var aa = normalizeAscii_(a).split(/\s+/).filter(Boolean);
    var bb = normalizeAscii_(b).split(/\s+/).filter(Boolean);
    if (!aa.length || !bb.length) return 0;
    var hit = 0;
    aa.forEach(function (x) { if (bb.indexOf(x) !== -1) hit++; });
    return hit / Math.max(aa.length, bb.length);
  }

  function mergeObjects_(base, patch) {
    var out = {};
    Object.keys(base || {}).forEach(function (k) { out[k] = base[k]; });
    Object.keys(patch || {}).forEach(function (k) { out[k] = patch[k]; });
    return out;
  }

  function appendWarn_(a, b) { return a ? a + " | " + b : b; }

  function parseJsonArray_(raw) {
    try {
      var parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function normalizePersonName_(v) {
    return String(v || "").trim().replace(/\s+/g, " ").split(" ").filter(Boolean).map(function (part) {
      return part.charAt(0).toLocaleUpperCase("tr-TR") + part.slice(1).toLocaleLowerCase("tr-TR");
    }).join(" ");
  }
  function normalizeAddress_(v) { return String(v || "").trim().replace(/\s+/g, " "); }
  function normalizeTaxNo_(v) { return String(v || "").replace(/\D/g, ""); }

  function normalizePhone_(v) {
    var d = String(v || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.length === 10 && d.charAt(0) === "5") return "+90" + d;
    if (d.length === 11 && d.charAt(0) === "0") return "+90" + d.slice(1);
    if (d.length === 12 && d.indexOf("90") === 0) return "+" + d;
    return d.charAt(0) === "+" ? d : "+" + d;
  }

  function normalizeCariTipi_(value, tax, name) {
    var s = normalizeAscii_(value);
    var d = normalizeTaxNo_(tax);
    if (s.indexOf("tuzel") !== -1 || s.indexOf("sirket") !== -1 || d.length === 10 || looksCompany_(name)) return "Tüzel Kişi";
    return "Gerçek Kişi";
  }

  function looksCompany_(name) {
    var s = normalizeAscii_(name);
    return ["ltd", "limited", "anonim", "sanayi", "ticaret", " as", "a s", "sti", "sirket"].some(function (x) {
      return s.indexOf(x) !== -1;
    });
  }

  function yes_(v) {
    var s = normalizeAscii_(v);
    return ["evet", "e", "yes", "true", "1", "onaylandi", "teyit edildi"].indexOf(s) !== -1;
  }

  function toDate_(v) {
    if (v instanceof Date && !isNaN(v.getTime())) return v;
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  function operationDate_(date) { return formatDate_(date, "yyyy-MM-dd"); }
  function ymd_(date) { return formatDate_(date, "yyyyMMdd"); }
  function todayIso_() { return formatDate_(new Date(), "yyyy-MM-dd"); }
  function formatDate_(date, pattern) { return Utilities.formatDate(date, Session.getScriptTimeZone(), pattern); }
  function pad_(n, width) { return String(n).padStart(width, "0"); }
  function nextSeq_(map, key) { map[key] = (map[key] || 0) + 1; return map[key]; }

  function isBeforeCutoff_(date, cutoffText) {
    var d = toDate_(date) || new Date();
    var m = String(cutoffText || CFG.cutoff).match(/(\d{1,2})[:.](\d{2})/);
    var h = m ? Number(m[1]) : 16;
    var min = m ? Number(m[2]) : 0;
    var cutoff = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, min, 0);
    return d.getTime() < cutoff.getTime();
  }

  function normalizeVatRate_(raw) {
    if (raw !== "" && raw !== null && raw !== undefined) {
      var n = num_(raw);
      return n > 1 ? n / 100 : n;
    }
    return CFG.defaultVatRate;
  }

  function defaultUnit_(product) { return productType_(product) === "Gümüş" ? "Gram" : "Adet"; }

  function productType_(product) {
    var p = normalizeAscii_(product);
    if (p.indexOf("gumus") !== -1) return "Gümüş";
    if (p.indexOf("kargo") !== -1) return "Kargo";
    if (p.indexOf("kutu") !== -1) return "Kutu";
    if (p.indexOf("puskul") !== -1) return "Püskül";
    return "Tesbih";
  }

  function invoiceGroupId_(openId, payer) { return "FG-" + openId + "-" + safeKey_(payer); }

  function groupBy_(rows, key) {
    var out = {};
    (rows || []).forEach(function (row) {
      var id = row[key] || "";
      if (!id) return;
      if (!out[id]) out[id] = [];
      out[id].push(row);
    });
    return out;
  }

  function indexBy_(rows, key) {
    var out = {};
    (rows || []).forEach(function (row) { if (row[key]) out[row[key]] = row; });
    return out;
  }

  function firstDate_(rows, key) {
    var dates = (rows || []).map(function (r) { return toDate_(r[key]); }).filter(Boolean).sort(function (a, b) { return a - b; });
    return dates[0] || "";
  }

  function lastDate_(rows, key) {
    var dates = (rows || []).map(function (r) { return toDate_(r[key]); }).filter(Boolean).sort(function (a, b) { return a - b; });
    return dates[dates.length - 1] || "";
  }

  return {
    onOpen: onOpen_,
    onEdit: onEdit_,
    sistemKolonlariniHazirla: sistemKolonlariniHazirla_,
    sistemiYenile: sistemiYenile_,
    sistemiCanliyaHazirla: sistemiCanliyaHazirla_,
    satirlariNormalizeEt: satirlariNormalizeEt_,
    acikSiparisleriGrupla: acikSiparisleriGrupla_,
    urunKalemleriniKontrolEt: urunKalemleriniKontrolEt_,
    odemeleriKontrolEt: odemeleriKontrolEt_,
    faturaGruplariniOlustur: faturaGruplariniOlustur_,
    parasutTaslaklariniHazirla: parasutTaslaklariniHazirla_,
    kargoPaketleriniOlustur: kargoPaketleriniOlustur_,
    finans808OnizlemeOlustur: finans808OnizlemeOlustur_,
    ebelgeIstisnaHazirla: ebelgeIstisnaHazirla_,
    kontrolMerkeziniGuncelle: kontrolMerkeziniGuncelle_,
    parasutApiBaglantiTestiTam: parasutApiBaglantiTestiTam_,
    parasutUrunKartlariniKontrolEt: parasutUrunKartlariniKontrolEt_,
    parasutUrunIdMapOku: parasutUrunIdMapOku_,
    parasutUrunGetir: parasutUrunGetir_,
    parasutCariHazirla: parasutCariHazirla_,
    parasutCariAdaylariniGetir: parasutCariAdaylariniGetir_,
    parasutCariOlusturVeyaBagla: parasutCariOlusturVeyaBagla_,
    parasutCariBul: parasutCariBul_,
    parasutCariOlustur: parasutCariOlustur_,
    parasutCariGuncelle: parasutCariGuncelle_,
    parasutFaturaTaslakGonder: parasutFaturaTaslakGonder_,
    parasutTaslakPayloadTestEt: parasutTaslakPayloadTestEt_,
    parasutTokenGecerliMi: parasutTokenGecerliMi_,
    parasutAccessTokenAl: parasutAccessTokenAl_,
    parasutTokenYenile: parasutTokenYenile_,
    parasutApiFetch: parasutApiFetch_,
    gecEklemeIstisnaIslemi: gecEklemeIstisnaIslemi_,
    hizliSiparisOlustur: hizliSiparisOlustur_,
    ultraSiparisPaneli: ultraSiparisPaneli_,
    topluSiparisPaneli: topluSiparisPaneli_,
    kaydetVeErpGuncelle: kaydetVeErpGuncelle_,
    kontrolMerkezi: kontrolMerkezi_,
    ultraSiparisKaydet: ultraSiparisKaydet_,
    ultraSiparisKontrolEt: ultraSiparisKontrolEt_,
    kaydetUltraSiparisHizli: kaydetUltraSiparisHizli_,
    topluUltraSiparisKaydet: topluUltraSiparisKaydet_,
    getUltraPanelHazirlik: getUltraPanelHazirlik_,
    cariSecDialog: cariSecDialog_,
    cariSecimKaydet: cariSecimKaydet_,
    urunEkle: urunEkle_,
    odemeEkle: odemeEkle_,
    kargoBilgisiGir: kargoBilgisiGir_,
    getDialogData: getDialogData_,
    urunEkleKaydet: urunEkleKaydet_,
    odemeEkleKaydet: odemeEkleKaydet_,
    kargoBilgisiKaydet: kargoBilgisiKaydet_,
    hafifErpGuncelle: hafifErpGuncelle_,
    normalizeUrunAdi: normalizeUrunAdi_,
    getUrunConfig: getUrunConfig_,
    hesaplaKdv: hesaplaKdv_,
    urunIdBul: urunIdBul_,
    zorunluAlanKontrolEt: zorunluAlanKontrolEt_,
    parseHizliUrunGirisi: parseHizliUrunGirisi_,
    parseHizliOdemeGirisi: parseHizliOdemeGirisi_,
    parseHizliKargoGirisi: parseHizliKargoGirisi_,
    fuzzyUrunEsle: fuzzyUrunEsle_,
    normalizeTelefon: normalizeTelefon_,
    normalizeTutar: normalizeTutar_,
    normalizeTarih: normalizeTarih_,
    otomatikGorunumuDuzenle: otomatikGorunumuDuzenle_,
    bankaHareketleriniIceriAl: bankaHareketleriniIceriAl_,
    bankaHareketleriniEsle: bankaHareketleriniEsle_,
    bankaHareketiPuanla: bankaHareketiPuanla_,
    bankaEslesmesiniOnayla: bankaEslesmesiniOnayla_,
    bankaEslesmeKontrolMerkeziniGuncelle: bankaEslesmeKontrolMerkeziniGuncelle_,
    parasutCanliTaslakTestHazirla: parasutCanliTaslakTestHazirla_,
    parasutTekTaslakGonderOnayli: parasutTekTaslakGonderOnayli_,
    parasutFaturaTaslakGonderOnayli: parasutFaturaTaslakGonderOnayli_,
    navlungoKargoPayloadHazirla: navlungoKargoPayloadHazirla_,
    navlungoKargoTaslakTestEt: navlungoKargoTaslakTestEt_,
    navlungoKargoOlusturOnayli: navlungoKargoOlusturOnayli_,
    navlungoAdresDegisikligiKontrolEt: navlungoAdresDegisikligiKontrolEt_,
    faturaVeKargoOlustur: faturaVeKargoOlustur_,
    ilgiliSiparisSatirlariniBul: ilgiliSiparisSatirlariniBul_,
    batchWriteRows: batchWriteRows_,
    cacheAyarlariniOku: cacheAyarlariniOku_,
    cacheParasutProductMap: cacheParasutProductMap_,
    cacheMusteriHafiza: cacheMusteriHafiza_,
    HEADERS: HEADERS,
    H: H,
    CFG: CFG
  };
})();

function onOpen() { return TK6.onOpen(); }
function onEdit(e) { return TK6.onEdit(e); }
function sistemKolonlariniHazirla() { return TK6.sistemKolonlariniHazirla(); }
function sistemiYenile() { return TK6.sistemiYenile(); }
function sistemiCanliyaHazirla() { return TK6.sistemiCanliyaHazirla(); }
function satirlariNormalizeEt() { return TK6.satirlariNormalizeEt(); }
function acikSiparisleriGrupla() { return TK6.acikSiparisleriGrupla(); }
function urunKalemleriniKontrolEt() { return TK6.urunKalemleriniKontrolEt(); }
function odemeleriKontrolEt() { return TK6.odemeleriKontrolEt(); }
function faturaGruplariniOlustur() { return TK6.faturaGruplariniOlustur(); }
function parasutTaslaklariniHazirla() { return TK6.parasutTaslaklariniHazirla(); }
function kargoPaketleriniOlustur() { return TK6.kargoPaketleriniOlustur(); }
function finans808OnizlemeOlustur() { return TK6.finans808OnizlemeOlustur(); }
function ebelgeIstisnaHazirla() { return TK6.ebelgeIstisnaHazirla(); }
function kontrolMerkeziniGuncelle() { return TK6.kontrolMerkeziniGuncelle(); }
function parasutApiBaglantiTestiTam() { return TK6.parasutApiBaglantiTestiTam(); }
function parasutUrunKartlariniKontrolEt() { return TK6.parasutUrunKartlariniKontrolEt(); }
function parasutUrunIdMapOku() { return TK6.parasutUrunIdMapOku(); }
function parasutUrunGetir(productId) { return TK6.parasutUrunGetir(productId); }
function parasutCariHazirla() { return TK6.parasutCariHazirla(); }
function parasutCariAdaylariniGetir(faturaBilgisi) { return TK6.parasutCariAdaylariniGetir(faturaBilgisi); }
function parasutCariOlusturVeyaBagla(faturaGrubuId, secim) { return TK6.parasutCariOlusturVeyaBagla(faturaGrubuId, secim); }
function parasutCariBul(criteria) { return TK6.parasutCariBul(criteria); }
function parasutCariOlustur(criteria) { return TK6.parasutCariOlustur(criteria); }
function parasutCariGuncelle(contactId, criteria) { return TK6.parasutCariGuncelle(contactId, criteria); }
function parasutFaturaTaslakGonder(groupId) { return TK6.parasutFaturaTaslakGonder(groupId); }
function parasutTaslakPayloadTestEt(groupId) { return TK6.parasutTaslakPayloadTestEt(groupId); }
function parasutTokenGecerliMi() { return TK6.parasutTokenGecerliMi(); }
function parasutAccessTokenAl() { return TK6.parasutAccessTokenAl(); }
function parasutTokenYenile() { return TK6.parasutTokenYenile(); }
function parasutApiFetch(method, endpoint, payload) { return TK6.parasutApiFetch(method, endpoint, payload); }
function gecEklemeIstisnaIslemi() { return TK6.gecEklemeIstisnaIslemi(); }
function hizliSiparisOlustur() { return TK6.hizliSiparisOlustur(); }
function ultraSiparisPaneli() { return TK6.ultraSiparisPaneli(); }
function topluSiparisPaneli() { return TK6.topluSiparisPaneli(); }
function kaydetVeErpGuncelle() { return TK6.kaydetVeErpGuncelle(); }
function kontrolMerkezi() { return TK6.kontrolMerkezi(); }
function ultraSiparisKaydet(form) { return TK6.ultraSiparisKaydet(form); }
function ultraSiparisKontrolEt(form) { return TK6.ultraSiparisKontrolEt(form); }
function kaydetUltraSiparisHizli(payload) { return TK6.kaydetUltraSiparisHizli(payload); }
function topluUltraSiparisKaydet(payloadList) { return TK6.topluUltraSiparisKaydet(payloadList); }
function getUltraPanelHazirlik(phone) { return TK6.getUltraPanelHazirlik(phone); }
function cariSecDialog() { return TK6.cariSecDialog(); }
function cariSecimKaydet(form) { return TK6.cariSecimKaydet(form); }
function urunEkle() { return TK6.urunEkle(); }
function odemeEkle() { return TK6.odemeEkle(); }
function kargoBilgisiGir() { return TK6.kargoBilgisiGir(); }
function getDialogData() { return TK6.getDialogData(); }
function urunEkleKaydet(form) { return TK6.urunEkleKaydet(form); }
function odemeEkleKaydet(form) { return TK6.odemeEkleKaydet(form); }
function kargoBilgisiKaydet(form) { return TK6.kargoBilgisiKaydet(form); }
function hafifErpGuncelle(acikSiparisId) { return TK6.hafifErpGuncelle(acikSiparisId); }
function normalizeUrunAdi(input) { return TK6.normalizeUrunAdi(input); }
function getUrunConfig(urunAdi) { return TK6.getUrunConfig(urunAdi); }
function hesaplaKdv(kdvDahil, oran) { return TK6.hesaplaKdv(kdvDahil, oran); }
function urunIdBul(urunAdi) { return TK6.urunIdBul(urunAdi); }
function zorunluAlanKontrolEt(obj, fields) { return TK6.zorunluAlanKontrolEt(obj, fields); }
function parseHizliUrunGirisi(text) { return TK6.parseHizliUrunGirisi(text); }
function parseHizliOdemeGirisi(text) { return TK6.parseHizliOdemeGirisi(text); }
function parseHizliKargoGirisi(text) { return TK6.parseHizliKargoGirisi(text); }
function fuzzyUrunEsle(input) { return TK6.fuzzyUrunEsle(input); }
function normalizeTelefon(input) { return TK6.normalizeTelefon(input); }
function normalizeTutar(input) { return TK6.normalizeTutar(input); }
function normalizeTarih(input) { return TK6.normalizeTarih(input); }
function otomatikGorunumuDuzenle() { return TK6.otomatikGorunumuDuzenle(); }
function bankaHareketleriniIceriAl() { return TK6.bankaHareketleriniIceriAl(); }
function bankaHareketleriniEsle() { return TK6.bankaHareketleriniEsle(); }
function bankaHareketiPuanla(move, payment) { return TK6.bankaHareketiPuanla(move, payment); }
function bankaEslesmesiniOnayla() { return TK6.bankaEslesmesiniOnayla(); }
function bankaEslesmeKontrolMerkeziniGuncelle() { return TK6.bankaEslesmeKontrolMerkeziniGuncelle(); }
function parasutCanliTaslakTestHazirla(groupId) { return TK6.parasutCanliTaslakTestHazirla(groupId); }
function parasutTekTaslakGonderOnayli(groupId) { return TK6.parasutTekTaslakGonderOnayli(groupId); }
function parasutFaturaTaslakGonderOnayli(groupId) { return TK6.parasutFaturaTaslakGonderOnayli(groupId); }
function navlungoKargoPayloadHazirla(acikSiparisId) { return TK6.navlungoKargoPayloadHazirla(acikSiparisId); }
function navlungoKargoTaslakTestEt(acikSiparisId) { return TK6.navlungoKargoTaslakTestEt(acikSiparisId); }
function navlungoKargoOlusturOnayli(acikSiparisId) { return TK6.navlungoKargoOlusturOnayli(acikSiparisId); }
function navlungoAdresDegisikligiKontrolEt(acikSiparisId) { return TK6.navlungoAdresDegisikligiKontrolEt(acikSiparisId); }
function faturaVeKargoOlustur() { return TK6.faturaVeKargoOlustur(); }
function ilgiliSiparisSatirlariniBul(acikSiparisId) { return TK6.ilgiliSiparisSatirlariniBul(acikSiparisId); }
function batchWriteRows(writePlan) { return TK6.batchWriteRows(writePlan); }
function cacheAyarlariniOku() { return TK6.cacheAyarlariniOku(); }
function cacheParasutProductMap() { return TK6.cacheParasutProductMap(); }
function cacheMusteriHafiza() { return TK6.cacheMusteriHafiza(); }

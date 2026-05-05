/**
 * Tesbih Kuyusu V6.5 - Ultra Operasyon Core
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
    liveNavlungoSendSetting: "NAVLUNGO_CANLI_GONDERIM",
    batchLimitSetting: "PARASUT_BATCH_LIMIT",
    navlungoQaBaseUrl: "https://domestic-api-qa.navlungo.com/v2.1/",
    navlungoLiveBaseUrl: "https://domestic-api.navlungo.com/v2.1/",
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
      bank: "14_BANKA_HAREKETLERI",
      addressMemory: "15_MUSTERI_ADRESLERI"
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
    INVOICE_EMAIL: "Fatura_Eposta",
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
    PAYLOAD_JSON: "Payload_JSON",
    RESPONSE_JSON: "Response_JSON",
    SEND_DATE: "Gönderim_Tarihi",
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
    NAVLUNGO_POST_NUMBER: "Navlungo_Post_Number",
    NAVLUNGO_REFERENCE_ID: "Navlungo_Reference_ID",
    NAVLUNGO_TRACKING_URL: "Navlungo_Tracking_URL",
    NAVLUNGO_BARCODE_URL: "Navlungo_Barcode_URL",
    NAVLUNGO_CARRIER_ID: "Navlungo_Carrier_ID",
    NAVLUNGO_CARRIER_NAME: "Navlungo_Carrier_Name",
    NAVLUNGO_STATUS: "Navlungo_Status",
    NAVLUNGO_LAST_RESPONSE: "Navlungo_Last_Response",
    NAVLUNGO_LAST_ERROR: "Navlungo_Last_Error",
    NAVLUNGO_CREATED_AT: "Navlungo_Created_At",
    NAVLUNGO_CANCELLED_AT: "Navlungo_Cancelled_At",
    NAVLUNGO_TEST: "Navlungo_Test_Mu",
    NAVLUNGO_PAYLOAD_HASH: "Navlungo_Payload_Hash",
    BARCODE_PRINTED: "Barkod_Yazdirildi_Mi",
    BARCODE_PRINT_DATE: "Barkod_Yazdirma_Tarihi",
    BARCODE_PRINT_RESULT: "Barkod_Yazdirma_Sonucu",
    BARCODE_PRINT_ERROR: "Barkod_Yazdirma_Hata",
    CARGO_WAIT: "Kargo_Bekletilsin_Mi",
    CARGO_WAIT_REASON: "Kargo_Bekletme_Nedeni",
    CARGO_EXIT_DATE: "Kargo_Cikis_Tarihi",
    ADDRESS_ID: "Adres_ID",
    DEFAULT_ADDRESS: "Varsayılan_Mı",
    ADDRESS_STATUS: "Adres_Durumu",
    LAST_USED: "Son_Kullanım",
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
      H.INVOICE_TEL, H.INVOICE_EMAIL, H.TAX_NO, H.TAX_OFFICE, H.INVOICE_ADDRESS, H.INVOICE_CITY, H.INVOICE_DISTRICT,
      H.EBELGE_TYPE, H.ITEM_SUM, H.GROUP_PAYMENT_SUM, H.DIFF, H.INVOICE_STATUS, H.PARASUT_CONTACT_ID,
      H.CARI_MATCH_SCORE, H.CARI_MATCH_STATUS, H.CARI_ACTION,
      H.PARASUT_INVOICE_ID, H.SEND_LOCK, H.WARN
    ],
    parasut: [
      H.ACTION, H.INVOICE_GROUP_ID, H.OPEN_ID, H.INVOICE_PERSON, H.CARI_TYPE,
      H.PARASUT_CONTACT_ID, H.ITEM_ID, H.PRODUCT, H.PARASUT_PRODUCT_ID, H.QTY,
      H.UNIT, H.UNIT_NET, H.VAT_RATE, H.VAT_AMOUNT, H.LINE_GROSS, H.PARASUT_INVOICE_ID,
      H.PARASUT_STATUS, H.SEND_LOCK, H.PAYLOAD_CHECK, H.PAYLOAD_JSON, H.RESPONSE_JSON,
      H.SEND_DATE, H.ERROR, H.CAN_SEND_DRAFT,
      H.DRAFT_BLOCK, H.NOTE
    ],
    cargo: [
      H.CARGO_PACKAGE_ID, H.OPEN_ID, H.CARGO_RECEIVER, H.CARGO_TEL, H.CITY, H.DISTRICT,
      H.ADDRESS, H.CARGO_COMPANY, H.PACKAGE_STATUS, H.BARCODE, H.TRACKING_NO, H.LATE_ADD,
      H.PACKAGE_NOTE, H.NAVLUNGO_POST_NUMBER, H.NAVLUNGO_REFERENCE_ID, H.NAVLUNGO_TRACKING_URL,
      H.NAVLUNGO_BARCODE_URL, H.NAVLUNGO_CARRIER_ID, H.NAVLUNGO_CARRIER_NAME, H.NAVLUNGO_STATUS,
      H.NAVLUNGO_LAST_RESPONSE, H.NAVLUNGO_LAST_ERROR, H.NAVLUNGO_CREATED_AT, H.NAVLUNGO_CANCELLED_AT,
      H.NAVLUNGO_TEST, H.NAVLUNGO_PAYLOAD_HASH, H.BARCODE_PRINTED, H.BARCODE_PRINT_DATE,
      H.BARCODE_PRINT_RESULT, H.BARCODE_PRINT_ERROR, H.CARGO_WAIT, H.CARGO_WAIT_REASON,
      H.CARGO_EXIT_DATE, H.WARN
    ],
    memory: [
      H.PHONE, H.OWNER, "Son_Kargo_Alıcısı", "Son_Kargo_Tel", "Son_İl", "Son_İlçe",
      "Son_Adres", "Son_Fatura_Kişisi", "Son_Fatura_Tel", "Son_Fatura_TCKN_VKN",
      H.PARASUT_CONTACT_ID, "Son_Ödeme_Yapanlar_JSON", "Cari_Adaylari_JSON",
      "Son_Kargo_Bilgisi_JSON", "Güven_Puanı", "Son_Başarılı_Sipariş_ID",
      "Son_Güncelleme", "Güven_Notu", H.WARN
    ],
    addressMemory: [
      H.ADDRESS_ID, H.PHONE, H.OWNER, H.CARGO_RECEIVER, H.CARGO_TEL, H.CITY, H.DISTRICT,
      H.ADDRESS, H.CARGO_COMPANY, H.DEFAULT_ADDRESS, H.LAST_USED, H.ADDRESS_STATUS, H.WARN
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
    dictionary: ["Sayfa", "Kolon", "Kaynak", "Amaç", "Zorunlu_Mu", "Not"],
    bank: [
      H.BANK_MOVE_ID, H.BANK_DATE, H.BANK_VALUE_DATE, H.BANK_SENDER, H.BANK_DESC,
      H.BANK_AMOUNT, H.BANK_NAME, H.IBAN, H.BANK_TX_TYPE, H.REF_NO, H.MATCH_STATUS,
      H.MATCH_SCORE, H.SUGGESTED_OPEN_ID, H.SUGGESTED_PAYMENT_ID, H.SUGGESTED_PAYER,
      H.OPERATOR_APPROVAL, H.WARN
    ]
  };

  function onOpen_() {
    var ui = SpreadsheetApp.getUi();
    var technical = ui.createMenu("Gelişmiş / Teknik")
      .addItem("Cari seç / oluştur", "cariSecDialog")
      .addItem("Hızlı sipariş oluştur", "hizliSiparisOlustur")
      .addItem("Ürün ekle", "urunEkle")
      .addItem("Ödeme ekle", "odemeEkle")
      .addItem("Kargo bilgisi gir", "kargoBilgisiGir")
      .addItem("Sistemi yenile", "sistemiYenile")
      .addItem("Kontrol merkezini güncelle", "kontrolMerkeziniGuncelle")
      .addItem("Sistemi canlıya hazırla", "sistemiCanliyaHazirla")
      .addItem("Paraşüt ürün kartlarını kontrol et", "parasutUrunKartlariniKontrolEt")
      .addItem("Paraşüt cari hazırlığı yap", "parasutCariHazirla")
      .addItem("Paraşüt cari adaylarını getir", "seciliParasutCariAdaylariniGetir")
      .addItem("Paraşüt taslak payload test et", "seciliParasutTaslakPayloadTestEt")
      .addItem("Paraşüt taslak gönder", "seciliParasutFaturaTaslakGonderOnayli")
      .addItem("e-Belge / istisna hazırlığı yap", "ebelgeIstisnaHazirla")
      .addItem("16:00 sonrası geç ekleme işlemi", "gecEklemeIstisnaIslemi")
      .addItem("Banka hareketlerini içeri al", "bankaHareketleriniIceriAl")
      .addItem("Banka hareketlerini eşleştir", "bankaHareketleriniEsle")
      .addItem("Banka eşleşmelerini kontrol et", "bankaEslesmeKontrolMerkeziniGuncelle")
      .addItem("Navlungo API bağlantı testi", "navlungoBaglantiTestiTam")
      .addItem("Navlungo toplu kargo oluştur", "seciliNavlungoTopluKargoOlustur");
    ui.createMenu("TESBİH KUYUSU PANEL")
      .addItem("Ultra sipariş paneli", "ultraSiparisPaneli")
      .addItem("Seçili siparişi düzenle", "seciliSiparisiDuzenle")
      .addItem("Seçili siparişleri düzenle", "seciliSiparisleriDuzenle")
      .addItem("Kaydet ve ERP güncelle", "kaydetVeErpGuncelle")
      .addItem("Sadece fatura oluştur", "sadeceFaturaOlustur")
      .addItem("Sadece kargo hazırla", "sadeceKargoHazirla")
      .addItem("Fatura ve kargo oluştur", "faturaVeKargoOlustur")
      .addItem("Kargo beklet", "kargoBeklet")
      .addItem("Bekleyen kargoyu çıkar", "bekleyenKargoyuCikar")
      .addItem("Sil", "seciliKaydiSil")
      .addItem("Geri al", "seciliKaydiGeriAl")
      .addItem("Arşivle", "seciliKaydiArsivle")
      .addItem("Müşteri hafızasını düzenle", "musteriHafizasiniDuzenle")
      .addItem("Müşteri hafızasından sil", "musteriHafizasindanSil")
      .addItem("Kontrol merkezi", "kontrolMerkezi")
      .addItem("Paraşüt API bağlantısını test et", "parasutApiBaglantiTestiTam")
      .addItem("Görünümü düzenle", "otomatikGorunumuDuzenle")
      .addSubMenu(technical)
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
    ensureSheet_(ss, CFG.sheets.addressMemory, HEADERS.addressMemory);
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
    setIf_(row, h, H.ITEM_STATUS, warnings.length ? "Kontrol Gerekli" : (val_(row, h, H.ITEM_STATUS) || "Hazır"));
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
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var props = documentProperties_();
    var editIds = parseJsonArray_(props.getProperty("ULTRA_PANEL_EDIT_OPEN_IDS"));
    if (props.deleteProperty) props.deleteProperty("ULTRA_PANEL_EDIT_OPEN_IDS");
    var editOrders = editIds.length ? ultraPanelPayloadsForOpenIds_(editIds) : [];
    var loaded = {};
    editOrders.forEach(function (order) { if (order && order.openId) loaded[order.openId] = true; });
    var missing = editIds.filter(function (id) { return id && !loaded[id]; });
    return {
      openOrders: openOrderOptions_(),
      products: productOptions_(),
      today: todayIso_(),
      cargoCompanies: ["Aras Kargo", "Yurtiçi Kargo", "MNG Kargo", "Sürat Kargo"],
      paymentSources: ["Manuel", "Dekont", "WhatsApp", "Banka açıklaması"],
      silverAmountTypes: ["Birim", "Toplam"],
      editOrders: editOrders,
      qzPrinterName: qzPrinterName_(ss),
      qzAutoPrint: qzAutoPrintAfterBarcode_(ss) ? "Evet" : "Hayır",
      qzPrintCopies: qzPrintCopies_(ss),
      qzPrintMode: qzPrintMode_(ss),
      panelError: missing.length ? "Seçili satırdan sipariş verisi bulunamadı: " + missing.join(", ") : ""
    };
  }

  function getUltraPanelHazirlik_(phone) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var normalized = normalizePhone_(phone || "");
    var memory = cacheMusteriHafiza_();
    var row = memory[normalized] || {};
    var openOrder = findOpenOrderForPhone_(ss, normalized);
    var addresses = addressHistoryForPhone_(ss, normalized);
    var primaryAddress = addresses.filter(function (a) { return yes_(a[H.DEFAULT_ADDRESS]); })[0] || addresses[0] || {};
    return {
      ok: true,
      phone: normalized,
      openOrder: openOrder,
      owner: row[H.OWNER] || "",
      cargo: {
        receiver: primaryAddress[H.CARGO_RECEIVER] || row["Son_Kargo_Alıcısı"] || "",
        phone: primaryAddress[H.CARGO_TEL] || row["Son_Kargo_Tel"] || normalized,
        city: primaryAddress[H.CITY] || row["Son_İl"] || "",
        district: primaryAddress[H.DISTRICT] || row["Son_İlçe"] || "",
        address: primaryAddress[H.ADDRESS] || row["Son_Adres"] || "",
        company: primaryAddress[H.CARGO_COMPANY] || row["Son_Kargo_Firması"] || CFG.defaultCargoCompany
      },
      addresses: addresses,
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

  function ultraPanelPayloadsForOpenIds_(openIds) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    return uniqueArray_(openIds || []).map(function (openId) {
      return ultraPanelPayloadForOpenId_(ss, openId);
    }).filter(Boolean);
  }

  function ultraPanelPayloadForOpenId_(ss, openId) {
    var queueRows = objects_(sheet_(ss, CFG.sheets.queue)).filter(function (r) { return r[H.OPEN_ID] === openId; });
    var q = queueRows[queueRows.length - 1] || {};
    var cargoRows = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (r) { return r[H.OPEN_ID] === openId; });
    var cargo = cargoRows[cargoRows.length - 1] || {};
    var itemRows = objects_(sheet_(ss, CFG.sheets.items)).filter(function (r) { return r[H.OPEN_ID] === openId && r[H.ITEM_STATUS] !== "İptal"; });
    var paymentRows = objects_(sheet_(ss, CFG.sheets.payments)).filter(function (r) { return r[H.OPEN_ID] === openId && r[H.CONFIRM_STATUS] !== "İptal"; });
    var invoiceRows = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (r) { return r[H.OPEN_ID] === openId && r[H.INVOICE_STATUS] !== "İptal"; });
    if (!q[H.OPEN_ID] && !itemRows.length && !paymentRows.length && !invoiceRows.length && !cargo[H.OPEN_ID]) return null;
    var phone = q[H.PHONE] || cargo[H.CARGO_TEL] || "";
    return {
      openId: openId,
      cargoPackageId: cargo[H.CARGO_PACKAGE_ID] || "",
      kargoPaketId: cargo[H.CARGO_PACKAGE_ID] || "",
      whatsAppTel: phone,
      siparisSahibi: q[H.OWNER] || "",
      hamWhatsappMesaji: q[H.RAW] || "",
      hizliUrunGirisi: q[H.FAST_PRODUCTS] || "",
      hizliOdemeGirisi: q[H.FAST_PAYMENTS] || "",
      hizliKargoGirisi: q[H.FAST_CARGO] || "",
      kargo: {
        kargoPaketId: cargo[H.CARGO_PACKAGE_ID] || "",
        kargoAlicisi: cargo[H.CARGO_RECEIVER] || q[H.OWNER] || "",
        kargoTel: cargo[H.CARGO_TEL] || phone,
        il: cargo[H.CITY] || "",
        ilce: cargo[H.DISTRICT] || "",
        adres: cargo[H.ADDRESS] || "",
        kargoFirmasi: cargo[H.CARGO_COMPANY] || CFG.defaultCargoCompany,
        paketNotu: cargo[H.PACKAGE_NOTE] || "",
        kargoBekletilsinMi: cargo[H.CARGO_WAIT] || "Hayır",
        kargoBekletmeNedeni: cargo[H.CARGO_WAIT_REASON] || "",
        kargoCikisTarihi: cargo[H.CARGO_EXIT_DATE] || "",
        navlungoPostNumber: cargo[H.NAVLUNGO_POST_NUMBER] || "",
        navlungoTrackingUrl: cargo[H.NAVLUNGO_TRACKING_URL] || "",
        navlungoBarcodeUrl: cargo[H.NAVLUNGO_BARCODE_URL] || "",
        navlungoStatus: cargo[H.NAVLUNGO_STATUS] || "",
        navlungoLastError: cargo[H.NAVLUNGO_LAST_ERROR] || "",
        barkodYazdirildiMi: cargo[H.BARCODE_PRINTED] || "",
        barkodYazdirmaSonucu: cargo[H.BARCODE_PRINT_RESULT] || "",
        barkodYazdirmaHata: cargo[H.BARCODE_PRINT_ERROR] || ""
      },
      urunler: itemRows.map(function (row) {
        return {
          urunKalemId: row[H.ITEM_ID] || "",
          faturaCariBaglantiId: row[H.INVOICE_CARI_LINK_ID] || "",
          odemeYapan: row[H.PAYER] || "",
          urunAdi: row[H.PRODUCT] || "",
          miktar: row[H.QTY] || "",
          birim: row[H.UNIT] || "",
          birimFiyatKdvDahil: row[H.UNIT_GROSS] || "",
          kdvOrani: row[H.VAT_RATE] || "",
          gumusGram: row[H.SILVER_GRAM] || "",
          gumusAlisBirim: row[H.SILVER_COST_UNIT] || "",
          gumusSatisBirim: row[H.SILVER_SALE_UNIT] || "",
          gumusTutarTipi: row[H.SILVER_AMOUNT_TYPE] || "Birim"
        };
      }),
      odemeler: paymentRows.map(function (row) {
        return {
          odemeId: row[H.PAYMENT_ID] || "",
          faturaCariBaglantiId: row[H.INVOICE_CARI_LINK_ID] || "",
          odemeYapan: row[H.PAYER] || "",
          odemeTutari: row[H.PAYMENT_AMOUNT] || "",
          odemeTarihi: row[H.PAYMENT_DATE] || todayIso_(),
          odemeTeyitKaynagi: row[H.PAYMENT_SOURCE] || "Manuel",
          dekontReferans: row[H.RECEIPT_REF] || "",
          odemeYapanTel: row[H.PAYER_TEL] || phone,
          odemeYapanTcknVkn: row[H.PAYER_TAX_NO] || CFG.defaultTckn,
          odemeYapanAdres: row[H.PAYER_ADDRESS] || cargo[H.ADDRESS] || "",
          odemeYapanIl: row[H.PAYER_CITY] || cargo[H.CITY] || "",
          odemeYapanIlce: row[H.PAYER_DISTRICT] || cargo[H.DISTRICT] || ""
        };
      }),
      faturalar: invoiceRows.map(function (row) {
        return {
          faturaGrubuId: row[H.INVOICE_GROUP_ID] || "",
          faturaKisisi: row[H.INVOICE_PERSON] || row[H.PAYER] || "",
          odemeYapan: row[H.PAYER] || "",
          cariTipi: row[H.CARI_TYPE] || "Gerçek Kişi",
          faturaTel: row[H.INVOICE_TEL] || phone,
          faturaEmail: row[H.INVOICE_EMAIL] || "",
          faturaTcknVkn: row[H.TAX_NO] || CFG.defaultTckn,
          faturaVergiDairesi: row[H.TAX_OFFICE] || "",
          faturaIl: row[H.INVOICE_CITY] || cargo[H.CITY] || "",
          faturaIlce: row[H.INVOICE_DISTRICT] || cargo[H.DISTRICT] || "",
          faturaAdres: row[H.INVOICE_ADDRESS] || cargo[H.ADDRESS] || "",
          eBelgeTipi: row[H.EBELGE_TYPE] || "",
          parasutCariId: row[H.PARASUT_CONTACT_ID] || "",
          parasutFaturaId: row[H.PARASUT_INVOICE_ID] || "",
          gonderimKilidi: row[H.SEND_LOCK] || "Hayır",
          cariPuan: row[H.CARI_MATCH_SCORE] || "",
          cariDurum: row[H.CARI_MATCH_STATUS] || "",
          cariAksiyon: row[H.CARI_ACTION] || ""
        };
      }),
      addresses: addressHistoryForPhone_(ss, phone)
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
    var packageId = navlungoIdText_(form && (form.kargoPaketId || form.cargoPackageId)) || cargoPackageIdForOpen_(ss, openId) || ("KP-" + openId);
    upsertObjectByKey_(sheet_(ss, CFG.sheets.cargo), HEADERS.cargo, H.OPEN_ID, openId, {
      [H.CARGO_PACKAGE_ID]: packageId,
      [H.OPEN_ID]: openId,
      [H.CARGO_RECEIVER]: form.kargoAlicisi || "",
      [H.CARGO_TEL]: normalizePhone_(form.kargoTel || ""),
      [H.CITY]: form.il || "",
      [H.DISTRICT]: form.ilce || "",
      [H.ADDRESS]: normalizeAddress_(form.adres || ""),
      [H.CARGO_COMPANY]: form.kargoFirmasi || CFG.defaultCargoCompany,
      [H.PACKAGE_STATUS]: "Bekliyor",
      [H.PACKAGE_NOTE]: form.paketNotu || "",
      [H.CARGO_WAIT]: yes_(form.kargoBekletilsinMi) ? "Evet" : "Hayır",
      [H.CARGO_WAIT_REASON]: form.kargoBekletmeNedeni || "",
      [H.CARGO_EXIT_DATE]: form.kargoCikisTarihi || ""
    });
    normalizeCargoSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.cargo), H.OPEN_ID, openId));
    hafifErpGuncelle_(openId);
    return { ok: true, openId: openId, cargoPackageId: packageId };
  }

  function ultraSiparisPaneli_() {
    showDialog_("ultraSiparisPaneli", "Ultra sipariş paneli", 2200, 1260);
  }

  function userNotice_(message) {
    try { SpreadsheetApp.getUi().alert(message); } catch (err) {}
    return { ok: false, status: message };
  }

  function seciliSiparisiDuzenle_() {
    var ids = selectedOpenIds_();
    if (!ids.length) return userNotice_("Lütfen işlem yapılacak siparişi seçin.");
    openUltraPanelForEdit_(ids.slice(0, 1));
  }

  function seciliSiparisleriDuzenle_() {
    var ids = selectedOpenIds_();
    if (!ids.length) return userNotice_("Lütfen işlem yapılacak siparişleri seçin.");
    openUltraPanelForEdit_(ids);
  }

  function seciliKaydiSil_() {
    return logicalPatchSelected_("cancel");
  }

  function seciliKaydiGeriAl_() {
    return logicalPatchSelected_("restore");
  }

  function seciliKaydiArsivle_() {
    return logicalPatchSelected_("archive");
  }

  function musteriHafizasiniDuzenle_() {
    var ids = selectedOpenIds_();
    if (ids.length) return openUltraPanelForEdit_(ids.slice(0, 1));
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = sheet_(ss, CFG.sheets.memory);
    if (sh) ss.setActiveSheet(sh);
    return { ok: true, status: "09_MUSTERI_HAFIZA açıldı" };
  }

  function musteriHafizasindanSil_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var phone = selectedPhone_();
    if (!phone) return userNotice_("Müşteri hafızasından silmek için telefon içeren bir satır seçin.");
    confirmUi_("Müşteri hafızasından sil", "Telefon: " + normalizePhone_(phone) + "\n\n09_MUSTERI_HAFIZA ve 15_MUSTERI_ADRESLERI kayıtları pasifleştirilecek. Devam edilsin mi?");
    var rows = objects_(sheet_(ss, CFG.sheets.memory));
    var changed = false;
    rows.forEach(function (row) {
      if (normalizePhone_(row[H.PHONE]) === normalizePhone_(phone)) {
        row[H.WARN] = "Hafıza pasif";
        changed = true;
      }
    });
    if (changed) writeObjects_(sheet_(ss, CFG.sheets.memory), HEADERS.memory, rows);
    var addressRows = objects_(sheet_(ss, CFG.sheets.addressMemory));
    var addressChanged = false;
    addressRows.forEach(function (row) {
      if (normalizePhone_(row[H.PHONE]) === normalizePhone_(phone)) {
        row[H.ADDRESS_STATUS] = "Pasif";
        row[H.WARN] = "Hafıza pasif";
        addressChanged = true;
      }
    });
    if (addressChanged) writeObjects_(sheet_(ss, CFG.sheets.addressMemory), HEADERS.addressMemory, addressRows);
    return { ok: changed || addressChanged, phone: normalizePhone_(phone), status: (changed || addressChanged) ? "Müşteri hafızası pasifleştirildi" : "Telefon hafızada bulunamadı" };
  }

  function kontrolMerkezi_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    kontrolMerkeziniGuncelle_();
    var sh = sheet_(ss, CFG.sheets.control);
    if (sh) ss.setActiveSheet(sh);
    return { ok: true, sheet: CFG.sheets.control };
  }

  function openUltraPanelForEdit_(openIds) {
    var ids = uniqueArray_((openIds || []).map(function (id) { return String(id || "").trim(); }).filter(Boolean));
    if (!ids.length) throw new Error("Düzenlenecek Açık_Sipariş_ID bulunamadı.");
    documentProperties_().setProperty("ULTRA_PANEL_EDIT_OPEN_IDS", JSON.stringify(ids));
    ultraSiparisPaneli_();
    return { ok: true, openIds: ids };
  }

  function selectedOpenIds_() {
    return uniqueArray_(selectedContexts_({ quiet: true }).map(function (ctx) { return ctx.openId; }).filter(Boolean));
  }

  function selectedPhone_() {
    var ctx = selectedContext_({ quiet: true });
    if (!ctx) return "";
    var row = ctx.row || {};
    return normalizePhone_(row[H.PHONE] || row[H.CARGO_TEL] || row[H.INVOICE_TEL] || row[H.PAYER_TEL] || "");
  }

  function logicalPatchSelected_(mode) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contexts;
    try { contexts = selectedContexts_(); }
    catch (err) { return userNotice_(safeErrorMessage_(err)); }
    var ids = contexts.map(function (ctx) { return ctx.openId; }).filter(Boolean);
    ids = uniqueArray_(ids);
    if (!ids.length) return userNotice_("Seçili satırdan Açık_Sipariş_ID bulunamadı.");
    confirmSelectedLifecycle_(mode, ids, contexts);
    var results = ids.map(function (openId) { return applyOrderLifecycle_(ss, openId, mode); });
    return { ok: results.every(function (r) { return r.ok !== false; }), mode: mode, openIds: ids, results: results };
  }

  function selectedContextSheets_() {
    return [CFG.sheets.queue, CFG.sheets.open, CFG.sheets.items, CFG.sheets.payments, CFG.sheets.invoiceGroups, CFG.sheets.parasut, CFG.sheets.cargo, CFG.sheets.memory, CFG.sheets.addressMemory];
  }

  function selectedOrderContextSheets_() {
    return [CFG.sheets.queue, CFG.sheets.open, CFG.sheets.items, CFG.sheets.payments, CFG.sheets.invoiceGroups, CFG.sheets.parasut, CFG.sheets.cargo];
  }

  function selectedContext_(options) {
    var list = selectedContexts_(options);
    return list.length ? list[0] : null;
  }

  function selectedContexts_(options) {
    options = options || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getActiveSheet();
    var range = sh && sh.getActiveRange ? sh.getActiveRange() : (ss.getActiveRange ? ss.getActiveRange() : null);
    if (!sh || !range) {
      if (options.quiet) return [];
      throw new Error("Lütfen işlem yapılacak satırı seçin.");
    }
    var sheetName = sh.getName();
    var allowed = options.allowedSheets || selectedContextSheets_();
    if (allowed.indexOf(sheetName) === -1) {
      if (options.quiet) return [];
      throw new Error("Bu menü işlemi seçili sayfada çalışmaz: " + sheetName);
    }
    var out = [];
    for (var offset = 0; offset < range.getNumRows(); offset++) {
      var rowNum = range.getRow() + offset;
      if (rowNum < 2) continue;
      var row = rowObjectFromSheetRow_(sh, rowNum);
      var openId = String(row[H.OPEN_ID] || openIdFromRelatedRow_(ss, sheetName, row) || "").trim();
      out.push({
        ss: ss,
        sheetName: sheetName,
        rowNum: rowNum,
        row: row,
        openId: openId,
        queueId: String(row[H.Q_ID] || "").trim(),
        invoiceGroupId: String(row[H.INVOICE_GROUP_ID] || "").trim(),
        cargoPackageId: String(row[H.CARGO_PACKAGE_ID] || "").trim(),
        phone: normalizePhone_(row[H.PHONE] || row[H.CARGO_TEL] || row[H.INVOICE_TEL] || row[H.PAYER_TEL] || "")
      });
    }
    if (!out.length && !options.quiet) throw new Error("Lütfen veri satırı seçin.");
    return out;
  }

  function selectedInvoiceGroupId_(ctx) {
    ctx = ctx || selectedContext_({ allowedSheets: [CFG.sheets.invoiceGroups, CFG.sheets.parasut, CFG.sheets.open, CFG.sheets.queue, CFG.sheets.items, CFG.sheets.payments] });
    if (!ctx) throw new Error("Fatura grubu için satır seçin.");
    if (ctx.invoiceGroupId) return ctx.invoiceGroupId;
    if (!ctx.openId) throw new Error("Seçili satırdan Açık_Sipariş_ID veya Fatura_Grubu_ID alınamadı.");
    var groups = objects_(sheet_(ctx.ss, CFG.sheets.invoiceGroups)).filter(function (row) { return row[H.OPEN_ID] === ctx.openId; });
    if (groups.length === 1 && groups[0][H.INVOICE_GROUP_ID]) return groups[0][H.INVOICE_GROUP_ID];
    if (groups.length > 1) throw new Error("Bu siparişte birden fazla fatura grubu var; lütfen 06_FATURA_GRUPLARI veya 07_PARASUT_FATURA satırını seçin.");
    throw new Error("Seçili sipariş için fatura grubu bulunamadı.");
  }

  function selectedCargoPackageIds_() {
    var contexts = selectedContexts_({ allowedSheets: [CFG.sheets.cargo] });
    var ids = contexts.map(function (ctx) { return ctx.cargoPackageId; }).filter(Boolean);
    if (!ids.length) throw new Error("Navlungo işlemi için 08_KARGO_PAKETLERI üzerinde Kargo_Paket_ID içeren satır seçin.");
    return uniqueArray_(ids);
  }

  function contextSummary_(ctx) {
    if (!ctx) return "";
    var parts = [ctx.sheetName + " satır " + ctx.rowNum];
    if (ctx.openId) parts.push("Açık_Sipariş_ID=" + ctx.openId);
    if (ctx.invoiceGroupId) parts.push("Fatura_Grubu_ID=" + ctx.invoiceGroupId);
    if (ctx.cargoPackageId) parts.push("Kargo_Paket_ID=" + ctx.cargoPackageId);
    return parts.join("\n");
  }

  function liveGateSummary_(ss) {
    return [
      "PARASUT_CANLI_GONDERIM=" + setting_(ss, CFG.liveParasutSendSetting, "Hayır"),
      "PARASUT_CARI_CANLI_OLUSTURMA=" + setting_(ss, "PARASUT_CARI_CANLI_OLUSTURMA", "Hayır"),
      "EBELGE_CANLI_GONDERIM=" + setting_(ss, CFG.liveEbelgeSendSetting, "Hayır"),
      "NAVLUNGO_CANLI_GONDERIM=" + setting_(ss, CFG.liveNavlungoSendSetting, "Hayır")
    ].join("\n");
  }

  function confirmUi_(title, message) {
    var ui;
    try { ui = SpreadsheetApp.getUi(); } catch (err) { throw new Error("Bu işlem menü onayı gerektirir; Apps Script düzenleyicisinden doğrudan çalıştırmayın."); }
    if (!ui || !ui.alert || !ui.ButtonSet || !ui.Button) throw new Error("Bu işlem menü onayı gerektirir.");
    var response = ui.alert(title, message, ui.ButtonSet.YES_NO);
    if (response !== ui.Button.YES) throw new Error("İşlem operatör onayıyla iptal edildi.");
  }

  function confirmSelectedOperation_(action, ctx) {
    var labels = {
      faturaKargo: "Fatura ve kargo oluştur",
      sadeceFatura: "Sadece fatura oluştur",
      sadeceKargo: "Sadece kargo hazırla",
      bekleyenKargo: "Bekleyen kargoyu çıkar",
      kargoBeklet: "Kargo beklet"
    };
    confirmUi_(labels[action] || "Operasyon", "Seçili kayıt:\n" + contextSummary_(ctx) + "\n\nCanlı kapılar:\n" + liveGateSummary_(ctx.ss) + "\n\nDevam edilsin mi?");
  }

  function confirmSelectedLifecycle_(mode, ids, contexts) {
    var labels = { cancel: "Sil / iptal", restore: "Geri al", archive: "Arşivle" };
    var summary = (contexts || []).map(contextSummary_).join("\n\n");
    confirmUi_(labels[mode] || "Kayıt işlemi", "Etkilenecek siparişler: " + ids.join(", ") + "\n\nSeçili kayıt özeti:\n" + summary + "\n\nDevam edilsin mi?");
  }

  function patchLogicalStatusRow_(sh, rowNum, mode) {
    var h = headers_(sh);
    var sheetName = sh.getName();
    var status = mode === "restore" ? "Aktif" : mode === "archive" ? "Arşiv" : "İptal";
    var patched = 0;
    function put(header, value) {
      if (h[header] === undefined) return;
      sh.getRange(rowNum, h[header] + 1).setValue(value);
      patched++;
    }
    if (sheetName === CFG.sheets.queue) {
      put(H.ROW_STATUS, mode === "restore" ? "Staging" : status);
      put(H.ORDER_STATUS, mode === "restore" ? "Açık" : status);
    } else if (sheetName === CFG.sheets.open) {
      put(H.ORDER_STATUS, mode === "restore" ? "Açık" : status);
    } else if (sheetName === CFG.sheets.items) {
      put(H.ITEM_STATUS, mode === "restore" ? "Hazır" : status);
    } else if (sheetName === CFG.sheets.payments) {
      put(H.CONFIRM_STATUS, mode === "restore" ? "Bekliyor" : status);
    } else if (sheetName === CFG.sheets.invoiceGroups) {
      put(H.INVOICE_STATUS, mode === "restore" ? "Hazır" : status);
    } else if (sheetName === CFG.sheets.cargo) {
      put(H.PACKAGE_STATUS, mode === "restore" ? "Bekliyor" : status);
    } else if (sheetName === CFG.sheets.memory || sheetName === CFG.sheets.addressMemory) {
      put(H.ADDRESS_STATUS, mode === "restore" ? "Aktif" : "Pasif");
      put(H.WARN, mode === "restore" ? "" : "Operatör işlemi: " + status);
    } else {
      put(H.WARN, mode === "restore" ? "" : "Operatör işlemi: " + status);
    }
    return patched ? 1 : 0;
  }

  function applyOrderLifecycle_(ss, openId, mode) {
    openId = String(openId || "").trim();
    if (!openId) throw new Error("Açık_Sipariş_ID bulunamadı.");
    var external = orderExternalState_(ss, openId);
    if (mode === "cancel" && external.any) {
      var reason = "Canlı fatura veya kargo kaydı var; iptal için manuel kontrol gerekli";
      kontrolMerkezineTeknikBlokajYaz_(ss, CFG.sheets.open, openId, reason, "Paraşüt ve Navlungo kayıtlarını kontrol edip iptal sürecini ayrı yürütün.", "Operasyon");
      return { ok: false, openId: openId, status: reason, external: external };
    }
    var status = mode === "restore" ? "Açık" : mode === "archive" ? "Arşiv" : "İptal";
    var rowStatus = mode === "restore" ? "Staging" : status;
    var itemStatus = mode === "restore" ? "Hazır" : status;
    var paymentStatus = mode === "restore" ? "Bekliyor" : status;
    var invoiceStatus = mode === "restore" ? "Hazır" : status;
    var cargoStatus = mode === "restore" ? "Hazır" : status;
    var parasutStatus = mode === "restore" ? "Taslak Hazır" : status;
    var changed = 0;
    changed += patchRowsForOpen_(ss, CFG.sheets.queue, HEADERS.queue, openId, { [H.ORDER_STATUS]: status, [H.ROW_STATUS]: rowStatus, [H.WARN]: "" });
    changed += patchRowsForOpen_(ss, CFG.sheets.open, HEADERS.open, openId, { [H.ORDER_STATUS]: status, [H.WARN]: "", [H.BLOCK_REASON]: "", [H.CONTROL_LEVEL]: mode === "restore" ? "OK" : status });
    changed += patchRowsForOpen_(ss, CFG.sheets.items, HEADERS.items, openId, { [H.ITEM_STATUS]: itemStatus, [H.WARN]: "" });
    changed += patchRowsForOpen_(ss, CFG.sheets.payments, HEADERS.payments, openId, { [H.CONFIRM_STATUS]: paymentStatus, [H.CONFIRM_NOTE]: "", [H.WARN]: "" });
    changed += patchRowsForOpen_(ss, CFG.sheets.invoiceGroups, HEADERS.invoiceGroups, openId, { [H.INVOICE_STATUS]: invoiceStatus, [H.WARN]: "" });
    changed += patchRowsForOpen_(ss, CFG.sheets.parasut, HEADERS.parasut, openId, { [H.PARASUT_STATUS]: parasutStatus, [H.ERROR]: "", [H.DRAFT_BLOCK]: "", [H.WARN]: "" });
    changed += patchRowsForOpen_(ss, CFG.sheets.cargo, HEADERS.cargo, openId, { [H.PACKAGE_STATUS]: cargoStatus, [H.WARN]: "" });
    kontrolMerkeziniGuncelleForOpen_(ss, openId);
    return { ok: true, openId: openId, mode: mode, status: status, changed: changed };
  }

  function orderExternalState_(ss, openId) {
    var invoices = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (row) {
      return row[H.OPEN_ID] === openId && (row[H.PARASUT_INVOICE_ID] || yes_(row[H.SEND_LOCK]));
    });
    var parasutRows = objects_(sheet_(ss, CFG.sheets.parasut)).filter(function (row) {
      return row[H.OPEN_ID] === openId && (row[H.PARASUT_INVOICE_ID] || yes_(row[H.SEND_LOCK]));
    });
    var cargos = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) {
      return row[H.OPEN_ID] === openId && (row[H.NAVLUNGO_POST_NUMBER] || row[H.NAVLUNGO_TRACKING_URL] || row[H.NAVLUNGO_BARCODE_URL]);
    });
    return { any: invoices.length + parasutRows.length + cargos.length > 0, invoices: invoices.length, parasutRows: parasutRows.length, cargos: cargos.length };
  }

  function patchRowsForOpen_(ss, sheetName, headers, openId, patch) {
    var sh = sheet_(ss, sheetName);
    var rows = objects_(sh);
    var changed = 0;
    rows.forEach(function (row) {
      if (row[H.OPEN_ID] !== openId) return;
      Object.keys(patch).forEach(function (key) { row[key] = patch[key]; });
      changed++;
    });
    if (changed) writeObjects_(sh, headers, rows);
    return changed;
  }

  function rowObjectFromSheetRow_(sh, rowNum) {
    var h = headers_(sh);
    var values = sh.getRange(rowNum, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0] || [];
    var row = {};
    Object.keys(h).forEach(function (header) { row[header] = values[h[header]] === undefined ? "" : values[h[header]]; });
    return row;
  }

  function findQueueRowForOpen_(ss, openId) {
    var sh = sheet_(ss, CFG.sheets.queue);
    var h = headers_(sh);
    if (h[H.OPEN_ID] === undefined) return { rowNum: 0, qid: "" };
    var data = sh.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (String(data[i][h[H.OPEN_ID]] || "") === String(openId || "")) {
        return { rowNum: i + 1, qid: h[H.Q_ID] !== undefined ? data[i][h[H.Q_ID]] : "" };
      }
    }
    return { rowNum: 0, qid: "" };
  }

  function patchObjectRow_(sh, rowNum, headers, obj, keepExisting) {
    var h = headers_(sh);
    var current = sh.getRange(rowNum, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0] || [];
    (headers || []).forEach(function (header) {
      if (h[header] === undefined) return;
      var next = obj[header];
      if ((next === "" || next === null || next === undefined) && keepExisting) return;
      current[h[header]] = next === undefined ? "" : next;
    });
    sh.getRange(rowNum, 1, 1, Math.max(1, current.length)).setValues([current]);
  }

  function openIdFromRelatedRow_(ss, sheetName, row) {
    var directOpenId = String(row[H.OPEN_ID] || "").trim();
    if (directOpenId) return directOpenId;
    var mapBySheet = {};
    mapBySheet[CFG.sheets.queue] = H.Q_ID;
    mapBySheet[CFG.sheets.items] = H.ITEM_ID;
    mapBySheet[CFG.sheets.payments] = H.PAYMENT_ID;
    mapBySheet[CFG.sheets.invoiceGroups] = H.INVOICE_GROUP_ID;
    mapBySheet[CFG.sheets.parasut] = H.INVOICE_GROUP_ID;
    mapBySheet[CFG.sheets.cargo] = H.CARGO_PACKAGE_ID;
    var primaryKey = mapBySheet[sheetName];
    if (primaryKey) {
      var primaryValue = String(row[primaryKey] || "").trim();
      if (primaryValue) {
        var direct = findObjectByKeyText_(sheet_(ss, sheetName), primaryKey, primaryValue);
        if (direct && direct[H.OPEN_ID]) return String(direct[H.OPEN_ID] || "").trim();
      }
    }
    var maps = [
      [CFG.sheets.queue, H.Q_ID, row[H.Q_ID]],
      [CFG.sheets.items, H.ITEM_ID, row[H.ITEM_ID]],
      [CFG.sheets.payments, H.PAYMENT_ID, row[H.PAYMENT_ID]],
      [CFG.sheets.invoiceGroups, H.INVOICE_GROUP_ID, row[H.INVOICE_GROUP_ID]],
      [CFG.sheets.parasut, H.INVOICE_GROUP_ID, row[H.INVOICE_GROUP_ID]],
      [CFG.sheets.cargo, H.CARGO_PACKAGE_ID, row[H.CARGO_PACKAGE_ID]]
    ];
    for (var i = 0; i < maps.length; i++) {
      var id = String(maps[i][2] || "").trim();
      if (!id) continue;
      var found = findObjectByKeyText_(sheet_(ss, maps[i][0]), maps[i][1], id);
      if (found && found[H.OPEN_ID]) return String(found[H.OPEN_ID] || "").trim();
    }
    return "";
  }

  function documentProperties_() {
    if (typeof PropertiesService !== "undefined" && PropertiesService.getDocumentProperties) {
      return PropertiesService.getDocumentProperties();
    }
    return PropertiesService.getScriptProperties();
  }

  function uniqueArray_(arr) {
    var seen = {};
    var out = [];
    (arr || []).forEach(function (v) {
      var key = String(v || "").trim();
      if (!key || seen[key]) return;
      seen[key] = true;
      out.push(key);
    });
    return out;
  }

  function kaydetVeErpGuncelle_() {
    var ctx;
    try { ctx = selectedContext_({ allowedSheets: selectedOrderContextSheets_() }); }
    catch (err) { return userNotice_(safeErrorMessage_(err)); }
    if (!ctx.openId) return userNotice_("Açık_Sipariş_ID bulunamadı. Kaydet ve ERP güncelle için siparişle ilişkili bir satır seçin.");
    return { ok: true, openId: ctx.openId, refreshed: hafifErpGuncelle_(ctx.openId), selected: contextSummary_(ctx) };
  }

  function ultraSiparisKaydet_(form) {
    return kaydetUltraSiparisHizli_(form);
  }

  function kaydetUltraSiparisHizli_(form, options) {
    var started = Date.now();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var deferRefresh = !!(options && options.deferRefresh);
    ensureCoreSheetsReadyForSave_(ss);
    form = normalizeUltraForm_(form || {}, ss);
    var saveIssues = validateUltraFormForSave_(form);
    if (saveIssues.length) throw new Error(saveIssues.join(" | "));
    var queue = sheet_(ss, CFG.sheets.queue);
    var now = new Date();
    var editingOpenId = String(form.openId || "").trim();
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
    var queueRow = 0;
    var openId = editingOpenId;
    var qid = "";
    if (editingOpenId) {
      var existing = findQueueRowForOpen_(ss, editingOpenId);
      queueRow = existing.rowNum;
      qid = existing.qid || ("Q-" + editingOpenId);
      queueObj[H.Q_ID] = qid;
      queueObj[H.OPEN_ID] = editingOpenId;
      delete queueObj[H.CREATED];
      delete queueObj[H.MSG_DT];
      delete queueObj[H.OP_DAY];
      delete queueObj[H.ORDER_STATUS];
      delete queueObj[H.ROW_STATUS];
      if (queueRow) {
        patchObjectRow_(queue, queueRow, HEADERS.queue, queueObj, true);
      } else {
        throw new Error("Düzenleme için mevcut Açık_Sipariş_ID bulunamadı.");
      }
      normalizeQueueSheetRow_(ss, queueRow);
    } else {
      appendObject_(queue, HEADERS.queue, queueObj);
      queueRow = queue.getLastRow();
      normalizeQueueSheetRow_(ss, queueRow);
      acikSiparisleriGrupla_();
      openId = rowOpenId_(queue, queueRow);
      qid = queue.getRange(queueRow, headers_(queue)[H.Q_ID] + 1).getValue();
    }
    var submittedItemIds = [];
    (form && form.urunler || []).forEach(function (item, index) {
      if (!item || !item.urunAdi) return;
      var itemId = appendProductRowFromParsed_(ss, openId, qid, mergeObjects_(item, {
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
      if (itemId) submittedItemIds.push(itemId);
    });
    var submittedPaymentIds = [];
    (form && form.odemeler || []).forEach(function (payment, index) {
      if (!payment || (!payment.odemeYapan && !payment.odemeTutari)) return;
      var paymentId = appendPaymentRowFromParsed_(ss, openId, qid, mergeObjects_(payment, {
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
      if (paymentId) submittedPaymentIds.push(paymentId);
    });
    if (editingOpenId) markMissingPanelRowsInactive_(ss, openId, submittedItemIds, submittedPaymentIds);
    var cargoPackageId = "";
    if (form && form.kargo && form.cargoPackageId && !form.kargo.kargoPaketId) form.kargo.kargoPaketId = form.cargoPackageId;
    if (form && form.kargo) cargoPackageId = upsertQuickCargo_(ss, openId, qid, form.kargo);
    if (queueObj[H.FAST_PRODUCTS] || queueObj[H.FAST_PAYMENTS] || queueObj[H.FAST_CARGO]) processQueueQuickInputs_(ss, queueRow);
    cargoPackageId = cargoPackageId || cargoPackageIdForOpen_(ss, openId);
    if (deferRefresh) {
      return { ok: true, openId: openId, cargoPackageId: cargoPackageId, kargoPaketId: cargoPackageId, queueId: qid, elapsedMs: Date.now() - started, status: "Kaydedildi; toplu ERP güncelleme bekliyor", deferred: true, form: form };
    }
    hafifErpGuncelle_(openId);
    applyInvoicePanelHints_(ss, openId, form || {});
    autoCariBaglaForOpen_(ss, openId, false);
    updateMusteriHafizaForOpen_(ss, openId);
    parasutTaslaklariniHazirlaForOpen_(ss, openId);
    senkronizeDurumForOpen_(openId);
    ebelgeIstisnaHazirlaForOpen_(ss, openId);
    rebuildOpenOrderForOpen_(ss, openId);
    senkronizeDurumForOpen_(openId);
    kontrolMerkeziniGuncelleForOpen_(ss, openId);
    var control = panelKontrolOzetiForOpen_(ss, openId);
    return {
      ok: control.ok,
      openId: openId,
      cargoPackageId: cargoPackageId,
      kargoPaketId: cargoPackageId,
      queueId: qid,
      elapsedMs: Date.now() - started,
      status: control.ok ? "Kaydedildi ve ERP güncellendi; kontrol merkezi temiz" : "Kaydedildi ve ERP güncellendi; kontrol gerekli",
      control: control
    };
  }

  function topluUltraSiparisKaydet_(payloadList) {
    var started = Date.now();
    var results = [];
    var saved = [];
    (payloadList || []).forEach(function (payload) {
      try {
        var savedOne = kaydetUltraSiparisHizli_(payload, { deferRefresh: true });
        saved.push(savedOne);
        results.push(savedOne);
      } catch (err) {
        results.push({ ok: false, error: safeErrorMessage_(err) });
      }
    });
    if (saved.length) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      saved.forEach(function (r) {
        try {
          hafifErpGuncelle_(r.openId);
          applyInvoicePanelHints_(ss, r.openId, r.form || {});
          autoCariBaglaForOpen_(ss, r.openId, false);
          updateMusteriHafizaForOpen_(ss, r.openId);
          parasutTaslaklariniHazirlaForOpen_(ss, r.openId);
          ebelgeIstisnaHazirlaForOpen_(ss, r.openId);
          rebuildOpenOrderForOpen_(ss, r.openId);
          kontrolMerkeziniGuncelleForOpen_(ss, r.openId);
          r.control = panelKontrolOzetiForOpen_(ss, r.openId);
          r.ok = r.control.ok;
        } catch (err) {
          r.ok = false;
          r.error = safeErrorMessage_(err);
        }
      });
    }
    return { ok: results.every(function (r) { return r.ok; }), count: results.length, elapsedMs: Date.now() - started, results: results };
  }

  function v65GercekSheetKabulKontrolu_() {
    var started = Date.now();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    sistemKolonlariniHazirla_();
    var payloads = v65KabulPayloadlari_();
    var tekSonuclar = [];
    payloads.slice(0, 5).forEach(function (payload) {
      tekSonuclar.push(kaydetUltraSiparisHizli_(payload));
    });
    var toplu10 = topluUltraSiparisKaydet_(payloads.slice(5, 15));
    var gümüşOpenId = tekSonuclar[4] && tekSonuclar[4].openId;
    var postKapilari = {
      parasut: setting_(ss, CFG.liveParasutSendSetting, "Hayır"),
      ebelge: setting_(ss, CFG.liveEbelgeSendSetting, "Hayır"),
      navlungo: setting_(ss, "NAVLUNGO_CANLI_GONDERIM", "Hayır")
    };
    var ozet = v65KabulSayimOzeti_(ss);
    return {
      ok: tekSonuclar.every(function (r) { return r.ok; }) && toplu10.ok,
      elapsedMs: Date.now() - started,
      tekSiparis: tekSonuclar.length,
      topluSiparis: toplu10.count,
      gumusOpenId: gümüşOpenId,
      postKapilari: postKapilari,
      salesPost: "Yapılmadı",
      counts: ozet,
      status: "V6.5 gerçek Sheet kabul veri akışı tamamlandı"
    };
  }

  function v65KabulSayimOzeti_(ss) {
    return {
      queue: objects_(sheet_(ss, CFG.sheets.queue)).length,
      open: objects_(sheet_(ss, CFG.sheets.open)).length,
      items: objects_(sheet_(ss, CFG.sheets.items)).length,
      payments: objects_(sheet_(ss, CFG.sheets.payments)).length,
      invoiceGroups: objects_(sheet_(ss, CFG.sheets.invoiceGroups)).length,
      parasut: objects_(sheet_(ss, CFG.sheets.parasut)).length,
      cargo: objects_(sheet_(ss, CFG.sheets.cargo)).length,
      memory: objects_(sheet_(ss, CFG.sheets.memory)).length,
      finance808: objects_(sheet_(ss, CFG.sheets.finance808)).length,
      ebelge: objects_(sheet_(ss, CFG.sheets.ebelge)).length,
      control: objects_(sheet_(ss, CFG.sheets.control)).length,
      bank: objects_(sheet_(ss, CFG.sheets.bank)).length
    };
  }

  function v65KabulPayloadlari_() {
    var basePhone = 5556410000;
    var names = ["Ali Yılmaz", "Ayşe Kaya", "Mehmet Nuri Çetin", "Zeynep Demir", "Hasan Gümüş"];
    var out = [];
    out.push({
      whatsAppTel: "0" + basePhone,
      siparisSahibi: names[0],
      urunler: [{ urunAdi: "Tesbih", odemeYapan: names[0], miktar: 1, birim: "Adet", birimFiyatKdvDahil: 350, kdvOrani: 0.20 }],
      odemeler: [{ odemeYapan: names[0], odemeTutari: 350, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "0" + basePhone, odemeYapanIl: "İzmir", odemeYapanIlce: "Menderes", odemeYapanAdres: "Kabul mah. 1" }],
      kargo: { kargoAlicisi: names[0], kargoTel: "0" + basePhone, il: "İzmir", ilce: "Menderes", adres: "Kabul mah. 1", kargoFirmasi: "Aras Kargo" }
    });
    out.push({
      whatsAppTel: "0" + (basePhone + 1),
      siparisSahibi: names[1],
      urunler: [
        { urunAdi: "Tesbih", odemeYapan: names[1], miktar: 2, birim: "Adet", birimFiyatKdvDahil: 400, kdvOrani: 0.20 },
        { urunAdi: "Tesbih Kutusu", odemeYapan: names[1], miktar: 1, birim: "Adet", birimFiyatKdvDahil: 100, kdvOrani: 0.20 }
      ],
      odemeler: [{ odemeYapan: names[1], odemeTutari: 900, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "0" + (basePhone + 1), odemeYapanIl: "İzmir", odemeYapanIlce: "Konak", odemeYapanAdres: "Kabul mah. 2" }],
      kargo: { kargoAlicisi: names[1], kargoTel: "0" + (basePhone + 1), il: "İzmir", ilce: "Konak", adres: "Kabul mah. 2", kargoFirmasi: "Aras Kargo" }
    });
    out.push({
      whatsAppTel: "0" + (basePhone + 2),
      siparisSahibi: "Sipariş Sahibi Farklı",
      urunler: [
        { urunAdi: "Tesbih", odemeYapan: "Birinci Ödeyen", miktar: 1, birim: "Adet", birimFiyatKdvDahil: 300, kdvOrani: 0.20 },
        { urunAdi: "Pirinç Püskül", odemeYapan: "İkinci Ödeyen", miktar: 1, birim: "Adet", birimFiyatKdvDahil: 150, kdvOrani: 0.20 }
      ],
      odemeler: [
        { odemeYapan: "Birinci Ödeyen", odemeTutari: 300, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "0" + (basePhone + 2), odemeYapanIl: "İzmir", odemeYapanIlce: "Bornova", odemeYapanAdres: "Kabul mah. 3" },
        { odemeYapan: "İkinci Ödeyen", odemeTutari: 150, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "0" + (basePhone + 3), odemeYapanIl: "İzmir", odemeYapanIlce: "Bornova", odemeYapanAdres: "Kabul mah. 3" }
      ],
      kargo: { kargoAlicisi: "Kargo Alıcısı Farklı", kargoTel: "0" + (basePhone + 4), il: "İzmir", ilce: "Bornova", adres: "Kabul mah. 3", kargoFirmasi: "Aras Kargo" }
    });
    out.push({
      whatsAppTel: "0" + (basePhone + 5),
      siparisSahibi: names[3],
      hizliUrunGirisi: "1 kutu 80 + 1 tesbih 420",
      hizliOdemeGirisi: names[3] + " 500",
      hizliKargoGirisi: "alıcı " + names[3] + " tel 0" + (basePhone + 5) + " izmir menderes adres Kabul mah. 4",
      kargo: { kargoAlicisi: names[3], kargoTel: "0" + (basePhone + 5), il: "İzmir", ilce: "Menderes", adres: "Kabul mah. 4", kargoFirmasi: "Aras Kargo" }
    });
    out.push({
      whatsAppTel: "0" + (basePhone + 6),
      siparisSahibi: names[4],
      urunler: [{ urunAdi: "Gümüş", odemeYapan: names[4], miktar: 6, birim: "Gram", birimFiyatKdvDahil: 145, kdvOrani: 0.20, gumusGram: 6, gumusAlisBirim: 120, gumusSatisBirim: 145, gumusTutarTipi: "Birim" }],
      odemeler: [{ odemeYapan: names[4], odemeTutari: 870, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "0" + (basePhone + 6), odemeYapanIl: "İzmir", odemeYapanIlce: "Menderes", odemeYapanAdres: "Kabul mah. 5" }],
      kargo: { kargoAlicisi: names[4], kargoTel: "0" + (basePhone + 6), il: "İzmir", ilce: "Menderes", adres: "Kabul mah. 5", kargoFirmasi: "Aras Kargo" }
    });
    for (var i = 0; i < 10; i++) {
      out.push({
        whatsAppTel: "0" + (basePhone + 20 + i),
        siparisSahibi: "Toplu Kabul " + (i + 1),
        urunler: [{ urunAdi: "Tesbih", odemeYapan: "Toplu Ödeyen " + (i + 1), miktar: 1, birim: "Adet", birimFiyatKdvDahil: 100, kdvOrani: 0.20 }],
        odemeler: [{ odemeYapan: "Toplu Ödeyen " + (i + 1), odemeTutari: 100, odemeTeyitKaynagi: "Manuel", odemeYapanTel: "0" + (basePhone + 20 + i), odemeYapanIl: "İzmir", odemeYapanIlce: "Menderes", odemeYapanAdres: "Toplu kabul adres " + (i + 1) }],
        kargo: { kargoAlicisi: "Toplu Alıcı " + (i + 1), kargoTel: "0" + (basePhone + 20 + i), il: "İzmir", ilce: "Menderes", adres: "Toplu kabul adres " + (i + 1), kargoFirmasi: "Aras Kargo" }
      });
    }
    return out;
  }

  function validateUltraFormForSave_(form) {
    var issues = [];
    if (!isValidPhone_(form && form.whatsAppTel)) issues.push("WhatsApp_Tel geçerli +905xxxxxxxxx formatına çevrilemedi");
    issues = issues.concat(nameIssues_("Sipariş_Sahibi", form && form.siparisSahibi));
    if (!(form && form.urunler && form.urunler.length) && !(form && form.hizliUrunGirisi)) issues.push("Ürün girişi eksik");
    if (!(form && form.odemeler && form.odemeler.length) && !(form && form.hizliOdemeGirisi)) issues.push("Ödeme girişi eksik");
    (form.odemeler || []).forEach(function (p, index) {
      issues = issues.concat(nameIssues_("Ödeme " + (index + 1) + " Ödeme_Yapan", p.odemeYapan));
      if (!num_(p.odemeTutari)) issues.push("Ödeme " + (index + 1) + ": Tutar eksik");
      if (!p.odemeYapanTcknVkn) issues.push("Ödeme " + (index + 1) + ": TCKN/VKN varsayılanı uygulanamadı");
      if (!isValidPhone_(p.odemeYapanTel)) issues.push("Ödeme " + (index + 1) + ": Ödeme_Yapan_Tel geçerli değil");
      if (!p.odemeYapanAdres || !p.odemeYapanIl || !p.odemeYapanIlce) issues.push("Ödeme " + (index + 1) + ": fatura adres/il/ilçe varsayılanı eksik");
    });
    (form.urunler || []).forEach(function (it, index) {
      if (!it.urunAdi) issues.push("Ürün " + (index + 1) + ": ürün seçimi net değil");
      if (!it.odemeYapan) issues.push("Ürün " + (index + 1) + ": ödeme yapan/fatura kişisi seçilmeli");
      if (!num_(it.birimFiyatKdvDahil) && !num_(it.toplamKdvDahil)) issues.push("Ürün " + (index + 1) + ": fiyat eksik");
    });
    if (!form.kargo || !form.kargo.kargoAlicisi) issues.push("Kargo_Alıcısı eksik");
    issues = issues.concat(nameIssues_("Kargo_Alıcısı", form.kargo && form.kargo.kargoAlicisi));
    if (!form.kargo || !isValidPhone_(form.kargo.kargoTel)) issues.push("Kargo_Tel geçerli değil");
    if (!form.kargo || !form.kargo.il || !form.kargo.ilce || !form.kargo.adres) issues.push("Kargo il/ilçe/adres eksik");
    (form.faturalar || []).forEach(function (f, index) {
      issues = issues.concat(nameIssues_("Fatura " + (index + 1) + " Fatura_Kişisi", f.faturaKisisi));
      if (f.faturaEmail && !isValidEmail_(f.faturaEmail)) issues.push("Fatura " + (index + 1) + ": Fatura_Eposta geçerli değil");
    });
    return issues;
  }

  function nameIssues_(label, value) {
    var raw = String(value || "").trim();
    if (!raw) return [label + " eksik"];
    var normalized = normalizePersonName_(raw);
    var parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length < 2) return [label + " ad soyad olarak en az iki kelime olmalı; birleşik yazıldıysa panelde elle düzeltin"];
    if (/^[^\s]{12,}$/.test(raw) && normalized.indexOf(" ") === -1) return [label + " birleşik yazılmış görünüyor; ad ve soyadı boşlukla ayırın"];
    return [];
  }

  function isValidPhone_(value) {
    return /^\+905\d{9}$/.test(normalizePhone_(value));
  }

  function isValidEmail_(value) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value || "").trim());
  }

  function ultraSiparisKontrolEt_(form) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    form = normalizeUltraForm_(form || {}, ss);
    var issues = validateUltraFormForSave_(form);

    var cariAdaylari = [];
    if (form.openId) {
      (form.faturalar || []).forEach(function (f) {
        try {
          var found = parasutCariAdaylariniGetir_(f);
          (found.candidates || []).forEach(function (c) { cariAdaylari.push(c); });
        } catch (err) {
          issues.push("Cari aday kontrolü: " + safeErrorMessage_(err));
        }
      });
    }

    if (form.openId) {
      kontrolMerkeziniGuncelle_();
      var control = panelKontrolOzetiForOpen_(ss, form.openId);
      return { ok: !issues.length && control.ok, issues: issues.concat(control.issues || []), control: control, cariAdaylari: cariAdaylari };
    }
    if (!issues.length) issues.push("Gerçek 12_KONTROL_MERKEZI sonucu için önce Kaydet ve ERP güncelle çalıştırılmalı");
    return { ok: false, issues: issues, cariAdaylari: cariAdaylari };
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
    var itemId = String(parsed.urunKalemId || parsed.itemId || "").trim() || "UK-" + openId + "-" + sourceKey;
    var silverType = normalizeSilverAmountType_(parsed.silverAmountType || parsed.gumusTutarTipi || "");
    var payer = normalizePersonName_(parsed.payer || parsed.odemeYapan || parsed.paymentPayer || "");
    var linkId = parsed.invoiceCariLinkId || parsed.faturaCariBaglantiId || (payer ? invoiceCariLinkId_(openId, payer) : "");
    var warnings = [];
    if (!product) warnings.push("Ürün seçimi net değil");
    if (!unitGross && !gross) warnings.push("Ürün fiyatı girilmeli");
    if (productType_(product) === "Gümüş" && parsed.silverAmountType && !silverType) warnings.push("Gümüş_Tutar_Tipi Birim veya Toplam olmalı");
    var itemSheet = sheet_(ss, CFG.sheets.items);
    var existingRowNum = findRowByKeyText_(itemSheet, H.ITEM_ID, itemId);
    var existing = existingRowNum ? rowObjectFromSheetRow_(itemSheet, existingRowNum) : {};
    var nextStatus = existing[H.ITEM_STATUS] || (warnings.length ? "Kontrol Gerekli" : "Hazır");
    if (warnings.length && !existing[H.ITEM_STATUS]) nextStatus = "Kontrol Gerekli";
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
      [H.ITEM_STATUS]: nextStatus,
      [H.WARN]: warnings.join(" | ")
    });
    normalizeItemSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.items), H.ITEM_ID, itemId));
    return itemId;
  }

  function markOpenEditableRowsInactive_(ss, openId) {
    [
      { sheet: CFG.sheets.items, key: H.ITEM_STATUS },
      { sheet: CFG.sheets.payments, key: H.CONFIRM_STATUS }
    ].forEach(function (cfg) {
      var sh = sheet_(ss, cfg.sheet);
      var rows = objects_(sh);
      var changed = false;
      rows.forEach(function (row) {
        if (row[H.OPEN_ID] === openId && row[cfg.key] !== "İptal" && row[cfg.key] !== "Arşiv") {
          row[cfg.key] = "İptal";
          changed = true;
        }
      });
      if (changed) writeObjects_(sh, HEADERS[cfg.sheet === CFG.sheets.items ? "items" : "payments"], rows);
    });
  }

  function markMissingPanelRowsInactive_(ss, openId, submittedItemIds, submittedPaymentIds) {
    markMissingRowsById_(ss, CFG.sheets.items, HEADERS.items, H.ITEM_ID, H.ITEM_STATUS, openId, submittedItemIds || []);
    markMissingRowsById_(ss, CFG.sheets.payments, HEADERS.payments, H.PAYMENT_ID, H.CONFIRM_STATUS, openId, submittedPaymentIds || []);
  }

  function markMissingRowsById_(ss, sheetName, headers, idKey, statusKey, openId, submittedIds) {
    var keep = {};
    (submittedIds || []).forEach(function (id) { if (id) keep[String(id)] = true; });
    var sh = sheet_(ss, sheetName);
    var rows = objects_(sh);
    var changed = false;
    rows.forEach(function (row) {
      if (row[H.OPEN_ID] !== openId) return;
      var id = String(row[idKey] || "");
      if (!id || keep[id]) return;
      if (row[statusKey] === "İptal" || row[statusKey] === "Arşiv") return;
      row[statusKey] = "İptal";
      changed = true;
    });
    if (changed) writeObjects_(sh, headers, rows);
  }

  function appendPaymentRowFromParsed_(ss, openId, qid, parsed) {
    var payer = normalizePersonName_(parsed.payer || parsed.odemeYapan);
    var amount = normalizeTutar_(parsed.amount || parsed.odemeTutari);
    var sourceKey = parsed.sourceKey || safeKey_([openId, payer, amount].join("|"));
    var paymentId = String(parsed.odemeId || parsed.paymentId || "").trim() || "OD-" + openId + "-" + sourceKey;
    var linkId = parsed.invoiceCariLinkId || parsed.faturaCariBaglantiId || (payer ? invoiceCariLinkId_(openId, payer) : "");
    var paymentSheet = sheet_(ss, CFG.sheets.payments);
    var existingRowNum = findRowByKeyText_(paymentSheet, H.PAYMENT_ID, paymentId);
    var existing = existingRowNum ? rowObjectFromSheetRow_(paymentSheet, existingRowNum) : {};
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
      [H.CONFIRM_STATUS]: existing[H.CONFIRM_STATUS] || "Bekliyor",
      [H.OPERATOR_CONFIRM]: parsed.operatorConfirm || existing[H.OPERATOR_CONFIRM] || "Hayır"
    });
    normalizePaymentSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.payments), H.PAYMENT_ID, paymentId));
    return paymentId;
  }

  function upsertQuickCargo_(ss, openId, qid, cargo) {
    var summary = openSummaryById_(ss, openId);
    var packageId = navlungoIdText_(cargo && (cargo.kargoPaketId || cargo.cargoPackageId)) || cargoPackageIdForOpen_(ss, openId) || ("KP-" + openId);
    var cargoSheet = sheet_(ss, CFG.sheets.cargo);
    var existingRowNum = findRowByKeyText_(cargoSheet, H.CARGO_PACKAGE_ID, packageId) || findRowByKeyText_(cargoSheet, H.OPEN_ID, openId);
    var existing = existingRowNum ? rowObjectFromSheetRow_(cargoSheet, existingRowNum) : {};
    upsertObjectByKey_(cargoSheet, HEADERS.cargo, H.OPEN_ID, openId, {
      [H.CARGO_PACKAGE_ID]: packageId,
      [H.OPEN_ID]: openId,
      [H.CARGO_RECEIVER]: normalizePersonName_(cargo.receiver || cargo.kargoAlicisi || summary.owner || ""),
      [H.CARGO_TEL]: normalizePhone_(cargo.phone || cargo.kargoTel || summary.phone || ""),
      [H.CITY]: normalizeCity_(cargo.city || cargo.il || ""),
      [H.DISTRICT]: normalizeCity_(cargo.district || cargo.ilce || ""),
      [H.ADDRESS]: normalizeAddress_(cargo.address || cargo.adres || ""),
      [H.CARGO_COMPANY]: normalizeCargoCompany_(cargo.company || cargo.kargoFirmasi || setting_(ss, "VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany)),
      [H.PACKAGE_STATUS]: existing[H.PACKAGE_STATUS] || "Bekliyor",
      [H.PACKAGE_NOTE]: cargo.note || cargo.paketNotu || "",
      [H.CARGO_WAIT]: yes_(cargo.kargoBekletilsinMi || cargo.cargoWait) ? "Evet" : (existing[H.CARGO_WAIT] || "Hayır"),
      [H.CARGO_WAIT_REASON]: cargo.kargoBekletmeNedeni || cargo.cargoWaitReason || existing[H.CARGO_WAIT_REASON] || "",
      [H.CARGO_EXIT_DATE]: cargo.kargoCikisTarihi || cargo.cargoExitDate || existing[H.CARGO_EXIT_DATE] || "",
      [H.WARN]: cargo.warning || ""
    });
    normalizeCargoSheetRow_(ss, findRowByKey_(sheet_(ss, CFG.sheets.cargo), H.OPEN_ID, openId));
    return packageId;
  }

  function cargoPackageIdForOpen_(ss, openId) {
    var rows = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) {
      return navlungoIdText_(row[H.OPEN_ID]) === navlungoIdText_(openId) && navlungoIdText_(row[H.CARGO_PACKAGE_ID]);
    });
    var row = rows[rows.length - 1] || {};
    return navlungoIdText_(row[H.CARGO_PACKAGE_ID]);
  }

  function applyInvoicePanelHints_(ss, openId, form) {
    form = normalizeUltraForm_(form || {}, ss);
    var hints = {};
    (form.faturalar || []).forEach(function (f) {
      var name = normalizePersonName_(f.faturaKisisi || f.odemeYapan || "");
      if (name) hints[name] = f;
    });
    var rows = objects_(sheet_(ss, CFG.sheets.invoiceGroups));
    var changed = false;
    rows.forEach(function (row) {
      if (row[H.OPEN_ID] !== openId) return;
      var payer = normalizePersonName_(row[H.PAYER] || row[H.INVOICE_PERSON] || "");
      var f = hints[payer] || {};
      var phone = normalizePhone_(f.faturaTel || form.whatsAppTel || form.kargo.kargoTel || "");
      var requestedType = normalizeCariTipi_(f.cariTipi || row[H.CARI_TYPE], "", payer);
      var rawTax = normalizeTaxNo_(f.faturaTcknVkn || "");
      var taxNo = rawTax || (requestedType === "Tüzel Kişi" ? "" : setting_(ss, "TCKN_VARSAYILAN_GERCEK_KISI", CFG.defaultTckn));
      var address = normalizeAddress_(f.faturaAdres || form.kargo.adres || "");
      var city = normalizeCity_(f.faturaIl || form.kargo.il || "");
      var district = normalizeCity_(f.faturaIlce || form.kargo.ilce || "");
      var taxOffice = String(f.faturaVergiDairesi || "").trim();
      var email = String(f.faturaEmail || "").trim();
      var contactId = String(f.parasutCariId || "").trim();
      var cariType = normalizeCariTipi_(f.cariTipi || row[H.CARI_TYPE], taxNo, payer);
      if (cariType && row[H.CARI_TYPE] !== cariType) { row[H.CARI_TYPE] = cariType; changed = true; }
      if (requestedType === "Tüzel Kişi" && !rawTax && row[H.TAX_NO] === CFG.defaultTckn) { row[H.TAX_NO] = ""; changed = true; }
      if (phone && row[H.INVOICE_TEL] !== phone) { row[H.INVOICE_TEL] = phone; changed = true; }
      if (email && row[H.INVOICE_EMAIL] !== email) { row[H.INVOICE_EMAIL] = email; changed = true; }
      if (taxNo && row[H.TAX_NO] !== taxNo) { row[H.TAX_NO] = taxNo; changed = true; }
      if (taxOffice && row[H.TAX_OFFICE] !== taxOffice) { row[H.TAX_OFFICE] = taxOffice; changed = true; }
      if (address && row[H.INVOICE_ADDRESS] !== address) { row[H.INVOICE_ADDRESS] = address; changed = true; }
      if (city && row[H.INVOICE_CITY] !== city) { row[H.INVOICE_CITY] = city; changed = true; }
      if (district && row[H.INVOICE_DISTRICT] !== district) { row[H.INVOICE_DISTRICT] = district; changed = true; }
      if (!row[H.EBELGE_TYPE]) { row[H.EBELGE_TYPE] = ebelgeTipiBelirle_(row[H.TAX_NO], row[H.CARI_TYPE]); changed = true; }
      if (contactId && row[H.PARASUT_CONTACT_ID] !== contactId) { row[H.PARASUT_CONTACT_ID] = contactId; row[H.CARI_MATCH_STATUS] = "Manuel ID doğrulama gerekli"; row[H.CARI_ACTION] = "Paraşüt cari ID doğrula"; row[H.WARN] = ""; changed = true; }
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
    upsertMusteriAdresHistory_(ss, q, cargo);
    return true;
  }

  function addressHistoryForPhone_(ss, phone) {
    var normalized = normalizePhone_(phone || "");
    if (!normalized) return [];
    return objects_(sheet_(ss, CFG.sheets.addressMemory))
      .filter(function (row) { return normalizePhone_(row[H.PHONE]) === normalized && row[H.ADDRESS_STATUS] !== "Pasif"; })
      .sort(function (a, b) {
        var da = toDate_(a[H.LAST_USED]);
        var db = toDate_(b[H.LAST_USED]);
        return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
      });
  }

  function upsertMusteriAdresHistory_(ss, queueRow, cargoRow) {
    var phone = normalizePhone_(queueRow[H.PHONE] || cargoRow[H.CARGO_TEL] || "");
    var address = normalizeAddress_(cargoRow[H.ADDRESS] || "");
    if (!phone || !address) return false;
    var sh = sheet_(ss, CFG.sheets.addressMemory);
    var rows = objects_(sh);
    var key = safeKey_([phone, cargoRow[H.CARGO_RECEIVER], cargoRow[H.CITY], cargoRow[H.DISTRICT], address].join("|"));
    var addressId = "ADR-" + key;
    var next = copyByHeaders_(indexBy_(rows, H.ADDRESS_ID)[addressId] || {}, HEADERS.addressMemory, {
      [H.ADDRESS_ID]: addressId,
      [H.PHONE]: phone,
      [H.OWNER]: queueRow[H.OWNER] || "",
      [H.CARGO_RECEIVER]: cargoRow[H.CARGO_RECEIVER] || queueRow[H.OWNER] || "",
      [H.CARGO_TEL]: normalizePhone_(cargoRow[H.CARGO_TEL] || phone),
      [H.CITY]: normalizeCity_(cargoRow[H.CITY] || ""),
      [H.DISTRICT]: normalizeCity_(cargoRow[H.DISTRICT] || ""),
      [H.ADDRESS]: address,
      [H.CARGO_COMPANY]: cargoRow[H.CARGO_COMPANY] || CFG.defaultCargoCompany,
      [H.DEFAULT_ADDRESS]: "Evet",
      [H.LAST_USED]: new Date(),
      [H.ADDRESS_STATUS]: "Aktif",
      [H.WARN]: ""
    });
    rows = rows.map(function (row) {
      if (normalizePhone_(row[H.PHONE]) === phone) row[H.DEFAULT_ADDRESS] = "Hayır";
      return row;
    }).filter(function (row) { return row[H.ADDRESS_ID] !== addressId; });
    rows.push(next);
    writeObjects_(sh, HEADERS.addressMemory, rows);
    return true;
  }

  function hafifErpGuncelle_(openId) {
    if (!openId) return false;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    odemeleriKontrolEtForOpen_(ss, openId);
    urunKalemleriniKontrolEtForOpen_(ss, openId);
    faturaGruplariniOlusturForOpen_(ss, openId);
    rebuildOpenOrderForOpen_(ss, openId);
    kargoPaketleriniOlusturForOpen_(ss, openId);
    finans808OnizlemeOlusturForOpen_(ss, openId);
    parasutTaslaklariniHazirlaForOpen_(ss, openId);
    senkronizeDurumForOpen_(openId);
    ebelgeIstisnaHazirlaForOpen_(ss, openId);
    rebuildOpenOrderForOpen_(ss, openId);
    senkronizeDurumForOpen_(openId);
    kontrolMerkeziniGuncelleForOpen_(ss, openId);
    return true;
  }

  function rowsExceptOpen_(rows, openId) {
    return (rows || []).filter(function (row) { return row[H.OPEN_ID] !== openId; });
  }

  function replaceRowsForOpen_(ss, sheetName, headers, openId, nextRows) {
    var sh = sheet_(ss, sheetName);
    var existingRows = objects_(sh);
    var scopedRows = nextRows || [];
    var inserted = false;
    var rows = [];
    existingRows.forEach(function (row) {
      if (row[H.OPEN_ID] !== openId) {
        rows.push(row);
        return;
      }
      if (!inserted) {
        scopedRows.forEach(function (next) { rows.push(next); });
        inserted = true;
      }
    });
    if (!inserted) scopedRows.forEach(function (next) { rows.push(next); });
    writeObjects_(sh, headers, rows);
    return true;
  }

  function odemeleriKontrolEtForOpen_(ss, openId) {
    var sh = sheet_(ss, CFG.sheets.payments);
    var rows = objects_(sh);
    var scoped = rows.filter(function (row) { return row[H.OPEN_ID] === openId; });
    var seqByOpenPayer = {};
    var out = [];
    scoped.forEach(function (row) {
      if (!row[H.OPEN_ID] && !row[H.PAYER] && !row[H.PAYMENT_AMOUNT]) return;
      var warnings = [];
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
    return replaceRowsForOpen_(ss, CFG.sheets.payments, HEADERS.payments, openId, out);
  }

  function urunKalemleriniKontrolEtForOpen_(ss, openId) {
    var rows = objects_(sheet_(ss, CFG.sheets.items));
    var scoped = rows.filter(function (row) { return row[H.OPEN_ID] === openId; });
    var payments = objects_(sheet_(ss, CFG.sheets.payments)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var paymentsById = indexBy_(payments, H.PAYMENT_ID);
    var paymentsByOpen = groupBy_(payments, H.OPEN_ID);
    var productMap = productIdMap_(ss, false);
    var productMapEmpty = !Object.keys(productMap).length;
    var seqByOpen = {};
    var out = [];

    scoped.forEach(function (row, i) {
      if (!row[H.OPEN_ID] && !row[H.PRODUCT]) return;
      var warnings = [];
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
        [H.SILVER_MARGIN]: productType_(product) === "Gümüş" ? calculateSilverMarginFromNumbers_(row[H.SILVER_GRAM], row[H.SILVER_COST_UNIT], gross) : "",
        [H.PARASUT_PRODUCT_ID]: productId,
        [H.PAYMENT_ID]: paymentId,
        [H.INVOICE_GROUP_ID]: groupId,
        [H.ITEM_STATUS]: warnings.length ? "Kontrol Gerekli" : "Hazır",
        [H.WARN]: warnings.join(" | ")
      }));
    });
    return replaceRowsForOpen_(ss, CFG.sheets.items, HEADERS.items, openId, out);
  }

  function faturaGruplariniOlusturForOpen_(ss, openId) {
    var items = objects_(sheet_(ss, CFG.sheets.items)).filter(function (row) { return row[H.OPEN_ID] === openId && row[H.ITEM_STATUS] !== "İptal" && row[H.ITEM_STATUS] !== "Arşiv"; });
    var payments = objects_(sheet_(ss, CFG.sheets.payments)).filter(function (row) { return row[H.OPEN_ID] === openId && row[H.CONFIRM_STATUS] !== "İptal" && row[H.CONFIRM_STATUS] !== "Arşiv"; });
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
      var savedCariTypeHint = normalizeCariTipi_(saved[H.CARI_TYPE], "", invoicePerson || g.payer);
      var taxNo = normalizeTaxNo_(saved[H.TAX_NO] || (savedCariTypeHint === "Tüzel Kişi" ? "" : firstPayment[H.PAYER_TAX_NO]));
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
        [H.INVOICE_EMAIL]: saved[H.INVOICE_EMAIL] || "",
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
    return replaceRowsForOpen_(ss, CFG.sheets.invoiceGroups, HEADERS.invoiceGroups, openId, out);
  }

  function rebuildOpenOrderForOpen_(ss, openId) {
    var queueRows = objects_(sheet_(ss, CFG.sheets.queue));
    var qRows = queueRows.filter(function (row) { return row[H.OPEN_ID] === openId; });
    var first = qRows[0] || {};
    var items = objects_(sheet_(ss, CFG.sheets.items)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var payments = objects_(sheet_(ss, CFG.sheets.payments)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var groups = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var cargo = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) { return row[H.OPEN_ID] === openId; });
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
    return replaceRowsForOpen_(ss, CFG.sheets.open, HEADERS.open, openId, [copyByHeaders_({}, HEADERS.open, {
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
    })]);
  }

  function kargoPaketleriniOlusturForOpen_(ss, openId) {
    var open = objects_(sheet_(ss, CFG.sheets.open)).filter(function (row) { return row[H.OPEN_ID] === openId; })[0] || {};
    var existing = objects_(sheet_(ss, CFG.sheets.cargo));
    var row = existing.filter(function (r) { return r[H.OPEN_ID] === openId; })[0] || {};
    if (!row[H.CARGO_PACKAGE_ID] && !open[H.OPEN_ID]) return replaceRowsForOpen_(ss, CFG.sheets.cargo, HEADERS.cargo, openId, []);
    var closed = isClosedText_(open[H.ORDER_STATUS]);
    var wait = yes_(row[H.CARGO_WAIT]);
    var warnings = [];
    [H.CARGO_RECEIVER, H.CARGO_TEL, H.CITY, H.DISTRICT, H.ADDRESS].forEach(function (key) {
      if (!row[key]) warnings.push(key + " eksik");
    });
    if (!closed && row[H.BARCODE]) warnings.push("Açık siparişte barkodlu paket için revizyon kontrolü gerekli");
    return replaceRowsForOpen_(ss, CFG.sheets.cargo, HEADERS.cargo, openId, [copyByHeaders_(row, HEADERS.cargo, {
      [H.CARGO_PACKAGE_ID]: row[H.CARGO_PACKAGE_ID] || "KP-" + openId,
      [H.OPEN_ID]: openId,
      [H.CARGO_RECEIVER]: row[H.CARGO_RECEIVER] || "",
      [H.CARGO_TEL]: normalizePhone_(row[H.CARGO_TEL]),
      [H.CITY]: row[H.CITY] || "",
      [H.DISTRICT]: row[H.DISTRICT] || "",
      [H.ADDRESS]: normalizeAddress_(row[H.ADDRESS]),
      [H.CARGO_COMPANY]: row[H.CARGO_COMPANY] || setting_(ss, "VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany),
      [H.BARCODE]: row[H.BARCODE] || "",
      [H.TRACKING_NO]: row[H.TRACKING_NO] || "",
      [H.LATE_ADD]: row[H.LATE_ADD] || "Hayır",
      [H.PACKAGE_NOTE]: row[H.PACKAGE_NOTE] || "",
      [H.PACKAGE_STATUS]: wait ? "Bekletiliyor" : (warnings.length ? "Blokaj" : (row[H.NAVLUNGO_POST_NUMBER] ? "Gönderi Oluşturuldu" : "Hazır")),
      [H.CARGO_WAIT]: row[H.CARGO_WAIT] || "Hayır",
      [H.CARGO_WAIT_REASON]: row[H.CARGO_WAIT_REASON] || "",
      [H.CARGO_EXIT_DATE]: row[H.CARGO_EXIT_DATE] || "",
      [H.WARN]: wait ? "" : warnings.join(" | ")
    })]);
  }

  function finans808OnizlemeOlusturForOpen_(ss, openId) {
    var items = objects_(sheet_(ss, CFG.sheets.items)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var payments = objects_(sheet_(ss, CFG.sheets.payments)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var gross = sum_(items, H.LINE_GROSS);
    var net = sum_(items, H.LINE_NET);
    var vat = sum_(items, H.VAT_AMOUNT);
    var pay = sum_(payments, H.PAYMENT_AMOUNT);
    var diff = round2_(pay - gross);
    return replaceRowsForOpen_(ss, CFG.sheets.finance808, HEADERS.finance808, openId, [{
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
    }]);
  }

  function parasutTaslaklariniHazirlaForOpen_(ss, openId) {
    var groups = indexBy_(objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.INVOICE_GROUP_ID);
    var itemsByGroup = groupBy_(objects_(sheet_(ss, CFG.sheets.items)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.INVOICE_GROUP_ID);
    var previous = indexBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
    var out = [];

    Object.keys(groups).sort().forEach(function (gid) {
      var group = groups[gid];
      var groupItems = itemsByGroup[gid] || [];
      groupItems.forEach(function (item) {
        var warnings = [];
        var sent = group[H.SEND_LOCK] === "Evet" || group[H.PARASUT_INVOICE_ID];
        if (!group[H.PARASUT_CONTACT_ID]) warnings.push("Paraşüt cari ID yok");
        if (!sent && group[H.INVOICE_STATUS] !== "Hazır") warnings.push(group[H.WARN] || "Fatura grubu hazır değil");
        if (!sent && !item[H.PARASUT_PRODUCT_ID]) warnings.push("Paraşüt ürün ID mapping yok");
        var canSend = warnings.length ? "Hayır" : "Evet";
        var sentOk = sent && !warnings.length;
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
          [H.PARASUT_STATUS]: sentOk ? "Gönderildi" : (canSend === "Evet" ? "Taslak Hazır" : "Blokaj"),
          [H.SEND_LOCK]: group[H.SEND_LOCK] || "Hayır",
          [H.PAYLOAD_CHECK]: sentOk ? "Fatura gönderilmiş; tekrar gönderim kapalı" : (canSend === "Evet" ? "Payload hazır" : warnings.join(" | ")),
          [H.PAYLOAD_JSON]: saved[H.PAYLOAD_JSON] || "",
          [H.RESPONSE_JSON]: saved[H.RESPONSE_JSON] || "",
          [H.SEND_DATE]: saved[H.SEND_DATE] || "",
          [H.ERROR]: sentOk || canSend === "Evet" ? "" : warnings.join(" | "),
          [H.CAN_SEND_DRAFT]: sentOk ? "Hayır" : canSend,
          [H.DRAFT_BLOCK]: sentOk ? "" : warnings.join(" | "),
          [H.NOTE]: saved[H.NOTE] || ""
        });
      });
    });
    return replaceRowsForOpen_(ss, CFG.sheets.parasut, HEADERS.parasut, openId, out);
  }

  function ebelgeIstisnaHazirlaForOpen_(ss, openId) {
    var parasutByGroup = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.INVOICE_GROUP_ID);
    var out = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (group) { return group[H.OPEN_ID] === openId; }).map(function (group) {
      var rows = parasutByGroup[group[H.INVOICE_GROUP_ID]] || [];
      var hasSilver = rows.some(function (r) { return productType_(r[H.PRODUCT]) === "Gümüş"; });
      var hasVatZero = rows.some(function (r) { return num_(r[H.VAT_RATE]) === 0; });
      var warnings = [];
      var preparationNote = group[H.PARASUT_INVOICE_ID] ? "" : "Paraşüt satış faturası taslak ID bekleniyor";
      if (hasVatZero && !setting_(ss, "ISTISNA_KODU_RESMI", "")) warnings.push("Resmi istisna kodu/onayı yok");
      var sendStatus = warnings.length ? "Blokaj" : (preparationNote ? "Hazırlık" : "Gönderime Hazır");
      return {
        [H.EBELGE_ID]: "EB-" + group[H.INVOICE_GROUP_ID],
        [H.INVOICE_GROUP_ID]: group[H.INVOICE_GROUP_ID],
        [H.OPEN_ID]: group[H.OPEN_ID],
        [H.PARASUT_INVOICE_ID]: group[H.PARASUT_INVOICE_ID],
        [H.INVOICE_PERSON]: group[H.INVOICE_PERSON],
        [H.TAX_NO]: group[H.TAX_NO],
        [H.CARI_TYPE]: group[H.CARI_TYPE],
        [H.EBELGE_TYPE]: group[H.EBELGE_TYPE] || ebelgeTipiBelirle_(group[H.TAX_NO], group[H.CARI_TYPE]),
        [H.HAS_SILVER]: hasSilver ? "Evet" : "Hayır",
        [H.HAS_VAT_ZERO]: hasVatZero ? "Evet" : "Hayır",
        [H.NEED_EXEMPTION]: hasVatZero ? "Evet" : "Hayır",
        [H.EXEMPTION_CODE]: hasVatZero ? setting_(ss, "ISTISNA_KODU_RESMI", "") : "",
        [H.EXEMPTION_DESC]: hasVatZero ? "11_EBELGE_ISTISNA resmi karar alanı" : "",
        [H.SEND_STATUS]: sendStatus,
        [H.OFFICIAL_APPROVAL]: yes_(setting_(ss, CFG.liveEbelgeSendSetting, "Hayır")) ? "Evet" : "Hayır",
        [H.OFFICIAL_BLOCK]: warnings.join(" | "),
        [H.CONTROL_LEVEL]: warnings.length ? "Blokaj" : (preparationNote ? "Hazırlık" : "OK")
      };
    });
    return replaceRowsForOpen_(ss, CFG.sheets.ebelge, HEADERS.ebelge, openId, out);
  }

  function controlRowRelatedToOpen_(row, openId) {
    var sourceId = String(row[H.SOURCE_ID] || "");
    var warning = String(row[H.WARN] || "");
    return sourceId === openId || sourceId.indexOf(openId) !== -1 || warning.indexOf(openId) !== -1;
  }

  function kontrolMerkeziniGuncelleForOpen_(ss, openId) {
    var issues = [];
    collectIssues_(issues, CFG.sheets.open, objects_(sheet_(ss, CFG.sheets.open)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.OPEN_ID, H.BLOCK_REASON, "ERP", "Kritik");
    collectIssues_(issues, CFG.sheets.items, objects_(sheet_(ss, CFG.sheets.items)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.ITEM_ID, H.WARN, "Ürün", "Yüksek");
    collectIssues_(issues, CFG.sheets.payments, objects_(sheet_(ss, CFG.sheets.payments)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.PAYMENT_ID, H.WARN, "Ödeme", "Yüksek");
    collectIssues_(issues, CFG.sheets.invoiceGroups, objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.INVOICE_GROUP_ID, H.WARN, "Fatura", "Kritik");
    collectIssues_(issues, CFG.sheets.parasut, objects_(sheet_(ss, CFG.sheets.parasut)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.INVOICE_GROUP_ID, H.DRAFT_BLOCK, "Paraşüt", "Kritik");
    collectIssues_(issues, CFG.sheets.cargo, objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.CARGO_PACKAGE_ID, H.WARN, "Kargo", "Yüksek");
    collectIssues_(issues, CFG.sheets.ebelge, objects_(sheet_(ss, CFG.sheets.ebelge)).filter(function (row) { return row[H.OPEN_ID] === openId; }), H.EBELGE_ID, H.OFFICIAL_BLOCK, "e-Belge", "Kritik");
    var sh = sheet_(ss, CFG.sheets.control);
    var keep = objects_(sh).filter(function (row) { return !controlRowRelatedToOpen_(row, openId); });
    writeObjects_(sh, HEADERS.control, keep.concat(issues));
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
        [H.SILVER_MARGIN]: productType_(product) === "Gümüş" ? calculateSilverMarginFromNumbers_(row[H.SILVER_GRAM], row[H.SILVER_COST_UNIT], gross) : "",
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
    var items = objects_(sheet_(ss, CFG.sheets.items)).filter(function (row) { return row[H.ITEM_STATUS] !== "İptal" && row[H.ITEM_STATUS] !== "Arşiv"; });
    var payments = objects_(sheet_(ss, CFG.sheets.payments)).filter(function (row) { return row[H.CONFIRM_STATUS] !== "İptal" && row[H.CONFIRM_STATUS] !== "Arşiv"; });
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
      var savedCariTypeHint = normalizeCariTipi_(saved[H.CARI_TYPE], "", invoicePerson || g.payer);
      var taxNo = normalizeTaxNo_(saved[H.TAX_NO] || (savedCariTypeHint === "Tüzel Kişi" ? "" : firstPayment[H.PAYER_TAX_NO]));
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
        [H.INVOICE_EMAIL]: saved[H.INVOICE_EMAIL] || "",
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
        var sent = group[H.SEND_LOCK] === "Evet" || group[H.PARASUT_INVOICE_ID];
        if (!group[H.PARASUT_CONTACT_ID]) warnings.push("Paraşüt cari ID yok");
        if (!sent && group[H.INVOICE_STATUS] !== "Hazır") warnings.push(group[H.WARN] || "Fatura grubu hazır değil");
        if (!sent && !item[H.PARASUT_PRODUCT_ID]) warnings.push("Paraşüt ürün ID mapping yok");
        var canSend = warnings.length ? "Hayır" : "Evet";
        var sentOk = sent && !warnings.length;
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
          [H.PARASUT_STATUS]: sentOk ? "Gönderildi" : (canSend === "Evet" ? "Taslak Hazır" : "Blokaj"),
          [H.SEND_LOCK]: group[H.SEND_LOCK] || "Hayır",
          [H.PAYLOAD_CHECK]: sentOk ? "Fatura gönderilmiş; tekrar gönderim kapalı" : (canSend === "Evet" ? "Payload hazır" : warnings.join(" | ")),
          [H.PAYLOAD_JSON]: saved[H.PAYLOAD_JSON] || "",
          [H.RESPONSE_JSON]: saved[H.RESPONSE_JSON] || "",
          [H.SEND_DATE]: saved[H.SEND_DATE] || "",
          [H.ERROR]: sentOk || canSend === "Evet" ? "" : warnings.join(" | "),
          [H.CAN_SEND_DRAFT]: sentOk ? "Hayır" : canSend,
          [H.DRAFT_BLOCK]: sentOk ? "" : warnings.join(" | "),
          [H.NOTE]: saved[H.NOTE] || ""
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
      var wait = yes_(row[H.CARGO_WAIT]);
      var warnings = [];
      [H.CARGO_RECEIVER, H.CARGO_TEL, H.CITY, H.DISTRICT, H.ADDRESS].forEach(function (key) {
        if (!row[key]) warnings.push(key + " eksik");
      });
      if (!closed && row[H.BARCODE]) warnings.push("Açık siparişte barkodlu paket için revizyon kontrolü gerekli");
      out.push(copyByHeaders_(row, HEADERS.cargo, {
        [H.CARGO_PACKAGE_ID]: row[H.CARGO_PACKAGE_ID] || "KP-" + openId,
        [H.OPEN_ID]: openId,
        [H.CARGO_RECEIVER]: row[H.CARGO_RECEIVER] || "",
        [H.CARGO_TEL]: normalizePhone_(row[H.CARGO_TEL]),
        [H.CITY]: row[H.CITY] || "",
        [H.DISTRICT]: row[H.DISTRICT] || "",
        [H.ADDRESS]: normalizeAddress_(row[H.ADDRESS]),
        [H.CARGO_COMPANY]: row[H.CARGO_COMPANY] || setting_(ss, "VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany),
        [H.PACKAGE_STATUS]: wait ? "Bekletiliyor" : (warnings.length ? "Blokaj" : (row[H.NAVLUNGO_POST_NUMBER] ? "Gönderi Oluşturuldu" : "Hazır")),
        [H.BARCODE]: row[H.BARCODE] || "",
        [H.TRACKING_NO]: row[H.TRACKING_NO] || "",
        [H.LATE_ADD]: row[H.LATE_ADD] || "Hayır",
        [H.PACKAGE_NOTE]: row[H.PACKAGE_NOTE] || "",
        [H.CARGO_WAIT]: row[H.CARGO_WAIT] || "Hayır",
        [H.CARGO_WAIT_REASON]: row[H.CARGO_WAIT_REASON] || "",
        [H.CARGO_EXIT_DATE]: row[H.CARGO_EXIT_DATE] || "",
        [H.WARN]: wait ? "" : warnings.join(" | ")
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
      var preparationNote = group[H.PARASUT_INVOICE_ID] ? "" : "Paraşüt satış faturası taslak ID bekleniyor";
      if (hasVatZero && !setting_(ss, "ISTISNA_KODU_RESMI", "")) warnings.push("Resmi istisna kodu/onayı yok");
      var sendStatus = warnings.length ? "Blokaj" : (preparationNote ? "Hazırlık" : "Gönderime Hazır");
      return {
        [H.EBELGE_ID]: "EB-" + group[H.INVOICE_GROUP_ID],
        [H.INVOICE_GROUP_ID]: group[H.INVOICE_GROUP_ID],
        [H.OPEN_ID]: group[H.OPEN_ID],
        [H.PARASUT_INVOICE_ID]: group[H.PARASUT_INVOICE_ID],
        [H.INVOICE_PERSON]: group[H.INVOICE_PERSON],
        [H.TAX_NO]: group[H.TAX_NO],
        [H.CARI_TYPE]: group[H.CARI_TYPE],
        [H.EBELGE_TYPE]: group[H.EBELGE_TYPE] || ebelgeTipiBelirle_(group[H.TAX_NO], group[H.CARI_TYPE]),
        [H.HAS_SILVER]: hasSilver ? "Evet" : "Hayır",
        [H.HAS_VAT_ZERO]: hasVatZero ? "Evet" : "Hayır",
        [H.NEED_EXEMPTION]: hasVatZero ? "Evet" : "Hayır",
        [H.EXEMPTION_CODE]: hasVatZero ? setting_(ss, "ISTISNA_KODU_RESMI", "") : "",
        [H.EXEMPTION_DESC]: hasVatZero ? "11_EBELGE_ISTISNA resmi karar alanı" : "",
        [H.SEND_STATUS]: sendStatus,
        [H.OFFICIAL_APPROVAL]: yes_(setting_(ss, CFG.liveEbelgeSendSetting, "Hayır")) ? "Evet" : "Hayır",
        [H.OFFICIAL_BLOCK]: warnings.join(" | "),
        [H.CONTROL_LEVEL]: warnings.length ? "Blokaj" : (preparationNote ? "Hazırlık" : "OK")
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

  function kontrolMerkezineTeknikBlokajYaz_(ss, sourceSheet, sourceId, message, action, moduleName) {
    var rows = objects_(sheet_(ss, CFG.sheets.control)).filter(function (row) {
      return !(row[H.SOURCE_SHEET] === sourceSheet && row[H.SOURCE_ID] === sourceId && row[H.CTRL_TYPE] === "Panel teknik kontrol");
    });
    rows.push({
      [H.CTRL_ID]: "CTRL-" + safeKey_([sourceSheet, sourceId, message].join("|")),
      [H.DATE]: new Date(),
      [H.SOURCE_SHEET]: sourceSheet,
      [H.SOURCE_ID]: sourceId,
      [H.CTRL_TYPE]: "Panel teknik kontrol",
      [H.RISK]: "Kritik",
      [H.STATUS]: "Açık",
      [H.WARN]: message,
      [H.ACTION_EXPECTED]: action,
      [H.RESPONSIBLE]: "Operatör",
      [H.IS_BLOCK]: "Evet",
      [H.MODULE]: moduleName || "Paraşüt"
    });
    writeObjects_(sheet_(ss, CFG.sheets.control), HEADERS.control, rows);
  }

  function parasutFaturaTaslakGonder_(optionalGroupId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    parasutTaslaklariniHazirla_();
    var live = yes_(setting_(ss, CFG.liveParasutSendSetting, "Hayır"));
    var batchLimit = Number(setting_(ss, CFG.batchLimitSetting, 3)) || 3;
    var rowsByGroup = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
    var result = [];
    var syncedOpenIds = {};
    var finalSyncOpenIds = {};
    Object.keys(rowsByGroup).filter(function (gid) { return !optionalGroupId || gid === optionalGroupId; }).slice(0, batchLimit).forEach(function (gid) {
      var pRows = rowsByGroup[gid];
      var openId = pRows[0] && pRows[0][H.OPEN_ID] || "";
      if (openId && !syncedOpenIds[openId]) {
        senkronizeDurumForOpen_(openId);
        parasutTaslaklariniHazirlaForOpen_(ss, openId);
        syncedOpenIds[openId] = true;
        rowsByGroup = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
        pRows = rowsByGroup[gid] || pRows;
      }
      if (openId) finalSyncOpenIds[openId] = true;
      var block = pRows.map(function (r) { return r[H.DRAFT_BLOCK]; }).filter(Boolean).join(" | ");
      if (block) {
        result.push({ groupId: gid, status: "Blokaj", message: block });
        return;
      }
      var alreadySent = pRows.some(function (row) { return row[H.PARASUT_INVOICE_ID] || row[H.SEND_LOCK] === "Evet"; });
      if (alreadySent) {
        updateParasutRows_(ss, gid, { [H.PARASUT_STATUS]: "Kilitli", [H.ERROR]: "Fatura grubu daha önce gönderilmiş; tekrar gönderim durdu" });
        result.push({ groupId: gid, status: "Blokaj", message: "Fatura grubu daha önce gönderilmiş; tekrar gönderim durdu" });
        return;
      }
      var chain = parasutZincirToplamlariUygunMu_(ss, gid, pRows);
      if (!chain.ok) {
        updateParasutRows_(ss, gid, { [H.PARASUT_STATUS]: "Blokaj", [H.ERROR]: chain.message });
        result.push({ groupId: gid, status: "Blokaj", message: chain.message });
        return;
      }
      var payload = parasutSalesInvoicePayload_(gid, pRows);
      var payloadCheck = parasutPayloadKontrol_(payload);
      if (!payloadCheck.ok) {
        updateParasutRows_(ss, gid, { [H.PARASUT_STATUS]: "Blokaj", [H.PAYLOAD_CHECK]: payloadCheck.status, [H.ERROR]: payloadCheck.status });
        result.push({ groupId: gid, status: "Blokaj", message: payloadCheck.status });
        return;
      }
      if (!live) {
        updateParasutRows_(ss, gid, {
          [H.PARASUT_STATUS]: "Taslak Hazır",
          [H.PAYLOAD_CHECK]: payloadCheck.status,
          [H.PAYLOAD_JSON]: safeJson_(payload),
          [H.ERROR]: "",
          [H.NOTE]: "Canlı gönderim kapalı; create payload hazır"
        });
        result.push({ groupId: gid, status: "Canlı Gönderim Kapalı", payload: payload });
        return;
      }
      if (openId) kontrolMerkeziniGuncelleForOpen_(ss, openId);
      else kontrolMerkeziniGuncelle_();
      if (openId ? kontrolMerkezindeKritikBlokajVarForOpen_(ss, openId) : kontrolMerkezindeKritikBlokajVar_(ss)) {
        result.push({ groupId: gid, status: "Blokaj", message: "Kontrol merkezi açık blokaj içeriyor" });
        return;
      }
      try {
        var apiResult = parasutApiPost_("/sales_invoices", payload);
        var invoiceId = apiResult && apiResult.data ? apiResult.data.id : "";
        updateParasutRows_(ss, gid, {
          [H.PARASUT_INVOICE_ID]: invoiceId,
          [H.PARASUT_STATUS]: "Gönderildi",
          [H.SEND_LOCK]: "Evet",
          [H.PAYLOAD_CHECK]: payloadCheck.status,
          [H.PAYLOAD_JSON]: safeJson_(payload),
          [H.RESPONSE_JSON]: safeJson_(apiResult),
          [H.SEND_DATE]: new Date(),
          [H.ERROR]: "",
          [H.NOTE]: "Paraşüt yanıt ID: " + invoiceId
        });
        updateInvoiceGroupSendResult_(ss, gid, invoiceId, "Gönderildi", "Evet", "");
        result.push({ groupId: gid, status: "Gönderildi", result: apiResult });
      } catch (err) {
        var msg = safeErrorMessage_(err);
        updateParasutRows_(ss, gid, { [H.PARASUT_STATUS]: "Hata", [H.PAYLOAD_JSON]: safeJson_(payload), [H.ERROR]: msg });
        updateInvoiceGroupSendResult_(ss, gid, "", "Hata", "Hayır", msg);
        result.push({ groupId: gid, status: "Hata", message: msg });
      }
    });
    Object.keys(finalSyncOpenIds).forEach(function (openId) { senkronizeDurumForOpen_(openId); });
    return result;
  }

  function parasutTaslakPayloadTestEt_(optionalGroupId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    parasutTaslaklariniHazirla_();
    var groups = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
    var ids = Object.keys(groups).filter(function (gid) { return !optionalGroupId || gid === optionalGroupId; });
    var synced = {};
    ids.forEach(function (gid) {
      var openId = groups[gid] && groups[gid][0] && groups[gid][0][H.OPEN_ID];
      if (!openId || synced[openId]) return;
      senkronizeDurumForOpen_(openId);
      parasutTaslaklariniHazirlaForOpen_(ss, openId);
      synced[openId] = true;
    });
    if (ids.length) {
      groups = groupBy_(objects_(sheet_(ss, CFG.sheets.parasut)), H.INVOICE_GROUP_ID);
      ids = Object.keys(groups).filter(function (gid) { return !optionalGroupId || gid === optionalGroupId; });
    }
    if (!ids.length) {
      kontrolMerkezineTeknikBlokajYaz_(ss, "07_PARASUT_FATURA", optionalGroupId || "GENEL", "Payload üretilecek Paraşüt taslak satırı yok", "Önce ürün, ödeme, fatura grubu ve cari bilgilerini tamamlayın.");
      throw new Error("Payload üretilecek Paraşüt taslak satırı yok. 07_PARASUT_FATURA için ürün/ödeme/fatura/cari bağlantısını kontrol edin.");
    }
    var draftBlock = (groups[ids[0]] || []).map(function (row) { return row[H.DRAFT_BLOCK]; }).filter(Boolean).join(" | ");
    if (draftBlock) {
      kontrolMerkezineTeknikBlokajYaz_(ss, "07_PARASUT_FATURA", ids[0], draftBlock, "Paraşüt cari ID, ürün ID ve toplam blokajlarını çözün.");
      throw new Error("Fatura payload dry-run blokajı: " + draftBlock);
    }
    var payload = parasutSalesInvoicePayload_(ids[0], groups[ids[0]]);
    var check = parasutPayloadKontrol_(payload);
    updateParasutRows_(ss, ids[0], {
      [H.PARASUT_STATUS]: check.ok ? "Taslak Hazır" : "Blokaj",
      [H.PAYLOAD_CHECK]: check.status,
      [H.PAYLOAD_JSON]: check.ok ? safeJson_(payload) : "",
      [H.ERROR]: check.ok ? "" : check.status,
      [H.NOTE]: check.ok ? "API POST yapılmadan create payload üretildi" : ""
    });
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
    if (!yes_(setting_(SpreadsheetApp.getActiveSpreadsheet(), "PARASUT_CARI_CANLI_OLUSTURMA", "Hayır"))) {
      return { ok: false, status: "Cari oluşturma canlı kapısı kapalı; payload hazırlandı", contactId: "", payload: payload, livePost: "Yapılmadı" };
    }
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

  function seciliParasutCariAdaylariniGetir_() {
    var ctx = selectedContext_({ allowedSheets: [CFG.sheets.invoiceGroups, CFG.sheets.parasut, CFG.sheets.open, CFG.sheets.queue, CFG.sheets.items, CFG.sheets.payments] });
    var groupId = selectedInvoiceGroupId_(ctx);
    var group = findObjectByKeyText_(sheet_(ctx.ss, CFG.sheets.invoiceGroups), H.INVOICE_GROUP_ID, groupId);
    if (!group) throw new Error("Seçili kayıt için fatura grubu bulunamadı: " + groupId);
    var result = parasutCariAdaylariniGetir_(cariCriteriaFromGroup_(group));
    result.groupId = groupId;
    result.openId = group[H.OPEN_ID] || ctx.openId || "";
    return result;
  }

  function seciliParasutTaslakPayloadTestEt_() {
    var ctx = selectedContext_({ allowedSheets: [CFG.sheets.invoiceGroups, CFG.sheets.parasut, CFG.sheets.open, CFG.sheets.queue, CFG.sheets.items, CFG.sheets.payments] });
    var groupId = selectedInvoiceGroupId_(ctx);
    return parasutTaslakPayloadTestEt_(groupId);
  }

  function seciliParasutFaturaTaslakGonderOnayli_() {
    var ctx = selectedContext_({ allowedSheets: [CFG.sheets.invoiceGroups, CFG.sheets.parasut, CFG.sheets.open, CFG.sheets.queue, CFG.sheets.items, CFG.sheets.payments] });
    var groupId = selectedInvoiceGroupId_(ctx);
    confirmUi_("Paraşüt taslak gönder", "Seçili kayıt:\n" + contextSummary_(ctx) + "\nFatura_Grubu_ID=" + groupId + "\n\nCanlı kapılar:\n" + liveGateSummary_(ctx.ss) + "\n\nDevam edilsin mi?");
    return parasutFaturaTaslakGonderOnayli_(groupId);
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
      if (!created.contactId) return created;
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

  function parasutCariPanelAksiyonu_(openId, payer, mode, contactId) {
    if (!openId) throw new Error("Cari çözümü için önce Kaydet ve ERP güncelle çalıştırılmalı.");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var targetPayer = normalizePersonName_(payer || "");
    var group = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (row) {
      return row[H.OPEN_ID] === openId && normalizePersonName_(row[H.PAYER] || row[H.INVOICE_PERSON]) === targetPayer;
    })[0];
    if (!group) throw new Error("Fatura/Cari grubu bulunamadı: " + targetPayer);
    return parasutCariOlusturVeyaBagla_(group[H.INVOICE_GROUP_ID], { mode: mode || "auto", contactId: contactId || "" });
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
    var detailRows = [];
    rows.forEach(function (row) {
      detailRows.push({
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
          details: { data: detailRows }
        }
      }
    };
  }

  function parasutPayloadKontrol_(payload) {
    var issues = [];
    var data = payload && payload.data ? payload.data : {};
    if (data.type !== "sales_invoices") issues.push("data.type sales_invoices değil");
    if (!data.attributes || data.attributes.item_type !== "invoice") issues.push("attributes.item_type invoice değil");
    if (!data.relationships || !data.relationships.contact || !data.relationships.contact.data || !data.relationships.contact.data.id) issues.push("contact relationship eksik");
    var details = data.relationships && data.relationships.details && data.relationships.details.data;
    if (!details || !details.length) issues.push("details satırı yok");
    if (payload.included && payload.included.length) issues.push("included kullanılmamalı; yeni satış faturası satırları relationships.details.data içinde ID olmadan gönderilmeli");
    (details || []).forEach(function (detail, index) {
      if (detail.id || detail.lid || detail.item_id || detail.invoice_detail_id) issues.push("detail " + (index + 1) + " mevcut kayıt referansı içeriyor");
      if (detail.type !== "sales_invoice_details") issues.push("detail " + (index + 1) + " type hatalı");
      if (!detail.relationships || !detail.relationships.product || !detail.relationships.product.data || !detail.relationships.product.data.id) issues.push("detail " + (index + 1) + " product relationship eksik");
      if (!detail.attributes || num_(detail.attributes.quantity) <= 0) issues.push("detail " + (index + 1) + " quantity eksik");
      if (!detail.attributes || num_(detail.attributes.unit_price) <= 0) issues.push("detail " + (index + 1) + " unit_price eksik");
      if (!detail.attributes || detail.attributes.vat_rate === "" || detail.attributes.vat_rate === null || detail.attributes.vat_rate === undefined) issues.push("detail " + (index + 1) + " vat_rate eksik");
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
      ["PARASUT_CARI_CANLI_OLUSTURMA", "Hayır", "Evet olmadan Paraşüt cari POST yapılmaz", "Evet", now, ""],
      ["EBELGE_CANLI_GONDERIM", "Hayır", "Evet olmadan e-Belge/e-Fatura canlı gönderimi yapılmaz", "Evet", now, ""],
      ["NAVLUNGO_CANLI_GONDERIM", "Hayır", "Evet olmadan canlı kargo gönderimi yapılmaz", "Evet", now, ""],
      ["NAVLUNGO_ENV", "QA", "QA veya LIVE Navlungo ortamı", "Evet", now, "Varsayılan QA kalır"],
      ["NAVLUNGO_TEST_MODE", "Evet", "Navlungo kargo denemeleri test işaretiyle yürür", "Evet", now, ""],
      ["NAVLUNGO_LOGIN_URL", "https://navlungo.com/login?target=%2Fauthorize%3Fclient_id%3DNavlungoFEClient%26code_challenge%3DreKPD4SOOWikQq2MR%252FnNjlT8fLh1uEDFPezXpDK15Ck%253D%26redirect_uri%3Dhttps%253A%252F%252Fdomestic.navlungo.com%252Fauth%252Fcallback%26scope%3Dopenid%2Boffline_access%2BIdentityServerApi%2Broles%2Bpostalcode_check", "Operatörün tarayıcıdan giriş yapacağı Navlungo panel adresi", "Hayır", now, "API token endpoint değildir"],
      ["NAVLUNGO_SENDER_ADDRESS_ID", "", "Navlungo kayıtlı gönderici adres ID", "Hayır", now, "Script Properties önceliklidir"],
      ["NAVLUNGO_DEFAULT_CARRIER_ID", "1", "Varsayılan taşıyıcı ID", "Evet", now, "1 otomatik kapsam ayarıdır"],
      ["NAVLUNGO_DEFAULT_POST_TYPE", "2", "Varsayılan gönderi tipi", "Evet", now, "2 standart teslimat"],
      ["NAVLUNGO_DEFAULT_DESI", "1", "Varsayılan desi", "Evet", now, ""],
      ["NAVLUNGO_DEFAULT_PACKAGE_COUNT", "1", "Varsayılan paket adedi", "Evet", now, ""],
      ["NAVLUNGO_DEFAULT_BARCODE_TYPE", "pdf", "Varsayılan barkod tipi", "Evet", now, "Geçerli barkod tipleri: pdf, zpl, zpl-10"],
      ["NAVLUNGO_DEFAULT_BARCODE_FORMAT", "", "Gönderi oluşturma barkod formatı", "Hayır", now, "Geçerli formatlar: html, pdf-A5, pdf-A6, pdf-A6Y, pdf-A7"],
      ["NAVLUNGO_CARRIER_ID_MAP_JSON", "{\"Aras Kargo\":\"1\",\"Yurtiçi Kargo\":\"2\"}", "Panel kargo firması -> Navlungo carrier_id map JSON", "Evet", now, "Kargo firması varsa map eşleşmesi zorunludur"],
      ["QZ_TRAY_AKTIF", "Evet", "Panel barkod yazdırma bağlantısı", "Hayır", now, ""],
      ["QZ_PRINTER_NAME", "RP4xx Series 200DPI TSC", "Windows barkod yazıcı adı", "Hayır", now, ""],
      ["QZ_AUTO_PRINT_AFTER_BARCODE", "Evet", "Barkod URL oluşunca panel otomatik yazdırır", "Hayır", now, ""],
      ["QZ_PRINT_COPIES", "1", "Barkod yazdırma kopya adedi", "Hayır", now, ""],
      ["QZ_PRINT_MODE", "pdf", "QZ barkod yazdırma veri tipi", "Hayır", now, ""],
      ["SISTEM_OPERASYON_SAATI_KAPANIS", CFG.cutoff, "Operasyon kapanış saati", "Evet", now, ""],
      ["TCKN_VARSAYILAN_GERCEK_KISI", CFG.defaultTckn, "Gerçek kişi TCKN boş ise kullanılır", "Evet", now, ""],
      ["BANKA_HAREKET_MODULU_AKTIF", "Evet", "14_BANKA_HAREKETLERI ödeme teyit yardımcısıdır", "Evet", now, ""],
      ["VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany, "Kargo firması boşsa önerilir", "Hayır", now, ""],
      ["KARGO_UCRETI_STANDART", String(CFG.defaultCargoFee), "808 finans ön izleme için varsayılan kargo maliyeti", "Hayır", now, ""]
    ];
    var rows = required.filter(function (r) { return existing[r[0]] === undefined; });
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
    normalizeNavlungoSettings_(ss);
  }

  function normalizeNavlungoSettings_(ss) {
    var sh = sheet_(ss, CFG.sheets.settings);
    if (!sh || sh.getLastRow() < 2) return;
    var h = headers_(sh);
    if (h[H.SETTING_KEY] === undefined || h[H.SETTING_VALUE] === undefined) return;
    var values = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
    var typeRow = -1;
    var formatRow = -1;
    values.forEach(function (row, index) {
      if (row[h[H.SETTING_KEY]] === "NAVLUNGO_DEFAULT_BARCODE_TYPE") typeRow = index;
      if (row[h[H.SETTING_KEY]] === "NAVLUNGO_DEFAULT_BARCODE_FORMAT") formatRow = index;
    });
    if (typeRow < 0) return;
    var rawType = String(values[typeRow][h[H.SETTING_VALUE]] || "").trim();
    var typeKey = rawType.toLowerCase();
    var formatMap = navlungoBarcodeFormatMap_();
    var changed = false;
    if (!(typeKey === "pdf" || typeKey === "zpl" || typeKey === "zpl-10")) {
      values[typeRow][h[H.SETTING_VALUE]] = "pdf";
      changed = true;
      if (formatRow >= 0 && formatMap[typeKey] && !String(values[formatRow][h[H.SETTING_VALUE]] || "").trim()) {
        values[formatRow][h[H.SETTING_VALUE]] = formatMap[typeKey];
      }
    }
    if (changed) sh.getRange(2, 1, values.length, sh.getLastColumn()).setValues(values);
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
        [H.ACTION_EXPECTED]: expectedActionForIssue_(sheetName, msg, module),
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

  function expectedActionForIssue_(sheetName, msg, module) {
    var text = String(msg || "");
    if (text.indexOf("Paraşüt cari ID yok") !== -1 || text.indexOf("Cari çözümü gerekli") !== -1) {
      return "Ultra Sipariş Paneli > Fatura/Cari bölümünden Cari seç veya Cari oluştur akışını çalıştırın; cari ID elle kopyalanmayacak.";
    }
    if (text.indexOf("Ürün ve ödeme toplamı eşleşmiyor") !== -1 || text.indexOf("Ödeme ve ürün toplamı eşleşmiyor") !== -1) {
      return "Ürün toplamı ile ödeme toplamını panelde karşılaştırın; eksik ödeme varsa ödeme ekleyin, ürün yanlışsa ürün satırını düzeltin.";
    }
    if (text.indexOf("Ürün kalemi yok") !== -1) {
      return "Ultra Sipariş Paneli > Ürünler bölümünden en az bir ürün satırı ekleyin.";
    }
    if (text.indexOf("Ödeme yok") !== -1 || text.indexOf("Ödeme_Yapan eksik") !== -1) {
      return "Ultra Sipariş Paneli > Ödemeler bölümünde ödeme yapan kişi ve tutarı girin.";
    }
    if (text.indexOf("TCKN") !== -1 || text.indexOf("VKN") !== -1) {
      return "Fatura/Cari bölümünde gerçek kişi için TCKN veya varsayılan 11111111111, tüzel kişi için geçerli VKN girin.";
    }
    if (text.indexOf("Kargo") !== -1 || sheetName === CFG.sheets.cargo || module === "Kargo") {
      return "Ultra Sipariş Paneli > Kargo bölümünde alıcı, telefon, il, ilçe ve adresi tamamlayın.";
    }
    if (text.indexOf("e-Belge") !== -1 || sheetName === CFG.sheets.ebelge || module === "e-Belge") {
      return "11_EBELGE_ISTISNA karar alanlarını kontrol edin; resmi gönderim canlı kapısı kapalıyken sadece hazırlık yapılır.";
    }
    if (text.indexOf("Paraşüt") !== -1 || sheetName === CFG.sheets.parasut || module === "Paraşüt") {
      return "Paraşüt taslak satırını panelden kontrol edin; ürün ID, cari ID ve toplam eşleşmesi temiz olmadan gönderim yapılmaz.";
    }
    return "Ultra Sipariş Paneli kontrol özetindeki ilgili alanı düzeltip Kaydet ve ERP güncelle çalıştırın.";
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

  function assignSync_(row, key, value) {
    var next = value == null ? "" : value;
    if (String(row[key] == null ? "" : row[key]) === String(next)) return false;
    row[key] = next;
    return true;
  }

  function uniqSyncMessages_(rows, fields, skipFn) {
    var seen = {};
    var out = [];
    (rows || []).forEach(function (row) {
      if (skipFn && skipFn(row)) return;
      (fields || []).forEach(function (field) {
        var msg = String(row[field] || "").trim();
        if (!msg || seen[msg]) return;
        seen[msg] = true;
        out.push(msg);
      });
    });
    return out;
  }

  function statusHas_(value, needle) {
    return normalizeAscii_(value).indexOf(normalizeAscii_(needle)) !== -1;
  }

  function invoiceSyncStatus_(groups, parasutRows) {
    if (!groups.length && !parasutRows.length) return "Hazırlık";
    var rows = (groups || []).concat(parasutRows || []);
    var sentCount = groups.filter(function (row) { return !!row[H.PARASUT_INVOICE_ID]; }).length;
    if (groups.length && sentCount === groups.length) return "Gönderildi";
    if (sentCount > 0) return "Kısmi Gönderildi";
    if (rows.some(function (row) { return statusHas_(row[H.INVOICE_STATUS] || row[H.PARASUT_STATUS], "Hata") || !!row[H.ERROR]; })) return "Hata";
    if (rows.some(function (row) { return statusHas_(row[H.INVOICE_STATUS] || row[H.PARASUT_STATUS], "Blokaj") || !!row[H.WARN] || !!row[H.DRAFT_BLOCK]; })) return "Blokaj";
    if (rows.some(function (row) { return yes_(row[H.SEND_LOCK]); })) return "Kilitli";
    if (groups.length && groups.every(function (row) { return row[H.INVOICE_STATUS] === "Hazır"; })) return "Hazır";
    return "Hazırlık";
  }

  function cargoSyncStatus_(cargoRows) {
    if (!cargoRows.length) return "Bekliyor";
    if (cargoRows.some(function (row) { return !!row[H.WARN]; })) return "Blokaj";
    if (cargoRows.some(function (row) { return yes_(row[H.CARGO_WAIT]) || statusHas_(row[H.PACKAGE_STATUS], "Beklet") || statusHas_(row[H.NAVLUNGO_STATUS], "Beklet"); })) return "Bekletiliyor";
    if (cargoRows.every(function (row) { return row[H.NAVLUNGO_POST_NUMBER] && row[H.NAVLUNGO_BARCODE_URL]; })) return "Barkod Alındı";
    if (cargoRows.some(function (row) { return row[H.NAVLUNGO_POST_NUMBER]; })) return "Gönderi Oluşturuldu";
    if (cargoRows.some(function (row) { return statusHas_(row[H.NAVLUNGO_STATUS], "Payload"); })) return "Payload Hazır";
    if (cargoRows.every(function (row) { return row[H.PACKAGE_STATUS] === "Hazır"; })) return "Hazır";
    return cargoRows[0][H.PACKAGE_STATUS] || "Bekliyor";
  }

  function ebelgeSyncStatus_(rows) {
    if (!rows.length) return "Hazırlık";
    if (rows.some(function (row) { return row[H.OFFICIAL_BLOCK] || statusHas_(row[H.CONTROL_LEVEL], "Blokaj"); })) return "Blokaj";
    if (rows.every(function (row) { return statusHas_(row[H.SEND_STATUS], "Gönderildi"); })) return "Gönderildi";
    if (rows.every(function (row) { return statusHas_(row[H.SEND_STATUS], "Hazır"); })) return "Gönderime Hazır";
    return "Hazırlık";
  }

  function syncOpenMessages_(payments, groups, parasutRows, cargoRows, ebelgeRows) {
    var messages = [];
    messages = messages.concat(uniqSyncMessages_(payments, [H.WARN]));
    messages = messages.concat(uniqSyncMessages_(groups, [H.WARN]));
    messages = messages.concat(uniqSyncMessages_(parasutRows, [H.ERROR, H.DRAFT_BLOCK], function (row) {
      return !!row[H.PARASUT_INVOICE_ID] || yes_(row[H.SEND_LOCK]);
    }));
    messages = messages.concat(uniqSyncMessages_(cargoRows, [H.WARN]));
    messages = messages.concat(uniqSyncMessages_(ebelgeRows, [H.OFFICIAL_BLOCK]));
    return uniqSyncMessages_(messages.map(function (msg) { return { msg: msg }; }), ["msg"]);
  }

  function senkronizeDurumForOpen_(openId) {
    openId = String(openId || "").trim();
    if (!openId) throw new Error("Açık_Sipariş_ID zorunlu.");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var groupSheet = sheet_(ss, CFG.sheets.invoiceGroups);
    var parasutSheet = sheet_(ss, CFG.sheets.parasut);
    var openSheet = sheet_(ss, CFG.sheets.open);
    var groupRows = objects_(groupSheet);
    var parasutRows = objects_(parasutSheet);
    var payments = objects_(sheet_(ss, CFG.sheets.payments)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var cargoRows = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var ebelgeRows = objects_(sheet_(ss, CFG.sheets.ebelge)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var controlRows = objects_(sheet_(ss, CFG.sheets.control)).filter(function (row) {
      var sourceId = String(row[H.SOURCE_ID] || "");
      return sourceId === openId || sourceId.indexOf(openId) !== -1;
    });
    var scopedGroups = groupRows.filter(function (row) { return row[H.OPEN_ID] === openId; });
    var scopedParasut = parasutRows.filter(function (row) { return row[H.OPEN_ID] === openId; });
    var groupIds = {};
    scopedGroups.forEach(function (row) { if (row[H.INVOICE_GROUP_ID]) groupIds[row[H.INVOICE_GROUP_ID]] = true; });
    scopedParasut.forEach(function (row) { if (row[H.INVOICE_GROUP_ID]) groupIds[row[H.INVOICE_GROUP_ID]] = true; });
    var changedGroups = false;
    var changedParasut = false;

    Object.keys(groupIds).forEach(function (gid) {
      var groups = groupRows.filter(function (row) { return row[H.INVOICE_GROUP_ID] === gid; });
      var pRows = parasutRows.filter(function (row) { return row[H.INVOICE_GROUP_ID] === gid; });
      var invoiceId = "";
      groups.concat(pRows).some(function (row) {
        invoiceId = String(row[H.PARASUT_INVOICE_ID] || "").trim();
        return !!invoiceId;
      });
      var hasLock = !!invoiceId || groups.concat(pRows).some(function (row) { return yes_(row[H.SEND_LOCK]); });
      var detailsReady = pRows.length && pRows.every(function (row) {
        return !!row[H.PARASUT_PRODUCT_ID] && num_(row[H.QTY]) > 0 && num_(row[H.UNIT_NET]) > 0;
      });
      var groupReady = groups.length && detailsReady && groups.every(function (row) {
        return !!row[H.PARASUT_CONTACT_ID] && Math.abs(num_(row[H.DIFF])) < 0.01 && num_(row[H.ITEM_SUM]) > 0 && num_(row[H.GROUP_PAYMENT_SUM]) > 0;
      });
      var pError = "";
      pRows.some(function (row) {
        var candidate = row[H.ERROR] || (statusHas_(row[H.PARASUT_STATUS], "Hata") ? row[H.PARASUT_STATUS] : "");
        if (candidate && !(groupReady && statusHas_(candidate, "Fatura grubu hazır değil"))) {
          pError = candidate;
          return true;
        }
        return false;
      });
      groups.forEach(function (row) {
        if (invoiceId) {
          changedGroups = assignSync_(row, H.PARASUT_INVOICE_ID, invoiceId) || changedGroups;
          changedGroups = assignSync_(row, H.SEND_LOCK, "Evet") || changedGroups;
          changedGroups = assignSync_(row, H.INVOICE_STATUS, "Gönderildi") || changedGroups;
          changedGroups = assignSync_(row, H.WARN, "") || changedGroups;
        } else if (pError) {
          changedGroups = assignSync_(row, H.INVOICE_STATUS, "Hata") || changedGroups;
          changedGroups = assignSync_(row, H.WARN, pError) || changedGroups;
        } else if (hasLock) {
          changedGroups = assignSync_(row, H.SEND_LOCK, "Evet") || changedGroups;
          changedGroups = assignSync_(row, H.INVOICE_STATUS, "Kilitli") || changedGroups;
        } else if (groupReady) {
          changedGroups = assignSync_(row, H.INVOICE_STATUS, "Hazır") || changedGroups;
          changedGroups = assignSync_(row, H.WARN, "") || changedGroups;
        }
      });
      pRows.forEach(function (row) {
        if (invoiceId) {
          changedParasut = assignSync_(row, H.PARASUT_INVOICE_ID, invoiceId) || changedParasut;
          changedParasut = assignSync_(row, H.SEND_LOCK, "Evet") || changedParasut;
          changedParasut = assignSync_(row, H.PARASUT_STATUS, "Gönderildi") || changedParasut;
          changedParasut = assignSync_(row, H.CAN_SEND_DRAFT, "Hayır") || changedParasut;
          changedParasut = assignSync_(row, H.DRAFT_BLOCK, "") || changedParasut;
          changedParasut = assignSync_(row, H.ERROR, "") || changedParasut;
        } else if (hasLock) {
          changedParasut = assignSync_(row, H.SEND_LOCK, "Evet") || changedParasut;
          changedParasut = assignSync_(row, H.PARASUT_STATUS, "Kilitli") || changedParasut;
          changedParasut = assignSync_(row, H.CAN_SEND_DRAFT, "Hayır") || changedParasut;
          changedParasut = assignSync_(row, H.PAYLOAD_CHECK, "Gönderim kilidi var; tekrar gönderim kapalı") || changedParasut;
          changedParasut = assignSync_(row, H.DRAFT_BLOCK, "") || changedParasut;
        } else if (pError) {
          changedParasut = assignSync_(row, H.PARASUT_STATUS, "Hata") || changedParasut;
          changedParasut = assignSync_(row, H.ERROR, pError) || changedParasut;
        } else if (groupReady) {
          changedParasut = assignSync_(row, H.PARASUT_STATUS, "Taslak Hazır") || changedParasut;
          changedParasut = assignSync_(row, H.CAN_SEND_DRAFT, "Evet") || changedParasut;
          changedParasut = assignSync_(row, H.DRAFT_BLOCK, "") || changedParasut;
          changedParasut = assignSync_(row, H.ERROR, "") || changedParasut;
        }
      });
    });

    if (changedGroups) writeObjects_(groupSheet, HEADERS.invoiceGroups, groupRows);
    if (changedParasut) writeObjects_(parasutSheet, HEADERS.parasut, parasutRows);

    scopedGroups = objects_(groupSheet).filter(function (row) { return row[H.OPEN_ID] === openId; });
    scopedParasut = objects_(parasutSheet).filter(function (row) { return row[H.OPEN_ID] === openId; });
    var invoiceStatus = invoiceSyncStatus_(scopedGroups, scopedParasut);
    var cargoStatus = cargoSyncStatus_(cargoRows);
    var ebelgeStatus = ebelgeSyncStatus_(ebelgeRows);
    var messages = syncOpenMessages_(payments, scopedGroups, scopedParasut, cargoRows, ebelgeRows);
    var hasBlock = messages.length || invoiceStatus === "Hata" || invoiceStatus === "Blokaj" || cargoStatus === "Blokaj" || ebelgeStatus === "Blokaj";
    var openRows = objects_(openSheet);
    var changedOpen = false;
    openRows.forEach(function (row) {
      if (row[H.OPEN_ID] !== openId) return;
      changedOpen = assignSync_(row, H.INVOICE_STATUS, invoiceStatus) || changedOpen;
      changedOpen = assignSync_(row, H.CARGO_STATUS, cargoStatus) || changedOpen;
      changedOpen = assignSync_(row, H.EBELGE_STATUS, ebelgeStatus) || changedOpen;
      changedOpen = assignSync_(row, H.CONTROL_LEVEL, hasBlock ? "Blokaj" : "Hazır") || changedOpen;
      changedOpen = assignSync_(row, H.WARN, messages.join(" | ")) || changedOpen;
      changedOpen = assignSync_(row, H.BLOCK_REASON, messages.join(" | ")) || changedOpen;
      changedOpen = assignSync_(row, H.CLOSE_OK, hasBlock ? "Hayır" : (row[H.CLOSE_OK] || "Evet")) || changedOpen;
    });
    if (changedOpen) writeObjects_(openSheet, HEADERS.open, openRows);
    return {
      ok: true,
      openId: openId,
      invoiceStatus: invoiceStatus,
      cargoStatus: cargoStatus,
      ebelgeStatus: ebelgeStatus,
      messageCount: messages.length,
      controlRowsRead: controlRows.length,
      changed: {
        invoiceGroups: changedGroups,
        parasut: changedParasut,
        open: changedOpen
      }
    };
  }

  function kontrolMerkezindeKritikBlokajVar_(ss, moduleName) {
    return objects_(sheet_(ss, CFG.sheets.control)).some(function (row) {
      return row[H.STATUS] === "Açık" && row[H.IS_BLOCK] === "Evet" && (!moduleName || row[H.MODULE] === moduleName);
    });
  }

  function kontrolMerkezindeKritikBlokajVarForOpen_(ss, openId) {
    return panelKontrolOzetiForOpen_(ss, openId).issues.some(function (issue) {
      return issue.block === "Evet";
    });
  }

  function panelKontrolOzetiForOpen_(ss, openId) {
    var rows = objects_(sheet_(ss, CFG.sheets.control));
    var related = rows.filter(function (row) {
      if (!openId) return row[H.STATUS] === "Açık" && row[H.IS_BLOCK] === "Evet";
      var sourceId = String(row[H.SOURCE_ID] || "");
      return row[H.STATUS] === "Açık" && row[H.IS_BLOCK] === "Evet" && (
        sourceId === openId ||
        sourceId.indexOf(openId) !== -1 ||
        String(row[H.WARN] || "").indexOf(openId) !== -1
      );
    }).map(function (row) {
      return {
        sheet: row[H.SOURCE_SHEET],
        id: row[H.SOURCE_ID],
        risk: row[H.RISK],
        message: row[H.WARN],
        action: row[H.ACTION_EXPECTED],
        block: row[H.IS_BLOCK]
      };
    });
    return {
      ok: related.length === 0,
      openId: openId || "",
      issues: related,
      summary: related.length ? related.map(function (x) { return x.sheet + " / " + x.id + ": " + x.message + " -> " + x.action; }) : ["12_KONTROL_MERKEZI temiz"]
    };
  }

  function ensureCoreSheetsReadyForSave_(ss) {
    var missing = [];
    Object.keys(HEADERS).forEach(function (key) {
      if (key === "guide") return;
      var sheetName = CFG.sheets[key];
      var sh = sheetName ? sheet_(ss, sheetName) : null;
      if (!sh || sh.getLastRow() < 1) {
        missing.push(sheetName || key);
        return;
      }
      var h = headers_(sh);
      HEADERS[key].forEach(function (name) {
        if (h[name] === undefined) missing.push(sheetName + "." + name);
      });
    });
    if (missing.length) {
      sistemKolonlariniHazirla_();
    }
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
      email: group[H.INVOICE_EMAIL],
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
      email: String(criteria.email || "").trim(),
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
          phone: c.phone,
          email: c.email
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

  function navlungoTokenAl_() {
    var props = PropertiesService.getScriptProperties();
    var credential = navlungoCredentialState_();
    if (!credential.ok) throw new Error(credential.message);
    var username = credential.username;
    var password = credential.password;
    var env = credential.env;
    var response = UrlFetchApp.fetch(navlungoBaseUrl_() + "auth/api", {
      method: "post",
      contentType: "application/json",
      headers: { "Accept": "application/json", "X-localization": "tr" },
      payload: JSON.stringify({ username: username, password: password }),
      muteHttpExceptions: true
    });
    var status = response.getResponseCode();
    var text = response.getContentText();
    if (status === 422) {
      throw new Error("Navlungo token hata 422 (" + env + "): Kullanıcı bilgileri seçili API ortamında kabul edilmedi. Okunan property çifti: " + credential.usernameKey + " / " + credential.passwordKey + ". Panel giriş e-posta/şifresi API credential değildir. QA için QA panelindeki Entegrasyonlar alanından API kullanıcı adı ve API şifresi alınmalı; LIVE için canlı API kullanıcı adı ve API şifresi kullanılmalıdır." + navlungoCredentialEnvHint_(env) + " Yanıt: " + sanitizeApiText_(text));
    }
    if (status < 200 || status >= 300) throw new Error("Navlungo token hata " + status + ": " + sanitizeApiText_(text));
    var parsed = navlungoJson_(text);
    var data = parsed.data || parsed;
    var accessToken = data.access_token || parsed.access_token || "";
    if (!accessToken) throw new Error("Navlungo token yanıtında access_token yok.");
    var expiresAt = navlungoTokenExpiresAt_(data.expires_in || parsed.expires_in);
    props.setProperty("NAVLUNGO_ACCESS_TOKEN", accessToken);
    props.setProperty("NAVLUNGO_ACCESS_TOKEN_EXPIRES_AT", expiresAt);
    return { ok: true, status: "Navlungo token alındı", tokenType: data.token_type || parsed.token_type || "Bearer", expiresAt: expiresAt };
  }

  function navlungoBaglantiTestiTam_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var keys = navlungoRequiredPropertyKeys_();
    var credential = navlungoCredentialState_();
    Logger.log((credential.usernameExists ? "[OK] " : "[HATA] ") + credential.usernameLogKey + " " + (credential.usernameExists ? "var" : "yok"));
    Logger.log((credential.passwordExists ? "[OK] " : "[HATA] ") + credential.passwordLogKey + " " + (credential.passwordExists ? "var" : "yok"));
    var status = keys.map(function (key) {
      var exists = key === "NAVLUNGO_API_USERNAME" || key === "NAVLUNGO_API_PASSWORD"
        ? (key === "NAVLUNGO_API_USERNAME" ? credential.usernameExists : credential.passwordExists)
        : setting_(ss, key, "") !== "";
      return { key: key, exists: exists };
    });
    if (!credential.ok) {
      var missingMessage = credential.message;
      Logger.log("[HATA] " + missingMessage);
      return {
        ok: false,
        env: navlungoEnv_(),
        baseUrl: navlungoBaseUrl_(),
        properties: status,
        token: { ok: false, status: missingMessage },
        carrier: { ok: false, status: "Credential eksik" },
        livePost: "Yapılmadı",
        error: missingMessage
      };
    }
    Logger.log("[OK] NAVLUNGO_ENV = " + navlungoEnv_());
    Logger.log("[OK] Navlungo API base URL = " + navlungoBaseUrl_());
    Logger.log("[OK] Navlungo panel giriş URL ayarı var");
    var token;
    try {
      token = navlungoTokenAl_();
      Logger.log("[OK] Navlungo token alındı");
    } catch (err) {
      Logger.log("[HATA] Navlungo token alınamadı: " + safeErrorMessage_(err));
      throw err;
    }
    var carrier = navlungoCarrierListesiAl_();
    Logger.log((carrier.ok ? "[OK] Navlungo carrier kontrolü başarılı" : "[HATA] Navlungo carrier kontrolü başarısız: " + carrier.status));
    Logger.log(yes_(setting_(ss, CFG.liveNavlungoSendSetting, "Hayır")) ? "[HATA] NAVLUNGO_CANLI_GONDERIM açık" : "[OK] NAVLUNGO_CANLI_GONDERIM kapalı");
    Logger.log("[OK] Canlı gönderi POST yapılmadı");
    return {
      ok: status.every(function (x) { return x.exists; }) && token.ok && carrier.ok,
      env: navlungoEnv_(),
      baseUrl: navlungoBaseUrl_(),
      properties: status,
      token: token,
      carrier: carrier,
      livePost: "Yapılmadı"
    };
  }

  function navlungoTaslakPayloadOlustur_(kargoPaketId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cargo = navlungoCargoRow_(ss, kargoPaketId);
    var issues = navlungoCargoIssues_(ss, cargo);
    if (issues.length) {
      navlungoErrorYaz_(ss, cargo[H.CARGO_PACKAGE_ID], "Navlungo payload üretilemedi: " + issues.join("; "), "08_KARGO_PAKETLERI kargo alıcı, telefon, il, ilçe, adres ve gönderici adres ID alanlarını tamamlayın.");
      throw new Error("Navlungo kargo payload blokajı: " + issues.join("; "));
    }
    var carrier;
    try { carrier = navlungoCarrierInfo_(ss, cargo); }
    catch (err) {
      navlungoErrorYaz_(ss, cargo[H.CARGO_PACKAGE_ID], safeErrorMessage_(err), "01_AYARLAR içindeki Navlungo taşıyıcı ayarlarını tamamlayın.");
      throw err;
    }
    var referenceId = cargo[H.NAVLUNGO_REFERENCE_ID] || cargo[H.CARGO_PACKAGE_ID] || cargo[H.OPEN_ID];
    var recipient = navlungoRecipientFromCargo_(ss, cargo);
    var payload = {
      platform: "tesbih_kuyusu",
      posts: [{
        reference_id: referenceId,
        carrier_id: carrier.id,
        post_type: numberOrDefault_(setting_(ss, "NAVLUNGO_DEFAULT_POST_TYPE", "2"), 2),
        cod_payment_type: "",
        sender: { addressId: String(setting_(ss, "NAVLUNGO_SENDER_ADDRESS_ID", "") || "") },
        recipient: recipient,
        post: {
          desi: numberOrDefault_(setting_(ss, "NAVLUNGO_DEFAULT_DESI", "1"), 1),
          package_count: numberOrDefault_(setting_(ss, "NAVLUNGO_DEFAULT_PACKAGE_COUNT", "1"), 1),
          price: "",
          note: cargo[H.PACKAGE_NOTE] || cargo[H.OPEN_ID] || ""
        },
        custom_data_1: cargo[H.OPEN_ID] || "",
        custom_data_2: cargo[H.CARGO_PACKAGE_ID] || "",
        custom_data_3: "TESBIH_KUYUSU",
        custom_data_4: navlungoEnv_()
      }]
    };
    var barcodeFormat = navlungoBarcodeFormat_(ss);
    if (barcodeFormat) payload.posts[0].barcode_format = barcodeFormat;
    var hash = navlungoPayloadHash_(payload);
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, cargo[H.CARGO_PACKAGE_ID], {
      [H.NAVLUNGO_REFERENCE_ID]: referenceId,
      [H.NAVLUNGO_CARRIER_ID]: carrier.id,
      [H.NAVLUNGO_CARRIER_NAME]: carrier.name,
      [H.NAVLUNGO_STATUS]: "Payload Hazır",
      [H.NAVLUNGO_TEST]: "Evet",
      [H.NAVLUNGO_PAYLOAD_HASH]: hash,
      [H.NAVLUNGO_LAST_RESPONSE]: "Payload hazır; reference_id=" + referenceId + "; hash=" + hash,
      [H.NAVLUNGO_LAST_ERROR]: ""
    });
    return payload;
  }

  function navlungoKargoTaslakTestEt_(kargoPaketId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cargo = navlungoCargoRow_(ss, kargoPaketId);
    var payload = navlungoTaslakPayloadOlustur_(cargo[H.CARGO_PACKAGE_ID]);
    return { ok: true, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], payload: payload, livePost: "Yapılmadı", status: "Navlungo payload hazır" };
  }

  function navlungoKargoOlusturOnayli_(kargoPaketId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cargo = navlungoCargoRow_(ss, kargoPaketId);
    navlungoAssertCargoCanCreate_(cargo);
    var payload = navlungoTaslakPayloadOlustur_(cargo[H.CARGO_PACKAGE_ID]);
    if (!yes_(setting_(ss, CFG.liveNavlungoSendSetting, "Hayır"))) return navlungoNoPostResult_(cargo[H.CARGO_PACKAGE_ID], payload, "Canlı kargo gönderim kapısı kapalı");
    if (kontrolMerkezindeKritikBlokajVar_(ss, "Navlungo")) throw new Error("Kontrol merkezi Navlungo blokajı içeriyor; kargo gönderimi durdu.");
    var response;
    try { response = navlungoApiFetch_("post", "post/create", payload); }
    catch (err) {
      navlungoErrorYaz_(ss, cargo[H.CARGO_PACKAGE_ID], safeErrorMessage_(err), "Navlungo post/create payload ve hesap ayarlarını kontrol edin.");
      throw err;
    }
    var postNumber = navlungoResponseValue_(response, ["post_number", "postNumber", "number"]);
    var barcodeUrl = navlungoResponseValue_(response, ["barcode_url", "barcode", "barcodeUrl", "label_url"]);
    var trackingUrl = navlungoResponseValue_(response, ["tracking_url", "trackingUrl", "carrier_tracking_url"]);
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, cargo[H.CARGO_PACKAGE_ID], {
      [H.NAVLUNGO_POST_NUMBER]: postNumber,
      [H.NAVLUNGO_TRACKING_URL]: trackingUrl,
      [H.NAVLUNGO_BARCODE_URL]: barcodeUrl,
      [H.NAVLUNGO_STATUS]: "Gönderi Oluşturuldu",
      [H.PACKAGE_STATUS]: "Gönderi Oluşturuldu",
      [H.CARGO_WAIT]: "Hayır",
      [H.CARGO_WAIT_REASON]: "",
      [H.CARGO_EXIT_DATE]: new Date(),
      [H.NAVLUNGO_LAST_RESPONSE]: navlungoSafeJson_(response),
      [H.NAVLUNGO_CREATED_AT]: new Date(),
      [H.NAVLUNGO_LAST_ERROR]: ""
    });
    return { ok: true, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], postNumber: postNumber, trackingUrl: trackingUrl, barcodeUrl: barcodeUrl };
  }

  function navlungoBarkodAl_(kargoPaketId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cargo = navlungoCargoRow_(ss, kargoPaketId);
    var postNumber = cargo[H.NAVLUNGO_POST_NUMBER] || "";
    if (!postNumber) throw new Error("Navlungo barkod için gönderi ID yok.");
    var payload = {
      post_number: postNumber,
      barcode_type: navlungoBarcodeType_(ss)
    };
    if (!yes_(setting_(ss, CFG.liveNavlungoSendSetting, "Hayır"))) return navlungoNoPostResult_(cargo[H.CARGO_PACKAGE_ID], payload, "Canlı barkod kapısı kapalı");
    var response;
    try { response = navlungoApiFetch_("post", "barcode/getBarcode", payload); }
    catch (err) {
      navlungoErrorYaz_(ss, cargo[H.CARGO_PACKAGE_ID], safeErrorMessage_(err), "Navlungo barkod endpoint yanıtını kontrol edin.");
      throw err;
    }
    var barcodeUrl = navlungoResponseValue_(response, ["barcode_url", "barcode", "url", "label_url"]);
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, cargo[H.CARGO_PACKAGE_ID], {
      [H.NAVLUNGO_BARCODE_URL]: barcodeUrl,
      [H.NAVLUNGO_STATUS]: "Barkod Hazır",
      [H.PACKAGE_STATUS]: "Barkod Hazır",
      [H.NAVLUNGO_LAST_RESPONSE]: navlungoSafeJson_(response),
      [H.NAVLUNGO_LAST_ERROR]: ""
    });
    return { ok: true, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], barcodeUrl: barcodeUrl };
  }

  function navlungoGonderiSorgula_(kargoPaketId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cargo = navlungoCargoRow_(ss, kargoPaketId);
    var postNumber = cargo[H.NAVLUNGO_POST_NUMBER] || cargo[H.CARGO_PACKAGE_ID];
    var response;
    try { response = navlungoApiFetch_("get", "post/check/" + encodeURIComponent(String(postNumber)), null); }
    catch (err) {
      navlungoErrorYaz_(ss, cargo[H.CARGO_PACKAGE_ID], safeErrorMessage_(err), "Navlungo gönderi sorgulama yanıtını kontrol edin.");
      throw err;
    }
    var data = navlungoFirstData_(response);
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, cargo[H.CARGO_PACKAGE_ID], {
      [H.NAVLUNGO_STATUS]: data.status && data.status.status_name || data.status_name || response.message || "Sorgulandı",
      [H.NAVLUNGO_TRACKING_URL]: data.tracking_url || data.carrier_tracking_url || cargo[H.NAVLUNGO_TRACKING_URL] || "",
      [H.NAVLUNGO_BARCODE_URL]: data.barcode || data.barcode_url || cargo[H.NAVLUNGO_BARCODE_URL] || "",
      [H.NAVLUNGO_LAST_RESPONSE]: navlungoSafeJson_(response),
      [H.NAVLUNGO_LAST_ERROR]: ""
    });
    return { ok: true, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], response: response };
  }

  function navlungoGonderiIptalEt_(kargoPaketId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cargo = navlungoCargoRow_(ss, kargoPaketId);
    var postNumber = cargo[H.NAVLUNGO_POST_NUMBER] || "";
    if (!postNumber) throw new Error("Navlungo iptal için gönderi ID yok.");
    var payload = { post_number: postNumber };
    if (!yes_(setting_(ss, CFG.liveNavlungoSendSetting, "Hayır"))) return navlungoNoPostResult_(cargo[H.CARGO_PACKAGE_ID], payload, "Canlı iptal kapısı kapalı");
    var response;
    try { response = navlungoApiFetch_("post", "post/cancel", payload); }
    catch (err) {
      navlungoErrorYaz_(ss, cargo[H.CARGO_PACKAGE_ID], safeErrorMessage_(err), "Navlungo iptal endpoint yanıtını kontrol edin.");
      throw err;
    }
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, cargo[H.CARGO_PACKAGE_ID], {
      [H.NAVLUNGO_STATUS]: "İptal Edildi",
      [H.NAVLUNGO_CANCELLED_AT]: new Date(),
      [H.NAVLUNGO_LAST_RESPONSE]: navlungoSafeJson_(response),
      [H.NAVLUNGO_LAST_ERROR]: ""
    });
    return { ok: true, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], response: response };
  }

  function navlungoTopluKargoOlustur_(seciliPaketler) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rows = navlungoSelectedCargoRows_(ss, seciliPaketler);
    var results = rows.map(function (row) {
      try { return navlungoKargoOlusturOnayli_(row[H.CARGO_PACKAGE_ID]); }
      catch (err) { return { ok: false, kargoPaketId: row[H.CARGO_PACKAGE_ID], error: safeErrorMessage_(err) }; }
    });
    return { ok: results.every(function (r) { return r.ok !== false; }), count: results.length, results: results };
  }

  function seciliNavlungoTopluKargoOlustur_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ids = selectedCargoPackageIds_();
    confirmUi_("Navlungo toplu kargo oluştur", "Seçili Kargo_Paket_ID değerleri:\n" + ids.join("\n") + "\n\nCanlı kapılar:\n" + liveGateSummary_(ss) + "\n\nDevam edilsin mi?");
    return navlungoTopluKargoOlustur_(ids);
  }

  function navlungoTopluBarkodAl_(seciliPaketler) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rows = navlungoSelectedCargoRows_(ss, seciliPaketler).filter(function (row) { return row[H.NAVLUNGO_POST_NUMBER]; });
    var results = rows.map(function (row) {
      try { return navlungoBarkodAl_(row[H.CARGO_PACKAGE_ID]); }
      catch (err) { return { ok: false, kargoPaketId: row[H.CARGO_PACKAGE_ID], error: safeErrorMessage_(err) }; }
    });
    return { ok: results.every(function (r) { return r.ok !== false; }), count: results.length, results: results };
  }

  function navlungoAdresDegisikligiKontrolEt_(acikSiparisId) {
    var cargo = objects_(sheet_(SpreadsheetApp.getActiveSpreadsheet(), CFG.sheets.cargo)).filter(function (r) { return r[H.OPEN_ID] === acikSiparisId; })[0] || {};
    var needsReview = !!(cargo[H.BARCODE] || cargo[H.NAVLUNGO_POST_NUMBER]) && !!cargo[H.ADDRESS];
    return { ok: true, openId: acikSiparisId, barkodVar: needsReview, yenidenBasimKontrolu: needsReview ? "Gerekli" : "Gerekli değil" };
  }

  function navlungoBarcodeType_(ss) {
    var raw = String(setting_(ss, "NAVLUNGO_DEFAULT_BARCODE_TYPE", setting_(ss, "NAVLUNGO_DEFAULT_BARCODE_FORMAT", "pdf")) || "").trim();
    var key = raw.toLowerCase();
    if (key === "pdf" || key === "zpl" || key === "zpl-10") return key;
    return "pdf";
  }

  function navlungoBarcodeFormat_(ss) {
    var raw = String(setting_(ss, "NAVLUNGO_DEFAULT_BARCODE_FORMAT", "") || "").trim();
    var key = raw.toLowerCase();
    var formats = navlungoBarcodeFormatMap_();
    return formats[key] || "";
  }

  function navlungoBarcodeFormatMap_() {
    return {
      "html": "html",
      "pdf-a5": "pdf-A5",
      "pdf-a6": "pdf-A6",
      "pdf-a6y": "pdf-A6Y",
      "pdf-a7": "pdf-A7"
    };
  }

  function navlungoRequiredPropertyKeys_() {
    return [
      "NAVLUNGO_API_USERNAME", "NAVLUNGO_API_PASSWORD", "NAVLUNGO_ENV",
      "NAVLUNGO_CANLI_GONDERIM", "NAVLUNGO_TEST_MODE", "NAVLUNGO_SENDER_ADDRESS_ID",
      "NAVLUNGO_DEFAULT_CARRIER_ID", "NAVLUNGO_DEFAULT_POST_TYPE",
      "NAVLUNGO_DEFAULT_DESI", "NAVLUNGO_DEFAULT_PACKAGE_COUNT", "NAVLUNGO_DEFAULT_BARCODE_TYPE",
      "NAVLUNGO_CARRIER_ID_MAP_JSON"
    ];
  }

  function navlungoCredentialCandidates_(env) {
    if (env === "LIVE") {
      return [
        { usernameKey: "NAVLUNGO_LIVE_API_USERNAME", passwordKey: "NAVLUNGO_LIVE_API_PASSWORD" },
        { usernameKey: "NAVLUNGO_API_USERNAME", passwordKey: "NAVLUNGO_API_PASSWORD" }
      ];
    }
    return [
      { usernameKey: "NAVLUNGO_QA_API_USERNAME", passwordKey: "NAVLUNGO_QA_API_PASSWORD" },
      { usernameKey: "NAVLUNGO_API_USERNAME", passwordKey: "NAVLUNGO_API_PASSWORD" }
    ];
  }

  function navlungoCredentialState_() {
    var props = PropertiesService.getScriptProperties();
    var env = navlungoEnv_();
    var candidates = navlungoCredentialCandidates_(env);
    var partial = null;
    for (var i = 0; i < candidates.length; i++) {
      var candidate = candidates[i];
      var username = String(props.getProperty(candidate.usernameKey) || "").trim();
      var password = String(props.getProperty(candidate.passwordKey) || "").trim();
      if (username && password) {
        return {
          ok: true,
          env: env,
          username: username,
          password: password,
          usernameKey: candidate.usernameKey,
          passwordKey: candidate.passwordKey,
          usernameLogKey: candidate.usernameKey,
          passwordLogKey: candidate.passwordKey,
          usernameExists: true,
          passwordExists: true,
          message: ""
        };
      }
      if (!partial && (username || password)) {
        partial = {
          usernameKey: candidate.usernameKey,
          passwordKey: candidate.passwordKey,
          usernameExists: !!username,
          passwordExists: !!password
        };
      }
    }
    var liveUsername = !!props.getProperty("NAVLUNGO_LIVE_API_USERNAME");
    var livePassword = !!props.getProperty("NAVLUNGO_LIVE_API_PASSWORD");
    var qaUsername = !!props.getProperty("NAVLUNGO_QA_API_USERNAME");
    var qaPassword = !!props.getProperty("NAVLUNGO_QA_API_PASSWORD");
    var logKey = candidates[0];
    var message = env + " ortamı için Navlungo API credential eksik. ";
    if (env === "QA" && liveUsername && livePassword) {
      message += "Script Properties içinde LIVE API credential var, ancak NAVLUNGO_ENV=QA. LIVE credential ile çalışacaksanız NAVLUNGO_ENV değerini LIVE yapın; QA endpoint için NAVLUNGO_QA_API_USERNAME/NAVLUNGO_QA_API_PASSWORD veya NAVLUNGO_API_USERNAME/NAVLUNGO_API_PASSWORD girin.";
    } else if (env === "LIVE" && qaUsername && qaPassword) {
      message += "Script Properties içinde QA API credential var, ancak NAVLUNGO_ENV=LIVE. QA endpoint için NAVLUNGO_ENV değerini QA yapın; LIVE endpoint için NAVLUNGO_LIVE_API_USERNAME/NAVLUNGO_LIVE_API_PASSWORD veya NAVLUNGO_API_USERNAME/NAVLUNGO_API_PASSWORD girin.";
    } else {
      message += env === "LIVE"
        ? "NAVLUNGO_LIVE_API_USERNAME/NAVLUNGO_LIVE_API_PASSWORD veya NAVLUNGO_API_USERNAME/NAVLUNGO_API_PASSWORD girilmeli."
        : "NAVLUNGO_QA_API_USERNAME/NAVLUNGO_QA_API_PASSWORD veya NAVLUNGO_API_USERNAME/NAVLUNGO_API_PASSWORD girilmeli.";
    }
    return {
      ok: false,
      env: env,
      username: "",
      password: "",
      usernameKey: partial ? partial.usernameKey : logKey.usernameKey,
      passwordKey: partial ? partial.passwordKey : logKey.passwordKey,
      usernameLogKey: partial ? partial.usernameKey : logKey.usernameKey,
      passwordLogKey: partial ? partial.passwordKey : logKey.passwordKey,
      usernameExists: partial ? partial.usernameExists : false,
      passwordExists: partial ? partial.passwordExists : false,
      message: message
    };
  }

  function navlungoCredentialEnvHint_(env) {
    var props = PropertiesService.getScriptProperties();
    var liveReady = !!props.getProperty("NAVLUNGO_LIVE_API_USERNAME") && !!props.getProperty("NAVLUNGO_LIVE_API_PASSWORD");
    var qaReady = !!props.getProperty("NAVLUNGO_QA_API_USERNAME") && !!props.getProperty("NAVLUNGO_QA_API_PASSWORD");
    if (env === "QA" && liveReady) return " Script Properties içinde LIVE API credential da var; bu değerlerle token almak için NAVLUNGO_ENV=LIVE olmalı.";
    if (env === "LIVE" && qaReady) return " Script Properties içinde QA API credential da var; bu değerlerle token almak için NAVLUNGO_ENV=QA olmalı.";
    return "";
  }

  function navlungoEnv_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var propsEnv = "";
    try { propsEnv = String(PropertiesService.getScriptProperties().getProperty("NAVLUNGO_ENV") || "").trim(); } catch (err) { propsEnv = ""; }
    var env = String(propsEnv || setting_(ss, "NAVLUNGO_ENV", "QA") || "QA").toUpperCase();
    if (env !== "LIVE") return "QA";
    return "LIVE";
  }

  function navlungoBaseUrl_() {
    return navlungoEnv_() === "LIVE" ? CFG.navlungoLiveBaseUrl : CFG.navlungoQaBaseUrl;
  }

  function navlungoTokenExpiresAt_(value) {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "number") {
      if (value > 1000000000000) return new Date(value).toISOString();
      if (value > 1000000000) return new Date(value * 1000).toISOString();
      return new Date(Date.now() + value * 1000).toISOString();
    }
    var text = String(value || "").trim();
    if (!text) return new Date(Date.now() + 28800 * 1000).toISOString();
    if (/^\d+$/.test(text)) return navlungoTokenExpiresAt_(Number(text));
    var parsed = new Date(text.replace(" ", "T"));
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
    return new Date(Date.now() + 28800 * 1000).toISOString();
  }

  function navlungoApiFetch_(method, endpoint, payload, retried) {
    var token = navlungoAccessTokenDegeriAl_();
    var upper = String(method || "get").toUpperCase();
    var options = {
      method: upper.toLowerCase(),
      muteHttpExceptions: true,
      headers: {
        "Authorization": "Bearer " + token,
        "X-localization": "tr",
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    };
    if (upper !== "GET") {
      options.contentType = "application/json";
      options.payload = JSON.stringify(payload || {});
    }
    var response = UrlFetchApp.fetch(navlungoBaseUrl_() + endpoint.replace(/^\/+/, ""), options);
    var status = response.getResponseCode();
    var text = response.getContentText();
    if (status === 401 && !retried) {
      navlungoTokenAl_();
      return navlungoApiFetch_(method, endpoint, payload, true);
    }
    if (status < 200 || status >= 300) throw new Error("Navlungo API hata " + status + ": " + sanitizeApiText_(text));
    return navlungoJson_(text);
  }

  function navlungoAccessTokenDegeriAl_() {
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty("NAVLUNGO_ACCESS_TOKEN");
    var expiresAt = props.getProperty("NAVLUNGO_ACCESS_TOKEN_EXPIRES_AT");
    if (token && expiresAt && new Date(expiresAt).getTime() > Date.now() + 60000) return token;
    navlungoTokenAl_();
    return props.getProperty("NAVLUNGO_ACCESS_TOKEN");
  }

  function navlungoJson_(text) {
    try { return text ? JSON.parse(text) : {}; }
    catch (err) { throw new Error("Navlungo JSON yanıtı okunamadı: " + sanitizeApiText_(text)); }
  }

  function navlungoCargoRow_(ss, kargoPaketId) {
    var key = navlungoCargoKey_(ss, kargoPaketId);
    var cargoSheet = sheet_(ss, CFG.sheets.cargo);
    var rows = navlungoCargoRows_(cargoSheet);
    var row = rows.filter(function (r) {
      return navlungoIdText_(r[H.CARGO_PACKAGE_ID]) === key;
    })[0];
    if (!row) {
      var ids = rows.map(function (r) { return navlungoIdText_(r[H.CARGO_PACKAGE_ID]); })
        .filter(Boolean).slice(0, 5).join(", ");
      if (navlungoDamagedCargoId_(key)) {
        throw new Error("Kargo_Paket_ID formatı bozulmuş olabilir: " + key + ". Sayfa: " + CFG.sheets.cargo + "; beklenen Kargo_Paket_ID tireli formatta olmalı. Bulunan ID'ler: " + (ids || "yok"));
      }
      throw new Error("Kargo_Paket_ID bulundu ama " + CFG.sheets.cargo + " içinde eşleşen satır yok: " + key + ". Bulunan ID'ler: " + (ids || "yok"));
    }
    if (!row[H.CARGO_PACKAGE_ID]) throw new Error("Navlungo için seçilen satırda Kargo_Paket_ID eksik. Sayfa: " + CFG.sheets.cargo + "; Açık_Sipariş_ID: " + navlungoIdText_(row[H.OPEN_ID]));
    return row;
  }

  function navlungoCargoIssues_(ss, cargo) {
    var issues = [];
    if (!cargo[H.CARGO_PACKAGE_ID]) issues.push("Kargo_Paket_ID eksik");
    if (!cargo[H.CARGO_RECEIVER]) issues.push("Kargo_Alıcısı eksik");
    if (!normalizePhone_(cargo[H.CARGO_TEL])) issues.push("Kargo_Tel eksik");
    if (!cargo[H.CITY]) issues.push("İl eksik");
    if (!cargo[H.DISTRICT]) issues.push("İlçe eksik");
    if (!cargo[H.ADDRESS]) issues.push("Adres eksik");
    if (!String(setting_(ss, "NAVLUNGO_SENDER_ADDRESS_ID", "") || "").trim()) issues.push("NAVLUNGO_SENDER_ADDRESS_ID eksik");
    return issues;
  }

  function navlungoRecipientFromCargo_(ss, cargo) {
    return {
      name: normalizePersonName_(cargo[H.CARGO_RECEIVER] || ""),
      phone: navlungoPhone_(cargo[H.CARGO_TEL]),
      email: navlungoRecipientEmail_(ss, cargo),
      address: String(cargo[H.ADDRESS] || ""),
      country: "tr",
      city: String(cargo[H.CITY] || ""),
      district: String(cargo[H.DISTRICT] || ""),
      post_code: ""
    };
  }

  function navlungoPhone_(value) {
    var normalized = normalizePhone_(value);
    if (!normalized) return "";
    return normalized;
  }

  function navlungoNoPostResult_(kargoPaketId, payload, reason) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hash = navlungoPayloadHash_(payload || {});
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, kargoPaketId, {
      [H.NAVLUNGO_PAYLOAD_HASH]: hash,
      [H.NAVLUNGO_STATUS]: "Canlı gönderim kapalı - payload hazır",
      [H.NAVLUNGO_LAST_RESPONSE]: "Canlı gönderim kapalı; payload hazır; hash=" + hash,
      [H.NAVLUNGO_LAST_ERROR]: reason,
      [H.NAVLUNGO_TEST]: yes_(setting_(ss, "NAVLUNGO_TEST_MODE", "Evet")) ? "Evet" : (navlungoEnv_() === "QA" ? "Evet" : "Hayır")
    });
    return { ok: true, kargoPaketId: kargoPaketId, payload: payload, livePost: "Yapılmadı", status: reason };
  }

  function qzPrinterName_(ss) {
    return String(setting_(ss, "QZ_PRINTER_NAME", "RP4xx Series 200DPI TSC") || "RP4xx Series 200DPI TSC").trim();
  }

  function qzActive_(ss) {
    return yes_(setting_(ss, "QZ_TRAY_AKTIF", "Evet"));
  }

  function qzAutoPrintAfterBarcode_(ss) {
    return yes_(setting_(ss, "QZ_AUTO_PRINT_AFTER_BARCODE", "Evet"));
  }

  function qzPrintCopies_(ss) {
    return numberOrDefault_(setting_(ss, "QZ_PRINT_COPIES", "1"), 1);
  }

  function qzPrintMode_(ss) {
    var mode = String(setting_(ss, "QZ_PRINT_MODE", "pdf") || "pdf").trim().toLowerCase();
    return mode || "pdf";
  }

  function qzCargoRowForOpen_(ss, openId) {
    var rows = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) {
      return String(row[H.OPEN_ID] || "").trim() === String(openId || "").trim();
    });
    if (!rows.length) return {};
    var withBarcode = rows.filter(function (row) { return String(row[H.NAVLUNGO_BARCODE_URL] || "").trim(); });
    return withBarcode[withBarcode.length - 1] || rows[rows.length - 1] || {};
  }

  function qzCargoRowForKey_(ss, key) {
    var text = String(key || "").trim();
    if (!text) throw new Error("Barkod yazdırma için Kargo_Paket_ID veya Açık_Sipariş_ID bulunamadı.");
    var rows = objects_(sheet_(ss, CFG.sheets.cargo));
    var exact = rows.filter(function (row) { return String(row[H.CARGO_PACKAGE_ID] || "").trim() === text; })[0];
    if (exact) return exact;
    var byOpen = rows.filter(function (row) { return String(row[H.OPEN_ID] || "").trim() === text; });
    if (byOpen.length) {
      var withBarcode = byOpen.filter(function (row) { return String(row[H.NAVLUNGO_BARCODE_URL] || "").trim(); });
      return withBarcode[withBarcode.length - 1] || byOpen[byOpen.length - 1];
    }
    throw new Error("Barkod yazdırma satırı bulunamadı: " + text);
  }

  function qzPrintInfoFromCargo_(ss, cargo, action) {
    cargo = cargo || {};
    var barcodeUrl = String(cargo[H.NAVLUNGO_BARCODE_URL] || cargo[H.BARCODE] || "").trim();
    var printed = yes_(cargo[H.BARCODE_PRINTED]);
    return {
      ok: true,
      action: action || "",
      acikSiparisId: cargo[H.OPEN_ID] || "",
      kargoPaketId: cargo[H.CARGO_PACKAGE_ID] || "",
      Navlungo_Post_Number: cargo[H.NAVLUNGO_POST_NUMBER] || "",
      Navlungo_Tracking_URL: cargo[H.NAVLUNGO_TRACKING_URL] || "",
      Navlungo_Barcode_URL: barcodeUrl,
      Navlungo_Status: cargo[H.NAVLUNGO_STATUS] || "",
      qzPrinterName: qzPrinterName_(ss),
      qzPrintCopies: qzPrintCopies_(ss),
      qzPrintMode: qzPrintMode_(ss),
      qzActive: qzActive_(ss) ? "Evet" : "Hayır",
      barcodeAlreadyPrinted: printed,
      autoPrintRequested: qzActive_(ss) && qzAutoPrintAfterBarcode_(ss) && !!barcodeUrl && !printed
    };
  }

  function attachQzOperationInfo_(ss, openId, result) {
    var cargo = qzCargoRowForOpen_(ss, openId);
    var info = qzPrintInfoFromCargo_(ss, cargo, result && result.action);
    Object.keys(info).forEach(function (key) { result[key] = info[key]; });
    return result;
  }

  function qzBarkodBilgisi_(key) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var info = qzPrintInfoFromCargo_(ss, qzCargoRowForKey_(ss, key), "barkodYazdir");
    info.autoPrintRequested = false;
    return info;
  }

  function qzBarkodYazdirmaSonucuKaydet_(kargoPaketId, ok, sonuc, hata) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cargo = qzCargoRowForKey_(ss, kargoPaketId);
    var success = !!ok;
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, cargo[H.CARGO_PACKAGE_ID], {
      [H.BARCODE_PRINTED]: success ? "Evet" : "Hayır",
      [H.BARCODE_PRINT_DATE]: new Date(),
      [H.BARCODE_PRINT_RESULT]: success ? (sonuc || "Barkod yazdırıldı") : (sonuc || "Barkod URL oluştu; yazdırma tamamlanmadı"),
      [H.BARCODE_PRINT_ERROR]: success ? "" : (hata || sonuc || "QZ Tray bağlantısı kurulamadı")
    });
    return qzBarkodBilgisi_(cargo[H.CARGO_PACKAGE_ID]);
  }

  function navlungoErrorYaz_(ss, kargoPaketId, message, action) {
    patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, kargoPaketId, {
      [H.NAVLUNGO_STATUS]: "Hata",
      [H.NAVLUNGO_LAST_ERROR]: message
    });
    kontrolMerkezineTeknikBlokajYaz_(ss, CFG.sheets.cargo, kargoPaketId, message, action, "Navlungo");
  }

  function navlungoCarrierListesiAl_() {
    try {
      var response = navlungoApiFetch_("get", "carrier/my-carriers", null);
      var data = response.data || response.carriers || response;
      var count = Array.isArray(data) ? data.length : "";
      return { ok: true, status: "Taşıyıcı erişimi başarılı", count: count, response: navlungoSafeJson_(response) };
    } catch (err) {
      return { ok: false, status: safeErrorMessage_(err), response: "" };
    }
  }

  function navlungoCarrierInfo_(ss, cargo) {
    var company = String(cargo[H.CARGO_COMPANY] || setting_(ss, "VARSAYILAN_KARGO_FIRMASI", CFG.defaultCargoCompany) || "").trim();
    var raw = setting_(ss, "NAVLUNGO_CARRIER_ID_MAP_JSON", "{}") || "{}";
    var map = {};
    try { map = JSON.parse(raw); } catch (err) { throw new Error("NAVLUNGO_CARRIER_ID_MAP_JSON geçerli JSON değil."); }
    var carrierId = "";
    if (company) {
      carrierId = map[company] || map[normalizeAscii_(company)] || "";
      if (!carrierId) throw new Error("Navlungo carrier_id bulunamadı: " + company + ". NAVLUNGO_CARRIER_ID_MAP_JSON kontrol edilmeli.");
    } else {
      carrierId = setting_(ss, "NAVLUNGO_DEFAULT_CARRIER_ID", "");
      if (!carrierId) throw new Error("Navlungo carrier_id bulunamadı: varsayılan. NAVLUNGO_DEFAULT_CARRIER_ID kontrol edilmeli.");
      company = "Varsayılan";
    }
    carrierId = numberOrDefault_(carrierId, 0);
    if (!carrierId) throw new Error("Carrier ID sayısal değil: " + company + " için carrier_id kontrol edin.");
    return { id: carrierId, name: company || "Varsayılan" };
  }

  function navlungoRecipientEmail_(ss, cargo) {
    var group = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (row) { return row[H.OPEN_ID] === cargo[H.OPEN_ID] && row[H.INVOICE_EMAIL]; })[0];
    return group ? String(group[H.INVOICE_EMAIL] || "") : "";
  }

  function navlungoCargoKey_(ss, kargoPaketId) {
    var key = navlungoIdText_(kargoPaketId);
    if (key) return key;
    return navlungoActiveCargoId_(ss);
  }

  function navlungoIdText_(value) {
    return String(value === null || value === undefined ? "" : value).trim();
  }

  function navlungoActiveCargoId_(ss) {
    var sh = ss.getActiveSheet();
    if (!sh || sh.getName() !== CFG.sheets.cargo) {
      throw new Error("Kargo_Paket_ID parametresi boş geldi. Aktif satırdan Kargo_Paket_ID okunamadı. Lütfen " + CFG.sheets.cargo + " sayfasında gönderilecek satırı seçin.");
    }
    var range = sh.getActiveRange();
    if (!range || range.getRow() < 2) {
      throw new Error("Aktif satırdan Kargo_Paket_ID okunamadı. Lütfen " + CFG.sheets.cargo + " sayfasında veri satırı seçin.");
    }
    var col = navlungoHeaderIndex_(sh, H.CARGO_PACKAGE_ID);
    if (col < 0) {
      throw new Error(CFG.sheets.cargo + " başlık eşleşmesi başarısız: " + H.CARGO_PACKAGE_ID + " kolonu bulunamadı.");
    }
    var key = navlungoIdText_(sh.getRange(range.getRow(), col + 1).getValue());
    if (!key) {
      throw new Error("Aktif satırdan Kargo_Paket_ID okunamadı. Lütfen " + CFG.sheets.cargo + " sayfasında Kargo_Paket_ID dolu satırı seçin.");
    }
    return key;
  }

  function navlungoCargoRows_(sh) {
    if (!sh || sh.getLastRow() < 2) return [];
    var map = {};
    HEADERS.cargo.forEach(function (name) { map[name] = navlungoHeaderIndex_(sh, name); });
    var values = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
    return values.map(function (row) {
      var out = {};
      Object.keys(map).forEach(function (name) {
        out[name] = map[name] >= 0 ? row[map[name]] : "";
      });
      return out;
    }).filter(function (row) {
      return Object.keys(row).some(function (name) { return row[name] !== "" && row[name] !== null && row[name] !== undefined; });
    });
  }

  function navlungoHeaderIndex_(sh, name) {
    var exact = headers_(sh)[name];
    if (exact !== undefined) return exact;
    var target = navlungoHeaderKey_(name);
    var values = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
    for (var i = 0; i < values.length; i++) {
      if (navlungoHeaderKey_(values[i]) === target) return i;
    }
    return -1;
  }

  function navlungoHeaderKey_(value) {
    return normalizeAscii_(String(value || "").trim()).replace(/[\s_]+/g, "").toLowerCase();
  }

  function navlungoDamagedCargoId_(value) {
    var key = navlungoIdText_(value);
    return /^KP-AS-\d{11}$/.test(key) || /^KP-AS-\d{8}\d{3}$/.test(key);
  }

  function navlungoAssertCargoCanCreate_(cargo) {
    var key = navlungoIdText_(cargo[H.CARGO_PACKAGE_ID]);
    var navStatus = normalizeAscii_(cargo[H.NAVLUNGO_STATUS] || "");
    var packageStatus = normalizeAscii_(cargo[H.PACKAGE_STATUS] || "");
    if (navlungoIdText_(cargo[H.NAVLUNGO_POST_NUMBER])) throw new Error("Kargo_Paket_ID zaten Navlungo gönderisine bağlı: " + key);
    if (navlungoIdText_(cargo[H.NAVLUNGO_BARCODE_URL]) || navlungoIdText_(cargo[H.BARCODE])) throw new Error("Kargo_Paket_ID için barkod alınmış; tekrar gönderim yapılmaz: " + key);
    if (cargo[H.NAVLUNGO_CANCELLED_AT] || navStatus.indexOf("iptal") !== -1 || packageStatus.indexOf("iptal") !== -1) throw new Error("Kargo_Paket_ID iptal durumunda; tekrar gönderim yapılmaz: " + key);
    if (navStatus === "gonderi olusturuldu" || packageStatus === "gonderi olusturuldu") throw new Error("Kargo_Paket_ID için gönderi daha önce oluşturulmuş: " + key);
  }

  function navlungoSelectedCargoRows_(ss, selected) {
    var rows = navlungoCargoRows_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) { return row[H.CARGO_PACKAGE_ID]; });
    if (!selected) {
      var activeKey = navlungoActiveCargoId_(ss);
      return rows.filter(function (row) { return navlungoIdText_(row[H.CARGO_PACKAGE_ID]) === activeKey; });
    }
    var keys = Array.isArray(selected) ? selected : String(selected).split(/[,\n;]/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (!keys.length) throw new Error("Kargo_Paket_ID listesi boş geldi.");
    return rows.filter(function (row) { return keys.indexOf(navlungoIdText_(row[H.CARGO_PACKAGE_ID])) !== -1; });
  }

  function navlungoPayloadHash_(payload) {
    var text = JSON.stringify(payload || {});
    if (typeof Utilities !== "undefined" && Utilities.computeDigest) {
      var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text);
      return bytes.map(function (b) { var n = b < 0 ? b + 256 : b; return ("0" + n.toString(16)).slice(-2); }).join("");
    }
    return safeKey_(text).slice(0, 64);
  }

  function navlungoSafeJson_(response) {
    return sanitizeApiText_(JSON.stringify(response || {})).slice(0, 5000);
  }

  function safeJson_(value) {
    return sanitizeApiText_(JSON.stringify(value || {})).slice(0, 5000);
  }

  function navlungoFirstData_(response) {
    var data = response && response.data !== undefined ? response.data : response;
    if (Array.isArray(data)) return data[0] || {};
    return data || {};
  }

  function navlungoResponseValue_(response, keys) {
    var seen = [];
    var found = "";
    function walk(node) {
      if (found !== "" || node === null || node === undefined) return;
      if (typeof node !== "object") return;
      if (seen.indexOf(node) !== -1) return;
      seen.push(node);
      for (var i = 0; i < keys.length; i++) {
        var v = node[keys[i]];
        if (v !== "" && v !== null && v !== undefined) { found = v; return; }
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
      } else {
        Object.keys(node).forEach(function (key) { walk(node[key]); });
      }
    }
    walk(response);
    if (found !== "") return found;
    return "";
  }

  function numberOrDefault_(value, fallback) {
    var n = Number(value);
    return isNaN(n) || n <= 0 ? fallback : n;
  }

  function ultraPanelOperasyonCalistir_(action, form) {
    var started = Date.now();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var saved = kaydetUltraSiparisHizli_(form || {});
    var result = performOrderOperation_(ss, action, saved.openId, form || {}, saved);
    result.elapsedMs = Date.now() - started;
    return result;
  }

  function operationFromOpenId_(action, openId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ctx = null;
    if (!openId) ctx = selectedContext_({ allowedSheets: selectedOrderContextSheets_() });
    var id = String(openId || (ctx && ctx.openId) || "").trim();
    if (!id) throw new Error("İşlem için Açık_Sipariş_ID bulunamadı. Lütfen sipariş satırını seçin.");
    if (!ctx) ctx = { ss: ss, sheetName: "Parametre", rowNum: 0, row: {}, openId: id, invoiceGroupId: "", cargoPackageId: "", phone: "" };
    confirmSelectedOperation_(action, ctx);
    hafifErpGuncelle_(id);
    return performOrderOperation_(ss, action, id, {}, { ok: true, openId: id });
  }

  function faturaVeKargoOlustur_(openId) {
    return operationFromOpenId_("faturaKargo", openId);
  }

  function sadeceFaturaOlustur_(openId) {
    return operationFromOpenId_("sadeceFatura", openId);
  }

  function sadeceKargoHazirla_(openId) {
    return operationFromOpenId_("sadeceKargo", openId);
  }

  function bekleyenKargoyuCikar_(openId) {
    return operationFromOpenId_("bekleyenKargo", openId);
  }

  function kargoBeklet_(openId) {
    return operationFromOpenId_("kargoBeklet", openId);
  }

  function performOrderOperation_(ss, action, openId, form, saved) {
    action = String(action || "faturaKargo").trim();
    var result = {
      ok: true,
      action: action,
      openId: openId,
      saved: saved || {},
      steps: [],
      invoice: [],
      cargo: [],
      blocks: []
    };
    if (!openId) throw new Error("Açık_Sipariş_ID zorunlu.");
    if (action === "kargoBeklet") {
      setKargoBekletForOpen_(ss, openId, true, (form.kargo && form.kargo.kargoBekletmeNedeni) || "Müşteri talebiyle kargo bekletiliyor");
      return finalizeOperationResult_(ss, openId, result, "Kargo bekletildi");
    }
    if (action === "arsivle" || action === "iptal" || action === "geriAl") {
      var mode = action === "arsivle" ? "archive" : action === "geriAl" ? "restore" : "cancel";
      var lifecycle = applyOrderLifecycle_(ss, openId, mode);
      result.steps.push(lifecycle);
      result.ok = lifecycle.ok !== false;
      return finalizeOperationResult_(ss, openId, result, lifecycle.status || "İşlem tamamlandı");
    }
    if (action === "siparisiKapat") {
      patchRowsForOpen_(ss, CFG.sheets.queue, HEADERS.queue, openId, { [H.ORDER_STATUS]: "Kapalı", [H.WARN]: "" });
      patchRowsForOpen_(ss, CFG.sheets.open, HEADERS.open, openId, { [H.ORDER_STATUS]: "Kapalı", [H.WARN]: "", [H.BLOCK_REASON]: "" });
      return finalizeOperationResult_(ss, openId, result, "Sipariş kapatıldı");
    }
    var waitRequested = action === "sadeceFatura" || yes_(form.kargo && form.kargo.kargoBekletilsinMi);
    if (waitRequested) setKargoBekletForOpen_(ss, openId, true, (form.kargo && form.kargo.kargoBekletmeNedeni) || "Müşteri talebiyle kargo bekletiliyor");
    if (action === "faturaKargo" || action === "sadeceFatura") {
      result.invoice = operationInvoiceForOpen_(ss, openId);
    }
    if (action === "sadeceFatura") {
      return finalizeOperationResult_(ss, openId, result, "Fatura adımı tamamlandı; kargo bekletiliyor");
    }
    if (action === "sadeceKargo" || action === "bekleyenKargo" || action === "faturaKargo") {
      if (cargoWaitActive_(ss, openId) && action === "faturaKargo") {
        result.cargo.push({ ok: true, status: "Kargo bekletiliyor; Navlungo gönderimi yapılmadı" });
      } else {
        setKargoBekletForOpen_(ss, openId, false, "");
        result.cargo = operationCargoForOpen_(ss, openId);
      }
    }
    return finalizeOperationResult_(ss, openId, result, "Operasyon akışı tamamlandı");
  }

  function operationInvoiceForOpen_(ss, openId) {
    autoCariBaglaForOpen_(ss, openId, true);
    parasutTaslaklariniHazirlaForOpen_(ss, openId);
    senkronizeDurumForOpen_(openId);
    var groups = objects_(sheet_(ss, CFG.sheets.invoiceGroups)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    if (!groups.length) return [{ ok: false, status: "Fatura grubu bulunamadı" }];
    return groups.map(function (group) {
      if (group[H.PARASUT_INVOICE_ID] || yes_(group[H.SEND_LOCK])) {
        return { ok: true, groupId: group[H.INVOICE_GROUP_ID], status: "Fatura zaten kesilmiş", invoiceId: group[H.PARASUT_INVOICE_ID] || "" };
      }
      if (!group[H.PARASUT_CONTACT_ID]) {
        return { ok: false, groupId: group[H.INVOICE_GROUP_ID], status: "Paraşüt cari ID eksik" };
      }
      try {
        var sent = parasutFaturaTaslakGonder_(group[H.INVOICE_GROUP_ID]);
        return { ok: true, groupId: group[H.INVOICE_GROUP_ID], result: sent };
      } catch (err) {
        return { ok: false, groupId: group[H.INVOICE_GROUP_ID], status: safeErrorMessage_(err) };
      }
    });
  }

  function operationCargoForOpen_(ss, openId) {
    var cargos = objects_(sheet_(ss, CFG.sheets.cargo)).filter(function (row) { return row[H.OPEN_ID] === openId; });
    if (!cargos.length) return [{ ok: false, status: "Kargo paketi bulunamadı" }];
    return cargos.map(function (cargo) {
      if (!cargo[H.CARGO_PACKAGE_ID]) return { ok: false, status: "Kargo_Paket_ID boş" };
      if (cargo[H.NAVLUNGO_POST_NUMBER]) {
        if (!cargo[H.NAVLUNGO_BARCODE_URL]) {
          try { return navlungoBarkodAl_(cargo[H.CARGO_PACKAGE_ID]); }
          catch (err) { return { ok: false, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], status: safeErrorMessage_(err) }; }
        }
        return { ok: true, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], status: "Kargo zaten oluşturulmuş", postNumber: cargo[H.NAVLUNGO_POST_NUMBER], barcodeUrl: cargo[H.NAVLUNGO_BARCODE_URL] || "" };
      }
      try {
        var created = navlungoKargoOlusturOnayli_(cargo[H.CARGO_PACKAGE_ID]);
        if (created && created.ok && created.postNumber && !created.barcodeUrl) {
          try { created.barcode = navlungoBarkodAl_(cargo[H.CARGO_PACKAGE_ID]); }
          catch (err2) { created.barcodeError = safeErrorMessage_(err2); }
        }
        if (created && created.postNumber) {
          patchRowsByKey_(sheet_(ss, CFG.sheets.cargo), H.CARGO_PACKAGE_ID, cargo[H.CARGO_PACKAGE_ID], { [H.CARGO_EXIT_DATE]: new Date(), [H.PACKAGE_STATUS]: "Gönderi Oluşturuldu" });
        }
        return created;
      } catch (err) {
        return { ok: false, kargoPaketId: cargo[H.CARGO_PACKAGE_ID], status: safeErrorMessage_(err) };
      }
    });
  }

  function setKargoBekletForOpen_(ss, openId, wait, reason) {
    var patch = {
      [H.CARGO_WAIT]: wait ? "Evet" : "Hayır",
      [H.CARGO_WAIT_REASON]: wait ? (reason || "") : "",
      [H.PACKAGE_STATUS]: wait ? "Bekletiliyor" : "Hazır",
      [H.WARN]: ""
    };
    return patchRowsForOpen_(ss, CFG.sheets.cargo, HEADERS.cargo, openId, patch);
  }

  function cargoWaitActive_(ss, openId) {
    return objects_(sheet_(ss, CFG.sheets.cargo)).some(function (row) {
      return row[H.OPEN_ID] === openId && yes_(row[H.CARGO_WAIT]);
    });
  }

  function finalizeOperationResult_(ss, openId, result, status) {
    parasutTaslaklariniHazirlaForOpen_(ss, openId);
    senkronizeDurumForOpen_(openId);
    ebelgeIstisnaHazirlaForOpen_(ss, openId);
    rebuildOpenOrderForOpen_(ss, openId);
    senkronizeDurumForOpen_(openId);
    kontrolMerkeziniGuncelleForOpen_(ss, openId);
    result.control = panelKontrolOzetiForOpen_(ss, openId);
    result.blocks = result.control.summary || [];
    result.status = status;
    result.ok = result.ok !== false && result.control.ok && allSubResultsOk_(result.invoice) && allSubResultsOk_(result.cargo);
    attachQzOperationInfo_(ss, openId, result);
    return result;
  }

  function allSubResultsOk_(value) {
    if (!value) return true;
    if (!Array.isArray(value)) return value.ok !== false;
    return value.every(function (entry) {
      if (Array.isArray(entry)) return allSubResultsOk_(entry);
      return !entry || entry.ok !== false;
    });
  }

  function faturaKargoSonAsamaBlokajlari_(ss, openId) {
    var rows = objects_(sheet_(ss, CFG.sheets.open)).filter(function (row) { return !openId || row[H.OPEN_ID] === openId; });
    var blocks = [];
    rows.forEach(function (row) {
      var status = String(row[H.ORDER_STATUS] || "");
      if (!isClosedText_(status)) {
        blocks.push((row[H.OPEN_ID] || "Açık sipariş") + ": Sipariş_Durumu '" + (status || "boş") + "'. Fatura ve kargo oluşturma son adımı için siparişi kapatın veya önce yalnız Kaydet ve ERP güncelle ile hazırlık/payload kontrolü yapın.");
      }
    });
    return blocks;
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

  function normalizeUltraForm_(form, ss) {
    form = form || {};
    ss = ss || SpreadsheetApp.getActiveSpreadsheet();
    form.openId = String(form.openId || "").trim();
    form.cargoPackageId = navlungoIdText_(form.cargoPackageId || form.kargoPaketId || (form.kargo && form.kargo.kargoPaketId));
    form.whatsAppTel = normalizePhone_(form.whatsAppTel || "");
    form.siparisSahibi = normalizePersonName_(form.siparisSahibi || "");
    form.hamWhatsappMesajiNormalized = normalizeMessageText_(form.hamWhatsappMesaji || "");
    var memory = musteriHafizaVarsayilanlari_(ss, form.whatsAppTel);
    form.kargo = form.kargo || {};
    form.kargo.kargoPaketId = navlungoIdText_(form.kargo.kargoPaketId || form.kargo.cargoPackageId || form.cargoPackageId);
    form.kargo.kargoAlicisi = normalizePersonName_(form.kargo.kargoAlicisi || form.kargo.receiver || memory.cargoReceiver || form.siparisSahibi || "");
    form.kargo.kargoTel = normalizePhone_(form.kargo.kargoTel || form.kargo.phone || memory.cargoPhone || form.whatsAppTel || "");
    form.kargo.il = normalizeCity_(form.kargo.il || form.kargo.city || memory.city || "");
    form.kargo.ilce = normalizeCity_(form.kargo.ilce || form.kargo.district || memory.district || "");
    form.kargo.adres = normalizeAddress_(form.kargo.adres || form.kargo.address || memory.address || "");
    form.kargo.kargoFirmasi = normalizeCargoCompany_(form.kargo.kargoFirmasi || form.kargo.company || memory.cargoCompany || CFG.defaultCargoCompany);
    if (form.kargo) {
      form.kargo.paketNotu = String(form.kargo.paketNotu || form.kargo.note || "").trim();
    }
    var payers = {};
    (form.odemeler || []).forEach(function (p) {
      p.odemeId = String(p.odemeId || p.paymentId || "").trim();
      p.odemeYapan = normalizePersonName_(p.odemeYapan || p.payer || "");
      p.odemeYapanTel = normalizePhone_(p.odemeYapanTel || p.payerTel || form.whatsAppTel || "");
      p.odemeYapanTcknVkn = normalizeTaxNo_(p.odemeYapanTcknVkn || p.payerTaxNo || "") || setting_(ss, "TCKN_VARSAYILAN_GERCEK_KISI", CFG.defaultTckn);
      p.odemeYapanAdres = normalizeAddress_(p.odemeYapanAdres || p.payerAddress || form.kargo.adres || "");
      p.odemeYapanIl = normalizeCity_(p.odemeYapanIl || p.payerCity || form.kargo.il || "");
      p.odemeYapanIlce = normalizeCity_(p.odemeYapanIlce || p.payerDistrict || form.kargo.ilce || "");
      p.faturaCariBaglantiId = p.faturaCariBaglantiId || "";
      if (p.odemeYapan) payers[p.odemeYapan] = true;
    });
    var payerNames = Object.keys(payers);
    (form.urunler || []).forEach(function (it) {
      it.urunKalemId = String(it.urunKalemId || it.itemId || "").trim();
      it.urunAdi = normalizeUrunAdi_(it.urunAdi || it.product || "");
      it.odemeYapan = normalizePersonName_(it.odemeYapan || it.payer || (payerNames.length === 1 ? payerNames[0] : ""));
      it.faturaCariBaglantiId = it.faturaCariBaglantiId || "";
    });
    form.faturalar = normalizePanelFaturalari_(form, ss);
    return form;
  }

  function musteriHafizaVarsayilanlari_(ss, phone) {
    var normalized = normalizePhone_(phone || "");
    if (!normalized) return {};
    var rows = objects_(sheet_(ss, CFG.sheets.memory));
    var row = rows.filter(function (r) { return normalizePhone_(r[H.PHONE]) === normalized; }).pop() || {};
    var addresses = addressHistoryForPhone_(ss, normalized);
    var primaryAddress = addresses.filter(function (a) { return yes_(a[H.DEFAULT_ADDRESS]); })[0] || addresses[0] || {};
    return {
      cargoReceiver: primaryAddress[H.CARGO_RECEIVER] || row["Son_Kargo_Alıcısı"] || "",
      cargoPhone: primaryAddress[H.CARGO_TEL] || row["Son_Kargo_Tel"] || "",
      city: primaryAddress[H.CITY] || row["Son_İl"] || "",
      district: primaryAddress[H.DISTRICT] || row["Son_İlçe"] || "",
      address: primaryAddress[H.ADDRESS] || row["Son_Adres"] || "",
      cargoCompany: primaryAddress[H.CARGO_COMPANY] || row["Son_Kargo_Firması"] || ""
    };
  }

  function normalizePanelFaturalari_(form, ss) {
    var byName = {};
    var faturalar = (form.faturalar || []).slice();
    if (form.fatura) faturalar.push(form.fatura);
    faturalar.forEach(function (f) {
      var name = normalizePersonName_(f.faturaKisisi || f.odemeYapan || f.name || "");
      if (!name) { byName.__default = f; return; }
      byName[name] = f;
    });
    return (form.odemeler || []).filter(function (p) { return p.odemeYapan; }).map(function (p) {
      var current = byName[p.odemeYapan] || byName.__default || {};
      var requestedType = normalizeCariTipi_(current.cariTipi || "", "", p.odemeYapan);
      var rawTax = normalizeTaxNo_(current.faturaTcknVkn || current.taxNo || p.odemeYapanTcknVkn || "");
      var taxNo = rawTax || (requestedType === "Tüzel Kişi" ? "" : setting_(ss, "TCKN_VARSAYILAN_GERCEK_KISI", CFG.defaultTckn));
      var cariTipi = normalizeCariTipi_(current.cariTipi || "", taxNo, p.odemeYapan);
      return {
        faturaGrubuId: String(current.faturaGrubuId || current.invoiceGroupId || "").trim(),
        faturaKisisi: p.odemeYapan,
        odemeYapan: p.odemeYapan,
        cariTipi: cariTipi,
        faturaTel: normalizePhone_(current.faturaTel || current.phone || p.odemeYapanTel || form.whatsAppTel || ""),
        faturaEmail: String(current.faturaEmail || current.email || "").trim(),
        faturaTcknVkn: taxNo,
        faturaVergiDairesi: String(current.faturaVergiDairesi || "").trim(),
        faturaIl: normalizeCity_(current.faturaIl || current.city || p.odemeYapanIl || form.kargo.il || ""),
        faturaIlce: normalizeCity_(current.faturaIlce || current.district || p.odemeYapanIlce || form.kargo.ilce || ""),
        faturaAdres: normalizeAddress_(current.faturaAdres || current.address || p.odemeYapanAdres || form.kargo.adres || ""),
        eBelgeTipi: current.eBelgeTipi || ebelgeTipiBelirle_(taxNo, cariTipi),
        parasutCariId: String(current.parasutCariId || current.contactId || "").trim()
      };
    });
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

  function findObjectByKeyText_(sh, keyName, keyValue) {
    var rowNum = findRowByKeyText_(sh, keyName, keyValue);
    return rowNum ? rowObjectFromSheetRow_(sh, rowNum) : null;
  }

  function findRowByKeyText_(sh, keyName, keyValue) {
    if (!sh || sh.getLastRow() < 2) return 0;
    var h = headers_(sh);
    if (h[keyName] === undefined) return 0;
    var key = String(keyValue || "").trim();
    if (!key) return 0;
    var values = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
    for (var i = 0; i < values.length; i++) {
      if (String(values[i][h[keyName]] || "").trim() === key) return i + 2;
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
    var expanded = expandJoinedPersonName_(String(v || "").trim());
    return expanded.replace(/\s+/g, " ").split(" ").filter(Boolean).map(function (part) {
      return part.charAt(0).toLocaleUpperCase("tr-TR") + part.slice(1).toLocaleLowerCase("tr-TR");
    }).join(" ");
  }

  function expandJoinedPersonName_(value) {
    var raw = String(value || "").trim().replace(/\s+/g, " ");
    if (!raw || raw.indexOf(" ") !== -1) return raw;
    var key = raw.toLocaleLowerCase("tr-TR");
    var direct = {
      "mehmetnuriçetin": "mehmet nuri çetin",
      "mehmetnuricetin": "mehmet nuri çetin",
      "nimeçetin": "nimet çetin",
      "nimecetin": "nimet çetin",
      "bedihaçetin": "bediha çetin",
      "bedihacetin": "bediha çetin",
      "yaşarçetin": "yaşar çetin",
      "yasarcetin": "yaşar çetin",
      "emrahçağrı": "emrah çağrı",
      "emrahcagri": "emrah çağrı",
      "hasanalbayrak": "hasan albayrak"
    };
    if (direct[key]) return direct[key];
    var ascii = normalizeAscii_(key).replace(/\s+/g, "");
    if (direct[ascii]) return direct[ascii];
    var surnames = ["çetin", "cetin", "albayrak", "çağrı", "cagri", "yılmaz", "yilmaz", "kaya", "demir", "gümüş", "gumus"];
    for (var i = 0; i < surnames.length; i++) {
      var surname = surnames[i];
      var surnameKey = surname.toLocaleLowerCase("tr-TR");
      var rawLower = key;
      var asciiSurname = normalizeAscii_(surnameKey).replace(/\s+/g, "");
      var hasRaw = rawLower.slice(-surnameKey.length) === surnameKey;
      var hasAscii = ascii.slice(-asciiSurname.length) === asciiSurname;
      if (!hasRaw && !hasAscii) continue;
      var prefix = hasRaw ? rawLower.slice(0, rawLower.length - surnameKey.length) : ascii.slice(0, ascii.length - asciiSurname.length);
      var names = splitJoinedGivenNames_(prefix);
      if (names.length) return names.join(" ") + " " + surnameKey;
    }
    return raw;
  }

  function splitJoinedGivenNames_(value) {
    var key = normalizeAscii_(value || "").replace(/\s+/g, "");
    var dict = ["mehmet", "nuri", "nimet", "bediha", "yaşar", "yasar", "emrah", "hasan", "ali", "ayşe", "ayse", "zeynep", "fatma", "murat", "ahmet", "mustafa"];
    var out = [];
    while (key) {
      var hit = "";
      for (var i = 0; i < dict.length; i++) {
        var candidate = normalizeAscii_(dict[i]);
        if (key.indexOf(candidate) === 0 && candidate.length > hit.length) hit = candidate;
      }
      if (!hit) return [];
      out.push(hit === "yasar" ? "yaşar" : hit === "ayse" ? "ayşe" : hit);
      key = key.slice(hit.length);
    }
    return out;
  }
  function normalizeAddress_(v) { return String(v || "").trim().replace(/\s+/g, " "); }
  function normalizeTaxNo_(v) { return String(v || "").replace(/\D/g, ""); }

  function normalizePhone_(v) {
    var d = String(v || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.length === 10 && d.charAt(0) === "5") return "+90" + d;
    if (d.length === 11 && d.charAt(0) === "0") return "+90" + d.slice(1);
    if (d.length === 12 && d.indexOf("90") === 0) return "+" + d;
    return "";
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
    seciliParasutCariAdaylariniGetir: seciliParasutCariAdaylariniGetir_,
    seciliParasutTaslakPayloadTestEt: seciliParasutTaslakPayloadTestEt_,
    seciliParasutFaturaTaslakGonderOnayli: seciliParasutFaturaTaslakGonderOnayli_,
    parasutCariOlusturVeyaBagla: parasutCariOlusturVeyaBagla_,
    parasutCariPanelAksiyonu: parasutCariPanelAksiyonu_,
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
    seciliSiparisiDuzenle: seciliSiparisiDuzenle_,
    seciliSiparisleriDuzenle: seciliSiparisleriDuzenle_,
    seciliKaydiSil: seciliKaydiSil_,
    seciliKaydiGeriAl: seciliKaydiGeriAl_,
    seciliKaydiArsivle: seciliKaydiArsivle_,
    musteriHafizasiniDuzenle: musteriHafizasiniDuzenle_,
    musteriHafizasindanSil: musteriHafizasindanSil_,
    ultraPanelOperasyonCalistir: ultraPanelOperasyonCalistir_,
    sadeceFaturaOlustur: sadeceFaturaOlustur_,
    sadeceKargoHazirla: sadeceKargoHazirla_,
    bekleyenKargoyuCikar: bekleyenKargoyuCikar_,
    kargoBeklet: kargoBeklet_,
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
    navlungoTokenAl: navlungoTokenAl_,
    navlungoBaglantiTestiTam: navlungoBaglantiTestiTam_,
    navlungoTaslakPayloadOlustur: navlungoTaslakPayloadOlustur_,
    navlungoKargoTaslakTestEt: navlungoKargoTaslakTestEt_,
    navlungoKargoOlusturOnayli: navlungoKargoOlusturOnayli_,
    navlungoBarkodAl: navlungoBarkodAl_,
    navlungoGonderiSorgula: navlungoGonderiSorgula_,
    navlungoGonderiIptalEt: navlungoGonderiIptalEt_,
    navlungoTopluKargoOlustur: navlungoTopluKargoOlustur_,
    seciliNavlungoTopluKargoOlustur: seciliNavlungoTopluKargoOlustur_,
    navlungoTopluBarkodAl: navlungoTopluBarkodAl_,
    navlungoAdresDegisikligiKontrolEt: navlungoAdresDegisikligiKontrolEt_,
    qzBarkodBilgisi: qzBarkodBilgisi_,
    qzBarkodYazdirmaSonucuKaydet: qzBarkodYazdirmaSonucuKaydet_,
    faturaVeKargoOlustur: faturaVeKargoOlustur_,
    ilgiliSiparisSatirlariniBul: ilgiliSiparisSatirlariniBul_,
    senkronizeDurumForOpen: senkronizeDurumForOpen_,
    batchWriteRows: batchWriteRows_,
    cacheAyarlariniOku: cacheAyarlariniOku_,
    cacheParasutProductMap: cacheParasutProductMap_,
    cacheMusteriHafiza: cacheMusteriHafiza_,
    v65GercekSheetKabulKontrolu: v65GercekSheetKabulKontrolu_,
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
function seciliParasutCariAdaylariniGetir() { return TK6.seciliParasutCariAdaylariniGetir(); }
function seciliParasutTaslakPayloadTestEt() { return TK6.seciliParasutTaslakPayloadTestEt(); }
function seciliParasutFaturaTaslakGonderOnayli() { return TK6.seciliParasutFaturaTaslakGonderOnayli(); }
function parasutCariOlusturVeyaBagla(faturaGrubuId, secim) { return TK6.parasutCariOlusturVeyaBagla(faturaGrubuId, secim); }
function parasutCariPanelAksiyonu(openId, payer, mode, contactId) { return TK6.parasutCariPanelAksiyonu(openId, payer, mode, contactId); }
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
function seciliSiparisiDuzenle() { return TK6.seciliSiparisiDuzenle(); }
function seciliSiparisleriDuzenle() { return TK6.seciliSiparisleriDuzenle(); }
function seciliKaydiSil() { return TK6.seciliKaydiSil(); }
function seciliKaydiGeriAl() { return TK6.seciliKaydiGeriAl(); }
function seciliKaydiArsivle() { return TK6.seciliKaydiArsivle(); }
function musteriHafizasiniDuzenle() { return TK6.musteriHafizasiniDuzenle(); }
function musteriHafizasindanSil() { return TK6.musteriHafizasindanSil(); }
function ultraPanelOperasyonCalistir(action, form) { return TK6.ultraPanelOperasyonCalistir(action, form); }
function sadeceFaturaOlustur(openId) { return TK6.sadeceFaturaOlustur(openId); }
function sadeceKargoHazirla(openId) { return TK6.sadeceKargoHazirla(openId); }
function bekleyenKargoyuCikar(openId) { return TK6.bekleyenKargoyuCikar(openId); }
function kargoBeklet(openId) { return TK6.kargoBeklet(openId); }
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
function navlungoTokenAl() { return TK6.navlungoTokenAl(); }
function navlungoBaglantiTestiTam() { return TK6.navlungoBaglantiTestiTam(); }
function navlungoTaslakPayloadOlustur(kargoPaketId) { return TK6.navlungoTaslakPayloadOlustur(kargoPaketId); }
function navlungoKargoTaslakTestEt(kargoPaketId) { return TK6.navlungoKargoTaslakTestEt(kargoPaketId); }
function navlungoKargoOlusturOnayli(kargoPaketId) { return TK6.navlungoKargoOlusturOnayli(kargoPaketId); }
function navlungoBarkodAl(kargoPaketId) { return TK6.navlungoBarkodAl(kargoPaketId); }
function navlungoGonderiSorgula(kargoPaketId) { return TK6.navlungoGonderiSorgula(kargoPaketId); }
function navlungoGonderiIptalEt(kargoPaketId) { return TK6.navlungoGonderiIptalEt(kargoPaketId); }
function navlungoTopluKargoOlustur(seciliPaketler) { return TK6.navlungoTopluKargoOlustur(seciliPaketler); }
function seciliNavlungoTopluKargoOlustur() { return TK6.seciliNavlungoTopluKargoOlustur(); }
function navlungoTopluBarkodAl(seciliPaketler) { return TK6.navlungoTopluBarkodAl(seciliPaketler); }
function navlungoAdresDegisikligiKontrolEt(acikSiparisId) { return TK6.navlungoAdresDegisikligiKontrolEt(acikSiparisId); }
function qzBarkodBilgisi(kargoPaketId) { return TK6.qzBarkodBilgisi(kargoPaketId); }
function qzBarkodYazdirmaSonucuKaydet(kargoPaketId, ok, sonuc, hata) { return TK6.qzBarkodYazdirmaSonucuKaydet(kargoPaketId, ok, sonuc, hata); }
function faturaVeKargoOlustur(openId) { return TK6.faturaVeKargoOlustur(openId); }
function ilgiliSiparisSatirlariniBul(acikSiparisId) { return TK6.ilgiliSiparisSatirlariniBul(acikSiparisId); }
function senkronizeDurumForOpen(acikSiparisId) { return TK6.senkronizeDurumForOpen(acikSiparisId); }
function batchWriteRows(writePlan) { return TK6.batchWriteRows(writePlan); }
function cacheAyarlariniOku() { return TK6.cacheAyarlariniOku(); }
function cacheParasutProductMap() { return TK6.cacheParasutProductMap(); }
function cacheMusteriHafiza() { return TK6.cacheMusteriHafiza(); }
function v65GercekSheetKabulKontrolu() { return TK6.v65GercekSheetKabulKontrolu(); }

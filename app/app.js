const state = {
  stream: null,
  barcodeDetector: null,
  zxingReader: null,
  scanTimer: null,
  scanBusy: false,
  scanCanvas: document.createElement("canvas"),
  scanCandidate: "",
  scanCandidateCount: 0,
  scanCandidateAt: 0,
  scanStartedAt: 0,
  scanHelpShown: false,
  scanMatched: false,
  scanSoundMuted: localStorage.getItem("greenscan.scanSoundMuted") === "true",
  torchOn: false,
  torchSupported: false,
  audioContext: null,
  currentBarcode: "",
  currentFrontPhoto: null,
  currentPhoto: null,
  selectedProductType: "",
  labelHasNutritionFacts: "",
  settings: loadSettings(),
  userAiSettings: loadUserAiSettings(),
  avoidList: loadAvoidList(),
  dietaryFilters: loadDietaryFilters(),
  preferencesSyncing: false,
  cameraActive: false,
  analyzing: false,
  selectedHistoryKey: "",
  user: null,
  isAdmin: false,
  adminStatus: null,
  currentAnalysis: null,
  currentAnalysisCanAddImage: false,
  pendingMatchSource: "",
  reportIssueType: "ingredients",
  adminReportFilter: "all",
  searchMode: "products",
  activeView: "scan",
  accountSyncStarted: false,
  adminPreviewOpen: false,
  adminReturnAfterEdit: "",
  adminEditImageFile: null,
  hydratingHistoryImages: false,
  resultSheetExpanded: false,
  resultSheetTouchStartY: 0,
  activeIngredient: null,
  renderedIngredients: new Map(),
  ingredientRenderId: 0,
};

const OWNER_ADMIN_EMAIL = "littlesaz454@gmail.com";

const els = {
  cameraFeed: document.querySelector("#cameraFeed"),
  freeSharePanel: document.querySelector(".free-share-panel"),
  appDescriptionPanel: document.querySelector(".app-description-panel"),
  scanPanel: document.querySelector(".scan-panel"),
  scannerViewport: document.querySelector(".scanner-viewport"),
  scanFrame: document.querySelector(".scan-frame"),
  soundToggleButton: document.querySelector("#soundToggleButton"),
  torchToggleButton: document.querySelector("#torchToggleButton"),
  scannerEmpty: document.querySelector("#scannerEmpty"),
  cameraHint: document.querySelector("#cameraHint"),
  scanProductPreview: document.querySelector("#scanProductPreview"),
  scanPreviewMedia: document.querySelector("#scanPreviewMedia"),
  scanPreviewName: document.querySelector("#scanPreviewName"),
  scanPreviewMeta: document.querySelector("#scanPreviewMeta"),
  scanPreviewScore: document.querySelector("#scanPreviewScore"),
  scanAssist: document.querySelector("#scanAssist"),
  scanAssistTitle: document.querySelector("#scanAssistTitle"),
  scanAssistMessage: document.querySelector("#scanAssistMessage"),
  scanConfidenceBar: document.querySelector("#scanConfidenceBar"),
  scanStreakPanel: document.querySelector("#scanStreakPanel"),
  startCameraButton: document.querySelector("#startCameraButton"),
  stopCameraButton: document.querySelector("#stopCameraButton"),
  signinPromptPanel: document.querySelector("#signinPromptPanel"),
  signinPromptButton: document.querySelector("#signinPromptButton"),
  shareSiteButton: document.querySelector("#shareSiteButton"),
  onboardingPanel: document.querySelector("#onboardingPanel"),
  dismissOnboardingButton: document.querySelector("#dismissOnboardingButton"),
  permissionCallout: document.querySelector("#permissionCallout"),
  permissionTitle: document.querySelector("#permissionTitle"),
  permissionMessage: document.querySelector("#permissionMessage"),
  barcodeForm: document.querySelector("#barcodeForm"),
  barcodeInput: document.querySelector("#barcodeInput"),
  resultPanel: document.querySelector("#resultPanel"),
  trendingList: document.querySelector("#trendingList"),
  verifiedList: document.querySelector("#verifiedList"),
  statusList: document.querySelector("#statusList"),
  landingServiceStatus: document.querySelector("#landingServiceStatus"),
  homeScreenPanel: document.querySelector("#homeScreenPanel"),
  installTabs: [...document.querySelectorAll(".install-tab")],
  installSteps: document.querySelector("#installSteps"),
  fallbackPanel: document.querySelector("#fallbackPanel"),
  fallbackEyebrow: document.querySelector("#fallbackEyebrow"),
  fallbackTitle: document.querySelector("#fallbackTitle"),
  productTypePanel: document.querySelector("#productTypePanel"),
  photoUploadPanel: document.querySelector("#photoUploadPanel"),
  unsupportedProduct: document.querySelector("#unsupportedProduct"),
  productTypeButtons: [...document.querySelectorAll("[data-product-type]")],
  nutritionFactsPanel: document.querySelector("#nutritionFactsPanel"),
  nutritionFactsButtons: [...document.querySelectorAll("[data-nutrition-facts]")],
  frontPhoto: document.querySelector("#frontPhoto"),
  frontPhotoCheck: document.querySelector("#frontPhotoCheck"),
  frontPhotoPreview: document.querySelector("#frontPhotoPreview"),
  ingredientPhoto: document.querySelector("#ingredientPhoto"),
  backPhotoInstruction: document.querySelector("#backPhotoInstruction"),
  backPhotoCheck: document.querySelector("#backPhotoCheck"),
  photoPreview: document.querySelector("#photoPreview"),
  manualIngredientsLabel: document.querySelector("#manualIngredientsLabel"),
  manualIngredients: document.querySelector("#manualIngredients"),
  analyzePhotoButton: document.querySelector("#analyzePhotoButton"),
  historyList: document.querySelector("#historyList"),
  clearHistoryButton: document.querySelector("#clearHistoryButton"),
  friendlyNutritionCard: document.querySelector("#friendlyNutritionCard"),
  friendlySwapsCard: document.querySelector("#friendlySwapsCard"),
  topMenuButton: document.querySelector("#topMenuButton"),
  topMenu: document.querySelector("#topMenu"),
  notificationButton: document.querySelector("#notificationButton"),
  notificationDot: document.querySelector("#notificationDot"),
  notificationDialog: document.querySelector("#notificationDialog"),
  notificationList: document.querySelector("#notificationList"),
  clearNotificationsButton: document.querySelector("#clearNotificationsButton"),
  adminMenuButton: document.querySelector("#adminMenuButton"),
  settingsButton: document.querySelector("#settingsButton"),
  themeToggleButton: document.querySelector("#themeToggleButton"),
  settingsDialog: document.querySelector("#settingsDialog"),
  accountTitle: document.querySelector("#accountTitle"),
  accountNote: document.querySelector("#accountNote"),
  googleLoginButton: document.querySelector("#googleLoginButton"),
  aiProviderButton: document.querySelector("#aiProviderButton"),
  restrictionsButton: document.querySelector("#restrictionsButton"),
  restrictionsDialog: document.querySelector("#restrictionsDialog"),
  avoidIngredients: document.querySelector("#avoidIngredients"),
  dietFilters: [...document.querySelectorAll(".diet-filter")],
  saveAvoidListButton: document.querySelector("#saveAvoidListButton"),
  searchEyebrow: document.querySelector("#searchEyebrow"),
  searchTitle: document.querySelector("#searchTitle"),
  searchModeButtons: [...document.querySelectorAll("[data-search-mode]")],
  aiProviderDialog: document.querySelector("#aiProviderDialog"),
  aiProviderSelect: document.querySelector("#aiProviderSelect"),
  userAiKey: document.querySelector("#userAiKey"),
  saveAiProviderButton: document.querySelector("#saveAiProviderButton"),
  clearAiProviderButton: document.querySelector("#clearAiProviderButton"),
  sourcesButton: document.querySelector("#sourcesButton"),
  sourcesDialog: document.querySelector("#sourcesDialog"),
  changelogButton: document.querySelector("#changelogButton"),
  changelogDialog: document.querySelector("#changelogDialog"),
  adminPanelButton: document.querySelector("#adminPanelButton"),
  adminDialog: document.querySelector("#adminDialog"),
  adminStats: document.querySelector("#adminStats"),
  adminSystemStatus: document.querySelector("#adminSystemStatus"),
  adminList: document.querySelector("#adminList"),
  adminReportFilters: document.querySelector("#adminReportFilters"),
  adminUserList: document.querySelector("#adminUserList"),
  adminProductSearchInput: document.querySelector("#adminProductSearchInput"),
  adminProductSearchButton: document.querySelector("#adminProductSearchButton"),
  adminProductResults: document.querySelector("#adminProductResults"),
  adminRepairQueueButton: document.querySelector("#adminRepairQueueButton"),
  adminRepairQueue: document.querySelector("#adminRepairQueue"),
  mergeSourceBarcode: document.querySelector("#mergeSourceBarcode"),
  mergeTargetBarcode: document.querySelector("#mergeTargetBarcode"),
  mergeProductsButton: document.querySelector("#mergeProductsButton"),
  grantAdminEmail: document.querySelector("#grantAdminEmail"),
  grantAdminButton: document.querySelector("#grantAdminButton"),
  grantUnlimitedEmail: document.querySelector("#grantUnlimitedEmail"),
  grantUnlimitedButton: document.querySelector("#grantUnlimitedButton"),
  banUserEmail: document.querySelector("#banUserEmail"),
  banUserButton: document.querySelector("#banUserButton"),
  unbanUserButton: document.querySelector("#unbanUserButton"),
  limitSignedInAi: document.querySelector("#limitSignedInAi"),
  limitGuestAi: document.querySelector("#limitGuestAi"),
  limitSearches: document.querySelector("#limitSearches"),
  limitCategoryChecks: document.querySelector("#limitCategoryChecks"),
  limitImageUploads: document.querySelector("#limitImageUploads"),
  saveLimitsButton: document.querySelector("#saveLimitsButton"),
  adminReportList: document.querySelector("#adminReportList"),
  reportButton: document.querySelector("#reportButton"),
  reportDialog: document.querySelector("#reportDialog"),
  reportTypeButtons: [...document.querySelectorAll("[data-report-type]")],
  reportBrandName: document.querySelector("#reportBrandName"),
  reportProductName: document.querySelector("#reportProductName"),
  reportFrontPhoto: document.querySelector("#reportFrontPhoto"),
  reportFrontPhotoCheck: document.querySelector("#reportFrontPhotoCheck"),
  reportBackPhoto: document.querySelector("#reportBackPhoto"),
  reportBackPhotoCheck: document.querySelector("#reportBackPhotoCheck"),
  reportIngredients: document.querySelector("#reportIngredients"),
  submitReportButton: document.querySelector("#submitReportButton"),
  categoryDialog: document.querySelector("#categoryDialog"),
  editBrandName: document.querySelector("#editBrandName"),
  editProductName: document.querySelector("#editProductName"),
  editBroadCategory: document.querySelector("#editBroadCategory"),
  editItemCategory: document.querySelector("#editItemCategory"),
  editCustomCategory: document.querySelector("#editCustomCategory"),
  editBackToAdminButton: document.querySelector("#editBackToAdminButton"),
  editProductImage: document.querySelector("#editProductImage"),
  editProductImageCheck: document.querySelector("#editProductImageCheck"),
  editIngredients: document.querySelector("#editIngredients"),
  saveCategoryButton: document.querySelector("#saveCategoryButton"),
  ingredientDialog: document.querySelector("#ingredientDialog"),
  ingredientRiskLabel: document.querySelector("#ingredientRiskLabel"),
  ingredientDetailTitle: document.querySelector("#ingredientDetailTitle"),
  ingredientDetailReason: document.querySelector("#ingredientDetailReason"),
  ingredientDetailAlias: document.querySelector("#ingredientDetailAlias"),
  ingredientSpeakButton: document.querySelector("#ingredientSpeakButton"),
  ingredientRiskSection: document.querySelector("#ingredientRiskSection"),
  ingredientRiskList: document.querySelector("#ingredientRiskList"),
  ingredientDetailType: document.querySelector("#ingredientDetailType"),
  ingredientDetailScore: document.querySelector("#ingredientDetailScore"),
  logoutButton: document.querySelector("#logoutButton"),
  navHistoryButton: document.querySelector("#navHistoryButton"),
  navForYouButton: document.querySelector("#navForYouButton"),
  navScanButton: document.querySelector("#navScanButton"),
  navSearchButton: document.querySelector("#navSearchButton"),
  navSourcesButton: document.querySelector("#navSourcesButton"),
  desktopNavToggle: document.querySelector("#desktopNavToggle"),
  productSearchForm: document.querySelector("#productSearchForm"),
  productSearchInput: document.querySelector("#productSearchInput"),
  productSearchResults: document.querySelector("#productSearchResults"),
  searchSuggestions: document.querySelector("#searchSuggestions"),
  recentSearches: document.querySelector("#recentSearches"),
  recentSearchList: document.querySelector("#recentSearchList"),
  clearRecentSearchesButton: document.querySelector("#clearRecentSearchesButton"),
  favoritesPanel: document.querySelector("#favoritesPanel"),
};

const googleClientId = "1032217844027-rm6bbkqo8p1dmtt87i4b80s38sesdjnm.apps.googleusercontent.com";
const accountSessionStorageKey = "greenscan.accountSession.v1";
const accountRegistrationStorageKey = "greenscan.accountRegistered.v1";
const googleNonceStorageKey = "greenscan.googleNonce.v1";
const pendingAnalysisStorageKey = "greenscan.pendingAnalysis.v1";

const localCachePolicy = {
  historyLimit: 10,
  productLimit: 30,
  favoriteLimit: 18,
  recentSearchLimit: 8,
  notificationLimit: 15,
  pendingAnalysisLimit: 6,
  keepProductImages: 6,
  keepHistoryImages: 3,
  maxInlineImageLength: 90000,
};

const itemCategoryOptions = {
  food: [
    "Pretzels",
    "Chips",
    "Crackers",
    "Snack",
    "Candy",
    "Chocolate",
    "Cookies",
    "Cereal",
    "Granola Bar",
    "Bread",
    "Sauce",
    "Condiment",
    "Drink",
    "Juice",
    "Dairy",
    "Frozen Food",
    "Meal",
    "Food / Drink",
  ],
  beauty: [
    "Deodorant",
    "Mouthwash",
    "Toothpaste",
    "Shampoo",
    "Conditioner",
    "Hair Mask",
    "Hair Gel",
    "Hair Oil",
    "Body Wash",
    "Soap",
    "Lotion",
    "Hand Cream",
    "Face Cream",
    "Cleanser",
    "Serum",
    "Sunscreen",
    "Lip Balm",
    "Makeup",
    "Fragrance",
    "Beauty / Hair",
  ],
};

const databaseClients = [
  {
    name: "Open Food Facts",
    category: "food",
    url: (barcode) => `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,product_name_en,generic_name,generic_name_en,abbreviated_product_name,brands,brands_tags,categories,categories_tags,labels_tags,countries,countries_tags,ingredients_text,image_front_url,nutriments,nutriscore_grade,ecoscore_grade,additives_tags,allergens,allergens_tags,traces,traces_tags`,
  },
  {
    name: "Open Beauty Facts",
    category: "beauty",
    url: (barcode) => `https://world.openbeautyfacts.org/api/v2/product/${barcode}.json?fields=product_name,product_name_en,generic_name,generic_name_en,abbreviated_product_name,brands,brands_tags,categories,categories_tags,labels_tags,countries,countries_tags,ingredients_text,image_front_url,ingredients_analysis_tags,allergens,allergens_tags,traces,traces_tags`,
  },
];

const productSearchClients = [
  {
    ...databaseClients[0],
    searchUrl: (query) => `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=12&fields=code,product_name,product_name_en,generic_name,generic_name_en,abbreviated_product_name,brands,brands_tags,categories,categories_tags,labels_tags,countries,countries_tags,ingredients_text,image_front_url,nutriments,nutriscore_grade,ecoscore_grade,additives_tags,allergens,allergens_tags,traces,traces_tags`,
  },
  {
    ...databaseClients[1],
    searchUrl: (query) => `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=12&fields=code,product_name,product_name_en,generic_name,generic_name_en,abbreviated_product_name,brands,brands_tags,categories,categories_tags,labels_tags,countries,countries_tags,ingredients_text,image_front_url,ingredients_analysis_tags,allergens,allergens_tags,traces,traces_tags`,
  },
];

const riskDictionary = [
  { match: "brominated vegetable oil", type: "food_additive", risk: "high", reason: "Food additive no longer authorized by the FDA for use in food." },
  { match: "bvo", type: "food_additive", risk: "high", reason: "Brominated vegetable oil is no longer authorized by the FDA for use in food." },
  { match: "fd&c red no. 3", type: "colorant", risk: "high", reason: "Color additive authorization for food and ingested drugs has been revoked by the FDA." },
  { match: "red no. 3", type: "colorant", risk: "high", reason: "Color additive authorization for food and ingested drugs has been revoked by the FDA." },
  { match: "red 3", type: "colorant", risk: "high", reason: "Color additive authorization for food and ingested drugs has been revoked by the FDA." },
  { match: "erythrosine", type: "colorant", risk: "high", reason: "Also known as FD&C Red No. 3; FDA revoked its authorization for food and ingested drugs." },
  { match: "red 40", type: "colorant", risk: "moderate", reason: "Artificial color commonly flagged by cautious consumers." },
  { match: "allura red", type: "colorant", risk: "moderate", reason: "Artificial red color commonly flagged by cautious consumers and can require labeling in some markets." },
  { match: "allura red ac", type: "colorant", risk: "moderate", reason: "Artificial red color commonly flagged by cautious consumers and can require labeling in some markets." },
  { match: "yellow 5", type: "colorant", risk: "moderate", reason: "Artificial color associated with sensitivity concerns for some people." },
  { match: "yellow 6", type: "colorant", risk: "moderate", reason: "Artificial color commonly flagged by cautious consumers." },
  { match: "sunset yellow", type: "colorant", risk: "moderate", reason: "Artificial yellow/orange color commonly flagged by cautious consumers and can require labeling in some markets." },
  { match: "sunset yellow fcf", type: "colorant", risk: "moderate", reason: "Artificial yellow/orange color commonly flagged by cautious consumers and can require labeling in some markets." },
  { match: "blue 1", type: "colorant", risk: "moderate", reason: "Artificial color commonly flagged by cautious consumers." },
  { match: "blue 2", type: "colorant", risk: "moderate", reason: "Artificial color commonly flagged by cautious consumers." },
  { match: "brilliant blue fcf", type: "colorant", risk: "moderate", reason: "Artificial blue color commonly flagged by cautious consumers." },
  { match: "indigo carmine", type: "colorant", risk: "moderate", reason: "Artificial blue color commonly flagged by cautious consumers." },
  { match: "tartrazine", type: "colorant", risk: "moderate", reason: "Synthetic yellow dye associated with sensitivity concerns for some people." },
  { match: "titanium dioxide", type: "food_additive", risk: "high", reason: "Food additive banned in the EU because regulators could not rule out genotoxicity concerns." },
  { match: "e171", type: "food_additive", risk: "high", reason: "Titanium dioxide food additive banned in the EU because regulators could not rule out genotoxicity concerns." },
  { match: "e 171", type: "food_additive", risk: "high", reason: "Titanium dioxide food additive banned in the EU because regulators could not rule out genotoxicity concerns." },
  { match: "potassium bromate", type: "flour_treatment", risk: "high", reason: "Flour improver restricted or avoided in multiple markets because of safety concerns." },
  { match: "bromate", type: "flour_treatment", risk: "high", reason: "Bromate flour improvers are restricted or avoided in multiple markets because of safety concerns." },
  { match: "sodium nitrite", type: "preservative", risk: "high", reason: "Cured-meat preservative often limited by safety-focused scoring systems." },
  { match: "sodium nitrate", type: "preservative", risk: "moderate", reason: "Cured-food preservative commonly limited by cautious shoppers." },
  { match: "potassium nitrite", type: "preservative", risk: "high", reason: "Cured-meat preservative often limited by safety-focused scoring systems." },
  { match: "potassium nitrate", type: "preservative", risk: "moderate", reason: "Cured-food preservative commonly limited by cautious shoppers." },
  { match: "butylated hydroxyanisole", type: "preservative", risk: "high", reason: "BHA preservative with recurring consumer safety concern." },
  { match: "bha", type: "preservative", risk: "high", reason: "Preservative with recurring consumer safety concern." },
  { match: "butylated hydroxytoluene", type: "preservative", risk: "moderate", reason: "BHT preservative often flagged by health-focused shoppers." },
  { match: "bht", type: "preservative", risk: "moderate", reason: "Preservative often flagged by health-focused shoppers." },
  { match: "tbhq", type: "preservative", risk: "moderate", reason: "Synthetic preservative often flagged by health-focused shoppers." },
  { match: "propyl gallate", type: "preservative", risk: "moderate", reason: "Synthetic preservative often grouped with additives cautious shoppers limit." },
  { match: "propylparaben", type: "preservative", risk: "high", reason: "Food preservative banned by California starting in 2027 and restricted/prohibited in some cosmetic contexts." },
  { match: "propyl paraben", type: "preservative", risk: "high", reason: "Food preservative banned by California starting in 2027 and restricted/prohibited in some cosmetic contexts." },
  { match: "sodium benzoate", type: "preservative", risk: "moderate", reason: "Preservative that some shoppers limit in processed foods and drinks." },
  { match: "potassium benzoate", type: "preservative", risk: "moderate", reason: "Preservative that some shoppers limit in processed foods and drinks." },
  { match: "calcium benzoate", type: "preservative", risk: "moderate", reason: "Benzoate preservative that some shoppers limit in processed foods and drinks." },
  { match: "benzoic acid", type: "preservative", risk: "moderate", reason: "Benzoate-family preservative that some shoppers limit in processed foods and drinks." },
  { match: "potassium sorbate", type: "preservative", risk: "moderate", reason: "Preservative used in processed foods that some sensitive shoppers prefer to limit." },
  { match: "sorbic acid", type: "preservative", risk: "moderate", reason: "Preservative used in processed foods that some sensitive shoppers prefer to limit." },
  { match: "sodium metabisulfite", type: "preservative", risk: "moderate", reason: "Sulfite preservative that can be a sensitivity concern for some people." },
  { match: "potassium metabisulfite", type: "preservative", risk: "moderate", reason: "Sulfite preservative that can be a sensitivity concern for some people." },
  { match: "sodium sulfite", type: "preservative", risk: "moderate", reason: "Sulfite preservative that can trigger sensitivity reactions in some people." },
  { match: "potassium bisulfite", type: "preservative", risk: "moderate", reason: "Sulfite preservative that can trigger sensitivity reactions in some people." },
  { match: "sulfur dioxide", type: "preservative", risk: "moderate", reason: "Sulfite preservative that can be a sensitivity concern for some people." },
  { match: "azodicarbonamide", type: "flour_treatment", risk: "moderate", reason: "Dough conditioner banned or restricted in some markets and often avoided by cautious shoppers." },
  { match: "calcium propionate", type: "preservative", risk: "moderate", reason: "Bread preservative that some shoppers limit in processed foods." },
  { match: "sodium aluminum phosphate", type: "leavening_agent", risk: "moderate", reason: "Aluminum-containing food additive that cautious shoppers often limit." },
  { match: "sodium aluminium phosphate", type: "leavening_agent", risk: "moderate", reason: "Aluminum-containing food additive that cautious shoppers often limit." },
  { match: "aluminum sulfate", type: "leavening_agent", risk: "moderate", reason: "Aluminum-containing food additive that cautious shoppers often limit." },
  { match: "aluminium sulfate", type: "leavening_agent", risk: "moderate", reason: "Aluminum-containing food additive that cautious shoppers often limit." },
  { match: "carrageenan", type: "thickener", risk: "moderate", reason: "Additive some shoppers avoid because of digestive tolerance concerns." },
  { match: "carboxymethylcellulose", type: "emulsifier", risk: "moderate", reason: "Highly processed thickener/emulsifier additive that cautious shoppers often limit." },
  { match: "cellulose gum", type: "emulsifier", risk: "moderate", reason: "Highly processed thickener/emulsifier additive that cautious shoppers often limit." },
  { match: "polysorbate 80", type: "emulsifier", risk: "moderate", reason: "Emulsifier additive that cautious shoppers often limit in processed foods." },
  { match: "polysorbate 60", type: "emulsifier", risk: "moderate", reason: "Emulsifier additive that cautious shoppers often limit in processed foods." },
  { match: "polysorbate 20", type: "emulsifier", risk: "moderate", reason: "Emulsifier additive that cautious shoppers often limit in processed foods and personal care." },
  { match: "propylene glycol", type: "solvent", risk: "moderate", reason: "Solvent/humectant that can bother some sensitive shoppers in food or personal care products." },
  { match: "mono- and diglycerides", type: "emulsifier", risk: "moderate", reason: "Processed emulsifier additive that some shoppers prefer to limit." },
  { match: "monoglycerides", type: "emulsifier", risk: "moderate", reason: "Processed emulsifier additive that some shoppers prefer to limit." },
  { match: "diglycerides", type: "emulsifier", risk: "moderate", reason: "Processed emulsifier additive that some shoppers prefer to limit." },
  { match: "datem", type: "emulsifier", risk: "moderate", reason: "Processed emulsifier additive used in packaged baked goods." },
  { match: "acesulfame potassium", type: "sweetener", risk: "moderate", reason: "Artificial sweetener that cautious shoppers may prefer to limit." },
  { match: "acesulfame k", type: "sweetener", risk: "moderate", reason: "Artificial sweetener that cautious shoppers may prefer to limit." },
  { match: "aspartame", type: "sweetener", risk: "moderate", reason: "Artificial sweetener that cautious shoppers may prefer to limit." },
  { match: "sucralose", type: "sweetener", risk: "moderate", reason: "Artificial sweetener that cautious shoppers may prefer to limit." },
  { match: "saccharin", type: "sweetener", risk: "moderate", reason: "Artificial sweetener that cautious shoppers may prefer to limit." },
  { match: "neotame", type: "sweetener", risk: "moderate", reason: "Artificial sweetener that cautious shoppers may prefer to limit." },
  { match: "advantame", type: "sweetener", risk: "moderate", reason: "Artificial sweetener that cautious shoppers may prefer to limit." },
  { match: "glucose syrup", type: "sweetener", risk: "moderate", reason: "Added sugar syrup can raise the sugar load of a food." },
  { match: "high fructose corn syrup", type: "sweetener", risk: "moderate", reason: "Added sweetener that can lower nutrition quality." },
  { match: "corn syrup", type: "sweetener", risk: "moderate", reason: "Added sweetener that can lower nutrition quality." },
  { match: "dextrose", type: "sweetener", risk: "moderate", reason: "Added sugar that can raise the sugar load of a food." },
  { match: "maltodextrin", type: "sweetener", risk: "moderate", reason: "Highly processed carbohydrate often used as a food additive." },
  { match: "sugar", type: "sweetener", risk: "moderate", reason: "Added sugar can lower nutrition quality when it is a major ingredient." },
  { match: "partially hydrogenated", type: "added_fat", risk: "high", reason: "Partially hydrogenated oils are artificial trans fat sources removed from GRAS status by the FDA." },
  { match: "palm oil", type: "added_fat", risk: "moderate", reason: "Added fat often raises calorie density and saturated fat concerns." },
  { match: "hydrogenated oil", type: "added_fat", risk: "high", reason: "Hydrogenated oils are strongly flagged in many nutrition-focused systems." },
  { match: "hydrogenated palm", type: "added_fat", risk: "high", reason: "Hydrogenated oils are strongly flagged in nutrition-focused systems." },
  { match: "shortening", type: "added_fat", risk: "moderate", reason: "Added fat that can increase calorie density and saturated fat." },
  { match: "lecithin", type: "food_additive", risk: "moderate", reason: "Emulsifier additive that some shoppers prefer to limit in processed foods." },
  { match: "vanillin", type: "flavor", risk: "moderate", reason: "Added flavoring with limited ingredient detail." },
  { match: "natural flavor", type: "flavor", risk: "moderate", reason: "Flavoring label that can hide a mixture of compounds." },
  { match: "artificial flavor", type: "flavor", risk: "moderate", reason: "Artificial flavoring that cautious shoppers often avoid." },
  { match: "mercury", type: "restricted_cosmetic", risk: "high", reason: "Mercury compounds are restricted in cosmetics because of absorption and toxicity concerns." },
  { match: "mercurous chloride", type: "restricted_cosmetic", risk: "high", reason: "Mercury compounds are restricted in cosmetics because of absorption and toxicity concerns." },
  { match: "calomel", type: "restricted_cosmetic", risk: "high", reason: "Mercury compound restricted in cosmetics because of toxicity concerns." },
  { match: "lead acetate", type: "hair_dye", risk: "high", reason: "US FDA repealed approval for lead acetate in hair dyes because there is no longer a reasonable certainty of no harm." },
  { match: "vinyl chloride", type: "restricted_cosmetic", risk: "high", reason: "FDA prohibits vinyl chloride in aerosol cosmetics because it causes cancer and other health problems." },
  { match: "chloroform", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this cosmetic ingredient because of safety concerns." },
  { match: "methylene chloride", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this cosmetic ingredient because of safety concerns." },
  { match: "bithionol", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this cosmetic ingredient because of sensitization and safety concerns." },
  { match: "hexachlorophene", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this cosmetic ingredient because it can penetrate skin and has toxicity concerns." },
  { match: "halogenated salicylanilide", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts halogenated salicylanilides in cosmetics because of safety and sensitization concerns." },
  { match: "tribromsalan", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this halogenated salicylanilide in cosmetics because of safety and sensitization concerns." },
  { match: "dibromsalan", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this halogenated salicylanilide in cosmetics because of safety and sensitization concerns." },
  { match: "metabromsalan", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this halogenated salicylanilide in cosmetics because of safety and sensitization concerns." },
  { match: "tetrachlorosalicylanilide", type: "restricted_cosmetic", risk: "high", reason: "FDA restricts this halogenated salicylanilide in cosmetics because of safety and sensitization concerns." },
  { match: "chlorofluorocarbon", type: "restricted_cosmetic", risk: "high", reason: "US regulations prohibit or restrict chlorofluorocarbon propellants in cosmetic aerosol products." },
  { match: "zirconium", type: "restricted_cosmetic", risk: "high", reason: "FDA prohibits zirconium-containing complexes in aerosol cosmetic products because of lung toxicity concerns." },
  { match: "hydroquinone", type: "restricted_cosmetic", risk: "high", reason: "Skin-lightening ingredient prohibited or tightly restricted in several markets." },
  { match: "deoxyarbutin", type: "restricted_cosmetic", risk: "high", reason: "EU action links this ingredient to hydroquinone release; hydroquinone is prohibited in EU cosmetics except limited professional nail use." },
  { match: "tetrahydropyranyloxy phenol", type: "restricted_cosmetic", risk: "high", reason: "EU action links this ingredient to hydroquinone release; hydroquinone is prohibited in EU cosmetics except limited professional nail use." },
  { match: "dibutyl phthalate", type: "plasticizer", risk: "high", reason: "Phthalate prohibited in EU cosmetics because of reproductive toxicity concerns." },
  { match: "diethylhexyl phthalate", type: "plasticizer", risk: "high", reason: "Phthalate prohibited in EU cosmetics because of reproductive toxicity concerns." },
  { match: "dehp", type: "plasticizer", risk: "high", reason: "Phthalate prohibited in EU cosmetics because of reproductive toxicity concerns." },
  { match: "diethyl phthalate", type: "plasticizer", risk: "moderate", reason: "Phthalate fragrance solvent commonly avoided by cautious shoppers because of broader phthalate concerns." },
  { match: "dimethyl phthalate", type: "plasticizer", risk: "moderate", reason: "Phthalate solvent commonly avoided by cautious shoppers because of broader phthalate concerns." },
  { match: "phthalate", type: "plasticizer", risk: "moderate", reason: "Phthalate family commonly avoided because of endocrine and reproductive-safety concerns." },
  { match: "butylphenyl methylpropional", type: "fragrance", risk: "high", reason: "Also known as lilial, a fragrance ingredient banned in EU cosmetics due to reproductive toxicity classification." },
  { match: "lilial", type: "fragrance", risk: "high", reason: "Fragrance ingredient banned in EU cosmetics due to reproductive toxicity classification." },
  { match: "triclosan", type: "antimicrobial", risk: "moderate", reason: "Antimicrobial ingredient with consumer and regulatory concern." },
  { match: "triclocarban", type: "antimicrobial", risk: "moderate", reason: "Antimicrobial ingredient with consumer and regulatory concern." },
  { match: "zinc pyrithione", type: "antidandruff", risk: "high", reason: "EU banned zinc pyrithione in cosmetics after reproductive toxicity classification." },
  { match: "pyrithione zinc", type: "antidandruff", risk: "high", reason: "EU banned zinc pyrithione in cosmetics after reproductive toxicity classification." },
  { match: "toluene", type: "solvent", risk: "high", reason: "Solvent commonly avoided in nail products because of inhalation and reproductive toxicity concerns." },
  { match: "methyl methacrylate", type: "nail_product", risk: "high", reason: "Nail product monomer restricted or warned about by regulators because of irritation and sensitization concerns." },
  { match: "ethyl tosylamide", type: "film_former", risk: "moderate", reason: "Nail product ingredient restricted in the EU because of antibiotic-resistance concern." },
  { match: "coal tar", type: "colorant", risk: "high", reason: "Colorant family with stronger regulatory concern in cosmetics." },
  { match: "p-phenylenediamine", type: "hair_dye", risk: "moderate", reason: "Hair dye ingredient associated with allergy and sensitization concerns." },
  { match: "para-phenylenediamine", type: "hair_dye", risk: "moderate", reason: "Hair dye ingredient associated with allergy and sensitization concerns." },
  { match: "ppd", type: "hair_dye", risk: "moderate", reason: "Hair dye ingredient associated with allergy and sensitization concerns." },
  { match: "resorcinol", type: "hair_dye", risk: "moderate", reason: "Hair dye ingredient commonly flagged by cautious shoppers." },
  { match: "hydrogen peroxide", type: "hair_dye", risk: "moderate", reason: "Oxidizer in hair color and bleaching products that can irritate skin, eyes, or scalp if misused." },
  { match: "persulfate", type: "hair_dye", risk: "moderate", reason: "Bleaching agent family associated with irritation and respiratory sensitization concerns." },
  { match: "ammonium persulfate", type: "hair_dye", risk: "moderate", reason: "Bleaching agent associated with irritation and respiratory sensitization concerns." },
  { match: "potassium persulfate", type: "hair_dye", risk: "moderate", reason: "Bleaching agent associated with irritation and respiratory sensitization concerns." },
  { match: "sodium persulfate", type: "hair_dye", risk: "moderate", reason: "Bleaching agent associated with irritation and respiratory sensitization concerns." },
  { match: "m-aminophenol", type: "hair_dye", risk: "moderate", reason: "Hair dye ingredient regulated with concentration limits because of sensitization concerns." },
  { match: "p-aminophenol", type: "hair_dye", risk: "moderate", reason: "Hair dye ingredient regulated with concentration limits because of sensitization concerns." },
  { match: "ammonia", type: "hair_dye", risk: "moderate", reason: "Hair color ingredient that can irritate eyes, skin, and respiratory passages." },
  { match: "quaternium-15", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "dmdm hydantoin", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "imidazolidinyl urea", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "diazolidinyl urea", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "bronopol", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "sodium hydroxymethylglycinate", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "methenamine", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "benzylhemiformal", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "polyoxymethylene urea", type: "preservative_cosmetic", risk: "high", reason: "Formaldehyde-releasing preservative with allergy and safety concerns." },
  { match: "glyoxal", type: "preservative_cosmetic", risk: "high", reason: "Preservative/crosslinking ingredient with stronger EU CMR-style concern in cosmetics." },
  { match: "glutaral", type: "preservative_cosmetic", risk: "moderate", reason: "Preservative with sensitization concern and EU cosmetic concentration limits." },
  { match: "glutaraldehyde", type: "preservative_cosmetic", risk: "moderate", reason: "Preservative with sensitization concern and EU cosmetic concentration limits." },
  { match: "fragrance", type: "fragrance", risk: "moderate", reason: "Fragrance can hide allergens and may irritate sensitive skin." },
  { match: "parfum", type: "fragrance", risk: "moderate", reason: "Fragrance can hide allergens and may irritate sensitive skin." },
  { match: "oakmoss", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen restricted in EU cosmetics due to sensitization concern." },
  { match: "treemoss", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen restricted in EU cosmetics due to sensitization concern." },
  { match: "isoeugenol", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen with EU concentration limits and labeling concern." },
  { match: "eugenol", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen with EU labeling concern above low thresholds." },
  { match: "cinnamal", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen with EU labeling concern above low thresholds." },
  { match: "hydroxycitronellal", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen with EU labeling concern above low thresholds." },
  { match: "citral", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen with EU labeling concern above low thresholds." },
  { match: "limonene", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen with EU labeling concern above low thresholds, especially after oxidation." },
  { match: "linalool", type: "fragrance_allergen", risk: "moderate", reason: "Fragrance allergen with EU labeling concern above low thresholds, especially after oxidation." },
  { match: "paraben", type: "preservative_cosmetic", risk: "moderate", reason: "Preservative family commonly avoided by some consumers." },
  { match: "isobutylparaben", type: "preservative_cosmetic", risk: "high", reason: "Paraben prohibited in EU cosmetics because of reproductive-toxicity concern." },
  { match: "isopropylparaben", type: "preservative_cosmetic", risk: "high", reason: "Paraben prohibited in EU cosmetics because of reproductive-toxicity concern." },
  { match: "phenylparaben", type: "preservative_cosmetic", risk: "high", reason: "Paraben prohibited in EU cosmetics because of reproductive-toxicity concern." },
  { match: "benzylparaben", type: "preservative_cosmetic", risk: "high", reason: "Paraben prohibited in EU cosmetics because of reproductive-toxicity concern." },
  { match: "pentylparaben", type: "preservative_cosmetic", risk: "high", reason: "Paraben prohibited in EU cosmetics because of reproductive-toxicity concern." },
  { match: "formaldehyde", type: "preservative_cosmetic", risk: "high", reason: "Strong concern ingredient or releaser in cosmetic safety screening." },
  { match: "methylchloroisothiazolinone", type: "preservative_cosmetic", risk: "high", reason: "Known sensitizer, especially relevant for leave-on cosmetics." },
  { match: "methylisothiazolinone", type: "preservative_cosmetic", risk: "high", reason: "Known sensitizer, especially relevant for leave-on cosmetics." },
  { match: "benzisothiazolinone", type: "preservative_cosmetic", risk: "moderate", reason: "Isothiazolinone preservative associated with allergy and sensitization concerns." },
  { match: "octylisothiazolinone", type: "preservative_cosmetic", risk: "moderate", reason: "Isothiazolinone preservative associated with allergy and sensitization concerns." },
  { match: "chloromethylisothiazolinone", type: "preservative_cosmetic", risk: "high", reason: "Isothiazolinone preservative associated with strong allergy and sensitization concerns." },
  { match: "phenoxyethanol", type: "preservative_cosmetic", risk: "moderate", reason: "Preservative some shoppers limit because of irritation concerns." },
  { match: "benzyl alcohol", type: "preservative_cosmetic", risk: "moderate", reason: "Fragrance/preservative allergen that can irritate sensitive skin." },
  { match: "oxybenzone", type: "uv_filter", risk: "moderate", reason: "UV filter with consumer and environmental concern." },
  { match: "benzophenone-3", type: "uv_filter", risk: "moderate", reason: "UV filter with consumer and environmental concern." },
  { match: "benzophenone-4", type: "uv_filter", risk: "moderate", reason: "UV filter/fragrance stabilizer with consumer and regulatory concern." },
  { match: "benzophenone", type: "uv_filter", risk: "moderate", reason: "UV filter/fragrance stabilizer with consumer and regulatory concern." },
  { match: "octinoxate", type: "uv_filter", risk: "moderate", reason: "UV filter with consumer and environmental concern." },
  { match: "octyl methoxycinnamate", type: "uv_filter", risk: "moderate", reason: "UV filter with consumer and environmental concern." },
  { match: "homosalate", type: "uv_filter", risk: "moderate", reason: "UV filter restricted in the EU because of endocrine-safety review concerns." },
  { match: "octocrylene", type: "uv_filter", risk: "moderate", reason: "UV filter with environmental and allergy concern; also reviewed by EU safety bodies." },
  { match: "4-methylbenzylidene camphor", type: "uv_filter", risk: "high", reason: "UV filter banned in EU cosmetics because of endocrine-safety concerns." },
  { match: "methylbenzylidene camphor", type: "uv_filter", risk: "high", reason: "UV filter banned in EU cosmetics because of endocrine-safety concerns." },
  { match: "sodium lauryl sulfate", type: "surfactant", risk: "moderate", reason: "Can be drying or irritating for some skin and scalp types." },
  { match: "sodium laureth sulfate", type: "surfactant", risk: "moderate", reason: "Can be drying or irritating for some skin and scalp types." },
  { match: "ammonium lauryl sulfate", type: "surfactant", risk: "moderate", reason: "Can be drying or irritating for some skin and scalp types." },
  { match: "ammonium laureth sulfate", type: "surfactant", risk: "moderate", reason: "Can be drying or irritating for some skin and scalp types." },
  { match: "cocamide dea", type: "surfactant", risk: "high", reason: "DEA-related surfactant flagged by regulators and safety advocates because of contamination and nitrosamine concerns." },
  { match: "lauramide dea", type: "surfactant", risk: "high", reason: "DEA-related surfactant flagged because of nitrosamine contamination concerns." },
  { match: "oleamide dea", type: "surfactant", risk: "high", reason: "DEA-related surfactant flagged because of nitrosamine contamination concerns." },
  { match: "myristamide dea", type: "surfactant", risk: "high", reason: "DEA-related surfactant flagged because of nitrosamine contamination concerns." },
  { match: "diethanolamine", type: "cosmetic_base", risk: "moderate", reason: "DEA ingredient commonly limited because of nitrosamine contamination concern." },
  { match: "monoethanolamine", type: "cosmetic_base", risk: "moderate", reason: "Amine ingredient commonly limited because of irritation and nitrosamine contamination concern." },
  { match: "triethanolamine", type: "cosmetic_base", risk: "moderate", reason: "Amine ingredient commonly limited because of nitrosamine contamination concern." },
  { match: "cyclotetrasiloxane", type: "silicone", risk: "moderate", reason: "Also known as D4, restricted in the EU under REACH for environmental and safety concerns." },
  { match: "octamethylcyclotetrasiloxane", type: "silicone", risk: "moderate", reason: "Also known as D4, restricted in the EU under REACH for environmental and safety concerns." },
  { match: "cyclopentasiloxane", type: "silicone", risk: "moderate", reason: "Also known as D5, restricted in the EU under REACH for environmental and safety concerns." },
  { match: "decamethylcyclopentasiloxane", type: "silicone", risk: "moderate", reason: "Also known as D5, restricted in the EU under REACH for environmental and safety concerns." },
  { match: "cyclohexasiloxane", type: "silicone", risk: "moderate", reason: "Also known as D6, restricted in the EU under REACH for environmental and safety concerns." },
  { match: "dodecamethylcyclohexasiloxane", type: "silicone", risk: "moderate", reason: "Also known as D6, restricted in the EU under REACH for environmental and safety concerns." },
  { match: "ptfe", type: "pfas", risk: "moderate", reason: "PFAS-type cosmetic ingredient; FDA reports data gaps and ongoing safety review for PFAS in cosmetics." },
  { match: "polytetrafluoroethylene", type: "pfas", risk: "moderate", reason: "PFAS-type cosmetic ingredient; FDA reports data gaps and ongoing safety review for PFAS in cosmetics." },
  { match: "perfluoro", type: "pfas", risk: "moderate", reason: "PFAS signal in a cosmetic ingredient name; FDA reports data gaps and ongoing safety review for PFAS in cosmetics." },
  { match: "polyperfluoro", type: "pfas", risk: "moderate", reason: "PFAS signal in a cosmetic ingredient name; FDA reports data gaps and ongoing safety review for PFAS in cosmetics." },
  { match: "polyethylene", type: "microplastic", risk: "moderate", reason: "Synthetic polymer/microplastic signal; EU restricts intentionally added microplastics to reduce environmental pollution." },
  { match: "polypropylene", type: "microplastic", risk: "moderate", reason: "Synthetic polymer/microplastic signal; EU restricts intentionally added microplastics to reduce environmental pollution." },
  { match: "polyethylene terephthalate", type: "microplastic", risk: "moderate", reason: "Synthetic polymer/microplastic signal; EU restricts intentionally added microplastics to reduce environmental pollution." },
  { match: "polymethyl methacrylate", type: "microplastic", risk: "moderate", reason: "Synthetic polymer/microplastic signal; EU restricts intentionally added microplastics to reduce environmental pollution." },
  { match: "nylon-12", type: "microplastic", risk: "moderate", reason: "Synthetic polymer powder/microplastic signal; EU restricts intentionally added microplastics to reduce environmental pollution." },
  { match: "nylon 12", type: "microplastic", risk: "moderate", reason: "Synthetic polymer powder/microplastic signal; EU restricts intentionally added microplastics to reduce environmental pollution." },
  { match: "acrylates copolymer", type: "microplastic", risk: "moderate", reason: "Synthetic polymer/microplastic signal; EU restricts intentionally added microplastics to reduce environmental pollution." },
  { match: "carbomer", type: "microplastic", risk: "moderate", reason: "Synthetic polymer signal that some shoppers avoid because of microplastic and persistence concerns." },
  { match: "boric acid", type: "restricted_cosmetic", risk: "moderate", reason: "Boron compound restricted in EU cosmetics because of reproductive-toxicity classification concerns." },
  { match: "sodium borate", type: "restricted_cosmetic", risk: "moderate", reason: "Boron compound restricted in EU cosmetics because of reproductive-toxicity classification concerns." },
  { match: "borax", type: "restricted_cosmetic", risk: "moderate", reason: "Boron compound restricted in EU cosmetics because of reproductive-toxicity classification concerns." },
  { match: "sodium perborate", type: "restricted_cosmetic", risk: "high", reason: "Perborate compound prohibited in EU cosmetics due to CMR reproductive-toxicity classification." },
  { match: "perboric acid", type: "restricted_cosmetic", risk: "high", reason: "Perborate compound prohibited in EU cosmetics due to CMR reproductive-toxicity classification." },
  { match: "selenium sulfide", type: "antidandruff", risk: "moderate", reason: "Antidandruff active with regulatory limits and stronger caution in some markets." },
  { match: "selenium sulphide", type: "antidandruff", risk: "moderate", reason: "Antidandruff active with regulatory limits and stronger caution in some markets." },
  { match: "talc", type: "powder", risk: "moderate", reason: "FDA has warned that talc-containing cosmetics need reliable asbestos testing because talc can be contaminated with asbestos." },
  { match: "denatured alcohol", type: "cosmetic_base", risk: "moderate", reason: "Can be drying or irritating for some skin types." },
  { match: "alcohol denat", type: "cosmetic_base", risk: "moderate", reason: "Can be drying or irritating for some skin types." },
];

// Verified low-concern entries are kept separate from the concern list so arbitrary
// text is never treated as a safe ingredient.
const knownIngredientCatalog = [
  { match: "water", type: "food_ingredient", categories: ["food"], reason: "Common food ingredient." },
  { match: "salt", type: "food_ingredient", categories: ["food"], reason: "Common food ingredient; dietary sodium can still matter in the overall product." },
  { match: "flour", type: "food_ingredient", categories: ["food"], reason: "Common grain-based food ingredient." },
  { match: "wheat flour", type: "food_ingredient", categories: ["food"], reason: "Common grain-based food ingredient; contains wheat/gluten." },
  { match: "corn starch", type: "food_ingredient", categories: ["food"], reason: "Common food thickener." },
  { match: "citric acid", type: "food_ingredient", categories: ["food"], reason: "Common food acidulant and flavoring ingredient." },
  { match: "ascorbic acid", type: "food_ingredient", categories: ["food"], reason: "Vitamin C; commonly used in foods." },
  { match: "calcium carbonate", type: "food_ingredient", categories: ["food"], reason: "Common mineral ingredient in foods." },
  { match: "soy lecithin", type: "food_ingredient", categories: ["food"], reason: "Common food emulsifier; soy-sensitive shoppers should check the label." },
  { match: "xanthan gum", type: "food_ingredient", categories: ["food"], reason: "Common food thickener." },
  { match: "guar gum", type: "food_ingredient", categories: ["food"], reason: "Common food thickener." },
  { match: "glycerin", type: "cosmetic_base", categories: ["beauty"], reason: "Common humectant used to help retain moisture." },
  { match: "aqua", type: "cosmetic_base", categories: ["beauty"], reason: "Water; common cosmetic base ingredient." },
  { match: "water", type: "cosmetic_base", categories: ["beauty"], reason: "Common cosmetic base ingredient." },
  { match: "niacinamide", type: "cosmetic_base", categories: ["beauty"], reason: "Common vitamin B3 skincare ingredient." },
  { match: "hyaluronic acid", type: "cosmetic_base", categories: ["beauty"], reason: "Common humectant used in skincare." },
  { match: "sodium hyaluronate", type: "cosmetic_base", categories: ["beauty"], reason: "Common humectant used in skincare." },
  { match: "panthenol", type: "cosmetic_base", categories: ["beauty"], reason: "Common provitamin B5 conditioning ingredient." },
  { match: "tocopherol", type: "cosmetic_base", categories: ["beauty"], reason: "Vitamin E; commonly used as an antioxidant in cosmetics." },
  { match: "cetearyl alcohol", type: "cosmetic_base", categories: ["beauty"], reason: "Common fatty alcohol used for texture and conditioning." },
];

const foodSugarTerms = ["sugar", "cane sugar", "glucose syrup", "corn syrup", "high fructose corn syrup", "dextrose", "maltodextrin", "fructose", "sucrose", "honey", "agave", "molasses", "invert sugar", "rice syrup", "barley malt", "maple syrup"];
const foodFatTerms = ["palm oil", "vegetable oil", "canola oil", "sunflower oil", "soybean oil", "hydrogenated oil", "partially hydrogenated", "shortening", "butter", "cream", "cocoa butter", "palm kernel oil", "cottonseed oil"];
const foodAdditiveTerms = ["brominated vegetable oil", "bvo", "red 3", "erythrosine", "red 40", "allura red", "yellow 5", "yellow 6", "sunset yellow", "blue 1", "blue 2", "brilliant blue", "indigo carmine", "tartrazine", "artificial color", "titanium dioxide", "e171", "potassium bromate", "bromate", "azodicarbonamide", "bha", "bht", "tbhq", "propyl gallate", "propylparaben", "sodium nitrite", "sodium nitrate", "potassium nitrite", "potassium nitrate", "lecithin", "emulsifier", "mono-", "diglyceride", "carrageenan", "carboxymethylcellulose", "cellulose gum", "polysorbate 80", "polysorbate 60", "polysorbate 20", "datem", "xanthan gum", "guar gum", "natural flavor", "artificial flavor", "vanillin", "preservative", "sodium benzoate", "potassium benzoate", "calcium benzoate", "benzoic acid", "potassium sorbate", "sorbic acid", "sulfite", "metabisulfite", "aspartame", "sucralose", "acesulfame", "saccharin", "neotame", "advantame", "sodium aluminum phosphate", "sodium aluminium phosphate"];
const foodOnlyIngredientTypes = new Set(["food_additive", "flour_treatment", "sweetener", "added_fat", "thickener", "emulsifier"]);
const beautyOnlyIngredientTypes = new Set(["restricted_cosmetic", "plasticizer", "antimicrobial", "antidandruff", "solvent", "nail_product", "film_former", "hair_dye", "fragrance_allergen", "uv_filter", "surfactant", "silicone", "pfas", "microplastic", "powder", "cosmetic_base", "preservative_cosmetic"]);

const ingredientAliases = [
  { terms: ["ci 42090", "fd&c blue no. 1", "fd&c blue no 1", "brilliant blue fcf", "e133"], canonical: "Blue 1" },
  { terms: ["ci 19140", "fd&c yellow no. 5", "fd&c yellow no 5", "tartrazine", "e102"], canonical: "Yellow 5" },
  { terms: ["ci 15985", "fd&c yellow no. 6", "fd&c yellow no 6", "sunset yellow fcf", "e110"], canonical: "Yellow 6" },
  { terms: ["ci 16035", "fd&c red no. 40", "fd&c red no 40", "allura red ac", "e129"], canonical: "Red 40" },
  { terms: ["aqua"], canonical: "Water" },
  { terms: ["parfum"], canonical: "Fragrance" },
  { terms: ["alcohol denat", "sd alcohol", "sd alcohol 40-b"], canonical: "Denatured Alcohol" },
  { terms: ["tocopherol"], canonical: "Vitamin E" },
  { terms: ["ascorbic acid"], canonical: "Vitamin C" },
  { terms: ["sodium chloride"], canonical: "Salt" },
];

function loadAvoidList() {
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceStorageKey("avoidList")) || "[]");
    return Array.isArray(saved) ? saved.map((item) => String(item).trim()).filter(Boolean).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function loadDietaryFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceStorageKey("dietaryFilters")) || "[]");
    return Array.isArray(saved) ? saved.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function preferenceStorageKey(name) {
  let owner = "guest";
  try {
    owner = state.user?.id || state.user?.email || "guest";
  } catch {
    owner = "guest";
  }
  return `greenscan.${name}.${owner}`;
}

function savePreferencesToDevice() {
  localStorage.setItem(preferenceStorageKey("avoidList"), JSON.stringify(state.avoidList));
  localStorage.setItem(preferenceStorageKey("dietaryFilters"), JSON.stringify(state.dietaryFilters));
}

function loadPreferencesForCurrentAccount() {
  state.avoidList = loadAvoidList();
  state.dietaryFilters = loadDietaryFilters();
  renderAvoidListSettings();
}

async function saveAvoidListFromSettings() {
  state.avoidList = splitAvoidList(els.avoidIngredients.value);
  state.dietaryFilters = els.dietFilters.filter((input) => input.checked).map((input) => input.value);
  savePreferencesToDevice();
  await saveUserPreferencesToAccount();
  if (state.currentAnalysis) {
    state.currentAnalysis = normalizeRenderableAnalysis(state.currentAnalysis);
    renderResult(state.currentAnalysis, { allowImageUpload: Boolean(state.currentAnalysis.barcode && !state.currentAnalysis.imageUrl), skipHistoryRender: true });
  }
  els.restrictionsDialog.close();
  toast(hasAuthenticatedSession() ? "Preferences saved to your account." : "Preferences saved on this device.");
}

function renderAvoidListSettings() {
  els.avoidIngredients.value = state.avoidList.join(", ");
  els.dietFilters.forEach((input) => {
    input.checked = state.dietaryFilters.includes(input.value);
  });
}

function splitAvoidList(value) {
  return String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item, index, list) => item.length > 1 && list.findIndex((other) => other.toLowerCase() === item.toLowerCase()) === index)
    .slice(0, 40);
}

function mergeUserPreferences(local, remote) {
  const remoteAvoid = Array.isArray(remote?.avoidList) ? remote.avoidList : [];
  const remoteDiet = Array.isArray(remote?.dietaryFilters) ? remote.dietaryFilters : [];
  const hasRemote = remoteAvoid.length || remoteDiet.length || remote?.updatedAt;
  const avoidList = hasRemote ? splitAvoidList(remoteAvoid.join(", ")) : splitAvoidList((local.avoidList || []).join(", "));
  const dietaryFiltersSource = hasRemote ? remoteDiet : (local.dietaryFilters || []);
  const dietaryFilters = [...new Set(dietaryFiltersSource.map((item) => String(item || "").trim()).filter(Boolean))].slice(0, 12);
  return { avoidList, dietaryFilters };
}

async function syncUserPreferences() {
  if (!hasAuthenticatedSession() || state.preferencesSyncing) return;
  state.preferencesSyncing = true;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/user-preferences`, { headers: await apiHeadersAsync() });
    if (!response.ok) return;
    const data = await response.json();
    const localPreferences = {
      avoidList: loadAvoidList(),
      dietaryFilters: loadDietaryFilters(),
    };
    const merged = mergeUserPreferences(
      localPreferences,
      data.preferences || {},
    );
    state.avoidList = merged.avoidList;
    state.dietaryFilters = merged.dietaryFilters;
    savePreferencesToDevice();
    renderAvoidListSettings();
    await saveUserPreferencesToAccount();
  } catch {
    // Device preferences continue to work when account sync is unavailable.
  } finally {
    state.preferencesSyncing = false;
  }
}

async function saveUserPreferencesToAccount() {
  if (!hasAuthenticatedSession()) return;
  try {
    await fetch(`${getApiBaseUrl()}/api/user-preferences`, {
      method: "PUT",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        avoidList: state.avoidList,
        dietaryFilters: state.dietaryFilters,
      }),
    });
  } catch {
    // Preferences remain saved on this device if account sync fails.
  }
}

function getPersonalAvoidMatch(rawName, type = "", reason = "") {
  const terms = state.avoidList || [];
  const text = normalizeAvoidText(`${rawName} ${type} ${reason}`);
  const found = terms.find((term) => avoidTermMatches(term, text));
  if (found) return found;
  return getDietaryFilterMatch(text);
}

function normalizeAvoidText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function avoidTermMatches(term, normalizedText) {
  const normalizedTerm = normalizeAvoidText(term);
  if (!normalizedTerm || !normalizedText) return false;
  const candidates = expandAvoidTerm(normalizedTerm);
  return candidates.some((candidate) => {
    if (!candidate) return false;
    const pattern = new RegExp(`(^|\\s)${escapeRegExp(candidate)}(\\s|$)`);
    return pattern.test(normalizedText);
  });
}

function expandAvoidTerm(term) {
  const aliases = {
    sulfate: ["sulfate", "sulfates", "sulphate", "sulphates", "sodium lauryl sulfate", "sodium laureth sulfate", "ammonium lauryl sulfate", "ammonium laureth sulfate", "sls", "sles"],
    sulfates: ["sulfate", "sulfates", "sulphate", "sulphates", "sodium lauryl sulfate", "sodium laureth sulfate", "ammonium lauryl sulfate", "ammonium laureth sulfate", "sls", "sles"],
    sulphate: ["sulfate", "sulfates", "sulphate", "sulphates", "sodium lauryl sulfate", "sodium laureth sulfate", "ammonium lauryl sulfate", "ammonium laureth sulfate", "sls", "sles"],
    sulphates: ["sulfate", "sulfates", "sulphate", "sulphates", "sodium lauryl sulfate", "sodium laureth sulfate", "ammonium lauryl sulfate", "ammonium laureth sulfate", "sls", "sles"],
    paraben: ["paraben", "parabens", "methylparaben", "propylparaben", "butylparaben", "ethylparaben"],
    parabens: ["paraben", "parabens", "methylparaben", "propylparaben", "butylparaben", "ethylparaben"],
    fragrance: ["fragrance", "parfum", "perfume"],
    fragrances: ["fragrance", "parfum", "perfume"],
  };
  const base = new Set([term]);
  if (term.endsWith("s") && term.length > 3) base.add(term.slice(0, -1));
  else base.add(`${term}s`);
  (aliases[term] || []).forEach((item) => base.add(normalizeAvoidText(item)));
  return [...base];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getDietaryFilterMatch(text) {
  const filters = state.dietaryFilters || [];
  const dictionary = {
    nuts: ["peanut", "almond", "cashew", "walnut", "pecan", "hazelnut", "pistachio", "tree nut"],
    dairy: ["milk", "whey", "casein", "lactose", "cream", "butter", "cheese"],
    gluten: ["wheat", "barley", "rye", "malt", "gluten", "spelt"],
    pork: ["gelatin", "pork", "lard", "porcine"],
    alcohol: ["alcohol", "ethanol", "wine", "beer", "rum"],
    vegan: ["milk", "whey", "casein", "egg", "honey", "gelatin", "beeswax", "carmine", "shellac", "lanolin"],
  };
  const labels = {
    nuts: "nuts",
    dairy: "dairy",
    gluten: "gluten",
    pork: "pork / gelatin",
    alcohol: "alcohol",
    vegan: "vegan watch",
  };
  const match = filters.find((filter) => (dictionary[filter] || []).some((term) => text.includes(term)));
  return match ? labels[match] : "";
}

els.startCameraButton.addEventListener("click", startCamera);
els.stopCameraButton.addEventListener("click", stopCamera);
els.soundToggleButton.addEventListener("click", toggleScanSound);
els.torchToggleButton.addEventListener("click", toggleTorch);
els.installTabs.forEach((button) => button.addEventListener("click", () => setInstallPlatform(button.dataset.installPlatform)));
els.signinPromptButton.addEventListener("click", loginWithGoogle);
els.shareSiteButton?.addEventListener("click", shareGreenScan);
els.dismissOnboardingButton.addEventListener("click", dismissOnboarding);
els.barcodeForm.addEventListener("submit", handleBarcodeSubmit);
els.frontPhoto.addEventListener("change", handleFrontPhotoChange);
els.ingredientPhoto.addEventListener("change", handlePhotoChange);
els.productTypeButtons.forEach((button) => button.addEventListener("click", () => chooseProductType(button.dataset.productType)));
els.nutritionFactsButtons.forEach((button) => button.addEventListener("click", () => chooseNutritionFactsAnswer(button.dataset.nutritionFacts)));
els.manualIngredients.addEventListener("input", updateAnalyzeButton);
els.analyzePhotoButton.addEventListener("click", analyzeCurrentPhoto);
els.clearHistoryButton.addEventListener("click", clearHistory);
els.topMenuButton.addEventListener("click", toggleTopMenu);
els.notificationButton.addEventListener("click", () => {
  closeTopMenu();
  openNotifications();
});
els.clearNotificationsButton.addEventListener("click", clearNotifications);
els.ingredientSpeakButton?.addEventListener("click", speakActiveIngredient);
els.ingredientDialog?.addEventListener("close", () => {
  els.ingredientDialog.classList.remove("dialog-fallback-open");
});
els.settingsButton.addEventListener("click", () => {
  closeTopMenu();
  openSettings();
});
els.adminMenuButton?.addEventListener("click", () => {
  closeTopMenu();
  openAdminPanel();
});
els.navHistoryButton.addEventListener("click", () => {
  stopCamera();
  switchView("home");
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});
els.navForYouButton.addEventListener("click", () => {
  stopCamera();
  switchView("forYou");
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});
els.navScanButton.addEventListener("click", () => showScannerView());
els.navSearchButton.addEventListener("click", openSearchView);
els.navSourcesButton.addEventListener("click", openSourcesFromNav);
document.querySelector("#historySearchButton")?.addEventListener("click", openSearchView);
document.querySelector("#historyScanButton")?.addEventListener("click", showScannerView);
document.querySelector("#landingScanButton")?.addEventListener("click", showScannerView);
document.querySelector("#landingFinalScanButton")?.addEventListener("click", showScannerView);
document.querySelector("#landingSearchButton")?.addEventListener("click", openSearchView);
els.desktopNavToggle?.addEventListener("click", toggleDesktopNavigation);
els.productSearchForm.addEventListener("submit", searchProducts);
els.productSearchInput.addEventListener("input", renderSearchSuggestions);
els.productSearchInput.addEventListener("focus", renderSearchSuggestions);
els.clearRecentSearchesButton.addEventListener("click", clearRecentSearches);
els.searchModeButtons.forEach((button) => button.addEventListener("click", () => setSearchMode(button.dataset.searchMode)));
els.themeToggleButton?.addEventListener("click", () => {
  closeTopMenu();
  toggleTheme();
});
els.googleLoginButton.addEventListener("click", loginWithGoogle);
els.aiProviderButton.addEventListener("click", openAiProvider);
els.restrictionsButton.addEventListener("click", openRestrictions);
els.saveAvoidListButton.addEventListener("click", saveAvoidListFromSettings);
els.saveAiProviderButton.addEventListener("click", saveAiProvider);
els.clearAiProviderButton.addEventListener("click", clearAiProvider);
els.logoutButton.addEventListener("click", logout);
els.sourcesButton.addEventListener("click", openSources);
els.changelogButton.addEventListener("click", openChangelog);
els.adminPanelButton.addEventListener("click", openAdminPanel);
els.grantAdminButton.addEventListener("click", grantAdminAccess);
els.grantUnlimitedButton.addEventListener("click", grantUnlimitedAccess);
els.banUserButton?.addEventListener("click", () => updateUserBan(true));
els.unbanUserButton?.addEventListener("click", () => updateUserBan(false));
els.saveLimitsButton.addEventListener("click", saveAdminLimits);
els.adminProductSearchButton.addEventListener("click", adminProductSearch);
els.adminProductSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    adminProductSearch();
  }
});
els.adminRepairQueueButton.addEventListener("click", loadAdminRepairQueue);
els.mergeProductsButton.addEventListener("click", mergeAdminProducts);
els.reportTypeButtons.forEach((button) => button.addEventListener("click", () => chooseReportType(button.dataset.reportType)));
els.reportFrontPhoto.addEventListener("change", updateReportPhotoChecks);
els.reportBackPhoto.addEventListener("change", handleReportIngredientPhoto);
els.submitReportButton.addEventListener("click", submitIncorrectReport);
els.editBroadCategory.addEventListener("change", () => populateItemCategoryOptions(els.editBroadCategory.value, els.editItemCategory.value));
els.editItemCategory.addEventListener("change", () => {
  if (els.editItemCategory.value) els.editCustomCategory.value = "";
});
els.editBackToAdminButton?.addEventListener("click", backToAdminFromProductEditor);
els.editProductImage?.addEventListener("change", handleEditProductImage);
setupDropZone(els.editProductImage?.closest(".photo-drop"), els.editProductImage, handleEditProductImage);
els.saveCategoryButton.addEventListener("click", saveCategoryCorrection);
els.settingsDialog.addEventListener("close", () => {
  if (state.activeView === "settings") switchView("scan");
});
els.sourcesDialog.addEventListener("close", () => {
  if (state.activeView === "sources") switchView("scan");
  els.navSourcesButton.classList.remove("active");
});
document.addEventListener("click", (event) => {
  if (els.topMenu.classList.contains("hidden")) return;
  if (els.topMenu.contains(event.target) || els.topMenuButton.contains(event.target)) return;
  closeTopMenu();
});
document.addEventListener("click", (event) => {
  if (!els.searchSuggestions || els.searchSuggestions.classList.contains("hidden")) return;
  if (els.searchSuggestions.contains(event.target) || els.productSearchForm.contains(event.target)) return;
  hideSearchSuggestions();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeTopMenu();
});

initDesktopNavigation();
initBottomNavViewportLock();
initTheme();
initCameraHint();
initAuth();
renderHistory();
renderRecentSearches();
renderFavoritesPanel();
renderScanStreakPanel();
updateNotificationDot();
initHomeScreenPanel();
initOnboarding();
loadPublicHomePanels();
cleanupLocalCache();
syncPendingAnalyses();
window.addEventListener("online", () => syncPendingAnalyses());
registerServiceWorker();
switchView(state.user ? "forYou" : "home");
loadSharedProductFromUrl();
updateSoundToggle();
updateTorchToggle();
renderAvoidListSettings();
initResultSheetGestures();

async function initCameraHint() {
  if (!els.cameraHint) return;
  const permission = await getCameraPermissionState();
  if (permission === "granted") rememberCameraAllowed();
  if (permission === "denied") forgetRememberedCameraAccess();
  els.cameraHint.textContent = permission === "prompt" && !hasRememberedCameraAccess()
    ? "Tap Scan and allow camera access once."
    : "Tap Scan to start the camera.";
}

function initDesktopNavigation() {
  let collapsed = false;
  try {
    collapsed = localStorage.getItem("greenscan.desktopNavCollapsed.v2") === "true";
  } catch {
    collapsed = false;
  }
  applyDesktopNavigationState(collapsed);
}

function applyDesktopNavigationState(collapsed) {
  document.body.classList.toggle("desktop-nav-collapsed", collapsed);
  if (!els.desktopNavToggle) return;
  const expanded = !collapsed;
  els.desktopNavToggle.setAttribute("aria-expanded", String(expanded));
  els.desktopNavToggle.setAttribute("aria-label", expanded ? "Hide navigation menu" : "Show navigation menu");
  els.desktopNavToggle.setAttribute("title", expanded ? "Hide menu" : "Show menu");
}

function toggleDesktopNavigation() {
  const collapsed = !document.body.classList.contains("desktop-nav-collapsed");
  applyDesktopNavigationState(collapsed);
  try {
    localStorage.setItem("greenscan.desktopNavCollapsed.v2", String(collapsed));
  } catch {
    // The menu still works when browser storage is unavailable.
  }
}

function initBottomNavViewportLock() {
  const sync = () => {
    const active = document.activeElement;
    const isTyping = active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);
    const isMobileLayout = window.matchMedia("(max-width: 720px)").matches;
    document.body.classList.toggle("keyboard-open", Boolean(isTyping && isMobileLayout));
    document.documentElement.style.setProperty("--bottom-nav-height", "70px");
    document.body.classList.remove("visual-nav-lock");
  };
  sync();
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("orientationchange", sync, { passive: true });
  window.visualViewport?.addEventListener("resize", sync, { passive: true });
  document.addEventListener("focusin", sync, { passive: true });
  document.addEventListener("focusout", () => window.setTimeout(sync, 80), { passive: true });
}

function isResultSheetLayout() {
  return window.matchMedia("(max-width: 1099px)").matches;
}

function renderScannerProductPreview(analysis) {
  if (!els.scanProductPreview || !analysis) return;
  els.scanPreviewName.textContent = analysis.name || "Scanned product";
  els.scanPreviewMeta.textContent = [analysis.brand, analysis.itemCategory].filter(Boolean).join(" · ") || "Open product details";
  const previewScore = Number.isFinite(Number(analysis.safetyScore))
    ? Math.max(0, Math.min(100, Number(analysis.safetyScore)))
    : 0;
  els.scanPreviewScore.textContent = Number.isFinite(Number(analysis.safetyScore)) ? String(previewScore) : "--";
  els.scanPreviewScore.className = `scan-preview-score ${analysis.scoreColor || scoreColor(Number(analysis.safetyScore) || 0)}`;
  els.scanPreviewScore.style.setProperty("--score-value", String(previewScore));
  els.scanPreviewMedia.innerHTML = analysis.imageUrl
    ? `<img src="${escapeHtml(analysis.imageUrl)}" alt="" loading="lazy" decoding="async" />`
    : `<span aria-hidden="true"></span>`;
  els.scanProductPreview.classList.remove("hidden");
  els.scanProductPreview.onclick = () => {
    if (isResultSheetLayout()) {
      els.resultPanel.classList.remove("result-sheet-dismissed");
      els.resultPanel.removeAttribute("aria-hidden");
      els.resultPanel.classList.add("has-result");
      setResultSheetExpanded(true);
      return;
    }
    els.resultPanel.scrollTo({ top: 0, behavior: "smooth" });
    els.resultPanel.focus({ preventScroll: true });
  };
}

function clearScannerProductPreview() {
  els.scanProductPreview?.classList.add("hidden");
}

function setResultSheetExpanded(expanded) {
  state.resultSheetExpanded = Boolean(expanded && els.resultPanel.classList.contains("has-result"));
  els.resultPanel.classList.toggle("sheet-expanded", state.resultSheetExpanded);
  document.body.classList.toggle("result-sheet-expanded", state.resultSheetExpanded);
  const handle = els.resultPanel.querySelector("#resultSheetHandle");
  if (handle) {
    handle.setAttribute("aria-expanded", String(state.resultSheetExpanded));
    const label = handle.querySelector("small");
    if (label) label.textContent = els.resultPanel.classList.contains("loading-result")
      ? "Checking product databases"
      : state.resultSheetExpanded ? "Swipe down to return to scanner" : "Swipe up for full details";
  }
  if (!state.resultSheetExpanded) els.resultPanel.scrollTop = 0;
}

function prepareResultSheet() {
  els.resultPanel.classList.remove("result-sheet-dismissed");
  els.resultPanel.removeAttribute("aria-hidden");
  els.resultPanel.classList.add("has-result");
  setResultSheetExpanded(false);
}

function clearResultSheet() {
  state.resultSheetExpanded = false;
  els.resultPanel.classList.remove("has-result", "sheet-expanded", "loading-result", "result-sheet-dismissed");
  els.resultPanel.removeAttribute("aria-hidden");
  document.body.classList.remove("result-sheet-expanded");
  els.resultPanel.scrollTop = 0;
  clearScannerProductPreview();
}

function dismissResultSheet() {
  if (!isResultSheetLayout() || !els.resultPanel.classList.contains("has-result")) return;
  state.resultSheetExpanded = false;
  els.resultPanel.classList.remove("has-result", "sheet-expanded", "loading-result");
  els.resultPanel.classList.add("result-sheet-dismissed");
  els.resultPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("result-sheet-expanded");
  els.resultPanel.scrollTop = 0;
}

function initResultSheetGestures() {
  els.resultPanel.addEventListener("click", (event) => {
    const ingredientRow = event.target.closest("[data-ingredient-id]");
    if (ingredientRow && els.resultPanel.contains(ingredientRow)) {
      const ingredient = state.renderedIngredients.get(ingredientRow.dataset.ingredientId);
      if (ingredient) showIngredientDetail(ingredient);
      return;
    }
    if (event.target.closest("#resultSheetHandle")) {
      setResultSheetExpanded(!state.resultSheetExpanded);
    }
  });
  els.resultPanel.addEventListener("touchstart", (event) => {
    if (!isResultSheetLayout() || !els.resultPanel.classList.contains("has-result")) return;
    state.resultSheetTouchStartY = event.touches[0]?.clientY || 0;
  }, { passive: true });
  els.resultPanel.addEventListener("touchend", (event) => {
    if (!isResultSheetLayout() || !els.resultPanel.classList.contains("has-result")) return;
    const endY = event.changedTouches[0]?.clientY || state.resultSheetTouchStartY;
    const movement = endY - state.resultSheetTouchStartY;
    if (movement < -38) setResultSheetExpanded(true);
    if (movement > 48 && els.resultPanel.scrollTop <= 2) dismissResultSheet();
  }, { passive: true });
  els.resultPanel.addEventListener("wheel", (event) => {
    if (!isResultSheetLayout() || state.resultSheetExpanded || !els.resultPanel.classList.contains("has-result")) return;
    if (event.deltaY > 5) setResultSheetExpanded(true);
  }, { passive: true });
}

function scrollToResultSection(selector) {
  const target = els.resultPanel.querySelector(selector);
  if (!target) return;
  if (isResultSheetLayout()) {
    setResultSheetExpanded(true);
    window.setTimeout(() => {
      els.resultPanel.scrollTo({ top: Math.max(0, target.offsetTop - 72), behavior: "smooth" });
    }, 180);
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // Offline cache is optional.
    });
  });
}

function toggleTopMenu() {
  const isOpen = !els.topMenu.classList.contains("hidden");
  els.topMenu.classList.toggle("hidden", isOpen);
  els.topMenuButton.setAttribute("aria-expanded", String(!isOpen));
}

function closeTopMenu() {
  els.topMenu.classList.add("hidden");
  els.topMenuButton.setAttribute("aria-expanded", "false");
}

async function startCamera() {
  scrollToScannerPanel("smooth");
  resetScanForNextProduct();
  clearScannerStill();
  primeScanSound();
  els.permissionCallout.classList.add("hidden");
  els.permissionCallout.classList.remove("success");
  els.scannerViewport.classList.remove("scan-detected");
  resetScanFrameGuide();

  if (!window.isSecureContext) {
    showCameraHelp("Camera access is blocked on file:// pages. Open the app from http://127.0.0.1 or localhost, then choose Allow when the browser asks.");
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    showCameraHelp("This browser does not support camera access here. Try Chrome, Edge, or Safari on a secure local URL.");
    return;
  }

  try {
    const permission = await getCameraPermissionState();
    if (permission === "denied") {
      showCameraHelp("Camera permission is blocked. Open this page's site settings, allow Camera, then tap Scan again.");
      return;
    }
    if (permission === "prompt") {
      els.cameraHint.textContent = "Starting camera...";
    } else if (permission === "granted") {
      rememberCameraAllowed();
      els.cameraHint.textContent = "Starting camera...";
    }

    if ("BarcodeDetector" in window) {
      state.barcodeDetector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
    } else {
      state.barcodeDetector = null;
    }

    state.stream = await openCameraStream();
    rememberCameraAllowed();
    els.cameraFeed.srcObject = state.stream;
    await els.cameraFeed.play();
    state.cameraActive = true;
    state.scanStartedAt = Date.now();
    state.scanHelpShown = false;
    updateScanAssist("Finding barcode", "Hold the barcode steady inside the frame.", 18);
    updateTorchAvailability();
    els.cameraFeed.style.display = "block";
    els.scannerEmpty.classList.add("hidden");
    els.startCameraButton.disabled = true;
    els.stopCameraButton.disabled = false;

    if (state.barcodeDetector) {
      els.permissionCallout.classList.add("hidden");
      state.scanTimer = window.setInterval(scanFrameForBarcode, 140);
    } else if (window.ZXingBrowser?.BrowserMultiFormatOneDReader) {
      state.zxingReader = new window.ZXingBrowser.BrowserMultiFormatOneDReader(undefined, {
        delayBetweenScanAttempts: 160,
        delayBetweenScanSuccess: 350,
      });
      showCameraInfo("Camera is running. Hold the barcode steady inside the frame.");
      state.scanTimer = window.setInterval(scanFrameWithZxing, 180);
    } else if (window.Quagga) {
      showCameraInfo("Camera is running. Hold the barcode steady inside the frame.");
      state.scanTimer = window.setInterval(scanFrameWithQuagga, 280);
    } else {
      showCameraInfo("Camera is on, but the barcode reader could not load. Type the barcode below or use the ingredient photo fallback.");
    }
  } catch (error) {
    state.cameraActive = false;
    const message = getCameraErrorMessage(error);
    showCameraHelp(message);
  }
}

async function openCameraStream() {
  const preferredConstraints = {
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
      advanced: [{ focusMode: "continuous" }],
    },
    audio: false,
  };
  const fallbackConstraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  try {
    return await navigator.mediaDevices.getUserMedia(preferredConstraints);
  } catch (error) {
    const hardFailure = ["NotAllowedError", "SecurityError", "NotFoundError", "NotReadableError"].includes(error?.name);
    if (!hardFailure) {
      return navigator.mediaDevices.getUserMedia(fallbackConstraints);
    }
    throw error;
  }
}

function resetScanForNextProduct() {
  clearResultSheet();
  state.currentBarcode = "";
  state.currentFrontPhoto = null;
  state.currentPhoto = null;
  state.selectedProductType = "";
  state.labelHasNutritionFacts = "";
  els.barcodeInput.value = "";
  els.manualIngredients.value = "";
  resetUploadState();
  els.fallbackPanel.classList.add("hidden");
  resetProductTypeChoice();
  els.resultPanel.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">Ready</p>
      <h2>Scan a barcode to begin.</h2>
      <p>Known products load from open databases first. Unknown products can be analyzed from an ingredient photo.</p>
    </div>
  `;
}

function stopCamera() {
  if (state.scanTimer) window.clearInterval(state.scanTimer);
  turnTorchOff();
  if (state.stream) state.stream.getTracks().forEach((track) => track.stop());
  state.stream = null;
  state.torchSupported = false;
  state.torchOn = false;
  state.zxingReader = null;
  state.scanTimer = null;
  state.scanBusy = false;
  resetScanCandidate();
  state.cameraActive = false;
  els.cameraFeed.style.display = "none";
  els.scannerEmpty.classList.toggle("hidden", els.scannerViewport.classList.contains("has-scan-still"));
  els.cameraHint.textContent = hasRememberedCameraAccess()
    ? "Tap Scan to start the camera."
    : "Tap Scan and allow camera access.";
  updateScanAssist("", "", 0, true);
  els.permissionCallout.classList.add("hidden");
  els.permissionCallout.classList.remove("success");
  els.scannerViewport.classList.remove("scan-detected");
  resetScanFrameGuide();
  updateTorchToggle();
  els.startCameraButton.disabled = false;
  els.stopCameraButton.disabled = true;
}

async function getCameraPermissionState() {
  try {
    if (!navigator.permissions?.query) return "unknown";
    const result = await navigator.permissions.query({ name: "camera" });
    return result.state;
  } catch {
    return "unknown";
  }
}

function getCameraErrorMessage(error) {
  if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
    forgetRememberedCameraAccess();
    return "Camera permission was blocked. Use the browser camera icon or site settings to allow Camera, then tap Scan again.";
  }
  if (error?.name === "NotFoundError") {
    return "No camera was found on this device.";
  }
  if (error?.name === "NotReadableError") {
    return "The camera is already in use by another app or tab. Close it there, then tap Scan again.";
  }
  return "Camera could not start. Check browser camera permission, then tap Scan again.";
}

function showCameraHelp(message) {
  if (state.cameraActive) {
    showCameraInfo(message);
    return;
  }
  els.permissionTitle.textContent = "Camera access is needed";
  els.permissionMessage.textContent = message;
  els.permissionCallout.classList.remove("hidden");
  els.cameraHint.textContent = "Camera permission needed.";
  toast("Allow camera access to scan.");
}

function showCameraInfo(message) {
  els.permissionCallout.classList.add("hidden");
  els.permissionCallout.classList.remove("success");
  if (!/hold the barcode steady/i.test(message)) {
    updateScanAssist("Scanner fallback", message, 24);
  }
}

function rememberCameraAllowed() {
  try {
    localStorage.setItem("greenscan.cameraAllowed", "true");
  } catch {
    // Browser permission is still the source of truth; this only improves UI copy.
  }
}

function hasRememberedCameraAccess() {
  try {
    return localStorage.getItem("greenscan.cameraAllowed") === "true";
  } catch {
    return false;
  }
}

function forgetRememberedCameraAccess() {
  try {
    localStorage.removeItem("greenscan.cameraAllowed");
  } catch {}
}

async function scanFrameForBarcode() {
  if (state.scanBusy || !state.stream || !state.barcodeDetector || els.cameraFeed.readyState < 2) return;
  maybeShowFocusHelp();
  state.scanBusy = true;
  try {
    const codes = await state.barcodeDetector.detect(getScanCanvasFrame());
    if (codes.length > 0) {
      await handleDetectedBarcode(codes[0].rawValue);
    }
  } catch (error) {
    state.scanBusy = false;
    state.barcodeDetector = null;
    if (window.ZXingBrowser?.BrowserMultiFormatOneDReader) {
      if (state.scanTimer) window.clearInterval(state.scanTimer);
      state.zxingReader = new window.ZXingBrowser.BrowserMultiFormatOneDReader(undefined, {
        delayBetweenScanAttempts: 160,
        delayBetweenScanSuccess: 350,
      });
      showCameraInfo("Camera is running. Hold the barcode steady inside the frame.");
      state.scanTimer = window.setInterval(scanFrameWithZxing, 180);
      return;
    }
    if (window.Quagga) {
      if (state.scanTimer) window.clearInterval(state.scanTimer);
      showCameraInfo("Camera is running. Hold the barcode steady inside the frame.");
      state.scanTimer = window.setInterval(scanFrameWithQuagga, 280);
      return;
    }
    showCameraInfo("Camera is running, but auto-read failed. Type the barcode below if scanning does not catch it.");
    return;
  }
  state.scanBusy = false;
}

async function scanFrameWithZxing() {
  if (state.scanBusy || !state.stream || !state.zxingReader || els.cameraFeed.readyState < 2) return;
  maybeShowFocusHelp();
  state.scanBusy = true;
  try {
    const result = state.zxingReader.decodeFromCanvas(getScanCanvasFrame());
    const code = result?.getText ? result.getText() : result?.text;
    if (code && String(code).length >= 8) {
      await handleDetectedBarcode(code);
    }
  } catch (error) {
    if (!isExpectedScannerMiss(error) && window.Quagga) {
      if (state.scanTimer) window.clearInterval(state.scanTimer);
      showCameraInfo("Camera is running. Hold the barcode steady inside the frame.");
      state.scanTimer = window.setInterval(scanFrameWithQuagga, 280);
    }
  } finally {
    state.scanBusy = false;
  }
}

function isExpectedScannerMiss(error) {
  const name = String(error?.name || error?.constructor?.name || "");
  const message = String(error?.message || "");
  return /notfound|checksum|format/i.test(`${name} ${message}`);
}

function scanFrameWithQuagga() {
  if (state.scanBusy || !state.stream || els.cameraFeed.readyState < 2) return;
  maybeShowFocusHelp();
  state.scanBusy = true;

  window.Quagga.decodeSingle(
    {
      src: getScanCanvasFrame().toDataURL("image/jpeg", 0.82),
      numOfWorkers: 0,
      locate: true,
      inputStream: {
        size: 720,
        singleChannel: false,
      },
      decoder: {
        readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"],
      },
    },
    async (result) => {
      state.scanBusy = false;
      const code = result?.codeResult?.code;
      if (!code || code.length < 8) return;
      await handleDetectedBarcode(code);
    },
  );
}

function getScanCanvasFrame() {
  const sourceWidth = els.cameraFeed.videoWidth || 640;
  const sourceHeight = els.cameraFeed.videoHeight || 480;
  const maxScanSide = 900;
  const scale = Math.min(1, maxScanSide / Math.max(sourceWidth, sourceHeight));
  const scanWidth = Math.max(1, Math.round(sourceWidth * scale));
  const scanHeight = Math.max(1, Math.round(sourceHeight * scale));
  state.scanCanvas.width = scanWidth;
  state.scanCanvas.height = scanHeight;
  const context = state.scanCanvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(els.cameraFeed, 0, 0, scanWidth, scanHeight);
  return state.scanCanvas;
}

function resetScanFrameGuide() {
  els.scannerViewport.classList.remove("scan-tracking");
}

function maybeShowFocusHelp() {
  if (state.scanMatched || state.scanHelpShown || !state.scanStartedAt) return;
  if (Date.now() - state.scanStartedAt < 2800 || state.scanCandidateCount > 0) return;
  state.scanHelpShown = true;
  updateScanAssist("Still looking", "Move a little farther back, add light, and keep the barcode flat.", 32);
}

function updateScanAssist(title, message, confidence = 0, hidden = false) {
  if (!els.scanAssist) return;
  els.scanAssist.classList.toggle("hidden", hidden);
  if (!hidden) {
    els.scanAssistTitle.textContent = title;
    els.scanAssistMessage.textContent = message;
  }
  els.scanConfidenceBar.style.width = `${clamp(confidence, 0, 100)}%`;
}

async function handleDetectedBarcode(rawCode) {
  if (state.scanMatched) return;
  const barcode = normalizeBarcode(rawCode);
  if (!barcode || !isSupportedBarcode(barcode)) return;

  if (els.resultPanel.classList.contains("has-result")) dismissResultSheet();
  els.permissionCallout.classList.add("hidden");
  els.permissionCallout.classList.remove("success");

  const now = Date.now();
  const isRepeatCandidate = state.scanCandidate === barcode && now - state.scanCandidateAt < 1800;
  state.scanCandidate = barcode;
  state.scanCandidateCount = isRepeatCandidate ? state.scanCandidateCount + 1 : 1;
  state.scanCandidateAt = now;

  if (state.scanCandidateCount < 2) {
    els.barcodeInput.value = barcode;
    els.cameraHint.textContent = `Check ${barcode} again`;
    updateScanAssist("Almost got it", `Saw ${barcode}. Hold steady for one more read.`, 68);
    return;
  }

  state.scanMatched = true;
  if (state.scanTimer) window.clearInterval(state.scanTimer);
  els.barcodeInput.value = barcode;
  els.cameraHint.textContent = `Found ${barcode}`;
  updateScanAssist("", "", 100, true);
  els.scannerViewport.classList.add("scan-detected");
  playConfirmSound();
  captureScannerStill();
  await delay(420);
  stopCamera();
  await lookupBarcode(barcode);
}

function captureScannerStill() {
  try {
    const frame = getScanCanvasFrame();
    els.scannerViewport.style.backgroundImage = `url("${frame.toDataURL("image/jpeg", 0.72)}")`;
    els.scannerViewport.classList.add("has-scan-still");
  } catch {
    // The live camera can still close normally when a still cannot be captured.
  }
}

function clearScannerStill() {
  els.scannerViewport.classList.remove("has-scan-still");
  els.scannerViewport.style.backgroundImage = "";
}

function resetScanCandidate() {
  state.scanCandidate = "";
  state.scanCandidateCount = 0;
  state.scanCandidateAt = 0;
  state.scanStartedAt = 0;
  state.scanHelpShown = false;
  state.scanMatched = false;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toggleScanSound() {
  state.scanSoundMuted = !state.scanSoundMuted;
  localStorage.setItem("greenscan.scanSoundMuted", String(state.scanSoundMuted));
  updateSoundToggle();
  if (!state.scanSoundMuted) {
    primeScanSound();
    playConfirmSound({ quiet: true });
  }
}

function updateSoundToggle() {
  els.soundToggleButton.classList.toggle("muted", state.scanSoundMuted);
  els.soundToggleButton.setAttribute("aria-label", state.scanSoundMuted ? "Unmute scan sound" : "Mute scan sound");
  els.soundToggleButton.title = state.scanSoundMuted ? "Unmute scan sound" : "Mute scan sound";
}

function getActiveVideoTrack() {
  return state.stream?.getVideoTracks?.()[0] || null;
}

function updateTorchAvailability() {
  const track = getActiveVideoTrack();
  const capabilities = track?.getCapabilities?.() || {};
  state.torchSupported = Boolean(capabilities.torch);
  if (!state.torchSupported) state.torchOn = false;
  updateTorchToggle();
}

async function toggleTorch() {
  const track = getActiveVideoTrack();
  if (!track || !state.torchSupported) {
    toast("Flashlight is not available on this device.");
    return;
  }

  const nextState = !state.torchOn;
  try {
    await track.applyConstraints({ advanced: [{ torch: nextState }] });
    state.torchOn = nextState;
    updateTorchToggle();
  } catch {
    state.torchOn = false;
    updateTorchToggle();
    toast("Flashlight is not available on this device.");
  }
}

function turnTorchOff() {
  const track = getActiveVideoTrack();
  if (!track || !state.torchOn) return;
  try {
    track.applyConstraints({ advanced: [{ torch: false }] });
  } catch {
    // Torch support is optional and device-specific.
  }
}

function updateTorchToggle() {
  els.torchToggleButton.classList.toggle("hidden", !state.torchSupported);
  els.torchToggleButton.classList.toggle("active", state.torchOn);
  els.torchToggleButton.setAttribute("aria-label", state.torchOn ? "Turn flashlight off" : "Turn flashlight on");
  els.torchToggleButton.title = state.torchOn ? "Turn flashlight off" : "Turn flashlight on";
}

function primeScanSound() {
  if (state.scanSoundMuted) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!state.audioContext) state.audioContext = new AudioContextClass();
    if (state.audioContext.state === "suspended") state.audioContext.resume();
  } catch {
    state.audioContext = null;
  }
}

function playConfirmSound(options = {}) {
  if (state.scanSoundMuted) return;
  try {
    primeScanSound();
    if (!state.audioContext) return;
    const context = state.audioContext;
    const now = context.currentTime;
    const volume = context.createGain();
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(options.quiet ? 0.035 : 0.07, now + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    volume.connect(context.destination);
    [660, 990].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.08);
      oscillator.connect(volume);
      oscillator.start(now + index * 0.08);
      oscillator.stop(now + 0.18 + index * 0.08);
    });
  } catch {
    // Sound is optional; scanning should never fail because audio is blocked.
  }
}

function normalizeBarcode(rawCode) {
  return String(rawCode || "").replace(/\D/g, "");
}

function isSupportedBarcode(code) {
  if (![8, 12, 13].includes(code.length)) return false;
  if (code.length === 8 && hasValidUpceCheckDigit(code)) return true;
  return hasValidBarcodeCheckDigit(code);
}

function hasValidBarcodeCheckDigit(code) {
  const digits = code.split("").map(Number);
  const check = digits.pop();
  const sum = digits.reduce((total, digit, index) => {
    const fromRight = digits.length - index;
    const weight = fromRight % 2 === 0 ? 1 : 3;
    return total + digit * weight;
  }, 0);
  return (10 - (sum % 10)) % 10 === check;
}

function hasValidUpceCheckDigit(code) {
  if (code.length !== 8 || !["0", "1"].includes(code[0])) return false;
  const numberSystem = code[0];
  const body = code.slice(1, 7);
  const check = code[7];
  const [a, b, c, d, e, f] = body;
  let expandedBody = "";

  if (["0", "1", "2"].includes(f)) {
    expandedBody = `${a}${b}${f}00` + `00${c}${d}${e}`;
  } else if (f === "3") {
    expandedBody = `${a}${b}${c}00` + `000${d}${e}`;
  } else if (f === "4") {
    expandedBody = `${a}${b}${c}${d}0` + `0000${e}`;
  } else {
    expandedBody = `${a}${b}${c}${d}${e}` + `0000${f}`;
  }

  return hasValidBarcodeCheckDigit(`${numberSystem}${expandedBody}${check}`);
}

async function handleBarcodeSubmit(event) {
  event.preventDefault();
  const barcode = normalizeBarcode(els.barcodeInput.value);
  if (!barcode) return;
  els.barcodeInput.value = barcode;
  await lookupBarcode(barcode);
}

async function lookupBarcode(barcode, options = {}) {
  state.currentBarcode = barcode;
  state.currentFrontPhoto = null;
  state.currentPhoto = null;
  state.selectedProductType = "";
  els.manualIngredients.value = "";
  resetUploadState();
  resetProductTypeChoice();

  setLoading(`Checking barcode ${barcode}`);
  els.fallbackPanel.classList.add("hidden");

  const cachedProduct = getSavedProduct(barcode);
  const sharedProduct = await getSharedSavedProduct(barcode);
  if (sharedProduct) {
    const displayProduct = mergeLocalProductOverrides(sharedProduct, cachedProduct);
    if (!displayProduct.imageUrl) displayProduct.imageUrl = await findOpenDatabaseImageUrl(barcode);
    renderResult(displayProduct, options.sharedView
      ? { allowImageUpload: false, skipHistoryRender: true, formulaChangeNotice: getFormulaChangeNotice(sharedProduct) }
      : { allowImageUpload: true, formulaChangeNotice: getFormulaChangeNotice(sharedProduct) });
    saveProductAnalysis(displayProduct);
    recordScannedLookup(displayProduct, "saved_database", options);
    if (options.sharedView) document.body.classList.add("public-product-page");
    if (needsIngredientFill(displayProduct)) {
      promptIngredientFill(displayProduct);
      toast("This saved product needs ingredients.");
    } else {
      toast("Loaded from database. No AI used.");
    }
    return;
  }

  if (cachedProduct) {
    renderResult(cachedProduct, options.sharedView ? { allowImageUpload: false, skipHistoryRender: true } : { allowImageUpload: true });
    recordScannedLookup(cachedProduct, "local_saved", options);
    if (options.sharedView) document.body.classList.add("public-product-page");
    if (needsIngredientFill(cachedProduct)) {
      promptIngredientFill(cachedProduct);
      toast("This saved product needs ingredients.");
    } else {
      toast("Loaded your saved ingredient analysis.");
    }
    return;
  }

  const openProduct = await resolveOpenProduct(barcode);
  if (openProduct) {
    const { analysis, client } = openProduct;
    renderResult(analysis, options.sharedView ? { allowImageUpload: false, skipHistoryRender: true } : { allowImageUpload: true });
    recordScannedLookup(analysis, client.name, options);
    if (options.sharedView) document.body.classList.add("public-product-page");
    if (needsIngredientFill(analysis)) {
      promptIngredientFill(analysis);
      toast("No ingredients found. Add a label photo to fill it in.");
    }
    return;
  }

  renderNotFound(barcode);
}

function recordScannedLookup(analysis, source, options = {}) {
  if (options.sharedView || !analysis?.barcode) return;
  updateScanStreak(analysis);
  saveProductAnalysis(analysis);
  saveHistory(analysis);
  trackScan(analysis, source || analysis.source || "barcode_lookup");
}

function mergeLocalProductOverrides(sharedProduct, localProduct) {
  if (!localProduct) return sharedProduct;
  // If the shared database was corrected after the last local edit, the shared
  // version is authoritative. correctedAt is only set when a user/admin actually
  // edits the product; savedAt on the local copy is refreshed on every view and
  // cannot be trusted for freshness.
  const newestTimestamp = (...values) => values
    .map((value) => String(value || ""))
    .filter(Boolean)
    .sort()
    .pop() || "";
  const sharedUpdatedAt = newestTimestamp(sharedProduct.savedAt, sharedProduct.correctedAt, sharedProduct.createdAt);
  const localEditedAt = String(localProduct.correctedAt || "");
  if (sharedUpdatedAt && (!localEditedAt || sharedUpdatedAt > localEditedAt)) {
    return normalizeRenderableAnalysis({
      ...sharedProduct,
      imageUrl: sharedProduct.imageUrl || localProduct.imageUrl,
    });
  }
  const localIngredients = Array.isArray(localProduct.ingredients) ? localProduct.ingredients : [];
  const sharedIngredients = Array.isArray(sharedProduct.ingredients) ? sharedProduct.ingredients : [];
  const localIngredientsText = String(localProduct.ingredientsText || localProduct.extracted_ingredients_text || "").trim();
  return normalizeRenderableAnalysis({
    ...sharedProduct,
    name: localProduct.name || sharedProduct.name,
    detected_product_name: localProduct.detected_product_name || localProduct.name || sharedProduct.detected_product_name,
    brand: localProduct.brand || sharedProduct.brand,
    detected_brand: localProduct.detected_brand || localProduct.brand || sharedProduct.detected_brand,
    category: localProduct.category || sharedProduct.category,
    product_category: localProduct.category || localProduct.product_category || sharedProduct.product_category,
    itemCategory: localProduct.itemCategory || sharedProduct.itemCategory,
    item_category: localProduct.itemCategory || localProduct.item_category || sharedProduct.item_category,
    ingredients: localIngredients.length ? localIngredients : sharedIngredients,
    ingredientsText: localIngredientsText || sharedProduct.ingredientsText,
    extracted_ingredients_text: localIngredientsText || sharedProduct.extracted_ingredients_text,
    safetyScore: localProduct.safetyScore ?? localProduct.safety_score ?? sharedProduct.safetyScore,
    safety_score: localProduct.safety_score ?? localProduct.safetyScore ?? sharedProduct.safety_score,
    scoreColor: localProduct.scoreColor || localProduct.score_color || sharedProduct.scoreColor,
    score_color: localProduct.score_color || localProduct.scoreColor || sharedProduct.score_color,
    summary: localProduct.summary || sharedProduct.summary,
    imageUrl: localProduct.imageUrl || sharedProduct.imageUrl,
    source: localProduct.source || sharedProduct.source,
    correctedAt: localProduct.correctedAt || sharedProduct.correctedAt,
    savedAt: localProduct.savedAt || sharedProduct.savedAt,
  });
}

async function resolveOpenProduct(barcode) {
  const matches = await Promise.all(databaseClients.map(async (client) => {
    const product = await fetchOpenProduct(client, barcode);
    if (!product) return null;
    return { client, product, analysis: analyzeKnownProduct(product, client, barcode) };
  }));
  const found = matches.filter(Boolean);
  if (!found.length) return null;
  const beauty = found.find((item) => item.analysis.category === "beauty");
  if (beauty) return beauty;
  return found[0];
}

async function fetchOpenProduct(client, barcode) {
  try {
    const response = await fetch(client.url(barcode));
    if (!response.ok) return null;
    const data = await response.json();
    if (data.status !== 1 || !data.product) return null;
    return data.product;
  } catch (error) {
    return null;
  }
}

async function searchProducts(event) {
  event.preventDefault();
  if (!state.user) {
    renderSearchLoginPrompt();
    return;
  }
  const query = els.productSearchInput.value.trim();
  if (state.searchMode === "ingredients") {
    hideSearchSuggestions();
    runIngredientDictionarySearch(query);
    return;
  }
  hideSearchSuggestions();
  await runProductSearch(query);
}

function setSearchMode(mode) {
  state.searchMode = mode === "ingredients" ? "ingredients" : "products";
  els.searchModeButtons.forEach((button) => {
    const active = button.dataset.searchMode === state.searchMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  const ingredients = state.searchMode === "ingredients";
  els.searchEyebrow.textContent = ingredients ? "Ingredient dictionary" : "Product search";
  els.searchTitle.textContent = ingredients ? "Search ingredients" : "Search products";
  els.productSearchInput.placeholder = ingredients ? "Fragrance, Red 40, BHT..." : "Coca Cola, Lays, Dove...";
  els.productSearchResults.innerHTML = ingredients
    ? `<p>Search food additives, cosmetic chemicals, preservatives, dyes, fragrance, or allergens.</p>`
    : `<p>Search food, drinks, and beauty products by name.</p>`;
  els.recentSearches.classList.toggle("hidden", ingredients);
  els.favoritesPanel.classList.toggle("hidden", ingredients);
  els.productSearchInput.focus();
  renderSearchSuggestions();
}

function renderSearchSuggestions() {
  if (!els.searchSuggestions || state.activeView !== "search") return;
  const query = els.productSearchInput.value.trim().toLowerCase();
  const suggestions = state.searchMode === "ingredients"
    ? getIngredientSuggestions(query)
    : getProductSuggestions(query);
  if (!suggestions.length) {
    hideSearchSuggestions();
    return;
  }
  els.searchSuggestions.innerHTML = suggestions.map((item) => `
    <button type="button" class="search-suggestion" data-suggestion="${escapeHtml(item.value)}">
      <span class="suggestion-icon">${escapeHtml(item.icon)}</span>
      <span>${highlightSuggestion(item.label, query)}</span>
      <small>${escapeHtml(item.type)}</small>
    </button>
  `).join("");
  els.searchSuggestions.classList.remove("hidden");
  els.searchSuggestions.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => chooseSearchSuggestion(button.dataset.suggestion));
  });
}

function chooseSearchSuggestion(value) {
  els.productSearchInput.value = value;
  hideSearchSuggestions();
  if (state.searchMode === "ingredients") runIngredientDictionarySearch(value);
  else runProductSearch(value);
}

function hideSearchSuggestions() {
  if (els.searchSuggestions) els.searchSuggestions.classList.add("hidden");
}

function getIngredientSuggestions(query) {
  const base = [
    ...riskDictionary.map((item) => toDisplayName(item.match)),
    "Methylchloroisothiazolinone",
    "Methylisothiazolinone",
    "Fragrance",
    "Red 40",
    "Sodium Lauryl Sulfate",
    "High Fructose Corn Syrup",
    "Titanium Dioxide",
    "BHT",
    "Parabens",
    "Oxybenzone",
  ];
  return uniqueSuggestions(base)
    .filter((value) => matchesSuggestion(value, query))
    .slice(0, 7)
    .map((value) => ({ label: value, value, type: "Ingredient", icon: "S" }));
}

function getProductSuggestions(query) {
  const localProducts = getKnownLocalProducts()
    .flatMap((item) => [item.name, item.brand, item.itemCategory])
    .filter(Boolean);
  const base = [
    ...getRecentSearches(),
    ...localProducts,
    "Coca Cola",
    "Lay's Classic",
    "Dove Shampoo",
    "Old Spice Deodorant",
    "Pantene Conditioner",
    "Jif Peanut Butter",
    "Nutella",
    "Ban Deodorant",
  ];
  return uniqueSuggestions(base)
    .filter((value) => matchesSuggestion(value, query))
    .slice(0, 7)
    .map((value) => ({ label: value, value, type: "Product", icon: "S" }));
}

function uniqueSuggestions(values) {
  const seen = new Set();
  return values
    .map((value) => String(value || "").trim())
    .filter((value) => {
      const key = value.toLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function matchesSuggestion(value, query) {
  if (!query) return true;
  return value.toLowerCase().includes(query);
}

function highlightSuggestion(label, query) {
  const escaped = escapeHtml(label);
  if (!query) return escaped;
  const index = label.toLowerCase().indexOf(query);
  if (index < 0) return escaped;
  const before = escapeHtml(label.slice(0, index));
  const match = escapeHtml(label.slice(index, index + query.length));
  const after = escapeHtml(label.slice(index + query.length));
  return `${before}<strong>${match}</strong>${after}`;
}

async function runProductSearch(query) {
  if (!state.user) {
    renderSearchLoginPrompt();
    return;
  }
  if (query.length < 2) {
    toast("Type a product name first.");
    return;
  }
  const allowed = await consumeSearchUsage();
  if (!allowed) return;
  saveRecentSearch(query);
  renderRecentSearches();
  els.productSearchInput.value = query;
  els.productSearchResults.innerHTML = `<p>Searching...</p>`;
  try {
    const grouped = await Promise.all([
      fetchSavedProductSearch(query),
      ...productSearchClients.map((client) => fetchProductSearch(client, query)),
    ]);
    const results = dedupeSearchResults(grouped.flat());
    renderProductSearchResults(results);
  } catch {
    els.productSearchResults.innerHTML = `<p>Search failed. Try again.</p>`;
  }
}

async function consumeSearchUsage() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/search-usage`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        userEmail: state.user?.email || "",
        userId: state.user?.id || "",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 429) {
        addLimitNotification({
          kind: "search",
          remaining: 0,
          resetAt: data.reset_at || data.resetAt,
        });
      }
      toast(data.error || "Search limit reached.");
      if (response.status === 401) renderSearchLoginPrompt();
      return false;
    }
    if (!data.unlimited && Number.isFinite(Number(data.remaining)) && Number(data.remaining) <= 5) {
      toast(`${data.remaining} searches left today.`);
      addLimitNotification({
        kind: "search",
        remaining: Number(data.remaining),
        resetAt: data.reset_at || data.resetAt,
      });
    }
    return true;
  } catch {
    toast("Could not verify search limit.");
    return false;
  }
}

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem("greenscan.recentSearches") || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query) {
  const normalized = query.trim();
  if (!normalized) return;
  const recent = getRecentSearches().filter((item) => item.toLowerCase() !== normalized.toLowerCase());
  const next = [normalized, ...recent].slice(0, localCachePolicy.recentSearchLimit);
  localStorage.setItem("greenscan.recentSearches", JSON.stringify(next));
  saveAccountRecentSearches(next);
}

function clearRecentSearches() {
  localStorage.removeItem("greenscan.recentSearches");
  renderRecentSearches();
  deleteAccountRecentSearches();
}

function renderRecentSearches() {
  if (!state.user) {
    els.recentSearches.classList.add("hidden");
    els.recentSearchList.innerHTML = "";
    return;
  }
  const recent = getRecentSearches();
  els.recentSearches.classList.toggle("hidden", recent.length === 0);
  els.recentSearchList.innerHTML = "";
  recent.forEach((query) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recent-search-chip";
    button.textContent = query;
    button.addEventListener("click", () => {
      setSearchMode("products");
      runProductSearch(query);
    });
    els.recentSearchList.appendChild(button);
  });
}

function renderSearchLoginPrompt() {
  els.productSearchResults.innerHTML = `
    <div class="search-login-card">
      <p>Sign in with Google to search products and view ingredients.</p>
      <button type="button" class="google-button full" id="searchGoogleLoginButton">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.4 3.3 29.5 1.2 24 1.2 14.6 1.2 6.5 6.6 2.6 14.5l7.1 5.5C11.4 13.8 17.1 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4H24v7.8h12.7c-.3 2-1.7 5.1-4.8 7.2l7 5.4c4.1-3.8 7.2-9.4 7.2-16.4Z"/><path fill="#FBBC05" d="M9.7 28c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7.1-5.5A22.7 22.7 0 0 0 .2 23.5c0 3.6.9 7 2.4 10l7.1-5.5Z"/><path fill="#34A853" d="M24 45.8c5.5 0 10.2-1.8 13.6-4.9l-7-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-6.8 0-12.6-4.3-14.7-10.2l-7.1 5.5C5.1 40.4 13.3 45.8 24 45.8Z"/></svg>
        Sign in with Google
      </button>
    </div>
  `;
  const button = document.querySelector("#searchGoogleLoginButton");
  if (button) button.addEventListener("click", loginWithGoogle);
  els.recentSearches.classList.add("hidden");
}

function notificationStorageKey() {
  return `greenscan.notifications.${state.user?.id || state.user?.email || "guest"}`;
}

function getNotifications() {
  try {
    return JSON.parse(localStorage.getItem(notificationStorageKey()) || "[]");
  } catch {
    return [];
  }
}

function saveNotifications(notifications) {
  localStorage.setItem(notificationStorageKey(), JSON.stringify(notifications.slice(0, localCachePolicy.notificationLimit)));
  updateNotificationDot();
}

function addAppNotification({ dedupeKey, title, message, barcode = "" }) {
  const notifications = getNotifications().filter((item) => item.dedupeKey !== dedupeKey);
  notifications.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dedupeKey,
    title,
    message,
    barcode,
    createdAt: new Date().toISOString(),
    read: false,
  });
  saveNotifications(notifications);
}

function addLimitNotification({ kind, remaining, resetAt }) {
  const typeLabel = kind === "ai" ? "AI analysis" : "Search";
  const resetText = formatResetTime(resetAt);
  const remainingNumber = Number(remaining);
  const reached = Number.isFinite(remainingNumber) && remainingNumber <= 0;
  const title = reached ? `${typeLabel} limit reached` : `${typeLabel} limit warning`;
  const message = reached
    ? `Your ${typeLabel.toLowerCase()} limit will be lifted ${resetText}.`
    : `You have ${remainingNumber} ${kind === "ai" ? "AI analyses" : "searches"} left today. Your limit refreshes ${resetText}.`;
  const dedupeKey = `${kind}:${reached ? "reached" : remainingNumber}:${resetAt || todayLocalKey()}`;
  addAppNotification({ dedupeKey, title, message });
}

function openNotifications() {
  const notifications = getNotifications();
  els.notificationList.innerHTML = notifications.length
    ? notifications.map((item) => `
      <article class="notification-item${item.read ? "" : " unread"}">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.message)}</p>
        <span>${escapeHtml(formatAdminDate(item.createdAt))}</span>
      </article>
    `).join("")
    : `<p class="ingredient-empty">No notifications yet.</p>`;
  saveNotifications(notifications.map((item) => ({ ...item, read: true })));
  els.notificationDialog.showModal();
}

function clearNotifications() {
  saveNotifications([]);
  els.notificationList.innerHTML = `<p class="ingredient-empty">No notifications yet.</p>`;
}

function updateNotificationDot() {
  const hasUnread = getNotifications().some((item) => !item.read);
  els.notificationDot.classList.toggle("hidden", !hasUnread);
}

function formatResetTime(value) {
  const date = value ? new Date(value) : nextLocalMidnight();
  if (Number.isNaN(date.getTime())) return "tomorrow";
  return `at ${date.toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })}`;
}

function nextLocalMidnight() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function todayLocalKey() {
  return new Date().toLocaleDateString("en-CA");
}

async function fetchProductSearch(client, query) {
  try {
    const response = await fetch(client.searchUrl(query));
    if (!response.ok) return [];
    const data = await response.json();
    return (data.products || [])
      .filter((product) => product.code && getProductName(product, client.category, product.code))
      .map((product) => ({ product, client, barcode: String(product.code) }));
  } catch {
    return [];
  }
}

async function fetchSavedProductSearch(query) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/search-saved-products?q=${encodeURIComponent(query)}`, {
      headers: await apiHeadersAsync(),
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.products || [])
      .filter((analysis) => analysis.barcode && analysis.name)
      .map((analysis) => ({ analysis: normalizeRenderableAnalysis(analysis), barcode: String(analysis.barcode), sourceName: "Saved database" }));
  } catch {
    return [];
  }
}

function dedupeSearchResults(results) {
  const byBarcode = new Map();
  results.forEach((item) => {
    const existing = byBarcode.get(item.barcode);
    if (!existing) {
      byBarcode.set(item.barcode, item);
      return;
    }
    const currentAnalysis = getSearchResultAnalysis(item);
    const existingAnalysis = getSearchResultAnalysis(existing);
    if (item.analysis || (currentAnalysis.category === "beauty" && existingAnalysis.category !== "beauty")) {
      byBarcode.set(item.barcode, item);
    }
  });
  return [...byBarcode.values()].slice(0, 18);
}

function renderProductSearchResults(results) {
  if (!results.length) {
    els.productSearchResults.innerHTML = `<p>No products found. Try a brand or shorter name.</p>`;
    return;
  }
  els.productSearchResults.innerHTML = "";
  results.forEach((result) => {
    const analysis = getSearchResultAnalysis(result);
    const row = document.createElement("button");
    row.className = "search-result-item";
    row.type = "button";
    row.innerHTML = `
      <img class="history-thumb" src="${escapeHtml(getHistoryImage(analysis))}" alt="${escapeHtml(analysis.name)}" />
      <div class="history-copy">
        <strong>${escapeHtml(analysis.name)}</strong>
        <p>${escapeHtml(analysis.itemCategory)} - ${escapeHtml(analysis.category)}</p>
        <p><span class="dot ${escapeHtml(analysis.scoreColor)}"></span>${escapeHtml(scoreLabel(analysis.scoreColor, analysis.safetyScore))}</p>
      </div>
      <span class="chevron">&rsaquo;</span>
    `;
    row.addEventListener("click", () => {
      switchView("scan");
      renderResult(analysis);
    });
    els.productSearchResults.appendChild(row);
  });
}

function getSearchResultAnalysis(result) {
  const analysis = result.analysis
    ? normalizeRenderableAnalysis(result.analysis)
    : analyzeKnownProduct(result.product, result.client, result.barcode);
  const localProduct = getSavedProduct(result.barcode || analysis.barcode);
  return localProduct ? mergeLocalProductOverrides(analysis, localProduct) : analysis;
}

function analyzeKnownProduct(product, client, barcode) {
  const ingredientsText = product.ingredients_text || "";
  const category = inferProductCategory({
    category: client.category,
    name: getProductName(product, client.category, barcode),
    brand: getCompanyName(product),
    categories: [product.categories, ...(product.categories_tags || []), ...(product.labels_tags || [])].join(" "),
    ingredientsText,
    ingredients: [],
  });
  const ingredients = splitIngredients(ingredientsText).map((name) => classifyIngredient(name, category));
  const score = calculateScore(ingredients, product, category);
  return {
    barcode,
    source: client.name,
    category,
    itemCategory: inferItemCategory({ category, name: getDisplayProductTitle(product, category, barcode), brand: product.brands || "", ingredientsText }, ingredients),
    name: getDisplayProductTitle(product, category, barcode),
    brand: product.brands || "",
    imageUrl: getOpenProductImageUrl(product),
    countries: product.countries || "",
    countriesTags: product.countries_tags || [],
    allergens: product.allergens || "",
    allergensTags: product.allergens_tags || [],
    traces: product.traces || "",
    tracesTags: product.traces_tags || [],
    nutriments: product.nutriments || {},
    nutriscoreGrade: product.nutriscore_grade || "",
    additivesTags: product.additives_tags || [],
    ingredientsText,
    ingredients,
    safetyScore: score,
    scoreColor: scoreColor(score),
    summary: buildSummary(score, ingredients, category),
    createdAt: new Date().toISOString(),
  };
}

function getOpenProductImageUrl(product = {}) {
  return product.image_front_url ||
    product.image_url ||
    product.selected_images?.front?.display?.en ||
    product.selected_images?.front?.small?.en ||
    product.selected_images?.front?.thumb?.en ||
    "";
}

async function findOpenDatabaseImageUrl(barcode) {
  const clean = normalizeBarcode(barcode || "");
  if (!clean) return "";
  for (const client of databaseClients) {
    try {
      const response = await fetch(client.url(clean));
      if (!response.ok) continue;
      const data = await response.json();
      const imageUrl = getOpenProductImageUrl(data.product || {});
      if (imageUrl) return imageUrl;
    } catch {
      // Try the next open database.
    }
  }
  return "";
}

function getProductName(product, category, barcode) {
  const nameFields = [
    product.product_name,
    product.product_name_en,
    product.generic_name,
    product.generic_name_en,
    product.abbreviated_product_name,
  ];
  const foundName = nameFields.find((value) => value && String(value).trim());
  if (foundName) return toDisplayName(foundName);

  const brand = product.brands_tags?.[0] || product.brands;
  if (brand) return `${toDisplayName(brand)} product`;

  const label = category === "beauty" ? "Beauty product" : "Food product";
  return barcode ? `${label} ${barcode}` : label;
}

function getDisplayProductTitle(product, category, barcode) {
  const productName = getProductName(product, category, barcode);
  const companyName = getCompanyName(product);
  if (!companyName) return productName;
  if (productName.toLowerCase().startsWith(companyName.toLowerCase())) return productName;
  return `${companyName}, ${productName}`;
}

function getCompanyName(product) {
  const brand = product.brands || product.brands_tags?.[0] || "";
  const firstBrand = String(brand).split(",")[0].trim();
  return firstBrand ? toDisplayName(firstBrand) : "";
}

function splitIngredients(text) {
  return normalizeIngredientTextTypos(text)
    .replace(/\([^)]*\)/g, (match) => match.replaceAll(",", ";"))
    .split(/[,;]\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 36);
}

const NON_INGREDIENT_SECTION_STOP = "\\b(?:(?:drug|nutrition|supplement) facts|purpose|uses?|warnings?|directions?|questions?|other information|serving size|calories|%\\s*daily value|(?:contains|may contain)\\s*:?\\s*(?:milk|eggs?|fish|shellfish|tree nuts?|peanuts?|wheat|soybeans?|sesame)\\b|allergen(?:s)?|produced in|made in (?:a )?facility|distributed by|dist\\. by|manufactured by|mfd\\. by|marketed by|packaged by|copyright|trademark|phone|call|contact us|questions or comments|website|www\\.|https?://|\\.com\\b|catch us|follow us|connect with|facebook|instagram|twitter|x\\.com|tiktok|@|scan|barcode|upc|qr code|recycling|recyclable|recycle|dispose|storage|store in|keep in|best before|best by|sell by|use by|expiration|exp\\.?|lot|batch|net wt|net weight|contents|package|packaging|for external use|keep out of reach|when using|do not use|stop use|ask a doctor|if swallowed|get medical help|poison control|active ingredient[s]?\\s*$|inactive ingredient[s]?\\s*$|vegan|cruelty[- ]?free|paraben[- ]?free|aluminum[- ]?free|dermatologist tested|clinically proven|certified|certification|not tested on animals|no artificial|gluten[- ]?free|non[- ]?gmo|plant[- ]?based)\\b";
const DRUG_FACTS_ACTIVE_STOP = "\\b(?:purpose|uses?|warnings?|directions?|inactive ingredients?|questions?|other information|when using|do not use|for external use|keep out of reach|stop use|ask a doctor|if swallowed|get medical help|poison control)\\b";
const DRUG_FACTS_INACTIVE_STOP = "\\b(?:purpose|uses?|warnings?|directions?|questions?|other information|distributed by|dist\\. by|manufactured by|mfd\\. by|marketed by|packaged by|phone|call|contact us|questions or comments|website|www\\.|https?://|\\.com\\b|catch us|follow us|connect with|facebook|instagram|twitter|x\\.com|tiktok|@|for external use|keep out of reach|when using|do not use|stop use|ask a doctor|if swallowed|get medical help|poison control|barcode|upc|qr code|recycling|recyclable|storage|store in|best before|best by|lot|batch|net wt|net weight|vegan|cruelty[- ]?free|paraben[- ]?free|aluminum[- ]?free|dermatologist tested|clinically proven|certified|certification|not tested on animals)\\b";

function cleanIngredientSection(value) {
  let text = String(value || "").replace(/\r/g, "\n").replace(/[ \t]+/g, " ").trim();
  if (!text) return "";
  const compact = text.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim();
  const sections = [];
  const activeMatch = compact.match(new RegExp("\\bactive ingredients?\\b\\s*:?\\s*([\\s\\S]*?)(?=" + DRUG_FACTS_ACTIVE_STOP + "|$)", "i"));
  if (activeMatch?.[1]) {
    const cleaned = stripNonIngredientTail(activeMatch[1]);
    if (cleaned) sections.push("Active ingredient: " + cleaned);
  }
  const inactiveMatch = compact.match(new RegExp("\\binactive ingredients?\\b\\s*:?\\s*([\\s\\S]*?)(?=" + DRUG_FACTS_INACTIVE_STOP + "|$)", "i"));
  if (inactiveMatch?.[1]) {
    const cleaned = stripNonIngredientTail(inactiveMatch[1]);
    if (cleaned) sections.push("Inactive ingredients: " + cleaned);
  }
  if (sections.length) return sections.join("; ");
  const ingredientMatch = compact.match(new RegExp("\\bingredients?\\b\\s*:?\\s*([\\s\\S]*?)(?=" + NON_INGREDIENT_SECTION_STOP + "|$)", "i"));
  if (ingredientMatch?.[1]) {
    const cleaned = stripNonIngredientTail(ingredientMatch[1]);
    if (cleaned) return cleaned;
  }
  if (/\b(?:drug facts|warnings?|directions?|purpose|uses?)\b/i.test(compact)) return "";
  return stripNonIngredientTail(compact);
}

function stripNonIngredientTail(value) {
  return String(value || "")
    .replace(new RegExp(NON_INGREDIENT_SECTION_STOP + "[\\s\\S]*$", "i"), "")
    .replace(/\b(?:for external use only|keep out of reach of children|stop use|ask a doctor|if swallowed|get medical help|poison control)\b[\s\S]*$/i, "")
    .replace(/\b(?:apply to|use daily|shake well|suggested use|dosage|reduces underarm wetness|antiperspirant)\b[\s\S]*$/i, "")
    .replace(/\b1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, " ")
    .replace(/\b\d{6,14}\b/g, " ")
    .replace(/\s*[,;]\s*/g, ", ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:.,;-]+|[\s:.,;-]+$/g, "")
    .trim();
}

function normalizeIngredientTextTypos(value) {
  return String(value || "")
    .replace(/\bispartame\b/gi, "aspartame");
}

function getIngredientAlias(value) {
  const normalized = normalizeIngredientTextTypos(value)
    .toLowerCase()
    .replace(/[.,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = ingredientAliases.find((alias) => alias.terms.some((term) => normalized === term || normalized.includes(term)));
  return match ? { canonical: match.canonical } : null;
}

function isIngredientCompatible(item, category) {
  const normalizedCategory = String(category || "unknown").toLowerCase();
  if (item.categories) return item.categories.includes(normalizedCategory);
  if (normalizedCategory === "beauty" && foodOnlyIngredientTypes.has(item.type)) return false;
  if (normalizedCategory === "food" && beautyOnlyIngredientTypes.has(item.type)) return false;
  return true;
}

function findKnownIngredient(rawName, category, exact = false) {
  const cleanName = normalizeIngredientTextTypos(rawName).trim();
  const alias = getIngredientAlias(cleanName);
  const canonicalName = alias?.canonical || cleanName;
  const normalized = canonicalName.toLowerCase();
  const matches = (item) => exact ? normalized === item.match : normalized.includes(item.match);
  const hit = riskDictionary.find((item) => matches(item) && isIngredientCompatible(item, category));
  if (hit) return { hit, cleanName, normalized, alias };
  const safeHit = knownIngredientCatalog.find((item) => normalized === item.match && isIngredientCompatible(item, category));
  return safeHit ? { hit: { ...safeHit, risk: "low" }, cleanName, normalized, alias } : null;
}

function classifyIngredient(rawName, category) {
  const found = findKnownIngredient(rawName, category);
  const cleanName = normalizeIngredientTextTypos(rawName).trim();
  if (found) {
    const { hit, normalized, alias } = found;
    return {
      rawName: toDisplayName(cleanName), normalizedName: normalized, type: hit.type, risk: hit.risk,
      riskScore: hit.risk === "high" ? 85 : hit.risk === "moderate" ? 55 : 12,
      reason: hit.reason, aliasLabel: alias?.canonical || "",
    };
  }
  return {
    rawName: toDisplayName(cleanName), normalizedName: cleanName.toLowerCase(), type: "unverified_ingredient",
    risk: "unknown", riskScore: 0,
    reason: "This text is not a verified entry in the GreenScan ingredient dictionary, so it has not been given a safety rating.", aliasLabel: "",
  };
}

function toDisplayName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      if (!word) return word;
      if (/^e\d+[a-z]?$/i.test(word)) return word.toUpperCase();
      if (/^[A-Z0-9-]{2,}$/.test(word)) return word;
      return word
        .split("-")
        .map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part)
        .join("-");
    })
    .join(" ");
}

function calculateScore(ingredients, product = {}, category = "unknown") {
  return calculateScoreDetails(ingredients, product, category).score;
}

function calculateScoreDetails(ingredients, product = {}, category = "unknown") {
  let score = 100;
  const entries = [];
  const ingredientText = ingredients.map((ingredient) => `${ingredient.rawName || ""} ${ingredient.type || ""}`.toLowerCase()).join(" ");
  const hasAny = (terms) => terms.some((term) => ingredientText.includes(term));
  const apply = (label, points, detail = "") => {
    if (!points) return;
    score += points;
    entries.push({ label, points, detail });
  };

  const highCount = ingredients.filter((ingredient) => normalizeRisk(ingredient.risk) === "high").length;
  const moderateCount = ingredients.filter((ingredient) => normalizeRisk(ingredient.risk) === "moderate").length;
  const unknownCount = ingredients.filter((ingredient) => normalizeRisk(ingredient.risk) === "unknown").length;
  apply(`${highCount} potential high-risk ingredient${highCount === 1 ? "" : "s"}`, highCount * -18);
  apply(`${moderateCount} potential moderate-risk ingredient${moderateCount === 1 ? "" : "s"}`, moderateCount * -8);
  apply(`${unknownCount} ingredient${unknownCount === 1 ? "" : "s"} needing review`, unknownCount * -3);

  if (!ingredients.length) apply("Ingredient list unavailable", -16, "The score is less certain until ingredients are added.");

  if (category === "food") {
    const nutrition = product.nutriments || product.nutritionFacts || product.nutrition_facts || product.nutrition || {};
    const sugar = Number(nutrition.sugars_100g);
    const fat = Number(nutrition.fat_100g);
    const saturatedFat = Number(nutrition["saturated-fat_100g"]);
    const sodium = getValidatedSodium100g(nutrition, product);
    const hasAddedSugar = hasAny(foodSugarTerms);
    const hasAddedFat = hasAny(foodFatTerms);
    const hasAdditives = hasAny(foodAdditiveTerms);

    if (hasAny(["red 40", "yellow 5", "yellow 6", "blue 1", "artificial color"])) apply("Artificial color signal", -6);
    if (hasAny(["high fructose corn syrup"])) apply("High-fructose corn syrup", -10);
    if (hasAny(["bha", "bht"])) apply("BHA or BHT", -10);
    if (hasAny(["sodium nitrite"])) apply("Sodium nitrite", -18);
    if (hasAddedSugar) apply("Added sugar detected", -10);
    if (hasAdditives) apply("Flagged additives detected", -5);
    if (hasAddedFat) apply("Added fats or oils detected", -7);
    if (Number.isFinite(sugar) && sugar >= 22) apply("High sugar per 100g", -14, `${sugar} g sugar per 100g`);
    else if (Number.isFinite(sugar) && sugar >= 10) apply("Moderate sugar per 100g", -6, `${sugar} g sugar per 100g`);
    if (Number.isFinite(fat) && fat >= 20) apply("High total fat", -7, `${fat} g fat per 100g`);
    if (Number.isFinite(saturatedFat) && saturatedFat >= 5) apply("High saturated fat", -8, `${saturatedFat} g saturated fat per 100g`);
    if (Number.isFinite(sodium) && sodium >= 0.6) apply("High sodium", -7, `${Math.round(sodium * 1000)} mg sodium per 100g`);
    const nutriScore = String(product.nutriscore_grade || product.nutriscoreGrade || "").toLowerCase();
    if (["d", "e"].includes(nutriScore)) apply(`Nutri-Score ${nutriScore.toUpperCase()}`, -14);
    if (hasAny(["whole grain", "oats", "beans", "lentils", "fruit", "vegetable"])) apply("Whole-food ingredient signal", 3);
    if (!hasAddedSugar && (!Number.isFinite(sugar) || sugar <= 1)) apply("No added sugar signal", 3);
    if (!hasAddedFat && (!Number.isFinite(fat) || fat <= 1)) apply("No added fats or oils signal", 2);
    if (!hasAdditives) apply("No flagged additives", 2);
  }

  if (category === "beauty") {
    if (hasAny(["fragrance", "parfum"])) apply("Fragrance or parfum", -6);
    if (hasAny(["methylisothiazolinone", "methylchloroisothiazolinone", "formaldehyde", "dmdm hydantoin", "imidazolidinyl urea"])) apply("Strong sensitizer or formaldehyde-releaser signal", -14);
    if (hasAny(["denatured alcohol", "alcohol denat"])) apply("Drying alcohol", -8);
    if (hasAny(["sodium lauryl sulfate", "sodium laureth sulfate", "ammonium lauryl sulfate", "sls", "sles"])) apply("Sulfate surfactant", -6);
    if (!hasAny(["fragrance", "parfum", "methylisothiazolinone", "methylchloroisothiazolinone"])) apply("No fragrance or common isothiazolinone signal", 5);
  }

  if (ingredients.length > 0 && ingredients.every((ingredient) => normalizeRisk(ingredient.risk) !== "high")) apply("No potential high-risk ingredients", 5);
  if (ingredients.length > 0 && ingredients.length <= 8) apply("Shorter ingredient list", 3);

  const rawScore = score;
  return {
    score: Math.max(0, Math.min(100, rawScore)),
    rawScore,
    entries,
  };
}

function isLiquidBeverageProduct(product = {}) {
  const text = [
    product.name,
    product.detected_product_name,
    product.product_name,
    product.product_name_en,
    product.generic_name,
    product.itemCategory,
    product.item_category,
    product.categories,
    ...(Array.isArray(product.categories_tags) ? product.categories_tags : []),
  ].join(" ").toLowerCase();
  return /\b(drink|beverage|soda|cola|pepsi|juice|water|lemonade|tea|coffee|energy drink|sports drink)\b/.test(text);
}

function getValidatedSodium100g(nutrition = {}, product = {}) {
  const sodium = Number(nutrition.sodium_100g);
  if (!Number.isFinite(sodium)) return Number.NaN;
  // Open product data reports sodium in g/100g. More than 5 g/100g in a
  // beverage is almost certainly a unit or transcription error (5,000 mg).
  if (isLiquidBeverageProduct(product) && sodium > 5) return Number.NaN;
  return sodium;
}

function scoreColor(score) {
  if (score >= 75) return "green";
  if (score >= 50) return "yellow";
  if (score >= 25) return "orange";
  return "red";
}

function buildSummary(score, ingredients, category) {
  const high = ingredients.filter((item) => normalizeRisk(item.risk) === "high").length;
  const moderate = ingredients.filter((item) => normalizeRisk(item.risk) === "moderate").length;
  const label = category === "beauty" ? "cosmetic" : "food";
  if (score >= 90) return `This ${label} looks excellent based on available ingredient data.`;
  if (score >= 75) return `This ${label} looks low concern based on available ingredient data.`;
  if (score >= 50) return `This ${label} has ${moderate + high} ingredient concern${moderate + high === 1 ? "" : "s"} worth reviewing.`;
  if (score >= 25) return `This ${label} has multiple ingredient concerns and should be reviewed carefully.`;
  return `This ${label} has multiple or high-priority ingredient concerns.`;
}

function renderResult(analysis, options = {}) {
  const safeAnalysis = normalizeRenderableAnalysis(analysis);
  const cachedImageUrl = findCachedProductImageUrl(safeAnalysis.barcode);
  if (!safeAnalysis.imageUrl && cachedImageUrl) safeAnalysis.imageUrl = cachedImageUrl;
  checkFavoriteProductChanges(safeAnalysis);
  state.currentAnalysis = safeAnalysis;
  if (options.countScan) updateScanStreak(safeAnalysis);
  state.currentAnalysisCanAddImage = Boolean(options.allowImageUpload && safeAnalysis.barcode && !safeAnalysis.imageUrl);
  state.selectedHistoryKey = getHistoryKey(safeAnalysis);
  const sortedIngredients = sortIngredientsByRisk(safeAnalysis.ingredients);
  const notable = sortedIngredients.filter((item) => normalizeRisk(item.risk) !== "low" || item.personalAvoid);
  const personalAvoids = sortedIngredients.filter((item) => item.personalAvoid);
  const visibleIngredients = notable.length ? notable : sortedIngredients.slice(0, 1);
  const positiveNotes = buildPositiveNotes(safeAnalysis);
  const nutritionChecks = buildNutritionChecks(safeAnalysis);
  const isFoodResult = safeAnalysis.category === "food";
  const negativeNutritionChecks = isFoodResult ? nutritionChecks.filter((check) => check.level !== "good") : [];
  const positiveNutritionChecks = isFoodResult ? nutritionChecks.filter((check) => check.level === "good") : nutritionChecks;
  const comparison = options.comparisonOverride ? normalizeRenderableAnalysis(options.comparisonOverride) : getComparableProduct(safeAnalysis);
  const alternatives = getBetterAlternatives(safeAnalysis);
  const confidence = getConfidenceLabel(safeAnalysis);
  const favorite = isFavoriteProduct(safeAnalysis.barcode);
  const concernCount = notable.length + negativeNutritionChecks.length;
  const positiveCount = positiveNotes.length + positiveNutritionChecks.length;
  const formulaChange = options.formulaChangeNotice || getFormulaChangeNotice(safeAnalysis);
  const displayScore = Math.max(0, Math.min(100, Number(safeAnalysis.safetyScore) || 0));
  state.pendingMatchSource = options.pendingSource || "";
  state.renderedIngredients = new Map();
  state.ingredientRenderId = 0;

  els.resultPanel.innerHTML = `
    <button type="button" class="result-sheet-handle" id="resultSheetHandle" aria-expanded="false">
      <span aria-hidden="true"></span>
      <small>Swipe up for full details</small>
    </button>
    ${state.adminPreviewOpen ? `
      <button type="button" class="admin-preview-back" id="adminPreviewBackButton">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        Back to admin report
      </button>
    ` : ""}
    <div class="score-card">
      <button type="button" class="favorite-button ${favorite ? "active" : ""}" id="favoriteButton" aria-label="${favorite ? "Remove favorite" : "Add favorite"}" title="${favorite ? "Remove favorite" : "Add favorite"}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.4-9.2-9A5.7 5.7 0 0 1 12 5.8 5.7 5.7 0 0 1 21.2 12C19 16.6 12 21 12 21Z" /></svg>
      </button>
      <button type="button" class="category-edit-button" id="categoryEditButton" aria-label="Edit product category" title="Edit category">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></svg>
      </button>
      <div class="result-media">
        ${safeAnalysis.imageUrl ? `<img class="result-image" src="${escapeHtml(safeAnalysis.imageUrl)}" alt="${escapeHtml(safeAnalysis.name)}" />` : `<div class="result-image-placeholder"></div>`}
        <span class="mini-score ${safeAnalysis.scoreColor}" style="--score-value: ${displayScore}">${safeAnalysis.safetyScore}</span>
      </div>
      <div>
        <p class="eyebrow">${escapeHtml(getResultEyebrow(safeAnalysis))}</p>
        <h2>${escapeHtml(safeAnalysis.name)}</h2>
        <div class="premium-compact-score">
          <strong>${escapeHtml(scoreLabel(safeAnalysis.scoreColor, displayScore))} ${displayScore}/100</strong>
          <span>${concernCount} potential concern${concernCount === 1 ? "" : "s"}</span>
        </div>
        <p>${escapeHtml(safeAnalysis.summary)}</p>
        <div class="meta-grid">
          ${safeAnalysis.brand ? `<span class="pill">${escapeHtml(safeAnalysis.brand)}</span>` : ""}
          <span class="pill">${escapeHtml(safeAnalysis.itemCategory)}</span>
          ${safeAnalysis.barcode ? `<span class="pill">${escapeHtml(safeAnalysis.barcode)}</span>` : ""}
          <span class="pill source-pill">${escapeHtml(getTrustLabel(safeAnalysis))}</span>
          <span class="pill confidence-pill ${escapeHtml(confidence.level)}">${escapeHtml(confidence.label)}</span>
          <span class="pill">${safeAnalysis.ingredients.length} ingredients</span>
        </div>
        <div class="result-actions">
          <button type="button" class="secondary-button compact-action" id="shareResultButton">Share result</button>
        </div>
      </div>
    </div>
    ${notable.length ? `
      <section class="premium-concern-preview" aria-label="Top potential concerns">
        <div>
          <strong>Potential concerns</strong>
          <span>${notable.length}</span>
        </div>
        ${notable.slice(0, 2).map((ingredient, index) => `
          <button type="button" data-premium-concern="${index}">
            <span class="dot ${escapeHtml(riskDotColor(ingredient.risk))}" aria-hidden="true"></span>
            <span>
              <strong>${escapeHtml(ingredient.rawName)}</strong>
              <small>${escapeHtml(ingredient.reason || `${toDisplayName(ingredient.risk)} potential risk`)}</small>
            </span>
            <span aria-hidden="true">›</span>
          </button>
        `).join("")}
      </section>
    ` : ""}
    <nav class="result-summary-bar" aria-label="Product result sections">
      <button type="button" data-result-jump=".negatives-section"><strong>${concernCount}</strong><span>Concerns</span></button>
      <button type="button" data-result-jump=".positives-section"><strong>${positiveCount}</strong><span>Positives</span></button>
      <button type="button" data-result-jump=".all-ingredients-section"><strong>${safeAnalysis.ingredients.length}</strong><span>Ingredients</span></button>
    </nav>
    ${renderScoreBreakdown(safeAnalysis)}
    ${renderDataQualityCard(safeAnalysis)}
    ${renderFormulaChangeAlert(formulaChange)}
    ${renderAllergenCrossContactCard(safeAnalysis)}
    ${renderBeautyUseContext(safeAnalysis)}
    ${renderCountryFormulaCard(safeAnalysis)}
    ${personalAvoids.length ? `
      <section class="avoid-alert-card">
        <p class="eyebrow">Personal alert</p>
        <h3>Contains ${personalAvoids.length} ingredient${personalAvoids.length === 1 ? "" : "s"} from your avoid list</h3>
        ${personalAvoids.slice(0, 8).map((item) => `
          <div class="avoid-match-item">
            <strong>${escapeHtml(item.rawName)}</strong>
            ${item.reason && item.reason !== "No reason provided." ? `<span class="avoid-match-reason">${escapeHtml(item.reason)}</span>` : `<span class="avoid-match-reason">In your personal avoid list</span>`}
          </div>
        `).join("")}
      </section>
    ` : ""}
    ${state.currentAnalysisCanAddImage ? `
      <label class="add-product-image" for="productImageUpload">
        <input id="productImageUpload" type="file" accept="image/*" capture="environment" />
        Add product picture
      </label>
    ` : ""}
    ${personalAvoids.length ? `
      <section class="avoid-section">
        <h3>Personal avoid list</h3>
        <div class="ingredient-list avoid-list"></div>
      </section>
    ` : ""}
    ${isFoodResult ? `
      <section class="negatives-section">
        <h3>Negatives</h3>
        <div class="nutrition-list negative-nutrition-list"></div>
        <div class="ingredient-list concern-list"></div>
      </section>
      <section class="positives-section">
        <h3>Positives</h3>
        <div class="positive-list"></div>
        <div class="nutrition-list positive-nutrition-list"></div>
      </section>
    ` : `
      <section class="positives-section">
        <h3>Positives</h3>
        <div class="positive-list"></div>
      </section>
      ${nutritionChecks.length ? `
        <section class="nutrition-section">
          <h3>Nutrition checks</h3>
          <div class="nutrition-list"></div>
        </section>
      ` : ""}
      <section class="negatives-section">
        <h3>Potential concerns</h3>
        <div class="ingredient-list concern-list"></div>
      </section>
    `}
    ${comparison ? renderComparisonCard(safeAnalysis, comparison) : ""}
    ${alternatives.length ? renderBetterAlternatives(alternatives, safeAnalysis) : ""}
    ${renderProductChangeLog(safeAnalysis)}
    <div class="all-ingredients-section">
      <button type="button" class="all-ingredients-toggle" aria-expanded="false">
        <span>See All Ingredients</span>
        <span class="toggle-chevron">⌄</span>
      </button>
      <div class="ingredient-list all-ingredient-list hidden"></div>
    </div>
    <button type="button" class="report-link" id="reportButton">🚩 Report incorrect data</button>
    <nav class="premium-result-dock" aria-label="Product actions">
      <button type="button" id="premiumIngredientsButton">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6" /><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" /><path d="M8 15h8" /></svg>
        <span>Ingredients</span>
      </button>
      <button type="button" id="premiumSavedButton" class="${favorite ? "active" : ""}" aria-pressed="${favorite}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z" /></svg>
        <span>${favorite ? "Saved" : "Save product"}</span>
      </button>
    </nav>
  `;
  els.resultPanel.classList.remove("loading-result");
  prepareResultSheet();
  renderScannerProductPreview(safeAnalysis);

  const positiveList = els.resultPanel.querySelector(".positive-list");
  positiveNotes.forEach((note) => positiveList.appendChild(renderPositiveNote(note)));
  const avoidList = els.resultPanel.querySelector(".avoid-list");
  if (avoidList) personalAvoids.forEach((ingredient) => avoidList.appendChild(renderIngredient(ingredient)));
  const nutritionList = els.resultPanel.querySelector(".nutrition-list");
  if (isFoodResult) {
    const negativeNutritionList = els.resultPanel.querySelector(".negative-nutrition-list");
    const positiveNutritionList = els.resultPanel.querySelector(".positive-nutrition-list");
    negativeNutritionChecks.forEach((check) => negativeNutritionList.appendChild(renderNutritionCheck(check)));
    positiveNutritionChecks.forEach((check) => positiveNutritionList.appendChild(renderNutritionCheck(check)));
    if (!negativeNutritionChecks.length && !notable.length) {
      negativeNutritionList.innerHTML = `<p class="ingredient-empty">No major negatives found from the current food data.</p>`;
    }
  } else if (nutritionList) {
    nutritionChecks.forEach((check) => nutritionList.appendChild(renderNutritionCheck(check)));
  }
  const list = els.resultPanel.querySelector(".concern-list");
  const concernIngredients = isFoodResult ? notable : visibleIngredients;
  if (concernIngredients.length) {
    concernIngredients.forEach((ingredient) => list.appendChild(renderIngredient(ingredient)));
  } else {
    list.innerHTML = isFoodResult
      ? ""
      : `<p class="ingredient-empty">No ingredient list was found. Add an ingredient photo for a better score.</p>`;
  }
  const allList = els.resultPanel.querySelector(".all-ingredient-list");
  if (sortedIngredients.length) {
    renderIngredientGroups(allList, sortedIngredients);
  } else {
    allList.innerHTML = `<p class="ingredient-empty">No ingredients available yet.</p>`;
  }
  const toggle = els.resultPanel.querySelector(".all-ingredients-toggle");
  const adminPreviewBackButton = els.resultPanel.querySelector("#adminPreviewBackButton");
  const favoriteButton = els.resultPanel.querySelector("#favoriteButton");
  const premiumIngredientsButton = els.resultPanel.querySelector("#premiumIngredientsButton");
  const premiumSavedButton = els.resultPanel.querySelector("#premiumSavedButton");
  const categoryEditButton = els.resultPanel.querySelector("#categoryEditButton");
  els.reportButton = els.resultPanel.querySelector("#reportButton");
  if (favoriteButton) favoriteButton.addEventListener("click", () => toggleFavoriteProduct(safeAnalysis));
  if (premiumIngredientsButton) premiumIngredientsButton.addEventListener("click", () => {
    setResultSheetExpanded(true);
    if (toggle?.getAttribute("aria-expanded") !== "true") toggle?.click();
    window.setTimeout(() => scrollToResultSection(".all-ingredients-section"), 80);
  });
  if (premiumSavedButton) premiumSavedButton.addEventListener("click", () => toggleFavoriteProduct(safeAnalysis));
  els.resultPanel.querySelectorAll("[data-premium-concern]").forEach((button) => {
    button.addEventListener("click", () => {
      const ingredient = notable[Number(button.dataset.premiumConcern)];
      if (ingredient) showIngredientDetail(ingredient);
    });
  });
  if (categoryEditButton) categoryEditButton.addEventListener("click", () => {
    state.adminReturnAfterEdit = "";
    openCategoryDialog();
  });
  els.reportButton.addEventListener("click", openReportDialog);
  const imageUpload = els.resultPanel.querySelector("#productImageUpload");
  if (imageUpload) imageUpload.addEventListener("change", addScannedProductImage);
  const shareButton = els.resultPanel.querySelector("#shareResultButton");
  if (shareButton) shareButton.addEventListener("click", () => shareResult(safeAnalysis));
  els.resultPanel.querySelectorAll("[data-result-jump]").forEach((button) => {
    button.addEventListener("click", () => scrollToResultSection(button.dataset.resultJump));
  });
  els.resultPanel.querySelectorAll("[data-country-formula]").forEach((button) => {
    button.addEventListener("click", () => compareCountryFormula(safeAnalysis, button.dataset.countryFormula));
  });
  if (adminPreviewBackButton) adminPreviewBackButton.addEventListener("click", returnToAdminFromPreview);
  els.resultPanel.querySelectorAll("[data-alt-barcode]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = getKnownLocalProducts().find((item) => item.barcode === button.dataset.altBarcode);
      if (product) renderResult(product);
    });
  });
  els.resultPanel.querySelectorAll("[data-compare-barcode]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!comparison) return;
      const choices = [safeAnalysis, comparison];
      const product = choices.find((item) => item.barcode === button.dataset.compareBarcode);
      const other = choices.find((item) => item.barcode !== button.dataset.compareBarcode);
      if (product) renderResult(product, { comparisonOverride: other, skipHistoryRender: true });
    });
  });
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    allList.classList.toggle("hidden", isOpen);
  });
  scrollToResultPanel();
  rememberComparableProduct(safeAnalysis);
  if (!options.skipHistoryRender) renderHistory();
}

function formulaSnapshotStorageKey() {
  return "greenscan.formulaSnapshots";
}

function getFormulaSnapshots() {
  try {
    const value = JSON.parse(localStorage.getItem(formulaSnapshotStorageKey()) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function getFormulaChangeNotice(analysis) {
  const barcode = normalizeBarcode(analysis?.barcode || "");
  if (!barcode || barcode === "photo-only") return null;
  const previous = getFormulaSnapshots()[barcode];
  const currentSignature = productIngredientSignature(analysis);
  if (!previous?.signature || previous.signature === currentSignature) return null;
  return {
    previous: Array.isArray(previous.ingredients) ? previous.ingredients : [],
    current: (analysis.ingredients || []).map((item) => item.rawName).filter(Boolean),
    observedAt: previous.observedAt || "",
  };
}

function recordFormulaSnapshot(analysis) {
  const barcode = normalizeBarcode(analysis?.barcode || "");
  if (!barcode || barcode === "photo-only") return;
  const snapshots = getFormulaSnapshots();
  const signature = productIngredientSignature(analysis);
  const previous = snapshots[barcode];
  const changed = Boolean(previous?.signature && previous.signature !== signature);
  snapshots[barcode] = {
    signature,
    ingredients: (analysis.ingredients || []).map((item) => item.rawName).filter(Boolean).slice(0, 60),
    observedAt: new Date().toISOString(),
  };
  try {
    const entries = Object.entries(snapshots).sort(([, a], [, b]) => String(b.observedAt).localeCompare(String(a.observedAt))).slice(0, 60);
    localStorage.setItem(formulaSnapshotStorageKey(), JSON.stringify(Object.fromEntries(entries)));
  } catch {
    return;
  }
  if (changed) {
    addAppNotification({
      dedupeKey: `formula-change:${barcode}:${signature}`,
      title: "Formula change detected",
      message: `${analysis.name || "This product"} has a different ingredient list than the last saved scan.`,
      barcode,
    });
  }
}

function renderFormulaChangeAlert(notice) {
  if (!notice) return "";
  return `
    <section class="formula-change-card">
      <p class="eyebrow">Formula update</p>
      <h3>Ingredient list changed</h3>
      <p>GreenScan found a different ingredient list than the last saved scan on this device. Check the package before relying on an older result.</p>
      <div class="formula-change-grid">
        <div><strong>Previously</strong><span>${escapeHtml(notice.previous.slice(0, 4).join(", ") || "No ingredient list")}${notice.previous.length > 4 ? "..." : ""}</span></div>
        <div><strong>Now</strong><span>${escapeHtml(notice.current.slice(0, 4).join(", ") || "No ingredient list")}${notice.current.length > 4 ? "..." : ""}</span></div>
      </div>
    </section>
  `;
}

function normalizeAllergenList(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(/[,;|]/);
  return [...new Set(values.map((item) => String(item || "").replace(/^[a-z]{2,3}:/i, "").replaceAll("_", " ").trim()).filter(Boolean).map(toDisplayName))];
}

function getAllergenCrossContactReport(analysis) {
  const allergens = normalizeAllergenList([
    ...(Array.isArray(analysis.allergensTags) ? analysis.allergensTags : []),
    analysis.allergens,
    analysis.allergenStatement,
  ]);
  const traces = normalizeAllergenList([
    ...(Array.isArray(analysis.tracesTags) ? analysis.tracesTags : []),
    analysis.traces,
    analysis.crossContactStatement,
  ]);
  return { allergens, traces };
}

function renderAllergenCrossContactCard(analysis) {
  const report = getAllergenCrossContactReport(analysis);
  if (analysis.category !== "food" && !report.allergens.length && !report.traces.length) return "";
  const chips = (items) => items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  return `
    <section class="allergen-card">
      <div class="section-heading compact-heading"><div><p class="eyebrow">Label check</p><h3>Allergens and cross-contact</h3></div></div>
      ${report.allergens.length ? `<div class="allergen-line"><strong>Declared allergens</strong><div>${chips(report.allergens)}</div></div>` : ""}
      ${report.traces.length ? `<div class="allergen-line"><strong>May contain / traces</strong><div>${chips(report.traces)}</div></div>` : ""}
      ${!report.allergens.length && !report.traces.length ? `<p class="allergen-empty">No allergen or cross-contact statement was supplied by the source. This is not proof that the product is allergen-free.</p>` : `<p class="allergen-note">Always check the package because formulas and cross-contact warnings can change.</p>`}
    </section>
  `;
}

function getBeautyUseContext(analysis) {
  if (analysis.category !== "beauty") return null;
  const text = [analysis.name, analysis.itemCategory, analysis.brand].filter(Boolean).join(" ").toLowerCase();
  if (/leave[- ]?in|deodorant|antiperspirant|lotion|cream|serum|sunscreen|makeup|foundation|gel|spray|oil|fragrance/.test(text)) {
    return { label: "Leave-on product", body: "Ingredients remain on skin or hair after use, so irritation and sensitizer notes deserve extra attention." };
  }
  if (/shampoo|conditioner|body wash|face wash|cleanser|soap|scrub|rinse/.test(text)) {
    return { label: "Rinse-off product", body: "Ingredients are normally washed away, but irritation or allergy concerns can still matter for sensitive skin." };
  }
  return null;
}

function renderBeautyUseContext(analysis) {
  const context = getBeautyUseContext(analysis);
  if (!context) return "";
  return `
    <section class="use-context-card">
      <p class="eyebrow">Use context</p>
      <h3>${escapeHtml(context.label)}</h3>
      <p>${escapeHtml(context.body)}</p>
      <small>This context explains exposure; it does not change the GreenScan score.</small>
    </section>
  `;
}

function renderCountryFormulaCard(analysis) {
  if (!analysis.barcode || analysis.barcode === "photo-only") return "";
  const markets = normalizeAllergenList(analysis.countriesTags?.length ? analysis.countriesTags : analysis.countries);
  return `
    <section class="country-formula-card" id="countryFormulaCard">
      <p class="eyebrow">Market check</p>
      <h3>Compare country formulas</h3>
      <p>Some products have different formulas or label data by market. GreenScan checks the open database for a country-specific record when available.</p>
      <div class="country-choice-row">
        <button type="button" class="secondary-button compact-action" data-country-formula="United States">United States</button>
        <button type="button" class="secondary-button compact-action" data-country-formula="European Union">European Union</button>
      </div>
      ${markets.length ? `<small class="country-markets">Source markets: ${escapeHtml(markets.slice(0, 4).join(", "))}</small>` : ""}
      <div class="country-formula-result" id="countryFormulaResult" aria-live="polite"></div>
    </section>
  `;
}

async function compareCountryFormula(analysis, country) {
  const result = els.resultPanel.querySelector("#countryFormulaResult");
  if (!result) return;
  result.textContent = `Checking ${country} formula data...`;
  const client = databaseClients.find((item) => item.category === analysis.category) || databaseClients[0];
  try {
    const response = await fetch(`${client.url(encodeURIComponent(analysis.barcode))}&countries_tags_en=${encodeURIComponent(country)}`);
    const data = await response.json();
    if (!response.ok || data.status !== 1 || !data.product) {
      result.textContent = `No separate ${country} record was returned for this barcode.`;
      return;
    }
    const comparison = analyzeKnownProduct(data.product, client, analysis.barcode);
    const current = splitIngredients(analysis.ingredientsText || "").map((item) => normalizeComparableText(item));
    const next = splitIngredients(comparison.ingredientsText || "").map((item) => normalizeComparableText(item));
    const changed = current.join("|") !== next.join("|");
    result.innerHTML = changed
      ? `<strong>${escapeHtml(country)} record differs</strong><p>${escapeHtml(comparison.ingredients.length)} ingredients returned. Review the country-specific label before comparing scores.</p>`
      : `<strong>No separate formula difference found</strong><p>The available ${escapeHtml(country)} record returned the same ingredient sequence. This does not guarantee every package is identical.</p>`;
  } catch {
    result.textContent = `Could not check ${country} right now. The current listing is unchanged.`;
  }
}

function renderProductChangeLog(analysis) {
  const changes = Array.isArray(analysis.changeLog) ? analysis.changeLog.slice(0, 3) : [];
  if (!changes.length) return "";
  return `
    <section class="change-log-card">
      <p class="eyebrow">Database changes</p>
      <h3>Recent corrections</h3>
      ${changes.map((change) => `
        <article>
          <strong>${escapeHtml(formatChangeLogTitle(change))}</strong>
          <span>${escapeHtml(formatChangeLogMeta(change))}</span>
          <p>${escapeHtml(formatChangeLogFields(change.fields))}</p>
        </article>
      `).join("")}
    </section>
  `;
}

function renderScoreBreakdown(analysis) {
  const details = calculateScoreDetails(analysis.ingredients || [], analysis, analysis.category);
  return `
    <details class="score-breakdown-card">
      <summary>
        <span><strong>Why this score?</strong><small>See every deduction and bonus</small></span>
        <b>${Number(analysis.safetyScore || 0)}/100</b>
        <i aria-hidden="true">⌄</i>
      </summary>
      <div class="score-breakdown-body">
        <div class="score-line score-start"><span>Starting score</span><strong>100</strong></div>
        ${details.entries.length ? details.entries.map((entry) => `
          <div class="score-line ${entry.points > 0 ? "bonus" : "deduction"}">
            <span>${escapeHtml(entry.label)}${entry.detail ? `<small>${escapeHtml(entry.detail)}</small>` : ""}</span>
            <strong>${entry.points > 0 ? "+" : ""}${entry.points}</strong>
          </div>
        `).join("") : `<p class="ingredient-empty">No score adjustments were applied.</p>`}
        <div class="score-line score-total"><span>Final GreenScan score</span><strong>${Number(analysis.safetyScore || 0)}/100</strong></div>
        ${details.rawScore !== details.score ? `<p class="score-cap-note">Scores are always limited to the 0–100 range.</p>` : ""}
      </div>
    </details>
  `;
}

function getDataQualityReport(analysis) {
  const ingredientsComplete = Boolean(analysis.ingredients?.length && String(analysis.ingredientsText || analysis.extracted_ingredients_text || "").trim());
  const barcodeComplete = Boolean(analysis.barcode && analysis.barcode !== "photo-only");
  const imageComplete = Boolean(analysis.imageUrl);
  const nameComplete = Boolean(analysis.name && !/photo analyzed product|product \d+|beauty product \d+|food product \d+/i.test(analysis.name));
  const source = String(analysis.source || "").toLowerCase();
  const sourceComplete = /saved|admin|open food facts|open beauty facts|gpt|ai/.test(source);
  const specificType = Boolean(analysis.itemCategory && !["Product", "Unknown", "Food / Drink", "Beauty", "Beauty / Hair"].includes(analysis.itemCategory));
  const nutritionComplete = analysis.category !== "food" || Boolean(analysis.nutritionFacts && Object.keys(analysis.nutritionFacts).length);
  const checks = [
    { label: "Ingredient list", complete: ingredientsComplete },
    { label: "Product name", complete: nameComplete },
    { label: "Barcode", complete: barcodeComplete },
    { label: "Product photo", complete: imageComplete },
    { label: "Traceable source", complete: sourceComplete },
    { label: analysis.category === "food" ? "Nutrition facts" : "Specific product type", complete: analysis.category === "food" ? nutritionComplete : specificType },
  ];
  const score = Math.round(
    (ingredientsComplete ? 35 : 0) +
    (nameComplete ? 15 : 0) +
    (barcodeComplete ? 15 : 0) +
    (imageComplete ? 15 : 0) +
    (sourceComplete ? 10 : 0) +
    ((analysis.category === "food" ? nutritionComplete : specificType) ? 10 : 0),
  );
  const level = score >= 85 ? "complete" : score >= 60 ? "good" : "limited";
  const label = score >= 85 ? "Complete" : score >= 60 ? "Good" : "Limited";
  const lastUpdated = analysis.changeLog?.[0]?.createdAt || analysis.changeLog?.[0]?.date || analysis.savedAt || analysis.createdAt || "";
  return { score, level, label, checks, lastUpdated };
}

function renderDataQualityCard(analysis) {
  const quality = getDataQualityReport(analysis);
  return `
    <details class="data-quality-card ${quality.level}">
      <summary>
        <span><strong>Data quality</strong><small>${escapeHtml(quality.label)} listing</small></span>
        <b>${quality.score}%</b>
        <i aria-hidden="true">⌄</i>
      </summary>
      <div class="quality-check-list">
        ${quality.checks.map((check) => `
          <span class="${check.complete ? "complete" : "missing"}"><i>${check.complete ? "✓" : "!"}</i>${escapeHtml(check.label)}</span>
        `).join("")}
      </div>
      <p>${quality.lastUpdated ? `Last updated ${escapeHtml(formatAdminDate(quality.lastUpdated))}. ` : ""}Data quality measures listing completeness, not product safety.</p>
    </details>
  `;
}

function confirmProductMatch() {
  if (!state.currentAnalysis) return;
  const source = state.pendingMatchSource || state.currentAnalysis.source || "confirmed_match";
  updateScanStreak(state.currentAnalysis);
  saveProductAnalysis(state.currentAnalysis);
  saveHistory(state.currentAnalysis);
  trackScan(state.currentAnalysis, source);
  state.pendingMatchSource = "";
  els.resultPanel.querySelector(".match-confirm-card")?.remove();
  renderHistory();
  toast("Saved to history.");
}

function rejectProductMatch() {
  if (!state.currentAnalysis?.barcode) return;
  const barcode = state.currentAnalysis.barcode;
  state.pendingMatchSource = "";
  saveProductAnalysis({
    ...state.currentAnalysis,
    rejectedMatchAt: new Date().toISOString(),
  });
  renderNotFound(barcode);
  toast("Marked as wrong. Add photos to fix this barcode.");
}

function formatChangeLogFields(fields) {
  const list = Array.isArray(fields) ? fields.filter(Boolean) : [];
  if (!list.length) return "Listing reviewed and updated.";
  if (list.length === 1 && list[0] === "imageUrl") return "Updated product photo.";
  return `Updated ${list.map((field) => toDisplayName(field.replace(/([A-Z])/g, " $1"))).join(", ")}.`;
}

function formatChangeLogTitle(change = {}) {
  if (change.issueType === "product_image") {
    return "Product photo updated";
  }
  if (change.issueType === "admin_edit") {
    return "Admin edit";
  }
  return toDisplayName(change.issueType || "Correction");
}

function formatChangeLogMeta(change = {}) {
  const date = formatAdminDate(change.changedAt);
  const actor = change.issueType === "admin_edit" || change.issueType === "product_image"
    ? "by Admin"
    : change.changedBy ? `by ${change.changedBy}` : "";
  return [date, actor].filter(Boolean).join(" - ");
}

function openCategoryDialog() {
  if (!state.currentAnalysis) return;
  const category = state.currentAnalysis.category === "beauty" ? "beauty" : "food";
  state.adminEditImageFile = null;
  els.editBrandName.value = state.currentAnalysis.brand || state.currentAnalysis.detected_brand || "";
  els.editProductName.value = getProductNameWithoutBrand(state.currentAnalysis);
  els.editBroadCategory.value = category;
  populateItemCategoryOptions(category, state.currentAnalysis.itemCategory);
  els.editCustomCategory.value = "";
  els.editIngredients.value = getEditableIngredientsText(state.currentAnalysis);
  els.editProductImage.value = "";
  els.editProductImageCheck.classList.add("hidden");
  els.editProductImage.closest(".photo-drop")?.classList.remove("has-file", "drag-over");
  els.editBackToAdminButton.classList.toggle("hidden", !state.adminReturnAfterEdit);
  els.categoryDialog.showModal();
}

async function backToAdminFromProductEditor() {
  state.adminEditImageFile = null;
  els.categoryDialog.close();
  await openAdminPanel();
  if (state.adminReturnAfterEdit === "repair") await loadAdminRepairQueue();
}

function handleEditProductImage() {
  const file = els.editProductImage.files?.[0] || null;
  state.adminEditImageFile = file;
  const hasFile = Boolean(file);
  els.editProductImage.closest(".photo-drop")?.classList.toggle("has-file", hasFile);
  els.editProductImageCheck.classList.toggle("hidden", !hasFile);
}

function setupDropZone(dropZone, input, onChange) {
  if (!dropZone || !input) return;
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("drag-over");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (eventName === "drop") {
        const file = [...(event.dataTransfer?.files || [])].find((item) => item.type.startsWith("image/"));
        if (file) {
          const transfer = new DataTransfer();
          transfer.items.add(file);
          input.files = transfer.files;
          onChange();
        }
      }
      dropZone.classList.remove("drag-over");
    });
  });
}

function getProductNameWithoutBrand(analysis) {
  const name = String(analysis?.name || analysis?.detected_product_name || "").trim();
  const brand = String(analysis?.brand || analysis?.detected_brand || "").trim();
  if (brand && name.toLowerCase().startsWith(`${brand.toLowerCase()}, `)) {
    return name.slice(brand.length + 2).trim();
  }
  return name;
}

function getEditableIngredientsText(analysis) {
  const savedText = String(analysis?.ingredientsText || analysis?.extracted_ingredients_text || "").trim();
  if (savedText) return savedText;
  const ingredients = Array.isArray(analysis?.ingredients) ? analysis.ingredients : [];
  return ingredients
    .map((ingredient) => ingredient.rawName || ingredient.raw_name || ingredient.normalizedName || ingredient.normalized_name || "")
    .filter(Boolean)
    .join(", ");
}

function populateItemCategoryOptions(category, selected = "") {
  const options = itemCategoryOptions[category] || itemCategoryOptions.food;
  const selectedDisplay = toDisplayName(selected);
  const allOptions = selectedDisplay && !options.includes(selectedDisplay)
    ? [selectedDisplay, ...options]
    : options;
  els.editItemCategory.innerHTML = allOptions
    .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
    .join("");
  els.editItemCategory.value = selectedDisplay && allOptions.includes(selectedDisplay) ? selectedDisplay : allOptions[0];
}

async function saveCategoryCorrection() {
  if (!state.currentAnalysis) return;
  const brand = toDisplayName(els.editBrandName.value.trim());
  const productName = toDisplayName(els.editProductName.value.trim()) || state.currentAnalysis.name || "Saved product";
  const displayName = brand && !productName.toLowerCase().startsWith(brand.toLowerCase())
    ? `${brand}, ${productName}`
    : productName;
  const category = els.editBroadCategory.value === "beauty" ? "beauty" : "food";
  const customCategory = toDisplayName(els.editCustomCategory.value.trim());
  const itemCategory = customCategory || toDisplayName(els.editItemCategory.value) || (category === "beauty" ? "Beauty / Hair" : "Food / Drink");
  const ingredientsText = els.editIngredients.value.trim();
  const originalProductName = getProductNameWithoutBrand(state.currentAnalysis);
  const originalBrand = toDisplayName(state.currentAnalysis.brand || state.currentAnalysis.detected_brand || "");
  const originalCategory = state.currentAnalysis.category === "beauty" ? "beauty" : "food";
  const originalItemCategory = toDisplayName(state.currentAnalysis.itemCategory || state.currentAnalysis.item_category || (originalCategory === "beauty" ? "Beauty / Hair" : "Food / Drink"));
  const originalIngredientsText = getEditableIngredientsText(state.currentAnalysis);
  const imageOnlyAdminEdit = Boolean(state.isAdmin && state.adminEditImageFile)
    && toDisplayName(productName) === toDisplayName(originalProductName)
    && brand === originalBrand
    && category === originalCategory
    && itemCategory === originalItemCategory
    && normalizeComparableText(ingredientsText) === normalizeComparableText(originalIngredientsText);
  let editedImageUrl = state.currentAnalysis.imageUrl || "";
  if (state.adminEditImageFile) {
    try {
      editedImageUrl = await fileToCompressedDataUrl(state.adminEditImageFile, { maxSide: 720, quality: 0.68 });
    } catch {
      toast("Could not read that product image.");
      return;
    }
  }
  const ingredients = ingredientsText
    ? splitIngredients(ingredientsText).map((ingredient) => classifyIngredient(ingredient, category))
    : (Array.isArray(state.currentAnalysis.ingredients) ? state.currentAnalysis.ingredients : []);
  const score = imageOnlyAdminEdit
    ? Number(state.currentAnalysis.safetyScore ?? state.currentAnalysis.safety_score ?? calculateScore(ingredients, state.currentAnalysis, category))
    : calculateScore(ingredients, state.currentAnalysis, category);
  const updated = normalizeRenderableAnalysis({
    ...state.currentAnalysis,
    name: displayName,
    detected_product_name: productName,
    brand,
    detected_brand: brand,
    category,
    product_category: category,
    itemCategory,
    item_category: itemCategory,
    imageUrl: editedImageUrl,
    ingredientsText,
    extracted_ingredients_text: ingredientsText,
    ingredients,
    safetyScore: score,
    safety_score: score,
    scoreColor: scoreColor(score),
    score_color: scoreColor(score),
    summary: imageOnlyAdminEdit ? state.currentAnalysis.summary : buildSummary(score, ingredients, category),
    source: state.currentAnalysis.source?.includes("Saved database")
      ? state.currentAnalysis.source
      : "Local product edit",
    correctedAt: new Date().toISOString(),
  });
  state.selectedProductType = category;
  state.currentAnalysis = updated;
  saveProductAnalysis(updated);
  saveHistory(updated);
  els.categoryDialog.close();
  const adminReturnTarget = state.adminReturnAfterEdit;
  if (state.isAdmin) {
    if (state.adminEditImageFile) {
      const uploadedImageUrl = await uploadSharedProductImage(updated);
      if (uploadedImageUrl) {
        updated.imageUrl = uploadedImageUrl;
        state.currentAnalysis = updated;
        saveProductAnalysis(updated);
        saveHistory(updated);
      }
    }
    state.adminEditImageFile = null;
    const saved = imageOnlyAdminEdit ? true : await saveSharedProductAnalysis(updated);
    toast(saved ? "Product updated in database." : "Product saved on this device only.");
    if (adminReturnTarget) {
      state.adminReturnAfterEdit = "";
      state.adminPreviewOpen = false;
      await openAdminPanel();
      if (adminReturnTarget === "repair") await loadAdminRepairQueue();
      return;
    }
    renderResult(updated, {
      allowImageUpload: Boolean(updated.barcode && !updated.imageUrl),
      skipHistoryRender: true,
    });
  } else {
    renderResult(updated, {
      allowImageUpload: Boolean(updated.barcode && !updated.imageUrl),
      skipHistoryRender: true,
    });
    toast("Product saved on this device.");
    verifyCategoryCorrection(updated);
  }
}

async function verifyCategoryCorrection(analysis) {
  if (!hasAuthenticatedSession() || !analysis?.barcode) {
    toast("Sign in to let AI verify this for the shared database.");
    return;
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/verify-category-correction`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        barcode: analysis.barcode,
        category: analysis.category,
        itemCategory: analysis.itemCategory,
        analysis,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast(data.error || "AI could not verify this category.");
      return;
    }
    if (data.saved_to_database) {
      const saved = {
        ...analysis,
        source: "Saved AI-verified category correction",
        savedToDatabase: true,
        savedAt: new Date().toISOString(),
      };
      state.currentAnalysis = saved;
      saveProductAnalysis(saved);
      saveHistory(saved);
      renderResult(saved, {
        allowImageUpload: Boolean(saved.barcode && !saved.imageUrl),
        skipHistoryRender: true,
      });
      toast("AI verified it and saved it to the database.");
    } else {
      toast(data.reason || "AI could not verify this for the shared database.");
    }
  } catch {
    toast("AI verification is unavailable right now.");
  }
}

function getResultEyebrow(analysis) {
  const source = String(analysis.source || "").toLowerCase();
  const label = getSpecificProductLabel(analysis);
  if (source.includes("admin")) return `${label} - Admin`;
  if (source.includes("saved")) return `${label} · saved database`;
  if (source.includes("gpt") || source.includes("ai") || source.includes("ingredient label entry")) return `${label} · AI analyzed`;
  return label;
}

function getTrustLabel(analysis) {
  const source = String(analysis.source || "").toLowerCase();
  if (source.includes("admin")) return "Admin";
  if (source.includes("saved")) return "Saved Database";
  if (source.includes("gpt") || source.includes("ai") || source.includes("ingredient label entry")) return "AI Analyzed";
  if (source.includes("open food facts")) return "Open Food Facts";
  if (source.includes("open beauty facts")) return "Open Beauty Facts";
  if (source.includes("local")) return "Saved On Device";
  return "Ingredient Screening";
}

function getConfidenceLabel(analysis) {
  const hasBarcode = Boolean(analysis.barcode && analysis.barcode !== "photo-only");
  const hasImage = Boolean(analysis.imageUrl);
  const hasIngredients = Array.isArray(analysis.ingredients) && analysis.ingredients.length > 0;
  const guessedName = /photo analyzed product|product \d+|beauty product \d+|food product \d+/i.test(analysis.name || "");
  if (hasBarcode && hasImage && hasIngredients && !guessedName) return { label: "High confidence", level: "high" };
  if (hasIngredients && !guessedName) return { label: "Medium confidence", level: "medium" };
  return { label: "Needs review", level: "review" };
}

function comparableStorageKey() {
  return "greenscan.lastComparableProduct";
}

function getComparableProduct(analysis) {
  try {
    const previous = normalizeRenderableAnalysis(JSON.parse(localStorage.getItem(comparableStorageKey()) || "null"));
    if (!previous?.barcode || previous.barcode === analysis.barcode) return null;
    const sameCategory = previous.category === analysis.category;
    const previousType = normalizeComparableItemType(previous);
    const currentType = normalizeComparableItemType(analysis);
    const sameItem = previousType && currentType && previousType === currentType;
    return sameCategory && sameItem ? previous : null;
  } catch {
    return null;
  }
}

function rememberComparableProduct(analysis) {
  if (!analysis?.barcode || analysis.barcode === "photo-only") return;
  try {
    localStorage.setItem(comparableStorageKey(), JSON.stringify({
      barcode: analysis.barcode,
      name: analysis.name,
      brand: analysis.brand,
      category: analysis.category,
      itemCategory: analysis.itemCategory,
      safetyScore: analysis.safetyScore,
      scoreColor: analysis.scoreColor,
      ingredients: analysis.ingredients,
      ingredientsText: analysis.ingredientsText,
      imageUrl: analysis.imageUrl,
      source: analysis.source,
    }));
  } catch {
    // Comparison is optional.
  }
}

function normalizeCompareKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeComparableItemType(analysis) {
  const key = normalizeCompareKey(analysis.itemCategory || analysis.item_category || "");
  if (!key || ["food", "food drink", "drink", "beauty", "beauty hair", "product", "unknown"].includes(key)) return "";
  return key;
}

function renderComparisonCard(current, previous) {
  const currentConcerns = current.ingredients.filter((item) => normalizeRisk(item.risk) !== "low").length;
  const previousConcerns = previous.ingredients.filter((item) => normalizeRisk(item.risk) !== "low").length;
  const winner = current.safetyScore >= previous.safetyScore ? current : previous;
  const comparisonCategory = getComparisonCategoryLabel(current, previous);
  const reason = current.safetyScore === previous.safetyScore
    ? "Scores are tied, so compare the potential concerns below."
    : `${winner.name} has the stronger GreenScan score for this ${comparisonCategory} comparison.`;
  return `
    <section class="compare-card">
      <p class="eyebrow">Compare</p>
      <h3>Same product type comparison</h3>
      <p>${escapeHtml(reason)}</p>
      <div class="compare-grid">
        <button type="button" class="${winner.barcode === current.barcode ? "winner" : ""}" data-compare-barcode="${escapeHtml(current.barcode)}">
          <strong>${escapeHtml(current.name)}</strong>
          <span>${Number(current.safetyScore || 0)}/100</span>
          <small>${currentConcerns} potential concern${currentConcerns === 1 ? "" : "s"}</small>
        </button>
        <button type="button" class="${winner.barcode === previous.barcode ? "winner" : ""}" data-compare-barcode="${escapeHtml(previous.barcode)}">
          <strong>${escapeHtml(previous.name)}</strong>
          <span>${Number(previous.safetyScore || 0)}/100</span>
          <small>${previousConcerns} potential concern${previousConcerns === 1 ? "" : "s"}</small>
        </button>
      </div>
    </section>
  `;
}

function getComparisonCategoryLabel(current, previous) {
  const category = current.category === previous.category ? current.category : current.category || previous.category;
  const allowed = itemCategoryOptions[category] || [];
  const currentType = toDisplayName(current.itemCategory || current.item_category || "");
  const previousType = toDisplayName(previous.itemCategory || previous.item_category || "");
  const currentAllowed = allowed.find((item) => normalizeCompareKey(item) === normalizeCompareKey(currentType));
  const previousAllowed = allowed.find((item) => normalizeCompareKey(item) === normalizeCompareKey(previousType));
  if (currentAllowed && previousAllowed && normalizeCompareKey(currentAllowed) === normalizeCompareKey(previousAllowed)) {
    return currentAllowed;
  }
  if (category === "food") return "Food / Drink";
  if (category === "beauty") return "Beauty / Hair";
  return "Product";
}

function getBetterAlternatives(analysis) {
  const currentType = normalizeComparableItemType(analysis);
  if (!currentType) return [];
  const seen = new Set([analysis.barcode]);
  return getKnownLocalProducts()
    .filter((item) => {
      const normalized = normalizeRenderableAnalysis(item);
      if (!normalized?.barcode || seen.has(normalized.barcode)) return false;
      seen.add(normalized.barcode);
      return normalized.category === analysis.category
        && normalizeComparableItemType(normalized) === currentType
        && !productMatchesPersonalAvoidList(normalized)
        && Number(normalized.safetyScore || 0) > Number(analysis.safetyScore || 0);
    })
    .map(normalizeRenderableAnalysis)
    .sort((a, b) => Number(b.safetyScore || 0) - Number(a.safetyScore || 0))
    .slice(0, 3);
}

function productMatchesPersonalAvoidList(analysis) {
  if (!state.avoidList?.length) return false;
  const normalized = normalizeRenderableAnalysis(analysis);
  const ingredients = Array.isArray(normalized.ingredients) ? normalized.ingredients : [];
  return ingredients.some((item) => {
    if (item.personalAvoid) return true;
    return Boolean(getPersonalAvoidMatch(item.rawName || item.raw_name || "", item.type || item.ingredient_type || "", item.reason || ""));
  });
}

function renderBetterAlternatives(alternatives, current) {
  return `
    <section class="better-alternatives">
      <p class="eyebrow">Better alternatives</p>
      <h3>Higher scoring ${escapeHtml(getComparisonCategoryLabel(current, current))}</h3>
      <div class="alternative-list">
        ${alternatives.map((item) => `
          <button type="button" class="alternative-card" data-alt-barcode="${escapeHtml(item.barcode)}">
            <img class="history-thumb" src="${escapeHtml(getHistoryImage(item))}" alt="${escapeHtml(item.name)}" />
            <span><strong>${escapeHtml(item.name)}</strong><small>${Number(item.safetyScore || 0)}/100</small></span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function getKnownLocalProducts() {
  const products = [];
  try {
    products.push(...Object.values(JSON.parse(localStorage.getItem(productStorageKey()) || "{}")));
  } catch {
    // Optional cache.
  }
  products.push(...getHistory());
  products.push(...getFavoriteProducts());
  const byBarcode = new Map();
  products.map(normalizeRenderableAnalysis).filter(Boolean).forEach((item) => {
    if (item.barcode && !byBarcode.has(item.barcode)) byBarcode.set(item.barcode, item);
  });
  return [...byBarcode.values()];
}

function favoriteStorageKey() {
  return `greenscan.favorites.${state.user?.id || state.user?.email || "guest"}`;
}

function getFavoriteProducts() {
  try {
    return JSON.parse(localStorage.getItem(favoriteStorageKey()) || "[]").map(normalizeRenderableAnalysis).filter(Boolean);
  } catch {
    return [];
  }
}

function isFavoriteProduct(barcode) {
  return Boolean(barcode && getFavoriteProducts().some((item) => item.barcode === barcode));
}

function productIngredientSignature(analysis) {
  return (analysis.ingredients || [])
    .map((item) => normalizeComparableText(item.rawName || item.raw_name || item.normalizedName || item.normalized_name || ""))
    .filter(Boolean)
    .sort()
    .join("|");
}

function normalizeProductImageIdentity(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  return url.startsWith("data:") ? "inline-image" : url.split("?")[0].toLowerCase();
}

function checkFavoriteProductChanges(analysis) {
  if (!analysis?.barcode || analysis.barcode === "photo-only") return;
  const favorites = getFavoriteProducts();
  const index = favorites.findIndex((item) => item.barcode === analysis.barcode);
  if (index < 0) return;
  const previous = favorites[index];
  const incomingTime = Date.parse(analysis.savedAt || analysis.createdAt || "");
  const previousTime = Date.parse(previous.savedAt || previous.createdAt || "");
  if (Number.isFinite(incomingTime) && Number.isFinite(previousTime) && incomingTime <= previousTime) return;

  const changes = [];
  if (productIngredientSignature(previous) !== productIngredientSignature(analysis)) changes.push("ingredients");
  if (Number(previous.safetyScore) !== Number(analysis.safetyScore)) changes.push(`score (${Number(previous.safetyScore || 0)} to ${Number(analysis.safetyScore || 0)})`);
  if (normalizeComparableText(previous.itemCategory || previous.category) !== normalizeComparableText(analysis.itemCategory || analysis.category)) changes.push("category");
  if (normalizeProductImageIdentity(previous.imageUrl) !== normalizeProductImageIdentity(analysis.imageUrl)) changes.push("product photo");
  if (normalizeComparableText(previous.name) !== normalizeComparableText(analysis.name)) changes.push("product name");
  if (!changes.length) return;

  const updated = compactHistoryAnalysis(analysis, { stripDataImage: shouldStripInlineImage(analysis.imageUrl, 0, localCachePolicy.keepHistoryImages) });
  favorites[index] = updated;
  try {
    localStorage.setItem(favoriteStorageKey(), JSON.stringify(favorites.slice(0, localCachePolicy.favoriteLimit)));
  } catch {
    // The alert still appears even if the favorite snapshot cannot be refreshed.
  }
  const signature = [analysis.barcode, productIngredientSignature(analysis), analysis.safetyScore, analysis.itemCategory, normalizeProductImageIdentity(analysis.imageUrl)].join(":");
  addAppNotification({
    dedupeKey: `favorite-change:${signature}`,
    title: `${analysis.name} was updated`,
    message: `Changed: ${changes.join(", ")}. Open the product to review the latest listing.`,
    barcode: analysis.barcode,
  });
}

function toggleFavoriteProduct(analysis) {
  if (!analysis?.barcode) return;
  const favorites = getFavoriteProducts();
  const exists = favorites.some((item) => item.barcode === analysis.barcode);
  const next = exists
    ? favorites.filter((item) => item.barcode !== analysis.barcode)
    : [compactHistoryAnalysis(analysis, { stripDataImage: shouldStripInlineImage(analysis.imageUrl, 0, localCachePolicy.keepHistoryImages) }), ...favorites]
      .map((item, index) => compactHistoryAnalysis(item, { stripDataImage: shouldStripInlineImage(item.imageUrl, index, localCachePolicy.keepHistoryImages) }))
      .slice(0, localCachePolicy.favoriteLimit);
  localStorage.setItem(favoriteStorageKey(), JSON.stringify(next));
  renderFavoritesPanel();
  renderHistory();
  renderResult(analysis, { allowImageUpload: Boolean(analysis.barcode && !analysis.imageUrl), skipHistoryRender: true });
  toast(exists ? "Removed from favorites." : "Added to favorites.");
}

function renderFavoritesPanel() {
  if (!els.favoritesPanel) return;
  const favorites = getFavoriteProducts();
  const swaps = getSaferSwapsReport();
  const swapsHtml = swaps.length ? `
    <div class="safer-swaps">
      <div class="section-heading compact-heading">
        <h3>Safer swaps report</h3>
      </div>
      ${swaps.map((item) => `
        <button type="button" class="alternative-card" data-swap-barcode="${escapeHtml(item.barcode)}">
          <img class="history-thumb" src="${escapeHtml(getHistoryImage(item))}" alt="${escapeHtml(item.name)}" />
          <span><strong>${escapeHtml(item.name)}</strong><small>${Number(item.safetyScore || 0)}/100${item.swapForName ? ` - replaces ${escapeHtml(item.swapForName)}` : ` - ${escapeHtml(item.itemCategory || item.category)}`}</small></span>
        </button>
      `).join("")}
    </div>
  ` : "";
  if (!favorites.length) {
    els.favoritesPanel.innerHTML = `
      <div class="section-heading compact-heading">
        <h3>Favorite products</h3>
      </div>
      <p class="ingredient-empty">Tap the heart on a product to save it here.</p>
      ${swapsHtml}
    `;
    bindSwapButtons(swaps);
    return;
  }
  els.favoritesPanel.innerHTML = `
    <div class="section-heading compact-heading">
      <h3>Favorite products</h3>
    </div>
    <div class="favorite-list">
      ${favorites.slice(0, 6).map((item) => `
        <button type="button" class="search-result-item favorite-item" data-favorite-barcode="${escapeHtml(item.barcode)}">
          <img class="history-thumb" src="${escapeHtml(getHistoryImage(item))}" alt="${escapeHtml(item.name)}" />
          <div class="history-copy">
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.itemCategory || item.category)}</p>
            <p><span class="dot ${escapeHtml(item.scoreColor)}"></span>${escapeHtml(scoreLabel(item.scoreColor, item.safetyScore))}</p>
          </div>
        </button>
      `).join("")}
    </div>
    ${swapsHtml}
  `;
  els.favoritesPanel.querySelectorAll("[data-favorite-barcode]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = favorites.find((item) => item.barcode === button.dataset.favoriteBarcode);
      if (product) {
        switchView("scan");
        renderResult(product);
      }
    });
  });
  bindSwapButtons(swaps);
}

function getSaferSwapsReport() {
  const products = getKnownLocalProducts()
    .map(normalizeRenderableAnalysis)
    .filter((item) => item?.barcode && !productMatchesPersonalAvoidList(item));
  const results = [];
  const usedAlternatives = new Set();
  getHistory().map(normalizeRenderableAnalysis).filter(Boolean).forEach((source) => {
    const sourceType = normalizeComparableItemType(source);
    if (!sourceType) return;
    const alternative = products
      .filter((candidate) => candidate.barcode !== source.barcode
        && candidate.category === source.category
        && normalizeComparableItemType(candidate) === sourceType
        && Number(candidate.safetyScore || 0) > Number(source.safetyScore || 0))
      .sort((a, b) => Number(b.safetyScore || 0) - Number(a.safetyScore || 0))[0];
    if (!alternative || usedAlternatives.has(alternative.barcode)) return;
    usedAlternatives.add(alternative.barcode);
    results.push({
      ...alternative,
      swapForName: source.name,
      scoreImprovement: Number(alternative.safetyScore || 0) - Number(source.safetyScore || 0),
    });
  });
  return results
    .sort((a, b) => Number(b.scoreImprovement || 0) - Number(a.scoreImprovement || 0))
    .slice(0, 4);
}

function bindSwapButtons(swaps, container = els.favoritesPanel) {
  if (!container) return;
  container.querySelectorAll("[data-swap-barcode]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = swaps.find((item) => item.barcode === button.dataset.swapBarcode);
      if (product) {
        switchView("scan");
        renderResult(product);
      }
    });
  });
}

function scanActivityKey() {
  return `greenscan.scanActivity.${state.user?.id || state.user?.email || "guest"}`;
}

function updateScanStreak(analysis) {
  if (!analysis?.barcode || analysis.barcode === "photo-only") return;
  try {
    const today = todayLocalKey();
    const data = JSON.parse(localStorage.getItem(scanActivityKey()) || "{}");
    const lastAt = Number(data.lastAt || 0);
    if (data.lastBarcode === analysis.barcode && Date.now() - lastAt < 30000) {
      renderScanStreakPanel();
      return;
    }
    data.days = Array.from(new Set([...(data.days || []), today])).slice(-30);
    data.scans = Number(data.scans || 0) + 1;
    data.lastBarcode = analysis.barcode;
    data.lastAt = Date.now();
    localStorage.setItem(scanActivityKey(), JSON.stringify(data));
    renderScanStreakPanel();
  } catch {
    renderScanStreakPanel();
  }
}

function renderScanStreakPanel() {
  if (!els.scanStreakPanel) return;
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(scanActivityKey()) || "{}");
  } catch {
    data = {};
  }
  const days = Array.isArray(data.days) ? data.days : [];
  const streak = calculateScanStreak(days);
  const tip = getScanTip();
  els.scanStreakPanel.innerHTML = `
    <article>
      <p class="eyebrow">Scan streak</p>
      <strong>${streak} day${streak === 1 ? "" : "s"}</strong>
      <span>${Number(data.scans || 0)} total scans on this device</span>
    </article>
    <article>
      <p class="eyebrow">Scan tip</p>
      <strong>${escapeHtml(tip.title)}</strong>
      <span>${escapeHtml(tip.body)}</span>
    </article>
  `;
}

function calculateScanStreak(days) {
  const set = new Set(days);
  let streak = 0;
  const date = new Date();
  while (set.has(date.toLocaleDateString("en-CA"))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function getScanTip() {
  const tips = [
    { title: "Hold steady", body: "Keep the barcode flat inside the frame for one second." },
    { title: "Use light", body: "Turn on the flashlight if the label is glossy or dark." },
    { title: "Move slowly", body: "Slide closer or farther until the bars look sharp." },
    { title: "Avoid angles", body: "Straight-on scans work better than tilted packages." },
  ];
  return tips[new Date().getMinutes() % tips.length];
}

function runIngredientDictionarySearch(query = els.productSearchInput.value.trim()) {
  if (query.length < 2) {
    els.productSearchResults.innerHTML = `<p class="ingredient-empty">Type an ingredient name first.</p>`;
    return;
  }
  // Dictionary results require an exact verified ingredient or approved alias.
  const results = ["food", "beauty"]
    .map((category) => findKnownIngredient(query, category, true))
    .filter(Boolean)
    .map(({ hit, cleanName, normalized, alias }) => ({
      rawName: toDisplayName(cleanName), normalizedName: normalized, type: hit.type, risk: hit.risk,
      riskScore: hit.risk === "high" ? 85 : hit.risk === "moderate" ? 55 : 12,
      reason: hit.reason, aliasLabel: alias?.canonical || "",
    }))
    .filter((item, index, list) => list.findIndex((other) => `${other.type}-${other.risk}-${other.reason}` === `${item.type}-${item.risk}-${item.reason}`) === index);
  if (!results.length) {
    els.productSearchResults.innerHTML = `<p class="ingredient-empty">No verified ingredient found for "${escapeHtml(query)}". Check the spelling or choose a suggestion; unknown text is never rated as safe.</p>`;
    return;
  }
  els.productSearchResults.innerHTML = results.map((ingredient) => `
    <article class="dictionary-card">
      <div><p class="eyebrow">${escapeHtml(toDisplayName(ingredient.type.replaceAll("_", " ")))}</p><h3>${escapeHtml(ingredient.rawName)}</h3></div>
      <span class="risk ${escapeHtml(normalizeRisk(ingredient.risk))}">Potential ${escapeHtml(normalizeRisk(ingredient.risk))} risk ${Number(ingredient.riskScore || 0)}/100</span>
      <p>${escapeHtml(normalizeRisk(ingredient.risk) === "low" ? ingredient.reason : buildRiskIngredientSummary(ingredient))}</p>
      ${riskChipsToHtml(getIngredientRiskChips(ingredient).slice(0, 4))}
    </article>
  `).join("");
}

function riskChipsToHtml(chips) {
  if (!chips.length) return "";
  return `<div class="ingredient-risk-chips">${chips.map((chip) => `
    <span class="risk-chip ${escapeHtml(chip.tone || "default")}">
      <span class="risk-icon">${escapeHtml(chip.icon || "!")}</span>
      <span>${escapeHtml(chip.label)}</span>
    </span>
  `).join("")}</div>`;
}

async function shareGreenScan() {
  const shareUrl = "https://greenscan.us";
  const text = "GreenScan is free. Scan food, drinks, and beauty products: https://greenscan.us";
  try {
    if (navigator.share) {
      await navigator.share({ title: "GreenScan", text, url: shareUrl });
      return;
    }
    await copyTextToClipboard(shareUrl);
    toast("GreenScan link copied.");
  } catch {
    toast("Could not share GreenScan.");
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

async function shareResult(analysis) {
  const concerns = analysis.ingredients.filter((item) => normalizeRisk(item.risk) !== "low").slice(0, 3).map((item) => item.rawName);
  const shareUrl = buildProductShareUrl(analysis);
  const text = [
    `${analysis.name}: ${analysis.safetyScore}/100 on GreenScan`,
    concerns.length ? `Top potential concerns: ${concerns.join(", ")}` : "No major potential concerns found.",
    shareUrl,
  ].join("\n");
  try {
    const cardFile = await buildShareCardFile(analysis, concerns);
    if (navigator.share && cardFile && navigator.canShare?.({ files: [cardFile] })) {
      await navigator.share({ title: "GreenScan result", text, url: shareUrl, files: [cardFile] });
    } else if (navigator.share) {
      await navigator.share({ title: "GreenScan result", text, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(text);
      toast("Result copied.");
    }
  } catch {
    toast("Could not share this result.");
  }
}

async function buildShareCardFile(analysis, concerns) {
  if (!window.File || !HTMLCanvasElement.prototype.toBlob) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#f0faf5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0b2b20";
  roundRect(ctx, 60, 60, 780, 1080, 34);
  ctx.fill();
  ctx.fillStyle = "#f7fffb";
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillText("GreenScan", 96, 135);
  ctx.font = "800 58px system-ui, sans-serif";
  wrapCanvasText(ctx, analysis.name || "Product", 96, 230, 680, 68, 3);
  const score = Number(analysis.safetyScore || 0);
  ctx.fillStyle = score >= 75 ? "#08a85a" : score >= 50 ? "#c78a04" : "#c9352a";
  ctx.beginPath();
  ctx.arc(720, 155, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 42px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(score), 720, 168);
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.fillText("/100", 720, 196);
  ctx.textAlign = "left";
  ctx.fillStyle = "#c7d8d0";
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillText(`${analysis.brand || toDisplayName(analysis.itemCategory || "") || "Ingredient safety"}`, 96, 430);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillText("Top result", 96, 520);
  ctx.fillStyle = "#c7d8d0";
  ctx.font = "500 28px system-ui, sans-serif";
  wrapCanvasText(ctx, analysis.summary || "Ingredient screening result.", 96, 570, 690, 40, 5);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 32px system-ui, sans-serif";
  ctx.fillText("Potential concerns", 96, 820);
  ctx.fillStyle = "#d7e5df";
  ctx.font = "500 28px system-ui, sans-serif";
  const concernList = concerns.length ? concerns : ["No major potential concerns found"];
  concernList.slice(0, 3).forEach((item, index) => {
    ctx.fillText(`- ${item}`, 110, 875 + index * 48);
  });
  ctx.fillStyle = "#7fe3c8";
  ctx.font = "700 26px system-ui, sans-serif";
  ctx.fillText("Created by GreenScan Team 2026", 96, 1080);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.9));
  return blob ? new File([blob], "greenscan-result.png", { type: "image/png" }) : null;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = String(text || "").split(/\s+/);
  let line = "";
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      lines += 1;
      line = word;
      if (lines >= maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lines < maxLines) ctx.fillText(line, x, y);
}

function buildProductShareUrl(analysis) {
  const barcode = normalizeBarcode(analysis.barcode || "");
  if (!barcode) return "https://greenscan.us/";
  return `https://greenscan.us/?product=${encodeURIComponent(barcode)}`;
}

async function loadSharedProductFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const pathMatch = window.location.pathname.match(/^\/product\/(\d{6,14})\/?$/);
  const barcode = normalizeBarcode(pathMatch?.[1] || params.get("product") || params.get("barcode") || "");
  if (window.location.pathname === "/privacy") {
    openSources();
    return;
  }
  if (window.location.pathname === "/status") {
    document.querySelector("#statusPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (!barcode) return;
  document.body.classList.add("public-product-page");
  els.barcodeInput.value = barcode;
  setLoading("Opening shared GreenScan result");
  await lookupBarcode(barcode, { sharedView: true });
}

async function loadPublicHomePanels() {
  await Promise.allSettled([
    loadTrendingProducts(),
    loadRecentlyVerifiedProducts(),
    loadPublicStatus(),
  ]);
}

async function loadTrendingProducts() {
  renderMiniProducts(els.trendingList, [], "No trending scans yet.");
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/public/trending`);
    if (!response.ok) return;
    const data = await response.json();
    renderMiniProducts(els.trendingList, data.products || [], "No trending scans yet.", "scanCount");
  } catch {
    renderMiniProducts(els.trendingList, [], "Trending scans are unavailable.");
  }
}

async function loadRecentlyVerifiedProducts() {
  renderMiniProducts(els.verifiedList, [], "No verified products yet.");
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/public/recently-verified`);
    if (!response.ok) return;
    const data = await response.json();
    renderMiniProducts(els.verifiedList, data.products || [], "No verified products yet.", "verified");
  } catch {
    renderMiniProducts(els.verifiedList, [], "Verified products are unavailable.");
  }
}

async function loadPublicStatus() {
  if (!els.statusList && !els.landingServiceStatus) return;
  if (els.statusList) els.statusList.innerHTML = `<p>Checking systems...</p>`;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/public/status`);
    if (!response.ok) throw new Error("Status request failed.");
    const data = await response.json();
    const systems = (Array.isArray(data.systems) ? data.systems : [])
      .filter((item) => item.name !== "Local OCR helper");
    if (els.statusList) {
      els.statusList.innerHTML = systems.map((item) => `
        <article class="status-row">
          <span class="status-pill ${item.ok ? "" : "warn"}">${item.ok ? "OK" : "Check"}</span>
          <div>
            <strong>${escapeHtml(item.name || "System")}</strong>
            <span>${escapeHtml(item.detail || "")}</span>
          </div>
        </article>
      `).join("") || `<p>Status unavailable.</p>`;
    }
    renderLandingServiceStatus(systems);
  } catch {
    if (els.statusList) els.statusList.innerHTML = `<p>Status unavailable.</p>`;
    renderLandingServiceStatus([]);
  }
}

function renderLandingServiceStatus(systems) {
  if (!els.landingServiceStatus) return;
  const allOnline = systems.length > 0 && systems.every((item) => item.ok);
  const serviceCount = systems.length;
  const title = allOnline
    ? "All GreenScan services are online"
    : serviceCount
      ? "Some GreenScan services need attention"
      : "GreenScan service status is unavailable";
  const detail = allOnline
    ? `${serviceCount} primary services online · Local OCR helper excluded`
    : "Local OCR helper excluded";
  els.landingServiceStatus.innerHTML = `
    <span class="landing-service-dot ${allOnline ? "online" : "offline"}" aria-hidden="true"></span>
    <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>
  `;
}
function renderMiniProducts(container, products, emptyText, metaType = "") {
  if (!container) return;
  if (!products.length) {
    container.innerHTML = `<p>${escapeHtml(emptyText)}</p>`;
    return;
  }
  container.innerHTML = products.map((product) => {
    const score = Number(product.safetyScore ?? product.safety_score ?? 0);
    const miniScoreColor = score ? scoreColor(score) : "unknown";
    const meta = metaType === "scanCount"
      ? `${Number(product.scanCount || 0)} recent scans`
      : `${escapeHtml(toDisplayName(product.itemCategory || product.item_category || product.category || "Product"))}`;
    return `
      <button type="button" class="mini-product-card" data-public-product="${escapeHtml(product.barcode || "")}">
        <img src="${escapeHtml(product.imageUrl || getHistoryImage(product))}" alt="${escapeHtml(product.name || product.detected_product_name || "GreenScan product")}" />
        <div>
          <strong>${escapeHtml(product.name || product.detected_product_name || "Saved product")}</strong>
          <span>${escapeHtml(product.brand || product.detected_brand || meta)}${product.brand || product.detected_brand ? ` - ${meta}` : ""}</span>
        </div>
        <span class="mini-product-score ${escapeHtml(miniScoreColor)}">${score || "?"}</span>
      </button>
    `;
  }).join("");
  container.querySelectorAll("[data-public-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const barcode = normalizeBarcode(button.dataset.publicProduct || "");
      if (barcode) lookupBarcode(barcode);
    });
  });
}

function getSpecificProductLabel(analysis) {
  const itemCategory = toDisplayName(analysis.itemCategory || analysis.item_category || "");
  const broadCategory = analysis.category === "food" ? "Food / Drink" : analysis.category === "beauty" ? "Beauty" : "Product";
  if (itemCategory && !["Beauty", "Food", "Food / Drink", "Product", "Unknown"].includes(itemCategory)) return itemCategory;
  return broadCategory;
}

function normalizeRenderableAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object") return null;
  const nutritionFacts = normalizeAiNutritionFacts(analysis.nutritionFacts || analysis.nutrition_facts || analysis.nutrition || analysis.nutriments || null);
  const ingredients = Array.isArray(analysis.ingredients) ? analysis.ingredients : [];
  const category = inferProductCategory({
    category: analysis.category || analysis.product_category || "unknown",
    name: analysis.name || analysis.detected_product_name || "",
    brand: analysis.brand || analysis.detected_brand || "",
    categories: analysis.categories || "",
    ingredientsText: analysis.ingredientsText || analysis.extracted_ingredients_text || "",
    ingredients: ingredients.map((item) => ({
      rawName: item.rawName || item.raw_name || "",
      type: item.type || item.ingredient_type || "",
    })),
  });
  const normalizedIngredients = ingredients.map((item) => {
    const rawName = normalizeIngredientTextTypos(item.rawName || item.raw_name || "Unknown ingredient");
    const dictionaryMatch = classifyIngredient(rawName, category);
    const incomingRisk = normalizeRisk(item.risk);
    const upgradedByDictionary = riskRankValue(dictionaryMatch.risk) < riskRankValue(incomingRisk);
    const personalAvoid = getPersonalAvoidMatch(rawName, item.type || item.ingredient_type || dictionaryMatch.type || "", item.reason || dictionaryMatch.reason || "");
    const sourceTags = buildIngredientSourceTags(item, dictionaryMatch, upgradedByDictionary);
    return {
      rawName,
      normalizedName: dictionaryMatch.normalizedName || normalizeIngredientTextTypos(item.normalizedName || item.normalized_name || rawName).toLowerCase(),
      type: upgradedByDictionary ? dictionaryMatch.type : item.type || item.ingredient_type || dictionaryMatch.type || "unknown",
      risk: upgradedByDictionary ? dictionaryMatch.risk : incomingRisk,
      riskScore: upgradedByDictionary
        ? dictionaryMatch.riskScore
        : Number.isFinite(Number(item.riskScore ?? item.risk_score)) ? Number(item.riskScore ?? item.risk_score) : 0,
      reason: upgradedByDictionary ? dictionaryMatch.reason : item.reason || "No reason provided.",
      aliasLabel: item.aliasLabel || item.alias_label || dictionaryMatch.aliasLabel || "",
      sourceTags,
      personalAvoid,
    };
  });
  const providedScore = Number.isFinite(Number(analysis.safetyScore ?? analysis.safety_score))
    ? Number(analysis.safetyScore ?? analysis.safety_score)
    : calculateScore(normalizedIngredients, { ...analysis, nutritionFacts }, category);
  const score = normalizedIngredients.length
    ? calculateScore(normalizedIngredients, { ...analysis, nutritionFacts }, category)
    : providedScore;
  return {
    ...analysis,
    nutritionFacts,
    ingredients: normalizedIngredients,
    safetyScore: Math.max(0, Math.min(100, Math.round(score))),
    scoreColor: scoreColor(score),
    name: analysis.name || analysis.detected_product_name || "Photo analyzed product",
    source: analysis.source || "Ingredient analysis",
    category,
    itemCategory: analysis.itemCategory || analysis.item_category || inferItemCategory(analysis, normalizedIngredients),
    summary: category === "food" ? buildSummary(score, normalizedIngredients, category) : analysis.summary || buildSummary(score, normalizedIngredients, category),
    positiveNotes: normalizePositiveNotes(analysis.positiveNotes || analysis.positive_notes || []),
  };
}

function buildIngredientSourceTags(item, dictionaryMatch, upgradedByDictionary) {
  const tags = [];
  const incomingReason = String(item.reason || "").trim();
  const dictionaryRisk = normalizeRisk(dictionaryMatch?.risk);
  if (dictionaryRisk !== "low" || upgradedByDictionary) tags.push("GreenScan vocabulary");
  if (incomingReason && incomingReason !== dictionaryMatch?.reason) tags.push("Product data / AI");
  if (String(dictionaryMatch?.reason || "").match(/\b(FDA|EU|European|banned|restricted|prohibited|warning|warned)\b/i)) tags.push("Regulatory note");
  return [...new Set(tags)].slice(0, 3);
}

function buildPositiveNotes(analysis) {
  const existing = normalizePositiveNotes(analysis.positiveNotes || analysis.positive_notes || []);
  const text = [
    analysis.category,
    analysis.name,
    analysis.brand,
    analysis.ingredientsText,
    ...analysis.ingredients.map((item) => `${item.rawName} ${item.type}`),
  ].join(" ").toLowerCase();
  const notes = [...existing];
  const hasAny = (terms) => terms.some((term) => text.includes(term));
  const add = (title, body) => {
    if (notes.some((note) => note.title.toLowerCase() === title.toLowerCase())) return;
    notes.push({ title, body });
  };

  if (analysis.category === "beauty") {
    if (hasAny(["shampoo", "conditioner", "hair", "scalp"]) && !hasAny(["sodium lauryl sulfate", "sodium laureth sulfate", "sls", "sles", "ammonium lauryl sulfate"])) {
      add("Without sulfates", "Sulfate-free hair products are usually gentler and may be less drying for sensitive scalps or textured hair.");
    }
    if (hasAny(["deodorant", "antiperspirant"]) && !hasAny(["aluminum chlorohydrate", "aluminium chlorohydrate", "aluminum zirconium", "aluminium zirconium", "aluminum salts", "aluminium salts"])) {
      add("Without aluminum salts", "Avoiding aluminum salts can be a plus for people who prefer deodorants without antiperspirant aluminum compounds.");
    }
    if (!hasAny(["paraben", "methylparaben", "propylparaben", "butylparaben"])) {
      add("Paraben-free", "No parabens were found in the ingredient list, which some shoppers prefer to avoid in personal care products.");
    }
    if (!hasAny(["methylisothiazolinone", "methylchloroisothiazolinone"])) {
      add("No strong isothiazolinone preservative detected", "These preservatives can be sensitizing for some people, especially in leave-on products.");
    }
  }

  if (analysis.category === "food") {
    const nutrition = analysis.nutriments || analysis.nutritionFacts || analysis.nutrition || {};
    const sugar = Number(nutrition.sugars_100g ?? nutrition.sugar_100g);
    const fat = Number(nutrition.fat_100g);
    const hasAddedSugar = hasAny(foodSugarTerms);
    const hasAddedFat = hasAny(foodFatTerms);
    const hasAdditives = hasAny(foodAdditiveTerms);

    if (!hasAddedSugar && (!Number.isFinite(sugar) || sugar <= 1)) {
      add("No added sugar detected", "The ingredient list does not show common added sugars, which helps the food score stay more reasonable.");
    }
    if (!hasAdditives) {
      add("No flagged additives detected", "The scan did not find common colors, preservatives, emulsifiers, or flavor additives that cautious shoppers often avoid.");
    }
    if (!hasAddedFat && (!Number.isFinite(fat) || fat <= 1)) {
      add("No added fats or oils detected", "The ingredient list does not show added oils or fats that can raise calorie density.");
    }
    if (!hasAny(["red 40", "yellow 5", "yellow 6", "blue 1", "artificial color"])) {
      add("No artificial colors detected", "The ingredient list does not show common synthetic color additives.");
    }
    if (!hasAny(["high fructose corn syrup"])) {
      add("No high fructose corn syrup detected", "This avoids a common added sweetener that can lower nutrition quality.");
    }
    if (!hasAny(["bha", "bht", "tbhq"])) {
      add("No flagged synthetic preservatives detected", "The scan did not find common preservatives that cautious shoppers often avoid.");
    }
  }

  if (!analysis.ingredients.some((item) => normalizeRisk(item.risk) === "high")) {
    add("No high-concern ingredients found", "The current scan did not detect ingredients marked as a potential high concern.");
  }

  return notes.slice(0, 4);
}

function normalizePositiveNotes(notes) {
  if (!Array.isArray(notes)) return [];
  return notes
    .map((note) => {
      if (typeof note === "string") return { title: toDisplayName(note), body: "Positive signal found from the ingredient scan." };
      return {
        title: toDisplayName(note.title || note.name || note.label || ""),
        body: note.body || note.reason || note.explanation || "",
      };
    })
    .filter((note) => note.title);
}

function renderPositiveNote(note) {
  const row = document.createElement("article");
  row.className = "positive-row";
  row.innerHTML = `
    <span class="positive-icon">✓</span>
    <div>
      <strong>${escapeHtml(note.title)}</strong>
      <p>${escapeHtml(note.body || "Positive signal found from the ingredient scan.")}</p>
    </div>
  `;
  return row;
}

function buildNutritionChecks(analysis) {
  if (analysis.category !== "food") return [];
  const nutrition = analysis.nutriments || analysis.nutritionFacts || analysis.nutrition || {};
  const text = [
    analysis.ingredientsText,
    ...analysis.ingredients.map((item) => `${item.rawName} ${item.type}`),
  ].join(" ").toLowerCase();
  const hasAny = (terms) => terms.some((term) => text.includes(term));
  const additives = analysis.ingredients.filter((item) => {
    const type = String(item.type || "").toLowerCase();
    const raw = String(item.rawName || "").toLowerCase();
    return type.includes("additive") || type.includes("preservative") || type.includes("color") || type.includes("flavor") || foodAdditiveTerms.some((term) => raw.includes(term));
  }).length;
  const sugar = numericNutrition(nutrition.sugars_100g ?? nutrition.sugar_100g);
  const fat = numericNutrition(nutrition.fat_100g);
  const saturatedFat = numericNutrition(nutrition["saturated-fat_100g"] ?? nutrition.saturatedFat_100g);
  const sodiumMg = getValidatedSodium100g(nutrition, analysis) * 1000;
  const hasNutritionData = [sugar, fat, saturatedFat, sodiumMg].some(Number.isFinite);
  if (!analysis.ingredients.length && !text.trim() && !hasNutritionData) return [];
  const checks = [];

  checks.push(makeNutritionCheck({
    key: "sugar",
    label: "Sugar",
    value: Number.isFinite(sugar) ? sugar : hasAny(foodSugarTerms) ? 18 : 0,
    unit: "g / 100g",
    max: 30,
    goodMax: 5,
    okMax: 15,
    goodText: "Low sugar",
    fairText: "Some sugar",
    poorText: "High sugar",
    detail: hasAny(foodSugarTerms)
      ? "Added sugar or syrup appears in the ingredient list."
      : "No common added sugar term was found in the ingredient list.",
  }));
  checks.push(makeNutritionCheck({
    key: "additives",
    label: "Additives",
    value: additives,
    unit: additives === 1 ? "flag" : "flags",
    max: 6,
    goodMax: 0,
    okMax: 2,
    goodText: "No flagged additives",
    fairText: "Some flagged additives",
    poorText: "Several flagged additives",
    detail: additives
      ? "These include colors, preservatives, emulsifiers, or flavor additives GreenScan flags."
      : "No common flagged additives were found from the ingredient list.",
  }));
  checks.push(makeNutritionCheck({
    key: "fat",
    label: "Fat",
    value: Number.isFinite(fat) ? fat : hasAny(foodFatTerms) ? 12 : 0,
    unit: "g / 100g",
    max: 30,
    goodMax: 3,
    okMax: 17,
    goodText: "Low fat",
    fairText: "Some fat",
    poorText: "High fat",
    detail: hasAny(foodFatTerms)
      ? "Added oils or fats appear in the ingredient list."
      : "No common added oil or fat term was found in the ingredient list.",
  }));
  if (Number.isFinite(saturatedFat)) {
    checks.push(makeNutritionCheck({
      key: "satfat",
      label: "Saturated fat",
      value: saturatedFat,
      unit: "g / 100g",
      max: 12,
      goodMax: 1.5,
      okMax: 5,
      goodText: "Low saturated fat",
      fairText: "A bit fatty",
      poorText: "High saturated fat",
      detail: "Saturated fat is counted separately because it can affect the score more than total fat.",
    }));
  }
  if (Number.isFinite(sodiumMg) && sodiumMg > 0) {
    checks.push(makeNutritionCheck({
      key: "sodium",
      label: "Sodium",
      value: sodiumMg,
      unit: "mg / 100g",
      max: 900,
      goodMax: 120,
      okMax: 600,
      goodText: "Low sodium",
      fairText: "Some sodium",
      poorText: "High sodium",
      detail: "Sodium is estimated from Open Food Facts nutrition data when available.",
    }));
  }
  return checks.slice(0, 5);
}

function numericNutrition(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

function makeNutritionCheck({ key, label, value, unit, max, goodMax, okMax, goodText, fairText, poorText, detail }) {
  const level = value <= goodMax ? "good" : value <= okMax ? "fair" : "poor";
  const status = level === "good" ? goodText : level === "fair" ? fairText : poorText;
  return {
    key,
    label,
    value,
    unit,
    max,
    level,
    status,
    detail,
    percent: Math.max(0, Math.min(100, (value / max) * 100)),
  };
}

function renderNutritionCheck(check) {
  const details = document.createElement("details");
  details.className = `nutrition-check ${check.level}`;
  const value = Number.isFinite(check.value) ? Math.round(check.value * 10) / 10 : 0;
  details.innerHTML = `
    <summary>
      <span class="nutrition-icon">${escapeHtml(nutritionIcon(check.key))}</span>
      <span class="nutrition-copy">
        <strong>${escapeHtml(check.label)}</strong>
        <small>${escapeHtml(check.status)}</small>
      </span>
      <span class="nutrition-value">${escapeHtml(String(value))} ${escapeHtml(check.unit)}</span>
      <span class="nutrition-dot"></span>
      <span class="nutrition-chevron">⌄</span>
    </summary>
    <div class="nutrition-detail">
      <div class="nutrition-bar">
        <span class="bar-good"></span>
        <span class="bar-fair"></span>
        <span class="bar-poor"></span>
        <i style="left: ${check.percent}%"></i>
      </div>
      <p>${escapeHtml(check.detail)}</p>
    </div>
  `;
  return details;
}

function nutritionIcon(key) {
  const icons = {
    sugar: "□",
    additives: "◇",
    fat: "◒",
    satfat: "◔",
    sodium: "≋",
  };
  return icons[key] || "•";
}

function sortIngredientsByRisk(ingredients) {
  const riskRank = { high: 0, red: 0, moderate: 1, yellow: 1, unknown: 2, low: 3, green: 3 };
  return [...ingredients].sort((a, b) => {
    const rankA = riskRank[normalizeRisk(a.risk)] ?? 2;
    const rankB = riskRank[normalizeRisk(b.risk)] ?? 2;
    if (rankA !== rankB) return rankA - rankB;
    return String(a.rawName || "").localeCompare(String(b.rawName || ""));
  });
}

function renderIngredientGroups(container, ingredients) {
  container.innerHTML = "";
  const groups = buildIngredientGroups(ingredients);
  groups.forEach((group) => {
    if (!group.items.length) return;
    const section = document.createElement("section");
    section.className = "ingredient-group";
    const heading = document.createElement("h4");
    heading.textContent = group.title;
    section.appendChild(heading);
    group.items.forEach((ingredient) => section.appendChild(renderIngredient(ingredient, { compact: true })));
    container.appendChild(section);
  });
}

function buildIngredientGroups(ingredients) {
  const used = new Set();
  const take = (predicate) => {
    const list = [];
    ingredients.forEach((ingredient, index) => {
      if (used.has(index) || !predicate(ingredient)) return;
      used.add(index);
      list.push(ingredient);
    });
    return list;
  };
  const hasTypeOrName = (ingredient, terms) => {
    const text = `${ingredient.rawName || ""} ${ingredient.type || ""} ${ingredient.reason || ""}`.toLowerCase();
    return terms.some((term) => text.includes(term));
  };
  const groups = [
    { title: "Personal avoid list", items: take((item) => Boolean(item.personalAvoid)) },
    { title: "Potential concerns", items: take((item) => normalizeRisk(item.risk) !== "low") },
    { title: "Preservatives", items: take((item) => hasTypeOrName(item, ["preservative", "benzoate", "sorbate", "nitrite", "nitrate", "bht", "bha", "tbhq"])) },
    { title: "Fragrance / allergens", items: take((item) => hasTypeOrName(item, ["fragrance", "parfum", "allergen", "linalool", "limonene", "benzyl alcohol", "eugenol"])) },
    { title: "Sweeteners", items: take((item) => hasTypeOrName(item, ["sweetener", "sugar", "syrup", "fructose", "dextrose", "sucralose", "aspartame"])) },
    { title: "Oils / fats", items: take((item) => hasTypeOrName(item, ["oil", "fat", "butter", "shortening", "hydrogenated"])) },
    { title: "Low concern ingredients", items: take(() => true) },
  ];
  return groups.filter((group) => group.items.length);
}

function renderIngredient(ingredient, options = {}) {
  const template = document.querySelector("#ingredientTemplate");
  const row = template.content.firstElementChild.cloneNode(true);
  const ingredientId = `ingredient-${++state.ingredientRenderId}`;
  state.renderedIngredients.set(ingredientId, ingredient);
  row.dataset.ingredientId = ingredientId;
  row.tabIndex = 0;
  row.setAttribute("role", "button");
  if (options.compact) row.classList.add("compact");
  const riskLevel = normalizeRisk(ingredient.risk);
  if (riskLevel !== "low") row.classList.add("risk-explained");
  if (ingredient.personalAvoid) row.classList.add("personal-avoid");
  const statusIcon = row.querySelector(".ingredient-status-icon");
  statusIcon.classList.add(riskLevel);
  statusIcon.textContent = ingredient.personalAvoid ? "×" : riskLevel === "low" ? "✓" : riskLevel === "unknown" ? "?" : "!";
  row.querySelector("strong").textContent = ingredient.rawName;
  row.querySelector("p").textContent = riskLevel === "low"
    ? ingredient.reason
    : buildRiskIngredientSummary(ingredient);
  if (ingredient.aliasLabel) {
    const alias = document.createElement("small");
    alias.className = "ingredient-alias";
    alias.textContent = `Also known as ${ingredient.aliasLabel}`;
    row.querySelector("div").appendChild(alias);
  }
  if (ingredient.personalAvoid) {
    const avoid = document.createElement("span");
    avoid.className = "personal-avoid-chip";
    avoid.textContent = `Avoid: ${ingredient.personalAvoid}`;
    row.querySelector("div").appendChild(avoid);
    const reasonEl = document.createElement("small");
    reasonEl.className = "personal-avoid-reason";
    reasonEl.textContent = ingredient.reason && ingredient.reason !== "No reason provided."
      ? ingredient.reason
      : "In your personal avoid list";
    row.querySelector("div").appendChild(reasonEl);
  }
  if (riskLevel !== "low") {
    const chips = getIngredientRiskChips(ingredient).slice(0, options.compact ? 2 : 3);
    if (chips.length) {
      row.querySelector("div").appendChild(renderRiskChips(chips, "ingredient-risk-chips"));
    }
    const sourceTags = renderIngredientSourceTags(ingredient);
    if (sourceTags) row.querySelector("div").appendChild(sourceTags);
  }
  const risk = row.querySelector(".risk");
  risk.className = `risk ${riskLevel}`;
  risk.title = formatIngredientRiskBadge(ingredient);
  risk.textContent = riskLevel === "low" ? "Low" : `${Number(ingredient.riskScore || 0)}/100`;
  row.setAttribute("aria-label", `${ingredient.rawName}, ${risk.title}`);
  row.addEventListener("click", () => showIngredientDetail(ingredient));
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showIngredientDetail(ingredient);
    }
  });
  return row;
}

function renderIngredientSourceTags(ingredient) {
  const tags = Array.isArray(ingredient.sourceTags) ? ingredient.sourceTags : [];
  if (!tags.length) return null;
  const list = document.createElement("div");
  list.className = "ingredient-source-tags";
  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    list.appendChild(item);
  });
  return list;
}

function buildRiskIngredientSummary(ingredient) {
  return [buildIngredientExplanation(ingredient), buildRegulatoryIngredientNote(ingredient)]
    .filter(Boolean)
    .join(" ");
}

function getIngredientRiskChips(ingredient) {
  if (normalizeRisk(ingredient.risk) === "low") return [];
  const text = [
    ingredient.rawName,
    ingredient.name,
    ingredient.type,
    ingredient.reason,
    ingredient.regulatoryNote,
    ingredient.regulatory_note,
  ].filter(Boolean).join(" ").toLowerCase();
  const matches = [
    {
      label: "Potential allergen",
      icon: "A",
      tone: "allergen",
      terms: ["allergen", "allergy", "allergic", "sensitiz", "sensitivity", "fragrance", "linalool", "limonene", "benzyl alcohol", "ppd", "isothiazolinone"],
    },
    {
      label: "Potential endocrine concern",
      icon: "E",
      tone: "endocrine",
      terms: ["endocrine", "hormone", "thyroid", "fertility", "phthalate", "paraben", "oxybenzone", "homosalate", "bht", "bha"],
    },
    {
      label: "Pollutant",
      icon: "P",
      tone: "pollutant",
      terms: ["pollutant", "environment", "aquatic", "bioaccumulat", "reef", "silicone", "cyclotetrasiloxane", "cyclopentasiloxane", "d4", "d5", "d6", "octocrylene"],
    },
    {
      label: "Potential carcinogen",
      icon: "C",
      tone: "carcinogen",
      terms: ["carcinogen", "cancer", "genotoxic", "formaldehyde", "nitrosamine", "asbestos", "moah", "potassium bromate", "titanium dioxide"],
    },
    {
      label: "Potential irritation",
      icon: "I",
      tone: "irritation",
      terms: ["irritat", "drying", "sulfate", "sls", "sles", "alcohol denat", "sd alcohol", "ammonia", "harsh surfactant"],
    },
    {
      label: "Restricted or warned",
      icon: "R",
      tone: "restricted",
      terms: ["banned", "prohibited", "restricted", "no longer authorized", "warn", "warning", "limit", "labeling", "fda", "eu ", "european"],
    },
    {
      label: "Preservative concern",
      icon: "Pr",
      tone: "preservative",
      terms: ["preservative", "nitrite", "nitrate", "benzoate", "sorbate", "tbhq", "bht", "bha", "isothiazolinone", "phenoxyethanol"],
    },
    {
      label: "Artificial additive",
      icon: "+",
      tone: "additive",
      terms: ["artificial", "additive", "color", "colour", "dye", "red ", "yellow ", "blue ", "e-number", "e171"],
    },
    {
      label: "Added sugar",
      icon: "S",
      tone: "sugar",
      terms: ["sugar", "syrup", "fructose", "dextrose", "glucose", "sweetener", "maltodextrin"],
    },
    {
      label: "Added fat",
      icon: "F",
      tone: "fat",
      terms: ["hydrogenated", "palm oil", "shortening", "saturated fat", "trans fat", "oil blend"],
    },
    {
      label: "Sodium or nitrite concern",
      icon: "Na",
      tone: "sodium",
      terms: ["sodium", "salt", "nitrite", "nitrate", "msg", "monosodium"],
    },
    {
      label: "Impurity concern",
      icon: "M",
      tone: "impurity",
      terms: ["petrolatum", "petroleum", "mineral oil", "talc", "impurity", "contaminant", "mosh", "moah"],
    },
  ];
  const chips = matches
    .filter((chip) => chip.terms.some((term) => text.includes(term)))
    .map(({ label, icon, tone }) => ({ label, icon, tone }));
  if (!chips.length) {
    const risk = normalizeRisk(ingredient.risk);
    chips.push({
      label: risk === "high" ? "Potential high concern" : "Potential concern",
      icon: "!",
      tone: risk,
    });
  }
  return chips;
}

function renderRiskChips(chips, className = "risk-chip-list") {
  const list = document.createElement("div");
  list.className = className;
  chips.forEach((chip) => {
    const item = document.createElement("span");
    item.className = `risk-chip ${chip.tone || "default"}`;
    const icon = document.createElement("span");
    icon.className = "risk-icon";
    icon.textContent = chip.icon || "!";
    const label = document.createElement("span");
    label.textContent = chip.label;
    item.append(icon, label);
    list.appendChild(item);
  });
  return list;
}

function formatIngredientRiskBadge(ingredient) {
  const risk = normalizeRisk(ingredient.risk);
  if (risk === "low") return "low concern";
  const score = Number(ingredient.riskScore ?? ingredient.risk_score);
  const label = "potential risk";
  if (Number.isFinite(score) && score > 0) return `${label} ${Math.round(score)}/100`;
  return risk === "unknown" ? "potential concern" : label;
}

function normalizeRisk(value) {
  const risk = String(value || "unknown").toLowerCase();
  if (risk === "red") return "high";
  if (risk === "yellow") return "moderate";
  if (risk === "green") return "low";
  if (["low", "moderate", "high", "unknown"].includes(risk)) return risk;
  return "unknown";
}

function riskDotColor(value) {
  const risk = normalizeRisk(value);
  if (risk === "high") return "red";
  if (risk === "moderate" || risk === "unknown") return "yellow";
  return "green";
}

function riskRankValue(value) {
  return { high: 0, moderate: 1, unknown: 2, low: 3 }[normalizeRisk(value)] ?? 2;
}

function showIngredientDetail(ingredient) {
  const risk = normalizeRisk(ingredient.risk);
  state.activeIngredient = ingredient;
  els.ingredientRiskLabel.textContent = risk === "low" ? "Low concern" : `Potential ${risk} risk`;
  els.ingredientDetailTitle.textContent = ingredient.rawName;
  els.ingredientDetailReason.textContent = [buildIngredientExplanation(ingredient), buildRegulatoryIngredientNote(ingredient)].filter(Boolean).join(" ");
  els.ingredientDetailAlias.textContent = ingredient.aliasLabel ? `Also known as ${ingredient.aliasLabel}` : "";
  els.ingredientDetailAlias.classList.toggle("hidden", !ingredient.aliasLabel);
  els.ingredientSpeakButton.classList.toggle("hidden", !("speechSynthesis" in window && "SpeechSynthesisUtterance" in window));
  const riskChips = getIngredientRiskChips(ingredient).slice(0, 6);
  els.ingredientRiskList.innerHTML = "";
  if (riskChips.length) {
    els.ingredientRiskList.appendChild(renderRiskChips(riskChips, "associated-risk-grid-inner"));
  }
  els.ingredientRiskSection.classList.toggle("hidden", !riskChips.length);
  els.ingredientDetailType.textContent = `Type: ${toDisplayName(String(ingredient.type || "unknown").replaceAll("_", " "))}`;
  els.ingredientDetailScore.textContent = `Risk score: ${ingredient.riskScore ?? "unknown"}`;
  try {
    if (!els.ingredientDialog.open) {
      els.ingredientDialog.showModal();
    }
  } catch {
    els.ingredientDialog.setAttribute("open", "");
    els.ingredientDialog.classList.add("dialog-fallback-open");
  }
}

function speakActiveIngredient() {
  const ingredient = state.activeIngredient;
  if (!ingredient || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(ingredient.aliasLabel ? `${ingredient.rawName}, also known as ${ingredient.aliasLabel}` : ingredient.rawName);
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

function buildRegulatoryIngredientNote(ingredient) {
  const text = `${ingredient.reason || ""} ${ingredient.rawName || ""}`.toLowerCase();
  const notes = [];
  if (text.includes("fda") || text.includes("us ")) {
    if (text.includes("prohibit") || text.includes("repeal") || text.includes("no longer") || text.includes("restrict") || text.includes("warn")) {
      notes.push("US regulatory note: this ingredient is banned, limited, no longer authorized, or specifically warned about in the source vocabulary.");
    }
  }
  if (text.includes("eu ") || text.includes("european")) {
    if (text.includes("banned") || text.includes("prohibited") || text.includes("restricted") || text.includes("limits") || text.includes("labeling")) {
      notes.push("EU regulatory note: this ingredient is banned, limited, restricted, or requires special labeling in the source vocabulary.");
    }
  }
  return notes.join(" ");
}

function buildIngredientExplanation(ingredient) {
  const risk = normalizeRisk(ingredient.risk);
  const baseReason = ingredient.reason || "No specific explanation was provided.";
  if (risk === "high") {
    return `${baseReason} This is marked as a potential high risk because it is commonly associated with stronger safety, sensitivity, irritation, or consumer-avoidance concerns for this product type.`;
  }
  if (risk === "moderate") {
    return `${baseReason} This is marked as a potential moderate risk because some people may avoid it due to sensitivity, irritation, additive, or quality concerns, but it is not automatically unsafe for everyone.`;
  }
  if (risk === "low") {
    return `${baseReason} This is marked low concern because no major issue was detected from the current ingredient screening.`;
  }
  return `${baseReason} This is marked as a potential concern because the app could not confidently classify the ingredient or its concern level.`;
}

function setLoading(message) {
  els.resultPanel.innerHTML = `
    <button type="button" class="result-sheet-handle" id="resultSheetHandle" aria-expanded="false">
      <span aria-hidden="true"></span>
      <small>Checking product databases</small>
    </button>
    <div class="result-skeleton" aria-label="${escapeHtml(message)}">
      <span class="skeleton-image"></span>
      <div><span></span><span></span><span></span></div>
    </div>
  `;
  els.resultPanel.classList.add("loading-result");
  prepareResultSheet();
  scrollToResultPanel();
}

function renderNotFound(barcode) {
  clearResultSheet();
  els.resultPanel.classList.remove("loading-result");
  setFallbackHeading("Product not found", "Add full label photo");
  const offline = !navigator.onLine;
  els.resultPanel.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">${offline ? "Offline mode" : "No database match"}</p>
      <h2>${offline ? "Only saved GreenScan products are available offline." : `Barcode ${escapeHtml(barcode)} was not found.`}</h2>
      <p>${offline ? "If this product is not already saved on this device, add label photos or pasted ingredients and GreenScan will queue it for analysis when internet returns." : "Choose whether this is food / drink or beauty before adding product photos."}</p>
    </div>
  `;
  els.fallbackPanel.classList.remove("hidden");
  resetProductTypeChoice();
  scrollToProductTypePanel();
  toast(offline ? "Offline. Known saved products still work." : "No open database match. Choose product type.");
}

function needsIngredientFill(analysis) {
  const safeAnalysis = normalizeRenderableAnalysis(analysis);
  return Boolean(safeAnalysis.barcode && safeAnalysis.barcode !== "photo-only" && !safeAnalysis.ingredients.length && !String(safeAnalysis.ingredientsText || "").trim());
}

function promptIngredientFill(analysis) {
  const safeAnalysis = normalizeRenderableAnalysis(analysis);
  state.currentAnalysis = safeAnalysis;
  state.currentBarcode = safeAnalysis.barcode;
  resetNutritionFactsChoice();
  state.selectedProductType = safeAnalysis.category === "beauty" ? "beauty" : "food";
  updateBackLabelInstructions();
  const isFood = state.selectedProductType === "food";
  setFallbackHeading("Label needed", isFood ? "Add missing ingredients and nutrition" : "Add missing ingredients");
  els.fallbackPanel.classList.remove("hidden");
  els.unsupportedProduct.classList.add("hidden");
  els.photoUploadPanel.classList.remove("hidden");
  els.productTypeButtons.forEach((button) => {
    const selected = button.dataset.productType === state.selectedProductType;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  els.resultPanel.insertAdjacentHTML(
    "beforeend",
    `<div class="ingredient-fill-note">
      <p class="eyebrow">Back label needed</p>
      <p>${escapeHtml(isFood
        ? "This product is in the database, but its label data is incomplete. Add a full back-label photo that includes ingredients and Nutrition Facts, or paste both to fill and save it."
        : "This product is in the database, but its ingredient list is incomplete. Add a back-label photo with ingredients, or paste the ingredients to fill and save it.")}</p>
    </div>`,
  );
  scrollToProductTypePanel();
}

function setFallbackHeading(eyebrow, title) {
  els.fallbackEyebrow.textContent = eyebrow;
  els.fallbackTitle.textContent = title;
}

function chooseProductType(type) {
  if (state.selectedProductType !== type) resetNutritionFactsChoice();
  state.selectedProductType = type;
  updateBackLabelInstructions();
  els.productTypeButtons.forEach((button) => {
    const selected = button.dataset.productType === type;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  if (type === "other") {
    els.unsupportedProduct.classList.remove("hidden");
    els.photoUploadPanel.classList.add("hidden");
    resetUploadState();
    els.resultPanel.innerHTML = `
      <div class="empty-state">
        <p class="eyebrow">Unsupported product</p>
        <h2>GreenScan does not rate this product type.</h2>
        <p>GreenScan only rates food / drink and beauty products from ingredients.</p>
      </div>
    `;
    return;
  }

  els.unsupportedProduct.classList.add("hidden");
  els.photoUploadPanel.classList.remove("hidden");
  toast(type === "food" ? "Food / drink selected." : "Beauty / hair selected.");
}

function resetProductTypeChoice() {
  state.selectedProductType = "";
  resetNutritionFactsChoice();
  els.unsupportedProduct.classList.add("hidden");
  els.photoUploadPanel.classList.add("hidden");
  els.nutritionFactsPanel?.classList.add("hidden");
  els.productTypeButtons.forEach((button) => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });
}

function handleFrontPhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  state.currentFrontPhoto = file;
  els.frontPhotoPreview.src = URL.createObjectURL(file);
  els.frontPhotoPreview.classList.remove("hidden");
  els.frontPhotoCheck.classList.remove("hidden");
  els.frontPhoto.closest(".photo-drop").classList.add("has-file");
  updateAnalyzeButton();
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  state.currentPhoto = file;
  els.photoPreview.src = URL.createObjectURL(file);
  els.photoPreview.classList.remove("hidden");
  els.backPhotoCheck.classList.remove("hidden");
  els.ingredientPhoto.closest(".photo-drop").classList.add("has-file");
  updateAnalyzeButton();
  if (state.selectedProductType !== "food" || state.labelHasNutritionFacts) {
    window.setTimeout(() => analyzeCurrentPhoto(), 250);
  } else {
    toast("Choose whether Nutrition Facts are included, then tap Analyze label.");
  }
}

function updateAnalyzeButton() {
  const hasLabelInput = Boolean(state.currentPhoto || els.manualIngredients.value.trim());
  const needsNutritionAnswer = state.selectedProductType === "food" && !state.labelHasNutritionFacts;
  els.analyzePhotoButton.disabled = !hasLabelInput || needsNutritionAnswer;
}

function resetUploadState() {
  els.frontPhoto.value = "";
  els.ingredientPhoto.value = "";
  els.frontPhotoPreview.removeAttribute("src");
  els.photoPreview.removeAttribute("src");
  els.frontPhotoPreview.classList.add("hidden");
  els.photoPreview.classList.add("hidden");
  els.frontPhotoCheck.classList.add("hidden");
  els.backPhotoCheck.classList.add("hidden");
  els.frontPhoto.closest(".photo-drop").classList.remove("has-file");
  els.ingredientPhoto.closest(".photo-drop").classList.remove("has-file");
  resetNutritionFactsChoice();
  updateAnalyzeButton();
}

function chooseNutritionFactsAnswer(answer) {
  state.labelHasNutritionFacts = answer === "yes" ? "yes" : "no";
  els.nutritionFactsButtons.forEach((button) => {
    const selected = button.dataset.nutritionFacts === state.labelHasNutritionFacts;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateAnalyzeButton();
}

function resetNutritionFactsChoice() {
  state.labelHasNutritionFacts = "";
  els.nutritionFactsButtons.forEach((button) => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });
}

function updateBackLabelInstructions() {
  const isFood = state.selectedProductType === "food";
  if (els.backPhotoInstruction) {
    els.backPhotoInstruction.textContent = isFood
      ? "Take full back label with ingredients and Nutrition Facts"
      : "Take ingredients or Drug Facts Active/Inactive section";
  }
  if (els.manualIngredientsLabel) {
    els.manualIngredientsLabel.textContent = isFood ? "Ingredients and Nutrition Facts" : "Ingredients only";
  }
  if (els.manualIngredients) {
    els.manualIngredients.placeholder = isFood
      ? "Optional: type or paste ingredients and Nutrition Facts if the photo cannot be read yet"
      : "Optional: type or paste only Active ingredient and Inactive ingredients";
  }
  if (els.photoPreview) {
    els.photoPreview.alt = isFood ? "Back label preview with ingredients and Nutrition Facts" : "Ingredient label preview";
  }
  if (els.nutritionFactsPanel) {
    els.nutritionFactsPanel.classList.toggle("hidden", !isFood);
  }
  if (!isFood) resetNutritionFactsChoice();
  updateAnalyzeButton();
}

async function analyzeCurrentPhoto() {
  if (state.analyzing) return;
  if (!["food", "beauty"].includes(state.selectedProductType)) {
    toast("Choose food / drink or beauty first.");
    return;
  }
  if (!state.currentPhoto && !els.manualIngredients.value.trim()) return;
  if (state.selectedProductType === "food" && !state.labelHasNutritionFacts) {
    toast("Choose whether Nutrition Facts are included.");
    updateAnalyzeButton();
    return;
  }
  state.analyzing = true;
  els.analyzePhotoButton.disabled = true;
  setLoading(state.selectedProductType === "food" ? "Analyzing full back label" : "Analyzing ingredient label");

  try {
    if (!navigator.onLine) {
      const queued = await queueCurrentPhotoAnalysis("offline");
      renderQueuedAnalysis(queued);
      toast("Saved offline. GreenScan will analyze and add it when internet returns.");
      return;
    }
    const analysisResult = getAnalysisEndpoint()
      ? await analyzeWithEdgeFunction()
      : await analyzeUploadedIngredients();
    const analysis = mergeFilledIngredientAnalysis(analysisResult);
    renderResult(analysis, { countScan: true });
    saveProductAnalysis(analysis);
    saveHistory(analysis);
    trackScan(analysis, "ai_analyzed");
    await saveSharedProductAnalysis(analysis);
    els.fallbackPanel.classList.add("hidden");
    if (analysis.savedToDatabase) toast("✓ Saved to database");
  } catch (error) {
    if (isNetworkError(error)) {
      const queued = await queueCurrentPhotoAnalysis("network_error");
      renderQueuedAnalysis(queued);
      toast("Saved for later. GreenScan will retry when internet returns.");
      return;
    }
    renderAnalysisError(error);
  } finally {
    state.analyzing = false;
    updateAnalyzeButton();
  }
}

function mergeFilledIngredientAnalysis(analysis) {
  const base = state.currentAnalysis;
  if (!base || base.barcode !== analysis.barcode || base.ingredients.length) return analysis;
  const genericName = !analysis.name || /photo analyzed product|product \d+/i.test(analysis.name);
  return {
    ...base,
    ...analysis,
    name: genericName ? base.name : analysis.name,
    brand: analysis.brand || base.brand,
    imageUrl: analysis.imageUrl || base.imageUrl || "",
    itemCategory: analysis.itemCategory || base.itemCategory,
    source: "Saved AI-filled ingredients",
  };
}

async function analyzeWithEdgeFunction() {
  const endpoint = getAnalysisEndpoint();
  const frontImage = state.currentFrontPhoto ? await fileToCompressedDataUrl(state.currentFrontPhoto) : null;
  const backImage = state.currentPhoto ? await fileToCompressedDataUrl(state.currentPhoto) : null;
  const payload = {
    barcode: state.currentBarcode,
    productType: state.selectedProductType,
    userEmail: state.user?.email || "",
    userId: state.user?.id || "",
    userAiProvider: state.user ? state.userAiSettings.provider : "",
    userAiKey: state.user ? state.userAiSettings.apiKey : "",
    hasNutritionFacts: state.selectedProductType === "food" ? state.labelHasNutritionFacts : "not_applicable",
    frontImage,
    backImage,
    manualIngredients: els.manualIngredients.value.trim(),
  };

  const headers = {};
  headers["Content-Type"] = "application/json";
  addAuthHeader(headers);

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 429) {
      addLimitNotification({
        kind: "ai",
        remaining: 0,
        resetAt: data.reset_at || data.resetAt,
      });
    }
    throw new Error(data.error || "The analysis function returned an error.");
  }
  if (data.ai_limit && !data.ai_limit.unlimited && Number.isFinite(Number(data.ai_limit.remaining)) && Number(data.ai_limit.remaining) <= 5) {
    addLimitNotification({
      kind: "ai",
      remaining: Number(data.ai_limit.remaining),
      resetAt: data.ai_limit.reset_at || data.ai_limit.resetAt,
    });
  }
  const analysis = normalizeAiResponse(data);
  analysis.imageUrl = frontImage || "";
  analysis.savedToDatabase = Boolean(data.saved_to_database || data.savedToDatabase);
  return analysis;
}

async function buildCurrentAnalysisPayload() {
  const frontImage = state.currentFrontPhoto ? await fileToCompressedDataUrl(state.currentFrontPhoto) : null;
  const backImage = state.currentPhoto ? await fileToCompressedDataUrl(state.currentPhoto) : null;
  return {
    barcode: state.currentBarcode,
    productType: state.selectedProductType,
    userEmail: state.user?.email || "",
    userId: state.user?.id || "",
    userAiProvider: state.user ? state.userAiSettings.provider : "",
    userAiKey: state.user ? state.userAiSettings.apiKey : "",
    hasNutritionFacts: state.selectedProductType === "food" ? state.labelHasNutritionFacts : "not_applicable",
    frontImage,
    backImage,
    manualIngredients: els.manualIngredients.value.trim(),
  };
}

async function queueCurrentPhotoAnalysis(reason = "offline") {
  const payload = await buildCurrentAnalysisPayload();
  return queuePendingAnalysis(payload, reason);
}

function getPendingAnalyses() {
  try {
    return JSON.parse(localStorage.getItem(pendingAnalysisStorageKey) || "[]").filter((item) => item?.id && item.payload);
  } catch {
    return [];
  }
}

function savePendingAnalyses(items) {
  const limited = items.slice(0, localCachePolicy.pendingAnalysisLimit);
  try {
    localStorage.setItem(pendingAnalysisStorageKey, JSON.stringify(limited));
  } catch {
    try {
      localStorage.setItem(pendingAnalysisStorageKey, JSON.stringify(limited.slice(0, 2)));
    } catch {
      localStorage.removeItem(pendingAnalysisStorageKey);
    }
  }
}

function pendingAnalysisId(payload) {
  const barcode = normalizeBarcode(payload.barcode || "") || "photo-only";
  const text = String(payload.manualIngredients || "").toLowerCase().replace(/\s+/g, " ").slice(0, 220);
  const imageMarker = [payload.frontImage, payload.backImage]
    .map((value) => `${String(value || "").length}:${String(value || "").slice(-36)}`)
    .join("|");
  return [barcode, payload.productType || "unknown", payload.hasNutritionFacts || "", text, imageMarker].join("::");
}

function queuePendingAnalysis(payload, reason = "offline") {
  const id = pendingAnalysisId(payload);
  const existing = getPendingAnalyses().filter((item) => item.id !== id);
  const safePayload = {
    ...payload,
    userAiKey: "",
  };
  const item = {
    id,
    reason,
    payload: safePayload,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };
  savePendingAnalyses([item, ...existing]);
  return item;
}

function renderQueuedAnalysis(item) {
  clearResultSheet();
  const barcode = item?.payload?.barcode || state.currentBarcode || "";
  els.resultPanel.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">Saved offline</p>
      <h2>Queued for GreenScan analysis</h2>
      <p>${barcode ? `Barcode ${escapeHtml(barcode)} is saved on this device.` : "This label is saved on this device."} Open GreenScan with internet and it will analyze the label, avoid duplicates, and add the result to the shared database when possible.</p>
    </div>
  `;
  els.resultPanel.classList.remove("view-hidden");
  scrollToResultPanel();
}

function isNetworkError(error) {
  if (!navigator.onLine) return true;
  const message = String(error?.message || error || "").toLowerCase();
  return /failed to fetch|network|load failed|internet|offline/.test(message);
}

let pendingAnalysisSyncing = false;

async function syncPendingAnalyses() {
  if (pendingAnalysisSyncing || !navigator.onLine || !getAnalysisEndpoint()) return;
  const pending = getPendingAnalyses();
  if (!pending.length) return;
  pendingAnalysisSyncing = true;
  const remaining = [];
  let synced = 0;
  try {
    for (const item of pending) {
      try {
        const headers = {};
        headers["Content-Type"] = "application/json";
        await ensureFreshIdToken();
        addAuthHeader(headers);
        const payload = {
          ...item.payload,
          userEmail: state.user?.email || item.payload.userEmail || "",
          userId: state.user?.id || item.payload.userId || "",
          userAiProvider: state.user ? state.userAiSettings.provider : item.payload.userAiProvider || "",
          userAiKey: state.user ? state.userAiSettings.apiKey : "",
        };
        const response = await fetch(getAnalysisEndpoint(), {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Queued analysis failed.");
        const analysis = normalizeAiResponse(data);
        analysis.imageUrl = payload.frontImage || "";
        analysis.savedToDatabase = Boolean(data.saved_to_database || data.savedToDatabase);
        saveProductAnalysis(analysis);
        saveHistory(analysis);
        synced += 1;
      } catch (error) {
        remaining.push({
          ...item,
          attempts: Number(item.attempts || 0) + 1,
          lastError: String(error?.message || error || "Sync failed").slice(0, 140),
        });
      }
    }
    savePendingAnalyses(remaining);
    if (synced) {
      renderHistory();
      toast(synced === 1 ? "Offline item added to database." : `${synced} offline items added to database.`);
    }
  } finally {
    pendingAnalysisSyncing = false;
  }
}

function renderAnalysisError(error) {
  const message = error?.message || "Photo analysis failed.";
  clearResultSheet();
  els.resultPanel.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">AI analysis failed</p>
      <h2>${escapeHtml(message)}</h2>
      <p>Try a clearer full back-label photo, or type/paste the ingredients and nutrition facts and analyze again.</p>
    </div>
  `;
  els.fallbackPanel.classList.remove("hidden");
  scrollToResultPanel();
  toast("AI analysis failed.");
}

function scrollToResultPanel() {
  if (isResultSheetLayout() && els.resultPanel.classList.contains("has-result")) {
    setResultSheetExpanded(false);
    return;
  }
  window.requestAnimationFrame(() => {
    const top = Math.max(0, els.resultPanel.getBoundingClientRect().top + window.scrollY - 12);
    window.scrollTo({ top, behavior: "smooth" });
  });
}

function scrollToProductTypePanel() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const target = els.productTypePanel || els.fallbackPanel;
      if (!target) return;
      const mobileOffset = window.matchMedia("(max-width: 720px)").matches ? 78 : 24;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - mobileOffset);
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

async function demoPhotoAnalysis() {
  await new Promise((resolve) => window.setTimeout(resolve, 850));
  const category = guessCategoryFromBarcode();
  const demoText = category === "beauty"
    ? "Aqua, Glycerin, Fragrance, Methylisothiazolinone, Dimethicone"
    : "Whole grain oats, sugar, canola oil, natural flavor, BHT";
  const ingredients = splitIngredients(demoText).map((name) => classifyIngredient(name, category));
  const score = calculateScore(ingredients, {}, category);
  return {
    barcode: state.currentBarcode || "photo-only",
    source: "Demo AI analysis",
    category,
    name: "Photo analyzed product",
    brand: "",
    ingredientsText: demoText,
    ingredients,
    safetyScore: score,
    scoreColor: scoreColor(score),
    summary: `${buildSummary(score, ingredients, category)} Connect the Cloudflare analysis API for live GPT-4o-mini analysis.`,
    createdAt: new Date().toISOString(),
  };
}

async function analyzeUploadedIngredients() {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  const typedText = els.manualIngredients.value.trim();
  const category = guessCategoryFromBarcode();
  const fallbackText = category === "beauty"
    ? "Aqua, Glycerin, Fragrance, Methylisothiazolinone, Dimethicone"
    : "Whole grain oats, sugar, canola oil, natural flavor, BHT";
  const ingredientsText = typedText || fallbackText;
  const ingredients = splitIngredients(ingredientsText).map((name) => classifyIngredient(name, category));
  const score = calculateScore(ingredients, {}, category);
  return {
    barcode: state.currentBarcode || "photo-only",
    source: typedText ? "Ingredient label entry" : "Demo image analysis",
    category,
    name: state.currentBarcode ? `Product ${state.currentBarcode}` : "Photo Analyzed Product",
    brand: "",
    ingredientsText,
    ingredients,
    safetyScore: score,
    scoreColor: scoreColor(score),
    summary: typedText
      ? buildSummary(score, ingredients, category)
      : `${buildSummary(score, ingredients, category)} Add the Cloudflare analysis API for real image text extraction.`,
    createdAt: new Date().toISOString(),
  };
}

function normalizeAiResponse(data) {
  const ingredients = (data.ingredients || []).map((item) => ({
    rawName: toDisplayName(normalizeIngredientTextTypos(item.raw_name || item.rawName || "Unknown ingredient")),
    normalizedName: normalizeIngredientTextTypos(item.normalized_name || item.normalizedName || item.raw_name || item.rawName || "").toLowerCase(),
    type: item.ingredient_type || item.type || "unknown",
    risk: item.risk || "unknown",
    riskScore: item.risk_score || item.riskScore || 0,
    reason: item.reason || "No reason provided.",
  }));
  const nutritionFacts = normalizeAiNutritionFacts(data.nutrition_facts || data.nutritionFacts || data.nutrition || null);
  const inferredCategory = inferProductCategory({
    category: state.selectedProductType || data.product_category || data.category || "unknown",
    name: data.detected_product_name || data.name || "",
    brand: data.detected_brand || data.brand || "",
    ingredientsText: normalizeIngredientTextTypos(data.extracted_ingredients_text || ""),
    ingredients,
  });
  const scoringData = { ...data, nutritionFacts };
  const resultCategory = state.selectedProductType || inferredCategory;
  const foodScore = calculateScore(ingredients, scoringData, "food");
  const finalScore = resultCategory === "food" ? foodScore : data.safety_score ?? calculateScore(ingredients, scoringData, inferredCategory);

  return {
    barcode: state.currentBarcode || data.barcode || "photo-only",
    source: "GPT-4o-mini",
    category: resultCategory,
    itemCategory: data.item_category || data.itemCategory || inferItemCategory(data, ingredients),
    name: formatAiProductTitle(data),
    brand: data.detected_brand || data.brand || "",
    imageUrl: data.imageUrl || "",
    countries: data.countries || "",
    countriesTags: data.countries_tags || data.countriesTags || [],
    allergens: data.allergens || data.allergen_statement || "",
    allergensTags: data.allergens_tags || data.allergensTags || [],
    traces: data.traces || data.cross_contact_statement || "",
    tracesTags: data.traces_tags || data.tracesTags || [],
    ingredientsText: (resultCategory === "food" ? (data.extracted_ingredients_text || "") : cleanIngredientSection(data.extracted_ingredients_text || "")),
    ingredients,
    safetyScore: finalScore,
    scoreColor: scoreColor(finalScore),
    summary: resultCategory === "food"
      ? buildSummary(foodScore, ingredients, "food")
      : data.summary || buildSummary(data.safety_score ?? 60, ingredients, inferredCategory),
    createdAt: new Date().toISOString(),
    savedToDatabase: Boolean(data.saved_to_database || data.savedToDatabase),
    positiveNotes: normalizePositiveNotes(data.positive_notes || data.positiveNotes || []),
  };
}

function normalizeAiNutritionFacts(value) {
  if (!value || typeof value !== "object") return null;
  const facts = {};
  const setNumber = (key, raw) => {
    const number = Number(raw);
    if (Number.isFinite(number)) facts[key] = number;
  };
  const servingSize = String(value.serving_size || value.servingSize || "").trim();
  if (servingSize) facts.servingSize = servingSize.slice(0, 80);
  setNumber("energyKcal100g", value.energyKcal100g ?? value.energy_kcal_100g ?? value.calories_100g);
  setNumber("calories", value.calories);
  setNumber("sugars_100g", value.sugars_100g ?? value.sugar_100g ?? value.sugars100g);
  setNumber("sugar_100g", value.sugar_100g ?? value.sugars_100g ?? value.sugars100g);
  setNumber("fat_100g", value.fat_100g ?? value.fat100g);
  setNumber("saturated-fat_100g", value["saturated-fat_100g"] ?? value.saturated_fat_100g ?? value.saturatedFat_100g ?? value.saturatedFat100g);
  setNumber("saturatedFat_100g", value.saturatedFat_100g ?? value.saturated_fat_100g ?? value["saturated-fat_100g"] ?? value.saturatedFat100g);
  setNumber("sodium_100g", value.sodium_100g ?? value.sodium100g);
  setNumber("fiber_100g", value.fiber_100g ?? value.fiber100g);
  setNumber("protein_100g", value.protein_100g ?? value.protein100g);
  return Object.keys(facts).length ? facts : null;
}

function formatAiProductTitle(data) {
  const productName = toDisplayName(data.detected_product_name || data.name || "Photo analyzed product");
  const companyName = toDisplayName(data.detected_brand || data.brand || "");
  if (!companyName) return productName;
  if (productName.toLowerCase().startsWith(companyName.toLowerCase())) return productName;
  return `${companyName}, ${productName}`;
}

function inferProductCategory({ category, name, brand, categories, ingredientsText, ingredients }) {
  const text = [
    category,
    name,
    brand,
    categories,
    ingredientsText,
    ...ingredients.map((item) => `${item.rawName} ${item.type}`),
  ].join(" ").toLowerCase();

  const beautySignals = [
    "beauty",
    "cosmetic",
    "cosmetics",
    "personal care",
    "personal hygiene",
    "skin care",
    "skincare",
    "body care",
    "hair care",
    "oral care",
    "bath",
    "shower",
    "soap",
    "hand soap",
    "body wash",
    "shower gel",
    "deodorant",
    "antiperspirant",
    "mouthwash",
    "toothpaste",
    "toothbrush",
    "conditioner",
    "shampoo",
    "mask",
    "hair",
    "scalp",
    "skin",
    "lotion",
    "cream",
    "moisturizer",
    "sunscreen",
    "spf",
    "makeup",
    "serum",
    "cleanser",
    "gel douche",
    "dentifrice",
    "aqua",
    "fragrance",
    "parfum",
    "dimethicone",
    "amodimethicone",
    "cyclopentasiloxane",
    "behentrimonium",
    "cetrimonium",
    "polyquaternium",
    "methylisothiazolinone",
    "phenoxyethanol",
    "cetyl alcohol",
    "stearyl alcohol",
    "panthenol",
    "sodium benzoate",
    "cosmetic_base",
    "surfactant",
    "preservative_cosmetic",
    "uv_filter",
  ];

  const foodSignals = [
    "food",
    "drink",
    "beverage",
    "nutrition facts",
    "calories",
    "sugar",
    "sodium",
    "protein",
    "vitamin",
    "food_ingredient",
    "food_additive",
    "sweetener",
  ];

  const beautyScore = beautySignals.reduce((score, signal) => score + (text.includes(signal) ? 1 : 0), 0);
  const foodScore = foodSignals.reduce((score, signal) => score + (text.includes(signal) ? 1 : 0), 0);

  if (beautyScore >= 2) return "beauty";
  if (beautyScore >= 1 && category === "beauty") return "beauty";
  if (beautyScore >= 1 && beautyScore >= foodScore) return "beauty";
  if (foodScore >= 2 && foodScore > beautyScore) return "food";
  return category === "food" || category === "beauty" ? category : "unknown";
}

function inferItemCategory(analysis, ingredients = []) {
  const text = [
    analysis.category,
    analysis.product_category,
    analysis.name,
    analysis.detected_product_name,
    analysis.brand,
    analysis.detected_brand,
    analysis.summary,
    analysis.categories,
    analysis.labels,
    analysis.itemCategory,
    analysis.item_category,
    analysis.ingredientsText,
    analysis.extracted_ingredients_text,
    ...ingredients.map((item) => `${item.rawName} ${item.type}`),
  ].join(" ").toLowerCase();
  const matches = [
    ["Mouthwash", ["mouthwash", "oral rinse", "cetylpyridinium", "fluoride", "menthol"]],
    ["Toothpaste", ["toothpaste", "dentifrice", "sodium fluoride", "stannous fluoride"]],
    ["Deodorant", ["deodorant", "antiperspirant", "aluminum chlorohydrate", "propylene glycol"]],
    ["Shampoo", ["shampoo", "sodium laureth sulfate", "ammonium lauryl sulfate"]],
    ["Conditioner", ["conditioner", "behentrimonium", "cetrimonium", "amodimethicone"]],
    ["Hair Mask", ["hair mask", "hair masque", "deep conditioner", "treatment mask"]],
    ["Hair Gel", ["hair gel", "styling gel", "edge control"]],
    ["Hair Oil", ["hair oil", "scalp oil", "argan oil", "castor oil"]],
    ["Body Wash", ["body wash", "shower gel"]],
    ["Face Cream", ["face cream", "facial cream", "face moisturizer", "facial moisturizer", "night cream", "day cream"]],
    ["Hand Cream", ["hand cream", "working hands"]],
    ["Lotion", ["lotion", "body cream", "body lotion", "moisturizer"]],
    ["Cleanser", ["cleanser", "face wash", "facial wash", "cleansing gel"]],
    ["Serum", ["serum", "hyaluronic acid", "niacinamide"]],
    ["Sunscreen", ["sunscreen", "spf", "avobenzone", "oxybenzone", "octocrylene"]],
    ["Lip Balm", ["lip balm", "chapstick", "lip treatment"]],
    ["Soap", ["soap", "bar soap", "hand soap"]],
    ["Crackers", ["cracker", "crackers"]],
    ["Chips", ["chips", "crisps"]],
    ["Cereal", ["cereal", "whole grain oats"]],
    ["Candy", ["candy", "gummies", "chocolate"]],
    ["Peanut Butter", ["peanut butter", "peanut spread", "ground peanuts"]],
    ["Bone Broth", ["bone broth", "chicken broth", "beef broth", "broth", "stock"]],
    ["Nut Butter", ["almond butter", "cashew butter", "nut butter"]],
    ["Sauce", ["ketchup", "sauce", "dressing", "mustard"]],
    ["Drink", ["drink", "juice", "soda", "beverage", "water"]],
    ["Snack", ["snack", "bar"]],
  ];
  const found = matches.find(([, terms]) => terms.some((term) => text.includes(term)));
  if (found) return found[0];
  if ((analysis.category || analysis.product_category) === "beauty") return "Beauty";
  if ((analysis.category || analysis.product_category) === "food") return "Food / Drink";
  return "Product";
}

function guessCategoryFromBarcode() {
  return state.selectedProductType || "unknown";
}

function saveHistory(analysis) {
  if (!state.user) return;
  const safeAnalysis = compactHistoryAnalysis(normalizeRenderableAnalysis(analysis));
  const history = getHistory();
  const next = [safeAnalysis, ...history.filter((item) => item.barcode !== safeAnalysis.barcode)]
    .map((item, index) => compactHistoryAnalysis(item, { stripDataImage: shouldStripInlineImage(item.imageUrl, index, localCachePolicy.keepHistoryImages) }))
    .slice(0, localCachePolicy.historyLimit);
  try {
    localStorage.setItem(historyStorageKey(), JSON.stringify(next));
    state.selectedHistoryKey = getHistoryKey(safeAnalysis);
    renderHistory();
    saveAccountHistory(next);
  } catch {
    try {
      reclaimLocalStorageSpace();
      const smaller = next.slice(0, 6).map((item) => compactHistoryAnalysis(item, { stripDataImage: true }));
      localStorage.setItem(historyStorageKey(), JSON.stringify(smaller));
      state.selectedHistoryKey = getHistoryKey(safeAnalysis);
      renderHistory();
      saveAccountHistory(smaller);
      toast("History saved with a smaller photo to save space.");
    } catch {
      toast("Could not save history on this device.");
    }
  }
}

function compactHistoryAnalysis(analysis, options = {}) {
  const compact = normalizeRenderableAnalysis(analysis);
  if (!compact) return analysis;
  const dataImageTooLarge = typeof compact.imageUrl === "string" && compact.imageUrl.startsWith("data:") && compact.imageUrl.length > localCachePolicy.maxInlineImageLength;
  const stripDataImage = Boolean(options.stripDataImage && typeof compact.imageUrl === "string" && compact.imageUrl.startsWith("data:"));
  return {
    barcode: compact.barcode,
    source: compact.source,
    category: compact.category,
    itemCategory: compact.itemCategory,
    name: compact.name,
    brand: compact.brand,
    imageUrl: stripDataImage || dataImageTooLarge ? "" : compact.imageUrl,
    ingredientsText: compact.ingredientsText,
    ingredients: compact.ingredients,
    safetyScore: compact.safetyScore,
    scoreColor: compact.scoreColor,
    summary: compact.summary,
    positiveNotes: compact.positiveNotes,
    nutritionFacts: compact.nutritionFacts,
    createdAt: compact.createdAt,
    savedToDatabase: compact.savedToDatabase,
    confidence: compact.confidence,
  };
}

function reclaimLocalStorageSpace() {
  cleanupLocalCache({ aggressive: true });
  try {
    const history = getHistory().slice(0, 6).map((item) => compactHistoryAnalysis(item, { stripDataImage: true }));
    localStorage.setItem(historyStorageKey(), JSON.stringify(history));
  } catch {
    // Best effort only.
  }
}

function shouldStripInlineImage(imageUrl, index, keepCount) {
  return typeof imageUrl === "string" && imageUrl.startsWith("data:") && (index >= keepCount || imageUrl.length > localCachePolicy.maxInlineImageLength);
}

function getSavedProduct(barcode) {
  if (!barcode) return null;
  try {
    const products = JSON.parse(localStorage.getItem(productStorageKey()) || "{}");
    return products[barcode] || null;
  } catch {
    return null;
  }
}

async function getSharedSavedProduct(barcode) {
  if (!barcode) return null;
  try {
    const response = await fetch(`${getSavedProductEndpoint()}?barcode=${encodeURIComponent(barcode)}&_=${Date.now()}`, { cache: "no-cache" });
    if (!response.ok) return null;
    const data = await response.json();
    return normalizeSavedAnalysis(data);
  } catch {
    return null;
  }
}

async function addScannedProductImage(event) {
  const file = event.target.files?.[0];
  if (!file || !state.currentAnalysisCanAddImage || !state.currentAnalysis?.barcode) return;
  try {
    const imageUrl = await fileToCompressedDataUrl(file, { maxSide: 520, quality: 0.62 });
    const updated = {
      ...state.currentAnalysis,
      imageUrl,
      source: state.currentAnalysis.source || "Local image update",
      savedAt: new Date().toISOString(),
    };
    state.currentAnalysis = updated;
    saveProductAnalysis(updated);
    saveHistory(updated);
    renderResult(updated, { allowImageUpload: false, skipHistoryRender: true });
    toast("Product picture added.");
    await saveSharedProductImage(updated);
  } catch {
    toast("Could not add that picture.");
  }
}

async function saveSharedProductImage(analysis) {
  if (!hasAuthenticatedSession() || !analysis?.barcode || !analysis.imageUrl) return;
  try {
    const data = await uploadSharedProductImageResponse(analysis);
    if (data.imageUrl) {
      const updated = { ...analysis, imageUrl: data.imageUrl, source: data.saved_to_database ? "Saved product image" : analysis.source };
      state.currentAnalysis = updated;
      saveProductAnalysis(updated);
      saveHistory(updated);
      renderResult(updated, { allowImageUpload: false, skipHistoryRender: true });
    }
    if (data.saved_to_database) toast("Product picture saved to database.");
    else if (data.pending_review) toast("Product picture sent for admin review.");
  } catch (error) {
    toast(error.message || "Picture saved on this device only.");
  }
}

async function uploadSharedProductImage(analysis) {
  if (!hasAuthenticatedSession() || !analysis?.barcode || !analysis.imageUrl) return "";
  try {
    const data = await uploadSharedProductImageResponse(analysis);
    if (data.saved_to_database) toast("Product picture saved to database.");
    else if (data.pending_review) toast("Product picture sent for admin review.");
    return data.imageUrl || "";
  } catch (error) {
    toast(error.message || "Picture saved on this device only.");
    return "";
  }
}

async function uploadSharedProductImageResponse(analysis) {
  const response = await fetch(`${getApiBaseUrl()}/api/product-image`, {
    method: "POST",
    headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      barcode: analysis.barcode,
      imageUrl: analysis.imageUrl,
      analysis,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Shared image upload failed.");
  return data;
}

async function saveSharedProductAnalysis(analysis) {
  if (!state.isAdmin) return false;
  if (!analysis?.barcode || analysis.barcode === "photo-only") return false;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/save-product`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        barcode: analysis.barcode,
        analysis: {
          ...analysis,
          source: "Saved filled ingredients",
          savedAt: new Date().toISOString(),
        },
        userEmail: state.user?.email || "",
        userId: state.user?.id || "",
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Shared database update failed.");
    }
    analysis.savedToDatabase = true;
    return true;
  } catch {
    // Local save still works; shared database update is best effort.
    return false;
  }
}

function normalizeSavedAnalysis(data) {
  if (Array.isArray(data.ingredients) && data.ingredients[0]?.rawName) {
    const text = data.ingredientsText || data.extracted_ingredients_text || "";
    const normalizedIngredients = data.ingredients.length
      ? data.ingredients
      : splitIngredients(text).map((name) => classifyIngredient(name, data.category || data.product_category || "unknown"));
    return {
      ...data,
      ingredients: normalizedIngredients,
      ingredientsText: text,
      extracted_ingredients_text: text,
      source: data.source || "Saved database",
      createdAt: data.createdAt || data.savedAt || new Date().toISOString(),
      savedToDatabase: true,
    };
  }

  const savedIngredientText = data.extracted_ingredients_text || data.ingredientsText || "";
  const savedCategory = data.product_category || data.category || "unknown";
  const derivedIngredientsFromText = !(Array.isArray(data.ingredients) && data.ingredients.length) && Boolean(savedIngredientText);
  const savedIngredients = Array.isArray(data.ingredients) && data.ingredients.length
    ? data.ingredients
    : splitIngredients(savedIngredientText).map((name) => classifyIngredient(name, savedCategory));
  const normalized = normalizeAiResponse({
    ...data,
    ingredients: savedIngredients,
    product_category: data.product_category || data.category,
    detected_product_name: data.detected_product_name || data.name,
    detected_brand: data.detected_brand || data.brand,
    extracted_ingredients_text: savedIngredientText,
    safety_score: derivedIngredientsFromText ? undefined : data.safety_score ?? data.safetyScore,
    score_color: derivedIngredientsFromText ? undefined : data.score_color || data.scoreColor,
  });
  return {
    ...normalized,
    source: data.source || "Saved database",
    imageUrl: data.imageUrl || normalized.imageUrl,
    createdAt: data.createdAt || data.savedAt || new Date().toISOString(),
    savedToDatabase: true,
  };
}

function saveProductAnalysis(analysis) {
  if (!analysis.barcode || analysis.barcode === "photo-only") return;
  try {
    const safeAnalysis = normalizeRenderableAnalysis(analysis);
    if (!safeAnalysis?.barcode) return;
    recordFormulaSnapshot(safeAnalysis);
    const products = JSON.parse(localStorage.getItem(productStorageKey()) || "{}");
    products[safeAnalysis.barcode] = compactProductAnalysis({
      ...safeAnalysis,
      source: safeAnalysis.source || "Local saved product",
      savedAt: new Date().toISOString(),
    }, 0);
    const entries = Object.entries(products)
      .sort(([, a], [, b]) => String(b.savedAt || b.createdAt || "").localeCompare(String(a.savedAt || a.createdAt || "")));
    const next = Object.fromEntries(entries.slice(0, localCachePolicy.productLimit).map(([key, value], index) => [key, compactProductAnalysis(value, index)]));
    localStorage.setItem(productStorageKey(), JSON.stringify(next));
  } catch {
    try {
      reclaimLocalStorageSpace();
    } catch {
      toast("Could not save this product on this device.");
    }
  }
}

function compactProductAnalysis(analysis, index = 0) {
  const normalized = normalizeRenderableAnalysis(analysis);
  if (!normalized) return analysis;
  return {
    ...normalized,
    imageUrl: shouldStripInlineImage(normalized.imageUrl, index, localCachePolicy.keepProductImages) ? "" : normalized.imageUrl,
    ingredients: Array.isArray(normalized.ingredients) ? normalized.ingredients.slice(0, 60) : [],
  };
}

function getHistory() {
  if (!state.user) return [];
  try {
    return JSON.parse(localStorage.getItem(historyStorageKey()) || "[]");
  } catch {
    return [];
  }
}

async function syncAccountData() {
  if (!hasAuthenticatedSession() || state.accountSyncStarted) return;
  state.accountSyncStarted = true;
  await registerAccountSession();
  renderHistory();
  renderRecentSearches();
  await Promise.allSettled([
    syncUserPreferences(),
    syncAccountHistory(),
    syncAccountRecentSearches(),
  ]);
}

async function registerAccountSession() {
  if (!hasUsableIdToken()) return;
  const session = getStoredAccountSession();
  if (session?.token && wasAccountRegisteredToday()) return;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.user.idToken}`,
      },
      body: JSON.stringify({ source: isHomeScreenApp() ? "installed-web-app" : "web" }),
    });
    if (!response.ok) return;
    const data = await response.json();
    markAccountRegisteredToday();
    if (data.sessionToken) {
      saveAccountSession(data.sessionToken, data.sessionExpiresAt);
      requestPersistentAppStorage();
    }
  } catch {
    // Account registration is best effort; the current Google token still works.
  }
}

function wasAccountRegisteredToday() {
  try {
    const saved = JSON.parse(localStorage.getItem(accountRegistrationStorageKey) || "null");
    return saved?.email === state.user?.email && saved?.date === new Date().toISOString().slice(0, 10);
  } catch {
    return false;
  }
}

function markAccountRegisteredToday() {
  try {
    localStorage.setItem(accountRegistrationStorageKey, JSON.stringify({
      email: state.user?.email || "",
      date: new Date().toISOString().slice(0, 10),
    }));
  } catch {
    // Registration still succeeded; the next launch may refresh the index again.
  }
}
async function syncAccountHistory() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/user-history`, { headers: await apiHeadersAsync() });
    if (!response.ok) return;
    const data = await response.json();
    const remote = Array.isArray(data.history) ? data.history.map(normalizeRenderableAnalysis) : [];
    const local = getHistory().map(normalizeRenderableAnalysis);
    const merged = mergeHistoryLists(local, remote);
    localStorage.setItem(historyStorageKey(), JSON.stringify(merged));
    renderHistory();
    if (merged.length) saveAccountHistory(merged);
  } catch {
    // Local history still works if account sync is temporarily unavailable.
  }
}

async function syncAccountRecentSearches() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/recent-searches`, { headers: await apiHeadersAsync() });
    if (!response.ok) return;
    const data = await response.json();
    const remote = Array.isArray(data.searches) ? data.searches : [];
    const merged = mergeRecentSearches(getRecentSearches(), remote);
    localStorage.setItem("greenscan.recentSearches", JSON.stringify(merged));
    renderRecentSearches();
    if (merged.length) saveAccountRecentSearches(merged);
  } catch {
    // Recent searches remain available locally.
  }
}

function mergeHistoryLists(local, remote) {
  const byKey = new Map();
  [...remote, ...local]
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt || b.savedAt || 0) - new Date(a.createdAt || a.savedAt || 0))
    .forEach((item) => {
      const key = item.barcode || `${item.name}:${item.createdAt || item.savedAt || ""}`;
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, item);
      } else if (!existing.imageUrl && item.imageUrl) {
        byKey.set(key, { ...existing, imageUrl: item.imageUrl });
      }
    });
  return [...byKey.values()].slice(0, localCachePolicy.historyLimit);
}

function mergeRecentSearches(local, remote) {
  const seen = new Set();
  const merged = [];
  [...local, ...remote].forEach((query) => {
    const value = String(query || "").trim();
    const key = value.toLowerCase();
    if (value.length < 2 || seen.has(key)) return;
    seen.add(key);
    merged.push(value);
  });
  return merged.slice(0, 8);
}

async function saveAccountHistory(history = getHistory()) {
  if (!hasAuthenticatedSession()) return;
  try {
    await fetch(`${getApiBaseUrl()}/api/user-history`, {
      method: "PUT",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ history: history.slice(0, localCachePolicy.historyLimit).map((item) => compactHistoryAnalysis(item, { stripDataImage: true })) }),
    });
  } catch {
    // Local history remains available if sync fails.
  }
}

async function deleteAccountHistory() {
  if (!hasAuthenticatedSession()) return;
  try {
    await fetch(`${getApiBaseUrl()}/api/user-history`, {
      method: "DELETE",
      headers: await apiHeadersAsync(),
      keepalive: true,
    });
  } catch {
    // Local delete already completed.
  }
}

async function saveAccountRecentSearches(searches = getRecentSearches()) {
  if (!hasAuthenticatedSession()) return;
  try {
    await fetch(`${getApiBaseUrl()}/api/recent-searches`, {
      method: "PUT",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ searches }),
    });
  } catch {
    // Recent searches remain local if sync fails.
  }
}

async function deleteAccountRecentSearches() {
  if (!hasAuthenticatedSession()) return;
  try {
    await fetch(`${getApiBaseUrl()}/api/recent-searches`, {
      method: "DELETE",
      headers: await apiHeadersAsync(),
      keepalive: true,
    });
  } catch {
    // Local delete already completed.
  }
}

function renderHistory() {
  const historyPanel = document.querySelector(".history-panel");
  const history = state.user ? getHistory() : [];
  const dashboardHistory = history.length
    ? history
    : (state.currentAnalysis ? [state.currentAnalysis] : []);
  const savedProductMetric = document.querySelector("#savedProductMetric");
  const goodChoiceMetric = document.querySelector("#goodChoiceMetric");
  if (savedProductMetric) savedProductMetric.textContent = String(state.user ? getFavoriteProducts().length : 0);
  if (goodChoiceMetric) {
    goodChoiceMetric.textContent = String(dashboardHistory.filter((item) => Number(item.safetyScore ?? item.safety_score ?? item.score) >= 75).length);
  }
  renderFriendlyHomeDashboard(dashboardHistory);
  if (!state.user) {
    historyPanel.classList.add("locked");
    els.historyList.innerHTML = `
      <div class="history-locked">
        <p class="eyebrow">History locked</p>
        <h2>Log in to see history.</h2>
        <p>Your recent scans will be saved to your account after sign-in.</p>
      </div>
    `;
    return;
  }

  historyPanel.classList.remove("locked");
  els.historyList.innerHTML = "";
  if (!history.length) {
    els.historyList.innerHTML = `<p>No scans saved yet.</p>`;
    return;
  }
  history.forEach((item) => {
    const row = document.createElement("button");
    row.className = `history-item${getHistoryKey(item) === state.selectedHistoryKey ? " selected" : ""}`;
    row.type = "button";
    row.innerHTML = `
      <img class="history-thumb" src="${escapeHtml(getHistoryImage(item))}" alt="${escapeHtml(item.name)}" />
      <div class="history-copy">
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(getBrandLine(item))}</p>
        <p><span class="dot ${escapeHtml(item.scoreColor)}"></span>${escapeHtml(scoreLabel(item.scoreColor, item.safetyScore))}</p>
        <p class="time-line">◷ ${escapeHtml(timeAgo(item.createdAt))}</p>
      </div>
      <span class="chevron">&rsaquo;</span>
    `;
    row.addEventListener("click", () => {
      switchView("scan");
      openHistoryItem(item);
    });
    els.historyList.appendChild(row);
  });
  hydrateMissingHistoryImages(history);
}

function renderFriendlyHomeDashboard(history = []) {
  renderFriendlyNutritionCard(history);
  renderFriendlySaferSwaps();
}

function firstFiniteNumber(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return Number.NaN;
}

function getFriendlyNutritionSnapshot(history = []) {
  for (const entry of history) {
    const item = normalizeRenderableAnalysis(entry);
    if (!item || item.category !== "food") continue;
    const nutrition = item.nutritionFacts || item.nutrition || item.nutriments || {};
    let calories = firstFiniteNumber(
      nutrition.energyKcal100g,
      nutrition.energy_kcal_100g,
      nutrition["energy-kcal_100g"],
      nutrition.calories_100g,
      nutrition.calories,
    );
    if (!Number.isFinite(calories)) {
      const energyKj = firstFiniteNumber(nutrition.energy_100g, nutrition.energyKj100g, nutrition.energy_kj_100g);
      if (Number.isFinite(energyKj)) calories = energyKj / 4.184;
    }
    const sugar = firstFiniteNumber(nutrition.sugars_100g, nutrition.sugar_100g, nutrition.sugar100g);
    const fat = firstFiniteNumber(nutrition.fat_100g, nutrition.fat100g);
    const sodiumGrams = getValidatedSodium100g(nutrition, item);
    if (![calories, sugar, fat, sodiumGrams].some(Number.isFinite)) continue;
    return {
      item,
      servingLabel: isLiquidBeverageProduct(item) ? "per 100 ml" : "per 100 g",
      calories,
      sugar,
      fat,
      sodiumMg: Number.isFinite(sodiumGrams) ? sodiumGrams * 1000 : Number.NaN,
    };
  }
  return null;
}

function formatFriendlyNutritionValue(value, unit) {
  if (!Number.isFinite(value)) return "--";
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${unit}`;
}

function renderFriendlyNutritionCard(history = []) {
  if (!els.friendlyNutritionCard) return;
  const snapshot = getFriendlyNutritionSnapshot(history);
  if (!snapshot) {
    els.friendlyNutritionCard.innerHTML = `
      <div class="friendly-card-heading">
        <div><p class="eyebrow">Nutrition</p><h3>Calories and nutrients</h3></div>
      </div>
      <button type="button" class="friendly-empty-action" data-friendly-scan>Scan a food or drink to see its nutrition</button>
    `;
    els.friendlyNutritionCard.querySelector("[data-friendly-scan]")?.addEventListener("click", showScannerView);
    return;
  }
  const { item } = snapshot;
  els.friendlyNutritionCard.innerHTML = `
    <button type="button" class="friendly-card-heading friendly-product-link" data-home-product-barcode="${escapeHtml(item.barcode || "")}">
      <span><p class="eyebrow">Nutrition ${escapeHtml(snapshot.servingLabel)}</p><h3>${escapeHtml(item.name)}</h3></span>
      <span class="chevron">&rsaquo;</span>
    </button>
    <div class="friendly-nutrition-grid">
      <div><small>Calories</small><strong>${escapeHtml(formatFriendlyNutritionValue(snapshot.calories, "kcal"))}</strong></div>
      <div><small>Sugar</small><strong>${escapeHtml(formatFriendlyNutritionValue(snapshot.sugar, "g"))}</strong></div>
      <div><small>Sodium</small><strong>${escapeHtml(formatFriendlyNutritionValue(snapshot.sodiumMg, "mg"))}</strong></div>
      <div><small>Fat</small><strong>${escapeHtml(formatFriendlyNutritionValue(snapshot.fat, "g"))}</strong></div>
    </div>
  `;
  els.friendlyNutritionCard.querySelector("[data-home-product-barcode]")?.addEventListener("click", () => {
    switchView("scan");
    renderResult(item);
  });
}

function renderFriendlySaferSwaps() {
  if (!els.friendlySwapsCard) return;
  const swaps = getSaferSwapsReport();
  els.friendlySwapsCard.innerHTML = `
    <div class="friendly-card-heading">
      <div><p class="eyebrow">Safer swaps</p><h3>${swaps.length ? "Higher-scoring matches" : "Build your comparisons"}</h3></div>
      ${swaps.length ? `<span class="friendly-count">${swaps.length}</span>` : ""}
    </div>
    ${swaps.length ? `<div class="friendly-swap-list">${swaps.map((item) => `
      <button type="button" class="friendly-swap-item" data-swap-barcode="${escapeHtml(item.barcode)}">
        <img src="${escapeHtml(getHistoryImage(item))}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" />
        <span><strong>${escapeHtml(item.name)}</strong><small>Instead of ${escapeHtml(item.swapForName || "a similar product")}</small></span>
        <b class="${escapeHtml(item.scoreColor || scoreColor(item.safetyScore))}">${Number(item.safetyScore || 0)}</b>
      </button>
    `).join("")}</div>` : `
      <button type="button" class="friendly-empty-action" data-friendly-search>Scan or search similar products to unlock swaps</button>
    `}
  `;
  bindSwapButtons(swaps, els.friendlySwapsCard);
  els.friendlySwapsCard.querySelector("[data-friendly-search]")?.addEventListener("click", openSearchView);
}

async function hydrateMissingHistoryImages(history = getHistory()) {
  if (state.hydratingHistoryImages) return;
  const missing = history.filter((item) => item?.barcode && !item.imageUrl).slice(0, localCachePolicy.historyLimit);
  if (!missing.length) return;
  state.hydratingHistoryImages = true;
  try {
    let changed = false;
    const next = [...history];
    for (const item of missing) {
      let imageUrl = "";
      const shared = await getSharedSavedProduct(item.barcode);
      if (shared?.imageUrl) imageUrl = shared.imageUrl;
      if (!imageUrl) imageUrl = await findOpenDatabaseImageUrl(item.barcode);
      if (!imageUrl) continue;
      const index = next.findIndex((entry) => getHistoryKey(entry) === getHistoryKey(item));
      if (index >= 0 && !next[index].imageUrl) {
        next[index] = { ...next[index], imageUrl };
        changed = true;
      }
    }
    if (changed) {
      const trimmed = next.slice(0, localCachePolicy.historyLimit);
      localStorage.setItem(historyStorageKey(), JSON.stringify(trimmed));
      saveAccountHistory(trimmed);
      renderHistory();
    }
  } catch {
    // History remains usable with placeholders if image hydration fails.
  } finally {
    state.hydratingHistoryImages = false;
  }
}

async function openHistoryItem(item) {
  renderResult(item);
  if (!item?.barcode) return;
  const sharedProduct = await getSharedSavedProduct(item.barcode);
  if (sharedProduct) {
    const hydrated = {
      ...sharedProduct,
      createdAt: item.createdAt || sharedProduct.createdAt,
    };
    renderResult(hydrated);
    saveProductAnalysis(hydrated);
  }
}

function getHistoryImage(item) {
  if (item.imageUrl) return item.imageUrl;
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='112' viewBox='0 0 96 112'%3E%3Crect width='96' height='112' rx='10' fill='%23e8f7ee'/%3E%3Crect x='28' y='16' width='40' height='80' rx='10' fill='%23ffffff' stroke='%23159447' stroke-width='3'/%3E%3Cpath d='M36 42h24M36 54h24M36 66h18' stroke='%23159447' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E`;
}

function findCachedProductImageUrl(barcode) {
  const clean = normalizeBarcode(barcode || "");
  if (!clean) return "";
  const candidates = [
    getSavedProduct(clean),
    ...getHistory().filter((item) => normalizeBarcode(item.barcode || "") === clean),
    ...getFavoriteProducts().filter((item) => normalizeBarcode(item.barcode || "") === clean),
  ];
  return candidates.find((item) => item?.imageUrl)?.imageUrl || "";
}

function getBrandLine(item) {
  const fallback = toDisplayName(item.itemCategory || item.item_category || item.category || "Product");
  return cleanHistoryLine(item.brand) || fallback || "Product";
}

function cleanHistoryLine(value) {
  const text = String(value || "")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const mojibakeHits = (text.match(/Ã|Â|â|�|€™|€|™|œ|ž/g) || []).length;
  if (mojibakeHits >= 2 || mojibakeHits / Math.max(text.length, 1) > 0.08) return "";
  return text.slice(0, 80);
}

function scoreLabel(color, score) {
  if (Number(score) >= 90) return "Excellent";
  if (color === "green") return "Good";
  if (color === "yellow") return "Fair";
  if (color === "orange") return "Poor";
  if (color === "red") return "Bad";
  return "Unknown";
}

function timeAgo(createdAt) {
  const then = createdAt ? new Date(createdAt).getTime() : Date.now();
  const seconds = Math.max(1, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function getHistoryKey(item) {
  return `${item.barcode || ""}:${item.createdAt || ""}:${item.name || ""}`;
}

function clearHistory() {
  if (!state.user) return;
  localStorage.removeItem(historyStorageKey());
  renderHistory();
  deleteAccountHistory();
}

function isHomeScreenApp() {
  return Boolean(window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone);
}

function isMobileInstallPromptTarget() {
  return Boolean(window.matchMedia?.("(max-width: 859px)")?.matches && window.matchMedia?.("(pointer: coarse)")?.matches);
}

function initHomeScreenPanel() {
  if (isHomeScreenApp() || !isMobileInstallPromptTarget()) {
    els.homeScreenPanel.classList.add("hidden");
    return;
  }
  els.homeScreenPanel.classList.remove("hidden");
  setInstallPlatform("iphone");
}

function setInstallPlatform(platform) {
  const steps = platform === "android"
    ? ["Tap the browser menu.", "Choose Add to Home screen or Install app.", "Tap Add or Install to finish."]
    : ["Tap the Share button.", "Choose Add to Home Screen.", "Tap Add to finish."];

  els.installTabs.forEach((button) => {
    const isActive = button.dataset.installPlatform === platform;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  els.installSteps.innerHTML = steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
}

function switchView(view) {
  state.activeView = view;
  document.body.classList.toggle("scan-view", view === "scan");
  if (view !== "scan") setResultSheetExpanded(false);
  if (view !== "search") hideSearchSuggestions();
  const isHome = view === "home";
  const isForYou = view === "forYou";
  const isSearch = view === "search";
  const isAppPage = isHome || isForYou || isSearch;
  els.signinPromptPanel.classList.toggle("view-hidden", Boolean(state.user) || isAppPage);
  els.freeSharePanel?.classList.toggle("view-hidden", isAppPage);
  els.appDescriptionPanel?.classList.toggle("view-hidden", isAppPage);
  document.querySelector(".scan-panel").classList.toggle("view-hidden", isAppPage);
  els.resultPanel.classList.toggle("view-hidden", isAppPage);
  els.scanStreakPanel?.classList.toggle("view-hidden", isAppPage);
  els.onboardingPanel?.classList.toggle("view-hidden", isAppPage);
  document.querySelectorAll(".discovery-panel, .status-panel").forEach((panel) => panel.classList.toggle("view-hidden", isAppPage));
  els.homeScreenPanel.classList.toggle("view-hidden", isHomeScreenApp() || !isMobileInstallPromptTarget() || isAppPage);
  document.querySelector(".phone-qr-panel").classList.toggle("view-hidden", isAppPage);
  document.querySelector(".landing-home-panel").classList.toggle("view-hidden", !isHome);
  document.querySelector(".history-panel").classList.toggle("view-hidden", !isForYou);
  document.querySelector(".search-panel").classList.toggle("view-hidden", !isSearch);
  els.fallbackPanel.classList.toggle("view-hidden", isAppPage);
  els.navHistoryButton.classList.toggle("active", isHome);
  els.navForYouButton.classList.toggle("active", isForYou);
  els.navScanButton.classList.toggle("active", view === "scan");
  els.navSearchButton.classList.toggle("active", isSearch);
  els.navSourcesButton.classList.remove("active");
  if (isForYou) renderHistory();
  if (isSearch) {
    if (state.user) renderRecentSearches();
    else renderSearchLoginPrompt();
  }
}

function openSearchView() {
  if (state.activeView !== "search") {
    switchView("search");
  }
  scrollToSearchBar();
}

function scrollToSearchBar() {
  const panel = document.querySelector(".search-panel");
  if (!panel) return;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => els.productSearchInput.focus(), 250);
}

function showScannerView() {
  switchView("scan");
  setResultSheetExpanded(false);
  window.requestAnimationFrame(() => {
    scrollToScannerPanel("smooth");
  });
}

function scrollToScannerPanel(behavior = "smooth") {
  const panel = document.querySelector(".scan-panel");
  if (!panel) return;
  const top = Math.max(0, panel.getBoundingClientRect().top + window.scrollY - 12);
  window.scrollTo({ top, left: 0, behavior });
}

function openSourcesFromNav() {
  state.activeView = "sources";
  els.navSourcesButton.classList.add("active");
  openSources();
}

function historyStorageKey() {
  return `clearscan.history.${state.user?.id || state.user?.email || "guest"}`;
}

function productStorageKey() {
  return `clearscan.products.${state.user?.id || state.user?.email || "guest"}`;
}

function userAiSettingsKey() {
  return `greenscan.ai-provider.${state.user?.id || state.user?.email || "guest"}`;
}

function openSettings() {
  switchView("settings");
  updateAccountUi();
  els.settingsDialog.showModal();
}

function openRestrictions() {
  renderAvoidListSettings();
  els.settingsDialog.close();
  els.restrictionsDialog.showModal();
}

function openSources() {
  els.sourcesDialog.showModal();
}

function openChangelog() {
  els.changelogDialog.showModal();
}

function openAiProvider() {
  if (!state.user) {
    toast("Log in to add your own AI key.");
    return;
  }
  state.userAiSettings = loadUserAiSettings();
  els.aiProviderSelect.value = state.userAiSettings.provider || "openai";
  els.userAiKey.value = state.userAiSettings.apiKey || "";
  els.aiProviderDialog.showModal();
}

function saveAiProvider() {
  if (!state.user) {
    toast("Log in to add your own AI key.");
    return;
  }
  const apiKey = els.userAiKey.value.trim();
  if (!apiKey) {
    toast("Paste an API key first.");
    return;
  }
  state.userAiSettings = {
    provider: els.aiProviderSelect.value,
    apiKey,
  };
  localStorage.setItem(userAiSettingsKey(), JSON.stringify(state.userAiSettings));
  els.aiProviderDialog.close();
  updateAccountUi();
  toast("AI provider saved.");
}

function clearAiProvider() {
  state.userAiSettings = { provider: "openai", apiKey: "" };
  localStorage.removeItem(userAiSettingsKey());
  els.userAiKey.value = "";
  els.aiProviderDialog.close();
  updateAccountUi();
  toast("Using GreenScan AI.");
}

function loadSettings() {
  return { edgeFunctionUrl: defaultAnalysisEndpoint() };
}

function loadUserAiSettings() {
  try {
    return {
      provider: "openai",
      apiKey: "",
      ...JSON.parse(localStorage.getItem(userAiSettingsKey()) || "{}"),
    };
  } catch {
    return { provider: "openai", apiKey: "" };
  }
}

function defaultAnalysisEndpoint() {
  return "https://clearscan-api.littlesaz454.workers.dev/api/analyze-product";
}

function getAnalysisEndpoint() {
  return state.settings.edgeFunctionUrl || defaultAnalysisEndpoint();
}

function getSavedProductEndpoint() {
  return "https://clearscan-api.littlesaz454.workers.dev/api/saved-product";
}

function getApiBaseUrl() {
  return getSavedProductEndpoint().replace("/api/saved-product", "");
}

function addAuthHeader(headers) {
  const session = getStoredAccountSession();
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  } else if (state.user?.idToken) {
    headers.Authorization = `Bearer ${state.user.idToken}`;
  }
}

async function apiHeadersAsync(extra = {}) {
  const headers = { ...extra };
  await ensureFreshIdToken();
  addAuthHeader(headers);
  return headers;
}
function apiHeaders(extra = {}) {
  const headers = { ...extra };
  addAuthHeader(headers);
  return headers;
}

async function trackScan(analysis, source) {
  const payload = {
    barcode: analysis?.barcode || state.currentBarcode || "",
    source: source || analysis?.source || "",
    category: analysis?.category || analysis?.product_category || "",
  };
  fetch(`${getApiBaseUrl()}/api/track-scan`, {
    method: "POST",
    headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

async function refreshAdminStatus() {
  if (!hasAuthenticatedSession()) {
    state.isAdmin = false;
    state.adminStatus = {
      admin: false,
      reason: "missing_token",
      message: "Sign in with Google to load admin data.",
    };
    updateAdminButton();
    return false;
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/status`, { headers: await apiHeadersAsync() });
    const data = await response.json();
    state.adminStatus = data;
    state.isAdmin = Boolean(response.ok && data.admin);
  } catch (error) {
    state.isAdmin = false;
    state.adminStatus = {
      admin: false,
      reason: "status_check_failed",
      message: error.message || "Could not check admin access.",
    };
  }
  updateAdminButton();
  return state.isAdmin;
}

function updateAdminButton() {
  const isOwnerEmail = normalizeEmail(state.user?.email) === OWNER_ADMIN_EMAIL;
  const canShowAdmin = state.isAdmin || isOwnerEmail;
  els.adminPanelButton.classList.toggle("hidden", !canShowAdmin);
  els.adminMenuButton?.classList.toggle("hidden", !canShowAdmin);
}

async function openAdminPanel() {
  const isOwnerEmail = normalizeEmail(state.user?.email) === OWNER_ADMIN_EMAIL;
  if (!state.isAdmin && !isOwnerEmail) {
    toast(state.user ? "This Google account is not approved for admin access." : "Sign in with Google first.");
    return;
  }
  if (isOwnerEmail && !isStoredGoogleUserValid(state.user)) {
    toast("Admin session expired. Sign in again to refresh access.");
    loginWithGoogle();
    return;
  }
  els.adminStats.innerHTML = `<p>Loading admin data...</p>`;
  if (els.adminSystemStatus) els.adminSystemStatus.innerHTML = `<p>Checking app systems...</p>`;
  els.adminUserList.innerHTML = "";
  els.adminList.innerHTML = "";
  els.adminReportList.innerHTML = "";
  els.adminDialog.showModal();
  if (!state.isAdmin && isOwnerEmail) {
    await refreshAdminStatus();
  }
  if (!state.isAdmin && isOwnerEmail && needsFreshGoogleLogin(state.adminStatus)) {
    loginWithGoogle();
    return;
  }
  if (!state.isAdmin) {
    renderAdminAccessError(new Error("Admin data could not load."), state.adminStatus);
    return;
  }
  await loadAdminSummary();
}

async function loadAdminSummary() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/summary`, { headers: await apiHeadersAsync() });
    const data = await response.json();
    if (!response.ok) {
      const status = await getAdminStatusMessage();
      state.adminStatus = status;
      if (normalizeEmail(state.user?.email) === OWNER_ADMIN_EMAIL && needsFreshGoogleLogin(status)) {
        toast("Admin session expired. Sign in again to refresh access.");
        loginWithGoogle();
        return;
      }
      throw new Error(data.error || status?.message || "Admin data could not load.");
    }
    renderAdminSummary(data);
    loadAdminSystemStatus();
  } catch (error) {
    const status = state.adminStatus || await getAdminStatusMessage();
    renderAdminAccessError(error, status);
  }
}

async function getAdminStatusMessage() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/status`, { headers: await apiHeadersAsync() });
    return await response.json();
  } catch (error) {
    return {
      admin: false,
      reason: "status_check_failed",
      message: error.message || "Could not check admin access.",
    };
  }
}

function renderAdminAccessError(error, status = {}) {
  const signedIn = state.user?.email
    ? `Signed in as ${state.user.email}.`
    : "No Google account is signed in on this browser.";
  const message = status?.message || error?.message || "Admin data could not load.";
  const reason = status?.reason ? `Reason: ${status.reason}` : "";
  els.adminStats.innerHTML = `
    <article class="admin-error-card">
      <strong>Admin data could not load</strong>
      <span>${escapeHtml(signedIn)}</span>
      <small>${escapeHtml(message)}</small>
      ${reason ? `<small>${escapeHtml(reason)}</small>` : ""}
      <button type="button" class="secondary-button" data-refresh-admin-access>Refresh admin access</button>
    </article>
  `;
  els.adminStats.querySelector("[data-refresh-admin-access]")?.addEventListener("click", loginWithGoogle);
  els.adminUserList.innerHTML = "<p>Admin access has to be verified before user activity can load.</p>";
  if (els.adminSystemStatus) els.adminSystemStatus.innerHTML = "";
  els.adminList.innerHTML = "";
  els.adminReportList.innerHTML = "";
}

function needsFreshGoogleLogin(status = {}) {
  return ["missing_token", "invalid_token", "wrong_client", "google_check_failed"].includes(status?.reason);
}

async function loadAdminSystemStatus() {
  if (!els.adminSystemStatus) return;
  els.adminSystemStatus.innerHTML = `<p>Checking app systems...</p>`;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/public/status`);
    const data = await response.json();
    const systems = Array.isArray(data.systems) ? data.systems : [];
    els.adminSystemStatus.innerHTML = systems.map((item) => `
      <article class="status-row">
        <span class="status-pill ${item.ok ? "" : "warn"}">${item.ok ? "OK" : "Check"}</span>
        <div>
          <strong>${escapeHtml(item.name || "System")}</strong>
          <span>${escapeHtml(item.detail || "")}</span>
        </div>
      </article>
    `).join("") || `<p>Status unavailable.</p>`;
  } catch {
    els.adminSystemStatus.innerHTML = `<p>Status unavailable.</p>`;
  }
}

function renderAdminSummary(data) {
  populateAdminLimits(data.limits || {});
  els.adminStats.innerHTML = `
    <article><strong>${Number(data.totalUsers || 0)}</strong><span>Users</span></article>
    <article><strong>${Number(data.totalScans || 0)}</strong><span>Total scans</span></article>
    <article><strong>${Number(data.totalAiAnalyses || 0)}</strong><span>AI analyses</span></article>
    <article><strong>${Number(data.savedProducts || 0)}</strong><span>Saved products</span></article>
  `;
  els.adminList.innerHTML = (data.admins || [])
    .map((email) => `<div class="admin-row compact-admin-row"><strong>${escapeHtml(email)}</strong><span>Admin</span></div>`)
    .join("") || "<p>No extra admins yet.</p>";
  els.adminList.innerHTML += `
    <div class="admin-row compact-admin-row"><strong>Unlimited access</strong><span>${escapeHtml((data.unlimitedUsers || []).join(", ") || "Only owner")}</span></div>
    <div class="admin-row compact-admin-row"><strong>Banned users</strong><span>${escapeHtml((data.bannedUsers || []).join(", ") || "None")}</span></div>
  `;
  els.adminUserList.innerHTML = (data.users || [])
    .map((user) => `
      <div class="admin-user-card">
        <div class="admin-user-main">
          <div>
            <strong>${escapeHtml(user.name || user.email || user.identity)}</strong>
            <span>${escapeHtml(user.email || user.identity)}</span>
          </div>
          ${user.unlimited ? `<span class="admin-badge">Unlimited</span>` : ""}
          ${user.banned ? `<span class="admin-badge danger">Banned</span>` : ""}
        </div>
        <div class="admin-usage-grid">
          <article><strong>${Number(user.totalScans || 0)}</strong><span>Scans</span><small>${Number(user.scansToday || 0)} today</small></article>
          <article><strong>${Number(user.totalAiAnalyses || 0)}</strong><span>AI</span><small>${Number(user.aiToday || 0)} today</small></article>
          <article><strong>${Number(user.totalSearches || 0)}</strong><span>Searches</span><small>${Number(user.searchesToday || 0)} today</small></article>
          <article><strong>${Number(user.trustScore || 50)}</strong><span>Trust</span><small>${Number(user.acceptedReports || 0)} accepted / ${Number(user.declinedReports || 0)} declined</small></article>
        </div>
        ${user.email ? `<button type="button" class="secondary-button" data-ban-user="${escapeHtml(user.email)}" data-ban-action="${user.banned ? "unban" : "ban"}">${user.banned ? "Unban user" : "Ban user"}</button>` : ""}
      </div>
    `)
    .join("") || "<p>No users tracked yet.</p>";
  els.adminUserList.querySelectorAll("[data-ban-user]").forEach((button) => {
    button.addEventListener("click", () => updateUserBan(button.dataset.banAction !== "unban", button.dataset.banUser));
  });
  const reportHistory = data.reportHistory || [];
  renderAdminReportFilters(data.reports || [], data.imageReports || [], reportHistory);
  els.adminReportList.innerHTML = (data.reports || [])
    .map((report) => `
      <div class="report-card detailed-report" data-report-issue="${escapeHtml(report.issueType || "other")}">
        <div class="report-main">
          <div class="report-header">
            <div>
              <p class="eyebrow">Data report - ${escapeHtml(formatReportIssueType(report.issueType))}</p>
              <h3>${escapeHtml(report.name || report.barcode || "Reported product")}</h3>
              <p>${escapeHtml(report.barcode || "")} - ${escapeHtml(report.userEmail || "Signed-in user")}</p>
            </div>
            <div class="report-meta-stack">
              <span class="report-date">${escapeHtml(formatAdminDate(report.createdAt))}</span>
              <span class="report-confidence ${Number(report.priorityScore || 0) >= 80 ? "high" : Number(report.priorityScore || 0) >= 55 ? "medium" : "low"}">${escapeHtml(report.priorityLabel || "Normal")} ${Number(report.priorityScore || 0)}/100</span>
              <span class="report-confidence ${escapeHtml(report.confidenceLevel || "medium")}">${escapeHtml(report.confidenceLabel || "Needs quick check")} ${Number(report.confidenceScore || 0)}/100</span>
              ${Number(report.duplicateCount || 1) > 1 ? `<span class="report-duplicate">${Number(report.duplicateCount)} similar reports</span>` : ""}
            </div>
          </div>
          <div class="report-product-image ${report.imageUrl ? "" : "hidden"}">
            <img class="admin-report-preview" src="${escapeHtml(report.imageUrl || "")}" alt="Reported product image" />
            <span>Product image from this report or saved listing</span>
          </div>
          <div class="report-compare-grid">
            <article class="report-side original">
              <p class="eyebrow">Original saved data</p>
              <h4>${escapeHtml(report.originalName || "Unnamed product")}</h4>
              <div class="report-facts">
                <span>Brand: ${escapeHtml(report.originalBrand || "Unknown")}</span>
                <span>${escapeHtml(formatAdminCategory(report.originalCategory, report.originalItemCategory))}</span>
                <span>Score ${escapeHtml(report.originalScore || "Unknown")}/100</span>
                <span>${Number(report.originalIngredientCount || 0)} ingredients</span>
              </div>
              <p class="report-summary">${escapeHtml(report.originalSummary || "No original summary saved.")}</p>
            </article>
            <article class="report-side requested">
              <p class="eyebrow">Requested change</p>
              <h4>${escapeHtml(report.proposedName || report.originalName || "Reported product")}</h4>
              <div class="report-facts">
                <span>Brand: ${escapeHtml(report.proposedBrand || report.originalBrand || "Unknown")}</span>
                <span>${escapeHtml(formatAdminCategory(report.proposedCategory, report.proposedItemCategory))}</span>
                <span>Score ${escapeHtml(report.proposedScore || "Unknown")}/100</span>
                <span>${Number(report.proposedIngredientCount || 0)} ingredients</span>
              </div>
              <p class="report-summary">${escapeHtml(report.proposedSummary || "User submitted corrected ingredient data.")}</p>
            </article>
          </div>
          <details class="report-ingredients">
            <summary>View submitted ingredient listing</summary>
            <p>${escapeHtml(report.ingredientText || "No ingredient text submitted.")}</p>
          </details>
          <details class="admin-edit-report">
            <summary>Edit before accepting</summary>
            <div class="admin-edit-grid">
              <label>Brand<input data-admin-edit="brand" value="${escapeHtml(report.proposedBrand || report.originalBrand || "")}" /></label>
              <label>Product<input data-admin-edit="name" value="${escapeHtml(getProductNameWithoutBrand({ name: report.proposedName || report.originalName || "", brand: report.proposedBrand || report.originalBrand || "" }))}" /></label>
              <label>Category<input data-admin-edit="category" value="${escapeHtml(report.proposedCategory || report.originalCategory || "")}" /></label>
              <label>Item type<input data-admin-edit="itemCategory" value="${escapeHtml(report.proposedItemCategory || report.originalItemCategory || "")}" /></label>
              <label>Score<input data-admin-edit="score" type="number" min="0" max="100" value="${escapeHtml(report.proposedScore || report.originalScore || "")}" /></label>
            </div>
            <label class="admin-edit-ingredients">Ingredients<textarea data-admin-edit="ingredients" rows="5">${escapeHtml(report.ingredientText || "")}</textarea></label>
          </details>
        </div>
        <div class="report-actions">
          <button type="button" class="secondary-button" data-report-preview="current" data-report-id="${escapeHtml(report.id)}">View current</button>
          <button type="button" class="secondary-button" data-report-preview="accepted" data-report-id="${escapeHtml(report.id)}">Preview accept</button>
          <button type="button" class="secondary-button" data-report-action="accept" data-report-id="${escapeHtml(report.id)}">Accept</button>
          <button type="button" class="secondary-button" data-report-action="decline" data-report-id="${escapeHtml(report.id)}">Decline</button>
        </div>
      </div>
    `)
    .join("") || "<p>No data reports waiting.</p>";
  els.adminReportList.innerHTML += reportHistory
    .map((report) => {
      const isAdminEditHistory = report.reportKind === "admin_edit";
      const historyMetaBadges = isAdminEditHistory
        ? `<span class="report-confidence high">Admin repair</span>`
        : `
              <span class="report-confidence ${Number(report.priorityScore || 0) >= 80 ? "high" : Number(report.priorityScore || 0) >= 55 ? "medium" : "low"}">${escapeHtml(report.priorityLabel || "Normal")} ${Number(report.priorityScore || 0)}/100</span>
              <span class="report-confidence ${escapeHtml(report.confidenceLevel || "medium")}">${escapeHtml(report.confidenceLabel || "Needs quick check")} ${Number(report.confidenceScore || 0)}/100</span>
            `;
      return `
      <div class="report-card detailed-report" data-report-issue="history">
        <div class="report-main">
          <div class="report-header">
            <div>
              <p class="eyebrow">Report history - ${escapeHtml(formatReportIssueType(report.issueType))}</p>
              <h3>${escapeHtml(report.name || report.barcode || "Reviewed product")}</h3>
              <p>${escapeHtml(report.barcode || "")} - ${escapeHtml(report.userEmail || "Signed-in user")}</p>
            </div>
            <div class="report-meta-stack">
              <span class="report-date">${escapeHtml(formatAdminDate(report.reviewedAt || report.createdAt))}</span>
              ${historyMetaBadges}
            </div>
          </div>
          <p class="report-status ${escapeHtml(report.status || "reviewed")}">${escapeHtml(toDisplayName(report.status || "reviewed"))}${report.reviewedBy ? ` by ${escapeHtml(report.reviewedBy)}` : ""}</p>
          ${report.reviewNote ? `<p class="report-review-note">Admin note: ${escapeHtml(report.reviewNote)}</p>` : ""}
          <div class="report-compare-grid">
            <article class="report-side original">
              <p class="eyebrow">Original saved data</p>
              <h4>${escapeHtml(report.originalName || "Unnamed product")}</h4>
              <div class="report-facts">
                <span>Brand: ${escapeHtml(report.originalBrand || "Unknown")}</span>
                <span>${escapeHtml(formatAdminCategory(report.originalCategory, report.originalItemCategory))}</span>
                <span>Score ${escapeHtml(report.originalScore || "Unknown")}/100</span>
                <span>${Number(report.originalIngredientCount || 0)} ingredients</span>
              </div>
              <p class="report-summary">${escapeHtml(report.originalSummary || "No original summary saved.")}</p>
            </article>
            <article class="report-side requested">
              <p class="eyebrow">Requested change</p>
              <h4>${escapeHtml(report.proposedName || report.originalName || "Reported product")}</h4>
              <div class="report-facts">
                <span>Brand: ${escapeHtml(report.proposedBrand || report.originalBrand || "Unknown")}</span>
                <span>${escapeHtml(formatAdminCategory(report.proposedCategory, report.proposedItemCategory))}</span>
                <span>Score ${escapeHtml(report.proposedScore || "Unknown")}/100</span>
                <span>${Number(report.proposedIngredientCount || 0)} ingredients</span>
              </div>
              <p class="report-summary">${escapeHtml(report.proposedSummary || "User submitted corrected ingredient data.")}</p>
            </article>
          </div>
          <details class="report-ingredients">
            <summary>View submitted ingredient listing</summary>
            <p>${escapeHtml(report.ingredientText || "No ingredient text submitted.")}</p>
          </details>
        </div>
        <div class="report-actions">
          ${report.barcode ? `<button type="button" class="secondary-button" data-history-listing="${escapeHtml(report.barcode || "")}" data-report-id="${escapeHtml(report.id)}">View listing</button>` : ""}
          ${report.reportKind === "image" ? "" : `
            <button type="button" class="secondary-button" data-history-action="reopen" data-report-id="${escapeHtml(report.id)}">Reopen</button>
            ${report.status === "accepted" ? `<button type="button" class="secondary-button" data-history-action="restore_original" data-report-id="${escapeHtml(report.id)}">Restore original</button>` : ""}
          `}
        </div>
      </div>
    `;
    })
    .join("");
  els.adminReportList.innerHTML += (data.imageReports || [])
    .map((report) => `
      <div class="report-card image-report-card" data-report-issue="image">
        <div>
          <p class="eyebrow">Image report</p>
          <h3>Product image</h3>
          <p>${escapeHtml(report.barcode || "")} - ${escapeHtml(report.userEmail || "Signed-in user")}</p>
          <p class="report-date">${escapeHtml(formatAdminDate(report.createdAt))}</p>
          <img class="admin-image-preview" src="${escapeHtml(report.imageUrl || "")}" alt="Pending product image" />
        </div>
        <div class="report-actions">
          <button type="button" class="secondary-button" data-image-action="accept" data-image-id="${escapeHtml(report.id)}">Accept image</button>
          <button type="button" class="secondary-button" data-image-action="decline" data-image-id="${escapeHtml(report.id)}">Decline</button>
        </div>
      </div>
    `)
    .join("");
  els.adminReportList.querySelectorAll("[data-report-action]").forEach((button) => {
    button.addEventListener("click", () => reviewReport(button.dataset.reportId, button.dataset.reportAction));
  });
  els.adminReportList.querySelectorAll("[data-report-preview]").forEach((button) => {
    button.addEventListener("click", () => previewReportProduct(button.dataset.reportId, button.dataset.reportPreview));
  });
  els.adminReportList.querySelectorAll("[data-image-action]").forEach((button) => {
    button.addEventListener("click", () => reviewProductImage(button.dataset.imageId, button.dataset.imageAction));
  });
  els.adminReportList.querySelectorAll("[data-history-action]").forEach((button) => {
    button.addEventListener("click", () => reviewReportHistory(button.dataset.reportId, button.dataset.historyAction));
  });
  els.adminReportList.querySelectorAll("[data-history-listing]").forEach((button) => {
    button.addEventListener("click", () => viewAdminHistoryListing(button.dataset.historyListing, button.dataset.reportId));
  });
  applyAdminReportFilter();
}

async function adminProductSearch() {
  const query = els.adminProductSearchInput.value.trim();
  if (query.length < 2) {
    els.adminProductResults.innerHTML = `<p class="ingredient-empty">Type a product, brand, or barcode.</p>`;
    return;
  }
  els.adminProductResults.innerHTML = `<p>Searching saved products...</p>`;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/product-search?q=${encodeURIComponent(query)}`, { headers: await apiHeadersAsync() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Product search failed.");
    renderAdminProductRows(data.products || [], els.adminProductResults);
  } catch (error) {
    els.adminProductResults.innerHTML = `<p>${escapeHtml(error.message || "Product search failed.")}</p>`;
  }
}

async function loadAdminRepairQueue() {
  els.adminRepairQueue.innerHTML = `<p>Finding weak listings...</p>`;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/repair-queue`, { headers: await apiHeadersAsync() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Repair queue could not load.");
    renderAdminProductRows(data.products || [], els.adminRepairQueue, { showReasons: true, returnAfterEdit: "repair" });
  } catch (error) {
    els.adminRepairQueue.innerHTML = `<p>${escapeHtml(error.message || "Repair queue could not load.")}</p>`;
  }
}

function renderAdminProductRows(products, container, options = {}) {
  if (!products.length) {
    container.innerHTML = `<p class="ingredient-empty">No saved products found.</p>`;
    return;
  }
  container.innerHTML = products.map((product) => {
    const safe = normalizeRenderableAnalysis(product);
    const reasons = Array.isArray(product.repairReasons) ? product.repairReasons : [];
    return `
      <article class="admin-product-row">
        <img class="history-thumb" src="${escapeHtml(getHistoryImage(safe))}" alt="${escapeHtml(safe.name)}" />
        <div>
          <strong>${escapeHtml(safe.name)}</strong>
          <span>${escapeHtml(safe.brand || safe.itemCategory || "Saved product")}</span>
          <small>${escapeHtml(safe.barcode || "")} · ${Number(safe.safetyScore || 0)}/100</small>
          ${options.showReasons && reasons.length ? `<p>${reasons.map(escapeHtml).join(" · ")}</p>` : ""}
        </div>
        <button type="button" class="secondary-button" data-admin-open-product="${escapeHtml(safe.barcode || "")}">Open</button>
        <button type="button" class="secondary-button" data-admin-edit-product="${escapeHtml(safe.barcode || "")}" data-admin-edit-return="${escapeHtml(options.returnAfterEdit || "")}">Edit</button>
      </article>
    `;
  }).join("");
  container.querySelectorAll("[data-admin-open-product]").forEach((button) => {
    button.addEventListener("click", () => openAdminProduct(button.dataset.adminOpenProduct));
  });
  container.querySelectorAll("[data-admin-edit-product]").forEach((button) => {
    button.addEventListener("click", () => editAdminProduct(button.dataset.adminEditProduct, button.dataset.adminEditReturn || ""));
  });
}

async function openAdminProduct(barcode) {
  const clean = normalizeBarcode(barcode || "");
  if (!clean) return;
  try {
    const product = await getSharedSavedProduct(clean);
    if (!product) throw new Error("Saved product not found.");
    els.adminDialog.close();
    state.adminPreviewOpen = true;
    switchView("scan");
    renderResult(product, { skipHistoryRender: true, allowImageUpload: Boolean(!product.imageUrl) });
  } catch (error) {
    toast(error.message || "Could not open product.");
  }
}

async function editAdminProduct(barcode, returnAfterEdit = "") {
  const clean = normalizeBarcode(barcode || "");
  if (!clean) return;
  try {
    const product = await getSharedSavedProduct(clean);
    if (!product) throw new Error("Saved product not found.");
    state.currentAnalysis = normalizeRenderableAnalysis(product);
    state.adminReturnAfterEdit = returnAfterEdit;
    els.adminDialog.close();
    openCategoryDialog();
  } catch (error) {
    toast(error.message || "Could not edit product.");
  }
}

async function mergeAdminProducts() {
  const keepBarcode = normalizeBarcode(els.mergeSourceBarcode.value);
  const mergeBarcode = normalizeBarcode(els.mergeTargetBarcode.value);
  if (!keepBarcode || !mergeBarcode || keepBarcode === mergeBarcode) {
    toast("Enter two different barcodes.");
    return;
  }
  if (!window.confirm(`Merge ${mergeBarcode} into ${keepBarcode}? The duplicate barcode will be removed.`)) return;
  els.mergeProductsButton.disabled = true;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/merge-products`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ keepBarcode, mergeBarcode }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not merge products.");
    els.mergeTargetBarcode.value = "";
    toast("Products merged.");
    if (data.product) renderAdminProductRows([data.product], els.adminProductResults);
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not merge products.");
  } finally {
    els.mergeProductsButton.disabled = false;
  }
}

async function viewAdminHistoryListing(barcode, reportId) {
  const clean = normalizeBarcode(barcode || "");
  const card = document.querySelector(`[data-report-id="${reportId}"]`)?.closest(".report-card");
  if (!clean) return;
  try {
    const saved = await getSharedSavedProduct(clean);
    const analysis = saved || buildAdminCurrentReportPreview(card);
    els.adminDialog.close();
    state.adminPreviewOpen = true;
    switchView("scan");
    renderResult(normalizeRenderableAnalysis({
      ...analysis,
      barcode: clean,
      source: saved ? "Saved database" : "Admin preview - current listing",
    }), { skipHistoryRender: true });
    toast(saved ? "Viewing saved listing." : "Viewing report listing preview.");
  } catch {
    if (card) previewReportProduct(reportId, "current");
  }
}

function previewReportProduct(reportId, mode) {
  const card = document.querySelector(`[data-report-id="${reportId}"]`)?.closest(".report-card");
  if (!card) return;
  const analysis = mode === "accepted" ? buildAdminReportOverride(card) : buildAdminCurrentReportPreview(card);
  els.adminDialog.close();
  state.adminPreviewOpen = true;
  switchView("scan");
  renderResult(normalizeRenderableAnalysis({
    ...analysis,
    source: mode === "accepted" ? "Admin preview - after accept" : "Admin preview - current listing",
  }), { skipHistoryRender: true });
  toast(mode === "accepted" ? "Previewing what it will look like after accepting." : "Viewing the current product page.");
}

async function returnToAdminFromPreview() {
  state.adminPreviewOpen = false;
  switchView("scan");
  await openAdminPanel();
}

function buildAdminCurrentReportPreview(card) {
  const category = inferAdminCategoryFromText(getReportFact(card, ".report-side.original", "("));
  const ingredientText = card.querySelector(".report-ingredients p")?.textContent?.trim() || "";
  const original = {
    name: card.querySelector(".report-side.original h4")?.textContent?.trim() || "Current product",
    brand: getReportFact(card, ".report-side.original", "Brand:").replace(/^Brand:\s*/i, ""),
    category,
    itemCategory: inferAdminItemFromFact(getReportFact(card, ".report-side.original", "(")),
    safetyScore: parseAdminScore(getReportFact(card, ".report-side.original", "Score")),
    ingredientsText: ingredientText,
    ingredients: ingredientText ? splitIngredients(ingredientText).map((item) => classifyIngredient(item, category)) : [],
    summary: card.querySelector(".report-side.original .report-summary")?.textContent?.trim() || "",
    imageUrl: card.querySelector(".admin-report-preview")?.getAttribute("src") || "",
    createdAt: new Date().toISOString(),
  };
  const displayBarcode = card.querySelector(".report-header p:not(.eyebrow)")?.textContent?.split(" - ")?.[0]?.trim();
  if (displayBarcode) original.barcode = displayBarcode;
  return original;
}

function getReportFact(card, sectionSelector, startsWith) {
  const facts = [...card.querySelectorAll(`${sectionSelector} .report-facts span`)].map((item) => item.textContent.trim());
  return facts.find((text) => startsWith === "(" ? text.includes("(") : text.toLowerCase().startsWith(startsWith.toLowerCase())) || "";
}

function inferAdminCategoryFromText(text) {
  const lower = String(text || "").toLowerCase();
  if (lower.includes("beauty")) return "beauty";
  if (lower.includes("food")) return "food";
  return "unknown";
}

function inferAdminItemFromFact(text) {
  return String(text || "").replace(/\s*\([^)]*\)\s*/g, "").trim() || "Product";
}

function parseAdminScore(text) {
  const match = String(text || "").match(/(\d{1,3})/);
  return match ? clamp(Number(match[1]), 0, 100) : 60;
}

function renderAdminReportFilters(reports, imageReports, reportHistory = []) {
  const counts = {
    all: reports.length + imageReports.length,
    ingredients: reports.filter((report) => report.issueType === "ingredients").length,
    name: reports.filter((report) => report.issueType === "product_name" || report.issueType === "productName").length,
    brand: reports.filter((report) => report.issueType === "brand").length,
    photo: reports.filter((report) => report.issueType === "photo").length + imageReports.length,
    history: reportHistory.length,
  };
  els.adminReportFilters.innerHTML = [
    ["all", "All"],
    ["ingredients", "Ingredients"],
    ["name", "Names"],
    ["brand", "Brands"],
    ["photo", "Photos"],
    ["history", "History"],
  ].map(([key, label]) => `
    <button type="button" class="admin-filter-chip ${state.adminReportFilter === key ? "active" : ""}" data-admin-report-filter="${key}">
      ${label} <span>${Number(counts[key] || 0)}</span>
    </button>
  `).join("");
  els.adminReportFilters.querySelectorAll("[data-admin-report-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.adminReportFilter = button.dataset.adminReportFilter;
      els.adminReportFilters.querySelectorAll(".admin-filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
      applyAdminReportFilter();
    });
  });
}

function applyAdminReportFilter() {
  const filter = state.adminReportFilter;
  els.adminReportList.querySelectorAll("[data-report-issue]").forEach((card) => {
    const issue = card.dataset.reportIssue;
    const show = filter === "all"
      ? issue !== "history"
      : issue === filter
      || (filter === "name" && (issue === "productName" || issue === "product_name"))
      || (filter === "photo" && issue === "image");
    card.classList.toggle("hidden", !show);
  });
}

function populateAdminLimits(limits) {
  els.limitSignedInAi.value = Number(limits.signedInAi ?? 15);
  els.limitGuestAi.value = Number(limits.guestAi ?? 5);
  els.limitSearches.value = Number(limits.searches ?? 20);
  els.limitCategoryChecks.value = Number(limits.categoryVerifications ?? 8);
  els.limitImageUploads.value = Number(limits.imageUploads ?? 8);
}

function formatReportIssueType(type) {
  return {
    ingredients: "Ingredients",
    product_name: "Product name",
    brand: "Brand",
    photo: "Photo",
    admin_edit: "Admin repair",
  }[type] || "Ingredients";
}

function formatAdminCategory(category, itemCategory) {
  const broad = category === "food" ? "Food / Drink" : category === "beauty" ? "Beauty / Hair" : category || "Unknown";
  return itemCategory ? `${itemCategory} (${broad})` : broad;
}

function formatAdminDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

async function reviewReport(reportId, action) {
  if (!reportId || !["accept", "decline"].includes(action)) return;
  try {
    const card = document.querySelector(`[data-report-id="${reportId}"]`)?.closest(".report-card");
    const overrideAnalysis = action === "accept" && card ? buildAdminReportOverride(card) : null;
    const reviewNote = action === "decline"
      ? window.prompt("Optional: why are you declining this report?", "") || ""
      : "";
    const response = await fetch(`${getApiBaseUrl()}/api/admin/review-report`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ reportId, action, overrideAnalysis, reviewNote }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not review report.");
    toast(action === "accept" ? "Listing fixed." : "Report declined.");
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not review report.");
  }
}

async function reviewReportHistory(reportId, action) {
  if (!reportId || !["reopen", "restore_original"].includes(action)) return;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/reopen-report`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ reportId, action }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not update report.");
    toast(action === "restore_original" ? "Original product restored." : "Report reopened.");
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not update report.");
  }
}

function buildAdminReportOverride(card) {
  const get = (key) => card.querySelector(`[data-admin-edit="${key}"]`)?.value?.trim() || "";
  const brand = toDisplayName(get("brand"));
  const productName = toDisplayName(get("name"));
  const displayName = brand && productName && !productName.toLowerCase().startsWith(brand.toLowerCase())
    ? `${brand}, ${productName}`
    : productName || brand;
  const category = get("category").toLowerCase().includes("beauty") ? "beauty" : get("category").toLowerCase().includes("food") ? "food" : get("category");
  const ingredientsText = get("ingredients");
  const ingredients = ingredientsText ? splitIngredients(ingredientsText).map((item) => classifyIngredient(item, category || "unknown")) : [];
  const typedScore = Number(get("score"));
  const score = Number.isFinite(typedScore) ? clamp(Math.round(typedScore), 0, 100) : calculateScore(ingredients, {}, category || "unknown");
  return {
    name: displayName,
    detected_product_name: productName || displayName,
    brand,
    detected_brand: brand,
    category,
    product_category: category,
    itemCategory: toDisplayName(get("itemCategory")),
    item_category: toDisplayName(get("itemCategory")),
    ingredientsText,
    extracted_ingredients_text: ingredientsText,
    ingredients,
    safetyScore: score,
    safety_score: score,
    scoreColor: scoreColor(score),
    score_color: scoreColor(score),
    summary: buildSummary(score, ingredients, category || "unknown"),
  };
}

async function reviewProductImage(imageId, action) {
  if (!imageId || !["accept", "decline"].includes(action)) return;
  try {
    const reviewNote = action === "decline"
      ? window.prompt("Optional: why are you declining this image?", "") || ""
      : "";
    const response = await fetch(`${getApiBaseUrl()}/api/admin/review-product-image`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ imageId, action, reviewNote }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not review image.");
    toast(action === "accept" ? "Product image saved." : "Product image declined.");
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not review image.");
  }
}

async function saveAdminLimits() {
  const limits = {
    signedInAi: els.limitSignedInAi.value,
    guestAi: els.limitGuestAi.value,
    searches: els.limitSearches.value,
    categoryVerifications: els.limitCategoryChecks.value,
    imageUploads: els.limitImageUploads.value,
  };
  els.saveLimitsButton.disabled = true;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/limits`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify(limits),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not save limits.");
    populateAdminLimits(data.limits || limits);
    toast("Limits updated.");
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not save limits.");
  } finally {
    els.saveLimitsButton.disabled = false;
  }
}

async function grantAdminAccess() {
  const email = els.grantAdminEmail.value.trim().toLowerCase();
  if (!email) return;
  els.grantAdminButton.disabled = true;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/grant-admin`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not grant admin access.");
    els.grantAdminEmail.value = "";
    toast("Admin granted.");
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not grant admin access.");
  } finally {
    els.grantAdminButton.disabled = false;
  }
}

async function grantUnlimitedAccess() {
  const email = els.grantUnlimitedEmail.value.trim().toLowerCase();
  if (!email) return;
  els.grantUnlimitedButton.disabled = true;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/grant-unlimited`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not grant unlimited access.");
    els.grantUnlimitedEmail.value = "";
    toast("Unlimited access granted.");
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not grant unlimited access.");
  } finally {
    els.grantUnlimitedButton.disabled = false;
  }
}

async function updateUserBan(shouldBan, presetEmail = "") {
  const email = (presetEmail || els.banUserEmail?.value || "").trim().toLowerCase();
  if (!email) return;
  if (email === OWNER_ADMIN_EMAIL && shouldBan) {
    toast("The owner account cannot be banned.");
    return;
  }
  const activeButton = shouldBan ? els.banUserButton : els.unbanUserButton;
  if (activeButton) activeButton.disabled = true;
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/ban-user`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email, action: shouldBan ? "ban" : "unban" }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not update user access.");
    if (els.banUserEmail) els.banUserEmail.value = "";
    toast(shouldBan ? "User banned." : "User unbanned.");
    await loadAdminSummary();
  } catch (error) {
    toast(error.message || "Could not update user access.");
  } finally {
    if (activeButton) activeButton.disabled = false;
  }
}

function openReportDialog() {
  if (!state.currentAnalysis?.barcode) {
    toast("Scan a product first.");
    return;
  }
  if (!hasAuthenticatedSession()) {
    toast("Sign in with Google to report incorrect data.");
    return;
  }
  chooseReportType("ingredients");
  els.reportBrandName.value = state.currentAnalysis.brand || state.currentAnalysis.detected_brand || "";
  els.reportProductName.value = getProductNameWithoutBrand(state.currentAnalysis);
  els.reportFrontPhoto.value = "";
  els.reportBackPhoto.value = "";
  els.reportIngredients.value = state.currentAnalysis.ingredientsText || "";
  updateReportPhotoChecks();
  els.reportDialog.showModal();
}

async function submitIncorrectReport() {
  if (!state.currentAnalysis?.barcode) return;
  const issueType = state.reportIssueType || "ingredients";
  const ingredientText = els.reportIngredients.value.trim();
  const brand = toDisplayName(els.reportBrandName.value.trim());
  const productName = toDisplayName(els.reportProductName.value.trim()) || getProductNameWithoutBrand(state.currentAnalysis);
  if (issueType === "ingredients" && !ingredientText) {
    toast("Add or extract the correct ingredients first.");
    return;
  }
  if (issueType === "product_name" && !productName) {
    toast("Enter the correct product name.");
    return;
  }
  if (issueType === "brand" && !brand) {
    toast("Enter the correct brand name.");
    return;
  }
  if (issueType === "photo" && !els.reportFrontPhoto.files[0]) {
    toast("Upload the correct product photo.");
    return;
  }
  els.submitReportButton.disabled = true;
  try {
    const frontImage = els.reportFrontPhoto.files[0]
      ? await fileToCompressedDataUrl(els.reportFrontPhoto.files[0])
      : "";
    const proposedAnalysis = issueType === "ingredients"
      ? buildReportCorrection(ingredientText, frontImage)
      : buildReportMetadataCorrection({ issueType, productName, brand, frontImage, ingredientText });
    const response = await fetch(`${getApiBaseUrl()}/api/report-incorrect`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        barcode: state.currentAnalysis.barcode,
        userEmail: state.user?.email || "",
        userId: state.user?.id || "",
        issueType,
        original: state.currentAnalysis,
        proposedAnalysis: {
          ...proposedAnalysis,
          name: brand && !productName.toLowerCase().startsWith(brand.toLowerCase()) ? `${brand}, ${productName}` : productName,
          detected_product_name: productName,
          brand,
          detected_brand: brand,
        },
        frontImage,
        productImage: state.currentAnalysis.imageUrl || "",
        ingredientText,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Report could not be sent.");
    els.reportDialog.close();
    toast(data.duplicate ? "Similar report already exists. Your feedback was added." : "Report sent for admin review.");
  } catch (error) {
    toast(error.message || "Report could not be sent.");
  } finally {
    els.submitReportButton.disabled = false;
  }
}

function buildReportMetadataCorrection({ productName, brand, frontImage, ingredientText }) {
  const baseCategory = state.currentAnalysis.category || "unknown";
  const fallbackIngredientText = ingredientText || state.currentAnalysis.ingredientsText || state.currentAnalysis.extracted_ingredients_text || "";
  const ingredients = fallbackIngredientText
    ? splitIngredients(fallbackIngredientText).map((item) => classifyIngredient(item, baseCategory))
    : state.currentAnalysis.ingredients || [];
  const displayName = brand && productName && !productName.toLowerCase().startsWith(brand.toLowerCase())
    ? `${brand}, ${productName}`
    : productName || state.currentAnalysis.name;
  const score = calculateScore(ingredients, state.currentAnalysis, baseCategory);
  return {
    ...state.currentAnalysis,
    name: displayName,
    detected_product_name: productName || state.currentAnalysis.detected_product_name || state.currentAnalysis.name,
    brand: brand || state.currentAnalysis.brand || "",
    detected_brand: brand || state.currentAnalysis.detected_brand || state.currentAnalysis.brand || "",
    imageUrl: frontImage || state.currentAnalysis.imageUrl || "",
    ingredientsText: fallbackIngredientText,
    extracted_ingredients_text: fallbackIngredientText,
    ingredients,
    safetyScore: Number.isFinite(score) ? score : state.currentAnalysis.safetyScore,
    safety_score: Number.isFinite(score) ? score : state.currentAnalysis.safetyScore,
    scoreColor: scoreColor(Number.isFinite(score) ? score : state.currentAnalysis.safetyScore),
    score_color: scoreColor(Number.isFinite(score) ? score : state.currentAnalysis.safetyScore),
    summary: buildSummary(Number.isFinite(score) ? score : state.currentAnalysis.safetyScore, ingredients, baseCategory),
    source: "Saved user correction",
    correctedAt: new Date().toISOString(),
  };
}

function chooseReportType(type) {
  const allowed = ["ingredients", "product_name", "brand", "photo"];
  state.reportIssueType = allowed.includes(type) ? type : "ingredients";
  els.reportTypeButtons.forEach((button) => {
    const selected = button.dataset.reportType === state.reportIssueType;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.querySelectorAll(".report-field").forEach((field) => field.classList.add("hidden"));
  if (state.reportIssueType === "ingredients") {
    document.querySelector(".report-ingredient-photo-field")?.classList.remove("hidden");
    document.querySelector(".report-ingredients-field")?.classList.remove("hidden");
  }
  if (state.reportIssueType === "product_name") {
    document.querySelector(".report-name-field")?.classList.remove("hidden");
  }
  if (state.reportIssueType === "brand") {
    document.querySelector(".report-brand-field")?.classList.remove("hidden");
  }
  if (state.reportIssueType === "photo") {
    document.querySelector(".report-front-field")?.classList.remove("hidden");
  }
}

async function handleReportIngredientPhoto() {
  updateReportPhotoChecks();
  const file = els.reportBackPhoto.files?.[0];
  if (!file) return;
  els.reportIngredients.value = "Extracting ingredients from photo...";
  els.reportBackPhoto.disabled = true;
  try {
    const imageUrl = await fileToCompressedDataUrl(file, { maxSide: 1200, quality: 0.72 });
    const response = await fetch(`${getApiBaseUrl()}/api/extract-ingredients`, {
      method: "POST",
      headers: await apiHeadersAsync({ "Content-Type": "application/json" }),
      body: JSON.stringify({ imageUrl }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not extract ingredients.");
    els.reportIngredients.value = data.ingredientText || "";
    els.reportBackPhoto.value = "";
    updateReportPhotoChecks();
    toast("Ingredients extracted. Photo removed.");
  } catch (error) {
    els.reportIngredients.value = "";
    toast(error.message || "Could not extract ingredients.");
  } finally {
    els.reportBackPhoto.disabled = false;
  }
}

function updateReportPhotoChecks() {
  const frontSelected = Boolean(els.reportFrontPhoto.files?.[0]);
  const backSelected = Boolean(els.reportBackPhoto.files?.[0]);
  els.reportFrontPhoto.closest(".photo-drop").classList.toggle("has-file", frontSelected);
  els.reportBackPhoto.closest(".photo-drop").classList.toggle("has-file", backSelected);
  els.reportFrontPhotoCheck.classList.toggle("hidden", !frontSelected);
  els.reportBackPhotoCheck.classList.toggle("hidden", !backSelected);
}

function buildReportCorrection(ingredientText, frontImage) {
  const category = state.currentAnalysis.category || "unknown";
  const ingredients = splitIngredients(ingredientText).map((name) => classifyIngredient(name, category));
  const score = calculateScore(ingredients, {}, state.currentAnalysis.category || "unknown");
  return {
    ...state.currentAnalysis,
    source: "Saved user correction",
    ingredientsText: ingredientText,
    extracted_ingredients_text: ingredientText,
    ingredients,
    safetyScore: score,
    safety_score: score,
    scoreColor: scoreColor(score),
    score_color: scoreColor(score),
    itemCategory: inferItemCategory(state.currentAnalysis, ingredients),
    item_category: inferItemCategory(state.currentAnalysis, ingredients),
    imageUrl: frontImage || state.currentAnalysis.imageUrl || "",
    correctedAt: new Date().toISOString(),
  };
}

function fileToCompressedDataUrl(file, options = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSide = options.maxSide || 1100;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", options.quality || 0.72));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function toast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 3000);
}

function initOnboarding() {
  const dismissed = localStorage.getItem("greenscan.onboardingDismissed") === "true";
  els.onboardingPanel.classList.toggle("hidden", dismissed);
}

function dismissOnboarding() {
  localStorage.setItem("greenscan.onboardingDismissed", "true");
  els.onboardingPanel.classList.add("hidden");
}

function cleanupLocalCache(options = {}) {
  try {
    const products = JSON.parse(localStorage.getItem(productStorageKey()) || "{}");
    const entries = Object.entries(products)
      .sort(([, a], [, b]) => String(b.savedAt || b.createdAt || "").localeCompare(String(a.savedAt || a.createdAt || "")));
    const productLimit = options.aggressive ? 12 : localCachePolicy.productLimit;
    const compactEntries = entries.slice(0, productLimit).map(([barcode, product], index) => {
      const normalized = compactProductAnalysis(product, index);
      if (!normalized) return [barcode, product];
      const shouldStripImage = options.aggressive && typeof normalized.imageUrl === "string" && normalized.imageUrl.startsWith("data:");
      return [barcode, shouldStripImage ? { ...normalized, imageUrl: "" } : normalized];
    });
    if (entries.length > productLimit || options.aggressive) {
      localStorage.setItem(productStorageKey(), JSON.stringify(Object.fromEntries(compactEntries)));
    }
    const historyLimit = options.aggressive ? 6 : localCachePolicy.historyLimit;
    const history = getHistory()
      .slice(0, historyLimit)
      .map((item, index) => compactHistoryAnalysis(item, { stripDataImage: options.aggressive && index > 2 }));
    localStorage.setItem(historyStorageKey(), JSON.stringify(history));
    const favorites = getFavoriteProducts()
      .slice(0, options.aggressive ? 8 : localCachePolicy.favoriteLimit)
      .map((item, index) => compactHistoryAnalysis(item, { stripDataImage: options.aggressive || shouldStripInlineImage(item.imageUrl, index, localCachePolicy.keepHistoryImages) }));
    localStorage.setItem(favoriteStorageKey(), JSON.stringify(favorites));
  } catch {
    // Cleanup is best effort.
  }
}

function initTheme() {
  document.body.classList.add("theme-dark");
  localStorage.setItem("clearscan.theme", "dark");
}

function toggleTheme() {
  document.body.classList.add("theme-dark");
  localStorage.setItem("clearscan.theme", "dark");
}

function initAuth() {
  const redirectedUser = getGoogleRedirectUser();
  if (redirectedUser) {
    revokeAccountSession();
    clearAccountSession();
    state.user = redirectedUser;
    state.accountSyncStarted = false;
    state.userAiSettings = loadUserAiSettings();
    loadPreferencesForCurrentAccount();
    saveGoogleUserProfile(state.user);
    localStorage.setItem("clearscan.user", JSON.stringify(state.user));
    requestPersistentAppStorage();
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    updateAccountUi();
    syncAccountData();
    refreshAdminStatus();
    return;
  }

  try {
    state.user = JSON.parse(localStorage.getItem("clearscan.user") || "null");
    if (!isStoredGoogleUserValid(state.user)) {
      const profile = getStoredGoogleUserProfile();
      if (profile) {
        // Token expired but identity remains; GIS silent refresh will renew it.
        state.user = { ...profile, idToken: null };
        localStorage.setItem("clearscan.user", JSON.stringify(state.user));
      } else {
        state.user = null;
        localStorage.removeItem("clearscan.user");
      }
    }
  } catch {
    state.user = null;
  }
  state.userAiSettings = loadUserAiSettings();
  loadPreferencesForCurrentAccount();
  updateAccountUi();
  if (hasAuthenticatedSession()) {
    initGoogleSignIn();
    syncAccountData();
    refreshAdminStatus();
  } else if (state.user) {
    restoreAuthenticatedAccount();
  } else {
    initGoogleSignIn();
    refreshAdminStatus();
  }
}

async function restoreAuthenticatedAccount() {
  const refreshed = await ensureFreshIdToken();
  initGoogleSignIn();
  if (!refreshed) return;
  state.accountSyncStarted = false;
  await syncAccountData();
  refreshAdminStatus();
}

function getStoredAccountSession() {
  try {
    const session = JSON.parse(localStorage.getItem(accountSessionStorageKey) || "null");
    return /^gs_[a-f0-9]{64}$/i.test(session?.token || "") ? session : null;
  } catch {
    return null;
  }
}

function saveAccountSession(token, expiresAt) {
  if (!/^gs_[a-f0-9]{64}$/i.test(token || "")) return;
  try {
    localStorage.setItem(accountSessionStorageKey, JSON.stringify({ token, expiresAt: expiresAt || "" }));
  } catch {
    // The short-lived Google token remains available if storage is blocked.
  }
}

function clearAccountSession() {
  try {
    localStorage.removeItem(accountSessionStorageKey);
  } catch {}
}

function hasAuthenticatedSession() {
  return Boolean(state.user && (getStoredAccountSession()?.token || state.user.idToken));
}

async function requestPersistentAppStorage() {
  try {
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    // Persistence is browser-managed and optional.
  }
}

function hasUsableIdToken() {
  return Boolean(state.user?.idToken && isStoredGoogleUserValid(state.user));
}

async function ensureFreshIdToken() {
  if (getStoredAccountSession()?.token) return true;
  if (hasUsableIdToken()) return true;
  const profile = getStoredGoogleUserProfile();
  if (!profile) return false;
  // Ask GIS for a fresh token silently (auto-select, no account chooser).
  return await new Promise((resolve) => {
    let resolved = false;
    const done = (ok) => {
      if (!resolved) {
        resolved = true;
        window.clearTimeout(timer);
        resolve(ok);
      }
    };
    const start = Date.now();
    const timer = window.setTimeout(() => done(false), 9000);
    const poll = window.setInterval(() => {
      if (!window.google?.accounts?.id) {
        if (Date.now() - start > 8000) done(false);
        return;
      }
      window.clearInterval(poll);
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response?.credential) {
            const parsed = parseJwt(response.credential);
            if (parsed?.email) {
              state.user = {
                id: parsed.sub || parsed.email,
                email: parsed.email,
                name: parsed.name || parsed.email.split("@")[0],
                picture: parsed.picture || "",
                idToken: response.credential,
              };
              saveGoogleUserProfile(state.user);
              localStorage.setItem("clearscan.user", JSON.stringify(state.user));
              updateAccountUi();
              done(true);
              return;
            }
          }
          done(false);
        },
        auto_select: true,
        cancel_on_tap_outside: false,
      });
      window.google.accounts.id.prompt((notif) => {
        if (notif.isNotDisplayed() || notif.isSkippedMoment() || notif.isDismissedMoment()) {
          done(false);
        }
      });
    }, 150);
  });
}

function loginWithGoogle() {
  const nonce = crypto.randomUUID();
  const nonceRecord = JSON.stringify({ nonce, createdAt: Date.now() });
  try {
    sessionStorage.setItem("clearscan.googleNonce", nonce);
    localStorage.setItem(googleNonceStorageKey, nonceRecord);
  } catch {
    // Google can still validate the returned token; the redirect may need to be retried if storage is blocked.
  }
  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: `${window.location.origin}${window.location.pathname}`,
    response_type: "id_token",
    scope: "openid email profile",
    nonce,
    prompt: "select_account",
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function getGoogleRedirectUser() {
  if (!window.location.hash.includes("id_token=")) return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const profile = parseJwt(params.get("id_token") || "");
  const idToken = params.get("id_token") || "";
  let expectedNonce = "";
  try {
    expectedNonce = sessionStorage.getItem("clearscan.googleNonce") || "";
    if (!expectedNonce) {
      const saved = JSON.parse(localStorage.getItem(googleNonceStorageKey) || "null");
      if (saved?.nonce && Date.now() - Number(saved.createdAt || 0) < 10 * 60 * 1000) {
        expectedNonce = saved.nonce;
      }
    }
    sessionStorage.removeItem("clearscan.googleNonce");
    localStorage.removeItem(googleNonceStorageKey);
  } catch {
    return null;
  }
  if (!profile?.email || !expectedNonce || profile.nonce !== expectedNonce) return null;
  if (profile.aud !== googleClientId) return null;
  if (!isJwtTimeValid(profile)) return null;
  return {
    id: profile.sub || profile.email,
    email: profile.email,
    name: profile.name || profile.email.split("@")[0],
    picture: profile.picture || "",
    idToken,
  };
}

function initGoogleSignIn() {
  const start = Date.now();
  const timer = window.setInterval(() => {
    if (window.google?.accounts?.id) {
      window.clearInterval(timer);
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: completeGoogleCredentialLogin,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }

    if (Date.now() - start > 8000) window.clearInterval(timer);
  }, 150);
}

function completeGoogleCredentialLogin(response) {
  const profile = parseJwt(response.credential);
  if (!profile?.email || profile.aud !== googleClientId || !isJwtTimeValid(profile)) {
    toast("Google sign-in failed.");
    return;
  }

  revokeAccountSession();
  clearAccountSession();
  state.user = {
    id: profile.sub || profile.email,
    email: profile.email,
    name: profile.name || profile.email.split("@")[0],
    picture: profile.picture || "",
    idToken: response.credential,
  };
  saveGoogleUserProfile(state.user);
  requestPersistentAppStorage();
  state.accountSyncStarted = false;
  state.userAiSettings = loadUserAiSettings();
  loadPreferencesForCurrentAccount();
  localStorage.setItem("clearscan.user", JSON.stringify(state.user));
  updateAccountUi();
  renderHistory();
  syncAccountData();
  refreshAdminStatus();
  switchView("forYou");
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  toast("Logged in.");
}

function parseJwt(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(atob(payload).split("").map((char) => {
      return `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`;
    }).join("")));
  } catch {
    return null;
  }
}

function saveGoogleUserProfile(user) {
  if (!user?.email) return;
  try {
    localStorage.setItem("clearscan.userProfile", JSON.stringify({
      id: user.id || user.email,
      email: user.email,
      name: user.name || "",
      picture: user.picture || "",
    }));
  } catch {}
}

function getStoredGoogleUserProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem("clearscan.userProfile") || "null");
    return profile?.email ? profile : null;
  } catch {
    return null;
  }
}

function isStoredGoogleUserValid(user) {
  if (!user?.idToken) return false;
  const profile = parseJwt(user.idToken);
  return Boolean(profile?.email && profile.aud === googleClientId && isJwtTimeValid(profile));
}

function isJwtTimeValid(profile) {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Number(profile?.exp || 0);
  const notBefore = Number(profile?.nbf || 0);
  return Boolean(expiresAt && expiresAt > now + 30 && (!notBefore || notBefore <= now + 30));
}

function logout() {
  revokeAccountSession();
  state.user = null;
  state.isAdmin = false;
  state.accountSyncStarted = false;
  state.userAiSettings = { provider: "openai", apiKey: "" };
  loadPreferencesForCurrentAccount();
  localStorage.removeItem("clearscan.user");
  localStorage.removeItem("clearscan.userProfile");
  clearAccountSession();
  try {
    window.google?.accounts?.id?.disableAutoSelect?.();
  } catch {}
  updateAccountUi();
  updateAdminButton();
  renderHistory();
  if (state.activeView === "forYou") switchView("home");
  toast("Logged out.");
}

function revokeAccountSession() {
  const session = getStoredAccountSession();
  if (!session?.token) return;
  fetch(`${getApiBaseUrl()}/api/account/session`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.token}` },
    keepalive: true,
  }).catch(() => {});
}

function updateAccountUi() {
  if (state.user) {
    const providerLabel = getAiProviderLabel(state.userAiSettings.provider);
    els.accountTitle.textContent = state.user.name || state.user.email || "Signed in";
    els.accountNote.textContent = state.userAiSettings.apiKey
      ? `Signed in as ${state.user.email}. Using your ${providerLabel} API key.`
      : `Signed in as ${state.user.email}. GreenScan AI is provided by default.`;
    els.googleLoginButton.classList.add("hidden");
    els.signinPromptPanel.classList.add("hidden");
    els.logoutButton.classList.remove("hidden");
    els.aiProviderButton.textContent = state.userAiSettings.apiKey ? `AI Provider: ${providerLabel}` : "AI Provider";
    els.aiProviderButton.disabled = false;
    updateSearchAccessUi();
    updateAdminButton();
    return;
  }

  els.accountTitle.textContent = "Not signed in";
  els.accountNote.textContent = "Sign in with Google to save and view scan history.";
  els.googleLoginButton.classList.remove("hidden");
  els.signinPromptPanel.classList.remove("hidden");
  els.logoutButton.classList.add("hidden");
  els.aiProviderButton.textContent = "AI Provider";
  els.aiProviderButton.disabled = true;
  updateSearchAccessUi();
  updateAdminButton();
}

function updateSearchAccessUi() {
  const locked = !state.user;
  els.productSearchInput.disabled = locked;
  const submit = els.productSearchForm.querySelector("button[type='submit']");
  if (submit) submit.disabled = locked;
  if (locked && state.activeView === "search") renderSearchLoginPrompt();
  if (!locked && state.activeView === "search" && !els.productSearchResults.querySelector(".search-result-item")) {
    els.productSearchResults.innerHTML = state.searchMode === "ingredients"
      ? `<p>Search food additives, cosmetic chemicals, preservatives, dyes, fragrance, or allergens.</p>`
      : `<p>Search food, drinks, and beauty products by name.</p>`;
    renderRecentSearches();
  }
}

function getAiProviderLabel(provider) {
  if (provider === "anthropic") return "Anthropic";
  if (provider === "google") return "Google";
  return "ChatGPT";
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeComparableText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

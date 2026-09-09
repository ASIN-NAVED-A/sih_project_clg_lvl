import { useState, useEffect, useRef } from "react"
import {
  Home,
  ShoppingBag,
  BarChart3,
  Landmark,
  User,
  ArrowLeft,
  ArrowRight,
  X,
  Mic,
  Camera,
  Image as ImageIcon,
  Flashlight,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  Package,
  IndianRupee,
  Star,
  Bell,
  Share2,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Scissors,
  Layers,
  Search,
  Bookmark,
  Smartphone,
  Phone,
  Lock,
  ChevronRight,
  TrendingUp,
  Award,
  CircleDollarSign,
  Plus,
  Minus,
  Sparkle
} from "lucide-react"

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Screen =
  | "auth-signin" | "auth-register"
  | "language" | "home" | "camera" | "processing"
  | "voice-details" | "catalog" | "price" | "publish"
  | "success" | "products" | "sales" | "govt" | "trust" | "profile"

type LangCode = "ml" | "hi" | "bn" | "ta" | "te" | "kn" | "mr" | "en"

interface T {
  name: string; tagline: string; sub: string; speak_to_use: string
  nav_home: string; nav_products: string; nav_sales: string; nav_govt: string; nav_profile: string
  take_photo: string; my_sales: string; find_materials: string; govt_help: string
  listening: string; tap_to_speak: string
  take_photo_btn: string; upload_gallery: string; retake: string; continue_btn: string
  recognizing: string; removing_bg: string; improving: string; preparing: string; creating_catalog: string
  speak_details: string; detected_lang: string; confirm: string; edit: string
  catalog_title: string; edit_details: string; continue_to_price: string
  suggested_price: string; accept_price: string; edit_price: string; continue_to_publish: string; fair_price_msg: string
  publish_btn: string; success_msg: string; view_product: string; share_product: string
  go_to_sales: string; back_to_home: string; govt_title: string
  cmd_camera: string; cmd_sales: string; cmd_materials: string
  cmd_schemes: string; cmd_back: string; cmd_publish: string; cmd_catalog: string; cmd_explain: string
  voice_rsp_camera: string; voice_rsp_sales: string; voice_rsp_publish: string; voice_rsp_back: string
  greeting: string; profile_name: string; profile_craft: string
  mat_cost: string; labour: string; expenses: string; profit: string; market_ref: string
  orders_pending: string; best_seller: string; trust_score: string; transactions: string
  review_1: string; review_2: string; insight: string
  marketplace_title: string; see_all: string; add_product_sub: string
  step_photo: string; step_tell: string; step_price: string; step_sell: string
  view_action: string; artisan_made: string; govt_schemes_sub: string
  finished_products: string; raw_materials: string; order_btn: string
}


export interface UserProfile {
  name: string;
  phone: string;
  language: LangCode;
  craftType: string;
  token?: string;
  avatar?: string;
  memberSince?: string;
}

const DEFAULT_USER: UserProfile = {
  name: "Meena Devi",
  phone: "9876543210",
  language: "ml",
  craftType: "Handloom Weaving",
  token: "shilpsetu_auth_token_demo",
  avatar: "👩‍🦱",
  memberSince: "2024",
};

const CRAFT_OPTIONS = [
  { key: "handloom", en: "Handloom Weaving", ml: "കൈത്തറി നെയ്ത്ത്", icon: "🧵" },
  { key: "pottery", en: "Pottery & Clay Art", ml: "മൺപാത്ര നിർമ്മാണം", icon: "🏺" },
  { key: "bamboo", en: "Bamboo & Cane Craft", ml: "മുള & ചൂരൽ കരകൗശലം", icon: "🧺" },
  { key: "wood", en: "Wood Carving", ml: "തടി കൊത്തുപണി", icon: "🪵" },
  { key: "metal", en: "Metal & Bell Metal Craft", ml: "ലോഹ കരകൗശലം", icon: "⚒️" },
  { key: "embroidery", en: "Embroidery & Textiles", ml: "എംബ്രോയ്ഡറി & തുണിത്തരങ്ങൾ", icon: "🪡" },
  { key: "jewellery", en: "Traditional Jewellery", ml: "പരമ്പരാഗത ആഭരണങ്ങൾ", icon: "💍" },
  { key: "other", en: "Other Traditional Craft", ml: "മറ്റ് പരമ്പരാഗത കരകൗശലം", icon: "✨" },
];

const AUTH_LANGS: { code: LangCode; en: string; native: string }[] = [
  { code: "ml", en: "Malayalam", native: "മലയാളം" },
  { code: "en", en: "English", native: "English" },
  { code: "hi", en: "Hindi", native: "हिंदी" },
  { code: "ta", en: "Tamil", native: "தமிழ்" },
  { code: "te", en: "Telugu", native: "తెలుగు" },
  { code: "kn", en: "Kannada", native: "ಕನ್ನಡ" },
  { code: "bn", en: "Bengali", native: "বাংলা" },
  { code: "mr", en: "Marathi", native: "मराठी" },
];

function getStoredSession(): UserProfile | null {
  try {
    const saved = localStorage.getItem("shilpsetu_user_session");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load session", e);
  }
  return null;
}

function saveUserSession(user: UserProfile) {
  try {
    localStorage.setItem("shilpsetu_user_session", JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save session", e);
  }
}

function clearUserSession() {
  try {
    localStorage.removeItem("shilpsetu_user_session");
  } catch (e) {
    console.error("Failed to clear session", e);
  }
}

// ─── LANGUAGE DATA ────────────────────────────────────────────────────────────

const LANGS: Record<LangCode, T> = {
  ml: {
    name: "മലയാളം", tagline: "നിങ്ങളുടെ കരകൗശലം. നിങ്ങളുടെ വിപണി.", sub: "ഫോട്ടോ എടുക്കൂ. സംസാരിക്കൂ. വിൽക്കൂ.",
    speak_to_use: "സംസാരിച്ച് ആപ്പ് ഉപയോഗിക്കൂ", nav_home: "ഹോം", nav_products: "ഉൽപ്പന്നം",
    nav_sales: "വിൽപ്പന", nav_govt: "സർക്കാർ", nav_profile: "പ്രൊഫൈൽ",
    take_photo: "ഫോട്ടോ എടുക്കൂ", my_sales: "എൻ്റെ വിൽപ്പന", find_materials: "വസ്തുക്കൾ കണ്ടെത്തൂ", govt_help: "സർക്കാർ സഹായം",
    listening: "കേൾക്കുന്നു...", tap_to_speak: "ഇവിടെ ടാപ്പ് ചെയ്ത് സംസാരിക്കൂ",
    take_photo_btn: "ഫോട്ടോ എടുക്കൂ", upload_gallery: "ഗ്യാലറിയിൽ നിന്ന്", retake: "വീണ്ടും", continue_btn: "തുടരൂ",
    recognizing: "ഉൽപ്പന്നം തിരിച്ചറിയുന്നു", removing_bg: "പശ്ചാത്തലം നീക്കുന്നു",
    improving: "ചിത്രം മെച്ചപ്പെടുത്തുന്നു", preparing: "ഉൽപ്പന്ന ചിത്രം തയ്യാറാക്കുന്നു", creating_catalog: "കാറ്റലോഗ് സൃഷ്ടിക്കുന്നു",
    speak_details: "ഉൽപ്പന്ന വിശദാംശങ്ങൾ സംസാരിക്കൂ", detected_lang: "കണ്ടുപിടിച്ച ഭാഷ", confirm: "ശരി", edit: "തിരുത്തൂ",
    catalog_title: "ഉൽപ്പന്ന കാറ്റലോഗ്", edit_details: "വിശദാംശങ്ങൾ തിരുത്തൂ", continue_to_price: "വിലയിലേക്ക് തുടരൂ",
    suggested_price: "നിർദ്ദേശിക്കുന്ന വില", accept_price: "വില അംഗീകരിക്കൂ", edit_price: "വില മാറ്റൂ",
    continue_to_publish: "പ്രസിദ്ധീകരിക്കൂ", fair_price_msg: "ഈ വില നിങ്ങളുടെ അദ്ധ്വാനം ഉൾക്കൊള്ളുന്നു",
    publish_btn: "ഉൽപ്പന്നം പ്രസിദ്ധീകരിക്കൂ", success_msg: "നിങ്ങളുടെ ഉൽപ്പന്നം ഇപ്പോൾ വാങ്ങുന്നവർക്ക് ലഭ്യമാണ്",
    view_product: "ഉൽപ്പന്നം കാണൂ", share_product: "പങ്കിടൂ", go_to_sales: "എൻ്റെ വിൽപ്പനയിലേക്ക്", back_to_home: "ഹോമിലേക്ക്",
    govt_title: "സർക്കാർ പദ്ധതികൾ",
    cmd_camera: "ക്യാമറ തുറക്കൂ", cmd_sales: "വിൽപ്പന കാണൂ", cmd_materials: "വസ്തുക്കൾ കണ്ടെത്തൂ",
    cmd_schemes: "സർക്കാർ പദ്ധതികൾ", cmd_back: "പിന്നോട്ട്", cmd_publish: "ഉൽപ്പന്നം പ്രസിദ്ധീകരിക്കൂ",
    cmd_catalog: "കാറ്റലോഗ് ഉണ്ടാക്കൂ", cmd_explain: "ഈ പേജ് വിശദീകരിക്കൂ",
    voice_rsp_camera: "ക്യാമറ തുറക്കുന്നു.", voice_rsp_sales: "നിങ്ങളുടെ വിൽപ്പന ഇതാ.", voice_rsp_publish: "ഉൽപ്പന്നം പ്രസിദ്ധീകരിക്കാൻ തയ്യാറാണോ?", voice_rsp_back: "പിന്നോട്ട് പോകുന്നു.",
    greeting: "നമസ്കാരം, മീന! 🙏", profile_name: "മീന ദേവി", profile_craft: "കൈത്തറി നെയ്ത്തുകാരി",
    mat_cost: "വസ്തു ചെലവ്", labour: "അദ്ധ്വാന മൂല്യം", expenses: "മറ്റ് ചെലവുകൾ", profit: "ലാഭം", market_ref: "മാർക്കറ്റ് നിരക്ക്",
    orders_pending: "2 ഓർഡർ കാത്തിരിക്കുന്നു", best_seller: "നിങ്ങളുടെ കോട്ടൺ സാരി നന്നായി വിൽക്കുന്നു.",
    trust_score: "വിശ്വാസ സ്കോർ", transactions: "ഇടപാടുകൾ", review_1: "\"ഉൽപ്പന്നം വളരെ നല്ലതാണ്!\"",
    review_2: "\"ഗുണനിലവാരം മികച്ചതാണ്\"", insight: "ഈ മാസം ₹4,800 ലഭിച്ചു.",
  },
  hi: {
    name: "हिंदी", tagline: "आपका हुनर। आपकी मार्केट।", sub: "फोटो लें। बोलें। बेचें।",
    speak_to_use: "बोलकर ऐप इस्तेमाल करें", nav_home: "होम", nav_products: "उत्पाद",
    nav_sales: "बिक्री", nav_govt: "सरकार", nav_profile: "प्रोफाइल",
    take_photo: "फोटो लें", my_sales: "मेरी बिक्री", find_materials: "सामग्री खोजें", govt_help: "सरकारी मदद",
    listening: "सुन रहा हूँ...", tap_to_speak: "यहाँ दबाएँ और बोलें",
    take_photo_btn: "फोटो लें", upload_gallery: "गैलरी से", retake: "फिर से", continue_btn: "जारी रखें",
    recognizing: "उत्पाद पहचान रहे हैं", removing_bg: "पृष्ठभूमि हटा रहे हैं",
    improving: "छवि बेहतर बना रहे हैं", preparing: "उत्पाद छवि तैयार हो रही है", creating_catalog: "कैटलॉग बना रहे हैं",
    speak_details: "उत्पाद विवरण बोलें", detected_lang: "पहचानी गई भाषा", confirm: "ठीक है", edit: "संपादित करें",
    catalog_title: "उत्पाद कैटलॉग", edit_details: "विवरण संपादित करें", continue_to_price: "मूल्य पर जाएँ",
    suggested_price: "सुझाया गया मूल्य", accept_price: "मूल्य स्वीकार करें", edit_price: "मूल्य बदलें",
    continue_to_publish: "प्रकाशित करें", fair_price_msg: "यह मूल्य आपके परिश्रम को शामिल करता है",
    publish_btn: "उत्पाद प्रकाशित करें", success_msg: "आपका उत्पाद अब ग्राहकों के लिए तैयार है",
    view_product: "उत्पाद देखें", share_product: "साझा करें", go_to_sales: "मेरी बिक्री पर जाएँ", back_to_home: "होम पर वापस",
    govt_title: "सरकारी योजनाएँ",
    cmd_camera: "कैमरा खोलो", cmd_sales: "बिक्री दिखाओ", cmd_materials: "सामग्री खोजो",
    cmd_schemes: "सरकारी योजनाएँ", cmd_back: "पीछे जाओ", cmd_publish: "उत्पाद प्रकाशित करो",
    cmd_catalog: "कैटलॉग बनाओ", cmd_explain: "यह पेज समझाओ",
    voice_rsp_camera: "कैमरा खुल रहा है।", voice_rsp_sales: "आपकी बिक्री यहाँ है।", voice_rsp_publish: "क्या आप उत्पाद प्रकाशित करना चाहते हैं?", voice_rsp_back: "पीछे जा रहे हैं।",
    greeting: "नमस्ते, मीना! 🙏", profile_name: "मीना देवी", profile_craft: "हथकरघा बुनकर",
    mat_cost: "कच्चा माल", labour: "श्रम मूल्य", expenses: "अन्य खर्च", profit: "लाभ", market_ref: "बाजार भाव",
    orders_pending: "2 ऑर्डर प्रतीक्षा में", best_seller: "आपकी कॉटन साड़ी अच्छी बिक रही है।",
    trust_score: "विश्वास स्कोर", transactions: "लेन-देन", review_1: "\"बहुत अच्छा उत्पाद!\"",
    review_2: "\"गुणवत्ता बेहतरीन है\"", insight: "इस महीने ₹4,800 मिले।",
  },
  bn: {
    name: "বাংলা", tagline: "আপনার শিল্প। আপনার বাজার।", sub: "ছবি তুলুন। বলুন। বেচুন।",
    speak_to_use: "কথা বলে অ্যাপ ব্যবহার করুন", nav_home: "হোম", nav_products: "পণ্য",
    nav_sales: "বিক্রয়", nav_govt: "সরকার", nav_profile: "প্রোফাইল",
    take_photo: "ছবি তুলুন", my_sales: "আমার বিক্রয়", find_materials: "উপকরণ খুঁজুন", govt_help: "সরকারি সাহায্য",
    listening: "শুনছি...", tap_to_speak: "এখানে চাপুন এবং বলুন",
    take_photo_btn: "ছবি তুলুন", upload_gallery: "গ্যালারি থেকে", retake: "আবার", continue_btn: "চালিয়ে যান",
    recognizing: "পণ্য চিনছে", removing_bg: "পটভূমি সরাচ্ছে",
    improving: "ছবি উন্নত করছে", preparing: "পণ্যের ছবি প্রস্তুত", creating_catalog: "ক্যাটালগ তৈরি হচ্ছে",
    speak_details: "পণ্যের বিবরণ বলুন", detected_lang: "চিহ্নিত ভাষা", confirm: "ঠিক আছে", edit: "সম্পাদনা",
    catalog_title: "পণ্য ক্যাটালগ", edit_details: "বিবরণ সম্পাদনা", continue_to_price: "মূল্যে যান",
    suggested_price: "প্রস্তাবিত মূল্য", accept_price: "মূল্য গ্রহণ করুন", edit_price: "মূল্য পরিবর্তন",
    continue_to_publish: "প্রকাশ করুন", fair_price_msg: "এই মূল্যে আপনার পরিশ্রম অন্তর্ভুক্ত",
    publish_btn: "পণ্য প্রকাশ করুন", success_msg: "আপনার পণ্য এখন ক্রেতাদের জন্য প্রস্তুত",
    view_product: "পণ্য দেখুন", share_product: "শেয়ার করুন", go_to_sales: "আমার বিক্রয়ে", back_to_home: "হোমে ফিরুন",
    govt_title: "সরকারি প্রকল্প",
    cmd_camera: "ক্যামেরা খোলো", cmd_sales: "বিক্রয় দেখাও", cmd_materials: "উপকরণ খোঁজো",
    cmd_schemes: "সরকারি প্রকল্প", cmd_back: "পিছিয়ে যাও", cmd_publish: "পণ্য প্রকাশ করো",
    cmd_catalog: "ক্যাটালগ তৈরি করো", cmd_explain: "এই পেজ বোঝাও",
    voice_rsp_camera: "ক্যামেরা খুলছে।", voice_rsp_sales: "আপনার বিক্রয় এখানে।", voice_rsp_publish: "পণ্য প্রকাশ করবেন?", voice_rsp_back: "পিছিয়ে যাচ্ছি।",
    greeting: "নমস্কার, মীনা! 🙏", profile_name: "মীনা দেবী", profile_craft: "তাঁত বুননকারী",
    mat_cost: "কাঁচামাল", labour: "শ্রমের মূল্য", expenses: "অন্যান্য খরচ", profit: "লাভ", market_ref: "বাজার দর",
    orders_pending: "2টি অর্ডার অপেক্ষায়", best_seller: "আপনার কটন শাড়ি ভালো বিকছে।",
    trust_score: "বিশ্বাস স্কোর", transactions: "লেনদেন", review_1: "\"খুব ভালো পণ্য!\"",
    review_2: "\"গুণমান চমৎকার\"", insight: "এই মাসে ₹4,800 পেয়েছেন।",
  },
  ta: {
    name: "தமிழ்", tagline: "உங்கள் கைவினை. உங்கள் சந்தை.", sub: "புகைப்படம் எடு. பேசு. விற்று.",
    speak_to_use: "பேசி செயலியை பயன்படுத்துங்கள்", nav_home: "முகப்பு", nav_products: "பொருட்கள்",
    nav_sales: "விற்பனை", nav_govt: "அரசு", nav_profile: "சுயவிவரம்",
    take_photo: "புகைப்படம் எடு", my_sales: "என் விற்பனை", find_materials: "பொருட்கள் கண்டுபிடி", govt_help: "அரசு உதவி",
    listening: "கேட்கிறேன்...", tap_to_speak: "இங்கே தட்டி பேசுங்கள்",
    take_photo_btn: "புகைப்படம் எடு", upload_gallery: "கேலரியிலிருந்து", retake: "மீண்டும்", continue_btn: "தொடர",
    recognizing: "பொருளை அடையாளம் காண்கிறோம்", removing_bg: "பின்னணியை நீக்குகிறோம்",
    improving: "படத்தை மேம்படுத்துகிறோம்", preparing: "பொருள் படம் தயாராகிறது", creating_catalog: "பட்டியல் உருவாகிறது",
    speak_details: "பொருளின் விவரங்களை பேசுங்கள்", detected_lang: "கண்டறிந்த மொழி", confirm: "சரி", edit: "திருத்து",
    catalog_title: "பொருள் பட்டியல்", edit_details: "விவரங்களை திருத்து", continue_to_price: "விலைக்கு செல்",
    suggested_price: "பரிந்துரைக்கப்பட்ட விலை", accept_price: "விலை ஏற்கவும்", edit_price: "விலை மாற்று",
    continue_to_publish: "வெளியிடவும்", fair_price_msg: "இந்த விலை உங்கள் உழைப்பை உள்ளடக்கியது",
    publish_btn: "பொருளை வெளியிடு", success_msg: "உங்கள் பொருள் இப்போது வாங்குபவர்களுக்கு கிடைக்கும்",
    view_product: "பொருளை பார்", share_product: "பகிர்", go_to_sales: "என் விற்பனைக்கு", back_to_home: "முகப்புக்கு",
    govt_title: "அரசு திட்டங்கள்",
    cmd_camera: "கேமரா திறக்கவும்", cmd_sales: "விற்பனை காட்டு", cmd_materials: "பொருட்கள் கண்டுபிடி",
    cmd_schemes: "அரசு திட்டங்கள்", cmd_back: "பின்னால் செல்", cmd_publish: "பொருளை வெளியிடு",
    cmd_catalog: "பட்டியல் உருவாக்கு", cmd_explain: "இந்த பக்கம் விளக்கு",
    voice_rsp_camera: "கேமரா திறக்கிறது.", voice_rsp_sales: "உங்கள் விற்பனை இங்கே.", voice_rsp_publish: "பொருளை வெளியிட விரும்புகிறீர்களா?", voice_rsp_back: "பின்னால் செல்கிறோம்.",
    greeting: "வணக்கம், மீனா! 🙏", profile_name: "மீனா தேவி", profile_craft: "கைத்தறி நெசவாளர்",
    mat_cost: "மூலப்பொருள்", labour: "உழைப்பு மதிப்பு", expenses: "பிற செலவுகள்", profit: "லாபம்", market_ref: "சந்தை விலை",
    orders_pending: "2 ஆர்டர்கள் காத்திருக்கின்றன", best_seller: "உங்கள் பருத்தி சேலை நன்றாக விற்கிறது.",
    trust_score: "நம்பிக்கை மதிப்பெண்", transactions: "பரிவர்த்தனைகள்", review_1: "\"மிகவும் நல்ல பொருள்!\"",
    review_2: "\"தரம் சிறப்பானது\"", insight: "இந்த மாதம் ₹4,800 கிடைத்தது.",
  },
  te: {
    name: "తెలుగు", tagline: "మీ చేతివృత్తి. మీ మార్కెట్.", sub: "ఫోటో తీయండి. మాట్లాడండి. అమ్మండి.",
    speak_to_use: "మాట్లాడి యాప్ వాడండి", nav_home: "హోమ్", nav_products: "ఉత్పత్తులు",
    nav_sales: "అమ్మకాలు", nav_govt: "ప్రభుత్వం", nav_profile: "ప్రొఫైల్",
    take_photo: "ఫోటో తీయండి", my_sales: "నా అమ్మకాలు", find_materials: "సామగ్రి కనుగొనండి", govt_help: "ప్రభుత్వ సహాయం",
    listening: "వింటున్నాను...", tap_to_speak: "ఇక్కడ నొక్కి మాట్లాడండి",
    take_photo_btn: "ఫోటో తీయండి", upload_gallery: "గ్యాలరీ నుండి", retake: "మళ్ళీ", continue_btn: "కొనసాగించండి",
    recognizing: "ఉత్పత్తి గుర్తిస్తున్నాం", removing_bg: "నేపథ్యం తొలగిస్తున్నాం",
    improving: "చిత్రం మెరుగుపరుస్తున్నాం", preparing: "ఉత్పత్తి చిత్రం సిద్ధమవుతోంది", creating_catalog: "కేటలాగ్ సృష్టిస్తున్నాం",
    speak_details: "ఉత్పత్తి వివరాలు చెప్పండి", detected_lang: "గుర్తించిన భాష", confirm: "సరే", edit: "సవరించండి",
    catalog_title: "ఉత్పత్తి కేటలాగ్", edit_details: "వివరాలు సవరించండి", continue_to_price: "ధరకు వెళ్ళండి",
    suggested_price: "సూచించిన ధర", accept_price: "ధర ఒప్పుకోండి", edit_price: "ధర మార్చండి",
    continue_to_publish: "ప్రచురించండి", fair_price_msg: "ఈ ధర మీ కృషిని కలిగి ఉంది",
    publish_btn: "ఉత్పత్తి ప్రచురించండి", success_msg: "మీ ఉత్పత్తి ఇప్పుడు కొనుగోలుదారులకు అందుబాటులో ఉంది",
    view_product: "ఉత్పత్తి చూడండి", share_product: "పంచుకోండి", go_to_sales: "నా అమ్మకాలకు", back_to_home: "హోమ్‌కు",
    govt_title: "ప్రభుత్వ పథకాలు",
    cmd_camera: "కెమెరా తెరవు", cmd_sales: "అమ్మకాలు చూపించు", cmd_materials: "సామగ్రి కనుగొను",
    cmd_schemes: "ప్రభుత్వ పథకాలు", cmd_back: "వెనక్కి వెళ్ళు", cmd_publish: "ఉత్పత్తి ప్రచురించు",
    cmd_catalog: "కేటలాగ్ తయారుచేయి", cmd_explain: "ఈ పేజీ వివరించు",
    voice_rsp_camera: "కెమెరా తెరుచుకుంటోంది.", voice_rsp_sales: "మీ అమ్మకాలు ఇక్కడ ఉన్నాయి.", voice_rsp_publish: "ఉత్పత్తి ప్రచురించాలా?", voice_rsp_back: "వెనక్కి వెళ్తున్నాం.",
    greeting: "నమస్కారం, మీనా! 🙏", profile_name: "మీనా దేవి", profile_craft: "చేనేత నేత కళాకారుడు",
    mat_cost: "ముడిసరుకు", labour: "శ్రమ విలువ", expenses: "ఇతర ఖర్చులు", profit: "లాభం", market_ref: "మార్కెట్ ధర",
    orders_pending: "2 ఆర్డర్లు వేచి ఉన్నాయి", best_seller: "మీ కాటన్ చీర బాగా అమ్ముడవుతోంది.",
    trust_score: "నమ్మకం స్కోర్", transactions: "లావాదేవీలు", review_1: "\"చాలా మంచి ఉత్పత్తి!\"",
    review_2: "\"నాణ్యత అద్భుతంగా ఉంది\"", insight: "ఈ నెల ₹4,800 వచ్చాయి.",
  },
  kn: {
    name: "ಕನ್ನಡ", tagline: "ನಿಮ್ಮ ಕರಕುಶಲ. ನಿಮ್ಮ ಮಾರುಕಟ್ಟೆ.", sub: "ಫೋಟೋ ತೆಗೆಯಿರಿ. ಮಾತನಾಡಿ. ಮಾರಿ.",
    speak_to_use: "ಮಾತನಾಡಿ ಅಪ್ಲಿಕೇಶನ್ ಬಳಸಿ", nav_home: "ಮನೆ", nav_products: "ಉತ್ಪನ್ನಗಳು",
    nav_sales: "ಮಾರಾಟ", nav_govt: "ಸರ್ಕಾರ", nav_profile: "ಪ್ರೊಫೈಲ್",
    take_photo: "ಫೋಟೋ ತೆಗೆಯಿರಿ", my_sales: "ನನ್ನ ಮಾರಾಟ", find_materials: "ವಸ್ತುಗಳನ್ನು ಹುಡುಕಿ", govt_help: "ಸರ್ಕಾರಿ ಸಹಾಯ",
    listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...", tap_to_speak: "ಇಲ್ಲಿ ಒತ್ತಿ ಮಾತನಾಡಿ",
    take_photo_btn: "ಫೋಟೋ ತೆಗೆಯಿರಿ", upload_gallery: "ಗ್ಯಾಲರಿಯಿಂದ", retake: "ಮತ್ತೆ", continue_btn: "ಮುಂದುವರಿಯಿರಿ",
    recognizing: "ಉತ್ಪನ್ನ ಗುರುತಿಸುತ್ತಿದ್ದೇವೆ", removing_bg: "ಹಿನ್ನೆಲೆ ತೆಗೆಯುತ್ತಿದ್ದೇವೆ",
    improving: "ಚಿತ್ರ ಸುಧಾರಿಸುತ್ತಿದ್ದೇವೆ", preparing: "ಉತ್ಪನ್ನ ಚಿತ್ರ ತಯಾರಾಗುತ್ತಿದೆ", creating_catalog: "ಕ್ಯಾಟಲಾಗ್ ರಚಿಸುತ್ತಿದ್ದೇವೆ",
    speak_details: "ಉತ್ಪನ್ನ ವಿವರ ಹೇಳಿ", detected_lang: "ಗುರುತಿಸಿದ ಭಾಷೆ", confirm: "ಸರಿ", edit: "ತಿದ್ದಿರಿ",
    catalog_title: "ಉತ್ಪನ್ನ ಕ್ಯಾಟಲಾಗ್", edit_details: "ವಿವರ ತಿದ್ದಿರಿ", continue_to_price: "ಬೆಲೆಗೆ ಹೋಗಿ",
    suggested_price: "ಸೂಚಿಸಿದ ಬೆಲೆ", accept_price: "ಬೆಲೆ ಒಪ್ಪಿ", edit_price: "ಬೆಲೆ ಬದಲಾಯಿಸಿ",
    continue_to_publish: "ಪ್ರಕಟಿಸಿ", fair_price_msg: "ಈ ಬೆಲೆ ನಿಮ್ಮ ಶ್ರಮವನ್ನು ಒಳಗೊಂಡಿದೆ",
    publish_btn: "ಉತ್ಪನ್ನ ಪ್ರಕಟಿಸಿ", success_msg: "ನಿಮ್ಮ ಉತ್ಪನ್ನ ಈಗ ಖರೀದಿದಾರರಿಗೆ ಲಭ್ಯವಿದೆ",
    view_product: "ಉತ್ಪನ್ನ ನೋಡಿ", share_product: "ಹಂಚಿಕೊಳ್ಳಿ", go_to_sales: "ನನ್ನ ಮಾರಾಟಕ್ಕೆ", back_to_home: "ಮನೆಗೆ ಮರಳಿ",
    govt_title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    cmd_camera: "ಕ್ಯಾಮೆರಾ ತೆರೆ", cmd_sales: "ಮಾರಾಟ ತೋರಿಸು", cmd_materials: "ವಸ್ತುಗಳನ್ನು ಹುಡುಕು",
    cmd_schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", cmd_back: "ಹಿಂದೆ ಹೋಗು", cmd_publish: "ಉತ್ಪನ್ನ ಪ್ರಕಟಿಸು",
    cmd_catalog: "ಕ್ಯಾಟಲಾಗ್ ರಚಿಸು", cmd_explain: "ಈ ಪುಟ ವಿವರಿಸು",
    voice_rsp_camera: "ಕ್ಯಾಮೆರಾ ತೆರೆಯುತ್ತಿದೆ.", voice_rsp_sales: "ನಿಮ್ಮ ಮಾರಾಟ ಇಲ್ಲಿದೆ.", voice_rsp_publish: "ಉತ್ಪನ್ನ ಪ್ರಕಟಿಸಲೇ?", voice_rsp_back: "ಹಿಂದೆ ಹೋಗುತ್ತಿದ್ದೇವೆ.",
    greeting: "ನಮಸ್ಕಾರ, ಮೀನಾ! 🙏", profile_name: "ಮೀನಾ ದೇವಿ", profile_craft: "ಕೈಮಗ್ಗ ನೇಯ್ಗೆಯವರು",
    mat_cost: "ಕಚ್ಚಾ ವಸ್ತು", labour: "ಶ್ರಮ ಮೌಲ್ಯ", expenses: "ಇತರ ಖರ್ಚು", profit: "ಲಾಭ", market_ref: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
    orders_pending: "2 ಆರ್ಡರ್ ಕಾಯುತ್ತಿವೆ", best_seller: "ನಿಮ್ಮ ಕಾಟನ್ ಸೀರೆ ಚೆನ್ನಾಗಿ ಮಾರಾಟವಾಗುತ್ತಿದೆ.",
    trust_score: "ವಿಶ್ವಾಸ ಸ್ಕೋರ್", transactions: "ವ್ಯವಹಾರಗಳು", review_1: "\"ತುಂಬಾ ಒಳ್ಳೆಯ ಉತ್ಪನ್ನ!\"",
    review_2: "\"ಗುಣಮಟ್ಟ ಅತ್ಯುತ್ತಮ\"", insight: "ಈ ತಿಂಗಳು ₹4,800 ಬಂದಿದೆ.",
  },
  mr: {
    name: "मराठी", tagline: "तुमचे कौशल्य. तुमची बाजारपेठ.", sub: "फोटो काढा. बोला. विका.",
    speak_to_use: "बोलून अ‍ॅप वापरा", nav_home: "मुख्यपृष्ठ", nav_products: "उत्पादने",
    nav_sales: "विक्री", nav_govt: "शासन", nav_profile: "प्रोफाइल",
    take_photo: "फोटो काढा", my_sales: "माझी विक्री", find_materials: "साहित्य शोधा", govt_help: "शासकीय मदत",
    listening: "ऐकत आहे...", tap_to_speak: "इथे दाबा आणि बोला",
    take_photo_btn: "फोटो काढा", upload_gallery: "गॅलरीतून", retake: "पुन्हा", continue_btn: "पुढे जा",
    recognizing: "उत्पादन ओळखत आहे", removing_bg: "पार्श्वभूमी काढत आहे",
    improving: "चित्र सुधारत आहे", preparing: "उत्पादन चित्र तयार होत आहे", creating_catalog: "कॅटलॉग तयार होत आहे",
    speak_details: "उत्पादन तपशील सांगा", detected_lang: "ओळखलेली भाषा", confirm: "ठीक आहे", edit: "संपादित करा",
    catalog_title: "उत्पादन कॅटलॉग", edit_details: "तपशील संपादित करा", continue_to_price: "किंमतीकडे जा",
    suggested_price: "सुचवलेली किंमत", accept_price: "किंमत स्वीकारा", edit_price: "किंमत बदला",
    continue_to_publish: "प्रकाशित करा", fair_price_msg: "या किंमतीत तुमची मेहनत समाविष्ट आहे",
    publish_btn: "उत्पादन प्रकाशित करा", success_msg: "तुमचे उत्पादन आता ग्राहकांसाठी तयार आहे",
    view_product: "उत्पादन पहा", share_product: "शेअर करा", go_to_sales: "माझ्या विक्रीकडे", back_to_home: "मुख्यपृष्ठावर",
    govt_title: "शासकीय योजना",
    cmd_camera: "कॅमेरा उघड", cmd_sales: "विक्री दाखव", cmd_materials: "साहित्य शोध",
    cmd_schemes: "शासकीय योजना", cmd_back: "मागे जा", cmd_publish: "उत्पादन प्रकाशित कर",
    cmd_catalog: "कॅटलॉग तयार कर", cmd_explain: "हे पेज समजाव",
    voice_rsp_camera: "कॅमेरा उघडत आहे.", voice_rsp_sales: "तुमची विक्री येथे आहे.", voice_rsp_publish: "उत्पादन प्रकाशित करायचे का?", voice_rsp_back: "मागे जात आहे.",
    greeting: "नमस्कार, मीना! 🙏", profile_name: "मीना देवी", profile_craft: "हातमाग विणकर",
    mat_cost: "कच्चा माल", labour: "श्रम मूल्य", expenses: "इतर खर्च", profit: "नफा", market_ref: "बाजार भाव",
    orders_pending: "2 ऑर्डर प्रतीक्षेत", best_seller: "तुमची कॉटन साडी चांगली विकली जात आहे.",
    trust_score: "विश्वास गुण", transactions: "व्यवहार", review_1: "\"खूप छान उत्पादन!\"",
    review_2: "\"दर्जा उत्कृष्ट आहे\"", insight: "या महिन्यात ₹4,800 मिळाले.",
  },
  en: {
    name: "English", tagline: "Your craft. Your market.", sub: "Take a photo. Speak. Sell.",
    speak_to_use: "Speak to use the app", nav_home: "Home", nav_products: "Products",
    nav_sales: "My Sales", nav_govt: "Govt Help", nav_profile: "Profile",
    take_photo: "Take a Photo", my_sales: "My Sales", find_materials: "Find Materials", govt_help: "Government Help",
    listening: "Listening...", tap_to_speak: "Tap here to speak",
    take_photo_btn: "Take Photo", upload_gallery: "Upload from Gallery", retake: "Retake", continue_btn: "Continue",
    recognizing: "Recognizing product", removing_bg: "Removing background",
    improving: "Improving lighting", preparing: "Preparing product image", creating_catalog: "Creating catalog details",
    speak_details: "Speak your product details", detected_lang: "Detected language", confirm: "Confirm", edit: "Edit",
    catalog_title: "Product Catalog", edit_details: "Edit Details", continue_to_price: "Continue to Fair Price",
    suggested_price: "Suggested Price", accept_price: "Accept Price", edit_price: "Edit Price",
    continue_to_publish: "Continue to Publish", fair_price_msg: "This price includes your work and gives you a fair profit.",
    publish_btn: "Publish Product", success_msg: "Your product is now ready for customers.",
    view_product: "View Product", share_product: "Share Product", go_to_sales: "Go to My Sales", back_to_home: "Back to Home",
    govt_title: "Government Schemes",
    cmd_camera: "Open camera", cmd_sales: "Show my sales", cmd_materials: "Find materials",
    cmd_schemes: "Show government schemes", cmd_back: "Go back", cmd_publish: "Publish product",
    cmd_catalog: "Create catalog", cmd_explain: "Explain this page",
    voice_rsp_camera: "Opening the camera.", voice_rsp_sales: "Your sales information is here.", voice_rsp_publish: "Would you like to publish this product?", voice_rsp_back: "Going back.",
    greeting: "Namaste, Meena! 🙏", profile_name: "Meena Devi", profile_craft: "Handloom Weaver",
    mat_cost: "Material cost", labour: "Labour value", expenses: "Other expenses", profit: "Artisan profit", market_ref: "Market reference",
    orders_pending: "2 orders waiting", best_seller: "Your cotton saree is selling well.",
    trust_score: "Trust Score", transactions: "Transactions", review_1: "\"Very good product!\"",
    review_2: "\"Quality is excellent\"", insight: "You received ₹4,800 this month.",
  },
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const PRODUCTS: {
  id: number;
  name: string;
  names: Record<LangCode, string>;
  price: number;
  img: string;
  craft: string;
  crafts: Record<LangCode, string>;
  artisan: string;
  trustScore: number;
  blockHash: string;
  certTag: string;
  verifiedTxs: number;
}[] = [
    {
      id: 1,
      name: "Handwoven Cotton Saree",
      names: {
        ml: "കൈത്തറി കോട്ടൺ സാരി",
        hi: "हाथ से बुनी कॉटन साड़ी",
        bn: "হস্তনির্মিত সুতির শাড়ি",
        ta: "கைத்தறி பருத்தி சேலை",
        te: "చేనేత కాటన్ చీర",
        kn: "ಕೈಮಗ್ಗ ಕಾಟನ್ ಸೀರೆ",
        mr: "हातमाग कॉटन साडी",
        en: "Handwoven Cotton Saree",
      },
      price: 2600,
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
      craft: "Handloom",
      crafts: {
        ml: "കൈത്തറി",
        hi: "हथकरघा",
        bn: "তাঁত",
        ta: "கைத்தறி",
        te: "చేనేత",
        kn: "ಕೈಮಗ್ಗ",
        mr: "हातमाग",
        en: "Handloom",
      },
      artisan: "Meena Devi",
      trustScore: 98,
      blockHash: "0x8f2a...c39d",
      certTag: "GI Tag #KL-409",
      verifiedTxs: 18,
    },
    {
      id: 2,
      name: "Bamboo Wicker Basket",
      names: {
        ml: "മുള കൊട്ട",
        hi: "बांस की टोकरी",
        bn: "বাঁশের ঝুড়ি",
        ta: "மூங்கில் கூடை",
        te: "వెదురు బుట్ట",
        kn: "ಬಿದಿರಿನ ಬುಟ್ಟಿ",
        mr: "बांबूची टोपली",
        en: "Bamboo Wicker Basket",
      },
      price: 850,
      img: "/kotta.png",
      craft: "Bamboo Weaving",
      crafts: {
        ml: "മുള നെയ്ത്ത്",
        hi: "बांस बुनाई",
        bn: "বাঁশ বুনন",
        ta: "மூங்கில் நெசவு",
        te: "వెదురు నేత",
        kn: "ಬಿದಿರು ನೇಯ್ಗೆ",
        mr: "बांबू विणकाम",
        en: "Bamboo Weaving",
      },
      artisan: "Ravi Kumar",
      trustScore: 94,
      blockHash: "0x3e1b...7a2f",
      certTag: "Eco Craft #AS-112",
      verifiedTxs: 12,
    },
    {
      id: 3,
      name: "Terracotta Serving Pot",
      names: {
        ml: "മൺപാത്രം",
        hi: "मिट्टी का बर्तन",
        bn: "পোড়ামাটির পাত্র",
        ta: "மண்பானை",
        te: "మట్టి కుండ",
        kn: "ಮಣ್ಣಿನ ಮಡಕೆ",
        mr: "मातीचे भांडे",
        en: "Terracotta Serving Pot",
      },
      price: 450,
      img: "/mudpot.jpg",
      craft: "Pottery",
      crafts: {
        ml: "മൺപാത്ര നിർമ്മാണം",
        hi: "कुम्हारी",
        bn: "মৃৎশিল্প",
        ta: "மட்பாண்டம்",
        te: "కుమ్మరి",
        kn: "ಕುಂಬಾರಿಕೆ",
        mr: "कुंभारकाम",
        en: "Pottery",
      },
      artisan: "Lakshmi Bai",
      trustScore: 92,
      blockHash: "0x9c4d...e810",
      certTag: "Clay Guild Verified",
      verifiedTxs: 9,
    },
    {
      id: 4,
      name: "Silk Embroidered Shawl",
      names: {
        ml: "പട്ട് എംബ്രോയ്ഡറി ഷാൾ",
        hi: "रेशमी कढ़ाईदार शॉल",
        bn: "রেশমি এমব্রয়ডারি শাল",
        ta: "பட்டு எம்ப்ராய்டரி சால்வை",
        te: "పట్టు ఎంబ్రాయిడరీ శాలువా",
        kn: "ರೇಷ್ಮೆ ಕಸೂತಿ ಶಾಲು",
        mr: "रेशमी भरतकाम शाल",
        en: "Silk Embroidered Shawl",
      },
      price: 1800,
      img: "/shawl.jpeg",
      craft: "Embroidery",
      crafts: {
        ml: "എംബ്രോയ്ഡറി",
        hi: "कढ़ाई",
        bn: "এমব্রয়ডারি",
        ta: "எம்ப்ராய்டரி",
        te: "ఎంబ్రాయిడరీ",
        kn: "ಕಸೂತಿ",
        mr: "भरतकाम",
        en: "Embroidery",
      },
      artisan: "Fatima Begum",
      trustScore: 96,
      blockHash: "0x7a22...f93b",
      certTag: "Silk Mark #SM-77",
      verifiedTxs: 15,
    },
  ];

const MATERIALS: {
  id: number;
  name: string;
  names: Record<LangCode, string>;
  price: number;
  img: string;
  seller: string;
}[] = [
    {
      id: 1,
      name: "Cotton Yarn (500g)",
      names: {
        ml: "കോട്ടൺ നൂൽ (500g)",
        hi: "सूती धागा (500g)",
        bn: "সুতির সুতো (500g)",
        ta: "பருத்தி நூல் (500g)",
        te: "కాటన్ దారం (500g)",
        kn: "ಹತ್ತಿ ನೂಲು (500g)",
        mr: "सुती धागा (500g)",
        en: "Cotton Yarn (500g)",
      },
      price: 180,
      img: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=300&h=300&fit=crop&auto=format",
      seller: "Rajesh Traders",
    },
    {
      id: 2,
      name: "Natural Indigo Dye",
      names: {
        ml: "പ്രകൃതിദത്ത നീല ചായം",
        hi: "प्राकृतिक इंडिगो रंग",
        bn: "প্রাকৃতিক নীল রঙ",
        ta: "இயற்கை இண்டிகோ சாயம்",
        te: "సహజ ఇండిగో రంగు",
        kn: "ನೈಸರ್ಗಿಕ ಇಂಡಿಗೊ ಬಣ್ಣ",
        mr: "नैसर्गिक इंडिगो रंग",
        en: "Natural Indigo Dye",
      },
      price: 120,
      img: "https://images.unsplash.com/photo-1589831498686-b92a1a8a9f8c?w=300&h=300&fit=crop&auto=format",
      seller: "Krishna Stores",
    },
    {
      id: 3,
      name: "Bamboo Strips Bundle",
      names: {
        ml: "മുള ചീളുകൾ കെട്ട്",
        hi: "बांस की पट्टियों का बंडल",
        bn: "বাঁশের চটা বান্ডিল",
        ta: "மூங்கில் கீற்றுகள் கட்டு",
        te: "వెదురు బద్దల కట్ట",
        kn: "ಬಿದಿರಿನ ಪಟ್ಟಿ ಕಟ್ಟು",
        mr: "बांबूच्या पट्ट्यांचा बंडल",
        en: "Bamboo Strips Bundle",
      },
      price: 90,
      img: "https://images.unsplash.com/photo-1629116040208-ff8d0a3d3e47?w=300&h=300&fit=crop&auto=format",
      seller: "Forest Goods Co.",
    },
    {
      id: 4,
      name: "Silk Thread Set",
      names: {
        ml: "പട്ട് നൂൽ സെറ്റ്",
        hi: "रेशमी धागा सेट",
        bn: "রেশম সুতো সেট",
        ta: "பட்டு நூல் தொகுப்பு",
        te: "పట్టు దారాల సెట్",
        kn: "ರೇಷ್ಮೆ ದಾರ ಸೆಟ್",
        mr: "रेशीम धागा सेट",
        en: "Silk Thread Set",
      },
      price: 220,
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format",
      seller: "Weaver's Hub",
    },
    {
      id: 5,
      name: "Block Print Stamps",
      names: {
        ml: "ബ്ലോക്ക് പ്രിന്റ് സ്റ്റാമ്പുകൾ",
        hi: "ब्लॉक प्रिंटिंग टिकटें",
        bn: "ব্লক প্রিন্ট স্ট্যাম্প",
        ta: "பிளாக் பிரிண்ட் முத்திரைகள்",
        te: "బ్లాక్ ప్రింట్ స్టాంపులు",
        kn: "ಬ್ಲಾಕ್ ಪ್ರಿಂಟ್ ಮುದ್ರೆಗಳು",
        mr: "ब्लॉक प्रिंटिंग स्टॅम्प",
        en: "Block Print Stamps",
      },
      price: 350,
      img: "https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=300&h=300&fit=crop&auto=format",
      seller: "Artisan Supply Co.",
    },
    {
      id: 6,
      name: "Natural Dye Kit",
      names: {
        ml: "പ്രകൃതിദത്ത ചായക്കൂട്ടുകൾ",
        hi: "प्राकृतिक रंग किट",
        bn: "প্রাকৃতিক রঙের কিট",
        ta: "இயற்கை சாய கிட்",
        te: "సహజ రంగుల కిట్",
        kn: "ನೈಸರ್ಗಿಕ ಬಣ್ಣದ ಕಿಟ್",
        mr: "नैसर्गिक रंग किट",
        en: "Natural Dye Kit",
      },
      price: 280,
      img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=300&fit=crop&auto=format",
      seller: "EcoColor India",
    },
  ];

const SCHEMES = [
  { id: 1, title: "PM Vishwakarma Yojana", desc: "Financial support up to ₹3 lakh for traditional artisans. Free skill training included.", amount: "₹3,00,000", eligible: true, icon: "🏛️" },
  { id: 2, title: "MUDRA Loan — Shishu", desc: "Loans up to ₹50,000 for starting or growing a craft business. No collateral needed.", amount: "₹50,000", eligible: true, icon: "💰" },
  { id: 3, title: "Handloom Weavers Scheme", desc: "Free tools, training, and health insurance for registered handloom weavers.", amount: "Free Tools + Insurance", eligible: true, icon: "🧵" },
  { id: 4, title: "Skill India Mission", desc: "Free skill development training at your nearest training centre.", amount: "Free Training", eligible: false, icon: "📚" },
  { id: 5, title: "Craftsmen Welfare Fund", desc: "Health and accidental insurance for artisans and their families.", amount: "₹2 lakh coverage", eligible: true, icon: "🏥" },
]

const TRANSACTIONS = [
  { id: "SS2024001", product: "Cotton Saree", buyer: "Priya S.", amount: 2600, status: "Verified", date: "03 Sep 2026", points: 12 },
  { id: "SS2024002", product: "Bamboo Basket", buyer: "Arjun M.", amount: 850, status: "Verified", date: "29 Aug 2026", points: 8 },
  { id: "SS2024003", product: "Embroidered Shawl", buyer: "Sunita R.", amount: 1800, status: "Completed", date: "25 Aug 2026", points: 10 },
]

// ─── SHARED UI ────────────────────────────────────────────────────────────────

function Btn({ children, onClick, variant = "primary", className = "" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; className?: string
}) {
  const base = "min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer select-none"
  const v = {
    primary: "bg-[#2D6A4F] text-white shadow-md hover:bg-[#1B4D38]",
    secondary: "bg-[#C4663A] text-white hover:bg-[#B35A30]",
    ghost: "bg-[#E8F5EE] text-[#1C1C1E] border border-[#E5DDD5]",
  }
  return <button onClick={onClick} className={`${base} ${v[variant]} ${className}`}>{children}</button>
}

function Header({ title, onBack, right }: { title?: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <div className="flex items-center px-4 pt-10 pb-3 gap-3 sticky top-0 z-30" style={{ background: "rgba(250,247,242,0.95)", backdropFilter: "blur(8px)" }}>
      {onBack && (
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center shrink-0 active:scale-95 text-[#1C1C1E] cursor-pointer hover:bg-[#D8EDE4] transition-colors"><ArrowLeft className="w-5 h-5" /></button>
      )}
      {title && <h1 className="font-display text-xl font-semibold flex-1 text-[#1C1C1E]">{title}</h1>}
      {right}
    </div>
  )
}

function BottomNav({ screen, nav }: { screen: Screen; nav: (s: Screen) => void }) {
  const t = useT()
  const items: { key: Screen; icon: React.ReactNode; label: string }[] = [
    { key: "home", icon: <Home className="w-5 h-5" />, label: t.nav_home },
    { key: "products", icon: <ShoppingBag className="w-5 h-5" />, label: t.nav_products },
    { key: "sales", icon: <BarChart3 className="w-5 h-5" />, label: t.nav_sales },
    { key: "govt", icon: <Landmark className="w-5 h-5" />, label: t.nav_govt },
    { key: "profile", icon: <User className="w-5 h-5" />, label: t.nav_profile },
  ]
  const isMain = ["home", "products", "sales", "govt", "profile"].includes(screen)
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full z-40 flex items-center border-t border-[#E5DDD5] shadow-lg" style={{ background: "#FAF7F2" }}>
      {items.map(item => (
        <button key={item.key} onClick={() => nav(item.key)}
          className={`flex-1 flex flex-col items-center py-2.5 pb-3 gap-1 active:scale-95 transition-all cursor-pointer ${isMain && screen === item.key ? "text-[#2D6A4F] font-bold" : "text-[#6B5B4E] hover:text-[#1C1C1E]"}`}>
          <span className="transition-transform">{item.icon}</span>
          <span className="text-[10px] font-semibold tracking-wide leading-none">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── VOICE PANEL ─────────────────────────────────────────────────────────────

interface VoiceCmd { label: string; action: () => void; response: string }

function VoicePanel({ onClose, commands, screen }: { onClose: () => void; commands: VoiceCmd[]; screen: Screen }) {
  const t = useT()
  const [phase, setPhase] = useState<"idle" | "listening" | "responding">("idle")
  const [selectedCmd, setSelectedCmd] = useState<VoiceCmd | null>(null)
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (phase === "listening") {
      const iv = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500)
      return () => clearInterval(iv)
    }
  }, [phase])

  const handleCmd = (cmd: VoiceCmd) => {
    setPhase("listening")
    setSelectedCmd(cmd)
    setTimeout(() => setPhase("responding"), 1200)
  }

  const handleConfirm = () => {
    onClose()
    selectedCmd?.action()
  }

  const EXPLAIN: Record<Screen, string> = {
    home: "This is your home screen. You can take a photo of your product, see your sales, or find raw materials.",
    camera: "Take a clear photo of your product. Good lighting helps get better results.",
    processing: "The AI is enhancing your photo and preparing it for the marketplace.",
    "voice-details": "Speak naturally about your product — name, material, quantity. The app will understand.",
    catalog: "This is your product listing. Review the details and description before setting a price.",
    price: "This is a fair price suggested based on your costs. You can accept or change it.",
    publish: "Review your product one last time before publishing it to the marketplace.",
    success: "Your product is now live! Share it or go to My Sales to track orders.",
    products: "Browse finished products or find raw materials for your craft.",
    sales: "This shows your earnings, orders, and business information.",
    govt: "Find government schemes that offer financial help and training for artisans.",
    trust: "Your verified transactions build your trust score, which helps attract more buyers.",
    profile: "Manage your artisan profile, language, and account settings.",
    language: "Select your language to use the app in your native language.",
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(28,28,30,0.5)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slide-up rounded-t-3xl overflow-hidden" style={{ background: "#FFFFFF", maxHeight: "85vh" }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-[#E5DDD5]" /></div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6B5B4E] font-semibold uppercase tracking-widest">{t.detected_lang}</p>
            <p className="font-display text-lg font-semibold text-[#1C1C1E]">{LANGS[useCurrentLang()].name}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#E8F5EE] flex items-center justify-center text-lg text-[#1C1C1E] cursor-pointer hover:bg-[#D8EDE4] transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {phase === "idle" && (
          <div className="px-5 pb-6 screen-scroll" style={{ maxHeight: "60vh" }}>
            {/* Big mic button */}
            <div className="flex flex-col items-center py-4">
              <div className="w-20 h-20 rounded-full bg-[#2D6A4F] mic-pulse flex items-center justify-center shadow-lg mb-3 text-white"><Mic className="w-10 h-10" /></div>
              <p className="text-sm text-[#6B5B4E] font-medium">{t.tap_to_speak}</p>
            </div>
            {/* Commands */}
            <p className="text-xs font-bold text-[#6B5B4E] uppercase tracking-widest mb-3">— or tap a command —</p>
            <div className="flex flex-col gap-2">
              {commands.map((cmd, i) => (
                <button key={i} onClick={() => handleCmd(cmd)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E5DDD5] bg-white text-left active:scale-98 transition-all">
                  <span className="p-1.5 rounded-lg bg-[#E8F5EE] text-[#2D6A4F]"><Mic className="w-4 h-4" /></span>
                  <span className="font-semibold text-[#1C1C1E]">"{cmd.label}"</span>
                </button>
              ))}
              <button onClick={() => handleCmd({ label: t.cmd_explain, action: () => { }, response: EXPLAIN[screen] })}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E5DDD5] bg-white text-left active:scale-98 transition-all">
                <span className="text-xl">🎙️</span>
                <span className="font-semibold text-[#1C1C1E]">"{t.cmd_explain}"</span>
              </button>
            </div>
          </div>
        )}

        {phase === "listening" && (
          <div className="flex flex-col items-center px-5 py-8 gap-4">
            <div className="w-24 h-24 rounded-full bg-[#2D6A4F] mic-pulse flex items-center justify-center shadow-xl text-white"><Mic className="w-12 h-12" /></div>
            <p className="font-display text-2xl font-semibold text-[#2D6A4F]">{t.listening}{dots}</p>
            <div className="flex gap-1 mt-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-1 rounded-full bg-[#2D6A4F]" style={{ height: `${12 + Math.random() * 24}px`, opacity: 0.6 + Math.random() * 0.4, animation: `micpulse ${0.8 + i * 0.1}s ease-in-out infinite` }} />
              ))}
            </div>
            <p className="text-sm text-[#6B5B4E] italic mt-2">"{selectedCmd?.label}"</p>
          </div>
        )}

        {phase === "responding" && selectedCmd && (
          <div className="px-5 pb-6 flex flex-col gap-4">
            <div className="rounded-2xl p-4" style={{ background: "#E8F5EE", border: "1px solid #2D6A4F" }}>
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-[#2D6A4F]/15 text-[#2D6A4F]"><Bot className="w-6 h-6" /></span>
                <div>
                  <p className="text-xs font-bold text-[#1B4D38] uppercase tracking-wide mb-1">ShilpSetu Assistant</p>
                  <p className="text-[#1C1C1E] font-medium leading-snug">{selectedCmd.response}</p>
                </div>
              </div>
            </div>
            {selectedCmd.action.toString() !== (() => { }).toString() && (
              <div className="flex gap-3">
                <Btn variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
                <Btn onClick={handleConfirm} className="flex-1">{t.confirm} →</Btn>
              </div>
            )}
            {selectedCmd.action.toString() === (() => { }).toString() && (
              <Btn onClick={onClose} className="w-full">{t.confirm}</Btn>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

import { createContext, useContext } from "react"
const LangCtx = createContext<LangCode>("en")
const useCurrentLang = () => useContext(LangCtx)
const useT = () => LANGS[useContext(LangCtx)]

// ─── SCREENS ─────────────────────────────────────────────────────────────────


function AuthRegisterScreen({
  onComplete,
  onGoToSignIn,
  onSelectLang,
}: {
  onComplete: (user: UserProfile) => void;
  onGoToSignIn: () => void;
  onSelectLang: (lang: LangCode) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [selectedLang, setSelectedLang] = useState<LangCode>("ml");
  const [craft, setCraft] = useState(CRAFT_OPTIONS[0].en);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(30);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [demoBanner, setDemoBanner] = useState(false);

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCountdown]);

  const handleSendOtp = () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setPhoneError("ദയവായി സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക / Enter a valid 10-digit phone number");
      return;
    }
    setPhoneError("");
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      setStep(2);
      setResendCountdown(30);
      setDemoBanner(true);
      setTimeout(() => otpInputs.current[0]?.focus(), 100);
    }, 800);
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1).replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError("");
    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("ദയവായി 6 അക്ക OTP പൂർണ്ണമായി നൽകുക / Enter the full 6-digit OTP");
      return;
    }
    setStep(3);
  };

  const handleAutoFillOtp = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
    setOtpError("");
  };

  const handleCompleteRegistration = () => {
    const finalName = name.trim() || "കരകൗശല കലാകാരൻ (Artisan)";
    const newUser: UserProfile = {
      name: finalName,
      phone: phone,
      language: selectedLang,
      craftType: craft,
      token: "shilpsetu_auth_" + Date.now(),
      avatar: "👩‍🦱",
      memberSince: "2026",
    };
    saveUserSession(newUser);
    onSelectLang(selectedLang);
    onComplete(newUser);
  };

  return (
    <div className="woven-bg min-h-full flex flex-col fade-in pb-12">
      {/* Header */}
      <div className="pt-10 pb-4 px-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-2 shadow-lg text-white" style={{ background: "#2D6A4F" }}>
          <Scissors className="w-8 h-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[#2D6A4F] tracking-tight">ShilpSetu</h1>
        <p className="text-xs font-bold text-[#C4663A] uppercase tracking-widest">Artisan Registration / രജിസ്ട്രേഷൻ</p>
      </div>

      {/* 3-Step Wizard Indicator */}
      <div className="mx-6 mb-6">
        <div className="flex items-center">
          {[
            { num: 1, labelEn: "Phone", labelMl: "ഫോൺ" },
            { num: 2, labelEn: "OTP", labelMl: "ഒ.ടി.പി" },
            { num: 3, labelEn: "Profile", labelMl: "പ്രൊഫൈൽ" },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all ${step === s.num
                    ? "bg-[#2D6A4F] text-white ring-4 ring-[#E8F5EE] shadow-md"
                    : step > s.num
                      ? "bg-[#1B4D38] text-white"
                      : "bg-[#E8F5EE] text-[#6B5B4E]"
                    }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className="text-[10px] font-bold text-[#1C1C1E]">{s.labelMl}</span>
                <span className="text-[9px] text-[#6B5B4E]">{s.labelEn}</span>
              </div>
              {idx < 2 && (
                <div
                  className={`h-1 flex-1 mb-6 rounded-full transition-all ${step > s.num ? "bg-[#2D6A4F]" : "bg-[#E5DDD5]"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="px-6 flex-1 flex flex-col justify-between">
        {/* STEP 1: Phone */}
        {step === 1 && (
          <div className="fade-in flex flex-col gap-4">
            <div className="rounded-2xl p-4 bg-white border border-[#E5DDD5] shadow-card">
              <h2 className="font-display text-lg font-bold text-[#1C1C1E] mb-0.5">
                മൊബൈൽ നമ്പർ നൽകുക
              </h2>
              <p className="text-xs text-[#6B5B4E] mb-4">Enter your 10-digit mobile number to verify</p>

              <label className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide mb-1.5 block">
                Phone Number / ഫോൺ നമ്പർ
              </label>
              <div className="flex items-center rounded-2xl border-2 border-[#E5DDD5] focus-within:border-[#2D6A4F] bg-[#FAF7F2] px-3 py-2 transition-all">
                <span className="text-base font-bold text-[#1C1C1E] mr-2 flex items-center gap-1.5 border-r border-[#E5DDD5] pr-2.5">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setPhoneError("");
                  }}
                  placeholder="98765 43210"
                  className="w-full bg-transparent text-lg font-bold text-[#1C1C1E] tracking-wider outline-none placeholder-[#9B8B80]"
                />
              </div>
              {phoneError && <p className="text-xs text-[#C4663A] font-semibold mt-2">{phoneError}</p>}
            </div>

            <div className="rounded-2xl p-3.5 bg-[#E8F5EE] border border-[#2D6A4F]/30 flex items-start gap-2.5">
              <span className="text-xl">🔒</span>
              <p className="text-xs text-[#1B4D38] leading-relaxed">
                സുരക്ഷിതമായ ഫോൺ ലോഗിൻ. പാസ്‌വേഡ് ആവശ്യമില്ല. <br />
                <span className="text-[#6B5B4E]">Secure OTP sign-in. No complex passwords to remember.</span>
              </p>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="w-full min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer select-none bg-[#2D6A4F] text-white shadow-md hover:bg-[#1B4D38]"
            >
              {sendingOtp ? "OTP അയയ്ക്കുന്നു... (Sending...)" : "OTP അയയ്ക്കുക (Send OTP) →"}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-[#6B5B4E]">
                ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടോ?{" "}
                <button
                  onClick={onGoToSignIn}
                  className="font-bold text-[#2D6A4F] underline ml-1 cursor-pointer hover:text-[#1B4D38]"
                >
                  Sign In (സൈൻ ഇൻ)
                </button>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <div className="fade-in flex flex-col gap-4">
            <div className="rounded-2xl p-4 bg-white border border-[#E5DDD5] shadow-card">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-lg font-bold text-[#1C1C1E]">
                  OTP പരിശോധന
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#C4663A] underline cursor-pointer"
                >
                  Change Number
                </button>
              </div>
              <p className="text-xs text-[#6B5B4E] mb-4">
                OTP sent to <span className="font-bold text-[#1C1C1E]">+91 {phone}</span>
              </p>

              {demoBanner && (
                <div className="mb-4 rounded-xl p-2.5 bg-[#FDF7E3] border border-[#C9A227]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span className="text-xs text-[#1C1C1E] font-medium">Demo OTP: <b>123456</b></span>
                  </div>
                  <button
                    onClick={handleAutoFillOtp}
                    className="text-xs font-bold bg-[#C9A227] text-white px-2.5 py-1 rounded-lg shadow-sm"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <label className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide mb-2 block">
                Enter 6-Digit OTP / OTP നൽകുക
              </label>

              {/* 6 OTP Digits */}
              <div className="flex justify-between gap-2 mb-2">
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <input
                    key={idx}
                    ref={el => { otpInputs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-bold bg-[#FAF7F2] border-2 border-[#E5DDD5] focus:border-[#2D6A4F] rounded-xl outline-none text-[#1C1C1E] transition-all"
                  />
                ))}
              </div>
              {otpError && <p className="text-xs text-[#C4663A] font-semibold mt-1">{otpError}</p>}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5DDD5]">
                <span className="text-xs text-[#6B5B4E]">Didn't receive code?</span>
                {resendCountdown > 0 ? (
                  <span className="text-xs font-bold text-[#9B8B80]">
                    Resend in {resendCountdown}s ({resendCountdown} സെക്കൻഡ്)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setResendCountdown(30);
                      setDemoBanner(true);
                    }}
                    className="text-xs font-bold text-[#2D6A4F] hover:underline cursor-pointer"
                  >
                    Resend OTP (വീണ്ടും അയയ്ക്കുക)
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer select-none bg-[#2D6A4F] text-white shadow-md hover:bg-[#1B4D38]"
            >
              പരിശോധിച്ച് തുടരുക (Verify & Continue) →
            </button>
          </div>
        )}

        {/* STEP 3: Profile */}
        {step === 3 && (
          <div className="fade-in flex flex-col gap-4">
            <div className="rounded-2xl p-4 bg-white border border-[#E5DDD5] shadow-card">
              <h2 className="font-display text-lg font-bold text-[#1C1C1E] mb-0.5">
                കലാകാരന്റെ വിവരങ്ങൾ
              </h2>
              <p className="text-xs text-[#6B5B4E] mb-4">Complete your artisan profile details</p>

              {/* Full Name */}
              <div className="mb-3.5">
                <label className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide mb-1 block">
                  പൂർണ്ണ പേര് / Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ഉദാ: മീന ദേവി (e.g. Meena Devi)"
                  className="w-full bg-[#FAF7F2] border-2 border-[#E5DDD5] focus:border-[#2D6A4F] rounded-xl px-3.5 py-2.5 text-base font-semibold text-[#1C1C1E] outline-none placeholder-[#9B8B80]"
                />
              </div>

              {/* Preferred Language */}
              <div className="mb-3.5">
                <label className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide mb-1 block">
                  തിരഞ്ഞെടുത്ത ഭാഷ / Preferred Language
                </label>
                <select
                  value={selectedLang}
                  onChange={e => setSelectedLang(e.target.value as LangCode)}
                  className="w-full bg-[#FAF7F2] border-2 border-[#E5DDD5] focus:border-[#2D6A4F] rounded-xl px-3.5 py-2.5 text-base font-semibold text-[#1C1C1E] outline-none cursor-pointer"
                >
                  {AUTH_LANGS.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.native} ({l.en})
                    </option>
                  ))}
                </select>
              </div>

              {/* Craft Type */}
              <div>
                <label className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide mb-1 block">
                  കരകൗശല തൊഴിൽ / Craft & Trade Type
                </label>
                <select
                  value={craft}
                  onChange={e => setCraft(e.target.value)}
                  className="w-full bg-[#FAF7F2] border-2 border-[#E5DDD5] focus:border-[#2D6A4F] rounded-xl px-3.5 py-2.5 text-base font-semibold text-[#1C1C1E] outline-none cursor-pointer"
                >
                  {CRAFT_OPTIONS.map(c => (
                    <option key={c.key} value={c.en}>
                      {c.icon} {c.ml} — {c.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCompleteRegistration}
              className="w-full min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer select-none bg-[#2D6A4F] text-white shadow-md hover:bg-[#1B4D38]"
            >
              രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക (Complete Registration) 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AuthSignInScreen({
  onSignInSuccess,
  onGoToRegister,
}: {
  onSignInSuccess: (user: UserProfile) => void;
  onGoToRegister: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(30);
  const [loading, setLoading] = useState(false);

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, resendCountdown]);

  const handleSendOtp = () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setPhoneError("ദയവായി സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക / Enter a valid 10-digit phone number");
      return;
    }
    setPhoneError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setResendCountdown(30);
      setTimeout(() => otpInputs.current[0]?.focus(), 100);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1).replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError("");
    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleSignIn = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("ദയവായി 6 അക്ക OTP നൽകുക / Enter the 6-digit OTP");
      return;
    }
    const existing = getStoredSession();
    const activeUser: UserProfile = existing || {
      name: "Meena Devi",
      phone: phone || "9876543210",
      language: "ml",
      craftType: "Handloom Weaving",
      token: "shilpsetu_auth_" + Date.now(),
      avatar: "👩‍🦱",
      memberSince: "2024",
    };
    saveUserSession(activeUser);
    onSignInSuccess(activeUser);
  };

  const handleGuestLogin = () => {
    saveUserSession(DEFAULT_USER);
    onSignInSuccess(DEFAULT_USER);
  };

  return (
    <div className="woven-bg min-h-full flex flex-col justify-between fade-in px-6 py-12">
      {/* Brand Header */}
      <div className="flex flex-col items-center pt-6">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-3 shadow-lg text-white" style={{ background: "#2D6A4F" }}>
          <Scissors className="w-10 h-10" />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#2D6A4F] tracking-tight">ShilpSetu</h1>
        <p className="text-sm font-bold text-[#C4663A] uppercase tracking-widest mt-0.5">Artisan Marketplace</p>
        <div className="mt-4 rounded-2xl px-5 py-2.5 text-center bg-white border border-[#E5DDD5] shadow-card">
          <p className="text-base font-bold text-[#1C1C1E]">സ്വാഗതം / Welcome Back</p>
          <p className="text-xs text-[#6B5B4E]">Sign in with your mobile number</p>
        </div>
      </div>

      {/* Main Login Form */}
      <div className="my-auto py-6">
        {!otpSent ? (
          <div className="bg-white rounded-2xl p-5 border border-[#E5DDD5] shadow-card flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide mb-1.5 block">
                Phone Number / മൊബൈൽ നമ്പർ
              </label>
              <div className="flex items-center rounded-2xl border-2 border-[#E5DDD5] focus-within:border-[#2D6A4F] bg-[#FAF7F2] px-3.5 py-2.5 transition-all">
                <span className="text-base font-bold text-[#1C1C1E] mr-2 flex items-center gap-1.5 border-r border-[#E5DDD5] pr-2.5">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setPhoneError("");
                  }}
                  placeholder="98765 43210"
                  className="w-full bg-transparent text-lg font-bold text-[#1C1C1E] tracking-wider outline-none placeholder-[#9B8B80]"
                />
              </div>
              {phoneError && <p className="text-xs text-[#C4663A] font-semibold mt-2">{phoneError}</p>}
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer select-none bg-[#2D6A4F] text-white shadow-md hover:bg-[#1B4D38]"
            >
              {loading ? "പരിശോധിക്കുന്നു... (Checking...)" : "OTP നേടുക (Get OTP to Sign In) →"}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 border border-[#E5DDD5] shadow-card flex flex-col gap-4 fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#1C1C1E]">Enter OTP (OTP നൽകുക)</p>
                <p className="text-xs text-[#6B5B4E]">Sent to +91 {phone}</p>
              </div>
              <button
                onClick={() => setOtpSent(false)}
                className="text-xs font-bold text-[#C4663A] underline cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="rounded-xl p-2 bg-[#FDF7E3] border border-[#C9A227]/40 flex items-center justify-between text-xs">
              <span className="text-[#1C1C1E]">💡 Demo OTP: <b>123456</b></span>
              <button
                onClick={() => setOtp(["1", "2", "3", "4", "5", "6"])}
                className="font-bold text-[#C9A227] underline"
              >
                Auto-fill
              </button>
            </div>

            <div className="flex justify-between gap-2">
              {[0, 1, 2, 3, 4, 5].map(idx => (
                <input
                  key={idx}
                  ref={el => { otpInputs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  className="w-11 h-13 text-center text-xl font-bold bg-[#FAF7F2] border-2 border-[#E5DDD5] focus:border-[#2D6A4F] rounded-xl outline-none text-[#1C1C1E]"
                />
              ))}
            </div>
            {otpError && <p className="text-xs text-[#C4663A] font-semibold">{otpError}</p>}

            <button
              onClick={handleSignIn}
              className="w-full min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer select-none bg-[#2D6A4F] text-white shadow-md hover:bg-[#1B4D38]"
            >
              സൈൻ ഇൻ ചെയ്യുക (Sign In) →
            </button>
          </div>
        )}
      </div>

      {/* Footer Options */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onGoToRegister}
          className="w-full min-h-[48px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 border-[#2D6A4F] text-[#2D6A4F] bg-[#E8F5EE] active:scale-95 cursor-pointer"
        >
          പുതിയ കലാകാരനാണോ? രജിസ്റ്റർ ചെയ്യുക (Register Now)
        </button>

        <button
          onClick={handleGuestLogin}
          className="text-xs text-[#6B5B4E] font-semibold hover:text-[#1C1C1E] underline text-center cursor-pointer py-1"
        >
          Explore as Demo Artisan (മീന ദേവി) →
        </button>
      </div>
    </div>
  );
}

function LanguageScreen({ onSelect }: { onSelect: (lang: LangCode) => void }) {
  const LANG_LIST: LangCode[] = ["ml", "hi", "bn", "ta", "te", "kn", "mr", "en"]
  const [voiceOpen, setVoiceOpen] = useState(false)

  return (
    <div className="woven-bg min-h-full flex flex-col fade-in">
      {/* Hero */}
      <div className="flex flex-col items-center pt-16 pb-8 px-6" style={{ background: "linear-gradient(180deg, rgba(185,74,28,0.08) 0%, transparent 100%)" }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-4 shadow-lg" style={{ background: "#2D6A4F" }}>🪡</div>
        <h1 className="font-display text-4xl font-bold text-[#2D6A4F] mb-1 tracking-tight">ShilpSetu</h1>
        <p className="text-[#C4663A] font-bold text-sm tracking-widest uppercase mb-3">Your Digital Craft Assistant</p>
        <div className="rounded-2xl px-5 py-3 text-center" style={{ background: "rgba(185,74,28,0.08)", border: "1px solid rgba(185,74,28,0.2)" }}>
          <p className="text-[#1C1C1E] font-semibold text-base">Take a photo. Speak. Sell.</p>
          <p className="text-[#6B5B4E] text-sm mt-0.5">ফোটো তুলুন। বলুন। বেচুন।</p>
        </div>
      </div>

      {/* Language grid */}
      <div className="px-5 flex-1">
        <p className="text-center text-xs font-bold text-[#6B5B4E] uppercase tracking-widest mb-4">Choose your language / अपनी भाषा चुनें</p>
        <div className="grid grid-cols-2 gap-3">
          {LANG_LIST.map(code => (
            <button key={code} onClick={() => onSelect(code)}
              className="rounded-2xl py-4 px-4 text-center transition-all active:scale-95 flex flex-col items-center gap-1"
              style={{ background: "#FFFFFF", border: "2px solid #E5DDD5", boxShadow: "0 2px 8px rgba(42,21,5,0.08)" }}>
              <span className="text-2xl font-display font-bold text-[#1C1C1E]">{LANGS[code].name}</span>
              {code !== "en" && <span className="text-xs text-[#6B5B4E]">English</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center px-5 py-8 gap-3">
        <button onClick={() => setVoiceOpen(true)}
          className="w-full rounded-2xl py-4 flex items-center justify-center gap-3 font-bold text-lg mic-pulse"
          style={{ background: "#2D6A4F", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(185,74,28,0.35)" }}>
          <span className="text-2xl">🎤</span> Speak to use the app
        </button>
        <p className="text-xs text-[#6B5B4E]">बोलकर ऐप इस्तेमाल करें • ഇവിടെ ടാപ്പ് ചെയ്ത് സംസാരിക്കൂ</p>
      </div>

      {voiceOpen && (
        <VoicePanel onClose={() => setVoiceOpen(false)} screen="language" commands={[
          { label: "Open in Hindi", action: () => onSelect("hi"), response: "हिंदी में खुल रहा है।" },
          { label: "Open in Malayalam", action: () => onSelect("ml"), response: "മലയാളത്തിൽ തുറക്കുന്നു." },
          { label: "Open in English", action: () => onSelect("en"), response: "Opening in English." },
        ]} />
      )}
    </div>
  )
}

function getGreeting(lang: LangCode, name: string): string {
  const firstName = name.trim().split(" ")[0] || "Artisan";
  switch (lang) {
    case "ml": return `നമസ്കാരം, ${firstName}! 🙏`;
    case "hi": return `नमस्ते, ${firstName}! 🙏`;
    case "bn": return `নমস্কার, ${firstName}! 🙏`;
    case "ta": return `வணக்கம், ${firstName}! 🙏`;
    case "te": return `నమస్కారం, ${firstName}! 🙏`;
    case "kn": return `ನಮಸ್ಕಾರ, ${firstName}! 🙏`;
    case "mr": return `नमस्कार, ${firstName}! 🙏`;
    case "en":
    default: return `Namaste, ${firstName}! 🙏`;
  }
}

function HomeScreen({ user, nav, openVoice }: { user?: UserProfile | null; nav: (s: Screen) => void; openVoice: () => void }) {
  const t = useT()
  const lang = useCurrentLang()
  const greeting = getGreeting(lang, user?.name || "Meena")

  const steps = [
    { num: 1, label: t.step_photo, sub: "Photo" },
    { num: 2, label: t.step_tell, sub: "Tell" },
    { num: 3, label: t.step_price, sub: "Price" },
    { num: 4, label: t.step_sell, sub: "Sell" },
  ];

  return (
    <div className="woven-bg min-h-full pb-24 fade-in">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#6B5B4E] font-semibold uppercase tracking-widest">ShilpSetu</p>
          <h1 className="font-display text-2xl font-bold text-[#1C1C1E]">{greeting}</h1>
        </div>
        <button onClick={() => nav("profile")} className="w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:ring-2 hover:ring-[#2D6A4F] transition-all" style={{ background: "#E8F5EE", border: "2px solid #E5DDD5" }}>
          {user?.avatar || "👩‍🦱"}
        </button>
      </div>

      {/* Progress banner */}
      <div className="mx-5 mb-5 rounded-2xl p-4 flex items-center gap-3 shadow-md" style={{ background: "linear-gradient(135deg, #C4663A, #1B4D38)", color: "#FFFFFF" }}>
        <span className="p-2.5 rounded-2xl bg-white/20 text-white"><Sparkles className="w-6 h-6" /></span>
        <div>
          <p className="font-bold text-sm">{t.insight}</p>
          <p className="text-[#E8F5EE] text-xs mt-0.5">{t.orders_pending}</p>
        </div>
        <button onClick={() => nav("sales")} className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 active:scale-95 transition-all cursor-pointer">{t.view_action} →</button>
      </div>

      {/* Progress steps */}
      <div className="mx-5 mb-5">
        <div className="flex items-center gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 shadow-sm ${i < 2 ? "bg-[#2D6A4F] text-white" : "bg-[#E8F5EE] text-[#6B5B4E]"}`}>{i + 1}</div>
                <span className="text-[10px] font-bold text-[#1C1C1E] text-center whitespace-nowrap leading-tight">{step.label}</span>
                {lang !== "en" && <span className="text-[8px] text-[#6B5B4E] text-center whitespace-nowrap">{step.sub}</span>}
              </div>
              {i < 3 && <div className={`h-0.5 flex-1 mb-6 ${i < 1 ? "bg-[#2D6A4F]" : "bg-[#E5DDD5]"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* 3 big action buttons */}
      <div className="px-5 flex flex-col gap-3 mb-5">
        <button onClick={() => nav("camera")}
          className="rounded-3xl p-5 flex items-center gap-4 active:scale-98 transition-all text-left cursor-pointer hover:shadow-lg"
          style={{ background: "#2D6A4F", boxShadow: "0 6px 24px rgba(45,106,79,0.25)" }}>
          <span className="p-3.5 rounded-2xl bg-white/20 text-white"><Camera className="w-9 h-9" /></span>
          <div>
            <p className="text-white font-display text-xl font-bold">{t.take_photo}</p>
            <p className="text-[#FDEEE6] text-sm mt-0.5">{t.add_product_sub}</p>
            {lang !== "en" && <p className="text-white/70 text-[11px]">Add a new product to sell</p>}
          </div>
          <span className="ml-auto text-white text-2xl">→</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => nav("sales")}
            className="rounded-2xl p-4 flex flex-col items-start gap-2 active:scale-98 transition-all text-left cursor-pointer hover:shadow-md"
            style={{ background: "#C4663A", boxShadow: "0 4px 16px rgba(196,102,58,0.25)" }}>
            <span className="p-2.5 rounded-2xl bg-white/20 text-white"><BarChart3 className="w-7 h-7" /></span>
            <div>
              <p className="text-white font-bold text-base">{t.my_sales}</p>
              {lang !== "en" && <p className="text-white/75 text-[10px]">My Sales</p>}
            </div>
          </button>
          <button onClick={() => nav("products")}
            className="rounded-2xl p-4 flex flex-col items-start gap-2 active:scale-98 transition-all text-left cursor-pointer hover:shadow-md"
            style={{ background: "#C9A227", boxShadow: "0 4px 16px rgba(201,162,39,0.25)" }}>
            <span className="p-2.5 rounded-2xl bg-[#1C1C1E]/10 text-[#1C1C1E]"><Package className="w-7 h-7" /></span>
            <div>
              <p className="text-[#1C1C1E] font-bold text-base">{t.find_materials}</p>
              {lang !== "en" && <p className="text-[#1C1C1E]/70 text-[10px]">Find Materials</p>}
            </div>
          </button>
        </div>
      </div>

      {/* Marketplace preview */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-lg font-bold text-[#1C1C1E] leading-tight">{t.marketplace_title}</h2>
            {lang !== "en" && <p className="text-[10px] text-[#6B5B4E] font-medium">Marketplace</p>}
          </div>
          <button onClick={() => nav("products")} className="text-[#2D6A4F] text-sm font-bold flex items-center gap-0.5 hover:underline cursor-pointer">
            {t.see_all} →
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {PRODUCTS.slice(0, 3).map(p => {
            const localizedName = p.names?.[lang] || p.name;
            const localizedCraft = p.crafts?.[lang] || p.craft;
            return (
              <div key={p.id} onClick={() => nav("products")} className="shrink-0 w-36 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all bg-white border border-[#E5DDD5] shadow-sm flex flex-col justify-between">
                <div className="relative">
                  <img src={p.img} alt={p.name} className="w-full h-24 object-cover bg-[#E8F5EE]" />
                  {/* Trust Badge */}
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-[#1C1C1E]/80 backdrop-blur-sm text-white text-[9px] font-bold flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-[#C9A227]" />
                    <span>{p.trustScore}%</span>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-[#1C1C1E] line-clamp-1 leading-tight">{localizedName}</p>
                  {lang !== "en" && localizedName !== p.name && (
                    <p className="text-[9px] text-[#9B8B80] line-clamp-1 mt-0.5">{p.name}</p>
                  )}
                  <p className="text-[10px] text-[#6B5B4E] mt-0.5">{localizedCraft}</p>
                  <p className="text-[#2D6A4F] font-bold text-xs mt-1">₹{p.price.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Govt help */}
      <div className="mx-5">
        <button onClick={() => nav("govt")} className="w-full rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-all text-left bg-white border border-[#E5DDD5] shadow-sm hover:shadow-md cursor-pointer">
          <span className="p-2 rounded-xl bg-[#E8F5EE] text-[#2D6A4F]"><Landmark className="w-6 h-6" /></span>
          <div className="text-left flex-1">
            <p className="font-bold text-[#1C1C1E]">{t.govt_help}</p>
            <p className="text-xs text-[#6B5B4E] mt-0.5">{t.govt_schemes_sub}</p>
            {lang !== "en" && <p className="text-[10px] text-[#9B8B80]">PM Vishwakarma • MUDRA • and 3 more</p>}
          </div>
          <span className="text-[#2D6A4F] font-bold text-lg">→</span>
        </button>
      </div>
    </div>
  )
}

function CameraScreen({ nav, onBack }: { nav: (s: Screen) => void; onBack: () => void }) {
  const t = useT()
  const [captured, setCaptured] = useState(false)

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: captured ? "#FAF7F2" : "#1a1a1a" }}>
      {captured ? (
        <>
          <Header title={t.take_photo_btn} onBack={() => setCaptured(false)} />
          <div className="px-5 py-3 flex-1">
            <div className="rounded-3xl overflow-hidden mb-4" style={{ border: "3px solid #2D6A4F" }}>
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=600&fit=crop&auto=format" alt="Product" className="w-full h-64 object-cover bg-[#E8F5EE]" />
            </div>
            <div className="rounded-2xl p-3 mb-4 flex items-center gap-2" style={{ background: "#E8F5EE", border: "1px solid #2D6A4F" }}>
              <span className="text-lg">✅</span>
              <p className="text-sm font-semibold text-[#1C1C1E]">Good photo! Clear lighting detected.</p>
            </div>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={() => setCaptured(false)} className="flex-1">{t.retake}</Btn>
              <Btn onClick={() => nav("processing")} className="flex-1">{t.continue_btn} →</Btn>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Camera viewfinder */}
          <div className="relative flex-1 flex flex-col" style={{ background: "#111" }}>
            <div className="absolute top-12 left-0 right-0 px-5 flex items-center justify-between z-10">
              <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer" style={{ background: "rgba(255,255,255,0.2)" }}><ArrowLeft className="w-5 h-5" /></button>
              <div className="rounded-full px-3 py-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                <span className="text-white text-xs font-bold">🔴 LIVE</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Viewfinder */}
            <div className="flex-1 flex items-center justify-center relative">
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop&auto=format" alt="Camera preview" className="w-full h-full object-cover opacity-70" />
              {/* Corner guides */}
              <div className="absolute inset-8 pointer-events-none">
                {[["top-0 left-0 border-t-2 border-l-2", ""], ["top-0 right-0 border-t-2 border-r-2", ""], ["bottom-0 left-0 border-b-2 border-l-2", ""], ["bottom-0 right-0 border-b-2 border-r-2", ""]].map(([cls], i) => (
                  <div key={i} className={`absolute w-8 h-8 border-[#C9A227] ${cls}`} />
                ))}
              </div>
              <div className="absolute bottom-4 left-0 right-0 px-5">
                <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                  <p className="text-white text-sm">🎤 "Take a clear photo of your product."</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-around px-8 py-6" style={{ background: "#111" }}>
              <button className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }} onClick={() => nav("processing")}>
                <ImageIcon className="w-6 h-6 text-white" />
              </button>
              <button onClick={() => setCaptured(true)}
                className="w-20 h-20 rounded-full flex items-center justify-center active:scale-90 transition-all"
                style={{ background: "#FFFFFF", boxShadow: "0 0 0 4px rgba(255,255,255,0.3)" }}>
                <div className="w-16 h-16 rounded-full" style={{ background: "#2D6A4F" }} />
              </button>
              <button className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Flashlight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          <div className="px-5 pb-6 pt-3" style={{ background: "#1a1a1a" }}>
            <Btn variant="ghost" onClick={() => { setCaptured(true) }} className="w-full">{t.upload_gallery}</Btn>
          </div>
        </>
      )}
    </div>
  )
}

function ProcessingScreen({ nav, onBack }: { nav: (s: Screen) => void; onBack: () => void }) {
  const t = useT()
  const steps = [t.recognizing, t.removing_bg, t.improving, t.preparing, t.creating_catalog]
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => setStep(s => s + 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setTimeout(() => setDone(true), 400)
    }
  }, [step])

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <Header title="AI Processing" onBack={onBack} />
      <div className="flex-1 px-5 pb-24 flex flex-col gap-5">
        {!done ? (
          <>
            <div className="rounded-3xl overflow-hidden relative h-52" style={{ border: "2px solid #E5DDD5" }}>
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop&auto=format" alt="Processing" className="w-full h-full object-cover" style={{ filter: step < 3 ? "brightness(0.7) saturate(0.5)" : "none", transition: "filter 1s" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-white border-t-[#2D6A4F] spin-slow" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${i < step ? "opacity-100" : "opacity-30"}`} style={{ background: i < step ? "#E8F5EE" : "#E8F5EE", border: `1px solid ${i < step ? "#2D6A4F" : "#E5DDD5"}` }}>
                  <span className="text-lg">{i < step ? "✅" : i === step - 1 ? "⏳" : "⭕"}</span>
                  <span className={`font-semibold text-sm ${i < step ? "text-[#1C1C1E]" : "text-[#6B5B4E]"}`}>{s}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="fade-in flex flex-col gap-4">
            <p className="font-display text-xl font-bold text-[#1C1C1E] text-center">✨ AI Enhancement Complete</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #E5DDD5" }}>
                <p className="text-center text-xs font-bold text-[#6B5B4E] py-1.5" style={{ background: "#E8F5EE" }}>Before</p>
                <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop&auto=format" alt="Before" className="w-full h-32 object-cover" style={{ filter: "brightness(0.65) saturate(0.4)" }} />
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #2D6A4F" }}>
                <p className="text-center text-xs font-bold text-[#2D6A4F] py-1.5" style={{ background: "rgba(185,74,28,0.1)" }}>After ✨</p>
                <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop&auto=format" alt="After" className="w-full h-32 object-cover" />
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
              <p className="font-bold text-[#1C1C1E] mb-2">🤖 AI Assistant</p>
              <p className="text-sm text-[#6B5B4E]">"Your product image is ready. Background removed, lighting improved. Now let's add product details."</p>
            </div>
            <Btn onClick={() => nav("voice-details")} className="w-full">{t.continue_btn} →</Btn>
          </div>
        )}
      </div>
    </div>
  )
}

function VoiceDetailsScreen({ nav, onBack, openVoice }: { nav: (s: Screen) => void; onBack: () => void; openVoice: () => void }) {
  const t = useT()
  const [phase, setPhase] = useState<"intro" | "recording" | "done">("intro")
  const [details, setDetails] = useState({ name: "Handwoven Cotton Saree", material: "100% Pure Cotton", craft: "Traditional Handloom", qty: "3 pieces", days: "7 work days", matCost: "₹800", expenses: "₹200" })

  useEffect(() => {
    if (phase === "recording") {
      const t = setTimeout(() => setPhase("done"), 3000)
      return () => clearTimeout(t)
    }
  }, [phase])

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <Header title={t.speak_details} onBack={onBack} />
      <div className="flex-1 px-5 pb-24 flex flex-col gap-4">

        {phase === "intro" && (
          <>
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
              <span className="text-2xl">🤖</span>
              <p className="text-sm text-[#1C1C1E] leading-relaxed">"Speak naturally in your language. Tell me the product name, what it's made of, how many you have, and your costs."</p>
            </div>

            <div className="rounded-2xl p-4" style={{ background: "#E8F5EE", border: "1px dashed #E5DDD5" }}>
              <p className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide mb-2">Example (Malayalam)</p>
              <p className="text-[#1C1C1E] italic text-sm leading-relaxed">"ഇത് ഒരു കൈത്തറി കോട്ടൺ സാരിയാണ്. ഇതിൽ 100% ശുദ്ധ കോട്ടൺ ഉപയോഗിച്ചിരിക്കുന്നു. 3 എണ്ണം ഉണ്ട്. 7 ദിവസം ജോലി ചെയ്തു. ₹800 ചെലവായി."</p>
            </div>

            <button onClick={() => setPhase("recording")}
              className="flex flex-col items-center gap-3 w-full rounded-3xl py-8 active:scale-95 transition-all"
              style={{ background: "#2D6A4F", boxShadow: "0 6px 24px rgba(185,74,28,0.35)" }}>
              <span className="text-6xl">🎤</span>
              <p className="text-white font-display text-2xl font-bold">{t.tap_to_speak}</p>
              <p className="text-[#FDEEE6] text-sm">Tap and speak in your language</p>
            </button>
          </>
        )}

        {phase === "recording" && (
          <div className="flex flex-col items-center gap-5 py-6 fade-in">
            <div className="w-28 h-28 rounded-full bg-[#2D6A4F] mic-pulse flex items-center justify-center shadow-xl text-white"><Mic className="w-14 h-14" /></div>
            <p className="font-display text-2xl font-bold text-[#2D6A4F]">{t.listening}</p>
            <div className="flex gap-1 items-end h-12">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-2 rounded-t bg-[#2D6A4F]" style={{ height: `${20 + Math.sin(i) * 16 + Math.cos(i * 0.7) * 12}px`, opacity: 0.5 + 0.5 * Math.abs(Math.sin(i)), animation: `micpulse ${0.6 + i * 0.08}s ease-in-out infinite` }} />
              ))}
            </div>
            <div className="rounded-2xl px-5 py-3 w-full" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
              <p className="text-xs text-[#6B5B4E] font-bold mb-1">{t.detected_lang}: <span className="text-[#2D6A4F]">മലയാളം</span></p>
              <p className="text-[#1C1C1E] text-sm italic animate-pulse">"ഇത് ഒരു കൈത്തറി കോട്ടൺ സാരിയാണ്..."</p>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col gap-4 fade-in">
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#E8F5EE", border: "1px solid #2D6A4F" }}>
              <span className="text-xl">✅</span>
              <p className="text-sm text-[#1C1C1E] font-medium">"Your product details are ready. Please review and confirm."</p>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5DDD5" }}>
              {Object.entries({ "Product Name": details.name, "Material": details.material, "Craft Type": details.craft, "Quantity": details.qty, "Work Days": details.days, "Material Cost": details.matCost, "Other Expenses": details.expenses }).map(([k, v], i) => (
                <div key={i} className={`flex justify-between items-center px-4 py-3 ${i % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#FDF7E3]"}`}>
                  <span className="text-xs font-bold text-[#6B5B4E] uppercase tracking-wide">{k}</span>
                  <span className="text-sm font-semibold text-[#1C1C1E]">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={() => setPhase("intro")} className="flex-1">{t.edit}</Btn>
              <Btn onClick={() => nav("catalog")} className="flex-1">{t.confirm} →</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CatalogScreen({ user, nav, onBack }: { user?: UserProfile | null; nav: (s: Screen) => void; onBack: () => void }) {
  const t = useT()
  const [langTab, setLangTab] = useState<"ml" | "en" | "hi">("ml")
  const artisanName = user?.name || "Meena Devi"
  const craftName = user?.craftType || "Traditional Handloom"
  const desc = {
    ml: "ഈ കൈത്തറി കോട്ടൺ സാരി പരമ്പരാഗത തറിയിൽ നെയ്ത് ഉണ്ടാക്കിയതാണ്. 100% ശുദ്ധ കോട്ടൺ ഉപയോഗിച്ചു. ദൈനന്ദിന ഉപയോഗത്തിനും ആഘോഷങ്ങൾക്കും അനുയോജ്യം.",
    en: "This handwoven cotton saree is crafted on a traditional loom using 100% pure cotton. Suitable for daily wear and special occasions. Each piece is unique.",
    hi: "यह हाथ से बुनी कॉटन साड़ी पारंपरिक करघे पर बनाई गई है। 100% शुद्ध कॉटन का उपयोग किया गया है। रोज़ाना और खास मौकों के लिए उपयुक्त।",
  }

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <Header title={t.catalog_title} onBack={onBack} />
      <div className="flex-1 px-5 pb-28 flex flex-col gap-4">

        <div className="rounded-3xl overflow-hidden" style={{ border: "2px solid #E5DDD5" }}>
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=500&fit=crop&auto=format" alt="Product" className="w-full h-52 object-cover bg-[#E8F5EE]" />
          <div className="px-4 py-3" style={{ background: "#FFFFFF" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(185,74,28,0.15)", color: "#2D6A4F" }}>Artisan-made</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(30,58,110,0.1)", color: "#C4663A" }}>{craftName}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-[#1C1C1E]">Handwoven Cotton Saree</h2>
            <p className="text-[#6B5B4E] text-sm">by {artisanName} · Kerala, India</p>
          </div>
        </div>

        {/* Language tabs */}
        <div className="flex rounded-2xl overflow-hidden" style={{ border: "1px solid #E5DDD5", background: "#E8F5EE" }}>
          {(["ml", "en", "hi"] as const).map(l => (
            <button key={l} onClick={() => setLangTab(l)} className={`flex-1 py-2.5 text-sm font-bold transition-all ${langTab === l ? "text-[#FFFFFF]" : "text-[#6B5B4E]"}`} style={langTab === l ? { background: "#2D6A4F" } : {}}>
              {l === "ml" ? "മലയാളം" : l === "en" ? "English" : "हिंदी"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
          <p className="text-sm text-[#1C1C1E] leading-relaxed">{desc[langTab]}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[["🧶 Material", "100% Pure Cotton"], ["🪡 Craft", craftName], ["📦 Quantity", "3 pieces available"], ["👩‍🦱 Seller", artisanName]].map(([label, value]) => (
            <div key={label} className="rounded-2xl p-3" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
              <p className="text-xs text-[#6B5B4E] font-bold">{label}</p>
              <p className="text-sm font-semibold text-[#1C1C1E] mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Btn variant="ghost" onClick={onBack} className="flex-1">{t.edit_details}</Btn>
          <Btn onClick={() => nav("price")} className="flex-1">{t.continue_to_price} →</Btn>
        </div>
      </div>
    </div>
  )
}

function PriceScreen({ nav, onBack }: { nav: (s: Screen) => void; onBack: () => void }) {
  const t = useT()
  const [price, setPrice] = useState(2600)
  const breakdown = [
    { label: t.mat_cost, amount: 800, icon: "🧶" },
    { label: t.labour, amount: 1260, icon: "👐" },
    { label: t.expenses, amount: 200, icon: "📦" },
    { label: t.profit, amount: 340, icon: "💰" },
  ]

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <Header title="Fair Price" onBack={onBack} />
      <div className="flex-1 px-5 pb-28 flex flex-col gap-5">

        {/* Big price display */}
        <div className="rounded-3xl py-8 flex flex-col items-center gap-2" style={{ background: "linear-gradient(135deg, #2D6A4F, #1B4D38)", boxShadow: "0 8px 32px rgba(185,74,28,0.3)" }}>
          <p className="text-[#FDEEE6] font-bold text-sm uppercase tracking-widest">{t.suggested_price}</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setPrice(p => Math.max(500, p - 100))} className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "rgba(255,255,255,0.2)", color: "#FFFFFF" }}>−</button>
            <p className="font-display text-5xl font-bold text-white">₹{price.toLocaleString()}</p>
            <button onClick={() => setPrice(p => p + 100)} className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "rgba(255,255,255,0.2)", color: "#FFFFFF" }}>+</button>
          </div>
          <p className="text-[#FDEEE6] text-sm text-center px-6">{t.fair_price_msg}</p>
        </div>

        {/* Price breakdown */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5DDD5" }}>
          <p className="px-4 py-2 text-xs font-bold text-[#6B5B4E] uppercase tracking-widest" style={{ background: "#E8F5EE" }}>Price Breakdown</p>
          {breakdown.map((item, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#FDF7E3]"}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-semibold text-[#1C1C1E]">{item.label}</span>
              </div>
              <span className="font-bold text-[#1C1C1E]">₹{item.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "rgba(185,74,28,0.08)", borderTop: "2px solid #E5DDD5" }}>
            <span className="font-bold text-[#2D6A4F]">Market Reference</span>
            <span className="font-bold text-[#2D6A4F]">₹2,800–₹3,200</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#E8F5EE", border: "1px solid #2D6A4F" }}>
          <span className="text-xl">🤖</span>
          <p className="text-sm text-[#1C1C1E]">Similar handloom sarees sell for ₹2,800–₹3,200 on the marketplace. Your price of ₹{price.toLocaleString()} is competitive and profitable.</p>
        </div>

        <Btn onClick={() => nav("publish")} className="w-full">{t.continue_to_publish} →</Btn>
      </div>
    </div>
  )
}

function PublishScreen({ user, nav, onBack }: { user?: UserProfile | null; nav: (s: Screen) => void; onBack: () => void }) {
  const t = useT()
  const [publishing, setPublishing] = useState(false)
  const artisanName = user?.name || "Meena Devi"

  const handlePublish = () => {
    setPublishing(true)
    setTimeout(() => nav("success"), 2000)
  }

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <Header title="Publish Product" onBack={onBack} />
      <div className="flex-1 px-5 pb-24 flex flex-col gap-4">

        <div className="rounded-3xl overflow-hidden" style={{ border: "2px solid #E5DDD5", background: "#FFFFFF" }}>
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=400&fit=crop&auto=format" alt="Product" className="w-full h-44 object-cover bg-[#E8F5EE]" />
          <div className="p-5">
            <h2 className="font-display text-2xl font-bold text-[#1C1C1E]">Handwoven Cotton Saree</h2>
            <p className="text-[#6B5B4E] text-sm mb-4">{artisanName} · Kerala, India</p>
            <div className="grid grid-cols-3 gap-3">
              {[["💰 Price", "₹2,600"], ["📦 Qty", "3 pcs"], ["🌐 Lang", "3 langs"]].map(([l, v]) => (
                <div key={l} className="rounded-2xl p-3 text-center" style={{ background: "#FDF7E3", border: "1px solid #E5DDD5" }}>
                  <p className="text-xs text-[#6B5B4E] font-bold">{l}</p>
                  <p className="text-sm font-bold text-[#1C1C1E] mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
          <p className="font-bold text-[#1C1C1E] mb-2">Publish to</p>
          <div className="flex gap-2">
            {["🛍️ ShilpSetu Market", "📱 WhatsApp", "📘 Facebook"].map(ch => (
              <span key={ch} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(185,74,28,0.1)", color: "#2D6A4F" }}>{ch}</span>
            ))}
          </div>
        </div>

        {publishing ? (
          <div className="rounded-2xl p-6 flex flex-col items-center gap-3" style={{ background: "#E8F5EE", border: "1px solid #2D6A4F" }}>
            <div className="w-12 h-12 rounded-full border-4 border-[#2D6A4F] border-t-[#1C1C1E] spin-slow" />
            <p className="font-bold text-[#1C1C1E]">Publishing your product...</p>
          </div>
        ) : (
          <Btn onClick={handlePublish} className="w-full py-5 text-xl">🚀 {t.publish_btn}</Btn>
        )}
      </div>
    </div>
  )
}

function SuccessScreen({ nav }: { nav: (s: Screen) => void }) {
  const t = useT()
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-5 py-12 fade-in woven-bg">
      <div className="text-8xl mb-4">🎉</div>
      <h1 className="font-display text-3xl font-bold text-[#2D6A4F] text-center mb-3">Published!</h1>
      <p className="text-center text-[#1C1C1E] font-semibold text-lg mb-2">{t.success_msg}</p>
      <div className="rounded-2xl px-5 py-3 mb-8 flex items-center gap-2" style={{ background: "rgba(185,74,28,0.1)", border: "1px solid rgba(185,74,28,0.3)" }}>
        <span className="text-xl">🤖</span>
        <p className="text-sm text-[#6B5B4E]">"Your product is now live on ShilpSetu marketplace."</p>
      </div>

      <div className="rounded-3xl overflow-hidden w-full mb-6" style={{ border: "2px solid #E5DDD5" }}>
        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=300&fit=crop&auto=format" alt="Product" className="w-full h-40 object-cover" />
        <div className="px-4 py-3" style={{ background: "#FFFFFF" }}>
          <p className="font-bold text-[#1C1C1E]">Handwoven Cotton Saree</p>
          <p className="text-[#2D6A4F] font-bold">₹2,600 · 3 available</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="grid grid-cols-2 gap-3">
          <Btn variant="ghost" onClick={() => nav("products")} className="flex-1">{t.view_product}</Btn>
          <Btn variant="secondary" onClick={() => { }} className="flex-1">{t.share_product}</Btn>
        </div>
        <Btn onClick={() => nav("sales")} className="w-full">{t.go_to_sales}</Btn>
        <Btn variant="ghost" onClick={() => nav("home")} className="w-full">{t.back_to_home}</Btn>
      </div>
    </div>
  )
}

function ProductsScreen({ nav, openVoice }: { nav: (s: Screen) => void; openVoice: () => void }) {
  const t = useT()
  const lang = useCurrentLang()
  const [tab, setTab] = useState<"finished" | "materials">("finished")

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <div className="px-5 pt-12 pb-2">
        <h1 className="font-display text-2xl font-bold text-[#1C1C1E]">{t.marketplace_title}</h1>
        {lang !== "en" && <p className="text-xs text-[#6B5B4E] font-medium">Marketplace</p>}
      </div>
      <div className="flex px-5 gap-2 mb-4">
        {[["finished", `🛍️ ${t.finished_products}`], ["materials", `🧶 ${t.raw_materials}`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as "finished" | "materials")}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${tab === key ? "text-[#FFFFFF] bg-[#2D6A4F] shadow-sm" : "text-[#6B5B4E] bg-[#E8F5EE] border border-[#E5DDD5]"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-5 pb-28 screen-scroll">
        {tab === "finished" ? (
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map(p => {
              const localizedName = p.names?.[lang] || p.name;
              const localizedCraft = p.crafts?.[lang] || p.craft;
              return (
                <div key={p.id} className="rounded-2xl overflow-hidden active:scale-98 transition-all bg-white border border-[#E5DDD5] shadow-card flex flex-col justify-between">
                  <div className="relative">
                    <img src={p.img} alt={p.name} className="w-full h-32 object-cover bg-[#E8F5EE]" />
                    {/* Trust Score Badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#1C1C1E]/80 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{p.trustScore}% Trust</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#2D6A4F]">{t.artisan_made}</span>
                    <p className="text-sm font-bold text-[#1C1C1E] mt-1 leading-tight">{localizedName}</p>
                    {lang !== "en" && localizedName !== p.name && (
                      <p className="text-[10px] text-[#9B8B80] leading-tight mt-0.5">{p.name}</p>
                    )}
                    <p className="text-[11px] text-[#6B5B4E] mt-1 font-medium">{localizedCraft}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E5DDD5]">
                      <p className="text-[#2D6A4F] font-bold text-base">₹{p.price.toLocaleString()}</p>
                      <button className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#C4663A] text-white hover:bg-[#B35A30] cursor-pointer shadow-sm">{t.view_action}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl p-3 flex items-center gap-2 mb-1 bg-white border border-[#E5DDD5]">
              <span className="p-1 rounded-lg bg-[#E8F5EE] text-[#2D6A4F]"><Mic className="w-4 h-4" /></span>
              <p className="text-xs text-[#6B5B4E]">Say "Find yarn" or "Show cotton" to search</p>
              <button onClick={openVoice} className="ml-auto px-3 py-1 rounded-xl text-xs font-bold bg-[#2D6A4F] text-white cursor-pointer shadow-sm">🎤</button>
            </div>
            {MATERIALS.map(m => {
              const localizedName = m.names?.[lang] || m.name;
              return (
                <div key={m.id} className="rounded-2xl flex gap-3 overflow-hidden active:scale-98 transition-all bg-white border border-[#E5DDD5] shadow-sm">
                  <img src={m.img} alt={m.name} className="w-24 h-24 object-cover shrink-0 bg-[#E8F5EE]" />
                  <div className="py-3 pr-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-[#1C1C1E] text-sm leading-tight">{localizedName}</p>
                      {lang !== "en" && localizedName !== m.name && (
                        <p className="text-[10px] text-[#9B8B80]">{m.name}</p>
                      )}
                      <p className="text-[11px] text-[#6B5B4E] mt-0.5">{m.seller}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[#2D6A4F] font-bold">₹{m.price}</p>
                      <button className="text-xs font-bold px-3 py-1 rounded-lg bg-[#C9A227] text-[#1C1C1E] hover:bg-[#B89220] cursor-pointer shadow-sm">{t.order_btn}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function SalesScreen({ nav }: { nav: (s: Screen) => void }) {
  const t = useT()
  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#1C1C1E]">{t.my_sales}</h1>
        <p className="text-[#6B5B4E] text-sm">September 2026</p>
      </div>
      <div className="flex-1 px-5 pb-28 screen-scroll flex flex-col gap-4">

        {/* Summary tiles */}
        <div className="grid grid-cols-2 gap-3">
          {[["₹4,800", "Money Received", "💰", "#C4663A"], ["5 sold", "Products Sold", "📦", "#2D6A4F"], ["2 waiting", "Pending Orders", "⏳", "#C9A227"], ["4.8 ⭐", "Avg Rating", "🌟", "#1B4D38"]].map(([v, l, ic, c]) => (
            <div key={l} className="rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
              <span className="text-3xl">{ic}</span>
              <p className="font-display text-2xl font-bold mt-1" style={{ color: c }}>{v}</p>
              <p className="text-xs text-[#6B5B4E] font-semibold">{l}</p>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#E8F5EE", border: "1px solid #2D6A4F" }}>
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-[#1C1C1E] text-sm">{t.insight}</p>
            <p className="text-[#1B4D38] text-sm">{t.best_seller}</p>
            <p className="text-[#1B4D38] text-sm">{t.orders_pending}</p>
          </div>
        </div>

        {/* Best seller */}
        <div className="rounded-2xl flex gap-3 overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop&auto=format" alt="Best seller" className="w-24 h-24 object-cover bg-[#E8F5EE]" />
          <div className="py-3 pr-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(232,150,15,0.2)", color: "#C9A227" }}>⭐ Best Seller</span>
            <p className="font-bold text-[#1C1C1E] mt-1">Handwoven Cotton Saree</p>
            <p className="text-xs text-[#6B5B4E]">3 sold this month</p>
            <p className="text-[#2D6A4F] font-bold">₹7,800 earned</p>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold text-[#1C1C1E]">{t.transactions}</h2>
            <button onClick={() => nav("trust")} className="text-[#2D6A4F] text-sm font-bold">View trust →</button>
          </div>
          <div className="flex flex-col gap-2">
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${tx.status === "Verified" ? "" : ""}`} style={{ background: tx.status === "Verified" ? "#E8F5EE" : "#E8F5EE" }}>
                  {tx.status === "Verified" ? "✅" : "⏳"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1C1C1E] text-sm">{tx.product}</p>
                  <p className="text-[11px] text-[#6B5B4E]">{tx.buyer} · {tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1C1C1E]">₹{tx.amount.toLocaleString()}</p>
                  <p className="text-[11px]" style={{ color: tx.status === "Verified" ? "#1C1C1E" : "#C9A227" }}>+{tx.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="font-display text-lg font-semibold text-[#1C1C1E] mb-3">Customer Reviews</h2>
          {[{ r: t.review_1, name: "Priya S.", stars: 5 }, { r: t.review_2, name: "Arjun M.", stars: 5 }].map((rv, i) => (
            <div key={i} className="rounded-2xl p-4 mb-2" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
              <p className="text-yellow-500 text-sm mb-1">{"★".repeat(rv.stars)}</p>
              <p className="italic text-[#1C1C1E] text-sm">{rv.r}</p>
              <p className="text-xs text-[#6B5B4E] mt-1">— {rv.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GovtScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  const [saved, setSaved] = useState<number[]>([])

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#1C1C1E]">{t.govt_title}</h1>
        <p className="text-sm text-[#6B5B4E]">Financial support and training for artisans</p>
      </div>
      <div className="flex-1 px-5 pb-28 screen-scroll flex flex-col gap-4">

        <div className="rounded-2xl p-3 flex items-center gap-2" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
          <span>🎤</span>
          <p className="text-sm text-[#6B5B4E]">Say "Am I eligible?" or "Explain this scheme"</p>
        </div>

        {SCHEMES.map(s => (
          <div key={s.id} className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: `1px solid ${s.eligible ? "#2D6A4F" : "#E5DDD5"}` }}>
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: s.eligible ? "#E8F5EE" : "#FDF7E3" }}>
              <span className="text-3xl">{s.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-[#1C1C1E]">{s.title}</p>
                <p className="text-xs font-bold" style={{ color: s.eligible ? "#1C1C1E" : "#C9A227" }}>
                  {s.eligible ? "✅ You may be eligible" : "⚠️ Check eligibility"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#2D6A4F] text-sm">{s.amount}</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-[#6B5B4E] mb-3">{s.desc}</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: "#C4663A", color: "#FFFFFF" }}>Apply Now</button>
                <button onClick={() => setSaved(sv => sv.includes(s.id) ? sv.filter(x => x !== s.id) : [...sv, s.id])}
                  className="py-2 px-3 rounded-xl text-xs font-bold" style={{ background: saved.includes(s.id) ? "rgba(185,74,28,0.15)" : "#E8F5EE", color: saved.includes(s.id) ? "#2D6A4F" : "#6B5B4E", border: `1px solid ${saved.includes(s.id) ? "#2D6A4F" : "#E5DDD5"}` }}>
                  {saved.includes(s.id) ? "💛 Saved" : "🔖 Save"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrustScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  const [barWidth, setBarWidth] = useState("0%")
  useEffect(() => { setTimeout(() => setBarWidth("78%"), 400) }, [])

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <Header title={t.trust_score} onBack={onBack} />
      <div className="flex-1 px-5 pb-28 flex flex-col gap-5">

        {/* Trust score visual */}
        <div className="rounded-3xl py-8 flex flex-col items-center gap-3" style={{ background: "linear-gradient(135deg, #C4663A, #1B4D38)" }}>
          <p className="text-[#E8F5EE] text-sm font-bold uppercase tracking-widest">{t.trust_score}</p>
          <p className="font-display text-6xl font-bold text-white">78</p>
          <p className="text-[#E8F5EE] text-sm">out of 100 · Good Standing</p>
          <div className="w-48 h-3 rounded-full mx-auto" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="h-3 rounded-full trust-bar" style={{ width: barWidth, background: "linear-gradient(90deg, #C9A227, #2D6A4F)" }} />
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
          <p className="font-bold text-[#1C1C1E] mb-3">How trust is built</p>
          <div className="flex items-center gap-2">
            {[["✅ Complete", "#E8F5EE", "#1C1C1E"], ["→", "", "#6B5B4E"], ["🔍 Verified", "#E8F5EE", "#1C1C1E"], ["→", "", "#6B5B4E"], ["⭐ Trust Points", "rgba(185,74,28,0.1)", "#2D6A4F"]].map(([label, bg, color], i) => (
              bg ? (
                <div key={i} className="flex-1 rounded-xl py-2 text-center text-xs font-bold" style={{ background: bg, color }}>
                  {label}
                </div>
              ) : (
                <span key={i} className="text-lg font-bold" style={{ color }}>{label}</span>
              )
            ))}
          </div>
          <p className="text-xs text-[#6B5B4E] mt-3">Secure technology helps verify transactions and build trust. Higher trust scores attract more buyers.</p>
        </div>

        {/* Verified transactions */}
        <div>
          <p className="font-display text-lg font-semibold text-[#1C1C1E] mb-3">Verified Transactions</p>
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="rounded-2xl px-4 py-3 mb-2 flex items-center gap-3" style={{ background: "#FFFFFF", border: "1px solid #E5DDD5" }}>
              <span className="text-xl">{tx.status === "Verified" ? "✅" : "⏳"}</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#6B5B4E] font-mono">{tx.id}</p>
                <p className="font-semibold text-[#1C1C1E] text-sm">{tx.product} · {tx.buyer}</p>
                <p className="text-xs text-[#6B5B4E]">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#1C1C1E]">₹{tx.amount.toLocaleString()}</p>
                <p className="text-xs font-bold" style={{ color: tx.status === "Verified" ? "#1C1C1E" : "#C9A227" }}>+{tx.points} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileScreen({
  user,
  lang,
  onChangeLang,
  onSignOut,
  onBack,
}: {
  user: UserProfile | null;
  lang: LangCode;
  onChangeLang: () => void;
  onSignOut: () => void;
  onBack: () => void;
}) {
  const t = useT();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const LANG_LIST: LangCode[] = ["ml", "hi", "bn", "ta", "te", "kn", "mr", "en"];

  const activeName = user?.name || t.profile_name;
  const activeCraft = user?.craftType || t.profile_craft;
  const activePhone = user?.phone ? "+91 " + user.phone : "+91 98765 43210";

  return (
    <div className="min-h-full flex flex-col fade-in" style={{ background: "#FAF7F2" }}>
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#1C1C1E]">
          My Profile / പ്രൊഫൈൽ
        </h1>
      </div>
      <div className="flex-1 px-5 pb-28 screen-scroll flex flex-col gap-4">

        {/* Profile Card */}
        <div className="rounded-3xl p-5 flex items-center gap-4 shadow-lg" style={{ background: "linear-gradient(135deg, #2D6A4F, #1B4D38)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl" style={{ background: "rgba(255,255,255,0.2)" }}>
            {user?.avatar || "👩‍🦱"}
          </div>
          <div className="flex-1">
            <p className="font-display text-xl font-bold text-white">{activeName}</p>
            <p className="text-[#FDEEE6] text-sm font-medium">{activeCraft}</p>
            <p className="text-[#E8F5EE] text-xs mt-1 font-mono">{activePhone}</p>
            <p className="text-[#FDEEE6] text-[11px] mt-0.5">Kerala, India · Member since {user?.memberSince || "2024"}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[["5", "Products"], ["₹4,800", "Earned"], ["78", "Trust Score"]].map(([v, l]) => (
            <div key={l} className="rounded-2xl py-4 text-center bg-white border border-[#E5DDD5] shadow-sm">
              <p className="font-display text-2xl font-bold text-[#2D6A4F]">{v}</p>
              <p className="text-xs text-[#6B5B4E] font-semibold">{l}</p>
            </div>
          ))}
        </div>

        {/* Language Selection */}
        <div className="rounded-2xl overflow-hidden border border-[#E5DDD5]">
          <p className="px-4 py-2 text-xs font-bold text-[#6B5B4E] uppercase tracking-widest bg-[#E8F5EE]">
            Language / ഭാഷ / भाषा
          </p>
          <div className="grid grid-cols-4 gap-0">
            {LANG_LIST.map(code => (
              <button
                key={code}
                onClick={onChangeLang}
                className={`py-3 text-center text-sm font-bold transition-all cursor-pointer ${lang === code ? "text-white bg-[#2D6A4F]" : "text-[#1C1C1E] bg-white hover:bg-[#FAF7F2]"
                  }`}
                style={{ borderRight: "1px solid #E5DDD5", borderBottom: "1px solid #E5DDD5" }}
              >
                {LANGS[code].name.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Menu */}
        <div className="rounded-2xl overflow-hidden border border-[#E5DDD5] bg-white">
          {[
            { icon: <Bell className="w-5 h-5 text-[#2D6A4F]" />, title: "Notifications", subtitle: "അറിയിപ്പുകൾ", action: () => alert("Notifications preferences updated") },
            { icon: <Share2 className="w-5 h-5 text-[#2D6A4F]" />, title: "Share Profile", subtitle: "പ്രൊഫൈൽ പങ്കിടുക", action: () => alert("Profile link copied!") },
            { icon: <HelpCircle className="w-5 h-5 text-[#2D6A4F]" />, title: "Help & Support", subtitle: "സഹായം", action: () => alert("Artisan Helpline: 1800-120-7445") },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center justify-between px-4 py-3.5 border-b border-[#E5DDD5] hover:bg-[#FAF7F2] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-[#1C1C1E]">{item.title}</p>
                  <p className="text-xs text-[#6B5B4E]">{item.subtitle}</p>
                </div>
              </div>
              <span className="text-[#6B5B4E] font-bold">→</span>
            </button>
          ))}

          {/* Sign Out Button */}
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#FDEEE6] transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🚪</span>
              <div>
                <p className="font-bold text-sm text-[#C4663A] group-hover:text-[#B35A30]">Sign Out</p>
                <p className="text-xs text-[#6B5B4E]">അക്കൗണ്ടിൽ നിന്ന് പുറത്തുകടക്കുക</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#FDEEE6] text-[#C4663A] border border-[#C4663A]/30">
              Sign Out →
            </span>
          </button>
        </div>

        {/* Sign Out Confirmation Modal */}
        {showSignOutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E5DDD5] text-center">
              <div className="w-14 h-14 rounded-full bg-[#FDEEE6] text-[#C4663A] text-2xl flex items-center justify-center mx-auto mb-3">
                🚪
              </div>
              <h3 className="font-display text-xl font-bold text-[#1C1C1E] mb-1">
                Sign Out? / പുറത്തുകടക്കണോ?
              </h3>
              <p className="text-xs text-[#6B5B4E] mb-6">
                നിങ്ങളുടെ സെഷൻ അവസാനിപ്പിച്ച് ലോഗിൻ സ്ക്രീനിലേക്ക് മടങ്ങും. <br />
                You will be returned to the sign-in screen.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-[#E5DDD5] font-bold text-sm text-[#1C1C1E] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel (റദ്ദാക്കുക)
                </button>
                <button
                  onClick={() => {
                    setShowSignOutConfirm(false);
                    onSignOut();
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#C4663A] text-white font-bold text-sm shadow-md hover:bg-[#B35A30] cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredSession() || DEFAULT_USER);
  const [screen, setScreen] = useState<Screen>(() => (getStoredSession() ? "home" : "auth-signin"));
  const [history, setHistory] = useState<Screen[]>([]);
  const [lang, setLang] = useState<LangCode>(() => (getStoredSession()?.language as LangCode) || "ml");
  const [voiceOpen, setVoiceOpen] = useState(false);

  const navigate = (to: Screen) => {
    setHistory(h => [...h, screen]);
    setScreen(to);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setScreen(prev);
    }
  };

  const handleLangSelect = (code: LangCode) => {
    setLang(code);
    if (currentUser) {
      const updated = { ...currentUser, language: code };
      setCurrentUser(updated);
      saveUserSession(updated);
    }
    setScreen("home");
    setHistory([]);
  };

  const handleSignInSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.language) setLang(user.language);
    setScreen("home");
    setHistory([]);
  };

  const handleSignOut = () => {
    clearUserSession();
    setCurrentUser(null);
    setScreen("auth-signin");
    setHistory([]);
  };

  const t = LANGS[lang];

  const voiceCommands: VoiceCmd[] = [
    { label: t.cmd_camera, action: () => navigate("camera"), response: t.voice_rsp_camera },
    { label: t.cmd_sales, action: () => navigate("sales"), response: t.voice_rsp_sales },
    { label: t.cmd_materials, action: () => navigate("products"), response: t.voice_rsp_camera },
    { label: t.cmd_schemes, action: () => navigate("govt"), response: t.voice_rsp_sales },
    { label: t.cmd_catalog, action: () => navigate("catalog"), response: "Creating catalog..." },
    { label: t.cmd_publish, action: () => navigate("publish"), response: t.voice_rsp_publish },
    { label: t.cmd_back, action: goBack, response: t.voice_rsp_back },
  ];

  const showBottomNav = ["home", "products", "sales", "govt", "profile"].includes(screen);
  const showMic = !["language", "auth-signin", "auth-register"].includes(screen);

  return (
    <LangCtx.Provider value={lang}>
      <div className="w-full h-full flex justify-center items-center" style={{ background: "var(--body-bg, #E8E0D8)" }}>
        {/* Mobile frame */}
        <div className="relative w-full max-w-md h-full flex flex-col overflow-hidden shadow-2xl" style={{ background: "#FAF7F2" }}>

          {/* Screen router */}
          <div className={`flex-1 overflow-hidden ${showBottomNav ? "pb-16" : ""}`}>
            <div key={screen} className="h-full screen-scroll">
              {screen === "auth-signin" && (
                <AuthSignInScreen
                  onSignInSuccess={handleSignInSuccess}
                  onGoToRegister={() => navigate("auth-register")}
                />
              )}
              {screen === "auth-register" && (
                <AuthRegisterScreen
                  onComplete={handleSignInSuccess}
                  onGoToSignIn={() => navigate("auth-signin")}
                  onSelectLang={setLang}
                />
              )}
              {screen === "language" && <LanguageScreen onSelect={handleLangSelect} />}
              {screen === "home" && <HomeScreen user={currentUser} nav={navigate} openVoice={() => setVoiceOpen(true)} />}
              {screen === "camera" && <CameraScreen nav={navigate} onBack={goBack} />}
              {screen === "processing" && <ProcessingScreen nav={navigate} onBack={goBack} />}
              {screen === "voice-details" && <VoiceDetailsScreen nav={navigate} onBack={goBack} openVoice={() => setVoiceOpen(true)} />}
              {screen === "catalog" && <CatalogScreen user={currentUser} nav={navigate} onBack={goBack} />}
              {screen === "price" && <PriceScreen nav={navigate} onBack={goBack} />}
              {screen === "publish" && <PublishScreen user={currentUser} nav={navigate} onBack={goBack} />}
              {screen === "success" && <SuccessScreen nav={navigate} />}
              {screen === "products" && <ProductsScreen nav={navigate} openVoice={() => setVoiceOpen(true)} />}
              {screen === "sales" && <SalesScreen nav={navigate} />}
              {screen === "govt" && <GovtScreen onBack={goBack} />}
              {screen === "trust" && <TrustScreen onBack={goBack} />}
              {screen === "profile" && (
                <ProfileScreen
                  user={currentUser}
                  lang={lang}
                  onChangeLang={() => { setScreen("language"); setHistory([]); }}
                  onSignOut={handleSignOut}
                  onBack={goBack}
                />
              )}
            </div>
          </div>

          {/* Bottom nav */}
          {showBottomNav && <BottomNav screen={screen} nav={navigate} />}

          {/* Floating mic */}
          {showMic && !voiceOpen && (
            <button
              onClick={() => setVoiceOpen(true)}
              className="absolute bottom-20 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center mic-pulse active:scale-90 transition-all cursor-pointer shadow-lg text-white"
              style={{ background: "#2D6A4F", boxShadow: "0 4px 20px rgba(45,106,79,0.45)" }}
            >
              <Mic className="w-7 h-7" />
            </button>
          )}

          {/* Voice panel */}
          {voiceOpen && (
            <VoicePanel onClose={() => setVoiceOpen(false)} commands={voiceCommands} screen={screen} />
          )}
        </div>
      </div>
    </LangCtx.Provider>
  );
}
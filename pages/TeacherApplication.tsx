import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, onAuthStateChanged } from '../lib/firebase';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import type { User } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// ════════════════════════════════════════════════════════════ Languages Config
const LANGUAGES_CONFIG = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'doi', name: 'डोगरी (Dogri - Jammu)' },
  { code: 'ks', name: 'کٲشُر (Kashmiri)' },
  { code: 'ur', name: 'اردو (Urdu)' }
] as const;

type LangCode = typeof LANGUAGES_CONFIG[number]['code'];

// ════════════════════════════════════════════════════════════ Translations Map
const formTranslations: Record<LangCode, {
  title: string;
  subtitle: string;
  fullName: string;
  fullNamePlh: string;
  email: string;
  emailPlh: string;
  phone: string;
  phonePlh: string;
  qualification: string;
  qualificationPlh: string;
  experience: string;
  experiencePlh: string;
  subjects: string;
  subjectsPlh: string;
  mode: string;
  modePlh: string;
  modeLive: string;
  modeRec: string;
  modeHyb: string;
  languages: string;
  otherLanguagesPlh: string;
  selectedCount: string;
  terms: string;
  submit: string;
  submitting: string;
  acceptTermsErr: string;
}> = {
  en: {
    title: "Apply as Teacher",
    subtitle: "Share your expertise and start teaching",
    fullName: "Full Name",
    fullNamePlh: "Your full name",
    email: "Email Address",
    emailPlh: "email@example.com",
    phone: "Phone Number",
    phonePlh: "+91 98765 43210",
    qualification: "Highest Qualification",
    qualificationPlh: "e.g. B.Tech, M.Sc, Ph.D",
    experience: "Years of Experience",
    experiencePlh: "e.g. 3",
    subjects: "Subjects to Teach",
    subjectsPlh: "e.g. Algebra, Physics, Coding",
    mode: "Teaching Mode",
    modePlh: "Select mode",
    modeLive: "Live",
    modeRec: "Recorded",
    modeHyb: "Hybrid",
    languages: "Languages you teach",
    otherLanguagesPlh: "Other languages (e.g. French, German - comma separated)",
    selectedCount: "Total Languages Selected",
    terms: "I accept the Terms & Conditions for teaching on this platform.",
    submit: "Submit Application",
    submitting: "Submitting...",
    acceptTermsErr: "Please accept the terms"
  },
  hi: {
    title: "शिक्षक के रूप में आवेदन करें",
    subtitle: "अपनी विशेषज्ञता साझा करें और पढ़ाना शुरू करें",
    fullName: "पूरा नाम",
    fullNamePlh: "आपका पूरा नाम",
    email: "ईमेल पता",
    emailPlh: "email@example.com",
    phone: "फ़ोन नंबर",
    phonePlh: "+91 98765 43210",
    qualification: "उच्चतम योग्यता",
    qualificationPlh: "जैसे: बी.टेक, एम.एससी, पीएच.डी",
    experience: "अनुभव (वर्षों में)",
    experiencePlh: "जैसे: 3",
    subjects: "पढ़ाने के विषय",
    subjectsPlh: "जैसे: बीजगणित, भौतिकी, कोडिंग",
    mode: "पढ़ाने का माध्यम",
    modePlh: "माध्यम चुनें",
    modeLive: "लाइव (सजीव)",
    modeRec: "रिकॉर्डेड (दर्ज)",
    modeHyb: "हाइब्रिड (मिश्रित)",
    languages: "वे भाषाएँ जिनमें आप पढ़ाते हैं",
    otherLanguagesPlh: "अन्य भाषाएँ (जैसे: फ्रेंच, जर्मन - अल्पविराम से अलग करें)",
    selectedCount: "कुल चयनित भाषाएँ",
    terms: "मैं इस प्लेटफॉर्म पर पढ़ाने के लिए नियम और शर्तों को स्वीकार करता हूं।",
    submit: "आवेदन जमा करें",
    submitting: "जमा किया जा रहा है...",
    acceptTermsErr: "कृपया नियमों को स्वीकार करें"
  },
  te: {
    title: "ఉపాధ్యాయుడిగా దరఖాస్తు చేసుకోండి",
    subtitle: "మీ నైపుణ్యాన్ని పంచుకోండి మరియు బోధించడం ప్రారంభించండి",
    fullName: "పూర్తి పేరు",
    fullNamePlh: "మీ పూర్తి పేరు",
    email: "ఈమెయిల్ చిరునామా",
    emailPlh: "email@example.com",
    phone: "ఫోన్ నెంబర్",
    phonePlh: "+91 98765 43210",
    qualification: "అత్యున్నత అర్హత",
    qualificationPlh: "ఉదాహరణ: B.Tech, M.Sc, Ph.D",
    experience: "అనుభవ సంవత్సరాలు",
    experiencePlh: "ఉదాహరణ: 3",
    subjects: "బోధించాల్సిన సబ్జెక్టులు",
    subjectsPlh: "ఉదాహరణ: గణితం, భౌతికశాస్త్రం, కోడింగ్",
    mode: "బోధనా విధానం",
    modePlh: "విధానాన్ని ఎంచుకోండి",
    modeLive: "లైవ్",
    modeRec: "రికార్డ్ చేయబడినవి",
    modeHyb: "హైబ్రిడ్",
    languages: "మీరు బోధించే భాషలు",
    otherLanguagesPlh: "ఇతర భాషలు (ఉదాహరణ: ఫ్రెంచ్, జర్మన్ - కామాలతో వేరు చేయండి)",
    selectedCount: "ఎంపిక చేసిన మొత్తం భాషలు",
    terms: "ఈ ప్లాట్‌ఫారమ్‌లో బోధించడానికి నేను నిబంధనలు & షరతులను అంగీకరిస్తున్నాను.",
    submit: "దరఖాస్తును సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    acceptTermsErr: "దయచేసి నిబంధనలను అంగీకరించండి"
  },
  ta: {
    title: "ஆசிரியராக விண்ணப்பிக்கவும்",
    subtitle: "உங்கள் நிபுணத்துவத்தைப் பகிர்ந்து கற்பிக்கத் தொடங்குங்கள்",
    fullName: "முழு பெயர்",
    fullNamePlh: "உங்களது முழு பெயர்",
    email: "மின்னஞ்சல் முகவரி",
    emailPlh: "email@example.com",
    phone: "தொலைபேசி எண்",
    phonePlh: "+91 98765 43210",
    qualification: "உயர்ந்த தகுதி",
    qualificationPlh: "उदा: B.Tech, M.Sc, Ph.D",
    experience: "அனுபவ ஆண்டுகள்",
    experiencePlh: "उदा: 3",
    subjects: "கற்பிக்க வேண்டிய பாடங்கள்",
    subjectsPlh: "उदा: கணிதம், இயற்பியல், கோடிங்",
    mode: "கற்பித்தல் முறை",
    modePlh: "முறையைத் தேர்ந்தெடுக்கவும்",
    modeLive: "நேரடி வகுப்பு (Live)",
    modeRec: "பதிவுசெய்யப்பட்டது (Recorded)",
    modeHyb: "கலப்பு முறை (Hybrid)",
    languages: "நீங்கள் கற்பிக்கும் மொழிகள்",
    otherLanguagesPlh: "இதர மொழிகள் (उदा: பிரெஞ்சு, ஜெர்மன் - காற்புள்ளியால் பிரிக்கப்பட்டது)",
    selectedCount: "தேர்வு செய்யப்பட்ட மொழிகள்",
    terms: "இந்தத் தளத்தில் கற்பிப்பதற்கான விதிமுறைகள் மற்றும் நிபந்தனைகளை நான் ஏற்கிறேன்.",
    submit: "விண்ணப்பத்தைச் சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கப்படுகிறது...",
    acceptTermsErr: "விதிமுறைகளை ஏற்கவும்"
  },
  bn: {
    title: "শিক্ষক হিসেবে আবেদন করুন",
    subtitle: "আপনার দক্ষতা শেয়ার করুন এবং শেখানো শুরু করুন",
    fullName: "সম্পূর্ণ নাম",
    fullNamePlh: "আপনার সম্পূর্ণ নাম",
    email: "ইমেল ঠিকানা",
    emailPlh: "email@example.com",
    phone: "ফোন নম্বর",
    phonePlh: "+91 98765 43210",
    qualification: "সর্বোচ্চ যোগ্যতা",
    qualificationPlh: "যেমন: B.Tech, M.Sc, Ph.D",
    experience: "অভিজ্ঞতার বছর",
    experiencePlh: "যেমন: ৩",
    subjects: "শেখানোর বিষয়সমূহ",
    subjectsPlh: "যেমন: গণিত, পদার্থবিজ্ঞান, কোডিং",
    mode: "শিক্ষাদান পদ্ধতি",
    modePlh: "পদ্ধতি নির্বাচন করুন",
    modeLive: "লাইভ ক্লাস",
    modeRec: "রেকর্ডকৃত ক্লাস",
    modeHyb: "হাইব্রিড ক্লাস",
    languages: "যেসব ভাষায় আপনি শেখান",
    otherLanguagesPlh: "অন্যান্য ভাষা (যেমন: ফরাসি, জার্মান - কমা দ্বারা পৃথক করা)",
    selectedCount: "মোট নির্বাচিত ভাষা",
    terms: "আমি এই প্ল্যাটফর্মে শেখানোর জন্য শর্তাবলী স্বীকার করছি।",
    submit: "আবেদন জমা দিন",
    submitting: "জমা দেওয়া হচ্ছে...",
    acceptTermsErr: "দয়া করে শর্তাবলী গ্রহণ করুন"
  },
  kn: {
    title: "ಶಿಕ್ಷಕರಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    subtitle: "ನಿಮ್ಮ ಪರಿಣತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಬೋಧನೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    fullNamePlh: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    emailPlh: "email@example.com",
    phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
    phonePlh: "+91 98765 43210",
    qualification: "ಅತ್ಯುನ್ನತ ಅರ್ಹತೆ",
    qualificationPlh: "ಉದಾ: B.Tech, M.Sc, Ph.D",
    experience: "ಅನುಭವದ ವರ್ಷಗಳು",
    experiencePlh: "ಉದಾ: 3",
    subjects: "ಬೋಧಿಸಬೇಕಾದ ವಿಷಯಗಳು",
    subjectsPlh: "ಉದಾ: ಗಣಿತ, ಭೌತಶಾಸ್ತ್ರ, ಕೋಡಿಂಗ್",
    mode: "ಬೋಧನಾ ವಿಧಾನ",
    modePlh: "ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    modeLive: "ಲೈವ್",
    modeRec: "ರೆಕಾರ್ಡ್ ಮಾಡಿದ",
    modeHyb: "ಹೈಬ್ರಿಡ್",
    languages: "ನೀವು ಬೋಧಿಸುವ ಭಾಷೆಗಳು",
    otherLanguagesPlh: "ಇತರ ಭಾಷೆಗಳು (ಉದಾ: ಫ್ರೆಂಚ್, ಜರ್ಮನ್ - ಕಾಮಾದಿಂದ ಬೇರ್ಪಡಿಸಿ)",
    selectedCount: "ಆಯ್ಕೆ ಮಾಡಿದ ಒಟ್ಟು ಭಾಷೆಗಳು",
    terms: "ಈ ಪ್ಲಾಟ್‌ಫಾರಮ್‌ನಲ್ಲಿ ಬೋಧಿಸಲು ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಒಪ್ಪುತ್ತೇನೆ.",
    submit: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    acceptTermsErr: "ದಯವಿಟ್ಟು ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ"
  },
  mr: {
    title: "शिक्षक म्हणून अर्ज करा",
    subtitle: "तुमची कौशल्ये सामायिक करा आणि शिकवण्यास सुरुवात करा",
    fullName: "पूर्ण नाव",
    fullNamePlh: "तुमचे पूर्ण नाव",
    email: "ईमेल पत्ता",
    emailPlh: "email@example.com",
    phone: "फोन नंबर",
    phonePlh: "+91 98765 43210",
    qualification: "उच्चतम पात्रता",
    qualificationPlh: "उदा. B.Tech, M.Sc, Ph.D",
    experience: "अनुभवाची वर्षे",
    experiencePlh: "उदा. ३",
    subjects: "शिकवायचे विषय",
    subjectsPlh: "उदा. गणित, भौतिकशास्त्र, कोडिंग",
    mode: "शिकवण्याची पद्धत",
    modePlh: "पद्धत निवडा",
    modeLive: "लाईव्ह",
    modeRec: "रेकॉर्ड केलेले",
    modeHyb: "हायब्रीड",
    languages: "तुम्ही शिकवत असलेल्या भाषा",
    otherLanguagesPlh: "इतर भाषा (उदा. फ्रेंच, जर्मन - स्वल्पविराम देऊन लिहा)",
    selectedCount: "एकूण निवडलेल्या भाषा",
    terms: "मी या प्लॅटफॉर्मवर शिकवण्यासाठी नियम व अटी मान्य करतो.",
    submit: "अर्ज सादर करा",
    submitting: "सादर होत आहे...",
    acceptTermsErr: "कृपया नियम आणि अटी स्वीकारा"
  },
  doi: {
    title: "शिक्षक दे रूप च अर्जी दिओ",
    subtitle: "अपनी महारत सांझी करो ते पढ़ाना शुरू करो",
    fullName: "पूरा नां",
    fullNamePlh: "तुंदा पूरा नां",
    email: "ईमेल पता",
    emailPlh: "email@example.com",
    phone: "फोन नंबर",
    phonePlh: "+91 98765 43210",
    qualification: "उच्चतम योग्यता",
    qualificationPlh: "जैसे: B.Tech, M.Sc, Ph.D",
    experience: "तजुरबा (बरें च)",
    experiencePlh: "जैसे: 3",
    subjects: "पढ़ाने दे विषय",
    subjectsPlh: "जैसे: गणित, भौतिक विज्ञान, कोडिंग",
    mode: "पढ़ाने दा तरीका",
    modePlh: "तरीका चुनो",
    modeLive: "सजीव (Live)",
    modeRec: "दर्ज कीती दी (Recorded)",
    modeHyb: "मिश्रित (Hybrid)",
    languages: "ओह भाषां जिनें च तुस पढ़ांदे ओ",
    otherLanguagesPlh: "दूइयां भाषां (जैसे: फ्रेंच, जर्मन - कोमा लाई के लिखो)",
    selectedCount: "कुल चुनी दियूं भाषां",
    terms: "मैं इस प्लेटफॉर्म पर पढ़ाने दियां शर्तां गी मंजूर करदा हां।",
    submit: "अर्जी जमा करो",
    submitting: "जमा कीती जा करदी ऐ...",
    acceptTermsErr: "मेहरबानी करी शर्तां मंजूर करो"
  },
  ks: {
    title: "اُستاد بننہ خاطرہ دَرخواست دِیِو",
    subtitle: "پَنُن عِلم کٔرِو شیئر تہِ پٔڑناوُن کٔرِو شُروع",
    fullName: "پوٗر مُٹھ ناڤ",
    fullNamePlh: "تُہند پوٗر ناڤ",
    email: "ای میل پتہ",
    emailPlh: "email@example.com",
    phone: "فون نمبر",
    phonePlh: "+91 98765 43210",
    qualification: "اعلیٰ تعلیمی قابلیت",
    qualificationPlh: "مثال: B.Tech, M.Sc, Ph.D",
    experience: "تجرُبہ (ورین منز)",
    experiencePlh: "مثال: 3",
    subjects: "پٔڑناونہِ والیہِ مَضموٗن",
    subjectsPlh: "مثال: ریاضی، طبیعیات، کوڈنگ",
    mode: "پٔڑناونُک طریقہ",
    modePlh: "طریقہ دِیِو مُنتخب کٔرتھ",
    modeLive: "لائیو (براہ راست)",
    modeRec: "ریکارڈ کٔرمُت",
    modeHyb: "ملا جلا (ہائبرڈ)",
    languages: "تِم زَبانہِ یِمن منز تُہہِ پٔڑناوان چھِو",
    otherLanguagesPlh: "باقیہِ زَبانہِ (مثال: فرانسیسی، جرمن - کامہِ دِتھ لیکھِو)",
    selectedCount: "کُل مُنتخب کٔرمژہ زَبانہِ",
    terms: "بہٗ چُھس پٔڑناونہِ خاطرہ اَتھ پليٹ فارمچہِ شَرائط مَنظوٗر کَران۔",
    submit: "درخواست جمع کٔرِو",
    submitting: "جمع گژھان چھُ...",
    acceptTermsErr: "مہربانی کرتھ قبول کریو شرائط"
  },
  ur: {
    title: "بطور استاد درخواست دیں",
    subtitle: "اپنی مہارت کا اشتراک کریں اور پڑھانا شروع کریں",
    fullName: "پورا نام",
    fullNamePlh: "آپ کا پورا نام",
    email: "ای میل پتہ",
    emailPlh: "email@example.com",
    phone: "فون نمبر",
    phonePlh: "+91 98765 43210",
    qualification: "اعلیٰ ترین قابلیت",
    qualificationPlh: "مثلاً: B.Tech, M.Sc, Ph.D",
    experience: "تجربہ (سالوں میں)",
    experiencePlh: "مثلاً: 3",
    subjects: "پڑھانے کے مضامین",
    subjectsPlh: "مثلاً: حساب، فزکس، کوڈنگ",
    mode: "پڑھانے کا طریقہ",
    modePlh: "طریقہ منتخب کریں",
    modeLive: "لائیو",
    modeRec: "ریکارڈ شدہ",
    modeHyb: "ہائیبرڈ",
    languages: "وہ زبانیں جن میں آپ پڑھاتے ہیں",
    otherLanguagesPlh: "دیگر زبانیں (مثلاً: فرانسیسی، جرمن - کوما سے الگ کریں)",
    selectedCount: "کل منتخب کردہ زبانیں",
    terms: "میں اس پلیٹ فارم پر پڑھانے کے لیے شرائط و ضوابط تسلیم کرتا ہوں۔",
    submit: "درخواست جمع کریں",
    submitting: "جمع ہو رہا ہے...",
    acceptTermsErr: "براہ کرم شرائط قبول کریں"
  }
};

const TeacherApplication: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Language UI State
  const [formLang, setFormLang] = useState<LangCode>('en');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [subjects, setSubjects] = useState('');
  const [mode, setMode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [customLanguages, setCustomLanguages] = useState('');

  const t = formTranslations[formLang];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) { navigate('/login'); return; }
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!agreeTerms) {
      toast.error(t.acceptTermsErr);
      return;
    }

    // Validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (phone && phoneDigits.length < 10) {
      toast.error('Phone number must have at least 10 digits');
      return;
    }
    if (experience && (isNaN(Number(experience)) || Number(experience) < 0)) {
      toast.error('Experience must be a valid non-negative number');
      return;
    }
    if (!subjects.trim()) {
      toast.error('Please enter the subjects you teach');
      return;
    }

    const finalLanguagesList = [
      ...selectedLanguages,
      ...customLanguages.split(',').map(s => s.trim()).filter(Boolean)
    ];
    const languagesStr = finalLanguagesList.join(', ');
    const languagesCount = finalLanguagesList.length;

    setSubmitLoading(true);
    try {
      const { error } = await db.from('teacher_applications').insert({
        user_id: user.uid,
        name,
        email,
        phone,
        qualification,
        experience,
        subjects,
        languages: languagesStr,
        languages_count: languagesCount,
        teaching_mode: mode,
        agree_terms: agreeTerms,
        status: 'pending',
        applied_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success('Application submitted successfully!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to submit application');
    } finally {
      setSubmitLoading(false);
    }
  };

  const inputCls = "w-full p-4 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-800";
  const labelCls = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2";

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="min-h-screen pt-28 pb-32 px-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl mx-auto relative z-10">
        
        {/* Back navigation button */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200/50">
          
          {/* Main Title Block */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
              <p className="text-sm text-slate-500 font-medium">{t.subtitle}</p>
            </div>
          </div>

          {/* Form manual language switcher */}
          <div className="flex flex-wrap gap-2 mb-8 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 justify-center">
            {LANGUAGES_CONFIG.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => setFormLang(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  formLang === lang.code
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>{t.fullName}</label>
                <input value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder={t.fullNamePlh} />
              </div>
              <div>
                <label className={labelCls}>{t.email}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder={t.emailPlh} />
              </div>
              <div>
                <label className={labelCls}>{t.phone}</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder={t.phonePlh} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>{t.qualification}</label>
                <input value={qualification} onChange={e => setQualification(e.target.value)} className={inputCls} placeholder={t.qualificationPlh} />
              </div>
              <div>
                <label className={labelCls}>{t.experience}</label>
                <input type="number" min="0" value={experience} onChange={e => setExperience(e.target.value)} className={inputCls} placeholder={t.experiencePlh} />
              </div>
              <div>
                <label className={labelCls}>{t.subjects}</label>
                <input value={subjects} onChange={e => setSubjects(e.target.value)} className={inputCls} placeholder={t.subjectsPlh} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>{t.mode}</label>
                <select value={mode} onChange={e => setMode(e.target.value)} className={inputCls}>
                  <option value="">{t.modePlh}</option>
                  <option value="live">{t.modeLive}</option>
                  <option value="recorded">{t.modeRec}</option>
                  <option value="hybrid">{t.modeHyb}</option>
                </select>
              </div>

              {/* Language Selection Grid */}
              <div className="md:col-span-2 border-t border-slate-100 pt-6">
                <label className={labelCls}>{t.languages}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {['English', 'Hindi', 'Telugu', 'Spanish', 'Bengali', 'Tamil', 'Kannada', 'Marathi'].map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                          } else {
                            setSelectedLanguages([...selectedLanguages, lang]);
                          }
                        }}
                        className={`p-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lang}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
                <input 
                  value={customLanguages} 
                  onChange={e => setCustomLanguages(e.target.value)} 
                  className={inputCls} 
                  placeholder={t.otherLanguagesPlh} 
                />
                <div className="mt-2.5 text-xs text-slate-500 font-bold">
                  {t.selectedCount}: <span className="text-emerald-600 font-black">{
                    (() => {
                      const listCount = selectedLanguages.length;
                      const customCount = customLanguages.split(',').map(s => s.trim()).filter(Boolean).length;
                      return listCount + customCount;
                    })()
                  }</span>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
              <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <span className="text-sm font-medium text-slate-700">{t.terms}</span>
            </label>

            <button type="submit" disabled={submitLoading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
            >
              {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {submitLoading ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherApplication;

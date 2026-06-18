import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { auth, db, doc, getDoc, onAuthStateChanged } from '../lib/firebase';
import { Course } from '../types';
import { ArrowLeft, Loader2, ChevronDown, ChevronUp, Check, Upload } from 'lucide-react';
import type { User } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SECTIONS = [
  'Personal', 'Professional', 'Teaching', 'Verification', 'Demo', 'Banking', 'Agreement'
];

const TeacherApplication: React.FC = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openSection, setOpenSection] = useState<string>('Personal');

  // Personal
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pDob, setPDob] = useState('');
  const [pGender, setPGender] = useState('');
  const [pLocation, setPLocation] = useState('');
  const [pPhoto, setPPhoto] = useState('');

  // Professional
  const [profQual, setProfQual] = useState('');
  const [profSpecialization, setProfSpecialization] = useState('');
  const [profExp, setProfExp] = useState('');
  const [profOccupation, setProfOccupation] = useState('');
  const [profLanguages, setProfLanguages] = useState('');

  // Teaching
  const [tSubjects, setTSubjects] = useState('');
  const [tCategory, setTCategory] = useState('');
  const [tMode, setTMode] = useState('');
  const [tTimings, setTTimings] = useState('');
  const [tDuration, setTDuration] = useState('');
  const [tAudience, setTAudience] = useState('');

  // Verification
  const [vResume, setVResume] = useState('');
  const [vCertificates, setVCertificates] = useState('');
  const [vIdProof, setVIdProof] = useState('');
  const [vPortfolio, setVPortfolio] = useState('');
  const [vLinkedin, setVLinkedin] = useState('');
  const [vWebsite, setVWebsite] = useState('');

  // Demo
  const [dIntro, setDIntro] = useState('');
  const [dDemo, setDDemo] = useState('');
  const [dSample, setDSample] = useState('');

  // Banking
  const [bAccName, setBAccName] = useState('');
  const [bAccNum, setBAccNum] = useState('');
  const [bIfsc, setBIfsc] = useState('');
  const [bUpi, setBUpi] = useState('');
  const [bPan, setBPan] = useState('');

  // Agreement
  const [aTerms, setATerms] = useState(false);
  const [aOwnership, setAOwnership] = useState(false);
  const [aRevenue, setARevenue] = useState(false);

  useEffect(() => {
    const fetchCourse = async (currentUser: User | null) => {
      if (!courseId) { setLoading(false); return; }
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() } as Course);
        }
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) { navigate('/login'); return; }
      setPName(currentUser.displayName || '');
      setPEmail(currentUser.email || '');
      fetchCourse(currentUser);
    });
    return () => unsubscribe();
  }, [courseId, navigate]);

  const handleFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (field: string, file: File | null) => {
    if (!file) return;
    const b64 = await handleFileAsBase64(file);
    if (field === 'photo') setPPhoto(b64);
    else if (field === 'resume') setVResume(b64);
    else if (field === 'certificates') setVCertificates(b64);
    else if (field === 'idproof') setVIdProof(b64);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !courseId) return;
    if (!aTerms || !aOwnership || !aRevenue) {
      toast.error('Please accept all agreement terms');
      return;
    }
    setSubmitLoading(true);
    try {
      const { error } = await db.from('teacher_applications').insert({
        user_id: user.uid,
        name: pName,
        email: pEmail,
        qualification: courseId,
        phone: pPhone,
        date_of_birth: pDob,
        gender: pGender,
        location: pLocation,
        profile_photo: pPhoto,
        highest_qualification: profQual,
        specialization: profSpecialization,
        experience: profExp,
        current_occupation: profOccupation,
        languages: profLanguages,
        subjects: tSubjects,
        course_category: tCategory,
        teaching_mode: tMode,
        preferred_timings: tTimings,
        class_duration: tDuration,
        target_audience: tAudience,
        resume_url: vResume,
        certificates_url: vCertificates,
        id_proof_url: vIdProof,
        portfolio_url: vPortfolio,
        linkedin_url: vLinkedin,
        website_url: vWebsite,
        intro_video_url: dIntro,
        demo_video_url: dDemo,
        sample_content: dSample,
        bank_account_name: bAccName,
        bank_account_number: bAccNum,
        bank_ifsc: bIfsc,
        bank_upi: bUpi,
        bank_pan: bPan,
        agree_terms: aTerms,
        agree_content_ownership: aOwnership,
        agree_revenue_sharing: aRevenue,
        status: 'pending',
        applied_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success('Application submitted successfully!');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit application');
    } finally {
      setSubmitLoading(false);
    }
  };

  const toggleSection = (s: string) => setOpenSection(openSection === s ? '' : s);

  const inputCls = "w-full p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white text-sm";
  const labelCls = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2";
  const SectionToggle = ({ title, section }: { title: string; section: string }) => (
    <button type="button" onClick={() => toggleSection(section)} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
      <span className="font-bold text-slate-900 dark:text-white">{title}</span>
      {openSection === section ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
    </button>
  );

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  }

  if (!courseId || !course) {
    return (
      <div className="min-h-screen pt-32 text-center text-slate-500">
        <p>Invalid course context.</p>
        <Link to="/courses" className="text-emerald-600 hover:underline mt-4 inline-block">Browse Courses</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-32 px-6 bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 dark:from-emerald-500/10 dark:to-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {SECTIONS.map((s, i) => (
            <button key={s} type="button" onClick={() => setOpenSection(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                openSection === s
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-[10px] font-black text-white">{i + 1}</span>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Apply to Teach</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800 font-medium">
            You are applying for: <strong className="text-slate-900 dark:text-white">{course.title}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PERSONAL INFORMATION */}
            <SectionToggle title="Personal Information" section="Personal" />
            {openSection === 'Personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <div className="md:col-span-2">
                  <label className={labelCls}>Full Name</label>
                  <input value={pName} onChange={e => setPName(e.target.value)} required className={inputCls} placeholder="Your full name" />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={pEmail} onChange={e => setPEmail(e.target.value)} required className={inputCls} placeholder="email@example.com" />
                </div>
                <div>
                  <label className={labelCls}>Mobile Number</label>
                  <input type="tel" value={pPhone} onChange={e => setPPhone(e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input type="date" value={pDob} onChange={e => setPDob(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select value={pGender} onChange={e => setPGender(e.target.value)} className={inputCls}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Location (City, State, Country)</label>
                  <input value={pLocation} onChange={e => setPLocation(e.target.value)} className={inputCls} placeholder="e.g. Hyderabad, Telangana, India" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Profile Photo</label>
                  <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFiles('photo', e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100" />
                </div>
              </div>
            )}

            {/* PROFESSIONAL INFORMATION */}
            <SectionToggle title="Professional Information" section="Professional" />
            {openSection === 'Professional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <div className="md:col-span-2">
                  <label className={labelCls}>Highest Qualification</label>
                  <input value={profQual} onChange={e => setProfQual(e.target.value)} className={inputCls} placeholder="e.g. B.Tech, M.Sc, Ph.D" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Specialization / Subject Expertise</label>
                  <input value={profSpecialization} onChange={e => setProfSpecialization(e.target.value)} className={inputCls} placeholder="e.g. Mathematics, Machine Learning" />
                </div>
                <div>
                  <label className={labelCls}>Years of Teaching Experience</label>
                  <input type="number" min="0" value={profExp} onChange={e => setProfExp(e.target.value)} className={inputCls} placeholder="e.g. 5" />
                </div>
                <div>
                  <label className={labelCls}>Current Occupation</label>
                  <input value={profOccupation} onChange={e => setProfOccupation(e.target.value)} className={inputCls} placeholder="e.g. Software Engineer, Professor" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Languages Known</label>
                  <input value={profLanguages} onChange={e => setProfLanguages(e.target.value)} className={inputCls} placeholder="e.g. English, Hindi, Telugu" />
                </div>
              </div>
            )}

            {/* TEACHING DETAILS */}
            <SectionToggle title="Teaching Details" section="Teaching" />
            {openSection === 'Teaching' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <div className="md:col-span-2">
                  <label className={labelCls}>Subjects to Teach</label>
                  <input value={tSubjects} onChange={e => setTSubjects(e.target.value)} className={inputCls} placeholder="e.g. Algebra, Physics, Coding" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Course Category</label>
                  <input value={tCategory} onChange={e => setTCategory(e.target.value)} className={inputCls} placeholder="e.g. Math, Physics, Coding, Music, Dance, AI" />
                </div>
                <div>
                  <label className={labelCls}>Teaching Mode</label>
                  <select value={tMode} onChange={e => setTMode(e.target.value)} className={inputCls}>
                    <option value="">Select mode</option>
                    <option value="live">Live</option>
                    <option value="recorded">Recorded</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Preferred Class Timings</label>
                  <input value={tTimings} onChange={e => setTTimings(e.target.value)} className={inputCls} placeholder="e.g. 6 PM - 8 PM IST" />
                </div>
                <div>
                  <label className={labelCls}>Class Duration</label>
                  <input value={tDuration} onChange={e => setTDuration(e.target.value)} className={inputCls} placeholder="e.g. 60 minutes" />
                </div>
                <div>
                  <label className={labelCls}>Target Audience</label>
                  <select value={tAudience} onChange={e => setTAudience(e.target.value)} className={inputCls}>
                    <option value="">Select</option>
                    <option value="school">School Students</option>
                    <option value="college">College Students</option>
                    <option value="professionals">Professionals</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>
            )}

            {/* VERIFICATION */}
            <SectionToggle title="Verification & Documents" section="Verification" />
            {openSection === 'Verification' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <div className="md:col-span-2">
                  <label className={labelCls}>Resume/CV Upload</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files?.[0] && handleFiles('resume', e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Degree Certificates Upload</label>
                  <input type="file" accept=".pdf,.jpg,.png" onChange={e => e.target.files?.[0] && handleFiles('certificates', e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Government ID Proof</label>
                  <input type="file" accept=".pdf,.jpg,.png" onChange={e => e.target.files?.[0] && handleFiles('idproof', e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Portfolio / Previous Work URL</label>
                  <input value={vPortfolio} onChange={e => setVPortfolio(e.target.value)} className={inputCls} placeholder="https://" />
                </div>
                <div>
                  <label className={labelCls}>LinkedIn Profile</label>
                  <input value={vLinkedin} onChange={e => setVLinkedin(e.target.value)} className={inputCls} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className={labelCls}>Personal Website (Optional)</label>
                  <input value={vWebsite} onChange={e => setVWebsite(e.target.value)} className={inputCls} placeholder="https://" />
                </div>
              </div>
            )}

            {/* DEMO CLASS */}
            <SectionToggle title="Demo Class" section="Demo" />
            {openSection === 'Demo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <div className="md:col-span-2">
                  <label className={labelCls}>Introduction Video URL</label>
                  <input value={dIntro} onChange={e => setDIntro(e.target.value)} className={inputCls} placeholder="https://youtube.com/..." />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Demo Teaching Video URL</label>
                  <input value={dDemo} onChange={e => setDDemo(e.target.value)} className={inputCls} placeholder="https://youtube.com/..." />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Sample Course Content</label>
                  <textarea value={dSample} onChange={e => setDSample(e.target.value)} rows={4} className={inputCls + " resize-none"} placeholder="Describe or outline sample content you would teach..." />
                </div>
              </div>
            )}

            {/* BANKING */}
            <SectionToggle title="Banking & Payments" section="Banking" />
            {openSection === 'Banking' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <div className="md:col-span-2">
                  <label className={labelCls}>Bank Account Name</label>
                  <input value={bAccName} onChange={e => setBAccName(e.target.value)} className={inputCls} placeholder="Name on bank account" />
                </div>
                <div>
                  <label className={labelCls}>Account Number</label>
                  <input value={bAccNum} onChange={e => setBAccNum(e.target.value)} className={inputCls} placeholder="XXXXXXXXXX" />
                </div>
                <div>
                  <label className={labelCls}>IFSC Code</label>
                  <input value={bIfsc} onChange={e => setBIfsc(e.target.value)} className={inputCls} placeholder="SBIN0001234" />
                </div>
                <div>
                  <label className={labelCls}>UPI ID</label>
                  <input value={bUpi} onChange={e => setBUpi(e.target.value)} className={inputCls} placeholder="name@upi" />
                </div>
                <div>
                  <label className={labelCls}>PAN Number</label>
                  <input value={bPan} onChange={e => setBPan(e.target.value)} className={inputCls} placeholder="ABCDE1234F" />
                </div>
              </div>
            )}

            {/* AGREEMENT */}
            <SectionToggle title="Agreement" section="Agreement" />
            {openSection === 'Agreement' && (
              <div className="space-y-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={aTerms} onChange={e => setATerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">I accept the Terms & Conditions for teaching on this platform.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={aOwnership} onChange={e => setAOwnership(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">I agree that content I create remains my ownership but can be used by the platform for promotional purposes.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={aRevenue} onChange={e => setARevenue(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">I agree to the revenue sharing model as defined by the platform.</span>
                </label>
              </div>
            )}

            <button type="submit" disabled={submitLoading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
            >
              {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {submitLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherApplication;

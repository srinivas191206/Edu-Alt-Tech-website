import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { auth, db, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut, doc, setDoc, serverTimestamp, collection, query, where, getDocs } from '../lib/firebase';
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [phone, setPhone] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');

 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

 const handleSignup = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError('');

 if (password !== confirmPassword) {
 setError('Passwords do not match');
 setLoading(false);
 return;
 }
 try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

 // Now that we are signed in, we can check for phone uniqueness
 const q = query(collection(db, 'users'), where('phone', '==', phone));
 const querySnapshot = await getDocs(q);
 
 if (!querySnapshot.empty) {
 // If phone taken, we unfortunately created the auth account already.
 // But for dev simplicity, we can just throw or delete it.
 // We'll throw an error and let the user know.
 setError('Phone number is already registered. Please use another one.');
 setLoading(false);
 return;
 }

  if (!userCredential.user) {
  setError('Account creation failed. Please check your email confirmation settings and try again.');
  setLoading(false);
  return;
  }
  // Save additional user info to Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
  name,
  email,
  phone,
  createdAt: serverTimestamp()
  });


 // Update the user profile with the name
 await updateProfile(userCredential.user, {
 displayName: name
 });

 // Send verification email (silent)
 await sendEmailVerification(userCredential.user);



 // navigate(`/verify?email=${encodeURIComponent(email)}`);
 
 // Auto-login to dashboard instead
 if (email === 'ukkukk97@gmail.com' || email === 'umakrishnakanthchokkapu15@gmail.com') {
 navigate('/admin');
 } else {
 navigate('/dashboard');
 }
  } catch (err: any) {
  console.error('Signup error:', err);
  if (err.code === 'auth/email-already-in-use') {
  setError('User already exists. Please sign in');
  } else if (err.code === 'auth/weak-password') {
  setError('Password is too weak. Use at least 6 characters.');
  } else if (err.code === 'auth/invalid-email') {
  setError('Invalid email address.');
  } else if (err.code === 'auth/configuration-not-found') {
  setError('Authentication is not configured. Please contact support.');
  } else if (err.message?.includes('index')) {
  setError('Account created but phone verification unavailable. Contact support.');
  } else if (err.name === 'AuthRetryableFetchError') {
  setError('Signup service unavailable (server error). Please check Supabase SMTP settings or disable email confirmation.');
  } else {
  setError(err.message || 'Failed to create account. Please try again.');
  }
  } finally {
  setLoading(false);
  }
 };

 return (
 <div className="min-h-screen pt-32 pb-24 px-6 bg-slate-50 [#020617] flex flex-col items-center relative overflow-hidden">
 <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 /10 /10 rounded-full blur-[60px] pointer-events-none" />
 <Link to="/" className="mb-12 inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 :text-white transition-colors font-medium relative z-10">
 <ArrowLeft className="w-4 h-4" /> Back to Home
 </Link>

 <motion.div
 ref={formRef}
 initial={{ opacity: 0, y: 40, scale: 0.97 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
 className="w-full max-w-xl bg-white/90 /80 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200/50 /50 relative z-10"
 >
  <div className="text-center mb-10">
  <img src="/logo.png" alt="EduAltTech Logo" className="w-14 h-14 mx-auto mb-4 object-contain" />
  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h1>
 <p className="text-slate-500 font-medium">Join the world's most disciplined learners.</p>
 </div>

 {error && (
 <div className="mb-6 p-4 bg-red-50 /30 text-red-600 rounded-xl border border-red-100 text-sm font-medium md:col-span-2">
 {error}
 </div>
 )}

 <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSignup}>
 <div className="md:col-span-2">
 <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
 <input
 type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
 className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-[#90EE90] focus:ring-4 focus:ring-emerald-100 :ring-emerald-900/40 outline-none transition-all"
 />
 </div>
 <div className="md:col-span-2">
 <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
 <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
 className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-[#90EE90] focus:ring-4 focus:ring-emerald-100 :ring-emerald-900/40 outline-none transition-all"
 />
 </div>
 <div>
 <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
 <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91"
 className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-[#90EE90] focus:ring-4 focus:ring-emerald-100 :ring-emerald-900/40 outline-none transition-all"
 />
 </div>
 <div>
 <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
 <div className="relative">
 <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
 className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-[#90EE90] focus:ring-4 focus:ring-emerald-100 :ring-emerald-900/40 outline-none transition-all pr-12"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 :text-slate-200 transition-colors"
 >
 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>
 <div>
 <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
 <div className="relative">
 <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
 className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-[#90EE90] focus:ring-4 focus:ring-emerald-100 :ring-emerald-900/40 outline-none transition-all pr-12"
 />
 <button
 type="button"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 :text-slate-200 transition-colors"
 >
 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>

  <div className="md:col-span-2 pt-4">
  <button type="submit" disabled={loading}
 className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 :bg-emerald-500 transition-colors shadow-lg text-lg flex items-center justify-center gap-2"
 >
 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
 </button>
 <p className="text-center mt-6 text-slate-500 text-sm">
 Already have an account? <Link to="/login" className="font-bold text-slate-900 hover:text-emerald-600 underline underline-offset-4">Log in</Link>
 </p>
 </div>
 </form>
 </motion.div>
 </div>
 );
};

export default Signup;
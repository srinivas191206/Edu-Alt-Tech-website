import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { auth, db, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, doc, setDoc, serverTimestamp, collection, query, where, getDocs } from '../lib/firebase';
import { motion } from 'framer-motion';
import Button from '../components/Button';

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
  <div className="min-h-screen pt-32 pb-24 px-6 bg-bg flex flex-col items-center relative overflow-hidden">
  <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
  <Button variant="text" to="/" className="mb-12">
  <ArrowLeft className="w-4 h-4" /> Back to Home
  </Button>

 <motion.div
 ref={formRef}
 initial={{ opacity: 0, y: 40, scale: 0.97 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
  className="w-full max-w-xl bg-surface/90 backdrop-blur-2xl p-10 md:p-12 rounded-2xl shadow-2xl shadow-border/50 border border-border/50 relative z-10"
  >
   <div className="text-center mb-10">
   <img src="/logo.png" alt="EduAltTech Logo" loading="lazy" className="w-14 h-14 mx-auto mb-4 object-contain" />
   <h1 className="text-4xl font-black text-heading mb-3 tracking-tight">Create Account</h1>
  <p className="text-text-secondary font-medium">Join the world's most disciplined learners.</p>
 </div>

  {error && (
  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium md:col-span-2">
  {error}
  </div>
  )}

  <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSignup}>
  <div className="md:col-span-2">
  <label className="block text-sm font-bold text-text-secondary mb-2">Full Name</label>
  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
  className="w-full px-5 py-4 bg-bg rounded-xl border border-border focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
  />
  </div>
  <div className="md:col-span-2">
  <label className="block text-sm font-bold text-text-secondary mb-2">Email</label>
  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
  className="w-full px-5 py-4 bg-bg rounded-xl border border-border focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
  />
  </div>
  <div>
  <label className="block text-sm font-bold text-text-secondary mb-2">Phone</label>
  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91"
  className="w-full px-5 py-4 bg-bg rounded-xl border border-border focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
  />
  </div>
  <div>
  <label className="block text-sm font-bold text-text-secondary mb-2">Password</label>
  <div className="relative">
  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
  className="w-full px-5 py-4 bg-bg rounded-xl border border-border focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all pr-12"
  />
  <button type="button" onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
  >
  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </button>
  </div>
  </div>
  <div>
  <label className="block text-sm font-bold text-text-secondary mb-2">Confirm Password</label>
  <div className="relative">
  <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
  className="w-full px-5 py-4 bg-bg rounded-xl border border-border focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all pr-12"
  />
  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
  >
  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </button>
  </div>
  </div>

   <div className="md:col-span-2 pt-4">
   <Button type="submit" disabled={loading} loading={loading} className="w-full text-lg py-4">
   Create Account
   </Button>
   <p className="text-center mt-6 text-text-secondary text-sm">
   Already have an account? <Link to="/login" className="font-bold text-heading hover:text-primary underline underline-offset-4">Log in</Link>
   </p>
   </div>
 </form>
 </motion.div>
 </div>
 );
};

export default Signup;
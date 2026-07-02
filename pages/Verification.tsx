import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { auth, sendEmailVerification } from '../lib/firebase';
import Button from '../components/Button';

const Verification: React.FC = () => {
 const location = useLocation();
 const queryParams = new URLSearchParams(location.search);
 const email = queryParams.get('email') || 'your email';
 const [loading, setLoading] = useState(false);
 const [sent, setSent] = useState(false);
 const [error, setError] = useState('');

 const handleResend = async () => {
 if (!auth.currentUser) {
 setError('You must be logged in to resend verification. Please try signing up again.');
 return;
 }

 setLoading(true);
 setError('');
 try {
 await sendEmailVerification(auth.currentUser);
 setSent(true);
 } catch (err: any) {
 console.error(err);
 setError('Failed to resend verification email. Please try again later.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen pt-32 pb-24 px-6 bg-bg flex flex-col items-center justify-center">
 <div className="w-full max-w-md bg-surface p-10 md:p-12 rounded-2xl shadow-2xl shadow-border/50 border border-border/50 text-center">
 <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
 {sent ? <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-in zoom-in-50 duration-300" /> : <Mail className="w-10 h-10 text-emerald-600" />}
 </div>

 <h1 className="text-3xl font-bold text-heading mb-4 tracking-tight">
 {sent ? 'Email Sent!' : 'Verify Your Email'}
 </h1>

 <p className="text-text-secondary leading-relaxed mb-8">
 {sent
 ? `We've sent another verification email to ${email}. Please check your inbox (and spam folder).`
 : `We have sent you a verification email to ${email}. Please verify it and log in.`
 }
 </p>

 {error && (
 <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
 {error}
 </div>
 )}

 <div className="space-y-4">
  <Button variant="primary" size="lg" to="/login" className="w-full text-lg">
    Go to Login
  </Button>

  {!sent && (
  <Button variant="secondary" size="lg" className="w-full" onClick={handleResend} disabled={loading} loading={loading} icon={<RefreshCw className="w-4 h-4" />}>
    Resend Verification
  </Button>
  )}

  <Link
    to="/"
    className="inline-flex items-center gap-2 text-text-secondary hover:text-heading transition-colors text-sm font-medium"
  >
    <ArrowLeft className="w-4 h-4" /> Back to Home
  </Link>
 </div>
 </div>
 </div>
 );
};

export default Verification;

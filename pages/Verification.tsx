
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Verification: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || 'your email';

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Verify Your Email</h1>
        
        <p className="text-slate-600 leading-relaxed mb-8">
          We have sent you a verification email to <span className="font-bold text-slate-900">{email}</span>. Please verify it and log in.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/login" 
            className="block w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg text-lg"
          >
            Go to Login
          </Link>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verification;

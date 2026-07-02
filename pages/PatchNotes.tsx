import React, { useState, useEffect } from 'react';
import { db, auth, collection, getDocs, query, orderBy, doc, deleteDoc, onAuthStateChanged } from '../lib/firebase';
import { PatchNote } from '../types';
import { Loader2, FileText, ArrowLeft, Terminal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const PatchNotes: React.FC = () => {
 const [notes, setNotes] = useState<PatchNote[]>([]);
 const [loading, setLoading] = useState(true);
 const [isAdmin, setIsAdmin] = useState(false);
 const ADMIN_EMAILS = ['ukkukk97@gmail.com', 'umakrishnakanthchokkapu15@gmail.com'];

 const containerRef = React.useRef<HTMLDivElement>(null);

 useEffect(() => {
 const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
 setIsAdmin(!!currentUser?.email && ADMIN_EMAILS.includes(currentUser.email));
 });
 return () => unsubscribe();
 }, []);

 useEffect(() => {
 const fetchNotes = async () => {
 try {
 const q = query(collection(db, 'patch_notes'), orderBy('createdAt', 'desc'));
 const snap = await getDocs(q);
 setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as PatchNote)));
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };
 fetchNotes();
 }, []);

 const handleDeleteNote = async (id: string) => {
 if (!isAdmin) return;
 try {
 await deleteDoc(doc(db, 'patch_notes', id));
 setNotes(prev => prev.filter(n => n.id !== id));
 toast.success('Patch note deleted');
 } catch (err) {
 console.error(err);
 toast.error('Failed to delete patch note');
 }
 };

 if (loading) {
 return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
 }

 return (
 <div className="min-h-screen pt-32 pb-32 px-6 bg-bg text-heading relative overflow-hidden">
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
 <div className="max-w-4xl mx-auto relative z-10" ref={containerRef}>
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex items-center justify-between mb-16"
 >
 <div>
 <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-heading transition-colors mb-6 font-medium">
 <ArrowLeft className="w-4 h-4" /> Back to Home
 </Link>
 <h1 className="text-5xl md:text-6xl font-black flex items-center gap-4 tracking-tighter">
 <span className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
 <Terminal className="w-7 h-7"/>
 </span>
 System Updates
 </h1>
 <p className="text-xl text-text-secondary mt-4 font-medium">Latest changelogs, features, and fixes for the platform.</p>
 </div>
 </motion.div>

 {notes.length === 0 ? (
 <div className="text-center py-20 bg-surface rounded-3xl border border-border ">
 <FileText className="w-12 h-12 mx-auto text-text-muted mb-4" />
 <p className="text-xl text-text-secondary ">No patch notes have been published yet.</p>
 </div>
 ) : (
 <div className="space-y-8">
 {notes.map((note, idx) => (
 <motion.div
 key={note.id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.08, duration: 0.5 }}
 className="bg-surface/90 backdrop-blur-xl p-10 rounded-2xl border border-border/50 shadow-xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
 >
 <div className="absolute top-0 right-0 py-2 px-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-sm rounded-bl-2xl shadow-md">
 {note.version}
 </div>
 <h2 className="text-3xl font-black mb-3 pr-24 text-heading tracking-tight">{note.title || 'Platform Update'}</h2>
 <p className="text-sm font-semibold text-text-secondary mb-6 border-b border-border/50 pb-4">
 {note.createdAt && ('toDate' in note.createdAt) ? note.createdAt.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'}) : 'Recently'}
 </p>
 <div className="prose max-w-none text-text ">
 <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0 text-base">{note.content}</pre>
 </div>
 {isAdmin && (
 <button 
 onClick={() => handleDeleteNote(note.id)}
 className="absolute top-12 right-6 p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition"
 title="Delete Patch Note"
 >
 <Trash2 className="w-5 h-5" />
 </button>
 )}
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
};

export default PatchNotes;

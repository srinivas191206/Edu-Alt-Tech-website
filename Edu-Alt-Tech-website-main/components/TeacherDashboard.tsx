import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, deleteDoc, doc, serverTimestamp, onSnapshot, updateDoc } from 'firebase/firestore';
import { Course } from '../types';
import { Loader2, Plus, Trash2, Folder, BookOpen, IndianRupee, Bell, Send } from 'lucide-react';
import CourseDetail from './CourseDetail';
import ScheduleClass from './ScheduleClass';
import TeacherStudents from './TeacherStudents';
import Chat from './Chat';

interface Props {
  user: User;
  activeTab: string;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-dark w-full max-w-lg rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-display font-bold text-white tracking-widest">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const TeacherDashboard: React.FC<Props> = ({ user, activeTab }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });

  // Price editing state
  const [editingPriceCourseId, setEditingPriceCourseId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState('');

  // Notification state
  const [notifText, setNotifText] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState('');
  const [sentNotifs, setSentNotifs] = useState<{ id: string; text: string; createdAt: any }[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), where('global', '==', true));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as { id: string; text: string; createdAt: any }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setSentNotifs(data);
    });
    return () => unsub();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifText.trim()) { setNotifError('Please enter a notification message.'); return; }
    setNotifError('');
    setNotifLoading(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        text: notifText.trim(),
        global: true,
        teacherId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNotifText('');
    } catch (err) {
      console.error('Error sending notification:', err);
      setNotifError('Failed to send. Please try again.');
    } finally {
      setNotifLoading(false);
    }
  };

  const handleDeleteNotif = async (id: string) => {
    try { await deleteDoc(doc(db, 'notifications', id)); }
    catch (err) { console.error('Error deleting notification:', err); }
  };

  const fmtNotifTime = (ts: any) => {
    if (!ts?.toDate) return 'Just now';
    const d: Date = ts.toDate();
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24 && now.getDate() === d.getDate()) return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (hrs < 48) return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const q = query(collection(db, 'courses'), where('teacherId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const courseData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      // Sort in memory since we don't want to require an index right away
      courseData.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setCourses(courseData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await addDoc(collection(db, 'courses'), {
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : 0,
        teacherId: user.uid,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', price: '' });
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSavePrice = async (courseId: string) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        price: editingPriceValue ? parseFloat(editingPriceValue) : 0
      });
    } catch (error) {
      console.error('Error updating price:', error);
    } finally {
      setEditingPriceCourseId(null);
      setEditingPriceValue('');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-neon-cyan" /></div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-6 tracking-widest uppercase">Teacher Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-dark p-6 rounded-2xl border border-white/5 shadow-lg flex items-center gap-6 group hover:border-neon-cyan/30 transition-all duration-300">
              <div className="w-14 h-14 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-neon-cyan group-hover:bg-neon-cyan/20 transition-all shadow-[0_0_15px_rgba(0,238,252,0.2)]">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-display font-bold text-slate-400 uppercase tracking-widest">Active Courses</p>
                <p className="text-3xl font-display font-bold text-white mt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{courses.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && selectedCourse && (
        <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
      )}

      {activeTab === 'courses' && !selectedCourse && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase">Course Management</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-neon-cyan to-neon-dim text-neon-dark font-display font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,238,252,0.3)] hover:shadow-[0_0_25px_rgba(0,238,252,0.5)] uppercase tracking-wider text-sm"
            >
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center glass-dark rounded-3xl border border-white/5 shadow-lg relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="w-20 h-20 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full flex items-center justify-center mb-6 text-neon-cyan relative z-10">
                <Folder className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-display font-bold text-white tracking-widest uppercase relative z-10 mb-2">No courses created yet</h3>
              <p className="text-slate-400 max-w-sm mb-6 relative z-10">Start building your curriculum by creating your first course framework.</p>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-display font-bold tracking-widest uppercase rounded-xl hover:bg-neon-cyan/20 transition-all shadow-[0_0_15px_rgba(0,238,252,0.1)] relative z-10 text-sm"
              >
                Create First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="group p-6 glass-dark rounded-3xl border border-white/5 hover:border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,238,252,0.1)] transition-all duration-300 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 border-neon-cyan rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="p-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl text-neon-cyan transition-colors shadow-inner">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <button onClick={() => handleDeleteCourse(course.id)} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all border border-transparent hover:border-red-500/30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xl font-display font-bold text-white mb-2 truncate tracking-wide">{course.title}</h4>
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed font-sans">{course.description}</p>
                  </div>

                  {/* Price section */}
                  <div className="flex items-center gap-2 relative z-10 mt-2">
                    {editingPriceCourseId === course.id ? (
                      <>
                        <div className="flex items-center gap-1 flex-1 glass border border-neon-cyan/50 rounded-xl px-3 py-2 text-white">
                          <IndianRupee className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <input
                            type="number" min="0" step="1" autoFocus
                            className="bg-transparent outline-none w-full text-sm font-display font-bold text-white"
                            placeholder="0 = Free"
                            value={editingPriceValue}
                            onChange={e => setEditingPriceValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSavePrice(course.id); if (e.key === 'Escape') setEditingPriceCourseId(null); }}
                          />
                        </div>
                        <button onClick={() => handleSavePrice(course.id)} className="px-3 py-2 bg-neon-cyan text-neon-dark text-xs font-display font-bold tracking-widest uppercase rounded-xl hover:brightness-110 transition-colors">Save</button>
                        <button onClick={() => setEditingPriceCourseId(null)} className="px-3 py-2 bg-white/10 text-white text-xs font-display font-bold tracking-widest uppercase rounded-xl hover:bg-white/20 transition-colors">Cancel</button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setEditingPriceCourseId(course.id); setEditingPriceValue(course.price != null ? String(course.price) : ''); }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-neon-cyan/20 text-slate-400 hover:text-neon-cyan rounded-xl text-sm font-display font-medium uppercase transition-colors border border-white/5 hover:border-neon-cyan/30"
                      >
                        <IndianRupee className="w-4 h-4" />
                        {course.price != null && course.price > 0 ? `₹${course.price}` : 'Set Price'}
                      </button>
                    )}
                  </div>

                  <div className="mt-auto pt-4 flex gap-2 w-full border-t border-white/10 relative z-10">
                    <button onClick={() => setSelectedCourse(course)} className="flex-1 py-3 bg-white/5 hover:bg-neon-cyan/10 text-slate-300 hover:text-neon-cyan font-display font-bold uppercase tracking-widest text-xs rounded-lg transition-colors border border-transparent hover:border-neon-cyan/30 text-center w-full">
                      Manage Structure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Implementations for schedule and students */}
      {activeTab === 'schedule' && (
        <ScheduleClass user={user} courses={courses} />
      )}

      {activeTab === 'students' && (
        <TeacherStudents user={user} courses={courses} />
      )}

      {activeTab === 'notifications' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
              <Bell className="w-7 h-7 text-neon-cyan" /> Notifications
            </h2>
            {sentNotifs.length > 0 && (
              <span className="px-3 py-1.5 bg-neon-cyan/10 text-neon-cyan text-xs font-display font-bold uppercase tracking-widest rounded-full border border-neon-cyan/30 drop-shadow-[0_0_5px_rgba(0,238,252,0.5)]">
                {sentNotifs.length} sent
              </span>
            )}
          </div>

          {/* Send form */}
          <div className="glass-dark border border-white/10 rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/10 blur-[40px] pointer-events-none rounded-full"></div>
            <p className="text-slate-400 font-sans text-sm mb-4">
              Broadcast a message to all enrolled students instantly.
            </p>
            <form onSubmit={handleSendNotification} className="space-y-3 relative z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={notifText}
                  onChange={e => { setNotifText(e.target.value); if (notifError) setNotifError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendNotification(e as any); }}
                  placeholder="e.g. New class uploaded in Mathematics..."
                  className={`flex-1 px-5 py-4 bg-black/30 text-white placeholder-slate-500 border rounded-xl outline-none focus:ring-2 transition-all font-sans text-sm ${notifError ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-neon-cyan/50 focus:ring-neon-cyan/20'}`}
                />
                <button type="submit" disabled={notifLoading}
                  className="px-6 py-4 bg-gradient-to-r from-neon-cyan to-neon-dim hover:brightness-110 text-neon-dark font-display font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,238,252,0.3)] whitespace-nowrap text-sm"
                >
                  {notifLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send to All</>}
                </button>
              </div>
              {notifError && (
                <p className="text-red-400 font-display uppercase tracking-widest text-xs font-bold flex items-center gap-1.5 mt-2">
                  <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">!</span>
                  {notifError}
                </p>
              )}
            </form>
          </div>

          {/* Sent list */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display uppercase tracking-widest font-bold text-white">Sent Notifications</h3>
          </div>
          <div className="glass-dark border border-white/5 rounded-2xl overflow-hidden shadow-lg">
            {sentNotifs.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                  <Bell className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <p className="text-slate-300 font-display font-bold uppercase tracking-widest">No notifications sent yet</p>
                  <p className="text-slate-500 font-sans text-sm mt-1">Send your first notification above.</p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {sentNotifs.map((n, i) => (
                  <li key={n.id}
                    className="flex items-start gap-4 px-6 py-5 hover:bg-white/5 transition-colors group"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="w-10 h-10 bg-neon-cyan/10 border border-neon-cyan/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-neon-cyan drop-shadow-[0_0_5px_rgba(0,238,252,0.5)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-sans font-medium text-sm leading-relaxed">{n.text}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <p className="text-xs text-slate-400 font-display">{fmtNotifTime(n.createdAt)}</p>
                        <span className="px-2 py-0.5 bg-white/10 text-slate-300 text-[9px] font-display font-bold rounded-full uppercase tracking-wider">
                          Sent to all students
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotif(n.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded-lg transition-all border border-transparent hover:border-red-500/30 flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <Chat user={user} role="teacher" />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Course">
        <form onSubmit={handleCreateCourse} className="space-y-5">
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-widest text-slate-300 mb-2">Course Title</label>
            <input
              type="text" required autoFocus
              className="w-full px-5 py-4 bg-black/30 text-white placeholder-slate-500 border border-white/10 rounded-2xl outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all font-sans"
              placeholder="e.g., Advanced Mathematics 101"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-widest text-slate-300 mb-2">Description</label>
            <textarea
              className="w-full px-5 py-4 bg-black/30 text-white placeholder-slate-500 border border-white/10 rounded-2xl outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all font-sans h-32 resize-none"
              placeholder="Provide a brief overview of the course objectives..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-widest text-slate-300 mb-2">Course Price (₹)</label>
            <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-2xl px-5 focus-within:border-neon-cyan/50 focus-within:ring-2 focus-within:ring-neon-cyan/20 transition-all">
              <IndianRupee className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="number" min="0" step="1"
                className="w-full py-4 bg-transparent outline-none font-sans text-white placeholder-slate-500"
                placeholder="0 for free"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <p className="text-xs text-slate-500 font-display mt-2 tracking-wide uppercase">Leave 0 or empty for a free course.</p>
          </div>
          <button
            type="submit" disabled={modalLoading}
            className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-dim text-neon-dark font-display font-bold tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 mt-6 shadow-[0_0_20px_rgba(0,238,252,0.3)] text-sm"
          >
            {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Course'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherDashboard;

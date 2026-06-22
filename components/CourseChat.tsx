import React, { useState, useEffect, useRef } from 'react';
import { db, auth, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, doc, getDoc, limit } from '../lib/firebase';
import { Send, Hash, MessageCircle, User, Loader2, Search } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
}

interface ChatProps {
  courseId: string;
  currentUser: any;
  mentorId: string;
  role: 'student' | 'teacher';
}

const CourseChat: React.FC<ChatProps> = ({ courseId, currentUser, mentorId, role }) => {
  const [activeTab, setActiveTab] = useState<'community' | 'direct'>('community');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Mentor specific
  const [students, setStudents] = useState<{uid: string, name: string}[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [mentorName, setMentorName] = useState('Mentor');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch mentor name
  useEffect(() => {
    if (mentorId) {
      getDoc(doc(db, 'users', mentorId)).then(snap => {
        if (snap.exists()) setMentorName(snap.data().display_name || snap.data().name || 'Mentor');
      }).catch(() => {});
    }
  }, [mentorId]);

  // Fetch student list if mentor
  useEffect(() => {
    if (role === 'teacher') {
      const fetchStudents = async () => {
        const eQ = query(collection(db, 'enrollments'), where('courseId', '==', courseId), where('role', '==', 'student'));
        const eSnap = await getDocs(eQ);
        const sIds = eSnap.docs.map(d => d.data().userId);
        if (sIds.length > 0) {
          const uQ = query(collection(db, 'users'), where('__name__', 'in', sIds.slice(0, 10)));
          const uSnap = await getDocs(uQ);
          const sList = uSnap.docs.map(d => ({ uid: d.id, name: d.data().name || 'Student' }));
          setStudents(sList);
          if (sList.length > 0 && !selectedStudentId) setSelectedStudentId(sList[0].uid);
        }
      };
      fetchStudents();
    }
  }, [role, courseId]);

  // Fetch messages
  useEffect(() => {
    setLoading(true);
    if (activeTab === 'community') {
      const msgQ = query(
        collection(db, 'course_chat_messages'),
        where('course_id', '==', courseId),
        orderBy('created_at', 'asc'),
        limit(100)
      );
      const unsub = onSnapshot(msgQ, (snap) => {
        const msgs = snap.docs.map((d: any) => ({
          id: d.id,
          senderId: d.data().userId || d.data().user_id || '',
          senderName: d.data().senderName || d.data().sender_name || 'User',
          text: d.data().content || '',
          timestamp: d.data().createdAt || d.data().created_at
        }));
        setMessages(msgs);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        setLoading(false);
      });
      return () => unsub();
    } else {
      const targetId = role === 'teacher' ? selectedStudentId : mentorId;
      if (!targetId) { setMessages([]); setLoading(false); return; }

      const dmQ = query(
        collection(db, 'direct_messages'),
        where('course_id', '==', courseId),
        orderBy('created_at', 'asc'),
        limit(100)
      );
      const unsub = onSnapshot(dmQ, (snap) => {
        const all = snap.docs.map((d: any) => {
          const data = d.data();
          return {
            id: d.id,
            senderId: data.senderId || data.sender_id || '',
            receiverId: data.receiverId || data.receiver_id || '',
            senderName: data.senderName || data.sender_name || 'User',
            text: data.content || '',
            timestamp: data.createdAt || data.created_at
          };
        });
        const participants = [currentUser.uid, targetId].sort().join(',');
        const filtered = all.filter((m: any) => {
          const p = [m.senderId, m.receiverId].sort().join(',');
          return p === participants;
        });
        setMessages(filtered);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        setLoading(false);
      });
      return () => unsub();
    }
  }, [courseId, activeTab, currentUser.uid, mentorId, role, selectedStudentId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const text = newMessage;
    setNewMessage('');

    try {
      if (activeTab === 'community') {
        await addDoc(collection(db, 'course_chat_messages'), {
          course_id: courseId,
          user_id: currentUser.uid,
          content: text,
          sender_name: currentUser.displayName || 'User',
          created_at: serverTimestamp()
        });
      } else {
        const targetId = role === 'teacher' ? selectedStudentId : mentorId;
        if (!targetId) return;
        await addDoc(collection(db, 'direct_messages'), {
          course_id: courseId,
          sender_id: currentUser.uid,
          receiver_id: targetId,
          content: text,
          sender_name: currentUser.displayName || 'User',
          created_at: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Send error", err);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
      {/* Sidebar / Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-200 p-3">
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'community' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Hash className="w-4 h-4" /> Course Channel
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'direct' ? 'bg-white text-purple-600 shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <MessageCircle className="w-4 h-4" /> {role === 'teacher' ? 'Private DMs' : `DM ${mentorName}`}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Mentor's Student List Sidebar */}
        {role === 'teacher' && activeTab === 'direct' && (
          <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Active Students</h4>
              <div className="space-y-1">
                {students.map(s => (
                  <button
                    key={s.uid}
                    onClick={() => setSelectedStudentId(s.uid)}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-center gap-2 ${selectedStudentId === s.uid ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Area */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
          {/* Header */}
          <div className="px-6 py-4 bg-white/50 backdrop-blur-md border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold truncate">
                  {activeTab === 'community' ? 'Course Broadcast' : (role === 'teacher' ? (students.find(s => s.uid === selectedStudentId)?.name || 'Select Student') : mentorName)}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {activeTab === 'community' ? 'Whole Students Channel' : (role === 'teacher' ? 'Student Participant' : 'Primary Instructor')}
                </p>
              </div>
            </div>
            {activeTab === 'community' && role === 'teacher' && (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">
                Instructor Mode
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                <MessageCircle className="w-12 h-12" />
                <p className="text-sm font-medium">Start the conversation...</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser.uid;
                const showName = idx === 0 || messages[idx-1].senderId !== msg.senderId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {showName && !isMe && (
                      <div className="flex items-center gap-2 ml-2 mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                        {msg.senderId === mentorId && (
                          <span className="text-[8px] font-black text-emerald-500 border border-emerald-500/30 px-1.5 rounded uppercase">{mentorName}</span>
                        )}
                      </div>
                    )}
                    <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseChat;

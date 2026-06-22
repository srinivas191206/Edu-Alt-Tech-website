import React, { useState, useEffect, useRef } from 'react';
import { db, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, limit } from '../lib/firebase';
import { Send, Hash, MessageCircle, User, Loader2 } from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [mentorName, setMentorName] = useState('Mentor');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mentorId) {
      getDoc(doc(db, 'users', mentorId)).then(snap => {
        if (snap.exists()) setMentorName(snap.data().displayName || snap.data().name || 'Mentor');
      }).catch(() => {});
    }
  }, [mentorId]);

  useEffect(() => {
    if (!currentUser?.uid) { setLoading(false); return; }
    setLoading(true);
    const msgQ = query(
      collection(db, 'course_chat_messages'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'asc'),
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
    }, () => setLoading(false));
    return () => unsub();
  }, [courseId, currentUser?.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser?.uid) return;
    const text = newMessage;
    setNewMessage('');
    try {
      await addDoc(collection(db, 'course_chat_messages'), {
        course_id: courseId,
        user_id: currentUser.uid,
        content: text,
        sender_name: currentUser.displayName || 'User',
        role: role,
        created_at: serverTimestamp()
      });
    } catch (err) {
      console.error("Send error", err);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
      <div className="flex bg-slate-50 border-b border-slate-200 p-3">
        <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-white text-emerald-600 shadow-md">
          <Hash className="w-4 h-4" /> Course Broadcast
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col bg-slate-50/30">
          <div className="px-6 py-4 bg-white/50 backdrop-blur-md border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold truncate">Course Broadcast</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Whole Students Channel</p>
              </div>
            </div>
            {role === 'teacher' && (
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

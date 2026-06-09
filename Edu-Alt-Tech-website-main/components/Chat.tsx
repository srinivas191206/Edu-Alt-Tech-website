import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import {
  collection, query, orderBy, onSnapshot, addDoc,
  serverTimestamp, getDocs, where, doc, getDoc, updateDoc, limit
} from 'firebase/firestore';
import { Loader2, Send, MessageCircle, ArrowLeft, Smile, Paperclip, Search } from 'lucide-react';
import { UserObject } from '../types';

interface Props { user: User; role: 'student' | 'teacher' | 'admin'; }

interface Message {
  id: string; senderId: string; senderName: string; text: string;
  createdAt: any; seen?: boolean; _local?: boolean;
}

interface Conversation {
  id: string; otherUid: string; otherName: string; otherEmail: string;
  online?: boolean; unread?: number; lastMsg?: string; lastMsgTime?: any; color?: string;
}

const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','😅','🙏','👍','👏','🔥','💯','🎉','❤️','✨','🚀','📚','💡','🎯','⭐'];
const COLORS = ['#8b5cf6','#ec4899','#f59e0b','#3b82f6','#10b981','#ef4444'];
const makeThreadId = (a: string, b: string) => [a, b].sort().join('_');

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_CONTACTS_TEACHER: Conversation[] = [
  { id:'demo_rahul', otherUid:'demo_rahul', otherName:'Rahul S.', otherEmail:'rahul@student.edu', online:true, unread:2, lastMsg:'Sir, I have a doubt about the Math homework', color:'#8b5cf6' },
  { id:'demo_priya', otherUid:'demo_priya', otherName:'Priya K.', otherEmail:'priya@student.edu', online:true, unread:0, lastMsg:'Thank you sir!', color:'#ec4899' },
  { id:'demo_arjun', otherUid:'demo_arjun', otherName:'Arjun M.', otherEmail:'arjun@student.edu', online:false, unread:0, lastMsg:'When is the next class?', color:'#f59e0b' },
  { id:'demo_sneha', otherUid:'demo_sneha', otherName:'Sneha R.', otherEmail:'sneha@student.edu', online:false, unread:0, lastMsg:'I submitted the assignment', color:'#3b82f6' },
];
const DEMO_CONTACTS_STUDENT: Conversation[] = [
  { id:'demo_teacher_ranadeep', otherUid:'demo_teacher_ranadeep', otherName:'Ranadeep Sir', otherEmail:'ranadeep@edualttech.com', online:true, unread:1, lastMsg:'Your next class is on Wednesday at 6 PM', color:'#6366f1' },
  { id:'demo_teacher_gnanasri', otherUid:'demo_teacher_gnanasri', otherName:"Gnanasri Ma'am", otherEmail:'gnanasri@edualttech.com', online:false, unread:0, lastMsg:'Please submit your assignment by Friday', color:'#10b981' },
  { id:'demo_teacher_venkat', otherUid:'demo_teacher_venkat', otherName:'Venkat Sir', otherEmail:'venkat@edualttech.com', online:true, unread:0, lastMsg:'Great work on the last assignment! 👏', color:'#f59e0b' },
];

const nowTs = () => ({ toDate:()=>new Date(), toMillis:()=>Date.now() });
const minsAgo = (m:number) => ({ toDate:()=>new Date(Date.now()-m*60000), toMillis:()=>Date.now()-m*60000 });
const yestTs = () => ({ toDate:()=>new Date(Date.now()-26*3600000), toMillis:()=>Date.now()-26*3600000 });

const DEMO_MSGS: Record<string,Message[]> = {
  demo_rahul:[
    {id:'d1',senderId:'demo_rahul',senderName:'Rahul S.',text:'Good morning sir!',createdAt:yestTs(),_local:true},
    {id:'d2',senderId:'me',senderName:'Teacher',text:'Good morning Rahul! How are you?',createdAt:yestTs(),_local:true},
    {id:'d3',senderId:'demo_rahul',senderName:'Rahul S.',text:"I am fine sir. I had a question about yesterday's class.",createdAt:minsAgo(120),_local:true},
    {id:'d4',senderId:'demo_rahul',senderName:'Rahul S.',text:'Sir, I have a doubt about the Math homework',createdAt:minsAgo(5),_local:true},
  ],
  demo_priya:[
    {id:'p1',senderId:'me',senderName:'Teacher',text:'Priya, please submit your assignment by Friday.',createdAt:minsAgo(60),_local:true},
    {id:'p2',senderId:'demo_priya',senderName:'Priya K.',text:'Sure sir, I will submit it on time.',createdAt:minsAgo(55),_local:true},
    {id:'p3',senderId:'demo_priya',senderName:'Priya K.',text:'Thank you sir!',createdAt:minsAgo(10),_local:true},
  ],
  demo_arjun:[
    {id:'a1',senderId:'demo_arjun',senderName:'Arjun M.',text:'Hello sir, when is the next class?',createdAt:minsAgo(200),_local:true},
    {id:'a2',senderId:'me',senderName:'Teacher',text:'Next class is on Wednesday at 5 PM.',createdAt:minsAgo(195),_local:true},
    {id:'a3',senderId:'demo_arjun',senderName:'Arjun M.',text:'When is the next class?',createdAt:minsAgo(30),_local:true},
  ],
  demo_sneha:[
    {id:'s1',senderId:'demo_sneha',senderName:'Sneha R.',text:'Sir, I have submitted the assignment.',createdAt:minsAgo(300),_local:true},
    {id:'s2',senderId:'me',senderName:'Teacher',text:'Great work Sneha! I will review it soon.',createdAt:minsAgo(290),_local:true},
    {id:'s3',senderId:'demo_sneha',senderName:'Sneha R.',text:'I submitted the assignment',createdAt:minsAgo(45),_local:true},
  ],
  demo_teacher_ranadeep:[
    {id:'tr1',senderId:'demo_teacher_ranadeep',senderName:'Ranadeep Sir',text:'Hello! Welcome to the Python course 🎉',createdAt:yestTs(),_local:true},
    {id:'tr2',senderId:'me',senderName:'Student',text:'Thank you sir! Really excited to start.',createdAt:yestTs(),_local:true},
    {id:'tr3',senderId:'demo_teacher_ranadeep',senderName:'Ranadeep Sir',text:'Your next class is on Wednesday at 6 PM',createdAt:minsAgo(10),_local:true},
  ],
  demo_teacher_gnanasri:[
    {id:'tg1',senderId:'demo_teacher_gnanasri',senderName:"Gnanasri Ma'am",text:'Hi! I have uploaded the calculus notes.',createdAt:minsAgo(180),_local:true},
    {id:'tg2',senderId:'me',senderName:'Student',text:"Thank you ma'am! I will go through them.",createdAt:minsAgo(175),_local:true},
    {id:'tg3',senderId:'demo_teacher_gnanasri',senderName:"Gnanasri Ma'am",text:'Please submit your assignment by Friday',createdAt:minsAgo(20),_local:true},
  ],
  demo_teacher_venkat:[
    {id:'tv1',senderId:'me',senderName:'Student',text:'Sir, I completed the ML project.',createdAt:minsAgo(90),_local:true},
    {id:'tv2',senderId:'demo_teacher_venkat',senderName:'Venkat Sir',text:'Great work on the last assignment! 👏',createdAt:minsAgo(85),_local:true},
  ],
};

const DEMO_REPLIES: Record<string,string[]> = {
  demo_rahul:['Thank you sir!','I understand now 😊','Can you explain once more?','Got it sir!'],
  demo_priya:['Thank you sir! 🙏','Sure, I will do it.','Understood!','I will submit on time.'],
  demo_arjun:['Okay sir, thank you!','Got it!','I will be there.','Thank you for the info.'],
  demo_sneha:['Thank you sir!','I will keep that in mind.','Understood sir.','I will work on it.'],
  demo_teacher_ranadeep:['Sure, I will explain it in the next class.','Please check the notes I uploaded.','Yes, the class is at 6 PM on Wednesday.','Keep it up! 👍'],
  demo_teacher_gnanasri:['Please submit by Friday without fail.','I have reviewed your work — good progress!','Attend the live session tomorrow.'],
  demo_teacher_venkat:['Excellent work! Keep it up 🌟','The next assignment is due next Monday.','Feel free to ask any doubts in class.'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(ts: any): string {
  if (!ts?.toDate) return 'Today';
  const d = ts.toDate(); const now = new Date(); const diff = now.getTime() - d.getTime();
  if (diff < 86400000 && now.getDate() === d.getDate()) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString([], { weekday:'long', month:'short', day:'numeric' });
}
function fmtTime(ts: any): string {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}

// ── Component ─────────────────────────────────────────────────────────────────
const Chat: React.FC<Props> = ({ user, role }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeThread, setActiveThread] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localMsgs, setLocalMsgs] = useState<Record<string,Message[]>>({...DEMO_MSGS});
  const [text, setText] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimer = useRef<any>(null);
  const msgCounter = useRef(1000);
  // Track per-thread last-message for sidebar preview (real mode)
  const [threadPreviews, setThreadPreviews] = useState<Record<string,{text:string;time:any}>>({});
  // Store unsub functions for per-thread preview listeners
  const previewUnsubs = useRef<Record<string,()=>void>>({});

  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 60);
  }, []);

  // ── Load contacts ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoadingConvos(true);
      try {
        let uids: string[] = [];
        if (role === 'student') {
          const snap = await getDocs(query(collection(db,'enrollments'), where('studentId','==',user.uid)));
          const courseIds = snap.docs.map(d => d.data().courseId as string);
          const teacherIds = new Set<string>();
          for (const cid of courseIds) {
            const cDoc = await getDoc(doc(db,'courses',cid));
            if (cDoc.exists()) teacherIds.add(cDoc.data().teacherId as string);
          }
          uids = Array.from(teacherIds);
        } else {
          const courseSnap = await getDocs(query(collection(db,'courses'), where('teacherId','==',user.uid)));
          const courseIds = courseSnap.docs.map(d => d.id);
          const studentIds = new Set<string>();
          for (const cid of courseIds) {
            const enrollSnap = await getDocs(query(collection(db,'enrollments'), where('courseId','==',cid)));
            enrollSnap.docs.forEach(d => studentIds.add(d.data().studentId as string));
          }
          uids = Array.from(studentIds);
        }

        if (uids.length === 0) {
          setIsDemo(true);
          setConversations(role === 'student' ? DEMO_CONTACTS_STUDENT : DEMO_CONTACTS_TEACHER);
        } else {
          setIsDemo(false);
          const convos: Conversation[] = [];
          for (const uid of uids) {
            const uDoc = await getDoc(doc(db,'users',uid));
            if (uDoc.exists()) {
              const data = uDoc.data() as UserObject;
              const name = data.name?.trim() || (data as any).displayName?.trim() || data.email?.split('@')[0] || uid.slice(0,8);
              const threadId = makeThreadId(user.uid, uid);
              convos.push({ id:threadId, otherUid:uid, otherName:name, otherEmail:data.email||'', online:Math.random()>0.4 });
            }
          }
          setConversations(convos);

          // ── Real-time last-message preview for each thread ──────────────
          // Clean up old listeners
          Object.values(previewUnsubs.current).forEach(u => u());
          previewUnsubs.current = {};

          convos.forEach(convo => {
            const q = query(
              collection(db,'chats',convo.id,'messages'),
              orderBy('createdAt','desc'),
              limit(1)
            );
            const unsub = onSnapshot(q, snap => {
              if (!snap.empty) {
                const d = snap.docs[0].data();
                setThreadPreviews(prev => ({
                  ...prev,
                  [convo.id]: { text: d.text, time: d.createdAt }
                }));
              }
            });
            previewUnsubs.current[convo.id] = unsub;
          });
        }
      } catch (e) {
        console.error(e);
        setIsDemo(true);
        setConversations(role === 'student' ? DEMO_CONTACTS_STUDENT : DEMO_CONTACTS_TEACHER);
      } finally {
        setLoadingConvos(false);
      }
    };
    load();
    return () => { Object.values(previewUnsubs.current).forEach(u => u()); };
  }, [user.uid, role]);

  // ── Real-time message listener for active thread (Firebase) ─────────────
  useEffect(() => {
    if (!activeThread || isDemo) return;

    const q = query(
      collection(db,'chats',activeThread.id,'messages'),
      orderBy('createdAt','asc')
    );

    const unsub = onSnapshot(q, snap => {
      if (snap.empty) {
        // Empty thread — show welcome bubble
        setMessages([{
          id:'__welcome__', senderId:activeThread.otherUid, senderName:activeThread.otherName,
          text:`Hi! This is the start of your conversation with ${activeThread.otherName}. Send a message to get started 👋`,
          createdAt:nowTs(), _local:true,
        }]);
      } else {
        setMessages(snap.docs.map(d => ({ id:d.id, ...d.data() } as Message)));
      }
      scrollBottom();
    });

    return () => unsub();
  }, [activeThread?.id, isDemo]); // depend on id string, not object reference

  // ── Demo messages ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeThread || !isDemo) return;
    setMessages(localMsgs[activeThread.id] || []);
    scrollBottom();
  }, [activeThread?.id, isDemo]);

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!text.trim() || !activeThread) return;
    const msgText = text.trim();
    setText('');
    setIsTyping(false);
    setSending(true);

    if (isDemo) {
      const newMsg: Message = {
        id: String(++msgCounter.current), senderId:'me',
        senderName: user.displayName || (role === 'student' ? 'Student' : 'Teacher'),
        text: msgText, createdAt: nowTs(), _local:true,
      };
      setLocalMsgs(prev => {
        const updated = [...(prev[activeThread.id]||[]), newMsg];
        setMessages(updated);
        scrollBottom();
        return { ...prev, [activeThread.id]: updated };
      });
      setSending(false);

      // Simulated reply
      const replies = DEMO_REPLIES[activeThread.id] || ['Got it!','Thank you!','Understood.'];
      setTimeout(() => setIsTyping(true), 700);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: String(++msgCounter.current), senderId: activeThread.id,
          senderName: activeThread.otherName,
          text: replies[Math.floor(Math.random()*replies.length)],
          createdAt: nowTs(), _local:true,
        };
        setLocalMsgs(prev => {
          const updated = [...(prev[activeThread.id]||[]), reply];
          setMessages(updated);
          scrollBottom();
          return { ...prev, [activeThread.id]: updated };
        });
      }, 1500 + Math.random()*800);
    } else {
      try {
        await addDoc(collection(db,'chats',activeThread.id,'messages'), {
          senderId: user.uid,
          senderName: user.displayName || user.email?.split('@')[0] || 'User',
          text: msgText,
          createdAt: serverTimestamp(),
          seen: false,
        });
        // onSnapshot will fire and update messages automatically
      } catch (e) { console.error('Send failed:', e); }
      finally { setSending(false); }
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
  };

  // Group messages by date
  const grouped: { date:string; msgs:Message[] }[] = [];
  messages.forEach(m => {
    const d = fmtDate(m.createdAt);
    const last = grouped[grouped.length-1];
    if (last && last.date === d) last.msgs.push(m);
    else grouped.push({ date:d, msgs:[m] });
  });

  const filteredConvos = conversations.filter(c =>
    c.otherName.toLowerCase().includes(search.toLowerCase())
  );
  const getColor = (c: Conversation) => c.color || COLORS[conversations.indexOf(c) % COLORS.length];

  // ── Conversation list ─────────────────────────────────────────────────────
  if (!activeThread) {
    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <MessageCircle className="w-7 h-7 text-indigo-500" /> Messages
        </h2>
        {loadingConvos ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="bg-transparent outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 flex-1"
                />
              </div>
            </div>
            {filteredConvos.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <MessageCircle className="w-12 h-12 text-slate-200 dark:text-slate-700" />
                <p className="text-slate-400 font-medium">No conversations found</p>
              </div>
            ) : filteredConvos.map((convo, i) => {
              // Use real-time preview for Firebase threads, local for demo
              const preview = isDemo
                ? (localMsgs[convo.id]?.slice(-1)[0]?.text || convo.lastMsg || '')
                : (threadPreviews[convo.id]?.text || convo.lastMsg || 'Start a conversation');
              const previewTime = isDemo
                ? (localMsgs[convo.id]?.slice(-1)[0]?.createdAt)
                : (threadPreviews[convo.id]?.time);

              return (
                <button key={convo.id}
                  onClick={() => { setActiveThread(convo); setConversations(prev => prev.map(c => c.id===convo.id ? {...c,unread:0} : c)); }}
                  className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left min-h-[72px] ${i>0?'border-t border-slate-100 dark:border-slate-800':''}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg" style={{background:getColor(convo)}}>
                      {convo.otherName.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${convo.online?'bg-emerald-400':'bg-slate-300 dark:bg-slate-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{convo.otherName}</p>
                      <span className="text-[11px] text-slate-400 flex-shrink-0">{fmtTime(previewTime)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{preview}</p>
                      {(convo.unread||0)>0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{convo.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Chat window ───────────────────────────────────────────────────────────
  const convoColor = getColor(activeThread);
  return (
    <div className="animate-in fade-in duration-300 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm"
      style={{ height:'min(calc(100vh - 200px), 680px)', minHeight:'420px' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        <button onClick={() => { setActiveThread(null); setMessages([]); setIsTyping(false); }}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white" style={{background:convoColor}}>
            {activeThread.otherName.charAt(0).toUpperCase()}
          </div>
          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${activeThread.online?'bg-emerald-400':'bg-slate-300 dark:bg-slate-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{activeThread.otherName}</p>
          <p className={`text-xs font-medium ${activeThread.online?'text-emerald-500':'text-slate-400'}`}>
            {activeThread.online?'Online':'Offline'} · {role==='student'?'Teacher':'Student'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-slate-50/50 dark:bg-slate-950/20">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">No messages yet. Say hello! 👋</div>
        )}
        {grouped.map(group => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs text-slate-400 font-medium px-2">{group.date}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>
            {group.msgs.map(msg => {
              const isMe = msg.senderId === 'me' || msg.senderId === user.uid;
              return (
                <div key={msg.id} className={`flex gap-2 items-end mb-2 ${isMe?'flex-row-reverse':''}`}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0 mb-1" style={{background:convoColor}}>
                      {activeThread.otherName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`max-w-[72%] flex flex-col ${isMe?'items-end':'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe
                      ? 'bg-emerald-500 text-white rounded-br-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm border border-slate-100 dark:border-slate-700'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{fmtTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {isTyping && isDemo && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{background:convoColor}}>
              {activeThread.otherName.charAt(0)}
            </div>
            <div className="px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm border border-slate-100 dark:border-slate-700 flex gap-1 items-center">
              {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-3 flex flex-wrap gap-1 bg-white dark:bg-slate-900">
          {EMOJIS.map(e => (
            <button key={e} onClick={() => { setText(t=>t+e); setShowEmoji(false); inputRef.current?.focus(); }}
              className="text-xl p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >{e}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        <button onClick={() => setShowEmoji(v=>!v)}
          className={`p-2.5 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 ${showEmoji?'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600':'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Smile className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0">
          <Paperclip className="w-5 h-5" />
        </button>
        <textarea ref={inputRef} value={text} onChange={handleInput} onKeyDown={handleKey}
          placeholder="Type a message..." rows={1}
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/40 transition-all font-medium dark:text-white dark:placeholder-slate-500 resize-none text-sm"
          style={{maxHeight:'120px'}}
        />
        <button onClick={handleSend} disabled={sending || !text.trim()}
          className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shadow-md min-w-[44px] min-h-[44px] flex-shrink-0"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Chat;

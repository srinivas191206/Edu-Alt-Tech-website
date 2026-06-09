import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';

interface Message {
  id: string;
  sender: 'student' | 'teacher' | 'system';
  text: string;
  timestamp: number;
}

interface CourseChatProps {
  courseId: string;
  currentUser: FirebaseUser | null;
  mentorId: string;
  role: 'student' | 'teacher';
}

const CourseChat: React.FC<CourseChatProps> = ({ courseId, currentUser, mentorId, role }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: role,
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-slate-400 py-20 font-medium">
            {role === 'teacher' ? 'Students will appear here when they ask questions.' : 'Ask your mentor a question about this course.'}
          </p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === role ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'student' ? 'bg-blue-100 text-blue-600' : msg.sender === 'teacher' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {msg.sender === 'student' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${msg.sender === role ? 'bg-emerald-500 text-white rounded-tr-sm' : msg.sender === 'system' ? 'bg-slate-100 text-slate-500 text-sm italic' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseChat;

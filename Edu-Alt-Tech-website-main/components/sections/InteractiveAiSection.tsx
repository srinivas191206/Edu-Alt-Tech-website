import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Activity } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: "Hi! I'm your AI learning assistant. Ask me any question about your studies, career, or skills — I'm here to help!"
  }
];

const InteractiveAiSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(30);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || credits <= 0) return;

    setCredits(prev => prev - 1);

    const userMsg: Message = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const MODELS = [
        'google/gemma-4-31b-it:free',
        'deepseek/deepseek-v4-flash:free',
        'openai/gpt-oss-20b:free',
      ];

      const chatMessages = [
        {
          role: 'system',
          content: 'You are an AI learning assistant for Edu Alt Tech, an education platform. Help students with their questions about studies, career guidance, and skills development. Keep responses clear and concise (2-3 sentences max).'
        },
        ...messages.map(m => ({
          role: m.sender === 'ai' ? 'assistant' : 'user',
          content: m.text
        })),
        { role: 'user', content: inputValue }
      ];

      let data: any = null;
      let response: Response | null = null;

      for (const model of MODELS) {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Edu Alt Tech',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model, messages: chatMessages })
        });
        data = await response.json();
        if (response.ok) break;
      }

      if (!response!.ok) {
        throw new Error(data?.error?.message || `API Error: ${response!.status}`);
      }

      const aiText = data.choices?.[0]?.message?.content || "I couldn't process that properly. Could you try again?";

      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Error fetching AI response:', error);
      const isApiKeyIssue = error.message.includes('401') || error.message.includes('Unauthorized') || !import.meta.env.VITE_OPENROUTER_API_KEY;
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: isApiKeyIssue 
          ? "Authentication Error: The API key is missing or invalid. If you just added it to .env, please restart your dev server."
          : `Error: ${error.message || "I'm having trouble connecting right now."}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#020617] relative border-t border-slate-800/50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-emerald/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-neon-emerald font-bold tracking-widest uppercase text-xs mb-6 shadow-sm">
            <Activity className="w-4 h-4" />
            Live Demo • {credits} Credits
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-emerald to-neon-blue">AI Assistant</span>
          </h2>
          <p className="text-slate-400 font-light text-lg max-w-2xl mx-auto">
            Ask anything — your AI learning assistant is here to help.
          </p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel border border-slate-700/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.05)]"
        >
          <div className="h-[400px] md:h-[500px] overflow-y-auto p-6 md:p-8 flex flex-col gap-6 bg-slate-950/50">
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'ai' ? 'bg-slate-900 border border-neon-emerald/30 text-neon-emerald' : 'bg-gradient-to-br from-neon-blue to-neon-violet text-white'}`}>
                  {msg.sender === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-4 rounded-2xl ${msg.sender === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-sm'}`}>
                    <p className="leading-relaxed font-light">{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-neon-emerald/30 text-neon-emerald flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-slate-900 border border-slate-800 rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-emerald/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-neon-emerald/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-neon-emerald/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 bg-slate-900 border-t border-slate-800/80">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={credits > 0 ? "Ask your question..." : "Out of credits. Please upgrade."}
                disabled={credits <= 0}
                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-4 pl-6 pr-16 text-white placeholder-slate-500 focus:outline-none focus:border-neon-emerald/50 transition-colors font-light disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || credits <= 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-800 hover:bg-slate-700 text-neon-emerald rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-slate-800"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveAiSection;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Send, Bot, User, Sparkles, 
  Mic, Volume2, Loader2, MessageCircle, Heart
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playKorean = (text: string) => {
    const koreanText = text.match(/[\uAC00-\uD7AF]+/g)?.join(' ') || text;
    const utterance = new SpeechSynthesisUtterance(koreanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data, error } = await supabase.functions.invoke('korean-ai-chat', {
        body: { 
          message: userMessage.content,
          conversationHistory 
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isRTL 
          ? '😅 عذراً، حدث خطأ. حاول مرة أخرى!'
          : '😅 죄송합니다, 오류가 발생했습니다. 다시 시도해주세요!',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickMessages = isRTL ? [
    'مرحباً! كيف أقول "شكراً" بالكورية؟',
    'علمني جملة جديدة',
    'ما الفرق بين 은/는 و 이/가؟',
    'صحح جملتي: 저는 한국어 좋아해요'
  ] : [
    '안녕하세요! 새 단어 가르쳐주세요',
    '문법 질문이 있어요',
    '한국어로 대화 연습하고 싶어요',
    '발음이 어려워요'
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="font-medium">{isRTL ? 'العودة' : '돌아가기'}</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">{isRTL ? 'معلم الكورية الذكي' : '한국어 AI 선생님'}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isRTL ? 'متصل الآن' : '온라인'}
              </p>
            </div>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Welcome Message from Mohamed Amin */}
      {messages.length === 0 && (
        <div className="px-4 py-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl p-4 border border-rose-200/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-rose-600">
                {isRTL ? 'محمد أيمن يرحب بك' : 'Mohamed Ayman welcomes you'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'مرحباً! أنا سعيد بوجودك هنا. تحدث مع المعلم الذكي لتحسين لغتك الكورية!' 
                : '환영합니다! 여기 오셔서 기쁩니다. AI 선생님과 대화하며 한국어를 향상시키세요!'}
            </p>
          </motion.div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {isRTL ? 'مرحباً! 안녕하세요!' : '안녕하세요!'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {isRTL 
                ? 'أنا معلمك الذكي للغة الكورية. اسألني أي شيء وسأساعدك في التعلم والتصحيح!'
                : '저는 당신의 AI 한국어 선생님입니다. 무엇이든 물어보세요!'}
            </p>
            
            {/* Quick Messages */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setInput(msg)}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-sm hover:border-primary/50 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
                  : 'bg-gradient-to-br from-rose-500 to-pink-500'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                    : 'bg-card border border-border'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => playKorean(msg.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    {isRTL ? 'استمع للنطق' : '발음 듣기'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'المعلم يكتب...' : '선생님이 입력 중...'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="flex gap-2 items-center max-w-2xl mx-auto">
          <button className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isRTL ? 'اكتب رسالتك هنا...' : '메시지를 입력하세요...'}
              className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/50 outline-none"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Send, Bot, User, Loader2, Volume2, Mic, MicOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TOOLTIP_MESSAGES_AR = [
  '🎓 مساعدك الذكي جاهز! اسأل عن أي شيء',
  '🇰🇷 تعلم كلمة كورية جديدة الآن!',
  '💡 هل تحتاج مساعدة في القواعد الكورية؟',
  '📝 اسألني عن الحروف الكورية!',
  '🎮 جرب أن تسألني عن الثقافة الكورية!',
];

const TOOLTIP_MESSAGES_KO = [
  '🎓 AI 어시스턴트가 준비되었습니다!',
  '🇰🇷 새로운 한국어 단어를 배워보세요!',
  '💡 한국어 문법 도움이 필요하세요?',
  '📝 한글에 대해 물어보세요!',
  '🎮 한국 문화에 대해 물어보세요!',
];

const QUICK_MESSAGES_AR = [
  'كيف أقول مرحباً بالكورية؟',
  'علمني الأرقام الكورية',
  'ما الفرق بين 은/는 و 이/가؟',
  'أعطني جملة يومية مفيدة',
];

const QUICK_MESSAGES_KO = [
  '한국어 인사말을 알려주세요',
  '한국어 숫자를 가르쳐주세요',
  '은/는과 이/가의 차이가 뭐예요?',
  '유용한 일상 문장을 알려주세요',
];

const AIChatButton: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show tooltip every 5 minutes
  useEffect(() => {
    if (isOpen) return;
    const showTooltip = () => {
      setTooltipVisible(true);
      setTooltipIndex(prev => (prev + 1) % TOOLTIP_MESSAGES_AR.length);
      setTimeout(() => setTooltipVisible(false), 5000);
    };
    // Show first tooltip after 3 seconds
    const initialTimeout = setTimeout(showTooltip, 3000);
    const interval = setInterval(showTooltip, 5 * 60 * 1000);
    return () => { clearTimeout(initialTimeout); clearInterval(interval); };
  }, [isOpen]);

  const playKorean = (text: string) => {
    const koreanText = text.match(/[\uAC00-\uD7AF]+/g)?.join(' ') || text;
    const utterance = new SpeechSynthesisUtterance(koreanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const { data, error } = await supabase.functions.invoke('korean-ai-chat', {
        body: { message: userMsg.content, conversationHistory }
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isRTL ? '😅 عذراً، حدث خطأ. حاول مرة أخرى!' : '😅 죄송합니다, 오류가 발생했습니다.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    if (isRecording) { setIsRecording(false); return; }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = isRTL ? 'ar-SA' : 'ko-KR';
    recognition.interimResults = false;
    setIsRecording(true);
    recognition.onresult = (event: any) => { setInput(prev => prev + event.results[0][0].transcript); setIsRecording(false); };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const quickMessages = isRTL ? QUICK_MESSAGES_AR : QUICK_MESSAGES_KO;
  const tooltipMessages = isRTL ? TOOLTIP_MESSAGES_AR : TOOLTIP_MESSAGES_KO;

  return (
    <>
      {/* Tooltip Bubble */}
      <AnimatePresence>
        {tooltipVisible && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`fixed bottom-[7.5rem] md:bottom-[5.5rem] z-40 ${isRTL ? 'left-4 right-auto' : 'right-4 left-auto'} max-w-[250px]`}
          >
            <div className="bg-card border border-border rounded-2xl p-3 shadow-xl text-sm text-foreground relative">
              <button onClick={() => setTooltipVisible(false)} className="absolute top-1 right-1 p-1 rounded-full hover:bg-muted">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
              <p className="pr-4">{tooltipMessages[tooltipIndex]}</p>
              {/* Arrow */}
              <div className={`absolute -bottom-2 ${isRTL ? 'left-6' : 'right-6'} w-4 h-4 bg-card border-r border-b border-border rotate-45`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button - Cute Character */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); setTooltipVisible(false); }}
        className="fixed bottom-28 md:bottom-6 right-4 z-40 group"
      >
        <motion.div
          className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-primary via-[hsl(270,60%,55%)] to-secondary blur-md opacity-40 group-hover:opacity-70 transition-opacity"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] flex items-center justify-center shadow-xl overflow-hidden">
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl leading-none">🤖</span>
            </div>
          )}
        </div>
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-[hsl(155,60%,45%)] rounded-full border-2 border-card flex items-center justify-center"
          >
            <span className="text-[8px] text-white font-bold">AI</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-36 md:bottom-24 right-4 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-to-r from-primary/5 to-[hsl(270,60%,55%)]/5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[hsl(270,60%,55%)] flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{isRTL ? 'المساعد الذكي' : 'AI 어시스턴트'}</h3>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(155,60%,45%)] animate-pulse" />
                    {isRTL ? 'متصل الآن' : '온라인'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setIsOpen(false); navigate('/ai-chat'); }}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-muted-foreground" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[50vh]">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">🤖</div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {isRTL ? 'مرحباً! أنا مساعدك الذكي 👋' : '안녕하세요! AI 어시스턴트입니다 👋'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {isRTL ? 'اسألني عن أي شيء يتعلق بالكورية' : '한국어에 대해 무엇이든 물어보세요'}
                  </p>
                  
                  {/* Quick Messages */}
                  <div className="space-y-2">
                    {quickMessages.map((msg, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        onClick={() => sendMessage(msg)}
                        className="w-full text-start px-3 py-2 rounded-xl bg-primary/5 border border-primary/10 text-xs text-foreground hover:bg-primary/10 transition-colors"
                      >
                        {msg}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-[hsl(270,60%,55%)]'
                      : 'bg-gradient-to-br from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)]'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <span className="text-sm">🤖</span>}
                  </div>
                  <div className="max-w-[80%]">
                    <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-[hsl(270,60%,55%)] text-white'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'assistant' && (
                      <button onClick={() => playKorean(msg.content)} className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary">
                        <Volume2 className="w-2.5 h-2.5" />
                        {isRTL ? 'استمع' : '듣기'}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-[hsl(270,60%,55%)] flex items-center justify-center">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="bg-muted rounded-2xl px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2 border-t border-border">
              <div className="flex gap-2 items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-xl transition-colors ${isRecording ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </motion.button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isRTL ? 'اكتب رسالتك...' : '메시지 입력...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-muted border-none text-sm focus:ring-2 focus:ring-primary/50 outline-none text-foreground"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl bg-gradient-to-r from-primary to-[hsl(270,60%,55%)] text-primary-foreground disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatButton;

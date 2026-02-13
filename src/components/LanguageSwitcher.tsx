import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'ar' ? 'ko' : 'ar')}
      className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-300/30 hover:border-blue-400/60 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 group shadow-sm hover:shadow-md"
      title={language === 'ar' ? 'تبديل اللغة' : '언어 전환'}
    >
      <Globe className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
    </button>
  );
};

export default LanguageSwitcher;

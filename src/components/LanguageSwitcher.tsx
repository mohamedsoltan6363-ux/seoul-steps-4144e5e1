import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'ar' ? 'ko' : 'ar')}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 group"
    >
      <Globe className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="font-semibold text-sm">
        {language === 'ar' ? (
          <span className="font-korean">한국어</span>
        ) : (
          <span>العربية</span>
        )}
      </span>
    </button>
  );
};

export default LanguageSwitcher;

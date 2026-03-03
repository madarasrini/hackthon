import React, { useState, useEffect } from 'react';
import { useLanguage, languages } from '@/context/LanguageContext';
import { Globe, BookOpen, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSelector() {
  const { language, setLanguage, simplify, setSimplify } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-medium text-slate-300 uppercase">{language}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 flex flex-col gap-4"
          >
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Language</h4>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between ${
                      language === lang.code 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {lang.name}
                    {language === lang.code && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Accessibility</h4>
              <button
                onClick={() => setSimplify(!simplify)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between ${
                  simplify
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Simplify Content</span>
                </div>
                {simplify && <Check className="w-3 h-3" />}
              </button>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                Automatically simplifies complex terms for easier understanding. Ideal for beginners.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

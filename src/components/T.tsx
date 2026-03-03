import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TProps {
  children: string;
}

export function T({ children }: TProps) {
  const { localize, language, simplify } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    let isMounted = true;
    const translate = async () => {
      if (!children) return;
      const result = await localize(children);
      if (isMounted) {
        setTranslatedText(result);
      }
    };
    translate();
    return () => {
      isMounted = false;
    };
  }, [children, localize, language, simplify]);

  return <>{translatedText}</>;
}

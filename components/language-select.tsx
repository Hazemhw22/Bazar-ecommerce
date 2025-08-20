"use client";

import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

const languages = [
  { code: "ar", label: "العربية", flag: "https://flagcdn.com/w40/ae.png" },
  { code: "he", label: "עברית", flag: "https://flagcdn.com/w40/il.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/us.png" },
]

export function LanguageSelector() {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  // استخدم useState/useEffect لجلب اللغة من localStorage فقط على العميل
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const lang = localStorage.getItem('lang');
    if (lang && lang !== currentLang) {
      setCurrentLang(lang);
    }
  }, []);

  const currentLangData = languages.find((l) => l.code === currentLang) || languages[2];

  const changeLanguage = (lng: string) => {
    localStorage.setItem("lang", lng);
    // استخراج المسار الحالي بدون البادئة
    const path = window.location.pathname;
    const segments = path.split('/');
    // إذا كان أول جزء هو رمز لغة، أزله
    const supportedLangs = ['ar', 'en', 'he'];
    if (supportedLangs.includes(segments[1])) {
      segments.splice(1, 1);
    }
    // إعادة بناء المسار مع اللغة الجديدة
    const newPath = '/' + lng + segments.join('/') + window.location.search;
    router.push(newPath);
    setCurrentLang(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Image
            src={currentLangData.flag}
            alt={currentLangData.label}
            width={24}
            height={24}
            className="w-5 h-5 rounded-full"
            unoptimized // إذا لم تضبط next.config.js للسماح بالدومينات الخارجية
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <Image
              src={lang.flag}
              alt={lang.label}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full"
              unoptimized
            />
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

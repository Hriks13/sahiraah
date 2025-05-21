
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  // 22 Official Indian Languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'ur', name: 'اردو (Urdu)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'as', name: 'অসমীয়া (Assamese)' },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'ks', name: 'कॉशुर (Kashmiri)' },
    { code: 'sd', name: 'سنڌي (Sindhi)' },
    { code: 'sa', name: 'संस्कृतम् (Sanskrit)' },
    { code: 'ne', name: 'नेपाली (Nepali)' },
    { code: 'doi', name: 'डोगरी (Dogri)' },
    { code: 'kok', name: 'कोंकणी (Konkani)' },
    { code: 'mai', name: 'मैथिली (Maithili)' },
    { code: 'bho', name: 'भोजपुरी (Bhojpuri)' },
    { code: 'snt', name: 'संथाली (Santhali)' },
  ];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;

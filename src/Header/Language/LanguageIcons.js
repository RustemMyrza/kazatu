import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageIcons = ({ languages }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      setSelectedLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang); // ✅ Сохраняем язык в localStorage
    setSelectedLanguage(lang);
  };

  return (
    <div className="language-icons">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-icon ${selectedLanguage === lang.code ? "active" : ""}`}
          onClick={() => handleLanguageChange(lang.code)}
        >
          <img src={lang.icon} alt={lang.name} width="24" height="24" />
        </button>
      ))}
    </div>
  );
};

export default LanguageIcons;

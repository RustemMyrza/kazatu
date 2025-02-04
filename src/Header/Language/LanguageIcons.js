import React from 'react';
import { useTranslation } from "react-i18next";

const LanguageIcons = ({ languages, selectedLanguage, onLanguageSelect }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  }
  
  return (
    <div className="language-icons">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-icon ${selectedLanguage === lang.code ? 'active' : ''}`}
          onClick={() => {
            onLanguageSelect(lang.code);
            handleLanguageChange(lang.code);
          }}
        >
          <img
            src={lang.icon}
            alt={lang.name}
            width="24"
            height="24"
          />
        </button>
      ))}
    </div>
  );
};

export default LanguageIcons;

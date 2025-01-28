import React from 'react';

const LanguageIcons = ({ languages, selectedLanguage, onLanguageSelect }) => {
  return (
    <div className="language-icons">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-icon ${selectedLanguage === lang.code ? 'active' : ''}`}
          onClick={() => onLanguageSelect(lang.code)}
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

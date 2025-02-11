import React from 'react';
import Header from '../Header/Header.js';
import MainContent from '../Main/MainContent.js';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"; // 🚀 Подключаем автоопределение языка

import translationEN from "../locales/en/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationKZ from "../locales/kz/translation.json";

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  kz: { translation: translationKZ },
};

i18n
  .use(LanguageDetector) // ✅ Добавляем автоопределение языка
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru", // 🚀 Если язык не найден, подставляем русский
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"], // ✅ Берем язык из localStorage, если нет — из браузера
      caches: ["localStorage"], // ✅ Сохраняем выбранный язык в localStorage
    },
  });

function Home() {
    return (
        <div className='home okok'>
            <Header/>
            <hr/>
            <MainContent/>
        </div>
    )
}

export default Home;
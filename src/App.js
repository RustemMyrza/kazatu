import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import './App.css';
import './Header/Header.js';
import translationEN from "./locales/en/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationKZ from "./locales/kz/translation.json";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  kz: {
    translation: translationKZ,
  },
};

i18n
  .use(LanguageDetector) // Подключаем автоопределение языка
  .use(initReactI18next) // Инициализируем react-i18next
  .init({
    resources,
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // Откуда определять язык
      caches: ["localStorage", "cookie"], // Где сохранять
    },
  });

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="/service/:parentId" element={<Home/>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

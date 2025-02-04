import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import './App.css';
import './Header/Header.js';
import Header from './Header/Header.js';
import MainContent from './Main/MainContent.js';
import translationEN from "./locales/en/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationKZ from "./locales/kz/translation.json";

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

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

function App() {
  return (
    <div className="App">
      <Header/>
      <hr></hr>
      <MainContent/>
    </div>
  );
}

export default App;

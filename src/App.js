import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import './App.css';
import './Header/Header.js';
import translationEN from "./locales/en/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationKZ from "./locales/kz/translation.json";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetDataPage from './pages/GetDataPage.js';
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
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="get-data" element={<GetDataPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

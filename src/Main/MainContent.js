import React from 'react';
import ServiceType from './ServiceType.js';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "../locales/en/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationKZ from "../locales/kz/translation.json";

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

function MainContent() {
    const { t } = useTranslation();
    return (
        <div className='main'>
            <main>
                <img src='https://img.icons8.com/?size=100&id=43408&format=png&color=000000' alt='image1'></img>
                <h2>{t("mainTitleInstruction")}</h2>
                <div className='service-types-list'>
                  <ServiceType iconClass="fas fa-check" serviceText="ЭЙОУ" />
                  <ServiceType iconClass="fas fa-check" serviceText="ЭЙОУ2" />
                  <ServiceType iconClass="fas fa-check" serviceText="ЭЙОУ3" />
                  <ServiceType iconClass="fas fa-check" serviceText="ЭЙОУ4" />
                </div>
            </main>
        </div>
    )
}


export default MainContent;
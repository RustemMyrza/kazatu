import React, { useState, useEffect } from 'react';
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
    const [services, setServices] = useState([]); // Состояние для хранения данных
    const [loading, setLoading] = useState(true); // Состояние для индикатора загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок
    
    useEffect(() => {
      fetch('http://localhost:3001/api/web-service/list')
        .then(response => response.json())
        .then(data => {
          console.log('data:', data);
          setServices(data); // Сохраняем данные в состоянии
          setLoading(false); // Загрузка завершена
        })
        .catch(err => {
          setError('Ошибка загрузки данных');
          setLoading(false); // Завершаем загрузку в случае ошибки
        });
    }, []);

    if (loading) {
      return <div>Загрузка...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }

    const serviceListStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }

    return (
        <div className='main'>
            <main>
                <img src='https://img.icons8.com/?size=100&id=43408&format=png&color=000000' alt='image1'></img>
                <h2>{t("mainTitleInstruction")}</h2>
                <div className='service-types-list' style={serviceListStyle}>
                {services.map((service) => (
                  <ServiceType
                    iconClass="fas fa-check" // Здесь можно динамически задавать иконку
                    serviceText={service.name_ru}
                    queueId={service.queueId} // Данные с API
                    parentId={service.parentId}
                  />
                ))}
                </div>
            </main>
        </div>
    )
}


export default MainContent;
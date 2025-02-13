import React, { useState, useEffect } from 'react';
import ServiceType from './ServiceType.js';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "../locales/en/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationKZ from "../locales/kz/translation.json";
import { useParams, useNavigate } from "react-router";
import './button.css';
import './MainContent.css';
import TicketForm from './GetTicketForm/TicketForm.js';


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

  function getParentName(serviceTree, serviceParentId, propertyId, lang = 'ru') {
    for (const service of serviceTree) {
      // eslint-disable-next-line eqeqeq
      if (service[propertyId] == Number(serviceParentId)) {  // ✅ Доступ через []
        // eslint-disable-next-line default-case
        switch (lang) {
          case 'ru':
            return service.name_ru;
          case 'kz':
            return service.name_kz;
        }
      }
  
      if (service.children.length > 0) {
        const result = getParentName(service.children, serviceParentId, propertyId, lang);
        if (result) return result; // Прерываем выполнение, если нашли нужное значение
      }
    }
  
    return null; // Если не найдено, возвращаем null
  }
  
  

function MainContent() {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]); // Состояние для хранения данных
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true); // Состояние для индикатора загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок
    const { branchId, serviceParentId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [visibleServices, setVisibleServices] = useState(services);
    let serviceName = null;
    let branchName = null;

    if (serviceParentId !== 2002) {
      serviceName = getParentName(services, serviceParentId, 'queueId', i18n.language);
    }

    if (branchId) {
      branchName = getParentName(branches, branchId, 'branchId', i18n.language);
    }

    useEffect(() => {
      fetch('http://localhost:3001/api/web-service/list')
        .then(response => response.json())
        .then(data => {
          setServices(data); // Сохраняем данные в состоянии
          setLoading(false); // Загрузка завершена
        })
        .catch(err => {
          setError(`Ошибка загрузки данных: ${err}`);
          setLoading(false); // Завершаем загрузку в случае ошибки
        });
    }, []);

    useEffect(() => {
      fetch('http://localhost:3001/api/branch/list')
        .then(response => response.json())
        .then(data => {
          setBranches(data); // Сохраняем данные в состоянии
          setLoading(false); // Загрузка завершена
        })
        .catch(err => {
          setError(`Ошибка загрузки данных: ${err}`);
          setLoading(false); // Завершаем загрузку в случае ошибки
        });
    }, []);

    useEffect(() => {
      setForm(null);
      setVisibleServices([]);
    
      if (!services.length) return;
    
      // Рекурсивно ищем элемент в дереве
      const findById = (nodes, id) => {
        for (const node of nodes) {
          if (node.queueId === id) return node;
          if (node.children.length > 0) {
            const found = findById(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };
    
      const parentService = findById(services, Number(serviceParentId));
      if (parentService) {
        if (!parentService.children || parentService.children.length === 0) {
          setForm(<TicketForm 
            queueId={serviceParentId}
            branchId={branchId}
            local={localStorage.getItem('i18nextLng')}
          />);
        } else {
          setVisibleServices(parentService.children);
        }
      } else if (serviceParentId === undefined) {
        setVisibleServices(services);
      }
    }, [serviceParentId, services, branchId]);
    

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
                <h2 className='main-title'>{ serviceParentId !== '2002' ? serviceName : t("mainTitleInstruction") }</h2>
                <h4 className='branch-title'>{ branchName ? branchName : 'Филиал не найден' }</h4>
                {serviceParentId !== '2002' && (
                  <button
                    onClick={() => navigate(-1)}
                    className="go-back">
                    <span>Назад</span>
                  </button>
                )}
                <div className='service-types-list' style={serviceListStyle}>
                { visibleServices.length > 0 ? visibleServices.map((service) => (
                  <ServiceType
                    serviceText={ i18n.language === 'ru' ? service.name_ru : service.name_kz}
                    queueId={service.queueId} // Данные с API
                    serviceParentId={service.parentId}
                    link={`/branch/${branchId}/service/${service.queueId}`}
                  />
                )) : form }
                </div>
            </main>
        </div>
    )
}


export default MainContent;
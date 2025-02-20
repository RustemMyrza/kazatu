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
import GetTicketRequest from './Ticket/RequestForGetTicket.js';
import Ticket from './Ticket/Ticket.js';


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

  function getParentName(serviceTree, serviceId, propertyId, lang = 'ru') {
    for (const service of serviceTree) {
      // eslint-disable-next-line eqeqeq
      if (service[propertyId] == Number(serviceId)) {  // ✅ Доступ через []
        // eslint-disable-next-line default-case
        switch (lang) {
          case 'ru':
            return service.name_ru;
          case 'kz':
            return service.name_kz;
        }
      }
  
      if (service.children.length > 0) {
        const result = getParentName(service.children, serviceId, propertyId, lang);
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
    const [ticketData, setTicketData] = useState(null);
    const { branchId, serviceId } = useParams();
    const navigate = useNavigate();
    const [visibleServices, setVisibleServices] = useState(services);
    const iin = localStorage.getItem('iin');
    const phoneNum = localStorage.getItem('phone');
    const lang = localStorage.getItem('i18nextLng');
    let serviceName = null;
    let branchName = null;

    if (serviceId !== 2002) {
      serviceName = getParentName(services, serviceId, 'queueId', i18n.language);
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
      setVisibleServices([]);
    
      if (!services.length) return;
    
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
    
      const parentService = findById(services, Number(serviceId));
      if (parentService) {
        if (!parentService.children || parentService.children.length === 0) {
          (async () => {
            const data = await GetTicketRequest({
              queueId: serviceId,
              iin,
              phoneNum,
              branchId,
              local: lang
            });
            console.log("Полученные данные:", data);
            setTicketData(data);
          })();
        } else {
          setVisibleServices(parentService.children);
        }
      } else if (serviceId === undefined) {
        setVisibleServices(services);
      }
    }, [serviceId, services, branchId, iin, lang, phoneNum, navigate]); // ✅ Добавляем navigate
    
    useEffect(() => {
      if (ticketData) {
        console.log("ticketData перед navigate:", ticketData);
        if (ticketData?.eventId) {
          navigate(`/branch/${branchId}/ticket/${ticketData.eventId}`, {
            state: ticketData
          });
        }
      }
    }, [ticketData, branchId, navigate]); // ✅ Ждем, пока ticketData загрузится
    
    

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
                <h2 className='main-title'>{ serviceId !== '2002' ? serviceName : t("mainTitleInstruction") }</h2>
                <h4 className='branch-title'>{ branchName ? branchName : 'Филиал не найден' }</h4>
                {serviceId !== '2002' && (
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
                    serviceId={service.parentId}
                    link={`/branch/${branchId}/service/${service.queueId}`}
                  />
                )) : 
                <Ticket
                ticketData={ticketData}
                /> }
                </div>
            </main>
        </div>
    )
}


export default MainContent;
import React, { useState, useEffect, useRef } from 'react';
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
    if (Array.isArray(serviceTree)) {
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
    } else {
      console.log(`serviceTree: ${JSON.stringify(serviceTree, null, 2)}`);
    }
  
    return null; // Если не найдено, возвращаем null
  }
  
  

function MainContent() {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]); // Состояние для хранения данных
    // const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true); // Состояние для индикатора загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок
    const [ticketData, setTicketData] = useState(null);
    const { branchId, serviceId } = useParams();
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const [visibleServices, setVisibleServices] = useState(services);
    const iin = localStorage.getItem('iin');
    const phoneNum = localStorage.getItem('phone');
    const lang = localStorage.getItem('i18nextLng');
    let serviceName = null;
    // let branchName = null;

    if (serviceId !== 1005) {
      serviceName = getParentName(services, serviceId, 'queueId', i18n.language);
    }

    // if (branchId) {
    //   branchName = getParentName(branches, branchId, 'branchId', i18n.language);
    // }

    useEffect(() => {
      fetch(`${process.env.REACT_APP_BACK_URL}/api/web-service/list?queueId=1005&branchId=${branchId}`)
        .then(response => {
          if (!response.ok) {
            // Если статус не 2xx, выбрасываем ошибку с текстом и статусом
            alert('Нет подходящих операторов');
            navigateRef.current(-1);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setServices(data); // Сохраняем данные в состоянии
          setLoading(false); // Загрузка завершена
        })
        .catch(err => {
          setError(`Ошибка загрузки данных: ${err}`);
          setLoading(false); // Завершаем загрузку в случае ошибки
        });
    }, [branchId]);

    useEffect(() => {
      fetch(`${process.env.REACT_APP_BACK_URL}/api/branch/list`)
        .then(response => response.json())
        .then(data => {
          // setBranches(data); // Сохраняем данные в состоянии
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
            try {
              const data = await GetTicketRequest({
                queueId: serviceId,
                iin,
                phoneNum,
                branchId,
                local: lang
              });
  
              if (!data || data.status === "false") { // Проверяем статус ответа
                throw new Error(data?.message || "Нет нужного оператора");
              }
  
              console.log("Полученные данные:", data);
              setTicketData(data);
            } catch (error) {
              console.error("Ошибка запроса:", error);
              alert(`Ошибка: ${error.message}`); // Выводим alert с ошибкой
              navigate(-1);
            }
          })();
        } else {
          setVisibleServices(parentService.children);
        }
      } else if (serviceId === undefined) {
        setVisibleServices(services);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceId, services, branchId, iin, lang, phoneNum]); // ✅ Добавляем navigate
    
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
            <h2 className='main-title'>{ serviceId !== '1005' ? serviceName : t("mainTitleInstruction") }</h2>
                {serviceId !== '1005' && (
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
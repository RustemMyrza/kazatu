import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header.js";
import Logo from "../Logo.js";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "../locales/en/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationKZ from "../locales/kz/translation.json";

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  kz: { translation: translationKZ },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

function MainLayout() {
  const { branchId } = useParams(); // Получаем branchId из URL
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketData = async () => {
      const ticketReceived = localStorage.getItem("ticketReceived");
      const eventId = localStorage.getItem("eventId");

      if (ticketReceived === 'true' && eventId !== null) {
        try {
          const ticketInfoResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/get-ticket-info?eventId=${eventId}&branchId=${branchId}`);
          const ticketInfoResult = await ticketInfoResponse.json();
          console.log('ticketInfoResult:', ticketInfoResult);
          if (ticketInfoResult.State === "NEW" || ticketInfoResult.State === "INSERVICE") {
            console.log("Данные загружены успешно, перенаправляем...");
            navigate(`ticket/${ticketInfoResult.EventId}`, {
              state: {
                eventId: ticketInfoResult.EventId,
                ticketNo: ticketInfoResult.TicketNo,
                startTime: ticketInfoResult.StartTime,
                serviceName: ticketInfoResult.ServiceName
              }
            });
          } else if (ticketInfoResult.State === "COMPLETED") {
            try {
              const redirectedTicketResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/get-redirected-ticket?eventId=${eventId}&branchId=${branchId}`);
              const redirectedTicketResult = await redirectedTicketResponse.json();
              console.log('redirectedTicketResult.success:', redirectedTicketResult.success);
              if (redirectedTicketResult.success !== 'false') {
                console.log('redirectedTicketResult success true');
                navigate(`ticket/${redirectedTicketResult.EventId}`, {
                  state: {
                    eventId: redirectedTicketResult.EventId,
                    ticketNo: redirectedTicketResult.TicketNo,
                    startTime: ticketInfoResult.StartTime,
                    serviceName: redirectedTicketResult.ServiceName
                  }
                });
              } else {
                console.log('redirectedTicketResult success false');
                navigate(`ticket/${ticketInfoResult.EventId}`, {
                  state: {
                    eventId: ticketInfoResult.EventId,
                    ticketNo: ticketInfoResult.TicketNo,
                    startTime: ticketInfoResult.StartTime,
                    serviceName: ticketInfoResult.ServiceName
                  }
                });
              }
            } catch (error) {
              console.error('Ошибка при попытке сделать запрос:', error);
            }
          }
        } catch (error) {
          console.error('Ошибка при попытке сделать запрос:', error);
        }
      } else {
        localStorage.setItem('ticketReceived', false);
      }
    };
    fetchTicketData();
  }, [branchId, navigate]);
  

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/branch/list`);
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Ошибка загрузки филиалов:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  // Функция поиска branchId в дереве
  const isBranchValid = useCallback((branchList, id) => {
    for (const branch of branchList) {
      if (branch.branchId === id) return true;
      if (branch.children?.length && isBranchValid(branch.children, id)) return true;
    }
    return false;
  }, []);
  
  useEffect(() => {
    if (!loading && branchId) {
      const branchExists = isBranchValid(branches, branchId);
      if (!branchExists) {
        alert("Такого филиала нету!");
        navigate("/"); // Перенаправляем на главную
      }
    }
  }, [loading, branchId, branches, navigate, isBranchValid]);

  if (loading) return <p>Загрузка филиалов...</p>;

  return (
    <div className="MainLayout">
      <Header />
      <hr />
      <Logo />
      <Outlet /> {/* Здесь меняется контент */}
    </div>
  );
}

export default MainLayout;

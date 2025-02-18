import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import LanguageDetector from "i18next-browser-languagedetector";
import QueueCount from './RealTimeData/RealTimeCount.js';
import TicketStatus from './RealTimeData/RealTimeStatus.js';
import { useParams } from "react-router";
import "./Ticket.css";


i18n
  .use(LanguageDetector) // Подключаем автоопределение языка
  .use(initReactI18next) // Инициализируем react-i18next
  .init({
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // Откуда определять язык
      caches: ["localStorage", "cookie"], // Где сохранять
    },
  });


function Ticket() {
    localStorage.setItem('ticketReceived', true);
    const { branchId } = useParams();
    const location = useLocation();
    console.log("location.state:", location.state); // 🔥 Проверяем, что приходит
    
    const ticketData = location.state || {};
    console.log("ticketData:", ticketData); // 🔥 Проверяем, не `undefined` ли он
    
    
    const { i18n } = useTranslation();

    return (
        <div className="ticket-container">
            <div className="ticket-card">
                <h2 className="ticket-title">
                    {i18n.language === "ru" ? "Ваш талон" : "Сіздің талоныңыз"}
                </h2>

                <div className="ticket-section">
                    <p className="ticket-number">
                        <TicketStatus branchId={branchId} ticketData={ticketData} />
                    </p>
                    <p className="ticket-label">
                        {i18n.language === "ru" ? "Статус талона" : "Талон мәртебесі"}
                    </p>
                </div>

                <div className="ticket-section">
                    <p className="ticket-number">
                        <QueueCount branchId={branchId} eventId={ticketData.eventId} />
                    </p>
                    <p className="ticket-label">
                        {i18n.language === "ru" ? "Перед вами" : "Сіздің алдыңызда"}
                    </p>
                </div>

                <div className="ticket-section">
                    <p className="ticket-number">{ticketData.ticketNo}</p>
                    <p className="ticket-label">
                        {i18n.language === "ru" ? "Номер" : "Нөмір"}
                    </p>
                </div>

                <div className="ticket-section">
                    <p className="ticket-service">{ticketData.serviceName}</p>
                    <p className="ticket-label">
                        {i18n.language === "ru" ? "Услуга" : "Қызмет"}
                    </p>
                </div>

                <div className="ticket-section">
                    <p className="ticket-time">
                        {new Date(parseInt(ticketData.startTime)).toLocaleTimeString()}
                    </p>
                    <p className="ticket-label">
                        {i18n.language === "ru" ? "Начало" : "Басталу"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Ticket;

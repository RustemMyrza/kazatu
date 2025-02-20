import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import checkRedirectedTicket from "./CheckRedirect"; // Импортируем функцию
import RedirectMessage from "./RedirectMessage";

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

const SSE_URL = "http://localhost:3001/api/get-ticket-status";

export default function RealTimeStatus({ branchId, ticketData }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRedirectMessage, setShowRedirectMessage] = useState(false); // Новое состояние
    const [redirectData, setRedirectData] = useState(null); // Данные для перенаправления
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true); // Устанавливаем загрузку при запуске

        const url = `${SSE_URL}?branchId=${branchId}&eventId=${ticketData.eventId}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = async (event) => {
            if (!event.data) return;

            try {
                const data = JSON.parse(event.data);
                if (!data || !data.action) return;

                if (data.action === 'COMPLETED') {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        const redirectedTicket = await checkRedirectedTicket(ticketData.eventId, branchId);
                        if (redirectedTicket) {
                            // Устанавливаем данные для перенаправления
                            setRedirectData({
                                eventId: redirectedTicket.EventId,
                                ticketNo: redirectedTicket.TicketNo,
                                startTime: redirectedTicket.StartTime,
                                serviceName: redirectedTicket.ServiceName,
                            });
                            // Показываем компонент RedirectMessage
                            setShowRedirectMessage(true);
                        } else {
                            localStorage.removeItem('iin');
                            localStorage.removeItem('phone');
                            localStorage.removeItem('ticketReceived');
                            localStorage.removeItem('ticketTimestamp');
                            navigate(`/branch/${branchId}`);
                        }
                    } catch (error) {
                        console.error('Ошибка при получении перенаправленного талона:', error);
                    }
                }

                setStatus(data.action);
                setLoading(false);
            } catch (error) {
                console.error("Ошибка парсинга SSE:", error);
            }
        };

        eventSource.onerror = (err) => {
            console.error("Ошибка SSE:", err);
            setLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, [branchId, ticketData, navigate]);

    // Если нужно показать RedirectMessage
    if (showRedirectMessage) {
        return (
            <RedirectMessage
                onRedirect={() => {
                        setShowRedirectMessage(false);
                        setRedirectData(null);
                        navigate(`/branch/${branchId}/ticket/${redirectData.eventId}`, {
                            state: redirectData,
                        })
                    }
                }
            />
        );
    }

    // Пока идет загрузка, показываем индикатор
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Если статус не определен, показываем сообщение
    if (!status) {
        return <div>Нет данных</div>;
    }

    // Условный рендеринг в зависимости от статуса
    return (
        <div>
            {status === "WAIT" && <h4>{i18n.language === "ru" ? '⌛ Ожидание' : '⌛ Күтіңіз'}</h4>}
            {status === "CALLING" && <h4>Вас вызывают</h4>}
            {status === "MISSED" && <h4>❌ Вы не прибыли на свое подходящее окно</h4>}
            {status === "RESCHEDULLED" && <h4>🔄 Перенесен на другое время</h4>}
            {status === "INSERVICE" && <h4>Обслуживается...</h4>}
            {status === "NEW" && <h4>🆕 Новый</h4>}
            {status === "INQUEUE" && <h4>🕒 В очереди</h4>}
            {status === "COMPLETED" && <h4>✅ Обслужено</h4>}
            {status === "DELAYED" && <h4>Отложено</h4>}
        </div>
    );
}
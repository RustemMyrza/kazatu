import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkRedirectedTicket from "./CheckRedirect"; // Импортируем функцию

const SSE_URL = "http://localhost:3001/api/get-ticket-status";

export default function RealTimeStatus({ branchId, ticketData }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    console.log('ticketData:', ticketData);
    useEffect(() => {
        setLoading(true); // Устанавливаем загрузку при запуске
    
        const url = `${SSE_URL}?branchId=${branchId}&eventId=${ticketData.eventId}`;
        const eventSource = new EventSource(url);
    
        eventSource.onmessage = async (event) => {  // Используем async, чтобы можно было использовать await
            if (!event.data) return;
    
            try {
                const data = JSON.parse(event.data);
                if (!data || !data.action) return;
    
                if (data.action === 'COMPLETED') {
                    try {
                        // Получаем результат асинхронной функции
                        const redirectedTicket = await checkRedirectedTicket(ticketData); // Заменяем на правильный импорт
                        if (redirectedTicket) {
                            navigate(`/branch/${branchId}/ticket/${redirectedTicket['$']['EventId']}`, {
                                eventId: redirectedTicket['$']['EventId'],
                                ticketNo: redirectedTicket['$']['TicketNo'],
                                startTime: redirectedTicket['$']['StartTime'],
                                serviceName: redirectedTicket['$']['ServiceName']
                            })
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
            {status === "WAIT" && <h4>⌛ Ожидание</h4>}
            {status === "CALLING" && <h4>Вас вызывают</h4>}
            {status === "MISSED" && <h4>❌ Вы не прибыли на свое подходящее окно</h4>}
            {status === "RESCHEDULLED" && <h4>🔄 Перенесен на другое время</h4>}
            {status === "INSERVICE" && <h4>Обслуживается...</h4>}
            {status === "NEW" && <h4>🆕 Новый</h4>}
            {status === "INQUEUE" && <h4>🕒 В очереди</h4>}
            {status === "COMPLETED" && <h4>✅ Обслужено</h4>}
        </div>
    );
}

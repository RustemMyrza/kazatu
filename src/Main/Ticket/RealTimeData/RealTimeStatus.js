import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SSE_URL = "http://localhost:3001/api/get-ticket-status";

export default function RealTimeStatus({ branchId, eventId }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const url = `${SSE_URL}?branchId=${branchId}&eventId=${eventId}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStatus(data.action);
            if (data.action === 'COMPLETED') {
                console.log('data.action:', data.action);
                // localStorage.removeItem('iin');
                // localStorage.removeItem('phone');
                // localStorage.removeItem('ticketReceived');
                // localStorage.removeItem('ticketTimestamp');
                // navigate(`/branch/${branchId}`);
            }
            setLoading(false);
        };

        eventSource.onerror = (err) => {
            console.error("Ошибка SSE:", err);
            setLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, [branchId, eventId, navigate]);

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

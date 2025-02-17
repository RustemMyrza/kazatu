import { useEffect, useState } from "react";

const SSE_URL = 'http://localhost:3001/api/get-count-queue-people';

export default function RealTimeCount({ branchId, eventId }) {
    const [count, setCount] = useState(-1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Формируем URL с параметрами branchId и eventId
        const url = `${SSE_URL}?branchId=${branchId}&eventId=${eventId}`;

        // Создаем объект EventSource для подключения к SSE
        const eventSource = new EventSource(url);

        // Обработчик события onmessage для получения данных от сервера
        eventSource.onmessage = (event) => {
            // Парсим данные и обновляем состояние count
            const data = JSON.parse(event.data);
            setCount(data.count);
            setLoading(false); // Данные получены, снимаем индикатор загрузки
        };

        // Обработчик ошибки (если нужно)
        eventSource.onerror = (err) => {
            console.error('Ошибка SSE:', err);
            setLoading(false); // В случае ошибки тоже снимаем индикатор
        };

        

        // Закрываем соединение при размонтировании компонента
        return () => {
            eventSource.close();
        };
    }, [branchId, eventId]);

    if (loading || count === -1) {
        return (
            <div>
                Загрузка...
            </div>
        );
    }

    return (
        <div>
            <h4> {count} </h4>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScoreboardRow from "./ScoreboardRow";
import "./Scoreboard.css";

const SSE_URL = `${process.env.REACT_APP_BACK_URL}/api/get-video-server-data`;

const Scoreboard = ({ currentTicketNum }) => {
    const { branchId } = useParams();
    const [queue, setQueue] = useState([]);
    console.log('ticketNum:', currentTicketNum);
    useEffect(() => {
        const eventSource = new EventSource(`${SSE_URL}?branchId=${branchId}`);
        eventSource.onmessage = async (event) => {
            if (!event.data) return;
            try {
                const parsedData = JSON.parse(event.data);

                // Убедимся, что parsedData - это массив
                if (Array.isArray(parsedData)) {
                    // Фильтруем новые билеты, чтобы добавить только уникальные
                    setQueue((prevQueue) => {
                        const newQueue = [...prevQueue];

                        // Для каждого билета из parsedData проверяем, нет ли его уже в prevQueue
                        parsedData.forEach((ticket) => {
                            if (!newQueue.some(existingTicket => existingTicket.ticketNum === ticket.ticketNum)) {
                                newQueue.unshift(ticket); // Добавляем в начало списка
                            }
                        });

                        return newQueue;
                    });
                } else {
                    console.log('Неверный формат данных', typeof parsedData);
                }
            } catch (error) {
                console.error('Ошибка при обработке данных видеосервера:', error);
            }
        };

        // Очистка соединения при размонтировании компонента
        return () => {
            eventSource.close();
        };
    }, [branchId]);

    return (
        <div className="queue-board">
            <div className="queue-header">
                <span>ТАЛОН №</span>
                <span>ОКНО</span>
            </div>
            {queue.slice(-5).map((ticket, index) => (
                <ScoreboardRow
                    key={ticket.ticketNum}
                    ticketNumber={ticket.ticketNum}
                    windowNumber={ticket.window}
                    isActive={ticket.ticketNum === currentTicketNum && "active"}
                />
            ))}
        </div>
    );
};



export default Scoreboard;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScoreboardRow from "./ScoreboardRow";
import { useTranslation } from "react-i18next";
import "./Scoreboard.css";

const SSE_URL = `${process.env.REACT_APP_BACK_URL}/api/get-video-server-data`;

const Scoreboard = ({ currentTicketNum }) => {
    const { branchId } = useParams();
    const [queue, setQueue] = useState([]);
    const { i18n } = useTranslation();
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
                    setQueue(parsedData);
                } else {
                    console.log('Неверный формат данных', typeof parsedData);
                }
            } catch (error) {
                console.error('Ошибка при обработке данных видеосервера:', error);
            }
        };
        console.log('queue:', queue);
        // Очистка соединения при размонтировании компонента
        return () => {
            eventSource.close();
        };
    }, [branchId, queue]);

    return (
        <div className="queue-board">
            <div className="queue-header">
                <span>{i18n.language === "ru" ? "ТАЛОН" : "ТАЛОН"}</span>
                <span>{i18n.language === "ru" ? "ОКНО" : "ТЕРЕЗЕ"}</span>
            </div>
            {queue.slice(0, 5).map((ticket, index) => (
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
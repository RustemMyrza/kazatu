import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import checkRedirectedTicket from "./RealTimeData/CheckRedirect.js";
import RedirectMessage from "./RealTimeData/RedirectMessage.js";
import QueueCount from './RealTimeData/RealTimeCount.js';
import RealTimeStatus from './RealTimeData/RealTimeStatus.js';
import Scoreboard from "./RealTimeData/Scoreboard.js";
import ServiceRating from './ServiceRating.js';
import "./Ticket.css";


const SSE_URL = `${process.env.REACT_APP_BACK_URL}/api/get-ticket-status`;
const queueData = [
    { ticketNumber: 388, windowNumber: 2 },
    { ticketNumber: 387, windowNumber: 1 },
    { ticketNumber: 386, windowNumber: 2 },
    { ticketNumber: 385, windowNumber: 2 },
    { ticketNumber: 696, windowNumber: 2 },
];

function Ticket({propTicketData}) {
    const { branchId } = useParams();
    const location = useLocation();
    const ticketData = useMemo(() => location.state || {}, [location.state]);
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [status, setStatus] = useState(null);
    const [redirectData, setRedirectData] = useState(null);

    useEffect(() => {
        const eventSource = new EventSource(`${SSE_URL}?branchId=${branchId}&eventId=${ticketData.eventId}`);

        eventSource.onmessage = async (event) => {
            if (!event.data) return;
            try {
                localStorage.setItem('ticketReceived', true);
                localStorage.setItem('eventId', ticketData.eventId);
                const data = JSON.parse(event.data);
                console.log('data:', data);
                if (!data?.action) return;
                setStatus(data.action);

                if (data.action === "COMPLETED") {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    const redirectedTicket = await checkRedirectedTicket(ticketData.eventId, branchId);
                    if (redirectedTicket) {
                        setRedirectData({
                            eventId: redirectedTicket.EventId,
                            ticketNo: redirectedTicket.TicketNo,
                            startTime: redirectedTicket.StartTime,
                            serviceName: redirectedTicket.ServiceName,
                        });
                    } else {
                        eventSource.close();
                    }
                } else if (data.action === "MISSED") {
                    eventSource.close();
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    ["iin", "phone", "ticketReceived", "ticketTimestamp", 'eventId'].forEach(item => localStorage.removeItem(item));
                    navigate(`/branch/${branchId}`);
                }
            } catch (error) {
                console.error("Ошибка парсинга SSE:", error);
            }
        };

        eventSource.onerror = (err) => {
            console.error("Ошибка SSE:", err);
            eventSource.close();
        };

        return () => eventSource.close();
    }, [branchId, i18n.language, navigate, ticketData]);

    if (redirectData) {
        return <RedirectMessage onRedirect={() => {
            setRedirectData(null)
            navigate(`/branch/${branchId}/ticket/${redirectData.eventId}`, { state: redirectData })}
        } />;
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "white", flexDirection: "column", padding: "30px 0px 50px 0px" }}>
            <div className="ticket-container">
                <div className="ticket-card">
                    <h2 className="ticket-title">
                        {i18n.language === "ru" ? "Ваш талон" : "Сіздің талоныңыз"}
                    </h2>

                    <div className="ticket-section">
                        <p className="ticket-number">
                            <RealTimeStatus branchId={branchId} ticketData={ticketData} status={status} />
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

            {status === 'COMPLETED' ? (
                <ServiceRating
                eventId={ticketData.eventId}
                branchId={branchId}
                />
            ) : (
                <Scoreboard queueData={queueData} />
            )}
        </div>
    );
}

export default Ticket;

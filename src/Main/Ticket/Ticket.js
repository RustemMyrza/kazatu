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

function Ticket({propTicketData}) {
    const { branchId } = useParams();
    const location = useLocation();
    const ticketData = useMemo(() => location.state || {}, [location.state]);
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [status, setStatus] = useState(null);
    const [windowNum, setWindowNum] = useState('');
    const [redirectData, setRedirectData] = useState(null);
    const [isCheckingRedirect, setIsCheckingRedirect] = useState(false);
    const iin = localStorage.getItem("iin");

    useEffect(() => {
    const eventSource = new EventSource(`${SSE_URL}?branchId=${branchId}&eventId=${ticketData.eventId}`);

    const removeFromQueue = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACK_URL}/api/remove-ticket-queue?branchId=${branchId}&eventId=${ticketData.eventId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            console.log('Удалено из Redis:', data);
        } catch (err) {
            console.error('Ошибка при удалении из Redis:', err);
        }
    };

    eventSource.onmessage = async (event) => {
    if (!event.data) return;

    try {
        localStorage.setItem('ticketReceived', true);
        localStorage.setItem('eventId', ticketData.eventId);

        const data = JSON.parse(event.data);
        console.log('SSE data:', data);
        if (!data?.action) return;

        setStatus(data.action);

        if (data.action === "COMPLETED") {
            setIsCheckingRedirect(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 5000));
                const redirectedTicket = await checkRedirectedTicket(ticketData.eventId, branchId);
                console.log('Redirect check result:', redirectedTicket);
                
                if (redirectedTicket) {
                    setRedirectData({
                        eventId: redirectedTicket.EventId,
                        ticketNo: redirectedTicket.TicketNo,
                        startTime: redirectedTicket.StartTime,
                        serviceName: redirectedTicket.ServiceName,
                    });
                } else {
                    setRedirectData(null); // Явно устанавливаем null
                    eventSource.close();
                    await removeFromQueue();
                }
            } catch (error) {
                console.error('Error checking redirect:', error);
                setRedirectData(null);
            } finally {
                setIsCheckingRedirect(false); // Всегда сбрасываем флаг проверки
            }
        } else if (data.action === "MISSED") {
                eventSource.close();
                await removeFromQueue();
                await new Promise(resolve => setTimeout(resolve, 3000));
                ["iin", "phone", "ticketReceived", "ticketTimestamp", 'eventId'].forEach(item => localStorage.removeItem(item));
                navigate(`/branch/${branchId}`);
            } else if (data.action === "CALLING") {
                if (data.windowNum) {
                    setWindowNum(data.windowNum);
                }
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

    const handleCancelEvent = async (branchId, iin) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACK_URL}/api/cancel-event?branchId=${branchId}&iin=${iin}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Ошибка при отмене события');
            }

            console.log('Событие успешно отменено');
            // здесь можешь вызвать setStatus или обновить данные
        } catch (error) {
            console.error('Ошибка при отправке DELETE-запроса:', error);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div className="ticket-container">
                <div className="ticket-card">
                    <h2 className="ticket-title">
                        {i18n.language === "ru" ? "Ваш талон" : "Сіздің талоныңыз"}
                    </h2>
    
                    <div className="ticket-content">
                        <p className="ticket-number">{ticketData.ticketNo}</p>
                        <p className="ticket-service">{ticketData.serviceName}</p>

                        {status === 'CALLING' ? (
                            <div className="blinking-status">
                                <span>
                                    {i18n.language === "ru" ? `Подойдите к ${windowNum} окну!` : `${windowNum} терезеге келіңіз!`}
                                </span>
                            </div>
                        ) : (
                            <div className="ticket-details">
                                <span>{i18n.language === "ru" ? "Статус" : "Мәртебе"}:</span>
                                <span>
                                    <RealTimeStatus branchId={branchId} ticketData={ticketData} status={status} />
                                </span>
                            </div>
                        )}

                        
                        <div className="ticket-details">
                            <span>{i18n.language === "ru" ? "Перед вами" : "Сіздің алдыңызда"}:</span>
                            <QueueCount branchId={branchId} eventId={ticketData.eventId} />
                        </div>

                        <div className="ticket-details">
                            <span>{i18n.language === "ru" ? "Начало" : "Басталу"}:</span>
                            <span>
                                {(() => {
                                    const date = new Date(parseInt(ticketData.startTime));
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы с 0
                                    const year = date.getFullYear();
                                    const hours = String(date.getHours()).padStart(2, '0');
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    return `${day}.${month}.${year} ${hours}:${minutes}`;
                                })()}
                            </span>
                        </div>
                    </div>
                    {status === 'INQUEUE' && (
                        <div className="bottom-content">
                            <div className="cancel-button">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => handleCancelEvent(branchId, iin)}
                                >
                                    {i18n.language === "ru" ? "Отказаться от очереди" : "Кезектен бас тарту"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    
            {status === 'COMPLETED' && redirectData === null && !isCheckingRedirect ? (
                <ServiceRating eventId={ticketData.eventId} branchId={branchId} />
            ) : (
                <Scoreboard currentTicketNum={ticketData.ticketNo} />
            )}
        </div>
    );
    
}

export default Ticket;

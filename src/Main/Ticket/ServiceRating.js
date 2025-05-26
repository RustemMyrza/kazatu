import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import "./ServiceRating.css";

function ServiceRating({ eventId, branchId }) {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [selectedRating, setSelectedRating] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const ratings = [
        { value: 1, label: i18n.language === "ru" ? "Плохо" : "Нашар", color: "red" },
        { value: 2, label: i18n.language === "ru" ? "Нормально" : "Жақсы", color: "orange" },
        { value: 3, label: i18n.language === "ru" ? "Отлично" : "Тамаша", color: "green" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedRating === null) return;

        const data = { rating: selectedRating, eventId: eventId };

        try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/service-rate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            // eslint-disable-next-line eqeqeq
            if (result.message.trim() == 'Ok') {
                setResponseMessage(i18n.language === "ru" ? 'Ваша оценка успешно отправлена' : "Сіздің бағаңыз сәтті жіберілді.");
                setSelectedRating(null);
                ["iin", "phone", "ticketReceived", "ticketTimestamp", 'eventId'].forEach(item => localStorage.removeItem(item));
                await new Promise(resolve => setTimeout(resolve, 3000));
                navigate(`/branch/${branchId}`);
            } else {
                setResponseMessage(i18n.language === "ru" ? 'Произошла ошибка попробуйте еще раз' : "Ошибка, қайта қайталап көріңіз.");
            }
        } else {
            setResponseMessage("Ошибка при отправке");
        }
        } catch (error) {
        setResponseMessage("Ошибка соединения");
        console.error("Ошибка при отправке:", error);
        }
    };

    return (
        <form className="rating-container" onSubmit={handleSubmit}>
        <h3 className="rating-title">{i18n.language === "ru" ? "Оцените обслуживание" : "Қызметке баға беріңіз"}</h3>
        <div className="rating-stars">
            {ratings.map((rating) => (
            <span
                key={rating.value}
                className={`star ${selectedRating >= rating.value ? "active" : ""}`}
                onClick={() => setSelectedRating(rating.value)}
            >
                ★
            </span>
            ))}
        </div>
        {selectedRating && (
            <p className="rating-label" style={{ color: ratings.find(r => r.value === selectedRating)?.color }}>
            {ratings.find(r => r.value === selectedRating)?.label}
            </p>
        )}
        <button type="submit" className="submit-button" disabled={selectedRating === null}>
            {i18n.language === "ru" ? "Отправить" : "Жіберу"}
        </button>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
        </form>
    );
}

export default ServiceRating;

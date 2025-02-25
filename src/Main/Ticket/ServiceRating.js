import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./ServiceRating.css";

const ratings = [
  { value: 1, label: "Плохо", color: "red" },
  { value: 2, label: "Нормально", color: "orange" },
  { value: 3, label: "Отлично", color: "green" },
];

function ServiceRating({ eventId, branchId }) {
    const navigate = useNavigate();
    const [selectedRating, setSelectedRating] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedRating === null) return;

        const data = { rating: selectedRating, eventId: eventId };

        try {
        const response = await fetch("http://localhost:3001/api/service-rate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            // eslint-disable-next-line eqeqeq
            if (result.message.trim() == 'Ok') {
                setResponseMessage('Ваша оценка успешно отправлена');
                setSelectedRating(null);
                ["iin", "phone", "ticketReceived", "ticketTimestamp", 'eventId'].forEach(item => localStorage.removeItem(item));
                await new Promise(resolve => setTimeout(resolve, 3000));
                navigate(`/branch/${branchId}`);
            } else {
                setResponseMessage('Произошла ошибка попробуйте еще раз');
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
        <h3 className="rating-title">Оцените обслуживание</h3>
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
            Отправить
        </button>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
        </form>
    );
}

export default ServiceRating;

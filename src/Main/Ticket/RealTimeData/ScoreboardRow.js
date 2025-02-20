import React from "react";
import "./Scoreboard.css"; // Подключаем стили

export default function ScoreboardRow({ ticketNumber, windowNumber, isActive }) {
    return (
        <div className={`queue-row ${isActive ? "active" : ""}`}>
            <span>{ticketNumber}</span>
            <span>→</span>
            <span>{windowNumber}</span>
        </div>
    );
}

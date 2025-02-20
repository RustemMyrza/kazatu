import React from "react";
import ScoreboardRow from "./ScoreboardRow";
import "./Scoreboard.css";

// Компонент табло
const Scoreboard = ({ queueData }) => {
  return (
    <div className="queue-board">
        <div className="queue-header">
            <span>ТАЛОН №</span>
            <span>ОКНО</span>
        </div>
        {queueData.map((ticket, index) => (
            <ScoreboardRow
                key={ticket.ticketNumber}
                ticketNumber={ticket.ticketNumber}
                windowNumber={ticket.windowNumber}
                isActive={index === 0} // Первый элемент активный (зелёный)
            />
        ))}
    </div>
);
};

export default Scoreboard;
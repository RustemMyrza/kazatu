import i18n from "i18next";
import { useState } from "react";
import "./TicketForm.css";

export default function Form({ queueId, branchId, local }) {
    const [iin, setIin] = useState("");
    async function Send(event) {
        event.preventDefault();
        try {
            const requestBody = JSON.stringify({
                iin: iin,
                queueId: queueId,
                branchId: branchId,
                local: local
            })
            console.log('requestBody:', requestBody);
            const response = await fetch("http://localhost:3001/api/request/get-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestBody
            });
            const data = await response.json();
            console.log("Ответ сервера:", data);
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    }

    return (
        <div className="ticket-form">
            <form onSubmit={ Send }>
                <input 
                    type="number"
                    name="iin"
                    value={ iin }
                    onChange={ (e) => setIin(e.target.value) }
                    placeholder={i18n.language === 'ru' ? 'Введите пожалуйста ваш ИИН' : 'ИИН тіркеңіз'} 
                />
                <button className="form-button" type="submit">Отправить</button>
            </form>
        </div>
    );
}

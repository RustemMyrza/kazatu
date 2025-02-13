import i18n from "i18next";
import "./TicketForm.css"; // Подключаем стили

export default function Form() {
    return (
        <div className="ticket-form">
            <form>
                <input 
                    type="number" 
                    placeholder={i18n.language === 'ru' ? 'Введите пожалуйста ваш ИИН' : 'ИИН тіркеңіз'} 
                />
                <button className="form-button" type="submit">Отправить</button>
            </form>
        </div>
    );
}

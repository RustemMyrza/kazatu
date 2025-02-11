import i18n from "i18next";

export default function Form () {
    return (
        <div className="ticket-form">
            <form>
                <input type="number" placeholder={ i18n.language === 'ru' ? 'Введите пожалуйста ваш ИИН' : 'ИИН тіркеңіз' }></input>
            </form>
        </div>
    )
}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Инициализация i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "cookie", "navigator"], caches: ["localStorage", "cookie"] },
  });

const statusMessages = {
    WAIT: i18n.language === "ru" ? "⌛ В расмотрений" : "⌛ Қаралымда",
    CALLING: i18n.language === "ru" ? "Вас вызывают" : "Сізді шақырып жатыр",
    MISSED: i18n.language === "ru" ? "❌ Вы не прибыли на свое подходящее окно" : "❌ Сіз өзіңіздің терезеңізге келмедіңіз",
    RESCHEDULLED: i18n.language === "ru" ? "🔄 Перенесен на другое время" : "🔄 Басқа уақытқа көшірілді",
    INSERVICE: i18n.language === "ru" ? "Обслуживается..." : "Қызмет көрсетілуде",
    NEW: i18n.language === "ru" ? "🆕 Новый" : "🆕 Жаңа",
    INQUEUE: i18n.language === "ru" ? "🕒 В очереди" : "🕒 Кезекте",
    COMPLETED: i18n.language === "ru" ? "✅ Обслужено" : "✅ Қызмет көрсетілді",
    DELAYED: i18n.language === "ru" ? "Отложено" : "Кейінге қалдырылды",
};
export default function RealTimeStatus({ status }) {
    return <h4>{statusMessages[status] || "Загрузка"}</h4>;
}

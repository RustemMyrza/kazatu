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
    WAIT: "⌛ В расмотрений",
    CALLING: "Вас вызывают",
    MISSED: "❌ Вы не прибыли на свое подходящее окно",
    RESCHEDULLED: "🔄 Перенесен на другое время",
    INSERVICE: "Обслуживается...",
    NEW: "🆕 Новый",
    INQUEUE: "🕒 В очереди",
    COMPLETED: "✅ Обслужено",
    DELAYED: "Отложено",
};
export default function RealTimeStatus({ status }) {
    return <h4>{statusMessages[status] || "Загрузка"}</h4>;
}

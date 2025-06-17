import { useTranslation } from "react-i18next";

export default function RealTimeStatus({ status }) {
  const { i18n } = useTranslation();

  const statusMessages = {
      WAIT: i18n.language === "ru" ? "⌛ В рассмотрении" : "⌛ Қаралымда",
      CALLING: i18n.language === "ru" ? "Вас вызывают" : "Сізді шақырып жатыр",
      MISSED: i18n.language === "ru" ? "❌ Вы не прибыли на свое подходящее окно" : "❌ Сіз өзіңіздің терезеңізге келмедіңіз",
      RESCHEDULLED: i18n.language === "ru" ? "🔄 Перенесен на другое время" : "🔄 Басқа уақытқа көшірілді",
      INSERVICE: i18n.language === "ru" ? "Обслуживается..." : "Қызмет көрсетілуде",
      NEW: i18n.language === "ru" ? "🆕 Новый" : "🆕 Жаңа",
      INQUEUE: i18n.language === "ru" ? "🕒 В очереди" : "🕒 Кезекте",
      COMPLETED: i18n.language === "ru" ? "✅ Обслужено" : "✅ Қызмет көрсетілді",
      DELAYED: i18n.language === "ru" ? "Отложено" : "Кейінге қалдырылды",
  };

  return <h4>{statusMessages[status] || "Загрузка"}</h4>;
}

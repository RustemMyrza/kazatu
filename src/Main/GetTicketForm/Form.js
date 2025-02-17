import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./TicketForm.css";

export default function Form() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [iin, setIin] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateIIN(iin)) {
      setError(t("error.iin"));
      return;
    }
    if (!validatePhone(phone)) {
      setError(t("error.phone"));
      return;
    }

    localStorage.setItem("iin", iin);
    localStorage.setItem("phone", phone);
    localStorage.setItem("ticketReceived", "false");
    localStorage.setItem("ticketTimestamp", Date.now());

    navigate("service/2002");
  };

  function validateIIN(iin) {
    return /^\d{12}$/.test(iin);
  }

  function validatePhone(phone) {
    return /^\+?\d{10,15}$/.test(phone);
  }

  return (
    <div className="ticket-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="iin"
          value={iin}
          onChange={(e) => {
            setIin(e.target.value);
            localStorage.setItem("iin", e.target.value);
          }}
          placeholder={t("form.iin_placeholder")}
        />
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            localStorage.setItem("phone", e.target.value);
          }}
          placeholder={t("form.phone_placeholder")}
        />
        {error && <p className="error">{error}</p>}
        <button className="form-button" type="submit">
          {t("form.continue")}
        </button>
      </form>
    </div>
  );
}

import QRCode from "react-qr-code";

export default function QRGenerator() {
  const qrValue = "https://google.com"; // Статичная ссылка

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <QRCode value={qrValue} size={256} />
      </div>
    </div>
  );
}

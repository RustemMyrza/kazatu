export default async function getTicket({ queueId, iin, phoneNum, branchId, local }) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/request/get-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queueId, iin, phoneNum, branchId, local }), // Упрощенная передача объекта
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Ошибка запроса:", error);
      return null; // Возвращаем null в случае ошибки
    }
  }
  
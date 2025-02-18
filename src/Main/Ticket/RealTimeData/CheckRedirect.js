const allTicket = async () => {
    const response = await fetch("http://localhost:3001/api/get-all-ticket");
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    return response.json();
};

const checkRedirectedTicket = async (oldTicketData) => {
    try {
        const allTickets = await allTicket();
        console.log("Полученные билеты:", allTickets);
        // Используем find, чтобы сразу вернуть первый подходящий билет
        const redirectedTicket = allTickets.find(ticket => 
            // eslint-disable-next-line eqeqeq
            oldTicketData.ticketNo == ticket['$']['TicketNo'] && 
            // Преобразуем строку в булево значение для Redirected
            (ticket['$']['Redirected'] === 'true') && 
            // Преобразуем строку в число для AdditionalStatus
            Number(ticket['$']['AdditionalStatus']) === 2 &&
            ticket['$']['EventId'] !== oldTicketData.eventId
        );
        
        console.log('CheckRedirect redirectedTicket:', redirectedTicket)
        // Если найден билет, возвращаем его, если нет - выводим сообщение
        if (redirectedTicket) {
            return redirectedTicket;
        } else {
            console.log("Перенаправленный билет не найден.");
            return null;
        }
    } catch (error) {
        console.error("Ошибка при получении билетов:", error);
    }
}

export default checkRedirectedTicket;

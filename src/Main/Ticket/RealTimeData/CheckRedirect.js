const checkRedirectedTicket = async (branchId, eventId) => {
    try {
        const redirectedTicket = await fetch(`http://localhost:3001/api/get-redirected-ticket?eventId=${branchId}&branchId=${eventId}`);
        if (!redirectedTicket.ok) {
            throw new Error('Ошибка сети');
        }
        return await redirectedTicket.json();
    } catch (error) {
        console.error("Ошибка при получении билетов:", error);
    }
}

export default checkRedirectedTicket;

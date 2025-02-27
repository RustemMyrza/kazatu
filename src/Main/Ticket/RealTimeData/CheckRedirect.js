const checkRedirectedTicket = async (branchId, eventId) => {
    try {
        const redirectedTicket = await fetch(`${process.env.REACT_APP_BACK_URL}/api/get-redirected-ticket?eventId=${branchId}&branchId=${eventId}`);
        if (!redirectedTicket.ok) {
            throw new Error('Ошибка сети');
        }
        return await redirectedTicket.json();
    } catch (error) {
        console.error("Ошибка при получении билетов:", error);
    }
}

export default checkRedirectedTicket;

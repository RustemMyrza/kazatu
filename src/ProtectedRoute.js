import { Navigate, Outlet, useParams } from "react-router-dom";

const ProtectedRoute = () => {
  const { branchId } = useParams();
  
  const ticketReceived = localStorage.getItem("ticketReceived");
  const ticketTimestamp = localStorage.getItem("ticketTimestamp");

  const isTicketExpired =
    ticketTimestamp && Date.now() - Number(ticketTimestamp) > 3600000;

  if (ticketReceived === null || ticketTimestamp === null || isTicketExpired) {
    return <Navigate to={`/branch/${branchId}/`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

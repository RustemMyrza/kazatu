import React from "react";
 import { useParams } from "react-router-dom";
 import QRCode from "react-qr-code";
 
 const BranchQR = () => {
     const { branchId } = useParams();
     const baseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;
     const qrValue = `${baseUrl}/branch/${branchId}/`;
 
     return (
         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
             <h2>Просканируйте и перейдите по ссылке</h2>
             <QRCode value={qrValue} size={200} />
         </div>
     );
 };
 
 export default BranchQR;
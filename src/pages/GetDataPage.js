import React, { useState, useEffect } from 'react';

const GetDataPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACK_URL}/get-soap-data`)
          .then(response => response.json())
          .then(json => setData(json))
          .catch(error => console.error(error));
      }, []);

    return (
        <div>
        <h1>Данные с страницы /get-data</h1>
        {data ? <pre>{data['soapenv:Envelope']['soapenv:Body'][0]['cus:NomadOperatorQueueList'][0]['xsd:complexType'][1]['xsd:element'][5]['$']['workName']}</pre> : 'Loading...'}
        </div>
    );
};

export default GetDataPage;

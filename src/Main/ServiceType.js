import React from 'react';
import './service_type.css';

const ServiceType = ({ iconClass, serviceText, queueId, parentId }) => (
    <div className="service-type" queue-id={queueId} parent-id={parentId}>
        <div className="icon">
            <i className={iconClass}></i>
        </div>
        <div className="service-text">{serviceText}</div>
    </div>
);


export default ServiceType;

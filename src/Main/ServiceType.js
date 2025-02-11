import React from 'react';
import './service_type.css';

const ServiceType = ({ serviceText, queueId, parentId, link }) => (
    <a href={link} className="service-type" queue-id={queueId} parent-id={parentId}>
        <span className="service-text">{serviceText}</span>
    </a>
);

export default ServiceType;

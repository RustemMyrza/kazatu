import React from 'react';
import './service_type.css';

const ServiceType = ({ iconClass, serviceText }) => (
    <div className='service-type'>
        <div className='icon'>
            <i className={iconClass}></i>
        </div>
        <div className='service-text'>{serviceText}</div>
    </div>
);

export default ServiceType;

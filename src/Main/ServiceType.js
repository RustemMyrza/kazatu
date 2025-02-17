import React from "react";
import { Link } from "react-router-dom";
import "./service_type.css";

const ServiceType = ({ serviceText, queueId, parentId, link }) => (
  <Link to={link} className="service-type" data-queue-id={queueId} data-parent-id={parentId}>
    <span className="service-text">{serviceText}</span>
  </Link>
);

export default ServiceType;

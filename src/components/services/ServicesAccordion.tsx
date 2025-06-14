'use client'

import { Accordion } from "react-bootstrap";
import { servicesData } from '@/data/servicesData';
import type { CategoryType, ServiceType } from '@/lib/types';

/**
 * Komponent akordeonu z kategoriami usług
 */
export default function ServicesAccordion() {
    return (
        <Accordion defaultActiveKey="0" className="mb-5" data-testid="services-accordion">
            {servicesData.map((category: CategoryType, index: number) => (
                <Accordion.Item key={category.id} eventKey={index.toString()}>
                    <Accordion.Header>{category.name}</Accordion.Header>
                    <Accordion.Body>
                        <ul className="list-unstyled">
                            {category.services.map((service: ServiceType) => (
                                <li key={service.id} className="mb-3">
                                    <h3 className="h5">{service.title}</h3>
                                    <p>{service.description}</p>
                                </li>
                            ))}
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
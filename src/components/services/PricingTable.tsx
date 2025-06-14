'use client'

import { Table } from 'react-bootstrap';
import { pricingData } from '@/data/pricingData';
import React from 'react';

/**
 * Tabela z cennikiem usług
 */
export default function PricingTable() {
  return (
    <div className="table-responsive mb-5" data-testid="pricing-table">
      <Table striped bordered hover className="align-middle pricing-table" lang='pl'>
        <thead className="table-dark">
          <tr>
            <th>Usługa</th>
            <th className="text-end">Zakres cen (PLN)</th>
          </tr>
        </thead>
        <tbody>
          {pricingData.map(({ id, category, services }) => (
            <React.Fragment key={id}>
              <tr className='table-secondary'>
                <td colSpan={2} className="text-center py-2">
                  <h6 className='m-0'>{category}</h6>
                </td>
              </tr>
              {services.map(({ id: serviceID, service, priceRange }) => (
                <tr key={serviceID}>
                  <td className='text-wrap align-middle'>
                    {service}
                  </td>
                  <td className="text-end ps-2" style={{ minWidth: 80 }}>
                    {priceRange}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
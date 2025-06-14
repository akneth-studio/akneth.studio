import { Metadata } from 'next';

import HowWeWork from '@/components/services/HowWeWork';
import CTAButton from '@/components/CTAButton';
import ServicesAccordion from '@/components/services/ServicesAccordion';
import PricingTable from '@/components/services/PricingTable';



export const metadata: Metadata = {
  title: "Usługi",
  description: "Oferta AKNETH Studio: strony internetowe, sklepy online, automatyzacje i szkolenia. Sprawdź nasze ceny i proces współpracy.",
  keywords: [
    "Usługi",
    "Cennik",
    "automatyzacje",
    "szkolenia",
    "proces współpracy"
  ]
};

export default function ServicesPage() {
  return (
    <>
      <article className="container mt-5">
        <h1 className="display-4 mb-4">Nasze Usługi</h1>
        <ServicesAccordion />
        <PricingTable />
        <HowWeWork />
        <div className="text-center my-5">
          <CTAButton
            type='button'
            text="Zapytaj o wycenę"
            variant="primary"
            size="lg"
            to='/contact'
          />
        </div>
      </article>
    </>
  );
}
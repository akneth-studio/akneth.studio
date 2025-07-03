'use client'

import React from 'react';
import Image from 'next/image';
import { LiaMapMarkedSolid, LiaPhoneSolid, LiaAtSolid, LiaClockSolid } from 'react-icons/lia';

// Import environment variables for contact information
const street = process.env.NEXT_PUBLIC_ADDRESS_STREET || 'ul. Przykładowa 1';
const city = process.env.NEXT_PUBLIC_ADDRESS_CITY || 'Warszawa';
const phone = process.env.NEXT_PUBLIC_PHONE || '123-456-789';
const email = process.env.NEXT_PUBLIC_EMAIL || 'kontakt@przyklad.pl';

const ContactInfo = () => {
    return (
        <>
            <Image
                src="/img/logo_akneth.svg"
                alt="AKNETH Studio"
                width={300}
                height={150}
            />
            <div className="mb-4">
                <h4><LiaMapMarkedSolid /> Adres</h4>
                <div className="mb-2">
                    <p>
                        {street} <br />
                        {city}
                    </p>
                </div>
                <h4><LiaClockSolid /> Godziny pracy</h4>
                <p>
                    <b>Poniedziałek - Piątek</b><br/>
                    9:00 - 17:00
                </p>
                <p>
                    <b>Sobota</b><br/>
                    10:00 - 14:00<br/>
                    <span className='fst-italic text-body-secondary' style={{fontSize: '0.85rem'}}>
                        (tylko umówione spotkania)
                    </span>
                </p>
                <h4><LiaPhoneSolid /> Telefon</h4>
                <p>{phone}</p>
                <h4><LiaAtSolid /> Email</h4>
                <p>{email}</p>
            </div>
        </>
    );
};

export default ContactInfo;

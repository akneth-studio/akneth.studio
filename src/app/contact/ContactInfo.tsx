'use client'

import React from 'react';
import Image from 'next/image';
import { LiaMapMarkedSolid, LiaPhoneSolid, LiaAtSolid } from 'react-icons/lia';

// Import environment variables for contact information
const street = process.env.NEXT_PUBLIC_ADDRESS_STREET || 'ul. Przykładowa 1';
const city = process.env.NEXT_PUBLIC_ADDRESS_CITY || 'Warszawa';
const phone = process.env.NEXT_PUBLIC_PHONE || '123-456-789';
const email = process.env.NEXT_PUBLIC_EMAIL || 'kontakt@przyklad.pl';

import { Autour_One } from 'next/font/google';
const autourOne = Autour_One({
    weight: '400',
    subsets: ['latin-ext'],
    display: 'swap',
});

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
                <h4><LiaPhoneSolid /> Telefon</h4>
                <p>{phone}</p>
                <h4><LiaAtSolid /> Email</h4>
                <p>{email}</p>
            </div>
        </>
    );
};

export default ContactInfo;

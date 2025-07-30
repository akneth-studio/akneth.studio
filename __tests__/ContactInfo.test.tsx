import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

describe('ContactInfo component', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        // Resetuje moduły, aby upewnić się, że zmienne środowiskowe
        // są odczytywane na nowo w każdym teście.
        jest.resetModules();
    });

    afterEach(() => {
        // Przywraca oryginalne zmienne środowiskowe po każdym teście.
        process.env = originalEnv;
    });

    it('renders contact information from environment variables', () => {
        // Ustawiamy niestandardowe zmienne środowiskowe dla tego testu
        process.env = {
            ...originalEnv,
            NEXT_PUBLIC_ADDRESS_STREET: 'ul. Testowa 123',
            NEXT_PUBLIC_ADDRESS_CITY: 'Miasto Testów',
            NEXT_PUBLIC_PHONE: '987-654-321',
            NEXT_PUBLIC_EMAIL: 'test@example.com',
        };

        // Dynamicznie importujemy komponent, aby użył zmockowanych zmiennych
        const ContactInfo = require('./src/components/contact/ContactInfo').default;
        render(<ContactInfo />);

        // Sprawdzamy, czy komponent renderuje dane ze zmiennych środowiskowych
        expect(screen.getByAltText('AKNETH Studio')).toBeInTheDocument();
        expect(screen.getByText(/ul. Testowa 123/i)).toBeInTheDocument();
        expect(screen.getByText(/Miasto Testów/i)).toBeInTheDocument();
        expect(screen.getByText('987-654-321')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('renders fallback contact information when environment variables are not set', () => {
        // Upewniamy się, że zmienne środowiskowe są niezdefiniowane
        process.env = {
            ...originalEnv,
        };
        delete process.env.NEXT_PUBLIC_ADDRESS_STREET;
        delete process.env.NEXT_PUBLIC_ADDRESS_CITY;
        delete process.env.NEXT_PUBLIC_PHONE;
        delete process.env.NEXT_PUBLIC_EMAIL;

        // Dynamicznie importujemy komponent
        const ContactInfo = require('./src/components/contact/ContactInfo').default;
        render(<ContactInfo />);

        // Sprawdzamy, czy komponent renderuje domyślne (fallback) dane
        expect(screen.getByAltText('AKNETH Studio')).toBeInTheDocument();
        expect(screen.getByText(/ul. Przykładowa 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Warszawa/i)).toBeInTheDocument();
        expect(screen.getByText('123-456-789')).toBeInTheDocument();
        expect(screen.getByText('kontakt@przyklad.pl')).toBeInTheDocument();
    });
});
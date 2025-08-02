'use client'

import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface CTAButtonProps {
    text: string;
    icon?: ReactNode;
    variant?: 'primary' | 'outline-primary' | 'secondary' | 'outline-secondary' | string;
    size?: 'sm' | 'lg' | '';
    className?: string;
    to?: string;
    onClick?: () => void;
    type: 'button' | 'submit' | 'reset';
    tabIndex?: number;
    disabled?: boolean;
    "data-testid"?: string;
}

/**
 * Uniwersalny przycisk CTA do przekierowania na stronę kontaktową.
 */
export default function CTAButton({
    text,
    icon,
    to,
    onClick,
    variant = 'outline-primary',
    size = '',
    className = '',
    type = 'button',
    disabled = false,
    "data-testid": dataTestId = 'cta-button',
}: CTAButtonProps) {
    const router = useRouter();
    // Obsługa przekierowania, jeśli podano adres URL
    const handleClick = () => {
        // Jeśli jest podany onClick, użyj go
        if (onClick) {
            onClick();
        } else if (to) {
            router.push(to);
        }
    };
    return (
        <Button
            type={type}
            onClick={handleClick}
            className={`btn btn-${variant}${size ? ` btn-${size}` : ''} ${className}`}
            role="button"
            data-testid={dataTestId}
            tabIndex={0}
            aria-label={text}
            disabled={disabled}
        >
            {icon ? icon : null}
            {text}
        </Button>
    );
}
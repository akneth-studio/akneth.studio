'use client'

import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface CTAButtonProps {
    text: string;
    variant?: 'primary' | 'outline-primary' | 'secondary' | 'outline-secondary' | string;
    size?: 'sm' | 'lg' | '';
    className?: string;
    to?: string;
    onClick?: () => void;
    type: 'button' | 'submit' | 'reset';
    tabIndex?: number;
    disabled?: boolean;
}

/**
 * Uniwersalny przycisk CTA do przekierowania na stronę kontaktową.
 */
export default function CTAButton({
    text,
    to,
    onClick,
    variant = 'outline-primary',
    size = '',
    className = '',
    type = 'button',
    disabled = false,
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
            data-testid="cta-button"
            tabIndex={0}
            aria-label={text}
            disabled={disabled}
        >
            {text}
        </Button>
    );
}

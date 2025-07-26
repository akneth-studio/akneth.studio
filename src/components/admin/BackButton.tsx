'use client'
import { useRouter } from 'next/navigation'
import { BsArrowLeftCircle } from 'react-icons/bs';

export default function BackButton({ className, children }: { className?: string; children?: React.ReactNode }) {
    const router = useRouter()
    return (
        <button
            type="button"
            className={className}
            onClick={() => router.back()}
        >
            {children || (
                <>
                    <BsArrowLeftCircle className='me-2' />
                    Wróć
                </>
            )}
        </button>
    )
}

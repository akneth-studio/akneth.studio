export default function Summary() {
    return (
        <>
            {/* Tutaj Twój panel admina */}
            <iframe
                title='betterstack'
                src={process.env.NEXT_PUBLIC_BETTERSTACK_STATUS_URL || 'https://example.betteruptime.com'}
                width="100%"
                height="925"
            />
        </>
    )
}
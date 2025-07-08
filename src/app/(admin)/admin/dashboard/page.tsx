import Auth from '@/components/admin/auth'
import MessagesPreview from '@/components/admin/MessagesPreview'

export default async function Dashboard() {
    return (
        <>
            <Auth>
                <h1 className='text-center'>DASHBOARD</h1>
                <div>
                    {/* Tutaj Twój panel admina */}
                    Panel admina – dostęp tylko po zalogowaniu.
                </div>
                <MessagesPreview />
            </Auth>
        </>
    )
}
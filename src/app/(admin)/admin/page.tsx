import Auth from '@/components/auth'
import AdminDashboard from '@/components/Dashboard'

export default async function Dashboard() {
    return (
        <>
            <Auth/>
            <h1 className='text-center'>DASHBOARD</h1>
            <div>
                {/* Tutaj Twój panel admina */}
                Panel admina – dostęp tylko po zalogowaniu.
            </div>
            <AdminDashboard/>
        </>
    )
}

import Auth from '@/components/admin/auth'
import MessagesPreview from '@/components/admin/MessagesPreview'
import Summary from '@/components/admin/Summary'

export default async function Dashboard() {
    return (
        <>
            <Auth>
                <h1 className='text-center'>DASHBOARD</h1>
                <Summary />
                <MessagesPreview />
            </Auth>
        </>
    )
}
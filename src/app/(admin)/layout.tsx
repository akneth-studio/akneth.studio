import '@/styles/admin.scss';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='pl'>
            <body className='admin-bg'>
                <div className="admin-container d-flex">
                    <AdminSidebar />
                    <main className='admin-main flex-grow-1 p-4' tabIndex={-1}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
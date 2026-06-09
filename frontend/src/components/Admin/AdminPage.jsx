import { AdminProvider, useAdmin } from './AdminContext.jsx'
import AdminLogin from './Login/AdminLogin.jsx'
import AdminDashboard from './Dashboard/AdminDashboard.jsx'

function AdminGate() {
  const { admin, loading } = useAdmin()

  if (loading) return null

  if (!admin) return <AdminLogin />

  return <AdminDashboard />
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminGate />
    </AdminProvider>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken } from './utils/api'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import RoomsPage from './pages/RoomsPage'
import PaymentsPage from './pages/PaymentsPage'
import BookingsPage from './pages/BookingsPage'
import LeavesPage from './pages/LeavesPage'

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/leaves" element={<LeavesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

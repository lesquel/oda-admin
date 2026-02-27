import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import Layout from '@/components/Layout'
import PrivateRoute from '@/components/PrivateRoute'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'
import PoemsPage from '@/pages/PoemsPage'
import LikesPage from '@/pages/LikesPage'
import BookmarksPage from '@/pages/BookmarksPage'
import EmotionsPage from '@/pages/EmotionsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/poems" element={<PoemsPage />} />
          <Route path="/likes" element={<LikesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/emotions" element={<EmotionsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

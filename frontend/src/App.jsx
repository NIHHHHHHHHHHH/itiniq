import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Processing from './pages/Processing';
import Dashboard from './pages/Dashboard';
import ItineraryView from './pages/ItineraryView';
import SharedView from '@/pages/SharedView';

const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-bg">
    <h2 className="text-text-primary font-bold text-3xl">{title} - Phase coming soon</h2>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/shared/:shareToken" element={<SharedView />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
      <Route path="/processing/:uploadId" element={<ProtectedRoute><Processing /></ProtectedRoute>} />
      <Route path="/itinerary/:id" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
      <Route path="*" element={<PlaceholderPage title="404 — Not Found" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
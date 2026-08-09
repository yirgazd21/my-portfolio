import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary-500/20 border-t-primary-500 rounded-full" />
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" replace />;
}

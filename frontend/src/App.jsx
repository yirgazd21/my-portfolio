import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/ui/CustomCursor';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <CustomCursor />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1528',
                color: '#fff',
                border: '1px solid #1e2d4a',
                borderRadius: '12px',
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
              },
            }}
          />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={
                <div className="bg-dark-bg min-h-screen">
                  <ProjectDetail />
                </div>
              } />
              <Route path="/admin/login" element={<div className="bg-dark-bg"><AdminLogin /></div>} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <div className="bg-dark-bg min-h-screen"><AdminDashboard /></div>
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* Layout principal com Sidebar e Dashboard */}
            <div className="flex h-screen bg-gray-100 font-sans">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardPage />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
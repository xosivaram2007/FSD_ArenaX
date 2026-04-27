import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TournamentList from './pages/TournamentList';
import TournamentDetails from './pages/TournamentDetails';
import CreateTournament from './pages/CreateTournament';
import RegisterTeam from './pages/RegisterTeam';
import ScheduleMatch from './pages/ScheduleMatch';
import UpdateMatch from './pages/UpdateMatch';
import ManageTeam from './pages/ManageTeam';
import AdminUsers from './pages/AdminUsers';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col transition-colors duration-500">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl animate-fade-in-up">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tournaments" element={<TournamentList />} />
              <Route path="/tournaments/:id" element={<TournamentDetails />} />

              {/* Protected routes (Any logged in user) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tournaments/:tournamentId/register-team" element={<RegisterTeam />} />
                <Route path="/teams/:teamId/manage" element={<ManageTeam />} />
              </Route>

              {/* Manager & Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Manager', 'Admin']} />}>
                  {/* Kept empty for structure as User role is now merged above */}
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/tournaments/new" element={<CreateTournament />} />
              </Route>

              {/* Admin & Supervisor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Admin', 'Supervisor']} />}>
                <Route path="/tournaments/:tournamentId/schedule-match" element={<ScheduleMatch />} />
                <Route path="/matches/:matchId/update" element={<UpdateMatch />} />
              </Route>
            </Routes>
          </main>
          
          <footer className="glass-panel border-x-0 border-b-0 py-6 text-center text-gray-500 dark:text-gray-400 text-sm mt-auto relative z-10">
             <p>&copy; 2026 Sports Tournament System. Premium Edition.</p>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

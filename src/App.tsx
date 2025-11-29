// CAMBIO 1: Importa HashRouter en lugar de BrowserRouter
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Favorites from './pages/Favorites';
import About from './pages/About';
import MapPlayer from './pages/MapPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ViewProfile from './pages/ViewProfile';
import Achievements from './pages/Achievements';
import Users from './pages/Users';
import CreateScenario from './pages/CreateScenario';
import MyScenarios from './pages/MyScenarios';
import Activity from './pages/Activity';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './lib/toast';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* CAMBIO 2: Router ahora es HashRouter gracias al alias en el import */}
        <Router>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-black text-white rounded font-bold shadow-lg">
            Skip to main content
          </a>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/me" element={<ViewProfile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/users" element={<Users />} />
            <Route path="/create" element={<CreateScenario />} />
            <Route path="/my-scenarios" element={<MyScenarios />} />
            <Route path="/edit/:slug" element={<CreateScenario />} />
            <Route path="/map/:slug" element={<MapPlayer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
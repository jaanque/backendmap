import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import About from './pages/About';
import MapPlayer from './pages/MapPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './lib/auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map/:slug" element={<MapPlayer />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

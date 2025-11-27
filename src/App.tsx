import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MapPlayer from './pages/MapPlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/map/:slug" element={<MapPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- ADD THIS

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Battle from './pages/Battle';
import Learn from './pages/Learn';
import Ranks from './pages/Rank';
import Guild from './pages/Guild';
import ProfilePage from './components/profile/ProfilePage';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <AuthProvider> {/* <-- WRAP APP HERE */}
      <BrowserRouter>
        <CustomCursor />
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/guild" element={<Guild />} />        
          <Route path="/battle" element={<Battle />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/ranks" element={<Ranks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
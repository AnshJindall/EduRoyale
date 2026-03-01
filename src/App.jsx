import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Battle from './pages/Battle';
import Learn from './pages/Learn'; // Your current modules page
import Ranks from './pages/Rank';
import Guild from './pages/Guild';
import ProfilePage from './components/profile/ProfilePage';

// --> ADD THE NEW 3D SELECTION COMPONENT HERE
import SubjectSelection from './pages/SubjectSelection';
import LessonViewer from './pages/LessonViewer';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/guild" element={<Guild />} />        
          <Route path="/battle" element={<Battle />} />
          <Route path="/ranks" element={<Ranks />} />
          
          {/* LEARN SECTION */}
          <Route path="/learn" element={<SubjectSelection />} />
          <Route path="/learn/:subjectId" element={<Learn />} />
          {/* Lesson viewer: /learn/dsa/binary-search or /learn/dsa/<uuid-from-supabase> */}
          <Route path="/learn/:subjectId/:lessonId" element={<LessonViewer />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
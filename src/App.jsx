// ... your other imports
import Ranks from './pages/Rank';
import Guild from './pages/Guild';
import ProfilePage from './components/profile/ProfilePage';
import LessonModule from './pages/LessonModule'; // <-- 1. ADD THIS IMPORT

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        {/* We pass a custom hide prop to Navbar if we don't want it covering the immersive module screen, but for now we can leave it */}
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/guild" element={<Guild />} />        
          <Route path="/battle" element={<Battle />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/ranks" element={<Ranks />} />
          
          {/* 2. ADD THIS ROUTE */}
          <Route path="/learn/:id" element={<LessonModule />} /> 
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
#!/bin/bash
# Run this from the ROOT of your EduRoyale project folder
# e.g.: cd /path/to/EduRoyale && bash patch.sh

echo "🔧 Patching EduRoyale..."

# ── 1. src/App.jsx ─────────────────────────────────────────────
cat > src/App.jsx << 'ENDOFFILE'
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Battle from './pages/Battle';
import Learn from './pages/Learn';
import Ranks from './pages/Rank';
import Guild from './pages/Guild';
import ProfilePage from './components/profile/ProfilePage';
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
          <Route path="/learn" element={<SubjectSelection />} />
          <Route path="/learn/:subjectId" element={<Learn />} />
          <Route path="/learn/:subjectId/:lessonId" element={<LessonViewer />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
ENDOFFILE
echo "✅ src/App.jsx done"

# ── 2. src/pages/Learn.jsx ─────────────────────────────────────
cat > src/pages/Learn.jsx << 'ENDOFFILE'
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/learn.css';
import { MASCOT, MASCOT_ALT } from '../mascot';

export default function Learn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(
    subjectId ? subjectId.toUpperCase() : 'All'
  );

  useEffect(() => {
    setActiveSubject(subjectId ? subjectId.toUpperCase() : 'All');
  }, [subjectId]);

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (data) setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  const filteredModules = activeSubject === 'All'
    ? modules
    : modules.filter(m => m.subject && m.subject.toUpperCase() === activeSubject.toUpperCase());

  const subjects = ['All', ...new Set(modules.map(m => m.subject).filter(Boolean))];

  const handleStartModule = (mod) => {
    const subject = subjectId || (mod.subject ? mod.subject.toLowerCase() : 'general');
    navigate(`/learn/${subject}/${mod.id}`);
  };

  if (loading) return (
    <div style={{ color: 'var(--white)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>
      LOADING DATABANKS...
    </div>
  );

  return (
    <div className="page-wrap">
      <button
        onClick={() => navigate('/learn')}
        className="px-btn px-btn-o"
        style={{ marginBottom: '24px', fontSize: '10px' }}
      >
        ◀ BACK TO SUBJECTS
      </button>

      <div className="page-header" style={{ marginBottom: '32px', position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <div className="chip chip-b">📖 KNOWLEDGE ARCHIVE</div>
          <h1 style={{ color: 'var(--blue)', textShadow: '3px 3px 0 var(--bd)', marginTop: '12px' }}>
            {subjectId ? `${subjectId.toUpperCase()} MODULES` : 'LEARNING MODULES'}
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px' }}>Master concepts to increase your global ELO and unlock new battle arenas.</p>
        </div>
        <img src={MASCOT.study} alt={MASCOT_ALT} style={{
          width: 'clamp(130px, 14vw, 200px)',
          flexShrink: 0,
          filter: 'drop-shadow(0 0 24px rgba(162,89,255,0.5))',
          animation: 'mascot-float 3s ease-in-out infinite',
          marginTop: '-10px',
        }} draggable="false" />
      </div>

      {/* Subject Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            className={`px-btn ${activeSubject === subject ? 'px-btn-b' : 'px-btn-o'}`}
          >
            {subject.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Module Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredModules.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>No modules found for this subject.</div>
        ) : (
          filteredModules.map((mod) => (
            <div key={mod.id} style={{
              background: 'var(--card)',
              border: `3px solid ${mod.is_locked ? 'var(--border)' : 'var(--blue)'}`,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              opacity: mod.is_locked ? 0.6 : 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="chip" style={{
                  color: mod.difficulty === 'Beginner' ? 'var(--green)' : mod.difficulty === 'Boss' ? 'var(--pink)' : 'var(--yellow)',
                  borderColor: mod.difficulty === 'Beginner' ? 'var(--green)' : mod.difficulty === 'Boss' ? 'var(--pink)' : 'var(--yellow)'
                }}>
                  {mod.difficulty ? mod.difficulty.toUpperCase() : 'STANDARD'}
                </span>
                <span style={{ color: 'var(--yellow)', fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  +{mod.xp_reward} XP
                </span>
              </div>
              <h2 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px', color: 'var(--white)', marginBottom: '8px', lineHeight: '1.4' }}>
                {mod.title}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '24px', flex: 1 }}>
                {mod.description}
              </p>
              <button
                className={`px-btn ${mod.is_locked ? 'px-btn-o' : 'px-btn-b'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleStartModule(mod)}
                disabled={mod.is_locked}
              >
                {mod.is_locked ? 'LOCKED' : 'INITIALIZE ▶'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
ENDOFFILE
echo "✅ src/pages/Learn.jsx done"

# ── 3. src/pages/SubjectSelection.jsx ─────────────────────────
# Only patch the COURSES data and the onClick handler inside the existing file
# using node inline script to avoid overwriting the massive Three.js scene

node - << 'JSEOF'
const fs = require('fs');
const path = 'src/pages/SubjectSelection.jsx';
let code = fs.readFileSync(path, 'utf8');

// Fix 1: Add url fields to every course that's missing one
const oldCourses = `      college: [
        // Notice the URL here is just 'dsa'
        { id: 'dsa',  label: 'DATA STRUCTURES\\n& ALGORITHMS', icon: '🌲', color: 0x3dff9a, hex: '#3dff9a', url: 'dsa' },
        { id: 'dbms', label: 'DATABASE\\nMANAGEMENT',          icon: '🗄️', color: 0x3cacff, hex: '#3cacff' },
        { id: 'os',   label: 'OPERATING\\nSYSTEMS',            icon: '⚙️', color: 0xa259ff, hex: '#a259ff' },
        { id: 'cn',   label: 'COMPUTER\\nNETWORKS',            icon: '🌐', color: 0xff6b35, hex: '#ff6b35' },
        { id: 'ml',   label: 'MACHINE\\nLEARNING',             icon: '🤖', color: 0xffd60a, hex: '#ffd60a' },
      ],
      class11: [
        { id: 'ph11', label: 'PHYSICS',           icon: '⚡', color: 0x3cacff, hex: '#3cacff' },
        { id: 'ch11', label: 'CHEMISTRY',         icon: '🧪', color: 0x3dff9a, hex: '#3dff9a' },
        { id: 'ma11', label: 'MATHEMATICS',       icon: '📐', color: 0xffd60a, hex: '#ffd60a' },
        { id: 'bi11', label: 'BIOLOGY',           icon: '🧬', color: 0xff6b35, hex: '#ff6b35' },
        { id: 'cs11', label: 'COMPUTER\\nSCIENCE', icon: '💻', color: 0xa259ff, hex: '#a259ff' },
      ],
      class12: [
        { id: 'ph12', label: 'PHYSICS',           icon: '⚡', color: 0x3cacff, hex: '#3cacff' },
        { id: 'ch12', label: 'CHEMISTRY',         icon: '🧪', color: 0x3dff9a, hex: '#3dff9a' },
        { id: 'ma12', label: 'MATHEMATICS',       icon: '📐', color: 0xffd60a, hex: '#ffd60a' },
        { id: 'bi12', label: 'BIOLOGY',           icon: '🧬', color: 0xff6b35, hex: '#ff6b35' },
        { id: 'cs12', label: 'COMPUTER\\nSCIENCE', icon: '💻', color: 0xa259ff, hex: '#a259ff' },
      ],`;

const newCourses = `      college: [
        { id: 'dsa',  label: 'DATA STRUCTURES\\n& ALGORITHMS', icon: '🌲', color: 0x3dff9a, hex: '#3dff9a', url: 'dsa' },
        { id: 'dbms', label: 'DATABASE\\nMANAGEMENT',          icon: '🗄️', color: 0x3cacff, hex: '#3cacff', url: 'dbms' },
        { id: 'os',   label: 'OPERATING\\nSYSTEMS',            icon: '⚙️', color: 0xa259ff, hex: '#a259ff', url: 'os' },
        { id: 'cn',   label: 'COMPUTER\\nNETWORKS',            icon: '🌐', color: 0xff6b35, hex: '#ff6b35', url: 'cn' },
        { id: 'ml',   label: 'MACHINE\\nLEARNING',             icon: '🤖', color: 0xffd60a, hex: '#ffd60a', url: 'ml' },
      ],
      class11: [
        { id: 'ph11', label: 'PHYSICS',           icon: '⚡', color: 0x3cacff, hex: '#3cacff', url: 'physics-11' },
        { id: 'ch11', label: 'CHEMISTRY',         icon: '🧪', color: 0x3dff9a, hex: '#3dff9a', url: 'chemistry-11' },
        { id: 'ma11', label: 'MATHEMATICS',       icon: '📐', color: 0xffd60a, hex: '#ffd60a', url: 'maths-11' },
        { id: 'bi11', label: 'BIOLOGY',           icon: '🧬', color: 0xff6b35, hex: '#ff6b35', url: 'biology-11' },
        { id: 'cs11', label: 'COMPUTER\\nSCIENCE', icon: '💻', color: 0xa259ff, hex: '#a259ff', url: 'cs-11' },
      ],
      class12: [
        { id: 'ph12', label: 'PHYSICS',           icon: '⚡', color: 0x3cacff, hex: '#3cacff', url: 'physics-12' },
        { id: 'ch12', label: 'CHEMISTRY',         icon: '🧪', color: 0x3dff9a, hex: '#3dff9a', url: 'chemistry-12' },
        { id: 'ma12', label: 'MATHEMATICS',       icon: '📐', color: 0xffd60a, hex: '#ffd60a', url: 'maths-12' },
        { id: 'bi12', label: 'BIOLOGY',           icon: '🧬', color: 0xff6b35, hex: '#ff6b35', url: 'biology-12' },
        { id: 'cs12', label: 'COMPUTER\\nSCIENCE', icon: '💻', color: 0xa259ff, hex: '#a259ff', url: 'cs-12' },
      ],`;

if (code.includes('// Notice the URL here is just')) {
  code = code.replace(oldCourses, newCourses);
  console.log('  courses patched');
} else {
  console.log('  courses already patched or format differs - skipping');
}

// Fix 2: Fix onClick handler to use url || id as fallback
const oldClick = `    const onClick = () => {
      if (!hovered || !hovered.userData.url) return;
      // ROUTES TO /learn/dsa
      navigate(\`/learn/\${hovered.userData.url}\`);
    };`;
const newClick = `    const onClick = () => {
      if (!hovered) return;
      const dest = hovered.userData.url || hovered.userData.id;
      if (!dest) return;
      navigate(\`/learn/\${dest}\`);
    };`;

if (code.includes("if (!hovered || !hovered.userData.url)")) {
  code = code.replace(oldClick, newClick);
  console.log('  onClick patched');
} else {
  console.log('  onClick already patched - skipping');
}

fs.writeFileSync(path, code);
JSEOF
echo "✅ src/pages/SubjectSelection.jsx done"

# ── 4. src/pages/LessonViewer.jsx ─────────────────────────────
cat > src/pages/LessonViewer.jsx << 'ENDOFFILE'
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const LESSONS = {
  'binary-search': {
    title: 'Binary Search', subject: 'DSA', difficulty: 'Beginner', xp: 120, language: 'Python',
    code: [
      { n: 1,  raw: 'def binary_search(arr, target):',   tokens: [{t:'kw',v:'def '},{t:'fn',v:'binary_search'},{t:'w',v:'(arr, target):'}] },
      { n: 2,  raw: '    left, right = 0, len(arr) - 1', tokens: [{t:'w',v:'    left, right = '},{t:'nm',v:'0'},{t:'w',v:', '},{t:'fn',v:'len'},{t:'w',v:'(arr) - '},{t:'nm',v:'1'}] },
      { n: 3,  raw: '', tokens: [] },
      { n: 4,  raw: '    while left <= right:',           tokens: [{t:'kw',v:'    while '},{t:'w',v:'left <= right:'}] },
      { n: 5,  raw: '        mid = (left + right) // 2', tokens: [{t:'w',v:'        mid = (left + right) // '},{t:'nm',v:'2'}] },
      { n: 6,  raw: '', tokens: [] },
      { n: 7,  raw: '        if arr[mid] == target:',     tokens: [{t:'kw',v:'        if '},{t:'w',v:'arr[mid] == target:'}] },
      { n: 8,  raw: '            return mid',             tokens: [{t:'kw',v:'            return '},{t:'nm',v:'mid'}] },
      { n: 9,  raw: '        elif arr[mid] < target:',    tokens: [{t:'kw',v:'        elif '},{t:'w',v:'arr[mid] < target:'}] },
      { n: 10, raw: '            left = mid + 1',         tokens: [{t:'w',v:'            left = mid + '},{t:'nm',v:'1'}] },
      { n: 11, raw: '        else:',                      tokens: [{t:'kw',v:'        else:'}] },
      { n: 12, raw: '            right = mid - 1',        tokens: [{t:'w',v:'            right = mid - '},{t:'nm',v:'1'}] },
      { n: 13, raw: '', tokens: [] },
      { n: 14, raw: '    return -1  # not found',         tokens: [{t:'kw',v:'    return '},{t:'nm',v:'-1'},{t:'cm',v:'  # not found'}] },
    ],
    steps: [
      { title:'INIT POINTERS',     lines:[2],     explanation:'Set left=0 and right=len(arr)-1. These define the search space.',                                                                 array:[2,8,15,23,42,56,71,89,95], L:0, R:8, M:null, found:null },
      { title:'ENTER LOOP',        lines:[4],     explanation:'While left ≤ right there is a valid search space. Once they cross, target is not in the array.',                                 array:[2,8,15,23,42,56,71,89,95], L:0, R:8, M:null, found:null },
      { title:'CALC MIDPOINT',     lines:[5],     explanation:'mid = (0+8)//2 = 4. arr[4] = 42. Integer division prevents floating point.',                                                     array:[2,8,15,23,42,56,71,89,95], L:0, R:8, M:4,    found:null },
      { title:'TOO HIGH → LEFT',   lines:[11,12], explanation:'arr[4]=42 > target 23. Target is in LEFT half. Set right = mid-1 = 3.',                                                          array:[2,8,15,23,42,56,71,89,95], L:0, R:3, M:4,    found:null },
      { title:'NEW MIDPOINT',      lines:[5],     explanation:'mid = (0+3)//2 = 1. arr[1] = 8.',                                                                                                array:[2,8,15,23,42,56,71,89,95], L:0, R:3, M:1,    found:null },
      { title:'TOO LOW → RIGHT',   lines:[9,10],  explanation:'arr[1]=8 < target 23. Target is in RIGHT half. Set left = mid+1 = 2.',                                                           array:[2,8,15,23,42,56,71,89,95], L:2, R:3, M:1,    found:null },
      { title:'NEW MIDPOINT',      lines:[5],     explanation:'mid = (2+3)//2 = 2. arr[2] = 15.',                                                                                               array:[2,8,15,23,42,56,71,89,95], L:2, R:3, M:2,    found:null },
      { title:'TOO LOW → RIGHT',   lines:[9,10],  explanation:'arr[2]=15 < 23. Set left = mid+1 = 3.',                                                                                         array:[2,8,15,23,42,56,71,89,95], L:3, R:3, M:2,    found:null },
      { title:'NEW MIDPOINT',      lines:[5],     explanation:'mid = (3+3)//2 = 3. arr[3] = 23.',                                                                                              array:[2,8,15,23,42,56,71,89,95], L:3, R:3, M:3,    found:null },
      { title:'✓ TARGET FOUND!',   lines:[7,8],   explanation:'arr[3]=23 == target 23. MATCH! Return mid=3. Completed in O(log n) time — only 4 comparisons for 9 elements.',                  array:[2,8,15,23,42,56,71,89,95], L:3, R:3, M:3,    found:3 },
    ],
  },
  'bubble-sort': {
    title: 'Bubble Sort', subject: 'DSA', difficulty: 'Beginner', xp: 100, language: 'Python',
    code: [
      { n:1, raw:'def bubble_sort(arr):',              tokens:[{t:'kw',v:'def '},{t:'fn',v:'bubble_sort'},{t:'w',v:'(arr):'}] },
      { n:2, raw:'    n = len(arr)',                   tokens:[{t:'w',v:'    n = '},{t:'fn',v:'len'},{t:'w',v:'(arr)'}] },
      { n:3, raw:'    for i in range(n):',             tokens:[{t:'kw',v:'    for '},{t:'w',v:'i '},{t:'kw',v:'in '},{t:'fn',v:'range'},{t:'w',v:'(n):'}] },
      { n:4, raw:'        for j in range(n-i-1):',     tokens:[{t:'kw',v:'        for '},{t:'w',v:'j '},{t:'kw',v:'in '},{t:'fn',v:'range'},{t:'w',v:'(n-i-'},{t:'nm',v:'1'},{t:'w',v:'):'}] },
      { n:5, raw:'            if arr[j] > arr[j+1]:',  tokens:[{t:'kw',v:'            if '},{t:'w',v:'arr[j] > arr[j+'},{t:'nm',v:'1'},{t:'w',v:']:'}] },
      { n:6, raw:'                arr[j], arr[j+1] = arr[j+1], arr[j]', tokens:[{t:'w',v:'                arr[j], arr[j+1] = arr[j+1], arr[j]'}] },
      { n:7, raw:'    return arr',                     tokens:[{t:'kw',v:'    return '},{t:'w',v:'arr'}] },
    ],
    steps: [
      { title:'START PASS 1',    lines:[3],   explanation:'Outer loop i=0. We will bubble the largest element to the end in this pass.',         array:[64,34,25,12,22], L:null,R:null,M:null,cmp:[0,1],found:null },
      { title:'COMPARE j=0,1',   lines:[4,5], explanation:'arr[0]=64 > arr[1]=34 → SWAP! Larger value bubbles right.',                           array:[34,64,25,12,22], L:null,R:null,M:null,cmp:[0,1],found:null },
      { title:'COMPARE j=1,2',   lines:[4,5], explanation:'arr[1]=64 > arr[2]=25 → SWAP!',                                                      array:[34,25,64,12,22], L:null,R:null,M:null,cmp:[1,2],found:null },
      { title:'COMPARE j=2,3',   lines:[4,5], explanation:'arr[2]=64 > arr[3]=12 → SWAP!',                                                      array:[34,25,12,64,22], L:null,R:null,M:null,cmp:[2,3],found:null },
      { title:'COMPARE j=3,4',   lines:[4,5], explanation:'arr[3]=64 > arr[4]=22 → SWAP! 64 bubbles to its final position at index 4.',          array:[34,25,12,22,64], L:null,R:null,M:null,cmp:[3,4],found:4 },
      { title:'PASS 2 DONE',     lines:[3],   explanation:'Pass 2 bubbles 34 into place. Each pass guarantees one more element is sorted.',      array:[25,12,22,34,64], L:null,R:null,M:null,cmp:null, found:3 },
      { title:'✓ SORTED!',       lines:[7],   explanation:'After n-1 passes the array is sorted. O(n²) time — every pair compared multiple times. O(1) space.', array:[12,22,25,34,64], L:null,R:null,M:null,cmp:null, found:null },
    ],
  },
};

function ArrayViz({ step, lesson }) {
  const s = lesson.steps[step];
  return (
    <div style={{ display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap' }}>
      {s.array.map((num, idx) => {
        const isL = idx === s.L, isR = idx === s.R, isM = idx === s.M;
        const isCmp = s.cmp && s.cmp.includes(idx);
        const isDone = s.found !== null && idx >= s.found;
        const outOfBounds = s.L !== null && s.R !== null && (idx < s.L || idx > s.R) && !isDone;

        let bg='rgba(255,255,255,0.04)', border='2px solid rgba(255,255,255,0.12)', color='rgba(255,255,255,0.5)';
        if (outOfBounds) { bg='transparent'; border='2px solid rgba(255,255,255,0.06)'; color='rgba(255,255,255,0.15)'; }
        if (isDone)  { bg='rgba(61,255,154,0.15)';  border='2px solid #3dff9a'; color='#3dff9a'; }
        if (isCmp)   { bg='rgba(255,214,10,0.15)';  border='2px solid #ffd60a'; color='#ffd60a'; }
        if (isM)     { bg='rgba(255,60,172,0.2)';   border='2px solid #ff3cac'; color='white'; }

        return (
          <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
            <div style={{
              width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center',
              background:bg, border, color,
              fontFamily:'"Press Start 2P", monospace', fontSize:'12px', transition:'all 0.25s',
              boxShadow: isM ? '0 0 14px rgba(255,60,172,0.5)' : isDone ? '0 0 10px rgba(61,255,154,0.4)' : 'none',
            }}>{num}</div>
            <div style={{ fontFamily:'"Press Start 2P",monospace', fontSize:'8px', color: isM?'#ff3cac':'#ffd60a', minHeight:'14px', textAlign:'center' }}>
              {[isL&&'L', isR&&'R', isM&&'M'].filter(Boolean).join('/')}
            </div>
            <div style={{ fontFamily:'"VT323",monospace', fontSize:'13px', color:'rgba(255,255,255,0.25)' }}>[{idx}]</div>
          </div>
        );
      })}
    </div>
  );
}

function AIChat({ lesson, currentStep, highlightedLine, setHighlightedLine }) {
  const [messages, setMessages] = useState([
    { role:'ai', text:`Hey! I'm your AI tutor for ${lesson.title}. Ask me about any line of code or concept. Click a line number to select it! 🧠` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  useEffect(() => {
    if (highlightedLine !== null) {
      const line = lesson.code.find(l => l.n === highlightedLine);
      if (line?.raw?.trim()) setInput(`Explain line ${highlightedLine}: "${line.raw.trim()}"`);
    }
  }, [highlightedLine]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const nextMessages = [...messages, { role:'user', text:userMsg }];
    setMessages(nextMessages);
    setLoading(true);

    const step = lesson.steps[currentStep];
    const codeStr = lesson.code.map(l => `${l.n}: ${l.raw}`).join('\n');
    const systemPrompt = `You are an expert CS tutor inside EduRoyale, a gamified coding platform. You are teaching "${lesson.title}". The student is on step ${currentStep+1}: "${step.title}". Active lines: ${step.lines.join(', ')}.\n\nCode:\n${codeStr}\n\nKeep answers to 2-4 sentences. Be encouraging. Explain what, why, and edge cases. Plain text only.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          system: systemPrompt,
          messages: nextMessages.map(m => ({ role: m.role==='ai'?'assistant':'user', content: m.text }))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c=>c.text||'').join('') || 'Something went wrong.';
      setMessages(p => [...p, { role:'ai', text:reply }]);
    } catch(e) {
      setMessages(p => [...p, { role:'ai', text:'Network error. Check your connection.' }]);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#06050f', borderLeft:'2px solid rgba(162,89,255,0.3)' }}>
      <div style={{ padding:'10px 16px', borderBottom:'2px solid rgba(162,89,255,0.3)', fontFamily:'"Press Start 2P",monospace', fontSize:'9px', color:'#a259ff', background:'rgba(162,89,255,0.08)', display:'flex', alignItems:'center', gap:'8px' }}>
        🧠 AI TUTOR <span style={{ marginLeft:'auto', color:'rgba(255,255,255,0.2)', fontSize:'7px' }}>CLICK LINE # TO SELECT</span>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:'10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: msg.role==='ai'?'flex-start':'flex-end' }}>
            <div style={{
              maxWidth:'88%', padding:'10px 14px',
              background: msg.role==='ai'?'rgba(162,89,255,0.1)':'rgba(60,172,255,0.1)',
              border: `2px solid ${msg.role==='ai'?'rgba(162,89,255,0.3)':'rgba(60,172,255,0.3)'}`,
              fontFamily:'"VT323",monospace', fontSize:'18px', lineHeight:'1.5',
              color: msg.role==='ai'?'rgba(255,255,255,0.9)':'#3cacff',
            }}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex' }}>
            <div style={{ padding:'10px 16px', background:'rgba(162,89,255,0.1)', border:'2px solid rgba(162,89,255,0.3)', fontFamily:'"Press Start 2P",monospace', fontSize:'8px', color:'#a259ff' }}>THINKING...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ borderTop:'2px solid rgba(162,89,255,0.3)', display:'flex' }}>
        <input
          value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Ask about any line or concept..."
          style={{ flex:1, background:'transparent', border:'none', outline:'none', fontFamily:'"VT323",monospace', fontSize:'18px', color:'white', padding:'12px 14px' }}
        />
        <button onClick={send} disabled={loading||!input.trim()} style={{
          background: loading?'rgba(162,89,255,0.2)':'#a259ff', border:'none', cursor: loading?'not-allowed':'pointer',
          padding:'0 20px', fontFamily:'"Press Start 2P",monospace', fontSize:'9px', color: loading?'rgba(255,255,255,0.3)':'#000',
        }}>ASK ▶</button>
      </div>
    </div>
  );
}

export default function LessonViewer() {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dbModule, setDbModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAI, setShowAI] = useState(true);

  const lessonKey = Object.keys(LESSONS).find(k =>
    k === lessonId || LESSONS[k].title.toLowerCase().replace(/\s+/g,'-') === lessonId
  );
  const lesson = lessonKey ? LESSONS[lessonKey] : null;

  useEffect(() => {
    async function fetchModule() {
      try {
        const { data } = await supabase.from('modules').select('*').eq('id', lessonId).single();
        if (data) setDbModule(data);
      } catch(_) {}
      setLoading(false);
    }
    fetchModule();
  }, [lessonId]);

  const handleComplete = async () => {
    if (user) {
      const xp = lesson?.xp || dbModule?.xp_reward || 100;
      try {
        const { data:p } = await supabase.from('profiles').select('elo').eq('id',user.id).single();
        if (p) await supabase.from('profiles').update({ elo: p.elo+xp }).eq('id',user.id);
      } catch(_) {}
    }
    setIsCompleted(true);
  };

  if (loading) return <div style={{color:'white',padding:'100px',textAlign:'center',fontFamily:'"Press Start 2P",monospace'}}>LOADING HOLODECK...</div>;
  if (!lesson && !dbModule) return (
    <div style={{color:'#ff3cac',padding:'100px',textAlign:'center',fontFamily:'"Press Start 2P",monospace'}}>
      MODULE NOT FOUND.<br/><br/>
      <button onClick={()=>navigate(`/learn/${subjectId}`)} className="px-btn px-btn-o" style={{fontSize:'10px'}}>◀ BACK</button>
    </div>
  );

  const title = lesson?.title || dbModule?.title || 'MODULE';
  const subject = lesson?.subject || dbModule?.subject || subjectId?.toUpperCase() || '';
  const xp = lesson?.xp || dbModule?.xp_reward || 100;
  const currentStep = lesson?.steps[step];

  if (isCompleted) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#06050f'}}>
      <div style={{background:'var(--card)',border:'4px solid #3dff9a',padding:'60px 80px',textAlign:'center',maxWidth:'560px'}}>
        <div style={{fontSize:'80px',marginBottom:'24px'}}>🏆</div>
        <h2 style={{fontFamily:'"Press Start 2P",monospace',color:'#3dff9a',fontSize:'20px',marginBottom:'16px',lineHeight:'1.5'}}>MODULE MASTERED</h2>
        <p style={{color:'#ffd60a',fontFamily:'"Press Start 2P",monospace',marginBottom:'8px',fontSize:'11px'}}>+{xp} ELO REWARDED</p>
        <p style={{color:'var(--muted)',fontFamily:'"VT323",monospace',fontSize:'20px',marginBottom:'36px'}}>{title} added to your Knowledge Tree.</p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>navigate(`/learn/${subjectId}`)} className="px-btn px-btn-g">RETURN TO ARCHIVE ▶</button>
          <button onClick={()=>{setStep(0);setIsCompleted(false);}} className="px-btn px-btn-o">REPLAY</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{height:'100vh',display:'grid',gridTemplateRows:'auto 1fr',background:'#06050f',overflow:'hidden'}}>
      {/* HEADER */}
      <div style={{display:'flex',alignItems:'center',gap:'16px',padding:'10px 20px',borderBottom:'2px solid var(--border)',background:'rgba(0,0,0,0.6)',flexWrap:'wrap',rowGap:'8px'}}>
        <button onClick={()=>navigate(`/learn/${subjectId}`)} className="px-btn px-btn-o" style={{fontSize:'9px',padding:'6px 12px'}}>◀ BACK</button>
        <span className="chip chip-b" style={{fontSize:'9px'}}>{subject}</span>
        <h1 style={{fontFamily:'"Press Start 2P",monospace',fontSize:'clamp(10px,1.4vw,13px)',color:'white',flex:1}}>{title}</h1>
        <span style={{fontFamily:'"Press Start 2P",monospace',fontSize:'9px',color:'#ffd60a'}}>+{xp} XP</span>
        {lesson && (
          <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
            {lesson.steps.map((_,i)=>(
              <div key={i} onClick={()=>setStep(i)} style={{width:'10px',height:'10px',cursor:'pointer',transition:'background 0.2s',
                background: i===step?'#3cacff' : i<step?'#3dff9a':'rgba(255,255,255,0.15)'}}/>
            ))}
          </div>
        )}
        <button onClick={()=>setShowAI(v=>!v)} className={`px-btn ${showAI?'px-btn-p':'px-btn-o'}`} style={{fontSize:'9px',padding:'6px 12px'}}>
          🧠 AI {showAI?'ON':'OFF'}
        </button>
      </div>

      {/* BODY */}
      <div style={{display:'grid', gridTemplateColumns: showAI&&lesson ? '1fr 1fr 320px' : '1fr 1fr', overflow:'hidden', height:'100%'}}>

        {/* LEFT: CODE + EXPLANATION */}
        <div style={{display:'flex',flexDirection:'column',borderRight:'2px solid var(--border)',overflow:'hidden'}}>
          {lesson ? <>
            {/* Code */}
            <div style={{flex:'1 1 60%',overflowY:'auto',borderBottom:'2px solid var(--border)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 16px',borderBottom:'2px solid var(--border)',background:'rgba(60,172,255,0.05)',position:'sticky',top:0,zIndex:2}}>
                <span style={{fontFamily:'"Press Start 2P",monospace',fontSize:'9px',color:'#3cacff'}}>{title.toLowerCase().replace(/ /g,'_')}.py</span>
                <span style={{marginLeft:'auto',fontFamily:'"Press Start 2P",monospace',fontSize:'7px',color:'rgba(255,255,255,0.2)'}}>CLICK LINE # → ASK AI</span>
              </div>
              <div style={{padding:'10px 0'}}>
                {lesson.code.map(line => {
                  const isHL = currentStep?.lines.includes(line.n);
                  const isSel = highlightedLine === line.n;
                  return (
                    <div key={line.n} onClick={()=>line.raw.trim()&&setHighlightedLine(line.n)} style={{
                      display:'flex',alignItems:'flex-start',gap:'12px',padding:'2px 16px',
                      cursor: line.raw.trim()?'pointer':'default',
                      background: isHL?'rgba(255,214,10,0.07)':isSel?'rgba(162,89,255,0.1)':'transparent',
                      borderLeft: isHL?'3px solid #ffd60a':isSel?'3px solid #a259ff':'3px solid transparent',
                      transition:'all 0.12s',
                    }}>
                      <span style={{fontFamily:'"Press Start 2P",monospace',fontSize:'8px',color: isHL?'#ffd60a':isSel?'#a259ff':'rgba(255,255,255,0.18)',width:'22px',flexShrink:0,textAlign:'right',paddingTop:'5px',userSelect:'none'}}>{line.n}</span>
                      <span style={{fontFamily:'"VT323",monospace',fontSize:'19px',lineHeight:'1.7',flex:1}}>
                        {line.tokens.length===0 ? <>&nbsp;</> : line.tokens.map((t,i)=>(
                          <span key={i} style={{color: t.t==='kw'?'#a259ff':t.t==='fn'?'#3cacff':t.t==='nm'?'#3dff9a':t.t==='cm'?'rgba(255,255,255,0.3)':'white'}}>{t.v}</span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Explanation */}
            <div style={{flex:'0 0 auto',padding:'18px 22px',background:'rgba(60,172,255,0.03)',overflowY:'auto',maxHeight:'34%'}}>
              {currentStep && <>
                <div style={{fontFamily:'"Press Start 2P",monospace',fontSize:'9px',color:'#3cacff',marginBottom:'10px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{background:'#3cacff',color:'#000',padding:'2px 8px',fontSize:'8px'}}>STEP {step+1}/{lesson.steps.length}</span>
                  {currentStep.title}
                </div>
                <p style={{fontFamily:'"VT323",monospace',fontSize:'19px',color:'rgba(255,255,255,0.85)',lineHeight:'1.6'}}>{currentStep.explanation}</p>
                {highlightedLine && (
                  <div style={{marginTop:'10px',padding:'8px 12px',background:'rgba(162,89,255,0.08)',border:'2px solid rgba(162,89,255,0.3)',fontFamily:'"VT323",monospace',fontSize:'16px',color:'#a259ff'}}>
                    💡 Line {highlightedLine} selected — ask the AI about it →
                  </div>
                )}
              </>}
            </div>
          </> : (
            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px',textAlign:'center'}}>
              <div>
                <p style={{fontFamily:'"Press Start 2P",monospace',fontSize:'10px',color:'rgba(255,255,255,0.2)',lineHeight:'2'}}>INTERACTIVE CONTENT<br/>COMING SOON</p>
                <p style={{color:'var(--muted)',fontFamily:'"VT323",monospace',fontSize:'20px',marginTop:'12px'}}>{dbModule?.description||''}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: VISUALIZER */}
        <div style={{display:'flex',flexDirection:'column',background:'#020204',overflow:'hidden', borderRight: showAI&&lesson?'2px solid var(--border)':'none'}}>
          <div style={{padding:'10px 16px',borderBottom:'2px solid rgba(255,60,172,0.3)',fontFamily:'"Press Start 2P",monospace',fontSize:'9px',color:'#ff3cac',background:'rgba(255,60,172,0.05)'}}>
            ▶ HOLODECK LIVE
          </div>
          {lesson ? <>
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',gap:'20px',overflowY:'auto'}}>
              <ArrayViz step={step} lesson={lesson} />
              <div style={{background:'#000',border:'2px solid rgba(255,255,255,0.08)',width:'100%',padding:'12px 16px',fontFamily:'"VT323",monospace',fontSize:'19px',color:'#3dff9a',minHeight:'68px',lineHeight:'1.6'}}>
                &gt; {currentStep.title}<br/>
                <span style={{color:'rgba(61,255,154,0.5)',fontSize:'16px'}}>L={currentStep.L??'-'} | R={currentStep.R??'-'} | M={currentStep.M??'-'}</span>
              </div>
              <div style={{display:'flex',gap:'14px',flexWrap:'wrap',justifyContent:'center'}}>
                {[['#ff3cac','Midpoint (M)'],['#ffd60a','Comparing'],['#3dff9a','Sorted/Found'],['rgba(255,255,255,0.15)','Out of bounds']].map(([c,l])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <div style={{width:'9px',height:'9px',background:c}}/>
                    <span style={{fontFamily:'"VT323",monospace',fontSize:'15px',color:'rgba(255,255,255,0.35)'}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{borderTop:'2px solid var(--border)',padding:'14px 18px',display:'flex',alignItems:'center',gap:'10px',background:'rgba(0,0,0,0.4)'}}>
              <button className="px-btn px-btn-o" style={{fontSize:'9px'}} disabled={step===0} onClick={()=>setStep(s=>s-1)}>◀ PREV</button>
              <div style={{flex:1,display:'flex',gap:'3px'}}>
                {lesson.steps.map((_,i)=>(
                  <div key={i} onClick={()=>setStep(i)} title={lesson.steps[i].title} style={{flex:1,height:'5px',cursor:'pointer',
                    background: i===step?'#ff3cac':i<step?'#3dff9a':'rgba(255,255,255,0.1)',transition:'background 0.2s'}}/>
                ))}
              </div>
              {step < lesson.steps.length-1
                ? <button className="px-btn px-btn-p" style={{fontSize:'9px'}} onClick={()=>setStep(s=>s+1)}>NEXT ▶</button>
                : <button className="px-btn px-btn-g" style={{fontSize:'9px'}} onClick={handleComplete}>COMPLETE ✓</button>
              }
            </div>
          </> : (
            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'20px',padding:'40px',textAlign:'center'}}>
              <div style={{fontSize:'70px',opacity:0.15}}>⚙️</div>
              <p style={{fontFamily:'"Press Start 2P",monospace',fontSize:'9px',color:'rgba(255,255,255,0.18)',lineHeight:'2'}}>VISUALIZER NOT YET<br/>BUILT FOR THIS MODULE</p>
              <button className="px-btn px-btn-g" style={{fontSize:'9px'}} onClick={handleComplete}>COMPLETE MODULE ✓</button>
            </div>
          )}
        </div>

        {/* AI PANEL */}
        {showAI && lesson && (
          <AIChat lesson={lesson} currentStep={step} highlightedLine={highlightedLine} setHighlightedLine={setHighlightedLine} />
        )}
      </div>
    </div>
  );
}
ENDOFFILE
echo "✅ src/pages/LessonViewer.jsx done"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All files patched! Now run:"
echo "   git add ."
echo "   git commit -m 'fix: routing + DSA filter + lesson viewer'"
echo "   git push"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

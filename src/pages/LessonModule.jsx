import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function LessonModule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // --- VISUALIZER STATE (For Binary Search) ---
  const [bsStep, setBsStep] = useState(0);
  const bsArray = [2, 8, 15, 23, 42, 56, 71, 89, 95];
  const target = 23;
  const bsPhases = [
    { L: 0, R: 8, M: null, msg: "INITIALIZING SEARCH. Target is 23." },
    { L: 0, R: 8, M: 4, msg: "CALCULATING MIDPOINT. Index 4 is 42." },
    { L: 0, R: 3, M: 4, msg: "42 > 23. Target must be in the LEFT half. Adjusting Right Pointer." },
    { L: 0, R: 3, M: 1, msg: "NEW MIDPOINT. Index 1 is 8." },
    { L: 2, R: 3, M: 1, msg: "8 < 23. Target must be in the RIGHT half. Adjusting Left Pointer." },
    { L: 2, R: 3, M: 2, msg: "NEW MIDPOINT. Index 2 is 15." },
    { L: 3, R: 3, M: 2, msg: "15 < 23. Adjusting Left Pointer." },
    { L: 3, R: 3, M: 3, msg: "NEW MIDPOINT. Index 3 is 23." },
    { L: 3, R: 3, M: 3, msg: "TARGET ACQUIRED. Search complete in O(log n) time." }
  ];

  // --- LESSON CONTENT DICTIONARY ---
  // In the future, this could be moved to Supabase as JSON!
  const lessonContent = {
    'Binary Search Magic': [
      {
        title: "THE O(N) PROBLEM",
        text: "Imagine looking for a word in a dictionary by reading every single page starting from the letter A. That is Linear Search O(n). It is slow, inefficient, and will get you killed in the Arena.",
        type: "theory"
      },
      {
        title: "THE LOGARITHMIC SOLUTION",
        text: "If the data is SORTED, we can do better. We open the book to the exact middle. Is our target word before or after this page? We immediately rip the book in half, throwing away the wrong side.",
        type: "theory"
      },
      {
        title: "HOLODECK SIMULATION",
        text: "Run the simulation on the right. Watch how the Left (L) and Right (R) pointers zero in on the target (23) by constantly recalculating the Midpoint (M).",
        type: "interactive_bs"
      }
    ]
  };

  useEffect(() => {
    async function fetchModule() {
      const { data } = await supabase.from('modules').select('*').eq('id', id).single();
      if (data) setModuleData(data);
      setLoading(false);
    }
    fetchModule();
  }, [id]);

  const handleComplete = async () => {
    if (!user || !moduleData) return;
    
    // Grant XP to the user in the database
    const { data: profile } = await supabase.from('profiles').select('elo').eq('id', user.id).single();
    if (profile) {
      await supabase.from('profiles').update({ elo: profile.elo + moduleData.xp_reward }).eq('id', user.id);
    }
    setIsCompleted(true);
  };

  if (loading) return <div style={{ color: 'var(--white)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>LOADING HOLODECK...</div>;
  if (!moduleData) return <div style={{ color: 'var(--pink)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>MODULE NOT FOUND.</div>;

  // Fallback to generic lesson if content isn't defined yet
  const slides = lessonContent[moduleData.title] || [
    { title: "SYSTEM ERROR", text: "Immersive content for this module is still under construction.", type: "theory" }
  ];
  const current = slides[currentSlide];

  return (
    <div className="page-wrap" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px' }}>
      
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', border: '2px solid var(--border)', padding: '16px', marginBottom: '24px' }}>
        <div>
          <span className="chip chip-b">▶ {moduleData.subject.toUpperCase()}</span>
          <h1 style={{ color: 'var(--white)', fontFamily: '"Press Start 2P", monospace', fontSize: '16px', marginTop: '12px' }}>{moduleData.title}</h1>
        </div>
        <button onClick={() => navigate('/learn')} className="px-btn px-btn-r">ABORT MISSION</button>
      </div>

      {isCompleted ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--card)', border: '4px solid var(--green)' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏆</div>
          <h2 style={{ fontFamily: '"Press Start 2P", monospace', color: 'var(--green)', fontSize: '24px', marginBottom: '16px' }}>MODULE MASTERED</h2>
          <p style={{ color: 'var(--yellow)', fontFamily: '"Press Start 2P", monospace', marginBottom: '32px' }}>+{moduleData.xp_reward} ELO REWARDED</p>
          <button onClick={() => navigate('/learn')} className="px-btn px-btn-g">RETURN TO ARCHIVE</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT SCREEN: MISSION BRIEFING */}
          <div style={{ background: 'var(--card)', border: '3px solid var(--blue)', display: 'flex', flexDirection: 'column', padding: '32px' }}>
            <div style={{ color: 'var(--blue)', fontFamily: '"Press Start 2P", monospace', fontSize: '12px', marginBottom: '32px', borderBottom: '2px solid var(--blue)', paddingBottom: '16px' }}>
              SYSTEM BRIEFING // SLIDE {currentSlide + 1}/{slides.length}
            </div>
            
            <h2 style={{ color: 'var(--white)', fontFamily: '"Press Start 2P", monospace', fontSize: '20px', marginBottom: '24px', lineHeight: '1.5' }}>
              {current.title}
            </h2>
            
            <p style={{ color: 'var(--muted)', fontFamily: '"VT323", monospace', fontSize: '24px', lineHeight: '1.6', flex: 1 }}>
              {current.text}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border)', paddingTop: '24px' }}>
              <button 
                className="px-btn px-btn-o" 
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide(prev => prev - 1)}
              >◀ PREV</button>
              
              {currentSlide === slides.length - 1 ? (
                <button className="px-btn px-btn-g" onClick={handleComplete}>COMPLETE ▶</button>
              ) : (
                <button className="px-btn px-btn-b" onClick={() => setCurrentSlide(prev => prev + 1)}>NEXT ▶</button>
              )}
            </div>
          </div>

          {/* RIGHT SCREEN: THE HOLODECK (VISUALIZER) */}
          <div style={{ background: '#020204', border: '3px solid var(--pink)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <div style={{ position: 'absolute', top: 12, left: 16, color: 'var(--pink)', fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
              ▶ HOLODECK LIVE
            </div>

            {current.type === 'theory' && (
              <div style={{ opacity: 0.3, fontSize: '120px', animation: 'pulse 2s infinite' }}>⚙️</div>
            )}

            {current.type === 'interactive_bs' && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Visual Array */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                  {bsArray.map((num, idx) => {
                    const isLeft = idx === bsPhases[bsStep].L;
                    const isRight = idx === bsPhases[bsStep].R;
                    const isMid = idx === bsPhases[bsStep].M;
                    const isTarget = num === target && bsPhases[bsStep].M === idx && bsStep === bsPhases.length - 1;
                    const outOfBounds = idx < bsPhases[bsStep].L || idx > bsPhases[bsStep].R;

                    let bg = 'rgba(255,255,255,0.05)';
                    let border = '2px solid var(--border)';
                    if (isMid) { bg = 'rgba(255,60,172,0.2)'; border = '2px solid var(--pink)'; }
                    if (isTarget) { bg = 'rgba(61,255,154,0.2)'; border = '2px solid var(--green)'; }
                    
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: bg, border: border, color: outOfBounds ? 'var(--border)' : 'var(--white)',
                          fontFamily: '"Press Start 2P", monospace', fontSize: '12px', transition: 'all 0.3s'
                        }}>
                          {num}
                        </div>
                        <div style={{ height: '24px', marginTop: '8px', fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: 'var(--yellow)' }}>
                          {isLeft && 'L '}
                          {isRight && 'R '}
                          {isMid && 'M'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Console Output */}
                <div style={{ background: '#000', border: '2px solid var(--border)', width: '100%', padding: '16px', fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--green)', minHeight: '80px', marginBottom: '24px' }}>
                  &gt; {bsPhases[bsStep].msg}
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="px-btn px-btn-o" onClick={() => setBsStep(0)}>RESET</button>
                  <button 
                    className="px-btn px-btn-p" 
                    disabled={bsStep === bsPhases.length - 1}
                    onClick={() => setBsStep(prev => prev + 1)}
                  >
                    STEP FORWARD ▶
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
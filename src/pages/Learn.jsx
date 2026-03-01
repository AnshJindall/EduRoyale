import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/learn.css';
import { MASCOT, MASCOT_ALT } from '../mascot';

// Maps URL param (e.g. 'dsa') → actual subject value stored in Supabase
const SUBJECT_MAP = {
  'dsa':    'Data Structures & Algorithms',
  'dbms':   'Database Management',
  'os':     'Operating Systems',
  'cn':     'Computer Networks',
  'ml':     'Machine Learning',
  'ph11':   'Physics',
  'ch11':   'Chemistry',
  'ma11':   'Mathematics',
  'bi11':   'Biology',
  'cs11':   'Computer Science',
  'ph12':   'Physics',
  'ch12':   'Chemistry',
  'ma12':   'Mathematics',
  'bi12':   'Biology',
  'cs12':   'Computer Science',
};

export default function Learn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subjectId } = useParams();

  // Resolve the initial filter from the URL param
  const resolvedSubject = subjectId ? (SUBJECT_MAP[subjectId] ?? 'All') : 'All';

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(resolvedSubject);

  useEffect(() => {
    async function fetchModules() {
      try {
        // Fetch all learning modules from Supabase
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  // Filter modules based on the selected subject tab
  const filteredModules = activeSubject === 'All' 
    ? modules 
    : modules.filter(m => m.subject === activeSubject);

  // Get unique subjects for the tabs
  const subjects = ['All', ...new Set(modules.map(m => m.subject))];

  const handleStartModule = (moduleId, isLocked) => {
    if (isLocked) return;
    navigate(`/learn/module/${moduleId}`);
  };

  if (loading) return <div style={{ color: 'var(--white)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>LOADING DATABANKS...</div>;

  return (
    <div className="page-wrap">
      
      {/* 3D NAV BACK BUTTON */}
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
                onClick={() => handleStartModule(mod.id, mod.is_locked)}
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
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/learn.css'; 

export default function Learn() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState('All');

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

  const handleStartModule = (moduleId) => {
    if (!user) {
      alert("Please login to start a module and earn XP!");
      return;
    }
    // Here you would route them to the actual lesson page
    // e.g., navigate(`/learn/${moduleId}`)
    console.log(`Starting module: ${moduleId}`);
    alert("Module started! (Add routing here later)");
  };

  if (loading) return <div style={{ color: 'var(--white)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>LOADING DATABANKS...</div>;

  return (
    <div className="page-wrap">
      
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div className="chip chip-b">📖 KNOWLEDGE ARCHIVE</div>
        <h1 style={{ color: 'var(--blue)', textShadow: '3px 3px 0 var(--bd)', marginTop: '12px' }}>LEARNING MODULES</h1>
        <p style={{ color: 'var(--muted)', marginTop: '8px' }}>Master concepts to increase your global ELO and unlock new battle arenas.</p>
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
                onClick={() => handleStartModule(mod.id)}
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
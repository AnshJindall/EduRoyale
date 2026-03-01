import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────────────────────
   LESSON CONTENT REGISTRY
   Each lesson: { code, explanation, steps, visualizer }
   ───────────────────────────────────────────────────────────── */
const LESSONS = {
  /* ── BINARY SEARCH ── */
  'binary-search': {
    title: 'Binary Search',
    subject: 'DSA',
    difficulty: 'Beginner',
    xp: 120,
    language: 'Python',
    code: [
      { n: 1,  raw: 'def binary_search(arr, target):',      tokens: [{ t: 'kw', v: 'def ' }, { t: 'fn', v: 'binary_search' }, { t: 'w', v: '(arr, target):' }] },
      { n: 2,  raw: '    left, right = 0, len(arr) - 1',    tokens: [{ t: 'w', v: '    left, right = ' }, { t: 'nm', v: '0' }, { t: 'w', v: ', ' }, { t: 'fn', v: 'len' }, { t: 'w', v: '(arr) - ' }, { t: 'nm', v: '1' }] },
      { n: 3,  raw: '',                                       tokens: [] },
      { n: 4,  raw: '    while left <= right:',              tokens: [{ t: 'kw', v: '    while ' }, { t: 'w', v: 'left <= right:' }] },
      { n: 5,  raw: '        mid = (left + right) // 2',    tokens: [{ t: 'w', v: '        mid = (left + right) // ' }, { t: 'nm', v: '2' }] },
      { n: 6,  raw: '',                                       tokens: [] },
      { n: 7,  raw: '        if arr[mid] == target:',        tokens: [{ t: 'kw', v: '        if ' }, { t: 'w', v: 'arr[mid] == target:' }] },
      { n: 8,  raw: '            return mid',                tokens: [{ t: 'kw', v: '            return ' }, { t: 'nm', v: 'mid' }] },
      { n: 9,  raw: '        elif arr[mid] < target:',       tokens: [{ t: 'kw', v: '        elif ' }, { t: 'w', v: 'arr[mid] < target:' }] },
      { n: 10, raw: '            left = mid + 1',            tokens: [{ t: 'w', v: '            left = mid + ' }, { t: 'nm', v: '1' }] },
      { n: 11, raw: '        else:',                         tokens: [{ t: 'kw', v: '        else:' }] },
      { n: 12, raw: '            right = mid - 1',           tokens: [{ t: 'w', v: '            right = mid - ' }, { t: 'nm', v: '1' }] },
      { n: 13, raw: '',                                       tokens: [] },
      { n: 14, raw: '    return -1  # not found',            tokens: [{ t: 'kw', v: '    return ' }, { t: 'nm', v: '-1' }, { t: 'cm', v: '  # not found' }] },
    ],
    steps: [
      { title: 'INIT POINTERS',      lines: [2],      explanation: 'Set left = 0 (start of array) and right = len(arr) - 1 (end). These two pointers define the current search space.',                                          array: [2,8,15,23,42,56,71,89,95], L: 0, R: 8, M: null, found: null },
      { title: 'ENTER LOOP',         lines: [4],      explanation: 'While left ≤ right, there is still a valid search space. Once they cross, target is not in the array.',                                                     array: [2,8,15,23,42,56,71,89,95], L: 0, R: 8, M: null, found: null },
      { title: 'CALC MIDPOINT',      lines: [5],      explanation: 'mid = (0 + 8) // 2 = 4. We look at index 4. Value is 42. We use integer division to avoid floating point.',                                                  array: [2,8,15,23,42,56,71,89,95], L: 0, R: 8, M: 4,    found: null },
      { title: 'COMPARE: TOO HIGH',  lines: [9, 10],  explanation: 'arr[4] = 42 > target 23. Target must be in the LEFT half. Move left alone — set left = mid + 1? No! arr[mid] < target so we move LEFT pointer up. Wait: 42 > 23, so we go right=mid-1=3.', array: [2,8,15,23,42,56,71,89,95], L: 0, R: 3, M: 4,    found: null },
      { title: 'NEW MIDPOINT',       lines: [5],      explanation: 'mid = (0 + 3) // 2 = 1. Value at index 1 is 8.',                                                                                                             array: [2,8,15,23,42,56,71,89,95], L: 0, R: 3, M: 1,    found: null },
      { title: 'COMPARE: TOO LOW',   lines: [9, 10],  explanation: 'arr[1] = 8 < target 23. Target is in the RIGHT half. Move left pointer: left = mid + 1 = 2.',                                                               array: [2,8,15,23,42,56,71,89,95], L: 2, R: 3, M: 1,    found: null },
      { title: 'NEW MIDPOINT',       lines: [5],      explanation: 'mid = (2 + 3) // 2 = 2. Value at index 2 is 15.',                                                                                                            array: [2,8,15,23,42,56,71,89,95], L: 2, R: 3, M: 2,    found: null },
      { title: 'COMPARE: TOO LOW',   lines: [9, 10],  explanation: 'arr[2] = 15 < 23. Move left pointer: left = 3.',                                                                                                             array: [2,8,15,23,42,56,71,89,95], L: 3, R: 3, M: 2,    found: null },
      { title: 'NEW MIDPOINT',       lines: [5],      explanation: 'mid = (3 + 3) // 2 = 3. Value at index 3 is 23.',                                                                                                            array: [2,8,15,23,42,56,71,89,95], L: 3, R: 3, M: 3,    found: null },
      { title: '✓ TARGET FOUND!',    lines: [7, 8],   explanation: 'arr[3] = 23 == target 23. MATCH! Return mid = 3. Total comparisons: 4. A linear search would have needed 4 too by luck, but on average Binary Search wins massively.', array: [2,8,15,23,42,56,71,89,95], L: 3, R: 3, M: 3,    found: 3 },
    ],
  },

  /* ── BUBBLE SORT ── */
  'bubble-sort': {
    title: 'Bubble Sort',
    subject: 'DSA',
    difficulty: 'Beginner',
    xp: 100,
    language: 'Python',
    code: [
      { n: 1, raw: 'def bubble_sort(arr):',            tokens: [{ t: 'kw', v: 'def ' }, { t: 'fn', v: 'bubble_sort' }, { t: 'w', v: '(arr):' }] },
      { n: 2, raw: '    n = len(arr)',                  tokens: [{ t: 'w', v: '    n = ' }, { t: 'fn', v: 'len' }, { t: 'w', v: '(arr)' }] },
      { n: 3, raw: '    for i in range(n):',            tokens: [{ t: 'kw', v: '    for ' }, { t: 'w', v: 'i ' }, { t: 'kw', v: 'in ' }, { t: 'fn', v: 'range' }, { t: 'w', v: '(n):' }] },
      { n: 4, raw: '        for j in range(n-i-1):',    tokens: [{ t: 'kw', v: '        for ' }, { t: 'w', v: 'j ' }, { t: 'kw', v: 'in ' }, { t: 'fn', v: 'range' }, { t: 'w', v: '(n-i-' }, { t: 'nm', v: '1' }, { t: 'w', v: '):' }] },
      { n: 5, raw: '            if arr[j] > arr[j+1]:', tokens: [{ t: 'kw', v: '            if ' }, { t: 'w', v: 'arr[j] > arr[j+' }, { t: 'nm', v: '1' }, { t: 'w', v: ']:' }] },
      { n: 6, raw: '                arr[j], arr[j+1] = arr[j+1], arr[j]', tokens: [{ t: 'w', v: '                arr[j], arr[j+' }, { t: 'nm', v: '1' }, { t: 'w', v: '] = arr[j+' }, { t: 'nm', v: '1' }, { t: 'w', v: '], arr[j]' }] },
      { n: 7, raw: '    return arr',                    tokens: [{ t: 'kw', v: '    return ' }, { t: 'w', v: 'arr' }] },
    ],
    steps: [
      { title: 'START PASS 1',   lines: [3],    explanation: 'Outer loop i=0. We will bubble the largest element to the end.',                                          array: [64, 34, 25, 12, 22], L: null, R: null, M: null, cmp: [0,1], found: null },
      { title: 'COMPARE j=0',    lines: [4,5],  explanation: 'Compare arr[0]=64 and arr[1]=34. 64 > 34 → SWAP!',                                                        array: [34, 64, 25, 12, 22], L: null, R: null, M: null, cmp: [0,1], found: null },
      { title: 'COMPARE j=1',    lines: [4,5],  explanation: 'Compare arr[1]=64 and arr[2]=25. 64 > 25 → SWAP!',                                                        array: [34, 25, 64, 12, 22], L: null, R: null, M: null, cmp: [1,2], found: null },
      { title: 'COMPARE j=2',    lines: [4,5],  explanation: 'Compare arr[2]=64 and arr[3]=12. 64 > 12 → SWAP!',                                                        array: [34, 25, 12, 64, 22], L: null, R: null, M: null, cmp: [2,3], found: null },
      { title: 'COMPARE j=3',    lines: [4,5],  explanation: 'Compare arr[3]=64 and arr[4]=22. 64 > 22 → SWAP! 64 is now in its final sorted position.',                array: [34, 25, 12, 22, 64], L: null, R: null, M: null, cmp: [3,4], found: 4 },
      { title: 'PASS 2 COMPLETE',lines: [3],    explanation: 'Pass 2 continues, bubbling 34 into place. The algorithm continues until no swaps are needed.',            array: [25, 12, 22, 34, 64], L: null, R: null, M: null, cmp: null,  found: 3 },
      { title: '✓ SORTED!',      lines: [7],    explanation: 'After n-1 passes, the array is fully sorted. Time complexity O(n²) — it compares every pair, multiple times. Space O(1).', array: [12, 22, 25, 34, 64], L: null, R: null, M: null, cmp: null,  found: null },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────
   ARRAY VISUALIZER
   ───────────────────────────────────────────────────────────── */
function ArrayViz({ step, lesson }) {
  const s = lesson.steps[step];
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {s.array.map((num, idx) => {
        const isL   = idx === s.L;
        const isR   = idx === s.R;
        const isM   = idx === s.M;
        const isCmp = s.cmp && s.cmp.includes(idx);
        const isDone= s.found === idx || (s.found !== null && idx >= s.found);

        let bg     = 'rgba(255,255,255,0.04)';
        let border = '2px solid rgba(255,255,255,0.12)';
        let color  = 'rgba(255,255,255,0.4)';

        if (isDone)  { bg = 'rgba(61,255,154,0.15)'; border = '2px solid var(--green)'; color = 'var(--green)'; }
        if (isCmp)   { bg = 'rgba(255,214,10,0.15)'; border = '2px solid var(--yellow)'; color = 'var(--yellow)'; }
        if (isM)     { bg = 'rgba(255,60,172,0.2)'; border = '2px solid var(--pink)'; color = 'var(--white)'; }

        const outOfBounds = s.L !== null && s.R !== null && (idx < s.L || idx > s.R) && !isDone;
        if (outOfBounds) { bg = 'transparent'; border = '2px solid rgba(255,255,255,0.06)'; color = 'rgba(255,255,255,0.15)'; }

        const labels = [];
        if (isL) labels.push('L');
        if (isR) labels.push('R');
        if (isM) labels.push('M');

        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '52px', height: '52px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: bg, border, color,
              fontFamily: '"Press Start 2P", monospace', fontSize: '13px',
              transition: 'all 0.25s',
              boxShadow: isM ? '0 0 12px rgba(255,60,172,0.5)' : isDone ? '0 0 10px rgba(61,255,154,0.4)' : 'none',
            }}>
              {num}
            </div>
            <div style={{
              fontFamily: '"Press Start 2P", monospace', fontSize: '9px',
              color: isM ? 'var(--pink)' : 'var(--yellow)', minHeight: '16px', textAlign: 'center',
            }}>
              {labels.join('/')}
            </div>
            <div style={{ fontFamily: '"VT323", monospace', fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
              [{idx}]
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AI CHAT PANEL
   ───────────────────────────────────────────────────────────── */
function AIChat({ lesson, currentStep, highlightedLine }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hey! I'm your AI tutor for ${lesson.title}. Ask me about any line of code, a specific step, or the theory behind it. You can also click a line number to ask about it directly! 🧠` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When user clicks a line, auto-populate the question
  useEffect(() => {
    if (highlightedLine !== null) {
      const line = lesson.code.find(l => l.n === highlightedLine);
      if (line && line.raw.trim()) {
        setInput(`Explain line ${highlightedLine}: "${line.raw.trim()}"`);
      }
    }
  }, [highlightedLine, lesson.code]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const step = lesson.steps[currentStep];
    const codeStr = lesson.code.map(l => `${l.n}: ${l.raw}`).join('\n');

    const systemPrompt = `You are an expert CS tutor inside EduRoyale, a gamified coding education platform. 
You are teaching "${lesson.title}" (${lesson.subject}, ${lesson.difficulty}).
The student is currently on step ${currentStep + 1} of ${lesson.steps.length}: "${step.title}".
The highlighted lines are: ${step.lines.join(', ')}.

Here is the full code:
\`\`\`${lesson.language.toLowerCase()}
${codeStr}
\`\`\`

Keep answers concise (2-4 sentences max). Use a slightly gamified, encouraging tone. 
Use technical terms but always explain them. If asked about a line, explain WHAT it does, WHY it's needed, and any edge cases.
Format: plain text only, no markdown formatting.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages
              .filter(m => m.role !== 'ai' || messages.indexOf(m) > 0)
              .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMsg }
          ]
        })
      });
      const data = await response.json();
      const reply = data.content?.map(c => c.text || '').join('') || 'Something went wrong. Try again!';
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Network error. Check your connection.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#06050f', border: '3px solid rgba(162,89,255,0.4)',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px', borderBottom: '2px solid rgba(162,89,255,0.3)',
        fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'var(--purple)',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(162,89,255,0.08)',
      }}>
        <span>🧠</span> AI TUTOR
        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: '8px' }}>
          CLICK A LINE # TO ASK
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.role === 'ai' ? 'flex-start' : 'flex-end',
          }}>
            <div style={{
              maxWidth: '85%', padding: '10px 14px',
              background: msg.role === 'ai' ? 'rgba(162,89,255,0.12)' : 'rgba(60,172,255,0.12)',
              border: `2px solid ${msg.role === 'ai' ? 'rgba(162,89,255,0.3)' : 'rgba(60,172,255,0.3)'}`,
              fontFamily: '"VT323", monospace', fontSize: '18px', lineHeight: '1.5',
              color: msg.role === 'ai' ? 'rgba(255,255,255,0.9)' : 'var(--blue)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              padding: '10px 16px', background: 'rgba(162,89,255,0.12)', border: '2px solid rgba(162,89,255,0.3)',
              fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'var(--purple)',
              animation: 'pulse 1s steps(1) infinite',
            }}>
              THINKING...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '2px solid rgba(162,89,255,0.3)', display: 'flex' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about any line or concept..."
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: '"VT323", monospace', fontSize: '18px', color: 'var(--white)',
            padding: '12px 14px',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: loading ? 'rgba(162,89,255,0.2)' : 'var(--purple)',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            padding: '0 20px',
            fontFamily: '"Press Start 2P", monospace', fontSize: '9px',
            color: loading ? 'rgba(255,255,255,0.3)' : '#000',
            transition: 'all 0.1s',
          }}
        >
          ASK ▶
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN LESSON VIEWER
   ───────────────────────────────────────────────────────────── */
export default function LessonViewer() {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Try to find lesson from registry first; fall back to Supabase data
  const [dbModule, setDbModule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find lesson key: try lessonId directly, then by matching title slug
  const lessonKey = Object.keys(LESSONS).find(k =>
    k === lessonId ||
    LESSONS[k].title.toLowerCase().replace(/\s+/g, '-') === lessonId
  );
  const lesson = lessonKey ? LESSONS[lessonKey] : null;

  const [step, setStep] = useState(0);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAI, setShowAI] = useState(true);

  useEffect(() => {
    async function fetchModule() {
      try {
        const { data } = await supabase.from('modules').select('*').eq('id', lessonId).single();
        if (data) setDbModule(data);
      } catch (_) {}
      setLoading(false);
    }
    fetchModule();
  }, [lessonId]);

  const handleComplete = async () => {
    if (!user) return;
    const xpReward = lesson?.xp || dbModule?.xp_reward || 100;
    try {
      const { data: profile } = await supabase.from('profiles').select('elo').eq('id', user.id).single();
      if (profile) {
        await supabase.from('profiles').update({ elo: profile.elo + xpReward }).eq('id', user.id);
      }
    } catch (_) {}
    setIsCompleted(true);
  };

  if (loading) return (
    <div style={{ color: 'var(--white)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>
      LOADING HOLODECK...
    </div>
  );

  // If we have neither a local lesson nor a DB record, show error
  if (!lesson && !dbModule) return (
    <div style={{ color: 'var(--pink)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>
      MODULE NOT FOUND.
      <br /><br />
      <button onClick={() => navigate(`/learn/${subjectId}`)} className="px-btn px-btn-o" style={{ fontSize: '10px' }}>
        ◀ BACK
      </button>
    </div>
  );

  // Use local lesson data if available, fallback to DB module for title/etc
  const moduleTitle  = lesson?.title  || dbModule?.title  || 'MODULE';
  const moduleSubject = lesson?.subject || dbModule?.subject || subjectId?.toUpperCase() || '';
  const moduleDiff   = lesson?.difficulty || dbModule?.difficulty || 'STANDARD';
  const moduleXP     = lesson?.xp    || dbModule?.xp_reward || 100;
  const currentStep  = lesson ? lesson.steps[step] : null;

  /* ── COMPLETION SCREEN ── */
  if (isCompleted) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#06050f', padding: '40px',
    }}>
      <div style={{
        background: 'var(--card)', border: '4px solid var(--green)',
        padding: '60px 80px', textAlign: 'center', maxWidth: '600px',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🏆</div>
        <h2 style={{ fontFamily: '"Press Start 2P", monospace', color: 'var(--green)', fontSize: '22px', marginBottom: '16px', lineHeight: '1.5' }}>
          MODULE MASTERED
        </h2>
        <p style={{ color: 'var(--yellow)', fontFamily: '"Press Start 2P", monospace', marginBottom: '8px', fontSize: '12px' }}>
          +{moduleXP} ELO REWARDED
        </p>
        <p style={{ color: 'var(--muted)', fontFamily: '"VT323", monospace', fontSize: '22px', marginBottom: '40px' }}>
          {moduleTitle} has been added to your Knowledge Tree.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(`/learn/${subjectId}`)} className="px-btn px-btn-g">
            RETURN TO ARCHIVE ▶
          </button>
          <button onClick={() => { setStep(0); setIsCompleted(false); }} className="px-btn px-btn-o">
            REPLAY MODULE
          </button>
        </div>
      </div>
    </div>
  );

  /* ── MAIN LAYOUT ── */
  return (
    <div style={{
      height: '100vh', display: 'grid',
      gridTemplateRows: 'auto 1fr',
      background: '#06050f', overflow: 'hidden',
    }}>

      {/* ── HEADER BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '12px 24px', borderBottom: '2px solid var(--border)',
        background: 'rgba(0,0,0,0.6)', flexWrap: 'wrap', rowGap: '8px',
      }}>
        <button
          onClick={() => navigate(`/learn/${subjectId}`)}
          className="px-btn px-btn-o"
          style={{ fontSize: '9px', padding: '6px 14px' }}
        >
          ◀ BACK
        </button>

        <span className="chip chip-b" style={{ fontSize: '9px' }}>
          {moduleSubject}
        </span>
        <h1 style={{
          fontFamily: '"Press Start 2P", monospace', fontSize: 'clamp(10px,1.5vw,14px)',
          color: 'var(--white)', flex: 1,
        }}>
          {moduleTitle}
        </h1>

        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'var(--yellow)' }}>
          +{moduleXP} XP
        </span>

        {/* Step progress */}
        {lesson && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {lesson.steps.map((_, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: '10px', height: '10px',
                  background: i === step ? 'var(--blue)' : i < step ? 'var(--green)' : 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setShowAI(v => !v)}
          className={`px-btn ${showAI ? 'px-btn-p' : 'px-btn-o'}`}
          style={{ fontSize: '9px', padding: '6px 12px' }}
        >
          🧠 AI {showAI ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* ── BODY GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showAI ? '1fr 1fr 340px' : '1fr 1fr',
        gap: '0px',
        overflow: 'hidden',
        height: '100%',
      }}>

        {/* ── LEFT: CODE + EXPLANATION ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '2px solid var(--border)', overflow: 'hidden',
        }}>
          {lesson ? (
            <>
              {/* Code panel */}
              <div style={{
                flex: '1 1 60%', overflowY: 'auto', padding: '0',
                borderBottom: '2px solid var(--border)',
              }}>
                {/* Code header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 16px', borderBottom: '2px solid var(--border)',
                  background: 'rgba(60,172,255,0.06)', position: 'sticky', top: 0, zIndex: 2,
                }}>
                  <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'var(--blue)' }}>
                    {moduleTitle.replace(' ', '_').toLowerCase()}.{lesson.language === 'Python' ? 'py' : 'js'}
                  </span>
                  <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: 'var(--muted)', marginLeft: 'auto' }}>
                    {lesson.language}
                  </span>
                  <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: 'var(--muted)', opacity: 0.5 }}>
                    CLICK LINE # TO ASK AI
                  </span>
                </div>

                {/* Code lines */}
                <div style={{ padding: '12px 0' }}>
                  {lesson.code.map(line => {
                    const isHighlighted = currentStep && currentStep.lines.includes(line.n);
                    const isClickHl = highlightedLine === line.n;
                    return (
                      <div
                        key={line.n}
                        onClick={() => line.raw.trim() && setHighlightedLine(line.n)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '12px',
                          padding: '3px 16px', cursor: line.raw.trim() ? 'pointer' : 'default',
                          background: isHighlighted ? 'rgba(255,214,10,0.08)' : isClickHl ? 'rgba(162,89,255,0.12)' : 'transparent',
                          borderLeft: isHighlighted ? '3px solid var(--yellow)' : isClickHl ? '3px solid var(--purple)' : '3px solid transparent',
                          transition: 'background 0.15s, border 0.15s',
                        }}
                      >
                        <span style={{
                          fontFamily: '"Press Start 2P", monospace', fontSize: '9px',
                          color: isHighlighted ? 'var(--yellow)' : isClickHl ? 'var(--purple)' : 'rgba(255,255,255,0.2)',
                          width: '24px', flexShrink: 0, textAlign: 'right', paddingTop: '5px',
                          userSelect: 'none',
                        }}>
                          {line.n}
                        </span>
                        <span style={{ fontFamily: '"VT323", monospace', fontSize: '19px', lineHeight: '1.7', flex: 1 }}>
                          {line.tokens.length === 0 ? <>&nbsp;</> : line.tokens.map((tok, ti) => (
                            <span key={ti} style={{
                              color: tok.t === 'kw' ? 'var(--purple)'
                                   : tok.t === 'fn' ? 'var(--blue)'
                                   : tok.t === 'nm' ? 'var(--green)'
                                   : tok.t === 'cm' ? 'rgba(255,255,255,0.3)'
                                   : 'var(--white)',
                            }}>
                              {tok.v}
                            </span>
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation panel */}
              <div style={{
                flex: '0 0 auto', padding: '20px 24px',
                background: 'rgba(60,172,255,0.04)',
                overflowY: 'auto', maxHeight: '35%',
              }}>
                {currentStep && (
                  <>
                    <div style={{
                      fontFamily: '"Press Start 2P", monospace', fontSize: '10px',
                      color: 'var(--blue)', marginBottom: '12px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <span style={{
                        background: 'var(--blue)', color: '#000', padding: '2px 8px', fontSize: '8px',
                      }}>
                        STEP {step + 1}/{lesson.steps.length}
                      </span>
                      {currentStep.title}
                    </div>
                    <p style={{
                      fontFamily: '"VT323", monospace', fontSize: '20px',
                      color: 'rgba(255,255,255,0.85)', lineHeight: '1.6',
                    }}>
                      {currentStep.explanation}
                    </p>
                    {highlightedLine && (
                      <div style={{
                        marginTop: '12px', padding: '10px 14px',
                        background: 'rgba(162,89,255,0.08)', border: '2px solid rgba(162,89,255,0.3)',
                        fontFamily: '"VT323", monospace', fontSize: '17px', color: 'var(--purple)',
                      }}>
                        💡 Line {highlightedLine} selected — Ask the AI about it →
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            /* No local lesson content */
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: '"Press Start 2P", monospace', fontSize: '11px', lineHeight: '2' }}>
                INTERACTIVE CONTENT<br />COMING SOON<br /><br />
                <span style={{ color: 'var(--blue)', fontSize: '9px' }}>{dbModule?.description || ''}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: STEP VISUALIZER ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderRight: showAI ? '2px solid var(--border)' : 'none',
          background: '#020204', overflow: 'hidden',
        }}>
          {/* Viz header */}
          <div style={{
            padding: '10px 16px', borderBottom: '2px solid rgba(255,60,172,0.3)',
            fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'var(--pink)',
            background: 'rgba(255,60,172,0.06)', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span>▶ HOLODECK LIVE</span>
            {lesson && (
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: '8px' }}>
                ARRAY: TARGET=23
              </span>
            )}
          </div>

          {lesson ? (
            <>
              {/* Array visualization */}
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '24px', gap: '24px', overflowY: 'auto',
              }}>
                <ArrayViz step={step} lesson={lesson} />

                {/* Console output */}
                <div style={{
                  background: '#000', border: '2px solid rgba(255,255,255,0.1)',
                  width: '100%', padding: '14px 16px',
                  fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--green)',
                  minHeight: '72px', lineHeight: '1.6',
                }}>
                  &gt; {currentStep.title}<br />
                  <span style={{ color: 'rgba(61,255,154,0.6)', fontSize: '17px' }}>
                    L={currentStep.L ?? '-'} | R={currentStep.R ?? '-'} | M={currentStep.M ?? '-'}
                  </span>
                </div>

                {/* Step legend */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { color: 'var(--pink)', label: 'M: Midpoint' },
                    { color: 'var(--yellow)', label: 'Comparing' },
                    { color: 'var(--green)', label: 'Sorted / Found' },
                    { color: 'rgba(255,255,255,0.15)', label: 'Out of bounds' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', background: item.color }} />
                      <span style={{ fontFamily: '"VT323", monospace', fontSize: '16px', color: 'rgba(255,255,255,0.4)' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step navigation controls */}
              <div style={{
                borderTop: '2px solid var(--border)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(0,0,0,0.4)',
              }}>
                <button
                  className="px-btn px-btn-o"
                  style={{ fontSize: '9px' }}
                  disabled={step === 0}
                  onClick={() => setStep(s => s - 1)}
                >
                  ◀ PREV
                </button>

                <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                  {lesson.steps.map((s2, i) => (
                    <div
                      key={i}
                      onClick={() => setStep(i)}
                      title={s2.title}
                      style={{
                        flex: 1, height: '6px', cursor: 'pointer',
                        background: i === step ? 'var(--pink)' : i < step ? 'var(--green)' : 'rgba(255,255,255,0.1)',
                        transition: 'background 0.2s',
                      }}
                    />
                  ))}
                </div>

                {step < lesson.steps.length - 1 ? (
                  <button
                    className="px-btn px-btn-p"
                    style={{ fontSize: '9px' }}
                    onClick={() => setStep(s => s + 1)}
                  >
                    NEXT ▶
                  </button>
                ) : (
                  <button
                    className="px-btn px-btn-g"
                    style={{ fontSize: '9px' }}
                    onClick={handleComplete}
                  >
                    COMPLETE ✓
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '80px', opacity: 0.2 }}>⚙️</div>
                <p style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '16px' }}>
                  VISUALIZER NOT YET BUILT<br />FOR THIS MODULE
                </p>
                <button
                  className="px-btn px-btn-g"
                  style={{ fontSize: '9px', marginTop: '24px' }}
                  onClick={handleComplete}
                >
                  COMPLETE MODULE ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── AI CHAT PANEL ── */}
        {showAI && lesson && (
          <AIChat
            lesson={lesson}
            currentStep={step}
            highlightedLine={highlightedLine}
          />
        )}
      </div>
    </div>
  );
}

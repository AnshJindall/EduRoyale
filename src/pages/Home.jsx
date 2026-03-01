import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css'; 

export default function Home() {
  // ─── SCROLL REVEAL EFFECT ───
  useEffect(() => {
    const revEls = document.querySelectorAll('.reveal');
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('vis');
      });
    }, { threshold: 0.1 });
    
    revEls.forEach((el) => ro.observe(el));
    return () => ro.disconnect(); 
  }, []);

  // ─── MINI BINARY SEARCH VISUALIZER STATE (Example Module) ───
  const array = [1, 3, 5, 8, 12, 15, 22];
  const target = 15;
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(array.length - 1);
  const [mid, setMid] = useState(-1);
  const [status, setStatus] = useState('INIT');

  const resetViz = () => {
    setIsPlaying(false);
    setStep(0); setLeft(0); setRight(array.length - 1);
    setMid(-1); setStatus('INIT');
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        if (status === 'FOUND') {
          setIsPlaying(false);
          return;
        }

        const currentMid = Math.floor((left + right) / 2);
        
        if (mid === -1) {
          setMid(currentMid);
          setStatus('CHECKING');
        } else if (array[mid] === target) {
          setStatus('FOUND');
          setStep((s) => s + 1);
        } else if (array[mid] < target) {
          setLeft(mid + 1);
          setMid(-1);
          setStep((s) => s + 1);
          setStatus('NARROWING RIGHT');
        } else {
          setRight(mid - 1);
          setMid(-1);
          setStep((s) => s + 1);
          setStatus('NARROWING LEFT');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, left, right, mid, status, target, array]);

  return (
    <>
      <section className="hero">
        <div className="pixel-grid"></div>
        <div className="debris" style={{ left: '7%', top: '22%', animationDelay: '0s' }}>⭐</div>
        <div className="debris" style={{ left: '88%', top: '35%', animationDelay: '1s' }}>✦</div>
        <div className="debris" style={{ left: '14%', top: '65%', animationDelay: '2s' }}>◆</div>
        <div className="debris" style={{ left: '82%', top: '70%', animationDelay: '.5s' }}>★</div>
        <div className="debris" style={{ left: '93%', top: '18%', animationDelay: '1.5s', fontSize: '10px' }}>■</div>
        <div className="debris" style={{ left: '3%', top: '50%', animationDelay: '3s', fontSize: '10px' }}>●</div>

        <div className="hero-badge"><span className="bdot"></span> ★ 12,000+ STUDENTS IN THE ARENA ★</div>

        <h1 className="hero-h1">
          <span className="h1-w">LEARNING HITS </span><span className="h1-g">DIFFERENT</span><br />
          <span className="h1-p">WHEN U CAN SEE IT</span>
        </h1>

        <p className="hero-sub">
          Watch CS, Physics, and Math <strong>come alive step-by-step</strong>. Battle real opponents,<br />
          and actually understand the concepts. No more blind memorization.
        </p>

        <div className="hero-ctas">
          <Link to="/battle" className="px-btn px-btn-r">⚔ ENTER ARENA</Link>
          <Link to="/learn" className="px-btn px-btn-b">📖 CHOOSE SUBJECT</Link>
          <button className="px-btn px-btn-o">▶ SEE LIVE</button>
        </div>

        <div className="social-proof">
          <div className="avs">
            <div className="av av-a">😎</div><div className="av av-b">🤖</div>
            <div className="av av-c">💀</div><div className="av av-d">🔥</div><div className="av av-e">⚡</div>
          </div>
          <div className="pt">Join <strong>12,000+ students</strong> who stopped guessing and started visualizing</div>
        </div>

        {/* ─── MINI VISUALIZER (CS EXAMPLE) ─── */}
        <div className="viz-card">
          <div className="viz-bar">
            <div className="mdot md-r"></div><div className="mdot md-y"></div><div className="mdot md-g"></div>
            <div className="vfn">EXAMPLE: computer_science.exe</div>
            <div className="v-live"><div className="ldot"></div> LIVE</div>
          </div>
          <div className="viz-body">
            <div className="algo-lbl">▶ BINARY SEARCH — TARGET: {target}</div>
            <div className="arr-row">
              {array.map((num, i) => {
                let classes = "ab ";
                if (i < left || i > right) classes += "dim ";
                if (i === mid && status !== 'FOUND') classes += "active ";
                if (i === mid && status === 'FOUND') classes += "found ";
                return <div key={i} className={classes.trim()}>{num}</div>;
              })}
            </div>
          </div>
          <div className="viz-foot">
            <div className="step-i">STEP {step} — <span>{status}</span></div>
            <div className="viz-ctrl">
              <button className="vc vc-p" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? '⏸ PAUSE' : '▶ RUN'}
              </button>
              <button className="vc vc-s" onClick={resetViz}>↺</button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MULTI-SUBJECT TICKER ─── */}
      <div className="ticker">
        <div className="t-track">
          <div className="ti">🎮 <span className="ac2">ALGO_MASTER</span> solved Dynamic Programming in 0.8s <span className="ts">❖</span></div>
          <div className="ti">⚔ <span className="ac2">TESLA_GHOST</span> defeated NEWTON in Physics 1v1 <span className="ts">❖</span></div>
          <div className="ti">🔊 SQL Joins visualization now has 3D audio narration <span className="ts">❖</span></div>
          <div className="ti">🏆 <span className="ac2">CHEM_NERD</span> hit Level 50 — Grandmaster! <span className="ts">❖</span></div>
          <div className="ti">✨ New Wave Optics & Thermodynamics visualizations live <span className="ts">❖</span></div>
          <div className="ti">📈 <span className="ac2">MATH_GOD</span> climbed 12 spots on Calculus leaderboard <span className="ts">❖</span></div>
          {/* Duplicate for infinite scroll loop */}
          <div className="ti">🎮 <span className="ac2">ALGO_MASTER</span> solved Dynamic Programming in 0.8s <span className="ts">❖</span></div>
          <div className="ti">⚔ <span className="ac2">TESLA_GHOST</span> defeated NEWTON in Physics 1v1 <span className="ts">❖</span></div>
          <div className="ti">🔊 SQL Joins visualization now has 3D audio narration <span className="ts">❖</span></div>
          <div className="ti">🏆 <span className="ac2">CHEM_NERD</span> hit Level 50 — Grandmaster! <span className="ts">❖</span></div>
          <div className="ti">✨ New Wave Optics & Thermodynamics visualizations live <span className="ts">❖</span></div>
          <div className="ti">📈 <span className="ac2">MATH_GOD</span> climbed 12 spots on Calculus leaderboard <span className="ts">❖</span></div>
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section className="sec"><div className="sw">
        <div className="reveal">
          <div className="chip chip-g">✦ FEATURES</div>
          <div className="sttl" style={{ marginTop: '10px' }}>EVERYTHING U NEED<br />TO ACTUALLY GET IT</div>
          <div className="ssub">Not another boring textbook. Visual, competitive, addictive.</div>
        </div>
        <div className="fg">
          <div className="fc fc-g reveal" style={{ position: 'relative', transitionDelay: '.05s' }}>
            <span className="ctag tag-n">NEW</span>
            <div className="fi fi-g">🎬</div><div className="ct">VISUAL ENGINE</div>
            <div className="cd">From code recursion to chemical bonds and physics vectors. Everything plays out frame by frame.</div>
          </div>
          <div className="fc fc-r reveal" style={{ position: 'relative', transitionDelay: '.1s' }}>
            <span className="ctag tag-h">🔥 HOT</span>
            <div className="fi fi-r">⚔️</div><div className="ct">1v1 MULTI-SUBJECT ARENA</div>
            <div className="cd">Battle real opponents in DSA, Math, DBMS, and Sciences. Ranked. Timed. Auto-judged.</div>
          </div>
          <div className="fc fc-p reveal" style={{ position: 'relative', transitionDelay: '.15s' }}>
            <div className="fi fi-p">🤖</div><div className="ct">AI DOUBT BOT</div>
            <div className="cd">Stuck on a concept? Ask anything. Explains logic, finds bugs, and breaks down formulas 24/7.</div>
          </div>
          <div className="fw reveal" style={{ transitionDelay: '.2s' }}>
            <div className="fw-text">
              <div className="chip chip-p">💡 INTERACTIVE CONCEPTS</div>
              <div className="ct" style={{ fontSize: '14px', marginTop: '10px' }}>SEE COMPLEX LOGIC LIVE</div>
              <div className="cd" style={{ fontSize: '18px', maxWidth: '360px', marginTop: '6px' }}>
                Watch algorithms process data, databases join tables, and math equations graph themselves in real-time. Understand the "why", not just the "how".
              </div>
              <Link to="/learn" className="px-btn px-btn-b" style={{ marginTop: '14px', display: 'inline-flex' }}>📖 BROWSE SUBJECTS</Link>
            </div>
            <div className="fw-demo">
              <div className="mv">
                <div className="mvl">▶ EXAMPLE: RECURSION TREE</div>
                <div className="tr" id="homeTree">
                  <div className="trow"><div className="tn">8</div></div>
                  <div className="trow"><div className="tn">3</div><div className="tn">10</div></div>
                  <div className="trow"><div className="tn">1</div><div className="tn">6</div><div className="tn">14</div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="fc fc-b reveal" style={{ transitionDelay: '.05s' }}>
            <div className="fi fi-b">🔊</div><div className="ct">AUDIO ENGINE</div>
            <div className="cd">Every step spoken aloud. Toggle on/off, 0.8x–1.5x speed, live captions for accessibility.</div>
          </div>
          <div className="fc fc-y reveal" style={{ transitionDelay: '.1s' }}>
            <div className="fi fi-y">📊</div><div className="ct">GLOBAL STATS</div>
            <div className="cd">Track accuracy, solve time, and weak topics across all your subjects. Know exactly what to grind.</div>
          </div>
        </div>
      </div></section>

      {/* ─── LEADERBOARD ─── */}
      <section className="sec"><div className="sw" style={{ paddingTop: '40px' }}>
        <div className="reveal">
          <div className="chip chip-y">🏆 LEADERBOARD</div>
          <div className="sttl" style={{ marginTop: '10px' }}>WHO'S RUNNING<br />THE ACADEMY RN</div>
        </div>
        <div className="lb">
          <div className="lr gold reveal" style={{ transitionDelay: '.05s' }}>
            <div className="lrk rg">#1</div><div className="lav">🤖</div>
            <div className="li"><div className="ln">ALGO_MASTER</div><div className="la">Specialty: Computer Science & DSA</div></div>
            <div className="lbd">
              <span className="lbg" style={{ color: 'var(--yellow)', borderColor: 'rgba(255,214,10,.4)', background: 'rgba(255,214,10,.08)' }}>👑 GRANDMASTER</span>
              <span className="lbg" style={{ color: 'var(--green)', borderColor: 'rgba(61,255,154,.3)' }}>🔥 47 STREAK</span>
            </div>
            <div className="lsc">9,842</div><div className="lwl">47W/3L</div>
          </div>
          <div className="lr silver reveal" style={{ transitionDelay: '.1s' }}>
            <div className="lrk rs">#2</div><div className="lav">⚡</div>
            <div className="li"><div className="ln">NEWTON_PRO</div><div className="la">Specialty: Physics & Calculus</div></div>
            <div className="lbd"><span className="lbg" style={{ color: 'var(--blue)', borderColor: 'rgba(60,172,255,.3)' }}>💎 DIAMOND</span></div>
            <div className="lsc">8,211</div><div className="lwl">41W/6L</div>
          </div>
          <div className="lr bronze reveal" style={{ transitionDelay: '.15s' }}>
            <div className="lrk rb">#3</div><div className="lav">🗄️</div>
            <div className="li"><div className="ln">QUERY_BOSS</div><div className="la">Specialty: Database Management</div></div>
            <div className="lbd"><span className="lbg" style={{ color: 'var(--purple)', borderColor: 'rgba(162,89,255,.3)' }}>🌟 MASTER</span></div>
            <div className="lsc">7,890</div><div className="lwl">38W/9L</div>
          </div>
          <div className="lr reveal" style={{ transitionDelay: '.2s' }}>
            <div className="lrk ro">#4</div><div className="lav">🧪</div>
            <div className="li"><div className="ln">CHEM_WIZ</div><div className="la">Specialty: Organic Chemistry</div></div>
            <div className="lbd"></div><div className="lsc">7,445</div><div className="lwl">36W/11L</div>
          </div>
        </div>
      </div></section>

      {/* ─── CTA & FOOTER ─── */}
      <div className="cta-wrap reveal si">
        <div className="cta-box">
          <span className="cta-em">🚀</span>
          <div className="oi"><span className="oi-dot"></span> 284 PLAYERS ONLINE</div>
          <div className="cta-t">
            STOP MEMORIZING<br />
            <span style={{ color: 'var(--green)', textShadow: '2px 2px 0 var(--gd)' }}>BORING TEXTBOOKS.</span><br />
            <span style={{ color: 'var(--blue)', textShadow: '2px 2px 0 var(--bd)' }}>PLAY THEM INSTEAD.</span>
          </div>
          <div className="cta-s">Free to start. No credit card. Just you, the knowledge, and the arena.</div>
          <div className="cta-bs">
            <Link to="/battle" className="px-btn px-btn-r">⚔ ENTER BATTLE</Link>
            <Link to="/learn" className="px-btn px-btn-b">📖 BROWSE SUBJECTS</Link>
          </div>
        </div>
      </div>

      <footer>
        <div className="fl">▶ Eduroyale</div>
        <div className="fli">
          <Link to="/learn">LEARN</Link>
          <Link to="/battle">ARENA</Link>
          <Link to="#">RANKS</Link>
          <Link to="#">GUILDS</Link>
          <Link to="#">PRIVACY</Link>
        </div>
        <div className="fc2">© 2026 Eduroyale · MADE WITH 8BIT LOVE</div>
      </footer>
    </>
  );
}
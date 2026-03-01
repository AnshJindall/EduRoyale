import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import '../styles/learn.css'; // We will put the CSS here!

export default function SubjectSelection() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear in case of re-mounts (React StrictMode)
    container.innerHTML = '';

    // ── COURSE DATA ──
    const COURSES = {
      college: [
        // Notice the URL here is just 'dsa'
        { id: 'dsa',  label: 'DATA STRUCTURES\n& ALGORITHMS', icon: '🌲', color: 0x3dff9a, hex: '#3dff9a', url: 'dsa' },
        { id: 'dbms', label: 'DATABASE\nMANAGEMENT',          icon: '🗄️', color: 0x3cacff, hex: '#3cacff' },
        { id: 'os',   label: 'OPERATING\nSYSTEMS',            icon: '⚙️', color: 0xa259ff, hex: '#a259ff' },
        { id: 'cn',   label: 'COMPUTER\nNETWORKS',            icon: '🌐', color: 0xff6b35, hex: '#ff6b35' },
        { id: 'ml',   label: 'MACHINE\nLEARNING',             icon: '🤖', color: 0xffd60a, hex: '#ffd60a' },
      ],
      class11: [
        { id: 'ph11', label: 'PHYSICS',           icon: '⚡', color: 0x3cacff, hex: '#3cacff' },
        { id: 'ch11', label: 'CHEMISTRY',         icon: '🧪', color: 0x3dff9a, hex: '#3dff9a' },
        { id: 'ma11', label: 'MATHEMATICS',       icon: '📐', color: 0xffd60a, hex: '#ffd60a' },
        { id: 'bi11', label: 'BIOLOGY',           icon: '🧬', color: 0xff6b35, hex: '#ff6b35' },
        { id: 'cs11', label: 'COMPUTER\nSCIENCE', icon: '💻', color: 0xa259ff, hex: '#a259ff' },
      ],
      class12: [
        { id: 'ph12', label: 'PHYSICS',           icon: '⚡', color: 0x3cacff, hex: '#3cacff' },
        { id: 'ch12', label: 'CHEMISTRY',         icon: '🧪', color: 0x3dff9a, hex: '#3dff9a' },
        { id: 'ma12', label: 'MATHEMATICS',       icon: '📐', color: 0xffd60a, hex: '#ffd60a' },
        { id: 'bi12', label: 'BIOLOGY',           icon: '🧬', color: 0xff6b35, hex: '#ff6b35' },
        { id: 'cs12', label: 'COMPUTER\nSCIENCE', icon: '💻', color: 0xa259ff, hex: '#a259ff' },
      ],
    };

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06050f);
    scene.fog = new THREE.Fog(0x06050f, 60, 120);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 7, 18);
    camera.lookAt(0, 0, -8);

    // ── LIGHTING ──
    scene.add(new THREE.AmbientLight(0x111133, 6));
    const moonLight = new THREE.DirectionalLight(0x6688cc, 1.8);
    moonLight.position.set(-15, 25, 5);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.set(1024, 1024);
    scene.add(moonLight);

    const auroraGreen = new THREE.PointLight(0x3dff9a, 2.5, 60);
    auroraGreen.position.set(-15, 10, -20);
    scene.add(auroraGreen);

    const auroraPurple = new THREE.PointLight(0xa259ff, 1.8, 50);
    auroraPurple.position.set(15, 8, -15);
    scene.add(auroraPurple);

    const penguinLight = new THREE.PointLight(0xffffff, 3.5, 22);
    penguinLight.position.set(0, 4, 10);
    scene.add(penguinLight);

    // ── MOON & STARS ──
    const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), new THREE.MeshStandardMaterial({ color: 0xddeeff, emissive: 0xaabbdd, emissiveIntensity: 1.0, roughness: 1 }));
    moon.position.set(-25, 35, -70);
    scene.add(moon);
    
    const halo = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16), new THREE.MeshBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.25, side: THREE.BackSide }));
    halo.position.copy(moon.position);
    scene.add(halo);

    const starMeshes = [];
    const starColors = [0xffffff, 0x3dff9a, 0x3cacff, 0xa259ff, 0xffd60a, 0xffffff, 0xffffff];
    for (let i = 0; i < 280; i++) {
      const sz = Math.random() < 0.7 ? 0.08 : 0.16;
      const star = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, sz), new THREE.MeshBasicMaterial({ color: starColors[Math.floor(Math.random() * starColors.length)], transparent: true, opacity: 0.4 + Math.random() * 0.6 }));
      star.position.set((Math.random() - 0.5) * 200, 10 + Math.random() * 55, (Math.random() - 0.5) * 200);
      star.userData.twinkleOffset = Math.random() * Math.PI * 2;
      scene.add(star);
      starMeshes.push(star);
    }

    // ── OCEAN & SHORE ──
    const waterGeo = new THREE.PlaneGeometry(300, 200, 20, 20);
    const wPos = waterGeo.attributes.position;
    for (let i = 0; i < wPos.count; i++) wPos.setY(i, wPos.getY(i) + (Math.random() - 0.5) * 0.1);
    waterGeo.computeVertexNormals();
    const water = new THREE.Mesh(waterGeo, new THREE.MeshStandardMaterial({ color: 0x04030e, roughness: 0.3, metalness: 0.75, flatShading: true }));
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.3, -50);
    water.receiveShadow = true;
    scene.add(water);

    const shoreMat = new THREE.MeshStandardMaterial({ color: 0x13112a, flatShading: true, roughness: 1 });
    const shore = new THREE.Mesh(new THREE.BoxGeometry(300, 1.2, 50), shoreMat);
    shore.position.set(0, -0.65, 30);
    shore.receiveShadow = true;
    scene.add(shore);

    // ── PENGUIN ──
    const penguinGroup = new THREE.Group();
    const pBlack = new THREE.MeshStandardMaterial({ color: 0x1e1c3a, flatShading: true, emissive: 0x0a0820, emissiveIntensity: 0.3 });
    const pWhite = new THREE.MeshStandardMaterial({ color: 0xf0eeff, flatShading: true, emissive: 0xccccff, emissiveIntensity: 0.2 });
    const pOrange = new THREE.MeshStandardMaterial({ color: 0xff8c00, flatShading: true, emissive: 0xff4400, emissiveIntensity: 0.6 });

    [-0.62, 0.62].forEach(side => {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 1.1), pOrange);
      foot.position.set(side, 0.09, 0.2); foot.rotation.y = side < 0 ? 0.2 : -0.2; penguinGroup.add(foot);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.65, 8), pOrange);
      leg.position.set(side, 0.5, 0); penguinGroup.add(leg);
    });
    
    const pbody = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 12), pBlack); pbody.position.set(0, 1.7, 0); pbody.scale.set(1.15, 1.3, 1.05); pbody.castShadow = true; penguinGroup.add(pbody);
    const pbelly = new THREE.Mesh(new THREE.SphereGeometry(0.78, 12, 12), pWhite); pbelly.position.set(0, 1.65, -0.72); pbelly.scale.set(0.95, 1.15, 0.5); penguinGroup.add(pbelly);
    const phead = new THREE.Mesh(new THREE.SphereGeometry(0.88, 12, 12), pBlack); phead.position.set(0, 3.15, 0); phead.castShadow = true; penguinGroup.add(phead);
    const pmask = new THREE.Mesh(new THREE.SphereGeometry(0.66, 12, 12), pWhite); pmask.position.set(0, 3.12, -0.56); pmask.scale.set(0.9, 0.82, 0.48); penguinGroup.add(pmask);
    const pbeak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.52, 8), pOrange); pbeak.position.set(0, 3.08, -0.92); pbeak.rotation.x = -Math.PI / 2; penguinGroup.add(pbeak);

    [-0.28, 0.28].forEach(side => {
      const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff })); eyeW.position.set(side, 3.26, -0.82); penguinGroup.add(eyeW);
      const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshBasicMaterial({ color: 0x000000 })); eyeB.position.set(side, 3.26, -0.91); penguinGroup.add(eyeB);
    });

    [-1, 1].forEach(side => {
      const flipper = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), pBlack); flipper.position.set(side * 1.32, 1.72, 0.05); flipper.scale.set(0.32, 1.55, 0.55); flipper.rotation.z = side * 0.45; penguinGroup.add(flipper);
    });

    penguinGroup.position.set(0, 0, 7); penguinGroup.rotation.y = Math.PI;
    scene.add(penguinGroup);

    // ── ICE BLOCKS STATE ──
    let currentLevel = 'college';
    let currentPage  = 0;
    let isSnapping   = false;
    const ITEMS_PER_PAGE = 4;
    const GRID_POS = [{ x: -12, z: -5 }, { x: 12, z: -5 }, { x: -12, z: -16 }, { x: 12, z: -16 }];
    
    let iceBlocks = [];
    let labelEls  = [];

    function buildIceBlocks(level) {
      iceBlocks.forEach(g => { scene.remove(g); g.traverse(c => { if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose(); }); });
      iceBlocks = [];
      labelEls.forEach(el => el.remove());
      labelEls = [];

      COURSES[level].forEach(data => {
        const iceGrp = new THREE.Group();
        const colMat = new THREE.MeshStandardMaterial({ color: data.color, flatShading: true, roughness: 0.5, emissive: data.color, emissiveIntensity: 0.18 });
        [{ x: 0, z: 0, s: 1.3, e: 6 }, { x: 0.65, z: 0.45, s: 1.0, e: 5 }, { x: -0.5, z: -0.6, s: 0.95, e: 7 }, { x: 0.45, z: -0.5, s: 0.85, e: 6 }].forEach(c => {
          const mesh = new THREE.Mesh(new THREE.CylinderGeometry(c.s, c.s + 0.12, 0.45, c.e), colMat);
          mesh.position.set(c.x, 0, c.z); mesh.rotation.y = Math.random() * Math.PI; mesh.receiveShadow = mesh.castShadow = true; mesh.userData.parentGroup = iceGrp; iceGrp.add(mesh);
        });

        iceGrp.userData = { id: data.id, url: data.url, baseScale: 1.9, baseY: 0.1 };
        iceGrp.position.set(0, -12, 0); iceGrp.scale.setScalar(1.9);
        scene.add(iceGrp); iceBlocks.push(iceGrp);

        const lbl = document.createElement('div');
        lbl.className = 'ice-label'; lbl.style.display = 'none';
        lbl.innerHTML = `<span class="ice-icon">${data.icon}</span><span class="ice-name" style="border-color:${data.hex}55;box-shadow:0 0 12px ${data.hex}44">${data.label.replace('\n', '<br>')}</span>`;
        container.appendChild(lbl); labelEls.push(lbl);
      });
    }

    function positionBlocks(animated) {
      const pageStart = currentPage * ITEMS_PER_PAGE;
      iceBlocks.forEach((grp, idx) => {
        const slot = idx - pageStart;
        if (slot >= 0 && slot < ITEMS_PER_PAGE) {
          const pos = GRID_POS[slot];
          if (animated) { gsap.killTweensOf(grp.position); gsap.to(grp.position, { x: pos.x, y: grp.userData.baseY, z: pos.z, duration: 0.7, delay: slot * 0.08, ease: 'back.out(1.4)' }); }
          else grp.position.set(pos.x, grp.userData.baseY, pos.z);
          labelEls[idx].style.display = 'flex'; labelEls[idx].style.opacity = '0';
          setTimeout(() => { labelEls[idx].style.opacity = '1'; }, animated ? 500 + slot * 80 : 50);
        } else {
          if (animated) { gsap.killTweensOf(grp.position); gsap.to(grp.position, { y: -12, duration: 0.3, ease: 'power2.in' }); setTimeout(() => { labelEls[idx].style.display = 'none'; }, 310); }
          else { grp.position.y = -12; labelEls[idx].style.display = 'none'; }
          labelEls[idx].style.opacity = '0';
        }
      });
      updateDots();
    }

    function buildDots() {
      let dots = document.getElementById('page-dots');
      if (!dots) { dots = document.createElement('div'); dots.id = 'page-dots'; container.appendChild(dots); }
      const totalPages = Math.ceil(COURSES[currentLevel].length / ITEMS_PER_PAGE);
      dots.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const d = document.createElement('div'); d.className = 'page-dot' + (i === currentPage ? ' active' : '');
        d.onclick = () => { currentPage = i; positionBlocks(true); }; dots.appendChild(d);
      }
    }
    function updateDots() { document.querySelectorAll('.page-dot').forEach((d, i) => d.classList.toggle('active', i === currentPage)); }

    // ── UI OVERLAYS ──
    const toggle = document.createElement('div'); toggle.id = 'level-toggle';
    toggle.innerHTML = `<button class="ltog-btn" data-level="class11">11TH</button><button class="ltog-btn" data-level="class12">12TH</button><button class="ltog-btn active" data-level="college">COLLEGE</button>`;
    container.appendChild(toggle);
    toggle.querySelectorAll('.ltog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggle.querySelectorAll('.ltog-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
        iceBlocks.forEach(g => { gsap.killTweensOf(g.position); gsap.to(g.position, { y: -12, duration: 0.28, ease: 'power2.in' }); });
        labelEls.forEach(l => { l.style.opacity = '0'; });
        setTimeout(() => {
          labelEls.forEach(l => { l.style.display = 'none'; });
          currentLevel = btn.dataset.level; currentPage = 0;
          buildIceBlocks(currentLevel); buildDots();
          setTimeout(() => positionBlocks(true), 60);
        }, 300);
      });
    });

    const backBtn = document.createElement('button'); backBtn.id = 'nav3d-back'; backBtn.innerHTML = '◀ BACK'; backBtn.onclick = () => navigate('/');
    container.appendChild(backBtn);

    const title = document.createElement('div'); title.id = 'nav3d-title'; title.innerHTML = `<span class="n3t-line1">CHOOSE YOUR</span><span class="n3t-line2">SUBJECT<span class="n3t-cursor">█</span></span>`;
    container.appendChild(title);

    buildIceBlocks(currentLevel); buildDots();
    camera.position.set(0, 3, 18);
    gsap.to(camera.position, { y: 7, z: 18, duration: 2.0, ease: 'power2.out', onUpdate: () => camera.lookAt(0, 0, -8) });
    setTimeout(() => positionBlocks(true), 800);

    // ── INTERACTION EVENTS ──
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;

    const onMouseMove = e => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(iceBlocks, true);
      hovered = hits.length ? hits[0].object.userData.parentGroup : null;
      document.body.style.cursor = hovered ? 'pointer' : 'default';
    };

    const onClick = () => {
      if (!hovered || !hovered.userData.url) return;
      // ROUTES TO /learn/dsa
      navigate(`/learn/${hovered.userData.url}`);
    };

    let scrollAccum = 0;
    const onWheel = e => {
      e.preventDefault(); scrollAccum += e.deltaY;
      if (Math.abs(scrollAccum) >= 30 && !isSnapping) {
        const dir = scrollAccum > 0 ? 1 : -1; scrollAccum = 0; isSnapping = true;
        const maxPage = Math.ceil(COURSES[currentLevel].length / ITEMS_PER_PAGE) - 1;
        currentPage = Math.max(0, Math.min(maxPage, currentPage + dir));
        positionBlocks(true);
        setTimeout(() => { isSnapping = false; }, 600);
      }
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    container.addEventListener('wheel', onWheel, { passive: false });

    // ── RENDER LOOP ──
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      penguinGroup.rotation.y = Math.sin(t * 0.4) * 0.1; pbody.position.y = 1.3 + Math.sin(t * 1.1) * 0.06;
      starMeshes.forEach(s => s.material.opacity = Math.max(0.05, 0.4 + Math.sin(t * 1.5 + s.userData.twinkleOffset) * 0.4));
      auroraGreen.intensity = 2.5 + Math.sin(t * 0.6) * 1.0; auroraPurple.intensity = 1.8 + Math.sin(t * 0.45 + 2) * 0.8; penguinLight.intensity = 1.2 + Math.sin(t * 0.9) * 0.3;
      
      iceBlocks.forEach((grp, i) => {
        if (grp.position.y > -3) {
          grp.position.y = grp.userData.baseY + Math.sin(t * 0.9 + i * 1.5) * 0.08;
          const s = grp.userData.baseScale * (grp === hovered ? 1.14 : 1.0);
          grp.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
        }
        if (labelEls[i] && labelEls[i].style.display !== 'none') {
          const v = grp.position.clone(); v.y += 1.5; v.project(camera);
          labelEls[i].style.left = `${(v.x * 0.5 + 0.5) * window.innerWidth}px`; labelEls[i].style.top = `${(-v.y * 0.5 + 0.5) * window.innerHeight}px`;
        }
      });
      renderer.render(scene, camera);
    }
    animate();

    // ── CLEANUP (Crucial for React!) ──
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('wheel', onWheel);
      document.body.style.cursor = 'default';
      renderer.dispose();
      gsap.globalTimeline.clear();
      if (container) container.innerHTML = '';
    };

  }, [navigate]);

  return (
    <div ref={containerRef} id="nav-3d-container"></div>
  );
}
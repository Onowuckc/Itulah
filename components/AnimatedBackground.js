'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedBackground() {
  const mountRef = useRef(null);
  const modes = ['fusion', 'steel', 'gold'];
  const [modeIndex, setModeIndex] = useState(0);
  const [focusClass, setFocusClass] = useState('');

  useEffect(() => {
    // Swap out ambient background mode every 8 seconds
    const interval = setInterval(() => {
      setModeIndex((prevIndex) => (prevIndex + 1) % modes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [modes.length]);

  useEffect(() => {
    // Optional focus event from division hovers
    const handleBgFocus = (e) => {
      if (e.detail && e.detail.division) {
        setFocusClass(`bg-focus-${e.detail.division}`);
      } else {
        setFocusClass('');
      }
    };

    window.addEventListener('itulah-bg-focus', handleBgFocus);
    return () => window.removeEventListener('itulah-bg-focus', handleBgFocus);
  }, []);

  // Three.js Interactive 3D WebGL Canvas Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup with Depth Fog (#070D18)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070d18, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    container.appendChild(renderer.domElement);

    // 4. Interactive Particle Field with Itulah Red & Itulah Blue Palette
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#DC2626'), // Official Itulah Crimson Red
      new THREE.Color('#EF4444'), // Vibrant Electric Red
      new THREE.Color('#1D4ED8'), // Official Itulah Royal Navy Blue
      new THREE.Color('#38BDF8'), // Sky Blue Primary
      new THREE.Color('#00E5FF'), // Electric Sky Accent
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with Soft Dual-Tone Red/Blue Texture
    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 1.3,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Spatial Grid Structure (High-Tech 3D Mesh Grid in Red & Blue)
    const gridGroup = new THREE.Group();

    const gridHelper = new THREE.GridHelper(100, 50, 0xdc2626, 0x0b1320);
    gridHelper.position.y = -15;
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    gridGroup.add(gridHelper);

    const ceilingGrid = new THREE.GridHelper(100, 50, 0x1d4ed8, 0x0b1320);
    ceilingGrid.position.y = 25;
    ceilingGrid.material.opacity = 0.3;
    ceilingGrid.material.transparent = true;
    gridGroup.add(ceilingGrid);

    // Wireframe Engineering Cubes / Structural Nodes (Red & Blue)
    const cubeGeo = new THREE.IcosahedronGeometry(8, 2);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const floatingNode1 = new THREE.Mesh(cubeGeo, cubeMat);
    floatingNode1.position.set(-25, 8, -10);
    gridGroup.add(floatingNode1);

    const floatingNode2 = new THREE.Mesh(
      new THREE.OctahedronGeometry(6, 1),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      })
    );
    floatingNode2.position.set(28, -6, -15);
    gridGroup.add(floatingNode2);

    scene.add(gridGroup);

    // 6. Floating Image / Hologram Planes (Red and Blue accent wireframes)
    const planeGeo = new THREE.PlaneGeometry(12, 7);
    const planeMat1 = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const plane1 = new THREE.Mesh(planeGeo, planeMat1);
    plane1.position.set(-18, -4, -5);
    plane1.rotation.y = Math.PI / 6;
    scene.add(plane1);

    const planeMat2 = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const plane2 = new THREE.Mesh(planeGeo, planeMat2);
    plane2.position.set(20, 10, -8);
    plane2.rotation.y = -Math.PI / 5;
    scene.add(plane2);

    // 7. Lighting - Dual Red & Blue Point Lights
    const ambientLight = new THREE.AmbientLight(0x0b1320, 2);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xef4444, 3, 65);
    redLight.position.set(-20, 15, 10);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3, 65);
    blueLight.position.set(20, -15, 10);
    scene.add(blueLight);

    // 8. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.05;
      mouseY = (event.clientY - windowHalfY) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 0.1;
      camera.position.y = -targetY * 0.1;
      camera.lookAt(scene.position);

      // Rotate particle field gently
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = elapsedTime * 0.015;

      // Oscillate spatial grid & floating nodes
      gridGroup.rotation.y = Math.sin(elapsedTime * 0.1) * 0.08;
      floatingNode1.rotation.x = elapsedTime * 0.2;
      floatingNode1.rotation.y = elapsedTime * 0.3;

      floatingNode2.rotation.x = -elapsedTime * 0.25;
      floatingNode2.rotation.z = elapsedTime * 0.15;

      plane1.position.y = -4 + Math.sin(elapsedTime * 0.8) * 1.5;
      plane2.position.y = 10 + Math.cos(elapsedTime * 0.7) * 1.2;

      // Pulse dual red & blue point light positions
      redLight.position.x = Math.sin(elapsedTime * 0.5) * 25;
      redLight.position.z = Math.cos(elapsedTime * 0.5) * 25;

      blueLight.position.x = -Math.sin(elapsedTime * 0.5) * 25;
      blueLight.position.z = -Math.cos(elapsedTime * 0.5) * 25;

      renderer.render(scene, camera);
    };

    animate();

    // Helper for soft dual-color particle texture canvas
    function createParticleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.35, 'rgba(239, 68, 68, 0.8)');
      gradient.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
      gradient.addColorStop(1, 'rgba(7, 13, 24, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  const currentMode = modes[modeIndex];

  return (
    <div className={`animated-bg-container bg-mode-${currentMode} ${focusClass}`}>
      {/* Fixed WebGL 3D Canvas Layer */}
      <div ref={mountRef} className="webgl-canvas-mount" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
      <div className="bg-ambient-light" />
      <div className="bg-layer bg-layer-1" title="Security & Tech Matrix Grid (background1.jpg)" />
      <div className="bg-layer bg-layer-2" title="Azure Steel & Telecom Texture (background2.jpg)" />
      <div className="bg-layer bg-layer-3" title="Liquid Gold & Fragrance Curves (background3.jpg)" />
      <div className="bg-overlay" />
    </div>
  );
}

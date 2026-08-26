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
    scene.fog = new THREE.FogExp2(0x070d18, 0.012);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 35);

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

    // 4. Interactive Particle Field with Itulah Red & Blue Palette
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#DC2626'), // Official Itulah Crimson Red
      new THREE.Color('#EF4444'), // Vibrant Electric Red
      new THREE.Color('#1D4ED8'), // Official Itulah Royal Navy Blue
      new THREE.Color('#38BDF8'), // Sky Blue Primary
      new THREE.Color('#00E5FF'), // Electric Sky Accent
      new THREE.Color('#F59E0B'), // Warm Amber Glow Accent
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 1.2,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Spatial Grid Structure
    const gridGroup = new THREE.Group();

    const gridHelper = new THREE.GridHelper(120, 40, 0xdc2626, 0x0b1320);
    gridHelper.position.y = -18;
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    gridGroup.add(gridHelper);

    const ceilingGrid = new THREE.GridHelper(120, 40, 0x1d4ed8, 0x0b1320);
    ceilingGrid.position.y = 28;
    ceilingGrid.material.opacity = 0.25;
    ceilingGrid.material.transparent = true;
    gridGroup.add(ceilingGrid);

    scene.add(gridGroup);

    // 6. Floating 3D Image Planes (Fragrance & Wild Octopus Image Animations)
    const imageFiles = [
      { url: '/img/wildOctopus1.jpeg', aspect: 1.0, type: 'octopus' },
      { url: '/img/WildOctopus2.jpeg', aspect: 1.0, type: 'octopus' },
      { url: '/img/wildOctopus1.jpeg', aspect: 0.8, type: 'octopus' },
      { url: '/img/fragrance1.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/Fragrance2.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/Fragrance3.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance4.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance5.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/Fragrance6.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance7.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance8.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance9.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance10.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance11.jpeg', aspect: 1.0, type: 'fragrance' },
      { url: '/img/fragrance12.jpeg', aspect: 1.0, type: 'fragrance' },
    ];

    const textureLoader = new THREE.TextureLoader();
    const floatingPlanes = [];

    // Pre-calculate spatial layout coordinates around camera view
    const cardPositions = [
      { x: -32, y: 12, z: -10, rotY: 0.35, rotX: 0.1 },
      { x: 34, y: 14, z: -12, rotY: -0.4, rotX: -0.1 },
      { x: -36, y: -10, z: -15, rotY: 0.45, rotX: 0.15 },
      { x: 36, y: -12, z: -14, rotY: -0.35, rotX: -0.1 },
      { x: -22, y: 18, z: -25, rotY: 0.25, rotX: 0.05 },
      { x: 24, y: -20, z: -22, rotY: -0.3, rotX: -0.05 },
      { x: 0, y: 22, z: -30, rotY: 0.1, rotX: -0.1 },
      { x: -42, y: 2, z: -20, rotY: 0.5, rotX: 0.0 },
      { x: 42, y: 0, z: -24, rotY: -0.5, rotX: 0.0 },
      { x: -18, y: -22, z: -28, rotY: 0.2, rotX: 0.1 },
      { x: 18, y: 20, z: -28, rotY: -0.25, rotX: -0.1 },
      { x: -28, y: 0, z: -35, rotY: 0.3, rotX: 0.0 },
      { x: 28, y: 2, z: -35, rotY: -0.3, rotX: 0.0 },
      { x: -10, y: -18, z: -32, rotY: 0.15, rotX: 0.05 },
      { x: 10, y: -16, z: -32, rotY: -0.15, rotX: -0.05 },
    ];

    imageFiles.forEach((img, idx) => {
      const pos = cardPositions[idx % cardPositions.length];
      const cardWidth = img.type === 'octopus' ? 9.5 : 8.0;
      const cardHeight = cardWidth * (img.aspect || 1);

      const planeGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);

      textureLoader.load(
        img.url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.generateMipmaps = true;

          const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.72,
            side: THREE.DoubleSide,
            depthWrite: false,
          });

          const mesh = new THREE.Mesh(planeGeo, planeMat);
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.rotation.set(pos.rotX, pos.rotY, 0);

          // Add glowing 3D wireframe backer card frame
          const frameBorderGeo = new THREE.PlaneGeometry(cardWidth + 0.6, cardHeight + 0.6);
          const frameColor = img.type === 'octopus' ? 0xef4444 : 0x38bdf8;
          const frameMat = new THREE.MeshBasicMaterial({
            color: frameColor,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
          });
          const frameMesh = new THREE.Mesh(frameBorderGeo, frameMat);
          frameMesh.position.z = -0.1;
          mesh.add(frameMesh);

          scene.add(mesh);

          floatingPlanes.push({
            mesh,
            initialY: pos.y,
            initialX: pos.x,
            initialRotY: pos.rotY,
            initialRotX: pos.rotX,
            speed: 0.4 + (idx % 5) * 0.12,
            offset: idx * 0.7,
            rotSpeed: (idx % 2 === 0 ? 1 : -1) * 0.15,
          });
        },
        undefined,
        (err) => console.warn(`Could not load background 3D texture ${img.url}`, err)
      );
    });

    // 7. Lighting - Dual Red & Blue Point Lights
    const ambientLight = new THREE.AmbientLight(0x0b1320, 2.5);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xef4444, 3.5, 75);
    redLight.position.set(-25, 15, 15);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3.5, 75);
    blueLight.position.set(25, -15, 15);
    scene.add(blueLight);

    // 8. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.04;
      mouseY = (event.clientY - windowHalfY) * 0.04;
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
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      camera.position.x = targetX * 0.12;
      camera.position.y = -targetY * 0.12;
      camera.lookAt(scene.position);

      // Rotate particle field gently
      particleSystem.rotation.y = elapsedTime * 0.025;
      particleSystem.rotation.x = elapsedTime * 0.012;

      // Oscillate spatial grid
      gridGroup.rotation.y = Math.sin(elapsedTime * 0.08) * 0.06;

      // Animate floating 3D Fragrance and Wild Octopus image holograms
      floatingPlanes.forEach((item) => {
        const floatY = Math.sin(elapsedTime * item.speed + item.offset) * 1.8;
        const floatX = Math.cos(elapsedTime * (item.speed * 0.7) + item.offset) * 1.0;

        item.mesh.position.y = item.initialY + floatY;
        item.mesh.position.x = item.initialX + floatX;
        item.mesh.rotation.y = item.initialRotY + Math.sin(elapsedTime * 0.3 + item.offset) * 0.15;
        item.mesh.rotation.x = item.initialRotX + Math.cos(elapsedTime * 0.25 + item.offset) * 0.08;
      });

      // Pulse point lights
      redLight.position.x = Math.sin(elapsedTime * 0.4) * 30;
      redLight.position.z = Math.cos(elapsedTime * 0.4) * 30;

      blueLight.position.x = -Math.sin(elapsedTime * 0.4) * 30;
      blueLight.position.z = -Math.cos(elapsedTime * 0.4) * 30;

      renderer.render(scene, camera);
    };

    animate();

    // Helper for soft particle texture canvas
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
      <div
        ref={mountRef}
        className="webgl-canvas-mount"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div className="bg-ambient-light" />
      <div className="bg-layer bg-layer-1" title="Matrix Grid (background1.jpg)" />
      <div className="bg-layer bg-layer-2" title="Azure Steel Texture (background2.jpg)" />
      <div className="bg-layer bg-layer-3" title="Liquid Gold & Fragrance Curves (background3.jpg)" />
      <div className="bg-overlay" />
    </div>
  );
}


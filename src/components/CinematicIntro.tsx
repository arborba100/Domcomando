import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  type: 'spark' | 'smoke' | 'debris';
  size: number;
}

export default function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [showTitle, setShowTitle] = useState(false);
  const cameraShakeRef = useRef({ intensity: 0, duration: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup with cinematic atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);
    scene.fog = new THREE.Fog(0x0a0e1a, 50, 200);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      precision: 'highp',
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Professional cinematic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    // Fill light for cinematic look
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    fillLight.position.set(-10, 8, -10);
    scene.add(fillLight);

    // Back light for separation
    const backLight = new THREE.DirectionalLight(0xff6600, 0.4);
    backLight.position.set(0, 10, -15);
    scene.add(backLight);

    // Create urban environment
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1f2e,
      metalness: 0.1,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create luxury car with better geometry
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 4.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 1,
    });
    const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carBody.position.y = 0.6;
    carBody.castShadow = true;
    carBody.receiveShadow = true;
    carGroup.add(carBody);

    // Windows
    const windowGeometry = new THREE.BoxGeometry(1.8, 0.8, 1.2);
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
    });
    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    frontWindow.position.set(0, 1.2, 0.8);
    carGroup.add(frontWindow);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.6,
      roughness: 0.4,
    });
    
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      wheel.position.set(
        i < 2 ? -0.9 : 0.9,
        0.5,
        i % 2 === 0 ? -1.2 : 1.2
      );
      carGroup.add(wheel);
    }

    carGroup.position.set(-15, 0, 0);
    carGroup.castShadow = true;
    scene.add(carGroup);

    // Create helicopter with better proportions
    const helicopterGroup = new THREE.Group();
    
    // Main fuselage
    const fuselageGeometry = new THREE.BoxGeometry(1.2, 1, 3);
    const fuselageMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.7,
      roughness: 0.3,
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.castShadow = true;
    fuselage.receiveShadow = true;
    helicopterGroup.add(fuselage);

    // Rotor blades (more realistic)
    const rotorGeometry = new THREE.BoxGeometry(8, 0.1, 0.4);
    const rotorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
    rotor.position.y = 1.2;
    rotor.castShadow = true;
    helicopterGroup.add(rotor);

    // Tail rotor
    const tailRotorGeometry = new THREE.BoxGeometry(0.2, 0.1, 2);
    const tailRotor = new THREE.Mesh(tailRotorGeometry, rotorMaterial);
    tailRotor.position.set(0.5, 0.8, -1.5);
    tailRotor.rotation.z = Math.PI / 2;
    helicopterGroup.add(tailRotor);

    helicopterGroup.position.set(20, 8, -5);
    helicopterGroup.castShadow = true;
    scene.add(helicopterGroup);

    // Animation loop
    let animationFrameId: number;
    let startTime = Date.now();
    const duration = 8000;

    const createParticle = (
      position: THREE.Vector3,
      type: 'spark' | 'smoke' | 'debris'
    ) => {
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        Math.random() * 0.2 + 0.1,
        (Math.random() - 0.5) * 0.3
      );

      particlesRef.current.push({
        position: position.clone(),
        velocity,
        life: 1,
        maxLife: type === 'smoke' ? 2.5 : 1.5,
        type,
        size: Math.random() * 0.3 + 0.1,
      });
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth car movement with easing
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      carGroup.position.x = -15 + easeProgress * 35;
      carGroup.rotation.z = Math.sin(progress * Math.PI * 2) * 0.05;

      // Helicopter pursuit with dynamic movement
      const helicopterProgress = Math.max(0, progress - 0.1);
      helicopterGroup.position.x = 20 - helicopterProgress * 30;
      helicopterGroup.position.y = 8 + Math.sin(helicopterProgress * Math.PI * 2.5) * 1.5;
      helicopterGroup.position.z = -5 + Math.cos(helicopterProgress * Math.PI * 1.5) * 2;

      // Rotor rotation
      rotor.rotation.z += 0.5;
      tailRotor.rotation.x += 0.8;

      // Cinematic camera shake
      if (progress > 0.2) {
        const shakeIntensity = Math.sin(progress * Math.PI * 3) * 0.15;
        camera.position.x = shakeIntensity * 0.3;
        camera.position.y = 2 + shakeIntensity * 0.2;
      }

      // Generate particles with more variety
      if (progress > 0.15 && progress < 0.85) {
        if (Math.random() > 0.85) {
          createParticle(
            carGroup.position.clone().add(new THREE.Vector3(1.5, 0.5, 0)),
            'spark'
          );
        }
        if (Math.random() > 0.9) {
          createParticle(
            carGroup.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'smoke'
          );
        }
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life -= 0.016 / particle.maxLife;
        particle.position.add(particle.velocity);
        particle.velocity.y += 0.01;
        particle.velocity.x *= 0.98;
        particle.velocity.z *= 0.98;

        return particle.life > 0;
      });

      renderer.render(scene, camera);

      if (progress >= 0.5 && !showTitle) {
        setShowTitle(true);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [showTitle]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Canvas will be appended here */}

      {/* Cinematic title with professional styling */}
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="relative text-center">
              {/* Cinematic bars effect */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute -top-20 left-0 right-0 h-16 bg-gradient-to-b from-black via-black to-transparent"
              />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute -bottom-20 left-0 right-0 h-16 bg-gradient-to-t from-black via-black to-transparent"
              />

              {/* Main title with cinematic styling */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                className="font-heading text-7xl md:text-9xl font-black text-center"
                style={{
                  color: '#ffffff',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
                }}
              >
                Dominio do
                <br />
                Comando
              </motion.h1>

              {/* Subtitle with fade-in */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="font-paragraph text-xl md:text-2xl mt-6"
                style={{
                  color: '#cccccc',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                A Ascensão Começa
              </motion.p>

              {/* Cinematic line accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette effect for cinematic atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
      }} />
    </div>
  );
}

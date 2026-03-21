import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { Group, Mesh, Box3, Vector3, Raycaster, Vector2 } from 'three';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '@/store/playerStore';
import { GridSystem, GridObject } from '@/systems/GridSystem';

interface DelegaciaObjectProps {
  position?: { x: number; z: number };
  gridSystem?: GridSystem;
  tileSize?: number;
}

export default function DelegaciaObject({ 
  position = { x: 0, z: 0 }, 
  gridSystem,
  tileSize = 1 
}: DelegaciaObjectProps) {
  const { scene } = useGLTF('https://static.wixstatic.com/3d/50f4bf_6dad7dc336a548d1b45d2a925a05b458.glb');
  const groupRef = useRef<Group>(null);
  const navigate = useNavigate();
  const { level } = usePlayerStore();
  const [isClickable, setIsClickable] = useState(false);
  const raycasterRef = useRef(new Raycaster());
  const mouseRef = useRef(new Vector2());

  // Delegacia dimensions: 8 tiles (2x4 format - 2 tiles wide, 4 tiles deep)
  const DELEGACIA_WIDTH = 2; // tiles
  const DELEGACIA_DEPTH = 4; // tiles
  const DELEGACIA_ID = 'delegacia-001';

  useEffect(() => {
    if (!groupRef.current) return;

    // Clone the scene to avoid mutation
    const model = scene.clone();
    groupRef.current.clear();

    // Calculate bounding box
    const bbox = new Box3().setFromObject(model);
    const size = bbox.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Scale to fit 8 tiles (2x4 format)
    // Target size: 2 tiles wide × 4 tiles deep = 2 × 4 units in world space
    const targetWidth = DELEGACIA_WIDTH * tileSize;
    const targetDepth = DELEGACIA_DEPTH * tileSize;
    const targetSize = Math.max(targetWidth, targetDepth);
    
    const scale = targetSize / maxDim;
    model.scale.set(scale, scale, scale);

    // Center the model
    bbox.setFromObject(model);
    const center = bbox.getCenter(new Vector3());
    model.position.sub(center);

    // Ensure model sits on ground (Y = 0)
    bbox.setFromObject(model);
    const bottomY = bbox.min.y;
    model.position.y -= bottomY;

    // Apply shadow properties and enhance visibility
    model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance material for better visibility
        if (child.material) {
          if ('emissiveIntensity' in child.material) {
            child.material.emissiveIntensity = 0.2;
          }
          if ('metalness' in child.material) {
            child.material.metalness = Math.max(0, child.material.metalness - 0.2);
          }
          if ('roughness' in child.material) {
            child.material.roughness = Math.min(1, child.material.roughness + 0.1);
          }
        }
      }
    });

    groupRef.current.add(model);
    setIsClickable(true);

    // Register in grid system if provided
    if (gridSystem) {
      const gridObject: GridObject = {
        id: DELEGACIA_ID,
        position: {
          x: position.x / tileSize,
          z: position.z / tileSize,
          y: 0,
        },
        width: DELEGACIA_WIDTH,
        depth: DELEGACIA_DEPTH,
        height: size.y * scale,
        type: 'delegacia',
      };

      try {
        gridSystem.registerObject(gridObject);
        console.log('Delegacia registered in grid system:', gridObject);
      } catch (error) {
        console.warn('Failed to register delegacia in grid system:', error);
      }
    }

    return () => {
      // Cleanup
      model.traverse((child) => {
        if (child instanceof Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    };
  }, [scene, position, tileSize, gridSystem]);

  // Handle click detection
  useEffect(() => {
    if (!groupRef.current || !isClickable) return;

    const handleClick = (event: MouseEvent) => {
      // Get canvas bounds
      const canvas = document.querySelector('canvas');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Note: Raycasting requires camera context which is handled by the parent Three.js scene
      // This is a placeholder for the click handler
      // The actual raycasting will be done in the parent component (InteractiveTileGrid)
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isClickable]);

  // Handle navigation based on player level
  const handleDelegaciaClick = () => {
    if (level < 10) {
      console.warn('Nível insuficiente para acessar a delegacia');
      // Optional: Show feedback UI
      return;
    }

    if (level >= 10 && level < 20) {
      navigate('/bribery-investigador');
    } else if (level >= 20) {
      navigate('/bribery-delegado');
    }
  };

  // Expose click handler for parent component
  useEffect(() => {
    if (groupRef.current) {
      (groupRef.current as any).__delegaciaClickHandler = handleDelegaciaClick;
    }
  }, [level, navigate]);

  return (
    <group 
      ref={groupRef} 
      position={[position.x, 0, position.z]}
      userData={{ clickable: true, type: 'delegacia' }}
    />
  );
}

useGLTF.preload('https://static.wixstatic.com/3d/50f4bf_6dad7dc336a548d1b45d2a925a05b458.glb');

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { Group } from 'three';

export default function DelegaciaObject() {
  const { scene } = useGLTF('https://static.wixstatic.com/3d/50f4bf_6dad7dc336a548d1b45d2a925a05b458.glb');
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('https://static.wixstatic.com/3d/50f4bf_6dad7dc336a548d1b45d2a925a05b458.glb');

"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Sphere, MeshTransmissionMaterial, Ring, Cylinder, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function GlowingEnergyLines() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef1 = useRef<THREE.Mesh>(null);
  const linesRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (linesRef1.current) {
      linesRef1.current.rotation.x = t * 0.3;
      linesRef1.current.rotation.y = t * 0.2;
    }
    if (linesRef2.current) {
      linesRef2.current.rotation.x = -t * 0.2;
      linesRef2.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[2.8, 64, 64]}>
        <MeshTransmissionMaterial 
          backside 
          samples={4} 
          thickness={1} 
          chromaticAberration={0.05} 
          anisotropy={0.1} 
          distortion={0.1} 
          distortionScale={0.3} 
          temporalDistortion={0.1} 
          iridescence={1} 
          iridescenceIOR={1} 
          iridescenceThicknessRange={[0, 1400]} 
          color="#e0e8ff"
          attenuationDistance={2}
          attenuationColor="#ffffff"
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Inner glowing core */}
      <Sphere args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </Sphere>

      {/* Wireframe spheres for energy lines */}
      <mesh ref={linesRef1}>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial color="#4f80ff" wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      
      <mesh ref={linesRef2}>
        <sphereGeometry args={[2.65, 24, 24]} />
        <meshBasicMaterial color="#2d4bb5" wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Intense glow rays */}
      <Sparkles count={100} scale={6} size={4} speed={0.4} opacity={0.2} color="#ffffff" />
      <Sparkles count={50} scale={5} size={6} speed={0.2} opacity={0.5} color="#4f80ff" />
    </group>
  );
}

function FloatingPearls() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.3, 32, 32]} position={[-3.5, -1, 1.5]}>
          <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere args={[0.2, 32, 32]} position={[4, 1.5, 0.5]}>
          <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
        </Sphere>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
        <Sphere args={[0.25, 32, 32]} position={[3.5, -2, 2]}>
          <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
        </Sphere>
      </Float>
    </>
  );
}

function Scene() {
  const { mouse, camera } = useThree();
  
  useFrame(() => {
    // Mouse parallax
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group position={[4.5, 0, 0]}>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#a0b4ff" />
      <pointLight position={[0, -5, 0]} intensity={1} color="#ffffff" />
      
      {/* Background large ring */}
      <mesh position={[0, 0, -4]}>
        <torusGeometry args={[5, 0.4, 32, 100]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.2} transmission={0.9} thickness={1} />
      </mesh>

      {/* The glowing orb */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <GlowingEnergyLines />
      </Float>

      <FloatingPearls />

      {/* The Pedestal */}
      <group position={[0, -3.2, 0]}>
        <Cylinder args={[3.2, 3.2, 0.4, 64]} position={[0, 0, 0]}>
          <meshPhysicalMaterial color="#f0f3fa" metalness={0.1} roughness={0.2} clearcoat={1} />
        </Cylinder>
        <Cylinder args={[3.8, 3.8, 0.3, 64]} position={[0, -0.35, 0]}>
          <meshPhysicalMaterial color="#e5e9f5" metalness={0.1} roughness={0.3} />
        </Cylinder>
        
        {/* Soft glowing base ring */}
        <Ring args={[3.8, 4.2, 64]} position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </Ring>
      </group>
      
      <ContactShadows position={[0, -3.6, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#a0b4ff" />
      
      <Environment preset="city" />
    </group>
  );
}

export function OrbScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}

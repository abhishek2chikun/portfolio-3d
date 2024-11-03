import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export const FloatingBrain = () => {
  const brainRef = useRef();
  
  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.005;
      brainRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={brainRef}>
        {/* Brain sphere */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            wireframe
            emissive="#3b82f6"
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Outer glow */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            transparent
            opacity={0.1}
            emissive="#3b82f6"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </Float>
  );
};

export const NeuralNetwork = () => {
  const points = [];
  const connections = [];
  
  // Create neural network points and connections
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      points.push(new THREE.Vector3(i * 2 - 2, j * 1.5 - 2, 0));
    }
  }
  
  return (
    <group>
      {points.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      ))}
      {/* Add lines connecting the nodes */}
      {points.map((startPoint, i) => (
        points.map((endPoint, j) => {
          if (i < points.length / 3 && j >= points.length / 3 && j < (2 * points.length) / 3) {
            return (
              <line key={`${i}-${j}`}>
                <bufferGeometry
                  attach="geometry"
                  onUpdate={(self) => {
                    const positions = new Float32Array([
                      startPoint.x, startPoint.y, startPoint.z,
                      endPoint.x, endPoint.y, endPoint.z
                    ]);
                    self.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                  }}
                />
                <lineBasicMaterial attach="material" color="#3b82f6" opacity={0.3} transparent />
              </line>
            );
          }
          return null;
        })
      ))}
    </group>
  );
};

export const SkillsSphere = ({ skills }) => {
  const sphereRef = useRef();

  useFrame((state) => {
    sphereRef.current.rotation.y += 0.001;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={sphereRef}>
        {skills.map((skill, i) => (
          <Text3D
            key={i}
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.3}
            height={0.05}
            position={[
              Math.cos((i / skills.length) * Math.PI * 2) * 3,
              Math.sin((i / skills.length) * Math.PI * 2) * 3,
              0
            ]}
            rotation={[0, -(i / skills.length) * Math.PI * 2, 0]}
          >
            {skill}
            <meshStandardMaterial color="#3b82f6" />
          </Text3D>
        ))}
      </group>
    </Float>
  );
};
'use client'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Loader } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import * as THREE from 'three';
import SpaceEnvironment from './SpaceEnvironment';

const ThreeCanvas = ({ onHoverInfo }) => {
  const controlsRef = useRef();
  const [targetPosition, setTargetPosition] = useState(null);

  const handleClusterClick = (position) => {
    if (controlsRef.current) {
      const newTarget = new THREE.Vector3(...position);
      setTargetPosition(newTarget);
      
      // Animate camera movement
      const startPosition = controlsRef.current.target.clone();
      const startZoom = controlsRef.current.getDistance();
      const endZoom = 25; // Adjusted zoom level for better view
      
      let progress = 0;
      const animate = () => {
        progress += 0.02;
        if (progress <= 1) {
          // Interpolate position
          const currentPosition = startPosition.clone().lerp(newTarget, progress);
          controlsRef.current.target.copy(currentPosition);
          
          // Interpolate zoom
          const currentZoom = THREE.MathUtils.lerp(startZoom, endZoom, progress);
          controlsRef.current.minDistance = currentZoom * 0.5;
          controlsRef.current.maxDistance = currentZoom * 2;
          
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  const handleResetView = () => {
    if (controlsRef.current) {
      setTargetPosition(null);
      
      const startPosition = controlsRef.current.target.clone();
      const startZoom = controlsRef.current.getDistance();
      const endZoom = 80; // Increased default zoom level
      
      let progress = 0;
      const animate = () => {
        progress += 0.02;
        if (progress <= 1) {
          // Reset to center
          const currentPosition = startPosition.clone().lerp(new THREE.Vector3(0, 0, 0), progress);
          controlsRef.current.target.copy(currentPosition);
          
          // Reset zoom
          const currentZoom = THREE.MathUtils.lerp(startZoom, endZoom, progress);
          controlsRef.current.minDistance = currentZoom * 0.5;
          controlsRef.current.maxDistance = currentZoom * 1.5;
          
          requestAnimationFrame(animate);
        } else {
          // Reset distance constraints after animation
          controlsRef.current.minDistance = 30;
          controlsRef.current.maxDistance = 150;
        }
      };
      animate();
    }
  };

  return (
    <>
      <Canvas
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgb(2,0,36)' 
        }}
        camera={{ 
          position: [0, 30, 80], // Adjusted initial camera position
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <fog attach="fog" args={['#000', 30, 150]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <SpaceEnvironment 
            onHoverInfo={onHoverInfo} 
            onClusterClick={handleClusterClick}
          />
          <OrbitControls 
            ref={controlsRef}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={1}
            panSpeed={0.8}
            rotateSpeed={0.5}
            minDistance={30}
            maxDistance={150}
            minPolarAngle={Math.PI / 4} // Limit vertical rotation
            maxPolarAngle={Math.PI * 3/4}
          />
        </Suspense>
      </Canvas>

      {/* Add Loader component */}
      <Loader />

      {/* Reset View Button */}
      <button
        onClick={handleResetView}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 
                   text-white px-4 py-2 rounded-full z-50 
                   transition-all duration-300 ease-in-out
                   shadow-lg shadow-blue-500/50"
      >
        Reset View
      </button>
    </>
  );
};

export default ThreeCanvas;
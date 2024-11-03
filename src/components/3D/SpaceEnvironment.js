import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Galaxy cluster component
const GalaxyCluster = ({ position, name, planets, onHoverInfo, onClusterClick }) => {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group 
      position={position}
      ref={groupRef}
      onClick={() => onClusterClick(position)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Cluster name with hover effect */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          color={isHovered ? "#ffa500" : "#ff9100"}
          fontSize={1.2}
          position={[0, 5, 0]}
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {name}
        </Text>
      </Float>

      {/* Clickable indicator */}
      {isHovered && (
        <mesh position={[0, 7, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#ffa500"
            emissive="#ffa500"
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {/* Local cluster stars */}
      <Stars
        radius={10}
        depth={10}
        count={1000}
        factor={2}
        saturation={1}
        fade
        speed={0.5}
      />

      {/* Cluster planets */}
      {planets.map((planet, index) => (
        <Planet
          key={index}
          {...planet}
          onHover={onHoverInfo}
          position={[
            Math.cos((index / planets.length) * Math.PI * 2) * 8,
            Math.sin((index / planets.length) * Math.PI * 2) * 3,
            Math.sin((index / planets.length) * Math.PI * 2) * 8
          ]}
        />
      ))}
    </group>
  );
};

const Planet = ({ position, size, color, name, description, onHover, ringColor }) => {
  const planetRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  
  useFrame((state) => {
    planetRef.current.rotation.y += 0.002;
  });

  const handlePointerEnter = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    if (onHover) {
      onHover({
        name: name,
        description: description
      });
    }
  };

  const handlePointerLeave = (e) => {
    e.stopPropagation();
    setIsHovered(false);
    if (onHover) {
      onHover(null);
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={planetRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color}
          metalness={0.4}
          roughness={0.7}
          emissive={isHovered ? color : "#000000"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
        {/* Atmosphere */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
        {ringColor && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.5, size * 2, 32]} />
            <meshBasicMaterial 
              color={isHovered ? new THREE.Color(ringColor).multiplyScalar(1.5) : ringColor} 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.5} 
            />
          </mesh>
        )}
      </mesh>

      {/* Planet name */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          color={isHovered ? "#ffffff" : "#aaaaaa"}
          fontSize={0.5}
          position={[0, size + 0.5, 0]}
          anchorY="bottom"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {name}
        </Text>
      </Float>

      {/* Hover indicator */}
      {isHovered && (
        <mesh position={[0, size + 1.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  );
};

// Social Media Asteroid component
const SocialAsteroid = ({ icon, link, initialPosition, initialVelocity }) => {
  const asteroidRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [velocity] = useState(initialVelocity);
  const boundaryRadius = 50;

  useFrame((state) => {
    if (asteroidRef.current) {
      // Update position
      asteroidRef.current.position.x += velocity.x;
      asteroidRef.current.position.y += velocity.y;
      asteroidRef.current.position.z += velocity.z;

      // Rotate the asteroid
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.01;

      // Boundary check and wrap around
      if (asteroidRef.current.position.x > boundaryRadius) asteroidRef.current.position.x = -boundaryRadius;
      if (asteroidRef.current.position.x < -boundaryRadius) asteroidRef.current.position.x = boundaryRadius;
      if (asteroidRef.current.position.y > boundaryRadius) asteroidRef.current.position.y = -boundaryRadius;
      if (asteroidRef.current.position.y < -boundaryRadius) asteroidRef.current.position.y = boundaryRadius;
      if (asteroidRef.current.position.z > boundaryRadius) asteroidRef.current.position.z = -boundaryRadius;
      if (asteroidRef.current.position.z < -boundaryRadius) asteroidRef.current.position.z = boundaryRadius;
    }
  });

  return (
    <group 
      ref={asteroidRef} 
      position={initialPosition}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Glowing background sphere */}
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? "#ffffff" : "#333333"}
          transparent
          opacity={0.2}
          emissive={isHovered ? "#ffffff" : "#222222"}
          emissiveIntensity={isHovered ? 1 : 0.5}
        />
      </mesh>

      {/* Social Icon */}
      <Html
        transform
        occlude
        style={{
          transition: 'all 0.2s',
          transform: `scale(${isHovered ? 1.2 : 1})`,
          cursor: 'pointer',
        }}
        onClick={() => window.open(link, '_blank')}
        center
      >
        <div className="w-12 h-12 flex items-center justify-center 
                      bg-black/80 rounded-full p-2 backdrop-blur-sm
                      hover:bg-black transition-all duration-300
                      shadow-lg shadow-black/50">
          {icon}
        </div>
      </Html>
    </group>
  );
};

const SpaceEnvironment = ({ onHoverInfo, onClusterClick }) => {
  const galaxies = [
    {
      name: "Professional Experience",
      position: [-20, 0, -20],
      planets: [
        {
          name: "Data Scientist at Axiphyl",
          size: 2.5,
          color: "#4299E1",
          description: `• Architected computer vision solutions with 95%+ accuracy
• Developed NLP pipeline for multilingual content analysis
• Optimized data processing workflows (60% faster)
• Led AI features integration in production apps`,
          ringColor: "#4299E1"
        },
        {
          name: "Oracle Cerner",
          size: 2.3,
          color: "#3182CE",
          description: `• Engineered healthcare algorithms for 10M+ records
• Implemented automated testing (40% faster QA)
• Optimized CI/CD pipelines (50% faster)
• 99.9% accuracy in algorithm validation`,
        },
        {
          name: "LectureNotes",
          size: 2.2,
          color: "#2B6CB0",
          description: `• Built real-time analytics dashboard
• Developed attention-tracking system
• 40% improvement in learning engagement
• Implemented emotion detection (85% accuracy)`,
        },
        {
          name: "Satyukt Analytics",
          size: 2.1,
          color: "#2C5282",
          description: `• Created crop yield prediction model (88% accuracy)
• 5x performance improvement in algorithms
• Automated data collection workflows
• Python & Selenium implementation`,
        }
      ]
    },
    {
      name: "Projects",
      position: [20, 0, -20],
      planets: [
        {
          name: "RAG System",
          size: 2.4,
          color: "#9F7AEA",
          description: `• Production-grade RAG for document analysis
• Vector storage for semantic search
• Custom prompt templates
• Tech: LangChain, OpenAI, Vector DB, FastAPI`,
          ringColor: "#9F7AEA"
        },
        {
          name: "Emotion Recognition",
          size: 2.3,
          color: "#805AD5",
          description: `• CNN-LSTM hybrid network
• 87% accuracy on 35,887 images
• Real-time video processing
• Tech: TensorFlow, OpenCV, Python`,
        },
        {
          name: "Trading System",
          size: 2.2,
          color: "#6B46C1",
          description: `• ML-powered trading algorithms
• Scalable market analysis with Hadoop
• 15%+ annual returns
• High-frequency trading implementation`,
        },
        {
          name: "Translation API",
          size: 2.1,
          color: "#553C9A",
          description: `• Flask-based multilingual API
• Text, image, and audio translation
• 60% reduction in API latency
• Multiple service integration`,
        }
      ]
    },
    {
      name: "Technical Skills",
      position: [0, -15, -30],
      planets: [
        {
          name: "GenAI & LLMs",
          size: 2.5,
          color: "#48BB78",
          description: `• Frameworks: LangChain, Transformers, OpenAI
• RAG Systems & Document QA
• Vector Databases & LLM Fine-tuning
• Prompt Engineering`,
          ringColor: "#48BB78"
        },
        {
          name: "ML & Deep Learning",
          size: 2.4,
          color: "#38A169",
          description: `• ML: Scikit-learn, XGBoost, Statsmodels
• DL: TensorFlow, PyTorch, Keras
• CV: OpenCV, Image Processing
• NLP: NLTK, Spacy, Gensim`,
        },
        {
          name: "Data Engineering",
          size: 2.3,
          color: "#2F855A",
          description: `• Big Data: Hadoop, PySpark, Kafka, Hive
• Databases: MongoDB, PostgreSQL, Redis
• Cloud: AWS (S3, EC2, EMR, SageMaker)
• Tools: Docker, Kubernetes, Airflow`,
        },
        {
          name: "Development",
          size: 2.2,
          color: "#276749",
          description: `• Languages: Python, SQL, C++, Clojure
• Web: Flask, FastAPI, REST APIs
• DevOps: Git, Jenkins, GitHub Actions
• Testing & CI/CD`,
        }
      ]
    },
    {
      name: "Education & Achievements",
      position: [0, 15, -25],
      planets: [
        {
          name: "Education",
          size: 2.3,
          color: "#ED8936",
          description: `• B.Tech in Computer Science
• GIET University (2018-2022)
• CGPA: 8.54/10
• Specialization in ML & AI`,
          ringColor: "#ED8936"
        },
        {
          name: "Certifications",
          size: 2.1,
          color: "#DD6B20",
          description: `• NPTEL Deep Learning (IIT Ropar)
• 5-star Python Developer (HackerRank)
• Active Open Source Contributor
• International Conference Organizer`,
        }
      ]
    }
  ];

  // Define socialLinks array inside the component
  const socialLinks = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      link: 'https://github.com/abhishek2chikun',
      position: [15, 10, -20],
      velocity: { x: 0.02, y: 0.01, z: 0.015 }
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      link: 'https://linkedin.com/in/abhishek2panigrahi',
      position: [-15, -10, -20],
      velocity: { x: -0.015, y: 0.02, z: 0.01 }
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      link: 'https://twitter.com/abhishek2chikun',
      position: [20, -5, -25],
      velocity: { x: 0.01, y: -0.02, z: 0.015 }
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      link: 'https://instagram.com/abhishek2chikun',
      position: [-20, 5, -25],
      velocity: { x: -0.02, y: -0.01, z: 0.02 }
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 3c-2.209 0-4 1.791-4 4 0 1.477.81 2.752 2 3.445v3.555h4v-3.555c1.19-.693 2-1.968 2-3.445 0-2.209-1.791-4-4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"/>
        </svg>
      ),
      link: 'https://kaggle.com/abhishekchikun',
      position: [0, 15, -30],
      velocity: { x: 0.015, y: -0.015, z: 0.01 }
    }
  ];

  return (
    <group>
      <Stars
        radius={300}
        depth={100}
        count={10000}
        factor={6}
        saturation={0}
        fade
        speed={0.5}
      />

      {galaxies.map((galaxy, index) => (
        <GalaxyCluster
          key={index}
          {...galaxy}
          onHoverInfo={onHoverInfo}
          onClusterClick={onClusterClick}
        />
      ))}

      {/* Add social links */}
      {socialLinks.map((social, index) => (
        <SocialAsteroid
          key={index}
          icon={social.icon}
          link={social.link}
          initialPosition={social.position}
          initialVelocity={social.velocity}
        />
      ))}
    </group>
  );
};

export default SpaceEnvironment;
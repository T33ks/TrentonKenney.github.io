import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import * as THREE from 'three';

// --- Fonts & Global Styles Setup ---
const FONTS = {
  body: "Space Grotesk, sans-serif",
  accent: "Zen Dots, cursive",
};

// --- Data: Resume (Updated) ---
const EXPERIENCES = [
  {
    id: 1,
    role: "Regulatory Engineer (Satellite Spectrum)",
    company: "PLANET",
    period: "Aug 2025 – Present",
    description: `• Prepare and submit domestic and international satellite and ground-station filings (FCC, ITU, NOAA, and other regulators).
• Lead or support spectrum coordination with government and commercial users.
• Run interference and compatibility studies using STK and related tools to support licensing and coordination.
• Work with space systems, ground, launch, and legal teams to gather technical inputs and maintain license compliance.
• Track regulatory changes and assess impact on operations and future missions.`,
    skills: [
      { name: "Spectrum Licensing", type: "technical-hardware" },
      { name: "STK", type: "technical-software" },
      { name: "FCC / ITU Filings", type: "technical-hardware" },
      { name: "Python", type: "technical-software" },
      { name: "Cross-functional Collaboration", type: "soft" }
    ]
  },
  {
    id: 2,
    role: "Space and Ground Operations Engineer",
    company: "BLUE ORIGIN",
    period: "Aug 2022 – Aug 2025",
    description:
      "Made sure rockets, radios, and ground software all behaved, from licensing paperwork to console operations.",
    skills: [
      { name: "Spectrum & Licensing", type: "technical-hardware" },
      { name: "Mission Operations", type: "technical-hardware" },
      { name: "Ground Data Systems", type: "technical-hardware" },
      { name: "AWS (EKS, Docker, K8s)", type: "technical-software" },
      { name: "Grafana / OpenC3", type: "technical-software" }
    ],
    subExperiences: [
      {
        id: "2a",
        role: "Flight Operations Engineer",
        company: "BLUE ORIGIN",
        period: "Aug 2024 – Aug 2025",
        description: `• Led spectrum and operational licensing inputs for missions, coordinating with FCC, ITU, NTIA, NASA, DoD, and NOAA.
• Served and Trained as Ground Control Operator for New Glenn’s first flight with the Blue Ring Payload.
• Co‑designed an AI‑powered ops workflow, defining end‑to‑end architecture, agent interactions, and data‑flow schemas that embedded LLM toolchains into our ground system and reduced routine data‑validation tasks and accelerated mission tooling development. 
• Wrote, tested, and executed  procedural documentation to be used to command and receive vehicle telemetry.
• Worked with ground software teams to add simple LLM-assisted checks and automation into existing workflows.`,
        skills: [
          { name: "Spectrum Coordination", type: "technical-hardware" },
          { name: "Regulatory Licensing", type: "technical-hardware" },
          { name: "Mission Operation", type: "technical-hardware" },
          { name: "Python", type: "technical-software" },
          { name: "Cross-team Communication", type: "soft" }
        ]
      },
      {
        id: "2b",
        role: "Ground Data Systems Engineer",
        company: "BLUE ORIGIN",
        period: "Aug 2022 – Aug 2024",
        description: `• Built and maintained Grafana/OpenC3 dashboards showing real-time state of vehicle telemetry and ground systems.
• Supported AWS-based ground software (EKS, Docker, Kubernetes) across development, test, and flight environments.
• Performed STK coverage analysis and coordinated with ground-station vendors on configuration and operations plans.`,
        skills: [
          { name: "Grafana / OpenC3", type: "technical-software" },
          { name: "UI/UX", type: "technical-software" },
          { name: "HCI", type: "technical-hardware" },
          { name: "Ansys STK/MATLAB", type: "technical-software" },
          { name: "Vendor Coordination", type: "soft" }
        ]
      }
    ]
  },
  {
    id: 3,
    role: "Engineering Intern (Multiple Roles)",
    company: "NASA JOHNSON SPACE CENTER",
    period: "Aug 2020 – May 2022",
    description:
      "Rotated across human research, systems engineering, human factors, and flight operations for HRP, Orion, Starliner, and exploration missions.",
    skills: [
      { name: "Python", type: "technical-software" },
      { name: "Systems Engineering", type: "technical-hardware" },
      { name: "Human Factors", type: "technical-hardware" },
      { name: "Mission Operations", type: "technical-hardware" },
      { name: "Technical Communication", type: "soft" }
    ],
    subExperiences: [
      {
        id: "3a",
        role: "Human Research Program Data Scientist (Intern)",
        company: "NASA JSC",
        period: "Jan 2022 – May 2022",
        description: `• Built a Neo4j evidence database to represent findings in the Human Research Program Evidence Handbook.
• Wrote Python and NLP scripts to generate text “heat maps” and show relationships between evidence domains.`,
        skills: [
          { name: "Neo4j", type: "technical-software" },
          { name: "Python", type: "technical-software" },
          { name: "NLP", type: "technical-software" }
        ]
      },
      {
        id: "3b",
        role: "Systems Engineer (Intern)",
        company: "NASA JSC",
        period: "Aug 2021 – Dec 2021",
        description: `• Assessed automated landing capabilities for Human Landing System concepts using Apollo and Shuttle heritage data.
• Worked with subsystem, safety, and mission assurance teams to capture constraints and risks.`,
        skills: [
          { name: "Requirements Analysis", type: "technical-hardware" },
          { name: "Trade Studies", type: "technical-hardware" }
        ]
      },
      {
        id: "3c",
        role: "Human Factors Engineer (Intern)",
        company: "NASA JSC",
        period: "May 2021 – Aug 2021",
        description: `• Supported EVA operations concepts and science objectives for lunar, and deep-space habitat designs.
• Ran human-in-the-loop tests with astronaut subjects to evaluate tools for Orion–ISS docking.`,
        skills: [
          { name: "Human-in-the-loop Testing", type: "technical-hardware" },
          { name: "Prototyping", type: "technical-hardware" }
        ]
      },
      {
        id: "3d",
        role: "Flight Operations Engineer (Intern)",
        company: "NASA JSC",
        period: "Aug 2020 – May 2021",
        description: `• Tested and verified ground displays and UIs for uncrewed and crewed Boeing Starliner missions.
• Used object-based data models and process flow diagrams to align mission operations architecture with controller procedures.`,
        skills: [
          { name: "Mission Display Development", type: "technical-hardware" },
          { name: "Ops Procedures Writing", type: "technical-hardware" }
        ]
      }
    ]
  },
  {
    id: 4,
    role: "Delivery Experience Specialist",
    company: "TESLA",
    period: "Dec 2018 – Oct 2019; Mar 2020",
    description: `• Guided customers through vehicle software features, controls, and basic maintenance at delivery.
• Coordinated financing terms and delivery paperwork, tracking status in Salesforce.
• Inspected, prepared, and staged vehicles before hand-off, resolving straightforward issues and ensuring charge levels.`,
    skills: [
      { name: "Customer Communication", type: "soft" },
      { name: "Process Coordination", type: "soft" },
      { name: "Salesforce", type: "technical-software" }
    ]
  }
];

// --- Helper Components ---

// Helper to render description text as bullet points if appropriate
const DescriptionRenderer = ({ text, isDarkMode, accentHex }) => {
  if (!text) return null;

  // Check if text contains bullet points
  if (text.includes('•')) {
    const items = text.split('•').map(item => item.trim()).filter(item => item.length > 0);
    return (
      <ul className="list-none space-y-2 mb-6">
        {items.map((item, index) => (
          <li key={index} className={`flex items-start leading-relaxed ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
            {/* Custom bullet that mirrors nav/timeline style */}
            <span 
              className="mr-3 mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-80" 
              style={{ backgroundColor: accentHex }} 
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Fallback for standard paragraphs
  return (
    <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
      {text}
    </p>
  );
};

// --- Helper Logic for Three.js Waves (Welcome Screen) ---

const createMinimalWaves = (time) => {
  return [
    {
      position: [0, 0, 0],
      frequency: 1.5,
      amplitude: 0.4,
      phase: time * 2,
    },
    {
      position: [Math.cos(time * 0.3) * 2, 0, Math.sin(time * 0.3) * 2],
      frequency: 1.8,
      amplitude: 0.3,
      phase: time * 1.5,
    },
    {
      position: [
        Math.cos(time * 0.3 + Math.PI) * 1.5,
        0,
        Math.sin(time * 0.3 + Math.PI) * 1.5,
      ],
      frequency: 2.1,
      amplitude: 0.25,
      phase: time * 1.8,
    },
  ];
};

const createEssentialField = (sources, time, color) => {
  const size = 6;
  const resolution = 24;
  const step = size / resolution;

  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.35,
  });

  const linesGroup = new THREE.Group();

  const computeHeight = (x, z) => {
    let height = 0;

    sources.forEach(({ position, frequency, amplitude, phase }) => {
      const [sx, , sz] = position;
      const dx = x - sx;
      const dz = z - sz;
      const distance = Math.sqrt(dx * dx + dz * dz);

      height +=
        Math.sin(distance * frequency - time * 3 + phase) *
        amplitude *
        Math.exp(-distance * 0.4);
    });

    return height * 0.7;
  };

  // Horizontal & vertical grid lines
  for (let i = 0; i <= resolution; i += 2) {
    // Horizontal lines
    {
      const x = i * step - size / 2;
      const hPoints = [];

      for (let j = 0; j <= resolution; j++) {
        const z = j * step - size / 2;
        const height = computeHeight(x, z);
        hPoints.push(x, height, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(hPoints, 3)
      );

      const line = new THREE.Line(geometry, material);
      linesGroup.add(line);
    }

    // Vertical lines
    {
      const z = i * step - size / 2;
      const vPoints = [];

      for (let j = 0; j <= resolution; j++) {
        const x = j * step - size / 2;
        const height = computeHeight(x, z);
        vPoints.push(x, height, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vPoints, 3)
      );

      const line = new THREE.Line(geometry, material);
      linesGroup.add(line);
    }
  }

  return linesGroup;
};

// --- Components ---

// 1. Glowing Eye Animation (Welcome Screen)
const GlowingEyeParticles = ({ isDarkMode, zoomActive }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const expansionRef = useRef(0); // Track expansion for the "reverse" transition

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Full screen handling
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let width = canvas.width;
    let height = canvas.height;
    let centerX = width / 2;
    let centerY = height / 2;
    // Adjust radius based on screen size
    let radius = Math.min(width, height) * 0.35;
    
    const PARTICLE_COUNT = 8000; // Adjusted for performance/full screen
    const particles = [];
    
    // Initialize particles based on provided logic
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const side = i < PARTICLE_COUNT / 2 ? 'dark' : 'light';
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      
      let initialAngle = angle;
      if (side === 'dark') {
        initialAngle = angle < Math.PI ? angle : angle - Math.PI;
      } else {
        initialAngle = angle >= Math.PI ? angle : angle + Math.PI;
      }
      
      const x = centerX + Math.cos(initialAngle) * r;
      const y = centerY + Math.sin(initialAngle) * r;
      
      particles.push({
        x: x,
        y: y,
        side: side,
        initialAngle: initialAngle,
        initialRadius: r,
        convergencePhase: Math.random() * Math.PI * 2,
        convergenceSpeed: 0.005 + Math.random() * 0.005,
        size: 0.3 + Math.random() * 0.4,
        targetX: x,
        targetY: y,
        transitionPhase: 0,
        transitionSpeed: 0.004 + Math.random() * 0.002
      });
    }
    
    let time = 0;
    let lastTime = 0;
    const FPS = 30; // Smoother FPS
    const frameDelay = 1000 / FPS;
    
    function animate(currentTime) {
      // Update dimensions in loop in case of resize
      width = canvas.width;
      height = canvas.height;
      centerX = width / 2;
      centerY = height / 2;
      radius = Math.min(width, height) * 0.35;

      if (!lastTime) lastTime = currentTime;
      const elapsed = currentTime - lastTime;
      
      animationFrameRef.current = requestAnimationFrame(animate);

      if (elapsed > frameDelay) {
        time += 0.008;
        lastTime = currentTime;
        
        // Handle Transition: "Reverse" = Expansion
        if (zoomActive) {
            expansionRef.current += 0.5; // Speed of expansion
        } else {
            expansionRef.current = Math.max(0, expansionRef.current - 0.5);
        }

        // Clear with trails - Theme Aware
        const trailColor = isDarkMode ? 'rgba(26, 26, 26, 0.1)' : 'rgba(240, 238, 230, 0.1)';
        ctx.fillStyle = trailColor;
        ctx.fillRect(0, 0, width, height);
      
        particles.forEach(particle => {
          particle.convergencePhase += particle.convergenceSpeed;
          particle.transitionPhase += particle.transitionSpeed;
          
          const convergenceCycle = Math.sin(particle.convergencePhase);
          const isConverging = convergenceCycle > 0;
          
          // Apply base animation logic
          if (isConverging) {
            const convergenceStrength = convergenceCycle;
            particle.targetX = centerX;
            particle.targetY = centerY;
            
            const distanceToCenter = Math.sqrt(
              (particle.x - centerX) ** 2 + 
              (particle.y - centerY) ** 2
            );
            // Prevent division by zero
            const safeRadius = radius || 1;
            const moveSpeed = 0.02 * convergenceStrength * (distanceToCenter / safeRadius);
            
            particle.x += (particle.targetX - particle.x) * moveSpeed;
            particle.y += (particle.targetY - particle.y) * moveSpeed;
          } else {
            const transitionProgress = Math.abs(convergenceCycle);
            let newAngle, newRadius;
            
            if (particle.side === 'dark') {
              newAngle = particle.initialAngle + Math.PI;
              newRadius = particle.initialRadius;
            } else {
              newAngle = particle.initialAngle + Math.PI;
              newRadius = particle.initialRadius;
            }
            
            const sCurveEffect = Math.sin(newAngle * 2) * radius * 0.5;
            const curvedAngle = newAngle + (sCurveEffect / newRadius) * transitionProgress;
            
            particle.targetX = centerX + Math.cos(curvedAngle) * newRadius;
            particle.targetY = centerY + Math.sin(curvedAngle) * newRadius;
            
            const moveSpeed = 0.03 * transitionProgress;
            particle.x += (particle.targetX - particle.x) * moveSpeed;
            particle.y += (particle.targetY - particle.y) * moveSpeed;
          }

          // APPLY TRANSITION: Force Outward Expansion
          if (expansionRef.current > 0) {
             const dx = particle.x - centerX;
             const dy = particle.y - centerY;
             const dist = Math.sqrt(dx * dx + dy * dy) || 1;
             // Move away from center exponentially based on expansionRef
             const expansionForce = expansionRef.current * 2; 
             particle.x += (dx / dist) * expansionForce;
             particle.y += (dy / dist) * expansionForce;
          }
          
          // Determine color based on position
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const particleAngle = Math.atan2(dy, dx);
          const normalizedAngle = (particleAngle + Math.PI * 2) % (Math.PI * 2);
          
          let color, alpha;
          
          // Theme Aware Particle Colors
          if (isConverging) {
            if (isDarkMode) {
               color = particle.side === 'dark' ? '100, 100, 100' : '200, 200, 200';
            } else {
               color = particle.side === 'dark' ? '20, 20, 20' : '90, 90, 90';
            }
            alpha = 0.3 * convergenceCycle;
          } else {
            const transition = Math.abs(convergenceCycle);
            if (isDarkMode) {
                // Invert logic for dark mode visibility
                const val = particle.side === 'dark' 
                    ? 100 + transition * 100 
                    : 200 - transition * 100;
                color = `${val}, ${val}, ${val}`;
            } else {
                if (particle.side === 'dark') {
                    color = `${20 + transition * 70}, ${20 + transition * 70}, ${20 + transition * 70}`;
                } else {
                    color = `${90 - transition * 70}, ${90 - transition * 70}, ${90 - transition * 70}`;
                }
            }
            alpha = 0.3 * transition;
          }
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.fill();
        });
        
        // Draw central convergence point
        const centralGlow = Math.sin(time * 0.1) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2 + centralGlow * 3, 0, Math.PI * 2);
        const centerColor = isDarkMode ? '200, 200, 200' : '51, 51, 51';
        ctx.fillStyle = `rgba(${centerColor}, ${0.1 + centralGlow * 0.2})`;
        ctx.fill();
      }
    }
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDarkMode, zoomActive]); // Re-run if theme changes
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      style={{ display: 'block' }}
    />
  );
};

// 2. Canyon Particle Flow (Experience Page Background)
const CanyonParticles = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Handle Resize
    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init size

    const PARTICLE_COUNT = 8000; // Adjusted for full screen vs 550px box
    const WALL_LAYERS = 8;
    const particles = [];
    
    // Initialize particles
    const initParticles = () => {
        particles.length = 0;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const side = Math.random() < 0.5 ? -1 : 1;
            const layer = Math.floor(Math.random() * WALL_LAYERS);
            const y = Math.random() * height;
            
            const wavePhase1 = y * 0.008;
            const wavePhase2 = y * 0.03;
            const wavePhase3 = y * 0.05;
            
            const baseWave = Math.sin(wavePhase1) * 50;
            const secondaryWave = Math.sin(wavePhase2 * 2 + layer * 0.5) * 25;
            const tertiaryWave = Math.sin(wavePhase3 * 3 + layer * 1.2) * 12;
            
            const combinedWave = baseWave + secondaryWave + tertiaryWave;
            const layerDepth = layer * 15;
            const wallThickness = 20 + layer * 8;
            
            const baseX = centerX + side * (80 + combinedWave + layerDepth);
            const offsetX = (Math.random() - 0.5) * wallThickness;
            
            particles.push({
                x: baseX + offsetX,
                y: y,
                z: (layer - WALL_LAYERS/2) * 20 + (Math.random() - 0.5) * 15,
                side: side,
                layer: layer,
                initialY: y,
                drift: Math.random() * Math.PI * 2,
                speed: 0.1 + layer * 0.02,
                brightness: 0.7 + Math.random() * 0.3
            });
        }
    };
    initParticles();
    
    let time = 0;
    
    const animate = () => {
      time += 0.016;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      
      // Theme-aware Clear Color (Trail Effect)
      const r = isDarkMode ? 26 : 240;
      const g = isDarkMode ? 26 : 238;
      const b = isDarkMode ? 26 : 230;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.1)`; // Increased trail fade slightly for cleaner look
      ctx.fillRect(0, 0, width, height);
      
      particles.sort((a, b) => a.z - b.z);
      
      particles.forEach(particle => {
        // Calculate complex wave position
        const wavePhase1 = particle.y * 0.008 + time * 0.05;
        const wavePhase2 = particle.y * 0.03 + time * 0.1 + particle.layer * 0.5;
        const wavePhase3 = particle.y * 0.05 + time * 0.15 + particle.layer * 1.2;
        
        const baseWave = Math.sin(wavePhase1) * 50;
        const secondaryWave = Math.sin(wavePhase2 * 2) * 25;
        const tertiaryWave = Math.sin(wavePhase3 * 3) * 12;
        
        const combinedWave = baseWave + secondaryWave + tertiaryWave;
        const layerDepth = particle.layer * 15;
        const wallThickness = 20 + particle.layer * 8;
        
        const targetX = centerX + particle.side * (80 + combinedWave + layerDepth);
        const layerDrift = Math.sin(particle.drift + time * 0.5 + particle.layer * 0.3) * wallThickness * 0.5;
        
        // Smooth movement
        particle.x = particle.x * 0.92 + (targetX + layerDrift) * 0.08;
        particle.y += particle.speed;
        
        particle.z += Math.sin(time * 0.4 + particle.drift + particle.layer * 0.8) * 0.2;
        
        if (particle.y > height + 30) {
          particle.y = -30;
          particle.drift = Math.random() * Math.PI * 2;
        }
        
        const depthFactor = (particle.z + WALL_LAYERS * 10) / (WALL_LAYERS * 20);
        const opacity = 0.25 + depthFactor * 0.15;
        const size = 0.3 + depthFactor * 0.3;
        
        const brightnessBase = particle.brightness * 15 + particle.layer * 3;
        const brightness = 120 + brightnessBase; 
        
        if (opacity > 0 && size > 0) {
          if (particle.layer < 3) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity * 0.1})`;
            ctx.fill();
          }
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
          ctx.fill();
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDarkMode]); 
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

// 3. Torus Field Dynamics (Portfolio Page Background)
const TorusFieldDynamics = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    
    let time = 0;
    let animationFrameId;
    
    const animate = () => {
      // Theme colors
      const strokeColorBase = isDarkMode ? '200, 200, 200' : '80, 80, 80';
      const bgColor = isDarkMode ? '#1a1a1a' : '#F0EEE6';
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.008;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Scale calculation to fit nicely on screen relative to the original 550px logic
      const minDim = Math.min(canvas.width, canvas.height);
      const baseScale = minDim / 800; 

      // Draw field lines of growing wisdom
      const fieldLines = 40;
      const toroidalRadius = 120 * baseScale;
      const poloidalRadius = 60 * baseScale;
      
      for (let i = 0; i < fieldLines; i++) {
        const u = (i / fieldLines) * Math.PI * 2;
        
        for (let j = 0; j < fieldLines; j++) {
          const v = (j / fieldLines) * Math.PI * 2;
          
          // Torus parametric equations
          const x = (toroidalRadius + poloidalRadius * Math.cos(v)) * Math.cos(u);
          const y = (toroidalRadius + poloidalRadius * Math.cos(v)) * Math.sin(u);
          const z = poloidalRadius * Math.sin(v);
          
          // Project 3D to 2D with perspective
          const perspective = 200 * baseScale;
          const scale = perspective / (perspective + z);
          const screenX = centerX + x * scale;
          const screenY = centerY + y * scale * 0.5; // Flatten for top view
          
          // Add dynamic movement
          const phase = time + u * 0.5 + v * 0.5;
          const offset = Math.sin(phase) * (5 * baseScale);
          
          ctx.beginPath();
          ctx.arc(screenX + offset, screenY + offset, 1 * baseScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${strokeColorBase}, ${0.3 * scale})`;
          ctx.fill();
        }
      }
      
      // Draw energy flow lines
      const flowLines = 20;
      for (let i = 0; i < flowLines; i++) {
        const angle = (i / flowLines) * Math.PI * 2;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${strokeColorBase}, 0.2)`;
        ctx.lineWidth = 1;
        
        for (let t = 0; t < 1; t += 0.01) {
          const radius = toroidalRadius + poloidalRadius * Math.cos(t * Math.PI * 2 * 3 + time);
          const x = centerX + Math.cos(angle + t * Math.PI * 4) * radius;
          const y = centerY + Math.sin(angle + t * Math.PI * 4) * radius * 0.5;
          
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      // Draw the enduring center that gives strength
      const vortexRadius = 30 * baseScale;
      ctx.beginPath();
      ctx.arc(centerX, centerY, vortexRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${strokeColorBase}, 0.5)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Vortex spiral
      ctx.beginPath();
      const spiralTurns = 3;
      for (let i = 0; i < 100; i++) {
        const t = i / 100;
        const angle = t * Math.PI * 2 * spiralTurns - time * 2;
        const radius = vortexRadius * (1 - t);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = `rgba(${strokeColorBase}, 0.4)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Add harmonic rings
      for (let r = 50 * baseScale; r < 250 * baseScale; r += 30 * baseScale) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r + Math.sin(time + r * 0.01) * (5 * baseScale), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${strokeColorBase}, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

// 4. Vortex Particle System (Thoughts Page Background)
const VortexParticleSystem = ({ isDarkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    // Initialize Three.js components
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    
    // Theme colors
    const bgColor = isDarkMode ? 0x1a1a1a : 0xF0EEE6;
    const particleColor = isDarkMode ? 0xaaaaaa : 0x333333;

    renderer.setClearColor(bgColor, 1);
    canvasContainer.appendChild(renderer.domElement);
    
    camera.position.z = 7;
    
    // Create particles
    const particleCount = 25000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const indices = new Float32Array(particleCount);
    
    // Let particles find their natural path to the center
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const t = Math.random();
      const angle = t * Math.PI * 20; 
      
      const radius = 0.6 + t * 2.2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (t - 0.5) * 5;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      sizes[i] = 0.03 + 0.04 * Math.random();
      opacities[i] = 0.4 + 0.6 * Math.random();
      indices[i] = i;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    particles.setAttribute('index', new THREE.BufferAttribute(indices, 1));
    
    // Custom shader material
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(particleColor) }, 
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute float index;
        uniform float time;
        varying float vOpacity;
        
        void main() {
          vOpacity = opacity;
          vec3 pos = position;
          
          float i = index;
          float speed = 0.2 + 0.2 * fract(i / 1000.0);
          float angle = time * speed + i * 0.001;
          
          float twistAmount = sin(time * 0.3) * 0.5;
          float twist = pos.y * twistAmount;
          
          float r = length(pos.xy);
          float breathe = 1.0 + sin(time * 0.5) * 0.1;
          r *= breathe;
          
          float theta = atan(pos.y, pos.x) + twist;
          pos.x = r * cos(theta);
          pos.y = r * sin(theta);
          
          pos.z += sin(time * 0.2 + i * 0.01) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (50.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;
        
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4(color, vOpacity);
        }
      `,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    let animationId = null;
    
    const animate = (time) => {
      time *= 0.0005; 
      particleMaterial.uniforms.time.value = time;
      
      camera.position.x = Math.sin(time * 0.1) * 1.5;
      camera.position.y = Math.cos(time * 0.15) * 1.0;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Handle Resize
    const handleResize = () => {
        const newWidth = canvasContainer.clientWidth;
        const newHeight = canvasContainer.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
      if (canvasContainer.contains(renderer.domElement)) {
        canvasContainer.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDarkMode]); // Re-run on theme change to update colors

  return (
    <div ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10" />
  );
};

// 5. Skill Jewel Component
const SkillJewel = ({ skill, isDarkMode }) => {
  // Jewel tone mapping applied only on HOVER/Active
  const getHoverColor = (type) => {
    switch(type) {
      case 'technical-software': 
      case 'technical-hardware': 
        // Technical: Gradient from #591C05 to #6F3D16
        return "hover:bg-gradient-to-r hover:from-[#591C05] hover:to-[#6F3D16] hover:text-white hover:border-[#591C05] hover:shadow-[0_0_10px_rgba(89,28,5,0.4)]";
      case 'soft': 
        // Soft Skills: Gradient from #035373 to #023859
        return "hover:bg-gradient-to-r hover:from-[#035373] hover:to-[#023859] hover:text-white hover:border-[#035373] hover:shadow-[0_0_10px_rgba(3,83,115,0.4)]";
      default:
        return "hover:bg-slate-600 hover:text-slate-50";
    }
  };

  // Default "colorless" state based on theme
  const defaultColor = isDarkMode
    ? "bg-white/5 border-stone-700 text-stone-500"
    : "bg-black/5 border-stone-300 text-stone-500";

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm uppercase tracking-wider transition-all duration-300 cursor-pointer select-none
      ${defaultColor}
      ${getHoverColor(skill.type)}
    `}>
      {skill.name}
    </span>
  );
};

// 6. Placeholder Text Component
const StillForming = ({ isDarkMode, showGraphic = true }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full animate-in fade-in duration-700">
      {showGraphic && (
        <div className="relative w-64 h-64 mb-8">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute top-0 left-0 w-full h-full border ${isDarkMode ? 'border-stone-400/30' : 'border-stone-600/30'} rounded-[50%]`}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: i * -1 }}
              style={{ 
                transform: `rotate(${i * 15}deg) scaleX(${0.5 + (i%2)*0.5})`,
                transformOrigin: 'center'
              }}
            />
          ))}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${isDarkMode ? 'bg-stone-200' : 'bg-stone-800'} animate-pulse`} />
        </div>
      )}
      <h2 className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: FONTS.accent }}>
        Still Forming...
      </h2>
      <p className={`mt-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Come back later.</p>

      {/* Copyright Text */}
      <div className={`absolute bottom-4 text-xs font-mono opacity-40 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
        © 2025 Trenton // Built with Starlight
      </div>
    </div>
  );
};

// --- Main Application Component ---

export default function App() {
  const [entered, setEntered] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [activeTab, setActiveTab] = useState('Experiences'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expandedExperience, setExpandedExperience] = useState(null); // State for dropdown

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=Zen+Dots&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleEnter = () => {
    setZoomActive(true);
    setTimeout(() => {
      setEntered(true);
    }, 1500); 
  };

  const toggleExperience = (id) => {
    setExpandedExperience(expandedExperience === id ? null : id);
  };

  const themeClasses = isDarkMode 
    ? "bg-[#1a1a1a] text-[#e6e6e6]" 
    : "bg-[#f0f0e8] text-[#1a1a1a]";

  // New accent color logic
  const accentHex = isDarkMode ? '#F2D399' : '#40382A';

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-500 ${themeClasses}`} style={{ fontFamily: FONTS.body }}>
      
      {/* --- Controls --- */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* --- Entry View --- */}
      {!entered && (
        <motion.div 
          onClick={handleEnter}
          className="absolute inset-0 flex flex-col items-center justify-center z-40 overflow-hidden cursor-pointer"
          // Transition Logic: Dissolve text
          animate={zoomActive ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <GlowingEyeParticles isDarkMode={isDarkMode} zoomActive={zoomActive} />

          <div className="relative z-10 text-center pointer-events-none">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold tracking-tight mb-4"
            >
              Hi, I'm Trenton!
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-xl md:text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              welcome to my universe
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={`absolute bottom-32 md:bottom-24 text-sm md:text-base hover:scale-110 transition-transform ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            style={{ fontFamily: FONTS.accent }}
          >
            [tap anywhere]
          </motion.div>
        </motion.div>
      )}

      {/* --- Main Content View --- */}
      {entered && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }} // Slow fade in after entry dissolves
          className="relative z-30 h-full flex flex-col max-w-5xl mx-auto px-4 md:px-8"
        >
          {/* Navigation */}
          <header className="flex justify-center pt-20 md:pt-8 pb-4 relative z-50">
            <nav className={`flex space-x-1 rounded-full p-1 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} backdrop-blur-md`}>
              {['Experiences', 'Portfolio', 'Thoughts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300
                    ${activeTab === tab 
                      ? `shadow-lg` 
                      : `${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                  `}
                  style={activeTab === tab ? { 
                      backgroundColor: accentHex, 
                      color: isDarkMode ? '#1a1a1a' : '#ffffff' // Contrast text for active tab
                  } : {}}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </header>

          {/* Dynamic Backgrounds Layer */}
          {activeTab === 'Experiences' && <CanyonParticles isDarkMode={isDarkMode} />}
          {activeTab === 'Portfolio' && <TorusFieldDynamics isDarkMode={isDarkMode} />}
          {activeTab === 'Thoughts' && <VortexParticleSystem isDarkMode={isDarkMode} />}

          {/* Content Area */}
          <main className="flex-1 overflow-hidden relative mt-4 z-10">
            <AnimatePresence mode="wait">
              
              {/* EXPERIENCES TAB */}
              {activeTab === 'Experiences' && (
                <motion.div 
                  key="resume"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="h-full overflow-y-auto pb-20 scrollbar-hide custom-scroll"
                >
                   <div className="relative min-h-full py-10 pl-4 md:pl-12">
                     
                     {/* Timeline Line */}
                     <div className={`absolute left-6 md:left-12 top-0 bottom-[100px] w-0.5 ${isDarkMode ? 'bg-stone-700' : 'bg-stone-300'}`} />

                     {EXPERIENCES.map((job) => (
                       <div key={job.id} className="relative mb-16 group">
                         <div 
                            className={`absolute -left-[9px] top-6 w-5 h-5 rounded-full border-4 ${isDarkMode ? 'border-[#1a1a1a]' : 'border-[#f0f0e8]'} z-10 transition-transform group-hover:scale-125`} 
                            style={{ backgroundColor: accentHex }}
                         />
                         
                         <div className={`
                           ml-8 p-6 md:p-8 rounded-3xl transition-all duration-300 border
                           ${isDarkMode 
                             ? 'bg-stone-900/80 border-stone-800 hover:border-[#F2D399]/50' 
                             : 'bg-white/60 border-stone-200 hover:border-[#40382A]/50'}
                           shadow-xl hover:shadow-2xl backdrop-blur-sm
                         `}>
                           {/* Main Job Header */}
                           <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                             <div className="flex-1">
                               <h3 className="text-2xl font-bold">{job.role}</h3>
                               <div className="font-bold tracking-wide text-sm uppercase mt-1" style={{ color: accentHex }}>{job.company}</div>
                             </div>
                             <div className="flex flex-col items-end gap-2">
                               <div className={`font-mono text-sm ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                                 {job.period}
                               </div>
                               {/* Toggle Button for Nested Experiences */}
                               {job.subExperiences && (
                                 <motion.button
                                   onClick={() => toggleExperience(job.id)}
                                   className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-stone-400' : 'hover:bg-black/5 text-stone-500'}`}
                                   // Only animate if collapsed
                                   animate={expandedExperience !== job.id ? {
                                     boxShadow: [
                                       `0 0 0px ${isDarkMode ? 'rgba(242, 211, 153, 0)' : 'rgba(64, 56, 42, 0)'}`,
                                       `0 0 15px ${isDarkMode ? 'rgba(242, 211, 153, 0.6)' : 'rgba(64, 56, 42, 0.4)'}`, // Peak glow
                                       `0 0 0px ${isDarkMode ? 'rgba(242, 211, 153, 0)' : 'rgba(64, 56, 42, 0)'}`
                                     ]
                                   } : {
                                     boxShadow: '0 0 0px rgba(0,0,0,0)'
                                   }}
                                   transition={{
                                     duration: 4,
                                     repeat: Infinity,
                                     ease: "easeInOut"
                                   }}
                                 >
                                   {expandedExperience === job.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                 </motion.button>
                               )}
                             </div>
                           </div>

                           {/* DESCRIPTION RENDERER */}
                           <DescriptionRenderer text={job.description} isDarkMode={isDarkMode} accentHex={accentHex} />

                           {/* Main Skills */}
                           <div className="flex flex-wrap gap-2 mb-4">
                             {job.skills.map((skill, idx) => (
                               <SkillJewel key={idx} skill={skill} isDarkMode={isDarkMode} />
                             ))}
                           </div>

                           {/* Nested Mini-Timeline for Sub-Experiences */}
                           <AnimatePresence>
                             {expandedExperience === job.id && job.subExperiences && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{ duration: 0.3 }}
                                 className="overflow-hidden"
                               >
                                 <div className={`relative mt-6 pt-6 border-t ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
                                   {/* Nested Timeline Line */}
                                   <div className={`absolute left-1.5 top-10 bottom-6 w-0.5 ${isDarkMode ? 'bg-stone-800' : 'bg-stone-300'} opacity-50`} />

                                   {job.subExperiences.map((subJob) => (
                                     <div key={subJob.id} className="relative pl-8 mb-8 last:mb-0">
                                       {/* Nested Timeline Node */}
                                       <div 
                                          className={`absolute left-0 top-2 w-3.5 h-3.5 rounded-full border-2 ${isDarkMode ? 'border-[#1a1a1a]' : 'border-[#f0f0e8]'}`}
                                          style={{ backgroundColor: accentHex }}
                                       />
                                       
                                       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-1">
                                         <h4 className={`text-lg font-bold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{subJob.role}</h4>
                                         <span className={`font-mono text-xs ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>{subJob.period}</span>
                                       </div>
                                       
                                       {/* SUB DESCRIPTION RENDERER */}
                                       <DescriptionRenderer text={subJob.description} isDarkMode={isDarkMode} accentHex={accentHex} />
                                       
                                       <div className="flex flex-wrap gap-2">
                                         {subJob.skills.map((skill, idx) => (
                                           <SkillJewel key={idx} skill={skill} isDarkMode={isDarkMode} />
                                         ))}
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* NEW FOOTER SECTION */}
                   <div className="flex flex-col items-center justify-center pb-20 mt-4 px-4 md:px-12">
                      
                      {/* Footer Box Mimicking Experience Cards */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`
                          w-full max-w-2xl p-10 rounded-3xl border text-center flex flex-col items-center
                          ${isDarkMode 
                             ? 'bg-stone-900/80 border-stone-800' 
                             : 'bg-white/60 border-stone-200'}
                          shadow-xl backdrop-blur-sm
                        `}
                      >
                         <p className={`text-lg md:text-xl mb-8 font-medium leading-relaxed ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                           My inbox is open for collaborations, coffee chats, and cosmic inquiries.
                         </p>

                         <motion.a 
                           href="mailto:trenton@universe.com"
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           className={`
                             px-8 py-3 border rounded-md uppercase tracking-widest text-sm font-bold transition-all duration-300
                             shadow-[0_0_15px_rgba(64,56,42,0.2)]
                             hover:bg-[#3A4C43] hover:text-white hover:border-[#3A4C43] hover:shadow-[0_0_25px_rgba(58,76,67,0.6)]
                           `}
                           style={{ 
                             borderColor: accentHex,
                             color: isDarkMode ? accentHex : '#40382A'
                           }}
                         >
                           Send Signal
                         </motion.a>
                      </motion.div>

                      {/* Copyright Text */}
                      <div className={`mt-12 text-xs font-mono opacity-40 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                        © 2025 Trenton // Built with Starlight
                      </div>
                   </div>

                </motion.div>
              )}

              {/* PORTFOLIO TAB */}
              {activeTab === 'Portfolio' && (
                <motion.div 
                  key="portfolio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full pb-20"
                >
                   <StillForming isDarkMode={isDarkMode} showGraphic={false} />
                </motion.div>
              )}

              {/* THOUGHTS TAB */}
              {activeTab === 'Thoughts' && (
                <motion.div 
                  key="thoughts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full pb-20"
                >
                  <StillForming isDarkMode={isDarkMode} showGraphic={false} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </motion.div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .custom-scroll {
           mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%);
        }
      `}</style>
    </div>
  );
}


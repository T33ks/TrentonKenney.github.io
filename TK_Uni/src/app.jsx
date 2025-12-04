import React, { useRef, useEffect } from 'react';

// Theme: Scientific observation of emerging order.
// Visualization: Pure Signal Spectrum (Stable).
// Updates: Transparent background, Robust Scaling (ResizeObserver), Continuous Scan.
// Removed: Noise logic, jitter, and "searching" oscillation.

const SignalToNoise = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Use refs for mutable state to avoid re-triggering effects on resize
  const stateRef = useRef({
    particles: [],
    width: 0,
    height: 0,
    scanLineX: 0,
    time: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Configuration (Noise params removed)
    const config = {
      particleCount: 8000,
      layers: 25,           
      frequency: 0.015,     
      speed: 0.2,
      drag: 0.05,           
      trailLength: 0.15,    
    };

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      
      // Update state dimensions
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;

      // Set actual canvas size to match display size * DPI
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // CSS size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr);

      // Re-initialize particles if array is empty (first run)
      if (stateRef.current.particles.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    const initParticles = (w, h) => {
      const particles = [];
      // Scale factor for smaller screens
      const baseSizeScale = w < 500 ? 0.6 : 1.0;

      for (let i = 0; i < config.particleCount; i++) {
        const layerIndex = Math.floor(Math.random() * config.layers);
        particles.push({
          x: Math.random() * w,
          y: h / 2, 
          layer: layerIndex,
          z: Math.random(),
          vx: config.speed * (0.5 + Math.random() * 0.5),
          size: (Math.random() < 0.9 ? 1 : 1.5) * baseSizeScale,
          baseAlpha: 0.2 + Math.random() * 0.6,
        });
      }
      stateRef.current.particles = particles;
    };

    // Setup ResizeObserver for robust DPI handling
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas.parentElement);
    
    // Initial resize trigger
    handleResize();

    const drawGrid = (ctx, w, h) => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`; // Fixed static opacity
      
      const gridSize = 55;
      
      // Vertical Lines
      for (let i = 0; i <= w; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.setLineDash([2, 4]);
        ctx.stroke();
      }
      
      // Horizontal Lines
      for (let i = 0; i <= h; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset

      // Center Crosshair
      ctx.strokeStyle = `rgba(0, 0, 0, 0.2)`;
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2 - 10);
      ctx.lineTo(w / 2, h / 2 + 10);
      ctx.moveTo(w / 2 - 10, h / 2);
      ctx.lineTo(w / 2 + 10, h / 2);
      ctx.stroke();
    };

    const drawOverlay = (ctx, w, h, time) => {
      ctx.font = '10px "Courier New", monospace';
      ctx.fillStyle = 'rgba(40, 40, 40, 0.7)';
      ctx.textAlign = 'left';

      // Fixed status
      ctx.fillText(`STATUS: SIGNAL STABLE`, 20, 30);

      // Bottom Axis
      ctx.textAlign = 'right';
      ctx.fillText(`T+${time.toFixed(2)}s`, w - 20, h - 20);
      
      // Vertical Scan Line (Continuous)
      stateRef.current.scanLineX = (stateRef.current.scanLineX + 1) % w;
      const x = stateRef.current.scanLineX;
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    };

    const draw = () => {
      const { width, height } = stateRef.current;
      stateRef.current.time += 0.01;
      const time = stateRef.current.time;

      // 1. Trails Effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0, 0, 0, ${config.trailLength})`; 
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      // 2. Draw Grid (No clarity calculation needed)
      drawGrid(ctx, width, height);

      // 3. Update and Draw Particles
      ctx.fillStyle = '#2A2A2A';

      // Amplitude and margin need to be dynamic based on current height
      const amplitude = height * 0.1;
      const margin = height * 0.15;

      stateRef.current.particles.forEach(p => {
        // Move Horizontal
        p.x += p.vx;
        if (p.x > width) p.x = -10;

        // Target Calculation
        const layerY = margin + (p.layer / (config.layers - 1)) * (height - margin * 2);

        // Signal: Coherent Waves ONLY
        const signalPhase = time + (p.layer * 0.15); 
        const waveY = Math.sin(p.x * config.frequency + signalPhase) * amplitude;
        
        // Removed Noise Calculation
        const targetY = layerY + waveY;

        // Physics
        p.y += (targetY - p.y) * config.drag;

        // Draw with consistent intensity (no clarity fade)
        ctx.globalAlpha = p.baseAlpha * p.z;
        
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      ctx.globalAlpha = 1.0;

      // 4. Draw UI Overlay
      drawOverlay(ctx, width, height, time);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="w-full h-full border-0 overflow-hidden relative">
        <canvas 
            ref={canvasRef} 
            className="block"
        />
      </div>
    </div>
  );
};

export default SignalToNoise;

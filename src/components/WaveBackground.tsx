import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  #define PI 3.14159265359

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float wave(vec2 uv, float t, float speed, float freq, float amplitude, float offset) {
    float y = sin(uv.x * freq + t * speed + offset) * amplitude;
    return smoothstep(0.005, 0.0, abs(uv.y - y - 0.5));
  }

  void main() {
    vec2 uv = vUv;
    vec2 m = uMouse / uResolution;
    
    // Distort UV based on mouse
    float dist = distance(uv, m);
    uv += (uv - m) * exp(-dist * 10.0) * 0.05;

    vec3 finalColor = vec3(0.0);
    
    // Layered waves
    for(float i = 0.0; i < 5.0; i++) {
        float t = uTime * (0.8 + i * 0.1);
        float freq = 2.0 + i * 0.5;
        float amp = 0.1 + i * 0.05;
        float speed = 0.5 + i * 0.1;
        
        float w = wave(uv, t, speed, freq, amp, i * 1.5);
        
        // Dynamic purple palette
        // 0.7 - 0.8 range for hue (purple/violet)
        vec3 col = hsv2rgb(vec3(0.7 + i * 0.02, 0.8, 1.0));
        
        finalColor += col * w * (0.5 / (i + 1.0));
    }

    // Volumetric glow
    float glow = exp(-abs(uv.y - 0.5) * 4.0) * 0.1;
    finalColor += hsv2rgb(vec3(0.75, 0.9, 1.0)) * glow;

    // Dark vignette
    float vignette = 1.0 - smoothstep(0.5, 2.3, length(vUv - 0.5));
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const WaveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const dimensionsRef = useRef({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (!containerRef.current) return;

    const { width, height } = dimensionsRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = dimensionsRef.current.height - e.clientY;
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimensionsRef.current = { width: w, height: h };
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const animate = (time: number) => {
      uniforms.uTime.value = time * 0.001;
      uniforms.uMouse.value.lerp(mouseRef.current, 0.05);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial trigger
    handleResize();
    animate(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={containerRef} 
        className="fixed inset-0 pointer-events-none -z-10"
      />
      <div className="noise" />
    </>
  );
};

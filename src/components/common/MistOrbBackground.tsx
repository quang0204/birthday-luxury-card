import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MistOrbBackgroundProps {
  className?: string;
}

/**
 * Procedural WebGL GLSL Shader replicating the getdesign.md "Mist Orb"
 * Matches the exact glowing spherical plasma with polar pinch, horizontal swirling mist layers,
 * incandescent magenta/purple glow, and subtle analog film grain.
 */
export const MistOrbBackground: React.FC<MistOrbBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try WebGL
    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) {
      console.warn('WebGL not supported, falling back');
      return;
    }

    let animId: number;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // 3D Simplex/Perlin Noise & FBM
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      float fbm(vec3 p) {
        float f = 0.0;
        f += 0.5000 * snoise(p); p *= 2.02;
        f += 0.2500 * snoise(p); p *= 2.03;
        f += 0.1250 * snoise(p); p *= 2.01;
        f += 0.0625 * snoise(p);
        return f;
      }

      void main() {
        // Normalized coordinates centered at (0,0)
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        // Gentle interactive tilt towards mouse if active
        vec2 m = u_mouse / u_resolution - 0.5;
        uv -= m * 0.08;

        float dist = length(uv);
        float radius = 0.38; // Sphere radius in viewport units

        // Color definitions matching Mist Orb reference
        vec3 colBlack = vec3(0.04, 0.02, 0.07); // Pitch background
        vec3 colDeepPlum = vec3(0.22, 0.06, 0.32);
        vec3 colMagenta = vec3(0.78, 0.24, 0.85); // Incandescent Purple
        vec3 colHotPink = vec3(0.96, 0.45, 0.92);
        vec3 colWhiteCore = vec3(1.0, 0.92, 0.99);

        vec3 color = colBlack;

        // Outer soft ambient corona glow
        float corona = exp(-5.0 * max(0.0, dist - radius * 0.85));
        color += colDeepPlum * corona * 0.45;
        color += colMagenta * exp(-12.0 * max(0.0, dist - radius)) * 0.3;

        // Inside the Spherical Orb
        if (dist < radius) {
          // 3D Sphere projection: calculate Z depth and normal
          float z = sqrt(max(0.0, radius * radius - dist * dist));
          vec3 normal = vec3(uv.x, uv.y, z) / radius;

          // Spherical latitude & longitude
          float lat = normal.y; // -1 to 1
          float lon = atan(normal.x, normal.z); // -PI to PI

          float t = u_time * 0.4;

          // Swirling 3D mist turbulence inside sphere
          vec3 noiseCoord = vec3(
            normal.x * 2.2 + sin(lat * 3.0 + t) * 0.4,
            lat * 3.2,
            normal.z * 2.2 + t * 0.6
          );
          float n = fbm(noiseCoord);

          // Horizontal plasma bands undulating across equator
          float equatorBand = smoothstep(0.45, 0.0, abs(lat)) * 0.7;
          float secondaryBand = smoothstep(0.25, 0.0, abs(lat - 0.25 * sin(t))) * 0.5;
          float lowerBand = smoothstep(0.28, 0.0, abs(lat + 0.3 * cos(t * 0.8))) * 0.6;

          // Magnetic polar pinch at North and South poles (characteristic of the reference screenshot)
          float poleTop = exp(-18.0 * (length(vec2(uv.x, uv.y - radius * 0.95)))) * 2.2;
          float poleBottom = exp(-18.0 * (length(vec2(uv.x, uv.y + radius * 0.95)))) * 2.2;
          float verticalFilament = exp(-55.0 * abs(uv.x)) * smoothstep(radius * 0.65, radius, abs(uv.y)) * 1.5;

          // Combine mist density
          float mistDensity = (n * 0.5 + 0.5);
          mistDensity *= (equatorBand + secondaryBand + lowerBand + 0.35);
          mistDensity += poleTop + poleBottom + verticalFilament;

          // Soft volumetric sphere falloff (Fresnel edge)
          float edgeAlpha = smoothstep(radius, radius * 0.88, dist);
          mistDensity *= edgeAlpha;

          // Coloring the incandescent plasma
          vec3 orbCol = mix(colDeepPlum, colMagenta, clamp(mistDensity * 1.2, 0.0, 1.0));
          orbCol = mix(orbCol, colHotPink, clamp((mistDensity - 0.45) * 1.6, 0.0, 1.0));
          orbCol = mix(orbCol, colWhiteCore, clamp((mistDensity - 0.85) * 2.5, 0.0, 1.0));

          // Sphere inner rim light
          float rim = pow(1.0 - normal.z, 2.5) * 0.85;
          orbCol += colMagenta * rim * 0.8;

          color = mix(color, orbCol, edgeAlpha);
        }

        // Top & Bottom vertical light pinches leaking outside sphere boundary
        float vBeams = exp(-75.0 * abs(uv.x)) * smoothstep(radius * 0.85, radius * 1.15, abs(uv.y)) * exp(-3.0 * abs(uv.y));
        color += colMagenta * vBeams * 1.2;

        // Subtle analog film grain / dither texture
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.045;
        color += grain;

        gl_FragColor = vec4(color, 0.95);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = canvas.height - (e.clientY - rect.top);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      const displayHeight = canvas.parentElement?.clientHeight || window.innerHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();

    const render = () => {
      resize();
      const elapsed = reducedMotion ? 0.8 : (performance.now() - startTime) * 0.001;

      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
};

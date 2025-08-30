<script lang="ts">
  import { onMount } from "svelte";

  export let albumImageUrl: string = "";

  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext;
  let program: WebGLProgram;
  let animationId: number;
  let startTime: number;
  let texture: WebGLTexture;

  const vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}

  `;

  const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_texture;
uniform float u_time;
varying vec2 v_texCoord;

// Hash function for subtle randomness
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Smooth wave distortion
vec2 waveDistortion(vec2 uv, float time) {
  float wave1 = sin(uv.x * 4.0 + time * 0.6) * 0.015;
  float wave2 = cos(uv.y * 3.0 + time * 0.4) * 0.015;
  float wave3 = sin((uv.x + uv.y) * 2.5 + time * 0.9) * 0.01;
  float n = (hash(uv + time) - 0.5) * 0.004;
  return vec2(wave1 + wave3 + n, wave2 + wave3 + n);
}

// Radial blur function with slow random variation
vec4 radialBlur(vec2 uv, float time) {
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(uv, center);

  // Base blur plus slow pseudo-random variation
  float noise = (hash(vec2(time * 0.05, dist)) - 0.5) * 0.2; // [-0.1,0.1]
  float blurStrength = 0.25 + 0.2 * sin(time * 0.3 + dist * 5.0) + noise; // varies slowly

  vec4 color = vec4(0.0);
  const int samples = 5;
  for(int i = 0; i < samples; i++) {
    float t = float(i) / float(samples - 1);
    vec2 offset = (uv - center) * t * blurStrength;
    color += texture2D(u_texture, clamp(uv - offset, 0.001, 0.999));
  }
  return color / float(samples);
}

void main() {
  // Flip Y + zoom slightly
  vec2 uv = vec2(v_texCoord.x, 1.0 - v_texCoord.y);
  uv = uv * 0.95 + 0.025;

  // Apply wave distortion
  vec2 distortedUV = uv + waveDistortion(uv, u_time);
  distortedUV = clamp(distortedUV, 0.001, 0.999);

  // Apply radial blur
  vec4 color = radialBlur(distortedUV, u_time);

  // Subtle pulse brightness
  float pulse = 0.97 + sin(u_time * 0.6) * 0.03;
  gl_FragColor = vec4(color.rgb * pulse, 1.0);
}

  `;

  function createShader(type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error("Shader compilation failed");
    }
    return shader;
  }

  function createProgram(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error("Program linking failed");
    }
    return program;
  }

  function setupGeometry() {
    const positions = new Float32Array([
      -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const texLoc = gl.getAttribLocation(program, "a_texCoord");

    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 16, 8);
  }

  function loadTexture(url: string): Promise<WebGLTexture> {
    return new Promise((resolve, reject) => {
      const tex = gl.createTexture();
      if (!tex) return reject(new Error("Texture creation failed"));

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        resolve(tex);
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = url;
    });
  }

  function render() {
    const currentTime = (Date.now() - startTime) / 1000;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.uniform1f(gl.getUniformLocation(program, "u_time"), currentTime);
    gl.uniform1i(gl.getUniformLocation(program, "u_texture"), 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationId = requestAnimationFrame(render);
  }

  async function initWebGL() {
    if (!canvas) return;
    if (animationId) cancelAnimationFrame(animationId);

    gl = canvas.getContext("webgl")!;
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    program = createProgram(vs, fs);

    setupGeometry();

    if (albumImageUrl) {
      texture = await loadTexture(albumImageUrl);
    }

    startTime = Date.now();
    render();
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    gl?.viewport(0, 0, canvas.width, canvas.height);
  }

  onMount(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (albumImageUrl) initWebGL();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  });

  // Re-init on album change
  $: if (albumImageUrl && canvas) initWebGL();
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;

    filter: brightness(0.95);
    object-fit: cover;
  }
</style>

function hexToVec3(hex) {
  return [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  ];
}
// Gradient background with optional sparkles
class GradientBackground {
  constructor(container, options = {}) {
    // Default options
    this.options = {
      useSparkles: false,
      colors: {
        dark1: [0.1, 0.1, 0.2],
        dark2: [0.15, 0.15, 0.25],
        light1: [0.4, 0.4, 0.8],
        light2: [0.5, 0.5, 0.9]
      },
      bgPower: 1.2,
      ...options
    };

    // Setup canvas and WebGL
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // Find or create container
    this.container = typeof container === 'string' ?
      document.querySelector(container) : container;

    if (!this.container) {
      console.error('Container not found');
      return;
    }

    this.container.style.position = 'relative';
    this.container.appendChild(this.canvas);

    // Initialize WebGL
    this.gl = this.canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      alpha: true,
      premultipliedAlpha: false
    }) || this.canvas.getContext('experimental-webgl');

    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }

    this.init();
    this.setupGUI();
    this.resize();
    this.animate();

    // Event listeners
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'g') {
        this.toggleGUI();
      }
    });

    // Add theme state
    this.currentTheme = 'light';

    // Initialize theme management
    this.initThemeManagement();
  }

  init() {
    // Vertex shader
    const vertexShaderSource =
      'attribute vec2 position;' +
      'attribute vec2 uv;' +
      'varying vec2 v_uv;' +
      'void main() {' +
      '    gl_Position = vec4(position, 0, 1);' +
      '    v_uv = uv;' +
      '}';

    // Fragment shader
    const fragmentShaderSource =
      'precision highp float;' +

      // Simplex noise implementation
      'vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }' +
      'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }' +

      'float simplex3d(vec3 v) {' +
      '    const vec2 C = vec2(1.0/6.0, 1.0/3.0);' +
      '    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);' +

      '    vec3 i  = floor(v + dot(v, C.yyy));' +
      '    vec3 x0 = v - i + dot(i, C.xxx);' +

      '    vec3 g = step(x0.yzx, x0.xyz);' +
      '    vec3 l = 1.0 - g;' +
      '    vec3 i1 = min(g.xyz, l.zxy);' +
      '    vec3 i2 = max(g.xyz, l.zxy);' +

      '    vec3 x1 = x0 - i1 + C.xxx;' +
      '    vec3 x2 = x0 - i2 + C.yyy;' +
      '    vec3 x3 = x0 - D.yyy;' +

      '    i = mod(i, 289.0);' +
      '    vec4 p = permute(permute(permute(' +
      '            i.z + vec4(0.0, i1.z, i2.z, 1.0))' +
      '            + i.y + vec4(0.0, i1.y, i2.y, 1.0))' +
      '            + i.x + vec4(0.0, i1.x, i2.x, 1.0));' +

      '    float n_ = 1.0/7.0;' +
      '    vec3 ns = n_ * D.wyz - D.xzx;' +

      '    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);' +

      '    vec4 x_ = floor(j * ns.z);' +
      '    vec4 y_ = floor(j - 7.0 * x_);' +

      '    vec4 x = x_ *ns.x + ns.yyyy;' +
      '    vec4 y = y_ *ns.x + ns.yyyy;' +
      '    vec4 h = 1.0 - abs(x) - abs(y);' +

      '    vec4 b0 = vec4(x.xy, y.xy);' +
      '    vec4 b1 = vec4(x.zw, y.zw);' +

      '    vec4 s0 = floor(b0)*2.0 + 1.0;' +
      '    vec4 s1 = floor(b1)*2.0 + 1.0;' +
      '    vec4 sh = -step(h, vec4(0.0));' +

      '    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;' +
      '    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;' +

      '    vec3 p0 = vec3(a0.xy,h.x);' +
      '    vec3 p1 = vec3(a0.zw,h.y);' +
      '    vec3 p2 = vec3(a1.xy,h.z);' +
      '    vec3 p3 = vec3(a1.zw,h.w);' +

      '    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));' +
      '    p0 *= norm.x;' +
      '    p1 *= norm.y;' +
      '    p2 *= norm.z;' +
      '    p3 *= norm.w;' +

      '    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);' +
      '    m = m * m;' +
      '    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));' +
      '}' +

      'uniform float u_time;' +
      'uniform vec3 u_color_dark1;' +
      'uniform vec3 u_color_dark2;' +
      'uniform vec3 u_color_light1;' +
      'uniform vec3 u_color_light2;' +
      'uniform float u_BG_POWER;' +
      'varying vec2 v_uv;' +

      'void main() {' +
      '    float ns = smoothstep(0., 1., simplex3d(vec3(v_uv * 0.5 + u_time, u_time * 1.2)));' +
      '    float dist = distance(v_uv, vec2(0., .7));' +
      '    dist = smoothstep(0.01, 0.9, dist);' +
      '    float grad = ns * dist;' +

      '    vec3 dark = mix(u_color_dark1, u_color_dark2, grad);' +
      '    vec3 light = mix(u_color_light1, u_color_light2, grad);' +
      '    vec3 color = mix(dark, light, smoothstep(0.4, 0.6, u_BG_POWER));' +
      // Smoothstep for gradual transition
      '    gl_FragColor = vec4(color, 1.0);' +
      '}';

    // Create shader program
    this.program = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);

    if (!this.program) {
      console.error('Failed to create shader program');
      return;
    }

    // Create buffers
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1
    ]);

    const uvs = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ]);

    // Setup attributes and uniforms
    this.positionBuffer = this.createBuffer(positions);
    this.uvBuffer = this.createBuffer(uvs);

    this.positionLocation = this.gl.getAttribLocation(this.program, 'position');
    this.uvLocation = this.gl.getAttribLocation(this.program, 'uv');

    // Get uniform locations
    this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    this.colorDark1Location = this.gl.getUniformLocation(this.program, 'u_color_dark1');
    this.colorDark2Location = this.gl.getUniformLocation(this.program, 'u_color_dark2');
    this.colorLight1Location = this.gl.getUniformLocation(this.program, 'u_color_light1');
    this.colorLight2Location = this.gl.getUniformLocation(this.program, 'u_color_light2');
    this.bgPowerLocation = this.gl.getUniformLocation(this.program, 'u_BG_POWER');

    this.startTime = Date.now();

    // Enable alpha blending
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }
  /*async init() {
    try {
      // Fetch shader files
      const vertexResponse = await fetch('/src/gl/screen/vertex.vert');
      const fragmentResponse = await fetch('/src/gl/screen/fragment.frag');
      
      const vertexShaderSource = await vertexResponse.text();
      const fragmentShaderSource = await fragmentResponse.text();
  
      // Create shader program
      this.program = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);
      // ...rest of init code
    } catch (error) {
      console.error('Failed to load shaders:', error);
    }
  }*/

  createBuffer(data) {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      console.error('Failed to create buffer');
      return null;
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    return buffer;
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createShaderProgram(vertexSource, fragmentSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const program = this.gl.createProgram();
    if (!program) {
      console.error('Failed to create program');
      return null;
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize shader program:', this.gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  // Update the setupGUI method
  setupGUI() {
    if (!window.dat) {
      console.warn('dat.gui not found, skipping GUI setup');
      return;
    }

    try {
      this.gui = new dat.GUI({ autoPlace: false });
      this.gui.domElement.style.display = 'none';

      // Style the GUI container
      this.gui.domElement.style.position = 'fixed';
      this.gui.domElement.style.top = '10px';
      this.gui.domElement.style.right = '10px';
      this.gui.domElement.style.zIndex = '9999'; // Ensure it's above other elements

      // Append to body instead of container for fixed positioning
      document.body.appendChild(this.gui.domElement);

      // Convert current vec3 colors to hex strings
      const vec3ToHex = (vec3) => {
        const r = Math.round(vec3[0] * 255);
        const g = Math.round(vec3[1] * 255);
        const b = Math.round(vec3[2] * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };

      const colorConfig = {
        dark1: vec3ToHex(this.options.colors.dark1),
        dark2: vec3ToHex(this.options.colors.dark2),
        light1: vec3ToHex(this.options.colors.light1),
        light2: vec3ToHex(this.options.colors.light2)
      };

      const colors = this.gui.addFolder('Colors');

      // Update color when hex changes
      const updateColor = (colorName, hexValue) => {
        const r = parseInt(hexValue.slice(1, 3), 16) / 255;
        const g = parseInt(hexValue.slice(3, 5), 16) / 255;
        const b = parseInt(hexValue.slice(5, 7), 16) / 255;
        this.options.colors[colorName] = [r, g, b];
      };

      colors.addColor(colorConfig, 'dark1')
        .name('Dark 1')
        .onChange(v => updateColor('dark1', v));
      colors.addColor(colorConfig, 'dark2')
        .name('Dark 2')
        .onChange(v => updateColor('dark2', v));
      colors.addColor(colorConfig, 'light1')
        .name('Light 1')
        .onChange(v => updateColor('light1', v));
      colors.addColor(colorConfig, 'light2')
        .name('Light 2')
        .onChange(v => updateColor('light2', v));

      const controls = this.gui.addFolder('Controls');
      controls.add(this.options, 'bgPower', 0.1, 2.0)
        .name('Brightness');

      colors.open();
      controls.open();
    } catch (error) {
      console.error('Error setting up GUI:', error);
    }
  }

  toggleGUI() {
    if (this.gui) {
      const isHidden = this.gui.domElement.style.display === 'none';
      this.gui.domElement.style.display = isHidden ? 'block' : 'none';
    }
  }

  resize() {
    if (!this.canvas || !this.gl) return;

    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  toFloat32Array(arr) {
    if (arr instanceof Float32Array) return arr;
    return new Float32Array(Array.isArray(arr) ? arr : Object.values(arr));
  }

  render() {
    if (!this.gl || !this.program) return;

    // Clear and set program
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);

    // Set attributes
    if (this.positionBuffer && this.uvBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
      this.gl.enableVertexAttribArray(this.uvLocation);
      this.gl.vertexAttribPointer(this.uvLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    // Update uniforms
    const time = (Date.now() - this.startTime) * 0.0001;
    this.gl.uniform1f(this.timeLocation, time);

    // Ensure we're passing exactly 3 components for vec3 uniforms
    const dark1 = new Float32Array([
      this.options.colors.dark1[0],
      this.options.colors.dark1[1],
      this.options.colors.dark1[2]
    ]);

    const dark2 = new Float32Array([
      this.options.colors.dark2[0],
      this.options.colors.dark2[1],
      this.options.colors.dark2[2]
    ]);

    this.gl.uniform3fv(this.colorDark1Location, dark1);
    this.gl.uniform3fv(this.colorDark2Location, dark2);
    this.gl.uniform3fv(this.colorLight1Location, this.toFloat32Array(this.options.colors.light1));
    this.gl.uniform3fv(this.colorLight2Location, this.toFloat32Array(this.options.colors.light2));
    this.gl.uniform1f(this.bgPowerLocation, this.options.bgPower);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  animate() {
    this.render();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  // Update the destroy method to handle the new GUI placement
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (this.gui) {
      this.gui.destroy();
      if (this.gui.domElement && this.gui.domElement.parentNode) {
        this.gui.domElement.parentNode.removeChild(this.gui.domElement);
      }
    }

    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.toggleGUI);

    if (this.gl) {
      this.gl.deleteProgram(this.program);
      this.gl.deleteBuffer(this.positionBuffer);
      this.gl.deleteBuffer(this.uvBuffer);
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    window.removeEventListener('resize', () => this.handleThemeChange(this
      .checkVisibleThemeElements()));
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  setTheme(theme, duration = 2.0) {
    //console.log(`🎨 Setting theme to ${theme} with duration ${duration}`);
    //console.log('Current bgPower:', this.options.bgPower);

    gsap.to(this.options, {
      bgPower: theme === 'dark' ? 0.2 : 0.8,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        //console.log('Theme transition - bgPower:', this.options.bgPower);
        this.render();
      },
      onComplete: () => {
        //console.log(`✅ Theme transition complete: ${theme}`);
        //console.log('Final bgPower:', this.options.bgPower);
      }
    });
  }

  initThemeManagement() {
    //console.log('🚀 Theme Management Initialization');
    //console.log('Current theme state:', this.currentTheme);

    const darkElements = gsap.utils.toArray('[data-animate-theme-to="dark"]');
    //console.log('🔍 Dark elements found:', darkElements.length);

    if (darkElements.length > 0) {
      //console.log('📍 Setting up ScrollTriggers for dark elements');
      darkElements.forEach((element, index) => {
        ScrollTrigger.create({
          trigger: element,
          start: 'top center', // Changed from bottom to center
          end: 'bottom center', // Changed trigger points
          onEnter: () => {
            //console.log(`🎯 Dark element ${index} entered - Setting DARK theme`);
            this.handleThemeChange('dark');
          },
          onEnterBack: () => {
            //console.log(`↩️ Dark element ${index} entered back - Setting DARK theme`);
            this.handleThemeChange('dark');
          },
          onLeave: () => {
            //console.log(`⬆️ Dark element ${index} left - Setting LIGHT theme`);
            this.handleThemeChange('light');
          },
          onLeaveBack: () => {
            //console.log(`⬇️ Dark element ${index} left back - Setting LIGHT theme`);
            this.handleThemeChange('light');
          },
          markers: false
        });
      });
    } else {
      //console.log('⚪ No dark elements - Setting light mode by default');
      this.handleThemeChange('light');
    }

    // Initial theme check
    const initialTheme = this.checkVisibleThemeElements();
    //console.log('Initial theme check:', initialTheme);
    this.handleThemeChange(initialTheme);
  }

  checkVisibleThemeElements() {
    //console.log('🔍 Checking visible elements');
    const darkElements = gsap.utils.toArray('[data-animate-theme-to="dark"]');

    if (darkElements.length === 0) {
      //console.log('⚪ No dark elements - defaulting to light mode');
      return 'light';
    }

    // Check if any dark element is in the center of the viewport
    const viewportCenter = window.innerHeight / 2;

    const visibleDark = darkElements.some(el => {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + (rect.height / 2);
      const isVisible = elementCenter > 0 && elementCenter < window.innerHeight;

      console.log('Element visibility check:', {
        elementId: el.id || 'no-id',
        elementCenter,
        viewportCenter,
        isVisible,
        position: {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height
        }
      });

      return isVisible;
    });

    const theme = visibleDark ? 'dark' : 'light';
    //console.log(`Theme detection result: ${theme} (visibleDark: ${visibleDark})`);
    return theme;
  }

  initializeTheme() {
    //console.log('🎬 Initializing theme');
    ScrollTrigger.refresh();
    const initialTheme = this.checkVisibleThemeElements();
    //console.log('Initial theme detection:', initialTheme);

    this.handleThemeChange(initialTheme);

    //console.log('Fading in container');
    gsap.to(this.container, {
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => console.log('✨ Container fade-in complete')
    });
  }

  handleThemeChange(theme) {
    //console.log('🔄 Theme change handler');
    console.log('States:', {
      currentTheme: this.currentTheme,
      requestedTheme: theme,
      bgPower: this.options.bgPower
    });

    if (theme !== this.currentTheme) {
      console.log(`⚡ Changing theme from ${this.currentTheme} to ${theme}`);
      this.currentTheme = theme;
      this.setTheme(theme, 1.5);
    } else {
      console.log('↩️ Theme unchanged:', theme);
    }
  }

}

// Export for both module and global usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GradientBackground;
} else {
  window.GradientBackground = GradientBackground;
}
console.log('Script updated: 2024-04-14 15:30:00');

const bgGradientContainer = document.querySelector('#bg-gradient');
if (bgGradientContainer) {
  bgGradientContainer.style.opacity = '0'; // Start hidden

  const gradient = new GradientBackground('#bg-gradient', {
    colors: {
      dark1: hexToVec3(0x101921),
      dark2: hexToVec3(0x71a3b0),
      light1: hexToVec3(0xf7fafc),
      light2: hexToVec3(0xc4dce5)
    },
    bgPower: 0.2
  });

  // Fade in after initialization
  requestAnimationFrame(() => {
    console.log('🎭 Fading in gradient background');
    gradient.setTheme(gradient.checkVisibleThemeElements());
    gsap.to(bgGradientContainer, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        console.log('✨ Gradient fade-in complete');
      }
    });
  });
}

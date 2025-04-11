console.log('Script updated: 2024-04-11 22:45:00');

class GradientBackground {
    constructor(container, options = {}) {
        // Default options with new parameters
        this.options = {
            useSparkles: false,
            colors: {
                dark1: [0x0d/255, 0x15/255, 0x1b/255],
                dark2: [0x71/255, 0xa3/255, 0xb0/255],
                light1: [0xf7/255, 0xfa/255, 0xfc/255],
                light2: [0xc4/255, 0xdc/255, 0xe5/255]
            },
            bgPower: 1.8,
            animationSpeed: 3, // Default speed on 0-10 scale
            darkMix: 0.4,
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
    }

    init() {
        // Vertex shader
        const vertexShaderSource =
            'attribute vec2 position;\n' +
            'attribute vec2 uv;\n' +
            'varying vec2 v_uv;\n' +
            'void main() {\n' +
            '    gl_Position = vec4(position, 0, 1);\n' +
            '    v_uv = uv;\n' +
            '}\n';

        // Fragment shader
        const fragmentShaderSource =
            'precision highp float;\n' +
            
            'vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }\n' +
            'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\n' +
            
            'float simplex3d(vec3 v) {\n' +
            '    const vec2 C = vec2(1.0/6.0, 1.0/3.0);\n' +
            '    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n' +
            '    vec3 i  = floor(v + dot(v, C.yyy));\n' +
            '    vec3 x0 = v - i + dot(i, C.xxx);\n' +
            '    vec3 g = step(x0.yzx, x0.xyz);\n' +
            '    vec3 l = 1.0 - g;\n' +
            '    vec3 i1 = min(g.xyz, l.zxy);\n' +
            '    vec3 i2 = max(g.xyz, l.zxy);\n' +
            '    vec3 x1 = x0 - i1 + C.xxx;\n' +
            '    vec3 x2 = x0 - i2 + C.yyy;\n' +
            '    vec3 x3 = x0 - D.yyy;\n' +
            '    i = mod(i, 289.0);\n' +
            '    vec4 p = permute(permute(permute(\n' +
            '            i.z + vec4(0.0, i1.z, i2.z, 1.0))\n' +
            '            + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n' +
            '            + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n' +
            '    float n_ = 1.0/7.0;\n' +
            '    vec3 ns = n_ * D.wyz - D.xzx;\n' +
            '    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);\n' +
            '    vec4 x_ = floor(j * ns.z);\n' +
            '    vec4 y_ = floor(j - 7.0 * x_);\n' +
            '    vec4 x = x_ *ns.x + ns.yyyy;\n' +
            '    vec4 y = y_ *ns.x + ns.yyyy;\n' +
            '    vec4 h = 1.0 - abs(x) - abs(y);\n' +
            '    vec4 b0 = vec4(x.xy, y.xy);\n' +
            '    vec4 b1 = vec4(x.zw, y.zw);\n' +
            '    vec4 s0 = floor(b0)*2.0 + 1.0;\n' +
            '    vec4 s1 = floor(b1)*2.0 + 1.0;\n' +
            '    vec4 sh = -step(h, vec4(0.0));\n' +
            '    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;\n' +
            '    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;\n' +
            '    vec3 p0 = vec3(a0.xy,h.x);\n' +
            '    vec3 p1 = vec3(a0.zw,h.y);\n' +
            '    vec3 p2 = vec3(a1.xy,h.z);\n' +
            '    vec3 p3 = vec3(a1.zw,h.w);\n' +
            '    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n' +
            '    p0 *= norm.x;\n' +
            '    p1 *= norm.y;\n' +
            '    p2 *= norm.z;\n' +
            '    p3 *= norm.w;\n' +
            '    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n' +
            '    m = m * m;\n' +
            '    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));\n' +
            '}\n' +

            'uniform float u_time;\n' +
            'uniform vec3 u_color_dark1;\n' +
            'uniform vec3 u_color_dark2;\n' +
            'uniform vec3 u_color_light1;\n' +
            'uniform vec3 u_color_light2;\n' +
            'uniform float u_BG_POWER;\n' +
            'varying vec2 v_uv;\n' +

            'void main() {\n' +
            '    vec2 uv = v_uv;\n' +
            '    float timeScale = 1.5;\n' +
            '    float noiseScale = 0.8;\n' +
            '    float t = u_time * timeScale;\n' +
            '    vec3 noiseInput = vec3(uv * noiseScale, t);\n' +
            '    float ns = smoothstep(0.2, 0.8, simplex3d(noiseInput));\n' +
            '    float dist = distance(uv, vec2(0., .7));\n' +
            '    dist = smoothstep(0.2, 0.8, dist);\n' +
            '    float grad = ns * dist;\n' +
            '    vec3 col1 = mix(u_color_dark1 * 1.2, u_color_dark2, grad);\n' +
            '    vec3 col2 = mix(u_color_light1, u_color_light2, grad);\n' +
            '    vec3 color = mix(col2 * u_BG_POWER, col1, 0.5);\n' +
            '    gl_FragColor = vec4(color, 1.0);\n' +
            '}\n';

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

    calculateAnimationSpeed(value) {
        // Ensure value is between 0 and 10
        const clampedValue = Math.max(0, Math.min(10, value));
        
        if (clampedValue === 0) return 0;
        
        // Slower, smoother scaling
        if (clampedValue <= 3) {
            // Slow (0-3)
            return 0.015 * clampedValue;
        } else if (clampedValue <= 7) {
            // Normal range (3-7)
            return 0.045 * clampedValue;
        } else {
            // Fast range (7-10)
            return 0.075 * clampedValue;
        }
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

        // Calculate time with new speed control
        const computedSpeed = this.calculateAnimationSpeed(this.options.animationSpeed);
        const time = this.options.animationSpeed === 0 ? 
            0 : (Date.now() - this.startTime) * 0.001 * computedSpeed;

        // Update uniforms
        this.gl.uniform1f(this.timeLocation, time);
        this.gl.uniform3fv(this.colorDark1Location, this.options.colors.dark1);
        this.gl.uniform3fv(this.colorDark2Location, this.options.colors.dark2);
        this.gl.uniform3fv(this.colorLight1Location, this.options.colors.light1);
        this.gl.uniform3fv(this.colorLight2Location, this.options.colors.light2);
        this.gl.uniform1f(this.bgPowerLocation, this.options.bgPower);
        this.gl.uniform1f(this.darkMixLocation, this.options.darkMix);

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    setupGUI() {
        if (!window.dat) {
            console.warn('dat.gui not found, skipping GUI setup');
            return;
        }
        
        try {
            this.gui = new dat.GUI({ 
                autoPlace: false,
                width: 300
            });
            
            // Create and style GUI container
            const guiContainer = document.createElement('div');
            guiContainer.style.position = 'fixed';
            guiContainer.style.top = '20px';
            guiContainer.style.right = '20px';
            guiContainer.style.zIndex = '10000';
            document.body.appendChild(guiContainer);
            guiContainer.appendChild(this.gui.domElement);

            // Hide GUI initially
            this.gui.domElement.style.display = 'none';

            const colors = this.gui.addFolder('Colors');
            colors.addColor(this.options.colors, 'dark1').name('Dark 1');
            colors.addColor(this.options.colors, 'dark2').name('Dark 2');
            colors.addColor(this.options.colors, 'light1').name('Light 1');
            colors.addColor(this.options.colors, 'light2').name('Light 2');
            
            const controls = this.gui.addFolder('Controls');
            controls.add(this.options, 'bgPower', 0, 2.0, 0.1).name('Brightness');
            controls.add(this.options, 'animationSpeed', 0, 10, 0.1).name('Speed');
            controls.add(this.options, 'darkMix', 0, 1, 0.1).name('Dark Mix');
            
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

    animate() {
        this.render();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        if (this.gui) {
            this.gui.destroy();
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
    }
}

// Export for both module and global usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GradientBackground;
} else {
    window.GradientBackground = GradientBackground;
}
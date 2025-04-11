// Gradient background with optional sparkles
class GradientBackground {
    constructor(container, options = {}) {
        // Default options with new colors
        this.options = {
            useSparkles: false,
            colors: {
                // Convert hex colors to RGB arrays (0-1 range)
                dark1: [0x0d/255, 0x15/255, 0x1b/255],
                dark2: [0x71/255, 0xa3/255, 0xb0/255],
                light1: [0xf7/255, 0xfa/255, 0xfc/255],
                light2: [0xc4/255, 0xdc/255, 0xe5/255]
            },
            bgPower: 1.8, // Increased brightness
            animationSpeed: 0.2, // Nouvelle option pour la vitesse
            darkMix: 0.4, // Contrôle du mix entre couleurs claires et sombres
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

    async init() {
        try {
            // Charger les shaders depuis les fichiers
            const vertexSource = `
                attribute vec2 position;
                attribute vec2 uv;
                varying vec2 v_uv;
                
                void main() {
                    gl_Position = vec4(position, 0, 1);
                    v_uv = uv;
                }
            `;

            const fragmentSource = `
                precision highp float;
                
                uniform float u_time;
                uniform vec3 u_color_dark1;
                uniform vec3 u_color_dark2;
                uniform vec3 u_color_light1;
                uniform vec3 u_color_light2;
                uniform float u_BG_POWER;
                uniform float u_dark_mix;
                varying vec2 v_uv;

                // Simplex noise implementation
                vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                
                float simplex3d(vec3 v) {
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
                    i = mod(i, 289.0);
                    vec4 p = permute(permute(permute(
                            i.z + vec4(0.0, i1.z, i2.z, 1.0))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                    float n_ = 1.0/7.0;
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
                    vec3 p0 = vec3(a0.xy,h.x);
                    vec3 p1 = vec3(a0.zw,h.y);
                    vec3 p2 = vec3(a1.xy,h.z);
                    vec3 p3 = vec3(a1.zw,h.w);
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                }

                void main() {
                    float ns = smoothstep(0., 1., simplex3d(vec3(v_uv * 0.8 + u_time * 0.2, u_time * 0.3)));
                    float dist = distance(v_uv, vec2(0., .7));
                    dist = smoothstep(0.2, 1., dist);
                    float grad = ns * dist;
                    
                    vec3 col1 = mix(u_color_dark1 * 1.2, u_color_dark2, grad);
                    vec3 col2 = mix(u_color_light1, u_color_light2, grad);
                    vec3 color = mix(col2 * u_BG_POWER, col1, u_dark_mix);
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `;

            // Create shader program
            this.program = this.createShaderProgram(vertexSource, fragmentSource);
            
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
            this.darkMixLocation = this.gl.getUniformLocation(this.program, 'u_dark_mix');

            this.startTime = Date.now();
            
            // Enable alpha blending
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        } catch (error) {
            console.error('Error initializing WebGL:', error);
            return;
        } 
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

    setupGUI() {
        if (!window.dat) {
            console.warn('dat.gui not found, skipping GUI setup');
            return;
        }
        
        try {
            this.gui = new dat.GUI({ 
                autoPlace: false,
                width: 280 // Set a reasonable width
            });
            
            // Style the GUI
            this.gui.domElement.style.display = 'none';
            this.gui.domElement.style.position = 'fixed';
            this.gui.domElement.style.top = '10px';
            this.gui.domElement.style.right = '10px';
            this.gui.domElement.style.left = 'auto';
            this.gui.domElement.style.zIndex = '1000';
            
            // Add custom CSS to fix dat.gui styling
            const style = document.createElement('style');
            style.textContent = `
                .dg.main {
                    font: 11px 'Lucida Grande', sans-serif;
                    background-color: #1a1a1a;
                    color: #ebebeb;
                    text-shadow: none;
                    border-radius: 4px;
                }
                .dg.main .close-button {
                    display: none;
                }
                .dg.main .slider {
                    margin-left: 0;
                }
                .dg .c input[type=text] {
                    background: #303030;
                    border: none;
                    border-radius: 2px;
                    color: #ffffff;
                }
                .dg .property-name {
                    width: 40%;
                }
                .dg .c .slider {
                    background: #303030;
                    cursor: ew-resize;
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(this.gui.domElement);

            const colors = this.gui.addFolder('Colors');
            colors.addColor(this.options.colors, 'dark1').name('Dark 1').onChange(() => this.render());
            colors.addColor(this.options.colors, 'dark2').name('Dark 2').onChange(() => this.render());
            colors.addColor(this.options.colors, 'light1').name('Light 1').onChange(() => this.render());
            colors.addColor(this.options.colors, 'light2').name('Light 2').onChange(() => this.render());
            
            const controls = this.gui.addFolder('Controls');
            controls.add(this.options, 'bgPower', 0.1, 2.0, 0.1).name('Brightness');
            controls.add(this.options, 'animationSpeed', 0.001, 0.1, 0.001).name('Speed');
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

        // Slow down the time calculation significantly
        const timeScale = 0.05; // Additional time scaling factor
        const time = (Date.now() - this.startTime) * 0.001 * this.options.animationSpeed * timeScale;
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
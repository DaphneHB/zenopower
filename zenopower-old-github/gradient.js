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
            // Load shader files
            const vertexResponse = await fetch('/src/gl/screen/vertex.vert');
            const fragmentResponse = await fetch('/src/gl/screen/fragment.frag');
            
            if (!vertexResponse.ok || !fragmentResponse.ok) {
                throw new Error('Failed to load shader files');
            }
    
            const vertexShaderSource = await vertexResponse.text();
            const fragmentShaderSource = await fragmentResponse.text();
    
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
            this.gui = new dat.GUI({ autoPlace: false });
            this.gui.domElement.style.display = 'none';
            this.container.appendChild(this.gui.domElement);

            const colors = this.gui.addFolder('Colors');
            colors.addColor(this.options.colors, 'dark1');
            colors.addColor(this.options.colors, 'dark2');
            colors.addColor(this.options.colors, 'light1');
            colors.addColor(this.options.colors, 'light2');
            
            this.gui.add(this.options, 'bgPower', 0.1, 2.0);
            colors.open();
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

        // Update uniforms
        const time = (Date.now() - this.startTime) * 0.001;
        this.gl.uniform1f(this.timeLocation, time);
        
        this.gl.uniform3fv(this.colorDark1Location, this.options.colors.dark1);
        this.gl.uniform3fv(this.colorDark2Location, this.options.colors.dark2);
        this.gl.uniform3fv(this.colorLight1Location, this.options.colors.light1);
        this.gl.uniform3fv(this.colorLight2Location, this.options.colors.light2);
        this.gl.uniform1f(this.bgPowerLocation, this.options.bgPower);

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
console.log('Script updated: 2024-04-15 00:30:00');

const modelConfigs = [
{
  containerId: 'home-glb-container',
  modelURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/home-rsg05/rsg_home_05.gltf',
  textureColorURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/home-rsg05/tex/rsg_home_model_4_rsg_home_Color.png',
  textureRoughnessURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/home-rsg05/tex/rsg_home_model_4_rsg_home_Roughness.png',
  textureMetalnessURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/home-rsg05/tex/rsg_home_model_4_rsg_home_Metallic.png',
  guiShortcut: {
    key: 'b',
    requireShift: true
  },
  modelScale: 4,
  tiltAmount: 0.3,
  baseRotation: {
    x: 0.1, // Updated X rotation
    y: 0.6,
    z: -0.45
  },
  lights: { // Different light settings for first model
    ambient: {
      color: 0xffffff,
      intensity: 0.15
    },
    directional: {
      color: 0xffffff,
      intensity: 1.4,
      position: { x: 2.5, y: 2, z: 1.5 } // Slightly higher position
    }
  }
},
{
  containerId: 'home-glb-container2',
  modelURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/rsg_home_bake/rsg_home/rsg_home.glb',
  textureColorURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/rsg_home_bake/rsg_home/tex/metal_baseColorTexture.jpg',
  textureRoughnessURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/rsg_home_bake/rsg_home/tex/metal_metallicRoughnessTexture.png',
  textureMetalnessURL: 'https://cdn.jsdelivr.net/gh/DaphneHB/zenopower@main/rsg_home_bake/rsg_home/tex/metal_metallicRoughnessTexture.png',
  guiShortcut: {
    key: 'p',
    requireShift: true
  },
  modelScale: 4,
  tiltAmount: 0.3,
  baseRotation: {
    x: 0.1, // Updated X rotation
    y: 0.6,
    z: -0.45
  },
  lights: { // Different light settings for second model
    ambient: {
      color: 0xffffff,
      intensity: 0.15 // Slightly brighter ambient
    },
    directional: {
      color: 0xffffff,
      intensity: 1.2, // Less intense directional light
      position: { x: 2.5, y: 2, z: 1.5 } // Different position
    }
  }
}];

// Add global GUI management at the top of the file
const activeGUIs = new Set();

function hideAllGUIsExcept(currentGUI) {
  activeGUIs.forEach(gui => {
    if (gui !== currentGUI) {
      gui.domElement.style.display = 'none';
    }
  });
}

class ModelViewer {
  constructor(config) {
    this.config = {
      containerId: 'model-container',
      modelURL: '',
      textureColorURL: '',
      textureRoughnessURL: '',
      textureMetalnessURL: '',
      baseRotation: {
        x: 0.1, // Updated X rotation
        y: 0.6, // Keep right tilt
        z: -0.45 // Keep Z rotation
      },
      cameraSettings: {
        fov: 45,
        near: 0.1,
        far: 100,
        position: { x: 0, y: 0, z: 10 }
      },
      // Add custom light settings for each model
      lights: {
        ambient: {
          color: 0xffffff,
          intensity: 0.1
        },
        directional: {
          color: 0xffffff,
          intensity: 1.4,
          position: { x: 2, y: 2, z: 2 }
        }
      },
      guiShortcut: {
        key: 'b',
        requireShift: true
      },
      modelScale: 5,
      tiltAmount: 0.3, // Reduced tilt amount for lighter hover effect
      ...config
    };

    /*baseRotation: {
        x: 0.44, // Updated X rotation
        y: 0.17,
        z: -0.45
      },
      lights: { // Different light settings for first model
        ambient: {
          color: 0xffffff,
          intensity: 0
        },
        directional: {
          color: 0xffffff,
          intensity: 1.4,
          position: { x: 2, y: 3, z: 2 } // Slightly higher position
        }
      }*/
    // Ensure camera settings exist even if not provided in config
    this.config.cameraSettings = {
      fov: 45,
      near: 0.1,
      far: 100,
      position: { x: 0, y: 0, z: 10 },
      ...this.config.cameraSettings
    };

    // Device detection
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent);
    this.isTablet = /iPad|Android/.test(navigator.userAgent) && !/Mobile/.test(navigator
      .userAgent);

    // Add rotation limits
    this.rotationLimits = {
      min: -2,
      max: 2
    };

    // Initial model state for loading animation
    this.modelState = {
      opacity: 0,
      scale: 0
    };

    this.container = document.getElementById(this.config.containerId);
    if (!this.container) {
      console.error(`Container ${this.config.containerId} not found`);
      return;
    }

    // Bind methods to this instance
    this.onResize = this.onResize.bind(this);
    this.updateModelScale = this.updateModelScale.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.animate = this.animate.bind(this);
    this.toggleGUI = this.toggleGUI.bind(this);

    // Add texture loading optimization settings
    THREE.Cache.enabled = true; // Enable caching of loaded files

    // Simplify renderer settings
    this.rendererSettings = {
      antialias: true,
      alpha: true
    };

    this.init();
    this.addEventListeners();
    requestAnimationFrame(this.animate);
  }

  init() {
    this.scene = new THREE.Scene();

    // Camera setup with configurable position
    this.camera = new THREE.PerspectiveCamera(
      this.config.cameraSettings.fov,
      this.container.clientWidth / this.container.clientHeight,
      this.config.cameraSettings.near,
      this.config.cameraSettings.far
    );
    this.camera.position.set(
      this.config.cameraSettings.position.x,
      this.config.cameraSettings.position.y,
      this.config.cameraSettings.position.z
    );

    // Basic renderer setup without extra optimizations
    this.renderer = new THREE.WebGLRenderer({
      ...this.rendererSettings
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    // Add frustum culling optimization
    this.camera.frustumCulled = true;

    // Remove OrbitControls

    // Configurable lighting
    this.ambientLight = new THREE.AmbientLight(
      this.config.lights.ambient.color,
      this.config.lights.ambient.intensity
    );
    this.directionalLight = new THREE.DirectionalLight(
      this.config.lights.directional.color,
      this.config.lights.directional.intensity
    );
    this.directionalLight.position.set(
      this.config.lights.directional.position.x,
      this.config.lights.directional.position.y,
      this.config.lights.directional.position.z
    );
    this.scene.add(this.ambientLight, this.directionalLight);

    // Setup GUI (Press Shift + G to toggle)
    this.setupGUI();

    // Initial rotation with more dramatic tilt
    this.initialRotation = {
      x: this.config.baseRotation.x,
      y: this.config.baseRotation.y,
      z: this.config.baseRotation.z
    };

    this.loadModel();
  }

  setupGUI() {
    if (!window.dat) {
      console.warn('dat.gui not found, skipping GUI setup');
      return;
    }

    try {
      this.gui = new dat.GUI({ autoPlace: false });
      activeGUIs.add(this.gui);

      // Create a persistent container with unique positioning
      const guiContainer = document.createElement('div');
      guiContainer.id = `gui-container-${this.config.containerId}`;

      // Calculate position based on containerId
      const isSecondModel = this.config.containerId === 'home-glb-container2';
      guiContainer.style.cssText = `
        position: fixed;
        top: ${isSecondModel ? '80px' : '20px'};
        right: 20px;
        z-index: 10000;
        display: block !important;
      `;
      document.body.appendChild(guiContainer);
      guiContainer.appendChild(this.gui.domElement);

      // Only hide the GUI element itself
      this.gui.domElement.style.display = 'none';

      // Add lights folder
      const lightFolder = this.gui.addFolder('Lights');

      // Ambient light controls
      lightFolder.add(this.ambientLight, 'intensity', 0, 2).name('Ambient Intensity');

      // Directional light controls
      const dirLightFolder = lightFolder.addFolder('Directional Light');
      dirLightFolder.add(this.directionalLight, 'intensity', 0, 2).name('Intensity');
      dirLightFolder.add(this.directionalLight.position, 'x', -10, 10).name('Position X');
      dirLightFolder.add(this.directionalLight.position, 'y', -10, 10).name('Position Y');
      dirLightFolder.add(this.directionalLight.position, 'z', -10, 10).name('Position Z');

      // Add light helper toggle
      this.lightHelperVisible = false;
      dirLightFolder.add(this, 'lightHelperVisible').name('Show Helper').onChange((value) => {
        if (value) {
          if (!this.directionalLightHelper) {
            this.directionalLightHelper = new THREE.DirectionalLightHelper(this
              .directionalLight, 1);
            this.scene.add(this.directionalLightHelper);
          }
          this.directionalLightHelper.visible = true;
        } else if (this.directionalLightHelper) {
          this.directionalLightHelper.visible = false;
        }
      });

      // Model rotation controls with clear axis labels
      const rotationFolder = this.gui.addFolder('Model Rotation');
      rotationFolder.add(this.config.baseRotation, 'x', this.rotationLimits.min, this
          .rotationLimits.max)
        .name('Rotate X (Front/Back)')
        .onChange(() => this.updateModelRotation());
      rotationFolder.add(this.config.baseRotation, 'y', this.rotationLimits.min, this
          .rotationLimits.max)
        .name('Rotate Y (Left/Right)')
        .onChange(() => this.updateModelRotation());
      rotationFolder.add(this.config.baseRotation, 'z', this.rotationLimits.min, this
          .rotationLimits.max)
        .name('Rotate Z (Roll)')
        .onChange(() => this.updateModelRotation());

      // Open folders by default
      lightFolder.open();
      dirLightFolder.open();
      rotationFolder.open();

      // Handle GUI visibility
      this.gui.domElement.addEventListener('mouseenter', () => {
        hideAllGUIsExcept(this.gui);
      });

    } catch (error) {
      console.error('Error setting up GUI:', error);
    }
  }

  updateModelRotation() {
    if (!this.model) return;

    // Apply base rotation
    this.model.rotation.x = this.config.baseRotation.x;
    this.model.rotation.y = this.config.baseRotation.y;
    this.model.rotation.z = this.config.baseRotation.z;
  }

  updateModelScale() {
    if (!this.model || !this.camera) return;

    // Get current viewport dimensions
    const rect = this.container.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;

    // Calculate viewport size at camera's position
    const fov = this.camera.fov * (Math.PI / 180);
    const viewportHeight = 2.0 * Math.tan(fov / 2) * this.camera.position.z;
    const viewportWidth = viewportHeight * aspectRatio;

    // Get model size
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Calculate scale to fit viewport
    const maxViewportDim = Math.min(viewportWidth, viewportHeight);
    this.targetScale = (maxViewportDim / maxDim) * (this.config.modelScale * 0.15);

    // Apply scale with animation
    gsap.to(this.model.scale, {
      x: this.targetScale,
      y: this.targetScale,
      z: this.targetScale,
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  loadModel() {
    const loader = new THREE.GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    // Simplify loading manager
    const loadingManager = new THREE.LoadingManager();

    let loadedItems = 0;
    const totalItems = 1 + (this.config.textureColorURL ? 1 : 0) +
      (this.config.textureRoughnessURL ? 1 : 0) +
      (this.config.textureMetalnessURL ? 1 : 0);

    // Calculate viewport dimensions for scaling
    const viewportHeight = this.camera.position.z * Math.tan(THREE.MathUtils.degToRad(this.camera
      .fov * 0.5)) * 2;
    const viewportWidth = viewportHeight * (this.container.clientWidth / this.container
      .clientHeight);

    const checkAllLoaded = () => {
      loadedItems++;
      if (loadedItems === totalItems) {
        // Everything is loaded, animate in
        gsap.to(this.modelState, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            if (this.model) {
              // Apply current animation scale while maintaining target scale ratio
              this.model.scale.set(
                this.targetScale * this.modelState.scale,
                this.targetScale * this.modelState.scale,
                this.targetScale * this.modelState.scale
              );
              this.model.traverse(node => {
                if (node.isMesh) {
                  node.material.opacity = this.modelState.opacity;
                }
              });
              this.needsUpdate = true;
            }
          }
        });
      }
    };

    // Preload textures
    const textures = {
      color: null,
      roughness: null,
      metalness: null
    };

    // Optimize texture loading
    const textureLoadPromises = [];
    if (this.config.textureColorURL) {
      textureLoadPromises.push(
        new Promise(resolve => {
          textureLoader.load(this.config.textureColorURL, texture => {
            texture.generateMipmaps = false; // Disable mipmaps if not needed
            texture.minFilter = THREE.LinearFilter;
            textures.color = texture;
            resolve();
          });
        })
      );
    }

    if (this.config.textureRoughnessURL) {
      textureLoadPromises.push(
        new Promise(resolve => {
          textureLoader.load(this.config.textureRoughnessURL, texture => {
            texture.generateMipmaps = false; // Disable mipmaps if not needed
            texture.minFilter = THREE.LinearFilter;
            textures.roughness = texture;
            resolve();
          });
        })
      );
    }

    if (this.config.textureMetalnessURL) {
      textureLoadPromises.push(
        new Promise(resolve => {
          textureLoader.load(this.config.textureMetalnessURL, texture => {
            texture.generateMipmaps = false; // Disable mipmaps if not needed
            texture.minFilter = THREE.LinearFilter;
            textures.metalness = texture;
            resolve();
          });
        })
      );
    }

    // Add loading error handler
    const onError = (error) => {
      console.error(`Error loading model ${this.config.modelURL}:`, error);
    };

    // Load model with error handling
    loader.load(
      this.config.modelURL,
      (gltf) => {
        this.model = gltf.scene;

        // Calculate proper scale to fit viewport
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const maxViewportDim = Math.min(viewportWidth, viewportHeight);
        this.targetScale = (maxViewportDim / maxDim) * (this.config.modelScale * 0.15);

        // Center and apply initial transforms
        this.model.position.sub(center);
        this.model.rotation.set(
          this.initialRotation.x,
          this.initialRotation.y,
          this.initialRotation.z
        );

        // Start with scale 0
        this.model.scale.set(0, 0, 0);

        // Simple material setup
        this.model.traverse((node) => {
          if (node.isMesh) {
            const material = new THREE.MeshStandardMaterial({
              metalness: 0.9,
              roughness: 0.4,
              transparent: true,
              opacity: 0
            });

            if (textures.color) {
              material.map = textures.color;
            }
            if (textures.roughness) {
              material.roughnessMap = textures.roughness;
            }
            if (textures.metalness) {
              material.metalnessMap = textures.metalness;
            }

            node.material = material;
          }
        });

        this.scene.add(this.model);
        this.needsUpdate = true;

        // Animate in
        gsap.to(this.modelState, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          onUpdate: () => {
            if (this.model) {
              this.model.scale.set(
                this.targetScale * this.modelState.scale,
                this.targetScale * this.modelState.scale,
                this.targetScale * this.modelState.scale
              );
              this.model.traverse(node => {
                if (node.isMesh) {
                  node.material.opacity = this.modelState.opacity;
                }
              });
              this.needsUpdate = true;
            }
          }
        });
      },
      undefined,
      onError
    );
  }

  toggleGUI() {
    if (this.gui) {
      const isHidden = this.gui.domElement.style.display === 'none';
      if (isHidden) {
        hideAllGUIsExcept(this.gui);
        this.gui.domElement.style.display = 'block';
        this.gui.domElement.parentElement.style.display = 'block'; // Show container too
      } else {
        this.gui.domElement.style.display = 'none';
      }
    }
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);

    // Device-specific event listeners
    if (this.isMobile || this.isTablet) {
      this.container.addEventListener('touchstart', this.onTouchStart);
      this.container.addEventListener('touchmove', this.onTouchMove);
      this.container.addEventListener('touchend', this.onTouchEnd);
    } else {
      this.container.addEventListener('mousemove', this.onMouseMove);
      this.container.addEventListener('mouseleave', this.onMouseLeave);
    }

    // GUI shortcut
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === this.config.guiShortcut.key) {
        this.toggleGUI();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    this.keydownHandler = handleKeyDown; // Store for cleanup
  }

  // Touch event handlers
  onTouchStart(e) {
    if (!this.model) return;
    this.touchStartY = e.touches[0].clientY;
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchMove(e) {
    if (!this.model || !this.touchStartY) return;

    const rect = this.container.getBoundingClientRect();
    const touchX = (e.touches[0].clientX - this.touchStartX) / rect.width;
    const touchY = (e.touches[0].clientY - this.touchStartY) / rect.height;

    gsap.to(this.model.rotation, {
      x: this.initialRotation.x - touchY * this.config.tiltAmount,
      y: this.initialRotation.y + touchX * this.config.tiltAmount,
      duration: 0.5
    });
  }

  onTouchEnd() {
    if (!this.model) return;

    gsap.to(this.model.rotation, {
      x: this.initialRotation.x,
      y: this.initialRotation.y,
      z: this.initialRotation.z,
      duration: 0.5
    });

    this.touchStartY = null;
    this.touchStartX = null;
  }

  onMouseMove(e) {
    if (!this.model) return;

    const rect = this.container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Use baseRotation as the center point for hover movement
    gsap.to(this.model.rotation, {
      x: this.config.baseRotation.x - (y - 0.5) * this.config.tiltAmount,
      y: this.config.baseRotation.y + (x - 0.5) * this.config.tiltAmount,
      z: this.config.baseRotation.z, // Maintain Z rotation during hover
      duration: 0.5
    });
  }

  onMouseLeave() {
    if (!this.model) return;

    // Return to base rotation values
    gsap.to(this.model.rotation, {
      x: this.config.baseRotation.x,
      y: this.config.baseRotation.y,
      z: this.config.baseRotation.z,
      duration: 0.5
    });
  }

  onResize() {
    if (!this.camera || !this.renderer) return;

    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    // Update model scale when resizing
    this.updateModelScale();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.renderer && this.scene && this.camera) {
      // Always render for now to ensure visibility
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);

    if (this.isMobile || this.isTablet) {
      this.container.removeEventListener('touchstart', this.onTouchStart);
      this.container.removeEventListener('touchmove', this.onTouchMove);
      this.container.removeEventListener('touchend', this.onTouchEnd);
    } else {
      this.container.removeEventListener('mousemove', this.onMouseMove);
      this.container.removeEventListener('mouseleave', this.onMouseLeave);
    }

    window.removeEventListener('keydown', this.keydownHandler);

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.gui) {
      activeGUIs.delete(this.gui);
      this.gui.destroy();
    }

    if (this.directionalLightHelper) {
      this.scene.remove(this.directionalLightHelper);
      this.directionalLightHelper.dispose();
    }

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Initialize viewers
//const viewers = modelConfigs.map(config => new ModelViewer(config));
// Initialize viewers with detailed logging
const viewers = modelConfigs
  .filter(config => {
    const exists = document.getElementById(config.containerId);
    if (!exists) {
      console.warn(`Container #${config.containerId} not found in page - skipping viewer initialization`);
    }
    return exists;
  })
  .map(config => {
    console.log(`Initializing viewer for #${config.containerId}`);
    return new ModelViewer(config);
  });

console.log(`Initialized ${viewers.length} of ${modelConfigs.length} configured viewers`);
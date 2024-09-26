// Import required modules from Three.js library
import * as THREE from 'three';
// Import the WebAssembly module and AudioProcessor class
import init, { AudioProcessor } from '../../pkg/audio_fft_wasm';

class AudioHandler {
    // Define private properties for audio processing
    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    private audioProcessor: AudioProcessor | null = null;

    // Define private properties for Three.js rendering
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private fftTexture: THREE.DataTexture;

    // Define a property for displaying debug information
    private debugText: HTMLDivElement;

    constructor() {
        // Initialize Web Audio API context and analyzer
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048; // Set FFT size (must be a power of 2)

        // Set up Three.js scene and debug text
        this.initThreeJs();
        this.createDebugText();
    }

    async initialize() {
        console.log("Initializing AudioHandler");
        await init(); // Initialize WebAssembly module
        // Create AudioProcessor instance with the same FFT size as the analyzer
        this.audioProcessor = new AudioProcessor(this.analyser.fftSize);
        console.log("AudioProcessor created");
        await this.setupAudioInput();
        
        // Ensure audio context is running (it may be suspended due to autoplay policies)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        console.log("AudioContext state:", this.audioContext.state);
        
        // Start the animation loop
        this.animate();
    }

    private async setupAudioInput() {
        console.log("Setting up audio input");
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Create a media stream source from the microphone input
            const source = this.audioContext.createMediaStreamSource(stream);
            // Connect the source to the analyzer
            source.connect(this.analyser);
            console.log("Audio input set up successfully");
        } catch (error) {
            console.error("Error setting up audio input:", error);
        }
    }

    private initThreeJs() {
        console.log("Initializing Three.js");
        // Create a WebGL renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1); // Set background to black
        
        // Style the canvas element
        const canvas = this.renderer.domElement;
        canvas.style.border = '2px solid red';
        canvas.style.boxSizing = 'border-box';
        
        // Add the canvas to the document body
        document.body.appendChild(canvas);

        // Create a new Three.js scene
        this.scene = new THREE.Scene();
        // Set up an orthographic camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.z = 1;

        // Initialize FFT texture
        const size = this.analyser.fftSize / 2;
        const data = new Uint8Array(4 * size);
        this.fftTexture = new THREE.DataTexture(data, size, 1, THREE.RGBAFormat);

        // Create a plane to render the FFT texture
        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const planeMaterial = new THREE.MeshBasicMaterial({ 
            map: this.fftTexture,
            side: THREE.DoubleSide
        });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        this.scene.add(planeMesh);

        console.log("Three.js initialized");
    }

    private createDebugText() {
        // Create a div element for displaying debug information
        this.debugText = document.createElement('div');
        this.debugText.style.position = 'absolute';
        this.debugText.style.top = '10px';
        this.debugText.style.left = '10px';
        this.debugText.style.color = 'white';
        this.debugText.style.fontFamily = 'Arial, sans-serif';
        this.debugText.style.fontSize = '14px';
        document.body.appendChild(this.debugText);
    }

    private animate = () => {
        // Request the next animation frame
        requestAnimationFrame(this.animate);

        // Get audio data from the analyzer
        const dataArray = new Float32Array(this.analyser.fftSize);
        this.analyser.getFloatTimeDomainData(dataArray);
        console.log("Audio data captured:", dataArray.slice(0, 5)); // Log first 5 elements

        let fftData: Float32Array;
        if (this.audioProcessor) {
            // Process audio data using WebAssembly module
            fftData = this.audioProcessor.process_audio(dataArray);
            console.log("FFT processed:", fftData.slice(0, 5)); // Log first 5 elements
        } else {
            console.warn("AudioProcessor not initialized");
            fftData = new Float32Array(dataArray.length / 2);
        }

        // Update texture data
        const textureData = new Uint8Array(4 * fftData.length);
        for (let i = 0; i < fftData.length; i++) {
            const value = Math.min(255, Math.max(0, fftData[i] * 255));
            textureData[i * 4] = value;     // R
            textureData[i * 4 + 1] = value; // G
            textureData[i * 4 + 2] = value; // B
            textureData[i * 4 + 3] = 255;   // A (fully opaque)
        }
        this.fftTexture.image.data = textureData;
        this.fftTexture.needsUpdate = true;

        // Render the scene
        this.renderer.render(this.scene, this.camera);
        console.log("Scene rendered");

        // Update debug text with FFT data statistics
        const minValue = this.getMinValue(fftData);
        const maxValue = this.getMaxValue(fftData);
        this.debugText.textContent = `FFT Data: Min=${minValue.toFixed(2)}, Max=${maxValue.toFixed(2)}`;
    }

    private getMinValue(arr: Float32Array): number {
        let min = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < min) min = arr[i];
        }
        return min;
    }

    private getMaxValue(arr: Float32Array): number {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        return max;
    }
}

export function initAudioHandler() {
    console.log("initAudioHandler called");
    const audioHandler = new AudioHandler();
    audioHandler.initialize();
}
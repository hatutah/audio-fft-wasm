# Audio FFT WebAssembly Visualizer

This project demonstrates real-time audio visualization using Fast Fourier Transform (FFT) implemented in Rust and compiled to WebAssembly, with a TypeScript and Three.js frontend.

## Prerequisites

Before you begin, you need to install the following tools:

1. Rust
2. Node.js
3. wasm-pack
4. npm (comes with Node.js)

### Installing Rust

1. Visit the official Rust website: https://www.rust-lang.org/tools/install
2. Follow the instructions for your operating system. For most systems, you can use the following command:
   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
3. Follow the on-screen prompts to complete the installation.
4. After installation, restart your terminal or run:
   ```
   source $HOME/.cargo/env
   ```
5. Verify the installation by running:
   ```
   rustc --version
   ```

### Installing Node.js and npm

1. Visit the official Node.js website: https://nodejs.org/
2. Download and install the LTS version for your operating system.
3. After installation, verify by running:
   ```
   node --version
   npm --version
   ```

### Installing wasm-pack

1. Open a terminal or command prompt.
2. Run the following command:
   ```
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```
3. Verify the installation by running:
   ```
   wasm-pack --version
   ```

## Project Structure

- `src/`: Contains the Rust source code for the WebAssembly module.
- `web/`: Contains the TypeScript and HTML files for the web interface.

## Setup and Running

1. Clone the repository:
   ```
   git clone https://github.com/your-username/audio-fft-wasm.git
   cd audio-fft-wasm
   ```

2. Build the WebAssembly module:
   ```
   wasm-pack build --target web
   ```

3. Navigate to the `web/` directory and install dependencies:
   ```
   cd web
   npm install
   ```

4. Build and start the web application:
   ```
   npm run build
   npm run start
   ```

5. Open your web browser and navigate to `http://localhost:8080` (or the port specified in the console output).

## Usage

1. When the page loads, you should see a black screen with a red border.
2. The application will request microphone access. Allow it to use your microphone.
3. Speak or play audio near your microphone. You should see a visualization of the audio frequencies on the screen.
4. Check the debug text in the top-left corner for FFT data statistics.

## Troubleshooting

- If you don't see the visualization, check the browser console for any error messages.
- Ensure your microphone is working and properly selected in your browser settings.
- If you encounter any "Module not found" errors during build, ensure all dependencies are correctly installed and the paths in the import statements are correct.

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
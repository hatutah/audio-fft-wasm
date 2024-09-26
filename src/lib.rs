// Import necessary items from the wasm_bindgen crate
use wasm_bindgen::prelude::*;
// Import Complex number type and FftPlanner from the rustfft crate
use rustfft::{FftPlanner, num_complex::Complex};
// Import Arc for thread-safe reference counting
use std::sync::Arc;

// Define a struct that will be exposed to JavaScript
#[wasm_bindgen]
pub struct AudioProcessor {
    // Store the FFT (Fast Fourier Transform) object
    // Arc is used for thread-safe reference counting
    // dyn keyword is used for dynamic dispatch
    fft: Arc<dyn rustfft::Fft<f32>>,
}

// Implement methods for AudioProcessor that will be callable from JavaScript
#[wasm_bindgen]
impl AudioProcessor {
    // Constructor for AudioProcessor
    // This will be called when creating a new instance in JavaScript
    #[wasm_bindgen(constructor)]
    pub fn new(size: usize) -> Self {
        // Create a new FFT planner
        let mut planner = FftPlanner::new();
        // Plan a forward FFT of the specified size
        let fft = planner.plan_fft_forward(size);
        // Return a new AudioProcessor instance
        AudioProcessor { fft }
    }

    // Method to process audio data
    // This will be callable from JavaScript
    #[wasm_bindgen]
    pub fn process_audio(&self, audio_data: &[f32]) -> Vec<f32> {
        // Convert the input audio data to complex numbers
        // Real part is set to the audio sample, imaginary part is set to 0
        let mut complex_data: Vec<Complex<f32>> = audio_data.iter().map(|&x| Complex::new(x, 0.0)).collect();
        
        // Perform the FFT on the complex data
        self.fft.process(&mut complex_data);
        
        // Convert the complex FFT result back to real numbers
        // We take the magnitude (norm) of each complex number
        complex_data.iter().map(|c| c.norm()).collect()
    }
}
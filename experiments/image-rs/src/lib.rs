use wasm_bindgen::prelude::*;
use image::{ImageBuffer, Rgba, DynamicImage, imageops, GenericImageView};

/// Image wrapper for JS interop
#[wasm_bindgen]
pub struct Image {
    img: DynamicImage,
}

#[wasm_bindgen]
impl Image {
    /// Create image from RGBA pixel data
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32, data: &[u8]) -> Result<Image, String> {
        let img_buffer = ImageBuffer::<Rgba<u8>, Vec<u8>>::from_raw(width, height, data.to_vec())
            .ok_or_else(|| "Invalid image dimensions or data".to_string())?;

        Ok(Image {
            img: DynamicImage::ImageRgba8(img_buffer),
        })
    }

    pub fn width(&self) -> u32 {
        self.img.width()
    }

    pub fn height(&self) -> u32 {
        self.img.height()
    }

    /// Get RGBA pixel data
    pub fn to_rgba(&self) -> Vec<u8> {
        self.img.to_rgba8().into_raw()
    }

    /// Resize image (uses Lanczos3 filter)
    pub fn resize(&self, width: u32, height: u32) -> Image {
        let resized = self.img.resize(width, height, imageops::FilterType::Lanczos3);
        Image { img: resized }
    }

    /// Resize image (fast, uses nearest neighbor)
    pub fn resize_fast(&self, width: u32, height: u32) -> Image {
        let resized = self.img.resize_exact(width, height, imageops::FilterType::Nearest);
        Image { img: resized }
    }

    /// Blur image
    pub fn blur(&self, sigma: f32) -> Image {
        let blurred = self.img.blur(sigma);
        Image { img: blurred }
    }

    /// Rotate 90 degrees clockwise
    pub fn rotate90(&self) -> Image {
        let rotated = self.img.rotate90();
        Image { img: rotated }
    }

    /// Rotate 180 degrees
    pub fn rotate180(&self) -> Image {
        let rotated = self.img.rotate180();
        Image { img: rotated }
    }

    /// Rotate 270 degrees clockwise
    pub fn rotate270(&self) -> Image {
        let rotated = self.img.rotate270();
        Image { img: rotated }
    }

    /// Flip horizontal
    pub fn fliph(&self) -> Image {
        let flipped = self.img.fliph();
        Image { img: flipped }
    }

    /// Flip vertical
    pub fn flipv(&self) -> Image {
        let flipped = self.img.flipv();
        Image { img: flipped }
    }

    /// Convert to grayscale
    pub fn grayscale(&self) -> Image {
        let gray = self.img.grayscale();
        Image { img: gray }
    }

    /// Invert colors
    pub fn invert(&mut self) {
        self.img.invert();
    }

    /// Adjust contrast
    pub fn adjust_contrast(&self, contrast: f32) -> Image {
        let adjusted = self.img.adjust_contrast(contrast);
        Image { img: adjusted }
    }

    /// Adjust brightness
    pub fn brighten(&self, value: i32) -> Image {
        let brightened = self.img.brighten(value);
        Image { img: brightened }
    }

    /// Encode as PNG
    pub fn encode_png(&self) -> Result<Vec<u8>, String> {
        let mut buffer = Vec::new();
        self.img
            .write_to(&mut std::io::Cursor::new(&mut buffer), image::ImageFormat::Png)
            .map_err(|e| format!("PNG encoding failed: {}", e))?;
        Ok(buffer)
    }

    /// Encode as JPEG with quality (1-100)
    pub fn encode_jpeg(&self, quality: u8) -> Result<Vec<u8>, String> {
        let mut buffer = Vec::new();
        let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(
            &mut buffer,
            quality.clamp(1, 100),
        );
        self.img.write_with_encoder(encoder)
            .map_err(|e| format!("JPEG encoding failed: {}", e))?;
        Ok(buffer)
    }

    /// Crop image
    pub fn crop(&self, x: u32, y: u32, width: u32, height: u32) -> Image {
        let cropped = self.img.crop_imm(x, y, width, height);
        Image { img: cropped }
    }

    /// Get pixel at (x, y) as [r, g, b, a]
    pub fn get_pixel(&self, x: u32, y: u32) -> Vec<u8> {
        let pixel = self.img.get_pixel(x, y);
        vec![pixel[0], pixel[1], pixel[2], pixel[3]]
    }
}

/// Decode PNG from bytes
#[wasm_bindgen]
pub fn decode_png(data: &[u8]) -> Result<Image, String> {
    let img = image::load_from_memory_with_format(data, image::ImageFormat::Png)
        .map_err(|e| format!("PNG decode failed: {}", e))?;
    Ok(Image { img })
}

/// Decode JPEG from bytes
#[wasm_bindgen]
pub fn decode_jpeg(data: &[u8]) -> Result<Image, String> {
    let img = image::load_from_memory_with_format(data, image::ImageFormat::Jpeg)
        .map_err(|e| format!("JPEG decode failed: {}", e))?;
    Ok(Image { img })
}

/// Decode GIF from bytes
#[wasm_bindgen]
pub fn decode_gif(data: &[u8]) -> Result<Image, String> {
    let img = image::load_from_memory_with_format(data, image::ImageFormat::Gif)
        .map_err(|e| format!("GIF decode failed: {}", e))?;
    Ok(Image { img })
}

#[wasm_bindgen]
pub fn get_version() -> String {
    "image-rs-wasm 0.1.0 (image 0.25)".to_string()
}

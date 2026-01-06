use wasm_bindgen::prelude::*;
use nalgebra::{DMatrix, DVector, Matrix3, Matrix4, Vector3, Vector4};

/// Matrix wrapper for JS interop
#[wasm_bindgen]
pub struct Matrix {
    inner: DMatrix<f64>,
}

#[wasm_bindgen]
impl Matrix {
    #[wasm_bindgen(constructor)]
    pub fn new(rows: usize, cols: usize) -> Matrix {
        Matrix {
            inner: DMatrix::zeros(rows, cols),
        }
    }

    pub fn from_data(rows: usize, cols: usize, data: &[f64]) -> Matrix {
        let mat = DMatrix::from_row_slice(rows, cols, data);
        Matrix { inner: mat }
    }

    pub fn rows(&self) -> usize {
        self.inner.nrows()
    }

    pub fn cols(&self) -> usize {
        self.inner.ncols()
    }

    pub fn get(&self, row: usize, col: usize) -> f64 {
        self.inner[(row, col)]
    }

    pub fn set(&mut self, row: usize, col: usize, val: f64) {
        self.inner[(row, col)] = val;
    }

    pub fn to_data(&self) -> Vec<f64> {
        self.inner.iter().cloned().collect()
    }

    pub fn multiply(&self, other: &Matrix) -> Matrix {
        Matrix {
            inner: &self.inner * &other.inner,
        }
    }

    pub fn add(&self, other: &Matrix) -> Matrix {
        Matrix {
            inner: &self.inner + &other.inner,
        }
    }

    pub fn transpose(&self) -> Matrix {
        Matrix {
            inner: self.inner.transpose(),
        }
    }

    pub fn determinant(&self) -> f64 {
        self.inner.determinant()
    }

    pub fn norm(&self) -> f64 {
        self.inner.norm()
    }

    pub fn scale(&mut self, s: f64) {
        self.inner *= s;
    }

    pub fn set_identity(&mut self) {
        self.inner.fill_with_identity();
    }

    /// Solve Ax = b using LU decomposition
    pub fn solve(&self, b: &[f64]) -> Option<Vec<f64>> {
        let b_vec = DVector::from_row_slice(b);
        self.inner
            .clone()
            .lu()
            .solve(&b_vec)
            .map(|x| x.iter().cloned().collect())
    }

    /// Get eigenvalues for symmetric matrix
    pub fn symmetric_eigenvalues(&self) -> Vec<f64> {
        let symmetric = self.inner.clone().symmetric_part();
        symmetric.symmetric_eigenvalues().iter().cloned().collect()
    }
}

/// Vector wrapper
#[wasm_bindgen]
pub struct Vector {
    inner: DVector<f64>,
}

#[wasm_bindgen]
impl Vector {
    #[wasm_bindgen(constructor)]
    pub fn new(size: usize) -> Vector {
        Vector {
            inner: DVector::zeros(size),
        }
    }

    pub fn from_data(data: &[f64]) -> Vector {
        Vector {
            inner: DVector::from_row_slice(data),
        }
    }

    pub fn size(&self) -> usize {
        self.inner.len()
    }

    pub fn get(&self, idx: usize) -> f64 {
        self.inner[idx]
    }

    pub fn set(&mut self, idx: usize, val: f64) {
        self.inner[idx] = val;
    }

    pub fn to_data(&self) -> Vec<f64> {
        self.inner.iter().cloned().collect()
    }

    pub fn dot(&self, other: &Vector) -> f64 {
        self.inner.dot(&other.inner)
    }

    pub fn norm(&self) -> f64 {
        self.inner.norm()
    }

    pub fn normalize(&mut self) {
        self.inner.normalize_mut();
    }

    pub fn add(&self, other: &Vector) -> Vector {
        Vector {
            inner: &self.inner + &other.inner,
        }
    }

    pub fn scale(&mut self, s: f64) {
        self.inner *= s;
    }
}

/// Fixed-size 3D operations (optimized)
#[wasm_bindgen]
pub fn vec3_cross(a: &[f64], b: &[f64]) -> Vec<f64> {
    let v1 = Vector3::new(a[0], a[1], a[2]);
    let v2 = Vector3::new(b[0], b[1], b[2]);
    let result = v1.cross(&v2);
    vec![result.x, result.y, result.z]
}

#[wasm_bindgen]
pub fn vec3_dot(a: &[f64], b: &[f64]) -> f64 {
    let v1 = Vector3::new(a[0], a[1], a[2]);
    let v2 = Vector3::new(b[0], b[1], b[2]);
    v1.dot(&v2)
}

#[wasm_bindgen]
pub fn vec3_normalize(v: &[f64]) -> Vec<f64> {
    let v = Vector3::new(v[0], v[1], v[2]);
    let n = v.normalize();
    vec![n.x, n.y, n.z]
}

/// 4x4 matrix operations (common in graphics)
#[wasm_bindgen]
pub fn mat4_multiply(a: &[f64], b: &[f64]) -> Vec<f64> {
    let m1 = Matrix4::from_row_slice(a);
    let m2 = Matrix4::from_row_slice(b);
    let result = m1 * m2;
    result.as_slice().to_vec()
}

#[wasm_bindgen]
pub fn mat4_inverse(m: &[f64]) -> Option<Vec<f64>> {
    let mat = Matrix4::from_row_slice(m);
    mat.try_inverse().map(|inv| inv.as_slice().to_vec())
}

#[wasm_bindgen]
pub fn mat4_transpose(m: &[f64]) -> Vec<f64> {
    let mat = Matrix4::from_row_slice(m);
    mat.transpose().as_slice().to_vec()
}

/// Transform a vec4 by a mat4
#[wasm_bindgen]
pub fn mat4_transform_vec4(m: &[f64], v: &[f64]) -> Vec<f64> {
    let mat = Matrix4::from_row_slice(m);
    let vec = Vector4::new(v[0], v[1], v[2], v[3]);
    let result = mat * vec;
    vec![result.x, result.y, result.z, result.w]
}

/// Create common transformation matrices
#[wasm_bindgen]
pub fn mat4_translation(x: f64, y: f64, z: f64) -> Vec<f64> {
    let m = Matrix4::new_translation(&Vector3::new(x, y, z));
    m.as_slice().to_vec()
}

#[wasm_bindgen]
pub fn mat4_scaling(x: f64, y: f64, z: f64) -> Vec<f64> {
    let m = Matrix4::new_nonuniform_scaling(&Vector3::new(x, y, z));
    m.as_slice().to_vec()
}

#[wasm_bindgen]
pub fn mat4_rotation_x(angle: f64) -> Vec<f64> {
    let m = Matrix4::from_euler_angles(angle, 0.0, 0.0);
    m.as_slice().to_vec()
}

#[wasm_bindgen]
pub fn mat4_rotation_y(angle: f64) -> Vec<f64> {
    let m = Matrix4::from_euler_angles(0.0, angle, 0.0);
    m.as_slice().to_vec()
}

#[wasm_bindgen]
pub fn mat4_rotation_z(angle: f64) -> Vec<f64> {
    let m = Matrix4::from_euler_angles(0.0, 0.0, angle);
    m.as_slice().to_vec()
}

#[wasm_bindgen]
pub fn get_version() -> String {
    "nalgebra-wasm 1.0.0".to_string()
}

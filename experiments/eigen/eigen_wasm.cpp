/**
 * Eigen WASM Wrapper
 * Linear algebra operations
 */

#include <emscripten/bind.h>
#include <Eigen/Dense>
#include <vector>
#include <string>

using namespace emscripten;
using namespace Eigen;

// Matrix wrapper class
class EigenMatrixWrapper {
private:
    MatrixXd mat;

public:
    EigenMatrixWrapper(int rows, int cols) : mat(rows, cols) {
        mat.setZero();
    }

    void set(int row, int col, double val) {
        mat(row, col) = val;
    }

    double get(int row, int col) const {
        return mat(row, col);
    }

    int rows() const { return mat.rows(); }
    int cols() const { return mat.cols(); }

    void setFromVector(const std::vector<double>& data) {
        int idx = 0;
        for (int i = 0; i < mat.rows() && idx < data.size(); i++) {
            for (int j = 0; j < mat.cols() && idx < data.size(); j++) {
                mat(i, j) = data[idx++];
            }
        }
    }

    std::vector<double> toVector() const {
        std::vector<double> result(mat.rows() * mat.cols());
        int idx = 0;
        for (int i = 0; i < mat.rows(); i++) {
            for (int j = 0; j < mat.cols(); j++) {
                result[idx++] = mat(i, j);
            }
        }
        return result;
    }

    // Matrix operations
    EigenMatrixWrapper multiply(const EigenMatrixWrapper& other) const {
        EigenMatrixWrapper result(mat.rows(), other.mat.cols());
        result.mat = mat * other.mat;
        return result;
    }

    EigenMatrixWrapper add(const EigenMatrixWrapper& other) const {
        EigenMatrixWrapper result(mat.rows(), mat.cols());
        result.mat = mat + other.mat;
        return result;
    }

    EigenMatrixWrapper subtract(const EigenMatrixWrapper& other) const {
        EigenMatrixWrapper result(mat.rows(), mat.cols());
        result.mat = mat - other.mat;
        return result;
    }

    EigenMatrixWrapper transpose() const {
        EigenMatrixWrapper result(mat.cols(), mat.rows());
        result.mat = mat.transpose();
        return result;
    }

    EigenMatrixWrapper inverse() const {
        EigenMatrixWrapper result(mat.rows(), mat.cols());
        result.mat = mat.inverse();
        return result;
    }

    double determinant() const {
        return mat.determinant();
    }

    double norm() const {
        return mat.norm();
    }

    void scale(double s) {
        mat *= s;
    }

    // Identity and special matrices
    void setIdentity() {
        mat.setIdentity();
    }

    void setRandom() {
        mat.setRandom();
    }

    // Decompositions
    std::vector<double> eigenvalues() const {
        SelfAdjointEigenSolver<MatrixXd> solver(mat);
        VectorXd ev = solver.eigenvalues();
        std::vector<double> result(ev.size());
        for (int i = 0; i < ev.size(); i++) {
            result[i] = ev(i);
        }
        return result;
    }

    // Solve linear system Ax = b
    std::vector<double> solve(const std::vector<double>& b) const {
        VectorXd bVec(b.size());
        for (size_t i = 0; i < b.size(); i++) {
            bVec(i) = b[i];
        }
        VectorXd x = mat.colPivHouseholderQr().solve(bVec);
        std::vector<double> result(x.size());
        for (int i = 0; i < x.size(); i++) {
            result[i] = x(i);
        }
        return result;
    }
};

// Vector wrapper for convenience
class EigenVectorWrapper {
private:
    VectorXd vec;

public:
    EigenVectorWrapper(int size) : vec(size) {
        vec.setZero();
    }

    void set(int idx, double val) {
        vec(idx) = val;
    }

    double get(int idx) const {
        return vec(idx);
    }

    int size() const { return vec.size(); }

    void setFromVector(const std::vector<double>& data) {
        for (size_t i = 0; i < data.size() && i < vec.size(); i++) {
            vec(i) = data[i];
        }
    }

    std::vector<double> toVector() const {
        std::vector<double> result(vec.size());
        for (int i = 0; i < vec.size(); i++) {
            result[i] = vec(i);
        }
        return result;
    }

    double dot(const EigenVectorWrapper& other) const {
        return vec.dot(other.vec);
    }

    double norm() const {
        return vec.norm();
    }

    void normalize() {
        vec.normalize();
    }

    // Cross product requires fixed-size Vector3d, not dynamic VectorXd
    // Manual implementation for 3D vectors
    EigenVectorWrapper cross3(const EigenVectorWrapper& other) const {
        EigenVectorWrapper result(3);
        if (vec.size() >= 3 && other.vec.size() >= 3) {
            result.vec(0) = vec(1) * other.vec(2) - vec(2) * other.vec(1);
            result.vec(1) = vec(2) * other.vec(0) - vec(0) * other.vec(2);
            result.vec(2) = vec(0) * other.vec(1) - vec(1) * other.vec(0);
        }
        return result;
    }
};

std::string getVersion() {
    return "eigen-wasm 1.0.0 (Eigen " + std::to_string(EIGEN_WORLD_VERSION) + "." +
           std::to_string(EIGEN_MAJOR_VERSION) + "." + std::to_string(EIGEN_MINOR_VERSION) + ")";
}

EMSCRIPTEN_BINDINGS(eigen) {
    emscripten::function("getVersion", &getVersion);

    class_<EigenMatrixWrapper>("Matrix")
        .constructor<int, int>()
        .function("set", &EigenMatrixWrapper::set)
        .function("get", &EigenMatrixWrapper::get)
        .function("rows", &EigenMatrixWrapper::rows)
        .function("cols", &EigenMatrixWrapper::cols)
        .function("setFromVector", &EigenMatrixWrapper::setFromVector)
        .function("toVector", &EigenMatrixWrapper::toVector)
        .function("multiply", &EigenMatrixWrapper::multiply)
        .function("add", &EigenMatrixWrapper::add)
        .function("subtract", &EigenMatrixWrapper::subtract)
        .function("transpose", &EigenMatrixWrapper::transpose)
        .function("inverse", &EigenMatrixWrapper::inverse)
        .function("determinant", &EigenMatrixWrapper::determinant)
        .function("norm", &EigenMatrixWrapper::norm)
        .function("scale", &EigenMatrixWrapper::scale)
        .function("setIdentity", &EigenMatrixWrapper::setIdentity)
        .function("setRandom", &EigenMatrixWrapper::setRandom)
        .function("eigenvalues", &EigenMatrixWrapper::eigenvalues)
        .function("solve", &EigenMatrixWrapper::solve);

    class_<EigenVectorWrapper>("Vector")
        .constructor<int>()
        .function("set", &EigenVectorWrapper::set)
        .function("get", &EigenVectorWrapper::get)
        .function("size", &EigenVectorWrapper::size)
        .function("setFromVector", &EigenVectorWrapper::setFromVector)
        .function("toVector", &EigenVectorWrapper::toVector)
        .function("dot", &EigenVectorWrapper::dot)
        .function("norm", &EigenVectorWrapper::norm)
        .function("normalize", &EigenVectorWrapper::normalize)
        .function("cross3", &EigenVectorWrapper::cross3);

    register_vector<double>("VectorDouble");
}

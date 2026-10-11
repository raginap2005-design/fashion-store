import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/auth/login",
        formData
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        const role =
          response.data.user?.role ||
          response.data.role;

        if (role) {
          localStorage.setItem("role", role);
        }

        alert("Login successful!");

        if (role === "admin") {
          navigate("/admin");
        } else if (role === "user") {
          navigate("/dashboard");
        } else {
          alert("User role not received from server");
        }
      } else {
        alert("Token not received");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      alert(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f7, #f3e8ff, #e8f7ff)",
        padding: "60px 20px",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div
              className="card border-0 shadow"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: "55px" }}>👗</div>

                  <h2
                    style={{
                      color: "#d63384",
                      fontWeight: "800",
                    }}
                  >
                    Welcome Back
                  </h2>

                  <p className="text-muted">
                    Login to your StyleHub account
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-bold">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="text-end mb-4">
                    <Link
                      to="/forgot-password"
                      style={{
                        color: "#d63384",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      background: "#d63384",
                      color: "white",
                      borderRadius: "12px",
                      padding: "12px",
                      fontWeight: "700",
                    }}
                  >
                    Login
                  </button>
                </form>

                <p className="text-center mt-4 mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#d63384",
                      fontWeight: "600",
                    }}
                  >
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
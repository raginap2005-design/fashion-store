import { useState } from "react";
import axios from "axios";

function Login() {
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
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      if (response.data.token) {
        // Save token
        localStorage.setItem(
          "token",
          response.data.token
        );

        // Get user role
        const role =
          response.data.user?.role ||
          response.data.role;

        console.log("USER ROLE:", role);

        // Save role
        localStorage.setItem("role", role);

        alert("Login successful!");

        // Admin → Admin Dashboard
        if (role === "admin") {
          window.location.href = "/admin";
        }

        // User → User Dashboard
        else if (role === "user") {
          window.location.href = "/dashboard";
        }

        // Role not received
        else {
          alert(
            "User role not received from server"
          );
        }

      } else {
        alert(
          "Login successful but token not received"
        );
      }

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
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
              style={{
                borderRadius: "20px",
              }}
            >

              <div className="card-body p-5">

                <div className="text-center mb-4">

                  <div
                    style={{
                      fontSize: "55px",
                    }}
                  >
                    👗
                  </div>

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

                  {/* EMAIL */}

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

                  {/* PASSWORD */}

                  <div className="mb-4">

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

                  {/* LOGIN BUTTON */}

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

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
        "https://fashion-store-u2cg.onrender.com/api/auth/register",
        formData
      );

      alert(response.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f6, #ffffff)",
        display: "flex",
        alignItems: "center",
        padding: "50px 15px",
      }}
    >

      <div className="container">

        <div className="row justify-content-center align-items-center">

          {/* LEFT SIDE */}

          <div className="col-lg-5 text-center mb-5 mb-lg-0">

            <div style={{ fontSize: "85px" }}>
              👗
            </div>

            <h1
              className="fw-bold"
              style={{
                color: "#212529",
                fontSize: "45px",
              }}
            >
              Welcome to{" "}
              <span style={{ color: "#d63384" }}>
                StyleHub
              </span>
            </h1>

            <p
              className="text-muted mt-3"
              style={{
                fontSize: "18px",
                maxWidth: "450px",
                margin: "auto",
              }}
            >
              Create your account and discover
              beautiful fashion made just for you. 💕
            </p>

            <div className="mt-4">

              <span className="badge bg-dark me-2 p-2">
                ✨ Trendy
              </span>

              <span className="badge bg-danger me-2 p-2">
                ❤️ Stylish
              </span>

              <span className="badge bg-warning text-dark p-2">
                🛍️ Easy Shopping
              </span>

            </div>

          </div>


          {/* REGISTER CARD */}

          <div className="col-md-8 col-lg-5">

            <div
              className="card border-0"
              style={{
                borderRadius: "25px",
                boxShadow:
                  "0 15px 40px rgba(214,51,132,0.15)",
                background: "#ffffff",
              }}
            >

              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">

                  <div
                    style={{
                      fontSize: "45px",
                    }}
                  >
                    💗
                  </div>

                  <h2 className="fw-bold">
                    Create Account
                  </h2>

                  <p className="text-muted">
                    Join StyleHub today
                  </p>

                </div>


                <form onSubmit={handleSubmit}>

                  {/* NAME */}

                  <label className="fw-semibold mb-2">
                    Full Name
                  </label>

                  <div className="input-group mb-3">

                    <span className="input-group-text bg-white">
                      👤
                    </span>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* EMAIL */}

                  <label className="fw-semibold mb-2">
                    Email Address
                  </label>

                  <div className="input-group mb-3">

                    <span className="input-group-text bg-white">
                      📧
                    </span>

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

                  <label className="fw-semibold mb-2">
                    Password
                  </label>

                  <div className="input-group mb-4">

                    <span className="input-group-text bg-white">
                      🔒
                    </span>

                    <input
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* REGISTER */}

                  <button
                    type="submit"
                    className="btn w-100 py-2 fw-bold"
                    style={{
                      backgroundColor: "#d63384",
                      color: "#ffffff",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "17px",
                    }}
                  >
                    Create Account ✨
                  </button>

                </form>


                <div className="text-center mt-4">

                  <p className="text-muted mb-0">
                    Already have an account?
                  </p>

                  <a
                    href="/login"
                    className="fw-bold text-decoration-none"
                    style={{
                      color: "#d63384",
                    }}
                  >
                    Login here →
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/auth/forgot-password",
        { email }
      );

      toast.success(
        response.data.message || "OTP sent successfully!"
      );

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ maxWidth: "500px", minHeight: "80vh" }}
    >
      <div className="card border-0 shadow p-4">
        <div className="text-center mb-4">
          <div style={{ fontSize: "45px" }}>🔐</div>

          <h2 style={{ color: "#d63384", fontWeight: "800" }}>
            Forgot Password?
          </h2>

          <p className="text-muted">
            Enter your registered email to receive an OTP.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-bold">
            Email Address
          </label>

          <input
            type="email"
            className="form-control mb-4"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn w-100"
            disabled={loading}
            style={{
              background: "#d63384",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "700",
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link
            to="/login"
            style={{ color: "#d63384", textDecoration: "none" }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

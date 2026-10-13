import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(location.state?.otp || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Verify OTP again before resetting password
      await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/auth/verify-otp",
        { email, otp }
      );

      const response = await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/auth/reset-password",
        { email, newPassword }
      );

      toast.success(
        response.data.message || "Password reset successful!"
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card border-0 shadow p-4">
        <div className="text-center mb-4">
          <div style={{ fontSize: "45px" }}>🔐</div>

          <h2 style={{ color: "#d63384", fontWeight: "800" }}>
            Reset Password
          </h2>

          <p className="text-muted">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-bold">Email</label>
          <input
            type="email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="form-label fw-bold">OTP</label>
          <input
            type="text"
            className="form-control mb-3"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            inputMode="numeric"
            required
          />

          <label className="form-label fw-bold">New Password</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            required
          />

          <label className="form-label fw-bold">Confirm Password</label>
          <input
            type="password"
            className="form-control mb-4"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />

          <button
            type="submit"
            className="btn w-100"
            disabled={loading || otp.length !== 6}
            style={{
              background: "#d63384",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "700",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" style={{ color: "#d63384" }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

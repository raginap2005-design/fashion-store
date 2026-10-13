import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/auth/verify-otp",
        { email, otp }
      );

      toast.success(
        response.data.message || "OTP verified successfully!"
      );

      navigate("/reset-password", {
        state: { email, otp },
      });
    } catch (error) {
      console.error(
        "OTP VERIFICATION ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card border-0 shadow p-4">
        <div className="text-center mb-4">
          <div style={{ fontSize: "45px" }}>📩</div>

          <h2 style={{ color: "#d63384", fontWeight: "800" }}>
            Verify OTP
          </h2>

          <p className="text-muted">
            Enter the 6-digit OTP sent to your email.
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

          <label className="form-label fw-bold">6-digit OTP</label>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            inputMode="numeric"
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/forgot-password" style={{ color: "#d63384" }}>
            Request a new OTP
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;

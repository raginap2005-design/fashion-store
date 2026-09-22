import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    alert("Logged out successfully");

    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background:
          "linear-gradient(90deg, #f6339a, #9b5de5)",
        padding: "12px 0",
      }}
    >
      <div className="container">

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-brand fw-bold"
          style={{
            color: "white",
            fontSize: "28px",
          }}
        >
          ✨ StyleHub
        </Link>

        {/* MENU */}

        <div className="d-flex align-items-center gap-2">

          <Link
            to="/"
            className="btn btn-sm"
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            🏠 Home
          </Link>

          <Link
            to="/products"
            className="btn btn-sm"
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            👗 Products
          </Link>

          <Link
            to="/wishlist"
            className="btn btn-sm"
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            ❤️ Wishlist
          </Link>

          <Link
            to="/cart"
            className="btn btn-sm"
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            🛒 Cart
          </Link>

          {/* USER DASHBOARD */}

          {token && role === "user" && (
            <Link
              to="/dashboard"
              className="btn btn-sm"
              style={{
                color: "white",
                fontWeight: "600",
              }}
            >
              👤 Dashboard
            </Link>
          )}

          {/* ADMIN DASHBOARD */}

          {token && role === "admin" && (
            <Link
              to="/admin"
              className="btn btn-sm"
              style={{
                color: "white",
                fontWeight: "600",
              }}
            >
              👑 Admin
            </Link>
          )}

          {/* LOGIN */}

          {!token && (
            <Link
              to="/login"
              className="btn btn-light btn-sm"
              style={{
                fontWeight: "600",
                borderRadius: "20px",
              }}
            >
              Login
            </Link>
          )}

          {/* LOGOUT */}

          {token && (
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
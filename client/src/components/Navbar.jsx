import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully! 💗");

    navigate("/login");
  };

  const linkStyle = {
    color: "white",
    fontWeight: "600",
    textDecoration: "none",
    whiteSpace: "nowrap",
    padding: "5px 6px",
    fontSize: "14px",
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          background:
            "linear-gradient(90deg, #ff8dca 0%, #f876b9 45%, #f6339a 100%)",
          padding: "12px 0",
          boxShadow: "0 2px 10px rgba(214, 51, 132, 0.12)",
        }}
      >
        <div className="container-fluid px-1 px-md-5 d-flex align-items-center flex-nowrap">
          {/* LOGO */}
          <Link
            to="/"
            className="navbar-brand m-0 p-0"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/images/stylehub-white-logo.png"
              alt="StyleHub"
              className="stylehub-navbar-logo"
              style={{
                width: "130px",
                height: "55px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          {/* MENU */}
          <div className="stylehub-navbar-menu d-flex align-items-center gap-1 ms-auto flex-nowrap justify-content-end">
            <Link to="/" style={linkStyle}>
              🏠 Home
            </Link>

            {role !== "admin" && (
              <Link to="/products" style={linkStyle}>
                👗 Products
              </Link>
            )}

            {role !== "admin" && (
              <Link to="/wishlist" style={linkStyle}>
                ❤️ Wishlist
              </Link>
            )}

            {role !== "admin" && (
              <Link to="/cart" style={linkStyle}>
                🛒 Cart
              </Link>
            )}

            {token && role === "user" && (
              <Link to="/dashboard" style={linkStyle}>
                👤 Dashboard
              </Link>
            )}

            {token && role === "user" && (
              <Link to="/my-orders" style={linkStyle}>
                📦 My Orders
              </Link>
            )}

            {token && role === "admin" && (
              <Link to="/admin" style={linkStyle}>
                👑 Admin
              </Link>
            )}

            {!token && (
              <Link
                to="/login"
                className="btn btn-light btn-sm"
                style={{
                  fontWeight: "600",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                  padding: "4px 9px",
                }}
              >
                Login
              </Link>
            )}

            {token && (
              <button
                onClick={logout}
                className="btn btn-danger btn-sm"
                style={{
                  borderRadius: "20px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  padding: "4px 9px",
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .stylehub-navbar-logo {
            width: 65px !important;
            height: 38px !important;
          }

          .stylehub-navbar-menu {
            gap: 0 !important;
          }

          .stylehub-navbar-menu a {
            font-size: 10px !important;
            padding: 4px 2px !important;
          }

          .stylehub-navbar-menu .btn {
            font-size: 10px !important;
          }
        }

        @media (max-width: 380px) {
          .stylehub-navbar-logo {
            width: 52px !important;
          }

          .stylehub-navbar-menu a {
            font-size: 9px !important;
            padding: 4px 1px !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
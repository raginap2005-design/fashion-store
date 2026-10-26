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

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
  background: "linear-gradient(90deg, #ff8dca 0%, #f876b9 45%, #f6339a 100%)" ,
  padding: "12px 0",
    boxShadow: "0 2px 10px rgba(214, 51, 132, 0.12)" ,
}}
    >
      <div className="container-fluid px-4 px-md-5 d-flex align-items-center">

        {/* WHITE LOGO FOR PINK-PURPLE NAVBAR */}
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
            style={{
              width: "130px",
              height: "55px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>

        {/* MENU */}
        <div className="d-flex align-items-center gap-2 ms-auto flex-wrap justify-content-end">

          {/* HOME */}
          <Link
            to="/"
            className="btn btn-sm"
            style={{ color: "white", fontWeight: "600" }}
          >
            🏠 Home
          </Link>

          {/* PRODUCTS */}
          {role !== "admin" && (
            <Link
              to="/products"
              className="btn btn-sm"
              style={{ color: "white", fontWeight: "600" }}
            >
              👗 Products
            </Link>
          )}

          {/* WISHLIST */}
          {role !== "admin" && (
            <Link
              to="/wishlist"
              className="btn btn-sm"
              style={{ color: "white", fontWeight: "600" }}
            >
              ❤️ Wishlist
            </Link>
          )}

          {/* CART */}
          {role !== "admin" && (
            <Link
              to="/cart"
              className="btn btn-sm"
              style={{ color: "white", fontWeight: "600" }}
            >
              🛒 Cart
            </Link>
          )}

          {/* USER DASHBOARD */}
          {token && role === "user" && (
            <Link
              to="/dashboard"
              className="btn btn-sm"
              style={{ color: "white", fontWeight: "600" }}
            >
              👤 Dashboard
            </Link>
          )}

          {/* MY ORDERS */}
          {token && role === "user" && (
            <Link
              to="/my-orders"
              className="btn btn-sm"
              style={{ color: "white", fontWeight: "600" }}
            >
              📦 My Orders
            </Link>
          )}

          {/* ADMIN DASHBOARD */}
          {token && role === "admin" && (
            <Link
              to="/admin"
              className="btn btn-sm"
              style={{ color: "white", fontWeight: "600" }}
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
import { Link, useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    alert("Logged out successfully");

    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f7, #f3e8ff, #e8f7ff)",
        padding: "50px 20px",
      }}
    >
      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-5">

          <div
            style={{
              fontSize: "60px",
              marginBottom: "10px",
            }}
          >
            👗
          </div>

          <h1
            style={{
              fontWeight: "800",
              color: "#d63384",
            }}
          >
            Welcome to StyleHub
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#6f42c1",
            }}
          >
            Your style. Your story. ✨
          </p>

        </div>

        {/* ================= DASHBOARD ================= */}

        <div className="row g-4">

          {/* SHOP PRODUCTS */}

          <div className="col-md-4">
            <div
              className="card border-0 h-100 text-center shadow"
              style={{
                borderRadius: "22px",
              }}
            >
              <div className="card-body p-4">

                <div
                  style={{
                    fontSize: "50px",
                    marginBottom: "10px",
                  }}
                >
                  🛍️
                </div>

                <h4
                  style={{
                    color: "#d63384",
                    fontWeight: "700",
                  }}
                >
                  Shop Products
                </h4>

                <p>
                  Explore our latest fashion collection.
                </p>

                <Link
                  to="/products"
                  className="btn w-100"
                  style={{
                    background: "#d63384",
                    color: "white",
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "11px",
                  }}
                >
                  Start Shopping
                </Link>

              </div>
            </div>
          </div>

          {/* WISHLIST */}

          <div className="col-md-4">
            <div
              className="card border-0 h-100 text-center shadow"
              style={{
                borderRadius: "22px",
              }}
            >
              <div className="card-body p-4">

                <div
                  style={{
                    fontSize: "50px",
                    marginBottom: "10px",
                  }}
                >
                  ❤️
                </div>

                <h4
                  style={{
                    color: "#dc3545",
                    fontWeight: "700",
                  }}
                >
                  My Wishlist
                </h4>

                <p>
                  View the products you love.
                </p>

                <Link
                  to="/wishlist"
                  className="btn btn-danger w-100"
                  style={{
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "11px",
                  }}
                >
                  View Wishlist
                </Link>

              </div>
            </div>
          </div>

          {/* CART */}

          <div className="col-md-4">
            <div
              className="card border-0 h-100 text-center shadow"
              style={{
                borderRadius: "22px",
              }}
            >
              <div className="card-body p-4">

                <div
                  style={{
                    fontSize: "50px",
                    marginBottom: "10px",
                  }}
                >
                  🛒
                </div>

                <h4
                  style={{
                    color: "#fd7e14",
                    fontWeight: "700",
                  }}
                >
                  My Cart
                </h4>

                <p>
                  Check your selected products.
                </p>

                <Link
                  to="/cart"
                  className="btn btn-warning w-100"
                  style={{
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "11px",
                  }}
                >
                  View Cart
                </Link>

              </div>
            </div>
          </div>

          {/* MY ORDERS */}

          <div className="col-md-6">
            <div
              className="card border-0 h-100 text-center shadow"
              style={{
                borderRadius: "22px",
              }}
            >
              <div className="card-body p-4">

                <div
                  style={{
                    fontSize: "50px",
                    marginBottom: "10px",
                  }}
                >
                  📦
                </div>

                <h4
                  style={{
                    color: "#198754",
                    fontWeight: "700",
                  }}
                >
                  My Orders
                </h4>

                <p>
                  Track your orders and their status.
                </p>

                <Link
                  to="/my-orders"
                  className="btn btn-success w-100"
                  style={{
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "11px",
                  }}
                >
                  View My Orders
                </Link>

              </div>
            </div>
          </div>

          {/* ACCOUNT / LOGOUT */}

          <div className="col-md-6">
            <div
              className="card border-0 h-100 text-center shadow"
              style={{
                borderRadius: "22px",
              }}
            >
              <div className="card-body p-4">

                <div
                  style={{
                    fontSize: "50px",
                    marginBottom: "10px",
                  }}
                >
                  👤
                </div>

                <h4
                  style={{
                    color: "#6f42c1",
                    fontWeight: "700",
                  }}
                >
                  Account
                </h4>

                <p>
                  Manage your StyleHub account.
                </p>

                <button
                  className="btn btn-danger w-100"
                  style={{
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "11px",
                  }}
                  onClick={logout}
                >
                  🚪 Logout
                </button>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default UserDashboard;
import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import UserDashboard from "./pages/UserDashboard";


import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import socket from "./socket";

// =========================================
// HOME PAGE
// =========================================

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f7 0%, #ffffff 50%, #fceef3 100%)",
      }}
    >
      {/* NAVBAR */}

      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
        }}
      >
        <div className="container">
          <Link
            to="/"
            className="navbar-brand fw-bold"
            style={{
              color: "#d63384",
              fontSize: "28px",
            }}
          >
            ✨ StyleHub
          </Link>

          <div className="d-flex gap-2">
            <Link
              to="/products"
              className="btn btn-outline-dark"
            >
              Shop
            </Link>

            <Link
              to="/wishlist"
              className="btn btn-outline-danger"
            >
              ❤️
            </Link>

            <Link
              to="/cart"
              className="btn btn-warning"
            >
              🛒
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}

      <div className="container">
        <div
          className="row align-items-center"
          style={{
            minHeight: "500px",
          }}
        >
          {/* LEFT */}

          <div className="col-md-6">
            <p
              className="fw-bold"
              style={{
                color: "#d63384",
                letterSpacing: "2px",
              }}
            >
              WELCOME TO STYLEHUB
            </p>

            <h1
              className="fw-bold"
              style={{
                fontSize: "55px",
                lineHeight: "1.1",
                color: "#212529",
                textShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              Your Style.
              <br />

              <span style={{ color: "#d63384" }}>
                Your Story. 💕
              </span>
            </h1>

            <p
              className="text-muted mt-3"
              style={{
                fontSize: "18px",
                maxWidth: "500px",
              }}
            >
              Discover beautiful fashion collections
              for Women, Men and Kids. Find your perfect
              style and shop your favourites.
            </p>

            <div className="mt-4">
              <Link
                to="/products"
                className="btn btn-dark btn-lg me-2 px-4"
              >
                Shop Now 🛍️
              </Link>

              <Link
                to="/register"
                className="btn btn-outline-danger btn-lg px-4"
              >
                Join Us
              </Link>
            </div>
          </div>

          {/* RIGHT */}

          <div className="col-md-6 text-center mt-4 mt-md-0">
            <div
              className="p-5"
              style={{
                background:
                  "linear-gradient(135deg, #f8d7e3, #ffffff)",
                borderRadius: "50%",
                width: "400px",
                height: "400px",
                maxWidth: "100%",
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 20px 50px rgba(214,51,132,0.15)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "100px",
                  }}
                >
                  👗
                </div>

                <h3
                  className="fw-bold"
                  style={{
                    color: "#d63384",
                  }}
                >
                  Fashion
                </h3>

                <p className="text-muted">
                  Made for You
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY SECTION */}

        <div className="text-center py-5">
          <p
            className="fw-bold"
            style={{
              color: "#d63384",
              letterSpacing: "2px",
            }}
          >
            EXPLORE
          </p>

          <h2 className="fw-bold">
            Shop By Category
          </h2>

          <p className="text-muted">
            Find something you love 💕
          </p>

          <div className="row mt-4">
            {/* WOMEN */}

            <div className="col-md-4 mb-4">
              <Link
                to="/products/women"
                className="text-decoration-none"
              >
                <div
                  className="card border-0 shadow-sm h-100 p-4"
                  style={{
                    borderRadius: "20px",
                    transition: "0.3s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "65px",
                    }}
                  >
                    👗
                  </div>

                  <h4 className="fw-bold mt-3">
                    Women
                  </h4>

                  <p className="text-muted">
                    Elegant & trendy fashion
                  </p>

                  <span className="btn btn-outline-danger">
                    Explore Collection
                  </span>
                </div>
              </Link>
            </div>

            {/* MEN */}

            <div className="col-md-4 mb-4">
              <Link
                to="/products/men"
                className="text-decoration-none"
              >
                <div
                  className="card border-0 shadow-sm h-100 p-4"
                  style={{
                    borderRadius: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "65px",
                    }}
                  >
                    👔
                  </div>

                  <h4 className="fw-bold mt-3">
                    Men
                  </h4>

                  <p className="text-muted">
                    Smart & stylish looks
                  </p>

                  <span className="btn btn-outline-dark">
                    Explore Collection
                  </span>
                </div>
              </Link>
            </div>

            {/* KIDS */}

            <div className="col-md-4 mb-4">
              <Link
                to="/products/kids"
                className="text-decoration-none"
              >
                <div
                  className="card border-0 shadow-sm h-100 p-4"
                  style={{
                    borderRadius: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "65px",
                    }}
                  >
                    🧒
                  </div>

                  <h4 className="fw-bold mt-3">
                    Kids
                  </h4>

                  <p className="text-muted">
                    Cute & colourful styles
                  </p>

                  <span className="btn btn-outline-primary">
                    Explore Collection
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}

        <div
          className="text-center py-5 mb-4"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "25px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 className="fw-bold">
            Ready to find your style? 💗
          </h3>

          <p className="text-muted">
            Everything you love, all in one place.
          </p>

          <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">
            <Link
              to="/login"
              className="btn btn-dark px-4"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary px-4"
            >
              Register
            </Link>

            <Link
              to="/my-orders"
              className="btn btn-outline-dark px-4"
            >
              📦 My Orders
            </Link>

            <Link
              to="/wishlist"
              className="btn btn-outline-danger px-4"
            >
              ❤️ Wishlist
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <footer
        className="text-center py-4"
        style={{
          backgroundColor: "#212529",
          color: "white",
        }}
      >
        <h5 className="fw-bold">
          ✨ StyleHub
        </h5>

        <p className="mb-0 text-secondary">
          Fashion that tells your story 💕
        </p>

        <small className="text-secondary">
          © 2026 StyleHub. All rights reserved.
        </small>
      </footer>
    </div>
  );
}

// =========================================
// APP
// =========================================

function App() {
  // =========================================
  // SOCKET.IO CONNECTION
  // =========================================

  useEffect(() => {
    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PRODUCTS */}

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/women"
          element={<Products category="Women" />}
        />

        <Route
          path="/products/men"
          element={<Products category="Men" />}
        />

        <Route
          path="/products/kids"
          element={<Products category="Kids" />}
        />

        {/* USER */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminUsers />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}

export default App;
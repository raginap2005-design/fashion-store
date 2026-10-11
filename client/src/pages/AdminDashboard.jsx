
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "https://fashion-store-u2cg.onrender.com/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: null,
    orders: null,
    users: null,
    sales: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [productsRes, ordersRes, usersRes] =
          await Promise.all([
            axios.get(`${API}/products`, { headers }),
            axios.get(`${API}/orders/all`, { headers }),
            axios.get(`${API}/users`, { headers }),
          ]);

        const products =
          productsRes.data.products || [];

        const orders =
          ordersRes.data.orders || [];

        const users =
          usersRes.data.users || [];

        const sales = orders
          .filter(
            (order) => order.paymentStatus === "Paid"
          )
          .reduce(
            (total, order) =>
              total + Number(order.totalPrice || 0),
            0
          );

        setStats({
          products: products.length,
          orders: orders.length,
          users: users.length,
          sales,
        });

        setError("");
      } catch (err) {
        console.error(
          "Dashboard statistics error:",
          err.response?.data || err.message
        );

        setError(
          "Statistics load aayilla. API routes check cheyyanam."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: "📦",
      color: "#d63384",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: "🛍️",
      color: "#6f42c1",
    },
    {
      title: "Total Users",
      value: stats.users,
      icon: "👥",
      color: "#198754",
    },
    {
      title: "Paid Sales",
      value:
        stats.sales === null
          ? null
          : `₹${stats.sales.toLocaleString("en-IN")}`,
      icon: "💰",
      color: "#fd7e14",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f6, #f8f0ff, #eef7ff)",
        padding: "40px 20px",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <div style={{ fontSize: 55 }}>👑</div>

          <h1
            className="fw-bold"
            style={{ color: "#d63384" }}
          >
            StyleHub Admin
          </h1>

          <p style={{ color: "#6f42c1", fontSize: 18 }}>
            Manage your fashion store easily ✨
          </p>
        </div>

        <h4 className="fw-bold mb-4">
          Dashboard Statistics
        </h4>

        {loading && (
          <p className="text-center">
            Loading statistics...
          </p>
        )}

        {error && (
          <div className="alert alert-warning">
            {error}
          </div>
        )}

        <div className="row g-4 mb-5">
          {cards.map((card) => (
            <div className="col-12 col-sm-6 col-xl-3" key={card.title}>
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
                }}
              >
                <div className="card-body p-4">
                  <div style={{ fontSize: 35 }}>
                    {card.icon}
                  </div>

                  <p className="text-muted mt-3 mb-2">
                    {card.title}
                  </p>

                  <h2
                    className="fw-bold"
                    style={{ color: card.color }}
                  >
                    {loading
                      ? "..."
                      : card.value === null
                      ? "—"
                      : card.value}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="fw-bold mb-4">
          Manage Store
        </h4>

        <div className="row g-4">
          {[
            {
              title: "Products",
              icon: "📦",
              description:
                "Add, edit and manage fashion products.",
              path: "/admin/products",
              color: "#d63384",
            },
            {
              title: "Orders",
              icon: "🛍️",
              description:
                "View and manage customer orders.",
              path: "/admin/orders",
              color: "#6f42c1",
            },
            {
              title: "Users",
              icon: "👥",
              description:
                "View registered StyleHub customers.",
              path: "/admin/users",
              color: "#198754",
            },
          ].map((item) => (
            <div
              className="col-12 col-md-4"
              key={item.title}
            >
              <div
                className="card border-0 h-100 text-center"
                style={{
                  borderRadius: 22,
                  boxShadow:
                    "0 10px 30px rgba(214,51,132,0.12)",
                }}
              >
                <div className="card-body p-4">
                  <div style={{ fontSize: 48 }}>
                    {item.icon}
                  </div>

                  <h4
                    className="fw-bold mt-3"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h4>

                  <p className="text-muted">
                    {item.description}
                  </p>

                  <Link
                    to={item.path}
                    className="btn w-100 text-white"
                    style={{
                      background: item.color,
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    Manage {item.title}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

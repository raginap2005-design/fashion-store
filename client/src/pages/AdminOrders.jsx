import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH ALL ORDERS
  // =========================================

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADMIN ORDERS:", response.data);

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("ADMIN ORDERS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Order status changed to ${status}`);

      fetchOrders();
    } catch (error) {
      console.log("STATUS UPDATE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order"
      );
    }
  };

  // =========================================
  // LOAD ORDERS
  // =========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading orders...</h3>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f9, #f5f0ff, #eef8ff)",
        padding: "40px 20px",
      }}
    >
      <div className="container">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h1
              style={{
                fontWeight: "800",
                color: "#d63384",
              }}
            >
              🛍️ Manage Orders
            </h1>

            <p className="mb-0">
              View and manage all customer orders
            </p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() =>
              (window.location.href = "/admin")
            }
          >
            ← Dashboard
          </button>

        </div>

        {/* NO ORDERS */}

        {orders.length === 0 ? (

          <div className="alert alert-info text-center">
            No orders found.
          </div>

        ) : (

          orders.map((order) => (

            <div
              key={order._id}
              className="card border-0 shadow mb-4"
              style={{
                borderRadius: "18px",
              }}
            >

              <div className="card-body p-4">

                {/* ORDER HEADER */}

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <div>
                    <h5
                      style={{
                        fontWeight: "700",
                      }}
                    >
                      Order #{order._id.slice(-8)}
                    </h5>

                    <p className="mb-0">
                      👤{" "}
                      <strong>
                        {order.user?.name || "Unknown User"}
                      </strong>
                    </p>

                    <small>
                      📧 {order.user?.email || "No email"}
                    </small>
                  </div>

                  {/* STATUS */}

                  <div>

                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      style={{
                        fontWeight: "600",
                        minWidth: "160px",
                      }}
                    >
                      <option value="Pending">
                        🟡 Pending
                      </option>

                      <option value="Completed">
                        🟢 Completed
                      </option>

                      <option value="Cancelled">
                        🔴 Cancelled
                      </option>
                    </select>

                  </div>

                </div>

                <hr />

                {/* PRODUCTS */}

                <h6
                  style={{
                    fontWeight: "700",
                  }}
                >
                  📦 Products
                </h6>

                {order.items?.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <br />

                        <small>
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </small>
                      </div>

                      <strong>
                        ₹
                        {item.price *
                          item.quantity}
                      </strong>

                    </div>

                  )
                )}

                {/* TOTAL */}

                <div className="text-end mt-3">

                  <span
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    Total:{" "}
                  </span>

                  <strong
                    style={{
                      fontSize: "24px",
                      color: "#d63384",
                    }}
                  >
                    ₹{order.totalPrice}
                  </strong>

                </div>

              </div>

            </div>

          ))

        )}

      </div>
    </div>
  );
}

export default AdminOrders;
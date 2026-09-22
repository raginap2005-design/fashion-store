import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH MY ORDERS
  // =========================================

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://fashion-store-u2cg.onrender.com/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY ORDERS:", response.data);

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("ORDERS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // CANCEL ORDER
  // =========================================

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?"
      );

      if (!confirmCancel) {
        return;
      }

      const response = await axios.put(
        `https://fashion-store-u2cg.onrender.com/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "CANCEL ORDER RESPONSE:",
        response.data
      );

      alert("Order cancelled successfully");

      fetchOrders();
    } catch (error) {
      console.log(
        "CANCEL ORDER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  };

  // =========================================
  // LOAD ORDERS + SOCKET.IO
  // =========================================

  useEffect(() => {
    fetchOrders();

    const socket = io("https://fashion-store-u2cg.onrender.com");

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    });

    socket.on("orderStatusUpdated", (data) => {
      console.log(
        "ORDER STATUS UPDATED:",
        data
      );

      alert(
        `Order #${data.orderId.slice(-6)} status changed to ${data.status}`
      );

      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-danger" />

        <h5 className="mt-3">
          Loading your orders...
        </h5>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div
      className="container"
      style={{
        marginTop: "40px",
        marginBottom: "50px",
      }}
    >

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2
            className="fw-bold mb-1"
            style={{
              color: "#222",
            }}
          >
            📦 My Orders
          </h2>

          <p className="text-muted mb-0">
            Track your StyleHub orders
          </p>
        </div>

        <button
          className="btn btn-outline-dark"
          onClick={() => {
            window.location.href = "/products";
          }}
        >
          Continue Shopping
        </button>

      </div>

      {/* NO ORDERS */}

      {orders.length === 0 ? (

        <div
          className="text-center p-5"
          style={{
            borderRadius: "18px",
            backgroundColor: "#fff5f9",
            border: "1px solid #ffd6e7",
          }}
        >

          <div
            style={{
              fontSize: "55px",
            }}
          >
            🛍️
          </div>

          <h4 className="fw-bold mt-3">
            No orders yet
          </h4>

          <p className="text-muted">
            Start shopping and your orders
            will appear here.
          </p>

          <button
            className="btn btn-dark px-4"
            onClick={() => {
              window.location.href =
                "/products";
            }}
          >
            Start Shopping
          </button>

        </div>

      ) : (

        <div>

          {orders.map((order) => (

            <div
              className="card shadow-sm mb-3"
              key={order._id}
              style={{
                borderRadius: "15px",
                border:
                  "1px solid #f0d9e8",
              }}
            >

              <div className="card-body p-3">

                {/* ORDER HEADER */}

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6 className="fw-bold mb-1">
                      Order #
                      {order._id.slice(-6)}
                    </h6>

                    <small className="text-muted">
                      Total: ₹
                      {order.totalPrice}
                    </small>

                  </div>

                  {/* STATUS */}

                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      order.status ===
                      "Completed"
                        ? "bg-success"
                        : order.status ===
                          "Cancelled"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                <hr className="my-2" />

                {/* PRODUCTS */}

                <div className="row">

                  {order.items?.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="col-md-6 mb-2"
                      >

                        <div
                          className="p-2"
                          style={{
                            backgroundColor:
                              "#fff8fb",
                            borderRadius:
                              "10px",
                            border:
                              "1px solid #f5e1ea",
                          }}
                        >

                          <div className="fw-semibold">
                            {item.name}
                          </div>

                          <div className="small text-muted">
                            ₹{item.price} ×{" "}
                            {item.quantity}
                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* CANCEL BUTTON */}

                {order.status ===
                  "Pending" && (

                  <button
                    className="btn btn-outline-danger btn-sm mt-2"
                    onClick={() =>
                      cancelOrder(
                        order._id
                      )
                    }
                  >
                    Cancel Order
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyOrders;
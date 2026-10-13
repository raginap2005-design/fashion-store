import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const API = "https://fashion-store-u2cg.onrender.com/api";
const SOCKET_URL = "https://fashion-store-u2cg.onrender.com";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // =========================================
  // FETCH ORDERS
  // =========================================

  const fetchOrders = useCallback(async (showLoader = true) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your orders.");
      setOrders([]);
      setLoading(false);
      return;
    }

    if (showLoader) {
      setLoading(true);
    }

    try {
      const response = await axios.get(`${API}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
      setError("");
    } catch (err) {
      console.error(
        "FETCH ORDERS ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // CANCEL ORDER
  // =========================================

  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first.");
      setOrderToCancel(null);
      return;
    }

    setCancellingId(orderId);

    try {
      const response = await axios.put(
        `${API}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderToCancel(null);

      toast.success(
        response.data.message || "Order cancelled successfully."
      );

      await fetchOrders(false);
    } catch (err) {
      console.error(
        "CANCEL ORDER ERROR:",
        err.response?.data || err.message
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to cancel this order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =========================================
  // INITIAL LOAD + SOCKET UPDATES
  // =========================================

  useEffect(() => {
    fetchOrders();

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("MyOrders socket connected");
    });

    socket.on("orderStatusUpdated", () => {
      fetchOrders(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchOrders]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" />
        <h5 className="mt-3">Loading your orders...</h5>
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
        minHeight: "70vh",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">📦 My Orders</h2>

          <p className="text-muted mb-0">
            Track your StyleHub purchases.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-secondary"
            onClick={() => fetchOrders()}
            disabled={loading}
          >
            ↻ Refresh
          </button>

          <button
            className="btn btn-dark"
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-warning">
          {error}

          <button
            className="btn btn-sm btn-outline-dark ms-3"
            onClick={() => fetchOrders()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* CANCEL CONFIRMATION */}

      {orderToCancel && (
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "16px",
            borderLeft: "4px solid #dc3545",
          }}
        >
          <div className="card-body p-4">
            <h5 className="fw-bold text-danger">
              Cancel this order?
            </h5>

            <p className="text-muted mb-3">
              Are you sure you want to cancel order #
              {orderToCancel.slice(-6).toUpperCase()}?
            </p>

            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-danger"
                disabled={cancellingId === orderToCancel}
                onClick={() => cancelOrder(orderToCancel)}
              >
                {cancellingId === orderToCancel
                  ? "Cancelling..."
                  : "Yes, Cancel Order"}
              </button>

              <button
                className="btn btn-light border"
                disabled={cancellingId === orderToCancel}
                onClick={() => setOrderToCancel(null)}
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}

      {!error && orders.length === 0 && (
        <div
          className="text-center p-5"
          style={{
            borderRadius: "18px",
            backgroundColor: "#fff5f9",
            border: "1px solid #ffd6e7",
          }}
        >
          <div style={{ fontSize: "55px" }}>🛍️</div>

          <h4 className="fw-bold mt-3">No orders yet</h4>

          <p className="text-muted">
            Your orders will appear here after you place them.
          </p>

          <button
            className="btn btn-dark px-4"
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* ORDER LIST */}

      {orders.map((order) => {
        const isCancelled = order.status === "Cancelled";
        const isCompleted = order.status === "Completed";
        const isPaid = order.paymentStatus === "Paid";

        const statusClass = isCancelled
          ? "bg-danger"
          : isCompleted
          ? "bg-success"
          : "bg-warning text-dark";

        return (
          <div
            key={order._id}
            className="card shadow-sm mb-4 border-0"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div className="card-body p-3 p-md-4">
              {/* ORDER HEADER */}

              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h5>

                  <small className="text-muted">
                    Placed on:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Date unavailable"}
                  </small>
                </div>

                <span
                  className={`badge rounded-pill px-3 py-2 ${statusClass}`}
                >
                  {order.status}
                </span>
              </div>

              <hr />

              {/* PAYMENT DETAILS */}

              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <small className="text-muted d-block">
                    Total Amount
                  </small>

                  <strong className="fs-5">
                    ₹
                    {Number(order.totalPrice || 0).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="col-sm-4">
                  <small className="text-muted d-block">
                    Payment Method
                  </small>

                  <strong>
                    {order.paymentMethod === "COD"
                      ? "💵 Cash on Delivery"
                      : "💳 Razorpay"}
                  </strong>
                </div>

                <div className="col-sm-4">
                  <small className="text-muted d-block">
                    Payment Status
                  </small>

                  <strong
                    className={
                      isPaid ? "text-success" : "text-secondary"
                    }
                  >
                    {isPaid
                      ? "Paid"
                      : order.paymentMethod === "COD"
                      ? "Pay on delivery"
                      : "Pending"}
                  </strong>
                </div>
              </div>

              {/* PRODUCTS */}

              <h6 className="fw-bold mb-3">Products</h6>

              <div className="row g-3">
                {order.items?.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="col-md-6"
                  >
                    <div
                      className="p-3 h-100"
                      style={{
                        backgroundColor: "#fff8fb",
                        borderRadius: "12px",
                        border: "1px solid #f5e1ea",
                      }}
                    >
                      <div className="fw-semibold">
                        {item.name || item.product?.name || "Product"}
                      </div>

                      <div className="small text-muted mt-1">
                        ₹
                        {Number(item.price || 0).toLocaleString(
                          "en-IN"
                        )}
                        {" × "}
                        {item.quantity}
                      </div>

                      <div className="fw-semibold mt-1">
                        Subtotal: ₹
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 0)
                        ).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CANCEL ORDER */}

              {order.status === "Pending" && (
                <div className="mt-3">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => setOrderToCancel(order._id)}
                    disabled={
                      cancellingId === order._id ||
                      orderToCancel === order._id
                    }
                  >
                    {cancellingId === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                </div>
              )}

              {isCancelled && (
                <div className="alert alert-danger mt-3 mb-0 py-2">
                  This order has been cancelled.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyOrders;

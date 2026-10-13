
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "https://fashion-store-u2cg.onrender.com/api";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [razorpayLoaded, setRazorpayLoaded] = useState(
    Boolean(window.Razorpay)
  );

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setRazorpayLoaded(true);

    script.onerror = () => {
      setRazorpayLoaded(false);
      toast.error("Unable to load Razorpay. Please refresh and try again.");
    };

    document.body.appendChild(script);
  }, []);

  // Clear the frontend cart after a confirmed successful order/payment.
  const clearLocalCart = () => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const placeOrder = async () => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first.");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (paymentMethod === "Razorpay") {
      if (!razorpayLoaded || !window.Razorpay) {
        toast.error("Razorpay is loading. Please try again.");
        return;
      }

      if (!razorpayKey) {
        toast.error("Razorpay Key ID is missing. Check your environment settings.");
        return;
      }
    }

    setLoading(true);

    try {
      // STEP 1: Create the order
      const orderResponse = await axios.post(
        `${API}/orders`,
        { paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdOrder = orderResponse.data.order;

      if (!createdOrder?._id) {
        throw new Error("Order details were not received.");
      }

      // STEP 2: Cash on Delivery
      if (paymentMethod === "COD") {
        // Do not assume the backend cart has been cleared.
        // This clears the frontend cart only after order creation succeeds.
        clearLocalCart();

        toast.success("Order placed successfully! Cash on Delivery selected.");

        setTimeout(() => {
          window.location.href = "/my-orders";
        }, 800);

        return;
      }

      // STEP 3: Create Razorpay payment order
      const paymentResponse = await axios.post(
        `${API}/payments/create`,
        { orderId: createdOrder._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpayOrder = paymentResponse.data.razorpayOrder;

      if (!razorpayOrder?.id) {
        throw new Error("Razorpay order creation failed.");
      }

      // STEP 4: Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "StyleHub",
        description: "StyleHub Fashion Store Payment",
        order_id: razorpayOrder.id,

        handler: async (response) => {
          try {
            // STEP 5: Verify payment on the backend
            const verifyResponse = await axios.post(
              `${API}/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const verified =
              verifyResponse.status === 200 &&
              (
                verifyResponse.data.order?.paymentStatus === "Paid" ||
                verifyResponse.data.payment?.status === "Paid"
              );

            if (verified) {
              clearLocalCart();

              toast.success("Payment successful! Your order is confirmed.");

              setTimeout(() => {
                window.location.href = "/my-orders";
              }, 1000);
            } else {
              toast.error(
                "Payment is not confirmed. Please check My Orders."
              );
            }
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error.response?.data || error.message
            );

            toast.error(
              "Payment verification failed. If money was deducted, check My Orders before trying again."
            );
          } finally {
            setLoading(false);
          }
        },

        prefill: {},

        theme: {
          color: "#d63384",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            toast("Payment window closed. Your cart has not been cleared.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("PAYMENT FAILED:", response.error);

        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "CHECKOUT ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to place your order."
      );

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff0f6, #ffffff)",
        paddingTop: "50px",
        paddingBottom: "70px",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <p
            className="fw-bold mb-1"
            style={{ color: "#d63384", letterSpacing: "2px" }}
          >
            STYLEHUB
          </p>

          <h1 className="fw-bold">Secure Checkout 💗</h1>

          <p className="text-muted">
            Choose your preferred payment method.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div
              className="card border-0"
              style={{
                borderRadius: "25px",
                overflow: "hidden",
                boxShadow: "0 15px 45px rgba(214,51,132,0.14)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(90deg, #d63384, #f06595)",
                  color: "white",
                  padding: "30px",
                }}
              >
                <h3 className="fw-bold">
                  Ready to place your order? 🛍️
                </h3>

                <p className="mb-0">
                  Secure checkout with your preferred payment option.
                </p>
              </div>

              <div className="card-body p-4 p-md-5">
                <h5 className="fw-bold mb-3">
                  Select Payment Method
                </h5>

                <label
                  className="d-flex align-items-center p-3 mb-3"
                  style={{
                    border:
                      paymentMethod === "Razorpay"
                        ? "2px solid #d63384"
                        : "1px solid #dee2e6",
                    borderRadius: "12px",
                    cursor: "pointer",
                    background:
                      paymentMethod === "Razorpay" ? "#fff5f8" : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                    className="form-check-input me-3"
                    disabled={loading}
                  />

                  <div>
                    <strong>💳 Online Payment (Razorpay)</strong>
                    <div className="text-muted small">
                      Pay securely online.
                    </div>
                  </div>
                </label>

                <label
                  className="d-flex align-items-center p-3 mb-4"
                  style={{
                    border:
                      paymentMethod === "COD"
                        ? "2px solid #d63384"
                        : "1px solid #dee2e6",
                    borderRadius: "12px",
                    cursor: "pointer",
                    background:
                      paymentMethod === "COD" ? "#fff5f8" : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="form-check-input me-3"
                    disabled={loading}
                  />

                  <div>
                    <strong>💵 Cash on Delivery (COD)</strong>
                    <div className="text-muted small">
                      Pay when your order is delivered.
                    </div>
                  </div>
                </label>

                <div
                  className="p-4"
                  style={{
                    background: "#fff5f8",
                    borderRadius: "15px",
                  }}
                >
                  <h6 className="fw-bold">
                    {paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Secure Online Payment"}
                  </h6>

                  <p className="text-muted mb-0">
                    {paymentMethod === "COD"
                      ? "Place your order now and pay when it arrives."
                      : "Your payment will be confirmed after Razorpay verification."}
                  </p>
                </div>

                <button
                  className="btn w-100 mt-4 py-3 fw-bold"
                  onClick={placeOrder}
                  disabled={loading}
                  style={{
                    backgroundColor: "#d63384",
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "18px",
                  }}
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "COD"
                    ? "🛍️ Place COD Order"
                    : "💳 Place Order & Pay"}
                </button>

                <p
                  className="text-center text-muted mt-3 mb-0"
                  style={{ fontSize: "13px" }}
                >
                  🔒 Your payment details are handled securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

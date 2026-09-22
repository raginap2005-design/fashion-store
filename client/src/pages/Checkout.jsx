import { useEffect, useState } from "react";
import axios from "axios";

function Checkout() {
  const [loading, setLoading] = useState(false);

  // Load Razorpay Checkout
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        console.log("Razorpay already loaded");
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        console.log("Razorpay loaded successfully");
      };

      script.onerror = () => {
        console.log("Razorpay failed to load");
      };

      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const placeOrder = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        alert(
          "Razorpay is not loaded. Please refresh the page."
        );

        setLoading(false);
        return;
      }

      console.log("Starting checkout...");

      // STEP 1: CREATE NORMAL ORDER

      const orderResponse = await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ORDER RESPONSE:",
        orderResponse.data
      );

      const createdOrder =
        orderResponse.data.order;

      if (!createdOrder) {
        alert("Order details not received");
        setLoading(false);
        return;
      }

      console.log(
        "CREATED ORDER:",
        createdOrder
      );

      // STEP 2: CREATE RAZORPAY ORDER

      const paymentResponse = await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/payments/create",
        {
          orderId: createdOrder._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PAYMENT RESPONSE:",
        paymentResponse.data
      );

      const razorpayOrder =
        paymentResponse.data.razorpayOrder;

      if (!razorpayOrder) {
        alert(
          "Razorpay order creation failed"
        );

        setLoading(false);
        return;
      }

      console.log(
        "RAZORPAY ORDER:",
        razorpayOrder
      );

      // STEP 3: RAZORPAY OPTIONS

      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      console.log(
        "RAZORPAY KEY:",
        razorpayKey
      );

      if (!razorpayKey) {
        alert(
          "Razorpay Key ID not found. Check client .env file."
        );

        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "StyleHub",

        description:
          "StyleHub Fashion Store Payment",

        order_id: razorpayOrder.id,

        // PAYMENT SUCCESS

        handler: async function (response) {
          console.log(
            "RAZORPAY PAYMENT SUCCESS:",
            response
          );

          try {
            // STEP 4: VERIFY PAYMENT

            const verifyResponse =
              await axios.post(
                "https://fashion-store-u2cg.onrender.com/api/payments/verify",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

            console.log(
              "VERIFY RESPONSE:",
              verifyResponse.data
            );

            alert(
              "Payment successful! Order completed."
            );

            window.location.href = "/";
          } catch (error) {
            console.log(
              "PAYMENT VERIFY ERROR:",
              error
            );

            console.log(
              "VERIFY STATUS:",
              error.response?.status
            );

            console.log(
              "VERIFY RESPONSE:",
              error.response?.data
            );

            alert(
              error.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        // PINK STYLE FOR RAZORPAY
        theme: {
          color: "#d63384",
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay popup closed"
            );

            setLoading(false);
          },
        },
      };

      console.log(
        "RAZORPAY OPTIONS:",
        options
      );

      // STEP 5: CREATE RAZORPAY INSTANCE

      const razorpay =
        new window.Razorpay(options);

      console.log(
        "RAZORPAY INSTANCE CREATED"
      );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.log(
            "PAYMENT FAILED:",
            response.error
          );

          alert(
            response.error?.description ||
              "Payment failed"
          );

          setLoading(false);
        }
      );

      console.log(
        "ABOUT TO OPEN RAZORPAY"
      );

      razorpay.open();

      console.log(
        "RAZORPAY OPEN CALLED"
      );

      setLoading(false);
    } catch (error) {
      console.log(
        "CHECKOUT ERROR:",
        error
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Order/Payment failed"
      );

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f6, #ffffff)",
        paddingTop: "50px",
        paddingBottom: "70px",
      }}
    >
      <div className="container">

        {/* PAGE TITLE */}

        <div className="text-center mb-5">

          <p
            className="fw-bold mb-1"
            style={{
              color: "#d63384",
              letterSpacing: "2px",
            }}
          >
            STYLEHUB
          </p>

          <h1
            className="fw-bold"
            style={{ color: "#212529" }}
          >
            Secure Checkout 💗
          </h1>

          <p className="text-muted">
            Complete your order and enjoy your
            shopping experience.
          </p>

        </div>


        <div className="row justify-content-center">

          <div className="col-lg-8">

            <div
              className="card border-0"
              style={{
                borderRadius: "25px",
                overflow: "hidden",
                boxShadow:
                  "0 15px 45px rgba(214,51,132,0.14)",
              }}
            >

              {/* TOP BANNER */}

              <div
                style={{
                  background:
                    "linear-gradient(90deg, #d63384, #f06595)",
                  color: "white",
                  padding: "30px",
                }}
              >

                <div className="row align-items-center">

                  <div className="col-md-8">

                    <h3 className="fw-bold">
                      Ready to place your order? 🛍️
                    </h3>

                    <p className="mb-0">
                      Your payment is processed
                      securely through Razorpay.
                    </p>

                  </div>

                  <div className="col-md-4 text-md-end mt-3 mt-md-0">

                    <span
                      style={{
                        fontSize: "55px",
                      }}
                    >
                      💳 ✨
                    </span>

                  </div>

                </div>

              </div>


              {/* BODY */}

              <div className="card-body p-4 p-md-5">

                <div className="row text-center mb-4">

                  <div className="col-md-4 mb-3 mb-md-0">

                    <div
                      style={{
                        fontSize: "32px",
                      }}
                    >
                      🛒
                    </div>

                    <h6 className="fw-bold mt-2">
                      Review Order
                    </h6>

                    <small className="text-muted">
                      Check your products
                    </small>

                  </div>


                  <div className="col-md-4 mb-3 mb-md-0">

                    <div
                      style={{
                        fontSize: "32px",
                      }}
                    >
                      💳
                    </div>

                    <h6 className="fw-bold mt-2">
                      Secure Payment
                    </h6>

                    <small className="text-muted">
                      Powered by Razorpay
                    </small>

                  </div>


                  <div className="col-md-4">

                    <div
                      style={{
                        fontSize: "32px",
                      }}
                    >
                      🎉
                    </div>

                    <h6 className="fw-bold mt-2">
                      Order Complete
                    </h6>

                    <small className="text-muted">
                      Enjoy your purchase
                    </small>

                  </div>

                </div>


                <hr />


                {/* PAYMENT INFO */}

                <div
                  className="p-4 mt-4"
                  style={{
                    background: "#fff5f8",
                    borderRadius: "15px",
                  }}
                >

                  <h5 className="fw-bold">
                    Payment Information
                  </h5>

                  <p className="text-muted mb-2">
                    You will be redirected to
                    Razorpay's secure checkout.
                  </p>

                  <div className="d-flex align-items-center">

                    <span
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      🔒
                    </span>

                    <span className="ms-2">
                      Secure & encrypted payment
                    </span>

                  </div>

                </div>


                {/* BUTTON */}

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
                    ? "Processing Payment..."
                    : "💳 Place Order & Pay"}
                </button>


                <p
                  className="text-center text-muted mt-3 mb-0"
                  style={{ fontSize: "13px" }}
                >
                  🔒 Your payment details are
                  securely handled by Razorpay.
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
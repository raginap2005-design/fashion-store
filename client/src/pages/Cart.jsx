import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  // =========================================
  // LOAD CART
  // =========================================

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  };

  // =========================================
  // UPDATE QUANTITY
  // =========================================

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity,
          }
        : item
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // =========================================
  // REMOVE PRODUCT
  // =========================================

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // =========================================
  // CLEAR CART
  // =========================================

  const clearCart = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) return;

    localStorage.removeItem("cart");
    setCart([]);
  };

  // =========================================
  // TOTAL
  // =========================================

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // =========================================
  // EMPTY CART
  // =========================================

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #fff0f6, #ffffff)",
          paddingTop: "70px",
        }}
      >
        <div className="container text-center">

          <div
            className="mx-auto p-5"
            style={{
              maxWidth: "600px",
              background: "#ffffff",
              borderRadius: "25px",
              boxShadow:
                "0 10px 35px rgba(214, 51, 132, 0.12)",
            }}
          >

            <div style={{ fontSize: "80px" }}>
              🛒
            </div>

            <h2
              className="fw-bold mt-3"
              style={{ color: "#212529" }}
            >
              Your Cart is Empty
            </h2>

            <p
              className="mt-3"
              style={{
                color: "#555",
                fontSize: "17px",
              }}
            >
              Looks like you haven't added
              anything yet. Let's find something
              beautiful for you! 💕
            </p>

            <button
              className="btn btn-dark btn-lg px-5 mt-3"
              onClick={() => {
                window.location.href =
                  "/products";
              }}
            >
              🛍️ Start Shopping
            </button>

          </div>

        </div>
      </div>
    );
  }

  // =========================================
  // CART PAGE
  // =========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f8, #ffffff)",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >

      <div className="container">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <p
              className="mb-1 fw-bold"
              style={{
                color: "#d63384",
                letterSpacing: "1px",
              }}
            >
              STYLEHUB
            </p>

            <h2
              className="fw-bold mb-0"
              style={{ color: "#212529" }}
            >
              🛒 My Shopping Cart
            </h2>

            <small className="text-muted">
              {totalItems} item
              {totalItems !== 1 ? "s" : ""} in your cart
            </small>
          </div>

          <button
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            🗑️ Clear Cart
          </button>

        </div>


        <div className="row g-4">

          {/* CART ITEMS */}

          <div className="col-lg-8">

            {cart.map((item) => {

              const imageUrl = item.image
                ? `http://localhost:5000/${item.image.replaceAll(
                    "\\",
                    "/"
                  )}`
                : null;

              return (

                <div
                  className="card border-0 mb-3"
                  key={item._id}
                  style={{
                    borderRadius: "20px",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08)",
                  }}
                >

                  <div className="card-body p-3">

                    <div className="row align-items-center">

                      {/* IMAGE */}

                      <div className="col-4 col-md-3 text-center">

                        {imageUrl ? (

                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="img-fluid"
                            style={{
                              height: "150px",
                              width: "120px",
                              objectFit: "cover",
                              borderRadius: "15px",
                            }}
                          />

                        ) : (

                          <div
                            className="d-flex align-items-center justify-content-center mx-auto"
                            style={{
                              height: "150px",
                              width: "120px",
                              background: "#f8f9fa",
                              borderRadius: "15px",
                            }}
                          >
                            No Image
                          </div>

                        )}

                      </div>


                      {/* DETAILS */}

                      <div className="col-8 col-md-4">

                        <h5
                          className="fw-bold mb-2"
                          style={{ color: "#212529" }}
                        >
                          {item.name}
                        </h5>

                        <p
                          className="text-muted small mb-2"
                          style={{
                            maxHeight: "45px",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </p>

                        <h5
                          className="fw-bold"
                          style={{ color: "#d63384" }}
                        >
                          ₹{item.price}
                        </h5>

                      </div>


                      {/* QUANTITY */}

                      <div className="col-6 col-md-3 mt-3 mt-md-0">

                        <label className="fw-semibold mb-2">
                          Quantity
                        </label>

                        <div
                          className="d-flex align-items-center"
                          style={{
                            maxWidth: "150px",
                          }}
                        >

                          <button
                            className="btn btn-outline-dark"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.quantity - 1
                              )
                            }
                            disabled={
                              item.quantity <= 1
                            }
                          >
                            −
                          </button>

                          <span
                            className="px-3 fw-bold"
                          >
                            {item.quantity}
                          </span>

                          <button
                            className="btn btn-outline-dark"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >=
                              item.stock
                            }
                          >
                            +
                          </button>

                        </div>

                        <small className="text-muted">
                          Stock: {item.stock}
                        </small>

                      </div>


                      {/* REMOVE */}

                      <div className="col-6 col-md-2 text-md-center mt-3 mt-md-0">

                        <button
                          className="btn btn-outline-danger"
                          onClick={() =>
                            removeFromCart(item._id)
                          }
                        >
                          🗑️ Remove
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>


          {/* ORDER SUMMARY */}

          <div className="col-lg-4">

            <div
              className="card border-0 sticky-top"
              style={{
                top: "20px",
                borderRadius: "22px",
                boxShadow:
                  "0 10px 35px rgba(214,51,132,0.14)",
              }}
            >

              <div className="card-body p-4">

                <h4
                  className="fw-bold"
                  style={{ color: "#212529" }}
                >
                  Order Summary
                </h4>

                <p className="text-muted">
                  Review your order before checkout.
                </p>

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <span>Total Items</span>
                  <strong>{totalItems}</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <strong>
                    ₹{totalPrice}
                  </strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Delivery</span>
                  <span className="text-success fw-bold">
                    FREE
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">

                  <span className="fw-bold">
                    Total
                  </span>

                  <h3
                    className="fw-bold mb-0"
                    style={{
                      color: "#d63384",
                    }}
                  >
                    ₹{totalPrice}
                  </h3>

                </div>

                <button
                  className="btn btn-dark w-100 mt-4 py-2"
                  style={{
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    window.location.href =
                      "/checkout";
                  }}
                >
                  💳 Proceed to Checkout
                </button>

                <button
                  className="btn btn-outline-danger w-100 mt-2"
                  style={{
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    window.location.href =
                      "/products";
                  }}
                >
                  🛍️ Continue Shopping
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;
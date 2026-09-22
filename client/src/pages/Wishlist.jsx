import { useEffect, useState } from "react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(
      (item) => item._id !== productId
    );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);
  };

  const goToProducts = () => {
    window.location.href = "/products";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f6, #ffffff)",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >
      <div className="container">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-5">

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
              className="fw-bold mb-1"
              style={{ color: "#212529" }}
            >
              ❤️ My Wishlist
            </h2>

            <p className="text-muted mb-0">
              Your favorite fashion picks
            </p>
          </div>

          <button
            className="btn btn-dark px-4"
            onClick={goToProducts}
          >
            🛍️ Continue Shopping
          </button>

        </div>


        {/* EMPTY WISHLIST */}

        {wishlist.length === 0 ? (

          <div className="text-center">

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

              <div style={{ fontSize: "75px" }}>
                💗
              </div>

              <h2
                className="fw-bold mt-3"
                style={{ color: "#212529" }}
              >
                Your Wishlist is Empty
              </h2>

              <p
                className="text-muted"
                style={{ fontSize: "17px" }}
              >
                Save the styles you love and
                find them here anytime. ✨
              </p>

              <button
                className="btn btn-dark btn-lg px-5 mt-3"
                onClick={goToProducts}
              >
                ✨ Explore Products
              </button>

            </div>

          </div>

        ) : (

          <>
            <div className="row g-4">

              {wishlist.map((product) => {

                const imageUrl = product.image
                  ? `http://localhost:5000/${product.image.replaceAll(
                      "\\",
                      "/"
                    )}`
                  : null;

                return (

                  <div
                    className="col-12 col-sm-6 col-lg-3"
                    key={product._id}
                  >

                    <div
                      className="card h-100 border-0"
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,0.08)",
                      }}
                    >

                      {/* IMAGE */}

                      <div
                        style={{
                          position: "relative",
                          background: "#fff",
                        }}
                      >

                        {imageUrl ? (

                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-100"
                            style={{
                              height: "300px",
                              objectFit: "cover",
                            }}
                          />

                        ) : (

                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              height: "300px",
                              background: "#f8f9fa",
                            }}
                          >
                            No Image
                          </div>

                        )}

                        {/* HEART */}

                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "#ffffff",
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            boxShadow:
                              "0 4px 12px rgba(0,0,0,0.12)",
                          }}
                        >
                          ❤️
                        </div>

                      </div>


                      {/* DETAILS */}

                      <div className="card-body p-4">

                        <h5
                          className="fw-bold mb-2"
                          style={{ color: "#212529" }}
                        >
                          {product.name}
                        </h5>

                        <p
                          className="text-muted small"
                          style={{
                            minHeight: "42px",
                          }}
                        >
                          {product.description}
                        </p>

                        <h4
                          className="fw-bold mb-3"
                          style={{ color: "#d63384" }}
                        >
                          ₹{product.price}
                        </h4>

                        <button
                          className="btn btn-outline-danger w-100"
                          style={{
                            borderRadius: "10px",
                          }}
                          onClick={() =>
                            removeFromWishlist(
                              product._id
                            )
                          }
                        >
                          💔 Remove
                        </button>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

            {/* BOTTOM */}

            <div
              className="text-center mt-5 p-4"
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.06)",
              }}
            >

              <h5 className="fw-bold">
                Found something you love? 💕
              </h5>

              <p className="text-muted mb-3">
                Keep exploring StyleHub for more
                beautiful styles.
              </p>

              <button
                className="btn btn-dark px-4"
                onClick={goToProducts}
              >
                🛍️ Shop More
              </button>

            </div>

          </>

        )}

      </div>
    </div>
  );
}

export default Wishlist;
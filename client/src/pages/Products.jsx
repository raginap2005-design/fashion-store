import { useEffect, useState } from "react";
import axios from "axios";

function Products({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/products?page=1&limit=100"
        );

        let productList = response.data.products || [];

        if (category) {
          productList = productList.filter(
            (product) =>
              product.category?.name?.toLowerCase() ===
              category.toLowerCase()
          );
        }

        setProducts(productList);
      } catch (error) {
        console.log("PRODUCT ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      if (product.stock <= 0) {
        alert("Product is out of stock");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("CART RESPONSE:", response.data);

      const localCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const existingIndex = localCart.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex !== -1) {
        localCart[existingIndex].quantity += 1;
      } else {
        localCart.push({
          ...product,
          quantity: 1,
        });
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(localCart)
      );

      alert(`${product.name} added to cart`);
    } catch (error) {
      console.log("ADD TO CART ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    }
  };

  // =========================================
  // WISHLIST
  // =========================================

  const toggleWishlist = (product) => {
    try {
      const wishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      const existingIndex = wishlist.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);

        localStorage.setItem(
          "wishlist",
          JSON.stringify(wishlist)
        );

        alert(
          `${product.name} removed from wishlist`
        );
      } else {
        wishlist.push(product);

        localStorage.setItem(
          "wishlist",
          JSON.stringify(wishlist)
        );

        alert(
          `${product.name} added to wishlist`
        );
      }

      setProducts([...products]);
    } catch (error) {
      console.log("WISHLIST ERROR:", error);
    }
  };

  // =========================================
  // CHECK WISHLIST
  // =========================================

  const isWishlisted = (productId) => {
    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    return wishlist.some(
      (item) => item._id === productId
    );
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fff5f8",
          paddingTop: "100px",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ color: "#d63384" }}
          ></div>

          <h4
            className="mt-3 fw-bold"
            style={{ color: "#212529" }}
          >
            Loading beautiful styles...
          </h4>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  // =========================================
  // PRODUCTS PAGE
  // =========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f6, #ffffff)",
        paddingTop: "35px",
        paddingBottom: "60px",
      }}
    >
      <div className="container">

        {/* HEADER */}

        <div className="mb-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <div>
              <p
                className="mb-1 fw-bold"
                style={{
                  color: "#d63384",
                  letterSpacing: "2px",
                }}
              >
                STYLEHUB
              </p>

              <h2
                className="fw-bold mb-1"
                style={{
                  color: "#212529",
                }}
              >
                {category
                  ? `${category} Collection`
                  : "Discover Your Style"}
              </h2>

              <p className="text-muted mb-0">
                Find something beautiful for every
                occasion ✨
              </p>
            </div>

            <div>

              <button
                className="btn btn-outline-danger me-2"
                style={{
                  borderRadius: "10px",
                }}
                onClick={() => {
                  window.location.href =
                    "/wishlist";
                }}
              >
                ❤️ Wishlist
              </button>

              <button
                className="btn btn-dark"
                style={{
                  borderRadius: "10px",
                }}
                onClick={() => {
                  window.location.href =
                    "/cart";
                }}
              >
                🛒 View Cart
              </button>

            </div>

          </div>

        </div>


        {/* CATEGORY BANNER */}

        <div
          className="p-4 mb-4"
          style={{
            background:
              "linear-gradient(90deg, #d63384, #f06595)",
            borderRadius: "20px",
            color: "white",
          }}
        >

          <div className="row align-items-center">

            <div className="col-md-8">

              <h3 className="fw-bold">
                Your Style. Your Story. 💕
              </h3>

              <p className="mb-0">
                Explore our latest collection and
                choose the styles you love.
              </p>

            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">

              <span
                style={{
                  fontSize: "55px",
                }}
              >
                👗 ✨ 🛍️
              </span>

            </div>

          </div>

        </div>


        {/* NO PRODUCTS */}

        {products.length === 0 ? (

          <div
            className="text-center p-5"
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "60px" }}>
              🛍️
            </div>

            <h3 className="fw-bold mt-3">
              No products found
            </h3>

            <p className="text-muted">
              Please check another collection.
            </p>
          </div>

        ) : (

          <div className="row g-4">

            {products.map((product) => {

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
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >

                    {/* IMAGE AREA */}

                    <div
                      style={{
                        position: "relative",
                        background: "#ffffff",
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
                          onError={(e) => {
                            e.target.style.display =
                              "none";
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


                      {/* WISHLIST */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleWishlist(product)
                        }
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.15)",
                          cursor: "pointer",
                        }}
                      >
                        {isWishlisted(product._id)
                          ? "❤️"
                          : "🤍"}
                      </button>

                      {/* STOCK BADGE */}

                      {product.stock <= 0 && (

                        <span
                          className="badge bg-danger"
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "12px",
                            padding: "8px 10px",
                          }}
                        >
                          OUT OF STOCK
                        </span>

                      )}

                    </div>


                    {/* DETAILS */}

                    <div className="card-body d-flex flex-column p-4">

                      <h5
                        className="fw-bold mb-2"
                        style={{
                          color: "#212529",
                        }}
                      >
                        {product.name}
                      </h5>

                      <p
                        className="text-muted small mb-2"
                        style={{
                          minHeight: "42px",
                        }}
                      >
                        {product.description}
                      </p>

                      <h4
                        className="fw-bold mb-2"
                        style={{
                          color: "#d63384",
                        }}
                      >
                        ₹{product.price}
                      </h4>

                      <p className="small mb-3">
                        {product.stock > 0 ? (
                          <span className="text-success fw-semibold">
                            ✓ {product.stock} available
                          </span>
                        ) : (
                          <span className="text-danger fw-semibold">
                            ✕ Out of stock
                          </span>
                        )}
                      </p>


                      {/* CART */}

                      <button
                        className="btn btn-dark w-100 mt-auto fw-semibold"
                        style={{
                          borderRadius: "10px",
                          padding: "10px",
                        }}
                        onClick={() =>
                          addToCart(product)
                        }
                        disabled={
                          product.stock <= 0
                        }
                      >
                        {product.stock <= 0
                          ? "Out of Stock"
                          : "🛒 Add to Cart"}
                      </button>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}

export default Products;

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Products({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // PRODUCT REVIEWS
  const [reviews, setReviews] = useState({});
  const [reviewRatings, setReviewRatings] = useState({});
  const [reviewComments, setReviewComments] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});
  const [expandedReviews, setExpandedReviews] = useState({});
  const [userReviewed, setUserReviewed] = useState({});

  // Search and category filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://fashion-store-u2cg.onrender.com/api/products?page=1&limit=100"
        );

        const productList = response.data.products || [];
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
  }, []);

  // =========================================
  // GET CATEGORY NAME
  // =========================================

  const getCategoryName = (product) => {
    if (typeof product.category === "string") {
      return product.category;
    }

    return product.category?.name || "";
  };

  // =========================================
  // CATEGORY OPTIONS
  // =========================================

  const categories = [
    ...new Set(
      products
        .map((product) => getCategoryName(product))
        .filter(Boolean)
    ),
  ];

  // =========================================
  // SEARCH + FILTER PRODUCTS
  // =========================================

  const filteredProducts = products.filter((product) => {
    const productCategory = getCategoryName(product);
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search);

    const matchesSelectedCategory =
      !selectedCategory ||
      productCategory.toLowerCase() ===
        selectedCategory.toLowerCase();

    const matchesPageCategory =
      !category ||
      productCategory.toLowerCase() ===
        category.toLowerCase();

    return (
      matchesSearch &&
      matchesSelectedCategory &&
      matchesPageCategory
    );
  });

  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      if (product.stock <= 0) {
        toast.error("Product is out of stock.");
        return;
      }

      const response = await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/cart",
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

      localStorage.setItem("cart", JSON.stringify(localCart));
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.log("ADD TO CART ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    }
  };

  // =========================================
  // WISHLIST
  // =========================================

  const toggleWishlist = (product) => {
    try {
      const wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

      const existingIndex = wishlist.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);

        localStorage.setItem(
          "wishlist",
          JSON.stringify(wishlist)
        );

        toast.success(
          `${product.name} removed from wishlist.`
        );
      } else {
        wishlist.push(product);

        localStorage.setItem(
          "wishlist",
          JSON.stringify(wishlist)
        );

        toast.success(
          `${product.name} added to wishlist!`
        );
      }

      setProducts((previousProducts) => [...previousProducts]);
    } catch (error) {
      console.log("WISHLIST ERROR:", error);
      toast.error("Unable to update wishlist.");
    }
  };

  // =========================================
  // CHECK WISHLIST
  // =========================================

  const isWishlisted = (productId) => {
    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some(
      (item) => item._id === productId
    );
  };

  // =========================================
  // FETCH PRODUCT REVIEWS
  // =========================================

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `https://fashion-store-u2cg.onrender.com/api/reviews/${productId}`
      );

      const reviewData = response.data;
      const productReviews = reviewData.reviews || [];

      setReviews((previous) => ({
        ...previous,
        [productId]: reviewData,
      }));

      const token = localStorage.getItem("token");

      if (!token) {
        setUserReviewed((previous) => ({
          ...previous,
          [productId]: false,
        }));
        return;
      }

      // Identify the current user from the login token.
      // This is only for displaying the correct UI.
      const tokenPayload = token.split(".")[1];

      const base64 = tokenPayload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const paddedBase64 =
        base64 + "=".repeat((4 - (base64.length % 4)) % 4);

      const currentUser = JSON.parse(atob(paddedBase64));
      const currentUserId = String(
        currentUser.id || currentUser._id || ""
      );

      const alreadyReviewed = productReviews.some((review) => {
        const reviewUserId =
          typeof review.user === "object"
            ? review.user?._id
            : review.user;

        return String(reviewUserId || "") === currentUserId;
      });

      setUserReviewed((previous) => ({
        ...previous,
        [productId]: alreadyReviewed,
      }));
    } catch (error) {
      console.log("FETCH REVIEWS ERROR:", error);
    }
  };

  // Fetch reviews for products
  useEffect(() => {
    if (products.length > 0) {
      products.forEach((product) => {
        fetchReviews(product._id);
      });
    }
  }, [products]);

  // =========================================
  // SUBMIT PRODUCT REVIEW
  // =========================================

  const submitReview = async (productId) => {
    const token = localStorage.getItem("token");
    const rating = Number(reviewRatings[productId]);
    const comment = reviewComments[productId]?.trim();

    if (!token) {
      toast.error("Please login to submit a review.");
      return;
    }

    if (userReviewed[productId]) {
      toast.error("You have already reviewed this product.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating.");
      return;
    }

    if (!comment || comment.length < 3) {
      toast.error("Please enter at least 3 characters.");
      return;
    }

    if (comment.length > 1000) {
      toast.error("Review cannot exceed 1000 characters.");
      return;
    }

    try {
      setReviewLoading((previous) => ({
        ...previous,
        [productId]: true,
      }));

      await axios.post(
        "https://fashion-store-u2cg.onrender.com/api/reviews",
        {
          productId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Hide the form immediately after successful submission.
      setUserReviewed((previous) => ({
        ...previous,
        [productId]: true,
      }));

      toast.success("Review submitted successfully!");

      setReviewComments((previous) => ({
        ...previous,
        [productId]: "",
      }));

      setReviewRatings((previous) => ({
        ...previous,
        [productId]: 0,
      }));

      await fetchReviews(productId);
    } catch (error) {
      const message = error.response?.data?.message;

      if (
        error.response?.status === 409 ||
        message === "You have already reviewed this product"
      ) {
        setUserReviewed((previous) => ({
          ...previous,
          [productId]: true,
        }));

        toast.error("You have already reviewed this product.");
      } else {
        toast.error(message || "Failed to submit review.");
      }
    } finally {
      setReviewLoading((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
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
        <div className="alert alert-danger">{error}</div>
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
        background: "linear-gradient(135deg, #fff0f6, #ffffff)",
        paddingTop: "35px",
        paddingBottom: "60px",
      }}
    >
      <div className="container-fluid px-4 px-md-5">
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
                style={{ color: "#212529" }}
              >
                {category
                  ? `${category} Collection`
                  : "Discover Your Style"}
              </h2>

              <p className="text-muted mb-0">
                Find something beautiful for every occasion ✨
              </p>
            </div>

            <div>
              <button
                className="btn btn-outline-danger me-2"
                style={{ borderRadius: "10px" }}
                onClick={() => {
                  window.location.href = "/wishlist";
                }}
              >
                ❤️ Wishlist
              </button>

              <button
                className="btn btn-dark"
                style={{ borderRadius: "10px" }}
                onClick={() => {
                  window.location.href = "/cart";
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
            background: "linear-gradient(90deg, #d63384, #f06595)",
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
                Explore our latest collection and choose the styles you love.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <span style={{ fontSize: "55px" }}>
                👗 ✨ 🛍️
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH AND CATEGORY FILTER */}

        <div
          className="row g-3 mb-4 align-items-center"
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
            marginLeft: "0",
            marginRight: "0",
          }}
        >
          <div className="col-12 col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
              style={{
                height: "48px",
                borderRadius: "10px",
              }}
            />
          </div>

          <div className="col-12 col-md-5">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
              style={{
                height: "48px",
                borderRadius: "10px",
              }}
            >
              <option value="">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="text-muted small">
              {filteredProducts.length} products found
            </span>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              style={{ borderRadius: "8px" }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* PRODUCTS LIST */}

        {filteredProducts.length === 0 ? (
          <div
            className="text-center p-5"
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: "60px" }}>🛍️</div>

            <h3 className="fw-bold mt-3">
              No products found
            </h3>

            <p className="text-muted">
              Try another search term or category.
            </p>

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              style={{ borderRadius: "10px" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => {
              const imageUrl = product.image
                ? `https://fashion-store-u2cg.onrender.com/${product.image
                    .replace(/\\/g, "/")
                    .replace(/^\/+/, "")}`
                : null;

              const productReviewData = reviews[product._id];
              const productReviews = productReviewData?.reviews || [];
              const averageRating = productReviewData?.averageRating || 0;
              const totalReviews = productReviewData?.totalReviews || 0;

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
                      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
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
                            e.target.style.display = "none";
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
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          isWishlisted(product._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
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
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          cursor: "pointer",
                        }}
                      >
                        {isWishlisted(product._id) ? "❤️" : "🤍"}
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
                        style={{ color: "#212529" }}
                      >
                        {product.name}
                      </h5>

                      <p
                        className="text-muted small mb-2"
                        style={{ minHeight: "42px" }}
                      >
                        {product.description}
                      </p>

                      <h4
                        className="fw-bold mb-2"
                        style={{ color: "#d63384" }}
                      >
                        ₹{product.price}
                      </h4>

                      {/* PRODUCT RATING */}

                      <div className="mb-3">
                        <span
                          style={{
                            color: "#f5b301",
                            fontSize: "18px",
                          }}
                        >
                          {"★".repeat(Math.round(averageRating))}
                          {"☆".repeat(5 - Math.round(averageRating))}
                        </span>

                        <span className="text-muted small ms-2">
                          {totalReviews > 0
                            ? `${averageRating}/5 (${totalReviews} reviews)`
                            : "No reviews yet"}
                        </span>
                      </div>

                      {/* WRITE A REVIEW */}

                      <div
                        className="mb-3 p-3"
                        style={{
                          background: "#fff5f8",
                          borderRadius: "12px",
                        }}
                      >
                        {userReviewed[product._id] ? (
                          <div className="text-success fw-semibold small">
                            ✓ You have already reviewed this product.
                          </div>
                        ) : (
                          <>
                            <h6 className="fw-bold mb-2">
                              Write a Review
                            </h6>

                            <div
                              className="d-flex gap-1 mb-2"
                              role="group"
                              aria-label="Choose rating"
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setReviewRatings((previous) => ({
                                      ...previous,
                                      [product._id]: star,
                                    }))
                                  }
                                  aria-label={`${star} star rating`}
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                    padding: "2px",
                                    fontSize: "25px",
                                    cursor: "pointer",
                                    color:
                                      star <=
                                      (reviewRatings[product._id] || 0)
                                        ? "#f5b301"
                                        : "#c5c5c5",
                                  }}
                                >
                                  ★
                                </button>
                              ))}
                            </div>

                            <textarea
                              className="form-control mb-2"
                              rows="3"
                              maxLength={1000}
                              placeholder="Share your experience..."
                              value={reviewComments[product._id] || ""}
                              onChange={(e) =>
                                setReviewComments((previous) => ({
                                  ...previous,
                                  [product._id]: e.target.value,
                                }))
                              }
                              style={{
                                borderRadius: "8px",
                                fontSize: "13px",
                              }}
                            />

                            <button
                              type="button"
                              className="btn btn-danger btn-sm w-100"
                              disabled={!!reviewLoading[product._id]}
                              onClick={() => submitReview(product._id)}
                              style={{
                                borderRadius: "8px",
                                background: "#d63384",
                                borderColor: "#d63384",
                              }}
                            >
                              {reviewLoading[product._id]
                                ? "Submitting..."
                                : "Submit Review"}
                            </button>
                          </>
                        )}
                      </div>

                      {/* CUSTOMER REVIEWS */}

                      <div className="mb-3">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none fw-semibold"
                          onClick={() =>
                            setExpandedReviews((previous) => ({
                              ...previous,
                              [product._id]: !previous[product._id],
                            }))
                          }
                          style={{ color: "#d63384" }}
                        >
                          {expandedReviews[product._id]
                            ? "Hide Customer Reviews"
                            : `View Customer Reviews (${totalReviews})`}
                        </button>

                        {expandedReviews[product._id] && (
                          <div
                            className="mt-2"
                            style={{
                              maxHeight: "220px",
                              overflowY: "auto",
                            }}
                          >
                            {productReviews.length === 0 ? (
                              <p className="text-muted small mb-0">
                                No reviews yet. Be the first to review!
                              </p>
                            ) : (
                              productReviews.map((review) => (
                                <div
                                  key={review._id}
                                  className="p-2 mb-2"
                                  style={{
                                    background: "#fff5f8",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center gap-2">
                                    <strong className="small">
                                      {review.user?.name || "Customer"}
                                    </strong>

                                    <span
                                      className="small"
                                      style={{ color: "#f5b301" }}
                                    >
                                      {"★".repeat(review.rating)}
                                      {"☆".repeat(5 - review.rating)}
                                    </span>
                                  </div>

                                  <p className="small mb-1 mt-1">
                                    {review.comment}
                                  </p>

                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {review.createdAt
                                      ? new Date(
                                          review.createdAt
                                        ).toLocaleDateString()
                                      : ""}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {/* STOCK */}

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

                      {/* ADD TO CART */}

                      <button
                        className="btn btn-dark w-100 mt-auto fw-semibold"
                        style={{
                          borderRadius: "10px",
                          padding: "10px",
                        }}
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
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

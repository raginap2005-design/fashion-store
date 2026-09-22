import { useEffect, useState } from "react";
import axios from "axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products?page=1&limit=100"
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.log("FETCH PRODUCTS ERROR:", error);
      alert("Failed to load products");
    }
  };

  // =========================================
  // LOAD PRODUCTS
  // =========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================================
  // HANDLE IMAGE
  // =========================================

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // =========================================
  // ADD PRODUCT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADD PRODUCT RESPONSE:", response.data);

      alert("Product added successfully! 🎉");

      // Clear form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
      });

      // Close form
      setShowForm(false);

      // Refresh products
      fetchProducts();

    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE PRODUCT
  // =========================================

  const deleteProduct = async (productId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (!confirmDelete) {
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product deleted successfully");

      fetchProducts();

    } catch (error) {
      console.log("DELETE PRODUCT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    return `http://localhost:5000/${image.replaceAll(
      "\\",
      "/"
    )}`;
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#fff5f8",
        minHeight: "100vh",
      }}
    >

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h1
              className="fw-bold"
              style={{ color: "#d63384" }}
            >
              Admin Products
            </h1>

            <p className="text-secondary mb-0">
              Manage your StyleHub products
            </p>
          </div>

          <button
            className="btn btn-lg text-white"
            style={{
              backgroundColor: "#d63384",
              borderRadius: "12px",
            }}
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "✕ Close"
              : "＋ Add Product"}
          </button>

        </div>


        {/* =====================================
            ADD PRODUCT FORM
        ===================================== */}

        {showForm && (

          <div
            className="card border-0 shadow-lg mb-5"
            style={{
              borderRadius: "20px",
            }}
          >

            <div className="card-body p-4">

              <h3
                className="fw-bold mb-4"
                style={{ color: "#d63384" }}
              >
                Add New Product
              </h3>

              <form onSubmit={handleSubmit}>

                <div className="row">

                  {/* PRODUCT NAME */}

                  <div className="col-md-6 mb-3">

                    <label className="fw-bold mb-2">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* PRICE */}

                  <div className="col-md-3 mb-3">

                    <label className="fw-bold mb-2">
                      Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="₹ Price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      required
                    />

                  </div>


                  {/* STOCK */}

                  <div className="col-md-3 mb-3">

                    <label className="fw-bold mb-2">
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      placeholder="Stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      required
                    />

                  </div>


                  {/* CATEGORY */}

                  <div className="col-md-6 mb-3">

                    <label className="fw-bold mb-2">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      className="form-control"
                      placeholder="Enter category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* IMAGE */}

                  <div className="col-md-6 mb-3">

                    <label className="fw-bold mb-2">
                      Product Image 📷
                    </label>

                    <input
                      type="file"
                      name="image"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                  </div>


                  {/* DESCRIPTION */}

                  <div className="col-12 mb-4">

                    <label className="fw-bold mb-2">
                      Description
                    </label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      placeholder="Enter product description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="btn btn-lg text-white px-5"
                  style={{
                    backgroundColor: "#d63384",
                    borderRadius: "10px",
                  }}
                  disabled={loading}
                >
                  {loading
                    ? "Adding Product..."
                    : "Add Product"}
                </button>

              </form>

            </div>

          </div>

        )}


        {/* =====================================
            PRODUCT LIST
        ===================================== */}

        <div className="row">

          {products.length === 0 ? (

            <div className="col-12">

              <div className="alert alert-info text-center">
                No products found.
              </div>

            </div>

          ) : (

            products.map((product) => {

              const imageUrl =
                getImageUrl(product.image);

              return (

                <div
                  className="col-md-4 col-lg-3 mb-4"
                  key={product._id}
                >

                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: "18px",
                      overflow: "hidden",
                    }}
                  >

                    {/* IMAGE */}

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          height: "230px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />

                    ) : (

                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          height: "230px",
                          backgroundColor: "#ffe5ef",
                        }}
                      >
                        No Image
                      </div>

                    )}


                    {/* DETAILS */}

                    <div className="card-body">

                      <h5 className="fw-bold">
                        {product.name}
                      </h5>

                      <p className="text-secondary small">
                        {product.description}
                      </p>

                      <h5
                        className="fw-bold"
                        style={{
                          color: "#d63384",
                        }}
                      >
                        ₹{product.price}
                      </h5>

                      <p className="mb-3">
                        <strong>
                          Stock:
                        </strong>{" "}
                        {product.stock}
                      </p>


                      {/* DELETE */}

                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={() =>
                          deleteProduct(
                            product._id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </div>

              );
            })

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminProducts;
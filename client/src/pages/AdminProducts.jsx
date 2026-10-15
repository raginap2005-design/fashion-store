import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

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
  const [deletingId, setDeletingId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const API_URL = "https://fashion-store-u2cg.onrender.com/api";

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products?page=1&limit=100`
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.log("FETCH PRODUCTS ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to load products"
      );
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);

      // Supports either an array response or { categories: [...] }
      const categoryList = Array.isArray(response.data)
        ? response.data
        : response.data.categories || [];

      setCategories(categoryList);

      if (categoryList.length === 0) {
        toast.error("No categories found. Please check your categories.");
      }
    } catch (error) {
      console.log("FETCH CATEGORIES ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to load categories"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // HANDLE TEXT INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    const image = e.target.files?.[0] || null;

    if (image && !image.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    setFormData((previous) => ({
      ...previous,
      image,
    }));
  };

  // ADD PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      // Send MongoDB category ID, NOT its name
      data.append("category", formData.category);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axios.post(
        `${API_URL}/products`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADD PRODUCT RESPONSE:", response.data);

      toast.success("Product added successfully! 🎉");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
      });

      const imageInput = document.getElementById("admin-product-image");
      if (imageInput) imageInput.value = "";

      setShowForm(false);
      await fetchProducts();
    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error.response?.data || error);

      toast.error(
        error.response?.data?.message || "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      setProductToDelete(null);
      return;
    }

    try {
      setDeletingId(productId);

      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((previous) =>
        previous.filter((product) => product._id !== productId)
      );

      setProductToDelete(null);
      toast.success("Product deleted successfully 🗑️");
    } catch (error) {
      console.log("DELETE PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // IMAGE URL
  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_URL.replace("/api", "")}/${image.replace(/\\/g, "/")}`;
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#fff5f8",
        minHeight: "100vh",
      }}
    >
      {/* <div className="container"> */}
      <div className="container-fluid px-4 px-md-5">
      
{/* HEADER */}
<div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
  <div>
    <h1 className="fw-bold" style={{ color: "#d63384" }}>
      Admin Products
    </h1>
    <p className="text-secondary mb-0">
      Manage your StyleHub products
    </p>
  </div>

  <div className="d-flex gap-2 flex-wrap">
    <Link
      to="/admin"
      className="btn btn-outline-dark btn-lg"
    >
      ← Dashboard
    </Link>

    <button
      type="button"
      className="btn btn-lg text-white"
      style={{
        backgroundColor: "#d63384",
        borderRadius: "12px",
      }}
      onClick={() => setShowForm((previous) => !previous)}
    >
      {showForm ? "✕ Close" : "＋ Add Product"}
    </button>
  </div>
</div>


        {/* ADD PRODUCT FORM */}
        {showForm && (
          <div
            className="card border-0 shadow-lg mb-5"
            style={{ borderRadius: "20px" }}
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

                  <div className="col-md-3 mb-3">
                    <label className="fw-bold mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="₹ Price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="fw-bold mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      placeholder="Stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      required
                    />
                  </div>

                  {/* CATEGORY DROPDOWN */}
                  <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-2">
                      Category
                    </label>

                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        {categories.length > 0
                          ? "Select Category"
                          : "Loading categories..."}
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {categories.length === 0 && (
                      <small className="text-danger">
                        No categories loaded. Check the categories API.
                      </small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-bold mb-2">
                      Product Image 📷
                    </label>
                    <input
                      id="admin-product-image"
                      type="file"
                      name="image"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

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

                <button
                  type="submit"
                  className="btn btn-lg text-white px-5"
                  style={{
                    backgroundColor: "#d63384",
                    borderRadius: "10px",
                  }}
                  disabled={loading || categories.length === 0}
                >
                  {loading ? "Adding Product..." : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        {productToDelete && (
          <div
            className="card border-0 shadow mb-4"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold text-danger">
                Delete Product?
              </h5>

              <p className="text-secondary mb-3">
                Are you sure you want to delete{" "}
                <strong>{productToDelete.name}</strong>?
              </p>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={deletingId === productToDelete._id}
                  onClick={() => deleteProduct(productToDelete._id)}
                >
                  {deletingId === productToDelete._id
                    ? "Deleting..."
                    : "Yes, Delete"}
                </button>

                <button
                  type="button"
                  className="btn btn-light border"
                  disabled={deletingId === productToDelete._id}
                  onClick={() => setProductToDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT LIST */}
        <div className="row">
          {products.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center">
                No products found.
              </div>
            </div>
          ) : (
            products.map((product) => {
              const imageUrl = getImageUrl(product.image);

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
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          height: "230px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
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

                    <div className="card-body">
                      <h5 className="fw-bold">{product.name}</h5>

                      <p className="text-secondary small">
                        {product.description}
                      </p>

                      <h5
                        className="fw-bold"
                        style={{ color: "#d63384" }}
                      >
                        ₹{product.price}
                      </h5>

                      <p className="mb-3">
                        <strong>Stock:</strong> {product.stock}
                      </p>

                      <p className="small text-secondary">
                        <strong>Category:</strong>{" "}
                        {product.category?.name || "Uncategorized"}
                      </p>

                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        disabled={deletingId === product._id}
                        onClick={() => setProductToDelete(product)}
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
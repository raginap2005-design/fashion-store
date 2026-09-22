import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f6, #f8f0ff, #eef7ff)",
        padding: "50px 20px",
      }}
    >
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5">
          <div
            style={{
              fontSize: "55px",
              marginBottom: "10px",
            }}
          >
            👑
          </div>

          <h1
            style={{
              fontWeight: "800",
              color: "#d63384",
            }}
          >
            StyleHub Admin
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#6f42c1",
            }}
          >
            Manage your fashion store easily ✨
          </p>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="row g-4 justify-content-center">

          {/* PRODUCTS */}
          <div className="col-md-4">
            <div
              className="card border-0 h-100 text-center"
              style={{
                borderRadius: "25px",
                boxShadow: "0 10px 30px rgba(214,51,132,0.15)",
                background: "#ffffff",
              }}
            >
              <div className="card-body p-5">

                <div
                  style={{
                    fontSize: "55px",
                    marginBottom: "15px",
                  }}
                >
                  📦
                </div>

                <h3
                  style={{
                    color: "#d63384",
                    fontWeight: "700",
                  }}
                >
                  Products
                </h3>

                <p className="text-muted">
                  Add, edit and manage your fashion products.
                </p>

                <Link
                  to="/admin/products"
                  className="btn w-100"
                  style={{
                    background: "#d63384",
                    color: "white",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: "600",
                  }}
                >
                  Manage Products
                </Link>

              </div>
            </div>
          </div>

          {/* ORDERS */}
          <div className="col-md-4">
            <div
              className="card border-0 h-100 text-center"
              style={{
                borderRadius: "25px",
                boxShadow: "0 10px 30px rgba(111,66,193,0.15)",
                background: "#ffffff",
              }}
            >
              <div className="card-body p-5">

                <div
                  style={{
                    fontSize: "55px",
                    marginBottom: "15px",
                  }}
                >
                  🛍️
                </div>

                <h3
                  style={{
                    color: "#6f42c1",
                    fontWeight: "700",
                  }}
                >
                  Orders
                </h3>

                <p className="text-muted">
                  View and manage customer orders.
                </p>

                <Link
                  to="/admin/orders"
                  className="btn w-100"
                  style={{
                    background: "#6f42c1",
                    color: "white",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: "600",
                  }}
                >
                  Manage Orders
                </Link>

              </div>
            </div>
          </div>

          {/* USERS */}
          <div className="col-md-4">
            <div
              className="card border-0 h-100 text-center"
              style={{
                borderRadius: "25px",
                boxShadow: "0 10px 30px rgba(25,135,84,0.15)",
                background: "#ffffff",
              }}
            >
              <div className="card-body p-5">

                <div
                  style={{
                    fontSize: "55px",
                    marginBottom: "15px",
                  }}
                >
                  👥
                </div>

                <h3
                  style={{
                    color: "#198754",
                    fontWeight: "700",
                  }}
                >
                  Users
                </h3>

                <p className="text-muted">
                  View registered StyleHub customers.
                </p>

                <Link
                  to="/admin/users"
                  className="btn w-100"
                  style={{
                    background: "#198754",
                    color: "white",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: "600",
                  }}
                >
                  Manage Users
                </Link>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
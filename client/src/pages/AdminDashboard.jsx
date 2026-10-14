
import { Link } from "react-router-dom";

function AdminDashboard() {
  const cards = [
    {
      title: "Products",
      icon: "📦",
      description: "Add, edit and manage fashion products.",
      path: "/admin/products",
      color: "#d63384",
    },
    {
      title: "Orders",
      icon: "🛍️",
      description: "View and manage customer orders.",
      path: "/admin/orders",
      color: "#6f42c1",
    },
    {
      title: "Users",
      icon: "👥",
      description: "View registered StyleHub customers.",
      path: "/admin/users",
      color: "#198754",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f6, #f8f0ff, #eef7ff)",
        padding: "40px 20px",
      }}
    >
      {/* <div className="container"> */}

      <div className="container-fluid px-4 px-md-5">
        <div className="text-center mb-5">
          <div style={{ fontSize: 55 }}>👑</div>

          <h1
            className="fw-bold"
            style={{ color: "#d63384" }}
          >
            StyleHub Admin
          </h1>

          <p style={{ color: "#6f42c1", fontSize: 18 }}>
            Manage your fashion store easily ✨
          </p>
        </div>

        <h4 className="fw-bold mb-4">
          Manage Store
        </h4>

        <div className="row g-4">
          {cards.map((item) => (
            <div
              className="col-12 col-md-4"
              key={item.title}
            >
              <div
                className="card border-0 h-100 text-center"
                style={{
                  borderRadius: 22,
                  boxShadow:
                    "0 10px 30px rgba(214,51,132,0.12)",
                }}
              >
                <div className="card-body p-4">
                  <div style={{ fontSize: 48 }}>
                    {item.icon}
                  </div>

                  <h4
                    className="fw-bold mt-3"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h4>

                  <p className="text-muted">
                    {item.description}
                  </p>

                  <Link
                    to={item.path}
                    className="btn w-100 text-white"
                    style={{
                      background: item.color,
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    Manage {item.title}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

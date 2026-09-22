import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://fashion-store-u2cg.onrender.com/api/user/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users || []);
    } catch (error) {
      console.log("USERS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading users...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff0f7, #f3e8ff, #e8f7ff)",
        padding: "40px 20px",
      }}
    >
      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1
              style={{
                color: "#198754",
                fontWeight: "800",
              }}
            >
              👥 Manage Users
            </h1>

            <p>
              View registered StyleHub customers
            </p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() =>
              (window.location.href = "/admin")
            }
          >
            ← Dashboard
          </button>
        </div>

        {users.length === 0 ? (
          <div className="alert alert-info text-center">
            No users found.
          </div>
        ) : (
          <div className="row g-4">

            {users.map((user) => (
              <div
                className="col-md-6 col-lg-4"
                key={user._id}
              >
                <div
                  className="card border-0 shadow h-100"
                  style={{
                    borderRadius: "20px",
                  }}
                >
                  <div className="card-body p-4">

                    <div
                      style={{
                        fontSize: "45px",
                      }}
                    >
                      👤
                    </div>

                    <h4
                      style={{
                        fontWeight: "700",
                        color: "#198754",
                      }}
                    >
                      {user.name}
                    </h4>

                    <p className="mb-2">
                      📧 {user.email}
                    </p>

                    <span
                      className={
                        user.role === "admin"
                          ? "badge bg-danger"
                          : "badge bg-success"
                      }
                    >
                      {user.role}
                    </span>

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminUsers;
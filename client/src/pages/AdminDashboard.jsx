
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <p>Welcome to the StyleHub Admin Panel.</p>

      <div className="row g-4 mt-3">
        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>Manage Products</h5>
            <p>Add, edit and delete products.</p>
            <Link to="/admin/products" className="btn btn-dark">
              Manage Products
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>Manage Orders</h5>
            <p>View and manage customer orders.</p>
            <Link to="/admin/orders" className="btn btn-dark">
              Manage Orders
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>Manage Users</h5>
            <p>View registered users.</p>
            <Link to="/admin/users" className="btn btn-dark">
              Manage Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

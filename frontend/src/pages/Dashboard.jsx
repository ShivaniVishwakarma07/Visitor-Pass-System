import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Visitor Pass Management System</h1>
        <p>Dashboard</p>
      </div>

      <div className="card">
        <h2>Welcome, {user?.name}</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      {user?.role === "admin" && (
        <div className="card">
          <h2>Admin Dashboard</h2>
          <p>Manage the complete visitor pass system.</p>

          <div className="nav-links">
            <Link to="/admin-dashboard">Admin Statistics</Link>
            <Link to="/visitors">Manage Visitors</Link>
            <Link to="/appointments">Manage Appointments</Link>
            <Link to="/passes">Manage Visitor Passes</Link>
            <Link to="/check-in-out">Security Check-In / Check-Out</Link>
            <Link to="/check-logs">Visitor Check Logs</Link>
          </div>
        </div>
      )}

      {user?.role === "security" && (
        <div className="card">
          <h2>Security Dashboard</h2>
          <p>Verify visitor passes and manage visitor movement.</p>

          <div className="nav-links">
            <Link to="/check-in-out">Security Check-In / Check-Out</Link>
            <Link to="/check-logs">Visitor Check Logs</Link>
            <Link to="/passes">View Visitor Passes</Link>
          </div>
        </div>
      )}

      {user?.role === "employee" && (
        <div className="card">
          <h2>Employee Dashboard</h2>
          <p>Manage visitors and appointments.</p>

          <div className="nav-links">
            <Link to="/visitors">Manage Visitors</Link>
            <Link to="/appointments">Manage Appointments</Link>
            <Link to="/passes">Manage Visitor Passes</Link>
          </div>
        </div>
      )}

      {user?.role === "visitor" && (
        <div className="card">
          <h2>Visitor Dashboard</h2>
          <p>View your appointments and visitor passes.</p>

          <div className="nav-links">
            <Link to="/appointments">My Appointments</Link>
            <Link to="/passes">My Visitor Passes</Link>
          </div>
        </div>
      )}

      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Visitor Pass Management System</h1>

      <h2>Dashboard</h2>

      <p>Welcome, {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      {user?.role === "admin" && (
        <div>
          <h3>Admin Dashboard</h3>

          <p>Manage the complete visitor pass system.</p>

          <Link to="/admin-dashboard">Admin Statistics</Link>

          <br />

          <Link to="/visitors">Manage Visitors</Link>

          <br />

          <Link to="/appointments">Manage Appointments</Link>

          <br />

          <Link to="/passes">Manage Visitor Passes</Link>

          <br />

          <Link to="/check-in-out">Security Check-In / Check-Out</Link>

          <br />

          <Link to="/check-logs">Visitor Check Logs</Link>
        </div>
      )}

      {user?.role === "security" && (
        <div>
          <h3>Security Dashboard</h3>

          <p>Verify visitor passes and manage visitor movement.</p>

          <Link to="/check-in-out">Security Check-In / Check-Out</Link>

          <br />

          <Link to="/check-logs">Visitor Check Logs</Link>

          <br />

          <Link to="/passes">View Visitor Passes</Link>
        </div>
      )}

      {user?.role === "employee" && (
        <div>
          <h3>Employee Dashboard</h3>

          <p>Manage visitors and appointments.</p>

          <Link to="/visitors">Manage Visitors</Link>

          <br />

          <Link to="/appointments">Manage Appointments</Link>

          <br />

          <Link to="/passes">Manage Visitor Passes</Link>
        </div>
      )}

      {user?.role === "visitor" && (
        <div>
          <h3>Visitor Dashboard</h3>

          <p>View your appointments and visitor passes.</p>

          <Link to="/appointments">My Appointments</Link>

          <br />

          <Link to="/passes">My Visitor Passes</Link>
        </div>
      )}

      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;

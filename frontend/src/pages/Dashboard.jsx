import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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
          <p>Manage users, visitors, appointments and reports.</p>
        </div>
      )}

      {user?.role === "security" && (
        <div>
          <h3>Security Dashboard</h3>
          <p>Check visitors in and out and verify visitor passes.</p>
        </div>
      )}

      {user?.role === "employee" && (
        <div>
          <h3>Employee Dashboard</h3>
          <p>Create appointments and manage visitors.</p>
        </div>
      )}

      {user?.role === "visitor" && (
        <div>
          <h3>Visitor Dashboard</h3>
          <p>View your appointments and visitor passes.</p>
        </div>
      )}
      <Link to="/visitors">Manage Visitors</Link>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;

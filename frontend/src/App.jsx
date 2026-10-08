import { BrowserRouter, Routes, Route } from "react-router-dom";

import Visitors from "./pages/Visitors";
import AdminDashboard from "./pages/AdminDashboard";
import CheckLogs from "./pages/CheckLogs";
import CheckInOut from "./pages/CheckInOut";
import Passes from "./pages/Passes";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitors"
          element={
            <ProtectedRoute>
              <Visitors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passes"
          element={
            <ProtectedRoute>
              <Passes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-in-out"
          element={
            <ProtectedRoute>
              <CheckInOut />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-logs"
          element={
            <ProtectedRoute>
              <CheckLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

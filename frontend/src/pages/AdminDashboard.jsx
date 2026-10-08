import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    visitors: 0,
    appointments: 0,
    approvedAppointments: 0,
    passes: 0,
    activePasses: 0,
    checkIns: 0,
    checkOuts: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [
        visitorsResponse,
        appointmentsResponse,
        passesResponse,
        logsResponse,
      ] = await Promise.all([
        api.get("/visitors"),
        api.get("/appointments"),
        api.get("/passes"),
        api.get("/checklogs"),
      ]);

      const visitors = Array.isArray(visitorsResponse.data)
        ? visitorsResponse.data
        : visitorsResponse.data.visitors || [];

      const appointments = Array.isArray(appointmentsResponse.data)
        ? appointmentsResponse.data
        : appointmentsResponse.data.appointments || [];

      const passes = Array.isArray(passesResponse.data)
        ? passesResponse.data
        : passesResponse.data.passes || [];

      const logs = Array.isArray(logsResponse.data)
        ? logsResponse.data
        : logsResponse.data.logs || [];

      setStats({
        visitors: visitors.length,
        appointments: appointments.length,
        approvedAppointments: appointments.filter(
          (appointment) => appointment.status === "approved",
        ).length,
        passes: passes.length,
        activePasses: passes.filter((pass) => pass.status === "active").length,
        checkIns: logs.filter((log) => log.action === "check-in").length,
        checkOuts: logs.filter((log) => log.action === "check-out").length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of the visitor pass management system</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Visitors</h3>
          <p>{stats.visitors}</p>
        </div>

        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p>{stats.appointments}</p>
        </div>

        <div className="stat-card">
          <h3>Approved Appointments</h3>
          <p>{stats.approvedAppointments}</p>
        </div>

        <div className="stat-card">
          <h3>Total Passes</h3>
          <p>{stats.passes}</p>
        </div>

        <div className="stat-card">
          <h3>Active Passes</h3>
          <p>{stats.activePasses}</p>
        </div>

        <div className="stat-card">
          <h3>Total Check-Ins</h3>
          <p>{stats.checkIns}</p>
        </div>

        <div className="stat-card">
          <h3>Total Check-Outs</h3>
          <p>{stats.checkOuts}</p>
        </div>
      </div>

      <div className="card">
        <h2>System Overview</h2>
        <p>
          The dashboard provides an overview of registered visitors,
          appointments, issued passes and visitor movement records.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;

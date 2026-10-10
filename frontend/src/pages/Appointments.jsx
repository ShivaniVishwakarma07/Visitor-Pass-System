import { useEffect, useState } from "react";
import api from "../services/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    visitor: "",
    appointmentDate: "",
    purpose: "",
    notes: "",
  });

  const fetchVisitors = async () => {
    try {
      const response = await api.get("/visitors");

      const visitorData = Array.isArray(response.data)
        ? response.data
        : response.data.visitors || [];

      setVisitors(visitorData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");

      setAppointments(
        Array.isArray(response.data)
          ? response.data
          : response.data.appointments || [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/appointments", form);

      setForm({
        visitor: "",
        appointmentDate: "",
        purpose: "",
        notes: "",
      });

      fetchAppointments();

      alert("Appointment created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create appointment");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, {
        status,
      });

      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update appointment");
    }
  };

  const exportAppointments = () => {
    const headers = [
      "Visitor",
      "Visitor Email",
      "Host",
      "Appointment Date",
      "Purpose",
      "Status",
      "Notes",
    ];

    const rows = appointments.map((appointment) => [
      appointment.visitor?.name || "",
      appointment.visitor?.email || "",
      appointment.host?.name || "",
      appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toLocaleString()
        : "",
      appointment.purpose || "",
      appointment.status || "",
      appointment.notes || "",
    ]);

    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "appointment-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Appointment Management</h1>
        <p>Create and manage visitor appointments</p>
      </div>

      <div className="card">
        <h2>Create Appointment</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Visitor</label>
            <select
              name="visitor"
              value={form.visitor}
              onChange={handleChange}
              required
            >
              <option value="">Select Visitor</option>

              {visitors.map((visitor) => (
                <option key={visitor._id} value={visitor._id}>
                  {visitor.name} - {visitor.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full">
            <label>Purpose</label>
            <input
              type="text"
              name="purpose"
              placeholder="Enter appointment purpose"
              value={form.purpose}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full">
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Additional notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full">
            <button type="submit" className="btn btn-primary">
              Create Appointment
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Appointments</h2>

        <button
          className="btn btn-primary"
          onClick={exportAppointments}
          style={{ marginTop: "15px", marginBottom: "20px" }}
        >
          Export Appointments to CSV
        </button>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Host</th>
                  <th>Date</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.visitor?.name || "-"}</td>

                    <td>{appointment.host?.name || "-"}</td>

                    <td>
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </td>

                    <td>{appointment.purpose}</td>

                    <td>{appointment.status}</td>

                    <td>
                      {appointment.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success"
                            onClick={() =>
                              updateStatus(appointment._id, "approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              updateStatus(appointment._id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {appointment.status !== "pending" && (
                        <span>No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;

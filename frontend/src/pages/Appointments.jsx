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

  return (
    <div>
      <h1>Appointment Management</h1>

      <h2>Create Appointment</h2>

      <form onSubmit={handleSubmit}>
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

        <input
          type="datetime-local"
          name="appointmentDate"
          value={form.appointmentDate}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="purpose"
          placeholder="Purpose of Visit"
          value={form.purpose}
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit">Create Appointment</button>
      </form>

      <hr />

      <h2>Appointments</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="8">
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
                <td>{appointment.visitor?.name || "Unknown"}</td>

                <td>{appointment.host?.name || "Unknown"}</td>

                <td>
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </td>

                <td>{appointment.purpose}</td>

                <td>{appointment.status}</td>

                <td>
                  {appointment.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(appointment._id, "approved")
                        }
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(appointment._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;

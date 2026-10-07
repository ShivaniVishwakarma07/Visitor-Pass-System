import { useEffect, useState } from "react";
import api from "../services/api";

const Passes = () => {
  const [passes, setPasses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    appointment: "",
    validFrom: "",
    validUntil: "",
  });

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.appointments || [];

      setAppointments(
        data.filter((appointment) => appointment.status === "approved"),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPasses = async () => {
    try {
      const response = await api.get("/passes");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.passes || [];

      setPasses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPasses();
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
      await api.post("/passes", form);

      setForm({
        appointment: "",
        validFrom: "",
        validUntil: "",
      });

      fetchPasses();

      alert("Visitor pass created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create visitor pass");
    }
  };

  const downloadPDF = async (passId, passNumber) => {
    try {
      const response = await api.get(`/passes/${passId}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `${passNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download pass PDF");
    }
  };

  return (
    <div>
      <h1>Visitor Pass Management</h1>

      <h2>Generate Visitor Pass</h2>

      {appointments.length === 0 ? (
        <p>No approved appointments available.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <select
            name="appointment"
            value={form.appointment}
            onChange={handleChange}
            required
          >
            <option value="">Select Approved Appointment</option>

            {appointments.map((appointment) => (
              <option key={appointment._id} value={appointment._id}>
                {appointment.visitor?.name} -{" "}
                {new Date(appointment.appointmentDate).toLocaleString()}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            name="validFrom"
            value={form.validFrom}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="validUntil"
            value={form.validUntil}
            onChange={handleChange}
            required
          />

          <button type="submit">Generate Pass</button>
        </form>
      )}

      <hr />

      <h2>Issued Passes</h2>

      {loading ? (
        <p>Loading passes...</p>
      ) : passes.length === 0 ? (
        <p>No passes issued yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Pass Number</th>
              <th>Visitor</th>
              <th>Valid From</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th>QR Code</th>
              <th>PDF</th>
            </tr>
          </thead>

          <tbody>
            {passes.map((pass) => (
              <tr key={pass._id}>
                <td>{pass.passNumber}</td>

                <td>{pass.visitor?.name || "Unknown"}</td>

                <td>{new Date(pass.validFrom).toLocaleString()}</td>

                <td>{new Date(pass.validUntil).toLocaleString()}</td>

                <td>{pass.status}</td>

                <td>
                  {pass.qrCode && (
                    <img
                      src={pass.qrCode}
                      alt="Visitor Pass QR Code"
                      width="100"
                    />
                  )}
                </td>

                <td>
                  <button
                    onClick={() => downloadPDF(pass._id, pass.passNumber)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Passes;

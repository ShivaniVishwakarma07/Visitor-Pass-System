import { useEffect, useState } from "react";
import api from "../services/api";

const CheckLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await api.get("/checklogs");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.logs || [];

      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Visitor Check Logs</h1>

      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No check-in or check-out records found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Pass Number</th>
              <th>Action</th>
              <th>Scanned By</th>
              <th>Date & Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.visitor?.name || "Unknown"}</td>
                <td>{log.pass?.passNumber || "Unknown"}</td>
                <td>{log.action}</td>
                <td>{log.scannedBy?.name || "Unknown"}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CheckLogs;

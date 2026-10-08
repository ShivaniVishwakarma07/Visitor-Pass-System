import { useState } from "react";
import api from "../services/api";

const CheckInOut = () => {
  const [passNumber, setPassNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheckIn = async () => {
    setError("");
    setResult(null);

    try {
      const response = await api.post("/checklogs/check-in", {
        passNumber,
      });

      setResult(response.data);
      setPassNumber("");
    } catch (error) {
      setError(error.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setResult(null);

    try {
      const response = await api.post("/checklogs/check-out", {
        passNumber,
      });

      setResult(response.data);
      setPassNumber("");
    } catch (error) {
      setError(error.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <div>
      <h1>Security Check-In / Check-Out</h1>

      <input
        type="text"
        placeholder="Enter Pass Number"
        value={passNumber}
        onChange={(e) => setPassNumber(e.target.value)}
      />

      <div>
        <button onClick={handleCheckIn}>Check In</button>

        <button onClick={handleCheckOut}>Check Out</button>
      </div>

      {error && <p>{error}</p>}

      {result && (
        <div>
          <h2>{result.message}</h2>

          {result.visitor && (
            <div>
              <p>
                <strong>Visitor:</strong> {result.visitor.name}
              </p>

              <p>
                <strong>Email:</strong> {result.visitor.email}
              </p>

              <p>
                <strong>Phone:</strong> {result.visitor.phone}
              </p>

              <p>
                <strong>Company:</strong> {result.visitor.company || "-"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckInOut;

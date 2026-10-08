import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";

const CheckInOut = () => {
  const [passNumber, setPassNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const scannerRef = useRef(null);

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

  const startScanner = async () => {
    setError("");

    if (scannerRef.current) {
      return;
    }

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          setPassNumber(decodedText);
          scanner.stop().then(() => {
            scanner.clear();
            scannerRef.current = null;
          });
        },
        () => {},
      );
    } catch (error) {
      setError("Unable to start camera scanner");
      scannerRef.current = null;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (error) {
        console.error(error);
      }

      scannerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Security Check-In / Check-Out</h1>
        <p>Scan QR codes or enter pass numbers manually</p>
      </div>

      <div className="card">
        <h2>QR Scanner</h2>

        <div
          id="qr-reader"
          style={{
            width: "320px",
            marginBottom: "20px",
          }}
        ></div>

        <button className="btn btn-primary" onClick={startScanner}>
          Start Scanner
        </button>

        <button className="btn btn-danger" onClick={stopScanner}>
          Stop Scanner
        </button>
      </div>

      <div className="card">
        <h2>Manual Pass Verification</h2>

        <div className="form-group">
          <label>Pass Number</label>

          <input
            type="text"
            placeholder="Enter pass number"
            value={passNumber}
            onChange={(e) => setPassNumber(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button className="btn btn-success" onClick={handleCheckIn}>
            Check In
          </button>

          <button className="btn btn-danger" onClick={handleCheckOut}>
            Check Out
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="card">
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

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
    <div>
      <h1>Security Check-In / Check-Out</h1>

      <div id="qr-reader" style={{ width: "320px" }}></div>

      <button onClick={startScanner}>Start QR Scanner</button>

      <button onClick={stopScanner}>Stop Scanner</button>

      <hr />

      <input
        type="text"
        placeholder="Pass Number"
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

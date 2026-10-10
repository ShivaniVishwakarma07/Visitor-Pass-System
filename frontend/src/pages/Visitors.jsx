import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  purpose: "",
  idType: "Aadhaar",
  idNumber: "",
  address: "",
  photo: "",
  emergencyContact: {
    name: "",
    phone: "",
  },
};

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const fetchVisitors = async () => {
    try {
      const response = await api.get("/visitors", {
        params: { search },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.visitors || [];

      setVisitors(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load visitors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "emergencyName" || name === "emergencyPhone") {
      setForm((previous) => ({
        ...previous,
        emergencyContact: {
          ...previous.emergencyContact,
          [name === "emergencyName" ? "name" : "phone"]: value,
        },
      }));
      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Photo size must be 2 MB or less.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        photo: reader.result,
      }));
      setError("");
    };

    reader.onerror = () => {
      setError("Failed to read the selected photo.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/visitors", form);
      setForm({ ...initialForm });
      setLoading(true);
      await fetchVisitors();
      alert("Visitor registered successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add visitor.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor?")) {
      return;
    }

    try {
      await api.delete(`/visitors/${id}`);
      await fetchVisitors();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete visitor.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Visitor Management</h1>
        <p>Register and manage visitors</p>
      </div>

      <div className="card">
        <h2>Register Visitor</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Purpose</label>
            <input
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ID Type</label>
            <select
              name="idType"
              value={form.idType}
              onChange={handleChange}
              required
            >
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>ID Number</label>
            <input
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact Name</label>
            <input
              name="emergencyName"
              value={form.emergencyContact.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact Phone</label>
            <input
              name="emergencyPhone"
              value={form.emergencyContact.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full">
            <label>Visitor Photo (maximum 2 MB)</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />

            {form.photo && (
              <img
                src={form.photo}
                alt="Visitor preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}
          </div>

          <div className="form-group full">
            <button type="submit" className="btn btn-primary">
              Register Visitor
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Visitor List</h2>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label>Search Visitors</label>
          <input
            type="text"
            placeholder="Search by name, email or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading visitors...</p>
        ) : visitors.length === 0 ? (
          <p>No visitors found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {visitors.map((visitor) => (
                  <tr key={visitor._id}>
                    <td>
                      {visitor.photo ? (
                        <img
                          src={visitor.photo}
                          alt={visitor.name}
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{visitor.name}</td>
                    <td>{visitor.email}</td>
                    <td>{visitor.phone}</td>
                    <td>{visitor.company || "-"}</td>
                    <td>{visitor.purpose}</td>
                    <td>{visitor.status}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(visitor._id)}
                      >
                        Delete
                      </button>
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

export default Visitors;

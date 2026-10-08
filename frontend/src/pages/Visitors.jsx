import { useEffect, useState } from "react";
import api from "../services/api";

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    purpose: "",
    idType: "Aadhaar",
    idNumber: "",
    address: "",
  });

  const fetchVisitors = async () => {
    try {
      const response = await api.get("/visitors", {
        params: {
          search,
        },
      });

      const visitorData = Array.isArray(response.data)
        ? response.data
        : response.data.visitors || [];

      setVisitors(visitorData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/visitors", form);

      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        purpose: "",
        idType: "Aadhaar",
        idNumber: "",
        address: "",
      });

      fetchVisitors();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add visitor");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor?")) {
      return;
    }

    try {
      await api.delete(`/visitors/${id}`);
      fetchVisitors();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete visitor");
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
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Purpose</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>ID Type</label>
            <select
              value={formData.idType}
              onChange={(e) =>
                setFormData({ ...formData, idType: e.target.value })
              }
              required
            >
              <option value="">Select ID Type</option>
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
              type="text"
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact Name</label>
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContact: {
                    ...formData.emergencyContact,
                    name: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact Phone</label>
            <input
              type="text"
              value={formData.emergencyContact.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContact: {
                    ...formData.emergencyContact,
                    phone: e.target.value,
                  },
                })
              }
            />
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

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
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
      </div>
    </div>
  );
};

export default Visitors;

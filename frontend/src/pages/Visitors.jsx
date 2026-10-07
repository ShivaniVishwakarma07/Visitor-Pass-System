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

      setVisitors(response.data);
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
    <div>
      <h1>Visitor Management</h1>

      <h2>Register Visitor</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />

        <input
          name="purpose"
          placeholder="Purpose of Visit"
          value={form.purpose}
          onChange={handleChange}
          required
        />

        <select name="idType" value={form.idType} onChange={handleChange}>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Passport">Passport</option>
          <option value="Driving License">Driving License</option>
          <option value="Voter ID">Voter ID</option>
          <option value="Other">Other</option>
        </select>

        <input
          name="idNumber"
          placeholder="ID Number"
          value={form.idNumber}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <button type="submit">Register Visitor</button>
      </form>

      <hr />

      <h2>Visitors</h2>

      <input
        type="text"
        placeholder="Search by name, email, phone or company"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading visitors...</p>
      ) : visitors.length === 0 ? (
        <p>No visitors found.</p>
      ) : (
        <table border="1" cellPadding="8">
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
                  <button onClick={() => handleDelete(visitor._id)}>
                    Delete
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

export default Visitors;

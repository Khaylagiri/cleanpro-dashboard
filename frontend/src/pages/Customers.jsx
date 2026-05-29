import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../api/axiosInstance";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const getCustomers = async () => {
    try {
      const res = await axiosInstance.get("/customers");
      setCustomers(res.data);
    } catch (error) {
      alert("Gagal mengambil data customer");
    }
  };

  const addCustomer = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/customers", form);
      setForm({ name: "", phone: "", email: "", address: "" });
      getCustomers();
    } catch (error) {
      alert("Gagal menambah customer");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axiosInstance.delete(`/customers/${id}`);
      getCustomers();
    } catch (error) {
      alert("Gagal hapus customer");
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="content">
        <h1>Customers</h1>

        <form className="form-card" onSubmit={addCustomer}>
          <input
            placeholder="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="No HP"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Alamat"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button type="submit">Tambah Customer</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>No HP</th>
              <th>Email</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>
                  <button onClick={() => deleteCustomer(customer.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Customers;
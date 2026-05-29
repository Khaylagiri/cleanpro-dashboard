import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../api/axiosInstance";

function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    service_name: "",
    price: "",
    description: "",
  });

  const getServices = async () => {
    try {
      const res = await axiosInstance.get("/services");
      setServices(res.data);
    } catch (error) {
      alert("Gagal mengambil data services");
    }
  };

  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(search.toLowerCase())
  );

  const saveService = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axiosInstance.patch(`/services/${editId}`, form);
        setEditId(null);
      } else {
        await axiosInstance.post("/services", form);
      }

      setForm({ service_name: "", price: "", description: "" });
      getServices();
    } catch (error) {
      alert("Gagal menyimpan service");
    }
  };

  const handleEdit = (service) => {
    setEditId(service.id);
    setForm({
      service_name: service.service_name,
      price: service.price,
      description: service.description,
    });
  };

  const deleteService = async (id) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      getServices();
    } catch (error) {
      alert("Gagal hapus service");
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="content">
        <h1>Services</h1>

        <input
          placeholder="Search service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "15px", width: "300px" }}
        />

        <form className="form-card" onSubmit={saveService}>
          <input
            placeholder="Nama layanan"
            value={form.service_name}
            onChange={(e) =>
              setForm({ ...form, service_name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Harga"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            placeholder="Deskripsi"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button type="submit">
            {editId ? "Update Service" : "Tambah Service"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ service_name: "", price: "", description: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <table>
          <thead>
            <tr>
              <th>Nama Layanan</th>
              <th>Harga</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>{service.service_name}</td>
                <td>Rp{service.price}</td>
                <td>{service.description}</td>
                <td>
                  <button onClick={() => handleEdit(service)}>Edit</button>
                  <button onClick={() => deleteService(service.id)}>
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

export default Services;
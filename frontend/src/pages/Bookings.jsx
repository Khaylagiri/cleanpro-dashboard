import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../api/axiosInstance";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [form, setForm] = useState({
    customer_id: "",
    service_id: "",
    booking_date: "",
    booking_time: "",
    notes: "",
  });

  const getBookings = async () => {
    const res = await axiosInstance.get("/bookings");
    setBookings(res.data);
  };

  const getCustomers = async () => {
    const res = await axiosInstance.get("/customers");
    setCustomers(res.data);
  };

  const getServices = async () => {
    const res = await axiosInstance.get("/services");
    setServices(res.data);
  };

  const addBooking = async (e) => {
    e.preventDefault();

    await axiosInstance.post("/bookings", form);

    setForm({
      customer_id: "",
      service_id: "",
      booking_date: "",
      booking_time: "",
      notes: "",
    });

    getBookings();
  };

  const updateStatus = async (id, status) => {
    await axiosInstance.patch(`/bookings/${id}`, {
      status,
      notes: "Status updated from dashboard",
    });

    getBookings();
  };

  const createPayment = async (bookingId) => {
    const res = await axiosInstance.post("/payments/create", {
      booking_id: bookingId,
    });

    window.open(res.data.payment_url, "_blank");
  };

  const followUpWhatsapp = (booking) => {
  const phone = "6287887397196";

  const message = `Halo Kak ${booking.customer_name}, kami dari CleanPro ingin follow up jadwal layanan ${booking.service_name} pada ${booking.booking_date} jam ${booking.booking_time}.`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank");
};

  useEffect(() => {
    getBookings();
    getCustomers();
    getServices();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchSearch = booking.customer_name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus = statusFilter ? booking.status === statusFilter : true;

    return matchSearch && matchStatus;
  });

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="content">
        <h1>Bookings</h1>

        <div className="filter-row">
          <input
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="on_progress">On Progress</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <form className="form-card" onSubmit={addBooking}>
          <select
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          >
            <option value="">Pilih Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={form.service_id}
            onChange={(e) => setForm({ ...form, service_id: e.target.value })}
          >
            <option value="">Pilih Service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.service_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.booking_date}
            onChange={(e) =>
              setForm({ ...form, booking_date: e.target.value })
            }
          />

          <input
            type="time"
            value={form.booking_time}
            onChange={(e) =>
              setForm({ ...form, booking_time: e.target.value })
            }
          />

          <input
            placeholder="Catatan"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button type="submit">Tambah Booking</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Harga</th>
              <th>Tanggal</th>
              <th>Jam</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.customer_name}</td>
                <td>{booking.service_name}</td>
                <td>Rp{booking.price}</td>
                <td>{booking.booking_date}</td>
                <td>{booking.booking_time}</td>
                <td>
                <span className={`badge ${booking.status}`}>
                    {booking.status}
                </span>
                </td>
                <td>
                  <button onClick={() => updateStatus(booking.id, "scheduled")}>
                    Scheduled
                  </button>

                  <button onClick={() => updateStatus(booking.id, "done")}>
                    Done
                  </button>

                  <button onClick={() => createPayment(booking.id)}>
                    Payment
                  </button>

                  <button onClick={() => followUpWhatsapp(booking)}>
                    WhatsApp
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

export default Bookings;
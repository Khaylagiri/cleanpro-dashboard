import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../api/axiosInstance";

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalServices: 0,
    totalBookings: 0,
    paidPayments: 0,
  });

  const getDashboardStats = async () => {
    try {
      const res = await axiosInstance.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      alert("Gagal mengambil data dashboard");
    }
  };

  useEffect(() => {
    getDashboardStats();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="content">
        <h1>Dashboard</h1>

        <div className="cards">
          <div className="card">
            <h3>Total Customers</h3>
            <p>{stats.totalCustomers}</p>
          </div>

          <div className="card">
            <h3>Total Services</h3>
            <p>{stats.totalServices}</p>
          </div>

          <div className="card">
            <h3>Total Bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>

          <div className="card">
            <h3>Paid Payments</h3>
            <p>{stats.paidPayments}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
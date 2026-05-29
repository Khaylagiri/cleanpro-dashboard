import Sidebar from "../components/Sidebar";
import axiosInstance from "../api/axiosInstance";

function Reports() {
  const exportReport = async () => {
    try {
      const res = await axiosInstance.get("/reports/bookings/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "booking-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Gagal export report");
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="content">
        <h1>Reports</h1>

        <p>Export laporan booking customer dalam format CSV.</p>

        <button onClick={exportReport}>Export Booking Report</button>
      </main>
    </div>
  );
}

export default Reports;
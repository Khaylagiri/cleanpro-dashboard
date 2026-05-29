import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../api/axiosInstance";

function Payments() {
  const [payments, setPayments] = useState([]);

  const getPayments = async () => {
    try {
      const res = await axiosInstance.get("/payments");
      setPayments(res.data);
    } catch (error) {
      alert("Gagal mengambil data payments");
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="content">
        <h1>Payments</h1>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Link</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.order_id}</td>
                <td>{payment.customer_name}</td>
                <td>{payment.service_name}</td>
                <td>Rp{payment.amount}</td>
                <td>
                <span className={`badge ${payment.payment_status}`}>
                    {payment.payment_status}
                </span>
                </td>
                <td>
                  <a
                    href={payment.payment_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Payments;
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2>CleanPro</h2>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/customers">Customers</Link>
      <Link to="/services">Services</Link>
      <Link to="/bookings">Bookings</Link>
      <Link to="/payments">Payments</Link>
      <Link to="/reports">Reports</Link>
      <button onClick={logout}>Logout</button>
    </aside>
  );
}

export default Sidebar;
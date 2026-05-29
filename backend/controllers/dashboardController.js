const db = require("../db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [[customers]] = await db.query(
      "SELECT COUNT(*) AS totalCustomers FROM customers"
    );

    const [[services]] = await db.query(
      "SELECT COUNT(*) AS totalServices FROM services"
    );

    const [[bookings]] = await db.query(
      "SELECT COUNT(*) AS totalBookings FROM bookings"
    );

    const [[paidPayments]] = await db.query(
      "SELECT COUNT(*) AS paidPayments FROM payments WHERE payment_status = 'paid'"
    );

    res.json({
      totalCustomers: customers.totalCustomers,
      totalServices: services.totalServices,
      totalBookings: bookings.totalBookings,
      paidPayments: paidPayments.paidPayments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data dashboard",
      error: error.message,
    });
  }
};
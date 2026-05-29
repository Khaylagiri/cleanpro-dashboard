const db = require("../db");

exports.exportBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        bookings.id,
        customers.name AS customer_name,
        customers.phone,
        services.service_name,
        services.price,
        bookings.booking_date,
        bookings.booking_time,
        bookings.status,
        bookings.notes
      FROM bookings
      JOIN customers ON bookings.customer_id = customers.id
      JOIN services ON bookings.service_id = services.id
      ORDER BY bookings.id DESC
    `);

    let csv = "ID,Customer,Phone,Service,Price,Date,Time,Status,Notes\n";

    bookings.forEach((item) => {
      csv += `${item.id},${item.customer_name},${item.phone},${item.service_name},${item.price},${item.booking_date},${item.booking_time},${item.status},${item.notes}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("booking-report.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Gagal export report", error });
  }
};
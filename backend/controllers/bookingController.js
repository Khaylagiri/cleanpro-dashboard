const db = require("../db");

exports.getBookings = async (req, res) => {
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
        bookings.notes,
        bookings.created_at
      FROM bookings
      JOIN customers ON bookings.customer_id = customers.id
      JOIN services ON bookings.service_id = services.id
      ORDER BY bookings.id DESC
    `);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil bookings",
      error: error.message,
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { customer_id, service_id, booking_date, booking_time, notes } =
      req.body;

    await db.query(
      `INSERT INTO bookings 
      (customer_id, service_id, booking_date, booking_time, notes) 
      VALUES (?, ?, ?, ?, ?)`,
      [customer_id, service_id, booking_date, booking_time, notes]
    );

    res.status(201).json({ message: "Booking berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambah booking",
      error: error.message,
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    await db.query(
      "UPDATE bookings SET status = ?, notes = ? WHERE id = ?",
      [status, notes, id]
    );

    res.json({ message: "Booking berhasil diupdate" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update booking",
      error: error.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM bookings WHERE id = ?", [id]);

    res.json({ message: "Booking berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal hapus booking",
      error: error.message,
    });
  }
};
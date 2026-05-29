const db = require("../db");
const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.getAllPayments = async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT 
        payments.id,
        payments.order_id,
        payments.amount,
        payments.payment_status,
        payments.payment_url,
        payments.created_at,
        customers.name AS customer_name,
        services.service_name
      FROM payments
      JOIN bookings ON payments.booking_id = bookings.id
      JOIN customers ON bookings.customer_id = customers.id
      JOIN services ON bookings.service_id = services.id
      ORDER BY payments.id DESC
    `);

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil payments",
      error: error.message,
    });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const [booking] = await db.query(
      `SELECT 
        bookings.id,
        customers.name AS customer_name,
        customers.email,
        customers.phone,
        services.service_name,
        services.price
      FROM bookings
      JOIN customers ON bookings.customer_id = customers.id
      JOIN services ON bookings.service_id = services.id
      WHERE bookings.id = ?`,
      [booking_id]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    const data = booking[0];
    const orderId = `CLEANPRO-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: data.price,
      },
      customer_details: {
        first_name: data.customer_name,
        email: data.email,
        phone: data.phone,
      },
      item_details: [
        {
          id: String(data.id),
          price: data.price,
          quantity: 1,
          name: data.service_name,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    await db.query(
      `INSERT INTO payments 
      (booking_id, order_id, amount, payment_status, payment_url) 
      VALUES (?, ?, ?, ?, ?)`,
      [booking_id, orderId, data.price, "pending", transaction.redirect_url]
    );

    res.status(201).json({
      message: "Payment berhasil dibuat",
      order_id: orderId,
      payment_url: transaction.redirect_url,
      token: transaction.token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat payment",
      error: error.message,
    });
  }
};

exports.getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [payment] = await db.query(
      "SELECT * FROM payments WHERE order_id = ?",
      [orderId]
    );

    if (payment.length === 0) {
      return res.status(404).json({ message: "Payment tidak ditemukan" });
    }

    res.json(payment[0]);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil payment",
      error: error.message,
    });
  }
};

exports.midtransNotification = async (req, res) => {
  try {
    const notification = req.body;

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let paymentStatus = "pending";

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      if (fraudStatus === "accept" || !fraudStatus) {
        paymentStatus = "paid";
      }
    } else if (transactionStatus === "expire") {
      paymentStatus = "expired";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny"
    ) {
      paymentStatus = "failed";
    }

    await db.query(
      "UPDATE payments SET payment_status = ? WHERE order_id = ?",
      [paymentStatus, orderId]
    );

    res.json({ message: "Notification berhasil diproses" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memproses notification",
      error: error.message,
    });
  }
};
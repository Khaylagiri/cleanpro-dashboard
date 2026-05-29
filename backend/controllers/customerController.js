const db = require("../db");

exports.getCustomers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [customers] = await db.query(
      `SELECT * FROM customers 
       WHERE name LIKE ? 
       LIMIT ? OFFSET ?`,
      [`%${search}%`, limit, offset]
    );

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil customer", error });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    await db.query(
      "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)",
      [name, phone, email, address]
    );

    res.status(201).json({ message: "Customer berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah customer", error });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;

    await db.query(
      "UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?",
      [name, phone, email, address, id]
    );

    res.json({ message: "Customer berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal update customer", error });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM customers WHERE id = ?", [id]);

    res.json({ message: "Customer berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus customer", error });
  }
};
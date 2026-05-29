const db = require("../db");

exports.getServices = async (req, res) => {
  try {
    const [services] = await db.query("SELECT * FROM services");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil services", error });
  }
};

exports.createService = async (req, res) => {
  try {
    const { service_name, price, description } = req.body;

    await db.query(
      "INSERT INTO services (service_name, price, description) VALUES (?, ?, ?)",
      [service_name, price, description]
    );

    res.status(201).json({ message: "Service berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah service", error });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, price, description } = req.body;

    await db.query(
      "UPDATE services SET service_name = ?, price = ?, description = ? WHERE id = ?",
      [service_name, price, description, id]
    );

    res.json({ message: "Service berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal update service", error });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM services WHERE id = ?", [id]);

    res.json({ message: "Service berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus service", error });
  }
};
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Admin berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ message: "Gagal register admin", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admin] = await db.query("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);

    if (admin.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, admin[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: admin[0].id, email: admin[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      admin: {
        id: admin[0].id,
        name: admin[0].name,
        email: admin[0].email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal login", error });
  }
};
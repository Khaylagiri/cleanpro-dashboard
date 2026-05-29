const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { exportBookings } = require("../controllers/reportController");

router.get("/bookings/export", authMiddleware, exportBookings);

module.exports = router;
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

router.get("/", authMiddleware, getBookings);
router.post("/", authMiddleware, createBooking);
router.patch("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);

module.exports = router;
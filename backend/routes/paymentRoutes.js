const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllPayments,
  createPayment,
  getPaymentByOrderId,
  midtransNotification,
} = require("../controllers/paymentController");

router.post("/create", authMiddleware, createPayment);
router.get("/", authMiddleware, getAllPayments);
router.get("/:orderId", authMiddleware, getPaymentByOrderId);
router.post("/notification", midtransNotification);

module.exports = router;
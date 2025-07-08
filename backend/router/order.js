const express = require("express");
const router = express.Router();
const db = require("../db/db.config");

router.post("/user/order", async (req, res) => {
  try {
    const {
      cartItem,
      phone,
      delivery_method,
      total_amount,
      subtotal,
      shipping,
      tax,
      card,
      expiry,
      cvv,
      userId,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const newAddress = await db.Address.create({
      cartItem,
      phone,
      delivery_method,
      total_amount,
      subtotal,
      shipping,
      tax,
      card,
      expiry,
      cvv,
    });

    res.status(200).json(newAddress);
  } catch (error) {
    console.error("Error during address store:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

module.exports = router;

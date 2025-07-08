const express = require("express");
const router = express.Router();
const db = require("../db/db.config");

router.get("/addressGetAll", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const address = await db.Address.findAll({
      where: { userId: userId },
      include: {
        model: db.User,
        foreignKey: "userId",
        as: "user",
      },
    });

    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/user/addressStore", async (req, res) => {
  try {
    const { userId, address, city, state, zip, isDefault } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const newAddress = await db.Address.create({
      userId,
      address,
      city,
      state,
      zip,
      isDefault,
    });

    res.status(200).json(newAddress);
  } catch (error) {
    console.error("Error during address store:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

module.exports = router;

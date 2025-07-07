const express = require("express");
const router = express.Router();
const db = require("../db/db.config");

router.post("/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(301)
        .json({ error: "User with this email already exists" });
    }
    const user = await db.User.create({ name, email, password });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
});

router.post("/user/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      if (existingUser.password === password) {
        res.status(200).json({ user: existingUser });
      } else {
        return res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

module.exports = router;

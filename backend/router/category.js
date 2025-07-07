const express = require("express");
const router = express.Router();
const db = require("../db/db.config");

router.get("/collections", async (req, res) => {
  const categories = await db.Category.findAll({
    include: { model: db.Product, as: "products" },
  });
  res.json(categories);
});

router.get(`/collections/title`, async (req, res) => {
  const title = req.query.name;
  const collection = await db.Category.findOne({
    where: { title: title },
    include: { model: db.Product, as: "products" },
  });
  if (collection) {
    res.json(collection);
  } else {
    res.status(404).json({ message: "Collection not found" });
  }
});

module.exports = router;

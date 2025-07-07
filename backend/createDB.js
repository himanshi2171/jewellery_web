const db = require("./db/db.config");
const data = require("../src/data/user.json");
const d = require("../src/data/products.json");

(async () => {
  try {
    await db.sequelize.sync({ force: true });
    for (const user of data) {
      const newUser = await db.User.create({
        name: user.name,
        email: user.email,
        password: user.password,
        address: user.address,
      });

      await db.Address.create({
        address: newUser.address,
        userId: newUser.id,
        city:newUser.city,
        state:newUser.state,
        zip:newUser.zip,
      });
    }
    for (const category of d) {
      const newCategory = await db.Category.create({
        name: category.name,
        product: category.product,
        title: category.title,
        image: category.image,
        offer: category.offer,
        description: category.description,
      });

      for (const product of category.data) {
        await db.Product.create({
          ...product,
          quantity: product.quantity,
          categoryId: newCategory.id,
        });
      }
    }
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await db.sequelize.close();
  }
})();

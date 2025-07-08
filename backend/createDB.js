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
        city: newUser.city,
        state: newUser.state,
        zip: newUser.zip,
        default: newUser.default,
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
          size: product.size,
          categoryId: newCategory.id,
        });
      }
    }
    for (const order of d) {
      await db.Order.create({
        cartItem: order.cartItem,
        phone: order.phone,
        delivery_method: order.delivery_method,
        total_amount: order.total_amount,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        card: order.card,
        expiry: order.expiry,
        cvv: order.cvv,
      });
    }
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await db.sequelize.close();
  }
})();

// Models
const { User } = require("./user.model");
const { Order } = require("./order.model");
const { Product } = require("./product.model");
const { Cart } = require("./cart.model");
const { Category } = require("./category.model");
const { ProductsInCart } = require("./productsInCart.model");
const { ProductImgs } = require("./productImgs.model");

const initModels = () => {
  //1 User<--->M Orders
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User);
  //1 User<---> M Products
  User.hasMany(Product, { foreignKey: "userId" });
  Product.belongsTo(User);
  //1 User <---> 1 Cart
  User.hasOne(Cart, { foreignKey: "userId" });
  Cart.belongsTo(User);
  //1 Product <---> 1 Category
  Category.hasOne(Product, { foreignKey: "categoryId" });
  Product.belongsTo(Category);
  //1 Product <---> M productImgs
  Product.hasMany(ProductImgs, { foreignKey: "productId" });
  ProductImgs.belongsTo(Product);
  //1 Cart <---> M ProductsInCar
  Cart.hasMany(ProductsInCart, { foreignKey: "cartId" });
  ProductsInCart.belongsTo(Cart);
  //1 Order <---> 1 Cart
  Cart.hasOne(Order, { foreignKey: "cartId" });
  Order.belongsTo(Cart);
  //1 ProductsInCar <---> 1 Product
  Product.hasOne(ProductsInCart, { foreignKey: "productId" });
  ProductsInCart.belongsTo(Product);
};

module.exports = { initModels };

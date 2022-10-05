const express = require("express");

//Controllers...
const {
  addProduct,
  updateCart,
  removeProductFromCart,
  makePurchase,
} = require("../controllers/cart.controller");

//Middlewares...
const { protectSession } = require("../middlewares/auth.middlewares");
const { cartActiveExist } = require("../middlewares/carts.middlewares");
const {
  productsInCartExist,
} = require("../middlewares/productsInCart.middleware.js");

//ESTABLISHING ROUTES...
const cartsRouter = express.Router();

//Protecting session...
cartsRouter.use(protectSession);

cartsRouter.post("/add-product", cartActiveExist, addProduct);
cartsRouter.patch("/update-cart", updateCart);
cartsRouter.delete("/:productId", productsInCartExist, removeProductFromCart);
cartsRouter.post("/purchase", makePurchase);

module.exports = { cartsRouter };

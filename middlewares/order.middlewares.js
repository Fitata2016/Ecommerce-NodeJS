//Models...
const { Order } = require("../models/order.model");
const { Cart } = require("../models/cart.model");
const { Product } = require("../models/product.model");
const { ProductsInCart } = require("../models/productsInCart.model");

//Handling Error...
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const orderExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { id },
    include: {
      model: Cart,
      include: {
        model: ProductsInCart,
        required: false, //Using OUTERJOIN...
        where: { status: "purchased" },
        include: { model: Product },
      },
    },
  });
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  req.order = order;
  next();
});

module.exports = { orderExist };

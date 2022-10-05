//Models...

const { Cart } = require("../models/cart.model");
const { ProductsInCart } = require("../models/productsInCart.model");
const { Product } = require("../models/product.model");
const { Order } = require("../models/order.model");

// Utils...
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const addProduct = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("Sorry...product not found", 404));
  }
  if (
    product.quantity >= quantity &&
    product.quantity !== 0 &&
    quantity !== 0
  ) {
    const productInCart = await ProductsInCart.findOne({
      where: { cartId: cart.id, productId: productId, status: "active" },
    });
    if (!productInCart) {
      const addedProduct = await ProductsInCart.create({
        cartId: cart.id,
        productId,
        quantity,
      });
      res.status(200).json({
        status: "success",
        data: { addedProduct },
      });
    } else {
      if (productInCart.status === "removed") {
        const addedProduct = await productInCart.update({
          status: "active",
          quantity,
        });
        res.status(200).json({
          status: "success",
          data: { addedProduct },
        });
      }
      return next(new AppError("This product was already added", 404));
    }
  } else if (product.quantity === 0) {
    return next(new AppError("Sorry...this product is sold out", 404));
  } else {
    return next(new AppError("The quantity entered is not available", 404));
  }
});

const getProductsInCart = catchAsync(async (req, res, next) => {
  const productsInCarts = await ProductsInCart.findAll();
  res.status(200).json({
    status: "success",
    data: { productsInCarts },
  });
});

const updateCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    return next(new AppError("Sorry...add products to cart", 404));
  }

  const product = await Product.findOne({ where: { id: productId } });

  const productInCart = await ProductsInCart.findOne({
    where: { productId: product.id, cartId: cart.id },
  });
  if (!productInCart) {
    return next(new AppError("Product not found", 404));
  } else {
    if (product.quantity >= quantity && quantity !== 0) {
      const productUpdated = await productInCart.update({
        quantity,
        status: "active",
      });
      res.status(200).json({
        status: "success",
        data: { productUpdated },
      });
    } else if (quantity === 0) {
      const productUpdated = await productInCart.update({
        quantity,
        status: "removed",
      });
      res.status(200).json({
        status: "success",
        data: { productUpdated },
      });
    } else {
      return next(new AppError("The quantity entered is not available", 404));
    }
  }
});

const removeProductFromCart = catchAsync(async (req, res, next) => {
  const { productInCart } = req;
  await productInCart.update({
    quantity: 0,
    status: "removed",
  });
  res.status(200).json({
    status: "success",
  });
});

const makePurchase = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
  });
  if (!cart) {
    return next(new AppError("Sorry... add products to cart", 404));
  }

  const productsInCart = await ProductsInCart.findAll({
    where: { cartId: cart.id, status: "active" },
  });

  const purchase = await Promise.all(
    productsInCart.map(async (productInCart) => {
      const product = await Product.findOne({
        where: { id: productInCart.productId },
      });
      const updatedProduct = await product.update({
        quantity: product.quantity - productInCart.quantity,
      });
      const productsPurchased = await productInCart.update({
        status: "purchased",
      });
      const arrayPrices = productInCart.quantity * product.price;

      return arrayPrices;
    })
  );
  let sum = 0;
  for (let i = 0; i < purchase.length; i++) {
    sum += purchase[i];
  }
  const total = sum;
  if (total === 0) {
    return next(new AppError("Sorry... add products to cart", 404));
  } else {
    await cart.update({ status: "purshased" });

    createdOrder = await Order.create({
      userId: sessionUser.id,
      cartId: cart.id,
      totalPrice: total,
    });

    res.status(201).json({
      status: "success",
      data: { createdOrder },
    });
  }
});

module.exports = {
  addProduct,
  updateCart,
  removeProductFromCart,
  makePurchase,
  getProductsInCart,
};

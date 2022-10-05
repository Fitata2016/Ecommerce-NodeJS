//Models...
const { Product } = require("../models/product.model");
const { Category } = require("../models/category.model");
const { ProductImgs } = require("../models/productImgs.model");

//Utils...
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { storage } = require("../utils/firebase.util");
const { uploadProductImgs } = require("../utils/firebase.util");

const createProduct = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { title, description, price, categoryId, quantity } = req.body;
  const newProduct = await Product.create({
    title,
    description,
    price,
    categoryId,
    userId: sessionUser.id,
    quantity,
  });
  await uploadProductImgs(req.files, newProduct.id);

  res.status(201).json({ newProduct });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({ where: { status: "active" } });
  res.status(200).json({
    status: "success",
    data: { products },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, price, quantity } = req.body;
  await product.update({
    title,
    description,
    price,
    quantity,
  });
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  await product.update({ status: "deleted" });
  res.status(204).json({
    status: "success",
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ where: { status: "active" } });
  res.status(200).json({
    status: "success",
    data: { categories },
  });
});

const addCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await Category.create({
    name,
  });
  res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;
  await category.update({ name });
  res.status(200).json({
    status: "success",
    data: { category },
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  addCategory,
  updateCategory,
};

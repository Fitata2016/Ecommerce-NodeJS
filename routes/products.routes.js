const express = require("express");

//Controllers...
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  addCategory,
  updateCategory,
} = require("../controllers/products.controller");

//Middlewares...
const { productExist } = require("../middlewares/products.middlewares");
const { categoryExist } = require("../middlewares/categories.middleware");
const {
  createProductsValidators,
} = require("../middlewares/validators.middlewares");
const {
  protectSession,
  protectProductOwner,
} = require("../middlewares/auth.middlewares");
const { validationResult } = require("express-validator");

//Utils...
const { upload } = require("../utils/multer.util");

//ESTABLISHING ROUTES...
const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories", getAllCategories);
productsRouter.get("/:id", productExist, getProductById);

// Protecting session...
productsRouter.use(protectSession);

productsRouter.post(
  "/",
  upload.array("productImgs", 5),
  createProductsValidators,
  createProduct
); //Using validations...
productsRouter.patch("/:id", productExist, protectProductOwner, updateProduct); //Protecting owners...
productsRouter.delete("/:id", productExist, protectProductOwner, deleteProduct); //Protecting owners...
productsRouter.post("/categories", addCategory);
productsRouter.patch("/categories/:id", categoryExist, updateCategory);

module.exports = { productsRouter };

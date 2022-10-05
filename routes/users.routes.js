const express = require("express");

// Controllers
const {
  getAllProductsUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  getAllOrders,
  getOrderById,
} = require("../controllers/users.controller");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares");
const { orderExist } = require("../middlewares/order.middlewares");
const {
  protectSession,
  protectUsersAccount,
  protectAdmin,
  protectOrderOwner,
} = require("../middlewares/auth.middlewares");

//Validators...
const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");
const { validationResult } = require("express-validator");

//ESTABLISHING ROUTES...

const usersRouter = express.Router();

usersRouter.post("/login", login); //Inicializing sessions...
usersRouter.post("/", createUserValidators, createUser); //Using validations...

// Protecting session...
usersRouter.use(protectSession);

usersRouter.get("/me", getAllProductsUser);
usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser); //Protecting accounts...
usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser); //Protecting accounts...
usersRouter.get("/orders", getAllOrders);
usersRouter.get("/orders/:id", orderExist, protectOrderOwner, getOrderById); //Protecting owners...

module.exports = { usersRouter };

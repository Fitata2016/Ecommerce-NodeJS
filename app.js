const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// Routers
const { usersRouter } = require("./routes/users.routes");
const { productsRouter } = require("./routes/products.routes");
const { cartsRouter } = require("./routes/cart.routes");

// Controllers
const { globalErrorHandler } = require("./controllers/error.controller");
const { AppError } = require("./utils/appError.util");

// Init our Express app
const app = express();

//USING DEPLOY DEPENDENCIES...

//Addin security headers...
app.use(helmet());
//Compressing responses...
app.use(compression());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combined"));

// Enable Express app to receive JSON data
app.use(express.json());

// Define endpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/carts", cartsRouter);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };

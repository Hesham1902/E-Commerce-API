const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");

const dbConnection = require("./configs/dbConnection");

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const { webhookCheckout } = require("./services/orderService");
//Routes
const mountRoutes = require("./routes");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(compression());

app.get(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

dbConnection();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
mountRoutes(app);

//handle unhandled routes and send error to the error handling middleware
app.all("*", (req, res, next) => {
  next(new ApiError(`Could not find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

//handler rejection outside express
process.on("unhandledRejection", (err) => {
  //you write to stderr
  console.error(`UnhandledRejection: Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});

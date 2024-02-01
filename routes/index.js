const categoryRoute = require("./categoryRoutes");
const subCategoryRoute = require("./subCategoryRoutes");
const brandRoute = require("./brandRoutes");
const productRoute = require("./productRoutes");
const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");
const reviewRoute = require("./reviewRoutes");
const wishlistRoute = require("./wishlistRoutes");
const addressesRoute = require("./addressesRoutes");
const couponRoute = require("./couponRoutes");
const cartRoute = require("./cartRoutes");
const orderRoute = require("./orderRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/review", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressesRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/carts", cartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoutes;

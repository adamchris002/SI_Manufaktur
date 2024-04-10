const routes = require("express").Router();

const orderRoutes = require("./orders");
const userRoutes = require("./users");

routes.use("/users", userRoutes);
routes.use("/order", orderRoutes)

module.exports = routes;

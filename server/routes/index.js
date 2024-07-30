const routes = require("express").Router();

const orderRoutes = require("./orders");
const userRoutes = require("./users");
const productionPlanningRoutes = require("./productionPlanning");
const inventoryRoutes = require("./inventory")
const productionRoutes = require("./production")

routes.use("/users", userRoutes);
routes.use("/order", orderRoutes);
routes.use("/productionPlanning", productionPlanningRoutes);
routes.use("/inventory", inventoryRoutes);
routes.use("/production", productionRoutes);

module.exports = routes;


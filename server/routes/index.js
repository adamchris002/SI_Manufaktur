const routes = require("express").Router();

const orderRoutes = require("./orders");
const userRoutes = require("./users");
const productionPlanningRoutes = require("./productionPlanning");

routes.use("/users", userRoutes);
routes.use("/order", orderRoutes);
routes.use("/productionPlanning", productionPlanningRoutes);

module.exports = routes;

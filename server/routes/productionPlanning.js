const productionPlanningRoutes = require("express").Router();
const { ProductionPlanningController } = require("../controllers");

productionPlanningRoutes.get(
  "/getUnreviewedOrders",
  ProductionPlanningController.getUnreviewedOrders
);

module.exports = productionPlanningRoutes;

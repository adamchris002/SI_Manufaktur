const productionPlanningRoutes = require("express").Router();
const { ProductionPlanningController } = require("../controllers");

productionPlanningRoutes.get(
  "/getUnreviewedOrders",
  ProductionPlanningController.getUnreviewedOrders
);
productionPlanningRoutes.get(
  "/getEstimatedOrders",
  ProductionPlanningController.getEstimatedOrders
);
productionPlanningRoutes.get("/getAllOrders", ProductionPlanningController.getAllOrders)
productionPlanningRoutes.get("/getOneOrder", ProductionPlanningController.getOneOrder)

module.exports = productionPlanningRoutes;

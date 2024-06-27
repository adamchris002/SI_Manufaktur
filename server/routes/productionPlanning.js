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

productionPlanningRoutes.get(
  "/getOneOrder",
  ProductionPlanningController.getOneOrder
);
productionPlanningRoutes.post(
  "/addProductionPlanning/:id",
  ProductionPlanningController.addNewProductionPlanning
);
productionPlanningRoutes.get(
  "/productionPlanningActivityLogs",
  ProductionPlanningController.productionPlanningActivityLog
);
productionPlanningRoutes.get(
  "/getAllProductionPlanning",
  ProductionPlanningController.getAllProductionPlan
);
productionPlanningRoutes.delete(
  "/deleteProductionPlan/:id",
  ProductionPlanningController.deleteProductionPlan
);
productionPlanningRoutes.get(
  "/getProductionPlanningWithData/:id",
  ProductionPlanningController.getProductionPlanWithData
);

module.exports = productionPlanningRoutes;

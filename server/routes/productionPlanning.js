const productionPlanningRoutes = require("express").Router();
const { ProductionPlanningController } = require("../controllers");
const {
  deleleteGroupBahanBaku,
} = require("../controllers/ProductionPlanningController");

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
productionPlanningRoutes.put(
  "/updateProductionPlan/:id",
  ProductionPlanningController.updateProductionPlan
);

productionPlanningRoutes.delete(
  "/deleteBahanBakuId/:id",
  ProductionPlanningController.deleteBahanBakuID
);
productionPlanningRoutes.delete(
  "/deleteGroupBahanBaku",
  ProductionPlanningController.deleteGroupBahanBaku
);
productionPlanningRoutes.delete(
  "/deleteJenisBahanBaku/:id",
  ProductionPlanningController.deleteJenisBahanBaku
);

productionPlanningRoutes.delete(
  "/removeJadwal/:id",
  ProductionPlanningController.removeJadwal
);
productionPlanningRoutes.delete(
  "/deleteJadwal/:id",
  ProductionPlanningController.deleteJadwal
);
module.exports = productionPlanningRoutes;

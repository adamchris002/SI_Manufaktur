const productionPlanningRoutes = require("express").Router();
const { ProductionPlanningController } = require("../controllers");

//Get
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
productionPlanningRoutes.get(
  "/productionPlanningActivityLogs",
  ProductionPlanningController.productionPlanningActivityLog
);
productionPlanningRoutes.get(
  "/getAllProductionPlanning",
  ProductionPlanningController.getAllProductionPlan
);
productionPlanningRoutes.get(
  "/getAllProductionPlanStatusEstimated",
  ProductionPlanningController.getAllProductionPlanStatusEstimated
);
productionPlanningRoutes.get(
  "/getProductionPlanningWithData/:id",
  ProductionPlanningController.getProductionPlanWithData
);
//Post
productionPlanningRoutes.post(
  "/addProductionPlanning/:id",
  ProductionPlanningController.addNewProductionPlanning //udah
);
//Put
productionPlanningRoutes.put(
  "/updateProductionPlan/:id",
  ProductionPlanningController.updateProductionPlan //udah
);
//Delete
productionPlanningRoutes.delete(
  "/deleteProductionPlan/:id",
  ProductionPlanningController.deleteProductionPlan //udah
);
productionPlanningRoutes.delete(
  "/deleteBahanBakuId/:id",
  ProductionPlanningController.deleteBahanBakuID //udah
);
productionPlanningRoutes.delete(
  "/deleteGroupBahanBaku",
  ProductionPlanningController.deleteGroupBahanBaku //udah
);
productionPlanningRoutes.delete(
  "/deleteJenisBahanBaku/:id",
  ProductionPlanningController.deleteJenisBahanBaku //udah
);
productionPlanningRoutes.delete(
  "/removeJadwal/:id",
  ProductionPlanningController.removeJadwal // udah
);
productionPlanningRoutes.delete(
  "/deleteJadwal/:id",
  ProductionPlanningController.deleteJadwal // udah
);
productionPlanningRoutes.delete(
  "/deleteItemRincianCetakan/:id",
  ProductionPlanningController.deleteItemRincianCetakan // udah
);
productionPlanningRoutes.delete(
  "/deleteItemPerincian/:id",
  ProductionPlanningController.deleteItemPerincian // ga kepake
);

module.exports = productionPlanningRoutes;

const productionPlanningRoutes = require("express").Router();
const { ProductionPlanningController } = require("../controllers");

//Get
productionPlanningRoutes.get(
  "/getUnreviewedOrders/:id",
  ProductionPlanningController.getUnreviewedOrders //lokasi udah
);
productionPlanningRoutes.get(
  "/getEstimatedOrders/:id",
  ProductionPlanningController.getEstimatedOrders //lokasi udah
);
productionPlanningRoutes.get(
  "/getOneOrder",
  ProductionPlanningController.getOneOrder //lokasi udah
);
productionPlanningRoutes.get(
  "/productionPlanningActivityLogs/:id",
  ProductionPlanningController.productionPlanningActivityLog //lokasi udah
);
productionPlanningRoutes.get(
  "/getAllProductionPlanning/:id",
  ProductionPlanningController.getAllProductionPlan //lokasi udah
);
productionPlanningRoutes.get(
  "/getAllProductionPlanStatusEstimated/:id",
  ProductionPlanningController.getAllProductionPlanStatusEstimated //lokasi udah
);
productionPlanningRoutes.get(
  "/getAllProductionPlanStatusEstimatedForProduction/:id",
  ProductionPlanningController.getAllProductionPlanStatusEstimatedForProduction
);
productionPlanningRoutes.get(
  "/getProductionPlanningWithData/:id",
  ProductionPlanningController.getProductionPlanWithData //lokasi udah
);
productionPlanningRoutes.get(
  "/getUserLama",
  ProductionPlanningController.getUserLama
);
productionPlanningRoutes.get(
  "/getUserBaru",
  ProductionPlanningController.getUserBaru
);
//Post
productionPlanningRoutes.post(
  "/addProductionPlanning/:id",
  ProductionPlanningController.addNewProductionPlanning //udah //lokasi udah
);
//Put
productionPlanningRoutes.put(
  "/updateProductionPlan/:id",
  ProductionPlanningController.updateProductionPlan //udah
);
productionPlanningRoutes.put(
  "/updateUserCredentials/:id",
  ProductionPlanningController.updateUserCredentials
);
//Delete
productionPlanningRoutes.delete(
  "/deleteProductionPlan/:id",
  ProductionPlanningController.deleteProductionPlan //udah //lokasi udah
);
productionPlanningRoutes.delete(
  "/deleteBahanBakuId/:id",
  ProductionPlanningController.deleteBahanBakuID //udah //lokasi udah
);
productionPlanningRoutes.delete(
  "/deleteGroupBahanBaku",
  ProductionPlanningController.deleteGroupBahanBaku //udah //lokasi udah
);
productionPlanningRoutes.delete(
  "/deleteJenisBahanBaku/:id",
  ProductionPlanningController.deleteJenisBahanBaku //udah //lokasi udah
);
productionPlanningRoutes.delete(
  "/removeJadwal/:id",
  ProductionPlanningController.removeJadwal // udah //lokasi udah
);
productionPlanningRoutes.delete(
  "/deleteJadwal/:id",
  ProductionPlanningController.deleteJadwal // udah //lokasi udah
);
productionPlanningRoutes.delete(
  "/deleteItemRincianCetakan/:id",
  ProductionPlanningController.deleteItemRincianCetakan // udah //lokasi udah
);
productionPlanningRoutes.delete(
  "/deleteItemPerincian/:id",
  ProductionPlanningController.deleteItemPerincian // ga kepake
);

module.exports = productionPlanningRoutes;

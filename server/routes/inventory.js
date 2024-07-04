const inventoryRoutes = require("express").Router();
const { InventoryController } = require("../controllers");

inventoryRoutes.get(
  "/getAllPermohonanPembelian",
  InventoryController.getAllPermohonanPembelian
);
inventoryRoutes.post(
  "/addPermohonanPembelian/:id",
  InventoryController.addPermohonanPembelian
);

inventoryRoutes.delete(
  "/deletePermohonanPembelian/:id",
  InventoryController.deletePermohonanPembelian
);

inventoryRoutes.put("/editPermohonanPembelian/:id", InventoryController.editPermohonanPembelian)

module.exports = inventoryRoutes;

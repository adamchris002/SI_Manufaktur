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

module.exports = inventoryRoutes;

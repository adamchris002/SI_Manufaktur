const inventoryRoutes = require("express").Router();
const { InventoryController } = require("../controllers");

inventoryRoutes.get(
  "/getAllPermohonanPembelian",
  InventoryController.getAllPermohonanPembelian
);
inventoryRoutes.get(
  "/getAllAcceptedPermohonanPembelian",
  InventoryController.getAllAcceptedPermohonanPembelian
);
inventoryRoutes.get(
  "/getPermohonanPembelian/:id",
  InventoryController.getPermohonanPembelian
);
inventoryRoutes.post(
  "/addPermohonanPembelian/:id",
  InventoryController.addPermohonanPembelian
);

inventoryRoutes.delete(
  "/deletePermohonanPembelian/:id",
  InventoryController.deletePermohonanPembelian
);

inventoryRoutes.put(
  "/editPermohonanPembelian/:id",
  InventoryController.editPermohonanPembelian
);

inventoryRoutes.delete(
  "/deleteItemsPermohonanPembelian/:id",
  InventoryController.deleteItemsPermohonanPembelian
);

inventoryRoutes.post(
  "/addPembelianBahanBaku/:id",
  InventoryController.addPembelianBahanBaku
);

inventoryRoutes.get(
  "/getAllPembelianBahanBaku",
  InventoryController.getAllPembelianBahanBaku
);

inventoryRoutes.get(
  "/getPembelianBahanBaku/:id",
  InventoryController.getPembelianBahanBaku
);

inventoryRoutes.delete(
  "/deletePembelianBahanBaku/:id",
  InventoryController.deletePembelianBahanBaku
);

inventoryRoutes.put(
  "/editPembelianBahanBaku/:id",
  InventoryController.editPembelianBahanBaku
);

inventoryRoutes.delete(
  "/deleteItemPembelianBahanbaku/:id",
  InventoryController.deleteItemPembelianBahanBaku
);

inventoryRoutes.get(
  "/getAllInventoryItem",
  InventoryController.getAllInventoryItem
);

inventoryRoutes.post(
  "/addInventoryItem/:id",
  InventoryController.addInventoryItem
);
inventoryRoutes.put(
  "/editInventoryItem/:id",
  InventoryController.updateInventoryItem
);
inventoryRoutes.delete(
  "/deleteInventoryItem",
  InventoryController.deleteInventoryItem
);

module.exports = inventoryRoutes;

const inventoryRoutes = require("express").Router();
const { InventoryController } = require("../controllers");

//get
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
inventoryRoutes.get(
  "/getAllPembelianBahanBaku",
  InventoryController.getAllPembelianBahanBaku
);

inventoryRoutes.get(
  "/getPembelianBahanBaku/:id",
  InventoryController.getPembelianBahanBaku
);
inventoryRoutes.get(
  "/findNameInventoryItem/:name",
  InventoryController.findNameInventoryItem
);
inventoryRoutes.get("/getAllStokOpnam", InventoryController.getAllStokOpnam);
inventoryRoutes.get("/getStokOpnam/:id", InventoryController.getStokOpnam);
inventoryRoutes.get(
  "/inventoryActivityLog",
  InventoryController.inventoryActivityLog
);
inventoryRoutes.get(
  "/getAllInventoryItem",
  InventoryController.getAllInventoryItem
);
inventoryRoutes.get(
  "/getAllPengambilanBarang",
  InventoryController.getAllPengambilanBarang
);
inventoryRoutes.get(
  "/getPenyerahanBarang/:id",
  InventoryController.getPenyerahanBarang
);

//post
inventoryRoutes.post(
  "/addPermohonanPembelian/:id",
  InventoryController.addPermohonanPembelian
);
inventoryRoutes.post(
  "/addPembelianBahanBaku/:id",
  InventoryController.addPembelianBahanBaku
);
inventoryRoutes.post(
  "/addInventoryItem/:id",
  InventoryController.addInventoryItem
);
inventoryRoutes.post("/addStokOpnam/:id", InventoryController.addStokOpnam);
inventoryRoutes.post(
  "/addPenyerahanBarang/:id",
  InventoryController.addPenyerahanBarang
);

//put
inventoryRoutes.put(
  "/editPermohonanPembelian/:id",
  InventoryController.editPermohonanPembelian
);
inventoryRoutes.put(
  "/editPembelianBahanBaku/:id",
  InventoryController.editPembelianBahanBaku
);
inventoryRoutes.put(
  "/editInventoryItem/:id",
  InventoryController.updateInventoryItem
);
inventoryRoutes.put("/editStokOpnam/:id", InventoryController.editStokOpnam);
inventoryRoutes.put("/editPenyerahanBarang/:id", InventoryController.editPenyerahanBarang)
inventoryRoutes.put("/statusStokOpnamComplete/:id", InventoryController.statusStokOpnamComplete)

//delete
inventoryRoutes.delete(
  "/deletePermohonanPembelian/:id",
  InventoryController.deletePermohonanPembelian
);
inventoryRoutes.delete(
  "/deleteItemsPermohonanPembelian/:id",
  InventoryController.deleteItemsPermohonanPembelian
);
inventoryRoutes.delete(
  "/deletePembelianBahanBaku/:id",
  InventoryController.deletePembelianBahanBaku
);
inventoryRoutes.delete(
  "/deleteItemPembelianBahanbaku/:id",
  InventoryController.deleteItemPembelianBahanBaku
);
inventoryRoutes.delete(
  "/deleteInventoryItem",
  InventoryController.deleteInventoryItem
);
inventoryRoutes.delete(
  "/deleteItemStokOpnam/:id",
  InventoryController.deleteItemStokOpnam
);
inventoryRoutes.delete(
  "/deleteStokOpnam/:id",
  InventoryController.deleteStokOpnam
);
inventoryRoutes.delete(
  "/deletePenyerahanBarang/:id",
  InventoryController.deletePenyerahanBarang
);
inventoryRoutes.delete(
  "/deleteItemPenyerahanBarang/:id",
  InventoryController.deleteItemPenyerahanBarang
);

module.exports = inventoryRoutes;

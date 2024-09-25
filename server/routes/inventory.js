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
inventoryRoutes.get(
  "/getPenyerahanBarangOrderId/:id",
  InventoryController.getPenyerahanBarangOrderId
);
inventoryRoutes.get(
  "/getAllPermohonanPembelianRequested",
  InventoryController.getAllPermohonanPembelianRequested
);

//post
inventoryRoutes.post(
  "/addPermohonanPembelian/:id",
  InventoryController.addPermohonanPembelian //udah
);
inventoryRoutes.post(
  "/addPembelianBahanBaku/:id",
  InventoryController.addPembelianBahanBaku //udah
);
inventoryRoutes.post(
  "/addInventoryItem/:id",
  InventoryController.addInventoryItem //udah
);
inventoryRoutes.post("/addStokOpnam/:id", InventoryController.addStokOpnam); //udah
inventoryRoutes.post(
  "/addPenyerahanBarang/:id",
  InventoryController.addPenyerahanBarang //udah
);

//put
inventoryRoutes.put(
  "/editPermohonanPembelian/:id",
  InventoryController.editPermohonanPembelian //udah
);
inventoryRoutes.put( 
  "/editPembelianBahanBaku/:id",
  InventoryController.editPembelianBahanBaku //udah
);
inventoryRoutes.put(
  "/editInventoryItem/:id",
  InventoryController.updateInventoryItem //udah
);
inventoryRoutes.put("/editStokOpnam/:id", InventoryController.editStokOpnam); //udah
inventoryRoutes.put(
  "/editPenyerahanBarang/:id",
  InventoryController.editPenyerahanBarang //udah
);
inventoryRoutes.put(
  "/statusStokOpnamComplete/:id",
  InventoryController.statusStokOpnamComplete
);
inventoryRoutes.put(
  "/acceptPermohonanPembelian/:id",
  InventoryController.acceptPermohonanPembelian //udah
);
inventoryRoutes.put(
  "/denyPermohonanPembelian/:id",
  InventoryController.denyPermohonanPembelian //udah
);

//delete
inventoryRoutes.delete(
  "/deletePermohonanPembelian/:id",
  InventoryController.deletePermohonanPembelian //udah
);
inventoryRoutes.delete(
  "/deleteItemsPermohonanPembelian/:id",
  InventoryController.deleteItemsPermohonanPembelian //udah
);
inventoryRoutes.delete(
  "/deletePembelianBahanBaku/:id",
  InventoryController.deletePembelianBahanBaku //udah
);
inventoryRoutes.delete(
  "/deleteItemPembelianBahanbaku/:id",
  InventoryController.deleteItemPembelianBahanBaku //udah
);
inventoryRoutes.delete(
  "/deleteInventoryItem",
  InventoryController.deleteInventoryItem //udah
);
inventoryRoutes.delete(
  "/deleteItemStokOpnam/:id",
  InventoryController.deleteItemStokOpnam //udah
);
inventoryRoutes.delete(
  "/deleteStokOpnam/:id",
  InventoryController.deleteStokOpnam //udah
);
inventoryRoutes.delete(
  "/deletePenyerahanBarang/:id",
  InventoryController.deletePenyerahanBarang //udah
);
inventoryRoutes.delete(
  "/deleteItemPenyerahanBarang/:id",
  InventoryController.deleteItemPenyerahanBarang //udah
);

module.exports = inventoryRoutes;

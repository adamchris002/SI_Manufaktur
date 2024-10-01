const inventoryRoutes = require("express").Router();
const { InventoryController } = require("../controllers");

//get
inventoryRoutes.get(
  "/getAllPermohonanPembelian/:id",
  InventoryController.getAllPermohonanPembelian //lokasi udah
);
inventoryRoutes.get(
  "/getAllAcceptedPermohonanPembelian/:id",
  InventoryController.getAllAcceptedPermohonanPembelian //lokasi udah
);
inventoryRoutes.get(
  "/getPermohonanPembelian/:id",
  InventoryController.getPermohonanPembelian //lokasi udah
);
inventoryRoutes.get(
  "/getAllPembelianBahanBaku/:id",
  InventoryController.getAllPembelianBahanBaku //lokasi udah
);

inventoryRoutes.get(
  "/getPembelianBahanBaku/:id",
  InventoryController.getPembelianBahanBaku //lokasi udah
);
inventoryRoutes.get(
  "/findNameInventoryItem/:name",
  InventoryController.findNameInventoryItem
);
inventoryRoutes.get(
  "/getAllStokOpnam/:id",
  InventoryController.getAllStokOpnam
); //lokasi udah
inventoryRoutes.get("/getStokOpnam/:id", InventoryController.getStokOpnam); //lokasi udah
inventoryRoutes.get(
  "/inventoryActivityLog/:id",
  InventoryController.inventoryActivityLog //lokasi udah
);
inventoryRoutes.get(
  "/getAllInventoryItem/:id",
  InventoryController.getAllInventoryItem //lokasi udah
);
inventoryRoutes.get(
  "/getAllPengambilanBarang/:id",
  InventoryController.getAllPengambilanBarang //lokasi udah
);
inventoryRoutes.get(
  "/getPenyerahanBarang/:id",
  InventoryController.getPenyerahanBarang //lokasi udah
);
inventoryRoutes.get(
  "/getPenyerahanBarangOrderId/:id",
  InventoryController.getPenyerahanBarangOrderId //lokasi udah
);
inventoryRoutes.get(
  "/getAllPermohonanPembelianRequested/:id",
  InventoryController.getAllPermohonanPembelianRequested //lokasi udah
);
inventoryRoutes.get("/getUserBaru", InventoryController.getUserBaru);
inventoryRoutes.get("/getUserLama", InventoryController.getUserLama);

//post
inventoryRoutes.post(
  "/addPermohonanPembelian/:id",
  InventoryController.addPermohonanPembelian //udah //lokasi udah
);
inventoryRoutes.post(
  "/addPembelianBahanBaku/:id",
  InventoryController.addPembelianBahanBaku //udah //lokasi udah
);
inventoryRoutes.post(
  "/addInventoryItem/:id",
  InventoryController.addInventoryItem //udah //lokasi udah
);
inventoryRoutes.post("/addStokOpnam/:id", InventoryController.addStokOpnam); //udah //lokasi udah
inventoryRoutes.post(
  "/addPenyerahanBarang/:id",
  InventoryController.addPenyerahanBarang //udah //lokasi udah?
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
inventoryRoutes.put(
  "/updateUserCredentials/:id",
  InventoryController.updateUserCredentials
);

//delete
inventoryRoutes.delete(
  "/deletePermohonanPembelian/:id",
  InventoryController.deletePermohonanPembelian //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deleteItemsPermohonanPembelian/:id",
  InventoryController.deleteItemsPermohonanPembelian //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deletePembelianBahanBaku/:id",
  InventoryController.deletePembelianBahanBaku //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deleteItemPembelianBahanbaku/:id",
  InventoryController.deleteItemPembelianBahanBaku //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deleteInventoryItem",
  InventoryController.deleteInventoryItem //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deleteItemStokOpnam/:id",
  InventoryController.deleteItemStokOpnam //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deleteStokOpnam/:id",
  InventoryController.deleteStokOpnam //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deletePenyerahanBarang/:id",
  InventoryController.deletePenyerahanBarang //udah //lokasi udah
);
inventoryRoutes.delete(
  "/deleteItemPenyerahanBarang/:id",
  InventoryController.deleteItemPenyerahanBarang //udah //lokasi udah
);

module.exports = inventoryRoutes;

const productionRoutes = require("express").Router();
const { ProductionController } = require("../controllers");

//get
productionRoutes.get(
  "/penyerahanBarangSiap/:id",
  ProductionController.getPenyerahanBarang //lokasi udah
);
productionRoutes.get(
  "/getProductionData/:id",
  ProductionController.getProductionData //lokasi udah
);
productionRoutes.get(
  "/getLaporanPracetakPrev/:id",
  ProductionController.getLaporanPracetakPrev
);
productionRoutes.get(
  "/getOneProductionData/:id",
  ProductionController.getOneProductionData //lokasi udah
);
productionRoutes.get(
  "/getKegiatanProduksiDone/:id",
  ProductionController.getKegiatanProduksiDone //lokasi udah
);
productionRoutes.get(
  "/getLaporanProduksiForLaporanLimbah/:id",
  ProductionController.getLaporanProduksiForLaporanLimbah //lokasi udah
);
productionRoutes.get(
  "/getAllLaporanLimbahProduksi/:id",
  ProductionController.getAllLaporanLimbahProduksi //lokasi udah
);
productionRoutes.get(
  "/getOneLaporanLimbahProduksi/:id",
  ProductionController.getOneLaporanLimbahProduksi //lokasi udah
);
productionRoutes.get(
  "/getLaporanSampah/:id",
  ProductionController.getLaporanSampah //lokasi udah
);
productionRoutes.get(
  "/getActivityLog/:id",
  ProductionController.productionActivityLog //lokasi udah
);
productionRoutes.get("/getUserBaru", ProductionController.getUserBaru);
productionRoutes.get("/getUserLama", ProductionController.getUserLama);
//post
productionRoutes.post(
  "/addKegiatanProduksi/:id",
  ProductionController.addKegiatanProduksi //udah //lokasi udah
);
productionRoutes.post(
  "/addKegiatanProduksiCetak/:id",
  ProductionController.addKegiatanProduksiCetak //udah //lokasi udah
);
productionRoutes.post(
  "/addKegiatanProduksiFitur/:id",
  ProductionController.addKegiatanProduksiFitur //udah //lokasi udah
);
productionRoutes.post(
  "/addLaporanLimbahProduksi/:id",
  ProductionController.addLaporanLimbahProduksi //udah //lokasi udah
);
productionRoutes.post(
  "/addLaporanSampah/:id",
  ProductionController.addLaporanSampah //udah //lokasi udah
);

//put
productionRoutes.put(
  "/updateKegiatanProduksiPracetak/:id",
  ProductionController.editKegiatanProduksiPracetak //udah
);
productionRoutes.put(
  "/updateKegiatanProduksiCetak/:id",
  ProductionController.editKegiatanProduksiCetak //udah
);
productionRoutes.put(
  "/updateKegiatanProduksiFitur/:id",
  ProductionController.editKegiatanProduksiFitur //udah
);
productionRoutes.put(
  "/kegiatanProduksiSelesai/:id",
  ProductionController.kegiatanProduksiSelesai //udah
);
productionRoutes.put(
  "/updateDataLimbahProduksi/:id",
  ProductionController.updateDataLimbahProduksi //udah
);
productionRoutes.put(
  "/updateLaporanSampah/:id",
  ProductionController.updateLaporanSampah //udah
);
productionRoutes.put(
  "/updateUserCredentials/:id",
  ProductionController.updateUserCredentials
);
//delete
productionRoutes.delete(
  "/deletePersonils/:id",
  ProductionController.deletePersonil //udah //lokasi udah
);
productionRoutes.delete(
  "/deleteBahanProduksiPracetak/:id",
  ProductionController.deleteBahanProduksiPracetak //udah //lokasi udah
);
productionRoutes.delete(
  "/deleteJadwalProduksiPracetak/:id",
  ProductionController.deleteJadwalProduksiPracetak //udah //lokasi udah
);
productionRoutes.delete(
  "/deleteKegiatanProduksi/:id",
  ProductionController.deleteKegiatanProduksi //udah //lokasi udah
);
productionRoutes.delete(
  "/deleteItemLimbahProduksi/:id",
  ProductionController.deleteItemLimbahProduksi //udah //lokasi udah
);
productionRoutes.delete(
  "/deleteItemLaporanLimbahProduksis/:id",
  ProductionController.deleteItemLaporanLimbahProduksis //udah //lokasi udah
);
productionRoutes.delete(
  "/deleteLaporanSampah/:id",
  ProductionController.deleteLaporanSampah //udah
);
productionRoutes.delete(
  "/deleteItemLaporanSampah/:id",
  ProductionController.deleteItemLaporanSampah //
);

module.exports = productionRoutes;

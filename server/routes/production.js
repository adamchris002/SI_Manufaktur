const productionRoutes = require("express").Router();
const { ProductionController } = require("../controllers");

//get
productionRoutes.get(
  "/penyerahanBarangSiap",
  ProductionController.getPenyerahanBarang
);
productionRoutes.get(
  "/getProductionData",
  ProductionController.getProductionData
);
productionRoutes.get(
  "/getOneProductionData/:id",
  ProductionController.getOneProductionData
);
productionRoutes.get(
  "/getKegiatanProduksiDone",
  ProductionController.getKegiatanProduksiDone
);
productionRoutes.get(
  "/getLaporanProduksiForLaporanLimbah",
  ProductionController.getLaporanProduksiForLaporanLimbah
);
productionRoutes.get(
  "/getAllLaporanLimbahProduksi",
  ProductionController.getAllLaporanLimbahProduksi
);
productionRoutes.get(
  "/getOneLaporanLimbahProduksi/:id",
  ProductionController.getOneLaporanLimbahProduksi
);
productionRoutes.get(
  "/getLaporanSampah",
  ProductionController.getLaporanSampah
);
productionRoutes.get(
  "/getActivityLog",
  ProductionController.productionActivityLog
);
//post
productionRoutes.post(
  "/addKegiatanProduksi/:id",
  ProductionController.addKegiatanProduksi //udah
);
productionRoutes.post(
  "/addKegiatanProduksiCetak/:id",
  ProductionController.addKegiatanProduksiCetak //udah
);
productionRoutes.post(
  "/addKegiatanProduksiFitur/:id",
  ProductionController.addKegiatanProduksiFitur //udah
);
productionRoutes.post(
  "/addLaporanLimbahProduksi/:id",
  ProductionController.addLaporanLimbahProduksi //udah
);
productionRoutes.post(
  "/addLaporanSampah/:id",
  ProductionController.addLaporanSampah //udah
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

//delete
productionRoutes.delete(
  "/deletePersonils/:id",
  ProductionController.deletePersonil //udah
);
productionRoutes.delete(
  "/deleteBahanProduksiPracetak/:id",
  ProductionController.deleteBahanProduksiPracetak //udah
);
productionRoutes.delete(
  "/deleteJadwalProduksiPracetak/:id",
  ProductionController.deleteJadwalProduksiPracetak //udah
);
productionRoutes.delete(
  "/deleteKegiatanProduksi/:id",
  ProductionController.deleteKegiatanProduksi //udah
);
productionRoutes.delete(
  "/deleteItemLimbahProduksi/:id",
  ProductionController.deleteItemLimbahProduksi //udah
);
productionRoutes.delete(
  "/deleteItemLaporanLimbahProduksis/:id",
  ProductionController.deleteItemLaporanLimbahProduksis //udah
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

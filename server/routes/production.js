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

//post
productionRoutes.post(
  "/addKegiatanProduksi/:id",
  ProductionController.addKegiatanProduksi
);
productionRoutes.post(
  "/addKegiatanProduksiCetak/:id",
  ProductionController.addKegiatanProduksiCetak
);
productionRoutes.post(
  "/addKegiatanProduksiFitur/:id",
  ProductionController.addKegiatanProduksiFitur
);
productionRoutes.post(
  "/addLaporanLimbahProduksi/:id",
  ProductionController.addLaporanLimbahProduksi
);
productionRoutes.post(
  "/addLaporanSampah/:id",
  ProductionController.addLaporanSampah
);

//put
productionRoutes.put(
  "/updateKegiatanProduksiPracetak/:id",
  ProductionController.editKegiatanProduksiPracetak
);
productionRoutes.put(
  "/updateKegiatanProduksiCetak/:id",
  ProductionController.editKegiatanProduksiCetak
);
productionRoutes.put(
  "/updateKegiatanProduksiFitur/:id",
  ProductionController.editKegiatanProduksiFitur
);
productionRoutes.put(
  "/kegiatanProduksiSelesai/:id",
  ProductionController.kegiatanProduksiSelesai
);
productionRoutes.put(
  "/updateDataLimbahProduksi/:id",
  ProductionController.updateDataLimbahProduksi
);

//delete
productionRoutes.delete(
  "/deletePersonils/:id",
  ProductionController.deletePersonil
);
productionRoutes.delete(
  "/deleteBahanProduksiPracetak/:id",
  ProductionController.deleteBahanProduksiPracetak
);
productionRoutes.delete(
  "/deleteJadwalProduksiPracetak/:id",
  ProductionController.deleteJadwalProduksiPracetak
);
productionRoutes.delete(
  "/deleteKegiatanProduksi/:id",
  ProductionController.deleteKegiatanProduksi
);
productionRoutes.delete(
  "/deleteItemLimbahProduksi/:id",
  ProductionController.deleteItemLimbahProduksi
);
productionRoutes.delete(
  "/deleteItemLaporanLimbahProduksis/:id",
  ProductionController.deleteItemLaporanLimbahProduksis
);

module.exports = productionRoutes;

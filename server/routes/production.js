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

module.exports = productionRoutes;

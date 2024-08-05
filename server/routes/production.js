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

//put

//delete

module.exports = productionRoutes;

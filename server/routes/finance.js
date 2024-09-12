const financeRoutes = require("express").Router();
const { FinanceController } = require("../controllers");

//get
financeRoutes.get("/getOngoingBukuBank", FinanceController.getOngoingBukuBank);
financeRoutes.get("/getDoneBukuBank", FinanceController.getDoneBukuBank);
financeRoutes.get(
  "/checkifNamaBankAvailable/:name",
  FinanceController.checkIfNamaBankAvailable
);
financeRoutes.get(
  "/getPreviousSaldoAkhir/:name",
  FinanceController.getPreviousSaldoAkhir
);
financeRoutes.get(
  "/getOngoingKasHarian",
  FinanceController.getOngoingKasHarian
);
financeRoutes.get("/getDoneKasHarian", FinanceController.getDoneKasHarian);
financeRoutes.get(
  "/getAllPosPembayaran",
  FinanceController.getAllPosPembayaran
);
financeRoutes.get(
  "/getAllOngoingRencanaPembayaran",
  FinanceController.getAllOngoingRencanaPembayaran
);
financeRoutes.get(
  "/checkIfRencanaPembayaranExists",
  FinanceController.checkIfRencanaPembayaranExists
);
financeRoutes.get(
  "/getDoneRencanaPembayaran",
  FinanceController.getDoneRencanaPembayaran
);
//post
financeRoutes.post("/addNamaBank/:id", FinanceController.addNamaBank);
financeRoutes.post("/addItemBukuBank/:id", FinanceController.addNewBukuBank);
financeRoutes.post("/addKasHarian/:id", FinanceController.addKasHarian);
financeRoutes.post(
  "/checkForDefaultPosPembayaran",
  FinanceController.checkForDefaultPosPembayaran
);
financeRoutes.post("/addHutang/:id", FinanceController.addHutang);
financeRoutes.post("/addPajakMasukan/:id", FinanceController.addPajakMasukan);
financeRoutes.post("/addPajakKeluaran/:id", FinanceController.addPajakKeluaran);
//put
financeRoutes.put("/updateStatusDone/:id", FinanceController.updateStatusDone);
financeRoutes.put(
  "/updateStatusKasHarianDone/:id",
  FinanceController.updateStatusKasHarianDone
);
financeRoutes.put(
  "/savePosPembayaran/:id",
  FinanceController.savePosPembayaran
);
financeRoutes.put(
  "/updateDoneRencanaPembayaran/:id",
  FinanceController.updateDoneRencanaPembayaran
);
financeRoutes.put("/updateCicilan/:id", FinanceController.updateCicilan)
// delete

module.exports = financeRoutes;

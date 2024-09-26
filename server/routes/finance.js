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
financeRoutes.get(
  "/findPrevOngoingHutangs",
  FinanceController.findPrevOngoingHutangs
);
financeRoutes.get(
  "/findPrevOngoingPembayaranLainLain",
  FinanceController.findPrevOngoingPembayaranLainLain
);
financeRoutes.get(
  "/getActiveRencanaPembayaranOneYear",
  FinanceController.getActiveRencanaPembayaranOneYear
);
financeRoutes.get("/getActivityLog", FinanceController.financeActivityLog);
//post
financeRoutes.post("/addNamaBank/:id", FinanceController.addNamaBank); //udah
financeRoutes.post("/addItemBukuBank/:id", FinanceController.addNewBukuBank); //udah
financeRoutes.post("/addKasHarian/:id", FinanceController.addKasHarian);  //udah
financeRoutes.post(
  "/checkForDefaultPosPembayaran",
  FinanceController.checkForDefaultPosPembayaran
);
financeRoutes.post("/addHutang/:id", FinanceController.addHutang); //udah
financeRoutes.post("/addPajakMasukan/:id", FinanceController.addPajakMasukan); //udah
financeRoutes.post("/addPajakKeluaran/:id", FinanceController.addPajakKeluaran); //udah
financeRoutes.post(
  "/addPembayaranLainLain/:id",
  FinanceController.addPembayaranLainLain //udah
);
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
financeRoutes.put("/updateCicilan/:id", FinanceController.updateCicilan); //udah
financeRoutes.put(
  "/updateCicilanPemLains/:id",
  FinanceController.updateCicilanPemLains //
);
// delete

module.exports = financeRoutes;

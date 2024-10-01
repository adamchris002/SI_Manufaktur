const financeRoutes = require("express").Router();
const { FinanceController } = require("../controllers");

//get
financeRoutes.get(
  "/getOngoingBukuBank/:id",
  FinanceController.getOngoingBukuBank
); //lokasi udah
financeRoutes.get("/getDoneBukuBank/:id", FinanceController.getDoneBukuBank); //lokasi udah
financeRoutes.get(
  "/checkifNamaBankAvailable/:name",
  FinanceController.checkIfNamaBankAvailable //lokasi udah
);
financeRoutes.get(
  "/getPreviousSaldoAkhir/:name",
  FinanceController.getPreviousSaldoAkhir //lokasi udah
);
financeRoutes.get(
  "/getOngoingKasHarian/:id",
  FinanceController.getOngoingKasHarian //lokasi udah
);
financeRoutes.get("/getDoneKasHarian/:id", FinanceController.getDoneKasHarian); //lokasi udah
financeRoutes.get(
  "/getAllPosPembayaran",
  FinanceController.getAllPosPembayaran //ga usah?
);
financeRoutes.get(
  "/getAllOngoingRencanaPembayaran/:id",
  FinanceController.getAllOngoingRencanaPembayaran //lokasi udah
);
financeRoutes.get(
  "/checkIfRencanaPembayaranExists/:id",
  FinanceController.checkIfRencanaPembayaranExists //lokasi udah
);
financeRoutes.get(
  "/getDoneRencanaPembayaran/:id",
  FinanceController.getDoneRencanaPembayaran //lokasi udah
);
financeRoutes.get(
  "/findPrevOngoingHutangs",
  FinanceController.findPrevOngoingHutangs //lokasi
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
financeRoutes.get(
  "/getAllProductionPlanningForPajakKeluaran",
  FinanceController.getAllProductionPlanningForPajakKeluaran
);
financeRoutes.get(
  "/getPembelianBahanBakuForPajakMasukan",
  FinanceController.getPembelianBahanBakuForPajakMasukan
);
financeRoutes.get(
  "/getPembelianBahanbakuForHutang",
  FinanceController.getPembelianBahanbakuForHutang
);
financeRoutes.get("/getUserBaru", FinanceController.getUserBaru);
financeRoutes.get("/getUserLama", FinanceController.getUserLama);
//post
financeRoutes.post("/addNamaBank/:id", FinanceController.addNamaBank); //udah
financeRoutes.post("/addItemBukuBank/:id", FinanceController.addNewBukuBank); //udah
financeRoutes.post("/addKasHarian/:id", FinanceController.addKasHarian); //udah
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
financeRoutes.put(
  "/updateUserCredentials/:id",
  FinanceController.updateUserCredentials
);
financeRoutes.put(
  "/updateDivisiOwner/:namaDivisi",
  FinanceController.updateDivisiOwner
);
// delete

module.exports = financeRoutes;

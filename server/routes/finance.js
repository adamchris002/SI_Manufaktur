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
  "/findPrevOngoingHutangs/:id",
  FinanceController.findPrevOngoingHutangs //lokasi udah
);
financeRoutes.get(
  "/findPrevOngoingPembayaranLainLain/:id",
  FinanceController.findPrevOngoingPembayaranLainLain //lokasi udah
);
financeRoutes.get(
  "/getActiveRencanaPembayaranOneYear/:id",
  FinanceController.getActiveRencanaPembayaranOneYear //lokasi udah
);
financeRoutes.get("/getActivityLog/:id", FinanceController.financeActivityLog); //lokasi udah
financeRoutes.get(
  "/getAllProductionPlanningForPajakKeluaran/:id",
  FinanceController.getAllProductionPlanningForPajakKeluaran //lokasi udah
);
financeRoutes.get(
  "/getPembelianBahanBakuForPajakMasukan/:id",
  FinanceController.getPembelianBahanBakuForPajakMasukan //lokasi udah
);
financeRoutes.get(
  "/getPembelianBahanbakuForHutang/:id",
  FinanceController.getPembelianBahanbakuForHutang //lokasi udah
);
financeRoutes.get("/getUserBaru", FinanceController.getUserBaru);
financeRoutes.get("/getUserLama", FinanceController.getUserLama);
financeRoutes.get(
  "/getNamaBukuBankSama/:id",
  FinanceController.getNamaBukuBankSama
);
financeRoutes.get("/getOrderDone/:id", FinanceController.getOrderDone);
//post
financeRoutes.post("/addNamaBank/:id", FinanceController.addNamaBank); //udah //lokasi udah
financeRoutes.post("/addItemBukuBank/:id", FinanceController.addNewBukuBank); //udah //lokasi perlu ga?
financeRoutes.post("/addKasHarian/:id", FinanceController.addKasHarian); //udah //lokasi udah?
financeRoutes.post(
  "/checkForDefaultPosPembayaran",
  FinanceController.checkForDefaultPosPembayaran
); // ga usah kayaknya
financeRoutes.post("/addHutang/:id", FinanceController.addHutang); //udah //lokasi udah?
financeRoutes.post("/addPajakMasukan/:id", FinanceController.addPajakMasukan); //udah
financeRoutes.post("/addPajakKeluaran/:id", FinanceController.addPajakKeluaran); //udah
financeRoutes.post(
  "/addPembayaranLainLain/:id",
  FinanceController.addPembayaranLainLain //udah //lokasi udah
);
financeRoutes.post(
  "/pembayaranPesananDone/:id",
  FinanceController.pembayaranPesananDone
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
financeRoutes.put(
  "/updateLocationOwner/:namaLokasi",
  FinanceController.updateLocationOwner
);
// delete

module.exports = financeRoutes;

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
//post
financeRoutes.post("/addNamaBank/:id", FinanceController.addNamaBank);
financeRoutes.post("/addItemBukuBank/:id", FinanceController.addNewBukuBank);
//put
financeRoutes.put("/updateStatusDone/:id", FinanceController.updateStatusDone);
//delete

module.exports = financeRoutes;

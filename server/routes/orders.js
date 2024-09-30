const orderRoutes = require("express").Router();
const multer = require("multer");
const { OrderController } = require("../controllers");

const upload = multer({ dest: "uploads/" });

//Get
orderRoutes.get("/getAllOrderInfo", OrderController.getAllOrders);
orderRoutes.get("/getOrderInfo/:id", OrderController.getOrderInfo);
orderRoutes.get("/getAllActivityLogs", OrderController.marketingActivityLog);
orderRoutes.get("/getUserBaru", OrderController.getUserBaru);
orderRoutes.get("/getUserLama", OrderController.getUserLama);
//Post
orderRoutes.post("/addOrder/:id", upload.any(), OrderController.addOrder); //udah
//Put
orderRoutes.put("/updateOrder/:id", upload.any(), OrderController.updateOrder); //udah
orderRoutes.put(
  "/updateUserCredentials/:id",
  OrderController.updateUserCredentials
);
//Delete
orderRoutes.delete("/deleteOrder", OrderController.deleteOrder); //udah

module.exports = orderRoutes;

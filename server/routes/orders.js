const orderRoutes = require("express").Router();
const multer = require("multer");
const { OrderController } = require("../controllers");

const upload = multer({ dest: "uploads/" });

//Get
orderRoutes.get("/getAllOrderInfo/:id", OrderController.getAllOrders); //lokasi udah
orderRoutes.get("/getOrderInfo/:id", OrderController.getOrderInfo); ////lokasi udah
orderRoutes.get("/getAllActivityLogs/:id", OrderController.marketingActivityLog); //lokasi udah
orderRoutes.get("/getUserBaru", OrderController.getUserBaru);
orderRoutes.get("/getUserLama", OrderController.getUserLama);
//Post
orderRoutes.post("/addOrder/:id", upload.any(), OrderController.addOrder); //udah //lokasi udah
//Put
orderRoutes.put("/updateOrder/:id", upload.any(), OrderController.updateOrder); //udah
orderRoutes.put(
  "/updateUserCredentials/:id",
  OrderController.updateUserCredentials 
);
//Delete
orderRoutes.delete("/deleteOrder", OrderController.deleteOrder); //udah

module.exports = orderRoutes;

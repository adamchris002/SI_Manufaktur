const orderRoutes = require("express").Router();
const multer = require("multer");
const { OrderController } = require("../controllers");

const upload = multer({ dest: "uploads/" });

//Get
orderRoutes.get("/getAllOrderInfo", OrderController.getAllOrders);
orderRoutes.get("/getOrderInfo/:id", OrderController.getOrderInfo);
orderRoutes.get("/getAllActivityLogs", OrderController.marketingActivityLog);
//Post
orderRoutes.post("/addOrder/:id", upload.any(), OrderController.addOrder); //udah
//Put
orderRoutes.put("/updateOrder/:id", upload.any(), OrderController.updateOrder); //udah
//Delete
orderRoutes.delete("/deleteOrder", OrderController.deleteOrder); //udah

module.exports = orderRoutes;

const orderRoutes = require("express").Router();
const multer = require("multer");
const { OrderController } = require("../controllers");

const upload = multer({ dest: "uploads/" });

orderRoutes.post("/addOrder", upload.any(), OrderController.addOrder);
orderRoutes.get("/getAllOrderInfo", OrderController.getAllOrders);
orderRoutes.get("/getOrderInfo/:id", OrderController.getOrderInfo);
orderRoutes.delete("/deleteOrder/:id", OrderController.deleteOrder);
orderRoutes.put("/updateOrder/:id", upload.any(), OrderController.updateOrder);

module.exports = orderRoutes;

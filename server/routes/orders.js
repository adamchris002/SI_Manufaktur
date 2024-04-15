const orderRoutes = require("express").Router();
const multer = require("multer");
const { OrderController } = require("../controllers");

const upload = multer({dest: "uploads/"})

orderRoutes.post("/addOrder", upload.any(), OrderController.addOrder);
orderRoutes.get("/getAllOrderInfo", OrderController.getAllOrders);

module.exports = orderRoutes;

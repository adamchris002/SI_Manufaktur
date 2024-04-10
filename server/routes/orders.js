const orderRoutes = require("express").Router()
const {OrderController} = require("../controllers")

orderRoutes.post("/addOrder", OrderController.addOrder)
orderRoutes.get("/getAllOrderInfo", OrderController.getAllOrders)

module.exports = orderRoutes
const { orders } = require("../models");

class OrderController {
  static async addOrder(req, res) {
    try {
      const {
        orderTitle,
        orderQuantity,
        orderDetails,
        customerChannel,
        customerDetail,
      } = req.body;
      let result = await orders.create({
        orderTitle,
        orderQuantity,
        orderDetails,
        customerChannel,
        customerDetail,
        orderStatus: "Ongoing",
      });
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }
  static async getAllOrders(req, res) {
    try {
      let result = await orders.findAll();
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = OrderController;

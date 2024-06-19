const { orders, documents } = require("../models");

class ProductionPlanningController {
  static async getUnreviewedOrders(req, res) {
    try {
      let result = await orders.findAll({
        where: { orderStatus: "Ongoing" },
        include: [
          {
            model: documents,
            as: "documents",
          },
        ],
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getEstimatedOrders(req, res) {
    try {
      let result = await orders.findAll({
        where: { orderStatus: "Estimated" },
        include: [
          {
            model: documents,
            as: "documents",
          },
        ],
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllOrders(req, res) {
    try {
      let result = await orders.findAll({
        include: [{ model: documents }],
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getOneOrder(req, res) {
    try {
      const { orderId } = req.query;
      let result = await orders.findOne({
        where: { id: orderId },
        include: [
          {
            model: documents,
            as: "documents",
          },
        ],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionPlanningController;

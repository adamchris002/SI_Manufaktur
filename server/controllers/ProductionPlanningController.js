const { orders } = require("../models");

class ProductionPlanningController {
  static async getUnreviewedOrders(req, res) {
    try {
      let result = await orders.findAll({
        where: { orderStatus: "Ongoing" },
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionPlanningController;

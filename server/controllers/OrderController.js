const { orders, documents } = require("../models");
const path = require("path");
const upload = require("../multerConfig");

class OrderController {
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await orders.findOne({
        where: { id },
        include: [{ model: documents }],
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      await orders.destroy({
        where: { id },
      });

      await documents.destroy({
        where: { orderId: id },
      });
    } catch (err) {
      res.json(err);
    }
  }
  static async getOrderInfo(req, res) {
    try {
      const { id } = req.params;
      let result = await orders.findOne({
        where: { id },
        include: [{ model: documents }],
      });
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  }
  static async addOrder(req, res) {
    try {
      const {
        orderTitle,
        orderQuantity,
        orderDetails,
        customerChannel,
        customerDetail,
        orderStatus,
      } = req.body;

      // Create the order in the database
      let order = await orders.create({
        orderTitle,
        orderQuantity,
        orderDetails,
        customerChannel,
        customerDetail,
        orderStatus,
      });

      // Handle document uploads using Multer middleware
      if (req.files && req.files.length > 0) {
        const filePromises = req.files.map(async (file) => {
          const filePath = path.join(__dirname, "uploads", file.filename);
          try {
            // Save file information to the database
            await documents.create({
              orderId: order.id,
              filename: file.filename,
              size: file.size,
              type: file.mimetype,
              path: filePath,
            });
          } catch (error) {
            console.error("Error saving file information:", error);
            // Handle error as needed
          }
        });
        await Promise.all(filePromises);
      }

      // Respond with the created order
      res.json(order);
    } catch (err) {
      console.error("Error adding order:", err);
      res.status(500).json({ error: "Error adding order" });
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
}

module.exports = OrderController;

const {
  orders,
  documents,
  users,
  UserOrders,
  activitylogs,
  UserActivityLogs,
} = require("../models");
const path = require("path");
const upload = require("../multerConfig");
const { error } = require("console");

class OrderController {
  static async marketingActivityLog(req, res) {
    try {
      let result = await activitylogs.findAll({
        where: { division: "Marketing" },
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateOrder(req, res) {
    try {
      const { id } = req.params;

      const {
        orderId,
        orderTitle,
        orderQuantity,
        orderDetails,
        customerChannel,
        customerDetail,
        documentsToRemove,
        orderTotalPrice,
        orderType,
        orderNoSeries,
        orderDueDate,
        alamatPengiriman
      } = req.body;

      let order = await orders.findOne({
        where: { orderId },
        include: [{ model: documents }],
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await order.update(
        {
          orderTitle,
          orderQuantity,
          orderDetails,
          customerChannel,
          customerDetail,
          orderTotalPrice,
          orderType,
          orderNoSeries,
          orderDueDate,
          alamatPengiriman
        },
        {
          where: { orderId },
        }
      );

      let userInformation = await users.findOne({
        where: { id: id },
      });

      let orderInformation = await orders.findOne({
        where: { id: orderId },
      });

      let updateActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: "Update an Order",
        name: orderInformation.orderTitle,
        division: "Marketing",
      });

      await UserActivityLogs.create({
        userId: userInformation.id,
        id: updateActivityLog.id,
        activityLogsId: updateActivityLog.id,
      });

      if (documentsToRemove) {
        const documentIds = JSON.parse(documentsToRemove);
        if (Array.isArray(documentIds) && documentIds.length > 0) {
          await documents.destroy({
            where: {
              id: documentIds,
            },
          });
        }
      }

      if (req.files && req.files.length > 0) {
        const filePromises = req.files.map(async (file) => {
          const filePath = path.join(__dirname, "uploads", file.filename);
          try {
            await documents.create({
              orderId: order.id,
              filename: file.filename,
              size: file.size,
              type: file.mimetype,
              path: filePath,
            });
          } catch (error) {
            console.error("Error saving file information:", error);
          }
        });
        await Promise.all(filePromises);
      }

      res.json(updatedOrder);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteOrder(req, res) {
    try {
      const { userId, orderId } = req.query;
      const order = await orders.findOne({
        where: { orderId },
        include: [{ model: documents }],
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let orderInformation = await orders.findOne({
        where: { id: orderId },
      });

      let deleteActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: "Delete an Order",
        name: orderInformation.orderTitle,
        division: "Marketing",
      });

      await UserActivityLogs.create({
        userId: userInformation.id,
        id: deleteActivityLog.id,
        activityLogsId: deleteActivityLog.id,
      });

      await UserOrders.destroy({
        where: { orderId: orderId },
      });

      await orders.destroy({
        where: { orderId: orderId },
      });

      await documents.destroy({
        where: { orderId: orderId },
      });

      res.status(200).json(result, {
        message: "Order and associated documents deleted successfully",
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
        orderTotalPrice,
        orderType,
        orderNoSeries,
        orderDueDate,
        alamatPengiriman
      } = req.body;

      const { id } = req.params;
      const existingUser = await users.findByPk(id);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      async function generateRandomId(length) {
        let orderId;
        let isIdUnique = false;

        while (!isIdUnique) {
          const min = Math.pow(10, length - 1);
          const max = Math.pow(10, length) - 1;
          orderId = Math.floor(Math.random() * (max - min + 1)) + min;

          const existingOrder = await orders.findOne({ where: { orderId } });
          if (!existingOrder) {
            isIdUnique = true;
          }
        }

        return orderId;
      }
      const orderId = await generateRandomId(6);

      let order = await orders.create({
        orderId,
        orderTitle,
        orderQuantity,
        orderDetails,
        customerChannel,
        customerDetail,
        orderStatus,
        orderTotalPrice,
        orderType,
        orderNoSeries,
        orderDueDate,
        alamatPengiriman
      });

      let activityLog = await activitylogs.create({
        user: existingUser.name,
        activity: "Added an order",
        name: orderTitle,
        division: "Marketing",
      });

      await UserOrders.create({
        userId: id,
        orderId: order.id,
      });

      if (req.files && req.files.length > 0) {
        const filePromises = req.files.map(async (file) => {
          const filePath = path.join(__dirname, "uploads", file.filename);
          try {
            await documents.create({
              orderId: order.id,
              filename: file.filename,
              size: file.size,
              type: file.mimetype,
              path: filePath,
            });
          } catch (error) {
            console.error("Error saving file information:", error);
          }
        });
        await Promise.all(filePromises);
      }

      order = await orders.findByPk(order.id, {
        include: [{ model: documents }],
      });

      await UserActivityLogs.create({
        userId: id,
        id: activityLog.id,
        activityLogsId: activityLog.id,
      });

      res.json(order);
    } catch (err) {
      console.error("Error adding order:", err);
      res.status(500).json({ error: "Error adding order" });
    }
  }

  static async getAllOrders(req, res) {
    try {
      let result = await orders.findAll({
        include: [{ model: documents }, { model: users }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = OrderController;

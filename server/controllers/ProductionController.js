const { penyerahanBarangs, itemPenyerahanBarangs } = require("../models");

class ProductionController {
  static async getPenyerahanBarang(req, res) {
    try {
      let result = await penyerahanBarangs.findAll({
        where: { statusPenyerahan: "Barang siap diambil" },
        include: [{ model: itemPenyerahanBarangs }],
      });
      res.json(result)
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionController;

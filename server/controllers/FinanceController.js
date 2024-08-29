const { bukuBanks, itemBukuBanks } = require("../models");

class FinanceController {
  static async getDoneBukuBank(req, res) {
    try {
      let result = await bukuBanks.findAll({
        where: { statusBukuBank: "Done" },
        include: [{ model: itemBukuBanks }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getOngoingBukuBank(req, res) {
    try {
      let result = await bukuBanks.findAll({
        where: { statusBukuBank: "Ongoing" },
        include: [{ model: itemBukuBanks }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addNamaBank(req, res) {
    try {
      const { id } = req.params;
      const { namaBank } = req.body;
      let result = await bukuBanks.create({
        namaBank: namaBank,
        statusBukuBank: "Ongoing",
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addNewBukuBank(req, res) {
    const { id } = req.params;
    const { namaBank, dataBukuBank } = req.body;

    let findBank = await bukuBanks.findOne({
      where: { namaBank: namaBank },
    });

    if (dataBukuBank && Array.isArray(dataBukuBank)) {
      await Promise.all(
        dataBukuBank.map(async (data) => {
          if (!data.id) {
            await itemBukuBanks.create({
              bukuBankId: findBank.id,
              tanggal: data.tanggal,
              uraian: data.uraian,
              debet: data.debet,
              kredit: data.kredit,
              saldo: data.saldo,
              keterangan: data.keterangan,
            });
          } else {
            await itemBukuBanks.update(
              {
                tanggal: data.tanggal,
                uraian: data.uraian,
                debet: data.debet,
                kredit: data.kredit,
                saldo: data.saldo,
                keterangan: data.keterangan,
              },
              { where: { bukuBankId: findBank.id } }
            );
          }
        })
      );
    }
    res.json();
    try {
    } catch (error) {
      res.json(error);
    }
  }
  static async updateStatusDone(req, res) {
    try {
      const { id } = req.params;
      let result = await bukuBanks.update(
        {
          statusBukuBank: "Done",
        },
        { where: { id: id } }
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async checkIfNamaBankAvailable(req, res) {
    try {
      const { name } = req.params;
      let result = await bukuBanks.findAll({
        where: { namaBank: name },
      });
      if (result.length > 1) {
        return res.json({ available: false });
      } else {
        return res.json({ available: true });
      }
    } catch (error) {
      res.json(error);
    }
  }
  static async getPreviousSaldoAkhir(req, res) {
    try {
      const { name } = req.params;
      let latestBankData = await bukuBanks.findAll({
        where: { namaBank: name, statusBukuBank: "Done" },
        order: [["updatedAt", "DESC"]],
        limit: 1,
        include: [{ model: itemBukuBanks }],
      });
      res.json(latestBankData);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = FinanceController;

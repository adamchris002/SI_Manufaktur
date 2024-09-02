const {
  bukuBanks,
  itemBukuBanks,
  kasHarians,
  itemKasHarians,
} = require("../models");

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
      where: { namaBank: namaBank, statusBukuBank: "Ongoing" },
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
              { where: { id: data.id } }
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
  static async addKasHarian(req, res) {
    try {
      const { id } = req.params;
      const { judulKasHarian, dataKasHarian } = req.body;

      let findKasHarian = await kasHarians.findOne({
        where: { judulKasHarian },
      });

      let result;
      if (!findKasHarian) {
        result = await kasHarians.create({
          judulKasHarian,
          statusKasHarian: "Ongoing",
        });
      } else {
        result = findKasHarian;
      }

      if (dataKasHarian && Array.isArray(dataKasHarian)) {
        await Promise.all(
          dataKasHarian.map(async (data) => {
            if (!data.id) {
              await itemKasHarians.create({
                kasHarianId: result.id,
                tanggal: data.tanggal,
                uraian: data.uraian,
                nomorBp: data.nomorBp,
                pos: data.pos,
                debet: data.debet,
                kredit: data.kredit,
                sisa: data.sisa,
              });
            } else {
              await itemKasHarians.update(
                {
                  uraian: data.uraian,
                  pos: data.pos,
                  debet: data.debet,
                  kredit: data.kredit,
                  sisa: data.sisa,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }

      res.status(200).json({ message: "Kas Harian processed successfully" });
    } catch (error) {
      console.error(error.stack);
      res
        .status(500)
        .json({ error: "An error occurred while processing Kas Harian" });
    }
  }
  static async getOngoingKasHarian(req, res) {
    try {
      let result = await kasHarians.findOne({
        where: { statusKasHarian: "Ongoing" },
        include: [{ model: itemKasHarians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateStatusKasHarianDone(req, res) {
    try {
      const { id } = req.params;
      let result = await kasHarians.update(
        {
          statusKasHarian: "Done",
        },
        { where: { id: id } }
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getDoneKasHarian(req, res) {
    try {
      let result = await kasHarians.findAll({
        where: { statusKasHarian: "Done" },
        include: [{model: itemKasHarians}]
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = FinanceController;

const {
  bukuBanks,
  itemBukuBanks,
  kasHarians,
  itemKasHarians,
  posPembayarans,
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
        include: [{ model: itemKasHarians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async checkForDefaultPosPembayaran(req, res) {
    try {
      let findDefaultData = await posPembayarans.findAll({});
      if (findDefaultData.length === 0) {
        const defaultPosPembayaranData = [
          {
            kode: "A",
            uraian: "Saldo",
            kataKunci: "",
          },
          {
            kode: "A1",
            uraian: "Pembelian",
            kataKunci: "",
          },
          {
            kode: "A2",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "B1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "B2",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "B3",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C2",
            uraian: "Gaji",
            kataKunci: "",
          },
          {
            kode: "C3",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C4",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C6",
            uraian: "Honor",
            kataKunci: "",
          },
          {
            kode: "C7",
            uraian: "Biaya Pemeliharaan Gedung",
            kataKunci: "",
          },
          {
            kode: "C8",
            uraian: "Pinjaman",
            kataKunci: "",
          },
          {
            kode: "D",
            uraian: "Terima Kas",
            kataKunci: "",
          },
          {
            kode: "D1",
            uraian: "Listrik",
            kataKunci: "",
          },
          {
            kode: "D3",
            uraian: "Telepon",
            kataKunci: "",
          },
          {
            kode: "D4",
            uraian: "Sumbangan",
            kataKunci: "",
          },
          {
            kode: "E1",
            uraian: "Biaya Promosi",
            kataKunci: "",
          },
          {
            kode: "E2",
            uraian: "Biaya Entertainment",
            kataKunci: "",
          },
          {
            kode: "E3",
            uraian: "Biaya Dinas Luar",
            kataKunci: "",
          },
          {
            kode: "E4",
            uraian: "Biaya Perlengkapan Kantor",
            kataKunci: "",
          },
          {
            kode: "E5",
            uraian: "Biaya Perbaikan",
            kataKunci: "",
          },
          {
            kode: "E6",
            uraian: "Biaya Service Kendaraan",
            kataKunci: "",
          },
          {
            kode: "E7",
            uraian: "Biaya Bahan Bakar Kendaraan",
            kataKunci: "",
          },
          {
            kode: "E8",
            uraian: "Biaya Lain-lain",
            kataKunci: "",
          },
          {
            kode: "E9",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "E10",
            uraian: "Hutang",
            kataKunci: "",
          },
          {
            kode: "E11",
            uraian: "Hutang",
            kataKunci: "",
          },
          {
            kode: "E12",
            uraian: "Hutang",
            kataKunci: "",
          },
          {
            kode: "F1",
            uraian: "Biaya Asuransi Kendaraan / Gedung/ Karyawan",
            kataKunci: "",
          },
          {
            kode: "F2",
            uraian: "Biaya Pajak Kendaraan",
            kataKunci: "",
          },
          {
            kode: "F3",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "F4",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "F5",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "F6",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "G1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "G2",
            uraian: "Setor Antar Rekening",
            kataKunci: "",
          },
          {
            kode: "H1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "I",
            uraian: "Investasi",
            kataKunci: "",
          },
        ];

        if (
          defaultPosPembayaranData &&
          Array.isArray(defaultPosPembayaranData)
        ) {
          await Promise.all(
            defaultPosPembayaranData.map(async (data) => {
              await posPembayarans.create({
                kasHarianId: 1,
                kode: data.kode,
                uraian: data.uraian,
                kataKunci: data.kataKunci,
              });
            })
          );
        }
      }
      res.json();
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllPosPembayaran(req, res) {
    try {
      let result = await posPembayarans.findAll({});
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async savePosPembayaran(req, res) {
    try {
      const { id } = req.params;
      const { dataPosPembayaran } = req.body;
      if (dataPosPembayaran && Array.isArray(dataPosPembayaran)) {
        await Promise.all(
          dataPosPembayaran.map(async (data) => {
            if (!data.id) {
              await posPembayarans.create({
                kasHarianId: 1,
                kode: data.value,
                uraian: data.uraian,
                kataKunci: data.kataKunci,
              });
            } else {
              await posPembayarans.update(
                {
                  kode: data.value,
                  uraian: data.uraian,
                  kataKunci: data.kataKunci,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = FinanceController;

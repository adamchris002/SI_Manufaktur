const { INTEGER } = require("sequelize");
const {
  orders,
  documents,
  users,
  productionPlannings,
  UserProductionPlannings,
  estimasiBahanBakus,
  bahanBakuAkanDigunakans,
  rencanaJadwalProduksis,
  estimasiJadwalProduksis,
  activitylogs,
  UserActivityLogs,
} = require("../models");

class ProductionPlanningController {
  static async addNewProductionPlanning(req, res) {
    try {
      const {
        pemesan,
        tanggalPengirimanBarang,
        alamatKirimBarang,
        jenisCetakan,
        ukuran,
        ply,
        seri,
        kuantitas,
        isiPerBox,
        nomorator,
        contoh,
        plate,
        setting,
        estimasiBahanBaku,
        estimasiJadwal,
        selectedOrderId,
      } = req.body;

      const { id } = req.params;
      const existingUser = await users.findByPk(id);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      let productionPlanning = await productionPlannings.create({
        pemesan,
        alamatKirimBarang,
        tanggalPengirimanBarang,
        jenisCetakan,
        ukuran,
        kuantitas,
        isiPerBox,
        ply,
        seri,
        nomorator,
        contoh,
        plate,
        setting,
        catatan: String(existingUser.id),
      });

      await UserProductionPlannings.create({
        userId: id,
        productionPlanningId: productionPlanning.id,
      });

      if (estimasiBahanBaku && Array.isArray(estimasiBahanBaku)) {
        await Promise.all(
          estimasiBahanBaku.map(async (bahanBaku) => {
            const bahanBakuRecord = await estimasiBahanBakus.create({
              productionPlanningId: productionPlanning.id,
              jenis: bahanBaku.jenis,
              informasi: bahanBaku.informasiBahan,
            });

            // Loop through data in estimasiBahanBaku
            if (bahanBaku.data && Array.isArray(bahanBaku.data)) {
              await Promise.all(
                bahanBaku.data.map(async (dataItem, index) => {
                  await Promise.all(
                    dataItem.dataJenis.map(async (dataJenis) => {
                      await bahanBakuAkanDigunakans.create({
                        estimasiBahanBakuId: bahanBakuRecord.id,
                        estimasiKebutuhan: dataJenis.estimasiKebutuhan,
                        dataInformasi: dataJenis.informasiJenis,
                        jumlahKebutuhan: dataJenis.jumlahKebutuhan,
                        namaJenis: dataJenis.namaJenis,
                        groupIndex: index,
                        warna: dataJenis.warna,
                        waste: dataJenis.waste,
                      });
                    })
                  );
                })
              );
            }
          })
        );
      }
      if (estimasiJadwal && Array.isArray(estimasiJadwal)) {
        await Promise.all(
          estimasiJadwal.map(async (jadwal) => {
            const jadwalRecord = await estimasiJadwalProduksis.create({
              productionPlanningId: productionPlanning.id,
              bagian: jadwal.bagian,
            });

            if (jadwal.pekerjaan && Array.isArray(jadwal.pekerjaan)) {
              await Promise.all(
                jadwal.pekerjaan.map(async (dataPekerjaan) => {
                  const pekerjaanRecord = await rencanaJadwalProduksis.create({
                    estimasiJadwalProduksiId: jadwalRecord.id,
                    jenisPekerjaan: dataPekerjaan.jenisPekerjaan,
                    tanggalMulai: dataPekerjaan.tanggalMulai,
                    tanggalSelesai: dataPekerjaan.tanggalSelesai,
                    jumlahHari: dataPekerjaan.jumlahHari,
                  });
                })
              );
            } else {
              res.status(500).json({ error: "Error adding Estimasi Jadwal" });
            }
          })
        );
      } else {
        res.status(500).json({ error: "Error adding Estimasi Jadwal" });
      }
      await orders.update(
        {
          orderStatus: "Estimated",
        },
        {
          where: { id: selectedOrderId },
        }
      );

      let addProductionPlanningActivity = await activitylogs.create({
        user: existingUser.name,
        activity: "Add Production Plan",
        name: productionPlanning.pemesan,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: selectedOrderId,
        id: addProductionPlanningActivity.id,
        activityLogsId: addProductionPlanningActivity.id,
      });
      res.status(200).json({ message: "Estimasi Jadwal has been created" });
    } catch (error) {
      res.json(error);
    }
  }
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
  static async getOneOrder(req, res) {
    try {
      const { orderId } = req.query;
      const id = parseInt(orderId, 10);
      let result = await orders.findOne({
        where: { id: id },
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
  static async productionPlanningActivityLog(req, res) {
    try {
      let result = await activitylogs.findAll({
        where: { division: "Production Planning" },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllProductionPlan(req, res) {
    try {
      let result = await productionPlannings.findAll({});
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteProductionPlan(req, res) {
    try {
      const { id } = req.params;
      let result = await productionPlannings.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getProductionPlanWithData(req, res) {
    try {
      const { id } = req.params;
      let result = await productionPlannings.findOne({
        where: { id: id },
        include: [
          {
            model: estimasiBahanBakus,
            include: [
              {
                model: bahanBakuAkanDigunakans,
              },
            ],
          },
          {
            model: estimasiJadwalProduksis,
            include: [
              {
                model: rencanaJadwalProduksis,
              },
            ],
          },
        ],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateProductionPlan(req, res) {
    try {
      
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionPlanningController;

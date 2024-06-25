const {
  orders,
  documents,
  users,
  productionPlannings,
  UserProductionPlannings,
  estimasiBahanBakus,
  bahanBakuAkanDigunakans,
  jangkaWaktuProduksis,
  estimasiJangkaProduksis,
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
                bahanBaku.data.map(async (dataItem) => {
                  await Promise.all(
                    dataItem.dataJenis.map(async (dataJenis) => {
                      await bahanBakuAkanDigunakans.create({
                        estimasiBahanBakuId: bahanBakuRecord.id,
                        estimasiKebutuhan: dataJenis.estimasiKebutuhan,
                        dataInformasi: dataJenis.informasiJenis,
                        jumlahKebutuhan: dataJenis.jumlahKebutuhan,
                        namaJenis: dataJenis.namaJenis,
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
            console.log("Processing jadwal bagian:", jadwal.bagian);
            const jadwalRecord = await jangkaWaktuProduksis.create({
              productionPlanningId: productionPlanning.id,
              bagian: jadwal.bagian,
            });
            console.log("Created jadwalRecord:", jadwalRecord);

            if (jadwal.pekerjaan && Array.isArray(jadwal.pekerjaan)) {
              await Promise.all(
                jadwal.pekerjaan.map(async (dataPekerjaan) => {
                  console.log("Processing pekerjaan:", dataPekerjaan);
                  const pekerjaanRecord = await estimasiJangkaProduksis.create({
                    jangkaWaktuProduksiId: jadwalRecord.id,
                    jenisPekerjaan: dataPekerjaan.jenisPekerjaan,
                    tanggalMulai: dataPekerjaan.tanggalMulai,
                    tanggalSelesai: dataPekerjaan.tanggalSelesai,
                    jumlahHari: dataPekerjaan.jumlahHari,
                  });
                  console.log("Created pekerjaanRecord:", pekerjaanRecord);
                })
              );
            } else {
              console.log("No pekerjaan found for jadwal:", jadwal.bagian);
            }
          })
        );
      } else {
        console.log("estimasiJadwal is either null or not an array");
      }
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

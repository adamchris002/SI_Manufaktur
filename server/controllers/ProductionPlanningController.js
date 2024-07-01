const { Op } = require("sequelize");
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
        catatan,
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
        catatan: String(catatan),
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
      const { id } = req.params;
      const {
        productionPlanId,
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

      let productionPlan = await productionPlannings.findOne({
        where: { id: productionPlanId },
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

      let existingUser = users.findOne({
        where: { id: id },
      });

      let result = await productionPlan.update(
        {
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
        },
        {
          where: { productionPlanId },
        }
      );

      let updateProductionPlanningActivity = await activitylogs.create({
        user: existingUser.name,
        activity: "Update ProductionPlan",
        name: pemesan,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: id,
        id: updateProductionPlanningActivity.id,
        activityLogsId: updateProductionPlanningActivity.id,
      });

      if (estimasiBahanBaku && Array.isArray(estimasiBahanBaku)) {
        await Promise.all(
          estimasiBahanBaku.map(async (data) => {
            let bahanBakuRecord;

            if (!data.id) {
              bahanBakuRecord = await estimasiBahanBakus.create({
                jenis: data.jenis,
                informasi: data.informasiBahan,
                productionPlanningId: data.productionPlanningId,
              });

              // Assign the newly created record's ID to data.id
              data.id = bahanBakuRecord.id;
            } else {
              bahanBakuRecord = await estimasiBahanBakus.findOne({
                where: { id: data.id },
              });
            }

            await Promise.all(
              data.bahanBakuAkanDigunakans.map(
                async (dataItem, dataItemIndex) => {
                  await Promise.all(
                    dataItem.dataJenis.map(async (dataJenis) => {
                      let dataJenisRecord;

                      if (dataJenis.id) {
                        dataJenisRecord = await bahanBakuAkanDigunakans.findOne(
                          {
                            where: {
                              id: dataJenis.id,
                              estimasiBahanBakuId: data.id,
                            },
                          }
                        );
                      }

                      if (dataJenisRecord) {
                        await dataJenisRecord.update({
                          namaJenis: dataJenis.namaJenis,
                          dataInformasi: dataJenis.dataInformasi,
                          warna: dataJenis.warna,
                          estimasiKebutuhan: dataJenis.estimasiKebutuhan,
                          waste: dataJenis.waste,
                          jumlahKebutuhan: dataJenis.jumlahKebutuhan,
                        });
                      } else if (!dataJenis.id) {
                        await bahanBakuAkanDigunakans.create({
                          estimasiBahanBakuId: data.id,
                          namaJenis: dataJenis.namaJenis,
                          groupIndex: dataItemIndex,
                          dataInformasi: dataJenis.dataInformasi,
                          warna: dataJenis.warna,
                          estimasiKebutuhan: dataJenis.estimasiKebutuhan,
                          waste: dataJenis.waste,
                          jumlahKebutuhan: dataJenis.jumlahKebutuhan,
                        });
                      }
                    })
                  );
                }
              )
            );
          })
        );
      }

      if (estimasiJadwal && Array.isArray(estimasiJadwal)) {
        await Promise.all(
          estimasiJadwal.map(async (data) => {
            let dataJenisJadwal;
            if (!data.id) {
              dataJenisJadwal = await estimasiJadwalProduksis.create({
                productionPlanningId: data.productionPlanningId,
                bagian: data.bagian,
              });
              data.id = dataJenisJadwal.id;
            } else {
              jadwalProduksiRecord = await estimasiJadwalProduksis.findOne({
                where: { id: data.id },
              });
            }
            await Promise.all(
              data.rencanaJadwalProdukses.map(async (daftarRencana) => {
                let dataPekerjaanRecord;
                if (daftarRencana.id) {
                  dataPekerjaanRecord = await rencanaJadwalProduksis.findOne({
                    where: {
                      id: daftarRencana.id,
                      estimasiJadwalProduksiId: data.id,
                    },
                  });
                }
                if (dataPekerjaanRecord) {
                  await dataPekerjaanRecord.update({
                    jenisPekerjaan: daftarRencana.jenisPekerjaan,
                    tanggalMulai: daftarRencana.tanggalMulai,
                    tanggalSelesai: daftarRencana.tanggalSelesai,
                    jumlahHari: daftarRencana.jumlahHari,
                  });
                } else if (!daftarRencana.id) {
                  await rencanaJadwalProduksis.create({
                    estimasiJadwalProduksiId: data.id,
                    jenisPekerjaan: daftarRencana.jenisPekerjaan,
                    tanggalMulai: daftarRencana.tanggalMulai,
                    tanggalSelesai: daftarRencana.tanggalSelesai,
                    jumlahHari: daftarRencana.jumlahHari,
                  });
                }
              })
            );
          })
        );
      }

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async removeJadwal(req, res) {
    try {
      const {id} = req.params
      // console.log(id)
      let result = await rencanaJadwalProduksis.destroy({
        where: {id: id}
      })
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteJadwal(req, res) {
    try {
      const {id} = req.params
      let result = await estimasiJadwalProduksis.destroy({
        where: {id: id}
      })
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteJenisBahanBaku(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      let removeEstimasiBahanBaku = await estimasiBahanBakus.destroy({
        where: { id: id },
      });
      res.json(removeEstimasiBahanBaku);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteGroupBahanBaku(req, res) {
    try {
      const { estimasiBahanBakuId, groupIndex } = req.query;
      let removeGroupBahanBaku = await bahanBakuAkanDigunakans.destroy({
        where: {
          estimasiBahanBakuId: estimasiBahanBakuId,
          groupIndex: groupIndex,
        },
      });
      res.json(removeGroupBahanBaku);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteBahanBakuID(req, res) {
    try {
      const { id } = req.params;
      let deleteBahanBakuRow = await bahanBakuAkanDigunakans.destroy({
        where: { id: id },
      });
      res.json(deleteBahanBakuRow);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionPlanningController;

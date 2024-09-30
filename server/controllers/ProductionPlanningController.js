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
  rincianCetakans,
  perincians,
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
        rincianCetakan,
        perincian,
        orderId,
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
        orderId,
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
                  await rencanaJadwalProduksis.create({
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
      if (rincianCetakan && Array.isArray(rincianCetakan)) {
        await Promise.all(
          rincianCetakan.map(async (data) => {
            await rincianCetakans.create({
              productionPlanningId: productionPlanning.id,
              namaCetakan: data.namaCetakan,
              ukuran: data.ukuran,
              jenisKertas: data.jenisKertas,
              beratKertas: data.beratKertas,
              warna: data.warna,
              kuantitas: data.kuantitas,
              ply: data.ply,
              isi: data.isi,
              nomorator: data.nomorator,
              keterangan: data.keterangan,
            });
          })
        );
      }
      if (perincian && Array.isArray(perincian)) {
        await Promise.all(
          perincian.map(async (data) => {
            await perincians.create({
              productionPlanningId: productionPlanning.id,
              namaRekanan: data.namaRekanan,
              keterangan: data.keterangan,
              jenisCetakan: data.jenisCetakan,
              isi: data.isi,
              harga: data.harga,
            });
          })
        );
      }
      await orders.update(
        {
          orderStatus: "Estimated",
        },
        {
          where: { id: orderId },
        }
      );

      let addProductionPlanningActivity = await activitylogs.create({
        user: existingUser.name,
        activity: `Menambahkan perencanaan produksi dengan id ${productionPlanning.id}`,
        name: productionPlanning.pemesan,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: id,
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

  static async getAllProductionPlanStatusEstimated(req, res) {
    try {
      let allEstimatedOrder = await orders.findAll({
        where: { orderStatus: "Estimated" },
      });
      let estimatedOrderIds = allEstimatedOrder.map((order) => order.id);
      let result = await productionPlannings.findAll({
        where: { orderId: { [Op.in]: estimatedOrderIds } },
        include: [
          {
            model: estimasiBahanBakus,
            include: [{ model: bahanBakuAkanDigunakans }],
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
  static async getAllProductionPlan(req, res) {
    try {
      let result = await productionPlannings.findAll({
        include: [
          { model: rincianCetakans },
          { model: perincians },
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
  static async deleteProductionPlan(req, res) {
    try {
      const { userId, productionPlanId } = req.query;
      let productionPlanData = await productionPlannings.findOne({
        where: { id: productionPlanId },
      });

      let oneOrder = await orders.findOne({
        where: { id: productionPlanData.orderId },
      });

      await orders.update(
        {
          orderStatus: "Ongoing",
        },
        { where: { id: productionPlanData.orderId } }
      );

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteProductionPlan = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus perencanaan produksi dengan id ${productionPlanId}`,
        name: oneOrder.customerDetail,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteProductionPlan.id,
        activityLogsId: deleteProductionPlan.id,
      });
      let result = await productionPlannings.destroy({
        where: { id: productionPlanId },
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
          { model: rincianCetakans },
          { model: perincians },
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
        rincianCetakan,
        perincian,
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

      let existingUser = await users.findOne({
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
        activity: `Mengedit perencanaan produksi dengan id ${productionPlanId}`,
        name: jenisCetakan,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: id,
        id: updateProductionPlanningActivity.id,
        activityLogsId: updateProductionPlanningActivity.id,
      });

      if (perincian && Array.isArray(perincian)) {
        await Promise.all(
          perincian.map(async (data) => {
            if (!data.id) {
              await perincians.create({
                productionPlanningId: productionPlanId,
                namaRekanan: data.namaRekanan,
                keterangan: data.keterangan,
                jenisCetakan: data.jenisCetakan,
                isi: data.isi,
                harga: data.harga,
              });
            } else {
              await perincians.update(
                {
                  namaRekanan: data.namaRekanan,
                  keterangan: data.keterangan,
                  jenisCetakan: data.jenisCetakan,
                  isi: data.isi,
                  harga: data.harga,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }

      if (rincianCetakan && Array.isArray(rincianCetakan)) {
        await Promise.all(
          rincianCetakan.map(async (data) => {
            if (!data.id) {
              await rincianCetakans.create({
                productionPlanningId: productionPlanId,
                namaCetakan: data.namaCetakan,
                ukuran: data.ukuran,
                jenisKertas: data.jenisKertas,
                beratKertas: data.beratKertas,
                warna: data.warna,
                kuantitas: data.kuantitas,
                ply: data.ply,
                isi: data.isi,
                nomorator: data.nomorator,
                keterangan: data.keterangan,
              });
            } else {
              await rincianCetakans.update(
                {
                  namaCetakan: data.namaCetakan,
                  ukuran: data.ukuran,
                  jenisKertas: data.jenisKertas,
                  beratKertas: data.beratKertas,
                  warna: data.warna,
                  kuantitas: data.kuantitas,
                  ply: data.ply,
                  isi: data.isi,
                  nomorator: data.nomorator,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }

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
            } else {
              dataJenisJadwal = await estimasiJadwalProduksis.update(
                {
                  bagian: data.bagian,
                },
                { where: { id: data.id } }
              );
            }
            await Promise.all(
              data.rencanaJadwalProdukses.map(async (daftarRencana) => {
                let dataPekerjaanRecord;
                if (daftarRencana.id) {
                  dataPekerjaanRecord = await rencanaJadwalProduksis.findOne({
                    where: {
                      id: daftarRencana.id,
                      estimasiJadwalProduksiId: daftarRencana.estimasiJadwalPr,
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
      const { id } = req.params;
      const { userId, productionPlanId, estimasiJadwalProduksiId } = req.query;

      const findOneEstimasiJadwalProduksi =
        await estimasiJadwalProduksis.findOne({
          where: { id: estimasiJadwalProduksiId },
        });

      let findOneRencanaJadwal = await rencanaJadwalProduksis.findOne({
        where: { id: id },
      });

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteProductionPlan = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus jadwal pekerjaan dari bagian ${findOneEstimasiJadwalProduksi.bagian}, dari perencanaan produksi dengan id ${productionPlanId}`,
        name: findOneRencanaJadwal.jenisPekerjaan,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteProductionPlan.id,
        activityLogsId: deleteProductionPlan.id,
      });

      let result = await rencanaJadwalProduksis.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteJadwal(req, res) {
    try {
      const { id } = req.params;
      const { userId, productionPlanId } = req.query;

      let findOneEstimasiJadwalProduksi = await estimasiJadwalProduksis.findOne(
        {
          where: { id: id },
        }
      );

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteProductionPlan = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus jadwal bagian ${findOneEstimasiJadwalProduksi.bagian}, dari perencanaan produksi dengan id ${productionPlanId}`,
        name: findOneEstimasiJadwalProduksi.bagian,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteProductionPlan.id,
        activityLogsId: deleteProductionPlan.id,
      });

      let result = await estimasiJadwalProduksis.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteJenisBahanBaku(req, res) {
    try {
      const { id } = req.params;
      const { userId, productionPlanId } = req.query;

      const findEstimasiBahanBakuData = await estimasiBahanBakus.findOne({
        where: { id: id },
      });

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteProductionPlan = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus group ${findEstimasiBahanBakuData.jenis}, dari perencanaan produksi dengan id ${productionPlanId}`,
        name: findEstimasiBahanBakuData.jenis,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteProductionPlan.id,
        activityLogsId: deleteProductionPlan.id,
      });

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
      const { userId, productionPlanId, estimasiBahanBakuId, groupIndex } =
        req.query;
      let oneGroupBahanBaku = await bahanBakuAkanDigunakans.findOne({
        where: {
          estimasiBahanBakuId: estimasiBahanBakuId,
          groupIndex: groupIndex,
        },
      });

      let findEstimasiBahanBakuData = await estimasiBahanBakus.findOne({
        where: { id: estimasiBahanBakuId },
      });

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteProductionPlan = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus item bahan baku dari group ${findEstimasiBahanBakuData.jenis}, dari perencanaan produksi dengan id ${productionPlanId}`,
        name: oneGroupBahanBaku.namaJenis,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteProductionPlan.id,
        activityLogsId: deleteProductionPlan.id,
      });

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
      const { userId, productionPlanId } = req.query;

      let oneBahanBakuAkanDigunakans = await bahanBakuAkanDigunakans.findOne({
        where: { id: id },
      });

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteProductionPlan = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus item bahan baku dari perencanaan produksi dengan id ${productionPlanId}`,
        name: oneBahanBakuAkanDigunakans.namaJenis,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteProductionPlan.id,
        activityLogsId: deleteProductionPlan.id,
      });

      let deleteBahanBakuRow = await bahanBakuAkanDigunakans.destroy({
        where: { id: id },
      });
      res.json(deleteBahanBakuRow);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemRincianCetakan(req, res) {
    try {
      const { id } = req.params;
      const { userId, productionPlanId } = req.query;

      let findOneRincianCetakan = await rincianCetakans.findOne({
        where: { id: id },
      });

      let findOnePerincians = await perincians.findOne({
        where: { id: id },
      });

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteProductionPlan = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus item rincian cetakan ${findOneRincianCetakan.namaCetakan} dan perincian dengan perencanaan produksi dengan id ${productionPlanId}`,
        name: findOneRincianCetakan.namaCetakan,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteProductionPlan.id,
        activityLogsId: deleteProductionPlan.id,
      });

      let result = await rincianCetakans.destroy({
        where: { id: id },
      });

      await perincians.destroy({
        where: { id: findOnePerincians.id },
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemPerincian(req, res) {
    try {
      const { id } = req.params;
      let result = await perincians.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  static async getUserLama(req, res) {
    try {
      let result = await users.findAll({
        where: {
          department: "Production Planning",
        },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getUserBaru(req, res) {
    try {
      let result = await users.findAll({
        where: {
          department: null,
        },
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateUserCredentials(req, res) {
    try {
      const { id } = req.params;
      const { userData } = req.body;

      if (userData && Array.isArray(userData)) {
        await Promise.all(
          userData.map(async (result) => {
            await users.update(
              {
                department: result.department,
                role: result.role,
                lokasi: result.lokasi,
              },
              { where: { id: result.id } }
            );
          })
        );
      }

      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Mengupdate kredensial user/menambahkan user ke dalam divisi production planning`,
        name: `Divisi: Production Planning`,
        division: "Production Planning",
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogsId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionPlanningController;

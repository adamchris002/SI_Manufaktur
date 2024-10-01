const {
  penyerahanBarangs,
  itemPenyerahanBarangs,
  laporanProduksis,
  personils,
  bahanLaporanProduksis,
  jadwalProduksis,
  UserLaporanProduksis,
  orders,
  laporanLimbahProduksis,
  UserLaporanLimbahProduksis,
  itemLaporanLimbahProduksis,
  laporanSampahs,
  itemLaporanSampahs,
  productionPlannings,
  activitylogs,
  UserActivityLogs,
  users,
} = require("../models");
const dayjs = require("dayjs");

class ProductionController {
  static async getPenyerahanBarang(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await penyerahanBarangs.findAll({
        where: {
          statusPenyerahan: "Barang siap diambil",
          lokasi: findUser.lokasi,
        },
        include: [{ model: itemPenyerahanBarangs }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addKegiatanProduksi(req, res) {
    try {
      const { id } = req.params;
      const { dataProduksi, jadwalPracetak, personil, tanggalPengiriman } =
        req.body;

      const findUser = await users.findOne({
        where: { id: id },
      });

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      const convertUnit = (beratAwal, beratAkhir) => {
        let { value: valueAwal, unit: unitAwal } =
          separateValueAndUnit(beratAwal);
        const { value: valueAkhir, unit: unitAkhir } =
          separateValueAndUnit(beratAkhir);

        if (unitAwal === "Ton" && unitAkhir === "Kg") {
          valueAwal = valueAwal * 1000 - valueAkhir;
          if (valueAwal < 1000) {
            return `${valueAwal} Kg`;
          } else {
            return `${valueAwal / 1000} Ton`;
          }
        } else if (unitAwal === unitAkhir) {
          return `${valueAwal - valueAkhir} ${unitAwal}`;
        }
      };

      let result = await laporanProduksis.create({
        tanggalProduksi: dataProduksi.tanggalProduksi,
        noOrderProduksi: dataProduksi.noOrderProduksi,
        idProductionPlanning: dataProduksi.idProductionPlanning,
        jenisCetakan: dataProduksi.jenisCetakan,
        mesin: dataProduksi.mesin,
        dibuatOleh: dataProduksi.dibuatOleh,
        tahapProduksi: dataProduksi.tahapProduksi,
        tanggalPengiriman: tanggalPengiriman,
        lokasi: findUser.lokasi,
      });

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            let beratAwalNewValue;
            try {
              beratAwalNewValue = convertUnit(data.beratAwal, data.beratAkhir);
            } catch (err) {
              throw new Error(`Error converting units: ${err.message}`);
            }

            await bahanLaporanProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jenis: data.jenis,
              kode: data.kode,
              beratAwal: beratAwalNewValue,
              beratAkhir: data.beratAkhir,
              keterangan: data.keterangan,
            });
          })
        );
      }

      if (personil && Array.isArray(personil)) {
        await Promise.all(
          personil.map(async (data) => {
            await personils.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              nama: data.nama,
            });
          })
        );
      }

      if (jadwalPracetak && Array.isArray(jadwalPracetak)) {
        await Promise.all(
          jadwalPracetak.map(async (data) => {
            await jadwalProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jamAwalProduksi: data.jamAwalProduksi,
              jamAkhirProduksi: data.jamAkhirProduksi,
              noOrderProduksi: data.noOrderProduksi,
              jenisCetakan: data.jenisCetakan,
              perolehanCetak: data.perolehanCetakan,
              waste: data.waste,
              keterangan: data.keterangan,
            });
          })
        );
      }

      await orders.update(
        {
          orderStatus: "Processed",
        },
        { where: { id: dataProduksi.noOrderProduksi } }
      );
[]
      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan kegiatan produksi pracetak dengan id ${result.id}`,
        name: `No Order: ${dataProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      await UserLaporanProduksis.create({
        userId: parseInt(id),
        laporanProduksiId: parseInt(result.id),
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getProductionData(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await laporanProduksis.findAll({
        where: { lokasi: findUser.lokasi },
        include: [
          { model: personils },
          { model: jadwalProduksis },
          { model: bahanLaporanProduksis },
        ],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getOneProductionData(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await laporanProduksis.findOne({
        where: { id: id, lokasi: findUser.lokasi },
        include: [
          { model: personils },
          { model: jadwalProduksis },
          { model: bahanLaporanProduksis },
        ],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editKegiatanProduksiPracetak(req, res) {
    try {
      const { id } = req.params;
      const { personil, dataProduksi, jadwalPracetak } = req.body;

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      const convertUnit = (beratAwal, beratAkhir) => {
        let { value: valueAwal, unit: unitAwal } =
          separateValueAndUnit(beratAwal);
        const { value: valueAkhir, unit: unitAkhir } =
          separateValueAndUnit(beratAkhir);

        if (unitAwal === "Ton" && unitAkhir === "Kg") {
          valueAwal = valueAwal * 1000 - valueAkhir;
          if (valueAwal < 1000) {
            return `${valueAwal} Kg`;
          } else {
            return `${valueAwal / 1000} Ton`;
          }
        } else if (unitAwal === unitAkhir) {
          return `${valueAwal - valueAkhir} ${unitAwal}`;
        }
      };

      let result = await laporanProduksis.update(
        {
          tanggalProduksi: dataProduksi.tanggalProduksi,
          noOrderProduksi: dataProduksi.noOrderProduksi,
          jenisCetakan: dataProduksi.jenisCetakan,
          mesin: dataProduksi.mesin,
          dibuatOleh: dataProduksi.dibuatOleh,
        },
        { where: { id: dataProduksi.id } }
      );

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            let beratAwalNewValue;
            try {
              beratAwalNewValue = convertUnit(data.beratAwal, data.beratAkhir);
            } catch (err) {
              throw new Error(`Error converting units: ${err.message}`);
            }
            if (!data.id) {
              await bahanLaporanProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jenis: data.jenis,
                kode: data.kode,
                beratAwal: beratAwalNewValue,
                beratAkhir: data.beratAkhir,
                keterangan: data.keterangan,
              });
            } else {
              await bahanLaporanProduksis.update(
                {
                  jenis: data.jenis,
                  kode: data.kode,
                  beratAwal: beratAwalNewValue,
                  beratAkhir: data.beratAkhir,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      if (personil && Array.isArray(personil)) {
        await Promise.all(
          personil.map(async (data) => {
            if (!data.id) {
              await personils.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                nama: data.nama,
              });
            } else {
              await personils.update(
                {
                  nama: data.nama,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      if (jadwalPracetak && Array.isArray(jadwalPracetak)) {
        await Promise.all(
          jadwalPracetak.map(async (data) => {
            if (!data.id) {
              await jadwalProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jamAwalProduksi: data.jamAwalProduksi,
                jamAkhirProduksi: data.jamAkhirProduksi,
                noOrderProduksi: data.noOrderProduksi,
                jenisCetakan: data.jenisCetakan,
                perolehanCetak: data.perolehanCetakan,
                waste: data.waste,
                keterangan: data.keterangan,
              });
            } else {
              await jadwalProduksis.update(
                {
                  jamAwalProduksi: data.jamAwalProduksi,
                  jamAkhirProduksi: data.jamAkhirProduksi,
                  noOrderProduksi: data.noOrderProduksi,
                  jenisCetakan: data.jenisCetakan,
                  perolehanCetak: data.perolehanCetakan,
                  waste: data.waste,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }

      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Mengedit kegiatan produksi pracetak dengan id ${dataProduksi.id}`,
        name: `ID Pesanan: ${dataProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deletePersonil(req, res) {
    try {
      const { id } = req.params;
      const { userId, tahapProduksi, noOrderProduksi } = req.query;

      let findOnePersonil = await personils.findOne({
        where: { id: id },
      });
      let result = await personils.destroy({
        where: { id: id },
      });

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus personil ${findOnePersonil.nama} dari kegiatan produksi (${tahapProduksi}) dengan ID Pesanan ${noOrderProduksi}`,
        name: `ID Pesanan: ${noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteBahanProduksiPracetak(req, res) {
    try {
      const { id } = req.params;
      const { userId, noOrderProduksi } = req.query;

      const findOneBahanLaporanProduksi = await bahanLaporanProduksis.findOne({
        where: { id: id },
      });

      let result = await bahanLaporanProduksis.destroy({
        where: { id: id },
      });

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus item bahan jenis ${findOneBahanLaporanProduksi.jenis} dari bahan laporan produksi dari ${findOneBahanLaporanProduksi.tahapProduksi}`,
        name: `No Pesanan: ${noOrderProduksi}`,
        division: "Prodduction",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteJadwalProduksiPracetak(req, res) {
    try {
      const { id } = req.params;
      const { userId, noOrderProduksi } = req.query;

      let findOneJadwalProduksi = await jadwalProduksis.findOne({
        where: { id: id },
      });

      let result = await jadwalProduksis.destroy({
        where: { id: id },
      });
      let findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus jadwal produksi dari ${findOneJadwalProduksi.tahapProduksi} dengan ID Pesanan ${noOrderProduksi}`,
        name: `No Pesanan: ${noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteKegiatanProduksi(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      let findOneLaporanProduksi = await laporanProduksis.findOne({
        where: { id: id },
      });

      let result = await laporanProduksis.destroy({
        where: { id: id },
      });

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus Laporan Produksi tahap ${findOneLaporanProduksi.tahapProduksi} dengan ID Pesanan ${findOneLaporanProduksi.noOrderProduksi}`,
        name: `ID Pesanan: ${findOneLaporanProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addKegiatanProduksiFitur(req, res) {
    try {
      const { id } = req.params;
      const { personil, dataProduksi, jadwalFitur, tanggalPengiriman } =
        req.body;

      const findUser = await users.findOne({
        where: { id: id },
      });

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      const convertUnit = (beratAwal, beratAkhir) => {
        let { value: valueAwal, unit: unitAwal } =
          separateValueAndUnit(beratAwal);
        const { value: valueAkhir, unit: unitAkhir } =
          separateValueAndUnit(beratAkhir);

        if (unitAwal === "Ton" && unitAkhir === "Kg") {
          valueAwal = valueAwal * 1000 - valueAkhir;
          if (valueAwal < 1000) {
            return `${valueAwal} Kg`;
          } else {
            return `${valueAwal / 1000} Ton`;
          }
        } else if (unitAwal === unitAkhir) {
          return `${valueAwal - valueAkhir} ${unitAwal}`;
        }
      };

      let getPrevKegiatanProduksi = await laporanProduksis.findOne({
        where: {
          noOrderProduksi: dataProduksi.noOrderProduksi,
          tahapProduksi: "Produksi Cetak",
        },
      });

      await getPrevKegiatanProduksi.update({
        statusLaporan: "Done",
      });
      let result = await laporanProduksis.create({
        tanggalProduksi: dataProduksi.tanggalProduksi,
        noOrderProduksi: dataProduksi.noOrderProduksi,
        idProductionPlanning: dataProduksi.idProductionPlanning,
        jenisCetakan: dataProduksi.jenisCetakan,
        mesin: dataProduksi.mesin,
        dibuatOleh: dataProduksi.dibuatOleh,
        tahapProduksi: dataProduksi.tahapProduksi,
        tanggalPengiriman: tanggalPengiriman,
        lokasi: findUser.lokasi,
      });

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            let beratAwalNewValue;
            try {
              beratAwalNewValue = convertUnit(data.beratAwal, data.beratAkhir);
            } catch (err) {
              throw new Error(`Error converting units: ${err.message}`);
            }
            await bahanLaporanProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jenis: data.jenis,
              kode: data.kode,
              beratAwal: beratAwalNewValue,
              beratAkhir: data.beratAkhir,
              keterangan: data.keterangan,
            });
          })
        );
      }
      if (personil && Array.isArray(personil)) {
        await Promise.all(
          personil.map(async (data) => {
            await personils.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              nama: data.nama,
            });
          })
        );
      }
      if (jadwalFitur && Array.isArray(jadwalFitur)) {
        await Promise.all(
          jadwalFitur.map(async (data) => {
            await jadwalProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jamAwalProduksi: data.jamAwalProduksi,
              jamAkhirProduksi: data.jamAkhirProduksi,
              noOrderProduksi: data.noOrderProduksi,
              jenisCetakan: data.jenisCetakan,
              nomoratorAwal: data.nomoratorAwal,
              nomoratorAkhir: data.nomoratorAkhir,
              perolehanCetak: data.perolehanCetakan,
              waste: data.waste,
              keterangan: data.keterangan,
            });
          })
        );
      }
      await UserLaporanProduksis.create({
        userId: parseInt(id),
        laporanProduksiId: parseInt(result.id),
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan kegiatan produksi fitur dengan id ${result.id}`,
        name: `No Order: ${dataProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addKegiatanProduksiCetak(req, res) {
    try {
      const { id } = req.params;
      const { personil, jadwalCetak, dataProduksi, tanggalPengiriman } =
        req.body;

      const findUser = await users.findOne({
        where: { id: id },
      });

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      const convertUnit = (beratAwal, beratAkhir) => {
        let { value: valueAwal, unit: unitAwal } =
          separateValueAndUnit(beratAwal);
        const { value: valueAkhir, unit: unitAkhir } =
          separateValueAndUnit(beratAkhir);

        if (unitAwal === "Ton" && unitAkhir === "Kg") {
          valueAwal = valueAwal * 1000 - valueAkhir;
          if (valueAwal < 1000) {
            return `${valueAwal} Kg`;
          } else {
            return `${valueAwal / 1000} Ton`;
          }
        } else if (unitAwal === unitAkhir) {
          return `${valueAwal - valueAkhir} ${unitAwal}`;
        }
      };

      let getPrevKegiatanProduksi = await laporanProduksis.findOne({
        where: {
          noOrderProduksi: dataProduksi.noOrderProduksi,
          tahapProduksi: "Produksi Pracetak",
        },
      });

      await getPrevKegiatanProduksi.update({
        statusLaporan: "Done",
      });

      let result = await laporanProduksis.create({
        tanggalProduksi: dataProduksi.tanggalProduksi,
        idProductionPlanning: dataProduksi.idProductionPlanning,
        noOrderProduksi: dataProduksi.noOrderProduksi,
        jenisCetakan: dataProduksi.jenisCetakan,
        mesin: dataProduksi.mesin,
        dibuatOleh: dataProduksi.dibuatOleh,
        tahapProduksi: dataProduksi.tahapProduksi,
        tanggalPengiriman: tanggalPengiriman,
        lokasi: findUser.lokasi,
      });

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            let beratAwalNewValue;
            try {
              beratAwalNewValue = convertUnit(data.beratAwal, data.beratAkhir);
            } catch (err) {
              throw new Error(`Error converting units: ${err.message}`);
            }
            await bahanLaporanProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jenis: data.jenis,
              kode: data.kode,
              beratAwal: beratAwalNewValue,
              beratAkhir: data.beratAkhir,
              keterangan: data.keterangan,
            });
          })
        );
      }

      if (personil && Array.isArray(personil)) {
        await Promise.all(
          personil.map(async (data) => {
            await personils.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              nama: data.nama,
            });
          })
        );
      }

      if (jadwalCetak && Array.isArray(jadwalCetak)) {
        await Promise.all(
          jadwalCetak.map(async (data) => {
            await jadwalProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jamAwalProduksi: data.jamAwalProduksi,
              jamAkhirProduksi: data.jamAkhirProduksi,
              noOrderProduksi: data.noOrderProduksi,
              jenisCetakan: data.jenisCetakan,
              perolehanCetak: data.perolehanCetakan,
              sobek: data.sobek,
              kulit: data.kulit,
              gelondong: data.gelondong,
              sampah: data.sampah,
              rollHabis: data.rollHabis,
              rollSisa: data.rollSisa,
              keterangan: data.keterangan,
            });
          })
        );
      }

      await UserLaporanProduksis.create({
        userId: parseInt(id),
        laporanProduksiId: parseInt(result.id),
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan kegiatan produksi Cetak dengan id ${result.id}`,
        name: `No Order: ${dataProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      await UserLaporanProduksis.create({
        userId: parseInt(id),
        laporanProduksiId: parseInt(result.id),
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editKegiatanProduksiCetak(req, res) {
    try {
      const { id } = req.params;
      const { personil, dataProduksi, jadwalCetak } = req.body;

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      const convertUnit = (beratAwal, beratAkhir) => {
        let { value: valueAwal, unit: unitAwal } =
          separateValueAndUnit(beratAwal);
        const { value: valueAkhir, unit: unitAkhir } =
          separateValueAndUnit(beratAkhir);

        if (unitAwal === "Ton" && unitAkhir === "Kg") {
          valueAwal = valueAwal * 1000 - valueAkhir;
          if (valueAwal < 1000) {
            return `${valueAwal} Kg`;
          } else {
            return `${valueAwal / 1000} Ton`;
          }
        } else if (unitAwal === unitAkhir) {
          return `${valueAwal - valueAkhir} ${unitAwal}`;
        }
      };

      let result = await laporanProduksis.update(
        {
          tanggalProduksi: dataProduksi.tanggalProduksi,
          noOrderProduksi: dataProduksi.noOrderProduksi,
          jenisCetakan: dataProduksi.jenisCetakan,
          mesin: dataProduksi.mesin,
          dibuatOleh: dataProduksi.dibuatOleh,
        },
        { where: { id: dataProduksi.id } }
      );

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            let beratAwalNewValue;
            try {
              beratAwalNewValue = convertUnit(data.beratAwal, data.beratAkhir);
            } catch (err) {
              throw new Error(`Error converting units: ${err.message}`);
            }
            if (!data.id) {
              await bahanLaporanProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jenis: data.jenis,
                kode: data.kode,
                beratAwal: beratAwalNewValue,
                beratAkhir: data.beratAkhir,
                keterangan: data.keterangan,
              });
            } else {
              await bahanLaporanProduksis.update(
                {
                  jenis: data.jenis,
                  kode: data.kode,
                  beratAwal: beratAwalNewValue,
                  beratAkhir: data.beratAkhir,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      if (personil && Array.isArray(personil)) {
        await Promise.all(
          personil.map(async (data) => {
            if (!data.id) {
              await personils.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                nama: data.nama,
              });
            } else {
              await personils.update(
                {
                  nama: data.nama,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      if (jadwalCetak && Array.isArray(jadwalCetak)) {
        await Promise.all(
          jadwalCetak.map(async (data) => {
            if (!data.id) {
              await jadwalProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jamAwalProduksi: data.jamAwalProduksi,
                jamAkhirProduksi: data.jamAkhirProduksi,
                noOrderProduksi: parseFloat(data.noOrderProduksi),
                jenisCetakan: data.jenisCetakan,
                perolehanCetak: data.perolehanCetakan,
                sobek: data.sobek,
                kulit: data.kulit,
                gelondong: data.gelondong,
                sampah: data.sampah,
                rollHabis: data.rollHabis,
                rollSisa: data.rollSisa,
                keterangan: data.keterangan,
              });
            } else {
              await jadwalProduksis.update(
                {
                  jamAwalProduksi: data.jamAwalProduksi,
                  jamAkhirProduksi: data.jamAkhirProduksi,
                  noOrderProduksi: data.noOrderProduksi,
                  jenisCetakan: data.jenisCetakan,
                  perolehanCetak: data.perolehanCetakan,
                  sobek: data.sobek,
                  kulit: data.kulit,
                  gelondong: data.gelondong,
                  sampah: data.sampah,
                  rollHabis: data.rollHabis,
                  rollSisa: data.rollSisa,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Mengedit kegiatan produksi cetak dengan id ${dataProduksi.id}`,
        name: `ID Pesanan: ${dataProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editKegiatanProduksiFitur(req, res) {
    try {
      const { id } = req.params;
      const { personil, dataProduksi, jadwalFitur } = req.body;

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      const convertUnit = (beratAwal, beratAkhir) => {
        let { value: valueAwal, unit: unitAwal } =
          separateValueAndUnit(beratAwal);
        const { value: valueAkhir, unit: unitAkhir } =
          separateValueAndUnit(beratAkhir);

        if (unitAwal === "Ton" && unitAkhir === "Kg") {
          valueAwal = valueAwal * 1000 - valueAkhir;
          if (valueAwal < 1000) {
            return `${valueAwal} Kg`;
          } else {
            return `${valueAwal / 1000} Ton`;
          }
        } else if (unitAwal === unitAkhir) {
          return `${valueAwal - valueAkhir} ${unitAwal}`;
        }
      };

      let result = await laporanProduksis.update(
        {
          tanggalProduksi: dataProduksi.tanggalProduksi,
          noOrderProduksi: dataProduksi.noOrderProduksi,
          jenisCetakan: dataProduksi.jenisCetakan,
          mesin: dataProduksi.mesin,
          dibuatOleh: dataProduksi.dibuatOleh,
        },
        { where: { id: dataProduksi.id } }
      );

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            let beratAwalNewValue;
            try {
              beratAwalNewValue = convertUnit(data.beratAwal, data.beratAkhir);
            } catch (err) {
              throw new Error(`Error converting units: ${err.message}`);
            }
            if (!data.id) {
              await bahanLaporanProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jenis: data.jenis,
                kode: data.kode,
                beratAwal: beratAwalNewValue,
                beratAkhir: data.beratAkhir,
                keterangan: data.keterangan,
              });
            } else {
              await bahanLaporanProduksis.update(
                {
                  jenis: data.jenis,
                  kode: data.kode,
                  beratAwal: beratAwalNewValue,
                  beratAkhir: data.beratAkhir,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      if (personil && Array.isArray(personil)) {
        await Promise.all(
          personil.map(async (data) => {
            if (!data.id) {
              await personils.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                nama: data.nama,
              });
            } else {
              await personils.update(
                {
                  nama: data.nama,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      if (jadwalFitur && Array.isArray(jadwalFitur)) {
        await Promise.all(
          jadwalFitur.map(async (data) => {
            if (!data.id) {
              await jadwalProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jamAwalProduksi: data.jamAwalProduksi,
                jamAkhirProduksi: data.jamAkhirProduksi,
                noOrderProduksi: data.noOrderProduksi,
                jenisCetakan: data.jenisCetakan,
                nomoratorAwal: data.nomoratorAwal,
                nomoratorAkhir: data.nomoratorAkhir,
                perolehanCetak: data.perolehanCetakan,
                waste: data.waste,
                keterangan: data.keterangan,
              });
            } else {
              await jadwalProduksis.update(
                {
                  jamAwalProduksi: data.jamAwalProduksi,
                  jamAkhirProduksi: data.jamAkhirProduksi,
                  noOrderProduksi: data.noOrderProduksi,
                  jenisCetakan: data.jenisCetakan,
                  nomoratorAwal: data.nomoratorAwal,
                  nomoratorAkhir: data.nomoratorAkhir,
                  perolehanCetak: data.perolehanCetakan,
                  waste: data.waste,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Mengedit kegiatan produksi fitur dengan id ${dataProduksi.id}`,
        name: `ID Pesanan: ${dataProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async kegiatanProduksiSelesai(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      let findKegiatanProduksi = await laporanProduksis.findOne({
        where: { id: id },
      });
      let findLaporanProduksi = await laporanProduksis.findOne({
        where: { id: id },
      });
      let productionPlanningDone = await productionPlannings.update(
        { statusProductionPlanning: "Done" },
        { where: { id: findLaporanProduksi.idProductionPlanning } }
      );
      let result = await findLaporanProduksi.update({
        statusLaporan: "Done",
      });

      const findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menyelesaikan kegiatan produksi dengan No Pesanan ${findKegiatanProduksi.noOrderProduksi}`,
        name: `No Pesanan: ${findKegiatanProduksi.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      // let doneOrder = await orders.update(
      //   {},
      //   { where: { id: result.noOrderProduksi } }
      // );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getKegiatanProduksiDone(req, res) {
    try {
      const { id } = req.params;
      const { tanggalProduksiSelesai } = req.query;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await laporanProduksis.findAll({
        where: { statusLaporan: "Done", lokasi: findUser.lokasi },
        include: [
          { model: personils },
          { model: jadwalProduksis },
          { model: bahanLaporanProduksis },
        ],
      });

      if (tanggalProduksiSelesai) {
        const targetDate = dayjs(tanggalProduksiSelesai).format("YYYY-MM-DD");
        result = result.filter((item) => {
          const itemDate = dayjs(item.updatedAt).format("YYYY-MM-DD");
          return itemDate === targetDate;
        });
      }

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addLaporanLimbahProduksi(req, res) {
    try {
      const { id } = req.params;
      const { dataLimbah } = req.body;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await laporanLimbahProduksis.create({
        noOrderProduksi: parseInt(dataLimbah.noOrderProduksi),
        dibuatOleh: dataLimbah.dibuatOleh,
        tanggalPembuatan: dataLimbah.tanggalPembuatan,
        tahapProduksi: dataLimbah.tahapProduksi,
        lokasi: findUser.lokasi,
      });

      if (
        dataLimbah.itemLaporanLimbahProdukses &&
        Array.isArray(dataLimbah.itemLaporanLimbahProdukses)
      ) {
        await Promise.all(
          dataLimbah.itemLaporanLimbahProdukses.map(async (data) => {
            await itemLaporanLimbahProduksis.create({
              laporanLimbahProduksiId: result.id,
              noOrderProduksiId: data.noOrderProduksi,
              namaBarang: data.namaBarang,
              jumlahBarang: data.jumlahBarang,
              keterangan: data.keterangan,
              tahapProduksi: data.tahapProduksi,
            });
          })
        );
      }

      await UserLaporanLimbahProduksis.create({
        userId: id,
        laporanLimbahProduksiId: result.id,
      });
      await laporanProduksis.update(
        {
          statusLaporanLimbah: "Done",
        },
        {
          where: {
            noOrderProduksi: result.noOrderProduksi,
            tahapProduksi: result.tahapProduksi,
          },
        }
      );

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan Item Limbah Produksi dari ${dataLimbah.tahapProduksi}`,
        name: `ID Pesanan: ${parseInt(dataLimbah.noOrderProduksi)}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res
        .status(200)
        .json({ message: "Laporan limbah produksi added successfully" });
    } catch (error) {
      res.json(error);
    }
  }
  static async updateDataLimbahProduksi(req, res) {
    try {
      const { id } = req.params;
      const { dataLimbah } = req.body;
      let result = await laporanLimbahProduksis.update(
        {
          dibuatOleh: dataLimbah.dibuatOleh,
          tanggalPembuatan: dataLimbah.tanggalPembuatan,
        },
        { where: { id: dataLimbah.id } }
      );

      if (
        dataLimbah.itemLaporanLimbahProdukses &&
        Array.isArray(dataLimbah.itemLaporanLimbahProdukses)
      ) {
        await Promise.all(
          dataLimbah.itemLaporanLimbahProdukses.map(async (data) => {
            if (!data.id) {
              await itemLaporanLimbahProduksis.create({
                laporanLimbahProduksiId: dataLimbah.id,
                noOrderProduksiId: data.noOrderProduksi,
                namaBarang: data.namaBarang,
                jumlahBarang: data.jumlahBarang,
                tahapProduksi: data.tahapProduksi,
                keterangan: data.keterangan,
              });
            } else {
              await itemLaporanLimbahProduksis.update(
                {
                  noOrderProduksiId: data.noOrderProduksi,
                  namaBarang: data.namaBarang,
                  jumlahBarang: data.jumlahBarang,
                  tahapProduksi: data.tahapProduksi,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }

      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Mengedit item limbah produksi dengan id ${dataLimbah.id}`,
        name: `ID Pesanan: ${dataLimbah.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getLaporanProduksiForLaporanLimbah(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await laporanProduksis.findAll({
        where: {
          statusLaporan: "Done",
          statusLaporanLimbah: null,
          lokasi: findUser.lokasi,
        },
        include: [
          { model: personils },
          { model: jadwalProduksis },
          { model: bahanLaporanProduksis },
        ],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemLimbahProduksi(req, res) {
    try {
      const { id } = req.params;
      const { tahapProduksi, noOrderProduksi, userId } = req.query;

      const searchForItem = await laporanLimbahProduksis.findOne({
        where: { id: id },
      });

      const searchForLaporanProduksi = await laporanProduksis.findOne({
        where: {
          noOrderProduksi: noOrderProduksi,
          tahapProduksi: tahapProduksi,
        },
      });

      if (searchForLaporanProduksi) {
        await searchForLaporanProduksi.update({
          statusLaporanLimbah: null,
        });
      }

      let result = await laporanLimbahProduksis.destroy({
        where: { id: id },
      });

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus limbah hasil produksi dengan id ${id}`,
        name: `No Pesanan: ${noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  static async getAllLaporanLimbahProduksi(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await laporanLimbahProduksis.findAll({
        where: { lokasi: findUser.lokasi },
        include: [{ model: itemLaporanLimbahProduksis }],
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getOneLaporanLimbahProduksi(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      const findUser = await users.findOne({
        where: { id: userId },
      });
      let result = await laporanLimbahProduksis.findOne({
        where: { id: id, lokasi: findUser.lokasi },
        include: [{ model: itemLaporanLimbahProduksis }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemLaporanLimbahProduksis(req, res) {
    try {
      const { id } = req.params;
      const { userId, idLimbahProduksi } = req.query;

      let findOneItemLaporanLimbahProduksi =
        await itemLaporanLimbahProduksis.findOne({
          where: { id: id },
        });

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await itemLaporanLimbahProduksis.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus item hasil limbah produksi dari id ${idLimbahProduksi} dari ID Pesanan ${findOneItemLaporanLimbahProduksi.noOrderProduksiId}`,
        name: `ID Pesanan: ${findOneItemLaporanLimbahProduksi.noOrderProduksiId}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addLaporanSampah(req, res) {
    try {
      const { id } = req.params;
      const { dataLaporanSampah } = req.body;

      let findUser = await users.findOne({
        where: { id: id },
      });

      let result = await laporanSampahs.create({
        laporanLimbahProduksiId: dataLaporanSampah.laporanLimbahProduksiId,
        noOrderProduksi: dataLaporanSampah.noOrderProduksi,
        tahapProduksi: dataLaporanSampah.tahapProduksi,
        lokasi: findUser.lokasi,
      });

      if (
        dataLaporanSampah.itemLaporanSampahs &&
        Array.isArray(dataLaporanSampah.itemLaporanSampahs)
      ) {
        await Promise.all(
          dataLaporanSampah.itemLaporanSampahs.map(async (data) => {
            await itemLaporanSampahs.create({
              laporanSampahId: result.id,
              noOrderProduksi: dataLaporanSampah.noOrderProduksi,
              tahapProduksi: dataLaporanSampah.tahapProduksi,
              tanggal: data.tanggal,
              pembeli: data.pembeli,
              uraian: data.uraian,
              jumlah: data.jumlah,
              hargaSatuan: data.hargaSatuan,
              pembayaran: data.pembayaran,
              keterangan: data.keterangan,
            });
          })
        );
      }

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan Laporan Sampah dari ${dataLaporanSampah.tahapProduksi} dengan ID Pesanan ${dataLaporanSampah.noOrderProduksi}`,
        name: `ID Pesanan: ${dataLaporanSampah.noOrderProduksi}`,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getLaporanSampah(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({ where: { id: id } });
      let result = await laporanSampahs.findAll({
        where: { lokasi: findUser.lokasi },
        include: [{ model: itemLaporanSampahs }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteLaporanSampah(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const findOneLaporanSampah = await laporanSampahs.findOne({
        where: { id: id },
      });

      const findUser = await users.findOne({
        where: { id: userId },
      });
      let result = await laporanSampahs.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus laporan sampah dari ID Pesanan ${findOneLaporanSampah.noOrderProduksi}`,
        name: `ID Pesanan: ${findOneLaporanSampah.noOrderProduksi}`,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemLaporanSampah(req, res) {
    try {
      const { id } = req.params;
      const { userId, iDLaporanSampah } = req.query;

      let findOneLaporanSampah = await laporanSampahs.findOne({
        where: { id: iDLaporanSampah },
      });

      let findUser = await users.findOne({
        where: { id: userId },
      });
      let result = await itemLaporanSampahs.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus item laporan sampah dari laporan sampah dengan ID ${iDLaporanSampah} dari ID Pesanan ${findOneLaporanSampah.noOrderProduksi}`,
        name: `ID Pesanan: ${findOneLaporanSampah.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateLaporanSampah(req, res) {
    try {
      const { id } = req.params;
      const { dataLaporanSampah } = req.body;
      let result = await laporanSampahs.update(
        {
          noOrderProduksi: dataLaporanSampah.noOrderProduksi,
          tahapProduksi: dataLaporanSampah.tahapProduksi,
        },
        { where: { id: dataLaporanSampah.id } }
      );

      if (
        dataLaporanSampah.itemLaporanSampahs &&
        Array.isArray(dataLaporanSampah.itemLaporanSampahs)
      ) {
        await Promise.all(
          dataLaporanSampah.itemLaporanSampahs.map(async (data) => {
            if (!data.id) {
              await itemLaporanSampahs.create({
                laporanSampahId: dataLaporanSampah.id,
                noOrderProduksi: dataLaporanSampah.noOrderProduksi,
                tahapProduksi: dataLaporanSampah.tahapProduksi,
                tanggal: data.tanggal,
                pembeli: data.pembeli,
                uraian: data.uraian,
                jumlah: data.jumlah,
                hargaSatuan: data.hargaSatuan,
                pembayaran: data.pembayaran,
                keterangan: data.keterangan,
              });
            } else {
              await itemLaporanSampahs.update(
                {
                  laporanSampahId: dataLaporanSampah.id,
                  noOrderProduksi: dataLaporanSampah.noOrderProduksi,
                  tahapProduksi: dataLaporanSampah.tahapProduksi,
                  tanggal: data.tanggal,
                  pembeli: data.pembeli,
                  uraian: data.uraian,
                  jumlah: data.jumlah,
                  hargaSatuan: data.hargaSatuan,
                  pembayaran: data.pembayaran,
                  keterangan: data.keterangan,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }

      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Mengedit laporan sampah dengan id ${dataLaporanSampah.id}`,
        name: `ID Pesanan: ${dataLaporanSampah.noOrderProduksi}`,
        division: "Production",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  static async productionActivityLog(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await activitylogs.findAll({
        where: { division: "Production", lokasi: findUser.lokasi },
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
          department: "Production",
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
        activity: `Mengupdate kredensial user/menambahkan user ke dalam divisi production`,
        name: `Divisi: Production`,
        division: "Production",
        lokasi: findUser.lokasi,
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

module.exports = ProductionController;

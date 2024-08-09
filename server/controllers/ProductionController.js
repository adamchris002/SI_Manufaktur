const {
  penyerahanBarangs,
  itemPenyerahanBarangs,
  laporanProduksis,
  personils,
  bahanLaporanProduksis,
  jadwalProduksis,
  UserLaporanProduksis,
  orders,
} = require("../models");

class ProductionController {
  static async getPenyerahanBarang(req, res) {
    try {
      let result = await penyerahanBarangs.findAll({
        where: { statusPenyerahan: "Barang siap diambil" },
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
      const { dataProduksi, jadwalPracetak, personil } = req.body;

      let result = await laporanProduksis.create({
        tanggalProduksi: dataProduksi.tanggalProduksi,
        noOrderProduksi: dataProduksi.noOrderProduksi,
        jenisCetakan: dataProduksi.jenisCetakan,
        mesin: dataProduksi.mesin,
        dibuatOleh: dataProduksi.dibuatOleh,
        tahapProduksi: dataProduksi.tahapProduksi,
      });

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            await bahanLaporanProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jenis: data.jenis,
              kode: data.kode,
              beratAwal: data.beratAwal,
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
      let result = await laporanProduksis.findAll({
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
    const { id } = req.params;
    try {
      let result = await laporanProduksis.findOne({
        where: { id: id },
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
      // let findOrder = await orders.findOne({
      //   where: { id: dataProduksi.noOrderProduksi },
      // });
      // await findOrder.update({
      //   orderStatus: "Estimated",
      // });
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
            if (!data.id) {
              await bahanLaporanProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jenis: data.jenis,
                kode: data.kode,
                beratAwal: data.beratAwal,
                beratAkhir: data.beratAkhir,
                keterangan: data.keterangan,
              });
            } else {
              await bahanLaporanProduksis.update(
                {
                  jenis: data.jenis,
                  kode: data.kode,
                  beratAwal: data.beratAwal,
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
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deletePersonil(req, res) {
    try {
      const { id } = req.params;
      let result = await personils.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteBahanProduksiPracetak(req, res) {
    try {
      const { id } = req.params;
      let result = await bahanLaporanProduksis.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteJadwalProduksiPracetak(req, res) {
    try {
      const { id } = req.params;
      let result = await jadwalProduksis.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteKegiatanProduksi(req, res) {
    try {
      const { id } = req.params;
      let result = await laporanProduksis.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(result);
    }
  }
  static async addKegiatanProduksiFitur(req, res) {
    try {
      const { id } = req.params;
      const { personil, dataProduksi, jadwalFitur } = req.body;
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
        jenisCetakan: dataProduksi.jenisCetakan,
        mesin: dataProduksi.mesin,
        dibuatOleh: dataProduksi.dibuatOleh,
        tahapProduksi: dataProduksi.tahapProduksi,
      });
      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            await bahanLaporanProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jenis: data.jenis,
              kode: data.kode,
              beratAwal: data.beratAwal,
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
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addKegiatanProduksiCetak(req, res) {
    try {
      const { id } = req.params;
      const { personil, jadwalCetak, dataProduksi } = req.body;
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
        noOrderProduksi: dataProduksi.noOrderProduksi,
        jenisCetakan: dataProduksi.jenisCetakan,
        mesin: dataProduksi.mesin,
        dibuatOleh: dataProduksi.dibuatOleh,
        tahapProduksi: dataProduksi.tahapProduksi,
      });

      if (
        dataProduksi.bahanProduksis &&
        Array.isArray(dataProduksi.bahanProduksis)
      ) {
        await Promise.all(
          dataProduksi.bahanProduksis.map(async (data) => {
            await bahanLaporanProduksis.create({
              laporanProduksiId: result.id,
              tahapProduksi: dataProduksi.tahapProduksi,
              jenis: data.jenis,
              kode: data.kode,
              beratAwal: data.beratAwal,
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

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editKegiatanProduksiCetak(req, res) {
    try {
      const { id } = req.params;
      const { personil, dataProduksi, jadwalCetak } = req.body;

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
            if (!data.id) {
              await bahanLaporanProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jenis: data.jenis,
                kode: data.kode,
                beratAwal: data.beratAwal,
                beratAkhir: data.beratAkhir,
                keterangan: data.keterangan,
              });
            } else {
              await bahanLaporanProduksis.update(
                {
                  jenis: data.jenis,
                  kode: data.kode,
                  beratAwal: data.beratAwal,
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

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editKegiatanProduksiFitur(req, res) {
    try {
      const { id } = req.params;
      const { personil, dataProduksi, jadwalFitur } = req.body;

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
            if (!data.id) {
              await bahanLaporanProduksis.create({
                laporanProduksiId: dataProduksi.id,
                tahapProduksi: dataProduksi.tahapProduksi,
                jenis: data.jenis,
                kode: data.kode,
                beratAwal: data.beratAwal,
                beratAkhir: data.beratAkhir,
                keterangan: data.keterangan,
              });
            } else {
              await bahanLaporanProduksis.update(
                {
                  jenis: data.jenis,
                  kode: data.kode,
                  beratAwal: data.beratAwal,
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
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async kegiatanProduksiSelesai(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      let result = await laporanProduksis.update(
        {
          statusLaporan: "Done",
        },
        { where: { id: id } }
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getKegiatanProduksiDone(req, res) {
    try {
      const {tanggalProduksiSelesai} = req.query
      console.log(tanggalProduksiSelesai)
      let result = await laporanProduksis.findAll({
        where: { statusLaporan: "Done"  }, 
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionController;

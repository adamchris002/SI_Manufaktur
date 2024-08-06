const {
  penyerahanBarangs,
  itemPenyerahanBarangs,
  laporanProduksis,
  personils,
  bahanLaporanProduksis,
  jadwalProduksis,
  UserLaporanProductions,
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

      await UserLaporanProductions.create({
        userId: parseInt(id),
        laporanProductionId: parseInt(result.id),
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
  static async addKegiatanProduksiCetak(req, res) {
    try {
      const { id } = req.params;
      const { personil, jadwalCetak, dataProduksi } = req.body;

      // console.log(id);
      // console.log(personil);
      // console.log(jadwalCetak);
      // console.log(dataProduksi);
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
              jenisBahanKertas: data.jenisBahanKertas,
              beratBahanKertas: data.beratBahanKertas,
              perolehanCetakan: data.jenisCetakan,
              sobek: data.sobek,
              kulit: data.kulit,
              gelondong: data.gelondong,
              sampah: data.sampah,
              rollHabis: data,
              rollHabis,
              rollSisa: data.rollSisa,
              keterangan: data.keterangan,
            });
          })
        );
      }

      await UserLaporanProductions.create({
        userId: parseInt(id),
        laporanProductionId: parseInt(result.id),
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = ProductionController;

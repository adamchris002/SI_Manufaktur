const {
  penyerahanBarangs,
  itemPenyerahanBarangs,
  laporanProduksis,
  UserLaporanProduksis,
  personils,
  bahanLaporanProduksis,
  jadwalProduksis,
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
      await UserLaporanProduksis.create({
        userId: parseInt(id),
        laporanProduksiId: result.id,
        laporanProduksisId: result.id,
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
}

module.exports = ProductionController;

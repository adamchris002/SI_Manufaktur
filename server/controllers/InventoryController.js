const {
  permohonanPembelians,
  UserPermohonanPembelians,
  itemPermohonanPembelians,
} = require("../models");

class InventoryController {
  static async addPermohonanPembelian(req, res) {
    try {
      const { permohonanPembelian } = req.body;
      const { id } = req.params;

      if (permohonanPembelian && Array.isArray(permohonanPembelian)) {
        await Promise.all(
          permohonanPembelian.map(async (data) => {
            let createPermohonanPembelian = await permohonanPembelians.create({
              nomor: data.nomor,
              perihal: data.perihal,
              statusPermohonan: "Requested"
            });
            await UserPermohonanPembelians.create({
              userId: id,
              permohonanPembelianId: createPermohonanPembelian.id,
            });
            if (
              data.daftarPermohonanPembelian &&
              Array.isArray(data.daftarPermohonanPembelian)
            ) {
              await Promise.all(
                data.daftarPermohonanPembelian.map(
                  async (itemPermohonanPembelian) => {
                    await itemPermohonanPembelians.create({
                      permohonanPembelianId: createPermohonanPembelian.id,
                      jenisBarang: itemPermohonanPembelian.jenisBarang,
                      jumlah: itemPermohonanPembelian.jumlah,
                      untukPekerjaan: itemPermohonanPembelian.untukPekerjaan,
                      stok: itemPermohonanPembelian.stok,
                      keterangan: itemPermohonanPembelian.keterangan,
                    });
                  }
                )
              );
            }
          })
        );
      }

      res
        .status(200)
        .json(result, { message: "Berhasil menambahkan permohonan pembelian" });
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllPermohonanPembelian(req, res) {
    try {
      let result = await permohonanPembelians.findAll({
        include: [{ model: itemPermohonanPembelians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = InventoryController;

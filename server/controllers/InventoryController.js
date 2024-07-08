const {
  permohonanPembelians,
  UserPermohonanPembelians,
  itemPermohonanPembelians,
  pembelianBahanBakus,
  itemPembelianBahanBakus,
} = require("../models");

class InventoryController {
  static async getPembelianBahanBaku(req, res) {
    try {
      const { id } = req.params;

      let result = await pembelianBahanBakus.findOne({
        where: { id: id },
        include: [{ model: itemPembelianBahanBakus }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editPembelianBahanBaku(req, res) {
    try {
      const { id } = req.params;
      const { pembelianBahanBakuId, dataPembelianBahanBaku } = req.body;
      console.log(dataPembelianBahanBaku);

      let result = await pembelianBahanBakus.update(
        {
          leveransir: dataPembelianBahanBaku.leveransir,
          alamat: dataPembelianBahanBaku.alamat,
        },
        { where: { id: pembelianBahanBakuId } }
      );

      if (
        dataPembelianBahanBaku.items &&
        Array.isArray(dataPembelianBahanBaku.items)
      ) {
        await Promise.all(
          dataPembelianBahanBaku.items.map(async (data) => {
            if (!data.id) {
              await itemPembelianBahanBakus.create({
                pembelianBahanBakuId: pembelianBahanBakuId,
                tanggal: data.tanggal,
                noOrder: data.noOrder,
                jenisBarang: data.jenisBarang,
                rincianBarang: data.rincianBarang,
                jumlahOrder: data.jumlahOrder,
                hargaSatuan: data.hargaSatuan,
                jumlahHarga: data.jumlahHarga,
              });
            } else {
              await itemPembelianBahanBakus.update(
                {
                  tanggal: data.tanggal,
                  noOrder: data.noOrder,
                  jenisBarang: data.jenisBarang,
                  rincianBarang: data.rincianBarang,
                  jumlahOrder: data.jumlahOrder,
                  hargaSatuan: data.hargaSatuan,
                  jumlahHarga: data.jumlahHarga,
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
  static async deleteItemPermohonanPembelian(req, res) {
    try {
      const { id } = req.params;
      let result = await itemPembelianBahanBakus.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editPermohonanPembelian(req, res) {
    try {
      const { permohonanPembelian } = req.body;
      const { id } = req.params;
      if (permohonanPembelian && Array.isArray(permohonanPembelian)) {
        await Promise.all(
          permohonanPembelian.map(async (data) => {
            await permohonanPembelians.update(
              {
                nomor: data.nomor,
                perihal: data.perihal,
              },
              { where: { id: data.id } }
            );
            if (
              data.daftarPermohonanPembelian &&
              Array.isArray(data.daftarPermohonanPembelian)
            ) {
              await Promise.all(
                data.daftarPermohonanPembelian.map(
                  async (itemPermohonanPembelian) => {
                    if (!itemPermohonanPembelian.id) {
                      await itemPermohonanPembelians.create({
                        permohonanPembelianId: data.id,
                        jenisBarang: itemPermohonanPembelian.jenisBarang,
                        jumlah: itemPermohonanPembelian.jumlah,
                        untukPekerjaan: itemPermohonanPembelian.untukPekerjaan,
                        stok: itemPermohonanPembelian.stok,
                        keterangan: itemPermohonanPembelian.keterangan,
                      });
                    } else {
                      await itemPermohonanPembelians.update(
                        {
                          jenisBarang: itemPermohonanPembelian.jenisBarang,
                          jumlah: itemPermohonanPembelian.jumlah,
                          untukPekerjaan:
                            itemPermohonanPembelian.untukPekerjaan,
                          stok: itemPermohonanPembelian.stok,
                          keterangan: itemPermohonanPembelian.keterangan,
                        },
                        { where: { id: itemPermohonanPembelian.id } }
                      );
                    }
                  }
                )
              );
            }
          })
        );
      }
      res
        .status(200)
        .json(result, { message: "Berhasil Mengedit permohonan pembelian" });
    } catch (error) {
      res.json(error);
    }
  }
  static async deletePermohonanPembelian(req, res) {
    try {
      const { id } = req.params;
      let result = await permohonanPembelians.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemsPermohonanPembelian(req, res) {
    try {
      const { id } = req.params;
      let result = await itemPermohonanPembelians.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
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
              statusPermohonan: "Requested",
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
  static async getAllAcceptedPermohonanPembelian(req, res) {
    try {
      let result = await permohonanPembelians.findAll({
        where: { statusPermohonan: "Accepted" },
        include: [{ model: itemPermohonanPembelians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getPermohonanPembelian(req, res) {
    try {
      const { id } = req.params;
      let result = await permohonanPembelians.findOne({
        where: { id: id },
        include: [{ model: itemPermohonanPembelians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addPembelianBahanBaku(req, res) {
    try {
      const { id } = req.params;
      const { permohonanPembelianId, dataPembelianBahanBaku } = req.body;

      let result = await pembelianBahanBakus.create({
        permohonanPembelianId: permohonanPembelianId,
        leveransir: dataPembelianBahanBaku.leveransir,
        alamat: dataPembelianBahanBaku.alamat,
      });

      if (
        dataPembelianBahanBaku.items &&
        Array.isArray(dataPembelianBahanBaku.items)
      ) {
        await Promise.all(
          dataPembelianBahanBaku.items.map(async (data) => {
            await itemPembelianBahanBakus.create({
              pembelianBahanBakuId: result.id,
              tanggal: data.tanggal,
              noOrder: data.noOrder,
              jenisBarang: data.jenisBarang,
              rincianBarang: data.rincianBarang,
              jumlahOrder: data.jumlahOrder,
              hargaSatuan: data.hargaSatuan,
              jumlahHarga: data.jumlahHarga,
            });
          })
        );
      }

      await permohonanPembelians.update(
        {
          statusPermohonan: "Processed",
        },
        { where: { id: permohonanPembelianId } }
      );

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllPembelianBahanBaku(req, res) {
    try {
      let result = await pembelianBahanBakus.findAll({
        include: [{ model: itemPembelianBahanBakus }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deletePembelianBahanBaku(req, res) {
    try {
      const { id } = req.params;

      let findPembelianBahanBaku = await pembelianBahanBakus.findOne({
        where: { id: id },
      });

      await permohonanPembelians.update(
        {
          statusPermohonan: "Accepted",
        },
        { where: { id: findPembelianBahanBaku.permohonanPembelianId } }
      );
      let result = await pembelianBahanBakus.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemPembelianBahanBaku(req, res) {
    try {
      const { id } = req.params;
      console.log(id)

      let result = await itemPembelianBahanBakus.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = InventoryController;

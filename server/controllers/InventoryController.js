const {
  permohonanPembelians,
  UserPermohonanPembelians,
  itemPermohonanPembelians,
  pembelianBahanBakus,
  itemPembelianBahanBakus,
  activitylogs,
  UserActivityLogs,
  UserInventorys,
  inventorys,
  users,
  stokOpnams,
  UserStokOpnams,
  itemStokOpnams,
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
                tanggalSuratJalan: data.tanggalSuratJalan,
                noSuratJalan: data.noSuratJalan,
                tanggalTerimaBarang: data.tanggalTerimaBarang,
                diterimaOleh: data.diterimaOleh,
                fakturPajak: data.fakturPajak,
                tanggalJatuhTempo: data.tanggalJatuhTempo,
                tanggalPengiriman: data.tanggalPengiriman,
                jumlahTerimaPengiriman: data.jumlahTerimaPengiriman,
                sisaPengiriman: data.sisaPengiriman,
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
                  tanggalSuratJalan: data.tanggalSuratJalan,
                  noSuratJalan: data.noSuratJalan,
                  tanggalTerimaBarang: data.tanggalTerimaBarang,
                  diterimaOleh: data.diterimaOleh,
                  fakturPajak: data.fakturPajak,
                  tanggalJatuhTempo: data.tanggalJatuhTempo,
                  tanggalPengiriman: data.tanggalPengiriman,
                  jumlahTerimaPengiriman: data.jumlahTerimaPengiriman,
                  sisaPengiriman: data.sisaPengiriman,
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
            await UserPermohonanPembelians.create({
              userId: id,
              permohonanPembelianId: createPermohonanPembelian.id,
            });

            let userInformation = await users.findOne({
              where: { id: id },
            });

            let createActivityLog = await activitylogs.create({
              user: userInformation.name,
              activity: "Menambahkan permohonan pembelian",
              name: "Nomor: " + data.nomor,
              division: "Production Planning",
            });

            await UserActivityLogs.create({
              userId: id,
              id: createActivityLog.id,
              activitylogsId: createActivityLog.id,
            });
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
              tanggalSuratJalan: data.tanggalSuratJalan,
              noSuratJalan: data.noSuratJalan,
              tanggalTerimaBarang: data.tanggalTerimaBarang,
              diterimaOleh: data.diterimaOleh,
              fakturPajak: data.fakturPajak,
              tanggalJatuhTempo: data.tanggalJatuhTempo,
              tanggalPengiriman: data.tanggalPengiriman,
              jumlahTerimaPengiriman: data.jumlahTerimaPengiriman,
              sisaPengiriman: data.sisaPengiriman,
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

      let result = await itemPembelianBahanBakus.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllInventoryItem(req, res) {
    try {
      let result = await inventorys.findAll({});

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const { dataInventory } = req.body;

      let createDataInventory = await inventorys.create({
        namaItem: dataInventory.namaItem,
        rincianItem: dataInventory.rincianItem,
        jumlahItem: dataInventory.jumlahItem,
      });

      await UserInventorys.create({
        userId: id,
        inventoryId: createDataInventory.id,
      });

      let userInformation = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: "Menambahkan item bahan baku",
        name: dataInventory.namaItem,
        division: "Inventory",
      });

      await UserActivityLogs.create({
        userId: id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });

      res.json(createDataInventory);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const { dataInventory } = req.body;

      let result = await inventorys.update(
        {
          namaItem: dataInventory.namaItem,
          rincianItem: dataInventory.rincianItem,
          jumlahItem: dataInventory.jumlahItem,
        },
        { where: { id: dataInventory.inventoryItemId } }
      );

      const userInformation = await users.findOne({
        where: { id: id },
      });

      let updateActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: "Update item bahan baku",
        name: dataInventory.namaItem,
        division: "Inventory",
      });

      await UserActivityLogs.create({
        userId: id,
        id: updateActivityLog.id,
        activitylogsId: updateActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteInventoryItem(req, res) {
    try {
      const { userId, inventoryItemId } = req.query;

      const inventoryData = await inventorys.findOne({
        where: { id: inventoryItemId },
      });

      let result = await inventorys.destroy({
        where: { id: inventoryItemId },
      });

      const userInformation = await users.findOne({
        where: { id: userId },
      });

      let deleteActivityLogs = await activitylogs.create({
        user: userInformation.name,
        activity: "Delete item bahan baku",
        name: inventoryData.namaItem,
        division: "Inventory",
      });

      await UserActivityLogs.create({
        userId: userId,
        id: deleteActivityLogs.id,
        activitylogsId: deleteActivityLogs.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async inventoryActivityLog(req, res) {
    try {
      let result = await activitylogs.findAll({
        where: { division: "Inventory" },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addStokOpnam(req, res) {
    try {
      const { id } = req.params;
      const { dataStokOpnam } = req.body;

      let userInformation = await users.findOne({
        where: { id: id },
      });

      let result = await stokOpnams.create({
        judulStokOpnam: dataStokOpnam.judulStokOpnam,
        tanggalStokOpnam: dataStokOpnam.tanggalStokOpnam,
      });

      if (
        dataStokOpnam.itemStokOpnams &&
        Array.isArray(dataStokOpnam.itemStokOpnams)
      ) {
        await Promise.all(
          dataStokOpnam.itemStokOpnams.map(async (item) => {
            await itemStokOpnams.create({
              stokOpnamId: result.id,
              suratPesanan: item.suratPesanan,
              tanggalMasuk: item.tanggalMasuk,
              tanggalPengembalian: item.tanggalPengembalian,
              jenisBarang: item.jenisBarang,
              kodeBarang: item.kodeBarang,
              lokasiPenyimpanan: item.lokasiPenyimpanan,
              stokOpnamAwal: item.stokOpnamAwal,
              stokOpnamAkhir: item.stokOpnamAkhir,
              stokFisik: item.stokFisik,
              stokSelisih: item.stokSelisih,
              keterangan: item.keterangan,
            });
          })
        );
      }

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: "Menambahkan data stok opnam",
        name: dataStokOpnam.judulStokOpnam,
        division: "Inventory",
      });

      await UserActivityLogs.create({
        userId: id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async findNameInventoryItem(req, res) {
    try {
      const { name } = req.params;

      let result = await inventorys.findOne({
        where: { namaItem: name },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllStokOpnam(req, res) {
    try {
      let result = await stokOpnams.findAll({
        include: [{ model: itemStokOpnams }],
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getStokOpnam(req, res) {
    try {
      const { id } = req.params;
      let result = await stokOpnams.findOne({
        where: { id: id },
        include: [{ model: itemStokOpnams }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async editStokOpnam(req, res) {
    try {
      const { id } = req.params;
      const { dataStokOpnam } = req.body;
      console.log(dataStokOpnam);
      let result = await stokOpnams.update(
        {
          judulStokOpnam: dataStokOpnam.judulStokOpnam,
          tanggalStokOpnam: dataStokOpnam.tanggalStokOpnam,
        },
        {
          where: { id: dataStokOpnam.id },
        }
      );
      if (
        dataStokOpnam.itemStokOpnams &&
        Array.isArray(dataStokOpnam.itemStokOpnams)
      ) {
        Promise.all(
          dataStokOpnam.itemStokOpnams.map(async (data) => {
            if (!data.id) {
              await itemStokOpnams.create({
                stokOpnamId: dataStokOpnam.id,
                suratPesanan: data.suratPesanan,
                tanggalMasuk: data.tanggalMasuk,
                tanggalPengembalian: data.tanggalPengembalian,
                jenisBarang: data.jenisBarang,
                kodeBarang: data.kodeBarang,
                lokasiPenyimpanan: data.lokasiPenyimpanan,
                stokOpnamAwal: data.stokOpnamAwal,
                stokOpnamAkhir: data.stokOpnamAkhir,
                stokFisik: data.stokFisik,
                stokSelisih: data.stokSelisih,
                keterangan: data.keterangan,
              });
            } else {
              await itemStokOpnams.update(
                {
                  suratPesanan: data.suratPesanan,
                  tanggalMasuk: data.tanggalMasuk,
                  tanggalPengembalian: data.tanggalPengembalian,
                  jenisBarang: data.jenisBarang,
                  kodeBarang: data.kodeBarang,
                  lokasiPenyimpanan: data.lokasiPenyimpanan,
                  stokOpnamAwal: data.stokOpnamAwal,
                  stokOpnamAkhir: data.stokOpnamAkhir,
                  stokFisik: data.stokFisik,
                  stokSelisih: data.stokSelisih,
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
  static async deleteItemStokOpnam(req, res) {
    try {
      const { id } = req.params;
      let result = await itemStokOpnams.destroy({
        where: { id: id },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteStokOpnam(req, res) {
    try {
      const { id } = req.params;
      let result = await stokOpnams.destroy({
        where: { id: id },
      });
      res.json(result)
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = InventoryController;

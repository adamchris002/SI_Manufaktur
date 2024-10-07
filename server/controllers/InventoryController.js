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
  penyerahanBarangs,
  itemPenyerahanBarangs,
  UserPenyerahanBarangs,
  inventoryHistorys,
  productionPlannings,
} = require("../models");

class InventoryController {
  static async getPembelianBahanBaku(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await pembelianBahanBakus.findOne({
        where: { id: id, lokasi: findUser.lokasi },
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

      const findPembelianBahanBaku = await pembelianBahanBakus.findOne({
        where: { id: pembelianBahanBakuId },
      });

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
      let userInformation = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Mengedit pembelian bahan baku dengan id ${findPembelianBahanBaku.id}`,
        name: "Leveransir: " + findPembelianBahanBaku.leveransir,
        division: "Inventory",
        lokasi: userInformation.lokasi,
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
      let userInformation = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Mengedit permohonan pembelian dengan id ${permohonanPembelian[0].id}`,
        name: "Nomor: " + permohonanPembelian[0].nomor,
        division: "Inventory",
        lokasi: userInformation.lokasi,
      });

      await UserActivityLogs.create({
        userId: id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });
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
      const { userId } = req.query;

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      const findOnePermohonanPembelian = await permohonanPembelians.findOne({
        where: { id: id },
      });

      let result = await permohonanPembelians.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus permohonan pembelian dengan id ${findOnePermohonanPembelian.id}`,
        name: "Nomor: " + findOnePermohonanPembelian.nomor,
        division: "Inventory",
        lokasi: userInformation.lokasi,
      });

      await UserActivityLogs.create({
        userId: userId,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemsPermohonanPembelian(req, res) {
    try {
      const { id } = req.params;
      const { userId, permohonanPembelianId } = req.query;

      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let findOneItemPermohonanPembelian =
        await itemPermohonanPembelians.findOne({
          where: { id: id },
        });

      let result = await itemPermohonanPembelians.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Menghapus item permohonan pembelian dengan id ${findOneItemPermohonanPembelian.id} dari permohonan pembelian ${permohonanPembelianId}`,
        name: "Jenis Barang: " + findOneItemPermohonanPembelian.jenisBarang,
        division: "Inventory",
        lokasi: userInformation.lokasi,
      });

      await UserActivityLogs.create({
        userId: userId,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
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

      const findUser = await users.findOne({
        where: { id: id },
      });

      let createPermohonanPembelian;

      if (permohonanPembelian && Array.isArray(permohonanPembelian)) {
        await Promise.all(
          permohonanPembelian.map(async (data) => {
            createPermohonanPembelian = await permohonanPembelians.create({
              nomor: data.nomor,
              perihal: data.perihal,
              statusPermohonan: "Requested",
              lokasi: findUser.lokasi,
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
              activitylogsId: createPermohonanPembelian.id,
              permohonanPembelianId: createPermohonanPembelian.id,
            });

            let userInformation = await users.findOne({
              where: { id: id },
            });

            let createActivityLog = await activitylogs.create({
              user: userInformation.name,
              activity: `Menambahkan permohonan pembelian dengan id ${createPermohonanPembelian.id}`,
              name: "Nomor: " + data.nomor,
              division: "Inventory",
              lokasi: findUser.lokasi,
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
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await permohonanPembelians.findAll({
        where: { lokasi: findUser.lokasi },
        include: [{ model: itemPermohonanPembelians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllPermohonanPembelianRequested(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await permohonanPembelians.findAll({
        where: { statusPermohonan: "Requested", lokasi: findUser.lokasi },
        include: [{ model: itemPermohonanPembelians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllAcceptedPermohonanPembelian(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await permohonanPembelians.findAll({
        where: { statusPermohonan: "Accepted", lokasi: findUser.lokasi },
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
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await permohonanPembelians.findOne({
        where: { id: id, lokasi: findUser.lokasi },
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

      let userInformation = await users.findOne({
        where: { id: id },
      });

      let result = await pembelianBahanBakus.create({
        permohonanPembelianId: permohonanPembelianId,
        leveransir: dataPembelianBahanBaku.leveransir,
        alamat: dataPembelianBahanBaku.alamat,
        lokasi: userInformation.lokasi,
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

            const separateValueAndUnit = (str) => {
              const parts = str.split(" ");
              const value = parseFloat(parts[0]);
              const unit = parts.slice(1).join(" ");
              return { value, unit };
            };

            let findItem = await inventorys.findOne({
              where: { namaItem: data.jenisBarang },
            });

            let tempJumlahItemDiGudang = separateValueAndUnit(
              findItem.jumlahItem
            );
            let itemYangAkanDitambah = separateValueAndUnit(
              data.jumlahTerimaPengiriman
            );

            let totalItemDiGudang = 0;

            let amountToReturn = "";

            if (itemYangAkanDitambah.unit === tempJumlahItemDiGudang.unit) {
              totalItemDiGudang +=
                tempJumlahItemDiGudang.value + itemYangAkanDitambah.value;
              amountToReturn = `${totalItemDiGudang} ${tempJumlahItemDiGudang.unit}`;
            } else if (
              itemYangAkanDitambah.unit === "Kg" &&
              tempJumlahItemDiGudang.unit === "Ton"
            ) {
              let tempItemGudangDalamTon = tempJumlahItemDiGudang.value * 1000;
              totalItemDiGudang +=
                tempItemGudangDalamTon + itemYangAkanDitambah.value;

              if (totalItemDiGudang > 1000) {
                totalItemDiGudang = totalItemDiGudang / 1000;
                amountToReturn = `${totalItemDiGudang} ${tempJumlahItemDiGudang.unit}`;
              } else {
                amountToReturn = `${totalItemDiGudang} ${tempJumlahItemDiGudang.unit}`;
              }
            }

            await inventorys.update(
              {
                jumlahItem: amountToReturn,
              },
              { where: { namaItem: data.jenisBarang } }
            );
          })
        );
      }

      await permohonanPembelians.update(
        {
          statusPermohonan: "Done",
        },
        { where: { id: permohonanPembelianId } }
      );

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Menambahkan pembelian bahan baku dengan id ${result.id}`,
        name: "Leveransir: " + result.leveransir,
        division: "Inventory",
        lokasi: userInformation.lokasi,
      });

      await UserActivityLogs.create({
        userId: id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });

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
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await pembelianBahanBakus.findAll({
        where: { lokasi: findUser.lokasi },
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
      const { userId } = req.query;

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

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus pembelian bahan baku dengan id ${id}`,
        name: "Leveransir: " + findPembelianBahanBaku.leveransir,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: userId,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemPembelianBahanBaku(req, res) {
    try {
      const { id } = req.params;
      const { userId, pembelianBahanBakuId } = req.query;

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await itemPembelianBahanBakus.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus item pembelian bahan baku dengan id ${id} dari pembelian bahan baku dengan id ${pembelianBahanBakuId}`,
        name: "Id Pembelian bahan baku: " + pembelianBahanBakuId,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await inventorys.findAll({
        where: { lokasi: findUser.lokasi },
        include: [{ model: inventoryHistorys }],
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const { dataInventory } = req.body;

      let userInformation = await users.findOne({
        where: { id: id },
      });

      let createDataInventory = await inventorys.create({
        namaItem: dataInventory.namaItem,
        rincianItem: dataInventory.rincianItem,
        jumlahItem: dataInventory.jumlahItem,
        lokasi: userInformation.lokasi,
        kodeBarang: dataInventory.kodeBarang,
      });

      await UserInventorys.create({
        userId: id,
        inventoryId: createDataInventory.id,
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Menambahkan item bahan baku dengan id ${createDataInventory.id}`,
        name: "Nama Item: " + createDataInventory.namaItem,
        division: "Inventory",
        lokasi: userInformation.lokasi,
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

      const findOneDataInventory = await inventorys.findOne({
        where: { id: dataInventory.inventoryItemId },
      });

      let result = await inventorys.update(
        {
          namaItem: dataInventory.namaItem,
          rincianItem: dataInventory.rincianItem,
          jumlahItem: dataInventory.jumlahItem,
          kodeBarang: dataInventory.kodeBarang,
          lokasi: dataInventory.lokasiPenyimpanan,
        },
        { where: { id: dataInventory.inventoryItemId } }
      );

      const userInformation = await users.findOne({
        where: { id: id },
      });

      let updateActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Update item bahan baku dengan id ${findOneDataInventory.id}`,
        name: "Nama Item :" + dataInventory.namaItem,
        division: "Inventory",
        lokasi: userInformation.lokasi,
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
        activity: `Delete item bahan baku dengan id ${inventoryItemId}`,
        name: "Nama Item: " + inventoryData.namaItem,
        division: "Inventory",
        lokasi: userInformation.lokasi,
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
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await activitylogs.findAll({
        where: { division: "Inventory", lokasi: findUser.lokasi },
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
        tanggalAkhirStokOpnam: dataStokOpnam.tanggalAkhirStokOpnam,
        statusStokOpnam: "Ongoing",
        lokasi: userInformation.lokasi,
      });

      await UserStokOpnams.create({
        userId: id,
        stokOpnamId: result.id,
      });

      if (
        dataStokOpnam.itemStokOpnams &&
        Array.isArray(dataStokOpnam.itemStokOpnams)
      ) {
        await Promise.all(
          dataStokOpnam.itemStokOpnams.map(async (item) => {
            await itemStokOpnams.create({
              stokOpnamId: result.id,
              idBarang: item.idBarang,
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
        activity: `Menambahkan data stok opnam dengan id ${result.id}`,
        name: "Judul Stok Opnam: " + result.judulStokOpnam,
        division: "Inventory",
        lokasi: userInformation.lokasi,
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
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await stokOpnams.findAll({
        where: { lokasi: findUser.lokasi },
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
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await stokOpnams.findOne({
        where: { id: id, lokasi: findUser.lokasi },
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

      const findOneStokOpnam = await stokOpnams.findOne({
        where: { id: dataStokOpnam.id },
      });
      let result = await stokOpnams.update(
        {
          judulStokOpnam: dataStokOpnam.judulStokOpnam,
          tanggalStokOpnam: dataStokOpnam.tanggalStokOpnam,
          tanggalAkhirStokOpnam: dataStokOpnam.tanggalAkhirStokOpnam,
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

      let userInformation = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Mengedit stok opnam dengan id ${findOneStokOpnam.id}`,
        name: "Leveransir: " + dataStokOpnam.judulStokOpnam,
        division: "Inventory",
        lokasi: userInformation.lokasi,
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
  static async deleteItemStokOpnam(req, res) {
    try {
      const { id } = req.params;
      const { userId, stokOpnamId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await itemStokOpnams.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus item stok opnam dengan id ${id} dari stok opnam dengan id ${stokOpnamId}`,
        name: "ID Stok Opnam: " + stokOpnamId,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteStokOpnam(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      let findOneStokOpnam = await stokOpnams.findOne({
        where: { id: id },
      });

      let result = await findOneStokOpnam.destroy({});

      let findUser = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus stok opnam dengan id ${id}`,
        name: "Judul Stok Opnam: " + findOneStokOpnam.judulStokOpnam,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addPenyerahanBarang(req, res) {
    try {
      const { id } = req.params;
      const { dataPenyerahanBarang, productionPlanningId } = req.body;

      let userInformation = await users.findOne({
        where: { id: id },
      });

      let result = await penyerahanBarangs.create({
        orderId: dataPenyerahanBarang.orderId,
        productionPlanningId: dataPenyerahanBarang.productionPlanningId,
        diambilOleh: dataPenyerahanBarang.diambilOleh,
        tanggalPenyerahan: dataPenyerahanBarang.tanggalPenyerahan,
        tanggalPengambilan: dataPenyerahanBarang.tanggalPengambilan,
        statusPenyerahan: dataPenyerahanBarang.statusPenyerahan,
        lokasi: userInformation.lokasi,
      });
      await UserPenyerahanBarangs.create({
        userId: id,
        penyerahanBarangId: result.id,
      });
      if (
        dataPenyerahanBarang.itemPenyerahanBarangs &&
        Array.isArray(dataPenyerahanBarang.itemPenyerahanBarangs)
      ) {
        Promise.all(
          dataPenyerahanBarang.itemPenyerahanBarangs.map(async (data) => {
            await itemPenyerahanBarangs.create({
              penyerahanBarangId: result.id,
              namaBarang: data.namaItem,
              kodeBarang: data.kodeBarang,
              rincianItem: data.rincianItem,
              jumlahYangDiambil: data.jumlahYangDiambil,
              selisihBarang: data.selisihBarang,
              lokasiPenyimpanan: data.lokasiPeyimpanan,
              idBarang: data.idBarang,
            });
            await inventorys.update(
              {
                jumlahItem: data.selisihBarang,
              },
              { where: { id: data.idBarang } }
            );
          })
        );
      }

      await productionPlannings.update(
        {
          statusProductionPlanning: "Processed",
        },
        { where: { id: productionPlanningId } }
      );

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Menambahkan penyerahan bahan baku dengan id ${result.id}`,
        name: "Order Id: " + dataPenyerahanBarang.orderId,
        division: "Inventory",
        lokasi: userInformation.lokasi,
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
  static async getAllPengambilanBarang(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await penyerahanBarangs.findAll({
        where: { lokasi: findUser.lokasi },
        include: [{ model: itemPenyerahanBarangs }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deletePenyerahanBarang(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      let findUser = await users.findOne({
        where: { id: userId },
      });

      const findPenyerahanBarang = await penyerahanBarangs.findOne({
        where: { id: id },
      });
      let result = penyerahanBarangs.destroy({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus penyerahan barang dengan id ${id}`,
        name: "ID Pesanan: " + findPenyerahanBarang.orderId,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getPenyerahanBarang(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });
      let result = await penyerahanBarangs.findOne({
        where: { id: id, lokasi: findUser.lokasi },
        include: [{ model: itemPenyerahanBarangs }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async deleteItemPenyerahanBarang(req, res) {
    try {
      const { id } = req.params;
      const { userId, penyerahanBarangId } = req.query;

      let findUser = await users.findOne({
        where: { id: userId },
      });

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      let findPenyerahanBarangs = await itemPenyerahanBarangs.findOne({
        where: { id: id },
      });

      let jumlahYangDiambil = separateValueAndUnit(
        findPenyerahanBarangs.jumlahYangDiambil
      );
      let jumlahSelisih = separateValueAndUnit(
        findPenyerahanBarangs.selisihBarang
      );

      let totalAwal;
      if (jumlahYangDiambil.unit === "Kg" && jumlahSelisih.unit === "Ton") {
        totalAwal = `${
          (jumlahSelisih.value * 1000 + jumlahYangDiambil.value) / 1000
        } Ton`;
      } else {
        totalAwal = `${jumlahYangDiambil.value + jumlahSelisih.value} ${
          jumlahSelisih.unit
        }`;
      }

      await inventorys.update(
        {
          jumlahItem: totalAwal,
        },
        { where: { id: findPenyerahanBarangs.idBarang } }
      );

      let result = await findPenyerahanBarangs.destroy({});

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menghapus item penyerahan barang dengan id ${id} dari penyerahan barang dengan id ${penyerahanBarangId}`,
        name: "ID Penyerahan Barang: " + penyerahanBarangId,
        division: "Inventory",
        lokasi: findUser.lokasi,
      });

      await UserActivityLogs.create({
        userId: findUser.id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  static async editPenyerahanBarang(req, res) {
    try {
      const { id } = req.params;
      const { dataPenyerahanBarang } = req.body;

      const findOnePenyerahanBarang = await penyerahanBarangs.findOne({
        where: { id: dataPenyerahanBarang.id },
      });

      const separateValueAndUnit = (str) => {
        const parts = str.split(" ");
        const value = parseFloat(parts[0]);
        const unit = parts.slice(1).join(" ");
        return { value, unit };
      };

      const convertToKgIfApplicable = (value, unit) => {
        if (unit === "Ton") {
          return value * 1000;
        }
        return value;
      };

      await penyerahanBarangs.update(
        {
          diambilOleh: dataPenyerahanBarang.diambilOleh,
          tanggalPenyerahan: dataPenyerahanBarang.tanggalPenyerahan,
          tanggalPengambilan: dataPenyerahanBarang.tanggalPengambilan,
          statusPenyerahan: dataPenyerahanBarang.statusPenyerahan,
        },
        { where: { id: dataPenyerahanBarang.id } }
      );

      if (
        dataPenyerahanBarang.itemPenyerahanBarangs &&
        Array.isArray(dataPenyerahanBarang.itemPenyerahanBarangs)
      ) {
        await Promise.all(
          dataPenyerahanBarang.itemPenyerahanBarangs.map(async (data) => {
            if (!data.id) {
              await itemPenyerahanBarangs.create({
                penyerahanBarangId: dataPenyerahanBarang.id,
                namaBarang: data.namaItem,
                kodeBarang: data.kodeBarang,
                rincianItem: data.rincianItem,
                jumlahYangDiambil: data.jumlahYangDiambil,
                selisihBarang: data.selisihBarang,
                lokasiPenyimpanan: data.lokasiPeyimpanan,
              });

              await inventorys.update(
                {
                  jumlahItem: data.selisihBarang,
                },
                { where: { id: data.idBarang } }
              );
            } else {
              const originalData = await itemPenyerahanBarangs.findOne({
                where: { id: data.id },
              });

              const originalJumlah = separateValueAndUnit(
                originalData.jumlahYangDiambil
              );
              const newJumlah = separateValueAndUnit(data.jumlahYangDiambil);

              const originalValue = convertToKgIfApplicable(
                originalJumlah.value,
                originalJumlah.unit
              );
              const newValue = convertToKgIfApplicable(
                newJumlah.value,
                newJumlah.unit
              );

              const difference = newValue - originalValue;

              await itemPenyerahanBarangs.update(
                {
                  penyerahanBarangId: dataPenyerahanBarang.id,
                  namaBarang: data.namaItem,
                  kodeBarang: data.kodeBarang,
                  rincianItem: data.rincianItem,
                  jumlahYangDiambil: data.jumlahYangDiambil,
                  selisihBarang: data.selisihBarang,
                  lokasiPenyimpanan: data.lokasiPeyimpanan,
                },
                { where: { id: data.id } }
              );

              const inventoryItem = await inventorys.findOne({
                where: { id: data.idBarang },
              });
              const inventoryJumlah = separateValueAndUnit(
                inventoryItem.jumlahItem
              );

              const inventoryValue = convertToKgIfApplicable(
                inventoryJumlah.value,
                inventoryJumlah.unit
              );

              const updatedValue = inventoryValue - difference;

              let updatedJumlah, updatedUnit;
              if (updatedValue >= 1000 && inventoryJumlah.unit === "Kg") {
                updatedJumlah = updatedValue / 1000;
                updatedUnit = "Ton";
              } else {
                updatedJumlah = updatedValue;
                updatedUnit = inventoryJumlah.unit;
              }

              await inventorys.update(
                {
                  jumlahItem: `${updatedJumlah} ${updatedUnit}`,
                },
                { where: { id: data.idBarang } }
              );
            }
          })
        );
      }
      let userInformation = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Mengedit penyerahan barang dengan id ${dataPenyerahanBarang.id}`,
        name: "Order Id: " + findOnePenyerahanBarang.orderId,
        division: "Inventory",
        lokasi: userInformation.lokasi,
      });

      await UserActivityLogs.create({
        userId: id,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
      });
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false, error });
    }
  }

  static async statusStokOpnamComplete(req, res) {
    try {
      const { id } = req.params;

      let stokOpnamUpdate = await stokOpnams.findOne({
        where: { id: id },
        include: [{ model: itemStokOpnams }],
      });

      if (
        stokOpnamUpdate.itemStokOpnams &&
        Array.isArray(stokOpnamUpdate.itemStokOpnams)
      ) {
        Promise.all(
          stokOpnamUpdate.itemStokOpnams.map(async (result) => {
            await inventoryHistorys.create({
              inventoryId: result.idBarang,
              suratPesanan: result.suratPesanan,
              tanggalMasuk: result.tanggalMasuk,
              tanggalPengembalian: result.tanggalPengembalian,
              stokOpnamAwal: result.stokOpnamAwal,
              stokOpnamAkhir: result.stokOpnamAkhir,
              stokFisik: result.stokFisik,
              stokSelisih: result.stokSelisih,
              keterangan: result.keterangan,
            });
          })
        );
      }

      let result = await stokOpnamUpdate.update({
        statusStokOpnam: "Done",
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getPenyerahanBarangOrderId(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });

      let result = await penyerahanBarangs.findOne({
        where: { orderId: id, lokasi: findUser.lokasi },
        include: [{ model: itemPenyerahanBarangs }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async denyPermohonanPembelian(req, res) {
    try {
      const { id } = req.params;

      const findOnePermohonanPembelian = await permohonanPembelians.findOne({
        where: { id: id },
      });

      let result = await permohonanPembelians.update(
        {
          statusPermohonan: "Denied",
        },
        { where: { id: id } }
      );
      let userInformation = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Menolak permohonan pembelian dengan id ${findOnePermohonanPembelian.id}`,
        name: "Nomor: " + findOnePermohonanPembelian.nomor,
        division: "Finance",
        lokasi: userInformation.lokasi,
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
  static async acceptPermohonanPembelian(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const findOnePermohonanPembelian = await permohonanPembelians.findOne({
        where: { id: id },
      });

      let result = await permohonanPembelians.update(
        {
          statusPermohonan: "Accepted",
        },
        { where: { id: id } }
      );
      let userInformation = await users.findOne({
        where: { id: userId },
      });

      let createActivityLog = await activitylogs.create({
        user: userInformation.name,
        activity: `Menerima permohonan pembelian dengan id ${findOnePermohonanPembelian.id}`,
        name: "Nomor: " + findOnePermohonanPembelian.nomor,
        division: "Finance",
        lokasi: userInformation.lokasi,
      });

      await UserActivityLogs.create({
        userId: userId,
        id: createActivityLog.id,
        activitylogsId: createActivityLog.id,
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
          department: "Inventory",
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
        activity: `Mengupdate kredensial user/menambahkan user ke dalam divisi inventory`,
        name: `Divisi: Inventory`,
        division: "Inventory",
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

module.exports = InventoryController;

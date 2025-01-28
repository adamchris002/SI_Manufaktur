const { Op, DatabaseError } = require("sequelize");
const {
  orders,
  bukuBanks,
  itemBukuBanks,
  kasHarians,
  itemKasHarians,
  posPembayarans,
  hutangs,
  UserBukuBanks,
  UserKasHarians,
  UserRencanaPembayarans,
  rencanaPembayarans,
  itemRencanaPembayarans,
  pajakMasukans,
  pajakKeluarans,
  cicilans,
  pembayaranLains,
  cicilanPemLains,
  users,
  activitylogs,
  UsersActivityLogs,
  productionPlannings,
  pembelianBahanBakus,
  rincianCetakans,
  perincians,
  estimasiBahanBakus,
  bahanBakuAkanDigunakans,
  estimasiJadwalProduksis,
  rencanaJadwalProduksis,
  itemPembelianBahanBakus,
  UserActivityLogs,
} = require("../models");
const dayjs = require("dayjs");

class FinanceController {
  static async getDoneBukuBank(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await bukuBanks.findAll({
        where: { statusBukuBank: "Done", lokasi: findUser.lokasi },
        include: [{ model: itemBukuBanks }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getOngoingBukuBank(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await bukuBanks.findAll({
        where: { statusBukuBank: "Ongoing", lokasi: findUser.lokasi },
        include: [{ model: itemBukuBanks }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addNamaBank(req, res) {
    try {
      const { id } = req.params;
      const { namaBank, namaBank2 } = req.body;

      let findUser = await users.findOne({
        where: { id: id },
      });

      let result = await bukuBanks.create({
        namaBank: namaBank,
        namaBank2: namaBank2,
        statusBukuBank: "Ongoing",
        lokasi: findUser.lokasi,
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan Buku Bank dengan nama ${namaBank}`,
        name: `ID Buku Bank: ${result.id}`,
        division: "Finance",
        lokasi: findUser.lokasi,
      });

      await UsersActivityLogs.create({
        userId: findUser.id,
        activityLogId: createActivityLog.id,
        id: createActivityLog.id,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addNewBukuBank(req, res) {
    const { id } = req.params;
    const { namaBank, dataBukuBank } = req.body;

    let findUser = await users.findOne({
      where: { id: id },
    });

    let findBank = await bukuBanks.findOne({
      where: { namaBank: namaBank, statusBukuBank: "Ongoing" },
    });

    if (dataBukuBank && Array.isArray(dataBukuBank)) {
      await Promise.all(
        dataBukuBank.map(async (data) => {
          if (!data.id) {
            await itemBukuBanks.create({
              bukuBankId: findBank.id,
              tanggal: data.tanggal,
              uraian: data.uraian,
              debet: data.debet,
              kredit: data.kredit,
              saldo: data.saldo,
              keterangan: data.keterangan,
            });
          } else {
            await itemBukuBanks.update(
              {
                tanggal: data.tanggal,
                uraian: data.uraian,
                debet: data.debet,
                kredit: data.kredit,
                saldo: data.saldo,
                keterangan: data.keterangan,
              },
              { where: { id: data.id } }
            );
          }

          let createActivitylog = await activitylogs.create({
            user: findUser.name,
            activity: `Menambahkan item debet/kredit pada buku bank ${namaBank}`,
            name: `ID Buku Bank: ${findBank.id}`,
            division: "Finance",
            lokasi: findUser.lokasi,
          });
        })
      );
    }
    res.json();
    try {
    } catch (error) {
      res.json(error);
    }
  }
  static async updateStatusDone(req, res) {
    try {
      const { id } = req.params;
      let result = await bukuBanks.update(
        {
          statusBukuBank: "Done",
        },
        { where: { id: id } }
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async checkIfNamaBankAvailable(req, res) {
    try {
      const { name } = req.params;
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });
      let result = await bukuBanks.findAll({
        where: { namaBank: name, lokasi: findUser.lokasi },
      });
      if (result.length > 1) {
        return res.json({ available: false });
      } else {
        return res.json({ available: true });
      }
    } catch (error) {
      res.json(error);
    }
  }
  static async getPreviousSaldoAkhir(req, res) {
    try {
      const { name } = req.params;
      const { userId } = req.query;

      const findUser = await users.findOne({
        where: { id: userId },
      });
      let latestBankData = await bukuBanks.findAll({
        where: {
          namaBank: name,
          statusBukuBank: "Done",
          lokasi: findUser.lokasi,
        },
        order: [["updatedAt", "DESC"]],
        limit: 1,
        include: [{ model: itemBukuBanks }],
      });
      res.json(latestBankData);
    } catch (error) {
      res.json(error);
    }
  }
  static async addKasHarian(req, res) {
    try {
      const { id } = req.params;
      const { judulKasHarian, dataKasHarian } = req.body;

      let findKasHarian = await kasHarians.findOne({
        where: { judulKasHarian },
      });

      let findUser = await users.findOne({
        where: { id: id },
      });

      let result;
      if (!findKasHarian) {
        result = await kasHarians.create({
          judulKasHarian,
          statusKasHarian: "Ongoing",
          lokasi: findUser.lokasi,
        });
      } else {
        result = findKasHarian;
      }

      if (dataKasHarian && Array.isArray(dataKasHarian)) {
        await Promise.all(
          dataKasHarian.map(async (data) => {
            if (!data.id) {
              await itemKasHarians.create({
                kasHarianId: result.id,
                tanggal: data.tanggal,
                uraian: data.uraian,
                nomorBp: data.nomorBp,
                pos: data.pos,
                debet: data.debet,
                kredit: data.kredit,
                sisa: data.sisa,
              });
            } else {
              await itemKasHarians.update(
                {
                  uraian: data.uraian,
                  pos: data.pos,
                  debet: data.debet,
                  kredit: data.kredit,
                  sisa: data.sisa,
                },
                { where: { id: data.id } }
              );
            }

            let createActivityLog = await activitylogs.create({
              user: findUser.name,
              activity: `Menambahkan item kas harian dari kas harian dengan id ${result.id}`,
              name: `Judul Kas Harian: ${result.judulKasHarian}`,
              division: "Finance",
              lokasi: findUser.lokasi,
            });
          })
        );
      }

      res.status(200).json({ message: "Kas Harian processed successfully" });
    } catch (error) {
      console.error(error.stack);
      res
        .status(500)
        .json({ error: "An error occurred while processing Kas Harian" });
    }
  }
  static async getOngoingKasHarian(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await kasHarians.findOne({
        where: { statusKasHarian: "Ongoing", lokasi: findUser.lokasi },
        include: [{ model: itemKasHarians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateStatusKasHarianDone(req, res) {
    try {
      const { id } = req.params;
      let result = await kasHarians.update(
        {
          statusKasHarian: "Done",
        },
        { where: { id: id } }
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getDoneKasHarian(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await kasHarians.findAll({
        where: { statusKasHarian: "Done", lokasi: findUser.lokasi },
        include: [{ model: itemKasHarians }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async checkForDefaultPosPembayaran(req, res) {
    try {
      let findDefaultData = await posPembayarans.findAll({});
      if (findDefaultData.length === 0) {
        const defaultPosPembayaranData = [
          {
            kode: "A",
            uraian: "Saldo",
            kataKunci: "",
          },
          {
            kode: "A1",
            uraian: "Pembelian",
            kataKunci: "",
          },
          {
            kode: "A2",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "B1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "B2",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "B3",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C2",
            uraian: "Gaji",
            kataKunci: "",
          },
          {
            kode: "C3",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C4",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "C6",
            uraian: "Honor",
            kataKunci: "",
          },
          {
            kode: "C7",
            uraian: "Biaya Pemeliharaan Gedung",
            kataKunci: "",
          },
          {
            kode: "C8",
            uraian: "Pinjaman",
            kataKunci: "",
          },
          {
            kode: "D",
            uraian: "Terima Kas",
            kataKunci: "",
          },
          {
            kode: "D1",
            uraian: "Listrik",
            kataKunci: "",
          },
          {
            kode: "D3",
            uraian: "Telepon",
            kataKunci: "",
          },
          {
            kode: "D4",
            uraian: "Sumbangan",
            kataKunci: "",
          },
          {
            kode: "E1",
            uraian: "Biaya Promosi",
            kataKunci: "",
          },
          {
            kode: "E2",
            uraian: "Biaya Entertainment",
            kataKunci: "",
          },
          {
            kode: "E3",
            uraian: "Biaya Dinas Luar",
            kataKunci: "",
          },
          {
            kode: "E4",
            uraian: "Biaya Perlengkapan Kantor",
            kataKunci: "",
          },
          {
            kode: "E5",
            uraian: "Biaya Perbaikan",
            kataKunci: "",
          },
          {
            kode: "E6",
            uraian: "Biaya Service Kendaraan",
            kataKunci: "",
          },
          {
            kode: "E7",
            uraian: "Biaya Bahan Bakar Kendaraan",
            kataKunci: "",
          },
          {
            kode: "E8",
            uraian: "Biaya Lain-lain",
            kataKunci: "",
          },
          {
            kode: "E9",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "E10",
            uraian: "Hutang",
            kataKunci: "",
          },
          {
            kode: "E11",
            uraian: "Hutang",
            kataKunci: "",
          },
          {
            kode: "E12",
            uraian: "Hutang",
            kataKunci: "",
          },
          {
            kode: "F1",
            uraian: "Biaya Asuransi Kendaraan / Gedung/ Karyawan",
            kataKunci: "",
          },
          {
            kode: "F2",
            uraian: "Biaya Pajak Kendaraan",
            kataKunci: "",
          },
          {
            kode: "F3",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "F4",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "F5",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "F6",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "G1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "G2",
            uraian: "Setor Antar Rekening",
            kataKunci: "",
          },
          {
            kode: "H1",
            uraian: "",
            kataKunci: "",
          },
          {
            kode: "I",
            uraian: "Investasi",
            kataKunci: "",
          },
        ];

        if (
          defaultPosPembayaranData &&
          Array.isArray(defaultPosPembayaranData)
        ) {
          await Promise.all(
            defaultPosPembayaranData.map(async (data) => {
              await posPembayarans.create({
                // kasHarianId: 1,
                kode: data.kode,
                uraian: data.uraian,
                kataKunci: data.kataKunci,
              });
            })
          );
        }
      }
      res.json();
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllPosPembayaran(req, res) {
    try {
      let result = await posPembayarans.findAll({});
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async savePosPembayaran(req, res) {
    try {
      const { id } = req.params;
      const { dataPosPembayaran } = req.body;
      if (dataPosPembayaran && Array.isArray(dataPosPembayaran)) {
        await Promise.all(
          dataPosPembayaran.map(async (data) => {
            if (!data.id) {
              await posPembayarans.create({
                kasHarianId: 1,
                kode: data.value,
                uraian: data.uraian,
                kataKunci: data.kataKunci,
              });
            } else {
              await posPembayarans.update(
                {
                  kode: data.value,
                  uraian: data.uraian,
                  kataKunci: data.kataKunci,
                },
                { where: { id: data.id } }
              );
            }
          })
        );
      }
    } catch (error) {
      res.json(error);
    }
  }
  static async addPembayaranLainLain(req, res) {
    try {
      const { id } = req.params;
      const { dataPembayaranLainLain, dataBank } = req.body;

      const findBukuBank = await bukuBanks.findOne({
        where: { namaBank: dataBank.namaBank },
        include: [{ model: itemBukuBanks }],
      });

      let findUser = await users.findOne({
        where: { id: id },
      });

      let prevSaldo = 0;

      if (findBukuBank && findBukuBank.itemBukuBanks.length > 0) {
        const mostRecentSaldo = findBukuBank.itemBukuBanks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0].saldo;

        prevSaldo = parseFloat(mostRecentSaldo);
      }

      const totalNominal = dataPembayaranLainLain.reduce((sum, current) => {
        return parseFloat(sum) + parseFloat(current.jumlahHarga);
      }, 0);

      const latestTanggalJatuhTempo = dataPembayaranLainLain.reduce(
        (maxDate, current) => {
          const currentDate = dayjs(current.tanggalJatuhTempo);
          return currentDate.isAfter(maxDate) ? currentDate : maxDate;
        },
        dayjs(dataPembayaranLainLain[0].tanggalJatuhTempo)
      );

      let result = await rencanaPembayarans.findOne({
        where: { statusRencanaPembayaran: "Ongoing", lokasi: findUser.lokasi },
      });

      let itemTempRencanaPembayarans = await itemRencanaPembayarans.create({
        rencanaPembayaranId: result.id,
        tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
        uraian: `Pembelian Lain-Lain ${dayjs().format("MM/DD/YYYY hh:mm A")}`,
        tanggalJatuhTempo: dayjs(latestTanggalJatuhTempo).format(
          "MM/DD/YYYY hh:mm A"
        ),
        nominal: totalNominal,
        keterangan: "",
        statusRencanaPembayaran: "Ongoing",
        lokasi: findUser.lokasi,
      });
      if (dataPembayaranLainLain && Array.isArray(dataPembayaranLainLain)) {
        await Promise.all(
          dataPembayaranLainLain.map(async (data) => {
            let tempDataPembayaranLainLain = await pembayaranLains.create({
              itemRencanaPembayaranId: itemTempRencanaPembayarans.id,
              tanggal: data.tanggal,
              uraian: data.uraian,
              noInvoiceKwitansiJs: data.noInvoiceKwitansiSj,
              jumlahHarga: data.jumlahHarga,
              tanggalJatuhTempo: data.tanggalJatuhTempo,
              pembayaran: data.pembayaran,
              keterangan: data.keterangan,
              noRekening: dataBank.namaBank,
            });
            if (data.keterangan === "Lunas") {
              if (data.pembayaran === "Hutang") {
                prevSaldo -= parseFloat(data.jumlahHarga);
                await itemBukuBanks.create({
                  bukuBankId: findBukuBank.id,
                  tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                  uraian: `Hutang Pembayaran Lain-Lain ${dataPembayaranLainLain[0].id}`,
                  debet: null,
                  kredit: parseFloat(data.jumlahHarga),
                  saldo: prevSaldo,
                  keterangan: "Lunas",
                });
              } else {
                prevSaldo += parseFloat(data.jumlahHarga);
                await itemBukuBanks.create({
                  bukuBankId: findBukuBank.id,
                  tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                  uraian: `Piutang Pembayaran Lain-Lain ${dataPembayaranLainLain[0].id}`,
                  debet: parseFloat(data.jumlahHarga),
                  kredit: null,
                  saldo: prevSaldo,
                  keterangan: "Lunas",
                });
              }
            }
            if (data.cicilan && Array.isArray(data.cicilan)) {
              await Promise.all(
                data.cicilan.map(async (value) => {
                  await cicilanPemLains.create({
                    pembayaranLainId: tempDataPembayaranLainLain.id,
                    tanggal: value.tanggal,
                    jumlahHarga: value.jumlah,
                    tanggalJatuhTempo: value.tanggal,
                    statusCicilan: "Belum Lunas",
                    noRekening: dataBank.namaBank,
                  });
                })
              );
            }
          })
        );
      }

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan pembayaran lain-lain ke dalam buku bank ${dataBank.namaBank}`,
        name: `Nama Buku Bank: ${dataBank.namaBank}`,
        division: "Finance",
        lokasi: findUser.lokasi,
      });
      res.json();
    } catch (error) {
      res.json(error);
    }
  }
  static async addHutang(req, res) {
    try {
      const { id } = req.params;
      const { dataHutang, dataBank, pembelianBahanBakuId } = req.body;

      let findOnePembelianBahanBaku = await pembelianBahanBakus.findOne({
        where: { id: pembelianBahanBakuId },
      });

      await findOnePembelianBahanBaku.update({
        statusHutang: "Done",
      });

      let findUser = await users.findOne({
        where: { id: id },
      });

      const findBukuBank = await bukuBanks.findOne({
        where: { namaBank: dataBank.namaBank },
        include: [{ model: itemBukuBanks }],
      });

      let prevSaldo = 0;

      if (findBukuBank && findBukuBank.itemBukuBanks.length > 0) {
        const mostRecentSaldo = findBukuBank.itemBukuBanks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0].saldo;

        prevSaldo = parseFloat(mostRecentSaldo);
      }

      const latestTanggalJatuhTempo = dataHutang.reduce((maxDate, current) => {
        const currentDate = dayjs(current.tanggalJatuhTempo);
        return currentDate.isAfter(maxDate) ? currentDate : maxDate;
      }, dayjs(dataHutang[0].tanggalJatuhTempo));

      const totalNominal = dataHutang.reduce((sum, current) => {
        return parseFloat(sum) + parseFloat(current.jumlahHarga);
      }, 0);

      let result = await rencanaPembayarans.findOne({
        where: { statusRencanaPembayaran: "Ongoing", lokasi: findUser.lokasi },
      });

      let itemTempRencanaPembayarans = await itemRencanaPembayarans.create({
        rencanaPembayaranId: result.id,
        tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
        uraian: `Pembelian ${dataHutang[0].id}`,
        tanggalJatuhTempo: dayjs(latestTanggalJatuhTempo).format(
          "MM/DD/YYYY hh:mm A"
        ),
        nominal: totalNominal,
        keterangan: "",
        statusRencanaPembayaran: "Ongoing",
        lokasi: findUser.lokasi,
      });

      if (dataHutang && Array.isArray(dataHutang)) {
        await Promise.all(
          dataHutang.map(async (data) => {
            let tempHutangs = await hutangs.create({
              itemRencanaPembayaranId: itemTempRencanaPembayarans.id,
              tanggal: data.tanggal,
              supplier: data.supplier,
              jenisBarang: data.jenisBarang,
              noInvoiceKwitansiJs: data.noInvoiceKwitansiSj,
              jumlahHarga: data.jumlahHarga,
              tanggalJatuhTempo: data.tanggalJatuhTempo,
              pembayaran: data.pembayaran,
              keterangan: data.keterangan,
              noRekening: dataBank.namaBank,
            });
            if (data.keterangan === "Lunas") {
              if (data.pembayaran === "Hutang") {
                prevSaldo -= parseFloat(data.jumlahHarga);
                await itemBukuBanks.create({
                  bukuBankId: findBukuBank.id,
                  tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                  uraian: `Hutang ${dataHutang[0].id}`,
                  debet: null,
                  kredit: parseFloat(data.jumlahHarga),
                  saldo: prevSaldo,
                  keterangan: "Lunas",
                });
              } else {
                prevSaldo += parseFloat(data.jumlahHarga);
                await itemBukuBanks.create({
                  bukuBankId: findBukuBank.id,
                  tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                  uraian: `Piutang ${dataHutang[0].id}`,
                  debet: parseFloat(data.jumlahHarga),
                  kredit: null,
                  saldo: prevSaldo,
                  keterangan: "Lunas",
                });
              }
            }
            if (data.cicilan && Array.isArray(data.cicilan)) {
              await Promise.all(
                data.cicilan.map(async (value) => {
                  await cicilans.create({
                    hutangId: tempHutangs.id,
                    tanggal: value.tanggal,
                    jumlahHarga: value.jumlah,
                    tanggalJatuhTempo: value.tanggal,
                    statusCicilan: "Belum Lunas",
                    noRekening: dataBank.namaBank,
                  });
                })
              );
            }
          })
        );
      }

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan hutang pada buku bank ${dataBank.namaBank}`,
        name: `ID Buku Bank: ${dataBank.id}`,
        division: "Finance",
        lokasi: findUser.lokasi,
      });

      // await UsersActivityLogs.create({
      //   userId: findUser.id,
      //   activityLogId: createActivityLog.id,
      //   id: createActivityLog.id,
      // });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getAllOngoingRencanaPembayaran(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      const result = await rencanaPembayarans.findAll({
        where: { statusRencanaPembayaran: "Ongoing", lokasi: findUser.lokasi },
        include: [
          {
            model: itemRencanaPembayarans,
            include: [
              {
                model: hutangs,
                include: [
                  {
                    model: cicilans,
                  },
                ],
              },
              {
                model: pembayaranLains,
                include: [
                  {
                    model: cicilanPemLains,
                  },
                ],
              },
            ],
          },
        ],
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching ongoing rencana pembayaran:", error);

      res.status(500).json({
        message: "Failed to retrieve ongoing rencana pembayaran.",
        error: error.message,
      });
    }
  }

  static async updateDoneRencanaPembayaran(req, res) {
    try {
      const { id } = req.params;

      const ongoingRecords = await rencanaPembayarans.findAll({
        where: { statusRencanaPembayaran: "Ongoing" },
      });

      if (ongoingRecords && Array.isArray(ongoingRecords)) {
        await Promise.all(
          ongoingRecords.map(async (record) => {
            await record.update({
              statusRencanaPembayaran: "Done",
            });
          })
        );
      }

      res
        .status(200)
        .json({ message: "All ongoing records updated to 'Done'" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkIfRencanaPembayaranExists(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await rencanaPembayarans.findAll({
        where: { statusRencanaPembayaran: "Ongoing", lokasi: findUser.lokasi },
      });

      if (result.length === 0) {
        await rencanaPembayarans.create({
          judulRencanaPembayaran: `Rencana Pembayaran ${dayjs().format(
            "MM/DD/YYYY"
          )}`,
          statusRencanaPembayaran: "Ongoing",
          lokasi: findUser.lokasi,
        });
        // if (ongoingHutangsAndCicilans.length !== 0) {
        //   if (
        //     ongoingHutangsAndCicilans &&
        //     Array.isArray(ongoingHutangsAndCicilans)
        //   ) {
        //     await Promise.all(
        //       ongoingHutangsAndCicilans.map(async (data) => {
        //         let tempItemRencanaPembayaran =
        //           await itemRencanaPembayarans.create({
        //             rencanaPembayaranId: dataRencanaPembayaran.id,
        //             tanggal: data.tanggal,
        //             uraian: data.uraian,
        //             tanggalJatuhTempo: data.tanggalJatuhTempo,
        //             nominal: data.nominal,
        //             keterangan: "",
        //             statusRencanaPembayaran: data.statusRencanaPembayaran,
        //           });
        //         if (data.hutangs && Array.isArray(data.hutangs)) {
        //           await Promise.all(
        //             data.hutangs.map(async (dataHutangs) => {
        //               let tempHutangs =await hutangs.create({
        //                 itemRencanaPembayaranId: tempItemRencanaPembayaran.id,
        //                 tanggal: dataHutangs.tanggal,
        //                 supplier: dataHutangs.supplier,
        //                 jenisBarang: dataHutangs.jenisBarang,
        //                 noInvoiceKwitansiJs: dataHutangs.noInvoiceKwitansiJs,
        //                 jumlahHarga: dataHutangs.jumlahHarga,
        //                 tanggalJatuhTempo: dataHutangs.tanggalJatuhTempo,
        //                 pembayaran: dataHutangs.pembayaran,
        //                 keterangan: dataHutangs.keterangan,
        //               });
        //               if (
        //                 dataHutangs.cicilans &&
        //                 Array.isArray(dataHutangs.cicilans)
        //               ) {
        //                 await Promise.all(
        //                   dataHutangs.cicilans.map(async (dataCicilans) => {
        //                     await cicilans.create({
        //                       hutangId: tempHutangs.id,
        //                       tanggal: dataCicilans.tanggal,
        //                       jumlahHarga: dataCicilans.jumlahHarga,
        //                       tanggalJatuhTempo: dataCicilans.tanggal,
        //                       statusCicilan: dataCicilans.statusCicilan,
        //                     });
        //                   })
        //                 );
        //               }
        //             })
        //           );
        //         }
        //       })
        //     );
        //   }
        // }
      }
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getDoneRencanaPembayaran(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await rencanaPembayarans.findAll({
        where: { statusRencanaPembayaran: "Done", lokasi: findUser.lokasi },
        include: [
          {
            model: itemRencanaPembayarans,
            include: [
              {
                model: hutangs,
                include: [
                  {
                    model: cicilans,
                  },
                ],
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
  static async addPajakMasukan(req, res) {
    try {
      const { id } = req.params;
      const { dataPajakMasukan, dataBank, pembelianBahanBakuId } = req.body;

      let findOnePembelianBahanBaku = await pembelianBahanBakus.findOne({
        where: { id: pembelianBahanBakuId },
      });

      await findOnePembelianBahanBaku.update({
        statusPajakMasukan: "Done",
      });

      let findPrevItemBukuBanks = await bukuBanks.findOne({
        where: { namaBank: dataBank.namaBank },
        include: [{ model: itemBukuBanks }],
      });

      let prevSaldo = 0;

      if (
        findPrevItemBukuBanks &&
        findPrevItemBukuBanks.itemBukuBanks.length > 0
      ) {
        const mostRecentSaldo = findPrevItemBukuBanks.itemBukuBanks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0].saldo;

        prevSaldo = parseFloat(mostRecentSaldo);
      }

      if (dataPajakMasukan && Array.isArray(dataPajakMasukan)) {
        await Promise.all(
          dataPajakMasukan.map(async (data) => {
            await pajakMasukans.create({
              bukuBankId: dataBank.id,
              tanggal: data.tanggal,
              leveransir: data.leveransir,
              jenisBarang: data.jenisBarang,
              noTglOrder: data.noTanggalOrder,
              kuantitas: data.kuantitas,
              hargaSatuan: data.hargaSatuan,
              jumlahHarga: data.jumlahHarga,
              noInvoiceKwitansiSj: data.noInvoiceKwitansiSj,
              noSeriFakturPajak: data.noSeriTglFakturPajak,
              dpp: data.dpp,
              ppn: data.ppn,
              keterangan: data.keterangan,
            });

            prevSaldo -= parseFloat(data.jumlahHarga) + parseFloat(data.ppn);

            await itemBukuBanks.create({
              bukuBankId: dataBank.id,
              tanggal: data.tanggal,
              uraian: `Pajak Masukan Barang ${data.jenisBarang}`,
              debet: null,
              kredit: parseFloat(data.jumlahHarga) + parseFloat(data.ppn),
              saldo: prevSaldo,
              keterangan: "Lunas",
            });
          })
        );
      }

      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan pajak masukan ke dalam buku bank ${dataBank.namaBank}`,
        name: `Nama Buku Bank: ${dataBank.namaBank}`,
        division: "Finance",
        lokasi: findUser.lokasi,
      });

      res.json(findPrevItemBukuBanks);
    } catch (error) {
      res.json(error);
    }
  }

  static async addPajakKeluaran(req, res) {
    try {
      const { id } = req.params;
      const { dataPajakKeluaran, dataBank, productionPlanningId } = req.body;

      let findProductionPlanning = await productionPlannings.findOne({
        where: { id: productionPlanningId },
      });

      await findProductionPlanning.update({ statusPajakKeluaran: "Done" });

      let findPrevItemBukuBanks = await bukuBanks.findOne({
        where: { namaBank: dataBank.namaBank },
        include: [{ model: itemBukuBanks }],
      });

      let prevSaldo = 0;

      if (
        findPrevItemBukuBanks &&
        findPrevItemBukuBanks.itemBukuBanks.length > 0
      ) {
        const mostRecentSaldo = findPrevItemBukuBanks.itemBukuBanks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0].saldo;

        prevSaldo = parseFloat(mostRecentSaldo);
      }

      if (dataPajakKeluaran && Array.isArray(dataPajakKeluaran)) {
        await Promise.all(
          dataPajakKeluaran.map(async (data) => {
            await pajakKeluarans.create({
              bukuBankId: dataBank.id,
              tanggal: data.tanggal,
              pemberiPekerjaan: data.pemberiPekerjaan,
              jenisBarang: data.jenisBarang,
              kuantitas: data.kuantitas,
              hargaSatuan: data.hargaSatuan,
              jumlahHarga: data.jumlahHarga,
              noTglSpk: data.noTanggalOrder,
              noSeriTglFakturPajak: data.noSeriTglFakturPajak,
              dpp: data.dpp,
              ppn: data.ppn,
              pph: data.pphPs22,
              keterangan: data.keterangan,
            });

            prevSaldo -=
              parseFloat(data.jumlahHarga) +
              parseFloat(data.ppn) +
              parseFloat(data.pphPs22);

            await itemBukuBanks.create({
              bukuBankId: dataBank.id,
              tanggal: data.tanggal,
              uraian: `Pajak Keluaran Orderan ${data.jenisBarang}`,
              debet: null,
              kredit:
                parseFloat(data.jumlahHarga) +
                parseFloat(data.ppn) +
                parseFloat(data.pphPs22),
              saldo: prevSaldo,
              keterangan: "Lunas",
            });
          })
        );
      }

      let findUser = await users.findOne({
        where: { id: id },
      });

      let createActivityLog = await activitylogs.create({
        user: findUser.name,
        activity: `Menambahkan pajak keluaran ke dalam buku bank ${dataBank.namaBank}`,
        name: `Nama Buku Bank: ${dataBank.namaBank}`,
        division: "Finance",
        lokasi: findUser.lokasi,
      });
      res.status(200).json({ message: "Pajak Keluaran added successfully" });
    } catch (error) {
      res.json(error);
    }
  }
  static async updateCicilan(req, res) {
    try {
      const { id } = req.params;
      const { dataCicilan } = req.body;

      let findUser = await users.findOne({
        where: { id: id },
      });

      const dataHutangFromDb = await hutangs.findOne({
        where: { id: dataCicilan[0].id },
        include: [{ model: cicilans }],
      });

      const cicilanChanged = dataHutangFromDb.cicilans.filter((item) => {
        let matchedCicilan;
        for (const data of dataCicilan) {
          matchedCicilan = data.cicilans.find((c) => c.id === item.id);
          if (matchedCicilan) break;
        }
        return (
          matchedCicilan && matchedCicilan.statusCicilan !== item.statusCicilan
        );
      });

      if (dataCicilan && Array.isArray(dataCicilan)) {
        await Promise.all(
          dataCicilan.map(async (data) => {
            const allCicilanLunas = dataCicilan.every((data) =>
              data.cicilans.every((item) => item.statusCicilan === "Lunas")
            );

            if (allCicilanLunas) {
              await hutangs.update(
                {
                  keterangan: "Lunas",
                },
                { where: { id: data.id } }
              );
            }

            if (cicilanChanged.length > 0) {
              await Promise.all(
                cicilanChanged.map(async (changedCicilan) => {
                  const matchedCicilan = dataCicilan
                    .map((data) =>
                      data.cicilans.find((c) => c.id === changedCicilan.id)
                    )
                    .find((cicilan) => cicilan !== undefined);

                  if (matchedCicilan) {
                    await cicilans.update(
                      {
                        statusCicilan: matchedCicilan.statusCicilan,
                      },
                      { where: { id: matchedCicilan.id } }
                    );
                    if (matchedCicilan.statusCicilan === "Lunas") {
                      let namaBank = await bukuBanks.findOne({
                        where: { namaBank: matchedCicilan.noRekening },
                        include: [{ model: itemBukuBanks }],
                      });

                      let prevSaldo = 0;
                      if (namaBank && namaBank.itemBukuBanks.length > 0) {
                        const mostRecentSaldo = namaBank.itemBukuBanks.sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )[0].saldo;

                        prevSaldo = parseFloat(mostRecentSaldo);
                      }

                      if (data.pembayaran === "Hutang") {
                        prevSaldo -= parseFloat(matchedCicilan.jumlahHarga);
                        await itemBukuBanks.create({
                          bukuBankId: namaBank.id,
                          tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                          uraian: `Cicilan Hutang ${dataCicilan[0].id} ${dayjs(
                            matchedCicilan.tanggalJatuhTempo
                          ).format("MM/DD/YYYY")}`,
                          debet: null,
                          kredit: parseFloat(matchedCicilan.jumlahHarga),
                          saldo: prevSaldo,
                          keterangan: "Lunas",
                        });
                      } else {
                        prevSaldo += parseFloat(matchedCicilan.jumlahHarga);
                        await itemBukuBanks.create({
                          bukuBankId: namaBank.id,
                          tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                          uraian: `Cicilan Piutang ${dataCicilan[0].id} ${dayjs(
                            matchedCicilan.tanggalJatuhTempo
                          ).format("MM/DD/YYYY")}`,
                          debet: parseFloat(matchedCicilan.jumlahHarga),
                          kredit: null,
                          saldo: prevSaldo,
                          keterangan: "Lunas",
                        });
                      }
                    }

                    let createActivityLog = await activitylogs.create({
                      user: findUser.name,
                      activity: `Mengedit cicilan dengan id ${matchedCicilan.id} dari hutang dengan id ${dataHutangFromDb.id}`,
                      name: `ID Cicilan: ${matchedCicilan.id}`,
                      division: "Finance",
                      lokasi: findUser.lokasi,
                    });
                  }
                })
              );
            }
          })
        );
      }
      res.json();
    } catch (error) {
      res.json(error);
    }
  }
  static async findPrevOngoingHutangs(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let ongoingHutangsAndCicilans = await itemRencanaPembayarans.findAll({
        where: { lokasi: findUser.lokasi },
        include: [
          {
            model: hutangs,
            where: { keterangan: "Belum Lunas" },
            include: [{ model: cicilans }],
          },
        ],
      });
      res.json(ongoingHutangsAndCicilans);
    } catch (error) {
      res.json(error);
    }
  }
  static async findPrevOngoingPembayaranLainLain(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let ongoingPembayaranLainLain = await itemRencanaPembayarans.findAll({
        where: { lokasi: findUser.lokasi },
        include: [
          {
            model: pembayaranLains,
            where: { keterangan: "Belum Lunas" },
            include: [{ model: cicilanPemLains }],
          },
        ],
      });
      res.json(ongoingPembayaranLainLain);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateCicilanPemLains(req, res) {
    try {
      const { id } = req.params;
      const { dataCicilanPemLains } = req.body;

      let findUser = await users.findOne({
        where: { id: id },
      });

      const dataPemLainsFromDb = await pembayaranLains.findOne({
        where: { id: dataCicilanPemLains[0].id },
        include: [{ model: cicilanPemLains }],
      });

      const cicilanPemLainsChanged = dataPemLainsFromDb.cicilanPemLains.filter(
        (item) => {
          let matchedCicilanPemLains;
          for (const data of dataCicilanPemLains) {
            matchedCicilanPemLains = data.cicilanPemLains.find(
              (c) => c.id === item.id
            );
            if (matchedCicilanPemLains) break;
          }
          return (
            matchedCicilanPemLains &&
            matchedCicilanPemLains.statusCicilan !== item.statusCicilan
          );
        }
      );

      if (dataCicilanPemLains && Array.isArray(dataCicilanPemLains)) {
        await Promise.all(
          dataCicilanPemLains.map(async (data) => {
            const allCicilanLunas = dataCicilanPemLains.every((data) =>
              data.cicilanPemLains.every((item) =>
                !item.statusCi
                  ? item.statusCicilan === "Lunas"
                  : item.statusCi === "Lunas"
              )
            );

            if (allCicilanLunas) {
              await pembayaranLains.update(
                { keterangan: "Lunas" },
                { where: { id: data.id } }
              );
            }

            if (cicilanPemLainsChanged.length > 0) {
              await Promise.all(
                cicilanPemLainsChanged.map(async (changedCicilan) => {
                  const matchedCicilanPemLains = dataCicilanPemLains
                    .map((data) =>
                      data.cicilanPemLains.find(
                        (c) => c.id === changedCicilan.id
                      )
                    )
                    .find((cicilan) => cicilan !== undefined);

                  if (matchedCicilanPemLains) {
                    await cicilanPemLains.update(
                      {
                        statusCicilan: !matchedCicilanPemLains.statusCi
                          ? matchedCicilanPemLains.statusCicilan
                          : matchedCicilanPemLains.statusCi,
                      },
                      { where: { id: matchedCicilanPemLains.id } }
                    );
                    if (
                      matchedCicilanPemLains.statusCi === "Lunas" ||
                      matchedCicilanPemLains.statusCicilan === "Lunas"
                    ) {
                      let namaBank = await bukuBanks.findOne({
                        where: {
                          namaBank: !matchedCicilanPemLains.noRekeni
                            ? matchedCicilanPemLains.noRekening
                            : matchedCicilanPemLains.noRekeni,
                        },
                        include: [{ model: itemBukuBanks }],
                      });

                      let prevSaldo = 0;

                      if (namaBank && namaBank.itemBukuBanks.length > 0) {
                        const mostRecentSaldo = namaBank.itemBukuBanks.sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )[0].saldo;

                        prevSaldo = parseFloat(mostRecentSaldo);
                      }

                      if (data.pembayaran === "Hutang") {
                        prevSaldo -= parseFloat(
                          !matchedCicilanPemLains.jumlahHa
                            ? matchedCicilanPemLains.jumlahHarga
                            : matchedCicilanPemLains.jumlahHa
                        );
                        await itemBukuBanks.create({
                          bukuBankId: namaBank.id,
                          tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                          uraian: `Cicilan Hutang Pembayaran Lain-Lain ${
                            dataCicilanPemLains[0].id
                          } ${dayjs(
                            matchedCicilanPemLains.tanggalJatuhTempo
                          ).format("MM/DD/YYYY")}`,
                          debet: null,
                          kredit: parseFloat(
                            !matchedCicilanPemLains.jumlahHa
                              ? matchedCicilanPemLains.jumlahHarga
                              : matchedCicilanPemLains.jumlahHa
                          ),
                          saldo: prevSaldo,
                          keterangan: "Lunas",
                        });
                      } else {
                        prevSaldo += parseFloat(
                          !matchedCicilanPemLains.jumlahHa
                            ? matchedCicilanPemLains.jumlahHarga
                            : matchedCicilanPemLains.jumlahHa
                        );
                        await itemBukuBanks.create({
                          bukuBankId: namaBank.id,
                          tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
                          uraian: `Cicilan Piutang Pembayaran Lain-Lain ${
                            dataCicilanPemLains[0].id
                          } ${dayjs(
                            matchedCicilanPemLains.tanggalJatuhTempo
                          ).format("MM/DD/YYYY")}`,
                          debet: parseFloat(
                            !matchedCicilanPemLains.jumlahHa
                              ? matchedCicilanPemLains.jumlahHarga
                              : matchedCicilanPemLains.jumlahHa
                          ),
                          kredit: null,
                          saldo: prevSaldo,
                          keterangan: "Lunas",
                        });
                      }
                    }
                    let createActivityLog = await activitylogs.create({
                      user: findUser.name,
                      activity: `Mengedit cicilan pembayaran lain dengan id ${matchedCicilanPemLains.id} dari pembayaran lain-lain dengan id ${dataPemLainsFromDb.id}`,
                      name: `ID Cicilan Pembayaran Lain: ${matchedCicilanPemLains.id}`,
                      division: "Finance",
                      lokasi: findUser.lokasi,
                    });
                  }
                })
              );
            }
          })
        );
      }
      res.json();
    } catch (error) {
      res.json(error);
    }
  }
  static async getActiveRencanaPembayaranOneYear(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      const thisYearStart = dayjs().startOf("year").toDate();
      const thisYearEnd = dayjs().endOf("year").toDate();

      let result = await rencanaPembayarans.findAll({
        where: {
          createdAt: {
            [Op.between]: [thisYearStart, thisYearEnd],
          },
          lokasi: findUser.lokasi,
        },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async financeActivityLog(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await activitylogs.findAll({
        where: { division: "Finance", lokasi: findUser.lokasi },
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }

  static async getPembelianBahanBakuForPajakMasukan(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await pembelianBahanBakus.findAll({
        where: { statusPajakMasukan: null, lokasi: findUser.lokasi },
        include: [{ model: itemPembelianBahanBakus }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getPembelianBahanbakuForHutang(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await pembelianBahanBakus.findAll({
        where: { statusHutang: null, lokasi: findUser.lokasi },
        include: [{ model: itemPembelianBahanBakus }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getAllProductionPlanningForPajakKeluaran(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });

      let result = await productionPlannings.findAll({
        where: { statusPajakKeluaran: null, lokasi: findUser.lokasi },
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
  static async getUserLama(req, res) {
    try {
      let result = await users.findAll({
        where: {
          department: "Finance",
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
        activity: `Mengupdate kredensial user/menambahkan user ke dalam divisi keuangan`,
        name: `Divisi: Finance`,
        division: "Finance",
        lokasi: findUser.lokasi,
      });

      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateDivisiOwner(req, res) {
    try {
      const { namaDivisi } = req.params;
      let updateOwnerDivision = await users.update(
        {
          department: namaDivisi,
        },
        { where: { role: "Owner" } }
      );
      res.json(updateOwnerDivision);
    } catch (error) {
      res.json(error);
    }
  }
  static async updateLocationOwner(req, res) {
    try {
      const { namaLokasi } = req.params;
      let updateOwnerLocation = await users.update(
        {
          lokasi: namaLokasi,
        },
        { where: { role: "Owner" } }
      );
      res.json(updateOwnerLocation);
    } catch (error) {
      res.json(error);
    }
  }
  static async getNamaBukuBankSama(req, res) {
    try {
      const { id } = req.params;

      const findUser = await users.findOne({
        where: { id: id },
      });
      let result = await bukuBanks.findAll({
        where: { lokasi: findUser.lokasi },
      });
      let dataNamaBanks = result.map((data) => data.namaBank2);
      let uniqueDataNamaBanks = [...new Set(dataNamaBanks)];
      res.json(uniqueDataNamaBanks);
    } catch (error) {
      res.json(error);
    }
  }
  static async getOrderDone(req, res) {
    try {
      const { id } = req.params;
      const findUser = await users.findOne({
        where: { id: id },
      });

      const findOrderDone = await orders.findAll({
        where: { orderStatus: "Done", lokasi: findUser.lokasi },
      });

      const itemBukuBankTitles = await itemBukuBanks.findAll({
        attributes: ["uraian"],
      });

      const itemBukuBankOrderTitles = itemBukuBankTitles.map(
        (item) => item.uraian
      );

      const filteredOrders = findOrderDone.filter(
        (order) =>
          !itemBukuBankOrderTitles.includes("Pemasukan " + order.orderTitle)
      );

      res.json(filteredOrders);
    } catch (error) {
      res.json(error);
    }
  }
  static async pembayaranPesananDone(req, res) {
    try {
      const id = req.params;
      const { itemBukuBank, dataBank } = req.body;

      const findBukuBank = await bukuBanks.findOne({
        where: { namaBank: dataBank.namaBank },
        include: [{ model: itemBukuBanks }],
      });

      let prevSaldo = 0;

      if (findBukuBank && findBukuBank.itemBukuBanks.length > 0) {
        const mostRecentSaldo = findBukuBank.itemBukuBanks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0].saldo;

        prevSaldo = parseFloat(mostRecentSaldo);
      }

      prevSaldo += parseFloat(itemBukuBank.debet);

      const createItemBukuBank = await itemBukuBanks.create({
        bukuBankId: dataBank.id,
        tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
        uraian: itemBukuBank.uraian,
        debet: itemBukuBank.debet,
        kredit: itemBukuBank.kredit,
        saldo: prevSaldo,
        keterangan: itemBukuBank.keterangan,
      });
      res.json(createItemBukuBank);
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = FinanceController;

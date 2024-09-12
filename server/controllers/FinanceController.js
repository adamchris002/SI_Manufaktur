const {
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
} = require("../models");
const dayjs = require("dayjs");

class FinanceController {
  static async getDoneBukuBank(req, res) {
    try {
      let result = await bukuBanks.findAll({
        where: { statusBukuBank: "Done" },
        include: [{ model: itemBukuBanks }],
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async getOngoingBukuBank(req, res) {
    try {
      let result = await bukuBanks.findAll({
        where: { statusBukuBank: "Ongoing" },
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
      const { namaBank } = req.body;
      let result = await bukuBanks.create({
        namaBank: namaBank,
        statusBukuBank: "Ongoing",
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
  static async addNewBukuBank(req, res) {
    const { id } = req.params;
    const { namaBank, dataBukuBank } = req.body;

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
      let result = await bukuBanks.findAll({
        where: { namaBank: name },
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
      let latestBankData = await bukuBanks.findAll({
        where: { namaBank: name, statusBukuBank: "Done" },
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

      let result;
      if (!findKasHarian) {
        result = await kasHarians.create({
          judulKasHarian,
          statusKasHarian: "Ongoing",
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
      let result = await kasHarians.findOne({
        where: { statusKasHarian: "Ongoing" },
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
      let result = await kasHarians.findAll({
        where: { statusKasHarian: "Done" },
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
                kasHarianId: 1,
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
  static async addHutang(req, res) {
    try {
      const { id } = req.params;
      const { dataHutang } = req.body;

      const latestTanggalJatuhTempo = dataHutang.reduce((maxDate, current) => {
        const currentDate = dayjs(current.tanggalJatuhTempo);
        return currentDate.isAfter(maxDate) ? currentDate : maxDate;
      }, dayjs(dataHutang[0].tanggalJatuhTempo));

      const totalNominal = dataHutang.reduce((sum, current) => {
        return parseFloat(sum) + parseFloat(current.jumlahHarga);
      }, 0);

      let result = await rencanaPembayarans.findOne({
        where: { statusRencanaPembayaran: "Ongoing" },
      });

      let itemTempRencanaPembayarans = await itemRencanaPembayarans.create({
        rencanaPembayaranId: result.id,
        tanggal: dayjs().format("MM/DD/YYYY hh:mm A"),
        uraian: `Hutang Pembelian ${dataHutang[0].id}`,
        tanggalJatuhTempo: dayjs(latestTanggalJatuhTempo).format(
          "MM/DD/YYYY hh:mm A"
        ),
        nominal: totalNominal,
        keterangan: "",
        statusRencanaPembayaran: "Ongoing",
      });

      if (dataHutang && Array.isArray(dataHutang)) {
        await Promise.all(
          dataHutang.map(async (data) => {
            console.log(data.cicilan);
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
            });
            if (data.cicilan && Array.isArray(data.cicilan)) {
              await Promise.all(
                data.cicilan.map(async (value) => {
                  await cicilans.create({
                    hutangId: tempHutangs.id,
                    tanggal: value.tanggal,
                    jumlahHarga: value.jumlah,
                    tanggalJatuhTempo: value.tanggal,
                    statusCicilan: "Belum Lunas",
                  });
                })
              );
            }
          })
        );
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getAllOngoingRencanaPembayaran(req, res) {
    try {
      const result = await rencanaPembayarans.findAll({
        where: { statusRencanaPembayaran: "Ongoing" },
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
      let result = await rencanaPembayarans.findAll({
        where: { statusRencanaPembayaran: "Ongoing" },
      });

      if (result.length === 0) {
        await rencanaPembayarans.create({
          judulRencanaPembayaran: `Rencana Pembayaran ${dayjs().format(
            "MM/DD/YYYY"
          )}`,
          statusRencanaPembayaran: "Ongoing",
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
      let result = await rencanaPembayarans.findAll({
        where: { statusRencanaPembayaran: "Done" },
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
      const { dataPajakMasukan, dataBank } = req.body;

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
              keterangan: data.keterangan,
            });
          })
        );
      }

      res.status(200).json({ message: "Pajak Masukan added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addPajakKeluaran(req, res) {
    try {
      const { id } = req.params;
      const { dataPajakKeluaran, dataBank } = req.body;

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
              keterangan: data.keterangan,
            });
          })
        );
      }
      res.status(200).json({ message: "Pajak Keluaran added successfully" });
    } catch (error) {
      res.json(error);
    }
  }
  static async updateCicilan(req, res) {
    try {
      const { id } = req.params;
      const { dataCicilan } = req.body;

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

            if (data.cicilans && Array.isArray(data.cicilans)) {
              await Promise.all(
                data.cicilans.map(async (value) => {
                  await cicilans.update(
                    {
                      statusCicilan: value.statusCicilan,
                    },
                    { where: { id: value.id } }
                  );
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
  static async findPrevOngoingHutangs (req,res) {
    try {
      let ongoingHutangsAndCicilans = await itemRencanaPembayarans.findAll({
        include: [
          {
            model: hutangs,
            where: { keterangan: "Belum Lunas" },
            include: [{ model: cicilans }],
          },
        ],
      });
      res.json(ongoingHutangsAndCicilans)
    } catch (error) {
      res.json(error)
    }
  }
}

module.exports = FinanceController;

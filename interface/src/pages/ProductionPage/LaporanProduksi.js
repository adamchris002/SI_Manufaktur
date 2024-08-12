import React, { useEffect, useRef, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import factoryBackgroundPotrait from "../../assets/factorybackgroundpotrait.png"
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MySelectTextField from "../../components/SelectTextField";
import dayjs from "dayjs";
import axios from "axios";
import DefaultButton from "../../components/Button";

const LaporanProduksi = (props) => {
  const { userInformation } = props;
  const navigate = useNavigate();

  const pdfRef = useRef();

  const [tanggalProduksiSelesai, setTanggalProduksiSelesai] = useState(
    dayjs("")
  );
  const [allKegiatanProduksiDone, setAllKegiatanProduksiDone] = useState([]);
  const [allTahapProduksi, setAllTahapProduksi] = useState([]);
  const [noOrderProduksiAvailable, setNoOrderProduksiAvailable] = useState([]);
  const [selectedNoOrderProduksi, setSelectedNoOrderProduksi] = useState("");
  const [selectedTahapProduksiAvailable, setSelectedTahapProduksiAvailable] =
    useState("");
  const [selectedKegiatanProduksi, setSelectedKegiatanProduksi] = useState([]);
  console.log(selectedKegiatanProduksi)

  const handleGetKegiatanProduksi = () => {
    if (
      !tanggalProduksiSelesai ||
      !dayjs(tanggalProduksiSelesai, "MM/DD/YYYY", true).isValid()
    ) {
      return false;
    } else {
      axios({
        method: "GET",
        url: "http://localhost:3000/production/getKegiatanProduksiDone",
        params: {
          tanggalProduksiSelesai: tanggalProduksiSelesai.format("MM/DD/YYYY"),
        },
      }).then((result) => {
        if (result.status === 200) {
          const uniqueData = result.data.reduce((acc, item) => {
            if (
              !acc.some(
                (existingItem) =>
                  existingItem.noOrderProduksi === item.noOrderProduksi
              )
            ) {
              acc.push(item);
            }
            return acc;
          }, []);
          const tempNoOrderProduksiValue = uniqueData.map((item) => ({
            value: item.noOrderProduksi,
          }));
          setNoOrderProduksiAvailable(tempNoOrderProduksiValue);
          setAllKegiatanProduksiDone(result.data);
        } else {
          console.log(result);
        }
      });
    }
  };

  const handleChangeInputNoOrderProduksi = (event) => {
    const selectedValue = event.target.value;
    setSelectedNoOrderProduksi(selectedValue);

    const tempData = allKegiatanProduksiDone
      .filter((result) => result.noOrderProduksi === selectedValue)
      .map((result) => {
        return {
          value: result.tahapProduksi,
        };
      });
    return setAllTahapProduksi(tempData);
  };

  const handleChangeInputTahapProduksi = (event) => {
    const selectedValue = event.target.value;
    setSelectedTahapProduksiAvailable(selectedValue);

    const tempData = allKegiatanProduksiDone
      .filter(
        (result) =>
          result.noOrderProduksi === selectedNoOrderProduksi &&
          result.tahapProduksi === selectedValue
      )
      .map((result) => {
        return {
          ...result,
        };
      });
    setSelectedKegiatanProduksi(tempData);
  };

  const handleSaveAsPdf = () => {
    const pdf = new jsPDF("landscape", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(factoryBackground, 'png', 0, 0, pageWidth, pageHeight);

    let y = 15;
    const margin = 10;

    pdf.setFontSize(24);
    pdf.text("Laporan Produksi", margin, y);

    pdf.setFontSize(12);
    y += 15;

    selectedKegiatanProduksi.forEach((result) => {
      pdf.text(`ID: ${result.id}`, margin, y);
      pdf.text(
        `Tanggal Produksi: ${dayjs(result.tanggalProduksi).format(
          "MM/DD/YYYY hh:mm A"
        )}`,
        80,
        y
      );
      y += 10;

      pdf.text(`No Order Produksi: ${result.noOrderProduksi}`, margin, y);
      pdf.text(`Mesin: ${result.mesin}`, 80, y);
      y += 10;

      pdf.text(`Dibuat Oleh: ${result.dibuatOleh}`, margin, y);
      pdf.text(`Tahap Produksi: ${result.tahapProduksi}`, 80, y);
      y += 10;

      pdf.text(`Jenis Cetakan: ${result.jenisCetakan}`, margin, y);
      pdf.text(
        `Tanggal Produksi Selesai: ${dayjs(result.updatedAt).format(
          "MM/DD/YYYY hh:mm A"
        )}`,
        80,
        y
      );
      y += 15;

      pdf.setFontSize(18);
      pdf.text(`Personil:`, margin, y);
      pdf.setFontSize(12);
      y += 10;

      result.personils.forEach((data, dataIndex) => {
        pdf.text(`${dataIndex + 1}. ${data.nama}`, margin + 10, y);
        y += 10;
      });

      y += 10;

      pdf.setFontSize(18);
      pdf.text(`Bahan Laporan Produksi:`, margin, y);
      pdf.setFontSize(12);
      y += 10;

      const tableColumnsDataBahan = [
        "No.",
        "Jenis",
        "Kode",
        "Berat Awal",
        "Berat Akhir",
        "Keterangan",
      ];
      const tableRows = [];

      result?.bahanLaporanProdukses?.forEach((data, dataIndex) => {
        tableRows.push({
          no: dataIndex + 1,
          jenis: data.jenis,
          kode: data.kode,
          beratAwal: data.beratAwal,
          beratAkhir: data.beratAkhir,
          keterangan: data.keterangan,
        });
      });

      pdf.autoTable({
        startY: y,
        head: [tableColumnsDataBahan],
        body: tableRows.map((row) => Object.values(row)),
        theme: "striped",
        margin: { left: margin, right: margin },
      });

      y = pdf.lastAutoTable.finalY + 15;

      const tableColumnsDataJadwalProduksiPracetak = [
        "No.",
        "Jam Produksi Awal",
        "Jam Produksi Akhir",
        "No Order Produksi",
        "Jenis Cetakan",
        "Perolehan Cetakan",
        "Waste",
        "Keterangan",
      ];
      const tableColumnsDataJadwalProduksiCetak = [
        "No.",
        "Jam Produksi Awal",
        "Jam Produksi Akhir",
        "No Order Produksi",
        "Jenis Cetakan",
        "Perolehan Cetakan",
        "Waste Sobek (Kg)",
        "Waste Kulit (Kg)",
        "Waste Gelondong (Kg)",
        "Waste Sampah (Kg)",
        "Roll Habis",
        "Roll Sisa",
        "Keterangan",
      ];
      const tableColumnsDataJadwalProduksiFitur = [
        "No.",
        "Jam Produksi Awal",
        "Jam Produksi Akhir",
        "No Order Produksi",
        "Jenis Cetakan",
        "Nomorator Awal",
        "Nomorator Akhir",
        "Perolehan Cetakan",
        "Waste",
        "Keterangan",
      ];
      const tableRowsDataJadwalProduksiPracetak = [];
      const tableRowsDataJadwalProduksiCetak = [];
      const tableRowsDataJadwalProduksiFitur = [];

      pdf.setFontSize(18);
      pdf.text(`Jadwal Produksi:`, margin, y);
      pdf.setFontSize(12);
      y += 10;

      switch (result.tahapProduksi) {
        case "Produksi Pracetak":
          result?.jadwalProdukses?.forEach((data, dataIndex) => {
            console.log(data.waste)
            tableRowsDataJadwalProduksiPracetak.push({
              no: dataIndex + 1,
              jamAwalProduksi: dayjs(data.jamAwalProduksi).format(
                "MM/DD/YYYY hh:mm A"
              ),
              jamAkhirProduksi: dayjs(data.jamAkhirProduksi).format(
                "MM/DD/YYYY hh:mm A"
              ),
              noOrderProduksi: data.noOrderProduksi,
              jenisCetakan: data.jenisCetakan,
              perolehanCetakan: data.perolehanCetak,
              waste: data.waste,
              keterangan: data.keterangan,
            });
          });
          console.log(tableRowsDataJadwalProduksiPracetak)
          pdf.autoTable({
            startY: y,
            head: [tableColumnsDataJadwalProduksiPracetak],
            body: tableRowsDataJadwalProduksiPracetak.map((row) =>
              Object.values(row)
            ),
            theme: "striped",
            margin: { left: margin, right: margin },
          });
          break;
        case "Produksi Cetak":
          result?.jadwalProdukses?.forEach((data, dataIndex) => {
            tableRowsDataJadwalProduksiCetak.push({
              no: dataIndex + 1,
              jamAwalProduksi: dayjs(data.jamAwalProduksi).format(
                "MM/DD/YYYY hh:mm A"
              ),
              jamAkhirProduksi: dayjs(data.jamAkhirProduksi).format(
                "MM/DD/YYYY hh:mm A"
              ),
              noOrderProduksi: data.noOrderProduksi,
              jenisCetakan: data.jenisCetakan,
              perolehanCetakan: data.perolehanCetak,
              sobek: data.sobek,
              kulit: data.kulit,
              gelondong: data.gelondong,
              sampah: data.sampah,
              rollHabis: data.rollHabis ? "V" : "X",
              rollSisa: data.rollSisa ? "V" : "X",
              keterangan: data.keterangan,
            });
          });

          pdf.autoTable({
            startY: y,
            head: [tableColumnsDataJadwalProduksiCetak],
            body: tableRowsDataJadwalProduksiCetak.map((row) =>
              Object.values(row)
            ),
            theme: "striped",
            margin: { left: margin, right: margin },
          });
          break;
        case "Produksi Fitur":
          result?.jadwalProdukses?.forEach((data, dataIndex) => {
            tableRowsDataJadwalProduksiFitur.push({
              no: dataIndex + 1,
              jamAwalProduksi: dayjs(data.jamAwalProduksi).format(
                "MM/DD/YYYY hh:mm A"
              ),
              jamAkhirProduksi: dayjs(data.jamAkhirProduksi).format(
                "MM/DD/YYYY hh:mm A"
              ),
              noOrderProduksi: data.noOrderProduksi,
              jenisCetakan: data.jenisCetakan,
              nomoratorAwal: data.nomoratorAwal,
              nomoratorAkhir: data.nomoratorAkhir,
              perolehanCetakan: data.perolehanCetak,
              waste: data.waste,
              keterangan: data.keterangan,
            });
            pdf.autoTable({
              startY: y,
              head: [tableColumnsDataJadwalProduksiFitur],
              body: tableRowsDataJadwalProduksiFitur.map((row) =>
                Object.values(row)
              ),
              theme: "striped",
              margin: { left: margin, right: margin },
            });
          });
          break;
        default:
          return false;
      }

      y = pdf.lastAutoTable.finalY + 20;
    });

    pdf.save("kegiatan-produksi.pdf");
  };

  return (
    <div
      className="hideScrollbar"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
        overflow: "auto",
      }}
    >
      <div style={{ height: "100%", width: "100%" }} ref={pdfRef}>
        <div style={{ margin: "32px" }}>
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Cari Kegiatan Produksi
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{ color: "#0F607D", fontSize: "1.5vw", width: "350px" }}
            >
              Tanggal Kegiatan Produksi:
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer sx={{ padding: 0 }} components={["DatePicker"]}>
                  <DemoItem sx={{ padding: 0 }}>
                    <DatePicker
                      valueType="date"
                      value={
                        tanggalProduksiSelesai.isValid()
                          ? tanggalProduksiSelesai
                          : null
                      }
                      onChange={(event) => {
                        setTanggalProduksiSelesai(event);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={params.error || !params.value}
                          helperText={params.error ? "Invalid date format" : ""}
                        />
                      )}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
              <div style={{ marginLeft: "8px", height: "100%" }}>
                <DefaultButton
                  height="56px"
                  onClickFunction={() => {
                    handleGetKegiatanProduksi();
                  }}
                >
                  Cari Kegiatan Produksi
                </DefaultButton>
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "16px" }}
          >
            <Typography
              style={{ color: "#0F607D", fontSize: "1.5vw", width: "350px" }}
            >
              No Order Produksi:
            </Typography>
            <MySelectTextField
              value={selectedNoOrderProduksi}
              data={noOrderProduksiAvailable}
              onChange={(event) => {
                handleChangeInputNoOrderProduksi(event);
              }}
              width="200px"
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "16px" }}
          >
            <Typography
              style={{ color: "#0F607D", fontSize: "1.5vw", width: "350px" }}
            >
              Tahap Produksi:
            </Typography>
            <MySelectTextField
              value={selectedTahapProduksiAvailable}
              onChange={(event) => {
                handleChangeInputTahapProduksi(event);
              }}
              data={allTahapProduksi}
              width="200px"
            />
          </div>
          {selectedKegiatanProduksi.length !== 0 && (
            <div style={{ marginTop: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                    Informasi Kegiatan Produksi
                  </Typography>
                  {selectedKegiatanProduksi?.map((result, index) => {
                    return (
                      <div key={index}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            marginTop: "16px",
                          }}
                        >
                          <Typography
                            style={{
                              color: "#0F607D",
                              fontSize: "1.5vw",
                              width: "300px",
                            }}
                          >{`ID: ${result.id}`}</Typography>
                          <Typography
                            style={{ color: "#0F607D", fontSize: "1.5vw" }}
                          >{`Tanggal Produksi: ${dayjs(
                            result.tanggalProduksi
                          ).format("MM/DD/YYYY hh:mm A")}`}</Typography>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            marginTop: "8px",
                          }}
                        >
                          <Typography
                            style={{
                              color: "#0F607D",
                              fontSize: "1.5vw",
                              width: "300px",
                            }}
                          >{`No Order Produksi: ${result.noOrderProduksi}`}</Typography>
                          <Typography
                            style={{ color: "#0F607D", fontSize: "1.5vw" }}
                          >{`Mesin: ${result.mesin}`}</Typography>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            marginTop: "8px",
                          }}
                        >
                          <Typography
                            style={{
                              color: "#0F607D",
                              fontSize: "1.5vw",
                              width: "300px",
                            }}
                          >{`Dibuat Oleh: ${result.dibuatOleh}`}</Typography>
                          <Typography
                            style={{ color: "#0F607D", fontSize: "1.5vw" }}
                          >{`Tahap Produksi: ${result.tahapProduksi}`}</Typography>
                        </div>
                        <div style={{ marginTop: "8px" }}>
                          <Typography
                            style={{ color: "#0F607D", fontSize: "1.5vw" }}
                          >{`Jenis Cetakan: ${result.jenisCetakan}`}</Typography>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ width: "48%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                    Personil
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "25px" }}>No.</TableCell>
                          <TableCell align="left">Nama</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedKegiatanProduksi?.map((result, index) => {
                          return (
                            <React.Fragment key={index}>
                              {result.personils.map((data, dataIndex) => {
                                return (
                                  <TableRow key={dataIndex}>
                                    <TableCell>{index + 1 + "."}</TableCell>
                                    <TableCell>{data.nama}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
              <div style={{ marginTop: "32px" }}>
                <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                  Bahan Kegiatan Produksi
                </Typography>
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table
                    sx={{
                      minWidth: 650,
                      overflowX: "auto",
                      tableLayout: "fixed",
                    }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "25px" }}>No.</TableCell>
                        <TableCell style={{ width: "200px" }}>Jenis</TableCell>
                        <TableCell style={{ width: "200px" }}>Kode</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Berat Awal
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Berat Akhir
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Keterangan
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedKegiatanProduksi?.map((result, index) => {
                        return (
                          <React.Fragment key={index}>
                            {result?.bahanLaporanProdukses?.map(
                              (data, dataIndex) => {
                                return (
                                  <TableRow key={dataIndex}>
                                    <TableCell>{index + 1 + "."}</TableCell>
                                    <TableCell>{data.jenis}</TableCell>
                                    <TableCell>{data.kode}</TableCell>
                                    <TableCell>{data.beratAwal}</TableCell>
                                    <TableCell>{data.beratAkhir}</TableCell>
                                    <TableCell>{data.keterangan}</TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div style={{ marginTop: "32px" }}>
                {selectedKegiatanProduksi?.map((result, index) => {
                  return (
                    <div key={index} style={{ paddingBottom: "32px" }}>
                      {result.tahapProduksi === "Produksi Pracetak" && (
                        <>
                          <Typography
                            style={{ color: "#0F607D", fontSize: "3vw" }}
                          >
                            Jadwal Produksi Pracetak
                          </Typography>
                          <TableContainer
                            component={Paper}
                            sx={{ overflowX: "auto" }}
                          >
                            <Table
                              sx={{
                                minWidth: 650,
                                overflowX: "auto",
                                tableLayout: "fixed",
                              }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ width: "25px" }}>
                                    No.
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jam Awal Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jam Akhir Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    No Order Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jenis Cetakan
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Perolehan Cetakan
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Waste
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Keterangan
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {result?.jadwalProdukses?.map(
                                  (data, dataIndex) => {
                                    return (
                                      <React.Fragment key={dataIndex}>
                                        <TableRow>
                                          <TableCell>
                                            {dataIndex + 1 + "."}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(data.jamAwalProduksi).format(
                                              "MM/DD/YYYY hh:mm A"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(
                                              data.jamAkhirProduksi
                                            ).format("MM/DD/YYYY hh:mm A")}
                                          </TableCell>
                                          <TableCell>
                                            {data.noOrderProduksi}
                                          </TableCell>
                                          <TableCell>
                                            {data.jenisCetakan}
                                          </TableCell>
                                          <TableCell>
                                            {data.perolehanCetak}
                                          </TableCell>
                                          <TableCell>{data.waste}</TableCell>
                                          <TableCell>
                                            {data.keterangan}
                                          </TableCell>
                                        </TableRow>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                      {result.tahapProduksi === "Produksi Cetak" && (
                        <>
                          <Typography
                            style={{ color: "#0F607D", fontSize: "3vw" }}
                          >
                            Jadwal Produksi Cetak
                          </Typography>
                          <TableContainer
                            component={Paper}
                            sx={{ overflowX: "auto" }}
                          >
                            <Table
                              sx={{
                                minWidth: 650,
                                overflowX: "auto",
                                tableLayout: "fixed",
                              }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ width: "25px" }}>
                                    No.
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jam Awal Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jam Akhir Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    No Order Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jenis Cetakan
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Perolehan Cetakan
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    {"Waste Sobek (Kg)"}
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    {"Waste Kulit (Kg)"}
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    {"Waste Gelondong (Kg)"}
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    {"Waste Sampah (Kg)"}
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Roll Habis
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Roll Sisa
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Keterangan
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {result?.jadwalProdukses?.map(
                                  (data, dataIndex) => {
                                    return (
                                      <React.Fragment key={dataIndex}>
                                        <TableRow>
                                          <TableCell>
                                            {dataIndex + 1 + "."}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(data.jamAwalProduksi).format(
                                              "MM/DD/YYYY hh:mm A"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(
                                              data.jamAkhirProduksi
                                            ).format("MM/DD/YYYY hh:mm A")}
                                          </TableCell>
                                          <TableCell>
                                            {data.noOrderProduksi}
                                          </TableCell>
                                          <TableCell>
                                            {data.jenisCetakan}
                                          </TableCell>
                                          <TableCell>
                                            {data.perolehanCetak}
                                          </TableCell>
                                          <TableCell>{data.sobek}</TableCell>
                                          <TableCell>{data.kulit}</TableCell>
                                          <TableCell>
                                            {data.gelondong}
                                          </TableCell>
                                          <TableCell>{data.sampah}</TableCell>
                                          <TableCell>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={data.rollHabis}
                                                />
                                              }
                                              disabled
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={data.rollSisa}
                                                />
                                              }
                                              disabled
                                            />
                                          </TableCell>
                                          <TableCell>
                                            {data.keterangan}
                                          </TableCell>
                                        </TableRow>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                      {result.tahapProduksi === "Produksi Fitur" && (
                        <>
                          <Typography
                            style={{ color: "#0F607D", fontSize: "3vw" }}
                          >
                            Jadwal Produksi Fitur
                          </Typography>
                          <TableContainer
                            component={Paper}
                            sx={{ overflowX: "auto" }}
                          >
                            <Table
                              sx={{
                                minWidth: 650,
                                overflowX: "auto",
                                tableLayout: "fixed",
                              }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ width: "25px" }}>
                                    No.
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jam Awal Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jam Akhir Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    No Order Produksi
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Jenis Cetakan
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Nomorator Awal
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Nomorator Akhir
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Perolehan Cetakan
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Waste
                                  </TableCell>
                                  <TableCell style={{ width: "200px" }}>
                                    Keterangan
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {result?.jadwalProdukses?.map(
                                  (data, dataIndex) => {
                                    return (
                                      <React.Fragment key={dataIndex}>
                                        <TableRow>
                                          <TableCell>
                                            {dataIndex + 1 + "."}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(data.jamAwalProduksi).format(
                                              "MM/DD/YYYY hh:mm A"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(
                                              data.jamAkhirProduksi
                                            ).format("MM/DD/YYYY hh:mm A")}
                                          </TableCell>
                                          <TableCell>
                                            {data.noOrderProduksi}
                                          </TableCell>
                                          <TableCell>
                                            {data.jenisCetakan}
                                          </TableCell>
                                          <TableCell>
                                            {data.nomoratorAwal}
                                          </TableCell>
                                          <TableCell>
                                            {data.nomoratorAkhir}
                                          </TableCell>
                                          <TableCell>
                                            {data.perolehanCetak}
                                          </TableCell>
                                          <TableCell>{data.waste}</TableCell>
                                          <TableCell>
                                            {data.keterangan}
                                          </TableCell>
                                        </TableRow>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: "32px",
                }}
              >
                <DefaultButton onClickFunction={() => {}}>
                  Simpan Excel
                </DefaultButton>
                <div style={{ marginLeft: "8px" }}>
                  <DefaultButton
                    onClickFunction={() => {
                      handleSaveAsPdf();
                    }}
                  >
                    Simpan PDF
                  </DefaultButton>
                </div>
                <Button
                  style={{ textTransform: "none", marginLeft: "8px" }}
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaporanProduksi;

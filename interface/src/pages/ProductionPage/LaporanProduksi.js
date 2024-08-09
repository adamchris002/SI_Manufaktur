import React, { useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { TextField, Typography } from "@mui/material";
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

  const [tanggalProduksiSelesai, setTanggalProduksiSelesai] = useState(
    dayjs("")
  );
  const [allKegiatanProduksiDone, setAllKegiatanProduksiDone] = useState([]);
  const [allTahapProduksi, setAllTahapProduksi] = useState([]);
  const [noOrderProduksiAvailable, setNoOrderProduksiAvailable] = useState([]);
  const [selectedNoOrderProduksi, setSelectedNoOrderProduksi] = useState("");
  const [selectedTahapProduksiAvailable, setSelectedTahapProduksiAvailable] =
    useState("");

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

    const tempData = allKegiatanProduksiDone.map((result) => {
      if (result.noOrderProduksi === selectedValue) {
        return {
          value: result.tahapProduksi
        }
      }
    })
    setAllTahapProduksi(tempData)
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
      <div style={{ height: "100%", width: "100%" }}>
        <div style={{ margin: "32px" }}>
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Laporan Produksi
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{ color: "#0F607D", fontSize: "1.5vw", width: "350px" }}
            >
              Tanggal Kegiatan Produksi:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DemoItem>
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
            <MySelectTextField data={allTahapProduksi} width="200px" />
          </div>
          <div>
            <Typography
              style={{ color: "#0F607D", fontSize: "1.5vw" }}
            ></Typography>
          </div>
        </div>
        <DefaultButton
          onClickFunction={() => {
            handleGetKegiatanProduksi();
          }}
        >
          Test
        </DefaultButton>
      </div>
    </div>
  );
};

export default LaporanProduksi;

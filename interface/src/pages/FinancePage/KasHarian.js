import React, { useContext, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import {
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
import { NumericFormat } from "react-number-format";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AppContext } from "../../App";
import dayjs from "dayjs";

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="Rp."
    />
  );
});

const KasHarian = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);

  const [dataKasharian, setDataKasHarian] = useState([
    {
        tanggal: dayjs(),
        uraian: "",
        nomorBp: "",
        pos: "",
        debet: "",
        kredit: "",
        sisa: "",
    }
  ])

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
      <div style={{ width: "100%", height: "100vh" }}>
        <div style={{ margin: "32px" }}>
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Kas Harian
          </Typography>
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table
              sx={{
                minWidth: 650,
                tableLayout: "fixed",
                overflowX: "auto",
              }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25px" }}>No.</TableCell>
                  <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                  <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                  <TableCell style={{ width: "200px" }}>Nomor BP</TableCell>    
                  <TableCell style={{ width: "200px" }}>Pos</TableCell>
                  <TableCell style={{ width: "200px" }}>Debet</TableCell>
                  <TableCell style={{ width: "200px" }}>Kredit</TableCell>
                  <TableCell style={{ width: "200px" }}>Sisa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataKasharian.map((result, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{index + 1 + "."}</TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DemoItem>
                                <DateTimePicker
                                  //   disablePast
                                  disabled
                                  value={
                                    result.tanggal.isValid()
                                      ? result.tanggal
                                      : null
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={params.error || !params.value}
                                      helperText={
                                        params.error
                                          ? "Invalid date format"
                                          : ""
                                      }
                                    />
                                  )}
                                />
                              </DemoItem>
                            </DemoContainer>
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: isMobile ? "15px" : "3vw",
                                width: isMobile ? "120px" : "10vw",
                                fontSize: isMobile ? "10px" : "1.5vw",
                                borderRadius: "10px",
                                "& fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#0F607D",
                                },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: isMobile ? "15px" : "3vw",
                                width: isMobile ? "120px" : "10vw",
                                fontSize: isMobile ? "10px" : "1.5vw",
                                borderRadius: "10px",
                                "& fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#0F607D",
                                },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: isMobile ? "15px" : "3vw",
                                width: isMobile ? "120px" : "10vw",
                                fontSize: isMobile ? "10px" : "1.5vw",
                                borderRadius: "10px",
                                "& fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#0F607D",
                                },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: isMobile ? "15px" : "3vw",
                                width: isMobile ? "120px" : "10vw",
                                fontSize: isMobile ? "10px" : "1.5vw",
                                borderRadius: "10px",
                                "& fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#0F607D",
                                },
                              },
                            }}
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: isMobile ? "15px" : "3vw",
                                width: isMobile ? "120px" : "10vw",
                                fontSize: isMobile ? "10px" : "1.5vw",
                                borderRadius: "10px",
                                "& fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#0F607D",
                                },
                              },
                            }}
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: isMobile ? "15px" : "3vw",
                                width: isMobile ? "120px" : "10vw",
                                fontSize: isMobile ? "10px" : "1.5vw",
                                borderRadius: "10px",
                                "& fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#0F607D",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#0F607D",
                                },
                              },
                            }}
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default KasHarian;

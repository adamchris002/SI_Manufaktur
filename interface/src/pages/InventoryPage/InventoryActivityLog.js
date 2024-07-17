import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import axios from "axios";
import moment from "moment";
import { AppContext } from "../../App";

const InventoryActivityLog = () => {
  const { isMobile } = useContext(AppContext);

  const navigate = useNavigate();
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/inventoryActivityLog",
    }).then((result) => {
      setActivityLogs(result);
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: isMobile ? "16px" : "32px",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <IconButton
              onClick={() => {
                navigate(-1);
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          </div>
          <Typography
            sx={{ fontSize: isMobile ? "24px" : "32px", color: "#0F607D" }}
          >
            Activity Log
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div style={{ width: isMobile ? "80%" : "90%", marginTop: "16px" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell align="right">Activity</TableCell>
                    {/* <TableCell align="right">Order ID</TableCell> */}
                    <TableCell align="right">Element Name</TableCell>
                    <TableCell align="right">Division</TableCell>
                    <TableCell align="right">Created At</TableCell>
                    <TableCell align="right">Modified At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityLogs?.data?.map((result) => (
                    <TableRow
                      key={result.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="result">
                        {result.user}
                      </TableCell>
                      <TableCell align="right">{result.activity}</TableCell>
                      {/* <TableCell align="right">{""}</TableCell> */}
                      <TableCell align="right">{result.name}</TableCell>
                      <TableCell align="right">{result.division}</TableCell>
                      <TableCell align="right">
                        {moment(result.createdAt).format("LLLL")}
                      </TableCell>
                      <TableCell align="right">
                        {moment(result.updatedAt).format("LLLL")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryActivityLog;

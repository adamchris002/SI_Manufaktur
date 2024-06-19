import { createContext, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MaindashboardMarketing from "./pages/MaindashboardMarketing";
import MaindashboardProductionPlanning from "./pages/MaindashboardProductionPlanning";
import MaindashboardInventory from "./pages/MaindashboardInventory";
import MaindashboardProduction from "./pages/MaindashboardProduction";
import MaindasboardWaste from "./pages/MaindashboardWaste";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import OrderDetail from "./pages/MarketingPage/OrderDetail";
import MarketingActivityLog from "./pages/MarketingPage/MarketingActivityLog";
import EstimationOrderPage from "./pages/ProductionPlanningPage/EstimationOrderPage";
import { createTheme, useMediaQuery } from "@mui/material";

export const AppContext = createContext({});

function App() {
  const [userCredentials, setUserCredentials] = useState({});

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const AppContextValue = {
    isDesktop,
    isTablet,
    isMobile,
  };

  return (
    <>
      <AppContext.Provider value={AppContextValue}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <LoginPage
                  userCredentials={userCredentials}
                  setUserCredentials={setUserCredentials}
                />
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/marketingDashboard/*"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Marketing" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <MaindashboardMarketing userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/marketingDashboard/orderDetail/:orderId"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Marketing" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <OrderDetail userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/marketingDashboard/activityLog"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Marketing" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <MarketingActivityLog />
                )
              }
            />
            <Route
              path="/productionPlanningDashboard"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production Planning" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <MaindashboardProductionPlanning
                    userInformation={userCredentials}
                  />
                )
              }
            />
            <Route
              path="/productionPlanningDashboard/estimationOrder"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production Planning" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <EstimationOrderPage
                    userInformation={userCredentials}
                  />
                )
              }
            />
            <Route
              path="/inventoryDashboard"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Inventory" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <MaindashboardInventory />
                )
              }
            />
            <Route
              path="/productionDashboard"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <MaindashboardProduction />
                )
              }
            />
            <Route
              path="/wasteDashboard"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Waste" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <MaindasboardWaste />
                )
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Router>
      </AppContext.Provider>
    </>
  );
}

export default App;

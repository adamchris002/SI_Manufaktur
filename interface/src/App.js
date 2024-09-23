import { createContext, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createTheme, useMediaQuery } from "@mui/material";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MaindashboardMarketing from "./pages/MaindashboardMarketing";
import MaindashboardProductionPlanning from "./pages/MaindashboardProductionPlanning";
import MaindashboardInventory from "./pages/MaindashboardInventory";
import MaindashboardProduction from "./pages/MaindashboardProduction";
import MaindashboardFinance from "./pages/MaindashboardFinance";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import OrderDetail from "./pages/MarketingPage/OrderDetail";
import MarketingActivityLog from "./pages/MarketingPage/MarketingActivityLog";
import EstimationOrderPage from "./pages/ProductionPlanningPage/EstimationOrderPage";
import ProductionPlanningActivityLog from "./pages/ProductionPlanningPage/ProductionPlanningActivityLog";
import EditProductionPlanPage from "./pages/ProductionPlanningPage/EditProductionPlanPage";
import PembelianBahanBaku from "./pages/InventoryPage/PembelianBahanBaku";
import StockPage from "./pages/InventoryPage/StockPage";
import InventoryActivityLog from "./pages/InventoryPage/InventoryActivityLog";
import StokOpnam from "./pages/InventoryPage/StokOpnam";
import PenyerahanBarang from "./pages/InventoryPage/PenyerahanBarang";
import KegiatanProduksi from "./pages/ProductionPage/KegiatanProduksi";
import LaporanProduksi from "./pages/ProductionPage/LaporanProduksi";
import LaporanLimbahProduksi from "./pages/ProductionPage/LaporanLimbahProduksi";
import LaporanSampah from "./pages/InventoryPage/LaporanSampah";
import BukuBank from "./pages/FinancePage/BukuBank";
import KasHarian from "./pages/FinancePage/KasHarian";
import Pajak from "./pages/FinancePage/Pajak";
import RencanaPembayaran from "./pages/FinancePage/RencanaPembayaran";
import LaporanAktual from "./pages/ProductionPage/LaporanAktual";
import ProductionPlanningHistoryPage from "./pages/ProductionPlanningPage/ProductionPlanningHistoryPage"

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
              path="/productionPlanningDashboard/productionPlanningHistoryPage"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production Planning" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <ProductionPlanningHistoryPage
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
                  <EstimationOrderPage userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/productionPlanningDashboard/activityLog"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production Planning" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <ProductionPlanningActivityLog />
                )
              }
            />
            <Route
              path="/productionPlanningDashboard/editProductionPlan"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production Planning" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <EditProductionPlanPage userInformation={userCredentials} />
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
                  <MaindashboardInventory userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/inventoryDashboard/pembelianBahan"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Inventory" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <PembelianBahanBaku userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/inventoryDashboard/stockPage"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Inventory" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <StockPage userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/inventoryDashboard/activityLog"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Inventory" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <InventoryActivityLog />
                )
              }
            />
            <Route
              path="/inventoryDashboard/stokOpnam"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Inventory" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <StokOpnam userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/inventoryDashboard/laporanSampah"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Inventory" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <LaporanSampah userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/inventoryDashboard/penyerahanBarang"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Inventory" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <PenyerahanBarang userInformation={userCredentials} />
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
                  <MaindashboardProduction userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/productionDashboard/kegiatanProduksi"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <KegiatanProduksi userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/productionDashboard/laporanProduksi"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <LaporanProduksi userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/productionDashboard/laporanLimbahProduksi"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <LaporanLimbahProduksi userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/financeDashboard"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Finance" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <MaindashboardFinance userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/financeDashboard/bukuBank"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Finance" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <BukuBank userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/financeDashboard/kasHarian"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Finance" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <KasHarian userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/financeDashboard/pajak"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Finance" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <Pajak userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/financeDashboard/rencanaPembayaran"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Finance" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <RencanaPembayaran userInformation={userCredentials} />
                )
              }
            />
            <Route
              path="/productionDashboard/laporanAktual"
              element={
                !userCredentials.data ||
                userCredentials.data.department !== "Production" ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  <LaporanAktual userInformation={userCredentials} />
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

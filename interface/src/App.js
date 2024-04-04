import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MaindashboardMarketing from "./pages/MaindashboardMarketing";
import MaindashboardProductionPlanning from "./pages/MaindashboardProductionPlanning";
import MaindashboardInventory from "./pages/MaindashboardInventory";
import MaindashboardProduction from "./pages/MaindashboardProduction";
import MaindasboardWaste from "./pages/MaindashboardWaste";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/marketingDashboard"
            element={<MaindashboardMarketing />}
          />
          <Route
            path="/productionPlanningDashboard"
            element={<MaindashboardProductionPlanning />}
          />
          <Route
            path="/inventoryDashboard"
            element={<MaindashboardInventory />}
          >
            {/* <Route path="/stocksPage" element={<StocksPage />} /> */}
          </Route>
          <Route
            path="/productionDashboard"
            element={<MaindashboardProduction />}
          />
                    <Route
            path="/wasteDashboard"
            element={<MaindasboardWaste />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

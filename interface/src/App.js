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
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import BudgetPage from "./pages/Budget/BudgetPage";
import ProtectedRoute from "./components/ProtectedRoute";
// import AdminPage from "./pages/Admin/AdminPage"; 
import Attendee from "./pages/Attendee";
import YourBookings from "./pages/YourBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetPage />
            </ProtectedRoute>
          }
        />

        <Route path="/attendee" element={<Attendee />} />
        
        <Route path="/bookings" element={<YourBookings />} />
        {/* Admin Route */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
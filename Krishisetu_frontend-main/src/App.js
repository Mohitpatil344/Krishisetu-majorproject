import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RoleProvider, useRole } from "./contexts/RoleContext";
import Landing from "./pages/landing";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Marketplace from "./pages/marketplace";
import FarmerDetail from "./pages/WasteDetail";
import AILab from "./pages/AILab";
import TopNavigation from "./components/TopNavigation";
import Dashboard from "./pages/DashboardPage";
import RoleSelection from "./pages/RoleSelection";
import FarmerRegistration from "./pages/FarmerRegistration";
import BusinessRegistration from "./pages/BusinessRegistration";
import ResourcesPage from "./pages/ResourcesPage";
import OTPVerification from "./pages/OTPVerification";
import FarmerDashboard from "./pages/FarmerDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import Rental from "./pages/Rental";
import RentalDetails from "./pages/Rentaldetails";
import BookingPage from "./pages/BookingPage";
import AgreementPage from "./pages/Agreementpage";
import RenterDashboard from "./pages/RenterDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading } = useAuth();
  const { selectedRole } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/role-selection" replace />;
  }

  if (requiredRole && selectedRole !== requiredRole) {
    return <Navigate to="/role-selection" replace />;
  }

  return children;
};

// App Content Component to handle AuthContext loading
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <TopNavigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/agreement" element={<AgreementPage />} />
          <Route path="/renter-dashboard" element={<RenterDashboard />} />
          <Route path="/rental" element={<Rental />} />
          <Route path="/rental-details" element={<RentalDetails />} />
          <Route path="/farmer-registration" element={<FarmerRegistration />} />
          <Route path="/business-registration" element={<BusinessRegistration />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/learn" element={<ResourcesPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/ai-lab" element={<AILab />} />
          <Route path="/waste/:id" element={<FarmerDetail />} />
          <Route 
            path="/farmerDashboard" 
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/businessDashboard" 
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
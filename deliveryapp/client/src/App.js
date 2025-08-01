import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserProvider } from './UserContext';

import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Order from './components/OrderPage';
import OrderDetails from './components/OrderDetails';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/Cartpage';
import Customerprofile from './components/Customerprofile';
import DeliveryAddress from './components/DeliveryAddress';
import SupportOptions from './components/SupportOption';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import OrderConfirmation from './components/OrderConfirmation';
import OrderSuccess from './OrderSuccess';
import CheckDeliveryLocation from './components/CheckDeliveryLocation';
import SelectAddressPage from './components/SelectAddressPage';
import VerifyEmail from './components/VerifyEmail';

function App() {
  const token = localStorage.getItem('token');

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* ✅ Root redirect based on login */}
          <Route path="/" element={token ? <Navigate to="/login" replace /> : <Navigate to="/login" replace />} />

          {/* ✅ Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ✅ Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
           <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/customerProfile" element={<ProtectedRoute><Customerprofile /></ProtectedRoute>} />
          <Route path="/DeliveryAddress" element={<ProtectedRoute><DeliveryAddress /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportOptions /></ProtectedRoute>} />
          <Route path="/orderconfirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

          {/* ✅ Public Routes */}
          <Route path="/check-location" element={<CheckDeliveryLocation />} />
          <Route path="/select-address" element={<SelectAddressPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Routes>

        {/* ✅ Toast notifications */}
        <ToastContainer />
      </Router>
    </UserProvider>
  );
}

export default App;

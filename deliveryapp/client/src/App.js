import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Add this import
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Order from './components/Order';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/Cartpage';
import Customerprofile from './components/Customerprofile';
import DeliveryAddress from './components/DeliveryAddress';  
// import EditAddress from './components/EditAddress'; 
import SupportOptions from './components/SupportOption'; 
import ProtectedRoute from './ProtectedRoute'; 
import OrderConfirmation from './components/OrderConfirmation';
import ProfileManagement from './components/ProfileManagement';
import OrderSuccess from './OrderSuccess';
function App() {
  return (
    <UserProvider> {/* Wrap everything with UserProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
          <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} /> 
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/customerProfile" element={<ProtectedRoute><Customerprofile /></ProtectedRoute>} />
          <Route path="/DeliveryAddress" element={<ProtectedRoute><DeliveryAddress /></ProtectedRoute>} /> 
          {/* <Route path="/edit-address/:id" element={<EditAddress />} /> */}
          <Route path="/support" element={<ProtectedRoute><SupportOptions /></ProtectedRoute>} /> 
          <Route path="/orderconfirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} /> 
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} /> 
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
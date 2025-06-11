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
import ProfileManagement from './components/ProfileManagement';
function App() {
  return (
    <UserProvider> {/* Wrap everything with UserProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<Order />} /> 
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/customerProfile" element={<Customerprofile />} />
          <Route path="/DeliveryAddress" element={<DeliveryAddress />} /> 
          {/* <Route path="/edit-address/:id" element={<EditAddress />} /> */}
          <Route path="/support" element={<SupportOptions />} />  
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
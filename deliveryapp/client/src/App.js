import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Order from './components/Order';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/Cartpage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order" element={<Order/>} /> 
              <Route path="/product/:id" element={<ProductDetails />} />
              < Route path="cart" element={<CartPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;

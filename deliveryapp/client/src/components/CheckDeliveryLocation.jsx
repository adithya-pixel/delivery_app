// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './SelectAddressPage.css';

// const SelectAddressPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const grandTotal = location.state?.grandTotal || 0;

//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);

//   useEffect(() => {
//     const fetchAddresses = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await fetch('http://localhost:5000/api/address', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setSavedAddresses(data.data || data);
//       } catch (error) {
//         console.error('Failed to fetch addresses:', error);
//       }
//     };
//     fetchAddresses();
//   }, []);

//   const toRad = (value) => (value * Math.PI) / 180;

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth radius in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const validateAndPay = async () => {
//     if (!selectedAddressId) {
//       alert('❗ Please select a delivery address.');
//       return;
//     }

//     const selectedAddress = savedAddresses.find(a => a._id === selectedAddressId);

//     if (!selectedAddress || !selectedAddress.latitude || !selectedAddress.longitude) {
//       alert('❌ Selected address does not have valid coordinates.');
//       return;
//     }

//     const userLat = parseFloat(selectedAddress.latitude);
//     const userLng = parseFloat(selectedAddress.longitude);

//     const storeRes = await fetch('http://localhost:5000/admin/get-store');
//     const store = await storeRes.json();

//     const storeLat = parseFloat(store.latitude);
//     const storeLng = parseFloat(store.longitude);
//     const deliveryRadius = parseFloat(store.deliveryRadius);

//     const distance = calculateDistance(userLat, userLng, storeLat, storeLng);

//     if (distance > deliveryRadius) {
//       alert(`❌ This address is outside the delivery area (~${distance.toFixed(2)} km)`);
//       return;
//     }

//     // Proceed to payment
//     const options = {
//       key: 'YOUR_RAZORPAY_KEY_ID',
//       amount: grandTotal * 100,
//       currency: 'INR',
//       name: 'DatCarts Delivery',
//       description: 'Order Payment',
//       handler: function (response) {
//         alert('✅ Payment successful!\nPayment ID: ' + response.razorpay_payment_id);
//         localStorage.removeItem('cart');
//         navigate('/order-success');
//       },
//       prefill: {
//         name: 'Customer Name',
//         email: 'customer@example.com',
//         contact: '9999999999',
//       },
//       theme: { color: '#0ea5e9' },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div className="select-address-container">
//       <h2 className="heading">Select Delivery Address</h2>

//       {savedAddresses.length === 0 ? (
//         <p className="no-address-msg">No saved addresses available.</p>
//       ) : (
//         savedAddresses.map((address) => (
//           <div key={address._id} className="address-item">
//             <input
//               type="radio"
//               name="selectedAddress"
//               value={address._id}
//               onChange={() => setSelectedAddressId(address._id)}
//             />
//             <label>
//               {address.full_name}, {address.city}, {address.state} - {address.pincode}
//             </label>
//           </div>
//         ))
//       )}

//       <div className="manage-address-info">
//         <p className="manage-msg">Want to add or edit addresses?</p>
//         <button className="manage-address-btn" onClick={() => navigate('/DeliveryAddress')}>
//           ➕ Manage Address
//         </button>
//       </div>

//       <button className="pay-button" onClick={validateAndPay}>
//         Proceed to Pay ₹{grandTotal.toFixed(2)}
//       </button>
//     </div>
//   );
// };

// export default SelectAddressPage;

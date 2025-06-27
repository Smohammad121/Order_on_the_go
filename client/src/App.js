import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Authentication from './pages/Authentication';

import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualRestaurant from './pages/customer/IndividualRestaurant';

import Admin from './pages/admin/Admin';
import AllUsers from './pages/admin/AllUsers';
import AllOrders from './pages/admin/AllOrders';
import AllRestaurants from './pages/admin/AllRestaurants';

import RestaurantHome from './pages/restaurant/RestaurantHome';
import RestaurantOrders from './pages/restaurant/RestaurantOrders';
import RestaurantMenu from './pages/restaurant/RestaurantMenu';
import NewProduct from './pages/restaurant/NewProduct';
import EditProduct from './pages/restaurant/EditProduct';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getPage = (children) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );

  if (showIntro) {
    return (
      <div className="intro-container">
        <h1 className="intro-text bounce">SB Foods</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/auth" element={getPage(<Authentication />)} />
          <Route path="/" element={getPage(<Home />)} />
          <Route path="/cart" element={getPage(<Cart />)} />
          <Route path="/restaurant/:id" element={getPage(<IndividualRestaurant />)} />
          <Route path="/category/:category" element={getPage(<CategoryProducts />)} />
          <Route path="/profile" element={getPage(<Profile />)} />

          <Route path="/admin" element={getPage(<Admin />)} />
          <Route path="/all-restaurants" element={getPage(<AllRestaurants />)} />
          <Route path="/all-users" element={getPage(<AllUsers />)} />
          <Route path="/all-orders" element={getPage(<AllOrders />)} />

          <Route path="/restaurant" element={getPage(<RestaurantHome />)} />
          <Route path="/restaurant-orders" element={getPage(<RestaurantOrders />)} />
          <Route path="/restaurant-menu" element={getPage(<RestaurantMenu />)} />
          <Route path="/new-product" element={getPage(<NewProduct />)} />
          <Route path="/update-product/:id" element={getPage(<EditProduct />)} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

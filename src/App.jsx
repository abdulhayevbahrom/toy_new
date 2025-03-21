import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./routes/home/Home";
import Footer from "./components/footer/Footer";
import SinglePage from "./routes/singlepage/SinglePage";
import NewCart from "./routes/cart/NewCart";
import { Header } from "./components/header/Header";
import Order from "./routes/orders/Order";
import OrderInfo from "./routes/orderInfo/OrderInfo";
import AuthTelegram from "./auth/Auth";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  useEffect(() => {
    if (localStorage.getItem("user") && isAuthPage) {
      window.location.href = "/auth";
    }
  }, [isAuthPage]);

  return (
    <div className="app">
      <Toaster />
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/auth" element={<AuthTelegram />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<SinglePage />} />
        <Route path="/cart" element={<NewCart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/orderInfo/:id" element={<OrderInfo />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;




{/* <Route path="/auth" element={<AuthTelegram />} />
          <Route path="/cart" element={<NewCart />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/orderInfo/:id" element={<OrderInfo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/hook/payment/success"
            element={<Catalog paymentStatus={"success"} />}
          />
          <Route
            path="/hook/payment/fail"
            element={<Catalog paymentStatus={"error"} />}
          />
          <Route path="*" element={<Catalog />} /> 
*/}
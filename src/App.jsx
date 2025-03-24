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
import CategoryProducts from "./routes/categoryProducts/CategoryProducts";
import AuthTelegram from "./auth/Auth";

function App() {
  // const location = useLocation();
  // const isAuthPage = location.pathname === "/auth";

  // useEffect(() => {
  //   if (!localStorage.getItem("user") && !isAuthPage) {
  //     window.location.href = "/auth";
  //   }
  // }, [isAuthPage]);
  return (
    <div className="app">
      <Toaster />
      {/* {!isAuthPage && <Header />} */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<SinglePage />} />
        <Route path="/cart" element={<NewCart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/orderInfo/:id" element={<OrderInfo />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/search" element={<CategoryProducts />} />
        {/* <Route path="/auth" element={<AuthTelegram />} /> */}
      </Routes>
      {/* {!isAuthPage && <Footer />} */}
      <Footer />
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./routes/home/Home";
import Footer from "./components/footer/Footer";
import SinglePage from "./routes/singlepage/SinglePage";
import NewCart from "./routes/cart/NewCart";
import { Header } from "./components/header/Header";
import Order from "./routes/orders/Order";
import OrderInfo from "./routes/orderInfo/OrderInfo";
import CategoryProducts from "./routes/categoryProducts/CategoryProducts";

function App() {
  return (
    <div className="app">
      <Toaster />
      <Header />
      <Routes>
        {/* Asosiy sahifa */}
        <Route path="/" element={<Home />} />

        {/* Mahsulotning yakkalik sahifasi */}
        <Route path="/product/:id" element={<SinglePage />} />

        {/* Savatcha sahifasi */}
        <Route path="/cart" element={<NewCart />} />

        {/* Buyurtmalar sahifasi */}
        <Route path="/orders" element={<Order />} />

        {/* Buyurtma haqida ma'lumot sahifasi */}
        <Route path="/orderInfo/:id" element={<OrderInfo />} />

        {/* Kategoriya bo‘yicha mahsulotlar sahifasi */}
        <Route path="/category/:id" element={<CategoryProducts />} />

        {/* Qidiruv natijalari sahifasi */}
        <Route path="/search" element={<CategoryProducts />} />

        {/* Quyida sharh sifatida qoldirilgan yo‘nalishlar */}
        {/* <Route path="/auth" element={<AuthTelegram />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/terms" element={<Terms />} /> */}
        {/* <Route path="/orders" element={<Orders />} /> */}
        {/* <Route path="/search" element={<Search />} /> */}
        {/* <Route
            path="/hook/payment/success"
            element={<Catalog paymentStatus={"success"} />}
          /> */}
        {/* <Route
            path="/hook/payment/fail"
            element={<Catalog paymentStatus={"error"} />}
          /> */}
        {/* <Route path="*" element={<Catalog />} /> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

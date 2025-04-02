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
// import AuthTelegram from "./auth/Auth";
import { useDispatch } from "react-redux";
import { getUser } from "./api";
import { setUserInfo } from "./context/cartSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let user = {
      id: 996493305,
      first_name: "Bahromjon",
      last_name: "Abdulhayev",
      username: "bahromjon_abdulhayev",
      photo_url:
        "https://t.me/i/userpic/320/nVfgAIJCi2wAIgtXWO_XkPV6MnhijbgkA-0x26KCbww.jpg",
      auth_date: 1742876261,
      hash: "1b2733b85dd159050da67f81cea665ff478c59dbbdefd0578e0fc744b51ecc36",
    };
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      if (userData) {
        dispatch(setUserInfo(userData));
      }
    };
    fetchData();
  }, []);

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

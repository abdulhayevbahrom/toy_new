import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Banner from "../../components/banner/Banner";
import Catalog from "../../components/catalog/Catalog";
import formatNumber from "../../utils/numberFormat";

import './home.css';

function Home() {
  const [totalPrice, setTotalPrice] = useState(0);
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    let price = cart.reduce((acc, product) => acc + product.price * product.quantity * product.inBox, 0);
    setTotalPrice(parseInt(price));
  }, [cart]);

  return (
    <div className="container">
      <Banner />
      <Catalog />
      {
        totalPrice > 0 &&
        <div class="go-to-order-wrap ">Заказ на {formatNumber(totalPrice)} ₽</div>
      }
    </div>
  );
}

export default Home;

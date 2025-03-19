import React from "react";
import { calculateQuantity } from "../../utils/calculatePrice";
import numberFotmat from "../../utils/numberFormat";
import { getDeclination } from "../../utils/getDeclination";
import { useNavigate } from "react-router-dom";
import "./OrderInfo.css";
import arrow2Icon from "../../img/arrow-right.svg";

const products = [
  { id: 1, name: "AM-81", quantity: 160000, price: 18000000, image: "image1.jpg" },
  { id: 2, name: "AM-82", quantity: 120000, price: 15000000, image: "image2.jpg" },
  { id: 3, name: "AM-83", quantity: 100000, price: 13000000, image: "image3.jpg" },
  { id: 4, name: "AM-84", quantity: 90000, price: 11000000, image: "image4.jpg" },
  { id: 5, name: "AM-85", quantity: 80000, price: 10000000, image: "image5.jpg" },
];

function OrderInfo() {
  const nav = useNavigate();

  // Umumiy son va narxni hisoblash
  const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const discount = 0; // Agar kerak bo'lsa, chegirma qo'shish mumkin
  const finalPrice = totalPrice - discount; // Yakuniy summa

  return (
    <div className="container cardInfo">
      <div className="left-card-block">
        <div className="card-block-element list">
          <div className="title-block">
            <div className="card-block-element-title">
              <h3>Заказ №429</h3>
              <span>{getDeclination(products.length, ["товар", "товара", "товаров"])} </span>
            </div>
          </div>
          <div className="card-block-list orderInfo">
            {products.map((product) => (
              <div className="cart-item-row" key={product.id} onClick={() => nav("/product/" + product.id)}>
                <div className="cart-item-picture">
                  <img
                    src={`https://shop-api.toyseller.site/api/image/${product.id}/${product.image}`}
                    alt="picture"
                  />
                </div>
                <div className="cart-item-data">
                  <div className="cart-item-label">
                    <h3>{product.name}</h3>
                    <div className="cart-item-caption">
                      <span>характеристики добавить</span>
                      <span>Кол-во: {product.quantity} шт</span>
                    </div>
                    <h3>{numberFotmat(product.price)} ₽</h3>
                  </div>
                  <div className="cart-right-block">
                    <img src={arrow2Icon} alt="arrow2Icon" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Umumiy hisob bloki */}
      <div className="right">
        <div className="receipt">
          <div className="date">{new Date().toLocaleString("ru-RU")}</div>
          <div className="item-row">
            <div className="item-label">Товары, {numberFotmat(totalQuantity)} шт.</div>
            <div className="item-amount">{numberFotmat(totalPrice)} ₽</div>
          </div>
          <div className="item-row">
            <div className="item-label">Моя скидка</div>
            <div className="item-amount">{numberFotmat(discount)} ₽</div>
          </div>
          <div className="total-row">
            <div className="total-label">Итого:</div>
            <div className="total-amount">{numberFotmat(finalPrice)} ₽</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderInfo;


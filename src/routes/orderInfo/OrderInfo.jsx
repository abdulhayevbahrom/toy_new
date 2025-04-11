import React from "react";

import numberFotmat from "../../utils/numberFormat";
import { getDeclination } from "../../utils/getDeclination";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderInfo.css";
import arrow2Icon from "../../img/arrow-right.svg";
import { useSelector } from "react-redux";
function OrderInfo() {
  const nav = useNavigate();
  let { id } = useParams();

  let userInfo = useSelector((state) => state.cart.userInfo);
  let singleOrder =
    userInfo?.orders?.find((order) => +order.orderId === +id) || {};
  let singleOrder_products = singleOrder?.products || [];

  const calculateQuantity = (singleOrder_products) => {
    if (!Array.isArray(singleOrder_products)) {
      throw new Error("Input must be an array of products");
    }

    return singleOrder_products.reduce((sum, product) => {
      const total = product.quantity * product.inBox;
      const result =
        total % product.inPackage !== 0 ? Math.ceil(total) : parseInt(total);
      return sum + result;
    }, 0);
  };

  const totalPrice = singleOrder_products.reduce((acc, product) => {
    acc +=
      parseInt(product.quantity * product.inBox) % product.inPackage !== 0
        ? Math.ceil(product.quantity * product.inBox) * product.price
        : parseInt(product.quantity * product.inBox) * product.price;
    return acc;
  }, 0);

  const customDate = (orderDate) => {
    let date = new Date(orderDate * 1000).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let hour = new Date(orderDate * 1000).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${date} ${hour}`;
  };

  return (
    <div className="container cardInfo">
      <div className="left-card-block">
        <div className="card-block-element list">
          <div className="title-block">
            <div className="card-block-element-title">
              <h3>Заказ №{id}</h3>
              <span>
                {getDeclination(singleOrder_products.length, [
                  "товар",
                  "товара",
                  "товаров",
                ])}{" "}
              </span>
            </div>
          </div>
          <div className="card-block-list orderInfo">
            {singleOrder_products.map((product) => (
              <div
                className="cart-item-row"
                key={product.productID}
                onClick={() =>
                  nav(
                    `/product/${product.categoryID}/${product.productTypeID}/${product.id}`
                  )
                }
              >
                <div className="cart-item-picture">
                  <img
                    src={`https://shop-api.toyseller.site/api/image/${product.productID}/${product.image}`}
                    alt="picture"
                  />
                </div>
                <div className="cart-item-data">
                  <div className="cart-item-label">
                    <h3>{product.article}</h3>
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
          <div className="date">{customDate(singleOrder?.orderDate)}</div>
          <div className="item-row">
            <div className="item-label">
              Товары, {numberFotmat(calculateQuantity(singleOrder_products))}{" "}
              шт.
            </div>
            <div className="item-amount">{numberFotmat(totalPrice)} ₽</div>
          </div>
          <div className="item-row">
            <div className="item-label">Моя скидка</div>
            <div className="item-amount">
              {numberFotmat(singleOrder.discount)} ₽
            </div>
          </div>
          <div className="total-row">
            <div className="total-label">Итого:</div>
            <div className="total-amount">
              {numberFotmat(singleOrder.total)} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderInfo;

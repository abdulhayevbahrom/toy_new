import React from "react";
import "./Order.css";
import { getDeclination } from "../../utils/getDeclination";
import { useNavigate } from "react-router-dom";
import numberFormat from "../../utils/numberFormat";
import { useSelector } from "react-redux";

function Order() {
  const nav = useNavigate();
  let userInfo = useSelector((state) => state.cart.userInfo);
  let ordersStory = userInfo?.orders;

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
    <div className="container orders">
      <div className="card-block-element-title">
        <h3>История заказов</h3>
        <span>{getDeclination(3, ["заказ", "заказа", "заказов"])}</span>
      </div>

      {ordersStory?.map((order, index) => (
        <div
          key={index}
          className="container-order"
          onClick={() => nav(`/orderInfo/${order.orderId}`)}
        >
          <div className="cart-item-label">
            <h3>Заказ #{order?.orderId}</h3>
            <div className="info-order">
              <span className="dateLabel">Дата заказа:</span>
              <span className="dateValue">{customDate(order.orderDate)}</span>
              <span className="dateLabel">Кол-во товаров:</span>
              <span className="dateValue">{order?.products?.length}</span>
            </div>
            <span className="price-orders">{numberFormat(+order.total)} ₽</span>
          </div>
          <button
            className="btn_more"
            onClick={() => nav(`/orderInfo/${order.orderId}`)}
          >
            Подробнее
          </button>
        </div>
      ))}
    </div>
  );
}

export default Order;

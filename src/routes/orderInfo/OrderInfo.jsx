import React from "react";
import { calculateQuantity } from "../../utils/calculatePrice";
import numberFotmat from "../../utils/numberFormat";
import { getDeclination } from "../../utils/getDeclination";
import { useNavigate } from "react-router-dom";
import "./OrderInfo.css";
import arrow2Icon from "../../img/arrow-right.svg";

const product = {};

function OrderInfo() {
  const nav = useNavigate();
  return (
    <div className="container cardInfo">
      <div className="left">
        <div className="card-block-element-title">
          <h3>Заказ №{444}</h3>
          <span>{getDeclination(333, ["товар", "товара", "товаров"])} </span>
        </div>

        <div className="cart-item-row" onClick={() => nav(`/product/${22}`)}>
          <div
            className="cart-item-picture"
            onClick={() => nav("/product/" + 333)}
          >
            <img
              src={`https://shop-api.toyseller.site/api/image/${product?.productID}/${product?.image}`}
              alt="picture"
            />
          </div>
          <div className="cart-item-data">
            <div className="cart-item-label">
              <h3>{product?.article || "KYC-58"}</h3>
              <div className="cart-item-caption">
                <span>характеристики добавить</span>
                <span>Кол-во: {calculateQuantity([])} шт</span>
              </div>
              <h3>{numberFotmat(4444)} ₽</h3>
            </div>
            <div className="cart-right-block">
              <img src={arrow2Icon} alt="arrow2Icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="right"></div>
    </div>
  );
}

export default OrderInfo;

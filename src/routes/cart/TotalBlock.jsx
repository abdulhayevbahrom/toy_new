import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux"; // useSelector qo'shildi
import { newOrder, payTBank, getUser } from "../../api";
import formatNumberWithSpaces from "../../utils/numberFormat";
import toast from "react-hot-toast";
import "./Cart.css";
import { setCart, setUserInfo } from "../../context/cartSlice"; // setUserInfo import qilindi

export const TotalBlock = ({ cart, deliveryData, paymentData }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const reduxUserInfo = useSelector((state) => state.cart.userInfo); // Redux'dan userInfo olish
  const [data, setData] = useState({
    name: "",
    phone: "",
    address: "",
    comment: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      // API dan kelgan ma'lumotlar bilan Redux state'ni yangilash
      dispatch(
        setUserInfo({
          name: user?.name || "",
          phone: user?.phone || "",
          address: user?.address || "",
          email: user?.email || "",
        })
      );
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Redux state'dan local form state'ni yangilash
    setData({
      name: reduxUserInfo?.name || "",
      phone: reduxUserInfo?.phone || "",
      address: reduxUserInfo?.address || "",
      comment: "",
      email: reduxUserInfo?.email || "",
    });
  }, [reduxUserInfo]);

  const totalCount = cart.reduce((acc, product) => {
    acc +=
      parseInt(product.quantity * product.inBox) % product.inPackage !== 0
        ? Math.ceil(product.quantity * product.inBox)
        : parseInt(product.quantity * product.inBox);
    return acc;
  }, 0);

  const totalPrice = cart.reduce((acc, product) => {
    acc +=
      parseInt(product.quantity * product.inBox) % product.inPackage !== 0
        ? Math.ceil(product.quantity * product.inBox) * product.price
        : parseInt(product.quantity * product.inBox) * product.price;
    return acc;
  }, 0);

  const [canOrder, setCanOrder] = useState(true);

  const createOrder = async () => {
    window.Telegram.WebApp.MainButton.offClick(createOrder);
    if (!canOrder) return;
    setCanOrder(false);

    const order = {
      ...data,
      delivery: deliveryData === "1" ? "Самовывоз" : "Курьером",
      payBy:
        paymentData === "3"
          ? "Наличными"
          : paymentData === "4"
          ? "Картой"
          : "Счет",
      products: cart.map((product) => ({
        id: product.id,
        name: product.article,
        quantity: product.quantity,
        price: parseInt(product.price),
        inBox: product.inBox,
      })),
    };

    try {
      const orderData = await newOrder(order);

      if (orderData && paymentData !== "3") {
        const bankResponse = await payTBank(orderData.orderID);
        console.log(bankResponse, "bankResponse");
        window.location.href = bankResponse?.url;
      } else {
        localStorage.removeItem("cart");
      }

      dispatch(setCart([])); // Savatni tozalash
      toast.success(
        "Заказ оформлен, наш менеджер в ближайшее время с Вами свяжется"
      );
      setTimeout(() => {
        nav("/");
        setData({
          name: "",
          phone: "",
          address: "",
          comment: "",
          email: "",
        });
        dispatch(
          setUserInfo({
            // Redux userInfo'ni tozalash
            name: "",
            phone: "",
            address: "",
            email: "",
          })
        );
      }, 3000);
    } catch (error) {
      toast.error("Ошибка при оформлении заказа");
      setCanOrder(true); // Xato yuz bersa, tugmani qayta faollashtirish
    }
  };

  return (
    <div className="card-block-element order-form">
      <h3>Получатель</h3>
      <div className="form-group-section">
        <div className="form-group">
          <input
            type="text"
            className="formInput"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="ФИО"
          />
        </div>
        {/* <div className="form-group">
          <input
            type="text"
            className="formInput"
            placeholder="Название компании"
            value={data.companyName}
            onChange={(e) => setData({ ...data, companyName: e.target.value })}
          />
        </div> */}
        <div className="form-group">
          <input
            type="email"
            className="formInput"
            placeholder="E-mail"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="formInput"
            placeholder="Телефон"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        </div>
        {deliveryData === "2" && (
          <div className="form-group">
            <input
              type="text"
              className="formInput"
              placeholder="Адрес доставки"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          </div>
        )}
        <div className="form-group">
          <input
            type="text"
            className="formInput"
            placeholder="Комментарий"
            value={data.comment}
            onChange={(e) => setData({ ...data, comment: e.target.value })}
            style={{ borderBottom: "1px solid #7d7d7d00 !important" }}
          />
        </div>
      </div>
      <div className="count-block">
        <span className="white-weight-text">Оплата</span>
        <div className="count-block-gray">
          <span className="gray-text">Товары, {totalCount} шт</span>
          <span className="gray-text end">
            {formatNumberWithSpaces(totalPrice)} ₽
          </span>
        </div>
      </div>
      <div className="order-block">
        <div className="total-text-block">
          <h2>Итого:</h2>
          <h2>{formatNumberWithSpaces(totalPrice)} ₽</h2>
        </div>
        <button className="order-choise-btn" onClick={createOrder}>
          Заказать
        </button>
      </div>
      <p className="politic-block-text">
        <a
          href="https://spruton.ru/legal/privacy/"
          target="_blank"
          rel="noreferrer"
        >
          Политика конфиденциальности
        </a>{" "}
        и{" "}
        <a
          href="https://spruton.ru/legal/rules/"
          target="_blank"
          rel="noreferrer"
        >
          пользовательское соглашение
        </a>
      </p>
    </div>
  );
};

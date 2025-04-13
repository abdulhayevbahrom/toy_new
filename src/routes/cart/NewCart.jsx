// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearCart,
//   removeFromCart,
//   updateQuantity,
// } from "../../context/cartSlice";
// import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
// import "./Cart.css";
// import { DeliveryInfoBlock } from "./DeliveryInfoBlock";
// import { PayTypeDeliveryBlock } from "./PayTypeDeliveryBlock";
// import { TotalBlock } from "./TotalBlock";
// import { getDeclination } from "../../utils/getDeclination";
// import formatNumber from "../../utils/numberFormat";

// const NewCart = () => {
//   const nav = useNavigate();
//   const dispatch = useDispatch();
//   const [deliveryData, setDeliveryData] = useState("1");
//   const [paymentData, setPaymentData] = useState("3");

//   const cart = useSelector((state) => state.cart.items);

//   return (
//     <div className="container box">
//       <div className="card-block">
//         <div className="left-card-block">
//           <div className="card-block-element list">
//             <div className="title-block">
//               <div className="card-block-element-title">
//                 <h3>Корзина</h3>
//                 <span>
//                   {getDeclination(cart.length, ["товар", "товара", "товаров"])}
//                 </span>
//               </div>
//               <button onClick={() => dispatch(clearCart())}>
//                 Очистить корзину <FaTrash />
//               </button>
//             </div>
//             <div className="card-block-list">
//               {cart.map((product) => (
//                 <div key={product.id} className="cart-item-row">
//                   <div
//                     className="cart-item-picture"
//                     onClick={() => {
//                       if (product.inStock <= 0) return;
//                       localStorage.setItem("product", JSON.stringify(product));
//                       nav(
//                         `/product/${product.categoryID}/${product.productTypeID}/${product.id}`
//                       );
//                     }}
//                   >
//                     <img
//                       src={`https://shop-api.toyseller.site/api/image/${product.id}/${product.image}`}
//                       alt="product"
//                     />
//                   </div>
//                   <div className="cart-item-data">
//                     <div className="cart-item-label">
//                       {product.article}
//                       <div className="cart-item-caption">
//                         <span>характеристики добавить</span>
//                         <span>PM3: {product.inBox} шт</span>
//                         <FaTrash
//                           onClick={() => dispatch(removeFromCart(product.id))}
//                         />
//                       </div>
//                     </div>
//                     <div className="cart-right-block">
//                       {product.inStock > 0 ? (
//                         <div className="cart-item-counter">
//                           <FaMinus
//                             onClick={() => {
//                               if (product.quantity > 1) {
//                                 dispatch(
//                                   updateQuantity({
//                                     id: product.id,
//                                     quantity: product.quantity - 1,
//                                   })
//                                 );
//                               } else {
//                                 dispatch(removeFromCart(product.id));
//                               }
//                             }}
//                           />
//                           <div className="cic-count">
//                             {Math.ceil(product.quantity * product.inBox)}
//                           </div>
//                           <FaPlus
//                             onClick={() => {
//                               if (product.quantity < product.inStock) {
//                                 dispatch(
//                                   updateQuantity({
//                                     id: product.id,
//                                     quantity: product.quantity + 1,
//                                   })
//                                 );
//                               }
//                             }}
//                           />
//                         </div>
//                       ) : (
//                         <div className="cart-item-counter notqqq">
//                           <div>Нет в наличии</div>
//                         </div>
//                       )}
//                       <span className="cart-item-price">
//                         {formatNumber(
//                           Math.ceil(product.quantity * product.inBox) *
//                             product.price
//                         )}{" "}
//                         ₽
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <DeliveryInfoBlock />
//         </div>
//         <div className="right-card-block">
//           <TotalBlock
//             cart={cart}
//             deliveryData={deliveryData}
//             paymentData={paymentData}
//           />
//           <PayTypeDeliveryBlock
//             paymentData={paymentData}
//             setPaymentData={setPaymentData}
//             deliveryData={deliveryData}
//             setDeliveryData={setDeliveryData}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewCart;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../../context/cartSlice";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import "./Cart.css";
import { DeliveryInfoBlock } from "./DeliveryInfoBlock";
import { PayTypeDeliveryBlock } from "./PayTypeDeliveryBlock";
import { TotalBlock } from "./TotalBlock";
import { getDeclination } from "../../utils/getDeclination";
import formatNumber from "../../utils/numberFormat";

const NewCart = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [deliveryData, setDeliveryData] = useState("1");
  const [paymentData, setPaymentData] = useState("3");

  const cart = useSelector((state) => state.cart.items);

  // Function to calculate display quantity, similar to SinglePage
  const getDisplayQuantity = (product) => {
    if (!product) return 0;
    const boxQuantity = Number(product.quantity) * Number(product.inBox);
    const packageSize = Number(product.inPackage);
    return packageSize && boxQuantity % packageSize !== 0
      ? Math.ceil(boxQuantity)
      : Math.floor(boxQuantity);
  };

  return (
    <div className="container box">
      <div className="card-block">
        <div className="left-card-block">
          <div className="card-block-element list">
            <div className="title-block">
              <div className="card-block-element-title">
                <h3>Корзина</h3>
                <span>
                  {getDeclination(cart.length, ["товар", "товара", "товаров"])}
                </span>
              </div>
              <button onClick={() => dispatch(clearCart())}>
                Очистить корзину <FaTrash />
              </button>
            </div>
            <div className="card-block-list">
              {cart.map((product) => (
                <div key={product.id} className="cart-item-row">
                  <div
                    className="cart-item-picture"
                    onClick={() => {
                      if (product.inStock <= 0) return;
                      localStorage.setItem("product", JSON.stringify(product));
                      nav(
                        `/product/${product.categoryID}/${product.productTypeID}/${product.id}`
                      );
                    }}
                  >
                    <img
                      src={`https://shop-api.toyseller.site/api/image/${product.id}/${product.image}`}
                      alt="product"
                    />
                  </div>
                  <div className="cart-item-data">
                    <div className="cart-item-label">
                      <p>
                        {product.article}
                        <span className="percent">
                          {Math.floor(
                            1 - +product?.price / +product?.discountedPrice
                          )}{" "}
                          %
                        </span>
                      </p>
                      <div className="cart-item-caption">
                        <span>характеристики добавить</span>
                        <span>PM3: {product.inBox} шт</span>
                        <span>Кол-во в упаковке: {product.packageSize} шт</span>
                        <FaTrash
                          onClick={() => dispatch(removeFromCart(product.id))}
                        />
                      </div>
                    </div>
                    <div className="cart-right-block">
                      {product.inStock > 0 ? (
                        <div className="cart-item-counter">
                          <FaMinus
                            onClick={() => {
                              dispatch(decrementQuantity({ product }));
                            }}
                          />
                          <div className="cic-count">
                            {getDisplayQuantity(product)}
                          </div>
                          <FaPlus
                            onClick={() => {
                              dispatch(
                                incrementQuantity({
                                  productId: product.id,
                                  inBox: product.inBox,
                                  inPackage: product.inPackage,
                                  inStock: product.inStock,
                                  inTheBox: product.inTheBox,
                                })
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <div className="cart-item-counter notqqq">
                          <div>Нет в наличии</div>
                        </div>
                      )}
                      <span className="cart-item-price">
                        {formatNumber(
                          getDisplayQuantity(product) * product.price
                        )}{" "}
                        ₽
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DeliveryInfoBlock />
        </div>
        <div className="right-card-block">
          <TotalBlock
            cart={cart}
            deliveryData={deliveryData}
            paymentData={paymentData}
          />
          <PayTypeDeliveryBlock
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            deliveryData={deliveryData}
            setDeliveryData={setDeliveryData}
          />
        </div>
      </div>
    </div>
  );
};

export default NewCart;

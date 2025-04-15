// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearCart,
//   removeFromCart,
//   incrementQuantity,
//   decrementQuantity,
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
//   const [address, setAddress] = useState("");

//   const cart = useSelector((state) => state.cart.items);

//   // Function to calculate display quantity, similar to SinglePage
//   const getDisplayQuantity = (product) => {
//     if (!product) return 0;
//     const boxQuantity = Number(product.quantity) * Number(product.inBox);
//     const packageSize = Number(product.inPackage);
//     return packageSize && boxQuantity % packageSize !== 0
//       ? Math.ceil(boxQuantity)
//       : Math.floor(boxQuantity);
//   };

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
//                       <p>
//                         {product.article}
//                         {product.discountedPrice && (
//                           <span className="percent">
//                             {Math.floor(
//                               (1 -
//                                 Number(product?.price) /
//                                   Number(product?.discountedPrice)) *
//                                 100
//                             )}{" "}
//                             %
//                           </span>
//                         )}
//                       </p>
//                       <div className="cart-item-caption">
//                         <span>PM3: {product.inBox} шт</span>
//                         <span>Кол-во в упаковке: {product.packageSize} шт</span>
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
//                               dispatch(decrementQuantity({ product }));
//                             }}
//                           />
//                           <div className="cic-count">
//                             {getDisplayQuantity(product)}
//                           </div>
//                           <FaPlus
//                             onClick={() => {
//                               dispatch(
//                                 incrementQuantity({
//                                   productId: product.id,
//                                   inBox: product.inBox,
//                                   inPackage: product.inPackage,
//                                   inStock: product.inStock,
//                                   inTheBox: product.inTheBox,
//                                 })
//                               );
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
//                           getDisplayQuantity(product) * product.price
//                         )}{" "}
//                         ₽
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <DeliveryInfoBlock address={address} deliveryData={deliveryData} />
//         </div>
//         <div className="right-card-block">
//           <TotalBlock
//             cart={cart}
//             deliveryData={deliveryData}
//             paymentData={paymentData}
//             setAddress={setAddress}
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
  const [address, setAddress] = useState("");

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

  // Function to determine price based on recomendedMinimalSize
  const getCurrentPrice = (product) => {
    const displayQuantity = getDisplayQuantity(product);
    if (
      displayQuantity < (product.recomendedMinimalSize || Infinity) &&
      product.discountedPrice
    ) {
      return Number(product.discountedPrice); // Chegirmasiz narx
    }
    return Number(product.price); // Chegirmali narx
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
              {cart.map((product) => {
                const currentPrice = getCurrentPrice(product);
                const displayQuantity = getDisplayQuantity(product);
                return (
                  <div key={product.id} className="cart-item-row">
                    <div
                      className="cart-item-picture"
                      onClick={() => {
                        if (product.inStock <= 0) return;
                        localStorage.setItem(
                          "product",
                          JSON.stringify(product)
                        );
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
                          {product.discountedPrice &&
                            displayQuantity >=
                              (product.recomendedMinimalSize || Infinity) && (
                              <span className="percent">
                                {Math.floor(
                                  (1 -
                                    Number(product?.price) /
                                      Number(product?.discountedPrice)) *
                                    100
                                )}{" "}
                                %
                              </span>
                            )}
                        </p>
                        <div className="cart-item-caption">
                          <span>PM3: {product.inBox} шт</span>
                          <span>Кол-во в упаковке: {product.inPackage} шт</span>
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
                            <div className="cic-count">{displayQuantity}</div>
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
                          {formatNumber(displayQuantity * currentPrice)} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DeliveryInfoBlock address={address} deliveryData={deliveryData} />
        </div>
        <div className="right-card-block">
          <TotalBlock
            cart={cart}
            deliveryData={deliveryData}
            paymentData={paymentData}
            setAddress={setAddress}
            getDisplayQuantity={getDisplayQuantity} // Qo‘shimcha prop
            getCurrentPrice={getCurrentPrice} // Qo‘shimcha prop
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
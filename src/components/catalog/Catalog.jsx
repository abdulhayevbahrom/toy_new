// import React, { useState, useEffect, useMemo } from "react";
// import { getProducts } from "../../api/index";
// import { LuChevronRight } from "react-icons/lu";
// import { Link, useNavigate } from "react-router-dom";
// import formatNumber from "../../utils/numberFormat";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import "./Catalog.css";
// import { useDispatch, useSelector } from "react-redux";
// import { decrementQuantity, incrementQuantity } from "../../context/cartSlice";

// function Catalog() {
//   const nav = useNavigate();
//   const dispatch = useDispatch();
//   const cartData = useSelector((state) => state.cart.items);
//   console.log(cartData);

//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const products = await getProducts();
//       setProducts(products);
//       // const user = await getUser();
//       // localStorage.setItem("user", JSON.stringify(user));
//     }
//     fetchData();
//     return () => {};
//   }, []);

//   let catalogs = products
//     .map((item, index) => ({
//       ...item,
//       originalIndex: index,
//       products: item.products
//         .filter(
//           (product) =>
//             product.price &&
//             parseInt(product.price) !== 0 &&
//             product.inStock &&
//             parseInt(product.inStock) !== 0
//         )
//         .slice(0, 9),
//     }))
//     .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

//   const handleIncrement = (product) => {
//     dispatch(
//       incrementQuantity({
//         productId: product.id,
//         inBox: product.inBox,
//         inPackage: product.inPackage,
//         inStock: product.inStock,
//         inTheBox: product.inTheBox,
//       })
//     );
//   };

//   const handleDecrement = (product) => {
//     dispatch(
//       decrementQuantity({
//         productId: product.id,
//         inBox: product.inBox,
//         inPackage: product.inPackage,
//         inTheBox: product.inTheBox,
//       })
//     );
//   };

//   const getDisplayQuantity = (inCart, product) => {
//     if (!inCart || !product) return 0;
//     const boxQuantity = Number(inCart.quantity) * Number(product.inBox);
//     const packageSize = Number(product.inPackage);
//     return packageSize && boxQuantity % packageSize !== 0
//       ? Math.ceil(boxQuantity)
//       : Math.floor(boxQuantity);
//   };

//   const displayQuantity = (product) =>
//     useMemo(
//       () => getDisplayQuantity(inCart, product),
//       [inCart?.quantity, product?.inBox, product?.inPackage]
//     );

//   return (
//     <div className="catalog container">
//       {catalogs.map((item, index) => {
//         return (
//           <div key={index} className="catalogItem">
//             <p className="catalogItem_title">
//               <span>{item.categoryName}</span>
//               <LuChevronRight />
//             </p>
//             <div className="catalogItem_cards">
//               {item.products.map((product, index) => {
//                 let inCart = cartData?.find((item) => item.id === product?.id);
//                 return (
//                   <div key={index} className="catalogItem_card">
//                     <Link to={`/product/${product.id}`}>
//                       <img
//                         src={`https://shop-api.toyseller.site/api/image/${product.id}/${product.image}`}
//                         alt=""
//                         className="picture"
//                       />
//                     </Link>
//                     <p className="name">{product.article}</p>
//                     <p className="weight">PM3: {product.inBox} шт</p>

//                     {inCart ? (
//                       <div className="add catalog_counter">
//                         <FiMinus onClick={() => handleDecrement(product)} />
//                         <p className="amount">{displayQuantity(product)}</p>
//                         <FiPlus onClick={() => handleIncrement(product)} />
//                       </div>
//                     ) : (
//                       <div
//                         className="price"
//                         onClick={() => nav("/product/" + product.id)}
//                       >
//                         {formatNumber(+product.price)} ₽
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default Catalog;
import React, { useState, useEffect, useMemo } from "react";
import { getProducts } from "../../api/index";
import { LuChevronRight } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import formatNumber from "../../utils/numberFormat";
import { FiPlus, FiMinus } from "react-icons/fi";
import "./Catalog.css";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../../context/cartSlice";

function Catalog() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      setProducts(productsData);
    };
    fetchData();
  }, []);

  const getDisplayQuantity = (inCart, product) => {
    if (!inCart || !product) return 0;
    const boxQuantity = Number(inCart.quantity) * Number(product.inBox);
    const packageSize = Number(product.inPackage);
    return packageSize && boxQuantity % packageSize !== 0
      ? Math.ceil(boxQuantity)
      : Math.floor(boxQuantity);
  };

  const handleIncrement = (product) => {
    dispatch(
      incrementQuantity({
        productId: product.id,
        inBox: product.inBox,
        inPackage: product.inPackage,
        inStock: product.inStock,
        inTheBox: product.inTheBox,
      })
    );
  };

  const handleDecrement = (product) => {
    dispatch(
      decrementQuantity({
        productId: product.id,
        inBox: product.inBox,
        inPackage: product.inPackage,
        inTheBox: product.inTheBox,
      })
    );
  };

  // const catalogs = useMemo(() => {
  //   return products
  //     .map((item, index) => ({
  //       ...item,
  //       originalIndex: index,
  //       products: item.products
  //         .filter(
  //           (product) =>
  //             product.price &&
  //             parseInt(product.price) !== 0 &&
  //             product.inStock &&
  //             parseInt(product.inStock) !== 0
  //         )
  //         .slice(0, 9),
  //     }))
  //     .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  // }, [products]);

  // console.log(catalogs);

  const catalogs = useMemo(() => {
    return products
      .map((item, index) => ({
        ...item,
        originalIndex: index,
        products: item.products
          .filter(
            (product) =>
              product.price &&
              parseInt(product.price) !== 0 &&
              product.inStock &&
              parseInt(product.inStock) !== 0
          )
          // Faqat categoryName === "Кроссовки" bo‘lsa rang va o‘lcham bo‘yicha birlashtirish
          .reduce((unique, product) => {
            if (product.categoryID === 3) {
              const key = `${product.color}-${product.size}`; // Rang va o‘lcham kombinatsiyasi
              const exists = unique.some((p) => `${p.color}-${p.size}` === key);
              if (!exists) {
                unique.push(product);
              }
            } else {
              unique.push(product); // Agar "Кроссовки" bo‘lmasa, barchasini qo‘shish
            }
            return unique;
          }, [])
          // .reduce((unique, product) => {
          //   const key = `${product.color}-${product.size}`; // Deduplicate by color and size
          //   const exists = unique.some((p) => `${p.color}-${p.size}` === key);
          //   if (!exists) {
          //     unique.push(product);
          //   }
          //   return unique;
          // }, [])
          .slice(0, 9),
      }))
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }, [products]);

  return (
    <div className="catalog container">
      {catalogs.map((item) => (
        <div key={item.originalIndex} className="catalogItem">
          <p
            onClick={() => {
              nav("/category-products/" + item.products[0].categoryID);
            }}
            className="catalogItem_title"
          >
            <span>{item.categoryName}</span>
            <LuChevronRight />
          </p>
          <div className="catalogItem_cards">
            {item.products.map((product) => {
              const inCart = cartData.find((item) => item.id === product.id);

              return (
                <div key={product.id} className="catalogItem_card">
                  <Link
                    to={`/product/${product.categoryID}/${product.productTypeID}/${product.id}`}
                  >
                    <img
                      src={`https://shop-api.toyseller.site/api/image/${product.id}/${product.image}`}
                      alt={product.article}
                      className="picture"
                    />
                  </Link>
                  <p className="name">{product.article}</p>
                  <p className="weight">PM3: {product.inBox} шт</p>

                  {inCart ? (
                    <div className="add catalog_counter">
                      <FiMinus onClick={() => handleDecrement(product)} />
                      <p className="amount">
                        {getDisplayQuantity(inCart, product)}
                      </p>
                      <FiPlus onClick={() => handleIncrement(product)} />
                    </div>
                  ) : (
                    <div
                      className="price"
                      // onClick={() => handleAddToCart(product)}
                    >
                      {formatNumber(+product.price)} ₽
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Catalog;

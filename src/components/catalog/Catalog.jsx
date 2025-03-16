import React, { useState, useEffect } from "react";
import { getProducts } from "../../api/index";
import { LuChevronRight } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import formatNumber from "../../utils/numberFormat";
import { FiPlus, FiMinus } from "react-icons/fi";
import "./Catalog.css";

function Catalog() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const products = await getProducts();
      setProducts(products);
      // const user = await getUser();
      // localStorage.setItem("user", JSON.stringify(user));
    }
    fetchData();
    return () => {};
  }, []);

  let catalogs = products
    .map((item, index) => ({
      ...item,
      originalIndex: index,
      products: item.products
        .filter((product) => {
          if (
            product.price &&
            parseInt(product.price) !== 0 &&
            product.inStock &&
            parseInt(product.inStock) !== 0
          ) {
            return product;
          }
        })
        .slice(0, 9),
    }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

  return (
    <div className="catalog container">
      {catalogs.map((item, index) => {
        return (
          <div key={index} className="catalogItem">
            <p className="catalogItem_title">
              <span>{item.categoryName}</span>
              <LuChevronRight />
            </p>
            <div className="catalogItem_cards">
              {item.products.map((product, index) => {
                let inCart = null;
                return (
                  <div key={index} className="catalogItem_card">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={`https://shop-api.toyseller.site/api/image/${product.id}/${product.image}`}
                        alt=""
                        className="picture"
                      />
                    </Link>
                    <p className="name">{product.article}</p>
                    <p className="weight">PM3: {product.inBox} шт</p>

                    {inCart ? (
                      <div className="add catalog_counter">
                        <FiMinus />
                        <p className="amount">00</p>
                        <FiPlus />
                      </div>
                    ) : (
                      <div
                        className="price"
                        onClick={() => nav("/product/" + product.id)}
                      >
                        {formatNumber(+product.price)} ₽
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Catalog;

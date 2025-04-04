import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SinglePage.css";
import { getSingleProduct } from "../../api/index";
import { FaChevronRight } from "react-icons/fa";
import { SpecRow } from "./SpecRow";
import { AgeEnum } from "../../utils/structures";
import {
  addToCart,
  incrementQuantity,
  decrementQuantity,
} from "../../context/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiMinus } from "react-icons/fi";

function SinglePage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { id } = useParams();
  const cart = useSelector((state) => state.cart.items);
  const [product, setProduct] = useState(null);
  const [isSizeBtn, setIsSizeBtn] = useState(1);
  const [description, setDescription] = useState(true);

  useEffect(() => {
    const getById = async () => {
      const data = await getSingleProduct(id);
      setProduct(data);
    };
    getById();
  }, [id]);

  const settings = useMemo(
    () => ({
      dots: product?.otherPhotos?.length > 0,
      infinite: product?.otherPhotos?.length > 0,
      arrows: product?.otherPhotos?.length > 0,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    [product]
  );

  const sentToCart = (item) => {
    dispatch(addToCart(item));
  };

  const inCart = cart.find((item) => item.id === product?.id);

  const getDisplayQuantity = (inCart, product) => {
    if (!inCart || !product) return 0;

    const boxQuantity = Number(inCart.quantity) * Number(product.inBox);
    const packageSize = Number(product.inPackage);
    return packageSize && boxQuantity % packageSize !== 0
      ? Math.ceil(boxQuantity)
      : Math.floor(boxQuantity);
  };

  const handleIncrement = () => {
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

  const handleDecrement = () => {
    dispatch(decrementQuantity({ product }));
  };

  const displayQuantity = useMemo(
    () => getDisplayQuantity(inCart, product),
    [inCart?.quantity, product?.inBox, product?.inPackage]
  );

  return (
    <div className="container singlepage">
      <div className="caption">
        <span onClick={() => nav("/category/" + product?.categoryID)}>
          {product?.categoryName}
        </span>
        <FaChevronRight />
        <span>{product?.article}</span>
      </div>

      <div className="product-block">
        <div className="slider">
          <Slider {...settings}>
            <div>
              <img
                src={`https://shop-api.toyseller.site/api/image/${product?.id}/${product?.photo}`}
                alt={`image-${product?.id}`}
                className="image"
              />
            </div>
            {product?.otherPhotos
              ?.filter((item) => item !== "")
              .map((slide, i) => (
                <div key={i}>
                  <img
                    src={`https://shop-api.toyseller.site/api/product_other_image/${product?.id}/${slide}`}
                    alt={`image-${product?.id}`}
                    className="image"
                  />
                </div>
              ))}
          </Slider>
        </div>
        <div className="product-content">
          <div>
            <h3 className="sub-title">{product?.article}</h3>
            <div className="count-product">
              <span>РМЗ: {product?.inBox} шт.</span>
              <span>В упаковке: {product?.inPackage} шт.</span>
              <span>Остаток: {product?.inStock} шт.</span>
            </div>
          </div>
          <div
            style={{ display: product?.categoryID === 40 ? "flex" : "none" }}
            className="shoesSizes"
          >
            <h3 className="sub-title">Размер</h3>
            <div className="size_containe">
              <div className="size-block" onClick={() => setIsSizeBtn(1)}>
                <span className="size-letter">{product?.shoeSizeRu}</span>
                <div className="size-description"></div>
              </div>
            </div>
          </div>
          <div className="singlepageInfoBtns">
            <button
              className={`small-white-button ${description ? "activePr" : ""}`}
              onClick={() => setDescription(true)}
            >
              Описание
            </button>
            <button
              className={`small-white-button ${!description ? "activePr" : ""}`}
              onClick={() => setDescription(false)}
            >
              Характеристики
            </button>
          </div>
          <div className="description-block">
            {description && (
              <p className="description">
                {product?.description ? product.description : "Описания нет"}
              </p>
            )}
            {!description && (
              <>
                <SpecRow label="Артикул" value={product?.article} />
                <SpecRow label="Материал" value={product?.material || "-"} />
                <SpecRow
                  label="Возраст"
                  value={
                    AgeEnum[product?.minKidAge]
                      ? `от ${AgeEnum[product.minKidAge]} лет`
                      : "-"
                  }
                />
                <SpecRow
                  label="Размер"
                  value={
                    product?.shoeSizeLength
                      ? `${product.shoeSizeLength}мм`
                      : "-"```javascript
// Add a loading state to handle the initial data fetch
const [isLoading, setIsLoading] = useState(true);

// Update the useEffect hook to set the loading state
useEffect(() => {
  const getById = async () => {
    const data = await getSingleProduct(id);
    setProduct(data);
    setIsLoading(false);
  };
  getById();
}, [id]);

// Add a conditional statement to render a loading message
if (isLoading) {
  return <div>Loading...</div>;
}

// Rest of the code remains the same
```
                  }
                />
              </>
            )}
          </div>
          {product?.keywords?.length > 0 && (
            <div className="product_keywords">
              <h3 className="sub-title">Ищут по запросам:</h3>
              <div className="product_keywords_items">
                {product?.keywords?.map((el, i) => (
                  <div key={i} className="request-word">
                    {el}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="product_button_block">
            {inCart && (
              <div className="counter-container">
                <button className="counter-button" onClick={handleDecrement}>
                  <FiMinus />
                </button>
                <span className="counter-value">
                  {" "}
                  {Math.ceil(inCart.quantity * inCart.inBox)}
                </span>
                <button className="counter-button" onClick={handleIncrement}>
                  <FiPlus />
                </button>
              </div>
            )}

            {+product?.inStock > 0 ? (
              <button
                onClick={() => (inCart ? nav("/cart") : sentToCart(product))}
                className="add-button"
              >
                {inCart ? (
                  <>
                    В Корзине{" "}
                    <span className="price-span">
                      на {displayQuantity * product?.price} р
                    </span>
                  </>
                ) : (
                  "Добавить"
                )}
              </button>
            ) : (
              <button className="out-of-stock-button" disabled>
                Нет в наличии
              </button>
            )}

            <div className="price-block">
              <h3>{product?.price} Р</h3>
              <span className="old-price">{product?.discountedPrice} р</span>
              {product?.personalDiscount && (
                <span className="percent">{product?.personalDiscount} %</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;

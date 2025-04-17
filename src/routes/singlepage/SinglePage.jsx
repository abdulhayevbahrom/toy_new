import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SinglePage.css";
import { getProducts } from "../../api/index";
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
  const { categoryID, productTypeID, productID } = useParams();
  const cart = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState(null);
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState(new Set());
  const [isSizeBtn, setIsSizeBtn] = useState(null);
  const [description, setDescription] = useState(true);
  const [colors, setColors] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      let allProducts = [];

      if (categoryID && productTypeID) {
        const categoryProducts = productsData?.find(
          (product, index) => index + 1 === +categoryID
        );

        allProducts = categoryProducts?.products || [];
      } else {
        allProducts = productsData.map((u) => u.products).flat();
      }

      const processedProducts = allProducts.filter(
        (product) =>
          product.price &&
          parseInt(product.price) !== 0 &&
          product.inStock &&
          parseInt(product.inStock) !== 0 &&
          +product.productTypeID === +productTypeID
      );

      setProducts(processedProducts);
      setProduct(processedProducts.find((p) => p.id === +productID));

      setColors(
        new Set(
          Object.values(
            allProducts
              .filter((item) => +item.productTypeID === +productTypeID)
              .reduce((acc, item) => {
                if (!acc[item.color]) {
                  acc[item.color] = {
                    color: item.color,
                    img: `https://shop-api.toyseller.site/api/image/${item.id}/${item.photo}`,
                  };
                }
                return acc;
              }, {})
          )
        )
      );

      setIsSizeBtn(
        processedProducts
          .map((item) => item.article.slice(-2))
          .filter((item) => item !== "")[0]
      );
    };

    fetchData();
  }, [categoryID, productTypeID]);

  useEffect(() => {
    setSizes(
      new Set(
        // processedProducts
        //   .map((item) => item.article.slice(-2))
        //   .filter((item) => item !== "")
        products
          ?.filter((i) => product?.textColor === i.textColor)
          .map((item) => item.article.slice(-2))
          .filter((item) => item !== "")
      )
    );
  }, [product]);

  useEffect(() => {
    const findProduct = products
      ?.filter((i) => i.textColor === product?.textColor)
      .find((item) => item.article.slice(-2) === isSizeBtn);
    setProduct(findProduct);
  }, [isSizeBtn]);

  const settings = useMemo(
    () => ({
      dots: product?.otherPhotos?.length > 0 || product?.review,
      infinite: product?.otherPhotos?.length > 0 || product?.review,
      arrows: product?.otherPhotos?.length > 0 || product?.review,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    [product]
  );

  const sentToCart = (item) => dispatch(addToCart(item));

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
    if (!product) return;
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

  const handleDecrement = () => dispatch(decrementQuantity({ product }));

  const displayQuantity = useMemo(
    () => getDisplayQuantity(inCart, product),
    [inCart?.quantity, product?.inBox, product?.inPackage]
  );

  // Narxni aniqlash: recomendedMinimalSize shartiga ko‘ra
  const currentPrice = useMemo(() => {
    if (!product) return null;
    // Agar son recomendedMinimalSize dan kichik bo‘lsa, chegirmasiz narx
    if (
      displayQuantity < (product?.recomendedMinimalSize || Infinity) &&
      product?.discountedPrice
    ) {
      return product.discountedPrice;
    }
    // Aks holda chegirmali narx
    return product.price;
  }, [product, displayQuantity]);

  // Chegirma foizini hisoblash
  const discountPercentage = useMemo(() => {
    if (
      !product?.discountedPrice ||
      displayQuantity < (product?.recomendedMinimalSize || Infinity)
    ) {
      return 0;
    }
    return Math.floor((1 - +product.price / +product.discountedPrice) * 100);
  }, [product, displayQuantity]);
  console.log(product);

  function getYouTubeId(url) {
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  return (
    <div className="container singlepage">
      <div className="caption">
        <span onClick={() => nav("/category/" + product?.categoryID)}>
          {product?.categoryName}
        </span>
        <FaChevronRight />
        <span>{product?.subCategoryName}</span>
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
            {/* iframe */}
            {product?.review ? (
              <div>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    product.review
                  )}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="image"
                ></iframe>
              </div>
            ) : null}
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

          {+categoryID !== 3 ? (
            <></>
          ) : (
            <>
              <div className="flex gap-15 column">
                <h3 className="sub-title">Цвета</h3>
                <div className="colors">
                  {Array.from(colors).map((color, i) => (
                    <div
                      key={i}
                      className={`color-block ${
                        product?.color === color.color && "activeColor"
                      }`}
                      onClick={() => {
                        setProduct(
                          products.find((item) => item.color === color.color)
                        );
                      }}
                    >
                      <img src={color.img} alt="" />
                    </div>
                  ))}
                </div>

                <span className="colorText">Цвет: {product?.textColor}</span>
              </div>

              <div className="shoesSizes">
                <h3 className="sub-title">Размер</h3>

                <div className="size_containe">
                  {Array.from(sizes).map((size, i) => (
                    <div
                      key={i}
                      className={`size-block ${
                        isSizeBtn === size && "activeSize"
                      } `}
                      onClick={() => setIsSizeBtn(size)}
                    >
                      <span className="size-letter">{size}</span>
                      <div className="size-description"></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-15 column">
            <span className="gray-d9 fs-18">
              Бренд: {product?.tradeMarkName}
            </span>
            {/* <h3 className="sub-title">{product?.tradeMarkAbout}</h3> */}
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
                      ? `${product?.shoeSizeLength}мм`
                      : "-"
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
                <span className="counter-value">{displayQuantity}</span>
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
                      на {displayQuantity * currentPrice} ₽
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
              <h3>{currentPrice} ₽</h3>
              {product?.discountedPrice && discountPercentage > 0 && (
                <>
                  <span className="old-price">
                    {product?.discountedPrice} ₽
                  </span>
                  <span className="percent">{discountPercentage} %</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;

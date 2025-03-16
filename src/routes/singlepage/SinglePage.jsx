import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SinglePage.css";

function SinglePage() {
  const nav = useNavigate();
  const { id } = useParams();

  const product = null;

  const settings = useMemo(
    () => ({
      dots: product?.otherImages.length > 0 ? true : false,
      infinite: product?.otherImages.length > 0 ? true : false,
      // arrows: product?.otherImages.length > 0 ? true : false,
      arrows: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    [product]
  );

  return (
    <div className="container singlepage">
      <div className="caption">
        <span onClick={() => nav("/category/" + product?.categoryID)}>
          {/* {product?.categoryName} */}
          shapka
        </span>
        <span>
          {/* {`> ${product?.article}`} */}
          article
        </span>
      </div>

      <div className="product-block">
        <div className="slider">
          <Slider {...settings}>
            <div>
              <img
                src={`https://shop-api.toyseller.site/api/image/99/1711472801_KYC-58.jpg`}
                // src={`https://shop-api.toyseller.site/api/image/${product?.id}/${product?.image}`}
                alt={`image-${product?.id}`}
                className="image"
              />
            </div>
            <div>
              <img
                src={`https://shop-api.toyseller.site/api/image/99/1711472801_KYC-58.jpg`}
                // src={`https://shop-api.toyseller.site/api/image/${product?.id}/${product?.image}`}
                alt={`image-${product?.id}`}
                className="image"
              />
            </div>
            <div>
              <img
                src={`https://shop-api.toyseller.site/api/image/99/1711472801_KYC-58.jpg`}
                // src={`https://shop-api.toyseller.site/api/image/${product?.id}/${product?.image}`}
                alt={`image-${product?.id}`}
                className="image"
              />
            </div>
            <div>
              <img
                src={`https://shop-api.toyseller.site/api/image/99/1711472801_KYC-58.jpg`}
                // src={`https://shop-api.toyseller.site/api/image/${product?.id}/${product?.image}`}
                alt={`image-${product?.id}`}
                className="image"
              />
            </div>

            {/* {product?.otherImages
              ?.filter((item) => item != "")
              .map((slide, i) => (
                <div key={i}>
                  <img
                    src={`https://shop-api.toyseller.site/api/product_other_image/${product?.id}/${slide}`}
                    alt={`image-${product?.id}`}
                    className="image"
                  />
                </div>
              ))} */}
          </Slider>
        </div>
        <div className="product-content">
          {/* <div>
            <h3 className="sub-title">{product?.article || 22}</h3>
            <div className="count-product">
              <span>РМЗ: {product.inBox} шт.</span>
              <span>В упаковке: {product?.inPackage} шт.</span>
              <span>Остаток: {product?.inStock} шт.</span>
            </div>
          </div> */}

          {/* <div
            style={{ display: product.categoryID == 40 ? "flex" : "none" }}
            className="flex gap-15 column"
          >
            <h3 className="sub-title">Размер</h3>
            <div className="flex gap-5">
              <div
                className={`size-block ${isSizeBtn === 1 ? "activePr" : ""}`}
                onClick={() => setIsSizeBtn(1)}
              >
                <span className="size-letter">{product.shoeSizeRu}</span>
                <div className="size-description"></div>
              </div>
            </div>
          </div> */}
          {/* <div className="flex gap-20 column">
            <div className="flex gap-5">
              <button
                className={`small-white-button ${
                  isDescriptionBtn === 1 ? "activePr" : ""
                }`}
                onClick={() => setIsDescriptionBtn(1)}
              >
                Описание
              </button>
              <button
                className={`small-white-button ${
                  isDescriptionBtn === 2 ? "activePr" : ""
                }`}
                onClick={() => setIsDescriptionBtn(2)}
              >
                Характеристики
              </button>
            </div>
            <div className="description-block">
              {isDescriptionBtn === 1 && (
                <p className="gray-d9">
                  {product?.description ? product?.description : "Описания нет"}
                </p>
              )}
              {isDescriptionBtn === 2 && (
                <>
                  <SpecRow label="Артикул" value={product?.article} />
                  <SpecRow label="Материал" value="???" />
                  <SpecRow
                    label="Возраст"
                    value={`от ${AgeEnum[product?.minKidAge]} лет`}
                  />
                  <SpecRow
                    label="Размер"
                    value={`${product?.shoeSizeLength}мм`}
                  />
                </>
              )}
            </div>
          </div> */}
          {/* {product?.keyWords.length > 0 && (
            <div className="flex gap-15 column">
              <h3 className="sub-title">Ищут по запросам:</h3>
              <div className="flex gap-5">
                {product?.keyWords.map((el, i) => (
                  <div key={i} className="request-word">
                    {el}
                  </div>
                ))}
              </div>
            </div>
          )}
          <ButtonBlock product={product} /> */}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;

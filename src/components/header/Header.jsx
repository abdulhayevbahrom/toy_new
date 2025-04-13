import { useEffect, useRef, useState } from "react";
import { getProducts } from "../../api";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux"; // Redux uchun import
import { setSearchQuery } from "../../context/searchSlice"; // Action import
import menuIcon from "../../img/menu.svg";
import logo from "../../img/logo.png";
import arrowIcon from "../../img/arrow-right.svg";
import phoneIcon from "../../img/phone-call.svg";
import searchIcon from "../../img/search.svg";
import caseIcon from "../../img/briefcase.svg";
import cartIcon from "../../img/shopping-cart.svg";

import "./Header.css";

export const Header = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Redux-dan searchQuery ni olish
  const searchValue = useSelector((state) => state.search.searchQuery);

  const [products, setProducts] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const products = await getProducts();
      setProducts(products);
    }

    fetchData();
    return () => {};
  }, []);

  // Tashqi clickni ushlash uchun useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Agar click dropdown ichida bo'lmasa va sidebar ochiq bo'lsa
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        openSidebar
      ) {
        setOpenSidebar(false);
      }
    };

    // Documentga click event listener qo'shamiz
    document.addEventListener("mousedown", handleClickOutside);

    // Component unmount bo'lganda listenerni o'chiramiz
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidebar]); // openSidebar o'zgarganda qayta ishlaydi

  // "categoryName"
  //    "subCategoryName"
  //        "productTypeName"

  let sidebarData = products
    .sort((a, b) => {
      if (a.categoryName === "Новинки") return -1;
      if (b.categoryName === "Новинки") return 1;
      return a.categoryName.localeCompare(b.categoryName);
    })
    .map((p) => ({
      a: p.categoryName,
      b: Object.values(
        p.products.reduce((acc, item) => {
          if (item.subCategoryName) {
            if (!acc[item.subCategoryName]) {
              acc[item.subCategoryName] = {
                name: item.subCategoryName,
                data: new Map(), // Set o'rniga Map ishlatamiz
              };
            }
            if (item.productTypeName) {
              // Faqat yangi productTypeName qo'shamiz, takrorlanmaslik uchun
              acc[item.subCategoryName].data.set(item.productTypeName, {
                productTypeName: item.productTypeName,
                categoryID: item.categoryID,
                productTypeID: item.productTypeID,
              });
            }
          }
          return acc;
        }, {})
      ).map((obj) => ({
        name: obj.name,
        data: [...obj.data.values()], // Map'dan qiymatlarni arrayga aylantiramiz
      })),
    }));

  const cart = useSelector((state) => state.cart.items);

  const closeModals = () => {
    if (openSidebar) setOpenSidebar(false);
    if (modal1) setModal1(false);
    if (modal2) setModal2(false);
  };

  const handleSearchChange = (e) => {
    // Redux store'ga searchQuery ni yangilash
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <>
      <div className="container header" onClick={closeModals}>
        <img
          src={logo}
          className="logoIcon"
          alt="logo"
          onClick={() => nav("/")}
        />

        <div className="search">
          <input
            placeholder="Поиск..."
            value={searchValue} // Redux-dan kelgan qiymat
            onChange={handleSearchChange} // Redux-ga yangi qiymatni jo'natish
          />
          <div
            className="header_search_icon"
            onClick={() => nav(`/search?q=${searchValue}`)}
          >
            <img src={searchIcon} alt="" />
          </div>
        </div>

        <div className="header__right">
          <div className="bottomBar">
            <div className={`icon ${modal1 && "activeIcon"}`}>
              <img src={phoneIcon} onClick={() => setModal1(!modal1)} alt="" />
            </div>
            <div className={`icon ${modal2 && "activeIcon"}`}>
              <img src={caseIcon} onClick={() => setModal2(!modal2)} alt="" />
            </div>
            <div className="icon">
              <img src={cartIcon} onClick={() => nav("/cart")} alt="" />
              {cart?.length > 0 && (
                <div className="card-count-number">
                  <p>{cart?.length}</p>
                </div>
              )}
            </div>
          </div>

          <div className={`menuIcon ${openSidebar && "activeIcon"}`}>
            <img
              src={menuIcon}
              alt=""
              onClick={() => setOpenSidebar(!openSidebar)}
            />
          </div>
        </div>
      </div>

      {openSidebar ? (
        <div className="dropdown" ref={dropdownRef}>
          <div className="item" onClick={() => nav("/orders")}>
            История заказов <img src={arrowIcon} alt="" />
          </div>

          {sidebarData.map((category, i) => (
            <div className="menu_item" key={i}>
              <p
                className="category"
                onClick={() =>
                  category.a === "Новинки"
                    ? nav("/news/" + category?.b[0]?.data[0]?.categoryID)
                    : setOpenIndex(openIndex === i ? null : i)
                }
              >
                {category.a}
                <img
                  style={{
                    transform: openIndex === i ? "rotate(90deg)" : "",
                  }}
                  src={arrowIcon}
                  alt=""
                />
              </p>

              {openIndex === i &&
                category?.b?.map((subCategory, j) => (
                  <div className="subcategory_block" key={j}>
                    <p
                      onClick={() => {
                        setOpenSubIndex(
                          openSubIndex === `${i}-${j}` ? null : `${i}-${j}`
                        );
                        // if (!subCategory?.data?.length) nav("/category/" + i);
                      }}
                      className="subcategory"
                    >
                      {subCategory.name}
                      <img
                        style={{
                          transform:
                            openSubIndex === `${i}-${j}` ? "rotate(90deg)" : "",
                        }}
                        src={arrowIcon}
                        alt=""
                      />
                    </p>

                    {openSubIndex === `${i}-${j}` &&
                      subCategory?.data?.map((model, k) => (
                        <p
                          onClick={() =>
                            nav(
                              "/category/" +
                                model.categoryID +
                                "/" +
                                model.productTypeID
                            )
                          }
                          className="model_name"
                          key={k}
                        >
                          {model.productTypeName}
                          <img alt="" src={arrowIcon} />
                        </p>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}

      {modal1 ? (
        <div className="modal1" onClick={() => setModal1(false)}>
          <div className="dropdown2">
            <span>По коммерческим вопросам:</span>
            <a href="tel:+79784514771">+7(978)45-14-771</a>
            <a href="mailto:partners@octobyte.ru">partners@octobyte.ru</a>
            <span>По техническим вопросам: </span>
            <a href="tel:+79786121068">+7(978)61-21-068</a>
            <a href="mailto:support@octobyte.ru">support@spruton.shop</a>
            <span className="bold">
              Мы всегда готовы ответить на ваши вопросы.
            </span>
          </div>
        </div>
      ) : (
        ""
      )}

      {modal2 ? (
        <div className="modal1" onClick={() => setModal2(false)}>
          <div className="dropdown2">
            Список документов:
            <a
              href="https://spruton.ru/legal/toymarket_service_agreement/"
              target="_blank"
              rel="noreferrer"
            >
              Договор на оказание услуг по размещению товарных предложений на
              сервисе Тоймаркет
            </a>
            <a
              href="https://spruton.ru/legal/toymarket_smz_conditions/"
              target="_blank"
              rel="noreferrer"
            >
              Условия размещения товарных предложений самозанятых на сервисе
              Тоймаркет
            </a>
            <a
              href="https://spruton.ru/legal/toymarket_service_conditions/"
              target="_blank"
              rel="noreferrer"
            >
              Условия оказания услуг Тоймаркет по размещению товарных
              предложений
            </a>
            <a
              href="https://spruton.ru/legal/toymarket_services_rate_table/"
              target="_blank"
              rel="noreferrer"
            >
              Процентные ставки для расчета стоимости услуг и вознаграждения
              Исполнителя (модель DBS)
            </a>
            <a
              href="https://spruton.ru/legal/toymarket_offer_requirements/"
              target="_blank"
              rel="noreferrer"
            >
              Требования к Товарным предложениям и их формату
            </a>
            <a
              href="https://spruton.ru/legal/toymarket_adv_rules/"
              target="_blank"
              rel="noreferrer"
            >
              Требования к материалам
            </a>
            <a
              href="https://spruton.ru/legal/toymarket_termsofuse/"
              target="_blank"
              rel="noreferrer"
            >
              Правила использования сервиса Тоймаркет
            </a>
            <a
              href="https://spruton.ru/legal/toymarket_license_agreement/"
              target="_blank"
              rel="noreferrer"
            >
              Лицензионное соглашение на использование сервиса Тоймаркет
            </a>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

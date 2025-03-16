import { useEffect, useState } from "react";
import { getProducts } from "../../api";
import { useNavigate } from "react-router";

import menuIcon from "../../img/menu.svg";
import logo from "../../img/logo.png";
import arrowIcon from "../../img/arrow-right.svg";

import phoneIcon from "../../img/phone-call.svg";
import searchIcon from "../../img/search.svg";
import caseIcon from "../../img/briefcase.svg";
import cartIcon from "../../img/shopping-cart.svg";

import "./Header.css";

export const Header = ({ searchValue, onChangeSearch }) => {
  const nav = useNavigate();

  const [products, setProducts] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState(null);

  useEffect(() => {
    // if (!localStorage.getItem("user")) {
    //   nav("/auth");
    //   return;
    // }

    async function fetchData() {
      const products = await getProducts();
      setProducts(products);
      // const user = await getUser();
      // localStorage.setItem("user", JSON.stringify(user));
    }

    fetchData();

    return () => {};
  }, []);

  let sidebarData = products
    .sort((a, b) => {
      if (a.categoryName === "Новинки") return -1;
      if (b.categoryName === "Новинки") return 1;
      return a.categoryName.localeCompare(b.categoryName);
    })
    .map((p) => ({
      a: p.categoryName,
      b: Object.values(
        p.products.reduce((acc, item, index) => {
          if (item.subCategoryName) {
            if (!acc[item.subCategoryName]) {
              acc[item.subCategoryName] = {
                name: item.subCategoryName,
                data: new Set(),
              };
            }
            if (item.modelName) {
              acc[item.subCategoryName].data.add({
                modelName: item.modelName,
                index: index, // Original massivdagi indeksni saqlash
              });
            }
          }
          return acc;
        }, {})
      ).map((obj) => ({ ...obj, data: [...obj.data] })), // Set ni array ga o'girish
    }));

  const cart = [];

  const closeModals = () => {
    if (openSidebar) {
      setOpenSidebar(false);
    }
    if (modal1) {
      setModal1(false);
    }
    if (modal2) {
      setModal2(false);
    }
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
            value={searchValue || searchInput}
            onChange={(e) => {
              onChangeSearch?.(e.target.value);
              setSearchInput(e.target.value);
            }}
          />
          <div
            className="header_search_icon"
            onClick={() => nav(`/search?q=${searchInput}`)}
          >
            <img src={searchIcon} />
          </div>
        </div>

        <div className="header__right">
          <div className="bottomBar">
            <div className={`icon ${modal1 && "activeIcon"}`}>
              <img
                src={phoneIcon}
                onClick={() => {
                  setModal1(!modal1);
                }}
              />
            </div>
            <div className={`icon ${modal2 && "activeIcon"}`}>
              <img
                src={caseIcon}
                onClick={() => {
                  setModal2(!modal2);
                }}
              />
            </div>
            <div className="icon">
              <img src={cartIcon} onClick={() => nav("/cart")} />
              {cart.length ? (
                <div className="card-count-number">{cart.length}</div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className={`menuIcon ${openSidebar && "activeIcon"}`}>
            <img src={menuIcon} onClick={() => setOpenSidebar(!openSidebar)} />
          </div>
        </div>
      </div>
      {openSidebar ? (
        <div className="dropdown">
          <div
            className="item"
            onClick={() => {
              nav("/orders");
            }}
          >
            История заказов <img src={arrowIcon} />
          </div>

          {sidebarData.map((c, i) => (
            <div className="menu_item" key={i}>
              <p
                className="category"
                onClick={() => {
                  setOpenIndex(openIndex === i ? null : i);
                }}
              >
                {c.a}
                <img
                  style={{
                    transform: openIndex === i ? "rotate(90deg)" : "",
                  }}
                  src={arrowIcon}
                />
              </p>

              {openIndex === i &&
                c?.b?.map((b, j) => (
                  <div className="subcategory_block" key={j}>
                    <p
                      onClick={() => {
                        setOpenSubIndex(
                          openSubIndex === `${i}-${j}` ? null : `${i}-${j}`
                        );
                        if (!b?.data?.length) {
                          nav("/category/" + i);
                        }
                      }}
                      className="subcategory"
                    >
                      {b.name}
                      <img
                        style={{
                          transform:
                            openSubIndex === `${i}-${j}` ? "rotate(90deg)" : "",
                        }}
                        src={arrowIcon}
                      />
                    </p>

                    {openSubIndex === `${i}-${j}` &&
                      b?.data?.map((model, k) => (
                        <p
                          onClick={() => nav("/product/" + model.index)}
                          className="model_name"
                          key={k}
                        >
                          {model.modelName}
                          <img src={arrowIcon} />
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
            <a href={"tel:+79784514771"}>+7(978)45-14-771</a>
            <a href="mailto:partners@octobyte.ru">partners@octobyte.ru</a>
            <span>По техническим вопросам: </span>
            <a href={"tel:+79786121068"}>+7(978)61-21-068</a>
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

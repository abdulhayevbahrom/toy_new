import React, { useState, useEffect } from "react";
import "./CategoryProducts.css";
import { BsChevronLeft } from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom";
import { getProducts } from "../../api/index";
import filterIcon from "../../img/filter.svg";
import sortIcon from "../../img/sort.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../../context/cartSlice";
import { FiPlus, FiMinus } from "react-icons/fi";
import formatNumber from "../../utils/numberFormat";
import FilterModal from "./FilterModal";
import SortModal from "./SortModal";

function CategoryProducts() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params?.get("q")?.trim() || "";
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusAccordionOpen, setStatusAccordionOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState({
    status: "all",
    priceFrom: "",
    priceTo: "",
    article: "",
  });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const cartData = useSelector((state) => state.cart.items);
  console.log(query);

  // Mahsulotlarni olish
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      const categoryProducts = productsData?.find(
        (product, index) => index === +id
      );
      if (query) {
        let allPro = productsData.map((u) => u.products).flat();
        setProducts(allPro);
        setFilteredProducts(allPro);
        setPendingFilters({ ...pendingFilters, article: query });
        return setCategoryName(query);
      }

      setCategoryName(categoryProducts?.categoryName);
      setProducts(categoryProducts?.products || []);
      setFilteredProducts(categoryProducts?.products || []);
    };
    fetchData();
  }, [id, query]);

  // Filter logikasi
  const applyFilters = () => {
    let result = [...products];

    if (pendingFilters.status === "inStock") {
      result = result.filter((product) => product.inStock > 0);
    } else if (pendingFilters.status === "outOfStock") {
      result = result.filter((product) => product.inStock === 0);
    }

    if (pendingFilters.priceFrom) {
      result = result.filter(
        (product) => +product.price >= +pendingFilters.priceFrom
      );
    }
    if (pendingFilters.priceTo) {
      result = result.filter(
        (product) => +product.price <= +pendingFilters.priceTo
      );
    }

    if (pendingFilters.article) {
      result = result.filter((product) =>
        product.article
          .toLowerCase()
          .includes(pendingFilters.article.toLowerCase())
      );
    }

    setFilteredProducts(result);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    if (pendingFilters.status !== "all") {
      applyFilters();
    }
  }, [pendingFilters]);

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
  console.log(products);

  return (
    <div className="container categoryProducts">
      <div className="categoryProducts_title">
        <div className="left">
          <BsChevronLeft />
          <span>{categoryName}</span>
        </div>
        <div className="right">
          <div className="form-filter">
            <button onClick={() => setIsFilterOpen(true)}>
              <img src={filterIcon} alt="filter icon" />
              <span>Фильтры</span>
            </button>
          </div>
          <div className="form-sort">
            <button onClick={() => setIsSortOpen(true)}>
              <img src={sortIcon} alt="sort icon" />
              <span>Сортировка</span>
            </button>
          </div>
        </div>
      </div>

      <div className="catalogItem_cards">
        {filteredProducts?.map((product) => {
          const inCart = cartData.find((item) => item.id === product.id);

          return (
            <div key={product.id} className="catalogItem_card">
              <Link to={`/product/${product.id}`}>
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
                <div className="price">{formatNumber(+product.price)} ₽</div>
              )}
            </div>
          );
        })}
      </div>

      <FilterModal
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        pendingFilters={pendingFilters}
        setPendingFilters={setPendingFilters}
        applyFilters={applyFilters}
        statusAccordionOpen={statusAccordionOpen}
        setStatusAccordionOpen={setStatusAccordionOpen}
      />

      <SortModal
        isSortOpen={isSortOpen}
        setIsSortOpen={setIsSortOpen}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
      />
    </div>
  );
}

export default CategoryProducts;

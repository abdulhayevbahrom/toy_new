import React, { useState, useEffect } from "react";
import "./CategoryProducts.css";
import { getProducts } from "../../api/index";
import filterIcon from "../../img/filter.svg";
import sortIcon from "../../img/sort.svg";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../../context/cartSlice";
import { FiPlus, FiMinus } from "react-icons/fi";
import formatNumber from "../../utils/numberFormat";
import { useNavigate, Link, useParams } from "react-router-dom";
import FilterModal from "./FilterModal";
import { BsChevronLeft } from "react-icons/bs";
import SortModal from "./SortModal";

function CategoryProducts() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchQuery = useSelector((state) => state.search.searchQuery); // Redux-dan searchQuery ni olish
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusAccordionOpen, setStatusAccordionOpen] = useState(false);
  const [statusPriceOpen, setStatusPriceOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState({
    status: "all",
    priceFrom: "",
    priceTo: "",
    article: "", // Initial article filter Redux-dan keladi
  });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const cartData = useSelector((state) => state.cart.items);

  // Fetch products and initialize data
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      let allProducts = [];
      let categoryNameTemp = "";

      if (id) {
        const categoryProducts = productsData?.find(
          (product, index) => index === +id
        );
        allProducts = categoryProducts?.products || [];
        categoryNameTemp = categoryProducts?.categoryName || "";
      } else {
        allProducts = productsData.map((u) => u.products).flat();
        categoryNameTemp = "All Products";
      }

      setProducts(allProducts);
      setCategoryName(categoryNameTemp);
      setFilteredProducts(allProducts); // Initial filtered products
    };

    fetchData();
  }, [id]);

  // Apply search and filters whenever searchQuery or pendingFilters change
  useEffect(() => {
    let result = [...products];

    // Apply additional filters
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
        product.article.toLowerCase().includes(pendingFilters.article.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, pendingFilters]);

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

  const filteredResults = filteredProducts.filter(product => product.article?.toLowerCase().includes(searchQuery.toLowerCase()));
  const navigate = useNavigate();
  const isCategoryPage = window.location.pathname.includes("/category/");

  useEffect(() => {
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`, { replace: true });
    }
  }, [searchQuery, navigate]);

  return (
    <div className="container categoryProducts">
      <div className="categoryProducts_title">
        {
          isCategoryPage ?
            <div onClick={() => navigate(-1)} className="left">
              <BsChevronLeft />
              <span>{categoryName}</span>
            </div>
            :
            <div class="flex gap-20 align-end">
              <h3 class="sub-title">{searchQuery}</h3>
              <span class="gray-7dfs-14">{filteredResults?.length} товара</span>
            </div>
        }
        <div className="right">
          <div className="form-filter">
            <button onClick={() => setIsFilterOpen(true)}>
              <img src={filterIcon} alt="filter icon" />
              <span style={{ color: "#363636" }}>Фильтры</span>
            </button>
          </div>
          <div className="form-sort">
            <button onClick={() => setIsSortOpen(true)}>
              <img src={sortIcon} alt="sort icon" />
              <span style={{ color: "#363636" }}>Сортировка</span>
            </button>
          </div>
        </div>
      </div>

      <div className="catalogItem_cards">
        {filteredResults?.map((product, inx) => {
          const inCart = cartData.find((item) => item.id === product.id);

          return (
            <div key={inx} className="catalogItem_card">
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
        statusAccordionOpen={statusAccordionOpen}
        setStatusAccordionOpen={setStatusAccordionOpen}
        statusPriceOpen={statusPriceOpen}
        setStatusPriceOpen={setStatusPriceOpen}
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



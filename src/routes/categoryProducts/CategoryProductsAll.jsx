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
  const { categoryID } = useParams();

  const searchQuery = useSelector((state) => state.search.searchQuery);
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
    article: "",
  });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const cartData = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const isCategoryPage = window.location.pathname.includes("/category/");

  // Fetch and process products
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      let allProducts = [];
      let categoryNameTemp = "";

      if (categoryID) {
        const categoryProducts = productsData?.find(
          (product, index) => index + 1 === +categoryID
        );

        allProducts = categoryProducts?.products || [];
        categoryNameTemp = categoryProducts?.categoryName || "";
      } else {
        allProducts = productsData.map((u) => u.products).flat();
        categoryNameTemp = "All Products";
      }

      const processedProducts = allProducts
        .filter(
          (product) =>
            product.price &&
            parseInt(product.price) !== 0 &&
            product.inStock &&
            parseInt(product.inStock) !== 0 &&
            +product.categoryID === +categoryID
        )
        // .reduce((unique, product) => {
        //   const key = `${product.color}-${product.size}`; // Deduplicate by color and size
        //   const exists = unique.some((p) => `${p.color}-${p.size}` === key);
        //   if (!exists) {
        //     unique.push(product);
        //   }
        //   return unique;
        // }, []);
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
        }, []);

      setProducts(processedProducts);
      setCategoryName(categoryNameTemp);
      setFilteredProducts(processedProducts); // Set initially filtered products
    };

    fetchData();
  }, [categoryID]);

  // Apply additional filters (status, price, article) and search
  useEffect(() => {
    let result = [...products];

    // Apply status filter
    if (pendingFilters.status === "inStock") {
      result = result.filter((product) => product.inStock > 0);
    } else if (pendingFilters.status === "outOfStock") {
      result = result.filter((product) => product.inStock === 0);
    }

    // Apply price range filter
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

    // Apply article filter
    if (pendingFilters.article) {
      result = result.filter((product) =>
        product.article
          .toLowerCase()
          .includes(pendingFilters.article.toLowerCase())
      );
    }

    // Apply search query filter
    if (searchQuery) {
      result = result.filter((product) =>
        product.article.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, pendingFilters, searchQuery]);

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

  useEffect(() => {
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`, {
        replace: true,
      });
    }
  }, [searchQuery, navigate]);

  return (
    <div className="container categoryProducts">
      <div className="categoryProducts_title">
        <div onClick={() => navigate(-1)} className="left">
          <BsChevronLeft />
          <span>{categoryName}</span>
        </div>
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
        {filteredProducts?.map((product, inx) => {
          const inCart = cartData.find((item) => item.id === product.id);

          return (
            <div key={inx} className="catalogItem_card">
              {/* <Link to={`/product/${product.id}`}> */}
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

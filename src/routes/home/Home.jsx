import React from "react";
import Banner from "../../components/banner/Banner";
import Catalog from "../../components/catalog/Catalog";

function Home() {
  return (
    <div className="container">
      <Banner />
      <Catalog />
    </div>
  );
}

export default Home;

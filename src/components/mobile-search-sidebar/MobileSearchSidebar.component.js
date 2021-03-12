import React, { useContext, useState } from "react";
import "./mobile-search-sidebar.styles.scss";

import Card from "../card/Card.component";
import SearchInput from "../search-input/SearchInput.component";

import { NavContext } from "../../context/Context";
import { SEARCH_SHOW, DISABLE_MOBILE_MENU } from "../../context/action.types";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

export default function MobileSearchSidebar() {
  const { navState, navStateDispatch } = useContext(NavContext);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState("");

  const disableNav = () => {
    navStateDispatch({
      type: DISABLE_MOBILE_MENU,
      payload: "",
    });
  };

  const onSearch = (search) => {
    setSearch(search);
    var data = {
      pname: search,
    };
    Axios.post(`${requests.searchProduct}`, data, config).then((response) => {
      setProducts(response.data.products);
    });
  };

  const onClickProduct = () => {
    navStateDispatch({ type: SEARCH_SHOW, payload: "" });
  };

  return (
    <div
      className={`mobile-search-sidebar ${
        navState.searchSideBarMobile !== undefined
          ? navState.searchSideBarMobile
          : null
      }`}
    >
      <div className="inner-container">
        <div className="search-input">
          <span className="icon">
            <BiSearch />
          </span>
          <input
            type="search"
            placeholder="Search for your favourite"
            onChange={(e) => onSearch(e.target.value)}
            value={search}
          />
        </div>
        <div className="popular-keywords">
          <ul className="keyword-list">
            <li onClick={onSearch.bind(this, "Baby Bottle")}>Baby Bottle</li>
            <li onClick={onSearch.bind(this, "Sippy Cup")}>Sippy Cup</li>
            <li onClick={onSearch.bind(this, "Dummies")}>Dummies</li>
            <li onClick={onSearch.bind(this, "Stroller")}>Stroller</li>
            <li onClick={onSearch.bind(this, "Squeeze Bags")}>Squeeze Bags</li>
            <li onClick={onSearch.bind(this, "Accessories")}>Accessories</li>
          </ul>
        </div>

        <div className="products">
          <div className="area-title">
            SEARCH RESULTS ({products ? products.length : 0})
          </div>
          <div className="inner-container">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div className="item" key={index}>
                  <Link
                    to={`/product/${product.type}/${product.id}`}
                    className="product-link"
                    onClick={() => {
                      onClickProduct();
                      disableNav();
                    }}
                  >
                    <Card eachProduct={product} />
                  </Link>
                </div>
              ))
            ) : (
              <h4>No Product Found</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

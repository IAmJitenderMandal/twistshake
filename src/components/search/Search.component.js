import React, { useContext, useState } from "react";
import "./search.styles.scss";
import { Link } from "react-router-dom";

import { NavContext } from "../../context/Context";
import { SEARCH_SHOW } from "../../context/action.types";

import Card from "../card/Card.component";
import SearchInput from "../search-input/SearchInput.component";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

export default function Search() {
  // const { navState } = useContext(NavContext);
  const { navState, navStateDispatch } = useContext(NavContext);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState("");

  const onSearch = (search) => {
    setSearch(search);

    var data = {
      pname: search,
    };
    if (search == "" || search === " " || search === "  ") {
      data.pname = "*";
    }

    Axios.post(`${requests.searchProduct}`, data, config).then((response) => {
      setProducts(response.data.products);
    });
  };

  const onClickProduct = () => {
    navStateDispatch({ type: SEARCH_SHOW, payload: "" });
  };
  return (
    <div className={`search-content ${navState.isSearchActive}`}>
      <div className="inner-container">
        <div className="input-field">
          <SearchInput
            value={search}
            placeholder={"Search for your favourites"}
            onSearch={onSearch}
          />
        </div>
        <div className="popular-searches">
          <span className="title-text">Popular search words</span>
          <div className="keywords">
            <div
              className="keyword"
              onClick={onSearch.bind(this, "Baby Bottels")}
            >
              Baby Bottels
            </div>
            <div className="keyword" onClick={onSearch.bind(this, "Sippy Cup")}>
              Sippy Cup
            </div>
            <div className="keyword" onClick={onSearch.bind(this, "Dummies")}>
              Dummies
            </div>
            <div className="keyword" onClick={onSearch.bind(this, "Stroller")}>
              Stroller
            </div>
          </div>
        </div>
        <div className="search-area-products">
          <div className="title-text">
            <span className="pp-title-text">
              <div className="area-title">
                SEARCH RESULTS ({products ? products.length : 0})
              </div>
            </span>
          </div>
          <div className="product-container">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div className="item" key={index}>
                  <Link
                    to={`/product/${product.type}/${product.id}`}
                    className="product-link"
                    onClick={onClickProduct}
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

import React, { useContext, useState, useEffect } from "react";
import "./mobile-menu-sidebar.styles.scss";

import { BiSearch } from "react-icons/bi";

import { NavContext, AppContext } from "../../context/Context";
import { DISABLE_MOBILE_MENU } from "../../context/action.types";
import { Link, Route, useHistory } from "react-router-dom";

// axios
import Axios from "../../axios/axios";
import requests from "../../axios/requests";

export default function MobileMenuSidebar() {
  const { navState, navStateDispatch } = useContext(NavContext);
  const { appState } = useContext(AppContext);
  const navLinks = appState.navLinks;

  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    async function getBestseller() {
      const res = await Axios.get(`${requests.getBestSeller}6`);
      setBestSellers(res.data.products);
    }
    getBestseller();
  }, []);

  const disableNav = () => {
    navStateDispatch({
      type: DISABLE_MOBILE_MENU,
      payload: "",
    });
  };

  const history = useHistory();
  const logout = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };
  return (
    <div
      className={`mobileMenuSidebar ${
        navState.menuSidebarMobile !== undefined
          ? navState.menuSidebarMobile
          : null
      }`}
    >
      <div className="inner-container">
        <div className="best-selling-products">
          <div className="area-title">Our Best seller</div>
          <div className="products-container">
            {bestSellers.length > 0 &&
              bestSellers.map((product, index) => (
                <Link
                  to={`/product/${product.type}/${product.id}`}
                  className="link"
                  key={index}
                  onClick={disableNav}
                >
                  <div className="each-best-selling">
                    <div className="img-container">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${product.product_thumbnail[0]})`,
                        }}
                      ></div>
                    </div>
                    <div className="title-container">
                      {product.product_name}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        <div className="mobile-nav-links">
          <div className="list">
            {navLinks !== undefined
              ? navLinks.map((linkObj, index) => {
                  if (
                    linkObj.urlString.toLowerCase() !== "home".toLowerCase()
                  ) {
                    return (
                      <li className="link" key={index}>
                        <Link
                          className="link"
                          onClick={disableNav}
                          to={`/pages/${linkObj.urlString}`}
                        >
                          {linkObj.category_name}
                        </Link>
                      </li>
                    );
                  }
                })
              : null}

            {localStorage.getItem("user") ? (
              ""
            ) : (
              <>
                <li className="link">
                  <Link
                    to="/login"
                    className="link login-link"
                    onClick={disableNav}
                  >
                    Log In
                  </Link>
                </li>
                <li className="link">
                  <Link
                    to="/create-account"
                    className="link create-account-link"
                    onClick={disableNav}
                  >
                    Create Account
                  </Link>
                </li>
              </>
            )}
          </div>
        </div>
        <div className="topbar-menu">
          <div className="topbar-mobile-nav-links">
            <ul className="list">
              <li className="link">
                <Link
                  to="/customer-service/contact"
                  className="link"
                  onClick={disableNav}
                >
                  Contact
                </Link>
              </li>
              <li className="link">
                <Link
                  to="/customer-service/about-us"
                  className="link"
                  onClick={disableNav}
                >
                  About us
                </Link>
              </li>
              <li className="link">
                <Link
                  to="/customer-service/faq"
                  className="link"
                  onClick={disableNav}
                >
                  FAQ
                </Link>
              </li>
              {/* <li className="link">
                <Link to="/Contact" className="link">
                  Twistshake world
                </Link>
              </li> */}
              <li className="link">
                <Link
                  to="/customer-service/ambassador"
                  className="link"
                  onClick={disableNav}
                >
                  Ambassador
                </Link>
              </li>
              {localStorage.getItem("user") ? (
                <li className="link">
                  <Link
                    className="link"
                    onClick={() => {
                      logout();
                      disableNav();
                    }}
                  >
                    Logout
                  </Link>
                </li>
              ) : (
                ""
              )}
              <li className="close-icon" onClick={() => {}}></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useState, useEffect } from "react";
import "./navbar.styles.scss";

// react svg
import { ReactSVG } from "react-svg";
import Logo from "../../assets/icons/twistlogo.svg";
import WhiteLogo from "../../assets/icons/123456.svg";
import MagnifyingGlass from "../../assets/icons/Maginfying Glass Search.svg";

// call custom hook useViewPort
import useViewPort from "../../custom-hooks/useViewPort";

import { NavContext, AppContext } from "../../context/Context";

import {
  CART_SIDEBAR,
  SEARCH_SHOW,
  SET_MOBILE_SEARCH,
  SET_MOBILE_MENU,
  DISABLE_MOBILE_MENU,
} from "../../context/action.types";

import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { CgShoppingBag } from "react-icons/cg";
import { AiOutlineMenu, AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import { VscClose } from "react-icons/vsc";

export default function Navbar() {
  const changeBackground = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  const [bar, setBar] = useState("hidden");
  const [navbar, setNavbar] = useState(false);
  const { navState, navStateDispatch } = useContext(NavContext);
  const { appState } = useContext(AppContext);
  const { cartState, cartStateDispatch } = useContext(AppContext);
  const { width } = useViewPort();
  const breakPoint = 1200;
  const navLinks = appState.navLinks;
  const [widthMobileDisable, setWidthMobileDisable] = useState(
    window.innerWidth
  );
  const disbleMobileSidebar = () => {
    setWidthMobileDisable(window.innerWidth);
  };

  useEffect(() => {
    if (widthMobileDisable > 1200) {
      navStateDispatch({
        type: DISABLE_MOBILE_MENU,
        payload: "",
      });
    }
    window.addEventListener("scroll", changeBackground);
    window.addEventListener("resize", disbleMobileSidebar);

    return () => {
      window.removeEventListener("scroll", changeBackground);
      window.removeEventListener("resize", disbleMobileSidebar);
    };
  }, [widthMobileDisable]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
    window.location.reload();
  };
  const cartSidebarToggle = () => {
    navStateDispatch({ type: CART_SIDEBAR, payload: "active" });
  };
  return width < breakPoint ? (
    <div
      className={`navbar-mobile ${
        navState.searchSideBarMobile !== undefined
          ? navState.searchSideBarMobile
          : null
      }${
        navState.menuSidebarMobile !== undefined
          ? navState.menuSidebarMobile
          : null
      } ${navbar ? "navbar active" : "navbar"} `}
    >
      <div className="menu-and-search">
        {navState.menuSidebarMobile === "active" ? (
          <div
            className="menu-icon"
            onClick={() => {
              navStateDispatch({
                type: SET_MOBILE_MENU,
                payload: "",
              });
            }}
          >
            <AiOutlineClose />
          </div>
        ) : (
          <div
            className="menu-icon"
            onClick={() => {
              navStateDispatch({
                type: SET_MOBILE_MENU,
                payload: "active",
              });
            }}
          >
            <AiOutlineMenu />
          </div>
        )}
        <div
          className="search-icon"
          onClick={() => {
            navStateDispatch({
              type: SET_MOBILE_SEARCH,
              payload: "active",
            });
          }}
        >
          {navState.searchSideBarMobile === "active" ? (
            <AiOutlineClose />
          ) : (
            <BiSearch />
          )}
        </div>
      </div>
      <div className="logo">
        <h3 className="logo-text">
          <Link to="/">
            {window.scrollY >= 80 ? (
              <ReactSVG src={Logo} />
            ) : (
              <ReactSVG src={WhiteLogo} />
            )}
          </Link>
        </h3>
      </div>
      <div className="action">
        {localStorage.getItem("user") ? (
          <Link to="/myaccount" className="cart">
            <AiOutlineUser></AiOutlineUser>
          </Link>
        ) : (
          ""
        )}
        <div
          className="cart"
          onClick={() => {
            navStateDispatch({ type: CART_SIDEBAR, payload: "active" });
          }}
        >
          <div className="counter-cart">
            {localStorage.getItem("ts-token")
              ? cartState.cartProduct !== null
                ? cartState.cartProduct.length
                : 0
              : localStorage.getItem("ts-cart")
              ? JSON.parse(localStorage.getItem("ts-cart")).length
              : 0}
          </div>
          <CgShoppingBag />
        </div>
      </div>
    </div>
  ) : (
    <div className={navbar ? "navbar active" : "navbar"}>
      <div className={`top-bar ${bar}`}>
        <div className="links">
          <ul className="list">
            <li className="link">
              <Link to="/customer-service/contact">Contact</Link>
            </li>
            <li className="link">
              <Link to="/customer-service/about-us">About us</Link>
            </li>
            <li className="link">
              <Link to="/customer-service/faq">FAQ</Link>
            </li>

            <li className="link">
              <Link to="/customer-service/ambassador">Ambassador</Link>
            </li>
            <li className="close-icon" onClick={() => setBar("hidden")}>
              <VscClose />
            </li>
          </ul>
        </div>
      </div>

      <div className="nav-items">
        <div className="logo">
          <Link to="/">
            {window.scrollY >= 80 ? (
              <ReactSVG src={Logo} />
            ) : (
              <ReactSVG src={WhiteLogo} />
            )}
          </Link>
        </div>
        <div className="nav-links">
          <div className="list">
            {navLinks !== undefined
              ? navLinks.map((linkObj, index) => {
                  if (
                    linkObj.urlString.toLowerCase() !== "home".toLowerCase()
                  ) {
                    return (
                      <li className="link" key={index}>
                        <Link to={`/pages/${linkObj.urlString}`}>
                          {linkObj.category_name}
                        </Link>
                      </li>
                    );
                  }
                })
              : null}
          </div>
        </div>
        <div className="action-icons">
          {localStorage.getItem("user") ? (
            <Link
              to="/myaccount"
              className="link login-link"
              // onClick={() => logout()}
            >
              My Account
            </Link>
          ) : (
            <React.Fragment>
              <Link to="/login" className="link login-link">
                Login
              </Link>
              <Link to="/create-account" className="link create-account-link">
                Create Account
              </Link>
            </React.Fragment>
          )}

          <div className="icon search">
            <div
              className="icon-link"
              onClick={() => {
                navStateDispatch({ type: SEARCH_SHOW, payload: "active" });
              }}
            >
              {/* <BiSearch className="icon-svg" /> */}
              {/* <ReactSVG src={MagnifyingGlass} */}
            </div>
          </div>
          <div className="icon cart">
            <div className="icon-link" onClick={cartSidebarToggle}>
              <div className="counter-cart">
                {localStorage.getItem("ts-token")
                  ? cartState.cartProduct !== null
                    ? cartState.cartProduct.length
                    : 0
                  : localStorage.getItem("ts-cart")
                  ? JSON.parse(localStorage.getItem("ts-cart")).length
                  : 0}
              </div>{" "}
              <CgShoppingBag className="icon-svg" />
            </div>
          </div>
          <div className="icon menu">
            <div
              className="icon-link"
              onClick={() => {
                bar === "" ? setBar("hidden") : setBar("");
              }}
            >
              <AiOutlineMenu className="icon-svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

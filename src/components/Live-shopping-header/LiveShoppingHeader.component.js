import React from "react";
import { Link } from "react-router-dom";
import "./live-shopping-header.styles.scss";
import SpinnerBtn from "../../assets/images/spinnerBtn.png";
import ArrowBtn from "../../assets/images/icon.png";

export default function LiveShoppingHeader({ children, bgimg }) {
  return (
    <div className="live-shopping-header">
      <div className="container">
        <div
          className="header-bg"
          style={{ backgroundImage: "url(" + bgimg + ")" }}
        ></div>
        <div className="side-content">
          <h4 className="side-content-heading">{children[0]}</h4>
          <Link to="/watch">{children[1]}</Link>
        </div>
        <div className="spinner-btn">
          <div className="inner-container">
            <img src={SpinnerBtn} alt="spinnerlogo" className="spinner-outer" />
            <img src={ArrowBtn} alt="arrow" className="arrowBtn" />
          </div>
        </div>
      </div>
    </div>
  );
}

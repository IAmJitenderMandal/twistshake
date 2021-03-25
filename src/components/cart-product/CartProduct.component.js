import React, { useState } from "react";
import "./cart-product.styles.scss";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Counter from "../counter/Counter.component";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function CartProduct({
  data,
  pakageContent,
  quantity,
  removeProduct,
  cartIndex,
  updateQuantity,
  removeCart,
}) {
  const [productQuantity] = useState(quantity);
  const [showPakageContent, setShowPakageContent] = useState(false);
  const history = useHistory();

  const onAddQuantity = (quantity) => {
    // setProductQuantity(quantity);
    updateQuantity(cartIndex, quantity);
  };
  const onRemoveQuantity = (quantity) => {
    // setProductQuantity(quantity);

    if (quantity === 0) {
      removeCart(cartIndex);
    }

    updateQuantity(cartIndex, quantity);
  };

  return (
    <div className="bottom">
      <div className="product-img">
        <div className="img-wrapper">
          <Link to="/product" className="product-link">
            <img
              src={
                data.type === "single"
                  ? data.product_image
                  : data.product_thumbnail
              }
              alt="product"
            />
          </Link>
        </div>
      </div>

      <div className="about-product">
        <div className="product-details">
          <div className="title">
            <Link to="/product" className="product-link">
              {data.product_name ? data.product_name : null}
            </Link>
          </div>
          <div className="extra-details">
            {data.package_content ? data.package_content : null}
          </div>
          <div className="product-counter">
            {localStorage.getItem("ts-token") ? (
              <Counter
                updateQuantity={updateQuantity}
                quantity={quantity}
                onAddQuantity={onAddQuantity}
                onRemoveQuantity={onRemoveQuantity}
              />
            ) : history.location.pathname === "/checkout" ? (
              <Counter
                updateQuantity={updateQuantity}
                quantity={quantity}
                onAddQuantity={onAddQuantity}
                onRemoveQuantity={onRemoveQuantity}
              />
            ) : null}
          </div>
          {data.type === "package" && (
            <div className="package-content">
              <div
                onClick={() => {
                  setShowPakageContent(!showPakageContent);
                }}
              >
                <h5>
                  <b>
                    Package Content &nbsp;
                    {showPakageContent ? (
                      <FaChevronUp className="direction-icon" />
                    ) : (
                      <FaChevronDown className="direction-icon" />
                    )}
                  </b>
                </h5>
              </div>
              <br />
              {showPakageContent
                ? data.type === "package" &&
                  data.cart_product !== undefined &&
                  data.cart_product.length > 0
                  ? data.cart_product.map((packageContent, index) => (
                      <h5 key={index}>{packageContent.package_content}</h5>
                    ))
                  : ""
                : ""}
            </div>
          )}
        </div>
        <div className="price">
          <span className="previous">
            {parseInt(data.price) * productQuantity}
            {/* {data.price} */}
          </span>
          <span className="latest">
            {/* {parseInt(data.total_price) * productQuantity} */}
            {localStorage.getItem("ts-token")
              ? data.total_price
              : parseInt(data.total_price) * productQuantity}
          </span>
        </div>
      </div>
    </div>
  );
}

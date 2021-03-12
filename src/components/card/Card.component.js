import React, { useState } from "react";
import RoundBadge from "../round-badge/RoundBadge.component";
import SquareBadge from "../rectangle-badge/RectangleBadge.component";
import "./card.styles.scss";
import NoImage from "../../assets/images/image_large.png";

export default function Card(props) {
  const { eachProduct } = props;
  const { product_thumbnail } = eachProduct === undefined ? [] : eachProduct;

  const [imgCounter, setImgCounter] = useState(0);

  return (
    eachProduct !== undefined && (
      <div className="card">
        <div className="img">
          <img
            src={product_thumbnail[imgCounter] || NoImage}
            alt="product-img"
            onMouseOver={() => setImgCounter(1)}
            onMouseOut={() => setImgCounter(0)}
          />
        </div>
        <div className="info-top">
          <div className="discount">
            <RoundBadge> {eachProduct.discount} </RoundBadge>
          </div>
          <div className="shipping-type">
            {eachProduct.shipping === "free" ? (
              <SquareBadge>Free shipping</SquareBadge>
            ) : null}
          </div>
        </div>
        <div className="description">
          <div className="name">{eachProduct.product_name}</div>
          <div className="attribute-details">{eachProduct.attribute || ""}</div>
          <div className="price">
            <span className="previous">{eachProduct.price}</span>
            <span className="latest">{eachProduct.total_price}</span>
          </div>
        </div>
      </div>
    )
  );
}

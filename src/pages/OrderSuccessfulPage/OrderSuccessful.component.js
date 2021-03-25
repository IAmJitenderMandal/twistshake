import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./OrderSuccessful.styles.scss";

function OrderSuccessful() {
  const params = useParams();
  const orderId = params.orderId;

  return (
    <div className="order-successful-container">
      <div className="order-successful-wrapper">
        <div className="order-success-header">
          <div className="header-icon">
            <img
              src="https://www.flaticon.com/svg/static/icons/svg/3649/3649775.svg"
              alt=""
            />
          </div>
          <h2>Order Completed Successfully!</h2>
        </div>
        <div className="order-success-bottom">
          <p>
            Thanks you for ordering. We received your order and will begin
            proccessing it soon. Your order information appears below.
          </p>
          <Link
            to={`/myAccount/order-details/${orderId}`}
            className="succesful-button"
          >
            View Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessful;

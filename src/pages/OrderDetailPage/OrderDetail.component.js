import React, { useReducer, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OrderDetail.styles.scss";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

export default function OrderDetail(props) {
  const [orderDetails, setOrderDetails] = useState({});
  const [invoice, setInvoice] = useState({});
  const params = useParams();
  const orderId = params.orderId;

  useEffect(() => {
    Axios.get(`${requests.orderDetails}/${orderId}`, config).then(
      (response) => {
        var orderDetails = response.data.order_detail;
        setInvoice(response.data.invoice_link);
        setOrderDetails(orderDetails);
      }
    );
  }, []);

  const address = orderDetails ? orderDetails.shipping_address : "";

  const calculateSubtotal = () => {
    let order_item = orderDetails.order_item;
    if (order_item) {
      let subTotal = 0;
      for (let i = 0; i < order_item.length; i++) {
        subTotal =
          subTotal + order_item[i].product_price * order_item[i].quantity;
      }
      return subTotal;
    }
  };

  const calculateTotalSaving = () => {
    let order_item = orderDetails.order_item;
    if (order_item) {
      let subTotal = 0;
      for (let i = 0; i < order_item.length; i++) {
        subTotal =
          subTotal + order_item[i].total_saving * order_item[i].quantity;
      }
      return subTotal;
    }
  };

  const calculateGrandTotal = () => {
    let order_item = orderDetails.order_item;
    if (order_item) {
      let subTotal = 0;
      for (let i = 0; i < order_item.length; i++) {
        subTotal = subTotal + order_item[i].total_price;
      }

      subTotal = subTotal + orderDetails.shipping_charge;
      return subTotal;
    }
  };

  return (
    <div className="order-detail-wrapper">
      <div className="order-details-header">
        <h4>
          Order Id : {orderId}{" "}
          <span className="span">
            {orderDetails ? orderDetails.status : ""}
          </span>
        </h4>

        <h4>{orderDetails ? orderDetails.order_date : ""}</h4>

        <a href={invoice} target="_blank" className="btn">
          Download Invoice
        </a>
      </div>

      <div className="order-details-bottom">
        <div className="left-section">
          <h4>User Details</h4>
          {address ? (
            <div>
              Name : {address.name}
              <br />
              Phone : {address.phone}
              <br />
              Alternate : {address.alternate_phone}
            </div>
          ) : (
            ""
          )}
          <br />
          <br />
          {address ? (
            <div>
              <h4>Address Details</h4>
              Address : {address.name}, {address.address},{" "}
              {address.address_type}, {address.city}, {address.country}
              <br />
              Phone : {address.phone}
              <br />
              Alternate : {address.alternate_phone}
            </div>
          ) : (
            ""
          )}
          <br />
          <br />
          <h4>Payment Details</h4>
          <p className="amount">
            {" "}
            Sub Total :{" "}
            <span>{orderDetails ? calculateSubtotal() : ""} AEB</span>
          </p>
          <p className="amount">
            {" "}
            Discount Amount :{" "}
            <span>
              {orderDetails ? `- ${calculateTotalSaving()}` : ""} AEB{" "}
            </span>
          </p>
          <p className="amount">
            {" "}
            Shipping Charges :{" "}
            <span>{orderDetails ? orderDetails.shipping_charge : ""} AEB </span>
          </p>
          <p className="amount grand-total">
            {" "}
            <b> Grand Total : </b>
            <span>
              <b> {orderDetails ? calculateGrandTotal() : ""} AEB</b>{" "}
            </span>
          </p>
        </div>
        <div className="right-section">
          {orderDetails &&
          orderDetails.order_item &&
          orderDetails.order_item.length > 0
            ? orderDetails.order_item.map((data) => (
                <div className="order-item">
                  <div className="image-wrapper">
                    <img
                      src={
                        data.product_type === "single"
                          ? data.thumbnail
                          : data.thumbnail
                      }
                      alt="product"
                    />
                  </div>
                  <div className="content-wrapper">
                    <h4>{data ? data.product_name : ""}</h4>
                    <p>Quantity : {data ? data.quantity : ""}</p>
                  </div>
                  <div className="price-wrapper">
                    {data ? data.total_price : ""} AEB
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </div>
  );
}

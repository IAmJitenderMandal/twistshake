import React, { useState, useEffect } from "react";
import "./orders.styles.scss";
import Button from "../button/Button.component";
import { Link } from "react-router-dom";
import Axios from "../../axios/axios";
import requests from "../../axios/requests";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Axios.get(
      `${requests.orderHistory}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      setOrders(response.data);
    });
  }, []);

  const calculateGrandTotal = (id) => {
    for (let i = 0; i < orders.length; i++) {
      if (id === orders[i].id) {
        const order_item = orders[i].order_item;
        if (order_item) {
          let subTotal = 0;
          for (let j = 0; j < order_item.length; j++) {
            subTotal = subTotal + order_item[j].total_price;
          }

          subTotal = subTotal + orders[i].shipping_charge;
          return subTotal;
        }
      }
    }
  };
  if (orders && orders.length < 1) {
    return (
      <div className="orders" id="dashboard">
        <div className="section-title">Recent Orders</div>
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="orders" id="dashboard">
      <div className="section-title">Recent Orders</div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order, key) => (
                <tr key={key}>
                  {console.log("insider")}
                  <td>
                    <Link to={`/myaccount/order-details/${order.id}`}>
                      #{order.id}
                    </Link>
                  </td>
                  <td>{order.order_date}</td>
                  <td>
                    <span className="span">{order ? order.status : ""}</span>
                  </td>
                  <td>{order ? calculateGrandTotal(order.id) : ""} AEB</td>
                  <td>
                    <Button>
                      <Link to={`/myaccount/order-details/${order.id}`}>
                        View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <div className="empty-order-area">
                <h5 className="title-text">
                  Sorry you dont have any recent orders
                </h5>
                <Link to="/">
                  <button className="btn"> back to Shoping</button>
                </Link>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

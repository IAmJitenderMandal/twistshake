import React, { useReducer, useContext, useState, useEffect } from "react";
import "./CheckOutPage.styles.scss";
import Axios from "../../axios/axios";
import requests from "../../axios/requests";
import { AppContext } from "../../context/Context";
import Counter from "../../components/counter/Counter.component";
import CartProduct from "../../components/cart-product/CartProduct.component";
import FormInput from "../../components/formInput/FormInput.component";
import SelectOption from "../../components/selectOption/SelectOption.component";
import { IoMdCloseCircle } from "react-icons/io";

import { BiMoney } from "react-icons/bi";
import { FaDhl, FaFedex } from "react-icons/fa";
// toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

function CheckOutPage() {
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [address_type, setaddress_type] = useState("");
  const [phone, setphone] = useState("");
  const [alternate_phone, setalternate_phone] = useState("");
  const [city, setCity] = useState([]);
  const [shipping_charge, setshipping_charge] = useState("");
  const [cities, setCities] = useState([]);
  const { cartState, cartStateDispatch } = useContext(AppContext);
  const [cart, setCart] = useState([]);

  const notifySucess = (text) =>
    toast(text, {
      type: toast.TYPE.INFO,
      autoClose: 10000,
    });

  useEffect(() => {
    window.scrollTo(0, 0);
    getCart();
    getCities();
  }, []);

  const getCart = () => {
    Axios.get(
      `${requests.getCart}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      // setCart(response.data.products);

      cartStateDispatch({
        type: "SET_PRODDECT",
        payload: response.data.products,
      });
    });
  };

  const getCities = () => {
    Axios.get(`${requests.getCities}`, config).then((response) => {
      setCities(response.data.shipping);
    });
  };

  const removeProduct = (cartIndex) => {
    cartStateDispatch({
      type: "REMOVE_PRODUCT",
      payload: cartIndex,
    });
  };
  const updateQuantity = (cartIndex, updateQuantity) => {
    console.log(cartIndex, updateQuantity);
    const data = {
      quantity: updateQuantity,
    };
    Axios.put(`${requests.getCart}/${cartIndex}`, data, config).then(
      (response) => {
        getCart();
      }
    );
  };
  const removeCart = (id) => {
    Axios.delete(`${requests.getCart}/${id}`, config).then((response) => {
      getCart();
    });
  };

  const calculateTotal = () => {
    let subTotal = 0;
    if (
      cartState &&
      cartState.cartProduct &&
      cartState.cartProduct.length > 0
    ) {
      var cart = cartState.cartProduct;
      for (let i = 0; i < cart.length; i++) {
        var subAmount = cart[i].total_price.replace("AED", "");
        const total = parseInt(subAmount);
        subTotal = subTotal + total;
      }
    }

    return subTotal + calculateDiscount();
  };
  const calculateDiscount = () => {
    let discount = 0;
    if (
      cartState &&
      cartState.cartProduct &&
      cartState.cartProduct.length > 0
    ) {
      var cart = cartState.cartProduct;
      for (let i = 0; i < cart.length; i++) {
        var saving = cart[i].total_saving.replace("AED", "");
        const total = parseInt(saving);
        discount = discount + total;
      }
    }

    return discount;
  };

  const calculateGrandTotal = () => {
    let grandTotal = 0;
    if (
      cartState &&
      cartState.cartProduct &&
      cartState.cartProduct.length > 0
    ) {
      var cart = cartState.cartProduct;
      for (let i = 0; i < cart.length; i++) {
        var subAmount = cart[i].total_price.replace("AED", "");
        const total = parseInt(subAmount);

        grandTotal = grandTotal + total;
      }
    }
    grandTotal = grandTotal;

    if (shipping_charge) {
      grandTotal = grandTotal + parseInt(shipping_charge);
    }

    return grandTotal;
  };

  const handleChange = (e) => {
    if (e.target.id.toLowerCase() === "name".toLowerCase()) {
      setname(e.target.value);
    }
    if (e.target.id.toLowerCase() === "address".toLowerCase()) {
      setaddress(e.target.value);
    }
    if (e.target.id.toLowerCase() === "address_type".toLowerCase()) {
      setaddress_type(e.target.value);
    }
    if (e.target.id.toLowerCase() === "phone".toLowerCase()) {
      setphone(e.target.value);
    }
    if (e.target.id.toLowerCase() === "alternate_phone".toLowerCase()) {
      setalternate_phone(e.target.value);
    }
    if (e.target.id.toLowerCase() === "shipping_charge".toLowerCase()) {
      setshipping_charge(e.target.value);
      console.log(e.target.innerHTML);

      var select_id = document.getElementById("shipping_charge");

      var city = select_id.options[select_id.selectedIndex].value;
      setCity(city);
    }
  };

  const onPlaceOrder = (e) => {
    e.preventDefault();
    if (cartState.cartProduct.length == 0) {
      notifySucess("Your cart is empty");
      return false;
    }

    let cart_id = [];
    const cartProduct = cartState.cartProduct;
    for (let i = 0; i < cartProduct.length; i++) {
      cart_id.push(cartProduct[i].cart_id);
    }

    let data = {
      user_id: localStorage.getItem("ts-userid"),
      shipping_charge: shipping_charge,
      cart_id: cart_id,
      totalPrice: calculateTotal(),
      payment: { mode: "cod", status: "unpaid" },

      shipping_address: {
        name: name,
        phone: phone,
        alternate_phone: alternate_phone,
        address: address,
        address_type: address_type,
        city: city,
        country: "UAE",
        // state: state,
      },
    };

    Axios.post(`${requests.order}`, data, config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success.status) {
          var orderId = response.data.orders.id;
          window.location.href = `/order-successful/${orderId}`;
        }
      })
      .catch((err) => {
        notifySucess(err.response.data.error.msg);
      });
  };
  return (
    <div id="checkOutContainer">
      <ToastContainer />
      <div className="float-container">
        <div className="float-child-bag">
          <div className="cart-heading">
            <b>
              Shopping basket (
              {cartState.cartProduct ? cartState.cartProduct.length : 0})
            </b>
          </div>
          {cartState.cartProduct &&
            cartState.cartProduct.length > 0 &&
            cartState.cartProduct.map((product, index) => {
              return (
                <div className="cart-product">
                  <div className="inner-container">
                    <div className="top">
                      <span
                        className="icon-close"
                        onClick={removeCart.bind(this, product.cart_id)}
                      >
                        <IoMdCloseCircle />
                      </span>
                    </div>
                    <CartProduct
                      removeProduct={removeProduct}
                      cartIndex={product.cart_id}
                      key={index}
                      data={product}
                      pakageContent={product.productDetails}
                      quantity={product.quantity}
                      updateQuantity={updateQuantity}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        <div className="float-child-payment">
          <form onSubmit={onPlaceOrder}>
            <div className="address">
              <div className="title-top">Shipping Address</div>

              <div className="form">
                <FormInput
                  id="name"
                  handleChange={handleChange}
                  placeholder="First Name"
                  type="text"
                  className="first"
                  required
                />

                <FormInput
                  id="address"
                  handleChange={handleChange}
                  placeholder="Address"
                  type="text"
                  className="address"
                  required
                />
                <FormInput
                  id="address_type"
                  handleChange={handleChange}
                  type="text"
                  className="residential-address"
                  placeholder="Appartment, Suit, (optional)"
                  required
                />

                <div className="form-element-group">
                  <SelectOption
                    name="country"
                    className="choose-country"
                    options={["UAE"]}
                  />
                  <div className="select-option">
                    <select
                      id="shipping_charge"
                      name="city"
                      className="choose-province"
                      onChange={handleChange}
                    >
                      <option value="">Choose your city</option>
                      {cities &&
                        cities.length > 0 &&
                        cities.map((city) => (
                          <option value={city.shipping_charge}>
                            {city.shipping_state}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <FormInput
                  id="phone"
                  handleChange={handleChange}
                  placeholder="Phone"
                  type="number"
                  className="phone"
                  required
                />
                <FormInput
                  id="alternate_phone"
                  handleChange={handleChange}
                  placeholder="Alternate Phone"
                  type="number"
                  className="phone"
                  required
                />
              </div>
            </div>
            {/* <div className="delivery-options">
            <h3 className="delivery-title">Delivery</h3>
            <div className="options">
              <div className="input-container">
                <FormInput
                  id="name"
                  handleChange={handleChange}
                  type="radio"
                  value="bluedart"
                  className="bluedart"
                  name="delivery-option"
                />
                <label htmlFor="bluedart">
                  {" "}
                  <span>
                    <FaFedex />
                  </span>{" "}
                  FedEx
                </label>
              </div>
              <div className="input-container">
                <FormInput
                  handleChange={handleChange}
                  type="radio"
                  value="dhl"
                  className="dhl"
                  name="delivery-option"
                />
                <label htmlFor="dhl">
                  {" "}
                  <span>
                    <FaDhl />
                  </span>{" "}
                  DHL
                </label>
              </div>
            </div>
          </div> */}
            <div className="payment-options">
              <h3 className="payment-options-title">Payment</h3>
              <div className="input-container">
                <FormInput
                  // handleChange={handleChange}
                  type="radio"
                  className="cash-on-delivery"
                  name="payment"
                  checked={true}
                />
                <label htmlFor="cash-on-delivery">
                  {" "}
                  <span>
                    <BiMoney />
                  </span>{" "}
                  Cash on Delivery
                </label>
              </div>
            </div>
            <div className="payment-options">
              <h3 className="payment-options-title">Payment Side</h3>

              <div className="product-details">
                <div className="list">
                  <li className="list-item">
                    <span className="key">Products</span>
                    <span className="value">{calculateTotal()} AED</span>
                  </li>
                  <li className="list-item">
                    <span className="key">Total Discount</span>
                    <span className="value"> - {calculateDiscount()} AED</span>
                  </li>
                  <li className="list-item">
                    <span className="key">Delivery</span>
                    <span className="value">{shipping_charge} AED</span>
                  </li>
                  <li className="list-item">
                    <span className="key">Total</span>
                    <span className="value">{calculateGrandTotal()} AED</span>
                  </li>
                  <FormInput
                    type="submit"
                    value="Place Order"
                    name="place-order"
                    className="place-order-btn"
                  />
                </div>
              </div>
            </div>{" "}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckOutPage;

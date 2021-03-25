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
  const [shipping_charge_city, setshipping_charge_city] = useState("");

  const [cities, setCities] = useState([]);
  const { cartState, cartStateDispatch } = useContext(AppContext);
  const [cart, setCart] = useState([]);

  const notifySucess = (text) =>
    toast(text, {
      type: toast.TYPE.INFO,
      autoClose: 10000,
    });

  useEffect(() => {
    document.title = `Checkout • For babies and toddlers • Twistshake`;
    window.scrollTo(0, 0);
    getCart();
    getCities();
    getAddress();
    getAccount();
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

  const getAccount = () => {
    Axios.get(
      `${requests.getAccount}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      if (response.data.user !== null) {
        var userDetails = response.data.user;
        // setid(userDetails.id);
        // setemail(userDetails.email);
        setname(userDetails.name);
        setphone(userDetails.phone);

        localStorage.setItem("ts-name", userDetails.name);
      }
    });
  };

  const getAddress = () => {
    Axios.get(
      `${requests.getAddress}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      if (response.data.user !== null) {
        // setAddressDetails(response.data);
        var address = response.data.user;
        setaddress(address.address);
        setaddress_type(address.address2);
        setshipping_charge(address.city);
        setphone(address.phone);
        // setAddressId(address.id);

        Axios.get(`${requests.getCities}`, config).then((response) => {
          let city = response.data.shipping;

          for (let i = 0; i < city.length; i++) {
            if (address.city === city[i].shipping_state) {
              setshipping_charge(city[i].shipping_charge);
            }
          }
        });
      }
    });
  };

  const removeProduct = (cartIndex) => {
    cartStateDispatch({
      type: "REMOVE_PRODUCT",
      payload: cartIndex,
    });
  };
  const updateQuantity = (cartIndex, updateQuantity) => {
    const data = {
      quantity: updateQuantity,
    };

    if (localStorage.getItem("ts-token")) {
      Axios.put(`${requests.getCart}/${cartIndex}`, data, config).then(
        (response) => {
          getCart();
        }
      );
    } else {
      var cart = JSON.parse(localStorage.getItem("ts-cart"));

      for (let i = 0; i < cart.length; i++) {
        if (cartIndex == cart[i].cart_id) {
          cart[i].quantity = updateQuantity;
        }
      }
      cart = JSON.stringify(cart);
      localStorage.setItem("ts-cart", cart);

      window.location.reload();
    }
  };
  const removeCart = (id) => {
    if (localStorage.getItem("ts-token")) {
      Axios.delete(`${requests.getCart}/${id}`, config).then((response) => {
        getCart();
        toast.dark("Product removed from cart");
      });
    } else {
      var cart = JSON.parse(localStorage.getItem("ts-cart"));
      cart.splice(id - 1, 1);
      cart = JSON.stringify(cart);
      localStorage.setItem("ts-cart", cart);
      toast.dark("Product removed from cart");
      window.location.reload();
    }
  };

  const calculateTotal = () => {
    let subTotal = 0;
    if (localStorage.getItem("ts-token")) {
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
    } else {
      if (localStorage.getItem("ts-cart")) {
        var cart = JSON.parse(localStorage.getItem("ts-cart"));
        for (let i = 0; i < cart.length; i++) {
          var subAmount = parseInt(cart[i].price) * parseInt(cart[i].quantity);
          const total = parseInt(subAmount);
          subTotal = subTotal + total;
        }
      }
    }

    return subTotal + calculateDiscount();
  };
  const calculateDiscount = () => {
    let discount = 0;
    if (localStorage.getItem("ts-token")) {
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
    } else {
      if (localStorage.getItem("ts-cart")) {
        var cart = JSON.parse(localStorage.getItem("ts-cart"));
        for (let i = 0; i < cart.length; i++) {
          var total = parseInt(cart[i].discount) * parseInt(cart[i].quantity);

          discount = discount + total;
        }
      }
    }

    return discount;
  };

  const calculateGrandTotal = () => {
    let grandTotal = 0;
    if (localStorage.getItem("ts-token")) {
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
    } else {
      if (localStorage.getItem("ts-cart")) {
        var cart = JSON.parse(localStorage.getItem("ts-cart"));
        for (let i = 0; i < cart.length; i++) {
          var total =
            parseInt(cart[i].total_price) * parseInt(cart[i].quantity);

          grandTotal = grandTotal + total;
        }
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
      var text = e.target.value.replace(/[^0-9+]/gi, "");
      setphone(text);
    }
    if (e.target.id.toLowerCase() === "alternate_phone".toLowerCase()) {
      var text = e.target.value.replace(/[^0-9+]/gi, "");
      setalternate_phone(text);
    }
    if (e.target.id.toLowerCase() === "shipping_charge_city".toLowerCase()) {
      console.log(e.target.value);
      setshipping_charge_city(e.target.value);

      var res = e.target.value.split("-");

      setshipping_charge(res[0]);

      setCity(res[1]);
    }
  };

  const onPlaceOrder = (e) => {
    e.preventDefault();

    if (!localStorage.getItem("ts-token")) {
      window.location.href = "/login";
      return false;
    }

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
          {localStorage.getItem("ts-token") ? (
            cartState.cartProduct &&
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
                      removeCart={removeCart}
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
            })
          ) : localStorage.getItem("ts-cart") ? (
            JSON.parse(localStorage.getItem("ts-cart")).map(
              (product, index) => {
                return (
                  <div key={index} className="cart-product">
                    <div className="inner-container">
                      <div className="top">
                        <span
                          className="icon-close"
                          onClick={removeCart.bind(this, product.index)}
                        >
                          <IoMdCloseCircle />
                        </span>
                      </div>
                      <CartProduct
                        removeProduct={removeProduct}
                        removeCart={removeCart}
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
              }
            )
          ) : (
            <div className="empty-message">Your cart is empty!</div>
          )}
        </div>

        <div className="float-child-payment">
          <form onSubmit={onPlaceOrder}>
            <div className="address">
              <div className="title-top">Shipping Address</div>

              <div className="form">
                <FormInput
                  id="name"
                  value={name}
                  handleChange={handleChange}
                  placeholder="First Name"
                  type="text"
                  className="first"
                  required
                />

                <FormInput
                  id="address"
                  value={address}
                  handleChange={handleChange}
                  placeholder="Address"
                  type="text"
                  className="address"
                  required
                />
                <FormInput
                  id="address_type"
                  value={address_type}
                  handleChange={handleChange}
                  type="text"
                  className="residential-address"
                  placeholder="Appartment, Suit, (optional)"
                  // required
                />

                <div className="form-element-group">
                  <SelectOption
                    name="country"
                    className="choose-country"
                    options={["UAE"]}
                  />
                  <div className="select-option">
                    <select
                      id="shipping_charge_city"
                      value={shipping_charge_city}
                      name="city"
                      className="choose-province"
                      onChange={handleChange}
                      required
                    >
                      <option selected value="">
                        Choose your Emirate
                      </option>
                      {cities &&
                        cities.length > 0 &&
                        cities.map((city) => (
                          <option
                            value={`${city.shipping_charge}-${city.shipping_state}`}
                          >
                            {city.shipping_state}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <FormInput
                  id="phone"
                  value={phone}
                  handleChange={handleChange}
                  placeholder="Phone"
                  type="text"
                  min="0"
                  className="phone"
                  required
                />
                <FormInput
                  id="alternate_phone"
                  value={alternate_phone}
                  handleChange={handleChange}
                  placeholder="Alternate Phone"
                  type="text"
                  min="0"
                  className="phone"
                  // required
                />
              </div>
            </div>
            {/* <div className="delivery-options">
            <h3 className="delivery-title">Delivery</h3>
            <div className="options">
              <div className="input-container">
                <FormInput
                  id="name"
                  value={name}
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
                  <span>
                    <BiMoney />
                  </span>
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
                    <span className="value">
                      {calculateTotal() !== 0 ? shipping_charge : 0} AED
                    </span>
                  </li>
                  <li className="list-item">
                    <span className="key">Total</span>
                    <span className="value">
                      {calculateTotal() !== 0 ? calculateGrandTotal() : 0} AED
                    </span>
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

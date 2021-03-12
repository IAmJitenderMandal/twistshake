import React, { useReducer, useContext, useState, useEffect } from "react";
import Axios from "../../axios/axios";
import requests from "../../axios/requests";
import "./editAddresspage.styles.scss";
// toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};
export default function EditAddress() {
  const [address, setaddress] = useState("");
  const [address2, setaddress2] = useState("");
  const [city, setCity] = useState([]);
  const [cities, setCities] = useState([]);
  const [addressDetails, setAddressDetails] = useState({});
  const [addressId, setAddressId] = useState("");
  const [editAccount, setEditAddress] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAddress();
    getCities();
  }, []);

  const getCities = () => {
    Axios.get(`${requests.getCities}`, config).then((response) => {
      setCities(response.data.shipping);
    });
  };

  const getAddress = () => {
    Axios.get(
      `${requests.getAddress}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      if (response.data.user !== null) {
        setAddressDetails(response.data);
        var address = response.data.user;
        setaddress(address.address);
        setaddress2(address.address2);
        setCity(address.city);
        setAddressId(address.id);
      }
    });
  };

  const handleChange = (e) => {
    if (e.target.id.toLowerCase() === "address".toLowerCase()) {
      setaddress(e.target.value);
    }
    if (e.target.id.toLowerCase() === "address2".toLowerCase()) {
      setaddress2(e.target.value);
    }
    if (e.target.id.toLowerCase() === "city".toLowerCase()) {
      setCity(e.target.value);
    }
  };

  const onUpdateAddress = (e) => {
    let data = {
      address: address,
      address2: address2,
      city: city,
      country: "UAE",
      user_id: localStorage.getItem("ts-userid"),
    };
    if (addressId !== "") {
      data.id = addressId;
    }

    e.preventDefault();
    Axios.post(`${requests.updateAddress}`, data, config)
      .then((response) => {
        toast("Address Updated", {
          type: toast.TYPE.SUCCESS,
          autoClose: 10000,
        });
        getAddress();
        setEditAddress(false);
      })
      .catch((err) => {});
  };

  const onEditAddress = () => {
    setEditAddress(true);
  };

  return (
    <div className="editAccount">
      {" "}
      <ToastContainer />
      {editAccount === false ? (
        <div className="userInfo">
          <div className="name common">
            <span className="key">Address : </span>
            <span className="value">{address}</span>
          </div>
          <div className="email common">
            <span className="key">Appartment(optional) : </span>
            <span>{address2}</span>{" "}
          </div>
          <div className="phone common">
            <span className="key">City : </span>{" "}
            <span className="value">{city}</span>{" "}
          </div>

          <div className="phone common">
            <span className="key">Country : </span>{" "}
            <span className="value">UAE</span>{" "}
          </div>

          <div className="form-element-group">
            <input type="submit" value="Edit" onClick={onEditAddress} />
          </div>
        </div>
      ) : (
        <div className="edit-address">
          <form onSubmit={onUpdateAddress}>
            <div className="form-element-group">
              <label htmlFor="last-name">Address</label>
              <input
                id="address"
                name="address"
                onChange={handleChange}
                placeholder="Address"
                type="text"
                className="address"
                value={address}
              />
            </div>
            <div className="form-element-group">
              <label htmlFor="last-name">Appartment(optional)</label>
              <input
                id="address2"
                name="address2"
                onChange={handleChange}
                type="text"
                className="residential-address"
                placeholder="Appartment, Suit, (optional)"
                value={address2}
              />
            </div>

            <div className="inline-elements-container drop-downs">
              <select
                id="city"
                name="city"
                className="address-select"
                onChange={handleChange}
                value={city}
              >
                <option value="">Choose your city</option>
                {cities &&
                  cities.length > 0 &&
                  cities.map((city) => (
                    <option value={city.shipping_state}>
                      {city.shipping_state}
                    </option>
                  ))}
              </select>
              <select name="Country" className="address-select">
                <option value="uae">UAE</option>
              </select>
            </div>

            <div className="form-element-group">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

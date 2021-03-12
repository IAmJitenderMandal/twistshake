import React, { useContext, useState, useEffect } from "react";
import "./Login.styles.scss";
import FormInput from "../formInput/FormInput.component";
import { Link, useHistory, useParams } from "react-router-dom";

// context
import { AppContext } from "../../context/Context";
import { SET_USER } from "../../context/action.types";

// axios
import Axios from "../../axios/axios";
import requests from "../../axios/requests";

import { VscKey } from "react-icons/vsc";
import { FiUserPlus } from "react-icons/fi";

// toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

export default function Login() {
  const { appState, appStateDispatch } = useContext(AppContext);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameErr, setUserNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [isForgot, setIsForgot] = useState("");

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const { user } = appState;

  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    document.title = `Login • For babies and toddlers • Twistshake`;
  });

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName) {
      if (!validateEmail(userName)) {
        setUserNameErr("Invalid email");
        return false;
      }
    } else {
      setUserNameErr("Please enter email address");
      return false;
    }

    if (password.length >= 6 == false) {
      setPasswordErr("Password should minimum of 6 charector");
      return false;
    }

    const user = { email: userName, password: password };

    // send the username and password to the server
    const response = await Axios.post(requests.login, user)
      .then((res) => {
        toast("Logged in succesfully!", {
          type: toast.TYPE.SUCCESS,
          autoClose: 10000,
        });
        // setUser in app state
        appStateDispatch({ type: SET_USER, payload: res.data });

        // set user in local storage
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("ts-token", res.data.token);
        localStorage.setItem("ts-name", res.data.user.name);
        localStorage.setItem("ts-userid", res.data.user.id);
        localStorage.setItem("ts-phone", res.data.user.phone);

        if (params.id) {
          history.push(`/product/single/${params.id}`);
        } else {
          history.push("/");
        }

        if (localStorage.getItem("ts-cart")) {
          var counter = 0;
          var cart = JSON.parse(localStorage.getItem("ts-cart"));
          for (let i = 0; i < cart.length; i++) {
            let data = {
              cart_item: cart[i],
            };
            data.cart_item.user_id = res.data.user.id;

            counter = counter + 1;
            if (localStorage.getItem("ts-token")) {
              Axios.post(`${requests.addToCart}`, data, {
                headers: {
                  Authorization: `Bearer ${res.data.token}`,
                },
              }).then((response) => {
                if (counter === cart.length) {
                  window.location.reload();
                }
              });
            }
          }
        }

        // window.location.reload();
      })
      .catch((err) => {
        toast("Email and password incorrect!", {
          type: toast.TYPE.ERROR,
          autoClose: 10000,
        });
      });
  };

  const handleChange = (e) => {
    if (e.target.id.toLowerCase() === "userId".toLowerCase()) {
      setUserName(e.target.value);
      setUserNameErr("");
    }

    if (e.target.id.toLowerCase() === "userPassword".toLowerCase()) {
      setPassword(e.target.value);
      setPasswordErr("");
    }

    if (e.target.id.toLowerCase() === "email".toLowerCase()) {
      setEmail(e.target.value);
      setEmailErr("");
    }
  };

  if (user) {
    return <div>your logged in {user.name}</div>;
  }

  const onForgotPassword = () => {
    setIsForgot(true);
  };
  const onSendEmail = async () => {
    if (email) {
      if (!validateEmail(email)) {
        setEmailErr("Invalid email");
        return false;
      }
    } else {
      setEmailErr("Please enter email address");
      return false;
    }

    const response = await Axios.post(requests.forgotPassword, {
      email: email,
    }).then((res) => {
      toast(
        "An email has been sent to the supplied email address. Follow the instruction in the email to reset your password.",
        {
          type: toast.TYPE.SUCCESS,
          autoClose: 10000,
        }
      );

      setEmail("");
    });
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="inner-container">
        <div className="login-container">
          <h2 className="login-title">Login</h2>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <FormInput
                type="email"
                name="email"
                className="email"
                placeholder="Email"
                id="userId"
                handleChange={handleChange}
              />
              <div className="validationMsg">{userNameErr}</div>
              <FormInput
                type="password"
                name="password"
                className="password"
                placeholder="Password"
                id="userPassword"
                handleChange={handleChange}
              />
              <div className="validationMsg">{passwordErr}</div>
              <div className="remember-user">
                <FormInput
                  type="checkbox"
                  name="loginSubmit"
                  className="remember-login"
                />
                <label htmlFor="login-btn">Remember Login</label>
              </div>
              <FormInput
                type="submit"
                value="Login"
                name="loginSubmit"
                className="login-btn"
              />
            </form>
          </div>
          <div className="login-footer">
            <Link to="/create-account" className="login-footer-link">
              <FiUserPlus /> <span>Create Account</span>{" "}
            </Link>
            <Link className="login-footer-link" onClick={onForgotPassword}>
              <VscKey /> <span>Forgot Password</span>
            </Link>

            {isForgot ? (
              <div className="forgot-password-wrapper">
                <div className="forgot-password">
                  <div>
                    <input
                      type="email"
                      name="email"
                      className="email"
                      placeholder="Enter your email"
                      id="email"
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    onClick={onSendEmail}
                    name="loginSubmit"
                    className="submit"
                  >
                    Send
                  </button>
                </div>
                <div className="validationMsg">{emailErr}</div>

                <p>Enter your email address to reset your password.</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

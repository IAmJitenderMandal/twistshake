import React, { useContext, useState } from "react";
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

export default function Login() {
  const { appState, appStateDispatch } = useContext(AppContext);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameErr, setUserNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const { user } = appState;

  const history = useHistory();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName) {
      if (!userName.includes("@")) {
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

        if (params.id) {
          history.push(`/product/single/${params.id}`);
        } else {
          history.push("/");
        }

        window.location.reload();

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
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
  };

  if (user) {
    return <div>your logged in {user.name}</div>;
  }

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
            <Link to="/forgot-password" className="login-footer-link">
              <VscKey /> <span>Forgot Password</span>
            </Link>
            <Link to="/create-account" className="login-footer-link">
              <FiUserPlus /> <span>Create Account</span>{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

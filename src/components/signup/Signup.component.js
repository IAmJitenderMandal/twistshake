import React, { useState } from "react";
// react router
import { useHistory } from "react-router-dom";

import FormInput from "../formInput/FormInput.component";
import "./signup.styles.scss";
import requests from "../../axios/requests";
import Axios from "../../axios/axios";

// toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const notifySucess = () =>
    toast("Sucessfully Registered, use your Email Password to login", {
      type: toast.TYPE.INFO,
      autoClose: 10000,
    });

  const notifyError = () =>
    toast("sorry something is wrong, please try again", {
      type: toast.TYPE.ERROR,
      autoClose: 10000,
    });

  const handleChange = (e) => {
    if (e.target.id.toLowerCase() === "name") {
      var text = e.target.value.replace(/[^a-z0-9]/gi, "");
      console.log(text);
      setName(text);
      setNameErr("");
    }
    if (e.target.id.toLowerCase() === "user_email") {
      console.log(e.target.value);
      setEmail(e.target.value);
      setEmailErr("");
    }

    if (e.target.id.toLowerCase() === "phone") {
      console.log(e.target.value);
      setPhone(e.target.value);
      setPhoneErr("");
    }

    if (e.target.id.toLowerCase() === "user_password") {
      setPassword(e.target.value);
      setPasswordErr("");
    }
    if (e.target.id.toLowerCase() === "confirm_user_password") {
      setConfirmPassword(e.target.value);
      setConfirmPasswordErr("");
    }
  };

  const validate = () => {
    let nameErr = "";
    let phoneErr = "";
    let emailErr = "";
    let passwordErr = "";

    // validating name field
    if (!name) {
      console.log("invalid");
      nameErr = "Name can not be blank";
      setNameErr(nameErr);
      return false;
    }

    // validating email field
    if (email) {
      if (!email.includes("@")) {
        console.log("invalid");
        emailErr = "Invalid email";
        setEmailErr(emailErr);
        return false;
      }
    } else {
      setEmailErr("Please enter email address");
      return false;
    }

    // validating phone
    function phonenumber(phoneInput) {
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (phoneInput.match(phoneno)) {
        return true;
      } else {
        return false;
      }
    }

    if (phonenumber(phone) === false) {
      console.log("phoneerr");
      setPhoneErr("Please enter correct phone");
      return false;
    }

    // password validaiton
    if (password.length >= 6 == false) {
      setPasswordErr("Password should minimum of 6 charector");
      return false;
    }

    if ((confirmPassword === password) == false) {
      setConfirmPasswordErr("Password does not matches");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate();

    if (isValid) {
      const data = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        c_password: confirmPassword,
      };

      Axios.post(requests.createAccount, data)
        .then((res) => {
          if (res.request.status === 200) {
            setName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");
            setNameErr("");
            setEmailErr("");
            setPhoneErr("");
            setPasswordErr("");
            setConfirmPasswordErr("");

            notifySucess();
          }
        })
        .catch((res) => {
          console.log(res.response.data.error);
          toast("sorry something is wrong, please try again", {
            type: toast.TYPE.ERROR,
            autoClose: 10000,
          });
        });
    }
  };

  return (
    <div className="signup">
      <ToastContainer />
      <div className="inner-container">
        <div className="signup-container">
          <div className="signup-title">
            <h2>Create Account</h2>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <FormInput
                type="text"
                name="name"
                value={name}
                id="name"
                className="name"
                placeholder="Your Name"
                handleChange={handleChange}
                pattern="^[a-zA-Z0-9]+$"
              />
              <div className="validationMsg">{nameErr}</div>
              <FormInput
                type="text"
                name="email"
                value={email}
                id="user_email"
                className="email"
                placeholder="Email"
                onChange={handleChange}
              />
              <div className="validationMsg">{emailErr}</div>
              <FormInput
                type="number"
                name="mobile"
                value={phone}
                id="phone"
                min="0"
                className="phone"
                placeholder="Enter your phone"
                onChange={handleChange}
              />
              <div className="validationMsg">{phoneErr}</div>
              <FormInput
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                id="user_password"
                className="password"
                onChange={handleChange}
              />
              <div className="validationMsg">{passwordErr}</div>
              <FormInput
                type="password"
                name="confirm_password"
                value={confirmPassword}
                id="confirm_user_password"
                className="password"
                placeholder="Re-enter Password"
                onChange={handleChange}
              />
              <div className="validationMsg">{confirmPasswordErr}</div>
              <FormInput
                type="submit"
                value="Signup"
                name="signupSubmit"
                className="signup-btn"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

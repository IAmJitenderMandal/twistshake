import React, { useReducer, useContext, useState, useEffect } from "react";
import Axios from "../../axios/axios";
import requests from "../../axios/requests";
import "./editAccount.styles.scss";

// toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};
export default function EditAccountForm() {
  const [id, setid] = useState("");
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [new_password, setnew_password] = useState("");
  const [c_password, setc_password] = useState("");
  const [editAccount, setEditAccount] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAccount();
  }, []);

  const getAccount = () => {
    Axios.get(
      `${requests.getAccount}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      if (response.data.user !== null) {
        var userDetails = response.data.user;
        setid(userDetails.id);
        setemail(userDetails.email);
        setname(userDetails.name);
        setphone(userDetails.phone);

        localStorage.setItem("ts-name", userDetails.name);
      }
    });
  };

  const handleChange = (e) => {
    if (e.target.id.toLowerCase() === "name".toLowerCase()) {
      setname(e.target.value);
    }
    if (e.target.id.toLowerCase() === "phone".toLowerCase()) {
      setphone(e.target.value);
    }
    if (e.target.id.toLowerCase() === "password".toLowerCase()) {
      setpassword(e.target.value);
    }
    if (e.target.id.toLowerCase() === "new_password".toLowerCase()) {
      setnew_password(e.target.value);
    }
    if (e.target.id.toLowerCase() === "c_password".toLowerCase()) {
      setc_password(e.target.value);
    }
  };

  const onUpdateAccount = (e) => {
    e.preventDefault();
    if (!name) {
      toast("Please enter your name!", {
        type: toast.TYPE.ERROR,
        autoClose: 10000,
      });
      return false;
    }

    if (new_password !== c_password) {
      if (!password) {
        toast("Please enter current password!", {
          type: toast.TYPE.ERROR,
          autoClose: 10000,
        });
        return false;
      }

      toast("Passwords should be same!", {
        type: toast.TYPE.ERROR,
        autoClose: 10000,
      });
      return false;
    } else {
      if (password) {
        if (!new_password || !c_password) {
          toast("Please enter new passsword and confirm password!", {
            type: toast.TYPE.ERROR,
            autoClose: 10000,
          });
          return false;
        }
      }
    }

    if (new_password || c_password || password) {
      if (new_password.length < 6) {
        toast("Password should minimum of 6 charector", {
          type: toast.TYPE.ERROR,
          autoClose: 10000,
        });
        return false;
      }
    }

    let data = {
      id: id,
      name: name,
      phone: phone,
      password: password,
      new_password: new_password,
      // c_password: c_password,
    };

    e.preventDefault();
    Axios.post(`${requests.updateAccount}`, data, config)
      .then((response) => {
        toast("Account Updated", {
          type: toast.TYPE.SUCCESS,
          autoClose: 10000,
        });

        if (response.data.success.status) {
          localStorage.setItem("ts-name", response.data.user.name);
        }
        // getAccount();
        setEditAccount(false);
        // window.location.reload();
      })
      .catch((err) => {
        toast(err.response.data, {
          type: toast.TYPE.ERROR,
          autoClose: 10000,
        });
      });
  };

  const onEditAccount = () => {
    setEditAccount(true);
  };

  return (
    <div className="editAccount">
      <ToastContainer />
      {/* <h2>Edit Your Account</h2> */}

      {editAccount === false ? (
        <div className="userInfo">
          <div className="name common">
            <span className="key">Name : </span>
            <span className="value">{name}</span>
          </div>
          <div className="email common">
            <span className="key">Email : </span>
            <span>{email}</span>{" "}
          </div>
          <div className="phone common">
            <span className="key">Phone : </span>{" "}
            <span className="value">{phone}</span>{" "}
          </div>

          <div className="form-element-group">
            <input type="submit" value="Edit" onClick={onEditAccount} />
          </div>
        </div>
      ) : (
        <div className="form">
          <form onSubmit={onUpdateAccount}>
            <div className="form-element-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                onChange={handleChange}
                placeholder="Name"
                type="text"
                className="name"
                value={name}
              />
            </div>
            <div className="form-element-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                type="text"
                className="email"
                value={email}
                disabled
              />
            </div>
            <div className="form-element-group">
              <label htmlFor="password">Current Password</label>
              <input
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Current Password"
                type="password"
                className="password"
                value={password}
              />
            </div>
            <div className="form-element-group">
              <label htmlFor="password">New Password</label>
              <input
                id="new_password"
                name="new_password"
                onChange={handleChange}
                placeholder="New Password"
                type="password"
                className="password"
                value={new_password}
              />
            </div>
            <div className="form-element-group">
              <label htmlFor="password">Re-enter Password</label>
              <input
                id="c_password"
                name="c_password"
                onChange={handleChange}
                placeholder="Confirm Password"
                type="password"
                className="c_password"
                value={c_password}
              />
            </div>
            <div className="form-element-group">
              <label htmlFor="number">Mobile Number</label>
              <input
                id="phone"
                name="phone"
                onChange={handleChange}
                placeholder="phone"
                type="text"
                className="phone"
                value={phone}
              />
            </div>

            <div className="form-element-group">
              <input type="submit" value="Update" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

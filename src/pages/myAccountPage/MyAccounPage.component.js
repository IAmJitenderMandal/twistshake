import React, { useEffect } from "react";
import "./myAccountPage.styles.scss";
import ProfileImage from "../../components/profileImage/ProfileImage.component";
import Orders from "../../components/order-details/Orders.component";
import EditAccountForm from "../EditAccountForm/EditAccountForm.component";
import EditAddress from "../EditAddressPage/EditAddress.component";

import { Link, Route, useHistory } from "react-router-dom";
import UserInfo from "../UserInfoPage/UserInfo.component";
import OrderDetail from "../OrderDetailPage/OrderDetail.component";

export default function MyAccounPage() {
  const history = useHistory();
  useEffect(() => {
    document.title = `My Account • For babies and toddlers • Twistshake`;
  }, []);
  const logout = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };
  return (
    <div className="my-account">
      <div className="title">My Account</div>
      <div className="content">
        <div className="left">
          <div className="upper-content">
            <ProfileImage />
            <span className="profile-name">
              {localStorage.getItem("ts-name")}
            </span>
          </div>

          <div className="bottom-content">
            <div className="option-links">
              <Link to="/myAccount/dashboard" className="link">
                DASHBOARD
              </Link>
              <Link to="/myAccount/orders" className="link">
                MY ORDERS
              </Link>
              <Link to="/myAccount/edit-account" className="link">
                MY ACCOUNT
              </Link>
              <Link to="/myAccount/edit-address" className="link">
                ADDRESS
              </Link>
              <Link className="link" onClick={logout}>
                LOG OUT
              </Link>
            </div>
          </div>
        </div>
        <div className="right">
          <Route
            path="/myAccount/"
            exact
            render={() => (
              <>
                <div className="account-description">
                  Hello{" "}
                  <span name="profile-name">
                    {localStorage.getItem("ts-name")}
                  </span>{" "}
                  from your account dashboard you can manage and view all the
                  recent orders and your account details, manage your shipping
                  and billing address details.
                </div>
                <Orders />
              </>
            )}
          />
          <Route
            path="/myAccount/dashboard"
            render={() => (
              <>
                <div className="account-description">
                  Hello {localStorage.getItem("ts-name")} from your account
                  dashboard you can manage and view all the recent orders and
                  your account details, manage your shipping and billing address
                  details.
                </div>
                <Orders />
              </>
            )}
          />
          <Route
            path="/myAccount/orders"
            render={() => (
              <>
                <Orders />
              </>
            )}
          />
          <Route
            path="/myAccount/order-details/:orderId"
            render={() => (
              <>
                <OrderDetail />
              </>
            )}
          />
          <Route
            path="/myAccount/edit-account"
            render={() => (
              <>
                {" "}
                <EditAccountForm />{" "}
              </>
            )}
          />
          <Route
            path="/myAccount/edit-address"
            render={() => (
              <>
                {" "}
                <EditAddress />{" "}
              </>
            )}
          />
          <Route
            path="/myAccount/user-info"
            render={() => (
              <>
                <UserInfo />
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}

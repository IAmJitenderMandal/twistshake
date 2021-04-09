import React, { useEffect, useState } from "react";
import "./contactPage.styles.scss";

import { AiOutlineArrowRight } from "react-icons/ai";
import Axios from "../../axios/axios";
import requests from "../../axios/requests";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AnchorLink from "react-anchor-link-smooth-scroll";

import ReactParser from "react-html-parser";

// distributor form data
export default function Contact() {
  const [data, setData] = useState([]);
  useEffect(() => {
    Axios.get(requests.pages).then((res) => {
      setData(res.data.pages["contact"]);
    });
  }, []);

  const [distributorCompany, setDisributorCompany] = useState("");
  const [distributorCountry, setDistributorCountry] = useState("");
  const [distributorName, setDistributorName] = useState("");
  const [distributorPhone, setDistributorPhone] = useState("");
  const [distributorEmail, setDistributorEmail] = useState("");
  const [distributorCompanyType, setDistributorCompanyType] = useState("");
  const [distributorMsg, setDistributorMsg] = useState("");

  const distDataToPost = {
    company: distributorCompany,
    country: distributorCountry,
    name: distributorName,
    phone: distributorPhone,
    email: distributorEmail,
    company_type: distributorCompanyType,
    message: distributorMsg,
  };

  // contact us form data
  const [subject, setSubject] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [yourMsg, setYourMsg] = useState("");

  const contactUsDataToPost = {
    subject: subject,
    name: name,
    order_number: orderNumber,
    email: contactEmail,
    message: yourMsg,
  };

  // handle distributor form submiton
  async function handleDistSubmit(e) {
    e.preventDefault();
    const res = await Axios.post(requests.distributor, distDataToPost);
    if (res.status === 200) {
      notifyDistSubmitionSuccess();

      setDisributorCompany("");
      setDistributorName("");
      setDistributorCountry("");
      setDistributorEmail("");
      setDistributorMsg("");
      setDistributorName("");
      setDistributorPhone("");
      setDistributorCompanyType("");
    }
  }

  // handle contact us form data

  async function handleContactUsSubmit(e) {
    e.preventDefault();
    const res = await Axios.post(requests.contactUs, contactUsDataToPost);
    if (res.status === 200) {
      notifyDistSubmitionSuccess();

      setContactEmail("");
      setName("");
      setOrderNumber("");
      setSubject("");
      setYourMsg("");
    }
  }

  const notifyDistSubmitionSuccess = () =>
    toast("thanks for contacting us. We will reach out to you soon");

  return (
    <div className="contact">
      <ToastContainer />
      <div className="inner-container">
        <div className="left">
          <div className="left-title">
            <span className="icon">
              <AiOutlineArrowRight />
            </span>
            <h2>{data.length > 0 ? data[0].page_title : " "}</h2>
          </div>
          <ul className="list">
            {data.length > 0 &&
              data.map((eachset, index) => (
                <AnchorLink offset="80" href={`#para${index}`}>
                  <li key={index}>{eachset.page_sub_title}</li>
                </AnchorLink>
              ))}
          </ul>
        </div>
        <div className="right">
          <div className="content" id={`para0`}>
            <p className="para-title">
              {data.length > 0 && data[0].page_sub_title}
            </p>
            <div className="address">
              {ReactParser(data.length > 0 && data[0].page_subtitle_content)}
            </div>
          </div>

          <div className="form" id={`para1`}>
            <h3>{data.length > 0 && data[1].page_sub_title}</h3>
            <p>
              {ReactParser(data.length > 0 && data[1].page_subtitle_content)}
            </p>
            <form onSubmit={handleContactUsSubmit}>
              <div className="form-element-group common">
                <label htmlFor="company">subject *</label>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="product-delivery">Product Delivery</option>
                  <option value="order-delivery">Order & Delivery</option>
                  <option value="return-claims">Return Claims</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other-question">Other Question</option>
                </select>
              </div>
              <div className="instagram-form-group common">
                <label htmlFor="instagram">Order Number *</label>
                <input
                  type="text"
                  placeholder="Order number"
                  className="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
              </div>
              <div className="name common">
                <label htmlFor="name">First and last name *</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="instagram-form-group common">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                />
              </div>
              <div className="email-form-group common">
                <label htmlFor="msg">Your Message</label>
                <textarea
                  placeholder="Your message"
                  className="msg"
                  value={yourMsg}
                  onChange={(e) => setYourMsg(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-submit-btn">
                <input
                  type="button"
                  placeholder=""
                  className="submit-btn"
                  type="submit"
                />
              </div>
            </form>
          </div>
          <div className="form-1">
            <h3 className="form-1-title" id={`para2`}>
              {data.length > 0 && data[2].page_sub_title}
            </h3>
            <p className="sub-title">
              {ReactParser(data.length > 0 && data[2].page_subtitle_content)}
            </p>
            <form onSubmit={handleDistSubmit}>
              <div className="element-container">
                <div className="form-element-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    className="company"
                    value={distributorCompany}
                    onChange={(e) => setDisributorCompany(e.target.value)}
                    required
                  />
                </div>
                <div className="form-element-group">
                  <label htmlFor="company">Country</label>
                  <input
                    type="text"
                    className="country"
                    value={distributorCountry}
                    onChange={(e) => setDistributorCountry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-element-group">
                  <label htmlFor="company">Contact Name *</label>
                  <input
                    type="text"
                    className="name"
                    value={distributorName}
                    onChange={(e) => setDistributorName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-element-group">
                  <label htmlFor="company">Telephone</label>
                  <input
                    type="text"
                    className="phone"
                    value={distributorPhone}
                    onChange={(e) => setDistributorPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-element-group">
                  <label htmlFor="company">Email *</label>
                  <input
                    type="email"
                    className="email"
                    value={distributorEmail}
                    onChange={(e) => setDistributorEmail(e.target.value)}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  />
                </div>
                <div className="form-element-group">
                  <label htmlFor="company">Company type</label>
                  <input
                    type="text"
                    className="type"
                    value={distributorCompanyType}
                    onChange={(e) => setDistributorCompanyType(e.target.value)}
                    required
                  />
                </div>

                <div className="form-element-group msg-container">
                  <label htmlFor="msg">Leave a Message</label>
                  <textarea
                    id=""
                    cols="30"
                    rows="4"
                    className="message"
                    value={distributorMsg}
                    onChange={(e) => setDistributorMsg(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="submit-btn">
                <input
                  type="button"
                  placeholder=""
                  className="submit-btn"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

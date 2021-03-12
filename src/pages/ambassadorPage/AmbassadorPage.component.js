import React, { useState, useEffect } from "react";
import "./ambassador.styles.scss";

import { AiOutlineArrowRight } from "react-icons/ai";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

import HtmlParser from "react-html-parser";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AnchorLink from "react-anchor-link-smooth-scroll";

export default function Ambassador() {
  const [name, setName] = useState("");
  const [insta, setInsta] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [yourMsg, setYourMsg] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    Axios.get(requests.pages).then((res) => {
      setData(res.data.pages.ambassador);
    });
  }, []);

  const ambassadorDataToPost = {
    name: name,
    insta_profile: insta,
    email: contactEmail,
    message: yourMsg,
  };

  // handle ambassador form submit
  async function handleAmbassadorSubmit(e) {
    e.preventDefault();
    const res = await Axios.post(requests.contactUs, ambassadorDataToPost);
    if (res.status === 200) {
      notifyDistSubmitionSuccess();

      setName("");
      setContactEmail("");
      setInsta("");
      setYourMsg("");
    }
  }

  const notifyDistSubmitionSuccess = () =>
    toast("thanks for contacting us. We will reach out to you soon");

  return (
    <div className="ambassador">
      <div className="inner-container">
        <div className="left">
          <div className="left-title">
            <span className="icon">
              <AiOutlineArrowRight />
            </span>
            <h2>Ambassador</h2>
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
          <div className="content">
            {data.length > 0
              ? data.map((eachSet, index) => (
                  <div key={index} id={`para${index}`}>
                    <h1 className="para-title">{eachSet.page_sub_title}</h1>
                    <div className="para">
                      {HtmlParser(eachSet.page_subtitle_content)}
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="form">
            <form onSubmit={handleAmbassadorSubmit}>
              <div className="your-name-form-group common">
                <label htmlFor="your-name">First and last name *</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="your-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="instagram-form-group common">
                <label htmlFor="instagram">instagram *</label>
                <input
                  type="text"
                  placeholder="@Your Profile"
                  className="instagram"
                  value={insta}
                  onChange={(e) => setInsta(e.target.value)}
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
                <label htmlFor="msg">Leave a message</label>
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
        </div>
      </div>
    </div>
  );
}

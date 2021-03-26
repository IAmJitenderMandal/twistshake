import React from "react";
import "./footer-icons.styles.scss";

import { Link } from "react-router-dom";

import { AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
import { RiBankFill, RiPaypalFill } from "react-icons/ri";

export default function FooterIcons() {
  return (
    <div className="footer-icons">
      <div className="icons-left">
        <Link to="/" className="link">
          {" "}
          <span className="insta">
            <AiFillInstagram />{" "}
          </span>
        </Link>
        <Link to="/" className="link">
          {" "}
          <span className="fb">
            <FaFacebookF />
          </span>
        </Link>
        <Link to="/" className="link">
          {" "}
          <span className="tw">
            <AiOutlineTwitter />
          </span>
        </Link>
        <Link to="/" className="link">
          {" "}
          <span className="yt">
            <FaYoutube />
          </span>
        </Link>
      </div>
    </div>
  );
}

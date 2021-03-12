import React, { useState, useEffect } from "react";

import "./termsAndConditions.scss";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

import HtmlParser from "react-html-parser";

import { AiOutlineArrowRight } from "react-icons/ai";

import AnchorLink from "react-anchor-link-smooth-scroll";

export default function TermsAndConditons() {
  const [data, setData] = useState([]);
  useEffect(() => {
    Axios.get(requests.pages).then((res) => {
      setData(res.data.pages["terms-and-conditions"]);
    });
  }, []);

  return (
    <div className="termsAndConditions">
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
      </div>
    </div>
  );
}

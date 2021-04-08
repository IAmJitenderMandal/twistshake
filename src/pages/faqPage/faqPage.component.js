import React, { useEffect, useState } from "react";
import "./faq.styles.scss";

import { RiArrowDropDownLine } from "react-icons/ri";
import { AiOutlineArrowRight } from "react-icons/ai";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

import HtmlParser from "react-html-parser";

import AnchorLink from "react-anchor-link-smooth-scroll";

// react accordian
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

export default function FAQPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    Axios.get(requests.pages).then((res) => {
      setData(res.data.pages["faq"]);
    });
  }, []);
  return (
    <div className="faq">
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
          <div className="content">
            <p className="title">FAQ</p>

            <div className="accordians-content-container">
              <Accordion allowZeroExpanded>
                {data.length > 0
                  ? data.map((eachSet, index) => (
                      <div
                        key={index}
                        className="each-accordian-item"
                        id={`para${index}`}
                      >
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              <div className="heading-title">
                                <span>{eachSet.page_sub_title}</span>
                                <span>
                                  <RiArrowDropDownLine />
                                </span>
                              </div>
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className="para">
                              {HtmlParser(eachSet.page_subtitle_content)}
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                      </div>
                    ))
                  : null}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

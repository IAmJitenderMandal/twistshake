import React, { useState, useContext, useEffect } from "react";
import "./selectedProductOption.styles.scss";

import { ProductContext } from "../../context/Context";
import { CUSTOMISATION_NESTED_SIDEBAR } from "../../context/action.types";

import CustomProductCard from "../custom-product-card/CustomProductCard.component";
import Button from "../button/Button.component";

export default function SelectedProductCustomisation() {
  const { productState, productStateDispatch } = useContext(ProductContext);
  useEffect(() => {}, [productState]);
  const [selectedItem, setSelectedItem] = useState({});

  return (
    <div
      className={`selected-customisation ${productState.CustomisationNestedSidebar}`}
    >
      <div className="slected-area-top">
        <div className="title">
          <div className="title-text">Choose Product</div>
        </div>
        <div className="products">
          {Object.keys(productState.currentlySelectedInCustomisation).length &&
            productState.currentlySelectedInCustomisation.product_attribute.map(
              (eachAttr, index) => (
                <CustomProductCard
                  id={index}
                  key={index}
                  img={eachAttr.attribute_Image}
                  name={eachAttr.attribute_value.map((eachValue, index) => (
                    <span key={index}>{`${eachValue}  `}</span>
                  ))}
                  onClick={(e) => {
                    setSelectedItem(
                      productState.currentlySelectedInCustomisation
                        .product_attribute[e.target.id]
                    );
                  }}
                ></CustomProductCard>
              )
            )}
        </div>

        <div className="colors">
          <div className="title-text">Choose color:</div>
          <div className="color-values">
            {Object.keys(productState.currentlySelectedInCustomisation)
              .length &&
              productState.currentlySelectedInCustomisation.product_attribute.map(
                (eachAttr) => {
                  const data = eachAttr.product_color_image.map(
                    (eachColorObj, index) => (
                      <div className="each-color" key={index}>
                        <div className="inner-container">
                          {eachColorObj.color_image && (
                            <img
                              src={eachColorObj.color_image}
                              height={40}
                              width={40}
                              alt="imgcolor"
                              sku_id={eachColorObj.sku_id}
                              onClick={function () {}}
                            />
                          )}

                          {eachColorObj.color_code && (
                            <div
                              className="color"
                              style={{
                                backgroundColor: eachColorObj.color_code,
                              }}
                              sku_id={eachColorObj.sku_id}
                              onClick={function () {}}
                            ></div>
                          )}
                        </div>
                        <div className="color-name">
                          {eachColorObj.color_name}
                        </div>
                      </div>
                    )
                  );
                  return data;
                }
              )}
          </div>
        </div>

        <div className="product-description">
          <div className="description-title">Product Description</div>
          <p className="description-text">
            {Object.keys(productState.currentlySelectedInCustomisation)
              .length &&
              productState.currentlySelectedInCustomisation.short_descript}
          </p>
        </div>
      </div>
      <div className="selected-area-bottom">
        <div className="product-name">
          <div className="name-text">
            {" "}
            {productState.currentlySelectedInCustomisation.product_name || null}
          </div>
          <div className="product-type">
            {/* {productState.currentlySelectedInCustomisation || null} */}
          </div>
        </div>
        <div
          className="ok-button"
          onClick={() => {
            productStateDispatch({
              type: CUSTOMISATION_NESTED_SIDEBAR,
              payload: "",
            });
          }}
        >
          <Button>
            <span>ok</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

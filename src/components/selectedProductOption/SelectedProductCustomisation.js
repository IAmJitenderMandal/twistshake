import React, { useState, useContext, useEffect } from "react";
import "./selectedProductOption.styles.scss";

import { ProductContext } from "../../context/Context";
import { CHANGE_DISPLAY_PRODUCT } from "../../context/action.types";

import CustomProductCard from "../custom-product-card/CustomProductCard.component";
import Button from "../button/Button.component";

function SelectedProductCustomisation({
  customizeProduct,
  handleOk,
  coustomizeProductID,
}) {
  const { productState, productStateDispatch } = useContext(ProductContext);
  const [clickOnColor, setClickOnColor] = useState(0);
  const [selectedItem, setSelectedItem] = useState(customizeProduct[0]);
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [saveProduct, setSaveProduct] = useState({
    index: null,
    colorIndex: null,
    productID: null,
    productName: null,
    price: null,
    totalPrice: null,
    attributeName: null,
    attributecolor: null,
    sku_id: null,
  });
  useEffect(() => {
    if (productState.savedProduct) {
      let flag = false;
      productState.savedProduct.map((eachItem, saveIndex) => {
        if (
          eachItem.index === coustomizeProductID.productIndex &&
          eachItem.productID === coustomizeProductID.productID
        ) {
          flag = true;

          customizeProduct.map((productAttr, attrIndex) => {
            if (eachItem.attributeName === productAttr.attribute_value[0]) {
              setSelectedItem(customizeProduct[attrIndex]);
              setSelectedProductId(attrIndex);
              productAttr.product_color_image.map((item, colorIndex) => {
                if (eachItem.attributecolor === item.color_name) {
                  setSaveProduct({
                    ...saveProduct,
                    index: coustomizeProductID.productIndex,
                    colorIndex: colorIndex,
                    productID: coustomizeProductID.productID,
                    productName:
                      productState.displayProduct[
                        coustomizeProductID.productIndex
                      ].product_name,
                    price:
                      productState.displayProduct[
                        coustomizeProductID.productIndex
                      ].price,
                    totalPrice:
                      productState.displayProduct[
                        coustomizeProductID.productIndex
                      ].total_price,
                    attributeName: productAttr.attribute_value[0],
                    attributecolor: item.color_name,
                    sku_id:
                      productState.displayProduct[
                        coustomizeProductID.productIndex
                      ].sku_id,
                  });
                }
              });
            }
          });
        }
      });
      if (!flag) {
        setSaveProduct({
          ...saveProduct,
          index: coustomizeProductID.productIndex,
          colorIndex: 0,
          productID: coustomizeProductID.productID,
          productName:
            productState.displayProduct[coustomizeProductID.productIndex]
              .product_name,
          price:
            productState.displayProduct[coustomizeProductID.productIndex].price,
          totalPrice:
            productState.displayProduct[coustomizeProductID.productIndex]
              .total_price,
          attributeName: selectedItem.attribute_value[0],
          attributecolor: selectedItem.product_color_image[0].color_name,
          sku_id:
            productState.displayProduct[coustomizeProductID.productIndex]
              .sku_id,
        });
      }
    } else {
      debugger;
      setSaveProduct({
        ...saveProduct,
        index: coustomizeProductID.productIndex,
        colorIndex: 0,
        productID: coustomizeProductID.productID,
        productName:
          productState.displayProduct[coustomizeProductID.productIndex]
            .product_name,
        price:
          productState.displayProduct[coustomizeProductID.productIndex].price,
        totalPrice:
          productState.displayProduct[coustomizeProductID.productIndex]
            .total_price,
        attributeName: selectedItem.attribute_value[0],
        attributecolor: selectedItem.product_color_image[0].color_name,
        sku_id:
          productState.displayProduct[coustomizeProductID.productIndex].sku_id,
      });
    }
  }, [coustomizeProductID]);

  useEffect(() => {
    let tempSelect = selectedItem;
    let flag = false;
    selectedItem.product_color_image.map((eachColorObj, index) => {
      if (eachColorObj.product_image === selectedItem.attribute_Image) {
        flag = true;
      }
    });
    if (!flag) {
      tempSelect.attribute_Image =
        selectedItem.product_color_image[0].product_image;
      setSelectedItem(tempSelect);
    }
  }, [selectedProductId]);

  const onClickProduct = (e) => {
    let tempProduct = customizeProduct[e.target.id];
    let flag = false;
    customizeProduct[e.target.id].product_color_image.map(
      (eachColorObj, index) => {
        if (eachColorObj.product_image === selectedItem.attribute_Image) {
          flag = true;
        }
      }
    );
    if (!flag) {
      tempProduct.attribute_Image =
        customizeProduct[e.target.id].product_color_image[0].product_image;
    }
    setSelectedItem(tempProduct);
    setSelectedProductId(e.target.id);
  };

  const onChnageProduct = (eachColorObj, index) => {
    setClickOnColor(1);
    setSaveProduct({
      ...saveProduct,
      colorIndex: index,
      attributecolor: eachColorObj.color_name,
      attributeName: selectedItem.attribute_value[0],
    });
    const changedisplayData = {
      productImage: eachColorObj.product_image,
      productID: coustomizeProductID.productID,
      productIndex: coustomizeProductID.productIndex,
      productAtrID: selectedProductId,
    };
    productStateDispatch({
      type: CHANGE_DISPLAY_PRODUCT,
      payload: changedisplayData,
    });
  };
  const handleClickOk = () => {
    if (clickOnColor) {
      debugger;
      handleOk(saveProduct);
    } else {
      let newSaveItem;
      let changedisplayData;
      selectedItem.product_color_image.map((eachColorObj, index) => {
        debugger;
        if (eachColorObj.product_image === selectedItem.attribute_Image) {
          newSaveItem = {
            ...saveProduct,
            attributecolor: selectedItem.product_color_image[index].color_name,
            attributeName: selectedItem.attribute_value[0],
          };
          setSaveProduct(newSaveItem);
          changedisplayData = {
            productImage: eachColorObj.product_image,
            productID: coustomizeProductID.productID,
            productIndex: coustomizeProductID.productIndex,
            productAtrID: selectedProductId,
          };
          productStateDispatch({
            type: CHANGE_DISPLAY_PRODUCT,
            payload: changedisplayData,
          });
        }
      });
      if (newSaveItem && changedisplayData) {
        debugger;
        handleOk(newSaveItem);
      }
    }
  };
  return (
    <div className={`selected-customisation active`}>
      <div className="slected-area-top">
        <div className="title">
          <div className="title-text">Choose Product</div>
        </div>
        <div className="products">
          {customizeProduct.map((eachAttr, index) => {
            return (
              <CustomProductCard
                edit={false}
                active={index === parseInt(selectedProductId) ? true : false}
                id={index}
                key={index}
                img={eachAttr.attribute_Image}
                name={eachAttr.attribute_value.map((eachValue, index) => (
                  <span key={index}>{`${eachValue}  `}</span>
                ))}
                handleOnClick={onClickProduct}
              ></CustomProductCard>
            );
          })}
        </div>

        <div className="colors">
          <div className="title-text">Choose color:</div>
          <div className="color-values">
            {selectedItem.product_color_image.map((eachColorObj, index) => (
              <div
                className={
                  eachColorObj.product_image === selectedItem.attribute_Image
                    ? "each-color active"
                    : "each-color"
                }
                key={index}
              >
                <div className="inner-container">
                  {eachColorObj.color_image && (
                    <img
                      src={eachColorObj.color_image}
                      style={{ borderRadius: "50%" }}
                      height={26}
                      width={26}
                      alt="imgcolor"
                      name={eachColorObj.color_image}
                      sku_id={eachColorObj.sku_id}
                      onClick={() => {
                        onChnageProduct(eachColorObj, index);
                      }}
                    />
                  )}

                  {eachColorObj.color_code && (
                    <div
                      className="color"
                      style={{
                        backgroundColor: eachColorObj.color_code,
                      }}
                      sku_id={eachColorObj.sku_id}
                      onClick={() => {
                        onChnageProduct(eachColorObj, index);
                      }}
                    ></div>
                  )}
                </div>
                <div className="color-name">{eachColorObj.color_name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-description">
          <div className="description-title">Product Description</div>
          <p className="description-text">
            {
              productState.displayProduct[coustomizeProductID.productIndex]
                .short_descript
            }
          </p>
        </div>
      </div>
      <div className="selected-area-bottom">
        <div className="product-name">
          <div className="name-text">
            <b>
              {
                productState.displayProduct[coustomizeProductID.productIndex]
                  .product_name
              }
            </b>
          </div>
          <div className="product-type">{selectedItem.attribute_value[0]}</div>
        </div>
        <div className="ok-button" onClick={handleClickOk}>
          <Button>
            <span>ok</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SelectedProductCustomisation;

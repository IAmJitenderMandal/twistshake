// import { PACKAGE_CUSTOMISATION_TOGGLE } from "../../context/action.types";
import {
  PACKAGE_SIDEBAR,
  SAVE_PRODUCT,
  SET_DISPLAY_PRODUCTS,
} from "../../context/action.types";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import "./package-customisation.styles.scss";
import Axios from "../../axios/axios";
import requests from "../../axios/requests";
import { Link } from "react-router-dom";

// context realted imports
import { ProductContext, AppContext } from "../../context/Context";
import {
  CUSTOMISATION_NESTED_SIDEBAR,
  SELCTED_CURRENT_PRODUCT_IN_CUSTOMISATION,
  PACKAGE_CUSTOMISATION_TOGGLE,
} from "../../context/action.types";

// react icons
import EditBadge from "../edit-badge/EditBadge.component";

// import SelectedProductOption from "../selectedProductOption/SelectedProductOption.component";
import SelectedProductOption from "../selectedProductOption/SelectedProductCustomisation";
import Button from "../button/Button.component";
import CustomProductCard from "../custom-product-card/CustomProductCard.component";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

export default function PackageCustomisation() {
  const { productState, productStateDispatch } = useContext(ProductContext);
  const { cartState, cartStateDispatch } = useContext(AppContext);
  const history = useHistory();
  const [data, setData] = useState(productState.displayProduct);
  const [coustomizeData, setCoustomizeData] = useState([]);
  const [addBasketButton, setAddBasketButton] = useState(false);
  const [coustomizeProductID, setCoustomizeProductID] = useState({
    productID: null,
    productIndex: null,
  });
  const [isProductAdded, onProductAdded] = useState(false);

  useEffect(() => {
    setData(productState.displayProduct);
    if (
      productState.savedProduct &&
      productState.savedProduct.length === productState.displayProduct.length
    ) {
      setAddBasketButton(true);
    } else {
      setAddBasketButton(false);
    }
  }, [productState.displayProduct, coustomizeData]);

  const getCart = () => {
    Axios.get(
      `${requests.getCart}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      // setCart(response.data.products);

      cartStateDispatch({
        type: "SET_PRODDECT",
        payload: response.data.products,
      });
    });
  };

  const handlechange = (e, index) => {
    let subProduct = productState.displayProduct[index];

    setCoustomizeProductID({ productID: subProduct.id, productIndex: index });
    let setDefaultCoustomizeProduct = subProduct;
    // subProduct.product_attribute.map((product,index)=>{
    //   setDefaultCoustomizeProduct.product_attribute[index].attribute_Image=product.product_color_image[0].product_image;
    // })
    setCoustomizeData(setDefaultCoustomizeProduct.product_attribute);
  };
  const handleCancel = () => {
    // setData(productState.product.products_in_package);
    // productStateDispatch({
    //   type: SET_DISPLAY_PRODUCTS,
    //   payload: productState.product.products_in_package,
    // });
    productStateDispatch({
      type: PACKAGE_SIDEBAR,
      payload: "",
    });
    // productStateDispatch({
    //   type: SAVE_PRODUCT,
    //   payload:[],
    // });
  };

  const handleSaveProduct = (saveProductData) => {
    setCoustomizeData([]);
    const saveProdectDataRedux = [];
    if (productState.savedProduct) {
      productState.savedProduct.map((eachItem) => {
        if (
          eachItem.productID !== saveProductData.productID ||
          eachItem.index !== saveProductData.index
        ) {
          // alert("enter")
          saveProdectDataRedux.push(eachItem);
        }
      });
      saveProdectDataRedux.push(saveProductData);
      productStateDispatch({
        type: SAVE_PRODUCT,
        payload: saveProdectDataRedux,
      });
    } else {
      productStateDispatch({
        type: SAVE_PRODUCT,
        payload: [saveProductData],
      });
    }
  };

  const handleBasketClick = () => {
    if (
      productState.savedProduct &&
      productState.savedProduct.length === productState.displayProduct.length
    ) {
      addToCart();
      return false;
    }
  };

  const addToCart = () => {
    const { product } = productState;
    const { productSku } = productState;
    const { savedProduct } = productState;
    let cart_package_item = [];
    for (let i = 0; i < savedProduct.length; i++) {
      let data = {
        sku_id: savedProduct[i].sku_id,
        package_content: `${savedProduct[i].productName}, ${savedProduct[i].attributecolor}, ${savedProduct[i].attributeName}`,
      };
      cart_package_item.push(data);
    }

    let data = {
      cart_item: {
        user_id: localStorage.getItem("ts-userid"),
        sku_id: product.sku_id,
        quantity: 1,
        product_type: "package",
        product_id: product.id,
        cart_package_item: cart_package_item,
      },
    };

    if (localStorage.getItem("ts-token")) {
      Axios.post(`${requests.addToCart}`, data, config).then((response) => {
        onProductAdded(true);
        getCart();
      });
    } else {
      data.cart_item.sku_id = product.sku_id;
      data.cart_item.product_thumbnail = product.product_thumbnail[0];
      data.cart_item.discount = product.discount;
      data.cart_item.price = product.price;
      data.cart_item.type = product.type;
      data.cart_item.product_name = product.product_name;
      data.cart_item.total_price = product.total_price;
      data.cart_item.cart_product = data.cart_item.cart_package_item;
      if (localStorage.getItem("ts-cart")) {
        var productExist = false;
        var cart = JSON.parse(localStorage.getItem("ts-cart"));
        for (let i = 0; i < cart.length; i++) {
          if (data.cart_item.sku_id === cart[i].sku_id) {
            productExist = true;
            cart[i].quantity = data.cart_item.quantity + cart[i].quantity;
          }
        }

        if (!productExist) {
          data.cart_item.cart_id = cart.length + 1;
          cart.push(data.cart_item);
        }

        cart = JSON.stringify(cart);
        localStorage.setItem("ts-cart", cart);
      } else {
        var cart = [];
        data.cart_item.cart_id = 1;
        cart.push(data.cart_item);
        cart = JSON.stringify(cart);
        localStorage.setItem("ts-cart", cart);
      }

      onProductAdded(true);
    }
  };

  return (
    data !== undefined && (
      <div className={`package-customization ${productState.packageSidebar}`}>
        {!coustomizeData.length && (
          <div className="inner-container">
            <Fragment>
              <div className="top-area">
                <div className="heading-top">
                  <div className="text">Customize the package</div>
                  <div className="number-of-products"></div>
                </div>
                {data !== undefined ? (
                  <div className="products">
                    {data.map((eachItem, index) => (
                      <CustomProductCard
                        edit={true}
                        savedProduct={productState.savedProduct}
                        key={index}
                        id={eachItem.id}
                        productIndex={index}
                        img={eachItem.product_thumbnail[0]}
                        name={eachItem.product_name}
                        handleOnClick={(e) => {
                          handlechange(e, index);
                        }}
                      ></CustomProductCard>
                    ))}
                    <div>{productState.saveProduct}</div>
                  </div>
                ) : null}
              </div>
              <div className="customization-bottom">
                <div className="cancel-btn" onClick={handleCancel}>
                  <Button>
                    <span>Cancel</span>
                  </Button>
                </div>

                {isProductAdded ? (
                  <Link to="/checkout" className="add-to-basket-btn">
                    <Button>Added, Go To Cart</Button>
                  </Link>
                ) : (
                  <div
                    className="add-to-basket-btn"
                    onClick={handleBasketClick}
                  >
                    <Button addBasketStatus={addBasketButton}>
                      <span>Add To Basket</span>
                    </Button>
                  </div>
                )}
              </div>
            </Fragment>
          </div>
        )}
        {coustomizeData.length > 0 && Array.isArray(coustomizeData) && (
          <SelectedProductOption
            customizeProduct={coustomizeData}
            handleOk={(saveProduct) => {
              handleSaveProduct(saveProduct);
            }}
            coustomizeProductID={coustomizeProductID}
          />
        )}
      </div>
    )
  );
}

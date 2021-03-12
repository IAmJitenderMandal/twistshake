import React, { useEffect, useState, useContext, useReducer } from "react";
import "./img-slider.styles.scss";

// slick slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

import { useParams, useLocation } from "react-router-dom";
import { productReducer } from "../../context/reducers/productReducer";

// imports related to context
import {
  SET_MAIN_PRODUCT_SLIDER,
  SET_PRODUCT_SKU,
} from "../../context/action.types";
import { ProductContext } from "../../context/Context";

export default function ImagesSlider() {
  const [images, setImages] = useState([]);

  const [colorName, setColorName] = useState(null);
  const { productStateDispatch } = useContext(ProductContext);

  // router hooks usage
  const { id } = useParams();
  const { pathname } = useLocation();

  var settings = {
    arrows: true,
    adaptiveHeight: true,

    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1124,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 4,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },

      {
        breakpoint: 370,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
    ],
  };

  function fetchSliderImages(id) {
    const request = Axios.get(`${requests.getProductSliderMain}${id}`).then(
      (response) => {
        productStateDispatch({
          type: SET_MAIN_PRODUCT_SLIDER,
          payload: response.data,
        });
      }
    );
  }

  useEffect(() => {
    async function fetchGalleryImages() {
      const request = await Axios.get(`${requests.getGalleryImages}${id}`).then(
        (response) => {
          setImages(response.data.product.product_color_image[0]);
        }
      );
    }
    fetchGalleryImages();
  }, [id]);

  const setSku = (id) => {
    productStateDispatch({
      type: SET_PRODUCT_SKU,
      payload: id,
    });
  };

  return (
    images.length && (
      <div className="images-slider">
        <div className="color-name">
          COLOUR: {colorName || images[0].color_name}
        </div>
        <div className="inner-container">
          {images.length && (
            <Slider {...settings}>
              {images.map((imgObj, index) => {
                return (
                  <div className="item" key={index}>
                    <img
                      onClick={(e) => {
                        setSku(imgObj.sku_id);
                        fetchSliderImages(imgObj.id);
                        setColorName(imgObj.color_name);
                      }}
                      height={100}
                      width={100}
                      src={imgObj.product_image}
                      alt="product-img"
                      id={imgObj.id}
                    />
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      </div>
    )
  );
}

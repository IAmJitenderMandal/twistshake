import React, { useReducer, useState, useEffect, useRef, useContext } from 'react';
import './product.styles.scss';
import { Link } from 'react-router-dom';

import ReactHtmlParser from 'react-html-parser';

// slick crowsel
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// axios
import Axios from '../../axios/axios';
import requests from '../../axios/requests';
import { useParams, useHistory } from 'react-router-dom';

// imports regarding context
// import { packageCustomisationReducer } from "../../context/reducers/packageCustomisationReducer";
import { ProductContext } from '../../context/Context';
import { PACKAGE_SIDEBAR, SET_PRODUCT, SET_DISPLAY_PRODUCTS } from '../../context/action.types';
import { productReducer } from '../../context/reducers/productReducer';
import { cartReducer } from '../../context/reducers/cartReducer';

// icon imports
import { FiTruck } from 'react-icons/fi';
import { AiOutlineSafety } from 'react-icons/ai';

// component imports
import Button from '../button/Button.component';
import RectangleBadge from '../rectangle-badge/RectangleBadge.component';
import RoundBadge from '../round-badge/RoundBadge.component';
import PackageCustomisation from '../package-customization/PackageCustomisation.component';
import Counter from '../counter/Counter.component';
import ProductSlider from '../product-slider/ProductSlider.component';
import ImagesSlider from '../imgs-slider/ImgsSlider.component';
import { AppContext } from '../../context/Context';

const config = {
	headers: {
		Authorization: `Bearer ${localStorage.getItem('ts-token')}`,
	},
};

export default function Product(props) {
	const [quantity, setQuantity] = useState(1);
	const [isProductAdded, onProductAdded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [productState, productStateDispatch] = useReducer(productReducer, {
		packageSidebar: '',
		isPackageCutomisationToggled: false,
		product: {},
		CustomisationNestedSidebar: '',
		galleryitems: [],
		currentlySelectedInCustomisation: {},
		customisedProduct: [],
		displayProduct: [],
		savedProduct: null,
	});
	const history = useHistory();

	const { cartState, cartStateDispatch } = useContext(AppContext);

	const [productQuantity, setProductQuantity] = useState(quantity);
	const [Cart, setCart] = useState([]);

	const getCart = () => {
		Axios.get(`${requests.getCart}/${localStorage.getItem('ts-userid')}`, config).then((response) => {
			setCart(response.data.products);

			cartStateDispatch({
				type: 'SET_PRODDECT',
				payload: response.data.products,
			});
		});
	};

	const onAddQuantity = (quantity) => {
		// setProductQuantity(quantity);
		setQuantity(quantity);
	};
	const onRemoveQuantity = (quantity) => {
		// setProductQuantity(quantity);
		setQuantity(quantity);
	};

	// extracting params using react router's hook useparams
	const { type, id } = useParams();

	// siderbar reference
	let sidebarRef = useRef();

	useEffect(() => {
		window.scrollTo(0, 0);

		getCart();

		let handler = (e) => {
			if (!sidebarRef.current.contains(e.target)) {
				productStateDispatch({
					type: PACKAGE_SIDEBAR,
					payload: '',
				});
			}
		};

		document.addEventListener('mousedown', handler);

		Axios.get(`${requests.getProduct}${type}/${id}`).then((response) => {
			productStateDispatch({
				type: SET_PRODUCT,
				payload: response.data.product,
			});
			productStateDispatch({
				type: SET_DISPLAY_PRODUCTS,
				payload: response.data.product.products_in_package,
			});
		});

		return () => {
			document.removeEventListener('mousedown', handler);
		};
	}, [id]);

	const addToCart = () => {
		setLoading(true);
		const { product } = productState;
		const { productSku } = productState;

		if (isProductAlreadyAddToCart(product.id)) {
			return false;
		}

		let data = {
			cart_item: {
				user_id: localStorage.getItem('ts-userid'),
				sku_id: productSku ? productSku : product.sku_id,
				quantity: quantity,
				product_type: 'single',
				product_id: product.id,
				cart_package_item: [],
			},
		};

		if (localStorage.getItem('ts-token')) {
			Axios.post(`${requests.addToCart}`, data, config).then((response) => {
				onProductAdded(true);
				setLoading(false);
				getCart();
			});
		} else {
			var product_color_image = product.product_color_image[0];
			for (let i = 0; i < product_color_image.length; i++) {
				if (data.cart_item.sku_id == product_color_image[i].sku_id) {
					data.cart_item.product_image = product_color_image[i].product_image;
				}
			}

			if (!data.cart_item.product_image) {
				data.cart_item.product_image = product_color_image[0].product_image;
			}

			data.cart_item.discount = product.discount;
			data.cart_item.price = product.price;
			data.cart_item.type = product.type;
			data.cart_item.product_name = product.product_name;
			data.cart_item.total_price = product.total_price;

			if (localStorage.getItem('ts-cart')) {
				var productExist = false;
				var cart = JSON.parse(localStorage.getItem('ts-cart'));
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
				localStorage.setItem('ts-cart', cart);
			} else {
				var cart = [];
				data.cart_item.cart_id = 1;
				cart.push(data.cart_item);
				cart = JSON.stringify(cart);
				localStorage.setItem('ts-cart', cart);
			}

			onProductAdded(true);
			setLoading(false);
		}
	};

	const isProductAlreadyAddToCart = (productId) => {
		for (let i = 0; i < Cart.length; i++) {
			if (productId === Cart[i].product_id) {
				updateQuantity(Cart[i].cart_id, Cart[i].quantity + quantity);
				return true;
			}
		}
	};

	const updateQuantity = (cartIndex, updateQuantity) => {
		setLoading(true);
		const data = {
			quantity: updateQuantity,
		};

		Axios.put(`${requests.getCart}/${cartIndex}`, data, config).then((response) => {
			setLoading(false);
			onProductAdded(true);
			getCart();
		});
	};

	const settings = {
		adaptiveHeight: true,
		infinite: true,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 1,
		arrows: true,
		responsive: [
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 1,
				},
			},
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	const { product } = productState;
	const { galleryitems } = productState;
	const { displayProduct } = productState;

	return (
		<ProductContext.Provider
			value={{
				productState,
				productStateDispatch,
				cartState,
				cartStateDispatch,
			}}
		>
			{Object.keys(product).length !== 0 ? (
				<div className="product">
					<div className={`overlay ${productState.packageSidebar}`}></div>
					<div className="container">
						{/* customisation sidebar  */}
						<div className="customisation-sidebar" ref={sidebarRef}>
							<PackageCustomisation />
						</div>

						<div className={`overlay`}></div>
						{/* customisation sidebar ends  */}

						<div className="top">
							<div className="product-imgs-container">
								<div className="images">
									<Slider {...settings}>
										{galleryitems.map((img, index) => (
											<div className="eachslide" key={index}>
												<img src={`${img}`} alt="img" />
											</div>
										))}
									</Slider>
								</div>
								<div className="badges">
									<RoundBadge>{product.discount}</RoundBadge>
									{product.shipping === 'free' ? (
										<RectangleBadge>Free Shipping</RectangleBadge>
									) : null}
								</div>
							</div>
							<div className="product-details-container">
								<div className="product-title">
									<div className="product-name">{product.product_name}</div>
									<div className="stock">
										{' '}
										<span className="signal-success"></span> In stock
									</div>
								</div>
								<div className="extra-customization">0 mth+/Mixed colors</div>
								<div className="price">
									<div className="previous">{product.price}</div>
									<div className="latest">{product.total_price}</div>
								</div>
								<div className="product-description">{product.short_descript}</div>
								<div className="imgslider">{product.type === 'single' ? <ImagesSlider /> : null}</div>
								<div className="buttons">
									{product.type === 'single' ? (
										<Counter
											updateQuantity={setQuantity}
											quantity={quantity}
											onAddQuantity={onAddQuantity}
											onRemoveQuantity={onRemoveQuantity}
										/>
									) : null}

									{product.type !== 'single' ? (
										<div
											className="cutomize-btn"
											onClick={() => {
												productStateDispatch({
													type: PACKAGE_SIDEBAR,
													payload: 'active',
												});
											}}
										>
											<Button>Customize Package</Button>
										</div>
									) : isProductAdded ? (
										<Link to="/checkout" className="cutomize-btn">
											<Button>Added, Go To Cart</Button>
										</Link>
									) : loading ? (
										<div className="cutomize-btn">
											<Button>Loading...</Button>
										</div>
									) : (
										<div className="cutomize-btn" onClick={addToCart}>
											<Button>Add To Cart</Button>
										</div>
									)}
								</div>
								<div className="extra-details">
									<div className="safe-payment">
										<span className="icon">
											<AiOutlineSafety />
										</span>
										<span className="text">Safe payment</span>
									</div>
									<div className="fast-delivery">
										<span className="icon">
											<FiTruck />
										</span>
										<span className="text">Fast deliveries around the world</span>
									</div>
								</div>
							</div>
						</div>

						<div className="mid-slider">
							{product.type === 'single' ? <ProductSlider data={product.feature_image} /> : null}
						</div>
						<div className="bottom">
							<div className="description">
								<div className="left">
									<h4 className="product-desc-title">Product Description</h4>
									<div className="description-text">{ReactHtmlParser(product.long_descript)}</div>
								</div>
								<div className="right">
									<h4 className="product-desc-title">Features</h4>
									<div className="description-text">{ReactHtmlParser(product.product_feature)}</div>
								</div>
							</div>

							<div className="add-to-basket">
								<div className="img">
									<img
										src={
											Array.isArray(product.product_thumbnail)
												? product.product_thumbnail[0]
												: product.product_thumbnail
										}
										alt=""
									/>
								</div>
								<div className="product-details">
									<div className="product-title">
										<div className="product-name">{product.product_name}</div>
									</div>
									<div className="extra-customization">0 mth+/Mixed colors</div>
									<div className="price">
										<div className="previous">{product.price}</div>
										<div className="latest">{product.total_price} </div>
									</div>
									<div className="add-to-basket-btn">
										{product.type !== 'single' ? (
											localStorage.getItem('ts-token') ? (
												<div
													className="cutomize-btn"
													onClick={() => {
														productStateDispatch({
															type: PACKAGE_SIDEBAR,
															payload: 'active',
														});
													}}
												>
													<Button>Customize Package</Button>
												</div>
											) : (
												<div className="cutomize-btn" onClick={addToCart}>
													<Button>Customize Package</Button>
												</div>
											)
										) : isProductAdded ? (
											<Link to="/checkout" className="cutomize-btn">
												<Button>Added, Go To Cart</Button>
											</Link>
										) : loading ? (
											<div className="cutomize-btn">
												<Button>Loading...</Button>
											</div>
										) : (
											<div className="cutomize-btn" onClick={addToCart}>
												<Button>Add To Cart</Button>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="loading"></div>
			)}
		</ProductContext.Provider>
	);
}

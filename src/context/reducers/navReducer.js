import {
  CART_SIDEBAR,
  SEARCH_SHOW,
  SET_MOBILE_SEARCH,
  SET_MOBILE_MENU,
  DISABLE_MOBILE_MENU,
} from "../action.types";

export const navReducer = (state, action) => {
  if (action.type === "CART_SIDEBAR") {
    if (action.payload === "active") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  if (action.type == "SET_MOBILE_MENU") {
    if (action.payload == "active") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  switch (action.type) {
    case CART_SIDEBAR:
      return {
        ...state,
        isCartSideBarActive:
          state.isCartSideBarActive === "" ? action.payload : "",
      };

    case SEARCH_SHOW:
      return {
        ...state,
        isSearchActive: state.isSearchActive === "" ? action.payload : "",
      };

    case SET_MOBILE_SEARCH:
      return {
        ...state,
        searchSideBarMobile:
          state.searchSideBarMobile === "" ? action.payload : "",
        menuSidebarMobile: "",
      };

    case SET_MOBILE_MENU:
      return {
        ...state,
        menuSidebarMobile: state.menuSidebarMobile === "" ? action.payload : "",
        searchSideBarMobile: "",
      };

    case DISABLE_MOBILE_MENU:
      return {
        ...state,
        menuSidebarMobile: action.payload,
        searchSideBarMobile: action.payload,
      };

    default:
      return state;
  }
};

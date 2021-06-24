import {
  LOAD_ITEMS_SUCCESS,
  LOAD_ITEMS_FAIL,
  LOAD_ITEM_SUCCESS,
  LOAD_ITEM_FAIL,
  LOAD_USER_DETAIL_FAIL,
  LOAD_USER_DETAIL_SUCCESS,
  LOAD_ADDRESS_SUCCESS,
  LOAD_ADDRESS_FAIL,
  LOAD_CART_SUCCESS,
  LOAD_CART_FAIL,
  LOGOUT,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAIL,
  REMOVE_ONE_FROM_CART_SUCCESS,
  REMOVE_ONE_FROM_CART_FAIL,
} from "../actions/types";
const initialState = {
  items: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_ITEMS_SUCCESS:
      return {
        ...state,
        items: payload,
      };
    case LOAD_ITEM_SUCCESS:
      return {
        ...state,
        item: payload.item,
        images: payload.images,
      };
    case LOAD_USER_DETAIL_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case LOAD_ADDRESS_SUCCESS:
      return {
        ...state,
        address: payload,
      };
    case LOAD_CART_SUCCESS:
      return {
        ...state,
        cart: payload,
      };
    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        cart: payload,
      };
    case REMOVE_ONE_FROM_CART_SUCCESS:
      return {
        ...state,
        cart: payload,
      };
    case REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        cart: payload,
      };
    case LOGOUT:
      localStorage.removeItem("id");
      return {
        ...state,
        cart: null,
        user: null,
        address: null,
      };
    case REMOVE_ONE_FROM_CART_FAIL:
    case REMOVE_FROM_CART_FAIL:
    case ADD_TO_CART_FAIL:
    case LOAD_CART_FAIL:
    case LOAD_ADDRESS_FAIL:
    case LOAD_USER_DETAIL_FAIL:
    case LOAD_ITEMS_FAIL:
    case LOAD_ITEM_FAIL:
    default:
      return state;
  }
}

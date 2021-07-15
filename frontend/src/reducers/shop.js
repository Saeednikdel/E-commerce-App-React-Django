import {
  LOAD_ITEMS_SUCCESS,
  LOAD_ITEMS_FAIL,
  LOAD_ITEM_SUCCESS,
  LOAD_ITEM_FAIL,
  LOAD_CART_SUCCESS,
  LOAD_CART_FAIL,
  LOGOUT,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAIL,
  REMOVE_ONE_FROM_CART_SUCCESS,
  REMOVE_ONE_FROM_CART_FAIL,
  BOOKMARK_SUCCESS,
  BOOKMARK_FAIL,
  LOAD_COMMENTS_SUCCESS,
  LOAD_COMMENTS_FAIL,

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
    case LOAD_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: payload,
      };

    case LOAD_CART_SUCCESS:
      return {
        ...state,
        order: payload.order,
        cart: payload.items,
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
    case BOOKMARK_SUCCESS:
    case BOOKMARK_FAIL:
    case REMOVE_ONE_FROM_CART_FAIL:
    case REMOVE_FROM_CART_FAIL:
    case ADD_TO_CART_FAIL:
    case LOAD_CART_FAIL:
    case LOAD_ITEMS_FAIL:
    case LOAD_ITEM_FAIL:
    default:
      return state;
  }
}

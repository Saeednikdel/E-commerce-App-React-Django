import axios from "axios";
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
  LOAD_MENU_SUCCESS,
  LOAD_MENU_FAIL,
  LOAD_BRAND_SUCCESS,
  LOAD_BRAND_FAIL,
  LOAD_ORDER_SUCCESS,
  LOAD_ORDER_FAIL,
} from "../actions/types";
import { load_bookmark } from "./auth";
export const load_items =
  (page, keyword, category, subcategory, sort, brand) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const body = JSON.stringify({
      keyword,
      category,
      subcategory,
      sort,
      brand,
    });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/items-list/${page}/`,
        body,
        config
      );

      dispatch({
        type: LOAD_ITEMS_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LOAD_ITEMS_FAIL,
      });
    }
  };
export const load_comments =
  (item, page = 1) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comment-list/${item}/${page}/`,
        config
      );

      dispatch({
        type: LOAD_COMMENTS_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LOAD_COMMENTS_FAIL,
      });
    }
  };

export const load_item = (itemId) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const user = localStorage.getItem("id") ? localStorage.getItem("id") : false;
  const body = JSON.stringify({ user });
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/item-detail/${itemId}/`,
      body,
      config
    );

    dispatch({
      type: LOAD_ITEM_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOAD_ITEM_FAIL,
    });
  }
};

export const load_cart = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    const userId = localStorage.getItem("id");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart-detail/${userId}/`,
        config
      );

      dispatch({
        type: LOAD_CART_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LOAD_CART_FAIL,
      });
    }
  } else {
    dispatch({
      type: LOAD_CART_FAIL,
    });
  }
};

export const load_order_list = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    const userId = localStorage.getItem("id");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/order-detail/${userId}/`,
        config
      );

      dispatch({
        type: LOAD_ORDER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LOAD_ORDER_FAIL,
      });
    }
  } else {
    dispatch({
      type: LOAD_CART_FAIL,
    });
  }
};

export const add_to_cart =
  (itemId, color = false) =>
  async (dispatch) => {
    if (localStorage.getItem("access")) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };
      const user = localStorage.getItem("id");
      const body = JSON.stringify({ user, color });

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart-add/${itemId}/`,
          body,
          config
        );

        dispatch({
          type: ADD_TO_CART_SUCCESS,
          payload: res.data,
        });
      } catch (err) {
        dispatch({
          type: ADD_TO_CART_FAIL,
        });
      }
    } else {
      dispatch({
        type: ADD_TO_CART_FAIL,
      });
    }
  };

export const remove_from_cart = (itemId) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    const user = localStorage.getItem("id");
    const body = JSON.stringify({ user });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart-remove/${itemId}/`,
        body,
        config
      );

      dispatch({
        type: REMOVE_FROM_CART_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: REMOVE_FROM_CART_FAIL,
      });
    }
  } else {
    dispatch({
      type: REMOVE_FROM_CART_FAIL,
    });
  }
};
export const remove_one_from_cart = (itemId, color) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    const user = localStorage.getItem("id");
    const body = JSON.stringify({ user, color });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart-remove-one/${itemId}/`,
        body,
        config
      );

      dispatch({
        type: REMOVE_ONE_FROM_CART_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: REMOVE_ONE_FROM_CART_FAIL,
      });
    }
  } else {
    dispatch({
      type: REMOVE_ONE_FROM_CART_FAIL,
    });
  }
};
export const bookmark = (id, page) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    const user = localStorage.getItem("id");
    const body = JSON.stringify({ user, id });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookmark/`,
        body,
        config
      );
      dispatch({
        type: BOOKMARK_SUCCESS,
        payload: res.data,
      });
      if (page) {
        dispatch(load_bookmark(page));
      } else {
        dispatch(load_item(id));
      }
    } catch (err) {
      dispatch({
        type: BOOKMARK_FAIL,
      });
    }
  } else {
    dispatch({
      type: BOOKMARK_FAIL,
    });
  }
};
export const logout2 = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const load_menu = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/menu-list/`,
      config
    );
    dispatch({
      type: LOAD_MENU_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOAD_MENU_FAIL,
    });
  }
};

export const load_brand = (category, subcategory) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const body = JSON.stringify({
    category,
    subcategory,
  });
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/brand-list/`,
      body,
      config
    );

    dispatch({
      type: LOAD_BRAND_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOAD_BRAND_FAIL,
    });
  }
};

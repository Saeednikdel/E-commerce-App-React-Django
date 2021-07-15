import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  SET_EMAIL_SUCCESS,
  SET_EMAIL_FAIL,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_FAIL,
  LOGOUT,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_FAIL,
  AUTHENTICATED_SUCCESS,
  RESET_STATE,
  LOAD_USER_DETAIL_FAIL,
  LOAD_USER_DETAIL_SUCCESS,
  SET_USER_DETAIL_FAIL,
  SET_USER_DETAIL_SUCCESS,
  LOAD_ADDRESS_SUCCESS,
  LOAD_ADDRESS_FAIL,
  LOAD_BOOKMARK_FAIL,
  LOAD_BOOKMARK_SUCCESS,
  SET_ADDRESS_SUCCESS,
  SET_ADDRESS_FAIL,
  REMOVE_ADDRESS_SUCCESS,
  REMOVE_ADDRESS_FAIL,
  SET_COMMENTS_FAIL,
  SET_COMMENTS_SUCCESS,
} from "../actions/types";

const initialState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: null,
  user: {
    id: null,
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("access", payload.access);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
      };
    case USER_LOADED_SUCCESS:
      localStorage.setItem("id", payload.id);
      return {
        ...state,
        user: payload,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        requestSuccess: true,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    case RESET_PASSWORD_CONFIRM_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    case ACTIVATION_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    case SET_EMAIL_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    case SET_PASSWORD_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    //new
    case LOAD_USER_DETAIL_SUCCESS:
      return {
        ...state,
        userdetail: payload,
      };
    case SET_USER_DETAIL_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    case SET_USER_DETAIL_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case LOAD_ADDRESS_SUCCESS:
      return {
        ...state,
        address: payload,
      };
    case LOAD_BOOKMARK_SUCCESS:
      return {
        ...state,
        bookmarks: payload,
      };
    case SET_COMMENTS_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    case SET_COMMENTS_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    //
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case RESET_PASSWORD_CONFIRM_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case ACTIVATION_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case SET_EMAIL_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case SET_PASSWORD_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case SET_ADDRESS_SUCCESS:
      return {
        ...state,
        requestSuccess: true,
      };
    case SET_ADDRESS_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    //
    case AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        requestFail: true,
      };
    case LOGOUT:
      localStorage.removeItem("access");
      localStorage.removeItem("id");
      localStorage.removeItem("refresh");
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    case RESET_STATE:
      return {
        ...state,
        requestSuccess: null,
        requestFail: null,
      };
    case REMOVE_ADDRESS_SUCCESS:
    case REMOVE_ADDRESS_FAIL:
    default:
      return state;
  }
}

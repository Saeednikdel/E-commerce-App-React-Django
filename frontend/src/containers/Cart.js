import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
  IconButton, CircularProgress,
} from "@material-ui/core";
import {
  Remove,
  DeleteOutline,
  Add,
  Visibility,
  OpenInBrowser,
} from "@material-ui/icons";
import {
  load_cart,
  add_to_cart,
  remove_one_from_cart,
  remove_from_cart,
} from "../actions/shop";
import Redirect from "react-router-dom/es/Redirect";
import { connect } from "react-redux";

const Cart = ({
  load_cart,
  add_to_cart,
  remove_one_from_cart,
  remove_from_cart,
  isAuthenticated,
  cart,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_cart(localStorage.getItem("id"));
      } catch (err) {}
    };
    if (localStorage.getItem("id")) {
      fetchData();
    }
  }, []);
  if (isAuthenticated === false) return <Redirect to="/login" />;

  const AddToCartHandle = (id) => {
    add_to_cart(id);
  };
  const RemoveFromCartHandle = (id) => {
    remove_from_cart(id);
  };
  const RemoveOneFromCartHandle = (id) => {
    remove_one_from_cart(id);
  };
  return cart ? (
    <div>
      <TableContainer>
        <Table aria-label="cart">
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton disableRipple={true}>
                  <Visibility />
                </IconButton>
              </TableCell>
              <TableCell>کالا</TableCell>
              <TableCell>قیمت</TableCell>
              <TableCell>تعداد</TableCell>
              <TableCell></TableCell>
              <TableCell>قیمت کل</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((cartitem) => (
              <TableRow key={"address.id"}>
                <TableCell>
                  <IconButton
                    href={`/detail/${cartitem.item}`}
                    color="secondary"
                  >
                    <OpenInBrowser />
                  </IconButton>
                </TableCell>
                <TableCell>{cartitem.item_title}</TableCell>
                <TableCell>{cartitem.item_price.toLocaleString()}</TableCell>
                <TableCell>{cartitem.quantity}</TableCell>
                <TableCell>
                  <ButtonGroup size="small" color="secondary">
                    <Button
                      onClick={() => RemoveOneFromCartHandle(cartitem.item)}
                    >
                      <Remove />
                    </Button>
                    <Button onClick={() => RemoveFromCartHandle(cartitem.item)}>
                      <DeleteOutline />
                    </Button>
                    <Button onClick={() => AddToCartHandle(cartitem.item)}>
                      <Add />
                    </Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell>
                  {(cartitem.item_price * cartitem.quantity).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                {cart.reduce((n, { quantity }) => n + quantity, 0)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                {cart
                  .reduce(
                    (n, { quantity, item_price }) => n + quantity * item_price,
                    0
                  )
                  .toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : (
        <CircularProgress color="secondary"/>

  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  cart: state.shop.cart,
});
export default connect(mapStateToProps, {
  load_cart,
  add_to_cart,
  remove_one_from_cart,
  remove_from_cart,
})(Cart);

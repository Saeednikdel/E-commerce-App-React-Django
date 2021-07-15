import React, { useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  makeStyles,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Remove, DeleteOutline, Add } from "@material-ui/icons";
import {
  load_cart,
  add_to_cart,
  remove_one_from_cart,
  remove_from_cart,
} from "../actions/shop";
import Redirect from "react-router-dom/es/Redirect";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: `${theme.spacing(2)}px`,
  },
  cartTotal: {
    marginTop: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(2)}px`,
  },
}));

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
  const classes = useStyles();

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
      <Grid container className={classes.pageContainer} spacing={2}>
        {cart.map((cartitem) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card variant="outlined">
              <CardActionArea href={`/detail/${cartitem.item}`}>
                <CardMedia
                  component="img"
                  height="150"
                  image={cartitem.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {cartitem.item_title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    قیمت واحد : {cartitem.item_price.toLocaleString()} تومان
                  </Typography>
                  <Typography>
                    قیمت :
                    {(cartitem.item_price * cartitem.quantity).toLocaleString()}
                    تومان
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <ButtonGroup size="small" color="secondary">
                  <Button
                    onClick={() => RemoveOneFromCartHandle(cartitem.item)}
                  >
                    {cartitem.quantity > 1 ? <Remove /> : <DeleteOutline />}
                  </Button>
                  <Button>{cartitem.quantity}</Button>
                  <Button onClick={() => AddToCartHandle(cartitem.item)}>
                    <Add />
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card className={classes.cartTotal} variant="outlined">
        <Typography variant="h5">
          تعداد کل :{cart.reduce((n, { quantity }) => n + quantity, 0)}
        </Typography>
        <Typography variant="h5">
          قیمت کل سبد :
          {cart
            .reduce(
              (n, { quantity, item_price }) => n + quantity * item_price,
              0
            )
            .toLocaleString()}
        </Typography>
      </Card>
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  cart: state.shop.cart,
  order: state.shop.order,
});
export default connect(mapStateToProps, {
  load_cart,
  add_to_cart,
  remove_one_from_cart,
  remove_from_cart,
})(Cart);

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
import placeholderImage from "../placeholder-image.png";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: `${theme.spacing(2)}px`,
  },
  cartTotal: {
    marginTop: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(2)}px`,
  },
  divColor: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textColor: { display: "inline-block", marginLeft: 5 },
}));

const Cart = ({
  load_cart,
  add_to_cart,
  remove_one_from_cart,
  remove_from_cart,
  isAuthenticated,
  order,
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

  const AddToCartHandle = (id, color) => {
    add_to_cart(id, color);
  };
  const RemoveFromCartHandle = (id) => {
    remove_from_cart(id);
  };
  const RemoveOneFromCartHandle = (id, color) => {
    remove_one_from_cart(id, color);
  };
  return order ? (
    order.map(
      (o) =>
        o.cart_items.length > 0 && (
          <div>
            <Grid container className={classes.pageContainer} spacing={2}>
              {o.cart_items.map((cartitem) => (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card variant="outlined" style={{ maxWidth: 300 }}>
                    <CardActionArea href={`/detail/${cartitem.item}`}>
                      <CardMedia
                        component="img"
                        height="170"
                        image={cartitem.image}
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                      <CardContent style={{ height: 170 }}>
                        <Typography gutterBottom variant="h6">
                          {cartitem.item_title}
                        </Typography>
                        <Typography
                          gutterBottom
                          color="textSecondary"
                          variant="body2"
                        >
                          فروشنده :{cartitem.item_user}
                        </Typography>
                        <Typography gutterBottom>
                          {cartitem.item_discount && cartitem.item_discount > 0
                            ? cartitem.item_discount.toLocaleString()
                            : cartitem.item_price.toLocaleString()}{" "}
                          تومان
                        </Typography>
                        <Typography>
                          قیمت :{cartitem.final_price.toLocaleString()} تومان
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <ButtonGroup size="small" color="secondary">
                        <Button
                          onClick={() =>
                            RemoveOneFromCartHandle(
                              cartitem.item,
                              cartitem.color
                            )
                          }
                        >
                          {cartitem.quantity > 1 ? (
                            <Remove />
                          ) : (
                            <DeleteOutline />
                          )}
                        </Button>
                        <Button>{cartitem.quantity}</Button>
                        <Button
                          onClick={() =>
                            AddToCartHandle(cartitem.item, cartitem.color)
                          }
                        >
                          <Add />
                        </Button>
                      </ButtonGroup>
                      {cartitem.color_title && (
                        <div className={classes.divColor}>
                          <div
                            style={{
                              backgroundColor: cartitem.color_hex,
                              border: "2px solid rgba(0, 0, 0, 0.22)",
                              borderRadius: "50%",
                              display: "inline-block",
                              width: 22,
                              height: 22,
                            }}
                          ></div>
                          <Typography className={classes.textColor}>
                            {cartitem.color_title}
                          </Typography>
                        </div>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Card className={classes.cartTotal} variant="outlined">
              <Typography variant="h5">
                تعداد کل :{" "}
                {o.cart_items.reduce((n, { quantity }) => n + quantity, 0)}
              </Typography>
              <Typography variant="h5">
                قیمت کل سبد : {o.total.toLocaleString()}
              </Typography>
            </Card>
          </div>
        )
    )
  ) : (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h6">سبد خرید خالی است.</Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  order: state.shop.order,
});
export default connect(mapStateToProps, {
  load_cart,
  add_to_cart,
  remove_one_from_cart,
  remove_from_cart,
})(Cart);

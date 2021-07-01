import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Grid,
  makeStyles,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { AddShoppingCart, BookmarkBorder, Bookmark } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import Notification from "../components/Notification";
import DialogAlert from "../components/DialogAlert";

import { connect } from "react-redux";
import { load_item, add_to_cart } from "../actions/shop";
import AppCarousel from "../components/AppCarousel";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(2)}px`,
  },
  paper: {
    height: 250,
  },
  summery: {
    margin: `${theme.spacing(2)}px`,
  },
}));
const DetailPage = ({
  item,
  images,
  add_to_cart,
  load_item,
  match,
  isAuthenticated,
  bookmarks,
}) => {
  const classes = useStyles();
  const itemId = match.params.itemId;
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    actionUrl: "",
    actionText: "",
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_item(itemId);
      } catch (err) {}
    };

    fetchData();
  }, []);

  const AddToCartHandle = (id) => {
    if (isAuthenticated === true) {
      add_to_cart(id);
      setNotify({
        isOpen: true,
        message: "به سبد افزوده شد.",
        type: "success",
      });
    } else {
      setAlert({
        isOpen: true,
        title: "!",
        message: "لطفا وارد شوید یا ثبت نام کنید.",
        actionUrl: "/login",
        actionText: "ورود",
      });
    }
  };
  const BookmarkHandle = (id) => {
    if (isAuthenticated === true) {
      // add_to_cart(id);
    } else {
      setAlert({
        isOpen: true,
        title: "!",
        message: "لطفا وارد شوید یا ثبت نام کنید.",
        actionUrl: "/login",
        actionText: "ورود",
      });
    }
  };
  const BookmarkCheck = () => {
    const array = bookmarks.filter((bookmark) => bookmark.item == item.id);
    return array.length === 1 ? (
      <Bookmark style={{ fontSize: 35 }} />
    ) : (
      <BookmarkBorder style={{ fontSize: 35 }} />
    );
  };
  return item ? (
    <>
      <Card className={classes.pageContainer}>
        <Grid container>
          <Grid sm={5}>
            <AppCarousel images={images} />
          </Grid>
          <Grid sm={7}>
            <div className={classes.summery}>
              <IconButton color="secondary">
                {bookmarks ? (
                  <BookmarkCheck />
                ) : (
                  <BookmarkBorder style={{ fontSize: 35 }} />
                )}
              </IconButton>

              <Typography variant="h4" style={{ marginTop: "20px" }}>
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginTop: "20px" }}
              >
                {item.discount_price}
              </Typography>
              <Rating
                style={{ marginTop: "20px" }}
                name="read-only"
                value={4}
                readOnly
              />
              <Typography>فروشنده :{item.user_name}</Typography>
              <Typography variant="h5" style={{ marginTop: "20px" }}>
                قیمت : {item.price}
              </Typography>

              <Button
                onClick={() => AddToCartHandle(item.id)}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AddShoppingCart style={{ marginLeft: "10px" }} />}
                style={{ marginTop: "20px" }}
              >
                افزودن به سبد خرید
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>
      <Card className={classes.pageContainer}>
        <Typography variant="h5">نقد و بررسی اجمالی</Typography>
        <Typography variant="body1">{item.description_short}</Typography>
        <Typography variant="body1">{item.description_long}</Typography>
      </Card>
      <Notification notify={notify} setNotify={setNotify} />
      <DialogAlert alert={alert} setAlert={setAlert} />
    </>
  ) : (
    <CircularProgress color="secondary" />
  );
};
const mapStateToProps = (state) => ({
  item: state.shop.item,
  images: state.shop.images,
  bookmarks: state.shop.bookmarks,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { load_item, add_to_cart })(DetailPage);

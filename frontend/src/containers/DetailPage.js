import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Grid,
  makeStyles,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import { AddShoppingCart, BookmarkBorder, Bookmark } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import Notification from "../components/Notification";
import DialogAlert from "../components/DialogAlert";
import SetComment from "../containers/SetComment";
import Popup from "../components/Popup";
import { connect } from "react-redux";
import { load_item, add_to_cart, bookmark } from "../actions/shop";
import AppCarousel from "../components/AppCarousel";
import jMoment from "moment-jalaali";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(2)}px`,
  },
  commentContainer: {
    marginTop: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(2)}px`,
    minHeight: 250,
  },
  commentCard: {
    marginTop: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(2)}px`,
    minHeight: 150,
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
  bookmarkList,
  bookmark,
  comments,
}) => {
  const classes = useStyles();
  const itemId = match.params.itemId;
  const [openPopup, setOpenPopup] = useState(false);
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
  const AddCommentHandle = () => {
    if (isAuthenticated === true) {
      setOpenPopup(true);
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
      bookmark(id);
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
    const array = bookmarkList.filter(
      (bookmarkitem) => bookmarkitem.item == item.id
    );
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
              <IconButton
                color="secondary"
                onClick={() => BookmarkHandle(item.id)}
              >
                {bookmarkList ? (
                  <BookmarkCheck />
                ) : (
                  <BookmarkBorder style={{ fontSize: 35 }} />
                )}
              </IconButton>

              <Typography variant="h4" gutterBottom>
                {item.title}
              </Typography>
              <Typography color="error" variant="body1" gutterBottom>
                {item.discount_price} % تخفیف
              </Typography>
              <Rating
                gutterBottom
                name="read-only"
                value={item.star}
                readOnly
              />
              <Typography>فروشنده :{item.user_name}</Typography>
              <Typography variant="h5" gutterBottom>
                قیمت : {item.price}
              </Typography>

              <Button
                onClick={() => AddToCartHandle(item.id)}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AddShoppingCart style={{ marginLeft: "10px" }} />}
                gutterBottom
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
      <Card className={classes.commentContainer}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => AddCommentHandle()}
        >
          ثبت نظر
        </Button>
        {comments && comments[1].length > 0
          ? comments[1].map((comment) => (
              <Card variant="outlined" className={classes.commentCard}>
                <Typography color="textSecondary" variant="subtitle2">
                  {jMoment(comment.date, "YYYY/M/D").format("jYYYY/jM/jD")}
                </Typography>
                <Typography variant="subtitle2">{comment.user_name}</Typography>
                <Typography variant="body1">{comment.title}</Typography>
                <Rating name="read-only" value={comment.star} readOnly />
                <Typography variant="body1">{comment.description}</Typography>
              </Card>
            ))
          : ""}
      </Card>
      <Notification notify={notify} setNotify={setNotify} />
      <DialogAlert alert={alert} setAlert={setAlert} />
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <SetComment id={item.id} setOpenPopup={setOpenPopup} />
      </Popup>
    </>
  ) : (
    <LinearProgress color="secondary" />
  );
};

const mapStateToProps = (state) => ({
  item: state.shop.item,
  images: state.shop.images,
  comments: state.shop.comments,
  bookmarkList: state.auth.bookmarks,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { load_item, add_to_cart, bookmark })(
  DetailPage
);

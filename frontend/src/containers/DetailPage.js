import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Grid,
  makeStyles,
  IconButton,
  LinearProgress,
  CircularProgress,
  Collapse,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
} from "@material-ui/core";
import {
  AddShoppingCart,
  BookmarkBorder,
  Bookmark,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";
import { Rating, Pagination } from "@material-ui/lab";
import Notification from "../components/Notification";
import DialogAlert from "../components/DialogAlert";
import SetComment from "../containers/SetComment";
import Popup from "../components/Popup";
import { connect } from "react-redux";
import {
  load_item,
  add_to_cart,
  bookmark,
  load_comments,
} from "../actions/shop";
import AppCarousel from "../components/AppCarousel";
import jMoment from "moment-jalaali";
import Redirect from "react-router-dom/es/Redirect";

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
  collapseTitle: { flex: 1 },
  paginatorDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  emptyDiv: {
    textAlign: "center",
    height: 600,
  },
  carousel: { height: 400 },
  off: {
    backgroundColor: "#f44336",
    borderRadius: 15,
    color: "#fff",
    paddingRight: 8,
    paddingLeft: 8,
    display: "inline-block",
    margin: 10,
  },
  discountPrice: {
    display: "inline-block",
  },
}));
const DetailPage = ({
  item,
  add_to_cart,
  load_item,
  match,
  isAuthenticated,
  bookmark,
  comments,
  load_comments,
  order,
}) => {
  const [openSelect, setOpenSelect] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);
  const [addToCart, setAddToCart] = React.useState(false);
  const [color, setColor] = useState("");
  const [page, setPage] = useState(1);
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
    load_item(itemId);
    load_comments(itemId, 1);
    window.scrollTo(0, 0);
    if (addToCart) {
      setAddedToCart(true);
    }
  }, [order]);
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
      if (item.colors.length > 0) {
        if (color !== "") {
          add_to_cart(id, color);
          setAddToCart(true);
        } else {
          setAlert({
            isOpen: true,
            title: "!",
            message: "لطفا رنگ را انتخاب کنید.",
          });
        }
      } else {
        add_to_cart(id, false);
        setAddToCart(true);
      }
      // setNotify({
      //   isOpen: true,
      //   message: "به سبد افزوده شد.",
      //   type: "success",
      // });
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
      bookmark(id, false);
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
  const [expand, setExpand] = React.useState({
    detail: false,
    summery: false,
  });
  const { detail, summery } = expand;
  const handleExpandClick = (name) => {
    if (name === "detail") {
      setExpand({
        detail: !detail,
        summery: false,
      });
    } else {
      setExpand({
        detail: false,
        summery: !summery,
      });
    }
  };
  const handleChange = (event, value) => {
    setPage(value);
    load_comments(itemId, value);
  };
  const handleSelectChange = (event) => {
    setColor(event.target.value);
  };
  if (addedToCart) return <Redirect to="/cart" />;

  return item ? (
    <>
      <Card className={classes.pageContainer}>
        <Grid container>
          <Grid xs={12} md={6}>
            <AppCarousel className={classes.carousel} images={item.images} />
          </Grid>
          <Grid xs={12} md={6}>
            <div className={classes.summery}>
              <IconButton
                color="secondary"
                onClick={() => BookmarkHandle(item.id)}
              >
                {item.bookmarked ? (
                  <Bookmark style={{ fontSize: 35 }} />
                ) : (
                  <BookmarkBorder style={{ fontSize: 35 }} />
                )}
              </IconButton>
              <Typography variant="h4" gutterBottom>
                {item.title}
              </Typography>

              <Rating gutterBottom precision={0.5} value={item.star} readOnly />
              <Typography gutterBottom>فروشنده :{item.user_name}</Typography>
              <Typography gutterBottom>{item.brand_name}</Typography>
              {item.discount_price && item.discount_price > 0 ? (
                <div>
                  <Typography className={classes.discountPrice} variant="h5">
                    {item.discount_price.toLocaleString()}
                    {" تومان "}
                  </Typography>
                  <Typography
                    variant="h5"
                    className={classes.off}
                  >{`${item.discount_percent.toFixed(1)} %`}</Typography>
                </div>
              ) : (
                <Typography variant="h5">
                  {item.price.toLocaleString()}
                </Typography>
              )}

              {item.colors.length > 0 && (
                <FormGroup style={{ marginBottom: 10 }}>
                  <FormControl>
                    <InputLabel>رنگ</InputLabel>
                    <Select
                      open={openSelect}
                      onClose={() => setOpenSelect(false)}
                      onOpen={() => setOpenSelect(true)}
                      value={color}
                      onChange={handleSelectChange}
                    >
                      {item.colors.map((c) => (
                        <MenuItem value={c.id}>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              style={{
                                backgroundColor: c.color,
                                border: "2px solid rgba(0, 0, 0, 0.22)",
                                borderRadius: "50%",
                                display: "inline-block",
                                width: 22,
                                height: 22,
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                            ></div>
                            <Typography variant="h6">{c.title}</Typography>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormGroup>
              )}

              <Button
                onClick={() => AddToCartHandle(item.id)}
                disabled={item.stock_no < 1}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={
                  addToCart ? (
                    <CircularProgress
                      size={22}
                      style={{ marginLeft: "10px" }}
                      color="inherit"
                    />
                  ) : (
                    <AddShoppingCart style={{ marginLeft: "10px" }} />
                  )
                }
                gutterBottom
              >
                {item.stock_no < 1 ? "اتمام موجودی" : "افزودن به سبد خرید"}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>

      <Card className={classes.pageContainer}>
        <CardActions disableSpacing>
          <Typography className={classes.collapseTitle} variant="h6">
            نقد و بررسی اجمالی :
          </Typography>
          <IconButton onClick={() => handleExpandClick("summery")}>
            {summery ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </CardActions>

        <Collapse in={summery} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{item.description_short}</Typography>
          </CardContent>
        </Collapse>
        <Divider />
        <CardActions disableSpacing>
          <Typography variant="h6" className={classes.collapseTitle}>
            مشخصات :
          </Typography>
          <IconButton onClick={() => handleExpandClick("detail")}>
            {detail ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </CardActions>

        <Collapse in={detail} timeout="auto" unmountOnExit>
          <CardContent>{item.description_long}</CardContent>
        </Collapse>
      </Card>
      <Card className={classes.commentContainer}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => AddCommentHandle()}
        >
          ثبت نظر
        </Button>
        <Grid container spacing={1}>
          {comments &&
            comments.comments.length > 0 &&
            comments.comments.map((comment) => (
              <Grid item xs={12} md={6}>
                <Card variant="outlined" className={classes.commentCard}>
                  <Typography color="textSecondary" variant="subtitle2">
                    {jMoment(comment.date, "YYYY/M/D").format("jYYYY/jM/jD")}
                  </Typography>
                  <Typography variant="subtitle2">
                    {comment.user_name}
                  </Typography>
                  <Typography variant="body1">{comment.title}</Typography>
                  <Rating name="read-only" value={comment.star} readOnly />
                  <Typography variant="body1">{comment.description}</Typography>
                </Card>
              </Grid>
            ))}
        </Grid>
        {comments && comments.count > 1 && (
          <div className={classes.paginatorDiv}>
            <Pagination
              count={comments.count}
              page={page}
              color="secondary"
              onChange={handleChange}
            />
          </div>
        )}
      </Card>
      <Notification notify={notify} setNotify={setNotify} />
      <DialogAlert alert={alert} setAlert={setAlert} />
      <Popup
        title={"ثبت نظر"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <SetComment id={item.id} setOpenPopup={setOpenPopup} />
      </Popup>
    </>
  ) : (
    <>
      <LinearProgress color="secondary" />
      <div className={classes.emptyDiv}></div>
    </>
  );
};

const mapStateToProps = (state) => ({
  item: state.shop.item,
  comments: state.shop.comments,
  isAuthenticated: state.auth.isAuthenticated,
  order: state.shop.order,
});
export default connect(mapStateToProps, {
  load_item,
  add_to_cart,
  bookmark,
  load_comments,
})(DetailPage);

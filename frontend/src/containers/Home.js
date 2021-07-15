import React, { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { Rating, Pagination } from "@material-ui/lab";
import Notification from "../components/Notification";
import DialogAlert from "../components/DialogAlert";
import { connect } from "react-redux";
import { load_items, add_to_cart } from "../actions/shop";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: `${theme.spacing(2)}px`,
  },
}));
const Home = ({ items, load_items, add_to_cart, isAuthenticated, history }) => {
  const [page, setPage] = useState(
    getQueryVariable("page") ? parseInt(getQueryVariable("page")) : 1
  );
  const classes = useStyles();
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    actionUrl: "",
    actionText: "",
  });
  const { search } = useLocation();
  useEffect(() => {
    if (parseInt(getQueryVariable("page")) !== page) setPage(1);
    fetchData();
  }, [search]);

  const fetchData = async () => {
    try {
      await load_items(
        getQueryVariable("page"),
        getQueryVariable("keyword"),
        getQueryVariable("category"),
        getQueryVariable("subcategory")
      );
    } catch (err) {}
  };

  const handleChange = (event, value) => {
    setPage(value);
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("page", value);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
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
  return (
    <div>
      <Grid container className={classes.pageContainer} spacing={1}>
        {items ? (
          items[1].map((item) => (
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea
                  style={{ display: "flex" }}
                  component={NavLink}
                  to={`/detail/${item.id}`}
                >
                  <CardMedia
                    component="img"
                    image={item.image}
                    style={{ width: 150, height: 150 }}
                  />
                  <CardContent
                    style={{
                      flex: "1 0 auto",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                      {item.price} تومان
                    </Typography>
                    <Typography color="error" variant="body1" gutterBottom>
                      {item.discount_price} % تخفیف
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      gutterBottom
                    >
                      فروشنده:{item.user_name}
                    </Typography>

                    <Rating name="read-only" value={item.star} readOnly />
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    onClick={() => AddToCartHandle(item.id)}
                    variant="contained"
                    color="secondary"
                  >
                    افزودن به سبد خرید
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <CircularProgress color="secondary" />
        )}
      </Grid>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
        }}
      >
        {items ? (
          items[0].count > 1 ? (
            <Pagination
              count={items ? items[0].count : 5}
              page={page}
              color="secondary"
              onChange={handleChange}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
      <Notification notify={notify} setNotify={setNotify} />
      <DialogAlert alert={alert} setAlert={setAlert} />
    </div>
  );
};
function getQueryVariable(variable) {
  var query = decodeURI(window.location.search.substring(1)).replace(
    /\+/g,
    " "
  );
  //console.log(query); //"app=article&act=news_content&aid=160990"
  var vars = query.split("&");
  //console.log(vars); //[ 'app=article', 'act=news_content', 'aid=160990' ]
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    //console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
const mapStateToProps = (state) => ({
  items: state.shop.items,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { load_items, add_to_cart })(Home);

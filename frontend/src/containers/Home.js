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
  Chip,
  FormGroup,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Divider,
} from "@material-ui/core";
import { Rating, Pagination } from "@material-ui/lab";
import Notification from "../components/Notification";
import DialogAlert from "../components/DialogAlert";
import { connect } from "react-redux";
import { load_items, add_to_cart, load_brand } from "../actions/shop";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SortRounded } from "@material-ui/icons";
import Popup from "../components/Popup";
import placeholderImage from "../placeholder-image.png";

const useStyles = makeStyles((theme) => ({
  noItemContainer: {
    textAlign: "center",
    marginTop: 140,
    marginBottom: 140,
  },
  paginatorDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  chip: {
    margin: 10,
  },
  chipContainer: {
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  off: {
    backgroundColor: "#f44336",
    borderRadius: 15,
    color: "#fff",
    paddingRight: 4,
    paddingLeft: 4,
    display: "inline-block",
    marginLeft: 5,
  },
  discountPrice: {
    display: "inline-block",
  },
  imageContainer: {
    position: "relative",
  },
  noItemTag: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.30)",
    borderRadius: 5,
    color: "#fff",
    paddingRight: 8,
    paddingLeft: 8,
    top: 5,
    left: 5,
  },
}));
const Home = ({
  items,
  load_items,
  add_to_cart,
  isAuthenticated,
  history,
  brand,
  load_brand,
}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);
  const [openSelectSort, setOpenSelectSort] = React.useState(false);

  const [filter, setFilter] = useState(
    getQueryVariable("sort") ? getQueryVariable("sort") : ""
  );
  const [brandState, setbrandState] = useState(
    getQueryVariable("brand") ? getQueryVariable("brand") : ""
  );
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
  const chipsList = [
    { title: "brand", label: "برند : " },
    { title: "keyword", label: "جستجو : " },
    { title: "category", label: "دسته بندی : " },
    { title: "subcategory", label: "دسته بندی : " },
  ];
  const sortingList = [
    { title: "ارزانترین", sort: "price" },
    { title: "گرانترین", sort: "-price" },
    { title: "محبوبترین", sort: "-star" },
    { title: "پرفروشترین", sort: "-sold_no" },
    { title: "پربازدیدترین", sort: "-view" },
    // { title: "بیشترین تخفیف", sort: "-discount_price" },
  ];
  const fetchData = async () => {
    var sort = false;
    var query = getQueryVariable("sort");
    sortingList.map((sorting) => {
      if (sorting.title === query) {
        sort = sorting.sort;
      }
    });
    try {
      await load_items(
        getQueryVariable("page"),
        getQueryVariable("keyword"),
        getQueryVariable("category"),
        getQueryVariable("subcategory"),
        sort,
        getQueryVariable("brand")
      );
    } catch (err) {}
    try {
      await load_brand(
        getQueryVariable("category"),
        getQueryVariable("subcategory")
      );
    } catch (err) {}
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("page", value);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
    window.scrollTo({ top: 0, right: 0, behavior: "smooth" });
  };
  const handleDelete = (chip) => {
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete(chip);
    currentUrlParams.delete("page");
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
    setFilter("");
    setbrandState("");
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
  const ApplyFilter = () => {
    setOpenPopup(!openPopup);
    const currentUrlParams = new URLSearchParams(window.location.search);
    if (filter === "") {
      currentUrlParams.delete("sort");
    } else {
      currentUrlParams.set("sort", filter);
      currentUrlParams.delete("page");
    }
    if (brandState === "") {
      currentUrlParams.delete("brand");
    } else {
      currentUrlParams.set("brand", brandState);
      currentUrlParams.delete("page");
    }
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
  };
  const handleCheck = (event) => {
    setFilter(event.target.value);
  };

  const handleSelectChange = (event) => {
    setbrandState(event.target.value);
  };
  return (
    <div>
      <div className={classes.chipContainer}>
        <Chip
          className={classes.chip}
          label={
            getQueryVariable("sort")
              ? "فیلترها : " + getQueryVariable("sort")
              : "فیلترها"
          }
          clickable
          color="secondary"
          onClick={() => setOpenPopup(!openPopup)}
          onDelete={() => handleDelete("sort")}
          deleteIcon={getQueryVariable("sort") ? "" : <SortRounded />}
        />
        {chipsList.map(
          (chip) =>
            getQueryVariable(chip.title) && (
              <Chip
                className={classes.chip}
                label={chip.label + getQueryVariable(chip.title)}
                onDelete={() => handleDelete(chip.title)}
                color="secondary"
              />
            )
        )}
      </div>
      {items ? (
        <Grid container spacing={1}>
          {items.items.map((item) => (
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Card style={{ maxWidth: 280 }}>
                <CardActionArea component={NavLink} to={`/detail/${item.id}`}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    height="160"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                  <Typography variant="caption" className={classes.noItemTag}>
                    {item.stock_no === 0 && "ناموجود"}
                    {item.stock_no < 5 &&
                      item.stock_no !== 0 &&
                      item.stock_no + " عدد باقیمانده"}
                  </Typography>

                  <CardContent style={{ height: 160 }}>
                    <Typography variant="body1" gutterBottom>
                      {item.title}
                    </Typography>
                    <div>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        gutterBottom
                      >
                        {item.user_name}
                      </Typography>
                    </div>
                    {item.discount_price && item.discount_price > 0 ? (
                      <>
                        <Typography
                          variant="body2"
                          className={classes.discountPrice}
                        >
                          {item.discount_price.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          className={classes.off}
                        >{`${item.discount_percent.toFixed(1)} %`}</Typography>
                      </>
                    ) : (
                      <Typography variant="body2">
                        {item.price.toLocaleString()}
                      </Typography>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 15,
                        left: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2">
                        ({item.star.toFixed(1)})
                      </Typography>
                      <Rating max={1} value={1} />
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={classes.noItemContainer}>
          <CircularProgress color="secondary" />
        </div>
      )}
      {items && items.items.length < 1 && (
        <div className={classes.noItemContainer}>
          <Typography variant="h6">محصولی یافت نشد.</Typography>
        </div>
      )}
      <div className={classes.paginatorDiv}>
        {items && items.count > 1 && (
          <Pagination
            count={items.count}
            page={page}
            color="secondary"
            onChange={handlePageChange}
          />
        )}
      </div>
      <Popup
        title={"فیلترها :"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <FormGroup>
          <FormControl>
            <InputLabel>مرتب سازی بر اساس</InputLabel>
            <Select
              open={openSelectSort}
              onClose={() => setOpenSelectSort(false)}
              onOpen={() => setOpenSelectSort(true)}
              value={filter}
              onChange={handleCheck}
            >
              <MenuItem value="">هیچ کدام</MenuItem>
              {sortingList.map((sorting) => (
                <MenuItem value={sorting.title}>{sorting.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />
          <FormControl>
            <InputLabel>برند</InputLabel>
            <Select
              open={openSelect}
              onClose={() => setOpenSelect(false)}
              onOpen={() => setOpenSelect(true)}
              value={brandState}
              onChange={handleSelectChange}
            >
              <MenuItem value="">هیچ کدام</MenuItem>
              {brand &&
                brand.map((br) => (
                  <MenuItem value={br.title}>{br.title}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            style={{ marginTop: 20 }}
            onClick={ApplyFilter}
            color="secondary"
            variant="contained"
          >
            تایید
          </Button>
        </FormGroup>
      </Popup>
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
  brand: state.shop.brand,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  load_items,
  add_to_cart,
  load_brand,
})(Home);

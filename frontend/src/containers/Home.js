import React, { useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  makeStyles, CircularProgress,
} from "@material-ui/core";
import { Rating, Pagination } from "@material-ui/lab";

import { connect } from "react-redux";
import { load_items,add_to_cart } from "../actions/shop";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: `${theme.spacing(2)}px`,
  },
}));
const Home = ({ items, load_items, add_to_cart,isAuthenticated }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_items();
      } catch (err) {}
    };

    fetchData();
  }, []);
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const AddToCartHandle = (id) => {
    if (isAuthenticated === true){
      add_to_cart(id);
    } else {
      console.log("log in")
    }

  };
  return (
    <div>
      <Grid container className={classes.pageContainer} spacing={2}>
        {items ? (
          items.map((item) => (
            <Grid item sm={6} md={4} lg={3}>
              <Card variant="outlined">
                <CardActionArea
                  href={`/detail/${item.id}`}
                  style={{ display: "flex" }}
                >
                  <CardMedia
                    style={{ flex: 1 }}
                    component="img"
                    height="130"
                    image={item.image}
                  />
                  <CardContent style={{ flex: 1 }}>
                    <Typography gutterBottom variant="h5">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {item.price}
                    </Typography>
                    <Typography color="error" variant="body2">
                      {item.discount_price}
                    </Typography>
                    <Typography>فروشنده :{item.user_name}</Typography>

                    <Rating name="read-only" value={1} readOnly />
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
              <CircularProgress color="secondary"/>

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
        <Pagination
          count={10}
          page={page}
          onChange={handleChange}
          color="secondary"
          siblingCount={0}
        />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  items: state.shop.items,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { load_items,add_to_cart })(Home);

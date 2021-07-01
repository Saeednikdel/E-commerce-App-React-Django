import React, { useEffect } from "react";
import { connect } from "react-redux";
import { load_bookmark } from "../actions/shop";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  makeStyles,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: `${theme.spacing(2)}px`,
  },
}));
const Favorites = ({ load_bookmark, bookmarks }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_bookmark(localStorage.getItem("id"));
      } catch (err) {}
    };
    if (localStorage.getItem("id")) {
      fetchData();
    }
  }, []);
  const classes = useStyles();

  return bookmarks ? (
    <div>
      <Grid container className={classes.pageContainer} spacing={2}>
        {bookmarks.map((bookmark) => (
          <Grid item xs={6} sm={4} md={3}>
            <Card>
              <CardActionArea href={`/detail/${bookmark.item}`}>
                <CardMedia
                  component="img"
                  height="150"
                  image={bookmark.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {bookmark.item_title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    قیمت : {bookmark.item_price.toLocaleString()} تومان
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button variant="outlined" color="secondary">
                  <DeleteOutline />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
};
const mapStateToProps = (state) => ({
  bookmarks: state.shop.bookmarks,
});
export default connect(mapStateToProps, { load_bookmark })(Favorites);

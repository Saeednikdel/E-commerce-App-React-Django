import React, { useEffect } from "react";
import { connect } from "react-redux";
import { load_bookmark } from "../actions/auth";
import { bookmark } from "../actions/shop";
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
const Bookmark = ({ load_bookmark, bookmarkList, bookmark }) => {
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
  const BookmarkHandle = (id) => {
    bookmark(id);
  };
  return bookmarkList ? (
    <div className={classes.pageContainer}>
      <Grid container spacing={1}>
        {bookmarkList.map((bookmark) => (
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardActionArea
                style={{ display: "flex" }}
                href={`/detail/${bookmark.item}`}
              >
                <CardMedia
                  component="img"
                  style={{ width: 140, height:140 }}
                  image={bookmark.image}
                />
                <CardContent
                  style={{
                    flex: "1 0 auto",
                  }}
                >
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
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => BookmarkHandle(bookmark.item)}
                >
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
  bookmarkList: state.auth.bookmarks,
});
export default connect(mapStateToProps, { load_bookmark, bookmark })(Bookmark);

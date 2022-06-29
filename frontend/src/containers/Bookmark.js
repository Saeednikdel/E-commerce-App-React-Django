import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { load_bookmark } from '../actions/auth';
import { bookmark } from '../actions/shop';
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
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import placeholderImage from '../placeholder-image.png';
import { Rating, Pagination } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: `${theme.spacing(2)}px`,
  },
  paginatorDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  cardContent: { height: 170 },
  card: { maxWidth: 300 },
}));
const Bookmark = ({ load_bookmark, bookmarkList, bookmark }) => {
  const [page, setPage] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_bookmark(page);
      } catch (err) {}
    };
    if (localStorage.getItem('id')) {
      fetchData();
    }
  }, []);
  const classes = useStyles();
  const BookmarkHandle = (id) => {
    bookmark(id, page);
  };
  const handleChange = (event, value) => {
    setPage(value);
    load_bookmark(value);
    window.scrollTo({ top: 0, right: 0, behavior: 'smooth' });
  };
  return bookmarkList ? (
    <div className={classes.pageContainer}>
      <Grid container spacing={1}>
        {bookmarkList.items.map((bookmark) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card variant="outlined" className={classes.card}>
              <CardActionArea href={`/detail/${bookmark.item}`}>
                <CardMedia
                  component="img"
                  height="170"
                  image={bookmark.image}
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6" gutterBottom>
                    {bookmark.item_title}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    gutterBottom>
                    فروشنده:{bookmark.item_user}
                  </Typography>
                  {bookmark.item_discount && bookmark.item_discount > 0 ? (
                    <Typography variant="body1" gutterBottom>
                      {bookmark.item_discount.toLocaleString()}
                    </Typography>
                  ) : (
                    <Typography variant="body1" gutterBottom>
                      {bookmark.item_price.toLocaleString()}
                    </Typography>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 15,
                      left: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Typography variant="body2">
                      ({bookmark.item_star.toFixed(1)})
                    </Typography>
                    <Rating max={1} value={1} />
                  </div>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => BookmarkHandle(bookmark.item)}>
                  <DeleteOutline />
                </Button>
                {bookmark.item_stock < 1 && (
                  <Typography color="textSecondary"> ناموجود </Typography>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {bookmarkList.items.length < 1 && (
        <div style={{ textAlign: 'center', marginTop: 120 }}>
          <Typography variant="h6">محصولی نشان نشده است.</Typography>
        </div>
      )}
      {bookmarkList && bookmarkList.count > 1 && (
        <div className={classes.paginatorDiv}>
          <Pagination
            count={bookmarkList.count}
            page={page}
            color="secondary"
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
};
const mapStateToProps = (state) => ({
  bookmarkList: state.auth.bookmarks,
});
export default connect(mapStateToProps, { load_bookmark, bookmark })(Bookmark);

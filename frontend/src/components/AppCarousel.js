import React from "react";
import Carousel from "react-material-ui-carousel";
import placeholderImage from "../placeholder-image.png";

import { CardMedia, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: `${theme.spacing(2)}px`,
  },
}));
function AppCarousel({ images }) {
  const classes = useStyles();
  var items = images ? images : [{ image: placeholderImage }];
  return (
    <div className={classes.pageContainer}>
      <Carousel swipe={true} stopAutoPlayOnHover={true}>
        {items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </Carousel>
    </div>
  );
}
function Item(props) {
  return (
    <>
      <CardMedia component="img" height="400" image={props.item.image} />
    </>
  );
}

export default AppCarousel;

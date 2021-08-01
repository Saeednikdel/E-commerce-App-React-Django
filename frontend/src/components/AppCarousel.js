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
  const items =
    images.length > 0 ? images : [{ id: 0, image: placeholderImage }];
  return (
    <div className={classes.pageContainer}>
      <Carousel swipe={true} stopAutoPlayOnHover={true}>
        {items.map((item) => (
          <CardMedia
            key={item.id}
            component="img"
            height="380"
            image={item.image}
            onError={(e) => {
              e.target.src = placeholderImage;
            }}
          />
        ))}
      </Carousel>
    </div>
  );
}

export default AppCarousel;

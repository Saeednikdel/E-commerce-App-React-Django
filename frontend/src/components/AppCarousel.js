import React from "react";
import Carousel from "react-material-ui-carousel";
import placeholderImage from "../placeholder-image.png";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { CardMedia, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  image: {
    // margin: `${theme.spacing(1)}px`,
    borderRadius: 4,
  },
}));
function AppCarousel({ images }) {
  const classes = useStyles();
  const items =
    images.length > 0 ? images : [{ id: 0, image: placeholderImage }];
  return (
    <div>
      <Carousel
        NextIcon={<ArrowBack />}
        PrevIcon={<ArrowForward />}
        timeout={700}
        interval={5000}
        swipe={true}
        stopAutoPlayOnHover={true}
      >
        {items.map((item) => (
          <CardMedia
            className={classes.image}
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

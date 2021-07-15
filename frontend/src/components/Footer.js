import React from "react";
///import { Link } from "react-router-dom";
import {
  Typography,
  Divider,
  //Grid,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: 250,
    marginTop: `${theme.spacing(2)}px`,
  },
}));
function Footer() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <Divider />
        <Typography variant="h6">فوتر</Typography>
      </div>
    </>
  );
}

export default Footer;

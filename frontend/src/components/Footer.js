import React from 'react';
///import { Link } from "react-router-dom";
import {
  Typography,
  Divider,
  //Grid,
  makeStyles,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: 250,
    marginTop: `${theme.spacing(2)}px`,
  },
  btn: { margin: 20 },
}));
function Footer() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <Divider />
        <Button
          variant="outlined"
          size="small"
          className={classes.btn}
          onClick={() => {
            window.scrollTo({ top: 0, right: 0, behavior: 'smooth' });
          }}>
          برگشت به بالا
        </Button>
      </div>
    </>
  );
}

export default Footer;

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    minWidth: 300,
    position: 'absolute',
    top: theme.spacing(5),
  },
  dialogTitle: {
    paddingRight: '0px',
  },
  title: { flexGrow: 1 },
  titleWraper: { display: 'flex' },
}));

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={openPopup}
      onClose={() => {
        setOpenPopup(false);
      }}
      //maxWidth="lg"
      classes={{ paper: classes.dialogWrapper }}>
      <DialogTitle className={classes.dialogTitle}>
        <div className={classes.titleWraper}>
          <Typography variant="h6" component="div" className={classes.title}>
            {title}
          </Typography>
          <Button
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
            }}>
            <CloseIcon />
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { resetState, comment } from "../actions/auth";
import {
  TextField,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
const useStyles = makeStyles((theme) => ({
  textField: { marginTop: 5, minWidth: 240 },
  button: { marginTop: 20, marginBottom: 20 },
}));
const SetComment = ({
  setOpenPopup,
  requestSuccess,
  requestFail,
  resetState,
  id,
  comment,
}) => {
  const [formData, setFormData] = useState({
    item: id,
    star: 5,
    title: "",
    description: "",
  });
  const classes = useStyles();

  const { item, star, title, description } = formData;
  const [requestSent, setRequestSent] = useState(false);
  useEffect(() => {
    if (requestFail) {
      setRequestSent(false);
      resetState();
    }
    if (requestSuccess) {
      setOpenPopup(false);
      resetState();
    }
  }, [requestFail, requestSuccess]);
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    comment(item, star, title, description);
    setRequestSent(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <form autoComplete="off" onSubmit={(e) => onSubmit(e)}>
        <div>
          <Rating name="star" value={star} onChange={(e) => onChange(e)} />
        </div>
        <div>
          <TextField
            autoComplete="off"
            className={classes.textField}
            type="text"
            label="عنوان"
            name="title"
            value={title}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            autoComplete="off"
            className={classes.textField}
            type="text"
            label="نظر"
            name="description"
            value={description}
            multiline
            rows={4}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="secondary"
          startIcon={
            requestSent ? (
              <CircularProgress
                size={20}
                style={{ marginLeft: "10px" }}
                color="inherit"
              />
            ) : (
              <Done style={{ marginLeft: "10px" }} />
            )
          }
        >
          تایید
        </Button>
      </form>
    </div>
  );
};
const mapStateToProps = (state) => ({
  requestSuccess: state.auth.requestSuccess,
  requestFail: state.auth.requestFail,
});
export default connect(mapStateToProps, { resetState, comment })(SetComment);

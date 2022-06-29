import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { set_email, resetState } from "../actions/auth";
import {
  TextField,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  textField: { marginTop: 5, minWidth: 240 },
  button: { marginTop: 20, marginBottom: 20, },
}));
const SetEmail = ({
  set_email,
  setOpenPopup,
  requestSuccess,
  requestFail,
  resetState,
}) => {
  const [formData, setFormData] = useState({
    new_email: "",
    re_new_email: "",
    current_password: "",
  });

  const { new_email, re_new_email, current_password } = formData;
  const classes = useStyles();

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
    set_email(new_email, re_new_email, current_password);
    setRequestSent(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <form autoComplete="off" onSubmit={(e) => onSubmit(e)}>
        <div>
          <TextField
            className={classes.textField}
            autoComplete="off"
            type="email"
            label="ایمیل جدید"
            name="new_email"
            value={new_email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            className={classes.textField}
            autoComplete="off"
            type="email"
            label="تکرار ایمیل"
            name="re_new_email"
            value={re_new_email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            className={classes.textField}
            autoComplete="off"
            type="password"
            label="رمز عبور"
            name="current_password"
            value={current_password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          type="submit"
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
export default connect(mapStateToProps, { set_email, resetState })(SetEmail);

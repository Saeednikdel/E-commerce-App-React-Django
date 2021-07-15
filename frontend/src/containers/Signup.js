import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { signup, resetState } from "../actions/auth";
import {
  TextField,
  Button,
  makeStyles,
  Typography,
  LinearProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  navLink: {
    textDecoration: "none",
    color: theme.palette.secondary.light,
    margin: 5,
  },
}));
const Signup = ({
  signup,
  isAuthenticated,
  requestSuccess,
  requestFail,
  resetState,
}) => {
  const classes = useStyles();
  const [requestSent, setRequestSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    re_password: "",
  });

  const { name, email, password, re_password } = formData;
  useEffect(() => {
    if (requestFail) {
      setRequestSent(false);
      resetState();
    }
    if (requestSuccess) {
      resetState();
    }
  }, [requestFail, requestSuccess]);
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (password === re_password) {
      signup({ name, email, password, re_password });
      setRequestSent(true)
    }
  };

  if (isAuthenticated) return <Redirect to="/" />;
  if (requestSuccess) return <Redirect to="login" />;
  return (
    <div style={{ textAlign: "center" }}>
      {requestSent ? <LinearProgress /> : ""}

      <Typography variant="h5">ثبت نام</Typography>
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <TextField
            type="text"
            label="نام"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            type="email"
            label="ایمیل"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <TextField
            type="password"
            label="رمز عبور"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div>
          <TextField
            type="password"
            label="تایید رمز عبور"
            name="re_password"
            value={re_password}
            onChange={(e) => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <Button
          style={{ margin: 20 }}
          type="submit"
          variant="contained"
          color="secondary"
        >
          ایجاد حساب
        </Button>
      </form>
      <Typography variant="body1">
        قبلا ثبت نام کرده اید؟{" "}
        <Link className={classes.navLink} to="/login">
          ورود{" "}
        </Link>
      </Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  requestSuccess: state.auth.requestSuccess,
  requestFail: state.auth.requestFail,
});

export default connect(mapStateToProps, { signup, resetState })(Signup);

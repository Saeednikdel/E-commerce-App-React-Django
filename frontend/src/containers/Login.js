import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login, resetState } from "../actions/auth";
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
const Login = ({
  login,
  isAuthenticated,
  requestFail,
  resetState,
}) => {
  const classes = useStyles();
  const [requestSent, setRequestSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (requestFail) {
      setRequestSent(false);
      resetState();
    }
    if (isAuthenticated) {
      resetState();
    }
  }, [requestFail, isAuthenticated]);
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setRequestSent(true)
    login(email, password);
  };

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <div style={{ textAlign: "center" }}>
      {requestSent ? <LinearProgress /> : ""}

      <Typography variant="h5">ورود</Typography>
      <form onSubmit={(e) => onSubmit(e)}>
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
            minLength="4"
            required
          />
        </div>
        <Button
          type="submit"
          style={{ margin: 20 }}
          variant="contained"
          color="secondary"
        >
          ورود
        </Button>
      </form>
      <Typography variant="body1">
        قبلا ثبت نام نکرده اید؟{" "}
        <Link className={classes.navLink} to="/signup">
          ثبت نام
        </Link>
      </Typography>
      <Typography variant="body1">
        رمز عبورتان را فراموش کرده اید؟{" "}
        <Link className={classes.navLink} to="/reset_password">
          بازیابی
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

export default connect(mapStateToProps, { login, resetState })(Login);

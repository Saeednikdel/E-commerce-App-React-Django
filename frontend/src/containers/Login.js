import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import { TextField, Button, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  navLink: {
    textDecoration: "none",
    color: theme.palette.secondary.light,
    margin: 5,
  },
}));
const Login = ({ login, isAuthenticated }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  };

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <div style={{ textAlign: "center" }}>
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
});

export default connect(mapStateToProps, { login })(Login);

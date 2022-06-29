import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { signup, resetState } from '../actions/auth';
import {
  TextField,
  Button,
  makeStyles,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import DialogAlert from '../components/DialogAlert';
import { Done } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  navLink: {
    textDecoration: 'none',
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
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
  });
  const { name, email, password, re_password } = formData;
  useEffect(() => {
    if (requestFail) {
      setRequestSent(false);
      resetState();
    }
    if (requestSuccess) {
      resetState();
      setRequestSent(false);
      setAlert({
        isOpen: true,
        title: 'ثبت نام انجام شد.',
        message: 'برای فعالسازی حساب خود لینک ارسال شده به ایمیل، را باز کنید.',
      });
    }
  }, [requestFail, requestSuccess]);
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (password === re_password) {
      signup({ name, email, password, re_password });
      setRequestSent(true);
    }
  };

  if (isAuthenticated) return <Redirect to="/" />;
  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <Typography variant="h5">ثبت نام</Typography>
      <form autoComplete="off" onSubmit={(e) => onSubmit(e)}>
        <div>
          <TextField
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
          startIcon={
            requestSent ? (
              <CircularProgress
                size={20}
                style={{ marginLeft: '10px' }}
                color="inherit"
              />
            ) : (
              <Done style={{ marginLeft: '10px' }} />
            )
          }>
          ایجاد حساب
        </Button>
      </form>
      <Typography variant="body1">
        قبلا ثبت نام کرده اید؟{' '}
        <Link className={classes.navLink} to="/login">
          ورود{' '}
        </Link>
      </Typography>
      <DialogAlert alert={alert} setAlert={setAlert} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  requestSuccess: state.auth.requestSuccess,
  requestFail: state.auth.requestFail,
});

export default connect(mapStateToProps, { signup, resetState })(Signup);

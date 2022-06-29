import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password, resetState } from "../actions/auth";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";

const ResetPassword = ({
  requestSuccess,
  requestFail,
  resetState,
  reset_password,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const { email } = formData;
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
    reset_password(email);
    setRequestSent(true);
  };
  if (requestSent === requestSuccess) return <Redirect to="/" />;

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <Typography variant="h5">درخواست بازنشانی رمز عبور</Typography>
      <form autoComplete="off" onSubmit={(e) => onSubmit(e)}>
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
        <Button
          style={{ margin: 20 }}
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
          ارسال
        </Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  requestSuccess: state.auth.requestSuccess,
  requestFail: state.auth.requestFail,
});
export default connect(mapStateToProps, { reset_password, resetState })(
  ResetPassword
);

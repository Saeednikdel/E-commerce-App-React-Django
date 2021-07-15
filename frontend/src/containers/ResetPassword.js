import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password, resetState } from "../actions/auth";
import {
  TextField,
  Button,
  Typography,
  LinearProgress,
} from "@material-ui/core";

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
    <div style={{ textAlign: "center" }}>
      {requestSent ? <LinearProgress /> : ""}
      <Typography variant="h5">درخواست بازنشانی رمز عبور</Typography>
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
        <Button
          style={{ margin: 20 }}
          variant="contained"
          color="secondary"
          type="submit"
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

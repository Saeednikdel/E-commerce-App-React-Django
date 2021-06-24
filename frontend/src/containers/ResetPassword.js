import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password } from "../actions/auth";
import { TextField, Button, Typography } from "@material-ui/core";

const ResetPassword = (props) => {
  const [requestSent, setRequestSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    props.reset_password(email);
    setRequestSent(true);
  };

  if (requestSent) return <Redirect to="/" />;
  return (
    <div style={{ textAlign: "center" }}>
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

export default connect(null, { reset_password })(ResetPassword);

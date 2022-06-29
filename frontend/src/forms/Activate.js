import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify, resetState } from '../actions/auth';
import { Button, Typography, LinearProgress } from '@material-ui/core';

const Activate = ({
  requestSuccess,
  verify,
  match,
  resetState,
  requestFail,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  useEffect(() => {
    if (requestFail) {
      setRequestSent(false);
      resetState();
    }
    if (requestSuccess) {
      resetState();
    }
  }, [requestFail, requestSuccess]);
  const verify_account = (e) => {
    const uid = match.params.uid;
    const token = match.params.token;
    verify(uid, token);
    setRequestSent(true);
  };
  if (requestSent === requestSuccess) return <Redirect to="/login" />;

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      {requestSent && <LinearProgress />}
      <Typography variant="h5">تایید ایمیل</Typography>
      <Button
        style={{ margin: 20 }}
        type="submit"
        variant="contained"
        color="secondary"
        onClick={verify_account}>
        تایید
      </Button>
    </div>
  );
};
const mapStateToProps = (state) => ({
  requestSuccess: state.auth.requestSuccess,
  requestFail: state.auth.requestFail,
});
export default connect(mapStateToProps, { verify, resetState })(Activate);

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Typography,
  Divider,
  LinearProgress,
  Button,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { load_user } from '../actions/auth';
import jMoment from 'moment-jalaali';
import SetEmail from '../forms/SetEmail';
import SetPassword from '../forms/SetPassword';
import Popup from '../components/Popup';
import SetUserDetail from '../forms/SetUserDetail';

const UserDetail = ({ user, load_user }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_user();
      } catch (err) {}
    };
    fetchData();
  }, []);
  const [openPopup, setOpenPopup] = useState(false);
  const [childComponent, setchildComponent] = useState('');

  const handleDialog = (btnname) => {
    setchildComponent(btnname);
    setOpenPopup(true);
  };

  function ChildrenComponent({ value }) {
    switch (value) {
      case 'ویرایش مشخصات':
        return (
          <SetUserDetail
            propsid={user.id}
            propsname={user.name}
            propsphone_no={user.phone_no}
            propsaccount_no={user.account_no}
            propsbirth_date={user.birth_date}
            propsid_code={user.id_code}
            setOpenPopup={setOpenPopup}
          />
        );
      case 'تغییر ایمیل':
        return <SetEmail setOpenPopup={setOpenPopup} />;
      case 'تغییر رمز عبور':
        return <SetPassword setOpenPopup={setOpenPopup} />;
    }
  }
  return user ? (
    <div style={{ marginRight: 20, marginLeft: 20 }}>
      <Button
        style={{ marginTop: 20, marginLeft: 20 }}
        color="secondary"
        variant="outlined"
        onClick={() => handleDialog('ویرایش مشخصات')}>
        ویرایش مشخصات
      </Button>

      <Button
        style={{ marginLeft: 20, marginTop: 20 }}
        color="secondary"
        variant="outlined"
        onClick={() => handleDialog('تغییر رمز عبور')}>
        تغییر رمز عبور
      </Button>

      <Button
        style={{ marginTop: 20 }}
        color="secondary"
        variant="outlined"
        onClick={() => handleDialog('تغییر ایمیل')}>
        تغییر ایمیل
      </Button>

      <Avatar src="/broken-image.jpg" style={{ marginTop: 20 }} />

      <Typography variant="h5">ایمیل</Typography>
      <Typography variant="subtitle1">
        {user.email ? user.email : '--'}
      </Typography>
      <Divider />
      <Typography variant="h5">نام</Typography>
      <Typography variant="subtitle1">
        {user.name ? user.name : '--'}
      </Typography>
      <Divider />
      <Typography variant="h5">تلفن</Typography>
      <Typography variant="subtitle1">
        {user.phone_no ? user.phone_no : '--'}
      </Typography>
      <Divider />
      <Typography variant="h5">شماره کارت</Typography>
      <Typography variant="subtitle1">
        {user.account_no ? user.account_no : '--'}
      </Typography>
      <Divider />

      <Typography variant="h5">تاریخ تولد</Typography>
      <Typography variant="subtitle1">
        {user.birth_date
          ? jMoment(user.birth_date, 'YYYY/M/D').format('jYYYY/jM/jD')
          : '--'}
      </Typography>
      <Divider />

      <Typography variant="h5">کد ملی</Typography>
      <Typography variant="subtitle1">
        {user.id_code ? user.id_code : '--'}
      </Typography>
      <Popup
        title={childComponent}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
        <ChildrenComponent value={childComponent} />
      </Popup>
    </div>
  ) : (
    <LinearProgress color="secondary" />
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps, { load_user })(UserDetail);

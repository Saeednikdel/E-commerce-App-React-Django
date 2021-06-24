import React, { useEffect } from "react";
import {Avatar, Typography, Divider, CircularProgress} from "@material-ui/core";
import { connect } from "react-redux";
import { load_user_detail } from "../actions/shop";

const UserDetail = ({ user, load_user_detail }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await load_user_detail(localStorage.getItem("id"));
      } catch (err) {}
    };
    if (localStorage.getItem("id")) {
      fetchData();
    }
  }, []);
  return user ? (
    <div style={{ margin: 20 }}>
      <Avatar src="/broken-image.jpg" />

      <Typography variant="h5">ایمیل</Typography>
      <Typography variant="subtitle1">
        {user.email ? user.email : "--"}
      </Typography>
      <Divider />
      <Typography variant="h5">نام</Typography>
      <Typography variant="subtitle1">
        {user.name ? user.name : "--"}
      </Typography>
      <Divider />
      <Typography variant="h5">تلفن</Typography>
      <Typography variant="subtitle1">
        {user.phone_no ? user.phone_no : "--"}
      </Typography>
      <Divider />
      <Typography variant="h5">شماره کارت</Typography>
      <Typography variant="subtitle1">
        {user.account_no ? user.account_no : "--"}
      </Typography>
      <Divider />

      <Typography variant="h5">تاریخ تولد</Typography>
      <Typography variant="subtitle1">
        {user.birth_date ? user.birth_date : "--"}
      </Typography>
      <Divider />

      <Typography variant="h5">کد ملی</Typography>
      <Typography variant="subtitle1">
        {user.id_code ? user.id_code : "--"}
      </Typography>
      <Divider />
    </div>
  ) : (
     <CircularProgress color="secondary"/>
  );
};
const mapStateToProps = (state) => ({
  user: state.shop.user,
});
export default connect(mapStateToProps, { load_user_detail })(UserDetail);

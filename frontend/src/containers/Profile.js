import React from "react";
import { Card, Tabs, Tab } from "@material-ui/core";
import { connect } from "react-redux";
import Redirect from "react-router-dom/es/Redirect";
import UserDetail from "./UserDetail";
import OrderList from "./OrderList";
import Messages from "./Messages";
import Addresses from "./Addresses";
import Bookmark from "./Bookmark";
import { NavLink } from "react-router-dom";

const Profile = ({ isAuthenticated, match }) => {
  const tab = match.params.tab;
  if (isAuthenticated === false) return <Redirect to="/login" />;
  const tabList = [
    {
      label: "مشخصات",
      value: "user-info",
      to: "/profile/user-info",
    },
    {
      label: "سفارشات",
      value: "orders",
      to: "/profile/orders",
    },
    {
      label: "پیام ها",
      value: "messages",
      to: "/profile/messages",
    },
    {
      label: "آدرس ها",
      value: "addres-list",
      to: "/profile/addres-list",
    },
    {
      label: "پسندیده",
      value: "bookmark",
      to: "/profile/bookmark",
    },
  ];
  return (
    <div>
      <Tabs value={tab} indicatorColor="primary" textColor="primary">
        {tabList.map((tab) => (
          <Tab
            label={tab.label}
            value={tab.value}
            to={tab.to}
            component={NavLink}
          />
        ))}
      </Tabs>
      <Card variant="outlined" style={{ minHeight: 400 }}>
        <ProfileComponent value={tab} />
      </Card>
    </div>
  );
};

function ProfileComponent({ value }) {
  switch (value) {
    case "user-info":
      return <UserDetail />;
    case "orders":
      return <OrderList />;
    case "messages":
      return <Messages />;
    case "addres-list":
      return <Addresses />;
    case "bookmark":
      return <Bookmark />;
    default:
      return <h1>error</h1>;
  }
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(Profile);

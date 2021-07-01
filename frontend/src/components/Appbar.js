import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Drawer,
  List,
  Divider,
  ListItem,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItemText,
  Badge,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { load_items } from "../actions/shop";
import {
  ShoppingCart,
  Brightness7,
  Brightness4,
  AccountCircle,
  Menu,
  ExpandMore,
  SearchSharp,
} from "@material-ui/icons";
import { drawer_items } from "./DrawerItems";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: 20,
    textDecoration: "none",
    flexGrow: 1,
  },
  rightIcons: { flexGrow: 1 },
  navLink: {
    textDecoration: "none",
    color: "inherit",
    // margin: 5,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

const Appbar = ({
  isAuthenticated,
  logout,
  checked,
  onChange,
  cart,
  load_items,
  history,
}) => {
  const classes = useStyles();
  const authLinks = (
    <Link className={classes.navLink} onClick={logout}>
      <Typography variant="button">خروج</Typography>
    </Link>
  );
  const [drawerstate, setDrawerState] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState(!drawerstate);
  };
  const [expanded, setExpanded] = useState(false);
  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [search, setSearch] = useState("");
  const onTextChange = (e) => setSearch(e.target.value);

  const handleDrawerLink = (title, type) => {
    setDrawerState(!drawerstate);

    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete("keyword");
    type === "subcategory"
      ? currentUrlParams.delete("category")
      : currentUrlParams.delete("subcategory");

    currentUrlParams.set("page", 1);
    currentUrlParams.set(type, title);
    if (window.location.pathname === "/") {
      history.push("?" + currentUrlParams.toString());
      type === "subcategory"
        ? load_items(1, false, false, title)
        : load_items(1, false, title, false);
    } else {
      window.location.replace("/?" + type + "=" + title);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete("category");
    currentUrlParams.delete("subcategory");
    currentUrlParams.set("page", 1);
    currentUrlParams.set("keyword", search);
    if (window.location.pathname === "/") {
      history.push(
        window.location.pathname + "?" + currentUrlParams.toString()
      );
      load_items(1, search, false, false);
    } else {
      window.location.replace("/?keyword=" + search);
    }
  };
  const list = () => (
    <div
      className={classes.list}
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <Toolbar>
        <Link className={classes.title} to="/" onClick={toggleDrawer}>
          <Typography variant="h6" color="textPrimary">
            SAKAR
          </Typography>
        </Link>
      </Toolbar>
      {drawer_items.map((drawer_item) => (
        <Accordion
          expanded={expanded === drawer_item.category}
          onChange={handleExpand(drawer_item.category)}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography>{drawer_item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem
                button
                onClick={() => handleDrawerLink(drawer_item.title, "category")}
              >
                <ListItemText
                  primary="همه موارد این دسته"
                  style={{ textAlign: "right" }}
                />
              </ListItem>
              {drawer_item.sub.map((sub_item) => (
                <ListItem
                  button
                  onClick={() =>
                    handleDrawerLink(sub_item.title, "subcategory")
                  }
                >
                  <ListItemText
                    primary={sub_item.title}
                    style={{ textAlign: "right" }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <div className={classes.rightIcons}>
            <IconButton color="inherit" onClick={toggleDrawer}>
              <Menu />
            </IconButton>

            {isAuthenticated ? authLinks : ""}
          </div>

          <a className={classes.title} href="/">
            <Typography variant="h5" color="primary">
              SAKAR
            </Typography>
          </a>
          <IconButton color="inherit" onClick={onChange}>
            {checked ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar>
        <div className={classes.rightIcons}>
          <Link className={classes.navLink} exact to="/profile/user-info">
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          </Link>
          <Link className={classes.navLink} exact to="/cart">
            <IconButton color="inherit">
              <Badge
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                badgeContent={cart ? cart.length : 0}
                color="secondary"
              >
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Link>
        </div>
        <form onSubmit={(e) => onSearch(e)}>
          <TextField
            style={{ marginTop: 5, width: "14rem" }}
            id="search"
            placeholder="جستجو"
            color="secondary"
            variant="outlined"
            value={search}
            onChange={(e) => onTextChange(e)}
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton color="inherit" size="small" type="submit">
                  <SearchSharp />
                </IconButton>
              ),
            }}
          />
        </form>
      </Toolbar>
      <Divider />

      <Drawer
        // BackdropProps={{ invisible: true }}
        anchor={"left"}
        open={drawerstate}
        onClose={toggleDrawer}
      >
        {list()}
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  cart: state.shop.cart,
});

export default withRouter(
  connect(mapStateToProps, { logout, load_items })(Appbar)
);

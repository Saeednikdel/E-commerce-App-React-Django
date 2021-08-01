import React, { useEffect, useState } from "react";
import { ExpandMore } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
  Toolbar,
  Typography,
  makeStyles,
  List,
  ListItem,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { logout } from "../actions/auth";
import { drawer_items } from "./DrawerItems";

const useStyles = makeStyles((theme) => ({
  navLink: {
    textDecoration: "none",
    color: "inherit",
  },
  exit: {
    textDecoration: "none",
    color: "inherit",
    marginTop: 10,
    marginRight: 20,
  },
  list: {
    width: 280,
  },
}));
const DrawerMenu = ({ isAuthenticated, logout, setDrawerState }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const authLinks = (
    <Toolbar>
      <Link className={classes.exit} onClick={() => logOut()}>
        <Typography variant="body1">خروج</Typography>
      </Link>
    </Toolbar>
  );
  const logOut = () => {
    logout();
    setDrawerState(false);
  };
  return (
    <div className={classes.list}>
      <Toolbar>
        <Link className={classes.title} to="/" onClick={setDrawerState(false)}>
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
              <ListItem>
                <Link
                  onClick={setDrawerState(false)}
                  className={classes.navLink}
                  to={`/?page=1&category=${drawer_item.title}`}
                >
                  <Typography>همه موارد این دسته</Typography>
                </Link>
              </ListItem>
              {drawer_item.sub.map((sub_item) => (
                <ListItem>
                  <Link
                    onClick={setDrawerState(false)}
                    className={classes.navLink}
                    to={`/?page=1&subcategory=${sub_item.title}`}
                  >
                    <Typography>{sub_item.title}</Typography>
                  </Link>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
      {isAuthenticated && authLinks}
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(DrawerMenu);

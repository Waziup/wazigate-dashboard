import React, { useState, useEffect, Fragment } from "react";
import waziup from "waziup";
import MarketplaceApp from "./apps/MarketplaceApp";
import ErrorView from "./Error";

import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  Fab,
  LinearProgress,
  Grow,
  useTheme,
  Zoom,
} from "@material-ui/core";
import InstalledApp from "./apps/InstalledApp";

interface Props {
  filter?: "installed" | "available";
  handleDrawerToggle: () => void;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  page: {
    marginTop: 64,
    marginBottom: 64,
  },
  fab: {
    background: "#f35e19",
    color: "white",
    outline: "none",
    position: "fixed",
    right: 16,
    bottom: 16,
    "&:hover": {
      background: "#f38c5c",
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    background: "#f1f1f1",
    color: "unset",
    boxShadow: "0 0 2px #f1f1f1",
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(3),
  },
  loading: {
    position: "fixed",
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth,
    },
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
  },
  name: {
    flexGrow: 1,
  },
  appBarInner: {
    padding: "0",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  body: {
    padding: theme.spacing(1),
    textAlign: "center",
  },
  app: {
    margin: theme.spacing(1),
    textAlign: "left",
    width: 400,
    maxWidth: "calc(100% - 16px)",
    display: "inline-block",
  },
}));

export default function AppsPage({ filter, handleDrawerToggle }: Props) {
  const classes = useStyles();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const [apps, setApps] = useState(null as waziup.App[]);
  const [error, setError] = useState(null as Error);

  var [filter, setFilter] = useState(filter);

  useEffect(() => {
    if (filter == "available") {
      wazigate.get<any>("apps?available").then(setApps, setError);
    } else {
      wazigate.getApps().then(setApps, setError);
    }
  }, [filter]);

  var body: JSX.Element | JSX.Element[];

  if (error !== null) {
    body = <ErrorView error={error} />;
  } else if (apps === null) {
    body = <span>Loading, please wait...</span>;
  } else if (apps.length === 0) {
    body = (
      <span>"There are not apps installed. Click '+' to add new apps."</span>
    );
  } else if (filter == "available") {
    body = apps.map((app) => (
      <MarketplaceApp key={app.id} appInfo={app} className={classes.app} />
    ));
  } else {
    body = apps.map((app) => (
      <InstalledApp key={app.id} appInfo={app} className={classes.app} />
    ));
  }

  const manageApps = filter == "installed";

  return (
    <div className={classes.page}>
      {apps === null ? <LinearProgress className={classes.loading} /> : null}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.appBarInner}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.name}>
            Apps
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.body}>{body}</div>
      <Zoom
        in={filter == "available"}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            filter == "available" ? transitionDuration.exit : 0
          }ms`,
        }}
        unmountOnExit
      >
        <Fab
          className={classes.fab}
          onClick={() => setFilter("installed")}
          aria-label="edit"
          title="Manage installed Apps"
        >
          <SettingsIcon />
        </Fab>
      </Zoom>
      <Zoom
        in={filter == "installed"}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            filter == "installed" ? transitionDuration.exit : 0
          }ms`,
        }}
        unmountOnExit
      >
        <Fab
          className={classes.fab}
          onClick={() => setFilter("available")}
          aria-label="add"
          title="Install a new App"
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </div>
  );
}

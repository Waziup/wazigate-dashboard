import React, { useState, Fragment, useEffect } from "react";
import AppsPage from "./pages/Apps";
import LoginPage from "./pages/Login";
import SensorPage from "./pages/Sensor";
import ActuatorPage from "./pages/Actuator";
import DevicePage from "./pages/Device";
import DevicesPage from "./pages/Devices";
import UserProfilePage from "./pages/UserProfile";
import ErrorPage from "./pages/Error";
import { MenuHook, App, Cloud } from "waziup";
import { AppsProxyComp } from "./AppsProxy";
import SyncIcon from "@material-ui/icons/Sync";
import AppsIcon from "@material-ui/icons/Apps";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from '@material-ui/icons/Person';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import wazigateImage from "../img/wazigate.svg";

import _defaultIcon from "../img/default-menu-icon.svg";
const defaultIcon = `dist/${_defaultIcon}`;

import {
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import SyncPage from "./pages/Sync";
import { MQTTIndicator } from "./MQTTIndicator";
import HookMenu from "./HookMenu";

const appsRegExp = /^#\/apps\/([\.a-zA-Z0-9_\- %]+)\/(.*)/;
const sensorRegExp = /^#\/devices\/([\.a-zA-Z0-9_-]+)\/sensors\/([\.a-zA-Z0-9_\- %]+)$/;
const actuatorRegExp = /^#\/devices\/([\.a-zA-Z0-9_-]+)\/actuators\/([\.a-zA-Z0-9_\- %]+)$/;
const deviceRegExp = /^#\/devices\/([\.a-zA-Z0-9_\- %]+)$/;

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      background: "#f1f1f1",
      [theme.breakpoints.up("sm")]: {
        paddingLeft: drawerWidth,
      },
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#34425A",
      color: "#f1f1f1",
      display: "flex",
      flexDirection: "column",
      "&:before": {
        content: "''",
        "pointer-events": "none",
        background: `url('dist/${wazigateImage}')`,
        backgroundSize: "120px 78px",
        position: "absolute",
        bottom: "40px",
        left: "60px",
        width: "120px",
        height: "78px",
      },
    },
    drawerIcon: {
      color: "rgba(255, 255, 255, 0.84)",
    },
    content: {
      flexGrow: 1,
      width: "100%",
      // padding: theme.spacing(3),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    a: {
      "&:hover": {
        color: "unset !important",
      },
    },
    hidden: {
      display: "none"
    },
    menu: {
      flexGrow: 1,
    },
    menuIcon: {
      width: "1em",
      height: "1em",
      fontSize: "1.5rem",
    },
    status: {
      color: "#dfe0e4",
      borderRadius: 0,
      zIndex: -2,
    },
    statusConnected: {
      background: "#176dbf",
    },
    statusError: {
      background: "#f35e18",
    },
  })
);

hooks.setMenuHook(
  "dashboard",
  {
    primary: "Dashboard",
    icon: <DashboardIcon />,
    href: "#",
    target: "",
  },
  20
);
hooks.setMenuHook(
  "sync",
  {
    primary: "Sync",
    icon: <SyncIcon />,
    href: "#/sync",
  },
  40
);
// hooks.setMenuHook("settings", {
//   primary: "Settings",
//   icon: <SettingsIcon />,
//   href: "#/settings",
// });
// hooks.setMenuHook("settings.wifi", {
//   primary: "Wifi",
//   icon: <WifiIcon />,
//   href: "#/settings",
// });

// Uncomment to display apps
hooks.setMenuHook(
  "apps",
  {
    primary: "Apps",
    icon: <AppsIcon />,
    href: "#/apps",
  },
  80
);

hooks.setMenuHook(
  "profile",
  {
    primary: "User Profile",
    icon: <PersonIcon />,
    href: "#/profile",
  },
  1999
);

export const DashboardComp = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [page, setPage] = useState(location.hash);

  /*----------- */

  const doLogout = () => {
    event.preventDefault();
    wazigate.set<any>("auth/logout", {}).then(
      (res) => {
        location.replace("#");
      },
      (error) => {
        console.log(error);
        alert("Logout failed: " + error);
      }
    );
  }

  /*----------- */

  const [apps, setApps] = useState(null);

  const [clouds, setClouds] = useState(null as Cloud[]);

  useEffect(() => {

    window.addEventListener("hashchange", () => {
      setPage(location.hash);
      setMobileOpen(false);
    });

    wazigate.getClouds().then(
      (clouds) => {
        setClouds(Object.values(clouds));
      },
      (err: Error) => {
        console.error("There was an error loading the clouds:", err);
        setClouds([]);
      }
    );

    var apps = wazigate.getApps()

    wazigate.getApps().then(
      (apps) => {
        if (apps === null) {
          console.error("The server reported no apps.");
          setApps([]);
        } else {
          Promise.allSettled(
            apps.map((app, i) => {
              var fallbackIcon = 0;
              const getDefaultAppIcon = (
                event: React.ChangeEvent<HTMLImageElement>
              ) => {
                if (fallbackIcon > 1) return;
                event.target.src = defaultIcon;
                fallbackIcon++;
              };

              const menu = app.waziapp?.menu;
              if (menu) {
                for (const id in menu) {
                  const item = menu[id];
                  const hook: MenuHook = {
                    ...item,
                    icon: item.icon ? (
                      <img
                        className={classes.menuIcon}
                        src={wazigate.toProxyURL(app.id, item.icon)}
                        onError={getDefaultAppIcon}
                      />
                    ) : null,
                  };
                  hooks.setMenuHook(id, hook, item.prio);
                }
              }
              const hook = app.waziapp?.hook;
              if (!hook) return Promise.resolve(null);
              return hooks.load(wazigate.toProxyURL(app.id, hook));
            })
          ).then((pen) => {
            console.log("Apps loaded:", pen);
            setApps(apps);
          });
        }
      },
      (err: Error) => {
        console.error("There was an error loading the apps:", err);
        setApps([]);
      }
    );
  }, []);

  const drawer = (
    <Fragment>
      <div className={classes.toolbar} />

      <Fragment key="topLinks">
        <ListItem
          component="a"
          button
          key="logout"
          href="#/logout"
          className={window.document.location.hostname == "remote.waziup.io" ? classes.hidden : classes.a}>
          <ListItemIcon className={classes.drawerIcon}><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Fragment>
      <Divider />
      <HookMenu className={classes.menu} hook="menu" on={/^menu\..*/} />
      <div>
        <MQTTIndicator />
      </div>
    </Fragment>
  );

  var body: JSX.Element;
  var match: RegExpMatchArray;

  if (apps === null) {
    body = <div>Loading... Please wait.</div>;
  } else {
    if (page == "#/" || page == "#" || page == "") {
      body = <DevicesPage handleDrawerToggle={handleDrawerToggle} />;
    } else if (page === "#/sync") {
      body = <SyncPage handleDrawerToggle={handleDrawerToggle} />;
    } else if (page === "#/apps") {
      body = (
        <AppsPage filter="installed" handleDrawerToggle={handleDrawerToggle} />
      );
    } else if (page === "#/apps/new") {
      body = (
        <AppsPage filter="available" handleDrawerToggle={handleDrawerToggle} />
      );
    } else if (page === "#/docs/") {
      body = (
        <iframe className="app" src="/docs/" />
      );
    } else if ((match = page.match(sensorRegExp))) {
      body = (
        <SensorPage
          deviceID={match[1]}
          sensorID={match[2]}
          clouds={clouds}
          handleDrawerToggle={handleDrawerToggle}
        />
      );
    } else if ((match = page.match(actuatorRegExp))) {
      body = (
        <ActuatorPage
          deviceID={match[1]}
          actuatorID={match[2]}
          clouds={clouds}
          handleDrawerToggle={handleDrawerToggle}
        />
      );
    } else if ((match = page.match(deviceRegExp))) {
      body = (
        <DevicePage
          deviceID={match[1]}
          handleDrawerToggle={handleDrawerToggle}
        />
      );
    } else if ((match = page.match(appsRegExp))) {
      body = <AppsProxyComp app={match[1]} path={match[2]} />;
    }
    else if (page === "#/login") {
      return (
        <LoginPage />
      );
    } else if (page === "#/profile") {
      body = (
        <UserProfilePage />
      );
    } else if (page === "#/logout") {
      doLogout();
    } else {
      body = (
        <ErrorPage
          handleDrawerToggle={handleDrawerToggle}
          error={`Page not found.\nThere is nothing at \"${page}\".`}
        />
      );
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>{body}</main>
    </div>
  );
};

// export class DashboardComp extends React.Component<{}, State> {
//   menu: MenuItem[] = [
//     {
//       label: "Dashboard",
//       icon: `dist/${icons}#dashboard`,
//       href: "#/",
//       items: []
//     },
//     {
//       label: "Synchronization",
//       icon: `dist/${icons}#clouds`,
//       href: "#/clouds",
//       items: []
//     },
//     {
//       label: "Apps",
//       icon: `dist/${icons}#apps`,
//       href: "#/apps",
//       items: []
//     }
//   ];

//   constructor(props: {}) {
//     super(props);

//     this.onHandleHashChange = this.onHandleHashChange.bind(this);
//     var page = location.hash;
//     if (page.length < 2) {
//       location.hash = page = "#/";
//     }

//     this.state = {
//       page,
//       loading: {
//         pending: 0
//       }
//     };

//     window.addEventListener("hashchange", this.onHandleHashChange, false);

//     this.load();
//   }

//   async load() {
//     (window as any)["dashboard"] = {
//       dashboard: this
//     };

//     var apps = await gateway.getApps();
//     var pending = apps ? apps.length : 0;
//     if (pending === 0) {
//       this.setState({ loading: null });
//       return;
//     }
//     this.setState({
//       loading: { pending }
//     });
//     apps.forEach(async app => {
//       var appInfo = (await gateway.getApp(app.id)) as any;

//       if (
//         !appInfo ||
//         Object.getOwnPropertyNames(appInfo).length == 0 ||
//         !appInfo.package ||
//         Object.getOwnPropertyNames(appInfo.package).length == 0
//       ) {
//         var pending = this.state.loading.pending - 1;
//         this.setState({ loading: { pending } });
//         if (pending <= 0) this.completeHook();
//         return;
//       }
//       var wazigatePkg = (await appInfo.package) as WazigatePkg;
//       if (wazigatePkg.menu) {
//         this.menu.push(...wazigatePkg.menu);
//       }
//       if (wazigatePkg.hook) {
//         loadHook(app.id, wazigatePkg.hook);
//       } else {
//         this.completeHook();
//       }
//     });
//   }

//   addMetaHandler(meta: string, handler: MetaHandler) {
//     if (meta in metaHandler) {
//       metaHandler[meta].push(handler);
//     } else {
//       metaHandler[meta] = [handler];
//     }
//   }

//   getMetaHandler(meta: string) {
//     return metaHandler[meta] || [];
//   }

//   completeHook() {
//     if (--this.state.loading.pending <= 0) {
//       this.setState({ loading: null });
//     }
//   }

//   onHandleHashChange() {
//     this.navigate(location.hash);
//   }

//   navigate(page: string) {
//     this.setState({ page });
//   }

//   render() {
//     var page = this.state.page;
//     var match: RegExpMatchArray;

//     if (this.state.loading) {
//       return (
//         <div className="loading">
//           Loading, please wait. Pending: {this.state.loading.pending} apps.
//         </div>
//       );
//     }

//     if (page == "#/") {
//       var pageComp = <DevicesPageComp />;
//     } else if (page === "#/apps") {
//       var pageComp = <AppsPageComp filter="installed" />;
//     } else if (page === "#/apps/new") {
//       var pageComp = <AppsPageComp filter="available" />;
//     } else if ((match = page.match(appsRegExp))) {
//       var pageComp = <AppsProxyComp app={match[1]} path={match[2]} />;
//     } else {
//       var pageComp = (
//         <ErrorComp
//           error={`Page not found.\nThere is nothing at \"${page}\".`}
//         />
//       );
//     }

//     return (
//       <div className="dashboard">
//         <div id="menu">{this.menu.map(menu)}</div>
//         <div id="statusbar"></div>
//         {pageComp}
//       </div>
//     );
//   }
// }

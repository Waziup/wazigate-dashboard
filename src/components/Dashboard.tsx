import React, { useState, Fragment, useEffect } from "react";
import { AppsPageComp } from "./Apps";
import SensorPage from "./pages/Sensor";
import DevicePage from "./pages/Device";
import DevicesPage from "./pages/Devices";
import ErrorPage from "./pages/Error";
import waziup, { MenuHook, App } from "waziup";
import { AppsProxyComp } from "./AppsProxy";
import SyncIcon from '@material-ui/icons/Sync';
import WifiIcon from '@material-ui/icons/Wifi';
import RouterIcon from '@material-ui/icons/Router';
import AppsIcon from '@material-ui/icons/Apps';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import SettingsIcon from '@material-ui/icons/Settings';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import wazigateImage from "../img/wazigate.svg";
import clsx from "clsx";

import {
  Collapse,
  ListItemText,
  ListItem,
  ListItemIcon,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  List,
  Button
} from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SyncPage from "./pages/Sync";

// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "bootstrap-css-only/css/bootstrap.min.css";
// import "mdbreact/dist/css/mdb.css";

interface State {
  page: string;
  loading: {
    pending: number;
  };
}

const appsRegExp = /^#\/apps\/([\.a-zA-Z0-9_-]+)\/(.+)/;
const sensorRegExp = /^#\/devices\/([\.a-zA-Z0-9_-]+)\/sensors\/([\.a-zA-Z0-9_-]+)$/;
const deviceRegExp = /^#\/devices\/([\.a-zA-Z0-9_-]+)$/;

// var menu = (item: MenuItem) => {
//   return (
//     <a
//       key={`${item.label}${item.href}`}
//       className="menu-item"
//       href={item.href}
//       target={item.target || "_self"}
//     >
//       <IconComp className="item-icon" src={item.icon} />
//       <span className="item-name">{item.label}</span>
//     </a>
//   );
// };

// type WazigatePkg = {
//   menu: MenuItem[];
//   hook: string;
// };

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: "100%",
      background: "#f1f1f1",
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
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
      }
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
      }
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
  }),
);

hooks.setMenuHook("dashboard", {
  primary: "Dashboard",
  icon: <DashboardIcon />,
  href: "#",
  target: "",
}, 20);
hooks.setMenuHook("sync", {
  primary: "Sync",
  icon: <SyncIcon />,
  href: "#/sync",
}, 40);
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
hooks.setMenuHook("apps", {
  primary: "Apps",
  icon: <AppsIcon />,
  href: "#/apps",
}, 80);

type MQTTState = "disconnected" | "connecting" | "connected" | "error";

export const DashboardComp = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [mqttState, setMQTTState] = useState<MQTTState>("connecting");

  useEffect(() => {
    wazigate.connectMQTT(() => {
      console.log("MQTT Connected.");
      setMQTTState("connected");
    }, (err: Error) => {
      console.error("MQTT Err", err);
      setMQTTState("error");
    })
    return () => {
      wazigate.disconnectMQTT(() => {
        console.log("MQTT Disconnected.");
      })
    }
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [page, setPage] = useState(location.hash);

  const [apps, setApps] = useState(null);

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setPage(location.hash);
      setMobileOpen(false);
    });

    wazigate.getApps().then((apps) => {
      if (apps === null) {
        console.error("The server reported no apps.");
        setApps([]);
      } else {
        Promise.allSettled(apps.map((app, i) => {
          const menu = app.waziapp?.menu;
          if (menu) {
            for (const id in menu) {
              const item = menu[id];
              if (item.iconSrc) item.iconSrc = wazigate.toProxyURL(app.id, item.iconSrc);
              hooks.setMenuHook(id, item, item.prio);
            }
          }
          const hook = app.waziapp?.hook;
          if (!hook) return Promise.resolve(null);
          return hooks.load(wazigate.toProxyURL(app.id, hook));
        })).then(pen => {
          console.log("Apps loaded:", pen);
          setApps(apps);
        });
      }
    });
  }, []);

  const [openMenues, setOpenMenues] = useState(new Set<string>());
  const handleMenuItemClick = (id: string) => {
    setOpenMenues((openMenues) => {
      if (!openMenues.has(id)) {
        openMenues.add(id);
        return new Set(openMenues);
      }
      return openMenues;
    });
  }

  const handleMenuOpenerClick = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenues((openMenues) => {
      openMenues.add(id);
      return new Set(openMenues);
    });
  }

  const handleMenuCloserClick = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenues((openMenues) => {
      openMenues.delete(id);
      return new Set(openMenues);
    });
  }

  //   const inflateMenuItem(id: string) {

  //   }

  //   const menuItem = (id: string) => {
  //     const item = hooks.get(id)[0] as MenuItem;
  //     const subItems = menuItems(id);
  //   }


  const menuItem = (id: string, item: MenuHook) => {
    const open = openMenues.has(id);
    const subItems = hooks.getAtPrio(id);
    const icon = item.icon ? item.icon : item.iconSrc ? <img className={classes.menuIcon} src={item.iconSrc} /> : null;
    return (
      <Fragment key={id}>
        <ListItem
          component="a"
          button
          key={id}
          href={item.href}
          onClick={subItems.length !== 0 ? handleMenuItemClick.bind(null, id) : null}
          className={`${classes.a} ${hooks.depth(id) >= 2 ? classes.nested : ""}`}
        >
          <ListItemIcon className={classes.drawerIcon}>
            {icon}
          </ListItemIcon>
          <ListItemText primary={item.primary} />
          {subItems.length !== 0 ? (open ?
            <ExpandLess onClick={handleMenuCloserClick.bind(null, id)} /> :
            <ExpandMore onClick={handleMenuOpenerClick.bind(null, id)} />
          ) : null}
        </ListItem>
        {subItems.length != 0 ?
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {subItems.map(([id, item]) => menuItem(id, item))}
            </List>
          </Collapse>
          : null}
      </Fragment>
    );
  }

  var mqttStateName: string;
  var mqttStateClass: string = "";
  switch (mqttState) {
    case "connected":
      mqttStateName = "Connected";
      mqttStateClass = classes.statusConnected;
      break;
    case "connecting":
      mqttStateName = "Connecting ...";
      break;
    case "disconnected":
      mqttStateName = "Disconnected";
      break;
    case "error":
      mqttStateName = "Error";
      mqttStateClass = classes.statusError;
      break;
  }

  const drawer = (
    <Fragment>
      <div className={classes.toolbar} />
      <Divider />
      <List className={classes.menu}>
        {hooks.getAtPrio("menu").map(([id, item]) => menuItem(id, item))}
      </List>
      <Button
        size="small"
        className={clsx(classes.status, mqttStateClass)}
        startIcon={mqttState === "connected" ? <LinkIcon /> : <LinkOffIcon />}
      >
        {mqttStateName}
      </Button>
    </Fragment>
  );

  var body: JSX.Element;
  var match: RegExpMatchArray;

  if (apps === null) {
    body = <div>Loading... Please wait.</div>
  } else {
    if (page == "#/" || page == "#" || page == "") {
      body = <DevicesPage handleDrawerToggle={handleDrawerToggle} />;
    } else if (page === "#/sync") {
      body = <SyncPage handleDrawerToggle={handleDrawerToggle} />;
    } else if (page === "#/apps") {
      body = <AppsPageComp filter="installed" />;
    } else if (page === "#/apps/new") {
      body = <AppsPageComp filter="available" />;
    } else if ((match = page.match(sensorRegExp))) {
      body = <SensorPage deviceID={match[1]} sensorID={match[2]} handleDrawerToggle={handleDrawerToggle} />;
    } else if ((match = page.match(deviceRegExp))) {
      body = <DevicePage deviceID={match[1]} handleDrawerToggle={handleDrawerToggle} />;
    } else if ((match = page.match(appsRegExp))) {
      body = <AppsProxyComp app={match[1]} path={match[2]} />;
    } else {
      body = <ErrorPage
        handleDrawerToggle={handleDrawerToggle}
        error={`Page not found.\nThere is nothing at \"${page}\".`}
      />;
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
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
      <main className={classes.content}>
        {body}
      </main>
    </div>
  );
}

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
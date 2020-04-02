import React, { useState } from "react";
import { DevicesPage } from "./DevicesPage";
import { ErrorComp } from "./Error";
import { AppsPageComp } from "./Apps";
import icons from "../img/icons.svg";
import { IconComp } from "./Icon";
import * as waziup from "waziup";
import { AppsProxyComp } from "./AppsProxy";
import { MetaHandler, metaHandler } from "./devices/Entity";
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import SyncIcon from '@material-ui/icons/Sync';
import MenuIcon from '@material-ui/icons/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import wazigateImage from "../img/wazigate.svg";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

declare var gateway: waziup.Waziup;

type MenuItem = {
  icon: string;
  label: string;
  href: string;
  items?: MenuItem[];
  target?: string;
};

interface State {
  page: string;
  loading: {
    pending: number;
  };
}

const appsRegExp = /^#\/apps\/([\.a-zA-Z0-9_-]+)\/(.+)/;

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
      height: "100%",
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
      "&:before": {
        content: "''",
        background: `url('dist/${wazigateImage}')`,
        backgroundSize: "120px 78px",
        position: "absolute",
        bottom: "10px",
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
      background: "#f1f1f1",
      // padding: theme.spacing(3),
    },
  }),
);

export const DashboardComp = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [page, setPage] = useState(location.hash);

  const [apps, setApps] = useState(null);
  if(apps === null) gateway.getApps().then(setApps);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button key="dashboard" onClick={setPage.bind(null, "#")}>
          <ListItemIcon className={classes.drawerIcon}><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="sync" onClick={setPage.bind(null, "#/sync")}>
          <ListItemIcon className={classes.drawerIcon}><SyncIcon /></ListItemIcon>
          <ListItemText primary="Sync" />
        </ListItem>
        <ListItem button key="settings" onClick={setPage.bind(null, "#/settings")}>
          <ListItemIcon className={classes.drawerIcon}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button key="apps" onClick={setPage.bind(null, "#/apps")}>
          <ListItemIcon className={classes.drawerIcon}><AppsIcon /></ListItemIcon>
          <ListItemText primary="Apps" />
        </ListItem>
      </List>
    </div>
  );

  var body: JSX.Element;
  var match: RegExpMatchArray;

  if (apps === null) {
    body = <div>Loading... Please wait.</div>
  } else {
    if (page == "#/" || page == "#" || page == "") {
      body = <DevicesPage handleDrawerToggle={handleDrawerToggle}/>;
    } else if (page === "#/apps") {
      body = <AppsPageComp filter="installed" />;
    } else if (page === "#/apps/new") {
      body = <AppsPageComp filter="available" />;
    } else if ((match = page.match(appsRegExp))) {
      body = <AppsProxyComp app={match[1]} path={match[2]} />;
    } else {
      body = (
        <ErrorComp
          error={`Page not found.\nThere is nothing at \"${page}\".`}
        />
      );
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
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

// function loadHook(app: string, hook: string) {
//   return new Promise((resolve, reject) => {
//     var script = document.createElement("script");
//     // var rnd = `${Math.random()}`.slice(2);
//     // hooks[rnd] = () => {
//     //     delete hooks[rnd];
//     //     resolve();
//     // }
//     // script.setAttribute("data-hook", rnd);
//     script.src = gateway.toProxyURL(app, hook);
//     document.head.appendChild(script);
//   });
// }

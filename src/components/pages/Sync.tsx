import React, { useState, useEffect } from "react";
import { Device, Waziup, Cloud } from "waziup";
import { DeviceComp } from "./devices/Device";
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import {
    Fab,
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    makeStyles,
} from "@material-ui/core";
import { CloudComp } from "./sync/Clouds";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: "64px",
    },
    body: {
        padding: theme.spacing(1),
        textAlign: "center",
    },
    cloud: {
        margin: theme.spacing(2),
        textAlign: "left",
    },
    fab: {
        background: "#f35e19",
        outline: "none",
        position: "fixed",
        right: "12px",
        bottom: "12px",
        "&:hover": {
            background: "#f38c5c",
        },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      background: "#f1f1f1",
      color: "unset",
      boxShadow: "0 0 2px #f1f1f1",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    appBarInner: {
        padding: "0",
    },
    heading: {
        // fontWeight: "lighter",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
}));

type Props = {
    handleDrawerToggle: () => void;
};

export default function SyncPage({handleDrawerToggle}: Props) {
    const classes = useStyles();

    const [clouds, setClouds] = useState(null as Cloud[]);
    useEffect(() => {
        wazigate.getClouds().then((clouds) => setClouds(Object.values(clouds)));
    }, []);

    var body: React.ReactNode;
    if(clouds === null) {
        body = "Loading... please wait.";
    } else if(clouds.length === 0) {
        body = "There are no clouds yet."
    } else {
        body = clouds.map((cloud) => {
            return (
                <CloudComp
                    key={cloud.id}
                    className={classes.cloud}
                    cloud={cloud}
                />
            );
        })
    }

    return (
        <div className={classes.page}>
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
                    <Typography variant="h6" noWrap className={classes.heading}>
                        Synchronization
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.body}>{body}</div>
            {/* <Fab onClick={createDevice} className={classes.fab} aria-label="add">
                <AddIcon />
            </Fab> */}
        </div>
    );
}
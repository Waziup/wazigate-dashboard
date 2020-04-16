import React, { useState } from "react";
import { Device, Waziup } from "waziup";
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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: "64px",
    },
    body: {
        padding: theme.spacing(1),
        textAlign: "center",
    },
    device: {
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

export default function DevicesPage({handleDrawerToggle}: Props) {
    const classes = useStyles();

    const [devices, setDevices] = useState(null as Device[]);
    if (devices === null) wazigate.getDevices().then(setDevices);

    const createDevice = () => {
        var deviceName = prompt('Please insert a new device name:', '');
        if (deviceName) {
            var device: Device = {
                name: deviceName,
                id: "123456",
                sensors: [],
                actuators: [],
                meta: {},
                modified: new Date(),
                created: new Date(),
            };
            setDevices(devices => [...devices, device]);
        }
    }

    var body: React.ReactNode;
    if(devices === null) {
        body = "Loading... please wait.";
    } else if(devices.length === 0) {
        body = "There are no devices yet. Click '+' to add a new device."
    } else {
        body = devices.map((device) => (
            <DeviceComp
                key={device.id}
                className={classes.device}
                device={device}
            />
        ))
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
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.body}>{body}</div>
            <Fab onClick={createDevice} className={classes.fab} aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    );
}
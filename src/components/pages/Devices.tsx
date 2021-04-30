import React, { useState, useEffect } from "react";
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
    Button,
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
        [theme.breakpoints.down('sm')]: {
            margin: theme.spacing(1),
            width: `calc(100% - ${theme.spacing(2)}px)`,
        }
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

export default function DevicesPage({ handleDrawerToggle }: Props) {
    const classes = useStyles();

    const [devices, setDevices] = useState(null as Device[]);
    useEffect(() => {
        loadGwId();
        wazigate.getDevices().then(setDevices);

        const cb = (device: Device) => {
            console.log("A device was created remotely.", device);
            wazigate.getDevices().then(setDevices);
        };
        wazigate.subscribe<Device>("devices", cb);
        return () => wazigate.unsubscribe("devices", cb);
    }, []);

    const [gwID, setGwID] = useState(null as string);
    const loadGwId = async () => {
        var id = await wazigate.getID();
        console.log("Gateway ID:", id);
        setGwID(id);
    }

    const createDevice = async () => {
        var deviceName = prompt('Please insert a new device name:', '');
        if (deviceName) {
            var device: Device = {
                id: "",
                name: deviceName,
                sensors: [],
                actuators: [],
                meta: {},
                modified: new Date(),
                created: new Date(),
            };
            const id = await wazigate.addDevice(device);
            device.id = id;
            setDevices(devices => [...devices, device]);
        }
    }

    var body: React.ReactNode;
    if (devices === null || gwID === null) {
        body = "Loading... please wait.";
    } else if (devices.length === 0) {
        body = "There are no devices yet. Click '+' to add a new device."
    } else {
        body = devices.map((device) => {
            const handleDeviceDelete = () => {
                setDevices(devices => devices.filter(d => d.id != device.id));
            }
            return (
                <DeviceComp
                    key={device.id}
                    className={classes.device}
                    device={device}
                    isGateway={gwID == device.id}
                    onDelete={handleDeviceDelete}
                />
            );
        })
    }

    // We use it only for test and that can be triggered like so:
    // document.querySelector("#deleteAll").click()
    // in the web console
    const [deleteProgress, setDeleteProgress] = useState(0);
    const deleteAllDevices = () => {
        if (!confirm(`Delete all devicees?\nThis will delete all devices, all of their sensors and actuators and all data values.\n\nThis cannot be undone!`)) {
            return;
        }
        devices.forEach(device => {
            if (device.id != gwID) {
                // console.log(`Deleting [ ${device.id} ]...`)
                wazigate.deleteDevice(device.id).then(() => {
                    console.log(`[ ${device.id} ] Deleted!`)
                });
            }
        });
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
                <Button style={{ display: "none" }} id="deleteAll" onClick={deleteAllDevices}>Delete All devices {deleteProgress != 0 && `( ${deleteProgress} items deleted )`}</Button>
            </AppBar>
            <div className={classes.body}>{body}</div>
            <Fab onClick={createDevice} className={classes.fab} aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    );
}
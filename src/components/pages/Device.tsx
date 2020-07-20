import React, { Fragment, useState, MouseEvent } from "react";
import { Device, Waziup, Sensor, Actuator } from "waziup";
import MenuIcon from '@material-ui/icons/Menu';
import RemoveIcon from '@material-ui/icons/Remove';
import Error from "../Error";
import {default as SensorComp} from "./device/Sensor";
import {default as ActuatorComp} from "./device/Actuator";
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddIcon from '@material-ui/icons/Add';
import RouterIcon from '@material-ui/icons/Router';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import HookRegistry, { DeviceHook, DeviceHookProps, DeviceMenuHook, MenuHookProps } from "../../HookRegistry";


import {
    AppBar,
    IconButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    makeStyles,
    InputLabel,
    FormControl,
    TextField,
    MenuItem,
    Select,
    Breadcrumbs,
    Link,
    Menu,
    Paper,
    Grow,
    colors,
} from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: "64px",
        paddingBottom: "64px",
    },
    deviceHead: {
        margin: theme.spacing(3),
        padding: theme.spacing(2),
        border: "1px solid rgba(0, 0, 0, 0.12)",
        background: "white",
        borderRadius: "4px",
    },
    speedDial: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        whiteSpace: "nowrap",
    },
    speedDialIcon: {
        background: "#f35e19",
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
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(3),
    },
    name: {
        flexGrow: 1,
    },
    appBarInner: {
        padding: "0",
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    breadcrumbs: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(4),
    },
    icon: {
        width: "24px",
        height: "24px",
        marginRight: "10px",
    },
    sensors: {
        padding: theme.spacing(1),
        textAlign: "center",
    },
    sensor: {
        margin: theme.spacing(1),
        textAlign: "left",
        display: "inline-block",
        verticalAlign: "top",
        width: 340,
        // columnCount: 1,
        // [theme.breakpoints.up(990)]: {
        //     columnCount: 2,
        // },
        [theme.breakpoints.down('sm')]: {
            width: `calc(100% - ${theme.spacing(2)}px)`,
        },

    },
    actuators: {
        padding: theme.spacing(1),
        textAlign: "center",
    },
    actuator: {
        margin: theme.spacing(1),
        textAlign: "left",
        display: "inline-block",
        verticalAlign: "top",
        width: 340,
        [theme.breakpoints.down('sm')]: {
            width: `calc(100% - ${theme.spacing(2)}px)`,
        },

    },
    margin: {
        margin: theme.spacing(1),
    },
    kind: {
        [theme.breakpoints.up('sm')]: {
            width: "340px",
        },
        width: "calc(100% - 18px)",
        verticalAlign: "top",
        display: "inline-block",
        margin: theme.spacing(1),
    },
    kindInput: {
        paddingTop: "6px !important",
        paddingBottom: "6px !important",
    },
    quantity: {
        verticalAlign: "top",
        display: "inline-block",
        margin: theme.spacing(1),
    },
    unit: {
        verticalAlign: "top",
        display: "inline-block",
        margin: theme.spacing(1),
    },
    kindIcon: {
        width: "1.5em",
        height: "1.5em",
        marginLeft: ".5em",
    },
    submitHead: {},
    buttonProgress: {
        color: colors.green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    submitHeadWrapper: {
        margin: theme.spacing(1),
        display: "inline-block",
        verticalAlign: "bottom",
        position: 'relative',
    }
}));

// hooks.addDeviceMenuHook((props: DeviceHookProps & MenuHookProps) => {
//     const {
//         device,
//         handleMenuClose,
//         setDevice
//     } = props;
//     const handleClick = () => {
//         handleMenuClose();
//         setDevice((device: Device) => ({
//             ...device,
//             meta: {
//                 ...device.meta,
//                 lorawan: {
//                     DevEUI: null,
//                 }
//             }
//         }));
//         // gateway.setDeviceMeta(device.id, {
//         //     lorawan: {
//         //         DevEUI: null,
//         //     }
//         // })
//     }

//     if (device === null || device.meta.lorawan) {
//         return null;
//     }

//     return (
//         <MenuItem onClick={handleClick} key="waziup.wazigate-lora">
//             <ListItemIcon>
//                 <RouterIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText primary="Make LoRaWAN" secondary="Declare as LoRaWAN device" />
//         </MenuItem>
//     );
// })

// hooks.addDeviceMenuHook(({device, handleMenuClose}: DeviceHookProps & MenuHookProps) => {

//     const handleClick = () => {
//         handleMenuClose();
//     }

//     return (
//         <MenuItem onClick={handleClick} key="waziup.wazigate-bluetooth">
//             <ListItemIcon>
//                 <BluetoothIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText primary="Make Bluetooth" secondary="Declare as Bluetooth device" />
//         </MenuItem>
//     );
// })

// const useStylesLoRaWAN = makeStyles((theme) => ({
//     root: {
//         overflow: "auto",
//     },
//     scrollBox: {
//         padding: theme.spacing(2),
//         minWidth: "fit-content",
//     },
//     paper: {
//         background: "lightblue",
//         minWidth: "fit-content",
//     },
//     name: {
//         flexGrow: 1,
//     },
//     body: {
//         padding: theme.spacing(2),
//     },
//     shortInput: {
//         width: "200px",
//     },
//     longInput: {
//         width: 400,
//         maxWidth: "100%",
//     },
// }));

// hooks.addDeviceHook((props: DeviceHookProps) => {
//     const classes = useStylesLoRaWAN();
//     const {
//         device,
//         setDevice
//     } = props;

//     const [profile, setProfile] = useState("");

//     const lorawan = device?.meta["lorawan"];

//     const handleProfileChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//         setProfile(event.target.value as string);
//     };

//     const handleRemoveClick = () => {
//         if(confirm("Do you want to remove the LoRaWAN settings from this device?")) {
//             setDevice((device: Device) => ({
//                 ...device,
//                 meta: {
//                     ...device.meta,
//                     lorawan: undefined
//                 }
//             }));
//         }
//     }

//     return (
//         <div className={classes.root}><div className={classes.scrollBox}>
//         <Grow in={!!lorawan} key="waziup.wazigate-lora">
//         <Paper variant="outlined" className={classes.paper}>
//             <Toolbar variant="dense">
//                 <IconButton edge="start">
//                     <RouterIcon />
//                 </IconButton>
//                 <Typography variant="h6" noWrap className={classes.name}>
//                     LoRaWAN Settings
//                 </Typography>
//                 <IconButton onClick={handleRemoveClick}>
//                     <RemoveIcon />
//                 </IconButton>
//             </Toolbar>
//             <div className={classes.body}>
//                 <FormControl className={classes.shortInput}>
//                     <InputLabel id="lorawan-profile-label">LoRaWAN Profile</InputLabel>
//                     <Select
//                         labelId="lorawan-profile-label"
//                         id="lorawan-profile"
//                         value={profile}
//                         onChange={handleProfileChange}
//                     >
//                         <MenuItem value="WaziDev">WaziDev</MenuItem>
//                         <MenuItem value="">Other</MenuItem>
//                     </Select>
//                 </FormControl><br />
//                 { profile === "WaziDev" ? (
//                     <Fragment>
//                         <TextField id="lorawan-devaddr" label="DevAddr (Device Address)" className={classes.shortInput}/><br />
//                         <TextField id="lorawan-nwskey" label="NwkSKey (Network Session Key)" className={classes.longInput}/><br />
//                         <TextField id="lorawan-appkey" label="AppKey (App Key)" className={classes.longInput}/>
//                     </Fragment>
//                 ): null }
//             </div>
//         </Paper>
//         </Grow>
//         </div></div>
//     );
// });

type Props = {
    handleDrawerToggle: () => void;
    deviceID: string;
};

export default function SensorPage({deviceID, handleDrawerToggle}: Props) {
    const classes = useStyles();

    const [device, setDevice] = useState<Device>(null);
    const [error, setError] = useState<Error>(null);
    if (error === null && device === null) {
        wazigate.getDevice(deviceID).then(setDevice, setError);
    }

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const handleMenuClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setMenuAnchorEl(event.currentTarget);
    };
    const handleMenuMouseDown = (event: MouseEvent) => {
        event.stopPropagation();
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };
    const handleRenameClick = () => {
        const newDeviceName = prompt("New device name:", device.name);
        if (newDeviceName) {
            setDevice(device => ({
                ...device,
                name: newDeviceName
            }));
        }
        handleMenuClose();
    }

    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const handleSpeedDialOpen = () => {
        setSpeedDialOpen(true);
    };
    const handleSpeedDialClose = () => {
        setSpeedDialOpen(false);
    };
    const handleCreateSensorClick = () => {
        handleSpeedDialClose();
        var sensorName = prompt('Please insert a new sensor name:', '');
        if (sensorName) {
            var sensor: Sensor = {
                name: sensorName,
                id: "",
                meta: {},
                value: null,
                time: null,
                modified: new Date(),
                created: new Date(),
            };
            wazigate.addSensor(deviceID, sensor).then(id => {
                sensor.id = id;
                setDevice(device => {
                    device.sensors.push(sensor);
                    return {...device};
                });
            }, (err: Error) => {
                alert("There was an error creating the sensor:\n"+err);
            });
        }
    }

    const handleCreateActuatorClick = () => {
        handleSpeedDialClose();
        var actuatorName = prompt('Please insert a new actuator name:', '');
        if (actuatorName) {
            var actuator: Actuator = {
                name: actuatorName,
                id: "",
                meta: {},
                value: null,
                time: null,
                modified: new Date(),
                created: new Date(),
            };
            wazigate.addActuator(deviceID, actuator).then(id => {
                actuator.id = id;
                setDevice(device => {
                    device.actuators.push(actuator);
                    return {...device};
                });
            }, (err: Error) => {
                alert("There was an error creating the actuator:\n"+err);
            });
        }
    }


    var body: React.ReactNode;
    if(device === null && error === null) {
        body = "Loading... please wait.";
    } else if (error != null) {
        body = <Error error={error} />
    } else {
        body = (
            <>
                <div className={classes.sensors}>
                    { device.sensors.map(sensor => (
                        <SensorComp
                            key={sensor.id}
                            className={classes.sensor}
                            deviceID={deviceID}
                            sensor={sensor}
                        />
                    )) }
                </div>
                <div className={classes.actuators}>
                    { device.actuators.map(actuator => (
                        <ActuatorComp
                            key={actuator.id}
                            className={classes.sensor}
                            deviceID={deviceID}
                            actuator={actuator}
                        />
                    )) }
                </div>
            </>
        )
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
                    <Typography variant="h6" noWrap className={classes.name}>
                        { error ? `Device ${deviceID}` : (device ? device.name : "...") }
                    </Typography>
                    <IconButton
                        aria-label="settings"
                        aria-controls="device-menu"
                        aria-haspopup="true"
                        onClick={handleMenuClick}
                        onMouseDown={handleMenuMouseDown}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Menu
                id="sensor-menu"
                anchorEl={menuAnchorEl}
                keepMounted
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleRenameClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>

                { hooks.get<DeviceMenuHook>("device.menu").map((Hook, i) =>
                    <Hook
                        key={i}
                        device={device}
                        handleMenuClose={handleMenuClose}
                        setDevice={setDevice}
                    />
                ) }

            </Menu>
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                <Link color="inherit" href="#">Devices</Link>
                <Link
                    color="textPrimary"
                    href={`#/devices/${deviceID}`}
                    aria-current="page"
                >
                    {deviceID}
                </Link>
            </Breadcrumbs>
            <SpeedDial
                ariaLabel="Create Entity"
                className={classes.speedDial}
                FabProps={{className: classes.speedDialIcon}}
                icon={<SpeedDialIcon />}
                onClose={handleSpeedDialClose}
                onOpen={handleSpeedDialOpen}
                open={speedDialOpen}
            >
                <SpeedDialAction
                    icon={<AddIcon />}
                    tooltipTitle="Sensor"
                    tooltipOpen
                    onClick={handleCreateSensorClick}
                />
                <SpeedDialAction
                    icon={<AddIcon />}
                    tooltipTitle="Actuator"
                    tooltipOpen
                    onClick={handleCreateActuatorClick}
                />
            </SpeedDial>

            { body }

            { hooks.get<DeviceHook>("device").map((Hook, i) =>
                <Hook
                    key={i}
                    device={device}
                    setDevice={setDevice as (device: Device) => Device}
                />
            ) }
        </div>
    );
}
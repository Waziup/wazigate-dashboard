import React, { Fragment, useState, MouseEvent, useEffect } from "react";
import { Waziup, Sensor, CloudStatus, CloudAction, Cloud } from "waziup";
import Error from "../Error";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete/Autocomplete";
import ontologies from "../../ontologies.json";
import ontologiesSprite from "../../img/ontologies.svg";
import SVGSpriteIcon from "../SVGSpriteIcon";
import SyncStatusIndicator from "../SyncStatusIndicator";
import MenuIcon from '@material-ui/icons/Menu';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloudIcon from '@material-ui/icons/CloudOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import clsx from "clsx";

import Chart from "../Chart/Chart"

import {
    AppBar,
    IconButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    makeStyles,
    InputLabel,
    InputAdornment,
    FormControl,
    TextField,
    MenuItem,
    Select,
    Button,
    CircularProgress,
    Snackbar,
    Breadcrumbs,
    Link,
    Menu,
    colors,
    Tabs,
    Tab,
    Box,
    Paper,
    FormGroup,
    FormControlLabel,
    Switch,
    Grow,
    Badge
} from '@material-ui/core';
import SyncIntervalInput from "../SyncIntervalInput";
import { OntologyKindInput } from "../OntologyKindInput";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: "64px",
        display: "flex",
        flexDirection: "column",
    },
    deviceHead: {
        margin: theme.spacing(3),
        padding: theme.spacing(2),
        border: "1px solid rgba(0, 0, 0, 0.12)",
        background: "white",
        borderRadius: "4px",
    },
    fab: {
        background: "#f35e19",
        outline: "none",
        position: "absolute",
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
    },
    smallInput: {
        width: 160,
        margin: theme.spacing(1),
    },
    headBar: {
        background: "none",
        boxShadow: "none",
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    normalMargin: {
        margin: theme.spacing(1),
    },
    submitChanges: {
        margin: theme.spacing(1),
    },
    submitChangesBtn: {
        marginRight: theme.spacing(2),
    },
    tabPanel: {
        display: "flex",
        flexDirection: "column",
    }
}));

type Props = {
    handleDrawerToggle: () => void;
    deviceID: string;
    sensorID: string;
    clouds: Cloud[],
};

type Kind = string;
type Unit = string;
type Quantity = string;

interface TabPanelProps {
    children?: React.ReactNode;
    className?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Paper
            square
            role="tabpanel"
            hidden={value !== index}
            id={`sensor-tabpanel-${index}`}
            aria-labelledby={`sensor-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>{children}</Box>
            )}
        </Paper>
    );
}

interface DirtyIndicatorProps {
    children?: React.ReactNode;
    className?: string;
    visible: boolean;
}

const useDirtyIndicatorStyles = makeStyles((theme) => ({
    root: {
    },
    bullet: {
        fontSize: "1.6em",
        lineHeight: 0,
        verticalAlign: "middle",
    }
}));

function DirtyIndicator(props: DirtyIndicatorProps) {
    const { children, visible, className, ...other } = props;
    const dirtyIndicatorClasses = useDirtyIndicatorStyles();
    return (
        <div className={clsx(dirtyIndicatorClasses.root, className)} {...other}>
            {visible ? <span className={dirtyIndicatorClasses.bullet}>• </span> : null}
            {children}
        </div>
    );
}

function tabProps(index: any) {
    return {
        id: `sensor-tab-${index}`,
        'aria-controls': `sensor-tabpanel-${index}`,
    };
}

type EntityStatus = {
    action: CloudAction[];
    remote: Date;
    sleep: number;
    wakeup: Date;
}

export default function SensorPage(props: Props) {
    const { sensorID, deviceID, handleDrawerToggle, clouds } = props;
    const classes = useStyles();

    const [rSensor, setRemoteSensor] = useState(null as Sensor);
    const [sensor, setSensor] = useState(null as Sensor);
    const [error, setError] = useState(null as Error);

    const [status, setStatus] = useState(null as EntityStatus);
    const [deviceName, setDeviceName] = useState(null);

    useEffect(() => {
        wazigate.getSensor(deviceID, sensorID).then(sensor => {
            setSensor(sensor)
            setRemoteSensor(sensor);
        }, setError);
        const cb = (status: CloudStatus) => {
            if (status.entity.device === deviceID && status.entity.sensor == sensorID) {
                setStatus(status.status);
            }
        };
        wazigate.getDevice(deviceID).then(device => { setDeviceName(device.name) }, setError);
        wazigate.subscribe<CloudStatus>("clouds/+/status", cb);
        return () => {
            wazigate.unsubscribe("clouds/+/status", cb);
        }

    }, []);

    const [sensorMenuAnchor, setSensorMenuAnchor] = useState(null);
    const handleSensorMenuClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setSensorMenuAnchor(event.currentTarget);
    };
    const handleMenuMouseDown = (event: MouseEvent) => {
        event.stopPropagation();
    };
    const handleSensorMenuClose = () => {
        setSensorMenuAnchor(null);
    };
    const handleRenameClick = () => {
        handleSensorMenuClose();
        const oldSensorName = sensor.name;
        const newSensorName = prompt("New sensor name:", oldSensorName);
        if (newSensorName) {
            setSensor(sensor => ({
                ...sensor,
                name: newSensorName
            }));
            wazigate.setSensorName(deviceID, sensorID, newSensorName).then(() => {
                // OK
            }, (err: Error) => {
                setSensor(sensor => ({
                    ...sensor,
                    // revert changes
                    name: oldSensorName
                }));
                alert("There was an error changing the sensor name:\n" + err);
            });
        }
    }
    const handleDeleteClick = () => {
        handleSensorMenuClose();
        if (confirm(`Delete sensor '${sensorID}'?\nThis will delete the sensor and all sensor values.\n\nThis cannot be undone!`)) {
            wazigate.deleteSensor(deviceID, sensorID).then(() => {
                location.href = `#/devices/${deviceID}`;
            }, (err: Error) => {
                alert("There was an error deleting the sensor:\n" + err);
            });
        }
    }

    var kind: Kind = sensor?.meta.kind || "";
    var quantity: Quantity = sensor?.meta.quantity || "";
    var unit: Unit = sensor?.meta.unit || "";

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const handleSnackbarClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const [tab, setTab] = useState(0);
    const handleTabChange = (event: React.ChangeEvent<{}>, i: number) => {
        setTab(i);
    };

    const submitOntology = () => {
        wazigate.setSensorMeta(deviceID, sensorID, {
            kind: kind || null,
            quantity: quantity || null,
            unit: unit || null
        }).then(() => {
            setRemoteSensor(rSensor => ({
                ...rSensor,
                meta: {
                    ...rSensor.meta,
                    kind: sensor.meta.kind,
                    quantity: sensor.meta.quantity,
                    unit: sensor.meta.unit,
                }
            }))
        }, (err: Error) => {
            alert("There was an error saving the metadata:\n" + err)
        });
    }

    const resetOntology = () => {
        setSensor(sensor => ({
            ...sensor,
            meta: {
                ...sensor.meta,
                kind: rSensor.meta.kind,
                quantity: rSensor.meta.quantity,
                unit: rSensor.meta.unit,
            }
        }))
    }

    const resetSync = () => {
        setSensor(sensor => ({
            ...sensor,
            meta: {
                ...sensor.meta,
                syncInterval: rSensor.meta.syncInterval,
                doNotSync: rSensor.meta.doNotSync,
            }
        }))
    }

    const submitSync = () => {
        wazigate.setSensorMeta(deviceID, sensorID, {
            syncInterval: sensor.meta.syncInterval,
            doNotSync: sensor.meta.doNotSync,
        }).then(() => {
            setRemoteSensor(rSensor => ({
                ...rSensor,
                meta: {
                    ...rSensor.meta,
                    syncInterval: sensor.meta.syncInterval,
                    doNotSync: sensor.meta.doNotSync,
                }
            }))
        }, (err: Error) => {
            console.error("There was an error saving the metadata:\n" + err)
        });
    }

    const [sensorData, setSensorData] = useState(null);
    const loadSensorData = () => {
        wazigate.getSensorValues(deviceID, sensorID)
            .then(res => {
                setSensorData(res);
            }, (err: Error) => {
                console.error("There was an error loading sensor data:\n" + err)
            })
    }

    const handleEnableSyncChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = event.target.checked;
        const doNotSync = enabled ? null : true;
        setSensor(sensor => ({
            ...sensor,
            meta: {
                ...sensor.meta,
                doNotSync: doNotSync,
            }
        }));
    }
    const handleSyncIntervalChange = (event: React.ChangeEvent<{}>, value: string) => {
        setSensor(sensor => ({
            ...sensor,
            meta: {
                ...sensor.meta,
                syncInterval: value,
            }
        }));
    }

    var body: React.ReactNode;
    if (sensor === null && error === null) {
        body = "Loading... please wait.";
    } else if (error != null) {
        body = <Error error={error} />
    } else {
        const kindInput = (
            <OntologyKindInput
                value={kind}
                onChange={(event: any, kind: Kind) => {
                    if (kind in ontologies.sensingDevices) {
                        const quantities = ontologies.sensingDevices[kind].quantities;
                        if (!quantities.includes(quantity)) {
                            quantity = quantities[0];
                            if (quantity) {
                                const units = ontologies.quantities[quantity].units
                                unit = units[0] || "";
                            } else {
                                quantity = "";
                                unit = "";
                            }
                        }
                    }
                    setSensor(sensor => ({
                        ...sensor,
                        meta: {
                            ...sensor.meta,
                            kind: kind,
                            quantity: quantity,
                            unit: unit,
                        }
                    }));
                }}
            />
        )
        var quantities: Quantity[] = [];
        if (kind in ontologies.sensingDevices) {
            quantities = ontologies.sensingDevices[kind].quantities;
        }
        var quantityInput: JSX.Element = null;
        if (quantities.length !== 0) {
            quantityInput = (
                <FormControl className={classes.quantity}>
                    <InputLabel id="quantity-select-lebel">Quantity</InputLabel>
                    <Select
                        labelId="quantity-select-lebel"
                        id="quantity-select"
                        value={quantity}
                        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                            if (event.target.value !== quantity) {
                                setSensor(sensor => ({
                                    ...sensor,
                                    meta: {
                                        ...sensor.meta,
                                        quantity: event.target.value as Quantity,
                                    }
                                }));
                            }
                        }}
                    >
                        {quantities.map((quantity) => (
                            <MenuItem value={quantity}>{ontologies.quantities[quantity].label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        }

        var unitInput: JSX.Element = null;
        if (kind in ontologies.sensingDevices && quantity) {
            const units = ontologies.quantities[quantity].units;
            if (units.length !== 0) {
                unitInput = (
                    <FormControl className={classes.unit}>
                        <InputLabel id="unit-select-lebel">Unit</InputLabel>
                        <Select
                            labelId="unit-select-lebel"
                            id="unit-select"
                            value={unit}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                if (event.target.value !== unit) {
                                    setSensor(sensor => ({
                                        ...sensor,
                                        meta: {
                                            ...sensor.meta,
                                            unit: event.target.value as Unit,
                                        }
                                    }));
                                }
                            }}
                        >
                            {ontologies.quantities[quantity].units.map((unit) => (
                                <MenuItem value={unit}>{ontologies.units[unit].label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
        }

        const hasUnsavedOntChanges = (
            rSensor?.meta.unit !== sensor?.meta.unit ||
            rSensor?.meta.kind !== sensor?.meta.kind ||
            rSensor?.meta.quantity !== sensor?.meta.quantity
        )

        const hasUnsavedSyncChanges = (
            (!!rSensor?.meta.doNotSync) !== (!!sensor?.meta.doNotSync) ||
            (rSensor?.meta.syncInterval || null) !== (sensor?.meta.syncInterval || null)
        )

        body = (
            <Fragment>
                <AppBar position="static" className={classes.headBar}>
                    <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                        <Tab label={
                            <Fragment>
                                <DirtyIndicator visible={hasUnsavedOntChanges}>Ontology</DirtyIndicator>
                            </Fragment>
                        } {...tabProps(0)} />
                        <Tab label={
                            <Fragment>
                                <DirtyIndicator visible={hasUnsavedSyncChanges}>Sync</DirtyIndicator>
                            </Fragment>
                        } {...tabProps(1)} />
                        <Tab label={
                            <Fragment>
                                Sensor Readings
                            </Fragment>
                        } {...tabProps(2)} onClick={loadSensorData} />
                    </Tabs>
                </AppBar>

                <TabPanel value={tab} index={0} className={classes.tabPanel}>
                    {kindInput}
                    {quantityInput}
                    {unitInput}
                    <div className={classes.submitChanges}>
                        <Grow in={hasUnsavedOntChanges}>
                            <Button
                                className={classes.submitChangesBtn}
                                variant="contained"
                                color="primary"
                                onClick={submitOntology}
                                startIcon={<SaveIcon />}
                            >
                                Save
                            </Button>
                        </Grow>
                        <Grow in={hasUnsavedOntChanges} timeout={({ enter: 500, exit: 200 })}>
                            <Button
                                className={classes.submitChangesBtn}
                                onClick={resetOntology}
                            >
                                Reset
                            </Button>
                        </Grow>
                    </div>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <FormGroup>
                        <FormControlLabel
                            className={classes.normalMargin}
                            control={
                                <Switch
                                    checked={!sensor.meta.doNotSync}
                                    onChange={handleEnableSyncChange}
                                    name="sensor-sync"
                                    color="primary"
                                />
                            }
                            label="Sync Sensor"
                        />

                        <SyncIntervalInput
                            value={sensor?.meta.syncInterval || "5s"}
                            onChange={handleSyncIntervalChange}
                        />

                        <div className={classes.submitChanges}>
                            <Grow in={hasUnsavedSyncChanges}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.submitChangesBtn}
                                    onClick={submitSync}
                                    startIcon={<SaveIcon />}
                                >
                                    Save
                                </Button>
                            </Grow>
                            <Grow in={hasUnsavedSyncChanges} timeout={({ enter: 500, exit: 200 })}>
                                <Button
                                    className={classes.submitChangesBtn}
                                    onClick={resetSync}
                                >
                                    Reset
                                </Button>
                            </Grow>
                        </div>
                    </FormGroup>
                </TabPanel>

                <TabPanel value={tab} index={2}>
                    {sensorData ? <Chart title="Sensor data" data={sensorData.slice(-200)} /> : <CircularProgress />}
                </TabPanel>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    action={
                        <Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Fragment>
                    }
                />
            </Fragment>
        )
    }

    const doNotSync = !!rSensor?.meta.doNotSync;

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
                        {error ? `Sensor ${sensorID}` : (sensor ? sensor.name : "...")}
                    </Typography>

                    <SyncStatusIndicator
                        doNotSync={rSensor ? !!rSensor.meta.doNotSync : true}
                        sensorID={sensorID}
                        deviceID={deviceID}
                        clouds={clouds}
                    />

                    <IconButton
                        aria-label="settings"
                        aria-controls="device-menu"
                        aria-haspopup="true"
                        onClick={handleSensorMenuClick}
                        onMouseDown={handleMenuMouseDown}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu
                id="sensor-menu"
                anchorEl={sensorMenuAnchor}
                keepMounted
                open={!!sensorMenuAnchor}
                onClose={handleSensorMenuClose}
            >
                <MenuItem onClick={handleRenameClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </Menu>
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                <Link color="inherit" href="#">Devices</Link>
                <Link color="inherit" href={`#/devices/${deviceID}`}>{deviceName ? deviceName : deviceID}</Link>
                <span>Sensors</span>
                <Link
                    color="textPrimary"
                    href={`#/devices/${deviceID}/sensors/${sensorID}`}
                    aria-current="page"
                >
                    {sensor && sensor?.name}
                </Link>
            </Breadcrumbs>
            {body}
        </div>
    );
}
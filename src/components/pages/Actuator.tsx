import React, { Fragment, useState, MouseEvent, useEffect } from "react";
import { Waziup, CloudStatus, CloudAction, Cloud, Actuator } from "waziup";
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
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import CheckIcon from '@material-ui/icons/Check';
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
    }, wrapper: {
        margin: theme.spacing(1),
        position: "relative",
    }
}));

type Props = {
    handleDrawerToggle: () => void;
    deviceID: string;
    actuatorID: string;
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
            id={`actuator-tabpanel-${index}`}
            aria-labelledby={`actuator-tab-${index}`}
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
        id: `actuator-tab-${index}`,
        'aria-controls': `actuator-tabpanel-${index}`,
    };
}

type EntityStatus = {
    action: CloudAction[];
    remote: Date;
    sleep: number;
    wakeup: Date;
}

export default function ActuatorPage(props: Props) {
    const { actuatorID, deviceID, handleDrawerToggle, clouds } = props;
    const classes = useStyles();

    const [rActuator, setRemoteActuator] = useState(null as Actuator);
    const [actuator, setActuator] = useState(null as Actuator);
    const [error, setError] = useState(null as Error);

    const [status, setStatus] = useState(null as EntityStatus);
    const [deviceName, setDeviceName] = useState(null);

    useEffect(() => {

        load();

        // const cb = (status: CloudStatus) => {
        //     // if (status.entity.device === deviceID && status.entity. == actuatorID) {
        //     //     setStatus(status.status);
        //     // }
        // };
        // wazigate.subscribe<CloudStatus>("clouds/+/status", cb);
        // return () => {
        //     wazigate.unsubscribe("clouds/+/status", cb);
        // }
    }, []);

    /**------------------- */

    const load = () => {
        wazigate.getActuator(deviceID, actuatorID).then(actuator => {
            setActuator(actuator)
            setRemoteActuator(actuator);
        }, setError);
        wazigate.getDevice(deviceID).then(device => { setDeviceName(device.name) }, setError);
    }

    /**------------------- */

    const [actuatorMenuAnchor, setActuatorMenuAnchor] = useState(null);
    const handleActuatorMenuClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setActuatorMenuAnchor(event.currentTarget);
    };
    const handleMenuMouseDown = (event: MouseEvent) => {
        event.stopPropagation();
    };
    const handleActuatorMenuClose = () => {
        setActuatorMenuAnchor(null);
    };
    const handleRenameClick = () => {
        handleActuatorMenuClose();
        const oldActuatorName = actuator.name;
        const newActuatorName = prompt("New actuator name:", oldActuatorName);
        if (newActuatorName) {
            setActuator(actuator => ({
                ...actuator,
                name: newActuatorName
            }));
            wazigate.setActuatorName(deviceID, actuatorID, newActuatorName).then(() => {
                // OK
            }, (err: Error) => {
                setActuator(actuator => ({
                    ...actuator,
                    // revert changes
                    name: oldActuatorName
                }));
                alert("There was an error changing the actuator name:\n" + err);
            });
        }
    }
    const handleDeleteClick = () => {
        handleActuatorMenuClose();
        if (confirm(`Delete actuator '${actuatorID}'?\nThis will delete the actuator and all actuator values.\n\nThis cannot be undone!`)) {
            wazigate.deleteActuator(deviceID, actuatorID).then(() => {
                location.href = `#/devices/${deviceID}`;
            }, (err: Error) => {
                alert("There was an error deleting the actuator:\n" + err);
            });
        }
    }

    var kind: Kind = actuator?.meta.kind || "";
    var quantity: Quantity = actuator?.meta.quantity || "";
    var unit: Unit = actuator?.meta.unit || "";

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
        wazigate.setActuatorMeta(deviceID, actuatorID, {
            kind: kind || null,
            quantity: quantity || null,
            unit: unit || null
        }).then(() => {
            setRemoteActuator(rActuator => ({
                ...rActuator,
                meta: {
                    ...rActuator.meta,
                    kind: actuator.meta.kind,
                    quantity: actuator.meta.quantity,
                    unit: actuator.meta.unit,
                }
            }))
        }, (err: Error) => {
            alert("There was an error saving the metadata:\n" + err)
        });
    }

    const resetOntology = () => {
        setActuator(actuator => ({
            ...actuator,
            meta: {
                ...actuator.meta,
                kind: rActuator.meta.kind,
                type: rActuator.meta.type,
            }
        }))
    }

    const [actuatorData, setActuatorData] = useState(null);
    const loadActuatorData = () => {
        wazigate.getActuatorValues(deviceID, actuatorID)
            .then(res => {
                setActuatorData(res);
            }, (err: Error) => {
                console.error("There was an error loading actuator data:\n" + err)
            })
    }

    /**-------------------- */


    const [newValue, setNewValue] = useState(null);
    const [vlauePushing, setValuePushing] = useState(false);
    const submitValue = () => {

        setValuePushing(true);
        wazigate.set<any>("devices/" + deviceID + "/actuators/" + actuatorID + "/value", newValue).then(
            () => {
                // setRemoteActuator(rActuator => ({
                //     ...rActuator,
                //     value: actuator.value,
                // }))



                load();
                // Syncing the actuator value with the cloud does not make sense. 
                // Maybe we need to use some additional sensor values to keep the status of the target device

            }, (err: Error) => {
                alert("There was an error pushing the actuator value:\n" + err)
            }).finally(() => {
                setValuePushing(false)
            })
    }

    /**-------------------- */

    const resetValue = () => {
        setActuator(actuator => ({
            ...actuator
        }))
    }

    /**-------------------- */

    var body: React.ReactNode;
    if (actuator === null && error === null) {
        body = "Loading... please wait.";
    } else if (error != null) {
        body = <Error error={error} />
    } else {
        const kindInput = (
            <OntologyKindInput
                value={kind}
                deviceType="actuator"
                onChange={(event: any, kind: Kind) => {
                    if (kind in ontologies.actingDevices) {
                        const quantities = ontologies.actingDevices[kind].quantities;
                        if (!quantities.includes(quantity)) {
                            quantity = quantities[0];
                            if (quantity) {
                                if (!!!ontologies.quantities[quantity].units) {
                                    console.log(kind, quantities, ontologies.quantities[quantity])
                                }
                                const units = ontologies.quantities[quantity].units
                                unit = units[0] || "";
                            } else {
                                quantity = "";
                                unit = "";
                            }
                        }
                    }
                    setActuator(actuator => ({
                        ...actuator,
                        meta: {
                            ...actuator.meta,
                            kind: kind,
                            quantity: quantity,
                            unit: unit,
                        }
                    }));
                }}
            />
        )
        var quantities: Quantity[] = [];
        if (kind in ontologies.actingDevices) {
            quantities = ontologies.actingDevices[kind].quantities;
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
                                setActuator(actuator => ({
                                    ...actuator,
                                    meta: {
                                        ...actuator.meta,
                                        quantity: event.target.value as Quantity,
                                    }
                                }));
                            }
                        }}
                    >
                        {quantities.map((quantity) => (
                            <MenuItem value={quantity}>{ontologies.quantities[quantity]?.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        }

        var unitInput: JSX.Element = null;
        if (kind in ontologies.actingDevices && quantity) {
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
                                    setActuator(actuator => ({
                                        ...actuator,
                                        meta: {
                                            ...actuator.meta,
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
            rActuator?.meta.unit !== actuator?.meta.unit ||
            rActuator?.meta.kind !== actuator?.meta.kind ||
            rActuator?.meta.quantity !== actuator?.meta.quantity
        )

        // const hasUnsavedValueChanges = (
        //     rActuator?.value !== actuator?.value
        // )
        const hasUnsavedValueChanges = false
        const hasUnsavedChartChanges = false
        

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
                                <DirtyIndicator visible={hasUnsavedValueChanges}>Value</DirtyIndicator>
                            </Fragment>
                        } {...tabProps(1)} />
                        <Tab label={
                            <Fragment>
                                <DirtyIndicator visible={hasUnsavedChartChanges}>Chart</DirtyIndicator>
                            </Fragment>
                        } {...tabProps(2)} onClick={loadActuatorData} />
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
                        {/* <FormControl className={classes.unit}> */}
                        {/* <InputLabel id="value-label">Value</InputLabel> */}
                        <TextField
                            label={"Actuator Value"}
                            placeholder="no value"
                            value={newValue}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                if (event.target.value !== newValue) {
                                    setNewValue(event.target.value as any);
                                }
                            }}
                        />
                        {/* </FormControl> */}
                        {/* <div className={classes.submitChanges}> */}
                        <div className={classes.wrapper}>
                            <Button
                                className={classes.submitChangesBtn}
                                variant="contained"
                                color="primary"
                                onClick={submitValue}
                                startIcon={<SendRoundedIcon />}
                                disabled={vlauePushing}
                            >
                                Push
                                </Button>
                            {vlauePushing && (
                                <CircularProgress
                                    size={24}
                                    className={classes.buttonProgress}
                                />
                            )}
                        </div>
                        {/* </div> */}

                    </FormGroup>
                </TabPanel>

                <TabPanel value={tab} index={2}>
                    {actuatorData ? <Chart title="Actuator data" data={actuatorData.slice(-200)} /> : <CircularProgress />}
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
                        {error ? `Actuator ${actuatorID}` : (actuator ? actuator.name : "...")}
                    </Typography>

                    <IconButton
                        aria-label="settings"
                        aria-controls="device-menu"
                        aria-haspopup="true"
                        onClick={handleActuatorMenuClick}
                        onMouseDown={handleMenuMouseDown}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu
                id="actuator-menu"
                anchorEl={actuatorMenuAnchor}
                keepMounted
                open={!!actuatorMenuAnchor}
                onClose={handleActuatorMenuClose}
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
                <span>Actuators</span>
                <Link
                    color="textPrimary"
                    href={`#/devices/${deviceID}/actuators/${actuatorID}`}
                    aria-current="page"
                >
                    {actuator && actuator?.name}
                </Link>
            </Breadcrumbs>
            {body}
        </div>
    );
}
import React, { Fragment, useState, MouseEvent, useEffect } from "react";
import { Waziup, Sensor } from "waziup";
import Error from "../Error";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete/Autocomplete";
import ontologies from "../../ontologies.json";
import ontologiesSprite from "../../img/ontologies.svg";
import SVGSpriteIcon from "../SVGSpriteIcon";
import MenuIcon from '@material-ui/icons/Menu';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';

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
    colors
} from '@material-ui/core';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: "64px",
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
    }
}));

type Props = {
    handleDrawerToggle: () => void;
    deviceID: string;
    sensorID: string;
};

const defaultKindIcon = "meter";

type Kind = string;
type Unit = string;
type Quantity = string;

const filter = createFilterOptions<Kind>();

const OK = 0;
const HasUnsavedChanges = 1;
const DoingSync = 2;
const Loading = 3;

export default function SensorPage({sensorID, deviceID, handleDrawerToggle}: Props) {
    const classes = useStyles();

    const [sensor, setSensor] = useState(null as Sensor);
    const [error, setError] = useState(null as Error);
    useEffect(() => {
        wazigate.getSensor(deviceID, sensorID).then(setSensor, setError);
    }, []);

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
        handleMenuClose();
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
                alert("There was an error changing the sensor name:\n"+err);
            });
        }
    }
    const handleDeleteClick = () => {
        handleMenuClose();
        if (confirm(`Delete sensor '${sensorID}'?\nThis will delete the sensor and all sensor values.\n\nThis cannot be undone!`)) {
            wazigate.deleteSensor(deviceID, sensorID).then(() => {
                location.href = `#/devices/${deviceID}`;
            }, (err: Error) => {
                alert("There was an error deleting the sensor:\n"+err);
            });
        }
    }

    var kind: Kind = sensor?.meta.kind || "";
    var quantity: Quantity = sensor?.meta.quantity || "";
    var unit: Unit = sensor?.meta.unit || "";

    const [headState, setHeadState] = useState(OK);

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const handleSnackbarClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackBarOpen(false);
    };

    const submitDeviceHead = () => {
        setHeadState(DoingSync);

        wazigate.setSensorMeta(deviceID, sensorID, {
            kind: kind || null,
            quantity: quantity || null,
            unit: unit || null
        }).then(() => {
            setHeadState(OK);
        }, (err: Error) => {
            alert("There was an error saving the metadata:\n"+err)
            setHeadState(HasUnsavedChanges);
        });
    }

    var body: React.ReactNode;
    if(sensor === null && error === null) {
        body = "Loading... please wait.";
    } else if (error != null) {
        body = <Error error={error} />
    } else {
        const ontology = ontologies.sensingDevices;
        const kindInput = (
            <Autocomplete
                value={kind}
                className={classes.kind}
                id="kind-select"
                options={Object.keys(ontology) as Kind[]}
                onChange={(event: any, kind: Kind) => {
                    if (typeof kind === "string") {
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
                    } else {
                        setSensor(sensor => ({
                            ...sensor,
                            meta: {
                                ...sensor.meta,
                                kind: "",
                            }
                        }));
                    }
                    setHeadState(HasUnsavedChanges);
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params) as Kind[];
                    if (params.inputValue !== '') {
                      filtered.push(params.inputValue);
                    }
                    return filtered;
                  }}
                getOptionLabel={(kind: Kind) => {
                    if (typeof kind === "string") {
                        if (kind in ontologies.sensingDevices) {
                            return ontologies.sensingDevices[kind].label;
                        }
                        return kind;
                    }
                    return "";
                }}
                renderOption={(kind: Kind) => {
                    var icon: string;
                    var label: string;
                    if (typeof kind === "string") {
                        if (kind in ontologies.sensingDevices) {
                            icon = ontologies.sensingDevices[kind].icon;
                            label = ontologies.sensingDevices[kind].label;
                        } else {
                            icon = defaultKindIcon;
                            label = `Use \"${kind}\"`;
                        }
                    } else {
                        icon = defaultKindIcon;
                        label = "null value option";
                    }
                    return (
                        <Fragment>
                            <SVGSpriteIcon
                                className={classes.icon}
                                src={`dist/${ontologiesSprite}#${icon}`}
                            />
                            { label }
                        </Fragment>
                    );
                }}
                // filterSelectedOptions
                freeSolo
                renderInput={(params) => {
                    var icon: string;
                    var label: string;
                    if (kind in ontologies.sensingDevices) {
                        icon = ontologies.sensingDevices[kind].icon;
                        label = ontologies.sensingDevices[kind].label;
                    } else {
                        icon = defaultKindIcon;
                        label = kind;
                    }
                    params.InputProps.startAdornment = (
                        <Fragment>
                            { params.InputProps.startAdornment || null }
                            <InputAdornment position="start">
                                <SVGSpriteIcon
                                    className={classes.kindIcon}
                                    src={`dist/${ontologiesSprite}#${icon}`}
                                />
                            </InputAdornment>
                        </Fragment>
                    );
                    // params.InputProps.className = `${classes.kindInput} ${params.InputProps.className}`
                    (params.inputProps as any)["className"] = `${(params.inputProps as any)["className"]} ${classes.kindInput}`;
                    return (
                        <Fragment>
                            {/* <SVGSpriteIcon
                                className={classes.kindIcon}
                                src={`dist/${ontologiesSprite}#${ont.icon}`}
                            /> */}
                            <TextField
                                {...params}
                                label="Sensor Kind"
                                placeholder="no sensor kind"
                                // InputProps={{
                                //     startAdornment: (
                                //         <InputAdornment position="start">
                                //             <AccountCircle />
                                //         </InputAdornment>
                                //     ),
                                // }}
                            />
                        </Fragment>
                    )
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
                            if(event.target.value !== quantity) {
                                setSensor(sensor => ({
                                    ...sensor,
                                    meta: {
                                        ...sensor.meta,
                                        quantity: event.target.value as Quantity,
                                    }
                                }));
                                setHeadState(HasUnsavedChanges);
                            }
                        }}
                    >
                        {quantities.map((quantity) => (
                            <MenuItem value={quantity}>{ ontologies.quantities[quantity].label }</MenuItem>
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
                                if(event.target.value !== unit) {
                                    setSensor(sensor => ({
                                        ...sensor,
                                        meta: {
                                            ...sensor.meta,
                                            unit: event.target.value as Unit,
                                        }
                                    }));
                                    setHeadState(HasUnsavedChanges);
                                }
                            }}
                        >
                            {ontologies.quantities[quantity].units.map((unit) => (
                                <MenuItem value={unit}>{ ontologies.units[unit].label }</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
        }

        // <Autocomplete
        // id="quantity-select"
        // options={quantities}
        // getOptionLabel={
        //     (quantityId) => 
        // }
        // style={{ width: 300 }}
        // renderInput={(params) =>
        //     <TextField
        //         {...params}
        //         className={classes.quantity}
        //         label="Quantity"
        //         placeholder="no quantity"
        //     />
        // }
        // />
        body = (
            <Fragment>
                <div className={classes.deviceHead}>
                    { kindInput }
                    { quantityInput }
                    { unitInput }
                    { headState === HasUnsavedChanges || headState === DoingSync ? (
                        <div className={classes.submitHeadWrapper}>
                            <Button
                                className={classes.submitHead}
                                variant="contained"
                                color="primary"
                                onClick={submitDeviceHead}
                                disabled={headState === DoingSync}
                                startIcon={<SaveIcon />}
                            >
                                Save
                            </Button>
                            { headState === DoingSync ? (
                                <CircularProgress size={24} className={classes.buttonProgress} />
                            ): null }
                        </div>
                    ): null}
                </div>
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
                        { error ? `Sensor ${sensorID}` : (sensor ? sensor.name : "...") }
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
                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </Menu>
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                <Link color="inherit" href="#">Devices</Link>
                <Link color="inherit" href={`#/devices/${deviceID}`}>{ deviceID }</Link>
                <span>Sensors</span>
                <Link
                    color="textPrimary"
                    href={`#/devices/${deviceID}/sensors/${sensorID}`}
                    aria-current="page"
                >
                    {sensorID}
                </Link>
            </Breadcrumbs>
            { body }
        </div>
    );
}
import React, { Fragment, useState, MouseEvent } from "react";
import { Device, Waziup, Sensor } from "waziup";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
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
import { makeStyles } from '@material-ui/core/styles';
import Error from "../Error";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete/Autocomplete";
import ontologies, { SensingDevice } from "../../ontologies.json";
import ontologiesSprite from "../../img/ontologies.svg";
import SVGSpriteIcon from "../SVGSpriteIcon";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';

declare var gateway: Waziup;

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
        color: green[500],
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

type KindId = string;
type MetaKindName = string;
type KindOption = [KindId, MetaKindName];
type QuantityId = string;
type UnitId = string;

const filter = createFilterOptions<KindOption>();

const OK = 0;
const HasUnsavedChanges = 1;
const DoingSync = 2;
const Loading = 3;

export default function SensorPage({sensorID, deviceID, handleDrawerToggle}: Props) {
    const classes = useStyles();

    const [sensor, setSensor] = useState(null as Sensor);
    const [error, setError] = useState(null as Error);
    if (error === null && sensor === null) {
        gateway.getSensor(deviceID, sensorID).then(setSensor, setError);
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
        const newSensorName = prompt("New sensor name:", sensor.name);
        if (newSensorName) {
            setSensor(sensor => {
                sensor.name = newSensorName;
                return sensor;
            });
        }
        handleMenuClose();
    }

    const [kind, setKind] = useState<KindOption>(["AirThermometer", null]);
    const [kindId, kindMetaName] = kind;
    const kinds = ontologies.sensingDevices;

    const [quantityId, setQuantityId] = useState<QuantityId>("AirTemperature");
    const [unitId, setUnitId] = useState<UnitId>("DegreeCelsius");

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
        setTimeout(() => {
            setHeadState(OK);
            setSnackBarOpen(true);
        }, 2000)
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
                options={Object.keys(ontology).map((kindId) => [kindId, null] as KindOption)}
                onChange={(event: any, kind: KindOption) => {
                    if (typeof kind === "string") {
                        setKind([null, kind]);
                    } else if (kind === null) {
                        setKind([null, null])
                    } else {
                        setKind(kind);
                        const [kindId] = kind;
                        const quantityId = ontology[kindId].quantities[0] || null;
                        if (quantityId !== null) {
                            setQuantityId(quantityId);
                            const unitId = ontologies.quantities[quantityId].units[0] || null;
                            if (unitId !== null) {
                                setUnitId(unitId)
                            }
                        }
                    }
                    setHeadState(HasUnsavedChanges);
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params) as KindOption[];
                    if (params.inputValue !== '') {
                      filtered.push([null, params.inputValue]);
                    }
                    return filtered;
                  }}
                getOptionLabel={(kind: KindOption) => {
                    if (typeof kind === "string") {
                        return kind;
                    } else if (kind === null) {
                        return "";
                    } else {
                        const [kindId, kindMetaName] = kind;
                        if (kindId === null) {
                            if (kindMetaName !== null) {
                                return kindMetaName;
                            }
                            return "";
                        }
                        return kinds[kindId].label;
                    }
                }}
                renderOption={(kind: KindOption) => {
                    var icon: string;
                    var label: string;
                    if (typeof kind === "string") {
                        icon = defaultKindIcon;
                        label = "string value option";
                    } else if (kind === null) {
                        icon = defaultKindIcon;
                        label = "null value option";
                    } else {
                        const [kindId, kindMetaName] = kind;
                        if (kindId !== null) {
                            icon = kinds[kindId].icon;
                            label = kinds[kindId].label;
                        } else if (kindMetaName !== null) {
                            icon = defaultKindIcon;
                            label = `Use \"${kindMetaName}\"`;
                        } else {
                            icon = defaultKindIcon;
                            label = `Unspecified kind`;
                        }
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
                    if (kindId !== null) {
                        icon = kinds[kindId].icon;
                        label = kinds[kindId].label;
                    } else {
                        icon = defaultKindIcon;
                        label = kindMetaName;
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
        var quantities: QuantityId[] = [];
        if (kindId !== null) {
            quantities = ontology[kindId].quantities;
        }
        var quantityInput: JSX.Element = null;
        if (quantities.length !== 0) {
            quantityInput = (
                <FormControl className={classes.quantity}>
                    <InputLabel id="quantity-select-lebel">Quantity</InputLabel>
                    <Select
                        labelId="quantity-select-lebel"
                        id="quantity-select"
                        value={quantityId}
                        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                            if(event.target.value !== quantityId) {
                                setQuantityId(event.target.value as QuantityId);
                                setHeadState(HasUnsavedChanges);
                            }
                        }}
                    >
                        {quantities.map((quantityId) => (
                            <MenuItem value={quantityId}>{ ontologies.quantities[quantityId].label }</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        }

        var unitInput: JSX.Element = null;
        if (kindId !== null && quantityId !== null) {
            const units = ontologies.quantities[quantityId].units;
            if (units.length !== 0) {
                unitInput = (
                    <FormControl className={classes.unit}>
                        <InputLabel id="unit-select-lebel">Unit</InputLabel>
                        <Select
                            labelId="unit-select-lebel"
                            id="unit-select"
                            value={unitId}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                if(event.target.value !== unitId) {
                                    setUnitId(event.target.value as UnitId);
                                    setHeadState(HasUnsavedChanges);
                                }
                            }}
                        >
                            {ontologies.quantities[quantityId].units.map((unitID) => (
                                <MenuItem value={unitID}>{ ontologies.units[unitID].label }</MenuItem>
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
                <MenuItem onClick={handleMenuClose}>
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
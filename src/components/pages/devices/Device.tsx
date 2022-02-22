import React, { useState, MouseEvent } from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ontologies from "../../../ontologies.json";
import ontologiesSprite from "../../../img/ontologies.svg";
import SVGSpriteIcon from "../../SVGSpriteIcon";
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { Device } from "waziup";

import {
    Divider,
    Card,
    CardContent,
    IconButton,
    Avatar,
    makeStyles,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ListItem,
    colors
} from '@material-ui/core';
import { time_ago } from "../../../tools";
import { values } from "underscore";


type Props = {
    device: Device;
    className?: string;
    isGateway?: boolean;
    onDelete: () => void;
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        display: "inline-block",
        verticalAlign: "top",
    },
    name: {
        cursor: "text",
        '&:hover': {
            "text-decoration": "underline",
        },
    },
    id: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    icon: {
        width: "40px",
        height: "40px",
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: colors.red[500],
    },
    value: {
        float: "right",
        whiteSpace: "nowrap",
        flexGrow: 0,
        marginLeft: "1.5em",
    },
    actualValue: {
        fontFamily: "monospace",
        padding: "5px",
        margin: "-10px 0px 0px -10px",
        backgroundColor: "#f1f1f1",
    },
    noActualValue: {
        backgroundColor: "#ffffff",
    },
    flex: {
        display: "flex",
        gap: "8px",
    },
    flexGrow: {
        flexGrow: 1,
    },
}));

const defaultSensorIcon = "meter";
const defaultActuatorIcon = "crane";

export const DeviceComp = ({ device, className, isGateway, onDelete }: Props) => {
    const classes = useStyles();

    const [deviceName, setDeviceName] = useState(device.name);
    const handleNameClick = () => {
        const oldName = deviceName;
        const newDeviceName = prompt("New device name:", oldName);
        if (newDeviceName && newDeviceName != oldName) {
            setDeviceName(newDeviceName);
            wazigate.set(`devices/${device.id}/name`, newDeviceName).then(() => {
                // OK
            }, (err) => {
                alert("The device name could not be saved:\n" + err);
                setDeviceName(oldName);
            });
        }
        handleMenuClose();
    }

    const [gwID, setGwID] = useState(device.id);
    const handleChangeIDClick = () => {
        const oldID = gwID;
        const newID = prompt("New Gateway ID:", oldID);
        if (newID && newID != oldID) {
            wazigate.set(`device/id`, newID).then((res) => {
                // OK
                // setGwID(newID);
                // setDeviceName("(NEW) " + device.name);
                // Let's reload it
                window.location.reload();
            }, (err) => {
                alert("The device ID could not be saved:\n" + err);
                setGwID(oldID);
            });
        }
        handleMenuClose();
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
    const handleDeleteClick = () => {
        handleMenuClose();
        if (confirm(`Delete device '${device.id}'?\nThis will delete the device, all of its sensors and actuators and all data values.\n\nThis cannot be undone!`)) {
            wazigate.deleteDevice(device.id);
            onDelete();
        }
    };

    // const sensors = device.sensors.map(sensor => {
    //     const ont = ontologies.sensingDevices[sensor.kind]
    //     const unit = ontologies.units[(sensor as any).unit];
    //     return (
    //     <ListItem component="a" key={sensor.id} button href={`#/devices/${device.id}/sensors/${sensor.id}`}>
    //         <ListItemIcon>
    //             <SVGSpriteIcon
    //                 className={classes.icon}
    //                 src={`dist/${ontologiesSprite}#${ont.icon}`}
    //             />
    //         </ListItemIcon>
    //         <ListItemText
    //             primary={sensor.name}
    //             secondary={ont.label}
    //         />
    //         <ListItemText
    //             className={classes.value}
    //             primary={`${sensor.value}${unit?` ${unit.label}`:""}`}
    //         />
    //     </ListItem>
    //     )
    // });

    // <CardHeader
    //     avatar={
    //         <Avatar aria-label="recipe" className={classes.avatar} style={{background: colorFromRune(deviceName[0])}}>{deviceName[0]}</Avatar>
    //     }
    //     action={
    //         <IconButton aria-label="settings" aria-controls="device-menu" aria-haspopup="true" onClick={handleDeviceClick}>
    //             <MoreVertIcon />
    //         </IconButton>
    //     }
    //     title={
    //         <span onClick={handleNameClick} className={classes.name}>{deviceName}</span>
    //     }
    //     subheader={`ID ${device.id}`}
    // />
    return (
        <Card className={`${classes.root} ${className || ""}`}>
            <List dense={true}>
                <ListItem component="a" button href={`#/devices/${device.id}`}>
                    <ListItemIcon>
                        <Avatar
                            aria-label="recipe"
                            className={classes.avatar}
                            style={{ background: colorFromRune(device.id[0]) }}
                        >
                            {deviceName[0]}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary={deviceName}
                        classes={{ secondary: classes.id }}
                        secondary={`ID ${device.id}`}
                    />
                    <IconButton
                        className={classes.value}
                        aria-label="settings"
                        aria-controls="device-menu"
                        aria-haspopup="true"
                        onClick={handleMenuClick}
                        onMouseDown={handleMenuMouseDown}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </ListItem>
            </List>
            <Menu
                id="device-menu"
                anchorEl={menuAnchorEl}
                keepMounted
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleNameClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>

                {isGateway ? (
                    <MenuItem onClick={handleChangeIDClick}>
                        <ListItemIcon>
                            <FingerprintIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Change Gateway ID" />
                    </MenuItem>)
                    : (
                        <MenuItem onClick={handleDeleteClick}>
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Delete" />
                        </MenuItem>)}

                {/* <Divider />
                <MenuItem onClick={handleNameClick}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add Sensor" />
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add Actuator" />
                </MenuItem> */}
            </Menu>
            <Divider />
            <CardContent>
                <List dense={true}>
                    {device.sensors.map(sensor => {
                        const kind = (sensor.meta.kind || "") as string;
                        const quantity = (sensor.meta.quantity || "") as string;
                        const unit = (sensor.meta.unit || "") as string;
                        const time = (sensor.time || "") as string;

                        const icon = ontologies.sensingDevices[kind]?.icon || defaultSensorIcon;
                        const kindLabel = ontologies.sensingDevices[kind]?.label || kind;
                        const unitLabel = ontologies.units[unit]?.label || unit;

                        let valueElm: JSX.Element;
                        if(sensor.value !== null) {
                            const valueText = `${sensor.value}${unitLabel ? ` ${unitLabel}` : ""}`;
                            valueElm = <div className={classes.actualValue}>{valueText}</div>;
                        }

                        return (
                            <ListItem component="a" key={sensor.id} button href={`#/devices/${device.id}/sensors/${sensor.id}`}>
                                <ListItemIcon>
                                    <SVGSpriteIcon
                                        className={classes.icon}
                                        src={`dist/${ontologiesSprite}#${icon}`}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<>
                                        <div className={classes.flexGrow}>{sensor.name}</div>
                                        {valueElm}
                                    </>}
                                    primaryTypographyProps={{className: classes.flex}}
                                    secondary={<>
                                        <div className={classes.flexGrow}>{kindLabel}</div>
                                        <div>{time_ago(time)}</div>
                                    </>}
                                    secondaryTypographyProps={{className: classes.flex}}
                                />
                            </ListItem>
                        )
                    })}
                </List>
                <List dense={true}>
                    {device.actuators.map(actuator => {
                        const kind = (actuator.meta.kind || "") as string;
                        const quantity = (actuator.meta.quantity || "") as string;
                        const unit = (actuator.meta.unit || "") as string;
                        const time = (actuator.time || "") as string;

                        const icon = ontologies.sensingDevices[kind]?.icon || defaultActuatorIcon;
                        const kindLabel = ontologies.sensingDevices[kind]?.label || kind;
                        const unitLabel = ontologies.units[unit]?.label || unit;

                        let valueElm: JSX.Element;
                        if(actuator.value !== null) {
                            const valueText = `${actuator.value}${unitLabel ? ` ${unitLabel}` : ""}`;
                            valueElm = <div className={classes.actualValue}>{valueText}</div>;
                        }

                        return (
                            <ListItem component="a" key={actuator.id} button href={`#/devices/${device.id}/actuators/${actuator.id}`}>
                                <ListItemIcon>
                                    <SVGSpriteIcon
                                        className={classes.icon}
                                        src={`dist/${ontologiesSprite}#${icon}`}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<>
                                        <div className={classes.flexGrow}>{actuator.name}</div>
                                        {valueElm}
                                    </>}
                                    primaryTypographyProps={{className: classes.flex}}
                                    secondary={<>
                                        <div className={classes.flexGrow}>{kindLabel}</div>
                                        <div>{time_ago(time)}</div>
                                    </>}
                                    secondaryTypographyProps={{className: classes.flex}}
                                />
                            </ListItem>
                        )
                    })}
                </List>
            </CardContent>
        </Card>
    );
}

const alphabetColors = [
    "#5A8770", "#B2B7BB", "#6FA9AB", "#F5AF29", "#0088B9", "#F18636", "#D93A37",
    "#A6B12E", "#5C9BBC", "#F5888D", "#9A89B5", "#407887", "#9A89B5", "#5A8770",
    "#D33F33", "#A2B01F", "#F0B126", "#0087BF", "#F18636", "#0087BF", "#B2B7BB",
    "#72ACAE", "#9C8AB4", "#5A8770", "#EEB424", "#407887"];

function colorFromRune(r: string): string {
    if (!r) return randomColor();
    const colorIndex = Math.floor(r.charCodeAt(0) % alphabetColors.length);
    return alphabetColors[colorIndex];
}

function randomColor(): string {
    const letters: string[] = "0123456789ABCDEF".split("");
    let color: string = "#";
    for (let i: number = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


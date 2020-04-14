import React, { useState, MouseEvent } from "react";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ontologies from "../../../ontologies.json";
import ontologiesSprite from "../../../img/ontologies.svg";
import SVGSpriteIcon from "../../SVGSpriteIcon";
import Divider from '@material-ui/core/Divider';
import { Device } from "waziup";


type Props = {
    device: Device;
    className?: string;
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
        backgroundColor: red[500],
    },
    value: {
        float: "right",
        flexGrow: 0,
        marginLeft: "1.5em",
    },
}));

export const DeviceComp = ({ device, className }: Props) => {
    const classes = useStyles();

    const [deviceName, setDeviceName] = useState(device.name);
    const handleNameClick = () => {
        const newDeviceName = prompt("New device name:", deviceName);
        if (newDeviceName) setDeviceName(newDeviceName);
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
        <Card className={`${classes.root} ${className||""}`}>
            <List dense={true}>
                <ListItem component="a" button href={`#/devices/${device.id}`}>
                    <ListItemIcon>
                        <Avatar
                            aria-label="recipe"
                            className={classes.avatar}
                            style={{background: colorFromRune(deviceName[0])}}
                        >
                            {deviceName[0]}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary={deviceName}
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
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
                <Divider />
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
                </MenuItem>
            </Menu>
            <Divider />
            <CardContent>
                <List dense={true}>
                    { device.sensors.map(sensor => {
                        const kind = ontologies.sensingDevices[sensor.kind]
                        const unit = ontologies.units[(sensor as any).unit];
                        return (
                            <ListItem component="a" key={sensor.id} button href={`#/devices/${device.id}/sensors/${sensor.id}`}>
                                <ListItemIcon>
                                    <SVGSpriteIcon
                                        className={classes.icon}
                                        src={`dist/${ontologiesSprite}#${kind?kind.icon:"meter"}`}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={sensor.name}
                                    secondary={kind?kind.label:""}
                                />
                                <ListItemText
                                    className={classes.value}
                                    primary={`${sensor.value}${unit?` ${unit.label}`:""}`}
                                />
                            </ListItem>
                        )
                    }) }
                </List>
            </CardContent>
        </Card>
    );
}

const alphabetcolors = ["#5A8770", "#B2B7BB", "#6FA9AB", "#F5AF29", "#0088B9", "#F18636", "#D93A37", "#A6B12E", "#5C9BBC", "#F5888D", "#9A89B5", "#407887", "#9A89B5", "#5A8770", "#D33F33", "#A2B01F", "#F0B126", "#0087BF", "#F18636", "#0087BF", "#B2B7BB", "#72ACAE", "#9C8AB4", "#5A8770", "#EEB424", "#407887"];

function colorFromRune(r: string): string {
    if (r.charCodeAt(0) < 65) {
        return randomColor();
    }
    const colorIndex = Math.floor((r.charCodeAt(0) - 65) % alphabetcolors.length);
    return alphabetcolors[colorIndex];
}

function randomColor(): string {
    const letters: string[] = "0123456789ABCDEF".split("");
    let color: string = "#";
    for (let i: number = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
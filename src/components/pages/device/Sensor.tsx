import React from "react";
import ontologies from "../../../ontologies.json";
import ontologiesSprite from "../../../img/ontologies.svg";
import SVGSpriteIcon from "../../SVGSpriteIcon";
import { Sensor } from "waziup";
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
    Collapse,
    Card,
    CardContent,
    IconButton,
    makeStyles,
    Typography,
    List,
    ListItemIcon,
    ListItemText,
    ListItem,
    colors,
} from '@material-ui/core';

type Props = {
    deviceID: string;
    sensor: Sensor;
    className?: string;
}

const useStyles = makeStyles((theme) => ({
    root: {
        // maxWidth: 345,
        // display: "inline-block",
        // verticalAlign: "top",
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
        backgroundColor: colors.red[500],
    },
    value: {
        float: "right",
        flexGrow: 0,
        marginLeft: "1.5em",
    },
}));

const defaultKindIcon = "meter";

export default function Sensor({ deviceID, sensor, className }: Props) {
    const classes = useStyles();

    const kind = (sensor.meta.kind || "") as string;
    const quantity = (sensor.meta.quantity || "") as string;
    const unit = (sensor.meta.unit || "") as string;

    const icon = ontologies.sensingDevices[kind]?.icon || defaultKindIcon;
    const kindLabel = ontologies.sensingDevices[kind]?.label || kind;

    // const [sensorName, setSensorName] = useState(sensor.name);
    // const handleNameClick = () => {
    //     const newSensorName = prompt("New sensor name:", sensorName);
    //     if (newSensorName) setSensorName(newSensorName);
    //     handleMenuClose();
    // }

    // const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    // const handleMenuClick = (event: MouseEvent) => {
    //     event.stopPropagation();
    //     event.preventDefault();
    //     setMenuAnchorEl(event.currentTarget);
    // };
    // const handleMenuMouseDown = (event: MouseEvent) => {
    //     event.stopPropagation();
    // };
    // const handleMenuClose = () => {
    //     setMenuAnchorEl(null);
    // };

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setExpanded(!expanded);
    };

    return (
        <Card className={`${classes.root} ${className || ""}`}>
            <List dense={true}>
                <ListItem component="a" button href={`#/devices/${deviceID}/sensors/${sensor.id}`}>
                    <ListItemIcon>
                        <SVGSpriteIcon
                            className={classes.icon}
                            src={`dist/${ontologiesSprite}#${icon}`}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={sensor.name}
                        secondary={kindLabel}
                    />
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>

                </ListItem>
            </List>
            {/* <Menu
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
            </Menu> */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Sensor Details</Typography>
                    <Typography paragraph>Sensor Details</Typography>
                    <Typography paragraph>Sensor Details</Typography>
                    <Typography paragraph>Sensor Details</Typography>
                    <Typography paragraph>Sensor Details</Typography>
                    <Typography paragraph>Sensor Details</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
    //    <Divider />
    //     <CardContent>
    //         Huhu :D
    //     </CardContent>
}
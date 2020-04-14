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
import { Sensor } from "waziup";
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

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
        backgroundColor: red[500],
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

    const kind = sensor.kind ? ontologies.sensingDevices[sensor.kind] : null;
    const unit = sensor.kind && sensor.unit ? ontologies.units[sensor.unit] : null;

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
                            src={`dist/${ontologiesSprite}#${kind ? kind.icon : defaultKindIcon}`}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={sensor.name}
                        secondary={kind ? kind.label : ""}
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
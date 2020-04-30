import React, { useState, MouseEvent } from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ontologies from "../../../ontologies.json";
import ontologiesSprite from "../../../img/ontologies.svg";
import SVGSpriteIcon from "../../SVGSpriteIcon";
import { Device, Cloud } from "waziup";
import clsx from "clsx";

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
    colors,
    FormControlLabel,
    Checkbox,
    FormGroup,
    TextField,
    Switch,
    Button,
    CardActions,
    Grow
} from '@material-ui/core';

type Props = {
    cloud: Cloud;
    className?: string;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: 400,
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
        backgroundColor: colors.red[500],
    },
    value: {
        float: "right",
        flexGrow: 0,
        marginLeft: "1.5em",
    },
}));


export const CloudComp = ({ cloud, className }: Props) => {
    const classes = useStyles();

    var [cloud, setCloud] = useState(cloud);

    // const [deviceName, setDeviceName] = useState(device.name);
    // const handleNameClick = () => {
    //     const newDeviceName = prompt("New device name:", deviceName);
    //     if (newDeviceName) setDeviceName(newDeviceName);
    //     handleMenuClose();
    // }

    const setCloudName = (name: string) => {
        setCloud(cloud => ({
            ...cloud,
            // name: name
        }));
    }

    const [hasUnsavedChanges, sethasUnsavedChanges] = useState(false);

    const handleNameClick = () => {
        const newCloudName = prompt("New cloud name:", cloud.id);
        if (newCloudName) setCloudName(newCloudName);
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

    const handleEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (hasUnsavedChanges) return;
        const enabled = event.target.checked;
        setCloud(cloud => ({
            ...cloud,
            paused: !enabled
        }));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCloud(cloud => ({
            ...cloud,
            [event.target.name]: event.target.value
        }));
        sethasUnsavedChanges(true);
    };

    const handleSaveClick = () => {
        sethasUnsavedChanges(false);
    }

    return (
        <Card className={clsx(classes.root, className)}>
            <List dense={true}>
                <ListItem>
                    <ListItemIcon>
                        <Avatar
                            aria-label="recipe"
                            className={classes.avatar}
                        >
                            {cloud.id}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary={cloud.id}
                        secondary={`ID ${cloud.id}`}
                    />
                    <IconButton
                        className={classes.value}
                        aria-label="settings"
                        aria-controls="cloud-menu"
                        aria-haspopup="true"
                        onClick={handleMenuClick}
                        onMouseDown={handleMenuMouseDown}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </ListItem>
            </List>
            <Menu
                id="cloud-menu"
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
                {/* <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem> */}
            </Menu>
            <Divider />
            <CardContent>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!cloud.paused}
                                onChange={handleEnabledChange}
                                name="sync-enabled"
                                color="primary"
                            />
                        }
                        label="Active Sync"
                    />
                    <TextField
                        required
                        label="REST Address"
                        name="rest"
                        value={cloud.rest}
                        onChange={handleInputChange}
                        margin="normal"
                        disabled={!cloud.paused}
                    />
                    <TextField
                        label="MQTT Address"
                        name="mqtt"
                        value={cloud.mqtt}
                        placeholder="generated from REST address"
                        onChange={handleInputChange}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={!cloud.paused}
                    />
                    <TextField
                        label="Username"
                        name="username"
                        value={(cloud as any).username}
                        onChange={handleInputChange}
                        margin="normal"
                        disabled={!cloud.paused}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={(cloud as any).password}
                        onChange={handleInputChange}
                        margin="normal"
                        disabled={!cloud.paused}
                    />
                </FormGroup>
                
            </CardContent>
            <CardActions>
                <Grow in={hasUnsavedChanges}>
                    <Button
                        variant="contained"
                        color="primary" 
                        startIcon={<SaveIcon />}
                        onClick={handleSaveClick}
                    >
                        Save
                    </Button>
                </Grow>
            </CardActions>
        </Card>
    );
}
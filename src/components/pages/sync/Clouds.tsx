import React, { useState, MouseEvent, Fragment } from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ontologies from "../../../ontologies.json";
import ontologiesSprite from "../../../img/ontologies.svg";
import _wazigateLogo from "../../../img/wazigate.svg"
import SVGSpriteIcon from "../../SVGSpriteIcon";
import { Device, Cloud } from "waziup";
import clsx from "clsx";

const wazigateLogo = `dist/${_wazigateLogo}`;

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
    Grow,
    Icon,
    CircularProgress,
    LinearProgress
} from '@material-ui/core';

type Props = {
    cloud: Cloud;
    className?: string;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: 400,
        maxWidth: "calc(100% - 32px)",
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
    logo: {
        display: "inline-flex",
        height: "2rem",
        marginRight: 16,
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
    wrapper: {
        position: "relative",
    },
    progress: {
        color: "#4caf50",
        display: "inline",
    }
}));


export const CloudComp = ({ cloud, className }: Props) => {
    const classes = useStyles();

    var [cloud, setCloud] = useState(cloud);

    const [hasUnsavedChanges, sethasUnsavedChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleRenameClick = () => {
        const newCloudName = prompt("New cloud name:", cloud.id);
        if (newCloudName) {
            setCloud(cloud => ({
                ...cloud,
                name: newCloudName,
            }));
        }
        // TODO: Implement name save at wazigate-edge
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
        if (hasUnsavedChanges) {
            alert("Save all changes before activating the synchronization!");
            return
        }
        const enabled = event.target.checked;
        setCloud(cloud => ({
            ...cloud,
            paused: !enabled
        }));
        setSaving(true);
        const timer = new Promise(resolve => setTimeout(resolve, 2000));
        wazigate.setCloudPaused(cloud.id, !enabled).then(() => {
            timer.then(() => {
                setSaving(false);
            })
        }, (err: Error) => {
            setSaving(false);
            setCloud(cloud => ({
                ...cloud,
                paused: enabled
            }));
            if(enabled) {
                alert("There was an error activating the sync:\n" + err);
            } else {
                alert("There was an error saving the changes:\n" + err);
            }
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setCloud(cloud => ({
            ...cloud,
            [name]: value,
        }));
        sethasUnsavedChanges(true);
    };

    const handleSaveClick = () => {
        Promise.all([
            wazigate.set(`clouds/${cloud.id}/rest`, cloud.rest),
            wazigate.set(`clouds/${cloud.id}/mqtt`, cloud.mqtt),
            wazigate.setCloudCredentials(cloud.id, cloud.username, cloud.token),
        ]).then(() => {
            sethasUnsavedChanges(false);
        }, (err: Error) => {
            alert("There was an error saving the changes:\n" + err);
        });
    }

    return (
        <Card className={clsx(classes.root, className)}>
            <Grow in={saving}>
                <LinearProgress />
            </Grow>
            <List dense={true}>
                <ListItem>
                    <img className={classes.logo} src={wazigateLogo} />
                    <ListItemText
                        primary={cloud.name || cloud.id}
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
                <MenuItem onClick={handleRenameClick}>
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
                    <div className={classes.wrapper}>
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

                        
                    </div>
                    <TextField
                        required
                        label="REST Address"
                        name="rest"
                        value={cloud.rest}
                        onChange={handleInputChange}
                        margin="normal"
                        disabled={!cloud.paused || saving}
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
                        disabled={!cloud.paused || saving}
                    />
                    <TextField
                        label="Username"
                        name="username"
                        value={cloud.username}
                        onChange={handleInputChange}
                        margin="normal"
                        disabled={!cloud.paused || saving}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="token"
                        value={cloud.token}
                        onChange={handleInputChange}
                        margin="normal"
                        disabled={!cloud.paused || saving}
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
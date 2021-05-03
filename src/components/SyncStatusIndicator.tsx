import React, { Fragment, useEffect, useState, MouseEvent } from "react";
import { CloudStatus, CloudAction, Cloud } from "waziup";

import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import CloudIcon from '@material-ui/icons/CloudOutlined';
import { IconButton, Menu, makeStyles, Badge, Tooltip, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";

import _wazigateLogo from "../img/wazigate.svg"
const wazigateLogo = `dist/${_wazigateLogo}`;

type Props = {
    deviceID: string;
    sensorID: string;
    doNotSync: boolean;
    clouds: Cloud[];
}

type EntityStatus = {
    action: CloudAction[];
    remote: Date;
    sleep: number;
    wakeup: Date;
}

const useStyles = makeStyles(() => ({
    done: {
        color: "#186dbf",
    },
    allDone: {
        color: "#186dbf",
    },
    pending: {
        color: "#dca708",
    },
    error: {
        color: "red",
    },
    menu: {
        // padding: "8px 16px",
        background: "#bfe0ff",
    },
    menuList: {
        padding: 0
    },
    menuIcon: {
        fontSize: "2rem",
        color: "inherit",
        float: "left",
    },
    menuText: {
        margin: 8,
        marginLeft: 44,
        whiteSpace: "pre-line",
        minHeight: 48,
        minWidth: 240,
    },
    cloudIcon: {
        width: "32px",
        height: "32px",
    }
}));

type CloudStatProps = {
    cloud: Cloud;
    status: EntityStatus;
}

const useCloudStatStyles = makeStyles(() => ({
    icon: {
        width: "32px",
        height: "32px",
    }
}));

const Second = 1e9; // Microseconds
const SmallSyncInterval = 5 * 60 * Second; // 5min

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function Clock({ value }: { value: Date }) {
    const now = new Date();
    if (sameDay(now, value)) {
        return <span>{value.toLocaleTimeString()}</span>;
    }
    return <span>{value.toLocaleString()}</span>;
}

function Countdown({ value }: { value: Date }) {
    const [_, setNow] = useState(new Date());
    useEffect(() => {
        const updateNow = () => setNow(new Date());
        const interval = setInterval(updateNow, 1000);
        return () => clearInterval(interval);
    }, [])
    const d = ((value as any as number) - (new Date() as any as number)) / 1000;
    if (d < 0) return <span>a few seconds</span>
    if (d < 60) return <span>{Math.floor(d)}s</span>
    if (d < 60 * 60) return <span>{Math.floor(d / 60)}m {Math.floor(d % 60)}s</span>
    if (d < 60 * 60 * 24) return <span>{Math.floor(d / 60 / 60)}h {Math.floor((d / 60) % 60)}m</span>
    return <span>{Math.floor(d / 60 / 60 / 24)}d {Math.floor((d / 60 / 60) % 24)}h</span>
}

function CloudStat(props: CloudStatProps) {
    const { cloud, status } = props;
    const classes = useCloudStatStyles();

    var badgeContent: React.ReactNode;
    var secondary: React.ReactNode;
    if (status === null) {
        badgeContent = <DoneAllIcon />;
        secondary = (
            <div>
                The sensor is synchronized with the cloud.<br />
                All values are uploaded. Yes! 😃
            </div>
        )
    } else if (status.action.includes("error")) {
        badgeContent = <ErrorIcon />
        // TODO: add custom error message
        secondary = (
            <div>
                Oh no!
            </div>
        )

    } else {
        badgeContent = <DoneIcon />
        // TODO: add "Sync Now" button
        secondary = (
            <div>
                {status.sleep > SmallSyncInterval ? (
                    <div>Values will be buffered until <Clock value={new Date(status.wakeup)} />.</div>
                ) : (
                    <div>Values will be buffered until the next synchronization.</div>
                )}
                <div>Next sync in <Countdown value={new Date(status.wakeup)} /> ⌛</div>
            </div>
        )
    }

    return (
        <ListItem key={cloud.id}>
            <ListItemAvatar>
                <Badge badgeContent={badgeContent} >
                    <img className={classes.icon} src={wazigateLogo} />
                </Badge>
            </ListItemAvatar>
            <ListItemText primary={cloud.name || cloud.id} secondary={secondary} />
        </ListItem>
    );
}


export default function SyncStatusIndicator(props: Props) {
    const { deviceID, sensorID, doNotSync, clouds } = props;
    const classes = useStyles();

    const [status, setStatus] = useState(clouds ? clouds
        .map(cloud => cloud.id)
        .reduce((status, id) => {
            status[id] = null;
            return status;
        }, {} as { [id: string]: EntityStatus }) : null);

    useEffect(() => {
        const cb = (cs: CloudStatus, topic: string) => {
            const id = topic.split("/")[1];
            if (cs.entity.device === deviceID && cs.entity.sensor == sensorID) {
                var s = cs.status;
                setStatus({
                    ...status,
                    [id]: s,
                });
            }
        };
        wazigate.subscribe<CloudStatus>("clouds/+/status", cb);

        if (clouds) {
            for (let cloud of clouds) {
                wazigate.getCloudStatus(cloud.id).then((css) => {
                    for (const cs of css) {
                        if (cs.entity.device === deviceID && cs.entity.sensor == sensorID) {
                            setStatus({
                                ...status,
                                [cloud.id]: cs.status,
                            });
                            break
                        }
                    }
                })
            }
        }
        return () => {
            wazigate.unsubscribe("clouds/+/status", cb);
        }
    }, []);

    const [menuAnchor, setSyncMenuAnchor] = useState(null);
    const handleMenuClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setSyncMenuAnchor(event.currentTarget);
    };
    const handleMenuClose = () => {
        setSyncMenuAnchor(null);
    };
    const handleMenuMouseDown = (event: MouseEvent) => {
        event.stopPropagation();
    };

    const [tooltipOpen, setTooltipOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setTooltipOpen(false);
    };

    const allCloudsPaused = !clouds?.find(cloud => cloud.paused != true);

    const disabled = allCloudsPaused || doNotSync;

    const handleTooltipOpen = () => {
        if (disabled) setTooltipOpen(true);
    };

    var icon: React.ReactNode;
    var content: React.ReactNode;
    if (disabled) {
        icon = null;
        content = null;
    } else {
        content = clouds.map(cloud => <CloudStat key={cloud.id} cloud={cloud} status={status[cloud.id]} />)

        if (!!Object.values(status).find(s => s?.action.includes("error"))) {
            icon = <ErrorIcon fontSize="small" className={classes.error} />
        } if (!Object.values(status).find(s => s?.action !== null)) {
            icon = <DoneAllIcon fontSize="small" className={classes.allDone} />
        } else {
            icon = <DoneIcon fontSize="small" className={classes.done} />
        }
    }

    var tooltipText: React.ReactNode = null;
    if (allCloudsPaused) {
        tooltipText = (
            <Fragment>
                There is no cloud activated.<br />
                Go to "🗘 Sync" an enable at least one cloud.
            </Fragment>
        )
    } else if (doNotSync) {
        tooltipText = "Sync is disabled for this sensor.";
    }

    return (
        <Fragment>
            <Badge
                overlap="circle"
                badgeContent={icon}
            >
                <Tooltip
                    title={tooltipText}
                    open={tooltipOpen}
                    onClose={handleTooltipClose}
                    onOpen={handleTooltipOpen}
                >
                    <span> { /* to make the tooltip work */}
                        <IconButton
                            aria-label="syn"
                            aria-controls="sync-menu"
                            aria-haspopup="true"
                            disabled={disabled}
                            onClick={handleMenuClick}
                            onMouseDown={handleMenuMouseDown}
                        >
                            <CloudIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Badge>
            <Menu
                id="sync-menu"
                anchorEl={menuAnchor}
                keepMounted
                open={!!menuAnchor}
                onClose={handleMenuClose}
                classes={{ paper: classes.menu, list: classes.menuList }}
            >
                {content}
            </Menu>
        </Fragment>
    )
}
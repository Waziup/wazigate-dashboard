import { Badge, IconButton, makeStyles, createStyles, Theme, Menu, Typography, Button, CircularProgress } from "@material-ui/core";
import React, { useEffect, useState, Fragment } from "react";

import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        normal: {
            color: "inherit",
        },
        error: {
            color: "orange",
        },
        root: { // badge root
        },
        menuIcon: {
            fontSize: "2rem",
            color: "inherit",
        },
        menuText: {
            margin: 8,
            marginLeft: 60,
            whiteSpace: "pre-line",
            minHeight: 48,
            minWidth: 240,
        },
        menu: {
            background: "#34425a",
            color: "#dee1e4",
            width: 400,
        },
        menuError: {
            background: "#f35e19",
            color: "#1f0c03",
            width: 400,
        },
        button: {
            marginLeft: 52,
        },
        wrapper: {
            margin: 14,
            float: "left",
            position: 'relative',
        },
        progress: {
            color: "#583d36",
            position: "absolute",
            top: -7,
            left: -7,
            zIndex: 1,
        }
    })
);

export function MQTTIndicator() {
    const classes = useStyles();

    const [err, setErr] = useState(null as Error)
    const [menuAnchor, setMenuAchor] = React.useState<HTMLElement>(null);

    const handleMQTTErr = (err: Error) => {
        setErr(err);
    }

    const handleMQTTReconnect = () => {}

    const handleMQTTConnect = () =>  {
        setErr(null);
    }

    const handleMQTTClose = () => {
        setErr(new Error("The remote unexpectedly closed the connection."));
    }

    const [reconnectDisabled, setReconnectDisabled] = useState(false);

    const doReconnect = () => {
        setReconnectDisabled(true);
        wazigate.reconnectMQTT();
        setTimeout(() => setReconnectDisabled(false), 2000);
    }

    useEffect(() => {
        wazigate.on("error", handleMQTTErr);
        wazigate.on("reconnect", handleMQTTReconnect);
        wazigate.on("connect", handleMQTTConnect);
        wazigate.on("close", handleMQTTClose);
        return () => {
            wazigate.off("error", handleMQTTErr);
            wazigate.off("reconnect", handleMQTTReconnect);
            wazigate.off("connect", handleMQTTConnect);
            wazigate.off("close", handleMQTTClose);
        }
    });

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAchor(null);
    };

    return (
        <Fragment>
            <IconButton
                aria-label="link"
                aria-controls="mqtt-indicator-menu"
                aria-haspopup="true"
                className={err ? classes.error : classes.normal}
                onClick={handleMenuOpen}
            >
                {err ? <LinkOffIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
            </IconButton>
            <Menu
                id="mqtt-indicator-menu"
                anchorEl={menuAnchor}
                keepMounted
                classes={err ? { paper: classes.menuError } : { paper: classes.menu }}
                open={!!menuAnchor}
                onClose={handleMenuClose}
            >
                <div className={classes.wrapper}>
                    {err ? <LinkOffIcon className={classes.menuIcon} /> : <LinkIcon className={classes.menuIcon} />}
                    {reconnectDisabled && <CircularProgress size={46} className={classes.progress} />}
                </div>
                <Typography className={classes.menuText} variant="body1" gutterBottom>
                    { reconnectDisabled ? "Reconnecting...\nPlease wait..." : 
                        (err ? `${err}` : "Your Dashboard is connected with the WaziGate via a MQTT connection.")
                    }
                </Typography>
                {err ? <Button className={classes.button} onClick={doReconnect} disabled={reconnectDisabled}>Reconnect Now</Button> : null}
            </Menu>
        </Fragment>
    )
}
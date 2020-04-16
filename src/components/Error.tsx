import React from "react";
import { Typography, makeStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
    body: {
        padding: theme.spacing(3),
        backgroundColor: "#ffb294",
        position: "relative",
        zIndex: 1,
    },
    title: {
        fontSize: "36px",
    },
    backgroundIcon: {
        position: "absolute",
        top: "22px",
        right: "18px",
        color: "#c7917c",
        width: "90px",
        height: "90px",
        zIndex: -1,
    },
}));

interface ErrorProps {
    error: any;
}

export default function Error(props: ErrorProps) {
    const classes = useStyles();

    var msg = `${props.error}`;
    var match = msg.match(/^.+?\n/);
    if (match) {
        var title = match[0];
        var text = msg.slice(title.length);
    } else {
        var title = "Error";
        var text = msg;
    }

    return (
        <div className={classes.body}>
            <Typography variant="h2" gutterBottom className={classes.title}>{ title }</Typography>
            <Typography variant="body1" gutterBottom>{ text }</Typography>
            <ErrorIcon className={classes.backgroundIcon} />
        </div>
    );
}
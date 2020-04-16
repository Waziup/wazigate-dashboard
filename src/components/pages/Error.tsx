import React from "react";
import MenuIcon from '@material-ui/icons/Menu';
import Error from "../Error"

import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    makeStyles
} from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: "64px",
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      background: "#f1f1f1",
      color: "unset",
      boxShadow: "0 0 2px #f1f1f1",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    appBarInner: {
        padding: "0",
    },
    heading: {
        // fontWeight: "lighter",
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));

type Props = {
    handleDrawerToggle: () => void;
    error: any;
};

export default function ErrorPage({error, handleDrawerToggle}: Props) {
    const classes = useStyles();

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
                    <Typography variant="h6" noWrap className={classes.heading}>
                        Error
                    </Typography>
                </Toolbar>
            </AppBar>
            <Error error={error} />
        </div>
    );
}
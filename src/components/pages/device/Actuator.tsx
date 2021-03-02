import React from "react";
import ontologies from "../../../ontologies.json";
import ontologiesSprite from "../../../img/ontologies.svg";
import SVGSpriteIcon from "../../SVGSpriteIcon";
import { Actuator } from "waziup";
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
    actuator: Actuator;
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

const defaultKindIcon = "crane";

export default function Actuator({ deviceID, actuator, className }: Props) {
    const classes = useStyles();

    const kind = (actuator.meta.kind || "") as string;
    const quantity = (actuator.meta.quantity || "") as string;
    const unit = (actuator.meta.unit || "") as string;

    const icon = ontologies.actingDevices[kind]?.icon || defaultKindIcon;
    const kindLabel = ontologies.actingDevices[kind]?.label || kind;

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setExpanded(!expanded);
    };

    return (
        <Card className={`${classes.root} ${className || ""}`}>
            <List dense={true}>
                <ListItem component="a" button href={`#/devices/${deviceID}/actuators/${actuator.id}`}>
                    <ListItemIcon>
                        <SVGSpriteIcon
                            className={classes.icon}
                            src={`dist/${ontologiesSprite}#${icon}`}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={actuator.name}
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
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    Value: {actuator.value === null ? "-" : `${actuator.value} ${unit}`}<br></br>
                    Quantity: {actuator.meta.quantity || "-"}<br></br>
                    Unit: {actuator.meta.unit || "-"}
                </CardContent>
            </Collapse>
        </Card>
    );
}
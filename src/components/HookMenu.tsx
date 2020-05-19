import React, { Fragment, useState, useEffect } from "react"
import { MenuHook } from "waziup";
import { ListItem, ListItemIcon, ListItemText, Collapse, List, makeStyles, Theme, createStyles } from "@material-ui/core";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

type Props = {
    hook: string;
    on: RegExp;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuIcon: {
            width: "1em",
            height: "1em",
            fontSize: "1.5rem",
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        a: {
            "&:hover": {
                color: "unset !important",
            },
        },
        drawerIcon: {
            color: "rgba(255, 255, 255, 0.84)",
        }
    })
);

export default function HookMenu({ hook, on, ...props }: Props) {
    const classes = useStyles();

    const [openMenues, setOpenMenues] = useState(new Set<string>());
    const handleMenuItemClick = (id: string) => {
        setOpenMenues((openMenues) => {
            if (!openMenues.has(id)) {
                openMenues.add(id);
                return new Set(openMenues);
            }
            return openMenues;
        });
    };

    const handleMenuOpenerClick = (id: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenMenues((openMenues) => {
            openMenues.add(id);
            return new Set(openMenues);
        });
    };

    const handleMenuCloserClick = (id: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenMenues((openMenues) => {
            openMenues.delete(id);
            return new Set(openMenues);
        });
    };

    const menuItem = (id: string, item: MenuHook) => {
        const open = openMenues.has(id);
        const subItems = hooks.getAtPrio(id);
        const icon = item.icon || (
            <img src="img/default-icon.svg" className={classes.menuIcon} />
        );
        return (
            <Fragment key={id}>
                <ListItem
                    component="a"
                    button
                    key={id}
                    href={item.href}
                    onClick={
                        subItems.length !== 0 ? handleMenuItemClick.bind(null, id) : null
                    }
                    className={`${classes.a} ${
                        hooks.depth(id) >= 2 ? classes.nested : ""
                        }`}
                >
                    <ListItemIcon className={classes.drawerIcon}>{icon}</ListItemIcon>
                    <ListItemText primary={item.primary} />
                    {subItems.length !== 0 ? (
                        open ? (
                            <ExpandLess onClick={handleMenuCloserClick.bind(null, id)} />
                        ) : (
                                <ExpandMore onClick={handleMenuOpenerClick.bind(null, id)} />
                            )
                    ) : null}
                </ListItem>
                {subItems.length != 0 ? (
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {subItems.map(([id, item]) => menuItem(id, item))}
                        </List>
                    </Collapse>
                ) : null}
            </Fragment>
        );
    };

    const [n, setN] = useState(0);

    useEffect(() => {
        const cb = () => setN((n) => n+1);
        hooks.on(on, cb);
        return () => hooks.off(on, cb);
    }, []);

    return (
        <List {...props}>
            { hooks.getAtPrio(hook).map(([id, item]) => menuItem(id, item)) }
        </List>
    );
}
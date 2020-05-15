import React, { Fragment } from "react";
import { InputAdornment, makeStyles, TextField } from "@material-ui/core";
import SVGSpriteIcon from "./SVGSpriteIcon";

import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete/Autocomplete";
import ontologies from "../ontologies.json";
import ontologiesSprite from "../img/ontologies.svg";

type Props = {
    value: string;
    onChange: (event: any, newValue: string) => void;
}

const defaultKindIcon = "meter";

type Kind = string;

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            width: "340px",
        },
        width: "calc(100% - 18px)",
        verticalAlign: "top",
        display: "inline-block",
        margin: theme.spacing(1),
    },
    input: {
        paddingTop: "6px !important",
        paddingBottom: "6px !important",
    },
    kindIcon: {
        width: "1.5em",
        height: "1.5em",
        marginLeft: ".5em",
    },
    icon: {
        width: "24px",
        height: "24px",
        marginRight: "10px",
    }
}));

const filter = createFilterOptions<Kind>();

export function OntologyKindInput(props: Props) {
    const classes = useStyles();
    const {value, onChange} = props;
    const ontology = ontologies.sensingDevices;

    return (
        <Autocomplete
                value={value}
                className={classes.root}
                id="kind-select"
                options={Object.keys(ontology) as Kind[]}
                onChange={(event: any, newValue: Kind) => {
                    if (typeof newValue === "string") {
                        onChange(event, newValue);
                    } else {
                        onChange(event, "");
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params) as Kind[];
                    if (params.inputValue !== '') {
                        filtered.push(params.inputValue);
                    }
                    return filtered;
                }}
                getOptionLabel={(kind: Kind) => {
                    if (typeof kind === "string") {
                        if (kind in ontologies.sensingDevices) {
                            return ontologies.sensingDevices[kind].label;
                        }
                        return kind;
                    }
                    return "";
                }}
                renderOption={(kind: Kind) => {
                    var icon: string;
                    var label: string;
                    if (typeof kind === "string") {
                        if (kind in ontologies.sensingDevices) {
                            icon = ontologies.sensingDevices[kind].icon;
                            label = ontologies.sensingDevices[kind].label;
                        } else {
                            icon = defaultKindIcon;
                            label = `Use \"${kind}\"`;
                        }
                    } else {
                        icon = defaultKindIcon;
                        label = "null value option";
                    }
                    return (
                        <Fragment>
                            <SVGSpriteIcon
                                className={classes.icon}
                                src={`dist/${ontologiesSprite}#${icon}`}
                            />
                            {label}
                        </Fragment>
                    );
                }}
                // filterSelectedOptions
                freeSolo
                renderInput={(params) => {
                    var icon: string;
                    var label: string;
                    if (value in ontologies.sensingDevices) {
                        icon = ontologies.sensingDevices[value].icon;
                        label = ontologies.sensingDevices[value].label;
                    } else {
                        icon = defaultKindIcon;
                        label = value;
                    }
                    params.InputProps.startAdornment = (
                        <Fragment>
                            {params.InputProps.startAdornment || null}
                            <InputAdornment position="start">
                                <SVGSpriteIcon
                                    className={classes.kindIcon}
                                    src={`dist/${ontologiesSprite}#${icon}`}
                                />
                            </InputAdornment>
                        </Fragment>
                    );
                    (params.inputProps as any)["className"] = `${(params.inputProps as any)["className"]} ${classes.input}`;
                    return (
                        <Fragment>
                            <TextField
                                {...params}
                                label="Sensor Kind"
                                placeholder="no sensor kind"
                            />
                        </Fragment>
                    )
                }}
            />
    )
}
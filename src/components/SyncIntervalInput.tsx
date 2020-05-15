import { Typography, Slider, makeStyles, Theme, createStyles, IconButton } from "@material-ui/core";
import React from "react";
import HelpIcon from '@material-ui/icons/HelpOutline';

type Props = {
    value: string;
    onChange: (event: React.ChangeEvent<{}>, value: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
            width: 600,
            maxWidth: "100%",
        },
        title: {
            lineHeight: "31px",
        },
        slider: {
        },
        helpBtn: {
            marginLeft: theme.spacing(2),
            verticalAlign: "top",
        }
    }),
);

const labels = ["0s", "5s", "10s", "20s", "30s", "1m", "2m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "12h", "1D", "2D", "10D"];
const marks = ["instant", "", "", "20s", "", "1m", "", "5m", "", "15m", "", "1h", "", "4h", "", "1D", "", "10D"];


function valuetext(value: number) {
    return labels[value];
}

function valueLabelFormat(value: number) {
    return labels[value];
}

export default function SyncIntervalInput(props: Props) {
    const { value, onChange } = props;

    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
        onChange(event, labels[newValue as number]);
    }

    return (
        <div className={classes.root}>
            <Typography id="sync-interval-input" gutterBottom className={classes.title}>
                Sync Interval
                <IconButton
                    aria-label="help"
                    className={classes.helpBtn}
                    size="small"
                    component="a"
                    target="_blank"
                    href="https://www.waziup.io/documentation/wazigate/#sync-interval"
                >
                    <HelpIcon />
                </IconButton>
            </Typography>
            <Slider
                className={classes.slider}
                defaultValue={4}
                valueLabelFormat={valueLabelFormat}
                getAriaValueText={valuetext}
                value={labels.indexOf(value)}
                aria-labelledby="sync-interval-input"
                step={null}
                max={marks.length - 1}
                onChange={handleChange}
                valueLabelDisplay="auto"
                marks={marks.map((label, value) => ({ value, label }))}
            />
        </div>
    );
}
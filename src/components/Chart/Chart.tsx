import React, { Component } from 'react';
import Chart from "react-apexcharts";

import { ApexOptions } from 'apexcharts';

import {
    makeStyles,
} from '@material-ui/core';
import { ValueWithTime } from 'waziup';
import { dateFormatter } from '../../tools';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '90%',
        align: 'center',
        margin: '0 auto',
        maxWidth: '1000px'
        // display: "inline-block",
        // verticalAlign: "top",
    }
}));


export type TimeSeriesDataType = ValueWithTime;

type Props = {
    // handleDrawerToggle: () => void;
    title?: string;
    height?: number;
    width?: number;
    className?: string;
    data?: DataPoint[];
};

type DataPoint = {
    x: Date;
    y: number;
};

function validPoint(p: DataPoint) {
    return  typeof p.y === "boolean" ||  typeof p.y === "number";
}

function displayPoint(p: DataPoint): DataPoint {
    switch(typeof p.y) {
        case "number":
            return p;
        case "boolean":
            return {
                x: p.x,
                y: p.y ? 1 : 0
            }
        default:
            // unreached
            throw "no a supported value";
    }
}

function checkValidValues(points: DataPoint[]) {
    return points.filter(validPoint).map(displayPoint);
}


export default function _Chart(props: Props) {

    const classes = useStyles();

    const options: ApexOptions = {
        chart: {
            id: "chart1"
        },
        title: {
            text: props.title,
            align: 'left'
        },
        xaxis: {
            type: 'datetime',
        },
        tooltip: {
            shared: false,
            x: {
                formatter: dateFormatter as any
            }
        },
        colors: ['#3F51B5'] //Johann fragen #3F51B5 
    };
    const series = [{
        name: "",
        data: checkValidValues(props.data)
    }];

    return (
        <div className={classes.root}>
            <Chart
                className="chart" //{props.className}
                options={options}
                series={series}
                type="line"
                align='center'
            />
        </div>
    );
}
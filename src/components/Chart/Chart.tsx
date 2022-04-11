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

function numbersOnly(point: DataPoint) {
    //console.log (value);  // it will show all the values.

    if (typeof point.y === 'number') {
        return true;
    }
    return false;
}

function isBool(p: DataPoint) {
    return typeof p.y === "boolean"; 
}

function boolTo01(p: DataPoint) {
    return {
        x: p.x,
        y: p.y ? 1 : 0
    }
}

function checkValidValues(points: DataPoint[]) {
    var newPoints; 
    newPoints = points.filter(isBool).map(boolTo01);
    //newPoints = points.filter(numbersOnly);

    return newPoints;
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

    // if (!checkValidValues(props.data)) {
    //     return null;
    // }

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
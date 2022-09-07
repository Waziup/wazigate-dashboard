import React, { Component } from 'react';
import Chart from "react-apexcharts";

import { ApexOptions } from 'apexcharts';

import {
    makeStyles,
} from '@material-ui/core';
import { ValueWithTime } from 'waziup';
import { dateFormatter, formatValue, dateFormatterOnlyDate } from '../../tools';

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
    quantity?: string,
};

type DataPoint = {
    x: Date;
    y: number;
};

function validPoint(p: DataPoint) {
    return typeof p.y === "boolean" || typeof p.y === "number";
}

function displayPoint(p: DataPoint): DataPoint {
    switch (typeof p.y) {
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
            id: "chart1",
            toolbar: {
                export: {
                    csv: {
                        dateFormatter(timestamp): string {  
                            return new Date(timestamp).toISOString()
                        }
                    }
                }
            }
        },
        title: {
            text: props.title,
            align: 'left'
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: dateFormatterOnlyDate as any
            }
        },
        tooltip: {
            shared: false,
            x: {
                formatter: dateFormatter as any
            },
            y: {
                formatter: (val: number, opts?: any): string => {
                    // const p = props.data[opts.dataPointIndex];
                    return formatValue(val, props.quantity)
                }
            }
        },
        colors: ['#3F51B5'], //Johann fragen #3F51B5 
        stroke: {
            curve: props.quantity == 'Boolean' ? 'stepline' : 'straight'
        },
    };
    const series = [{
        name: "",
        data: checkValidValues(props.data)
    }];

    return (
        <div className={`${classes.root}`}>
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
import React, { Component } from 'react';
import Chart from "react-apexcharts";

import { ApexOptions } from 'apexcharts';

import {
    makeStyles,
} from '@material-ui/core';
import { ValueWithTime } from 'waziup';
import { dateFormatter, formatValue} from '../../tools';
import { csv } from 'd3';

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


export default function _Chart(props: Props) {

    const classes = useStyles();

    const options: ApexOptions = {
        chart: {
            id: "chart1",
            toolbar: {
                export: {
                    csv: {
                        dateFormatter(timestamp) {
                            return new Date(timestamp)
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
            curve: props.quantity=='Boolean' ? 'stepline' : 'straight'
          },
    };
    const series = [{
        name: "",
        data: props.data
    }];

    return (
        <div>
            <div>
                <div className={`${classes.root}`}>
                    <Chart
                        className="chart" //{props.className}
                        options={options}
                        series={series}
                        type="line"
                        align='center'
                    />
                </div>
            </div>
        </div>
    );

}
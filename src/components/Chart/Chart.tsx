import React, { Component } from 'react';
import Chart from "react-apexcharts";


import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { ApexOptions } from 'apexcharts';

import {
    makeStyles,
    colors,
} from '@material-ui/core';
import { ValueWithTime } from 'waziup';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '90%',
        align: 'center',
        margin: '0 auto'
        // display: "inline-block",
        // verticalAlign: "top",
    }
}));

TimeAgo.addDefaultLocale(en)

export type TimeSeriesDataType = ValueWithTime;

type Props = {
    // handleDrawerToggle: () => void;
    title?: string;
    height?: number;
    width?: number;
    className?: string;
    data?: TimeSeriesDataType[];
};


export default function _Chart(props: Props) {
    const timeAgo = new TimeAgo('en-US')

    const classes = useStyles();

    // Preparing data
    let chartData = [];
    for (let item of props.data) {
        chartData.push({ x: new Date(item.time), y: item.value });
        //console.log(timeAgo.format(new Date(item.time)), new Date(item.time));
    }

    /**---------------- */

    const dateFormatter = (inDate: Date) => {
        const addZero = (n: number) => (n <= 9 ? ("0" + n) : String(n));
        const dateObj = new Date(inDate);
        return timeAgo.format(inDate)
            + " - " + dateObj.getFullYear()
            + "-" + addZero(dateObj.getMonth() + 1)
            + "-" + addZero(dateObj.getDate())
            + " " + addZero(dateObj.getHours())
            + ":" + addZero(dateObj.getMinutes())
            + ":" + addZero(dateObj.getSeconds())
    }

    /**---------------- */

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
                formatter: (val: any) => dateFormatter(val)
            }
        },
        colors: ['#3F51B5'] //Johann fragen #3F51B5 
    };
    const series = [{
        name: "",
        data: chartData
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
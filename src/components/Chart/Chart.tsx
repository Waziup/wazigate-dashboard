import React, { Component } from 'react';
import Chart from "react-apexcharts";


import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)



type TimeSeriesDataType = {
    time: string;
    value: number;
};

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

    // Preparing data
    let chartData = [];
    for (let item of props.data) {
        chartData.push({ x: new Date(item.time), y: item.value });
        // console.log(timeAgo.format(new Date(item.time)), new Date(item.time));
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

    const options = {
        chart: {
            id: "chart1",
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
        }
    };
    const series = [{
        name: "",
        data: chartData
    }];

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart

                        className={props.className}
                        options={options}
                        series={series}
                        type="line"
                        width={props.width || "100%"}
                    />
                </div>
            </div>
        </div>
    );

}
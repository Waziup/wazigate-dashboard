import * as React from "react";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

export function field(label: string, content: JSX.Element) {
    return (
        <div className="details-field">
            <div className="details-name">{label}</div>
            <div className="details-value">{content}</div>
        </div>
    );
}

export function fieldML(label: string, content: JSX.Element) {
    return (
        <div className="details-field">
            <div className="details-name">{label}</div>
            {content}
        </div>
    );
}

TimeAgo.addDefaultLocale(en)
export const timeAgo = new TimeAgo('en-US');

export function dateFormatter(date: Date) {
    const addZero = (n: number) => (n <= 9 ? ("0" + n) : String(n));
    const dateObj = new Date(date);
    return timeAgo.format(date)
        + " - " + dateObj.getFullYear()
        + "-" + addZero(dateObj.getMonth() + 1)
        + "-" + addZero(dateObj.getDate())
        + " " + addZero(dateObj.getHours())
        + ":" + addZero(dateObj.getMinutes())
        + ":" + addZero(dateObj.getSeconds())
    }


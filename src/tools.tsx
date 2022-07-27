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

export function dateFormatterOnlyDate(date: Date) {
  const addZero = (n: number) => (n <= 9 ? ("0" + n) : String(n));
  const dateObj = new Date(date);
  return dateObj.getFullYear()
    + "-" + addZero(dateObj.getMonth() + 1)
    + "-" + addZero(dateObj.getDate())
    + " " + addZero(dateObj.getHours())
    + ":" + addZero(dateObj.getMinutes())
    + ":" + addZero(dateObj.getSeconds())

}

export function time_ago(time: any) {

  if (!time || time === null || time === '') //should be all the same
    return "";

  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date)
        time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

export function formatValue(value: any, quantity?: string): string {
  switch (quantity) {
    case "AirTemperature":
    case "BoardTemperature":
    case "BodyTemperature":
    case "BuildingTemperature":
    case "DewPointTemperature":
    case "FoodTemperature":
    case "HouseholdApplianceTemperature":
    case "RoadTemperature":
    case "RoomTemperature":
    case "SoilTemperature":
    case "Temperature":
    case "TemperatureEngine":
    case "TemperatureWasteContainer":
    case "WaterTemperature":
      return `${Math.round(value * 100) / 100}`;
    case "AirHumidity":
    case "Humidity":
    case "RelativeHumidity":
    case "RelativeHumidity":
      return `${Math.round(value * 1000) / 1000}`;
    case "Boolean":
      return value ? "ON" : "OFF"
    default:
      return `${value}`;
  }
}

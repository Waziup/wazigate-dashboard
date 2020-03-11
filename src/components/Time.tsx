import * as React from "react";

type Props = {
    time: Date;
}

export class TimeComp extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        var t = this.props.time.getTime();
        var n = new Date().getTime();
        var d = n-t;
        var title = this.props.time.toLocaleString();
        var text = title;
        if (d < 10000) text = "just now";
        else if (d < 60000) text = `${Math.round(d/1000)} sec ago`;
        else if (d < 3600000) text = `${Math.round(d/60000)} min ago`;
        else if (d < 86400000) text = `${Math.round(d/3600000)} hours ago`;
        return <span title={title}>{text}</span>;
    }
}